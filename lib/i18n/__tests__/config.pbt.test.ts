import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { isValidLocale, getValidLocale, locales, defaultLocale } from '../config';

/**
 * Property-Based Tests for Locale Configuration
 * 
 * **Property 2: Locale Validation Correctness**
 * **Validates: Requirements 1.5**
 * 
 * This test suite validates that:
 * 1. isValidLocale correctly identifies valid and invalid locales for all string inputs
 * 2. getValidLocale always returns a valid locale regardless of input
 */

describe('Property 2: Locale Validation Correctness', () => {
  // Feature: multilingual-expansion, Property 2: Locale Validation Correctness
  it('should validate locales correctly for all inputs', () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        const validLocales = ['fr', 'en', 'es', 'de', 'ru'];
        const result = isValidLocale(input);
        const expected = validLocales.includes(input);
        expect(result).toBe(expected);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: multilingual-expansion, Property 2: Locale Validation Correctness
  it('should always return a valid locale from getValidLocale', () => {
    fc.assert(
      fc.property(fc.option(fc.string(), { nil: undefined }), (input) => {
        const result = getValidLocale(input);
        
        // Result must be a valid locale
        expect(isValidLocale(result)).toBe(true);
        
        // Result must be one of the supported locales
        expect(locales).toContain(result);
        
        // If input is valid, should return input; otherwise default
        if (input && isValidLocale(input)) {
          expect(result).toBe(input);
        } else {
          expect(result).toBe(defaultLocale);
        }
      }),
      { numRuns: 100 }
    );
  });

  // Feature: multilingual-expansion, Property 2: Locale Validation Correctness
  it('should handle edge cases consistently', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(''),
          fc.constant(' '),
          fc.constant('FR'),
          fc.constant('EN'),
          fc.constant('fr '),
          fc.constant(' fr'),
          fc.constant('french'),
          fc.constant('english'),
          fc.constant('spanish'),
          fc.constant('german'),
          fc.constant('russian'),
          fc.string()
        ),
        (input) => {
          const result = isValidLocale(input);
          
          // Only exact matches should be valid
          const validLocales = ['fr', 'en', 'es', 'de', 'ru'];
          expect(result).toBe(validLocales.includes(input));
          
          // Case sensitivity check
          if (input && validLocales.includes(input.toLowerCase()) && input !== input.toLowerCase()) {
            expect(result).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: multilingual-expansion, Property 2: Locale Validation Correctness
  it('should maintain consistency between isValidLocale and locales array', () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        const isValid = isValidLocale(input);
        const inArray = locales.includes(input as any);
        
        // isValidLocale should match whether the input is in the locales array
        expect(isValid).toBe(inArray);
      }),
      { numRuns: 100 }
    );
  });
});
