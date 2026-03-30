/**
 * Unit tests for Cache Headers Utility
 */

import {
  generateCacheControl,
  generateETag,
  generateCacheHeaders,
  hasMatchingETag,
  createCachedResponse,
} from '../cacheHeaders';

describe('Cache Headers Utility', () => {
  describe('generateCacheControl', () => {
    it('should generate correct cache control for price pages', () => {
      const cacheControl = generateCacheControl('PRICE_PAGES');
      expect(cacheControl).toBe('public, s-maxage=86400, stale-while-revalidate=43200');
    });

    it('should generate correct cache control for product country pages', () => {
      const cacheControl = generateCacheControl('PRODUCT_COUNTRY_PAGES');
      expect(cacheControl).toBe('public, s-maxage=604800, stale-while-revalidate=302400');
    });

    it('should allow custom revalidation time', () => {
      const cacheControl = generateCacheControl('PRICE_PAGES', {
        revalidate: 3600,
      });
      expect(cacheControl).toBe('public, s-maxage=3600, stale-while-revalidate=1800');
    });

    it('should allow custom stale-while-revalidate time', () => {
      const cacheControl = generateCacheControl('PRICE_PAGES', {
        staleWhileRevalidate: 60000,
      });
      expect(cacheControl).toBe('public, s-maxage=86400, stale-while-revalidate=60000');
    });

    it('should support private caching', () => {
      const cacheControl = generateCacheControl('PRICE_PAGES', {
        isPublic: false,
      });
      expect(cacheControl).toContain('private');
      expect(cacheControl).not.toContain('public');
    });
  });

  describe('generateETag', () => {
    it('should generate ETag from string content', () => {
      const etag = generateETag('test content');
      expect(etag).toMatch(/^W\/"[a-f0-9]+"/);
    });

    it('should generate ETag from object content', () => {
      const etag = generateETag({ product: 'cacao', price: 2500 });
      expect(etag).toMatch(/^W\/"[a-f0-9]+"/);
    });

    it('should generate same ETag for same content', () => {
      const content = { product: 'cacao', price: 2500 };
      const etag1 = generateETag(content);
      const etag2 = generateETag(content);
      expect(etag1).toBe(etag2);
    });

    it('should generate different ETags for different content', () => {
      const etag1 = generateETag({ product: 'cacao', price: 2500 });
      const etag2 = generateETag({ product: 'coffee', price: 3000 });
      expect(etag1).not.toBe(etag2);
    });

    it('should generate weak ETag (W/ prefix)', () => {
      const etag = generateETag('content');
      expect(etag).toMatch(/^W\//);
    });
  });

  describe('generateCacheHeaders', () => {
    it('should generate complete cache headers', () => {
      const headers = generateCacheHeaders('PRICE_PAGES');
      expect(headers.cacheControl).toBe(
        'public, s-maxage=86400, stale-while-revalidate=43200'
      );
      expect(headers.vary).toBe('Accept-Encoding, Accept-Language');
    });

    it('should include ETag when requested', () => {
      const headers = generateCacheHeaders('PRICE_PAGES', {
        content: { product: 'cacao' },
        includeETag: true,
      });
      expect(headers.etag).toBeDefined();
      expect(headers.etag).toMatch(/^W\/"[a-f0-9]+"/);
    });

    it('should not include ETag when not requested', () => {
      const headers = generateCacheHeaders('PRICE_PAGES', {
        includeETag: false,
      });
      expect(headers.etag).toBeUndefined();
    });

    it('should support custom vary headers', () => {
      const headers = generateCacheHeaders('PRICE_PAGES', {
        varyHeaders: ['Accept-Encoding', 'Cookie'],
      });
      expect(headers.vary).toBe('Accept-Encoding, Cookie');
    });

    it('should support custom revalidation time', () => {
      const headers = generateCacheHeaders('PRICE_PAGES', {
        revalidate: 3600,
      });
      expect(headers.cacheControl).toContain('s-maxage=3600');
    });
  });

  describe('hasMatchingETag', () => {
    it('should return true when ETags match', () => {
      const headers = new Headers();
      headers.set('If-None-Match', 'W/"abc123"');
      expect(hasMatchingETag(headers, 'W/"abc123"')).toBe(true);
    });

    it('should return false when ETags do not match', () => {
      const headers = new Headers();
      headers.set('If-None-Match', 'W/"abc123"');
      expect(hasMatchingETag(headers, 'W/"def456"')).toBe(false);
    });

    it('should return false when If-None-Match header is missing', () => {
      const headers = new Headers();
      expect(hasMatchingETag(headers, 'W/"abc123"')).toBe(false);
    });

    it('should handle multiple ETags in If-None-Match', () => {
      const headers = new Headers();
      headers.set('If-None-Match', 'W/"abc123", W/"def456", W/"ghi789"');
      expect(hasMatchingETag(headers, 'W/"def456"')).toBe(true);
    });

    it('should handle wildcard ETag', () => {
      const headers = new Headers();
      headers.set('If-None-Match', '*');
      expect(hasMatchingETag(headers, 'W/"abc123"')).toBe(true);
    });
  });

  describe('createCachedResponse', () => {
    it('should create response with cache headers', async () => {
      const data = { product: 'cacao', price: 2500 };
      const response = createCachedResponse(data, 'PRICE_PAGES');

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(response.headers.get('Cache-Control')).toContain('s-maxage=86400');

      const body = await response.json();
      expect(body).toEqual(data);
    });

    it('should include ETag when requested', () => {
      const data = { product: 'cacao' };
      const response = createCachedResponse(data, 'PRICE_PAGES', {
        includeETag: true,
      });

      expect(response.headers.get('ETag')).toBeDefined();
      expect(response.headers.get('ETag')).toMatch(/^W\/"[a-f0-9]+"/);
    });

    it('should support custom status code', () => {
      const response = createCachedResponse({ error: 'Not found' }, 'PRICE_PAGES', {
        status: 404,
        statusText: 'Not Found',
      });

      expect(response.status).toBe(404);
      expect(response.statusText).toBe('Not Found');
    });

    it('should handle string data', async () => {
      const data = 'test content';
      const response = createCachedResponse(data, 'PRICE_PAGES');

      const body = await response.text();
      expect(body).toBe(data);
    });

    it('should support custom revalidation time', () => {
      const response = createCachedResponse({ data: 'test' }, 'PRICE_PAGES', {
        revalidate: 3600,
      });

      expect(response.headers.get('Cache-Control')).toContain('s-maxage=3600');
    });
  });
});
