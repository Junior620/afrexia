import { RFQDraftData } from './rfq-schema';

const DRAFT_KEY = 'rfq_draft';
const DRAFT_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

interface DraftStorage {
  data: Partial<RFQDraftData>;
  timestamp: number;
}

/**
 * Save RFQ form draft to localStorage
 * Requirements: 3.6, 3.8
 */
export function saveDraft(data: Partial<RFQDraftData>): void {
  if (typeof window === 'undefined') return;

  try {
    const storage: DraftStorage = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error('Failed to save draft:', error);
  }
}

/**
 * Load RFQ form draft from localStorage
 * Returns null if draft doesn't exist or has expired
 */
export function loadDraft(): Partial<RFQDraftData> | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (!stored) return null;

    const storage: DraftStorage = JSON.parse(stored);
    const age = Date.now() - storage.timestamp;

    // Check if draft has expired (7 days)
    if (age > DRAFT_TTL) {
      clearDraft();
      return null;
    }

    return storage.data;
  } catch (error) {
    console.error('Failed to load draft:', error);
    return null;
  }
}

/**
 * Clear RFQ form draft from localStorage
 */
export function clearDraft(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    console.error('Failed to clear draft:', error);
  }
}

/**
 * Check if a draft exists and is valid
 */
export function hasDraft(): boolean {
  return loadDraft() !== null;
}
