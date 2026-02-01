# Navigation Types

Type definitions and utilities for intelligent navigation and state management.

## Overview

This module provides TypeScript types and utility functions for the intelligent navigation system that captures and restores scroll position, section context, and focus state during browser navigation.

**Requirements**: 7.4, 10.3, 10.5 from `responsive-intelligent-navigation/requirements.md`

## Core Types

### NavigationState

Represents the complete navigation context for a page view.

```typescript
interface NavigationState {
  key: string;                    // Unique identifier (pathname + search)
  scrollY: number;                // Vertical scroll position in pixels
  scrollX: number;                // Horizontal scroll position (usually 0)
  timestamp: number;              // Unix timestamp when captured
  route: string;                  // Full pathname without query params
  sectionId?: string;             // Optional section identifier
  focusedElementId?: string;      // Optional focused element ID
  hash?: string;                  // Optional URL hash fragment
}
```

**Constraints**:
- `key` must be non-empty string
- `scrollY` and `scrollX` must be non-negative
- `timestamp` must be positive Unix timestamp
- `route` must be non-empty string
- Optional fields can be undefined
- Maximum serialized size: ~500 bytes

### RestorationType

Enum defining the priority order for scroll restoration.

```typescript
enum RestorationType {
  HASH = 'hash',        // Priority 1: Hash navigation
  SECTION = 'section',  // Priority 2: Section-based restoration
  SCROLL = 'scroll',    // Priority 3: Scroll position restoration
  TOP = 'top'           // Default: Scroll to top
}
```

### MobileMenuState

Represents the state of the mobile navigation menu.

```typescript
interface MobileMenuState {
  isOpen: boolean;
  focusTrapActive: boolean;
  previousFocusElement: HTMLElement | null;
  animationDuration: 300;
}
```

### NavigationEvent

Represents a navigation event in the system.

```typescript
interface NavigationEvent {
  type: NavigationEventType;
  url: string;
  timestamp: number;
  state?: NavigationState;
}

type NavigationEventType = 
  | 'link-click'
  | 'popstate'
  | 'page-load'
  | 'hash-change'
  | 'programmatic';
```

## Utility Functions

### generateStateKey

Generates a unique state key from pathname and search parameters.

```typescript
function generateStateKey(pathname: string, search?: string): string
```

**Format**: `pathname + (search ? '?' + search : '')`

**Examples**:
```typescript
generateStateKey('/products')
// Returns: "/products"

generateStateKey('/products', 'category=electronics')
// Returns: "/products?category=electronics"

generateStateKey('/products', '?category=electronics')
// Returns: "/products?category=electronics" (normalizes leading ?)

generateStateKey('products', 'category=electronics')
// Returns: "/products?category=electronics" (adds leading /)
```

**Validates**: Requirement 10.3

### isNavigationState

Type guard to check if an object is a valid NavigationState.

```typescript
function isNavigationState(state: unknown): state is NavigationState
```

**Validation Rules**:
- All required fields must be present and correct type
- `key` must be non-empty string
- `scrollY` and `scrollX` must be non-negative numbers
- `timestamp` must be positive number
- `route` must be non-empty string
- Optional fields must be correct type if present

**Example**:
```typescript
const data = JSON.parse(sessionStorage.getItem('state'));

if (isNavigationState(data)) {
  // TypeScript knows data is NavigationState
  console.log(data.scrollY);
} else {
  console.warn('Invalid state data');
}
```

### validateNavigationState

Validates a navigation state object (alias for `isNavigationState`).

```typescript
function validateNavigationState(state: unknown): state is NavigationState
```

**Validates**: Requirement 10.5

## Usage Examples

### Capturing Navigation State

```typescript
import { NavigationState, generateStateKey } from '@/types/navigation';

function captureCurrentState(): NavigationState {
  const pathname = window.location.pathname;
  const search = window.location.search.slice(1);
  
  return {
    key: generateStateKey(pathname, search),
    scrollY: window.scrollY,
    scrollX: window.scrollX,
    timestamp: Date.now(),
    route: pathname,
    hash: window.location.hash,
    sectionId: getCurrentSectionId(),
    focusedElementId: document.activeElement?.id,
  };
}
```

### Validating Stored State

```typescript
import { validateNavigationState } from '@/types/navigation';

function restoreFromStorage(key: string): NavigationState | null {
  try {
    const stored = sessionStorage.getItem(`nav_state_${key}`);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    
    if (validateNavigationState(parsed)) {
      return parsed;
    }
    
    return null;
  } catch {
    return null;
  }
}
```

### Determining Restoration Priority

```typescript
import { RestorationType } from '@/types/navigation';

function determineRestorationType(
  state: NavigationState,
  currentHash: string
): RestorationType {
  if (currentHash) return RestorationType.HASH;
  if (state.sectionId) return RestorationType.SECTION;
  if (state.scrollY > 0) return RestorationType.SCROLL;
  return RestorationType.TOP;
}
```

## Testing

Unit tests are located in `types/__tests__/navigation.test.ts`.

Run tests:
```bash
npm test -- types/__tests__/navigation.test.ts
```

## Related Files

- `types/navigation.ts` - Type definitions and utilities
- `types/navigation.example.ts` - Usage examples
- `types/__tests__/navigation.test.ts` - Unit tests
- `.kiro/specs/responsive-intelligent-navigation/requirements.md` - Requirements
- `.kiro/specs/responsive-intelligent-navigation/design.md` - Design document

## Next Steps

These types will be used by:
- Storage Adapter (Task 9)
- State Capture Service (Task 10)
- State Restoration Service (Task 11)
- Focus Manager (Task 12)
- Navigation Manager (Task 13)
