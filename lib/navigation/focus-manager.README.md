# Focus Manager

## Overview

The `FocusManager` class manages focus capture and restoration during navigation to preserve user interaction context when using browser back/forward buttons. It ensures that when users navigate back to a page, their keyboard focus is restored to the element they were interacting with.

## Features

- **Focus Capture**: Stores the ID of the currently focused element
- **Focus Restoration**: Restores focus to a previously focused element with existence and focusability checks
- **Visibility Management**: Automatically scrolls restored elements into view
- **Graceful Fallback**: Handles missing or non-focusable elements without errors
- **Accessibility**: Respects `prefers-reduced-motion` and validates focusable elements

## Requirements Validation

This implementation validates the following requirements from `responsive-intelligent-navigation/requirements.md`:

- **19.1**: Restore focus to form fields on back navigation if they still exist
- **19.2**: Restore focus to CTA buttons on back navigation if they still exist
- **19.3**: Allow natural focus flow when previously focused element no longer exists
- **19.4**: Store focused element's identifier as part of scroll state
- **19.5**: Ensure focused element is visible in viewport when restoring focus

## Usage

### Basic Usage

```typescript
import { focusManager } from '@/lib/navigation';

// Capture focus before navigation
const focusedElementId = focusManager.captureFocus();
// Returns: "contact-form-email" or null

// Later, restore focus after navigation
const restored = focusManager.restoreFocus(focusedElementId);
// Returns: true if successful, false if element doesn't exist or isn't focusable
```

### Integration with Navigation State

```typescript
import { focusManager } from '@/lib/navigation';
import { NavigationState } from '@/types/navigation';

// Capture state including focus
const state: NavigationState = {
  key: '/contact',
  scrollY: 500,
  scrollX: 0,
  timestamp: Date.now(),
  route: '/contact',
  focusedElementId: focusManager.captureFocus() // Capture focus
};

// Restore state including focus
if (state.focusedElementId) {
  focusManager.restoreFocus(state.focusedElementId);
}
```

### Custom Configuration

```typescript
import { FocusManager } from '@/lib/navigation';

const customFocusManager = new FocusManager({
  scrollIntoView: true,           // Scroll element into view (default: true)
  scrollBehavior: 'smooth',       // Smooth or instant scroll (default: 'smooth')
  scrollBlock: 'center'           // Vertical alignment (default: 'center')
});

// Use custom instance
const focusId = customFocusManager.captureFocus();
customFocusManager.restoreFocus(focusId);
```

### Checking Focus Capability

```typescript
import { focusManager } from '@/lib/navigation';

// Check if an element can be focused before attempting restoration
const elementId = 'submit-button';

if (focusManager.canRestoreFocus(elementId)) {
  focusManager.restoreFocus(elementId);
} else {
  console.log('Element cannot be focused, allowing natural focus flow');
}
```

### Manual Visibility Control

```typescript
import { focusManager } from '@/lib/navigation';

// Get element and ensure it's visible
const element = document.getElementById('important-field');

if (element) {
  focusManager.ensureVisible(element);
}
```

### Utility Methods

```typescript
import { focusManager } from '@/lib/navigation';

// Get currently focused element ID
const currentFocusId = focusManager.getCurrentFocusId();
console.log('Currently focused:', currentFocusId);

// Clear focus from current element
focusManager.clearFocus();
```

## API Reference

### Constructor

```typescript
constructor(config?: FocusManagerConfig)
```

**Parameters:**
- `config.scrollIntoView` (boolean, optional): Whether to scroll element into view when restoring focus. Default: `true`
- `config.scrollBehavior` (ScrollBehavior, optional): Scroll behavior ('smooth' or 'auto'). Default: `'smooth'`
- `config.scrollBlock` (ScrollLogicalPosition, optional): Vertical alignment ('start', 'center', 'end', 'nearest'). Default: `'center'`

### Methods

#### `captureFocus(): string | null`

Captures the ID of the currently focused element.

**Returns:**
- `string`: ID of the focused element
- `null`: If no element is focused, element is body, or element has no ID

**Example:**
```typescript
const focusId = focusManager.captureFocus();
if (focusId) {
  console.log('Captured focus:', focusId);
}
```

#### `restoreFocus(elementId: string): boolean`

Restores focus to an element by its ID.

**Parameters:**
- `elementId`: ID of the element to focus

**Returns:**
- `true`: Focus was successfully restored
- `false`: Element doesn't exist, isn't focusable, or restoration failed

**Example:**
```typescript
const success = focusManager.restoreFocus('email-input');
if (!success) {
  console.log('Focus restoration failed, using natural focus flow');
}
```

#### `ensureVisible(element: HTMLElement): void`

Ensures an element is visible in the viewport by scrolling if necessary.

**Parameters:**
- `element`: HTMLElement to make visible

**Example:**
```typescript
const element = document.getElementById('target');
if (element) {
  focusManager.ensureVisible(element);
}
```

#### `canRestoreFocus(elementId: string): boolean`

Checks if an element exists and is focusable.

**Parameters:**
- `elementId`: ID of the element to check

**Returns:**
- `true`: Element exists and is focusable
- `false`: Element doesn't exist or isn't focusable

**Example:**
```typescript
if (focusManager.canRestoreFocus('submit-btn')) {
  focusManager.restoreFocus('submit-btn');
}
```

#### `getCurrentFocusId(): string | null`

Gets the ID of the currently focused element.

**Returns:**
- `string`: ID of the focused element
- `null`: If no element is focused or element has no ID

**Example:**
```typescript
const currentId = focusManager.getCurrentFocusId();
console.log('Current focus:', currentId);
```

#### `clearFocus(): void`

Clears focus from the currently focused element.

**Example:**
```typescript
focusManager.clearFocus();
```

## Focusability Rules

An element is considered focusable if ALL of the following are true:

1. **Not Disabled**: Element doesn't have `disabled` attribute
2. **Not Hidden**: Element doesn't have `display: none` or `visibility: hidden`
3. **Not Transparent**: Element doesn't have `opacity: 0`
4. **Not Inert**: Element or ancestors don't have `inert` or `aria-hidden="true"`
5. **Focusable Type**: Element is either:
   - Naturally focusable (links with href, buttons, form inputs, textarea, select)
   - Has `contenteditable` attribute
   - Has `tabindex >= -1`

## Naturally Focusable Elements

The following elements are naturally focusable:

- `<a>` with `href` attribute
- `<button>`
- `<input>` (except `type="hidden"`)
- `<textarea>`
- `<select>`
- Elements with `contenteditable` attribute

## Accessibility Considerations

### Prefers Reduced Motion

The FocusManager respects the user's `prefers-reduced-motion` setting:

```typescript
// If user prefers reduced motion, scrollIntoView uses 'auto' behavior
// Otherwise, uses configured behavior (default: 'smooth')
```

### Screen Reader Compatibility

- Focus restoration works seamlessly with screen readers
- Natural focus flow is preserved when restoration fails
- No disruptive announcements or focus traps

### Keyboard Navigation

- Restored focus maintains keyboard navigation context
- Tab order is preserved
- Focus indicators remain visible

## Error Handling

The FocusManager handles errors gracefully:

1. **Element Not Found**: Returns `false`, allows natural focus flow
2. **Element Not Focusable**: Returns `false`, no error thrown
3. **Focus Failed**: Logs warning, returns `false`
4. **ScrollIntoView Failed**: Logs warning, focus is still set

## Integration Examples

### With State Capture Service

```typescript
import { stateCaptureService, focusManager } from '@/lib/navigation';

// The StateCaptureService already captures focus automatically
const state = stateCaptureService.captureCurrentState();
console.log('Captured focus:', state.focusedElementId);

// Restore focus from captured state
if (state.focusedElementId) {
  focusManager.restoreFocus(state.focusedElementId);
}
```

### With Navigation Manager

```typescript
// In NavigationManager (future implementation)
class NavigationManager {
  private handleBackNavigation(state: NavigationState) {
    // Restore scroll position first
    await stateRestorationService.restoreState(state);
    
    // Then restore focus
    if (state.focusedElementId) {
      focusManager.restoreFocus(state.focusedElementId);
    }
  }
}
```

### Form Interaction Example

```typescript
// User fills out a form
const emailInput = document.getElementById('email-input');
emailInput?.focus();

// Before navigation, capture focus
const focusId = focusManager.captureFocus(); // "email-input"

// User navigates away and comes back
// Restore focus to continue form
focusManager.restoreFocus(focusId); // User can continue typing
```

## Testing

### Unit Test Example

```typescript
import { FocusManager } from '@/lib/navigation/focus-manager';

describe('FocusManager', () => {
  let focusManager: FocusManager;

  beforeEach(() => {
    focusManager = new FocusManager();
  });

  it('should capture focus from focused element with ID', () => {
    const input = document.createElement('input');
    input.id = 'test-input';
    document.body.appendChild(input);
    input.focus();

    const focusId = focusManager.captureFocus();
    expect(focusId).toBe('test-input');

    document.body.removeChild(input);
  });

  it('should restore focus to existing element', () => {
    const button = document.createElement('button');
    button.id = 'test-button';
    document.body.appendChild(button);

    const success = focusManager.restoreFocus('test-button');
    expect(success).toBe(true);
    expect(document.activeElement).toBe(button);

    document.body.removeChild(button);
  });

  it('should return false when element does not exist', () => {
    const success = focusManager.restoreFocus('non-existent');
    expect(success).toBe(false);
  });
});
```

## Performance Considerations

- **Lightweight**: Minimal overhead, only checks when needed
- **No Polling**: Uses direct DOM queries, no continuous monitoring
- **Efficient Checks**: Focusability checks are optimized
- **Lazy Evaluation**: Only scrolls into view if element is not visible

## Browser Compatibility

- **Modern Browsers**: Full support in Chrome, Firefox, Safari, Edge
- **Mobile Browsers**: Full support in iOS Safari, Chrome Mobile
- **Fallback**: Gracefully degrades if features are unavailable

## Limitations

1. **ID Required**: Only elements with ID attributes can be captured/restored
2. **Same Page**: Focus restoration only works within the same page context
3. **Dynamic Content**: If element is removed and recreated, restoration may fail
4. **Shadow DOM**: Limited support for elements inside shadow DOM

## Best Practices

1. **Add IDs to Interactive Elements**: Ensure form fields and buttons have unique IDs
2. **Test Focus Flow**: Verify focus restoration works in your navigation flows
3. **Handle Failures Gracefully**: Always check return value of `restoreFocus()`
4. **Combine with Scroll Restoration**: Restore scroll position before focus
5. **Respect User Preferences**: The manager already respects `prefers-reduced-motion`

## Related Documentation

- [State Capture Service](./state-capture-service.README.md)
- [State Restoration Service](./state-restoration-service.README.md)
- [Navigation Types](../../types/navigation.ts)
- [Requirements Document](../../.kiro/specs/responsive-intelligent-navigation/requirements.md)
