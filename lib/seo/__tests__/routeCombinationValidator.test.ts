import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  validateProductCountry,
  logRejectedCombination,
  generateValidationReport,
} from '../routeCombinationValidator';
import type { Product, ExportCountry } from '@/types/seo';

// Minimal fixtures
const product: Product = {
  _id: 'prod-1',
  _type: 'product',
  name: { fr: 'Cacao', en: 'Cocoa' },
  slug: { current: 'cacao' },
};

function makeCountry(overrides: Partial<ExportCountry> = {}): ExportCountry {
  return {
    _id: 'country-1',
    _type: 'exportCountry',
    name: { fr: 'France', en: 'France' },
    slug: { current: 'france' },
    code: 'FR',
    dataCompleteness: 80,
    approvedForSEO: true,
    ...overrides,
  };
}

describe('validateProductCountry', () => {
  it('returns valid for approved country with sufficient data completeness', () => {
    const result = validateProductCountry(product, makeCountry());
    expect(result.isValid).toBe(true);
    expect(result.approvedForSEO).toBe(true);
    expect(result.dataCompleteness).toBe(80);
  });

  it('rejects when approvedForSEO is false', () => {
    const result = validateProductCountry(product, makeCountry({ approvedForSEO: false }));
    expect(result.isValid).toBe(false);
    expect(result.reason).toMatch(/not approved/i);
    expect(result.approvedForSEO).toBe(false);
  });

  it('rejects when dataCompleteness is below 70', () => {
    const result = validateProductCountry(product, makeCountry({ dataCompleteness: 69 }));
    expect(result.isValid).toBe(false);
    expect(result.reason).toMatch(/completeness/i);
    expect(result.dataCompleteness).toBe(69);
  });

  it('accepts exactly 70% data completeness', () => {
    const result = validateProductCountry(product, makeCountry({ dataCompleteness: 70 }));
    expect(result.isValid).toBe(true);
  });

  it('rejects when both conditions fail — approvedForSEO takes priority', () => {
    const result = validateProductCountry(
      product,
      makeCountry({ approvedForSEO: false, dataCompleteness: 50 })
    );
    expect(result.isValid).toBe(false);
    expect(result.reason).toMatch(/not approved/i);
  });
});

describe('logRejectedCombination', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('logs a structured JSON message', () => {
    logRejectedCombination('cacao', 'france', 'Country not approved for SEO');
    expect(console.log).toHaveBeenCalledOnce();
    const logged = JSON.parse((console.log as ReturnType<typeof vi.spyOn>).mock.calls[0][0]);
    expect(logged).toMatchObject({
      type: 'REJECTED_COMBINATION',
      productSlug: 'cacao',
      countrySlug: 'france',
      reason: 'Country not approved for SEO',
    });
    expect(logged.timestamp).toBeDefined();
  });
});

describe('generateValidationReport', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('returns correct counts for mixed combinations', () => {
    const combinations = [
      { product, country: makeCountry() },                                    // valid
      { product, country: makeCountry({ approvedForSEO: false }) },           // rejected
      { product, country: makeCountry({ dataCompleteness: 50 }) },            // rejected
    ];

    const report = generateValidationReport(combinations);

    expect(report.totalCombinations).toBe(3);
    expect(report.validCombinations).toBe(1);
    expect(report.rejectedCombinations).toBe(2);
    expect(Object.keys(report.rejectionReasons).length).toBeGreaterThan(0);
  });

  it('returns zero rejections when all combinations are valid', () => {
    const combinations = [
      { product, country: makeCountry() },
      { product, country: makeCountry({ dataCompleteness: 100 }) },
    ];

    const report = generateValidationReport(combinations);

    expect(report.validCombinations).toBe(2);
    expect(report.rejectedCombinations).toBe(0);
    expect(report.rejectionReasons).toEqual({});
  });

  it('handles empty input', () => {
    const report = generateValidationReport([]);
    expect(report.totalCombinations).toBe(0);
    expect(report.validCombinations).toBe(0);
    expect(report.rejectedCombinations).toBe(0);
  });

  it('aggregates identical rejection reasons', () => {
    const combinations = [
      { product, country: makeCountry({ approvedForSEO: false }) },
      { product, country: makeCountry({ approvedForSEO: false }) },
    ];

    const report = generateValidationReport(combinations);
    const reason = 'Country not approved for SEO';
    expect(report.rejectionReasons[reason]).toBe(2);
  });
});
