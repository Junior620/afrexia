import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Resend } from 'resend';
import * as Sentry from '@sentry/nextjs';
import { rfqFormSchema } from '@/lib/forms/rfq-schema';
import { RFQEmail } from '@/emails/RFQEmail';
import { RFQConfirmationEmail } from '@/emails/RFQConfirmationEmail';
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
 * Requirements: 3.5
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
    const key = `rate_limit:rfq:${ip}`;
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
 * RFQ Form Submission Handler
 * Requirements: 3.1, 3.2, 3.5, 19.1, 19.3, 19.4, 20.3
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
        'rfq_submit'
      );

      if (!isValidRecaptcha) {
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed' },
          { status: 400 }
        );
      }
    }

    // Validate form data with Zod
    const validationResult = rfqFormSchema.safeParse(body);

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
      firstName: sanitizeString(formData.firstName),
      lastName: sanitizeString(formData.lastName),
      company: sanitizeString(formData.company),
      country: sanitizeString(formData.country),
      destinationPort: sanitizeString(formData.destinationPort),
      message: sanitizeOptionalString(formData.message),
    };

    // Send email to sales team
    const salesEmailResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.SALES_EMAIL!,
      subject: `New RFQ: ${sanitizedData.firstName} ${sanitizedData.lastName} - ${sanitizedData.company}`,
      react: RFQEmail({
        formData: sanitizedData,
        locale: body.locale || 'en',
      }),
    });

    if (salesEmailResult.error) {
      throw new Error(`Failed to send sales email: ${salesEmailResult.error}`);
    }

    // Send confirmation email to customer
    const confirmationEmailResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: sanitizedData.email,
      subject:
        body.locale === 'fr'
          ? 'Confirmation de votre demande de devis - Afrexia'
          : 'Your Quote Request Confirmation - Afrexia',
      react: RFQConfirmationEmail({
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
        message: 'RFQ submitted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error to Sentry
    Sentry.captureException(error);

    console.error('RFQ submission error:', error);

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
