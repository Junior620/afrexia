/**
 * Unit tests for IndexabilityController
 * @see Requirements 1.9
 */

import { describe, it, expect } from 'vitest';
import {
  determineIndexability,
  generateRobotsMetaTag,
  generateIndexabilityReport,
  QUALITY_THRESHOLD,
} from '@/lib/seo/indexabilityController';
import type { ContentBlock, IndexabilityDecision } from '@/types/seo';

// ============================================================================
// Fixtures
// ============================================================================

function makeBlock(
  wordCount: number,
  locale: 'fr' | 'en' | 'es' | 'de' | 'ru' = 'fr',
  sourceType: ContentBlock['sourceType'] = 'sanity'
): ContentBlock {
  return {
    content: 'word '.repeat(wordCount).trim(),
    sourceType,
    locale,
    wordCount,
  };
}

// ============================================================================
// QUALITY_THRESHOLD constants
// ============================================================================

describe('QUALITY_THRESHOLD', () => {
  it('has minDataCompleteness of 70', () => {
    expect(QUALITY_THRESHOLD.minDataCompleteness).toBe(70);
  });

  it('has minContentLength of 500', () => {
    expect(QUALITY_THRESHOLD.minContentLength).toBe(500);
  });

  it('has maxFallbackPercentage of 30', () => {
    expect(QUALITY_THRESHOLD.maxFallbackPercentage).toBe(30);
  });
});

// ============================================================================
// determineIndexability
// ============================================================================

describe('determineIndexability', () => {
  it('returns indexable when all thresholds are met', () => {
    const blocks = [makeBlock(600)];
    const result = determineIndexability(80, blocks);

    expect(result.isIndexable).toBe(true);
    expect(result.reasons).toHaveLength(0);
  });

  it('rejects when dataCompleteness is below 70', () => {
    const blocks = [makeBlock(600)];
    const result = determineIndexability(69, blocks);

    expect(result.isIndexable).toBe(false);
    expect(result.reasons.some((r) => r.includes('Data completeness'))).toBe(true);
  });

  it('accepts when dataCompleteness is exactly 70', () => {
    const blocks = [makeBlock(600)];
    const result = determineIndexability(70, blocks);

    expect(result.isIndexable).toBe(true);
  });

  it('rejects when content length is below 500 words', () => {
    const blocks = [makeBlock(499)];
    const result = determineIndexability(80, blocks);

    expect(result.isIndexable).toBe(false);
    expect(result.reasons.some((r) => r.includes('Content length'))).toBe(true);
  });

  it('accepts when content length is exactly 500 words', () => {
    const blocks = [makeBlock(500)];
    const result = determineIndexability(80, blocks);

    expect(result.isIndexable).toBe(true);
  });

  it('rejects when fallback percentage exceeds 30%', () => {
    // 4 blocks: 3 in 'fr' (dominant), 1 in 'en' (fallback) = 25% — not enough
    // Need >30%: 4 blocks with 2 in 'fr' (dominant) and 2 in 'en' (fallback) = 50%
    const blocks = [
      makeBlock(100, 'fr'),
      makeBlock(100, 'fr'),
      makeBlock(100, 'en'),
      makeBlock(100, 'en'),
    ];
    const result = determineIndexability(80, blocks);

    expect(result.isIndexable).toBe(false);
    expect(result.reasons.some((r) => r.includes('Fallback content'))).toBe(true);
  });

  it('returns all failing reasons when multiple thresholds fail', () => {
    const blocks = [makeBlock(100)]; // too short
    const result = determineIndexability(50, blocks); // low completeness + short content

    expect(result.reasons.length).toBeGreaterThanOrEqual(2);
  });

  it('returns correct dataCompleteness in result', () => {
    const blocks = [makeBlock(600)];
    const result = determineIndexability(85, blocks);

    expect(result.dataCompleteness).toBe(85);
  });

  it('returns correct contentLength in result', () => {
    const blocks = [makeBlock(300), makeBlock(250)];
    const result = determineIndexability(80, blocks);

    expect(result.contentLength).toBe(550);
  });

  it('handles empty content blocks', () => {
    const result = determineIndexability(80, []);

    expect(result.isIndexable).toBe(false);
    expect(result.contentLength).toBe(0);
  });

  it('respects custom threshold', () => {
    const blocks = [makeBlock(300)];
    const customThreshold = {
      minDataCompleteness: 50,
      minContentLength: 200,
      maxFallbackPercentage: 50,
    };
    const result = determineIndexability(60, blocks, customThreshold);

    expect(result.isIndexable).toBe(true);
  });
});

// ============================================================================
// generateRobotsMetaTag
// ============================================================================

describe('generateRobotsMetaTag', () => {
  it('returns "index, follow" for indexable page', () => {
    const decision: IndexabilityDecision = {
      isIndexable: true,
      reasons: [],
      dataCompleteness: 80,
      contentLength: 600,
      fallbackPercentage: 0,
    };

    expect(generateRobotsMetaTag(decision)).toBe('index, follow');
  });

  it('returns "noindex, follow" for non-indexable page', () => {
    const decision: IndexabilityDecision = {
      isIndexable: false,
      reasons: ['Data completeness too low'],
      dataCompleteness: 50,
      contentLength: 600,
      fallbackPercentage: 0,
    };

    expect(generateRobotsMetaTag(decision)).toBe('noindex, follow');
  });
});

// ============================================================================
// generateIndexabilityReport
// ============================================================================

describe('generateIndexabilityReport', () => {
  it('counts indexable and non-indexable pages correctly', () => {
    const decisions = new Map<string, IndexabilityDecision>([
      [
        'page-1',
        {
          isIndexable: true,
          reasons: [],
          dataCompleteness: 80,
          contentLength: 600,
          fallbackPercentage: 0,
        },
      ],
      [
        'page-2',
        {
          isIndexable: false,
          reasons: ['Data completeness 50% is below minimum 70%'],
          dataCompleteness: 50,
          contentLength: 600,
          fallbackPercentage: 0,
        },
      ],
      [
        'page-3',
        {
          isIndexable: false,
          reasons: ['Content length 300 words is below minimum 500 words'],
          dataCompleteness: 80,
          contentLength: 300,
          fallbackPercentage: 0,
        },
      ],
    ]);

    const report = generateIndexabilityReport(decisions);

    expect(report.totalPages).toBe(3);
    expect(report.indexablePages).toBe(1);
    expect(report.nonIndexablePages).toBe(2);
  });

  it('categorizes rejection reasons correctly', () => {
    const decisions = new Map<string, IndexabilityDecision>([
      [
        'page-1',
        {
          isIndexable: false,
          reasons: ['Data completeness 50% is below minimum 70%'],
          dataCompleteness: 50,
          contentLength: 600,
          fallbackPercentage: 0,
        },
      ],
      [
        'page-2',
        {
          isIndexable: false,
          reasons: ['Data completeness 60% is below minimum 70%'],
          dataCompleteness: 60,
          contentLength: 600,
          fallbackPercentage: 0,
        },
      ],
    ]);

    const report = generateIndexabilityReport(decisions);

    expect(report.reasonsBreakdown['low_data_completeness']).toBe(2);
  });

  it('handles empty decisions map', () => {
    const report = generateIndexabilityReport(new Map());

    expect(report.totalPages).toBe(0);
    expect(report.indexablePages).toBe(0);
    expect(report.nonIndexablePages).toBe(0);
    expect(report.reasonsBreakdown).toEqual({});
  });

  it('handles all indexable pages', () => {
    const decisions = new Map<string, IndexabilityDecision>([
      [
        'page-1',
        {
          isIndexable: true,
          reasons: [],
          dataCompleteness: 80,
          contentLength: 600,
          fallbackPercentage: 0,
        },
      ],
    ]);

    const report = generateIndexabilityReport(decisions);

    expect(report.indexablePages).toBe(1);
    expect(report.nonIndexablePages).toBe(0);
    expect(report.reasonsBreakdown).toEqual({});
  });
});
