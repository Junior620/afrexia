# SEO Library

This library provides utilities for SEO optimization, metadata generation, and Incremental Static Regeneration (ISR) for Afrexia's programmatic SEO pages.

## Modules

### Core SEO

- **metadata.ts** - Generate meta tags, Open Graph, and Twitter Card metadata
- **schema.ts** - Generate Schema.org structured data (Product, Article, Breadcrumb, etc.)
- **programmatic-data.ts** - Utilities for programmatic SEO data management

### ISR (Incremental Static Regeneration)

- **isrConfig.ts** - ISR revalidation time constants and configuration
- **cacheHeaders.ts** - Cache header generation (Cache-Control, ETag)
- **isrErrorHandler.ts** - Error handling and logging for ISR regeneration

### Documentation

- **ISR_STRATEGY.md** - Complete ISR strategy documentation
- **examples/isrUsageExample.ts** - Usage examples for ISR utilities

## Quick Start

### 1. Configure ISR for a Page

```typescript
// app/[locale]/prix/[product-slug]-cameroun/page.tsx
import { ISR_REVALIDATION } from '@/lib/seo';

// Set revalidation time (24 hours for price pages)
export const revalidate = ISR_REVALIDATION.PRICE_PAGES;

export default async function PricePage({ params }) {
  const data = await fetchPriceData(params['product-slug']);
  return <PricePageContent data={data} />;
}
```

### 2. Add Cache Headers to API Routes

```typescript
// app/api/prices/route.ts
import { createCachedResponse } from '@/lib/seo';

export async function GET() {
  const prices = await fetchPrices();
  
  return createCachedResponse(
    prices,
    'PRICE_PAGES',
    { includeETag: true }
  );
}
```

### 3. Handle ISR Errors

```typescript
import { withISRRegeneration, ISRErrorType } from '@/lib/seo';
import { notFound } from 'next/navigation';

export default async function Page({ params }) {
  try {
    const data = await withISRRegeneration(
      async () => await fetchData(params.slug),
      `/fr/produits/${params.slug}`,
      ISRErrorType.DATA_FETCH_ERROR
    );
    
    return <PageContent data={data} />;
  } catch (error) {
    notFound();
  }
}
```

## ISR Revalidation Times

| Page Type | Revalidation | Constant |
|-----------|--------------|----------|
| Price Pages | 24 hours | `ISR_REVALIDATION.PRICE_PAGES` |
| Product × Country | 7 days | `ISR_REVALIDATION.PRODUCT_COUNTRY_PAGES` |
| Comparison Pages | 7 days | `ISR_REVALIDATION.COMPARISON_PAGES` |
| Certification Pages | 7 days | `ISR_REVALIDATION.CERTIFICATION_PAGES` |
| Port Pages | 7 days | `ISR_REVALIDATION.PORT_PAGES` |
| Season Pages | 1 year | `ISR_REVALIDATION.SEASON_PAGES` |
| Incoterm Pages | 7 days | `ISR_REVALIDATION.INCOTERM_PAGES` |
| Container Pages | 7 days | `ISR_REVALIDATION.CONTAINER_PAGES` |

## API Reference

### isrConfig.ts

#### `ISR_REVALIDATION`

Object containing revalidation time constants (in seconds) for different page types.

```typescript
const revalidate = ISR_REVALIDATION.PRICE_PAGES; // 86400 (24 hours)
```

#### `getRevalidationTime(pageType: ISRPageType): number`

Get revalidation time for a specific page type.

```typescript
const time = getRevalidationTime('PRICE_PAGES'); // 86400
```

#### `getPageTypeFromPath(path: string): ISRPageType | null`

Determine page type from route path.

```typescript
const pageType = getPageTypeFromPath('/fr/prix/cacao-cameroun');
// Returns: 'PRICE_PAGES'
```

#### `getRevalidationFromPath(path: string): number | undefined`

Get revalidation time directly from route path.

```typescript
const revalidate = getRevalidationFromPath('/fr/prix/cacao-cameroun');
// Returns: 86400
```

### cacheHeaders.ts

#### `generateCacheControl(pageType: ISRPageType, options?): string`

Generate Cache-Control header value.

```typescript
const cacheControl = generateCacheControl('PRICE_PAGES');
// Returns: "public, s-maxage=86400, stale-while-revalidate=43200"
```

Options:
- `revalidate?: number` - Override default revalidation time
- `staleWhileRevalidate?: number` - Custom stale-while-revalidate time
- `isPublic?: boolean` - Public or private caching (default: true)

#### `generateETag(content: string | object): string`

Generate ETag from content.

```typescript
const etag = generateETag({ product: 'cacao', price: 2500 });
// Returns: W/"abc123def456"
```

#### `generateCacheHeaders(pageType: ISRPageType, options?): CacheHeaderConfig`

Generate complete cache header configuration.

```typescript
const headers = generateCacheHeaders('PRICE_PAGES', {
  content: { product: 'cacao' },
  includeETag: true
});
// Returns: { cacheControl: "...", etag: "W/...", vary: "..." }
```

#### `applyCacheHeaders(headers: Headers, config: CacheHeaderConfig): void`

Apply cache headers to Next.js Headers object.

```typescript
applyCacheHeaders(headers, cacheConfig);
```

#### `hasMatchingETag(requestHeaders: Headers, etag: string): boolean`

Check if request has matching ETag.

```typescript
if (hasMatchingETag(request.headers, currentETag)) {
  return new Response(null, { status: 304 });
}
```

#### `createCachedResponse(data, pageType, options?): Response`

Create Response with appropriate cache headers.

```typescript
return createCachedResponse(
  { product: 'cacao' },
  'PRICE_PAGES',
  { includeETag: true }
);
```

### isrErrorHandler.ts

#### `ISRErrorType` (enum)

Error types for ISR regeneration:
- `DATA_FETCH_ERROR` - Data fetch failed
- `CONTENT_GENERATION_ERROR` - Content generation failed
- `VALIDATION_ERROR` - Validation failed
- `UNKNOWN_ERROR` - Unknown error

#### `handleISRError(error: ISRError, options?): void`

Handle ISR regeneration errors.

```typescript
handleISRError({
  type: ISRErrorType.DATA_FETCH_ERROR,
  message: 'Failed to fetch data',
  path: '/fr/prix/cacao-cameroun',
  timestamp: new Date()
});
```

#### `createISRError(err, path, type?, context?): ISRError`

Create ISR error from caught exception.

```typescript
const isrError = createISRError(
  err,
  '/fr/prix/cacao-cameroun',
  ISRErrorType.DATA_FETCH_ERROR,
  { productSlug: 'cacao' }
);
```

#### `withISRErrorHandling<T>(fn, path, errorType): () => Promise<T>`

Wrap async function with error handling.

```typescript
const fetchWithErrorHandling = withISRErrorHandling(
  async () => await fetchData(slug),
  `/fr/produits/${slug}`,
  ISRErrorType.DATA_FETCH_ERROR
);
```

#### `withISRRegeneration<T>(fn, path, errorType?): Promise<T>`

Wrap regeneration function with error handling and logging.

```typescript
const data = await withISRRegeneration(
  async () => await fetchData(),
  '/fr/prix/cacao-cameroun',
  ISRErrorType.DATA_FETCH_ERROR
);
```

#### `logISRSuccess(path, duration, context?): void`

Log successful ISR regeneration.

```typescript
logISRSuccess('/fr/prix/cacao-cameroun', 1250, {
  productSlug: 'cacao'
});
```

## Testing

Run tests:

```bash
# All SEO tests
npm test -- lib/seo/__tests__

# Specific test file
npm test -- lib/seo/__tests__/isrConfig.test.ts
npm test -- lib/seo/__tests__/cacheHeaders.test.ts
```

## Documentation

- [ISR Strategy](./ISR_STRATEGY.md) - Complete ISR implementation guide
- [Usage Examples](./examples/isrUsageExample.ts) - Code examples
- [Requirements](../../.kiro/specs/programmatic-seo-implementation/requirements.md) - Requirements 1.15

## Related

- [Next.js ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
- [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
