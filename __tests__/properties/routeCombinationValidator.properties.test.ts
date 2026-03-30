/**
 * Property-Based Tests: RouteCombinationValidator
 *
 * **Validates: Requirements 1.2**
 *
 * Properties covered:
 * - Property 2: Route Combination Validation
 * - Property 3: Rejected Combination Logging
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';
import {
  validateProductCountry,
  logRejectedCombination,
  generateValidationReport,
} from '@/lib/seo/routeCombinationValidator';
import type { Product, ExportCountry } from '@/types/seo';

// ============================================================================
// Arbitraries
// ============================================================================

const slugArb = fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/);

const productArb: fc.Arbitrary<Product> = fc.record({
  _id: fc.uuid(),
  _type: fc.constant('product' as const),
  name: fc.record({ fr: fc.string({ minLength: 1 }), en: fc.string({ minLength: 1 }) }),
  slug: slugArb.map((s) => ({ current: s })),
});

const countryArb = (overrides?: Partial<ExportCountry>): fc.Arbitrary<ExportCountry> =>
  fc
    .record({
      _id: fc.uuid(),
      _type: fc.constant('exportCountry' as const),
      name: fc.record({ fr: fc.string({ minLength: 1 }), en: fc.string({ minLength: 1 }) }),
      slug: slugArb.map((s) => ({ current: s })),
      code: fc.stringMatching(/^[A-Z]{2}$/),
      dataCompleteness: fc.integer({ min: 0, max: 100 }),
      approvedForSEO: fc.boolean(),
    })
    .map((c) => ({ ...c, ...overrides }));

// ============================================================================
// Property 2: Route Combination Validation
// **Validates: Requirements 1.2.1, 1.2.2, 1.2.5**
// ============================================================================

describe('Property 2: Route Combination Validation', () => {
  it('any combination with approvedForSEO=false is rejected', () => {
    fc.assert(
      fc.property(
        productArb,
        countryArb({ approvedForSEO: false }),
        (product, country) => {
          const result = validateProductCountry(product, country);
          expect(result.isValid).toBe(false);
          expect(result.reason).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('any combination with dataCompleteness < 70 is rejected', () => {
    fc.assert(
      fc.property(
        productArb,
        countryArb({ approvedForSEO: true }).chain((c) =>
          fc.integer({ min: 0, max: 69 }).map((dc) => ({ ...c, dataCompleteness: dc }))
        ),
        (product, country) => {
          const result = validateProductCountry(product, country);
          expect(result.isValid).toBe(false);
          expect(result.reason).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('any combination with approvedForSEO=true AND dataCompleteness >= 70 is valid', () => {
    fc.assert(
      fc.property(
        productArb,
        countryArb({ approvedForSEO: true }).chain((c) =>
          fc.integer({ min: 70, max: 100 }).map((dc) => ({ ...c, dataCompleteness: dc }))
        ),
        (product, country) => {
          const result = validateProductCountry(product, country);
          expect(result.isValid).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('rejected result always includes a reason string', () => {
    fc.assert(
      fc.property(
        productArb,
        countryArb(),
        (product, country) => {
          const result = validateProductCountry(product, country);
          if (!result.isValid) {
            expect(typeof result.reason).toBe('string');
            expect(result.reason!.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('result always reflects the country approvedForSEO value', () => {
    fc.assert(
      fc.property(
        productArb,
        countryArb(),
        (product, country) => {
          const result = validateProductCountry(product, country);
          expect(result.approvedForSEO).toBe(country.approvedForSEO);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('result always reflects the country dataCompleteness value', () => {
    fc.assert(
      fc.property(
        productArb,
        countryArb(),
        (product, country) => {
          const result = validateProductCountry(product, country);
          expect(result.dataCompleteness).toBe(country.dataCompleteness);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 3: Rejected Combination Logging
// **Validates: Requirements 1.2.6**
// ============================================================================

describe('Property 3: Rejected Combination Logging', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('each rejected combination generates exactly one log with reason', () => {
    fc.assert(
      fc.property(
        productArb,
        countryArb(),
        fc.string({ minLength: 1, maxLength: 100 }),
        (product, country, reason) => {
          consoleSpy.mockClear();
          logRejectedCombination(product.slug.current, country.slug.current, reason);
          expect(consoleSpy).toHaveBeenCalledTimes(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('log contains the product slug, country slug, and reason', () => {
    fc.assert(
      fc.property(
        slugArb,
        slugArb,
        fc.string({ minLength: 1, maxLength: 100 }),
        (productSlug, countrySlug, reason) => {
          consoleSpy.mockClear();
          logRejectedCombination(productSlug, countrySlug, reason);
          const logged = JSON.parse(consoleSpy.mock.calls[0][0] as string);
          expect(logged.productSlug).toBe(productSlug);
          expect(logged.countrySlug).toBe(countrySlug);
          expect(logged.reason).toBe(reason);
          expect(logged.type).toBe('REJECTED_COMBINATION');
          expect(logged.timestamp).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('generateValidationReport logs one entry per rejected combination', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            product: productArb,
            country: countryArb(),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (combinations) => {
          consoleSpy.mockClear();
          const report = generateValidationReport(combinations);
          expect(consoleSpy).toHaveBeenCalledTimes(report.rejectedCombinations);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('report totals are consistent', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            product: productArb,
            country: countryArb(),
          }),
          { minLength: 0, maxLength: 10 }
        ),
        (combinations) => {
          consoleSpy.mockClear();
          const report = generateValidationReport(combinations);
          expect(report.totalCombinations).toBe(combinations.length);
          expect(report.validCombinations + report.rejectedCombinations).toBe(
            report.totalCombinations
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});
