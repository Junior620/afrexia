/**
 * IndexabilityController
 *
 * Determines whether a page should be indexed by search engines based on
 * quality thresholds. Implements Requirement 1.9.
 */

import {
  QualityThreshold,
  IndexabilityDecision,
  IndexabilityReport,
  ContentBlock,
  DEFAULT_QUALITY_THRESHOLD,
} from '@/types/seo';

// ============================================================================
// Quality Thresholds
// ============================================================================

/**
 * Quality thresholds used to determine page indexability.
 * - minDataCompleteness: 70% — data must be sufficiently complete
 * - minContentLength: 500 words — page must have enough unique content
 * - maxFallbackPercentage: 30% — too much fallback content signals low quality
 */
export const QUALITY_THRESHOLD: QualityThreshold = DEFAULT_QUALITY_THRESHOLD;

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Determines whether a page should be indexed based on quality thresholds.
 *
 * Checks three criteria (Requirement 1.9.1–1.9.3):
 * 1. Data completeness >= 70%
 * 2. Content length >= 500 words
 * 3. Fallback percentage <= 30%
 *
 * @param dataCompleteness - Percentage of data fields populated (0–100)
 * @param contentBlocks - Content blocks generated for the page
 * @param threshold - Quality thresholds (defaults to QUALITY_THRESHOLD)
 * @returns IndexabilityDecision with isIndexable flag and reasons
 */
export function determineIndexability(
  dataCompleteness: number,
  contentBlocks: ContentBlock[],
  threshold: QualityThreshold = QUALITY_THRESHOLD
): IndexabilityDecision {
  const reasons: string[] = [];

  // Calculate content metrics from blocks
  const contentLength = contentBlocks.reduce((sum, block) => sum + block.wordCount, 0);

  // Calculate fallback percentage: blocks where content came from a different locale
  const fallbackPercentage = calculateFallbackPercentage(contentBlocks);

  // Check criterion 1: data completeness
  if (dataCompleteness < threshold.minDataCompleteness) {
    reasons.push(
      `Data completeness ${dataCompleteness}% is below minimum ${threshold.minDataCompleteness}%`
    );
  }

  // Check criterion 2: content length
  if (contentLength < threshold.minContentLength) {
    reasons.push(
      `Content length ${contentLength} words is below minimum ${threshold.minContentLength} words`
    );
  }

  // Check criterion 3: fallback percentage
  if (fallbackPercentage > threshold.maxFallbackPercentage) {
    reasons.push(
      `Fallback content ${fallbackPercentage.toFixed(1)}% exceeds maximum ${threshold.maxFallbackPercentage}%`
    );
  }

  return {
    isIndexable: reasons.length === 0,
    reasons,
    dataCompleteness,
    contentLength,
    fallbackPercentage,
  };
}

/**
 * Generates the robots meta tag value based on indexability decision.
 *
 * Returns "index, follow" for indexable pages and "noindex, follow" for
 * non-indexable pages (Requirement 1.9.4). Always uses "follow" to allow
 * link equity to flow even from non-indexed pages.
 *
 * @param decision - Result from determineIndexability()
 * @returns Robots meta tag value
 */
export function generateRobotsMetaTag(
  decision: IndexabilityDecision
): 'index, follow' | 'noindex, follow' {
  return decision.isIndexable ? 'index, follow' : 'noindex, follow';
}

/**
 * Generates a detailed indexability report for a set of pages.
 *
 * Provides a breakdown of why pages are non-indexable to help
 * content teams improve data quality (Requirement 1.9.7).
 *
 * @param decisions - Map of page identifiers to their indexability decisions
 * @returns IndexabilityReport with counts and reason breakdown
 */
export function generateIndexabilityReport(
  decisions: Map<string, IndexabilityDecision>
): IndexabilityReport {
  const reasonsBreakdown: Record<string, number> = {};
  let indexablePages = 0;
  let nonIndexablePages = 0;

  for (const [, decision] of decisions) {
    if (decision.isIndexable) {
      indexablePages++;
    } else {
      nonIndexablePages++;
      for (const reason of decision.reasons) {
        // Normalize reason to a category key
        const key = categorizeReason(reason);
        reasonsBreakdown[key] = (reasonsBreakdown[key] ?? 0) + 1;
      }
    }
  }

  return {
    totalPages: decisions.size,
    indexablePages,
    nonIndexablePages,
    reasonsBreakdown,
  };
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Calculates the percentage of content blocks that are fallback content.
 * A block is considered fallback if its locale differs from the requested locale,
 * or if it is explicitly marked as a fallback via sourceType.
 *
 * This mirrors the logic in ContentGenerator.calculateFallbackPercentage().
 */
function calculateFallbackPercentage(blocks: ContentBlock[]): number {
  if (blocks.length === 0) return 0;

  // Determine the dominant locale (most common locale in blocks)
  const localeCounts: Record<string, number> = {};
  for (const block of blocks) {
    localeCounts[block.locale] = (localeCounts[block.locale] ?? 0) + 1;
  }
  const dominantLocale = Object.entries(localeCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  if (!dominantLocale) return 0;

  const fallbackCount = blocks.filter((block) => block.locale !== dominantLocale).length;
  return (fallbackCount / blocks.length) * 100;
}

/**
 * Categorizes a reason string into a short key for the report breakdown.
 */
function categorizeReason(reason: string): string {
  if (reason.includes('Data completeness')) return 'low_data_completeness';
  if (reason.includes('Content length')) return 'insufficient_content_length';
  if (reason.includes('Fallback content')) return 'excessive_fallback_content';
  return 'other';
}
