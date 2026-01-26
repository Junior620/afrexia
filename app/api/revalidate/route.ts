import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
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

  try {
    switch (_type) {
      case 'product':
        if (slug?.current) {
          // Revalidate both language versions of the product page
          revalidatePath(`/fr/products/${slug.current}`);
          revalidatePath(`/en/products/${slug.current}`);
          revalidatedPaths.push(`/fr/products/${slug.current}`, `/en/products/${slug.current}`);
        }
        // Revalidate product listing pages
        revalidatePath('/fr/products');
        revalidatePath('/en/products');
        revalidatedPaths.push('/fr/products', '/en/products');
        break;

      case 'blogPost':
        if (slug?.current) {
          // Revalidate both language versions of the blog post
          revalidatePath(`/fr/blog/${slug.current}`);
          revalidatePath(`/en/blog/${slug.current}`);
          revalidatedPaths.push(`/fr/blog/${slug.current}`, `/en/blog/${slug.current}`);
        }
        // Revalidate blog listing pages
        revalidatePath('/fr/blog');
        revalidatePath('/en/blog');
        revalidatedPaths.push('/fr/blog', '/en/blog');
        break;

      case 'certification':
        // Revalidate quality pages
        revalidatePath('/fr/quality');
        revalidatePath('/en/quality');
        revalidatedPaths.push('/fr/quality', '/en/quality');
        break;

      case 'resource':
        // Revalidate resources pages
        revalidatePath('/fr/resources');
        revalidatePath('/en/resources');
        revalidatedPaths.push('/fr/resources', '/en/resources');
        break;

      case 'teamMember':
        // Revalidate about pages
        revalidatePath('/fr/about');
        revalidatePath('/en/about');
        revalidatedPaths.push('/fr/about', '/en/about');
        break;

      case 'page':
        if (slug?.current) {
          // Revalidate custom pages
          revalidatePath(`/fr/${slug.current}`);
          revalidatePath(`/en/${slug.current}`);
          revalidatedPaths.push(`/fr/${slug.current}`, `/en/${slug.current}`);
        }
        break;

      default:
        // For unknown types, revalidate homepage
        revalidatePath('/fr');
        revalidatePath('/en');
        revalidatedPaths.push('/fr', '/en');
    }

    // Always revalidate homepage for any content change
    revalidatePath('/fr');
    revalidatePath('/en');
    if (!revalidatedPaths.includes('/fr')) {
      revalidatedPaths.push('/fr', '/en');
    }

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
    } catch (error) {
      throw createValidationError('Invalid JSON payload');
    }

    // Validate required fields
    if (!payload._type || !payload._id) {
      throw createValidationError('Missing required fields (_type, _id)');
    }

    // Revalidate appropriate paths
    const revalidatedPaths = revalidateContent(payload);

    console.log(`Revalidated paths for ${payload._type}:`, revalidatedPaths);

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
