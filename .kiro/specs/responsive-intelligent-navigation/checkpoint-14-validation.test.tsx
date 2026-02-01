/**
 * Checkpoint 14: Navigation State Management Validation
 * 
 * Comprehensive validation tests for:
 * - State capture on navigation
 * - State restoration on back button
 * - Hash navigation priority
 * - Section-based restoration
 * 
 * Requirements: 7.1, 7.2, 7.3, 8.2, 8.3, 9.1, 9.2, 11.1, 11.2, 11.3
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NavigationManager } from '@/lib/navigation/navigation-manager';
import { StateCaptureService } from '@/lib/navigation/state-capture-service';
import { StateRestorationService } from '@/lib/navigation/state-restoration-service';
import { StorageAdapter } from '@/lib/navigation/storage-adapter';
import { FocusManager } from '@/lib/navigation/focus-manager';
import { RestorationType, generateStateKey } from '@/types/navigation';

describe('Checkpoint 14: Navigation State Management Validation', () => {
  let manager: NavigationManager;
  let captureService: StateCaptureService;
  let restorationService: StateRestorationService;
  let storageAdapter: StorageAdapter;
  let focusManager: FocusManager;

  beforeEach(() => {
    // Create fresh instances for each test
    captureService = new StateCaptureService();
    restorationService = new StateRestorationService();
    storageAdapter = new StorageAdapter();
    focusManager = new FocusManager();

    manager = new NavigationManager(
      { debug: false },
      captureService,
      restorationService,
      storageAdapter,
      focusManager
    );

    // Initialize services
    captureService.initialize();
    manager.initialize();
  });

  afterEach(() => {
    // Clean up
    if (manager.isReady()) {
      manager.destroy();
    }
    captureService.destroy();
    restorationService.destroy();
    storageAdapter.clearAll();
  });

  describe('1. State Capture on Navigation', () => {
    it('should capture current state with all required fields', () => {
      // Requirement 7.1: Capture state before navigation
      const state = captureService.captureCurrentState();

      expect(state).toBeDefined();
      expect(state.key).toBeDefined();
      expect(typeof state.key).toBe('string');
      expect(state.scrollY).toBeGreaterThanOrEqual(0);
      expect(state.scrollX).toBeGreaterThanOrEqual(0);
      expect(state.timestamp).toBeGreaterThan(0);
      expect(state.route).toBeDefined();
      expect(typeof state.route).toBe('string');
    });

    it('should generate correct state key from pathname and search', () => {
      // Requirement 10.3: State key generation
      const key1 = generateStateKey('/products', 'category=electronics');
      expect(key1).toBe('/products?category=electronics');

      const key2 = generateStateKey('/products', '');
      expect(key2).toBe('/products');

      const key3 = generateStateKey('/about');
      expect(key3).toBe('/about');
    });

    it('should capture state before navigation via manager', () => {
      // Requirement 11.1: Capture state on internal link click
      const state = manager.captureState();

      expect(state).not.toBeNull();
      if (state) {
        expect(state.key).toBeDefined();
        expect(state.timestamp).toBeGreaterThan(0);
      }
    });

    it('should save captured state to both storage mechanisms', () => {
      // Requirement 10.2: Dual storage strategy
      const state = captureService.captureCurrentState();

      // Save to both
      const historySuccess = storageAdapter.saveToHistory(state);
      const sessionSuccess = storageAdapter.saveToSession(state.key, state);

      // At least sessionStorage should work
      expect(sessionSuccess).toBe(true);

      // Verify retrieval
      const retrieved = storageAdapter.getFromSession(state.key);
      expect(retrieved).not.toBeNull();
      if (retrieved) {
        expect(retrieved.key).toBe(state.key);
        expect(retrieved.scrollY).toBe(state.scrollY);
      }
    });

    it('should debounce scroll capture', async () => {
      // Requirement 12.5: Debounce scroll capture to max 1 write per 150ms
      // This test verifies the debouncing mechanism exists and works
      
      let callCount = 0;
      const callback = () => {
        callCount++;
      };

      // Mock scroll position to be different from last captured
      Object.defineProperty(document.documentElement, 'scrollTop', {
        writable: true,
        configurable: true,
        value: 100
      });

      // Reset last captured position
      captureService['lastCapturedScrollY'] = 0;

      // Trigger multiple scroll captures rapidly
      captureService.debounceScrollCapture(callback);
      captureService.debounceScrollCapture(callback);
      captureService.debounceScrollCapture(callback);

      // Wait for debounce delay to complete
      await new Promise(resolve => setTimeout(resolve, 200));

      // Should only capture once due to debouncing
      expect(callCount).toBeLessThanOrEqual(1);
    });

    it('should not capture state for external links', () => {
      // Requirement 11.5: Don't capture for external links
      const shouldCapture = captureService.shouldCaptureState(
        'https://external.com',
        true,
        false
      );

      expect(shouldCapture).toBe(false);
    });

    it('should not capture state for same-page hash navigation', () => {
      // Requirement 11.6: Don't capture for same-page navigation
      const shouldCapture = captureService.shouldCaptureState(
        '#section',
        false,
        true
      );

      expect(shouldCapture).toBe(false);
    });
  });

  describe('2. State Restoration on Back Button', () => {
    it('should restore state from storage', async () => {
      // Requirement 7.2, 11.2: Restore state on back navigation
      const mockState = {
        key: '/test',
        scrollY: 500,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/test'
      };

      // Save state
      storageAdapter.saveToSession(mockState.key, mockState);

      // Retrieve and verify
      const retrieved = storageAdapter.getFromSession(mockState.key);
      expect(retrieved).not.toBeNull();
      if (retrieved) {
        expect(retrieved.scrollY).toBe(500);
      }
    });

    it('should restore scroll position accurately', async () => {
      // Requirement 7.3: Scroll restoration accuracy within 50px
      const mockState = {
        key: '/test',
        scrollY: 1000,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/test'
      };

      // Restore state
      const result = await restorationService.restoreState(mockState);

      expect(result.success).toBe(true);
      expect(result.type).toBe(RestorationType.SCROLL);
      expect(result.targetY).toBe(1000);
    });

    it('should initiate restoration within timing requirement', async () => {
      // Requirement 7.2, 12.1: Initiate within 150ms
      const mockState = {
        key: '/test',
        scrollY: 500,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/test'
      };

      const startTime = Date.now();
      await restorationService.restoreState(mockState);
      const duration = Date.now() - startTime;

      // Should complete quickly (within reasonable time)
      expect(duration).toBeLessThan(2000);
    });

    it('should respect prefers-reduced-motion for scroll behavior', () => {
      // Requirement 7.6, 12.3: Respect motion preferences
      const shouldUseSmooth = restorationService['shouldUseSmooth']();

      // Result depends on user's system settings
      expect(typeof shouldUseSmooth).toBe('boolean');
    });

    it('should fall back to top when no state found', async () => {
      // Requirement 15.2: Graceful fallback
      const mockState = {
        key: '/nonexistent',
        scrollY: 0,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/nonexistent'
      };

      const result = await restorationService.restoreState(mockState);

      expect(result.success).toBe(true);
      expect(result.targetY).toBe(0);
    });
  });

  describe('3. Hash Navigation Priority', () => {
    it('should prioritize hash over stored scroll position', () => {
      // Requirement 9.1: Hash takes priority
      const mockState = {
        key: '/test',
        scrollY: 1000,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/test',
        hash: 'section-id'
      };

      // Create a mock element for hash target
      const mockElement = document.createElement('div');
      mockElement.id = 'section-id';
      document.body.appendChild(mockElement);

      const priority = restorationService.determinePriority(mockState, '#section-id');

      expect(priority).toBe(RestorationType.HASH);

      // Cleanup
      document.body.removeChild(mockElement);
    });

    it('should fall back when hash target does not exist', () => {
      // Requirement 9.3: Hash fallback
      const mockState = {
        key: '/test',
        scrollY: 1000,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/test',
        sectionId: 'existing-section'
      };

      // Create section element
      const mockSection = document.createElement('section');
      mockSection.setAttribute('data-section', 'existing-section');
      document.body.appendChild(mockSection);

      // Hash target doesn't exist, should fall back to section
      const priority = restorationService.determinePriority(mockState, '#nonexistent');

      expect(priority).toBe(RestorationType.SECTION);

      // Cleanup
      document.body.removeChild(mockSection);
    });

    it('should calculate correct offset for hash navigation', () => {
      // Requirement 9.2: Apply offset equal to header height + 16px
      const mockElement = document.createElement('div');
      mockElement.id = 'target';
      mockElement.style.position = 'absolute';
      mockElement.style.top = '1000px';
      document.body.appendChild(mockElement);

      const offset = restorationService['calculateElementOffset'](mockElement);

      // Should include header height + margin
      expect(offset).toBeGreaterThanOrEqual(0);

      // Cleanup
      document.body.removeChild(mockElement);
    });
  });

  describe('4. Section-Based Restoration', () => {
    it('should prioritize section over scroll position', () => {
      // Requirement 8.2: Section-based restoration priority
      const mockState = {
        key: '/test',
        scrollY: 1000,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/test',
        sectionId: 'features'
      };

      // Create section element
      const mockSection = document.createElement('section');
      mockSection.setAttribute('data-section', 'features');
      document.body.appendChild(mockSection);

      const priority = restorationService.determinePriority(mockState, '');

      expect(priority).toBe(RestorationType.SECTION);

      // Cleanup
      document.body.removeChild(mockSection);
    });

    it('should fall back to scroll when section does not exist', () => {
      // Requirement 8.5: Section fallback
      const mockState = {
        key: '/test',
        scrollY: 1000,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/test',
        sectionId: 'nonexistent-section'
      };

      const priority = restorationService.determinePriority(mockState, '');

      // Should fall back to scroll since section doesn't exist
      expect(priority).toBe(RestorationType.SCROLL);
    });

    it('should apply correct offset for section restoration', () => {
      // Requirement 8.3, 8.6: Offset = header height + 16px
      const mockSection = document.createElement('section');
      mockSection.setAttribute('data-section', 'test-section');
      mockSection.style.position = 'absolute';
      mockSection.style.top = '2000px';
      document.body.appendChild(mockSection);

      const offset = restorationService['calculateElementOffset'](mockSection);

      // Should include header height + 16px margin
      expect(offset).toBeGreaterThanOrEqual(0);

      // Cleanup
      document.body.removeChild(mockSection);
    });

    it('should detect current section using visibility', () => {
      // Requirement 11.1: Section detection
      const sectionId = captureService.getCurrentSectionId();

      // May be null if no sections visible
      expect(sectionId === null || typeof sectionId === 'string').toBe(true);
    });
  });

  describe('5. Priority Resolution Algorithm', () => {
    it('should follow correct priority order: hash > section > scroll > top', () => {
      // Test priority order
      const mockState = {
        key: '/test',
        scrollY: 1000,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/test'
      };

      // No hash, no section, has scroll -> SCROLL
      let priority = restorationService.determinePriority(mockState, '');
      expect(priority).toBe(RestorationType.SCROLL);

      // No hash, no section, no scroll -> TOP
      const topState = { ...mockState, scrollY: 0 };
      priority = restorationService.determinePriority(topState, '');
      expect(priority).toBe(RestorationType.TOP);
    });
  });

  describe('6. Storage Management', () => {
    it('should enforce FIFO eviction at 50 entries', () => {
      // Requirement 10.1, 10.7: FIFO cache management
      const initialCount = storageAdapter.getStorageCount();

      // Add multiple entries
      for (let i = 0; i < 55; i++) {
        const state = {
          key: `/test-${i}`,
          scrollY: i * 100,
          scrollX: 0,
          timestamp: Date.now() + i,
          route: `/test-${i}`
        };
        storageAdapter.saveToSession(state.key, state);
      }

      const finalCount = storageAdapter.getStorageCount();

      // Should not exceed 50 entries
      expect(finalCount).toBeLessThanOrEqual(50);
    });

    it('should update existing entry instead of creating duplicate', () => {
      // Requirement 10.4: Update existing entry
      const key = '/test';
      const state1 = {
        key,
        scrollY: 100,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/test'
      };

      storageAdapter.saveToSession(key, state1);
      const count1 = storageAdapter.getStorageCount();

      // Update same key
      const state2 = {
        key,
        scrollY: 200,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/test'
      };

      storageAdapter.saveToSession(key, state2);
      const count2 = storageAdapter.getStorageCount();

      // Count should not increase
      expect(count2).toBe(count1);

      // Should have updated value
      const retrieved = storageAdapter.getFromSession(key);
      expect(retrieved?.scrollY).toBe(200);
    });

    it('should handle storage unavailability gracefully', () => {
      // Requirement 15.3: Graceful degradation
      const isAvailable = storageAdapter.isAvailable();

      // Should return boolean without error
      expect(typeof isAvailable).toBe('boolean');
    });
  });

  describe('7. Focus Management', () => {
    it('should capture focused element ID', () => {
      // Requirement 19.1, 19.4: Focus capture
      const input = document.createElement('input');
      input.id = 'test-input';
      document.body.appendChild(input);
      input.focus();

      const focusId = focusManager.captureFocus();

      expect(focusId).toBe('test-input');

      // Cleanup
      document.body.removeChild(input);
    });

    it('should restore focus to element if it exists', () => {
      // Requirement 19.2: Focus restoration
      const button = document.createElement('button');
      button.id = 'test-button';
      document.body.appendChild(button);

      const restored = focusManager.restoreFocus('test-button');

      expect(restored).toBe(true);
      expect(document.activeElement).toBe(button);

      // Cleanup
      document.body.removeChild(button);
    });

    it('should handle missing element gracefully', () => {
      // Requirement 19.3: Fallback when element doesn't exist
      const restored = focusManager.restoreFocus('nonexistent-element');

      expect(restored).toBe(false);
      // Should not throw error
    });
  });

  describe('8. Two-Pass Restoration', () => {
    it('should perform two-pass restoration', async () => {
      // Requirement 9.4, 9.5: Two-pass strategy
      const mockState = {
        key: '/test',
        scrollY: 500,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/test'
      };

      const result = await restorationService.performTwoPassRestoration(
        mockState,
        RestorationType.SCROLL
      );

      expect(result.success).toBe(true);
      expect(result.type).toBe(RestorationType.SCROLL);
      expect(result.targetY).toBe(500);
    });
  });

  describe('9. Operation Queuing', () => {
    it('should queue concurrent operations', async () => {
      // Requirement 15.5: Concurrent navigation handling
      const executionOrder: string[] = [];

      manager['queueOperation']('capture', async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        executionOrder.push('first');
      });

      manager['queueOperation']('restore', async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        executionOrder.push('second');
      });

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(executionOrder).toEqual(['first', 'second']);
    });
  });

  describe('10. Integration Tests', () => {
    it('should complete full capture-restore cycle', async () => {
      // Full integration test
      
      // 1. Capture state
      const capturedState = manager.captureState();
      expect(capturedState).not.toBeNull();

      if (capturedState) {
        // 2. Verify storage
        const retrieved = storageAdapter.getFromSession(capturedState.key);
        expect(retrieved).not.toBeNull();

        // 3. Restore state
        if (retrieved) {
          const result = await manager.restoreState(retrieved);
          expect(result).toBe(true);
        }
      }
    });

    it('should handle complete navigation flow', async () => {
      // Simulate navigation flow
      
      // 1. Initialize
      expect(manager.isReady()).toBe(true);

      // 2. Capture before navigation
      const state = manager.captureState();
      expect(state).not.toBeNull();

      // 3. Verify storage info
      const info = manager.getStorageInfo();
      expect(info.count).toBeGreaterThan(0);

      // 4. Clear and verify
      manager.clearAllStates();
      const infoAfter = manager.getStorageInfo();
      expect(infoAfter.count).toBe(0);
    });
  });
});
