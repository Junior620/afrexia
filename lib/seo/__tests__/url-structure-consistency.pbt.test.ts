import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateMetaTags, generateHreflangTags } from '../metadata';
import { Locale } from '@/types';
import { locales } from '@/lib/i18n/config';

/**
 * Property 12: URL Structure Consistency
 * 
 * Feature: multilingual-expansion
 * 
 * **Validates: Requirements 6.5**
 * 
 * This property verifies that for any page path, the URL structure is
 * identical across all five locales except for the locale prefix.
 * 
 * The property ensures:
 * 1. All locale URLs follow the same pattern: {base_url}/{locale}{path}
 * 2. The path portion is identical across all locales
 * 3. Only the locale prefix differs between URLs
 * 4. URL structure is consistent and predictable
 */
describe('Property 12: URL Structure Consistency', () => {
  // Arbitrary for generating various page paths
  const pathArbitrary = fc.oneof(
    fc.constant(''),
    fc.constant('/'),
    fc.constant('/products'),
    fc.constant('/products/cocoa'),
    fc.constant('/blog'),
    fc.constant('/blog/sustainability'),
    fc.constant('/about'),
    fc.constant('/contact'),
    fc.constant('/quality'),
    fc.constant('/solutions'),
    fc.constant('/traceability'),
    fc.stringOf(
      fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', '-', '/'),
      { minLength: 1, maxLength: 100 }
    ).map(s => {
      // Normalize path: ensure it starts with / and has no trailing /
      let normalized = '/' + s.replace(/\/+/g, '/').replace(/^\/+/, '').replace(/\/+$/, '');
      return normalized === '/' ? '' : normalized;
    })
  );

  it('should have identical path structure across all locales', () => {
    fc.assert(
      fc.property(pathArbitrary, (path) => {
        const hreflangTags = generateHreflangTags(path);

        // Extract the path portion from each URL (everything after the locale)
        const localeTags = hreflangTags.filter(tag => tag.hreflang !== 'x-default');
        
        const pathPortions = localeTags.map(tag => {
          // Extract path after locale: https://domain.com/fr/products -> /products
          const match = tag.href.match(/\/[a-z]{2}(\/.*)?$/);
          return match ? (match[1] || '') : '';
        });

        // Property: All path portions must be identical
        const uniquePaths = new Set(pathPortions);
        expect(uniquePaths.size).toBe(1);
        
        // Property: The path portion must match the input path
        expect(pathPortions[0]).toBe(path);
      }),
      { numRuns: 100 }
    );
  });

  it('should only differ by locale prefix across all URLs', () => {
    fc.assert(
      fc.property(pathArbitrary, (path) => {
        const hreflangTags = generateHreflangTags(path);

        const localeTags = hreflangTags.filter(tag => tag.hreflang !== 'x-default');

        // Property: Each URL should be identical except for the locale prefix
        for (let i = 0; i < localeTags.length; i++) {
          for (let j = i + 1; j < localeTags.length; j++) {
            const url1 = localeTags[i].href;
            const url2 = localeTags[j].href;
            const locale1 = localeTags[i].hreflang;
            const locale2 = localeTags[j].hreflang;

            // Replace locale in url1 with locale2 and compare
            const url1WithLocale2 = url1.replace(`/${locale1}`, `/${locale2}`);
            expect(url1WithLocale2).toBe(url2);
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should follow consistent URL pattern for all locales', () => {
    fc.assert(
      fc.property(pathArbitrary, (path) => {
        const hreflangTags = generateHreflangTags(path);

        const localeTags = hreflangTags.filter(tag => tag.hreflang !== 'x-default');

        // Property: All URLs must follow the pattern: {protocol}://{domain}/{locale}{path}
        const urlPattern = /^https?:\/\/[^/]+\/[a-z]{2}(\/.*)?$/;

        localeTags.forEach(tag => {
          expect(tag.href).toMatch(urlPattern);
        });
      }),
      { numRuns: 100 }
    );
  });

  it('should have same domain across all locale URLs', () => {
    fc.assert(
      fc.property(pathArbitrary, (path) => {
        const hreflangTags = generateHreflangTags(path);

        const localeTags = hreflangTags.filter(tag => tag.hreflang !== 'x-default');

        // Extract domain from each URL
        const domains = localeTags.map(tag => {
          const match = tag.href.match(/^(https?:\/\/[^/]+)\//);
          return match ? match[1] : '';
        });

        // Property: All domains must be identical
        const uniqueDomains = new Set(domains);
        expect(uniqueDomains.size).toBe(1);
      }),
      { numRuns: 100 }
    );
  });

  it('should maintain URL structure consistency in metadata alternates', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Locale>(...locales),
        pathArbitrary,
        fc.string({ minLength: 10, maxLength: 60 }),
        fc.string({ minLength: 50, maxLength: 160 }),
        (locale, path, title, description) => {
          const metadata = generateMetaTags({
            title,
            description,
            locale,
            path,
          });

          const languages = metadata.alternates?.languages as Record<string, string>;

          // Extract path portions from all locale URLs
          const pathPortions: string[] = [];
          locales.forEach(loc => {
            const url = languages[loc];
            const match = url.match(/\/[a-z]{2}(\/.*)?$/);
            pathPortions.push(match ? (match[1] || '') : '');
          });

          // Property: All path portions must be identical
          const uniquePaths = new Set(pathPortions);
          expect(uniquePaths.size).toBe(1);
          expect(pathPortions[0]).toBe(path);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should generate predictable URLs for any locale-path combination', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Locale>(...locales),
        pathArbitrary,
        (locale, path) => {
          const hreflangTags = generateHreflangTags(path);

          // Find the tag for the specific locale
          const localeTag = hreflangTags.find(tag => tag.hreflang === locale);
          expect(localeTag).toBeDefined();

          // Property: URL must be predictable: contains locale and path in correct order
          expect(localeTag?.href).toMatch(new RegExp(`/${locale}${path}$`));
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain consistency when switching between locales', () => {
    fc.assert(
      fc.property(
        pathArbitrary,
        fc.constantFrom<Locale>(...locales),
        fc.constantFrom<Locale>(...locales),
        (path, fromLocale, toLocale) => {
          const hreflangTags = generateHreflangTags(path);

          const fromTag = hreflangTags.find(tag => tag.hreflang === fromLocale);
          const toTag = hreflangTags.find(tag => tag.hreflang === toLocale);

          expect(fromTag).toBeDefined();
          expect(toTag).toBeDefined();

          // Property: Switching locale should only change the locale prefix
          const expectedToUrl = fromTag!.href.replace(`/${fromLocale}`, `/${toLocale}`);
          expect(toTag!.href).toBe(expectedToUrl);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not have trailing slashes in URLs (except for root)', () => {
    fc.assert(
      fc.property(pathArbitrary, (path) => {
        const hreflangTags = generateHreflangTags(path);

        hreflangTags.forEach(tag => {
          // Property: URLs should not end with / unless it's the root path
          if (path !== '' && path !== '/') {
            expect(tag.href).not.toMatch(/\/$/);
          }
        });
      }),
      { numRuns: 100 }
    );
  });

  it('should handle nested paths consistently across locales', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.stringOf(fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f'), { minLength: 2, maxLength: 10 }),
          { minLength: 1, maxLength: 5 }
        ).map(segments => '/' + segments.join('/')),
        (path) => {
          const hreflangTags = generateHreflangTags(path);

          const localeTags = hreflangTags.filter(tag => tag.hreflang !== 'x-default');

          // Property: All URLs should have the same number of path segments
          const segmentCounts = localeTags.map(tag => {
            const pathPortion = tag.href.split('/').slice(4); // Skip protocol, domain, locale
            return pathPortion.length;
          });

          const uniqueCounts = new Set(segmentCounts);
          expect(uniqueCounts.size).toBe(1);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 12 (Extended): URL Structure Consistency in Canonical URLs
 * 
 * This extends Property 12 to verify that canonical URLs also follow
 * the same consistent structure.
 */
describe('Property 12 (Extended): Canonical URL Structure', () => {
  const localeArbitrary = fc.constantFrom<Locale>(...locales);
  const pathArbitrary = fc.oneof(
    fc.constant(''),
    fc.constant('/products'),
    fc.constant('/blog'),
    fc.stringOf(
      fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f', '-', '/'),
      { minLength: 1, maxLength: 50 }
    ).map(s => {
      let normalized = '/' + s.replace(/\/+/g, '/').replace(/^\/+/, '').replace(/\/+$/, '');
      return normalized === '/' ? '' : normalized;
    })
  );
  const titleArbitrary = fc.string({ minLength: 10, maxLength: 60 });
  const descriptionArbitrary = fc.string({ minLength: 50, maxLength: 160 });

  it('should generate canonical URL with consistent structure', () => {
    fc.assert(
      fc.property(
        localeArbitrary,
        pathArbitrary,
        titleArbitrary,
        descriptionArbitrary,
        (locale, path, title, description) => {
          const metadata = generateMetaTags({
            title,
            description,
            locale,
            path,
          });

          const canonical = metadata.alternates?.canonical;
          expect(canonical).toBeDefined();

          // Property: Canonical URL must follow the pattern: {protocol}://{domain}/{locale}{path}
          expect(canonical).toMatch(/^https?:\/\/[^/]+\/[a-z]{2}(\/.*)?$/);

          // Property: Canonical URL must contain the correct locale
          expect(canonical).toContain(`/${locale}`);

          // Property: Canonical URL must end with the path
          expect(canonical).toMatch(new RegExp(`/${locale}${path}$`));
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have canonical URL matching the locale alternate URL', () => {
    fc.assert(
      fc.property(
        localeArbitrary,
        pathArbitrary,
        titleArbitrary,
        descriptionArbitrary,
        (locale, path, title, description) => {
          const metadata = generateMetaTags({
            title,
            description,
            locale,
            path,
          });

          const canonical = metadata.alternates?.canonical;
          const languages = metadata.alternates?.languages as Record<string, string>;

          // Property: Canonical URL must match the current locale's alternate URL
          expect(canonical).toBe(languages[locale]);
        }
      ),
      { numRuns: 100 }
    );
  });
});
