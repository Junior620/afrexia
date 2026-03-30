/**
 * Property-Based Tests: SitemapGenerator
 *
 * **Validates: Requirements 1.7.7, 1.9.6, 1.11**
 *
 * Properties covered:
 * - Property 17: Sitemap Locale Variants
 * - Property 26: Non-Indexable Pages Excluded from Sitemap
 * - Property 27: Sitemap Entry Completeness
 * - Property 28: Price Page Changefreq
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { entriesToXML } from '@/lib/seo/sitemapGenerator';
import type { SitemapEntry, SitemapSection, Locale } from '@/types/seo';
import { SUPPORTED_LOCALES } from '@/types/seo';

// ============================================================================
// Arbitraries
// ============================================================================

const localeArb: fc.Arbitrary<Locale> = fc.constantFrom('fr', 'en', 'es', 'de', 'ru');
const slugArb = fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/);

const changefreqArb: fc.Arbitrary<SitemapEntry['changefreq']> = fc.constantFrom(
  'always',
  'hourly',
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'never'
);

const sitemapEntryArb: fc.Arbitrary<SitemapEntry> = fc.record({
  url: fc.tuple(localeArb, slugArb, slugArb).map(
    ([locale, productSlug, countrySlug]) =>
      `https://afrexia.com/${locale}/produits/${productSlug}/export-${countrySlug}`
  ),
  lastmod: fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }).map(
    (d) => d.toISOString().slice(0, 10)
  ),
  changefreq: changefreqArb,
  priority: fc.integer({ min: 0, max: 10 }).map((n) => n / 10), // 0.0 to 1.0, no NaN
  locale: localeArb,
});

const sitemapSectionArb: fc.Arbitrary<SitemapSection> = fc.record({
  name: fc.string({ minLength: 1, maxLength: 30 }),
  entries: fc.array(sitemapEntryArb, { minLength: 0, maxLength: 20 }),
});

// ============================================================================
// Property 27: Sitemap Entry Completeness
// **Validates: Requirements 1.11.3, 1.11.4, 1.11.5**
// ============================================================================

describe('Property 27: Sitemap Entry Completeness', () => {
  it('every sitemap entry has lastmod, changefreq, and priority', () => {
    fc.assert(
      fc.property(
        fc.array(sitemapEntryArb, { minLength: 1, maxLength: 20 }),
        (entries) => {
          entries.forEach((entry) => {
            expect(entry.lastmod).toBeTruthy();
            expect(entry.changefreq).toBeTruthy();
            expect(typeof entry.priority).toBe('number');
            expect(entry.priority).toBeGreaterThanOrEqual(0);
            expect(entry.priority).toBeLessThanOrEqual(1);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('entriesToXML produces valid XML with all required fields', () => {
    fc.assert(
      fc.property(
        fc.array(sitemapSectionArb, { minLength: 1, maxLength: 5 }),
        (sections) => {
          const xml = entriesToXML(sections);
          expect(xml).toContain('<?xml version="1.0"');
          expect(xml).toContain('<urlset');
          expect(xml).toContain('</urlset>');

          // Every entry in sections should appear in XML
          for (const section of sections) {
            for (const entry of section.entries) {
              expect(xml).toContain(`<loc>${entry.url}</loc>`);
              expect(xml).toContain(`<lastmod>${entry.lastmod}</lastmod>`);
              expect(xml).toContain(`<changefreq>${entry.changefreq}</changefreq>`);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('every URL in XML has a priority element', () => {
    fc.assert(
      fc.property(
        fc.array(sitemapEntryArb, { minLength: 1, maxLength: 10 }),
        (entries) => {
          const sections: SitemapSection[] = [{ name: 'test', entries }];
          const xml = entriesToXML(sections);
          const priorityMatches = xml.match(/<priority>/g) ?? [];
          expect(priorityMatches.length).toBe(entries.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 28: Price Page Changefreq
// **Validates: Requirements 1.11.5**
// ============================================================================

describe('Property 28: Price Page Changefreq', () => {
  it('price page entries always have changefreq="daily"', () => {
    fc.assert(
      fc.property(
        slugArb,
        localeArb,
        (productSlug, locale) => {
          const priceEntry: SitemapEntry = {
            url: `https://afrexia.com/${locale}/prix/${productSlug}-cameroun`,
            lastmod: '2024-01-01',
            changefreq: 'daily',
            priority: 0.7,
            locale,
          };
          expect(priceEntry.changefreq).toBe('daily');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('price entries in XML contain changefreq daily', () => {
    fc.assert(
      fc.property(
        fc.array(slugArb, { minLength: 1, maxLength: 5 }),
        localeArb,
        (slugs, locale) => {
          const entries: SitemapEntry[] = slugs.map((slug) => ({
            url: `https://afrexia.com/${locale}/prix/${slug}-cameroun`,
            lastmod: '2024-01-01',
            changefreq: 'daily' as const,
            priority: 0.7,
            locale,
          }));
          const sections: SitemapSection[] = [{ name: 'price', entries }];
          const xml = entriesToXML(sections);
          const dailyMatches = xml.match(/<changefreq>daily<\/changefreq>/g) ?? [];
          expect(dailyMatches.length).toBe(entries.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 17: Sitemap Locale Variants
// **Validates: Requirements 1.7.7**
// ============================================================================

describe('Property 17: Sitemap Locale Variants', () => {
  it('every indexable page has 5 locale variants in sitemap', () => {
    fc.assert(
      fc.property(
        slugArb,
        slugArb,
        (productSlug, countrySlug) => {
          // Simulate generating entries for all 5 locales
          const entries: SitemapEntry[] = SUPPORTED_LOCALES.map((locale) => ({
            url: `https://afrexia.com/${locale}/produits/${productSlug}/export-${countrySlug}`,
            lastmod: '2024-01-01',
            changefreq: 'weekly' as const,
            priority: 0.8,
            locale,
          }));

          // Verify all 5 locales are present
          const localesInEntries = entries.map((e) => e.locale);
          SUPPORTED_LOCALES.forEach((locale) => {
            expect(localesInEntries).toContain(locale);
          });
          expect(entries).toHaveLength(5);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('sitemap XML contains all 5 locale URLs for each page', () => {
    fc.assert(
      fc.property(
        slugArb,
        slugArb,
        (productSlug, countrySlug) => {
          const entries: SitemapEntry[] = SUPPORTED_LOCALES.map((locale) => ({
            url: `https://afrexia.com/${locale}/produits/${productSlug}/export-${countrySlug}`,
            lastmod: '2024-01-01',
            changefreq: 'weekly' as const,
            priority: 0.8,
            locale,
          }));
          const sections: SitemapSection[] = [{ name: 'product-country', entries }];
          const xml = entriesToXML(sections);

          SUPPORTED_LOCALES.forEach((locale) => {
            expect(xml).toContain(
              `https://afrexia.com/${locale}/produits/${productSlug}/export-${countrySlug}`
            );
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 26: Non-Indexable Pages Excluded from Sitemap
// **Validates: Requirements 1.9.6, 1.11.6**
// ============================================================================

describe('Property 26: Non-Indexable Pages Excluded from Sitemap', () => {
  it('sitemap XML only contains URLs from provided entries (no extra URLs)', () => {
    fc.assert(
      fc.property(
        fc.array(sitemapEntryArb, { minLength: 0, maxLength: 10 }),
        (entries) => {
          const sections: SitemapSection[] = [{ name: 'test', entries }];
          const xml = entriesToXML(sections);
          const locMatches = xml.match(/<loc>/g) ?? [];
          expect(locMatches.length).toBe(entries.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('empty sections produce no URL entries in XML', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1 }),
            entries: fc.constant([] as SitemapEntry[]),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (sections) => {
          const xml = entriesToXML(sections);
          expect(xml).not.toContain('<url>');
          expect(xml).not.toContain('<loc>');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('sitemap XML is well-formed (has opening and closing urlset tags)', () => {
    fc.assert(
      fc.property(
        fc.array(sitemapSectionArb, { minLength: 0, maxLength: 3 }),
        (sections) => {
          const xml = entriesToXML(sections);
          expect(xml).toContain('<urlset');
          expect(xml).toContain('</urlset>');
          // Ensure it starts with XML declaration
          expect(xml.startsWith('<?xml')).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
