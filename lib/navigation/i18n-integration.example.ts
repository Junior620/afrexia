/**
 * Navigation i18n Integration Examples
 * 
 * This file demonstrates how to use the navigation i18n integration
 * in various scenarios.
 */

import {
  getCurrentLocale,
  NavigationErrors,
  NavigationAriaLabels,
  NavigationPlaceholders,
  announceToScreenReader
} from './i18n-integration';

// Example 1: Using error messages in storage operations
function handleStorageError(error: Error) {
  if (error.name === 'QuotaExceededError') {
    const errorMsg = NavigationErrors.storageQuotaExceeded();
    console.error(errorMsg);
  } else {
    const errorMsg = NavigationErrors.storageUnavailable();
    console.error(errorMsg);
  }
}

// Example 2: Announcing state restoration to screen readers
function announceRestoration(type: 'scroll' | 'section' | 'focus') {
  switch (type) {
    case 'scroll':
      NavigationAriaLabels.announceScrollPositionRestored();
      break;
    case 'section':
      NavigationAriaLabels.announceSectionRestored();
      break;
    case 'focus':
      NavigationAriaLabels.announceFocusRestored();
      break;
  }
}

// Example 3: Using placeholders in UI components
function getLoadingMessage(): string {
  return NavigationPlaceholders.restoringPosition();
}

// Example 4: Getting locale-specific messages
function getErrorMessageForLocale(locale: 'fr' | 'en' | 'es' | 'de' | 'ru') {
  return NavigationErrors.restorationFailed(locale);
}

// Example 5: Custom screen reader announcement
function announceCustomMessage(message: string, urgent: boolean = false) {
  announceToScreenReader(message, urgent ? 'assertive' : 'polite');
}

// Example 6: Detecting current locale
function logCurrentLocale() {
  const locale = getCurrentLocale();
  console.log(`Current locale: ${locale}`);
}

// Example 7: Error handling with localized messages
async function restoreNavigationState() {
  try {
    // ... restoration logic ...
    NavigationAriaLabels.announceNavigationRestored();
  } catch (error) {
    const errorMsg = NavigationErrors.restorationFailed();
    console.error(errorMsg);
    announceToScreenReader(errorMsg, 'assertive');
  }
}

// Example 8: Using in a React component
/*
import { NavigationAriaLabels, NavigationPlaceholders } from '@/lib/navigation';

function NavigationStateIndicator({ isRestoring }: { isRestoring: boolean }) {
  if (!isRestoring) return null;
  
  return (
    <div role="status" aria-live="polite">
      {NavigationPlaceholders.restoringPosition()}
    </div>
  );
}
*/

// Example 9: Focus restoration with announcement
function restoreFocusWithAnnouncement(elementId: string): boolean {
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.warn(NavigationErrors.elementNotFound());
    return false;
  }
  
  element.focus();
  NavigationAriaLabels.announceFocusRestored();
  return true;
}

// Example 10: Conditional announcements based on success
function handleRestorationResult(success: boolean, type: 'scroll' | 'section') {
  if (success) {
    if (type === 'scroll') {
      NavigationAriaLabels.announceScrollPositionRestored();
    } else {
      NavigationAriaLabels.announceSectionRestored();
    }
  } else {
    const errorMsg = NavigationErrors.restorationFailed();
    announceToScreenReader(errorMsg, 'assertive');
  }
}

export {
  handleStorageError,
  announceRestoration,
  getLoadingMessage,
  getErrorMessageForLocale,
  announceCustomMessage,
  logCurrentLocale,
  restoreNavigationState,
  restoreFocusWithAnnouncement,
  handleRestorationResult
};
