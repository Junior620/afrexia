/**
 * Property-Based Tests: ContentGenerator
 *
 * **Validates: Requirements 1.6, 1.7, 1.8**
 *
 * Properties covered:
 * - Property 1: Multilingual Fallback Consistency
 * - Property 12: Minimum Content Length
 * - Property 14: Content Source Marking
 * - Property 16: Fallback Usage Logging
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';
import {
  applyLanguageFallback,
  markContentSource,
  calculateContentLength,
  meetsMinimumLength,
  generateProductCountryIntro,
  generateContextualFAQs,
} from '@/lib/seo/contentGenerator';
import type { Locale, ContentSourceType, LocalizedString, Product, ExportCountry } from '@/types/seo';

// ============================================================================
// Arbitraries
// ============================================================================

const localeArb: fc.Arbitrary<Locale> = fc.constantFrom('fr', 'en', 'es', 'de', 'ru');
const sourceTypeArb: fc.Arbitrary<ContentSourceType> = fc.constantFrom(
  'sanity',
  'calculated',
  'template',
  'editorial'
);

const nonEmptyString = fc.string({ minLength: 1, maxLength: 200 });
const slugArb = fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/);

/** LocalizedString with fr+en always present, optional others */
const localizedStringArb: fc.Arbitrary<LocalizedString> = fc.record({
  fr: nonEmptyString,
  en: nonEmptyString,
  es: fc.option(nonEmptyString, { nil: undefined }),
  de: fc.option(nonEmptyString, { nil: undefined }),
  ru: fc.option(nonEmptyString, { nil: undefined }),
});

/** LocalizedString with only fr (no en) */
const frOnlyLocalizedStringArb: fc.Arbitrary<LocalizedString> = fc.record({
  fr: nonEmptyString,
  en: fc.constant(''),
});

const productArb: fc.Arbitrary<Product> = fc.record({
  _id: fc.uuid(),
  _type: fc.constant('product' as const),
  name: localizedStringArb,
  slug: slugArb.map((s) => ({ current: s })),
});

const countryArb: fc.Arbitrary<ExportCountry> = fc.record({
  _id: fc.uuid(),
  _type: fc.constant('exportCountry' as const),
  name: localizedStringArb,
  slug: slugArb.map((s) => ({ current: s })),
  code: fc.stringMatching(/^[A-Z]{2}$/),
  dataCompleteness: fc.integer({ min: 70, max: 100 }),
  approvedForSEO: fc.constant(true),
});

// ============================================================================
// Property 1: Multilingual Fallback Consistency
// **Validates: Requirements 1.1.2, 1.7.5**
// ============================================================================

describe('Property 1: Multilingual Fallback Consistency', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('returns the requested locale value when available', () => {
    fc.assert(
      fc.property(localizedStringArb, localeArb, (ls, locale) => {
        const value = ls[locale];
        if (value) {
          const result = applyLanguageFallback(ls, locale);
          expect(result).toBe(value);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('falls back to English when requested locale is missing', () => {
    fc.assert(
      fc.property(
        fc.record({ fr: nonEmptyString, en: nonEmptyString }),
        fc.constantFrom('es', 'de', 'ru' as Locale),
        (ls, locale) => {
          // es/de/ru are not set → should fall back to en
          const result = applyLanguageFallback(ls as LocalizedString, locale as Locale);
          expect(result).toBe(ls.en);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('result is always a non-empty string (never undefined or empty)', () => {
    fc.assert(
      fc.property(localizedStringArb, localeArb, (ls, locale) => {
        const result = applyLanguageFallback(ls, locale);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('fallback to English produces a warning log', () => {
    fc.assert(
      fc.property(
        fc.record({ fr: nonEmptyString, en: nonEmptyString }),
        fc.constantFrom('es', 'de', 'ru' as Locale),
        (ls, locale) => {
          warnSpy.mockClear();
          applyLanguageFallback(ls as LocalizedString, locale as Locale, 'test.field');
          expect(warnSpy).toHaveBeenCalledTimes(1);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 12: Minimum Content Length
// **Validates: Requirements 1.6.6**
// ============================================================================

describe('Property 12: Minimum Content Length', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('generateProductCountryIntro produces content with meaningful word count', () => {
    fc.assert(
      fc.property(productArb, countryArb, localeArb, (product, country, locale) => {
        const block = generateProductCountryIntro(product, country, locale);
        // Each intro block should have at least 30 words
        expect(block.wordCount).toBeGreaterThan(30);
      }),
      { numRuns: 100 }
    );
  });

  it('meetsMinimumLength returns true when total words >= 500', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 500, max: 2000 }),
        (totalWords) => {
          const blocks = [
            markContentSource('word '.repeat(totalWords).trim(), 'template', 'fr'),
          ];
          expect(meetsMinimumLength(blocks)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('meetsMinimumLength returns false when total words < 500', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 499 }),
        (totalWords) => {
          const blocks = [
            markContentSource('word '.repeat(totalWords).trim(), 'template', 'fr'),
          ];
          expect(meetsMinimumLength(blocks)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('calculateContentLength sums word counts correctly', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 1, max: 200 }), { minLength: 1, maxLength: 10 }),
        localeArb,
        (wordCounts, locale) => {
          const blocks = wordCounts.map((wc) =>
            markContentSource('word '.repeat(wc).trim(), 'template', locale)
          );
          const total = calculateContentLength(blocks);
          const expected = wordCounts.reduce((a, b) => a + b, 0);
          expect(total).toBe(expected);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 14: Content Source Marking
// **Validates: Requirements 1.6.8, 1.8.1**
// ============================================================================

describe('Property 14: Content Source Marking', () => {
  it('every content block created by markContentSource has a sourceType', () => {
    fc.assert(
      fc.property(nonEmptyString, sourceTypeArb, localeArb, (content, sourceType, locale) => {
        const block = markContentSource(content, sourceType, locale);
        expect(block.sourceType).toBe(sourceType);
        expect(['sanity', 'calculated', 'template', 'editorial']).toContain(block.sourceType);
      }),
      { numRuns: 100 }
    );
  });

  it('every content block has a locale', () => {
    fc.assert(
      fc.property(nonEmptyString, sourceTypeArb, localeArb, (content, sourceType, locale) => {
        const block = markContentSource(content, sourceType, locale);
        expect(block.locale).toBe(locale);
      }),
      { numRuns: 100 }
    );
  });

  it('every content block has a non-negative wordCount', () => {
    fc.assert(
      fc.property(fc.string(), sourceTypeArb, localeArb, (content, sourceType, locale) => {
        const block = markContentSource(content, sourceType, locale);
        expect(block.wordCount).toBeGreaterThanOrEqual(0);
      }),
      { numRuns: 100 }
    );
  });

  it('generateProductCountryIntro always marks blocks with sourceType "template"', () => {
    fc.assert(
      fc.property(productArb, countryArb, localeArb, (product, country, locale) => {
        const block = generateProductCountryIntro(product, country, locale);
        expect(block.sourceType).toBe('template');
      }),
      { numRuns: 100 }
    );
  });

  it('generateContextualFAQs returns FAQs with correct locale', () => {
    fc.assert(
      fc.property(productArb, countryArb, localeArb, (product, country, locale) => {
        const faqs = generateContextualFAQs(product, country, locale);
        faqs.forEach((faq) => {
          expect(faq.locale).toBe(locale);
        });
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 16: Fallback Usage Logging
// **Validates: Requirements 1.7.6**
// ============================================================================

describe('Property 16: Fallback Usage Logging', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('each fallback to English generates a warning log', () => {
    fc.assert(
      fc.property(
        fc.record({ fr: nonEmptyString, en: nonEmptyString }),
        fc.constantFrom('es', 'de', 'ru' as Locale),
        (ls, locale) => {
          warnSpy.mockClear();
          applyLanguageFallback(ls as LocalizedString, locale as Locale);
          // Should have logged exactly one warning for the fallback
          expect(warnSpy).toHaveBeenCalledTimes(1);
          const warnMsg = warnSpy.mock.calls[0][0] as string;
          expect(warnMsg).toContain('fallback');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('no warning is logged when locale is available', () => {
    fc.assert(
      fc.property(
        fc.record({
          fr: nonEmptyString,
          en: nonEmptyString,
          es: nonEmptyString,
          de: nonEmptyString,
          ru: nonEmptyString,
        }),
        localeArb,
        (ls, locale) => {
          warnSpy.mockClear();
          applyLanguageFallback(ls as LocalizedString, locale);
          expect(warnSpy).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 100 }
    );
  });
});
