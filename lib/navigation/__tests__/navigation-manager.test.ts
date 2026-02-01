/**
 * Tests for NavigationManager
 * 
 * Validates Requirements: 11.2, 11.3, 15.5
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NavigationManager } from '../navigation-manager';
import { StateCaptureService } from '../state-capture-service';
import { StateRestorationService } from '../state-restoration-service';
import { StorageAdapter } from '../storage-adapter';
import { FocusManager } from '../focus-manager';
import { NavigationState } from '@/types/navigation';

describe('NavigationManager', () => {
  let manager: NavigationManager;
  let mockCaptureService: StateCaptureService;
  let mockRestorationService: StateRestorationService;
  let mockStorageAdapter: StorageAdapter;
  let mockFocusManager: FocusManager;

  beforeEach(() => {
    // Create mock services
    mockCaptureService = new StateCaptureService();
    mockRestorationService = new StateRestorationService();
    mockStorageAdapter = new StorageAdapter();
    mockFocusManager = new FocusManager();

    // Create manager with mocks
    manager = new NavigationManager(
      { debug: false },
      mockCaptureService,
      mockRestorationService,
      mockStorageAdapter,
      mockFocusManager
    );
  });

  afterEach(() => {
    if (manager.isReady()) {
      manager.destroy();
    }
  });

  describe('Initialization', () => {
    it('should initialize successfully', () => {
      manager.initialize();
      expect(manager.isReady()).toBe(true);
    });

    it('should not initialize twice', () => {
      manager.initialize();
      manager.initialize();
      expect(manager.isReady()).toBe(true);
    });

    it('should destroy successfully', () => {
      manager.initialize();
      manager.destroy();
      expect(manager.isReady()).toBe(false);
    });
  });

  describe('State Capture', () => {
    it('should capture current state manually', () => {
      manager.initialize();
      const state = manager.captureState();
      
      expect(state).toBeDefined();
      if (state) {
        expect(state.key).toBeDefined();
        expect(state.scrollY).toBeGreaterThanOrEqual(0);
        expect(state.scrollX).toBeGreaterThanOrEqual(0);
        expect(state.timestamp).toBeGreaterThan(0);
        expect(state.route).toBeDefined();
      }
    });
  });

  describe('Operation Queuing', () => {
    it('should queue operations', () => {
      manager.initialize();
      
      // Queue some operations
      manager['queueOperation']('capture', async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });
      
      manager['queueOperation']('restore', async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });
      
      expect(manager.getQueueLength()).toBeGreaterThan(0);
    });

    it('should process queue sequentially', async () => {
      manager.initialize();
      
      const executionOrder: string[] = [];
      
      manager['queueOperation']('capture', async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        executionOrder.push('first');
      });
      
      manager['queueOperation']('restore', async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        executionOrder.push('second');
      });
      
      // Wait for queue to process
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(executionOrder).toEqual(['first', 'second']);
    });
  });

  describe('Storage Information', () => {
    it('should return storage info', () => {
      manager.initialize();
      const info = manager.getStorageInfo();
      
      expect(info).toBeDefined();
      expect(typeof info.count).toBe('number');
      expect(typeof info.isAvailable).toBe('boolean');
      expect(typeof info.isHistoryAvailable).toBe('boolean');
    });
  });

  describe('Configuration', () => {
    it('should respect enabled configuration', () => {
      const disabledManager = new NavigationManager({ enabled: false });
      disabledManager.initialize();
      
      expect(disabledManager.isReady()).toBe(false);
    });

    it('should respect debug configuration', () => {
      const debugManager = new NavigationManager({ debug: true });
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      debugManager.initialize();
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('State Management', () => {
    it('should clear all states', () => {
      manager.initialize();
      
      // Capture some state
      manager.captureState();
      
      // Clear all
      manager.clearAllStates();
      
      const info = manager.getStorageInfo();
      expect(info.count).toBe(0);
    });
  });

  describe('Link Detection', () => {
    it('should detect external links', () => {
      manager.initialize();
      
      const isExternal = manager['isExternalLink']('https://external.com');
      expect(isExternal).toBe(true);
    });

    it('should detect internal links', () => {
      manager.initialize();
      
      const isExternal = manager['isExternalLink']('/internal/path');
      expect(isExternal).toBe(false);
    });

    it('should detect same-page navigation', () => {
      manager.initialize();
      
      const isSamePage = manager['isSamePageNavigation']('#section');
      expect(isSamePage).toBe(true);
    });
  });
});
