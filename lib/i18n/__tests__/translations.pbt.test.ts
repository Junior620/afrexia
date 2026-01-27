import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { translations, getTranslation } from '../translations';
import { locales } from '../config';
import { Locale } from '@/types';

/**
 * Property-Based Tests for Translation System
 * 
 * This test suite validates universal properties of the translation system:
 * - Property 3: Translation Key Completeness
 * - Property 4: Translation Retrieval Correctness
 * - Property 5: Variable Interpolation Preservation
 */

/**
 * Helper function to get all translation keys from a nested object
 */
function getAllKeys(obj: any, prefix = ''): string[] {
  const keys: string[] = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else if (typeof obj[key] === 'string') {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

/**
 * Helper function to get value from nested object by key path
 */
function getValueByPath(obj: any, path: string): any {
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    value = value?.[key];
  }
  
  return value;
}

describe('Property 3: Translation Key Completeness', () => {
  // Feature: multilingual-expansion, Property 3: Translation Key Completeness
  it('should have all translation keys present in all locales', () => {
    // Get all keys from French (reference locale)
    const frenchKeys = getAllKeys(translations.fr);
    
    // For each locale, verify all French keys exist
    locales.forEach((locale) => {
      const localeKeys = getAllKeys(translations[locale]);
      
      // All French keys should exist in this locale
      frenchKeys.forEach((key) => {
        expect(localeKeys).toContain(key);
      });
      
      // Should have same number of keys
      expect(localeKeys.length).toBe(frenchKeys.length);
    });
  });

  // Feature: multilingual-expansion, Property 3: Translation Key Completeness
  it('should have non-empty string values for all translation keys in all locales', () => {
    const frenchKeys = getAllKeys(translations.fr);
    
    fc.assert(
      fc.property(
        fc.constantFrom(...locales),
        fc.constantFrom(...frenchKeys),
        (locale, key) => {
          const value = getValueByPath(translations[locale], key);
          
          // Value must be a string
          expect(typeof value).toBe('string');
          
          // Value must not be empty
          expect(value.length).toBeGreaterThan(0);
          
          // Value must not be just whitespace
          expect(value.trim().length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: multilingual-expansion, Property 3: Translation Key Completeness
  it('should maintain consistent structure across all locales', () => {
    const referenceStructure = Object.keys(translations.fr);
    
    fc.assert(
      fc.property(fc.constantFrom(...locales), (locale) => {
        const localeStructure = Object.keys(translations[locale]);
        
        // Should have same top-level keys
        expect(localeStructure.sort()).toEqual(referenceStructure.sort());
        
        // Each section should have same structure
        referenceStructure.forEach((section) => {
          const refKeys = Object.keys((translations.fr as any)[section]);
          const localeKeys = Object.keys((translations[locale] as any)[section]);
          
          expect(localeKeys.sort()).toEqual(refKeys.sort());
        });
      }),
      { numRuns: 100 }
    );
  });
});

describe('Property 4: Translation Retrieval Correctness', () => {
  // Feature: multilingual-expansion, Property 4: Translation Retrieval Correctness
  it('should return non-empty string for all valid locale and key combinations', () => {
    const frenchKeys = getAllKeys(translations.fr);
    
    fc.assert(
      fc.property(
        fc.constantFrom(...locales),
        fc.constantFrom(...frenchKeys),
        (locale, key) => {
          const result = getTranslation(locale, key);
          
          // Result must be a string
          expect(typeof result).toBe('string');
          
          // Result must not be empty
          expect(result.length).toBeGreaterThan(0);
          
          // Result should not be the key itself (unless missing)
          const expectedValue = getValueByPath(translations[locale], key);
          expect(result).toBe(expectedValue);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: multilingual-expansion, Property 4: Translation Retrieval Correctness
  it('should return key as fallback for invalid keys', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...locales),
        fc.string().filter((s) => !getAllKeys(translations.fr).includes(s)),
        (locale, invalidKey) => {
          const result = getTranslation(locale, invalidKey);
          
          // Should return the key itself as fallback
          expect(result).toBe(invalidKey);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: multilingual-expansion, Property 4: Translation Retrieval Correctness
  it('should handle nested key paths correctly', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...locales),
        fc.constantFrom(
          'navigation.home',
          'navigation.products',
          'common.learnMore',
          'products.title',
          'footer.copyright'
        ),
        (locale, key) => {
          const result = getTranslation(locale, key);
          const expectedValue = getValueByPath(translations[locale], key);
          
          // Should retrieve correct nested value
          expect(result).toBe(expectedValue);
          
          // Should not return the key itself
          expect(result).not.toBe(key);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: multilingual-expansion, Property 4: Translation Retrieval Correctness
  it('should be deterministic for same inputs', () => {
    const frenchKeys = getAllKeys(translations.fr);
    
    fc.assert(
      fc.property(
        fc.constantFrom(...locales),
        fc.constantFrom(...frenchKeys),
        (locale, key) => {
          const result1 = getTranslation(locale, key);
          const result2 = getTranslation(locale, key);
          
          // Multiple calls with same inputs should return same result
          expect(result1).toBe(result2);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 5: Variable Interpolation Preservation', () => {
  // Feature: multilingual-expansion, Property 5: Variable Interpolation Preservation
  it('should preserve placeholder format in translations', () => {
    fc.assert(
      fc.property(fc.constantFrom(...locales), (locale) => {
        const copyright = getValueByPath(translations[locale], 'footer.copyright');
        
        // Should contain {{year}} placeholder
        expect(copyright).toContain('{{year}}');
        
        // Should match the pattern {{variableName}}
        expect(copyright).toMatch(/\{\{\w+\}\}/);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: multilingual-expansion, Property 5: Variable Interpolation Preservation
  it('should replace all placeholders with provided variables', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...locales),
        fc.string({ minLength: 1, maxLength: 10 }).filter((s) => !s.includes('{')),
        (locale, yearValue) => {
          const result = getTranslation(locale, 'footer.copyright', { year: yearValue });
          
          // Should contain the provided year value
          expect(result).toContain(yearValue);
          
          // Should not contain the placeholder anymore
          expect(result).not.toContain('{{year}}');
          
          // Should contain other expected text
          expect(result).toContain('Afrexia');
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: multilingual-expansion, Property 5: Variable Interpolation Preservation
  it('should preserve placeholder when variable not provided', () => {
    fc.assert(
      fc.property(fc.constantFrom(...locales), (locale) => {
        const result = getTranslation(locale, 'footer.copyright', {});
        
        // Should still contain the placeholder
        expect(result).toContain('{{year}}');
      }),
      { numRuns: 100 }
    );
  });

  // Feature: multilingual-expansion, Property 5: Variable Interpolation Preservation
  it('should handle multiple variable replacements correctly', () => {
    // Create a test string with multiple variables
    const testKey = 'footer.copyright';
    
    fc.assert(
      fc.property(
        fc.constantFrom(...locales),
        fc.record({
          year: fc.string({ minLength: 1, maxLength: 10 }).filter((s) => !s.includes('{')),
        }),
        (locale, variables) => {
          const result = getTranslation(locale, testKey, variables);
          
          // All provided variables should be replaced
          Object.entries(variables).forEach(([key, value]) => {
            expect(result).toContain(value);
            expect(result).not.toContain(`{{${key}}}`);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: multilingual-expansion, Property 5: Variable Interpolation Preservation
  it('should not corrupt surrounding text during interpolation', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...locales),
        fc.string({ minLength: 1, maxLength: 10 }).filter((s) => !s.includes('{')),
        (locale, yearValue) => {
          const original = getValueByPath(translations[locale], 'footer.copyright');
          const result = getTranslation(locale, 'footer.copyright', { year: yearValue });
          
          // Should preserve text before placeholder
          const beforePlaceholder = original.split('{{year}}')[0];
          expect(result).toContain(beforePlaceholder);
          
          // Should preserve text after placeholder
          const afterPlaceholder = original.split('{{year}}')[1];
          expect(result).toContain(afterPlaceholder);
          
          // Length should be: original - placeholder + value
          const expectedLength = original.length - '{{year}}'.length + yearValue.length;
          expect(result.length).toBe(expectedLength);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: multilingual-expansion, Property 5: Variable Interpolation Preservation
  it('should handle special characters in variable values', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...locales),
        fc.oneof(
          fc.constant('2024'),
          fc.constant('2024-2025'),
          fc.constant('2024 & 2025'),
          fc.constant('2024/2025'),
          fc.constant('2024 (test)'),
        ),
        (locale, yearValue) => {
          const result = getTranslation(locale, 'footer.copyright', { year: yearValue });
          
          // Should contain the exact value including special characters
          expect(result).toContain(yearValue);
          
          // Should not contain the placeholder
          expect(result).not.toContain('{{year}}');
        }
      ),
      { numRuns: 100 }
    );
  });
});
