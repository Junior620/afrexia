import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Resend } from 'resend';
import * as Sentry from '@sentry/nextjs';
import { contactFormSchema } from '@/lib/forms/contact-schema';
import { ContactEmail } from '@/emails/ContactEmail';
import { ContactConfirmationEmail } from '@/emails/ContactConfirmationEmail';
import { sanitizeString, sanitizeOptionalString } from '@/lib/security';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Rate limiting configuration
 * Requirements: 20.3
 */
const RATE_LIMIT_WINDOW = 60; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;

/**
 * Verify reCAPTCHA token
 * Requirements: 14.5
 */
async function verifyRecaptcha(
  token: string,
  expectedAction: string
): Promise<boolean> {
  try {
    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      }
    );

    const data = await response.json();

    // Verify score, action, and hostname
    return (
      data.success &&
      data.score >= 0.5 &&
      data.action === expectedAction &&
      (data.hostname === process.env.NEXT_PUBLIC_SITE_DOMAIN ||
        data.hostname === 'localhost')
    );
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
}

/**
 * Check rate limit for IP address
 * Requirements: 20.3
 */
async function checkRateLimit(ip: string): Promise<boolean> {
  try {
    const key = `rate_limit:contact:${ip}`;
    const requests = await kv.incr(key);

    if (requests === 1) {
      // Set expiry on first request
      await kv.expire(key, RATE_LIMIT_WINDOW);
    }

    return requests <= RATE_LIMIT_MAX_REQUESTS;
  } catch (error) {
    // If rate limiting fails, allow the request but log the error
    Sentry.captureException(error);
    return true;
  }
}

/**
 * Get client IP address
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

/**
 * Contact Form Submission Handler
 * Requirements: 14.1, 19.2, 20.3
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request);

    // Check rate limit
    const withinRateLimit = await checkRateLimit(clientIp);
    if (!withinRateLimit) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Verify reCAPTCHA
    if (body.recaptchaToken) {
      const isValidRecaptcha = await verifyRecaptcha(
        body.recaptchaToken,
        'contact_submit'
      );

      if (!isValidRecaptcha) {
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed' },
          { status: 400 }
        );
      }
    }

    // Validate form data with Zod
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const formData = validationResult.data;

    // Sanitize text inputs
    const sanitizedData = {
      ...formData,
      name: sanitizeString(formData.name),
      company: sanitizeOptionalString(formData.company),
      subject: sanitizeString(formData.subject),
      message: sanitizeString(formData.message),
    };

    // Determine recipient email based on subject or default to contact email
    const recipientEmail = process.env.CONTACT_EMAIL || process.env.RESEND_TO_EMAIL!;

    // Send email to team
    const teamEmailResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: recipientEmail,
      replyTo: sanitizedData.email,
      subject: `Contact Form: ${sanitizedData.subject}`,
      react: ContactEmail({
        formData: sanitizedData,
        locale: body.locale || 'en',
      }),
    });

    if (teamEmailResult.error) {
      throw new Error(`Failed to send team email: ${teamEmailResult.error}`);
    }

    // Send confirmation email to customer
    const confirmationEmailResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: sanitizedData.email,
      subject:
        body.locale === 'fr'
          ? 'Confirmation de votre message - Afrexia'
          : 'Your Message Confirmation - Afrexia',
      react: ContactConfirmationEmail({
        formData: sanitizedData,
        locale: body.locale || 'en',
      }),
    });

    if (confirmationEmailResult.error) {
      // Log error but don't fail the request
      Sentry.captureException(
        new Error(
          `Failed to send confirmation email: ${confirmationEmailResult.error}`
        )
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Contact form submitted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error to Sentry
    Sentry.captureException(error);

    console.error('Contact form submission error:', error);

    return NextResponse.json(
      {
        error: 'An error occurred while processing your request',
        message:
          error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
