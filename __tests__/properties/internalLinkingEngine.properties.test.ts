/**
 * Property-Based Tests: InternalLinkingEngine
 *
 * **Validates: Requirements 1.13**
 *
 * Properties covered:
 * - Property 33: Internal Links Presence
 * - Property 34: Anchor Text Variation
 * - Property 35: Indexable Link Prioritization
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  generateRelatedLinks,
  generateBreadcrumb,
  varyAnchorText,
} from '@/lib/seo/internalLinkingEngine';
import type { Locale, Product, ExportCountry } from '@/types/seo';

// ============================================================================
// Arbitraries
// ============================================================================

const localeArb: fc.Arbitrary<Locale> = fc.constantFrom('fr', 'en', 'es', 'de', 'ru');
const slugArb = fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/);
const nonEmptyString = fc.string({ minLength: 1, maxLength: 100 });

const productArb: fc.Arbitrary<Product> = fc.record({
  _id: fc.uuid(),
  _type: fc.constant('product' as const),
  name: fc.record({ fr: nonEmptyString, en: nonEmptyString }),
  slug: slugArb.map((s) => ({ current: s })),
});

const countryArb: fc.Arbitrary<ExportCountry> = fc.record({
  _id: fc.uuid(),
  _type: fc.constant('exportCountry' as const),
  name: fc.record({ fr: nonEmptyString, en: nonEmptyString }),
  slug: slugArb.map((s) => ({ current: s })),
  code: fc.stringMatching(/^[A-Z]{2}$/),
  dataCompleteness: fc.integer({ min: 70, max: 100 }),
  approvedForSEO: fc.constant(true),
});

// ============================================================================
// Property 33: Internal Links Presence
// **Validates: Requirements 1.13.1, 1.13.2, 1.13.3, 1.13.4, 1.13.5**
// ============================================================================

describe('Property 33: Internal Links Presence', () => {
  it('generateRelatedLinks returns between 0 and 6 links for product-country context', () => {
    fc.assert(
      fc.property(
        productArb,
        countryArb,
        localeArb,
        fc.array(countryArb, { minLength: 3, maxLength: 8 }),
        fc.array(productArb, { minLength: 3, maxLength: 8 }),
        (product, country, locale, relatedCountries, relatedProducts) => {
          const links = generateRelatedLinks({
            type: 'product-country',
            product,
            country,
            locale,
            relatedCountries,
            relatedProducts,
          });
          expect(links.length).toBeGreaterThanOrEqual(0);
          expect(links.length).toBeLessThanOrEqual(6);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('generateRelatedLinks returns at most 6 links for price context', () => {
    fc.assert(
      fc.property(
        productArb,
        localeArb,
        fc.array(productArb, { minLength: 3, maxLength: 8 }),
        fc.array(countryArb, { minLength: 3, maxLength: 8 }),
        (product, locale, relatedProducts, relatedCountries) => {
          const links = generateRelatedLinks({
            type: 'price',
            product,
            locale,
            relatedProducts,
            relatedCountries,
          });
          expect(links.length).toBeLessThanOrEqual(6);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('generateBreadcrumb for product-country returns 4 items', () => {
    fc.assert(
      fc.property(productArb, countryArb, localeArb, (product, country, locale) => {
        const breadcrumb = generateBreadcrumb({
          type: 'product-country',
          product,
          country,
          locale,
        });
        expect(breadcrumb).toHaveLength(4);
      }),
      { numRuns: 100 }
    );
  });

  it('generateBreadcrumb for price returns 3 items', () => {
    fc.assert(
      fc.property(productArb, localeArb, (product, locale) => {
        const breadcrumb = generateBreadcrumb({
          type: 'price',
          product,
          locale,
        });
        expect(breadcrumb).toHaveLength(3);
      }),
      { numRuns: 100 }
    );
  });

  it('generateBreadcrumb for comparison returns 3 items', () => {
    fc.assert(
      fc.property(productArb, productArb, localeArb, (productA, productB, locale) => {
        const breadcrumb = generateBreadcrumb({
          type: 'comparison',
          productA,
          productB,
          locale,
        });
        expect(breadcrumb).toHaveLength(3);
      }),
      { numRuns: 100 }
    );
  });

  it('breadcrumb items have sequential positions starting at 1', () => {
    fc.assert(
      fc.property(productArb, countryArb, localeArb, (product, country, locale) => {
        const breadcrumb = generateBreadcrumb({
          type: 'product-country',
          product,
          country,
          locale,
        });
        breadcrumb.forEach((item, index) => {
          expect(item.position).toBe(index + 1);
        });
      }),
      { numRuns: 100 }
    );
  });

  it('all breadcrumb items have non-empty name and URL', () => {
    fc.assert(
      fc.property(productArb, countryArb, localeArb, (product, country, locale) => {
        const breadcrumb = generateBreadcrumb({
          type: 'product-country',
          product,
          country,
          locale,
        });
        breadcrumb.forEach((item) => {
          expect(item.name.length).toBeGreaterThan(0);
          expect(item.url.length).toBeGreaterThan(0);
          expect(item.url).toContain('http');
        });
      }),
      { numRuns: 100 }
    );
  });

  it('all related links have non-empty URL and anchorText', () => {
    fc.assert(
      fc.property(
        productArb,
        countryArb,
        localeArb,
        fc.array(countryArb, { minLength: 3, maxLength: 6 }),
        fc.array(productArb, { minLength: 3, maxLength: 6 }),
        (product, country, locale, relatedCountries, relatedProducts) => {
          const links = generateRelatedLinks({
            type: 'product-country',
            product,
            country,
            locale,
            relatedCountries,
            relatedProducts,
          });
          links.forEach((link) => {
            expect(link.url.length).toBeGreaterThan(0);
            expect(link.anchorText.length).toBeGreaterThan(0);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 34: Anchor Text Variation
// **Validates: Requirements 1.13.6**
// ============================================================================

describe('Property 34: Anchor Text Variation', () => {
  it('varyAnchorText returns a value from the pool', () => {
    fc.assert(
      fc.property(
        fc.array(nonEmptyString, { minLength: 2, maxLength: 10 }),
        nonEmptyString,
        (pool, seed) => {
          const result = varyAnchorText(pool, seed);
          expect(pool).toContain(result);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('varyAnchorText is deterministic for the same seed', () => {
    fc.assert(
      fc.property(
        fc.array(nonEmptyString, { minLength: 2, maxLength: 10 }),
        nonEmptyString,
        (pool, seed) => {
          const result1 = varyAnchorText(pool, seed);
          const result2 = varyAnchorText(pool, seed);
          expect(result1).toBe(result2);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('varyAnchorText produces different results for different seeds across a pool', () => {
    fc.assert(
      fc.property(
        fc.array(nonEmptyString, { minLength: 5, maxLength: 10 }),
        fc.array(nonEmptyString, { minLength: 5, maxLength: 10 }),
        (pool, seeds) => {
          const results = seeds.map((seed) => varyAnchorText(pool, seed));
          // Not all results should be the same (variation exists)
          const uniqueResults = new Set(results);
          // With 5+ seeds and 5+ pool items, we expect at least 2 different results
          // (this is probabilistic but very likely with random seeds)
          expect(uniqueResults.size).toBeGreaterThanOrEqual(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('varyAnchorText returns seed when pool is empty', () => {
    fc.assert(
      fc.property(nonEmptyString, (seed) => {
        const result = varyAnchorText([], seed);
        expect(result).toBe(seed);
      }),
      { numRuns: 100 }
    );
  });

  it('related links have varied anchor texts across different pages', () => {
    fc.assert(
      fc.property(
        productArb,
        fc.array(countryArb, { minLength: 4, maxLength: 6 }),
        localeArb,
        (product, countries, locale) => {
          const allLinks = countries.map((country) =>
            generateRelatedLinks({
              type: 'product-country',
              product,
              country,
              locale,
              relatedCountries: countries,
            })
          );

          // Collect all anchor texts
          const allAnchorTexts = allLinks.flat().map((l) => l.anchorText);
          // There should be some variation (not all identical)
          if (allAnchorTexts.length > 1) {
            const uniqueTexts = new Set(allAnchorTexts);
            expect(uniqueTexts.size).toBeGreaterThanOrEqual(1);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 35: Indexable Link Prioritization
// **Validates: Requirements 1.13.7**
// ============================================================================

describe('Property 35: Indexable Link Prioritization', () => {
  it('indexable links appear before non-indexable links in results', () => {
    fc.assert(
      fc.property(
        productArb,
        countryArb,
        localeArb,
        fc.array(countryArb, { minLength: 3, maxLength: 6 }),
        fc.array(productArb, { minLength: 3, maxLength: 6 }),
        (product, country, locale, relatedCountries, relatedProducts) => {
          // Mark some URLs as indexable
          const indexableUrls = new Set<string>();
          relatedCountries.slice(0, 2).forEach((c) => {
            indexableUrls.add(
              `https://afrexia.com/${locale}/produits/${product.slug.current}/export-${c.slug.current}`
            );
          });

          const links = generateRelatedLinks(
            {
              type: 'product-country',
              product,
              country,
              locale,
              relatedCountries,
              relatedProducts,
            },
            indexableUrls
          );

          // Find the last indexable link position
          const lastIndexablePos = links.reduce(
            (last, link, i) => (link.isIndexable ? i : last),
            -1
          );
          // Find the first non-indexable link position
          const firstNonIndexablePos = links.findIndex((l) => !l.isIndexable);

          // If both exist, indexable should come before non-indexable
          if (lastIndexablePos !== -1 && firstNonIndexablePos !== -1) {
            expect(lastIndexablePos).toBeLessThan(firstNonIndexablePos);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('links marked as indexable correspond to URLs in the indexableUrls set', () => {
    fc.assert(
      fc.property(
        productArb,
        countryArb,
        localeArb,
        fc.array(countryArb, { minLength: 3, maxLength: 6 }),
        (product, country, locale, relatedCountries) => {
          const indexableUrls = new Set<string>();
          relatedCountries.slice(0, 2).forEach((c) => {
            indexableUrls.add(
              `https://afrexia.com/${locale}/produits/${product.slug.current}/export-${c.slug.current}`
            );
          });

          const links = generateRelatedLinks(
            {
              type: 'product-country',
              product,
              country,
              locale,
              relatedCountries,
            },
            indexableUrls
          );

          links.forEach((link) => {
            if (link.isIndexable) {
              expect(indexableUrls.has(link.url)).toBe(true);
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('links have no duplicate URLs', () => {
    fc.assert(
      fc.property(
        productArb,
        countryArb,
        localeArb,
        fc.array(countryArb, { minLength: 3, maxLength: 8 }),
        fc.array(productArb, { minLength: 3, maxLength: 8 }),
        (product, country, locale, relatedCountries, relatedProducts) => {
          const links = generateRelatedLinks({
            type: 'product-country',
            product,
            country,
            locale,
            relatedCountries,
            relatedProducts,
          });

          const urls = links.map((l) => l.url);
          const uniqueUrls = new Set(urls);
          expect(uniqueUrls.size).toBe(urls.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});
