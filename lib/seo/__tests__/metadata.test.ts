import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateMetaTags, generateHreflangTags } from '../metadata';
import { Locale } from '@/types';
import { locales } from '@/lib/i18n/config';

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
  const localeArbitrary = fc.constantFrom<Locale>(...locales);
  
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

          // Property: Alternate language links must be present for all five locales
          expect(metadata.alternates?.languages).toBeDefined();
          expect(metadata.alternates?.languages).toHaveProperty('fr');
          expect(metadata.alternates?.languages).toHaveProperty('en');
          expect(metadata.alternates?.languages).toHaveProperty('es');
          expect(metadata.alternates?.languages).toHaveProperty('de');
          expect(metadata.alternates?.languages).toHaveProperty('ru');
          expect(metadata.alternates?.languages).toHaveProperty('x-default');

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

  it('should generate correct hreflang tags for all five locales', () => {
    fc.assert(
      fc.property(pathArbitrary, (path) => {
        // Generate hreflang tags
        const hreflangTags = generateHreflangTags(path);

        // Property: Must have exactly 6 hreflang tags (fr, en, es, de, ru, x-default)
        expect(hreflangTags).toHaveLength(6);

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

        // Property: Must include Spanish version
        const esTag = hreflangTags.find((tag) => tag.hreflang === 'es');
        expect(esTag).toBeDefined();
        expect(esTag?.href).toContain('/es');
        expect(esTag?.href).toContain(path);

        // Property: Must include German version
        const deTag = hreflangTags.find((tag) => tag.hreflang === 'de');
        expect(deTag).toBeDefined();
        expect(deTag?.href).toContain('/de');
        expect(deTag?.href).toContain(path);

        // Property: Must include Russian version
        const ruTag = hreflangTags.find((tag) => tag.hreflang === 'ru');
        expect(ruTag).toBeDefined();
        expect(ruTag?.href).toContain('/ru');
        expect(ruTag?.href).toContain(path);

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
          const expectedOgLocaleMap: Record<Locale, string> = {
            fr: 'fr_FR',
            en: 'en_US',
            es: 'es_ES',
            de: 'de_DE',
            ru: 'ru_RU',
          };
          expect(metadata.openGraph?.locale).toBe(expectedOgLocaleMap[locale]);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Unit tests for five-locale SEO metadata
 * 
 * **Validates: Requirements 6.1, 6.2, 6.3, 6.5**
 */
describe('SEO Metadata for Five Locales', () => {
  it('should include hreflang tags for all five locales', () => {
    const path = '/products';
    const hreflangTags = generateHreflangTags(path);

    // Test that all five locales are present
    expect(hreflangTags).toHaveLength(6); // 5 locales + x-default
    
    const hreflangValues = hreflangTags.map(tag => tag.hreflang);
    expect(hreflangValues).toContain('fr');
    expect(hreflangValues).toContain('en');
    expect(hreflangValues).toContain('es');
    expect(hreflangValues).toContain('de');
    expect(hreflangValues).toContain('ru');
    expect(hreflangValues).toContain('x-default');
  });

  it('should have x-default pointing to French version', () => {
    const path = '/about';
    const hreflangTags = generateHreflangTags(path);

    const xDefaultTag = hreflangTags.find(tag => tag.hreflang === 'x-default');
    expect(xDefaultTag).toBeDefined();
    expect(xDefaultTag?.href).toContain('/fr');
    expect(xDefaultTag?.href).toContain(path);
  });

  it('should generate absolute URLs for all hreflang tags', () => {
    const path = '/blog';
    const hreflangTags = generateHreflangTags(path);

    hreflangTags.forEach(tag => {
      expect(tag.href).toMatch(/^https?:\/\//);
    });
  });

  it('should maintain consistent URL structure across all locales', () => {
    const path = '/contact';
    const hreflangTags = generateHreflangTags(path);

    // Filter out x-default
    const localeTags = hreflangTags.filter(tag => tag.hreflang !== 'x-default');

    localeTags.forEach(tag => {
      // Each URL should have format: https://domain/{locale}{path}
      expect(tag.href).toMatch(new RegExp(`/${tag.hreflang}${path}$`));
    });
  });

  it('should include all five locales in metadata alternates', () => {
    const metadata = generateMetaTags({
      title: 'Test Page',
      description: 'Test description',
      locale: 'fr',
      path: '/test',
    });

    expect(metadata.alternates?.languages).toBeDefined();
    expect(metadata.alternates?.languages).toHaveProperty('fr');
    expect(metadata.alternates?.languages).toHaveProperty('en');
    expect(metadata.alternates?.languages).toHaveProperty('es');
    expect(metadata.alternates?.languages).toHaveProperty('de');
    expect(metadata.alternates?.languages).toHaveProperty('ru');
    expect(metadata.alternates?.languages).toHaveProperty('x-default');
  });

  it('should generate correct Open Graph locale for each language', () => {
    const testCases: Array<{ locale: Locale; expected: string }> = [
      { locale: 'fr', expected: 'fr_FR' },
      { locale: 'en', expected: 'en_US' },
      { locale: 'es', expected: 'es_ES' },
      { locale: 'de', expected: 'de_DE' },
      { locale: 'ru', expected: 'ru_RU' },
    ];

    testCases.forEach(({ locale, expected }) => {
      const metadata = generateMetaTags({
        title: 'Test',
        description: 'Test description',
        locale,
        path: '/test',
      });

      expect(metadata.openGraph?.locale).toBe(expected);
    });
  });

  it('should generate absolute URLs with correct locale prefix', () => {
    const testCases: Locale[] = ['fr', 'en', 'es', 'de', 'ru'];

    testCases.forEach(locale => {
      const metadata = generateMetaTags({
        title: 'Test',
        description: 'Test description',
        locale,
        path: '/products',
      });

      expect(metadata.alternates?.canonical).toContain(`/${locale}/products`);
      expect(metadata.alternates?.canonical).toMatch(/^https?:\/\//);
    });
  });
});
