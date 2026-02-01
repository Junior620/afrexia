/**
 * React Hook for Form State Preservation with Consent
 * 
 * Provides easy integration of form draft saving with:
 * - Consent management
 * - Auto-save functionality
 * - Draft restoration
 * - Expiration handling
 * 
 * Requirements: 14.1, 14.2, 14.3, 14.4, 14.5
 */

import { useEffect, useState, useCallback } from 'react';
import {
  hasFormConsent,
  grantFormConsent,
  revokeFormConsent,
  saveFormDraft,
  loadFormDraft,
  clearFormDraft,
  hasFormDraft,
  getDraftTimeRemaining,
  formatTimeRemaining,
} from '@/lib/forms/form-state-preservation';

interface UseFormStatePreservationOptions {
  formId: string;
  autoSaveDelay?: number; // Delay in ms before auto-saving (default: 1000ms)
  locale?: string;
}

interface UseFormStatePreservationReturn<T> {
  // Consent state
  hasConsent: boolean;
  grantConsent: () => void;
  revokeConsent: () => void;
  
  // Draft state
  hasDraft: boolean;
  draftTimeRemaining: string | null;
  
  // Draft operations
  saveDraft: (data: Partial<T>) => boolean;
  loadDraft: () => Partial<T> | null;
  clearDraft: () => void;
  
  // Auto-save helper
  setupAutoSave: (watchFn: () => Partial<T>) => () => void;
}

/**
 * Hook for managing form state preservation with consent
 * 
 * @example
 * ```tsx
 * const { hasConsent, grantConsent, saveDraft, loadDraft } = useFormStatePreservation({
 *   formId: 'contact-form',
 *   locale: 'fr'
 * });
 * 
 * // Load draft on mount
 * useEffect(() => {
 *   if (hasConsent) {
 *     const draft = loadDraft();
 *     if (draft) {
 *       // Restore form values
 *     }
 *   }
 * }, [hasConsent]);
 * 
 * // Auto-save on form changes
 * useEffect(() => {
 *   return setupAutoSave(() => getValues());
 * }, [setupAutoSave]);
 * ```
 */
export function useFormStatePreservation<T extends Record<string, any>>(
  options: UseFormStatePreservationOptions
): UseFormStatePreservationReturn<T> {
  const { formId, autoSaveDelay = 1000, locale = 'en' } = options;
  
  const [hasConsent, setHasConsent] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Check consent and draft status on mount
  useEffect(() => {
    setHasConsent(hasFormConsent(formId));
    setHasDraft(hasFormDraft(formId));
    
    const remaining = getDraftTimeRemaining(formId);
    setTimeRemaining(remaining);
  }, [formId]);

  // Update time remaining every minute
  useEffect(() => {
    if (!hasDraft) return;

    const interval = setInterval(() => {
      const remaining = getDraftTimeRemaining(formId);
      setTimeRemaining(remaining);
      
      // If draft expired, update state
      if (remaining === null) {
        setHasDraft(false);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [formId, hasDraft]);

  const grantConsentHandler = useCallback(() => {
    grantFormConsent(formId);
    setHasConsent(true);
  }, [formId]);

  const revokeConsentHandler = useCallback(() => {
    revokeFormConsent(formId);
    setHasConsent(false);
    setHasDraft(false);
    setTimeRemaining(null);
  }, [formId]);

  const saveDraftHandler = useCallback((data: Partial<T>): boolean => {
    const success = saveFormDraft(formId, data);
    if (success) {
      setHasDraft(true);
      setTimeRemaining(getDraftTimeRemaining(formId));
    }
    return success;
  }, [formId]);

  const loadDraftHandler = useCallback((): Partial<T> | null => {
    return loadFormDraft<T>(formId);
  }, [formId]);

  const clearDraftHandler = useCallback(() => {
    clearFormDraft(formId);
    setHasDraft(false);
    setTimeRemaining(null);
  }, [formId]);

  const setupAutoSave = useCallback((watchFn: () => Partial<T>) => {
    if (!hasConsent) return () => {};

    let timeoutId: NodeJS.Timeout;

    const handleChange = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const data = watchFn();
        saveDraftHandler(data);
      }, autoSaveDelay);
    };

    // Start watching
    const interval = setInterval(handleChange, autoSaveDelay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [hasConsent, autoSaveDelay, saveDraftHandler]);

  const draftTimeRemainingFormatted = timeRemaining !== null
    ? formatTimeRemaining(timeRemaining, locale)
    : null;

  return {
    hasConsent,
    grantConsent: grantConsentHandler,
    revokeConsent: revokeConsentHandler,
    hasDraft,
    draftTimeRemaining: draftTimeRemainingFormatted,
    saveDraft: saveDraftHandler,
    loadDraft: loadDraftHandler,
    clearDraft: clearDraftHandler,
    setupAutoSave,
  };
}
