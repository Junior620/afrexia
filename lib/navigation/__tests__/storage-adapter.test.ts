/**
 * Unit tests for StorageAdapter
 * 
 * Tests storage operations, FIFO eviction, error handling, and dual storage strategy
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StorageAdapter } from '../storage-adapter';
import { NavigationState } from '@/types/navigation';

describe('StorageAdapter', () => {
  let adapter: StorageAdapter;

  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
    
    // Clear history state
    if (typeof window !== 'undefined' && window.history) {
      window.history.replaceState(null, '', window.location.href);
    }
    
    adapter = new StorageAdapter();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  describe('Initialization', () => {
    it('should initialize with storage availability check', () => {
      expect(adapter.isAvailable()).toBe(true);
    });

    it('should initialize with History API availability check', () => {
      expect(adapter.isHistoryApiAvailable()).toBe(true);
    });
  });

  describe('History API Operations', () => {
    it('should save state to History API', () => {
      const state: NavigationState = {
        key: '/products',
        scrollY: 100,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/products'
      };

      const result = adapter.saveToHistory(state);
      expect(result).toBe(true);
    });

    it('should retrieve state from History API', () => {
      const state: NavigationState = {
        key: '/products?category=electronics',
        scrollY: 1250,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/products',
        sectionId: 'featured'
      };

      adapter.saveToHistory(state);
      const retrieved = adapter.getFromHistory();

      expect(retrieved).toEqual(state);
    });

    it('should return null when no state in History API', () => {
      const retrieved = adapter.getFromHistory();
      expect(retrieved).toBeNull();
    });

    it('should return null for invalid state in History API', () => {
      // Manually set invalid state
      window.history.replaceState(
        { navigationState: { invalid: 'data' } },
        '',
        window.location.href
      );

      const retrieved = adapter.getFromHistory();
      expect(retrieved).toBeNull();
    });
  });

  describe('SessionStorage Operations', () => {
    it('should save state to sessionStorage', () => {
      const state: NavigationState = {
        key: '/about',
        scrollY: 500,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/about'
      };

      const result = adapter.saveToSession('/about', state);
      expect(result).toBe(true);
    });

    it('should retrieve state from sessionStorage', () => {
      const state: NavigationState = {
        key: '/contact',
        scrollY: 750,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/contact',
        focusedElementId: 'email-input'
      };

      adapter.saveToSession('/contact', state);
      const retrieved = adapter.getFromSession('/contact');

      expect(retrieved).toEqual(state);
    });

    it('should return null when key not found in sessionStorage', () => {
      const retrieved = adapter.getFromSession('/nonexistent');
      expect(retrieved).toBeNull();
    });

    it('should handle invalid JSON in sessionStorage', () => {
      sessionStorage.setItem('nav_state_/test', 'invalid json');
      
      const retrieved = adapter.getFromSession('/test');
      expect(retrieved).toBeNull();
    });

    it('should remove invalid state from sessionStorage', () => {
      sessionStorage.setItem('nav_state_/test', JSON.stringify({
        state: { invalid: 'data' },
        timestamp: Date.now()
      }));

      adapter.getFromSession('/test');
      
      // Should be removed
      expect(sessionStorage.getItem('nav_state_/test')).toBeNull();
    });

    it('should update existing entry with same key', () => {
      const state1: NavigationState = {
        key: '/products',
        scrollY: 100,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/products'
      };

      const state2: NavigationState = {
        key: '/products',
        scrollY: 500,
        scrollX: 0,
        timestamp: Date.now() + 1000,
        route: '/products'
      };

      adapter.saveToSession('/products', state1);
      adapter.saveToSession('/products', state2);

      const retrieved = adapter.getFromSession('/products');
      expect(retrieved?.scrollY).toBe(500);
    });
  });

  describe('FIFO Cache Management', () => {
    it('should enforce 50 entry limit', () => {
      // Add 51 entries
      for (let i = 0; i < 51; i++) {
        const state: NavigationState = {
          key: `/page-${i}`,
          scrollY: i * 100,
          scrollX: 0,
          timestamp: Date.now() + i,
          route: `/page-${i}`
        };

        adapter.saveToSession(`/page-${i}`, state);
      }

      // Should have at most 50 entries
      const count = adapter.getStorageCount();
      expect(count).toBeLessThanOrEqual(50);
    });

    it('should remove oldest entries when limit exceeded', () => {
      // Add entries with specific timestamps
      const baseTime = Date.now();
      
      for (let i = 0; i < 51; i++) {
        const state: NavigationState = {
          key: `/page-${i}`,
          scrollY: i * 100,
          scrollX: 0,
          timestamp: baseTime + i * 1000,
          route: `/page-${i}`
        };

        adapter.saveToSession(`/page-${i}`, state);
      }

      // First entry (oldest) should be removed
      const firstEntry = adapter.getFromSession('/page-0');
      expect(firstEntry).toBeNull();

      // Last entry should still exist
      const lastEntry = adapter.getFromSession('/page-50');
      expect(lastEntry).not.toBeNull();
    });

    it('should clear specified number of old entries', () => {
      // Add 20 entries
      for (let i = 0; i < 20; i++) {
        const state: NavigationState = {
          key: `/page-${i}`,
          scrollY: i * 100,
          scrollX: 0,
          timestamp: Date.now() + i,
          route: `/page-${i}`
        };

        adapter.saveToSession(`/page-${i}`, state);
      }

      const initialCount = adapter.getStorageCount();
      expect(initialCount).toBe(20);

      // Clear 10 oldest entries
      adapter.clearOldEntries(10);

      const finalCount = adapter.getStorageCount();
      expect(finalCount).toBe(10);
    });
  });

  describe('Error Handling', () => {
    it('should handle quota exceeded error', () => {
      // Mock sessionStorage to throw quota error
      const originalSetItem = Storage.prototype.setItem;
      let callCount = 0;
      
      Storage.prototype.setItem = function(key: string, value: string) {
        callCount++;
        if (callCount === 1) {
          const error = new Error('QuotaExceededError');
          error.name = 'QuotaExceededError';
          throw error;
        }
        return originalSetItem.call(this, key, value);
      };

      const state: NavigationState = {
        key: '/test',
        scrollY: 100,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/test'
      };

      // Should handle error and retry
      const result = adapter.saveToSession('/test', state);
      
      // Restore original method
      Storage.prototype.setItem = originalSetItem;
      
      expect(result).toBe(true);
    });

    it('should return false when storage is unavailable', () => {
      // Create adapter with unavailable storage
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function() {
        throw new Error('Storage unavailable');
      };

      const testAdapter = new StorageAdapter();
      
      const state: NavigationState = {
        key: '/test',
        scrollY: 100,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/test'
      };

      const result = testAdapter.saveToSession('/test', state);
      
      // Restore original method
      Storage.prototype.setItem = originalSetItem;
      
      expect(result).toBe(false);
    });

    it('should handle History API errors gracefully', () => {
      // Mock history.replaceState to throw error
      const originalReplaceState = window.history.replaceState;
      window.history.replaceState = function() {
        throw new Error('History API error');
      };

      const state: NavigationState = {
        key: '/test',
        scrollY: 100,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/test'
      };

      const result = adapter.saveToHistory(state);
      
      // Restore original method
      window.history.replaceState = originalReplaceState;
      
      expect(result).toBe(false);
    });
  });

  describe('Utility Methods', () => {
    it('should get storage count', () => {
      expect(adapter.getStorageCount()).toBe(0);

      const state: NavigationState = {
        key: '/test',
        scrollY: 100,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/test'
      };

      adapter.saveToSession('/test', state);
      expect(adapter.getStorageCount()).toBe(1);
    });

    it('should clear all entries', () => {
      // Add multiple entries
      for (let i = 0; i < 5; i++) {
        const state: NavigationState = {
          key: `/page-${i}`,
          scrollY: i * 100,
          scrollX: 0,
          timestamp: Date.now(),
          route: `/page-${i}`
        };

        adapter.saveToSession(`/page-${i}`, state);
      }

      expect(adapter.getStorageCount()).toBe(5);

      adapter.clearAll();
      expect(adapter.getStorageCount()).toBe(0);
    });

    it('should not affect non-navigation storage keys', () => {
      // Add non-navigation key
      sessionStorage.setItem('other_key', 'value');

      const state: NavigationState = {
        key: '/test',
        scrollY: 100,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/test'
      };

      adapter.saveToSession('/test', state);
      adapter.clearAll();

      // Non-navigation key should still exist
      expect(sessionStorage.getItem('other_key')).toBe('value');
    });
  });

  describe('Dual Storage Strategy', () => {
    it('should save to both History API and sessionStorage', () => {
      const state: NavigationState = {
        key: '/products',
        scrollY: 1000,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/products'
      };

      adapter.saveToHistory(state);
      adapter.saveToSession('/products', state);

      const fromHistory = adapter.getFromHistory();
      const fromSession = adapter.getFromSession('/products');

      expect(fromHistory).toEqual(state);
      expect(fromSession).toEqual(state);
    });

    it('should prioritize History API over sessionStorage', () => {
      const historyState: NavigationState = {
        key: '/products',
        scrollY: 1000,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/products'
      };

      const sessionState: NavigationState = {
        key: '/products',
        scrollY: 500,
        scrollX: 0,
        timestamp: Date.now() - 1000,
        route: '/products'
      };

      adapter.saveToHistory(historyState);
      adapter.saveToSession('/products', sessionState);

      // History API should be checked first
      const fromHistory = adapter.getFromHistory();
      expect(fromHistory?.scrollY).toBe(1000);
    });
  });

  describe('State Validation', () => {
    it('should validate state structure before saving', () => {
      const validState: NavigationState = {
        key: '/test',
        scrollY: 100,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/test'
      };

      const result = adapter.saveToSession('/test', validState);
      expect(result).toBe(true);
    });

    it('should reject state with negative scroll values', () => {
      // Manually create invalid state in storage
      sessionStorage.setItem('nav_state_/test', JSON.stringify({
        state: {
          key: '/test',
          scrollY: -100,
          scrollX: 0,
          timestamp: Date.now(),
          route: '/test'
        },
        timestamp: Date.now()
      }));

      const retrieved = adapter.getFromSession('/test');
      expect(retrieved).toBeNull();
    });

    it('should handle optional fields correctly', () => {
      const stateWithOptionals: NavigationState = {
        key: '/products',
        scrollY: 500,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/products',
        sectionId: 'featured',
        focusedElementId: 'product-1',
        hash: '#details'
      };

      adapter.saveToSession('/products', stateWithOptionals);
      const retrieved = adapter.getFromSession('/products');

      expect(retrieved).toEqual(stateWithOptionals);
      expect(retrieved?.sectionId).toBe('featured');
      expect(retrieved?.focusedElementId).toBe('product-1');
      expect(retrieved?.hash).toBe('#details');
    });
  });
});
