import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import * as Sentry from '@sentry/nextjs';
import { catalogDownloadSchema } from '@/lib/forms/catalog-download-schema';
import { sanitizeString } from '@/lib/security';
import {
  handleAPIError,
  createValidationError,
  createRateLimitError,
} from '@/lib/api/error-handler';

/**
 * Rate limiting configuration
 * Requirements: 7.3, 7.4, 7.5
 */
const RATE_LIMIT_WINDOW = 60; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3;

/**
 * Verify reCAPTCHA token
 * Requirements: 7.3
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
 * Requirements: 7.3
 */
async function checkRateLimit(ip: string): Promise<boolean> {
  try {
    const key = `rate_limit:catalog_download:${ip}`;
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
 * Store lead in KV store
 * Requirements: 7.4
 */
async function storeLead(leadData: any, leadId: string): Promise<void> {
  try {
    const key = `catalog_lead:${leadId}`;
    const data = {
      ...leadData,
      submittedAt: new Date().toISOString(),
      source: 'catalog_download',
    };

    // Store for 90 days
    await kv.set(key, JSON.stringify(data), { ex: 90 * 24 * 60 * 60 });

    // Also add to leads list for reporting
    const leadsListKey = 'catalog_leads:list';
    await kv.lpush(leadsListKey, leadId);
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
 * Track download event for analytics
 * Requirements: 7.5
 */
async function trackDownloadEvent(leadData: any): Promise<void> {
  try {
    const eventKey = `analytics:catalog_download:${Date.now()}`;
    const eventData = {
      event: 'catalog_download',
      timestamp: new Date().toISOString(),
      country: leadData.country,
      locale: leadData.locale,
      company: leadData.company,
    };

    // Store event for 30 days
    await kv.set(eventKey, JSON.stringify(eventData), { ex: 30 * 24 * 60 * 60 });

    // Increment download counter
    const counterKey = 'analytics:catalog_downloads:count';
    await kv.incr(counterKey);
  } catch (error) {
    // Log error but don't fail the request
    Sentry.captureException(error, {
      level: 'warning',
      tags: {
        errorType: 'analytics',
        eventType: 'catalog_download',
      },
    });
  }
}

/**
 * Catalog Download Handler
 * POST endpoint at /api/catalog-download
 * Requirements: 7.3, 7.4, 7.5
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
        'catalog_download'
      );

      if (!isValidRecaptcha) {
        throw createValidationError('reCAPTCHA verification failed');
      }
    }

    // Validate form data with Zod
    const validationResult = catalogDownloadSchema.safeParse(body);

    if (!validationResult.success) {
      throw createValidationError(
        'Validation failed',
        validationResult.error.errors
      );
    }

    const formData = validationResult.data;

    // Sanitize text inputs
    const sanitizedData = {
      name: sanitizeString(formData.name),
      email: formData.email.toLowerCase(),
      company: sanitizeString(formData.company),
      country: sanitizeString(formData.country),
      locale: formData.locale,
    };

    // Generate unique lead ID
    const leadId = `LEAD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Store lead in KV
    await storeLead(sanitizedData, leadId);

    // Track download event
    await trackDownloadEvent(sanitizedData);

    // In a real implementation, you would:
    // 1. Generate or retrieve the PDF catalog URL
    // 2. Optionally send a follow-up email with the download link
    // For now, we'll return a placeholder URL
    const catalogUrl = `/assets/catalogs/afrexia-product-catalog-${formData.locale}.pdf`;

    return NextResponse.json(
      {
        success: true,
        message: 'Lead captured successfully',
        downloadUrl: catalogUrl,
        leadId,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleAPIError(
      error instanceof Error ? error : new Error('Unknown error'),
      {
        endpoint: '/api/catalog-download',
        method: 'POST',
      }
    );
  }
}
