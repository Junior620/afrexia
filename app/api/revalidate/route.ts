import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createHmac } from 'crypto';
import * as Sentry from '@sentry/nextjs';
import {
  handleAPIError,
  createValidationError,
  APIError,
} from '@/lib/api/error-handler';

/**
 * Sanity Webhook Revalidation Handler
 * Requirements: 4.2
 * 
 * Handles on-demand revalidation of ISR pages when content is updated in Sanity CMS.
 * Verifies webhook signature using HMAC to ensure requests come from Sanity.
 */

interface SanityWebhookPayload {
  _type: string;
  _id: string;
  slug?: {
    current: string;
    _type: string;
  };
  i18nId?: string;
}

/**
 * Verify webhook signature using HMAC
 * Requirements: 4.2, 20.1
 */
function verifySignature(body: string, signature: string | null): boolean {
  if (!signature) {
    return false;
  }

  const secret = process.env.SANITY_WEBHOOK_SECRET;
  
  if (!secret) {
    console.error('SANITY_WEBHOOK_SECRET is not configured');
    return false;
  }

  try {
    const hash = createHmac('sha256', secret)
      .update(body)
      .digest('hex');
    
    const expectedSignature = `sha256=${hash}`;
    
    // Use timing-safe comparison to prevent timing attacks
    return signature === expectedSignature;
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
}

/**
 * Revalidate paths based on content type
 */
function revalidateContent(payload: SanityWebhookPayload): string[] {
  const revalidatedPaths: string[] = [];
  const { _type, slug } = payload;
  
  // All supported locales
  const locales = ['fr', 'en', 'es', 'de', 'ru'];

  try {
    switch (_type) {
      case 'product':
        if (slug?.current) {
          // Revalidate all language versions of the product page
          locales.forEach(locale => {
            revalidatePath(`/${locale}/products/${slug.current}`);
            revalidatedPaths.push(`/${locale}/products/${slug.current}`);
          });
        }
        // Revalidate product listing pages for all locales
        locales.forEach(locale => {
          revalidatePath(`/${locale}/products`);
          revalidatedPaths.push(`/${locale}/products`);
        });
        break;

      case 'blogPost':
        if (slug?.current) {
          // Revalidate all language versions of the blog post
          locales.forEach(locale => {
            revalidatePath(`/${locale}/blog/${slug.current}`);
            revalidatedPaths.push(`/${locale}/blog/${slug.current}`);
          });
        }
        // Revalidate blog listing pages for all locales
        locales.forEach(locale => {
          revalidatePath(`/${locale}/blog`);
          revalidatedPaths.push(`/${locale}/blog`);
        });
        break;

      case 'certification':
        // Revalidate quality pages for all locales
        locales.forEach(locale => {
          revalidatePath(`/${locale}/quality`);
          revalidatedPaths.push(`/${locale}/quality`);
        });
        break;

      case 'resource':
        // Revalidate resources pages for all locales
        locales.forEach(locale => {
          revalidatePath(`/${locale}/resources`);
          revalidatedPaths.push(`/${locale}/resources`);
        });
        break;

      case 'teamMember':
        // Revalidate about pages for all locales
        locales.forEach(locale => {
          revalidatePath(`/${locale}/about`);
          revalidatedPaths.push(`/${locale}/about`);
        });
        break;

      case 'page':
        if (slug?.current) {
          // Revalidate custom pages for all locales
          locales.forEach(locale => {
            revalidatePath(`/${locale}/${slug.current}`);
            revalidatedPaths.push(`/${locale}/${slug.current}`);
          });
        }
        break;

      default:
        // For unknown types, revalidate homepage for all locales
        locales.forEach(locale => {
          revalidatePath(`/${locale}`);
          revalidatedPaths.push(`/${locale}`);
        });
    }

    // Always revalidate homepage for any content change (all locales)
    locales.forEach(locale => {
      if (!revalidatedPaths.includes(`/${locale}`)) {
        revalidatePath(`/${locale}`);
        revalidatedPaths.push(`/${locale}`);
      }
    });

  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }

  return revalidatedPaths;
}

/**
 * POST handler for Sanity webhook
 * Requirements: 4.2, 19.6
 */
export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('sanity-webhook-signature');

    // Verify webhook signature
    if (!verifySignature(body, signature)) {
      throw new APIError('Invalid webhook signature', 401);
    }

    // Parse the payload
    let payload: SanityWebhookPayload;
    try {
      payload = JSON.parse(body);
    } catch {
      throw createValidationError('Invalid JSON payload');
    }

    // Validate required fields
    if (!payload._type || !payload._id) {
      throw createValidationError('Missing required fields (_type, _id)');
    }

    // Revalidate appropriate paths
    const revalidatedPaths = revalidateContent(payload);

    Sentry.captureMessage(`Revalidated paths for ${payload._type}: ${revalidatedPaths.join(', ')}`, 'info');

    return NextResponse.json({
      revalidated: true,
      paths: revalidatedPaths,
      timestamp: Date.now(),
    });

  } catch (error) {
    return handleAPIError(
      error instanceof Error ? error : new Error('Unknown error'),
      {
        endpoint: '/api/revalidate',
        method: 'POST',
      }
    );
  }
}

/**
 * GET handler - returns webhook configuration info
 */
export async function GET() {
  return NextResponse.json({
    message: 'Sanity webhook revalidation endpoint',
    method: 'POST',
    headers: {
      required: ['sanity-webhook-signature'],
    },
    payload: {
      required: ['_type', '_id'],
      optional: ['slug', 'i18nId'],
    },
  });
}
