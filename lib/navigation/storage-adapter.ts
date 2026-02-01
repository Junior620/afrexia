/**
 * Storage Adapter for Navigation State Management
 * 
 * Provides dual storage strategy using History API and sessionStorage
 * for navigation state persistence with FIFO cache management.
 * 
 * Validates: Requirements 10.1, 10.2, 10.7, 15.3
 */

import { NavigationState, validateNavigationState } from '@/types/navigation';
import { errorHandler, ErrorCategory } from './error-handler';

/**
 * Maximum number of entries to store in sessionStorage
 * Implements FIFO eviction when limit is reached
 */
const MAX_STORAGE_ENTRIES = 50;

/**
 * Prefix for sessionStorage keys to avoid conflicts
 */
const STORAGE_KEY_PREFIX = 'nav_state_';

/**
 * Interface for storage entry with metadata
 */
interface StorageEntry {
  state: NavigationState;
  timestamp: number;
}

/**
 * Storage Adapter Class
 * 
 * Manages navigation state persistence using dual storage strategy:
 * - History API for immediate back/forward navigation
 * - sessionStorage for page refresh scenarios
 * 
 * Features:
 * - FIFO cache management (50 entry limit)
 * - Error handling for storage failures
 * - JSON serialization/deserialization
 * - State validation
 */
export class StorageAdapter {
  private isStorageAvailable: boolean;
  private isHistoryAvailable: boolean;

  constructor() {
    this.isStorageAvailable = this.checkStorageAvailability();
    this.isHistoryAvailable = this.checkHistoryAvailability();
  }

  /**
   * Check if sessionStorage is available
   * Handles private browsing and quota issues
   */
  private checkStorageAvailability(): boolean {
    try {
      const testKey = '__storage_test__';
      sessionStorage.setItem(testKey, 'test');
      sessionStorage.removeItem(testKey);
      return true;
    } catch (error) {
      errorHandler.handleStorageError('sessionStorage is not available', error, {
        context: 'checkStorageAvailability'
      });
      return false;
    }
  }

  /**
   * Check if History API is available
   */
  private checkHistoryAvailability(): boolean {
    return typeof window !== 'undefined' && 
           typeof window.history !== 'undefined' &&
           typeof window.history.replaceState === 'function';
  }

  /**
   * Save navigation state to History API
   * 
   * @param state - Navigation state to save
   * @returns Success status
   */
  saveToHistory(state: NavigationState): boolean {
    if (!this.isHistoryAvailable) {
      return false;
    }

    try {
      window.history.replaceState(
        { navigationState: state },
        '',
        window.location.href
      );
      return true;
    } catch (error) {
      errorHandler.handleStorageError('Failed to save state to History API', error, {
        stateKey: state.key,
        context: 'saveToHistory'
      });
      return false;
    }
  }

  /**
   * Retrieve navigation state from History API
   * 
   * @returns Navigation state or null if not found/invalid
   */
  getFromHistory(): NavigationState | null {
    if (!this.isHistoryAvailable) {
      return null;
    }

    try {
      const historyState = window.history.state;
      
      if (historyState && historyState.navigationState) {
        const state = historyState.navigationState;
        
        if (validateNavigationState(state)) {
          return state;
        }
      }
      
      return null;
    } catch (error) {
      errorHandler.handleStorageError('Failed to retrieve state from History API', error, {
        context: 'getFromHistory'
      });
      return null;
    }
  }

  /**
   * Save navigation state to sessionStorage
   * Implements FIFO eviction when limit is reached
   * 
   * @param key - State key (pathname + search)
   * @param state - Navigation state to save
   * @returns Success status
   */
  saveToSession(key: string, state: NavigationState): boolean {
    if (!this.isStorageAvailable) {
      return false;
    }

    try {
      // Check if we need to evict old entries
      this.enforceStorageLimit();

      // Create storage entry with timestamp
      const entry: StorageEntry = {
        state,
        timestamp: Date.now()
      };

      // Save to sessionStorage
      const storageKey = `${STORAGE_KEY_PREFIX}${key}`;
      sessionStorage.setItem(storageKey, JSON.stringify(entry));
      
      return true;
    } catch (error) {
      // Handle quota exceeded or other storage errors
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        errorHandler.handleStorageError('sessionStorage quota exceeded, attempting cleanup', error, {
          stateKey: key,
          context: 'saveToSession'
        });
        
        // Try to free up space by removing oldest entries
        this.clearOldEntries(10);
        
        // Retry save
        try {
          const entry: StorageEntry = {
            state,
            timestamp: Date.now()
          };
          const storageKey = `${STORAGE_KEY_PREFIX}${key}`;
          sessionStorage.setItem(storageKey, JSON.stringify(entry));
          return true;
        } catch (retryError) {
          errorHandler.handleStorageError('Failed to save state after cleanup', retryError, {
            stateKey: key,
            context: 'saveToSession:retry'
          });
          return false;
        }
      }
      
      errorHandler.handleStorageError('Failed to save state to sessionStorage', error, {
        stateKey: key,
        context: 'saveToSession'
      });
      return false;
    }
  }

  /**
   * Retrieve navigation state from sessionStorage
   * 
   * @param key - State key (pathname + search)
   * @returns Navigation state or null if not found/invalid
   */
  getFromSession(key: string): NavigationState | null {
    if (!this.isStorageAvailable) {
      return null;
    }

    try {
      const storageKey = `${STORAGE_KEY_PREFIX}${key}`;
      const stored = sessionStorage.getItem(storageKey);
      
      if (!stored) {
        return null;
      }

      // Parse and validate
      const entry = JSON.parse(stored) as StorageEntry;
      
      if (!entry.state || !validateNavigationState(entry.state)) {
        // Invalid state, remove it
        sessionStorage.removeItem(storageKey);
        errorHandler.handleValidationError('Invalid navigation state found in storage', undefined, {
          stateKey: key,
          context: 'getFromSession'
        });
        return null;
      }

      return entry.state;
    } catch (error) {
      errorHandler.handleStorageError('Failed to retrieve state from sessionStorage', error, {
        stateKey: key,
        context: 'getFromSession'
      });
      return null;
    }
  }

  /**
   * Enforce FIFO storage limit
   * Removes oldest entries when limit is reached
   */
  private enforceStorageLimit(): void {
    try {
      const entries = this.getAllEntries();
      
      if (entries.length >= MAX_STORAGE_ENTRIES) {
        // Sort by timestamp (oldest first)
        entries.sort((a, b) => a.timestamp - b.timestamp);
        
        // Remove oldest entries to make room
        const toRemove = entries.length - MAX_STORAGE_ENTRIES + 1;
        for (let i = 0; i < toRemove; i++) {
          sessionStorage.removeItem(entries[i].key);
        }
      }
    } catch (error) {
      errorHandler.handleStorageError('Failed to enforce storage limit', error, {
        context: 'enforceStorageLimit'
      });
    }
  }

  /**
   * Get all navigation state entries from sessionStorage
   * 
   * @returns Array of entries with keys and timestamps
   */
  private getAllEntries(): Array<{ key: string; timestamp: number }> {
    const entries: Array<{ key: string; timestamp: number }> = [];

    try {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        
        if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
          const stored = sessionStorage.getItem(key);
          
          if (stored) {
            try {
              const entry = JSON.parse(stored) as StorageEntry;
              entries.push({
                key,
                timestamp: entry.timestamp || 0
              });
            } catch {
              // Skip invalid entries
            }
          }
        }
      }
    } catch (error) {
      errorHandler.handleStorageError('Failed to get all entries', error, {
        context: 'getAllEntries'
      });
    }

    return entries;
  }

  /**
   * Clear old entries from sessionStorage
   * Used for cleanup when quota is exceeded
   * 
   * @param count - Number of oldest entries to remove
   */
  clearOldEntries(count: number = 10): void {
    try {
      const entries = this.getAllEntries();
      
      if (entries.length === 0) {
        return;
      }

      // Sort by timestamp (oldest first)
      entries.sort((a, b) => a.timestamp - b.timestamp);
      
      // Remove oldest entries
      const toRemove = Math.min(count, entries.length);
      for (let i = 0; i < toRemove; i++) {
        sessionStorage.removeItem(entries[i].key);
      }
    } catch (error) {
      errorHandler.handleStorageError('Failed to clear old entries', error, {
        count,
        context: 'clearOldEntries'
      });
    }
  }

  /**
   * Clear all navigation state entries from sessionStorage
   * Useful for testing or manual cleanup
   */
  clearAll(): void {
    try {
      const entries = this.getAllEntries();
      
      for (const entry of entries) {
        sessionStorage.removeItem(entry.key);
      }
    } catch (error) {
      errorHandler.handleStorageError('Failed to clear all entries', error, {
        context: 'clearAll'
      });
    }
  }

  /**
   * Get the number of stored navigation states
   * 
   * @returns Count of stored entries
   */
  getStorageCount(): number {
    return this.getAllEntries().length;
  }

  /**
   * Check if storage is available
   * 
   * @returns True if sessionStorage is available
   */
  isAvailable(): boolean {
    return this.isStorageAvailable;
  }

  /**
   * Check if History API is available
   * 
   * @returns True if History API is available
   */
  isHistoryApiAvailable(): boolean {
    return this.isHistoryAvailable;
  }
}

/**
 * Singleton instance of StorageAdapter
 * Use this for consistent storage management across the application
 */
export const storageAdapter = new StorageAdapter();
