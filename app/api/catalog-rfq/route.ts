import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Resend } from 'resend';
import * as Sentry from '@sentry/nextjs';
import { catalogRFQFormSchema } from '@/lib/forms/catalog-rfq-schema';
import { CatalogRFQEmail } from '@/emails/CatalogRFQEmail';
import { CatalogRFQConfirmationEmail } from '@/emails/CatalogRFQConfirmationEmail';
import { sanitizeString, sanitizeOptionalString } from '@/lib/security';
import {
  handleAPIError,
  createValidationError,
  createRateLimitError,
  createExternalServiceError,
} from '@/lib/api/error-handler';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Rate limiting configuration
 * Requirements: 4.9
 */
const RATE_LIMIT_WINDOW = 60; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3; // Lower limit for multi-product RFQs

/**
 * Verify reCAPTCHA token
 * Requirements: 4.9
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
 * Requirements: 4.9
 */
async function checkRateLimit(ip: string): Promise<boolean> {
  try {
    const key = `rate_limit:catalog_rfq:${ip}`;
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
 * Store RFQ submission in KV store for tracking
 * Requirements: 4.9
 */
async function storeRFQSubmission(
  formData: any,
  requestId: string
): Promise<void> {
  try {
    const key = `catalog_rfq:${requestId}`;
    const data = {
      ...formData,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };

    // Store for 30 days
    await kv.set(key, JSON.stringify(data), { ex: 30 * 24 * 60 * 60 });
  } catch (error) {
    // Log error but don't fail the request
    Sentry.captureException(error, {
      level: 'warning',
      tags: {
        errorType: 'storage',
        storageType: 'kv',
      },
    });
  }
}

/**
 * Catalog RFQ Form Submission Handler
 * POST endpoint at /api/catalog-rfq
 * Requirements: 4.9
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request);

    // Check rate limit
    const withinRateLimit = await checkRateLimit(clientIp);
    if (!withinRateLimit) {
      throw createRateLimitError();
    }

    // Parse request body
    const body = await request.json();

    // Verify reCAPTCHA if token provided
    if (body.recaptchaToken) {
      const isValidRecaptcha = await verifyRecaptcha(
        body.recaptchaToken,
        'catalog_rfq_submit'
      );

      if (!isValidRecaptcha) {
        throw createValidationError('reCAPTCHA verification failed');
      }
    }

    // Validate form data with Zod
    const validationResult = catalogRFQFormSchema.safeParse(body);

    if (!validationResult.success) {
      throw createValidationError(
        'Validation failed',
        validationResult.error.errors
      );
    }

    const formData = validationResult.data;

    // Sanitize text inputs
    const sanitizedData = {
      ...formData,
      contact: {
        name: sanitizeString(formData.contact.name),
        email: formData.contact.email.toLowerCase(),
        company: sanitizeString(formData.contact.company),
        phone: sanitizeString(formData.contact.phone),
      },
      delivery: {
        location: sanitizeString(formData.delivery.location),
        incoterm: formData.delivery.incoterm,
      },
      notes: sanitizeOptionalString(formData.notes),
    };

    // Generate unique request ID
    const requestId = `RFQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Store submission in KV
    await storeRFQSubmission(sanitizedData, requestId);

    // Send email to sales team
    const salesEmailResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.SALES_EMAIL!,
      subject: `New Multi-Product RFQ: ${sanitizedData.contact.name} - ${sanitizedData.contact.company} (${sanitizedData.products.length} products)`,
      react: CatalogRFQEmail({
        formData: sanitizedData,
        locale: formData.locale || 'en',
      }),
    });

    if (salesEmailResult.error) {
      throw createExternalServiceError(
        'Resend',
        new Error(salesEmailResult.error.message)
      );
    }

    // Send confirmation email to customer
    const confirmationEmailResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: sanitizedData.contact.email,
      subject:
        formData.locale === 'fr'
          ? 'Confirmation de votre demande de devis - Afrexia'
          : formData.locale === 'es'
          ? 'Confirmación de su solicitud de cotización - Afrexia'
          : 'Your Quote Request Confirmation - Afrexia',
      react: CatalogRFQConfirmationEmail({
        formData: sanitizedData,
        locale: formData.locale || 'en',
      }),
    });

    if (confirmationEmailResult.error) {
      // Log error but don't fail the request
      Sentry.captureException(
        new Error(
          `Failed to send confirmation email: ${confirmationEmailResult.error.message}`
        ),
        {
          level: 'warning',
          tags: {
            errorType: 'email_delivery',
            emailType: 'confirmation',
          },
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'RFQ submitted successfully',
        requestId,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleAPIError(
      error instanceof Error ? error : new Error('Unknown error'),
      {
        endpoint: '/api/catalog-rfq',
        method: 'POST',
      }
    );
  }
}
