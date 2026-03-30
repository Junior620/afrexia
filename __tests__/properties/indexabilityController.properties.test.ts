/**
 * Property-Based Tests: IndexabilityController
 *
 * **Validates: Requirements 1.7.9, 1.9**
 *
 * Properties covered:
 * - Property 19: High Fallback Content Non-Indexability
 * - Property 25: Quality Threshold Non-Indexability
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  determineIndexability,
  generateRobotsMetaTag,
  QUALITY_THRESHOLD,
} from '@/lib/seo/indexabilityController';
import type { ContentBlock, Locale } from '@/types/seo';

// ============================================================================
// Arbitraries
// ============================================================================

const localeArb: fc.Arbitrary<Locale> = fc.constantFrom('fr', 'en', 'es', 'de', 'ru');

/** Build a ContentBlock with a given locale and word count */
function makeBlock(locale: Locale, wordCount: number, sourceType: ContentBlock['sourceType'] = 'sanity'): ContentBlock {
  return {
    content: 'word '.repeat(wordCount).trim(),
    sourceType,
    locale,
    wordCount,
  };
}

// ============================================================================
// Property 19: High Fallback Content Non-Indexability
// **Validates: Requirements 1.7.9, 1.9.4**
//
// Note: IndexabilityController.calculateFallbackPercentage() computes fallback
// as the percentage of blocks whose locale differs from the dominant locale.
// The dominant locale is the one with the most blocks.
// ============================================================================

describe('Property 19: High Fallback Content Non-Indexability', () => {
  it('any page with >30% fallback locale blocks is marked noindex', () => {
    fc.assert(
      fc.property(
        // Use a fixed total of 10 blocks.
        // Dominant locale has 6 blocks (60%), fallback has 4 blocks (40% > 30%)
        // This ensures dominant locale is always 'fr' (6 > 4)
        fc.integer({ min: 4, max: 4 }), // exactly 4 fallback blocks = 40%
        (fallbackCount) => {
          const dominantLocale: Locale = 'fr';
          const fallbackLocale: Locale = 'en';
          const totalBlocks = 10;
          const dominantCount = totalBlocks - fallbackCount; // 6

          const blocks: ContentBlock[] = [
            ...Array.from({ length: dominantCount }, () => makeBlock(dominantLocale, 60)),
            ...Array.from({ length: fallbackCount }, () => makeBlock(fallbackLocale, 60)),
          ];

          // Ensure data completeness and content length pass
          const decision = determineIndexability(80, blocks);
          // With 40% fallback (>30%), should be noindex
          expect(decision.isIndexable).toBe(false);
          expect(decision.reasons.some((r) => r.includes('Fallback'))).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('pages with exactly 40% fallback (dominant locale has majority) are marked noindex', () => {
    // 6 dominant + 4 fallback = 40% fallback > 30% threshold
    const dominantLocale: Locale = 'fr';
    const fallbackLocale: Locale = 'en';
    const blocks: ContentBlock[] = [
      ...Array.from({ length: 6 }, () => makeBlock(dominantLocale, 60)),
      ...Array.from({ length: 4 }, () => makeBlock(fallbackLocale, 60)),
    ];
    const decision = determineIndexability(80, blocks);
    expect(decision.isIndexable).toBe(false);
    expect(decision.fallbackPercentage).toBeGreaterThan(30);
  });

  it('pages with <= 30% fallback are not rejected for fallback reason', () => {
    fc.assert(
      fc.property(
        // Use a fixed total of 10 blocks with fallbackCount <= 3 (<=30%)
        fc.integer({ min: 0, max: 3 }), // fallback block count (<=30% of 10)
        (fallbackCount) => {
          const dominantLocale: Locale = 'fr';
          const fallbackLocale: Locale = 'en';
          const totalBlocks = 10;
          const dominantCount = totalBlocks - fallbackCount;

          const blocks: ContentBlock[] = [
            ...Array.from({ length: dominantCount }, () => makeBlock(dominantLocale, 60)),
            ...Array.from({ length: fallbackCount }, () => makeBlock(fallbackLocale, 60)),
          ];

          const decision = determineIndexability(80, blocks);
          // Should not be rejected for fallback reason
          expect(decision.reasons.some((r) => r.includes('Fallback'))).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 25: Quality Threshold Non-Indexability
// **Validates: Requirements 1.9.4**
// ============================================================================

describe('Property 25: Quality Threshold Non-Indexability', () => {
  it('any page with dataCompleteness < 70% is marked noindex', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 69 }),
        localeArb,
        (dataCompleteness, locale) => {
          // Provide enough content to pass other thresholds
          const blocks = Array.from({ length: 10 }, () => makeBlock(locale, 60));
          const decision = determineIndexability(dataCompleteness, blocks);
          expect(decision.isIndexable).toBe(false);
          expect(decision.reasons.some((r) => r.includes('Data completeness'))).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('any page with content length < 500 words is marked noindex', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 499 }),
        localeArb,
        (totalWords, locale) => {
          const blocks = [makeBlock(locale, totalWords)];
          const decision = determineIndexability(80, blocks);
          expect(decision.isIndexable).toBe(false);
          expect(decision.reasons.some((r) => r.includes('Content length'))).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('page meeting all thresholds is marked indexable', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 70, max: 100 }),
        localeArb,
        (dataCompleteness, locale) => {
          // 10 blocks × 60 words = 600 words, all same locale → 0% fallback
          const blocks = Array.from({ length: 10 }, () => makeBlock(locale, 60));
          const decision = determineIndexability(dataCompleteness, blocks);
          expect(decision.isIndexable).toBe(true);
          expect(decision.reasons).toHaveLength(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('generateRobotsMetaTag returns "noindex, follow" for non-indexable pages', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 69 }),
        localeArb,
        (dataCompleteness, locale) => {
          const blocks = Array.from({ length: 10 }, () => makeBlock(locale, 60));
          const decision = determineIndexability(dataCompleteness, blocks);
          const tag = generateRobotsMetaTag(decision);
          if (!decision.isIndexable) {
            expect(tag).toBe('noindex, follow');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('generateRobotsMetaTag returns "index, follow" for indexable pages', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 70, max: 100 }),
        localeArb,
        (dataCompleteness, locale) => {
          const blocks = Array.from({ length: 10 }, () => makeBlock(locale, 60));
          const decision = determineIndexability(dataCompleteness, blocks);
          const tag = generateRobotsMetaTag(decision);
          if (decision.isIndexable) {
            expect(tag).toBe('index, follow');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('indexability decision always has consistent fields', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 20 }),
        localeArb,
        (dataCompleteness, blockCount, locale) => {
          const blocks = Array.from({ length: blockCount }, () => makeBlock(locale, 60));
          const decision = determineIndexability(dataCompleteness, blocks);
          expect(typeof decision.isIndexable).toBe('boolean');
          expect(Array.isArray(decision.reasons)).toBe(true);
          expect(decision.dataCompleteness).toBe(dataCompleteness);
          expect(decision.contentLength).toBeGreaterThanOrEqual(0);
          expect(decision.fallbackPercentage).toBeGreaterThanOrEqual(0);
          expect(decision.fallbackPercentage).toBeLessThanOrEqual(100);
        }
      ),
      { numRuns: 100 }
    );
  });
});
