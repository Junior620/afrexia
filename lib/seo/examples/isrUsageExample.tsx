/**
 * ISR Usage Examples
 * 
 * This file contains example implementations showing how to use
 * the ISR configuration and utilities in programmatic SEO pages.
 * 
 * These are reference examples - copy and adapt for actual pages.
 */

import { notFound } from 'next/navigation';
import {
  ISR_REVALIDATION,
  getRevalidationFromPath,
  generateCacheHeaders,
  createCachedResponse,
  withISRRegeneration,
  ISRErrorType,
  type ISRPageType,
} from '@/lib/seo';

// ============================================================================
// Example 1: Basic Page with ISR
// ============================================================================

/**
 * Price page with 24-hour revalidation
 * 
 * Location: app/[locale]/prix/[product-slug]-cameroun/page.tsx
 */
export const revalidate = ISR_REVALIDATION.PRICE_PAGES; // 86400 seconds (24 hours)

interface PricePageProps {
  params: {
    locale: string;
    'product-slug': string;
  };
}

export async function PricePage({ params }: PricePageProps) {
  // Fetch price data (this will be cached and regenerated every 24 hours)
  const priceData = await fetchPriceData(params['product-slug']);

  if (!priceData) {
    notFound();
  }

  return (
    <div>
      <h1>Prix du {priceData.productName}</h1>
      <p>Prix actuel: {priceData.currentPrice} USD/tonne</p>
      <p>Dernière mise à jour: {priceData.lastUpdated}</p>
    </div>
  );
}

// ============================================================================
// Example 2: Page with Error Handling
// ============================================================================

/**
 * Product × Country page with error handling
 * 
 * Location: app/[locale]/produits/[product-slug]/export-[country-slug]/page.tsx
 */
export const revalidateProductCountry = ISR_REVALIDATION.PRODUCT_COUNTRY_PAGES; // 7 days

interface ProductCountryPageProps {
  params: {
    locale: string;
    'product-slug': string;
    'country-slug': string;
  };
}

export async function ProductCountryPage({ params }: ProductCountryPageProps) {
  const path = `/${params.locale}/produits/${params['product-slug']}/export-${params['country-slug']}`;

  try {
    // Wrap data fetching with error handling
    const data = await withISRRegeneration(
      async () => {
        const product = await fetchProduct(params['product-slug']);
        const country = await fetchCountry(params['country-slug']);

        if (!product || !country) {
          throw new Error('Product or country not found');
        }

        // Validate data completeness
        if (product.dataCompleteness < 70 || country.dataCompleteness < 70) {
          throw new Error('Insufficient data completeness');
        }

        return { product, country };
      },
      path,
      ISRErrorType.DATA_FETCH_ERROR
    );

    return (
      <div>
        <h1>
          Export de {data.product.name} vers {data.country.name}
        </h1>
        {/* Page content */}
      </div>
    );
  } catch (error) {
    // Error was logged by withISRRegeneration
    // Next.js will serve stale cache if available
    notFound();
  }
}

// ============================================================================
// Example 3: API Route with Cache Headers
// ============================================================================

/**
 * API route returning price data with proper cache headers
 * 
 * Location: app/api/prices/[product-slug]/route.ts
 */
export async function GET(
  request: Request,
  { params }: { params: { 'product-slug': string } }
) {
  try {
    const priceData = await fetchPriceData(params['product-slug']);

    if (!priceData) {
      return new Response('Not found', { status: 404 });
    }

    // Create response with appropriate cache headers
    return createCachedResponse(priceData, 'PRICE_PAGES', {
      includeETag: true,
      content: priceData,
    });
  } catch (error) {
    console.error('Error fetching price data:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

// ============================================================================
// Example 4: Dynamic Revalidation Based on Path
// ============================================================================

/**
 * Generic page component that determines revalidation time from path
 */
export async function DynamicRevalidationPage({ path }: { path: string }) {
  // Automatically determine revalidation time from path
  const revalidationTime = getRevalidationFromPath(path);

  if (!revalidationTime) {
    // Not a programmatic SEO page, use default
    return <div>Regular page</div>;
  }

  // Use the determined revalidation time
  // Note: In actual implementation, you'd set this at the page level
  console.log(`Page will revalidate every ${revalidationTime} seconds`);

  return <div>Programmatic SEO page</div>;
}

// ============================================================================
// Example 5: Manual Cache Header Application
// ============================================================================

/**
 * Custom API route with manual cache header control
 */
export async function CustomCacheRoute(request: Request) {
  const data = await fetchSomeData();

  // Generate cache headers
  const cacheConfig = generateCacheHeaders('COMPARISON_PAGES', {
    content: data,
    includeETag: true,
    revalidate: 604800, // 7 days
  });

  // Create response with headers
  const response = new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': cacheConfig.cacheControl,
      'Vary': cacheConfig.vary || 'Accept-Encoding, Accept-Language',
    },
  });

  if (cacheConfig.etag) {
    response.headers.set('ETag', cacheConfig.etag);
  }

  return response;
}

// ============================================================================
// Example 6: Conditional ETag Response
// ============================================================================

/**
 * API route that returns 304 Not Modified when content hasn't changed
 */
export async function ConditionalCacheRoute(request: Request) {
  const data = await fetchSomeData();

  // Generate ETag for current data
  const { generateETag } = await import('@/lib/seo/cacheHeaders');
  const currentETag = generateETag(data);

  // Check if client has matching ETag
  const clientETag = request.headers.get('If-None-Match');
  if (clientETag === currentETag) {
    // Content hasn't changed, return 304
    return new Response(null, {
      status: 304,
      headers: {
        'ETag': currentETag,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  // Content changed, return full response
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'ETag': currentETag,
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

// ============================================================================
// Mock Functions (replace with actual implementations)
// ============================================================================

async function fetchPriceData(productSlug: string) {
  // Replace with actual Sanity query
  return {
    productName: 'Cacao',
    currentPrice: 2500,
    lastUpdated: new Date().toISOString(),
  };
}

async function fetchProduct(slug: string) {
  // Replace with actual Sanity query
  return {
    name: 'Cacao',
    slug,
    dataCompleteness: 85,
  };
}

async function fetchCountry(slug: string) {
  // Replace with actual Sanity query
  return {
    name: 'Pays-Bas',
    slug,
    dataCompleteness: 90,
  };
}

async function fetchSomeData() {
  return { data: 'example' };
}
