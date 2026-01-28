import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { getTextDirection } from '../formatting';
import { locales } from '../config';
import { Locale } from '@/types';

describe('Cultural Adaptation Property Tests', () => {
  // Feature: multilingual-expansion, Property 15: Text Direction Consistency
  // **Validates: Requirements 9.5**
  describe('Property 15: Text Direction Consistency', () => {
    it('should return ltr for all supported locales', () => {
      fc.assert(
        fc.property(fc.constantFrom(...locales), (locale: Locale) => {
          const direction = getTextDirection(locale);
          expect(direction).toBe('ltr');
        }),
        { numRuns: 100 }
      );
    });

    it('should consistently return ltr regardless of input order', () => {
      fc.assert(
        fc.property(
          fc.shuffledSubarray(locales as unknown as Locale[], {
            minLength: 1,
            maxLength: locales.length,
          }),
          (shuffledLocales: Locale[]) => {
            shuffledLocales.forEach((locale) => {
              const direction = getTextDirection(locale);
              expect(direction).toBe('ltr');
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return ltr for any valid locale repeated multiple times', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...locales),
          fc.integer({ min: 1, max: 10 }),
          (locale: Locale, repeatCount: number) => {
            for (let i = 0; i < repeatCount; i++) {
              const direction = getTextDirection(locale);
              expect(direction).toBe('ltr');
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
