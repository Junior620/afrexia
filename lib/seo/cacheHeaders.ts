/**
 * Cache Headers Utility
 * 
 * This module provides utilities for generating appropriate cache headers
 * for programmatic SEO pages using ISR (Incremental Static Regeneration).
 * 
 * Implements stale-while-revalidate strategy with proper Cache-Control and ETag headers.
 * 
 * @see Requirements 1.15 - ISR System with Cache Headers
 */

import { ISRPageType, getRevalidationTime } from './isrConfig';

/**
 * Cache header configuration
 */
export interface CacheHeaderConfig {
  /**
   * Cache-Control header value
   */
  cacheControl: string;

  /**
   * ETag value (optional, generated from content hash)
   */
  etag?: string;

  /**
   * Vary header to indicate cache variations
   */
  vary?: string;
}

/**
 * Generate Cache-Control header for ISR pages
 * 
 * Implements stale-while-revalidate strategy:
 * - s-maxage: Time before CDN considers content stale
 * - stale-while-revalidate: Time to serve stale content while revalidating
 * 
 * @param pageType - The type of programmatic SEO page
 * @param options - Additional cache options
 * @returns Cache-Control header value
 * 
 * @example
 * ```typescript
 * const cacheControl = generateCacheControl('PRICE_PAGES');
 * // Returns: "public, s-maxage=86400, stale-while-revalidate=43200"
 * ```
 */
export function generateCacheControl(
  pageType: ISRPageType,
  options: {
    /**
     * Override the default revalidation time
     */
    revalidate?: number;
    /**
     * Additional stale-while-revalidate time (defaults to half of revalidate)
     */
    staleWhileRevalidate?: number;
    /**
     * Whether to allow public caching (defaults to true)
     */
    isPublic?: boolean;
  } = {}
): string {
  const {
    revalidate = getRevalidationTime(pageType),
    staleWhileRevalidate = Math.floor(revalidate / 2),
    isPublic = true,
  } = options;

  const visibility = isPublic ? 'public' : 'private';

  // Build Cache-Control header
  const parts = [
    visibility,
    `s-maxage=${revalidate}`,
    `stale-while-revalidate=${staleWhileRevalidate}`,
  ];

  return parts.join(', ');
}

/**
 * Generate ETag from content
 * 
 * Creates a simple hash-based ETag for content versioning.
 * This allows browsers and CDNs to validate cached content.
 * 
 * @param content - The page content or data to hash
 * @returns ETag value
 * 
 * @example
 * ```typescript
 * const etag = generateETag({ product: 'cacao', price: 2500 });
 * // Returns: "W/\"abc123def456\""
 * ```
 */
export function generateETag(content: string | object): string {
  const contentString = typeof content === 'string' 
    ? content 
    : JSON.stringify(content);

  // Simple hash function (for production, consider using crypto.createHash)
  let hash = 0;
  for (let i = 0; i < contentString.length; i++) {
    const char = contentString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Convert to hex and create weak ETag
  const hexHash = Math.abs(hash).toString(16);
  return `W/"${hexHash}"`;
}

/**
 * Generate complete cache headers for ISR pages
 * 
 * @param pageType - The type of programmatic SEO page
 * @param options - Cache configuration options
 * @returns Complete cache header configuration
 * 
 * @example
 * ```typescript
 * const headers = generateCacheHeaders('PRICE_PAGES', {
 *   content: { product: 'cacao', price: 2500 },
 *   includeETag: true
 * });
 * 
 * // Apply to Next.js response:
 * response.headers.set('Cache-Control', headers.cacheControl);
 * if (headers.etag) {
 *   response.headers.set('ETag', headers.etag);
 * }
 * ```
 */
export function generateCacheHeaders(
  pageType: ISRPageType,
  options: {
    /**
     * Content to generate ETag from (optional)
     */
    content?: string | object;
    /**
     * Whether to include ETag header
     */
    includeETag?: boolean;
    /**
     * Override default revalidation time
     */
    revalidate?: number;
    /**
     * Whether to allow public caching
     */
    isPublic?: boolean;
    /**
     * Additional Vary header values
     */
    varyHeaders?: string[];
  } = {}
): CacheHeaderConfig {
  const {
    content,
    includeETag = false,
    revalidate,
    isPublic = true,
    varyHeaders = ['Accept-Encoding', 'Accept-Language'],
  } = options;

  const config: CacheHeaderConfig = {
    cacheControl: generateCacheControl(pageType, { revalidate, isPublic }),
    vary: varyHeaders.join(', '),
  };

  // Generate ETag if requested and content is provided
  if (includeETag && content) {
    config.etag = generateETag(content);
  }

  return config;
}

/**
 * Apply cache headers to Next.js Headers object
 * 
 * @param headers - Next.js Headers object
 * @param config - Cache header configuration
 * 
 * @example
 * ```typescript
 * import { headers } from 'next/headers';
 * 
 * export async function GET() {
 *   const headersList = headers();
 *   const cacheConfig = generateCacheHeaders('PRICE_PAGES');
 *   applyCacheHeaders(headersList, cacheConfig);
 *   
 *   return new Response(data);
 * }
 * ```
 */
export function applyCacheHeaders(
  headers: Headers,
  config: CacheHeaderConfig
): void {
  headers.set('Cache-Control', config.cacheControl);

  if (config.etag) {
    headers.set('ETag', config.etag);
  }

  if (config.vary) {
    headers.set('Vary', config.vary);
  }
}

/**
 * Check if request has matching ETag
 * 
 * @param requestHeaders - Request headers
 * @param etag - Current ETag value
 * @returns True if ETags match (content not modified)
 * 
 * @example
 * ```typescript
 * const requestETag = request.headers.get('If-None-Match');
 * const currentETag = generateETag(content);
 * 
 * if (hasMatchingETag(request.headers, currentETag)) {
 *   return new Response(null, { status: 304 }); // Not Modified
 * }
 * ```
 */
export function hasMatchingETag(
  requestHeaders: Headers,
  etag: string
): boolean {
  const ifNoneMatch = requestHeaders.get('If-None-Match');
  if (!ifNoneMatch) {
    return false;
  }

  // Handle multiple ETags in If-None-Match
  const requestETags = ifNoneMatch.split(',').map(tag => tag.trim());
  return requestETags.includes(etag) || requestETags.includes('*');
}

/**
 * Create a Response with appropriate cache headers
 * 
 * @param data - Response data
 * @param pageType - ISR page type
 * @param options - Cache options
 * @returns Response with cache headers
 * 
 * @example
 * ```typescript
 * export async function GET() {
 *   const data = await fetchPriceData();
 *   
 *   return createCachedResponse(
 *     JSON.stringify(data),
 *     'PRICE_PAGES',
 *     { content: data, includeETag: true }
 *   );
 * }
 * ```
 */
export function createCachedResponse(
  data: string | object,
  pageType: ISRPageType,
  options: {
    content?: string | object;
    includeETag?: boolean;
    revalidate?: number;
    status?: number;
    statusText?: string;
  } = {}
): Response {
  const {
    content = data,
    includeETag = true,
    revalidate,
    status = 200,
    statusText = 'OK',
  } = options;

  const cacheConfig = generateCacheHeaders(pageType, {
    content,
    includeETag,
    revalidate,
  });

  const headers = new Headers({
    'Content-Type': 'application/json',
    'Cache-Control': cacheConfig.cacheControl,
    'Vary': cacheConfig.vary || 'Accept-Encoding, Accept-Language',
  });

  if (cacheConfig.etag) {
    headers.set('ETag', cacheConfig.etag);
  }

  const body = typeof data === 'string' ? data : JSON.stringify(data);

  return new Response(body, {
    status,
    statusText,
    headers,
  });
}
