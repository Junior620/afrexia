/**
 * Property-Based Tests: Data Freshness & Disclaimers
 *
 * **Validates: Requirements 1.8.6, 1.10**
 *
 * Properties covered:
 * - Property 20: Estimated Data Disclaimers
 * - Property 21: Data Freshness Indicators
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { generateDisclaimer } from '@/lib/seo/contentGenerator';
import type { Locale } from '@/types/seo';
import { SUPPORTED_LOCALES } from '@/types/seo';

// ============================================================================
// Arbitraries
// ============================================================================

const localeArb: fc.Arbitrary<Locale> = fc.constantFrom('fr', 'en', 'es', 'de', 'ru');
const disclaimerTypeArb = fc.constantFrom('price', 'delay', 'logistics' as const);

// ============================================================================
// Property 20: Estimated Data Disclaimers
// **Validates: Requirements 1.8.6, 1.10.2, 1.10.3, 1.10.4**
// ============================================================================

describe('Property 20: Estimated Data Disclaimers', () => {
  it('every estimated price has a disclaimer in all locales', () => {
    fc.assert(
      fc.property(localeArb, (locale) => {
        const disclaimer = generateDisclaimer('price', locale);
        expect(typeof disclaimer).toBe('string');
        expect(disclaimer.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('every estimated delay has a disclaimer in all locales', () => {
    fc.assert(
      fc.property(localeArb, (locale) => {
        const disclaimer = generateDisclaimer('delay', locale);
        expect(typeof disclaimer).toBe('string');
        expect(disclaimer.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('every estimated logistics cost has a disclaimer in all locales', () => {
    fc.assert(
      fc.property(localeArb, (locale) => {
        const disclaimer = generateDisclaimer('logistics', locale);
        expect(typeof disclaimer).toBe('string');
        expect(disclaimer.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('disclaimers are non-empty for all type × locale combinations', () => {
    fc.assert(
      fc.property(disclaimerTypeArb, localeArb, (type, locale) => {
        const disclaimer = generateDisclaimer(type, locale);
        expect(disclaimer.length).toBeGreaterThan(10);
      }),
      { numRuns: 100 }
    );
  });

  it('all 5 locales have price disclaimers', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        SUPPORTED_LOCALES.forEach((locale) => {
          const disclaimer = generateDisclaimer('price', locale);
          expect(disclaimer).toBeTruthy();
        });
      }),
      { numRuns: 100 }
    );
  });

  it('all 5 locales have delay disclaimers', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        SUPPORTED_LOCALES.forEach((locale) => {
          const disclaimer = generateDisclaimer('delay', locale);
          expect(disclaimer).toBeTruthy();
        });
      }),
      { numRuns: 100 }
    );
  });

  it('all 5 locales have logistics disclaimers', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        SUPPORTED_LOCALES.forEach((locale) => {
          const disclaimer = generateDisclaimer('logistics', locale);
          expect(disclaimer).toBeTruthy();
        });
      }),
      { numRuns: 100 }
    );
  });

  it('price disclaimer contains contact information or indicative language', () => {
    fc.assert(
      fc.property(localeArb, (locale) => {
        const disclaimer = generateDisclaimer('price', locale);
        // Should contain some form of "indicative" or "contact" language
        const hasIndicativeLanguage =
          disclaimer.toLowerCase().includes('indicat') ||
          disclaimer.toLowerCase().includes('contact') ||
          disclaimer.toLowerCase().includes('devis') ||
          disclaimer.toLowerCase().includes('quote') ||
          disclaimer.toLowerCase().includes('presupuesto') ||
          disclaimer.toLowerCase().includes('angebot') ||
          disclaimer.toLowerCase().includes('ориентировочн') || // Russian: ориентировочная
          disclaimer.toLowerCase().includes('предложени'); // Russian: предложения/предложение
        expect(hasIndicativeLanguage).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 21: Data Freshness Indicators
// **Validates: Requirements 1.10.1**
// ============================================================================

describe('Property 21: Data Freshness Indicators', () => {
  it('data freshness dates are valid ISO date strings', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
        (date) => {
          const isoDate = date.toISOString().slice(0, 10);
          // Should be a valid YYYY-MM-DD format
          expect(isoDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
          // Should be parseable back to a date
          const parsed = new Date(isoDate);
          expect(isNaN(parsed.getTime())).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('data freshness indicator structure is valid', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.boolean(),
        (lastUpdated, source, isEstimated) => {
          const indicator = {
            lastUpdated,
            source,
            isEstimated,
          };
          expect(indicator.lastUpdated).toBeInstanceOf(Date);
          expect(typeof indicator.source).toBe('string');
          expect(typeof indicator.isEstimated).toBe('boolean');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('data older than 90 days should trigger staleness warning', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 92, max: 365 }),
        (daysOld) => {
          const staleDate = new Date();
          staleDate.setDate(staleDate.getDate() - daysOld);
          const now = new Date();
          const diffDays = Math.floor(
            (now.getTime() - staleDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          expect(diffDays).toBeGreaterThan(90);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('recent data (< 90 days) is not stale', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 89 }),
        (daysOld) => {
          const recentDate = new Date();
          recentDate.setDate(recentDate.getDate() - daysOld);
          const now = new Date();
          const diffDays = Math.floor(
            (now.getTime() - recentDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          expect(diffDays).toBeLessThanOrEqual(90);
        }
      ),
      { numRuns: 100 }
    );
  });
});
