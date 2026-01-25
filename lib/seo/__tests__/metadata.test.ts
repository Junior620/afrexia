import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateMetaTags, generateHreflangTags } from '../metadata';
import { Locale } from '@/types';

/**
 * Property 21: Meta tags completeness
 * 
 * **Validates: Requirements 6.1, 6.2, 6.5**
 * 
 * This property verifies that for any valid page configuration,
 * the generated metadata includes all required SEO elements:
 * - Title and description
 * - Canonical URL
 * - Alternate language links (hreflang)
 * - Open Graph tags
 * - Twitter Card tags
 */
describe('Property 21: Meta tags completeness', () => {
  // Arbitraries for generating test data
  const localeArbitrary = fc.constantFrom<Locale>('fr', 'en');
  
  const pathArbitrary = fc.oneof(
    fc.constant(''),
    fc.constant('/products'),
    fc.constant('/blog'),
    fc.constant('/about'),
    fc.stringOf(
      fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f', '-', '/'),
      { minLength: 1, maxLength: 50 }
    ).map(s => '/' + s.replace(/\/+/g, '/').replace(/^\//, ''))
  );

  const titleArbitrary = fc.string({ minLength: 10, maxLength: 60 });
  const descriptionArbitrary = fc.string({ minLength: 50, maxLength: 160 });
  const ogImageArbitrary = fc.option(
    fc.webUrl({ withFragments: false, withQueryParameters: false }),
    { nil: undefined }
  );

  it('should generate complete metadata with all required fields', () => {
    fc.assert(
      fc.property(
        localeArbitrary,
        pathArbitrary,
        titleArbitrary,
        descriptionArbitrary,
        ogImageArbitrary,
        (locale, path, title, description, ogImage) => {
          // Generate metadata
          const metadata = generateMetaTags({
            title,
            description,
            locale,
            path,
            ogImage,
          });

          // Property: Title must be present
          expect(metadata.title).toBe(title);

          // Property: Description must be present
          expect(metadata.description).toBe(description);

          // Property: Robots configuration must be present
          expect(metadata.robots).toBeDefined();
          expect(metadata.robots).toHaveProperty('index');
          expect(metadata.robots).toHaveProperty('follow');

          // Property: Canonical URL must be present in alternates
          expect(metadata.alternates).toBeDefined();
          expect(metadata.alternates?.canonical).toBeDefined();
          expect(metadata.alternates?.canonical).toContain(locale);
          expect(metadata.alternates?.canonical).toContain(path);

          // Property: Alternate language links must be present
          expect(metadata.alternates?.languages).toBeDefined();
          expect(metadata.alternates?.languages).toHaveProperty('fr');
          expect(metadata.alternates?.languages).toHaveProperty('en');

          // Property: Open Graph tags must be complete
          expect(metadata.openGraph).toBeDefined();
          expect(metadata.openGraph?.title).toBe(title);
          expect(metadata.openGraph?.description).toBe(description);
          expect(metadata.openGraph?.url).toBeDefined();
          expect(metadata.openGraph?.siteName).toBeDefined();
          expect(metadata.openGraph?.locale).toBeDefined();
          expect(metadata.openGraph?.type).toBe('website');
          expect(metadata.openGraph?.images).toBeDefined();
          expect(Array.isArray(metadata.openGraph?.images)).toBe(true);
          expect((metadata.openGraph?.images as any[]).length).toBeGreaterThan(0);

          // Property: Twitter Card tags must be complete
          expect(metadata.twitter).toBeDefined();
          expect(metadata.twitter?.card).toBe('summary_large_image');
          expect(metadata.twitter?.title).toBe(title);
          expect(metadata.twitter?.description).toBe(description);
          expect(metadata.twitter?.images).toBeDefined();
          expect(Array.isArray(metadata.twitter?.images)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should generate correct hreflang tags for both locales', () => {
    fc.assert(
      fc.property(pathArbitrary, (path) => {
        // Generate hreflang tags
        const hreflangTags = generateHreflangTags(path);

        // Property: Must have exactly 3 hreflang tags (fr, en, x-default)
        expect(hreflangTags).toHaveLength(3);

        // Property: Must include French version
        const frTag = hreflangTags.find((tag) => tag.hreflang === 'fr');
        expect(frTag).toBeDefined();
        expect(frTag?.href).toContain('/fr');
        expect(frTag?.href).toContain(path);

        // Property: Must include English version
        const enTag = hreflangTags.find((tag) => tag.hreflang === 'en');
        expect(enTag).toBeDefined();
        expect(enTag?.href).toContain('/en');
        expect(enTag?.href).toContain(path);

        // Property: Must include x-default (fallback)
        const defaultTag = hreflangTags.find((tag) => tag.hreflang === 'x-default');
        expect(defaultTag).toBeDefined();
        expect(defaultTag?.href).toContain('/fr'); // Default to French
      }),
      { numRuns: 100 }
    );
  });

  it('should respect noIndex flag when set', () => {
    fc.assert(
      fc.property(
        localeArbitrary,
        pathArbitrary,
        titleArbitrary,
        descriptionArbitrary,
        fc.boolean(),
        (locale, path, title, description, noIndex) => {
          // Generate metadata with noIndex flag
          const metadata = generateMetaTags({
            title,
            description,
            locale,
            path,
            noIndex,
          });

          // Property: Robots configuration must match noIndex flag
          if (noIndex) {
            expect(metadata.robots).toEqual({
              index: false,
              follow: false,
            });
          } else {
            expect(metadata.robots).toEqual({
              index: true,
              follow: true,
            });
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use provided OG image or fallback to default', () => {
    fc.assert(
      fc.property(
        localeArbitrary,
        pathArbitrary,
        titleArbitrary,
        descriptionArbitrary,
        ogImageArbitrary,
        (locale, path, title, description, ogImage) => {
          // Generate metadata
          const metadata = generateMetaTags({
            title,
            description,
            locale,
            path,
            ogImage,
          });

          // Property: Image must be present in both OG and Twitter
          const ogImages = metadata.openGraph?.images as any[];
          const twitterImages = metadata.twitter?.images as string[];

          expect(ogImages).toBeDefined();
          expect(ogImages.length).toBeGreaterThan(0);
          expect(twitterImages).toBeDefined();
          expect(twitterImages.length).toBeGreaterThan(0);

          // Property: If custom image provided, it should be used
          if (ogImage) {
            expect(ogImages[0].url).toBe(ogImage);
            expect(twitterImages[0]).toBe(ogImage);
          } else {
            // Property: Otherwise, default image should be used
            expect(ogImages[0].url).toContain('og-image');
            expect(twitterImages[0]).toContain('og-image');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should generate locale-specific Open Graph locale tags', () => {
    fc.assert(
      fc.property(
        localeArbitrary,
        pathArbitrary,
        titleArbitrary,
        descriptionArbitrary,
        (locale, path, title, description) => {
          // Generate metadata
          const metadata = generateMetaTags({
            title,
            description,
            locale,
            path,
          });

          // Property: OG locale must match page locale
          const expectedOgLocale = locale === 'fr' ? 'fr_FR' : 'en_US';
          expect(metadata.openGraph?.locale).toBe(expectedOgLocale);
        }
      ),
      { numRuns: 100 }
    );
  });
});
