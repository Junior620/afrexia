# ISR Strategy Documentation

## Overview

This document describes the Incremental Static Regeneration (ISR) strategy implemented for Afrexia's programmatic SEO pages. ISR allows us to serve static pages with excellent performance while keeping content fresh through background regeneration.

## What is ISR?

ISR is a Next.js feature that combines the benefits of:
- **Static Generation**: Fast page loads from pre-rendered HTML
- **Server-Side Rendering**: Fresh content without full rebuilds
- **Stale-While-Revalidate**: Serve cached content while updating in the background

## Revalidation Times

Different page types have different revalidation intervals based on content freshness requirements:

| Page Type | Revalidation | Rationale |
|-----------|--------------|-----------|
| Price Pages | 24 hours (86400s) | Prices change frequently, daily updates maintain accuracy |
| Product × Country | 7 days (604800s) | Product/country info is stable, weekly updates sufficient |
| Comparison Pages | 7 days (604800s) | Comparison content rarely changes |
| Certification Pages | 7 days (604800s) | Certification info is relatively stable |
| Port Pages | 7 days (604800s) | Logistics information changes infrequently |
| Season Pages | 1 year (31536000s) | Seasonal data only needs annual updates |
| Incoterm Pages | 7 days (604800s) | Incoterm definitions are stable |
| Container Pages | 7 days (604800s) | Container specs change rarely |

## How ISR Works

### 1. Initial Request

```
User Request → Next.js checks cache → Cache miss → Generate page → Cache result → Return to user
```

### 2. Subsequent Requests (Within Revalidation Period)

```
User Request → Next.js checks cache → Cache hit → Return cached page (fast!)
```

### 3. Request After Revalidation Period

```
User Request → Next.js checks cache → Cache expired → Return stale cache (fast!)
                                                    ↓
                                            Background regeneration
                                                    ↓
                                            Update cache for next request
```

## Implementation

### Basic Usage in Page Components

```typescript
// app/[locale]/prix/[product-slug]-cameroun/page.tsx
import { ISR_REVALIDATION } from '@/lib/seo/isrConfig';

export const revalidate = ISR_REVALIDATION.PRICE_PAGES; // 24 hours

export default async function PricePage({ params }: { params: { locale: string; 'product-slug': string } }) {
  const data = await fetchPriceData(params['product-slug']);
  return <PricePageContent data={data} />;
}
```

### Using Cache Headers

```typescript
// app/api/prices/route.ts
import { createCachedResponse } from '@/lib/seo/cacheHeaders';

export async function GET() {
  const prices = await fetchPrices();
  
  return createCachedResponse(
    prices,
    'PRICE_PAGES',
    { includeETag: true }
  );
}
```

### Error Handling

```typescript
// app/[locale]/produits/[product-slug]/export-[country-slug]/page.tsx
import { withISRRegeneration, ISRErrorType } from '@/lib/seo/isrErrorHandler';
import { ISR_REVALIDATION } from '@/lib/seo/isrConfig';
import { notFound } from 'next/navigation';

export const revalidate = ISR_REVALIDATION.PRODUCT_COUNTRY_PAGES;

export default async function ProductCountryPage({ 
  params 
}: { 
  params: { locale: string; 'product-slug': string; 'country-slug': string } 
}) {
  try {
    const data = await withISRRegeneration(
      async () => {
        const product = await fetchProduct(params['product-slug']);
        const country = await fetchCountry(params['country-slug']);
        
        if (!product || !country) {
          throw new Error('Product or country not found');
        }
        
        return { product, country };
      },
      `/fr/produits/${params['product-slug']}/export-${params['country-slug']}`,
      ISRErrorType.DATA_FETCH_ERROR
    );
    
    return <ProductCountryContent data={data} />;
  } catch (error) {
    // ISR error was logged, now handle the UI
    notFound();
  }
}
```

## Cache Headers

### Cache-Control

We use the following Cache-Control strategy:

```
Cache-Control: public, s-maxage=86400, stale-while-revalidate=43200
```

- `public`: Content can be cached by CDNs and browsers
- `s-maxage=86400`: CDN considers content fresh for 24 hours
- `stale-while-revalidate=43200`: Serve stale content for 12 more hours while revalidating

### ETag

ETags allow browsers and CDNs to validate cached content:

```typescript
const etag = generateETag({ product: 'cacao', price: 2500 });
// Returns: W/"abc123def456"
```

When a client sends `If-None-Match: W/"abc123def456"`, we can return `304 Not Modified` if content hasn't changed.

## Error Handling Strategy

### When Regeneration Fails

1. **Serve Stale Cache**: Continue serving the last successful version
2. **Log Error**: Record error details for monitoring
3. **Send to Sentry**: Alert team in production
4. **Retry**: Next request will attempt regeneration again

### Error Types

- `DATA_FETCH_ERROR`: Sanity CMS unavailable or query failed
- `CONTENT_GENERATION_ERROR`: Template rendering failed
- `VALIDATION_ERROR`: Data quality below threshold
- `UNKNOWN_ERROR`: Unexpected error

### Example Error Handling

```typescript
try {
  const data = await fetchProductData(slug);
  return generatePage(data);
} catch (err) {
  handleISRError({
    type: ISRErrorType.DATA_FETCH_ERROR,
    message: 'Failed to fetch product data',
    originalError: err as Error,
    path: `/fr/produits/${slug}`,
    timestamp: new Date(),
    context: { productSlug: slug }
  });
  
  // Next.js will serve stale cache if available
  // or return 404 if no cache exists
  notFound();
}
```

## On-Demand Revalidation

For immediate updates (e.g., when content is published in Sanity), use on-demand revalidation:

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { getPageTypeFromPath, ISR_REVALIDATION } from '@/lib/seo/isrConfig';

export async function POST(request: Request) {
  const { path } = await request.json();
  
  // Revalidate the specific path
  revalidatePath(path);
  
  // Also revalidate related paths
  const pageType = getPageTypeFromPath(path);
  if (pageType === 'PRICE_PAGES') {
    // Revalidate all price pages for this product
    revalidatePath('/fr/prix');
    revalidatePath('/en/prix');
  }
  
  return Response.json({ revalidated: true, path });
}
```

## Performance Benefits

### Before ISR (Full SSR)
- Every request generates page from scratch
- Slow response times (500ms - 2s)
- High server load
- Database queries on every request

### After ISR
- First request generates and caches page
- Subsequent requests served from cache (10-50ms)
- Background regeneration keeps content fresh
- Minimal server load
- Database queries only during regeneration

## Monitoring

### Key Metrics to Track

1. **Cache Hit Rate**: Percentage of requests served from cache
2. **Regeneration Success Rate**: Percentage of successful background regenerations
3. **Regeneration Duration**: Time taken to regenerate pages
4. **Error Rate**: Frequency of regeneration failures

### Logging

```typescript
// Success logging
logISRSuccess('/fr/prix/cacao-cameroun', 1250, {
  productSlug: 'cacao',
  priceUpdated: true
});

// Error logging (automatic)
handleISRError({
  type: ISRErrorType.DATA_FETCH_ERROR,
  message: 'Sanity query timeout',
  path: '/fr/prix/cacao-cameroun',
  timestamp: new Date()
});
```

## Best Practices

### 1. Choose Appropriate Revalidation Times

- **Too short**: Unnecessary regenerations, higher server load
- **Too long**: Stale content, poor user experience
- **Just right**: Balance freshness with performance

### 2. Handle Errors Gracefully

- Always serve stale cache when regeneration fails
- Log errors for monitoring
- Don't expose error details to users

### 3. Use On-Demand Revalidation for Critical Updates

- Price changes
- Product availability
- Important announcements

### 4. Optimize Data Fetching

- Use efficient Sanity queries
- Implement query caching
- Minimize external API calls

### 5. Monitor Performance

- Track cache hit rates
- Monitor regeneration times
- Alert on high error rates

## Testing ISR

### Development Testing

```bash
# Build production version
npm run build

# Start production server
npm start

# Test ISR behavior
curl -I http://localhost:3000/fr/prix/cacao-cameroun
# Check Cache-Control and ETag headers
```

### Force Regeneration

```bash
# Trigger on-demand revalidation
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"path": "/fr/prix/cacao-cameroun"}'
```

## Troubleshooting

### Pages Not Regenerating

1. Check revalidation time is set correctly
2. Verify ISR is enabled (not using `export const dynamic = 'force-dynamic'`)
3. Check error logs for regeneration failures

### Stale Content Persisting

1. Verify data is actually changing in Sanity
2. Check on-demand revalidation is working
3. Clear CDN cache if using external CDN

### High Error Rates

1. Check Sanity CMS availability
2. Verify query performance
3. Review error logs for patterns
4. Consider increasing timeout values

## References

- [Next.js ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Requirements 1.15](../../.kiro/specs/programmatic-seo-implementation/requirements.md#requirement-115-implémenter-lisr-incremental-static-regeneration-de-base)
- [Cache-Control MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
- [ETag MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
