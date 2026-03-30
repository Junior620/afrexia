/**
 * Route Combination Validator
 *
 * Validates product × country combinations for programmatic SEO route generation.
 *
 * @see Requirements 1.2 - Route combination validation
 */

import type { Product, ExportCountry, RouteValidationResult, ValidationReport } from '@/types/seo';

const DATA_COMPLETENESS_THRESHOLD = 70;

/**
 * Validates a product × country combination for SEO route generation.
 *
 * A combination is valid when:
 * - The country is approved for SEO (`approvedForSEO === true`)
 * - The country's data completeness is >= 70%
 */
export function validateProductCountry(
  product: Product,
  country: ExportCountry
): RouteValidationResult {
  if (!country.approvedForSEO) {
    return {
      isValid: false,
      reason: 'Country not approved for SEO',
      dataCompleteness: country.dataCompleteness,
      approvedForSEO: false,
    };
  }

  if (country.dataCompleteness < DATA_COMPLETENESS_THRESHOLD) {
    return {
      isValid: false,
      reason: `Data completeness too low: ${country.dataCompleteness}% (minimum ${DATA_COMPLETENESS_THRESHOLD}%)`,
      dataCompleteness: country.dataCompleteness,
      approvedForSEO: country.approvedForSEO,
    };
  }

  return {
    isValid: true,
    dataCompleteness: country.dataCompleteness,
    approvedForSEO: country.approvedForSEO,
  };
}

/**
 * Logs a rejected combination with structured output.
 */
export function logRejectedCombination(
  productSlug: string,
  countrySlug: string,
  reason: string
): void {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      type: 'REJECTED_COMBINATION',
      productSlug,
      countrySlug,
      reason,
    })
  );
}

/**
 * Generates a validation report for an array of product × country pairs.
 */
export function generateValidationReport(
  combinations: Array<{ product: Product; country: ExportCountry }>
): ValidationReport {
  const rejectionReasons: Record<string, number> = {};
  let validCombinations = 0;

  for (const { product, country } of combinations) {
    const result = validateProductCountry(product, country);

    if (result.isValid) {
      validCombinations++;
    } else {
      const reason = result.reason ?? 'Unknown reason';
      rejectionReasons[reason] = (rejectionReasons[reason] ?? 0) + 1;
      logRejectedCombination(product.slug.current, country.slug.current, reason);
    }
  }

  return {
    totalCombinations: combinations.length,
    validCombinations,
    rejectedCombinations: combinations.length - validCombinations,
    rejectionReasons,
  };
}
