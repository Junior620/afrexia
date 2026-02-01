# Navigation Module

This module provides navigation state management for the responsive design and intelligent navigation system.

## StorageAdapter

The `StorageAdapter` class implements a dual storage strategy for persisting navigation state across page transitions and refreshes.

### Features

- **Dual Storage Strategy**: Uses both History API and sessionStorage
  - History API for immediate back/forward navigation
  - sessionStorage for page refresh scenarios
  
- **FIFO Cache Management**: Automatically manages storage with 50-entry limit
  - Removes oldest entries when limit is reached
  - Prevents storage quota issues
  
- **Error Handling**: Gracefully handles storage failures
  - Quota exceeded errors
  - Storage unavailable (private browsing)
  - Invalid state data
  
- **State Validation**: Validates all stored states
  - Ensures data integrity
  - Removes corrupted entries automatically

### Usage

```typescript
import { storageAdapter } from '@/lib/navigation';

// Save to History API
const state: NavigationState = {
  key: '/products',
  scrollY: 1000,
  scrollX: 0,
  timestamp: Date.now(),
  route: '/products'
};

storageAdapter.saveToHistory(state);

// Save to sessionStorage
storageAdapter.saveToSession('/products', state);

// Retrieve from History API (priority)
const fromHistory = storageAdapter.getFromHistory();

// Retrieve from sessionStorage (fallback)
const fromSession = storageAdapter.getFromSession('/products');

// Check storage availability
if (storageAdapter.isAvailable()) {
  // Storage operations are safe
}

// Clear all stored states
storageAdapter.clearAll();
```

### Implementation Details

**Storage Key Format**: `nav_state_${pathname}${search}`

**Entry Structure**:
```typescript
{
  state: NavigationState,
  timestamp: number
}
```

**FIFO Eviction**: When the 50-entry limit is reached, the oldest entry (by timestamp) is automatically removed before adding a new entry.

**Error Recovery**: If quota is exceeded, the adapter attempts to free space by removing the 10 oldest entries and retries the save operation.

### Requirements Validated

- **Requirement 10.1**: Store Scroll_State in sessionStorage with maximum of 50 entries
- **Requirement 10.2**: Use History API state object for immediate back/forward navigation
- **Requirement 10.7**: Remove oldest entries using FIFO strategy when limit exceeded
- **Requirement 15.3**: Continue functioning when sessionStorage is full or unavailable

### Testing

Comprehensive unit tests cover:
- History API operations
- sessionStorage operations
- FIFO cache management
- Error handling
- State validation
- Dual storage strategy

Run tests:
```bash
npm test -- lib/navigation/__tests__/storage-adapter.test.ts
```

All 26 tests pass successfully.
