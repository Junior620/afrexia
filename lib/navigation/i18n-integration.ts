/**
 * Navigation i18n Integration
 * 
 * Provides locale-aware error messages, ARIA labels, and placeholders
 * for the navigation state management system.
 * 
 * Requirements: 20.1, 20.2, 20.3, 20.4
 * from responsive-intelligent-navigation/requirements.md
 */

import { Locale } from '@/types';
import { getTranslation } from '@/lib/i18n/translations';

/**
 * Get the current locale from the document
 * Falls back to French if not found
 * 
 * @returns Current locale
 */
export function getCurrentLocale(): Locale {
  if (typeof document === 'undefined') {
    return 'fr';
  }

  const htmlLang = document.documentElement.lang;
  
  // Extract locale from lang attribute (e.g., 'fr-FR' -> 'fr')
  const locale = htmlLang.split('-')[0].toLowerCase();
  
  // Validate locale
  const validLocales: Locale[] = ['fr', 'en', 'es', 'de', 'ru'];
  if (validLocales.includes(locale as Locale)) {
    return locale as Locale;
  }
  
  return 'fr';
}

/**
 * Get a navigation state translation
 * 
 * @param key - Translation key (e.g., 'errors.storageUnavailable')
 * @param locale - Optional locale (defaults to current document locale)
 * @returns Translated string
 */
export function getNavigationTranslation(key: string, locale?: Locale): string {
  const currentLocale = locale || getCurrentLocale();
  return getTranslation(currentLocale, `navigationState.${key}`);
}

/**
 * Announce a message to screen readers
 * 
 * Creates a temporary live region to announce the message,
 * then removes it after the announcement is complete.
 * 
 * @param message - The message to announce
 * @param priority - The aria-live priority ('polite' or 'assertive')
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  if (typeof document === 'undefined') {
    return;
  }

  // Create live region
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only'; // Visually hidden but accessible
  liveRegion.style.position = 'absolute';
  liveRegion.style.left = '-10000px';
  liveRegion.style.width = '1px';
  liveRegion.style.height = '1px';
  liveRegion.style.overflow = 'hidden';

  // Add to document
  document.body.appendChild(liveRegion);

  // Set message (triggers announcement)
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 100);

  // Remove after announcement
  setTimeout(() => {
    if (document.body.contains(liveRegion)) {
      document.body.removeChild(liveRegion);
    }
  }, 1000);
}

/**
 * Navigation error messages
 * Provides locale-aware error messages for navigation operations
 */
export const NavigationErrors = {
  /**
   * Get error message for storage unavailable
   * 
   * @param locale - Optional locale
   * @returns Error message
   */
  storageUnavailable(locale?: Locale): string {
    return getNavigationTranslation('errors.storageUnavailable', locale);
  },

  /**
   * Get error message for storage quota exceeded
   * 
   * @param locale - Optional locale
   * @returns Error message
   */
  storageQuotaExceeded(locale?: Locale): string {
    return getNavigationTranslation('errors.storageQuotaExceeded', locale);
  },

  /**
   * Get error message for corrupted state
   * 
   * @param locale - Optional locale
   * @returns Error message
   */
  stateCorrupted(locale?: Locale): string {
    return getNavigationTranslation('errors.stateCorrupted', locale);
  },

  /**
   * Get error message for restoration failure
   * 
   * @param locale - Optional locale
   * @returns Error message
   */
  restorationFailed(locale?: Locale): string {
    return getNavigationTranslation('errors.restorationFailed', locale);
  },

  /**
   * Get error message for capture failure
   * 
   * @param locale - Optional locale
   * @returns Error message
   */
  captureFailedGeneric(locale?: Locale): string {
    return getNavigationTranslation('errors.captureFailedGeneric', locale);
  },

  /**
   * Get error message for invalid state key
   * 
   * @param locale - Optional locale
   * @returns Error message
   */
  invalidStateKey(locale?: Locale): string {
    return getNavigationTranslation('errors.invalidStateKey', locale);
  },

  /**
   * Get error message for element not found
   * 
   * @param locale - Optional locale
   * @returns Error message
   */
  elementNotFound(locale?: Locale): string {
    return getNavigationTranslation('errors.elementNotFound', locale);
  },

  /**
   * Get error message for focus restoration failure
   * 
   * @param locale - Optional locale
   * @returns Error message
   */
  focusRestorationFailed(locale?: Locale): string {
    return getNavigationTranslation('errors.focusRestorationFailed', locale);
  },
};

/**
 * Navigation ARIA labels
 * Provides locale-aware ARIA labels for screen reader announcements
 */
export const NavigationAriaLabels = {
  /**
   * Get ARIA label for navigation restored
   * 
   * @param locale - Optional locale
   * @returns ARIA label
   */
  navigationRestored(locale?: Locale): string {
    return getNavigationTranslation('aria.navigationRestored', locale);
  },

  /**
   * Get ARIA label for scroll position restored
   * 
   * @param locale - Optional locale
   * @returns ARIA label
   */
  scrollPositionRestored(locale?: Locale): string {
    return getNavigationTranslation('aria.scrollPositionRestored', locale);
  },

  /**
   * Get ARIA label for section restored
   * 
   * @param locale - Optional locale
   * @returns ARIA label
   */
  sectionRestored(locale?: Locale): string {
    return getNavigationTranslation('aria.sectionRestored', locale);
  },

  /**
   * Get ARIA label for focus restored
   * 
   * @param locale - Optional locale
   * @returns ARIA label
   */
  focusRestored(locale?: Locale): string {
    return getNavigationTranslation('aria.focusRestored', locale);
  },

  /**
   * Get ARIA label for state capturing
   * 
   * @param locale - Optional locale
   * @returns ARIA label
   */
  stateCapturing(locale?: Locale): string {
    return getNavigationTranslation('aria.stateCapturing', locale);
  },

  /**
   * Get ARIA label for layout stabilizing
   * 
   * @param locale - Optional locale
   * @returns ARIA label
   */
  layoutStabilizing(locale?: Locale): string {
    return getNavigationTranslation('aria.layoutStabilizing', locale);
  },

  /**
   * Announce navigation restored to screen readers
   * 
   * @param locale - Optional locale
   */
  announceNavigationRestored(locale?: Locale): void {
    const message = this.navigationRestored(locale);
    announceToScreenReader(message, 'polite');
  },

  /**
   * Announce scroll position restored to screen readers
   * 
   * @param locale - Optional locale
   */
  announceScrollPositionRestored(locale?: Locale): void {
    const message = this.scrollPositionRestored(locale);
    announceToScreenReader(message, 'polite');
  },

  /**
   * Announce section restored to screen readers
   * 
   * @param locale - Optional locale
   */
  announceSectionRestored(locale?: Locale): void {
    const message = this.sectionRestored(locale);
    announceToScreenReader(message, 'polite');
  },

  /**
   * Announce focus restored to screen readers
   * 
   * @param locale - Optional locale
   */
  announceFocusRestored(locale?: Locale): void {
    const message = this.focusRestored(locale);
    announceToScreenReader(message, 'polite');
  },
};

/**
 * Navigation placeholders
 * Provides locale-aware placeholder text
 */
export const NavigationPlaceholders = {
  /**
   * Get placeholder for loading state
   * 
   * @param locale - Optional locale
   * @returns Placeholder text
   */
  loadingState(locale?: Locale): string {
    return getNavigationTranslation('placeholders.loadingState', locale);
  },

  /**
   * Get placeholder for restoring position
   * 
   * @param locale - Optional locale
   * @returns Placeholder text
   */
  restoringPosition(locale?: Locale): string {
    return getNavigationTranslation('placeholders.restoringPosition', locale);
  },

  /**
   * Get placeholder for capturing state
   * 
   * @param locale - Optional locale
   * @returns Placeholder text
   */
  capturingState(locale?: Locale): string {
    return getNavigationTranslation('placeholders.capturingState', locale);
  },
};
