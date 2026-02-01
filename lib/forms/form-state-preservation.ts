/**
 * Form State Preservation Service with Consent
 * 
 * Implements opt-in form draft saving with:
 * - User consent requirement
 * - 30-minute expiration
 * - PII exclusion
 * - Clear on successful submit
 * 
 * Requirements: 14.1, 14.2, 14.3, 14.4, 14.5
 */

const CONSENT_KEY_PREFIX = 'form_consent_';
const DRAFT_KEY_PREFIX = 'form_draft_';
const DRAFT_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * PII field patterns to exclude from storage
 * Requirements: 14.3, 10.6
 */
const PII_FIELD_PATTERNS = [
  /name/i,
  /email/i,
  /phone/i,
  /tel/i,
  /password/i,
  /credit[_-]?card/i,
  /card[_-]?number/i,
  /cvv/i,
  /ssn/i,
  /social[_-]?security/i,
  /passport/i,
  /license/i,
  /identification/i,
  /id[_-]?number/i,
  /tax[_-]?id/i,
  /national[_-]?id/i,
];

interface DraftStorage<T> {
  data: Partial<T>;
  timestamp: number;
  formId: string;
}

interface ConsentStorage {
  granted: boolean;
  timestamp: number;
}

/**
 * Check if a field name matches PII patterns
 */
function isPIIField(fieldName: string): boolean {
  return PII_FIELD_PATTERNS.some(pattern => pattern.test(fieldName));
}

/**
 * Filter out PII fields from form data
 * Requirements: 14.3
 */
function filterPIIFields<T extends Record<string, any>>(data: Partial<T>): Partial<T> {
  const filtered: Partial<T> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (!isPIIField(key) && value !== undefined) {
      filtered[key as keyof T] = value;
    }
  }
  
  return filtered;
}

/**
 * Check if user has granted consent for form draft saving
 * Requirements: 14.1
 */
export function hasFormConsent(formId: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const stored = sessionStorage.getItem(`${CONSENT_KEY_PREFIX}${formId}`);
    if (!stored) return false;

    const consent: ConsentStorage = JSON.parse(stored);
    return consent.granted === true;
  } catch (error) {
    console.error('Failed to check form consent:', error);
    return false;
  }
}

/**
 * Grant consent for form draft saving
 * Requirements: 14.1, 14.2
 */
export function grantFormConsent(formId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const consent: ConsentStorage = {
      granted: true,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(`${CONSENT_KEY_PREFIX}${formId}`, JSON.stringify(consent));
  } catch (error) {
    console.error('Failed to grant form consent:', error);
  }
}

/**
 * Revoke consent for form draft saving and clear any stored drafts
 * Requirements: 14.1
 */
export function revokeFormConsent(formId: string): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(`${CONSENT_KEY_PREFIX}${formId}`);
    clearFormDraft(formId);
  } catch (error) {
    console.error('Failed to revoke form consent:', error);
  }
}

/**
 * Save form draft to sessionStorage with consent check
 * Automatically filters out PII fields
 * Requirements: 14.1, 14.2, 14.3
 */
export function saveFormDraft<T extends Record<string, any>>(
  formId: string,
  data: Partial<T>
): boolean {
  if (typeof window === 'undefined') return false;

  // Check consent first
  if (!hasFormConsent(formId)) {
    return false;
  }

  try {
    // Filter out PII fields
    const filteredData = filterPIIFields(data);

    const storage: DraftStorage<T> = {
      data: filteredData,
      timestamp: Date.now(),
      formId,
    };

    sessionStorage.setItem(`${DRAFT_KEY_PREFIX}${formId}`, JSON.stringify(storage));
    return true;
  } catch (error) {
    console.error('Failed to save form draft:', error);
    return false;
  }
}

/**
 * Load form draft from sessionStorage
 * Returns null if draft doesn't exist, has expired, or consent is not granted
 * Requirements: 14.4
 */
export function loadFormDraft<T extends Record<string, any>>(
  formId: string
): Partial<T> | null {
  if (typeof window === 'undefined') return null;

  // Check consent first
  if (!hasFormConsent(formId)) {
    return null;
  }

  try {
    const stored = sessionStorage.getItem(`${DRAFT_KEY_PREFIX}${formId}`);
    if (!stored) return null;

    const storage: DraftStorage<T> = JSON.parse(stored);
    const age = Date.now() - storage.timestamp;

    // Check if draft has expired (30 minutes)
    if (age > DRAFT_TTL) {
      clearFormDraft(formId);
      return null;
    }

    // Verify formId matches
    if (storage.formId !== formId) {
      return null;
    }

    return storage.data;
  } catch (error) {
    console.error('Failed to load form draft:', error);
    return null;
  }
}

/**
 * Clear form draft from sessionStorage
 * Requirements: 14.5
 */
export function clearFormDraft(formId: string): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(`${DRAFT_KEY_PREFIX}${formId}`);
  } catch (error) {
    console.error('Failed to clear form draft:', error);
  }
}

/**
 * Check if a valid draft exists for a form
 * Requirements: 14.4
 */
export function hasFormDraft(formId: string): boolean {
  return loadFormDraft(formId) !== null;
}

/**
 * Get the age of a draft in milliseconds
 * Returns null if no draft exists
 */
export function getDraftAge(formId: string): number | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = sessionStorage.getItem(`${DRAFT_KEY_PREFIX}${formId}`);
    if (!stored) return null;

    const storage: DraftStorage<any> = JSON.parse(stored);
    return Date.now() - storage.timestamp;
  } catch (error) {
    console.error('Failed to get draft age:', error);
    return null;
  }
}

/**
 * Get time remaining before draft expires (in milliseconds)
 * Returns null if no draft exists or draft has expired
 */
export function getDraftTimeRemaining(formId: string): number | null {
  const age = getDraftAge(formId);
  if (age === null) return null;

  const remaining = DRAFT_TTL - age;
  return remaining > 0 ? remaining : null;
}

/**
 * Format time remaining as human-readable string
 */
export function formatTimeRemaining(milliseconds: number, locale: string = 'en'): string {
  const minutes = Math.ceil(milliseconds / 60000);
  
  if (locale === 'fr') {
    return minutes === 1 ? '1 minute' : `${minutes} minutes`;
  }
  
  return minutes === 1 ? '1 minute' : `${minutes} minutes`;
}
