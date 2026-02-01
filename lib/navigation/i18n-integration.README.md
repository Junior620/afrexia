# Navigation i18n Integration

This module provides internationalization support for the navigation state management system, including localized error messages, ARIA labels, and placeholder text.

## Requirements

Validates Requirements 20.1, 20.2, 20.3, 20.4 from `responsive-intelligent-navigation/requirements.md`:
- 20.1: Display all error messages in French for the French locale
- 20.2: Provide French ARIA labels for all navigation elements
- 20.3: Use French placeholder text for all form inputs
- 20.4: Adapt messages based on the current locale

## Features

### Locale Detection

The module automatically detects the current locale from the document's `lang` attribute:

```typescript
import { getCurrentLocale } from '@/lib/navigation/i18n-integration';

const locale = getCurrentLocale(); // Returns 'fr', 'en', 'es', 'de', or 'ru'
```

### Error Messages

Provides localized error messages for navigation operations:

```typescript
import { NavigationErrors } from '@/lib/navigation/i18n-integration';

// Get error message in current locale
const errorMsg = NavigationErrors.storageUnavailable();

// Get error message in specific locale
const errorMsgFr = NavigationErrors.storageUnavailable('fr');
```

Available error messages:
- `storageUnavailable()` - Session storage is not available
- `storageQuotaExceeded()` - Storage quota exceeded
- `stateCorrupted()` - Saved state is corrupted
- `restorationFailed()` - Failed to restore scroll position
- `captureFailedGeneric()` - Unable to capture current state
- `invalidStateKey()` - Invalid state key
- `elementNotFound()` - Target element not found
- `focusRestorationFailed()` - Unable to restore focus

### ARIA Labels

Provides localized ARIA labels for screen reader announcements:

```typescript
import { NavigationAriaLabels } from '@/lib/navigation/i18n-integration';

// Get ARIA label
const label = NavigationAriaLabels.navigationRestored();

// Announce to screen readers
NavigationAriaLabels.announceNavigationRestored();
NavigationAriaLabels.announceScrollPositionRestored();
NavigationAriaLabels.announceSectionRestored();
NavigationAriaLabels.announceFocusRestored();
```

Available ARIA labels:
- `navigationRestored()` - Navigation restored to previous position
- `scrollPositionRestored()` - Scroll position restored
- `sectionRestored()` - Section restored
- `focusRestored()` - Focus restored to previous element
- `stateCapturing()` - Capturing navigation state
- `layoutStabilizing()` - Stabilizing layout

### Placeholders

Provides localized placeholder text:

```typescript
import { NavigationPlaceholders } from '@/lib/navigation/i18n-integration';

const placeholder = NavigationPlaceholders.loadingState();
```

Available placeholders:
- `loadingState()` - Loading navigation state...
- `restoringPosition()` - Restoring position...
- `capturingState()` - Saving position...

### Screen Reader Announcements

Announce messages to screen readers using ARIA live regions:

```typescript
import { announceToScreenReader } from '@/lib/navigation/i18n-integration';

// Polite announcement (default)
announceToScreenReader('Navigation restored');

// Assertive announcement (interrupts current speech)
announceToScreenReader('Error occurred', 'assertive');
```

## Supported Locales

The module supports the following locales:
- **French (fr)** - Default locale
- **English (en)**
- **Spanish (es)**
- **German (de)**
- **Russian (ru)**

## Usage in Navigation Services

### In StorageAdapter

```typescript
import { NavigationErrors } from '@/lib/navigation/i18n-integration';

try {
  sessionStorage.setItem(key, value);
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    console.error(NavigationErrors.storageQuotaExceeded());
  } else {
    console.error(NavigationErrors.storageUnavailable());
  }
}
```

### In StateRestorationService

```typescript
import { NavigationAriaLabels } from '@/lib/navigation/i18n-integration';

async restoreState(state: NavigationState) {
  // ... restoration logic ...
  
  // Announce to screen readers
  if (result.success) {
    NavigationAriaLabels.announceScrollPositionRestored();
  }
}
```

### In FocusManager

```typescript
import { NavigationErrors, NavigationAriaLabels } from '@/lib/navigation/i18n-integration';

restoreFocus(elementId: string): boolean {
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.warn(NavigationErrors.elementNotFound());
    return false;
  }
  
  element.focus();
  NavigationAriaLabels.announceFocusRestored();
  return true;
}
```

## Translation Structure

Translations are stored in the main i18n system under the `navigationState` key:

```typescript
{
  navigationState: {
    errors: {
      storageUnavailable: "...",
      storageQuotaExceeded: "...",
      // ... more errors
    },
    aria: {
      navigationRestored: "...",
      scrollPositionRestored: "...",
      // ... more ARIA labels
    },
    placeholders: {
      loadingState: "...",
      restoringPosition: "...",
      // ... more placeholders
    }
  }
}
```

## Adding New Translations

To add a new translation:

1. Add the key to all locale files in `lib/i18n/translations/`
2. Update the `NavigationTranslations` interface if needed
3. Add a helper function to the appropriate export object

Example:

```typescript
// In lib/i18n/translations/fr.ts
navigationState: {
  errors: {
    // ... existing errors
    newError: "Nouveau message d'erreur"
  }
}

// In lib/navigation/i18n-integration.ts
export const NavigationErrors = {
  // ... existing errors
  newError(locale?: Locale): string {
    return getNavigationTranslation('errors.newError', locale);
  }
};
```

## Testing

Test the i18n integration by:

1. Setting different `lang` attributes on the document
2. Verifying correct translations are returned
3. Testing screen reader announcements with assistive technology
4. Checking fallback behavior when locale is not found

```typescript
// Test locale detection
document.documentElement.lang = 'fr-FR';
expect(getCurrentLocale()).toBe('fr');

// Test translation retrieval
const errorMsg = NavigationErrors.storageUnavailable('fr');
expect(errorMsg).toContain('stockage de session');

// Test screen reader announcement
announceToScreenReader('Test message');
// Verify live region is created and removed
```

## Best Practices

1. **Always use the helper functions** instead of accessing translations directly
2. **Let locale detection happen automatically** unless you have a specific reason to override
3. **Use polite announcements** for non-critical updates
4. **Use assertive announcements** only for errors or critical information
5. **Test with actual screen readers** to ensure announcements are clear and helpful
6. **Keep messages concise** for better screen reader experience
7. **Avoid announcing too frequently** to prevent overwhelming users

## Accessibility Considerations

- Live regions are created dynamically and removed after announcement
- Announcements use `aria-live="polite"` by default to avoid interrupting users
- Messages are kept concise for better comprehension
- Visual content is hidden using `.sr-only` class
- Announcements are timed to allow screen readers to process them

## Performance

- Locale detection is cached per function call
- Live regions are removed after 1 second to prevent DOM bloat
- Translation lookups are fast (simple object access)
- No external dependencies beyond the main i18n system
