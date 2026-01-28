import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateMetaTags, generateHreflangTags } from '../metadata';
import { Locale } from '@/types';
import { locales } from '@/lib/i18n/config';

/**
 * Property 11: Hreflang Tag Completeness
 * 
 * Feature: multilingual-expansion
 * 
 * **Validates: Requirements 6.1, 6.2, 6.3, 6.4**
 * 
 * This property verifies that for any page path, the generated hreflang tags
 * include all five supported locales plus an x-default tag pointing to French.
 * 
 * The property ensures:
 * 1. All five locales (fr, en, es, de, ru) have hreflang tags
 * 2. An x-default tag exists and points to the French version
 * 3. All URLs are absolute (start with http:// or https://)
 * 4. Each locale's URL contains the correct locale prefix
 */
describe('Property 11: Hreflang Tag Completeness', () => {
  // Arbitrary for generating various page paths
  const pathArbitrary = fc.oneof(
    fc.constant(''),
    fc.constant('/'),
    fc.constant('/products'),
    fc.constant('/blog'),
    fc.constant('/about'),
    fc.constant('/contact'),
    fc.constant('/quality'),
    fc.constant('/solutions'),
    fc.stringOf(
      fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', '-', '/'),
      { minLength: 1, maxLength: 100 }
    ).map(s => '/' + s.replace(/\/+/g, '/').replace(/^\/+/, '').replace(/\/+$/, ''))
  );

  it('should generate hreflang tags for all five locales plus x-default', () => {
    fc.assert(
      fc.property(pathArbitrary, (path) => {
        const hreflangTags = generateHreflangTags(path);

        // Property: Must have exactly 6 tags (5 locales + x-default)
        expect(hreflangTags).toHaveLength(6);

        // Property: All five locales must be present
        const hreflangValues = hreflangTags.map(tag => tag.hreflang);
        expect(hreflangValues).toContain('fr');
        expect(hreflangValues).toContain('en');
        expect(hreflangValues).toContain('es');
        expect(hreflangValues).toContain('de');
        expect(hreflangValues).toContain('ru');
        expect(hreflangValues).toContain('x-default');

        // Property: No duplicate hreflang values
        const uniqueHreflangs = new Set(hreflangValues);
        expect(uniqueHreflangs.size).toBe(6);
      }),
      { numRuns: 100 }
    );
  });

  it('should have x-default pointing to French version', () => {
    fc.assert(
      fc.property(pathArbitrary, (path) => {
        const hreflangTags = generateHreflangTags(path);

        // Property: x-default must exist
        const xDefaultTag = hreflangTags.find(tag => tag.hreflang === 'x-default');
        expect(xDefaultTag).toBeDefined();

        // Property: x-default must point to French version
        expect(xDefaultTag?.href).toContain('/fr');
        
        // Property: x-default URL must match French URL
        const frTag = hreflangTags.find(tag => tag.hreflang === 'fr');
        expect(xDefaultTag?.href).toBe(frTag?.href);
      }),
      { numRuns: 100 }
    );
  });

  it('should generate absolute URLs for all hreflang tags', () => {
    fc.assert(
      fc.property(pathArbitrary, (path) => {
        const hreflangTags = generateHreflangTags(path);

        // Property: All URLs must be absolute (start with http:// or https://)
        hreflangTags.forEach(tag => {
          expect(tag.href).toMatch(/^https?:\/\//);
        });
      }),
      { numRuns: 100 }
    );
  });

  it('should include correct locale prefix in each URL', () => {
    fc.assert(
      fc.property(pathArbitrary, (path) => {
        const hreflangTags = generateHreflangTags(path);

        // Property: Each locale tag must have its locale in the URL
        const localeTags = hreflangTags.filter(tag => tag.hreflang !== 'x-default');
        
        localeTags.forEach(tag => {
          expect(tag.href).toContain(`/${tag.hreflang}`);
        });
      }),
      { numRuns: 100 }
    );
  });

  it('should include the path in all hreflang URLs', () => {
    fc.assert(
      fc.property(pathArbitrary, (path) => {
        const hreflangTags = generateHreflangTags(path);

        // Property: All URLs must include the path (or end with locale if path is empty)
        hreflangTags.forEach(tag => {
          if (path && path !== '/') {
            expect(tag.href).toContain(path);
          }
        });
      }),
      { numRuns: 100 }
    );
  });

  it('should generate consistent URL structure across all locales', () => {
    fc.assert(
      fc.property(pathArbitrary, (path) => {
        const hreflangTags = generateHreflangTags(path);

        // Property: All locale URLs should follow the pattern: {base_url}/{locale}{path}
        const urlPattern = /^https?:\/\/[^/]+\/[a-z]{2}(\/.*)?$/;
        
        const localeTags = hreflangTags.filter(tag => tag.hreflang !== 'x-default');
        localeTags.forEach(tag => {
          expect(tag.href).toMatch(urlPattern);
        });
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 11 (Extended): Hreflang in Metadata Alternates
 * 
 * This extends Property 11 to verify that the generateMetaTags function
 * also includes complete hreflang information in the metadata alternates.
 */
describe('Property 11 (Extended): Hreflang in Metadata Alternates', () => {
  const localeArbitrary = fc.constantFrom<Locale>(...locales);
  const pathArbitrary = fc.oneof(
    fc.constant(''),
    fc.constant('/products'),
    fc.constant('/blog'),
    fc.stringOf(
      fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f', '-', '/'),
      { minLength: 1, maxLength: 50 }
    ).map(s => '/' + s.replace(/\/+/g, '/').replace(/^\//, ''))
  );
  const titleArbitrary = fc.string({ minLength: 10, maxLength: 60 });
  const descriptionArbitrary = fc.string({ minLength: 50, maxLength: 160 });

  it('should include all five locales in metadata alternates.languages', () => {
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

          // Property: alternates.languages must exist
          expect(metadata.alternates?.languages).toBeDefined();

          // Property: All five locales must be present
          expect(metadata.alternates?.languages).toHaveProperty('fr');
          expect(metadata.alternates?.languages).toHaveProperty('en');
          expect(metadata.alternates?.languages).toHaveProperty('es');
          expect(metadata.alternates?.languages).toHaveProperty('de');
          expect(metadata.alternates?.languages).toHaveProperty('ru');

          // Property: x-default must be present
          expect(metadata.alternates?.languages).toHaveProperty('x-default');

          // Property: x-default must point to French version
          const languages = metadata.alternates?.languages as Record<string, string>;
          expect(languages['x-default']).toBe(languages['fr']);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should generate absolute URLs in metadata alternates', () => {
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

          const languages = metadata.alternates?.languages as Record<string, string>;

          // Property: All alternate URLs must be absolute
          Object.values(languages).forEach(url => {
            expect(url).toMatch(/^https?:\/\//);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should include correct locale prefix in metadata alternate URLs', () => {
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

          const languages = metadata.alternates?.languages as Record<string, string>;

          // Property: Each locale URL must contain its locale prefix
          locales.forEach(loc => {
            expect(languages[loc]).toContain(`/${loc}`);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
