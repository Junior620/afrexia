/**
 * Navigation Manager
 * 
 * Orchestrates navigation state management by coordinating:
 * - StateCaptureService: Captures state before navigation
 * - StateRestorationService: Restores state after navigation
 * - StorageAdapter: Persists state across sessions
 * - FocusManager: Manages focus restoration
 * 
 * Handles:
 * - Link click events (capture state before navigation)
 * - Popstate events (restore state on back/forward)
 * - Page load events (restore state on refresh)
 * - Operation queuing for concurrent navigation events
 * 
 * Requirements: 11.2, 11.3, 15.5
 * from responsive-intelligent-navigation/requirements.md
 */

import { StateCaptureService } from './state-capture-service';
import { StateRestorationService } from './state-restoration-service';
import { StorageAdapter } from './storage-adapter';
import { FocusManager } from './focus-manager';
import { NavigationState, generateStateKey } from '@/types/navigation';
import { performanceMonitor } from './performance-monitor';
import { initializeMobileBrowserCompat, destroyMobileBrowserCompat } from './mobile-browser-compat';
import { errorHandler, ErrorCategory, ErrorSeverity } from './error-handler';

/**
 * Configuration options for NavigationManager
 */
export interface NavigationManagerConfig {
  /** Whether to enable state capture and restoration (default: true) */
  enabled?: boolean;
  /** Whether to enable debug logging (default: false) */
  debug?: boolean;
  /** Delay before initiating restoration in milliseconds (default: 0) */
  restorationDelay?: number;
  /** Whether to capture state on link clicks (default: true) */
  captureOnLinkClick?: boolean;
  /** Whether to restore state on popstate (default: true) */
  restoreOnPopstate?: boolean;
  /** Whether to restore state on page load (default: true) */
  restoreOnPageLoad?: boolean;
}

/**
 * Operation queue entry
 */
interface QueuedOperation {
  id: string;
  type: 'capture' | 'restore';
  execute: () => Promise<void>;
  timestamp: number;
}

/**
 * Navigation Manager Class
 * 
 * Central orchestrator for intelligent navigation state management.
 * Wires together all navigation services and handles browser events.
 * 
 * Features:
 * - Link click handler to capture state before navigation
 * - Popstate handler to restore state on back/forward
 * - Page load handler for refresh restoration
 * - Operation queuing for concurrent navigation events
 * - Error handling and graceful degradation
 * 
 * Validates: Requirements 11.2, 11.3, 15.5
 */
export class NavigationManager {
  private config: Required<NavigationManagerConfig>;
  private captureService: StateCaptureService;
  private restorationService: StateRestorationService;
  private storageAdapter: StorageAdapter;
  private focusManager: FocusManager;
  
  private isInitialized: boolean = false;
  private operationQueue: QueuedOperation[] = [];
  private isProcessingQueue: boolean = false;
  private operationIdCounter: number = 0;
  
  // Event listener cleanup functions
  private cleanupFunctions: Array<() => void> = [];

  constructor(
    config: NavigationManagerConfig = {},
    captureService?: StateCaptureService,
    restorationService?: StateRestorationService,
    storageAdapter?: StorageAdapter,
    focusManager?: FocusManager
  ) {
    this.config = {
      enabled: config.enabled ?? true,
      debug: config.debug ?? false,
      restorationDelay: config.restorationDelay ?? 0,
      captureOnLinkClick: config.captureOnLinkClick ?? true,
      restoreOnPopstate: config.restoreOnPopstate ?? true,
      restoreOnPageLoad: config.restoreOnPageLoad ?? true
    };

    // Initialize services (allow injection for testing)
    this.captureService = captureService ?? new StateCaptureService();
    this.restorationService = restorationService ?? new StateRestorationService();
    this.storageAdapter = storageAdapter ?? new StorageAdapter();
    this.focusManager = focusManager ?? new FocusManager();
  }

  /**
   * Initialize the navigation manager
   * Sets up event listeners and starts capturing state
   * Initializes mobile browser compatibility features
   * 
   * Should be called once when the application is ready
   * 
   * Validates: Requirements 11.2, 13.1, 13.4, 13.5, 13.6
   */
  public initialize(): void {
    if (this.isInitialized) {
      this.log('NavigationManager already initialized');
      return;
    }

    if (!this.config.enabled) {
      this.log('NavigationManager is disabled');
      return;
    }

    if (typeof window === 'undefined') {
      this.log('NavigationManager can only be initialized in browser environment');
      return;
    }

    this.log('Initializing NavigationManager');

    // Initialize mobile browser compatibility features
    initializeMobileBrowserCompat();

    // Initialize error handler
    errorHandler.initialize();
    errorHandler.setDebugMode(this.config.debug);

    // Initialize performance monitor
    performanceMonitor.initialize();

    // Initialize capture service
    this.captureService.initialize();

    // Set up event listeners
    this.setupEventListeners();

    // Handle page load restoration
    if (this.config.restoreOnPageLoad) {
      this.handlePageLoad();
    }

    this.isInitialized = true;
    this.log('NavigationManager initialized successfully');
  }

  /**
   * Destroy the navigation manager
   * Cleans up event listeners, services, and mobile browser compatibility features
   */
  public destroy(): void {
    if (!this.isInitialized) {
      return;
    }

    this.log('Destroying NavigationManager');

    // Clean up mobile browser compatibility features
    destroyMobileBrowserCompat();

    // Clean up performance monitor
    performanceMonitor.destroy();

    // Clean up event listeners
    this.cleanupFunctions.forEach(cleanup => cleanup());
    this.cleanupFunctions = [];

    // Clean up services
    this.captureService.destroy();
    this.restorationService.destroy();

    // Clear operation queue
    this.operationQueue = [];
    this.isProcessingQueue = false;

    this.isInitialized = false;
    this.log('NavigationManager destroyed');
  }

  /**
   * Set up event listeners for navigation events
   */
  private setupEventListeners(): void {
    // Link click handler
    if (this.config.captureOnLinkClick) {
      const linkClickHandler = this.handleLinkClick.bind(this);
      document.addEventListener('click', linkClickHandler, true); // Use capture phase
      this.cleanupFunctions.push(() => {
        document.removeEventListener('click', linkClickHandler, true);
      });
    }

    // Popstate handler (back/forward buttons)
    if (this.config.restoreOnPopstate) {
      const popstateHandler = this.handlePopstate.bind(this);
      window.addEventListener('popstate', popstateHandler);
      this.cleanupFunctions.push(() => {
        window.removeEventListener('popstate', popstateHandler);
      });
    }

    // Scroll handler for debounced state updates
    const scrollHandler = () => {
      this.captureService.debounceScrollCapture((scrollY, scrollX) => {
        this.updateCurrentState(scrollY, scrollX);
      });
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    this.cleanupFunctions.push(() => {
      window.removeEventListener('scroll', scrollHandler);
    });
  }

  /**
   * Handle link click events
   * Captures state before navigation occurs
   * 
   * @param event - Click event
   * 
   * Validates: Requirement 11.2
   */
  private handleLinkClick(event: MouseEvent): void {
    // Find the link element (might be nested)
    const link = this.findLinkElement(event.target as HTMLElement);
    
    if (!link) {
      return;
    }

    // Get link href
    const href = link.getAttribute('href');
    
    if (!href) {
      return;
    }

    // Check if it's an internal link
    const isExternal = this.isExternalLink(href);
    const isSamePage = this.isSamePageNavigation(href);

    // Determine if we should capture state
    if (!this.captureService.shouldCaptureState(href, isExternal, isSamePage)) {
      this.log('Skipping state capture for link:', href);
      return;
    }

    // Queue capture operation
    this.queueOperation('capture', async () => {
      try {
        const state = this.captureService.captureCurrentState();
        const focusId = this.focusManager.captureFocus();
        
        // Add focus to state if captured
        if (focusId) {
          state.focusedElementId = focusId;
        }

        // Save to both storage mechanisms
        this.storageAdapter.saveToHistory(state);
        this.storageAdapter.saveToSession(state.key, state);

        this.log('State captured before navigation:', state);
      } catch (error) {
        errorHandler.handleCaptureError('Failed to capture state on link click', error, {
          href: link.getAttribute('href')
        });
      }
    });
  }

  /**
   * Handle popstate events (back/forward navigation)
   * Restores state after navigation
   * 
   * Validates: Requirement 11.2
   */
  private handlePopstate(): void {
    this.log('Popstate event triggered');

    // Queue restoration operation
    this.queueOperation('restore', async () => {
      try {
        // Add delay if configured
        if (this.config.restorationDelay > 0) {
          await this.delay(this.config.restorationDelay);
        }

        // Try to get state from History API first
        let state = this.storageAdapter.getFromHistory();

        // Fallback to sessionStorage if not in history
        if (!state) {
          const { pathname, search } = window.location;
          const key = generateStateKey(pathname, search);
          state = this.storageAdapter.getFromSession(key);
        }

        // If no state found, scroll to top
        if (!state) {
          this.log('No state found for current location, scrolling to top');
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
          return;
        }

        this.log('Restoring state:', state);

        // Restore scroll position
        const result = await this.restorationService.restoreState(state);
        
        this.log('State restoration result:', result);

        // Restore focus if available
        if (state.focusedElementId) {
          const focusRestored = this.focusManager.restoreFocus(state.focusedElementId);
          this.log('Focus restoration:', focusRestored ? 'success' : 'failed');
        }
      } catch (error) {
        errorHandler.handleRestorationError('Failed to restore state on popstate', error, {
          pathname: window.location.pathname
        });
        
        // Fallback to top on error
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    });
  }

  /**
   * Handle page load events
   * Attempts to restore state from current session
   * 
   * Validates: Requirement 11.3
   */
  private handlePageLoad(): void {
    this.log('Handling page load restoration');

    // Queue restoration operation
    this.queueOperation('restore', async () => {
      try {
        // Small delay to allow DOM to be ready
        await this.delay(50);

        const { pathname, search } = window.location;
        const key = generateStateKey(pathname, search);

        // Try to get state from sessionStorage
        const state = this.storageAdapter.getFromSession(key);

        if (!state) {
          this.log('No state found for page load');
          return;
        }

        this.log('Restoring state on page load:', state);

        // Restore scroll position
        const result = await this.restorationService.restoreState(state);
        
        this.log('Page load restoration result:', result);

        // Restore focus if available
        if (state.focusedElementId) {
          const focusRestored = this.focusManager.restoreFocus(state.focusedElementId);
          this.log('Focus restoration on page load:', focusRestored ? 'success' : 'failed');
        }
      } catch (error) {
        errorHandler.handleRestorationError('Failed to restore state on page load', error, {
          pathname: window.location.pathname
        });
      }
    });
  }

  /**
   * Update current state with new scroll position
   * Used for debounced scroll updates
   * 
   * @param scrollY - New scroll Y position
   * @param scrollX - New scroll X position
   */
  private updateCurrentState(scrollY: number, scrollX: number): void {
    try {
      const { pathname, search } = window.location;
      const key = generateStateKey(pathname, search);

      // Get existing state or create new one
      let state = this.storageAdapter.getFromSession(key);

      if (!state) {
        // Create new state
        state = this.captureService.captureCurrentState();
      } else {
        // Update scroll position
        state.scrollY = scrollY;
        state.scrollX = scrollX;
        state.timestamp = Date.now();
      }

      // Save updated state
      this.storageAdapter.saveToHistory(state);
      this.storageAdapter.saveToSession(key, state);

      this.log('State updated with scroll position:', { scrollY, scrollX });
    } catch (error) {
      errorHandler.handleCaptureError('Failed to update current state', error, {
        scrollY,
        scrollX,
        pathname: window.location.pathname
      });
    }
  }

  /**
   * Queue an operation for sequential execution
   * Prevents race conditions from concurrent navigation events
   * 
   * @param type - Operation type
   * @param execute - Function to execute
   * 
   * Validates: Requirement 15.5
   */
  private queueOperation(type: 'capture' | 'restore', execute: () => Promise<void>): void {
    const operation: QueuedOperation = {
      id: `${type}-${++this.operationIdCounter}`,
      type,
      execute,
      timestamp: Date.now()
    };

    this.operationQueue.push(operation);
    this.log('Operation queued:', operation.id);

    // Start processing if not already processing
    if (!this.isProcessingQueue) {
      this.processQueue();
    }
  }

  /**
   * Process queued operations sequentially
   * Ensures operations don't interfere with each other
   * 
   * Validates: Requirement 15.5
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.operationQueue.length > 0) {
      const operation = this.operationQueue.shift();
      
      if (!operation) {
        break;
      }

      this.log('Processing operation:', operation.id);

      try {
        await operation.execute();
        this.log('Operation completed:', operation.id);
      } catch (error) {
        errorHandler.handleError({
          category: operation.type === 'capture' ? ErrorCategory.CAPTURE : ErrorCategory.RESTORATION,
          severity: ErrorSeverity.MEDIUM,
          message: `Operation ${operation.id} failed`,
          error,
          metadata: {
            operationId: operation.id,
            operationType: operation.type,
            timestamp: operation.timestamp
          }
        });
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Find the closest link element from a clicked element
   * Handles cases where nested elements are clicked
   * 
   * @param element - Clicked element
   * @returns Link element or null
   */
  private findLinkElement(element: HTMLElement | null): HTMLAnchorElement | null {
    let current = element;
    let depth = 0;
    const maxDepth = 5; // Prevent infinite loops

    while (current && depth < maxDepth) {
      if (current.tagName === 'A') {
        return current as HTMLAnchorElement;
      }
      current = current.parentElement;
      depth++;
    }

    return null;
  }

  /**
   * Check if a link is external
   * 
   * @param href - Link href attribute
   * @returns True if external link
   */
  private isExternalLink(href: string): boolean {
    // Absolute URLs with different origin
    if (href.startsWith('http://') || href.startsWith('https://')) {
      try {
        const url = new URL(href);
        return url.origin !== window.location.origin;
      } catch {
        return true;
      }
    }

    // Protocol-relative URLs
    if (href.startsWith('//')) {
      return true;
    }

    // Special protocols
    if (href.startsWith('mailto:') || href.startsWith('tel:')) {
      return true;
    }

    // Internal link
    return false;
  }

  /**
   * Check if navigation is to the same page (hash only change)
   * 
   * @param href - Link href attribute
   * @returns True if same page navigation
   */
  private isSamePageNavigation(href: string): boolean {
    // Hash-only links
    if (href.startsWith('#')) {
      return true;
    }

    // Check if URL is same except for hash
    try {
      const currentUrl = new URL(window.location.href);
      const targetUrl = new URL(href, window.location.href);

      return currentUrl.pathname === targetUrl.pathname &&
             currentUrl.search === targetUrl.search &&
             currentUrl.origin === targetUrl.origin;
    } catch {
      return false;
    }
  }

  /**
   * Delay helper for async operations
   * 
   * @param ms - Milliseconds to delay
   * @returns Promise that resolves after delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Log debug message if debug mode is enabled
   * 
   * @param message - Message to log
   * @param data - Optional data to log
   */
  private log(message: string, data?: unknown): void {
    errorHandler.log(message, data);
  }

  /**
   * Log error message
   * Always logs errors regardless of debug mode
   * 
   * @param message - Error message
   * @param error - Error object
   */
  private logError(message: string, error: unknown): void {
    // Deprecated: Use errorHandler methods directly
    console.error(`[NavigationManager] ${message}`, error);
  }

  /**
   * Check if the manager is initialized
   * 
   * @returns True if initialized
   */
  public isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Get the current queue length
   * Useful for testing and debugging
   * 
   * @returns Number of queued operations
   */
  public getQueueLength(): number {
    return this.operationQueue.length;
  }

  /**
   * Check if queue is being processed
   * 
   * @returns True if processing
   */
  public isProcessing(): boolean {
    return this.isProcessingQueue;
  }

  /**
   * Manually capture current state
   * Useful for programmatic navigation
   * 
   * @returns Captured navigation state
   */
  public captureState(): NavigationState | null {
    try {
      const state = this.captureService.captureCurrentState();
      const focusId = this.focusManager.captureFocus();
      
      if (focusId) {
        state.focusedElementId = focusId;
      }

      this.storageAdapter.saveToHistory(state);
      this.storageAdapter.saveToSession(state.key, state);

      this.log('State manually captured:', state);
      return state;
    } catch (error) {
      errorHandler.handleCaptureError('Failed to manually capture state', error);
      return null;
    }
  }

  /**
   * Manually restore state
   * Useful for programmatic navigation
   * 
   * @param state - State to restore
   * @returns Promise that resolves when restoration is complete
   */
  public async restoreState(state: NavigationState): Promise<boolean> {
    try {
      this.log('Manually restoring state:', state);

      const result = await this.restorationService.restoreState(state);
      
      if (state.focusedElementId) {
        this.focusManager.restoreFocus(state.focusedElementId);
      }

      return result.success;
    } catch (error) {
      errorHandler.handleRestorationError('Failed to manually restore state', error, {
        stateKey: state.key
      });
      return false;
    }
  }

  /**
   * Clear all stored navigation states
   * Useful for testing or manual cleanup
   */
  public clearAllStates(): void {
    this.storageAdapter.clearAll();
    this.log('All navigation states cleared');
  }

  /**
   * Get storage statistics
   * 
   * @returns Object with storage information
   */
  public getStorageInfo(): {
    count: number;
    isAvailable: boolean;
    isHistoryAvailable: boolean;
  } {
    return {
      count: this.storageAdapter.getStorageCount(),
      isAvailable: this.storageAdapter.isAvailable(),
      isHistoryAvailable: this.storageAdapter.isHistoryApiAvailable()
    };
  }

  /**
   * Get performance metrics summary
   * 
   * @returns Object with Core Web Vitals and navigation metrics
   */
  public getPerformanceMetrics(): {
    lcp: number | null;
    fid: number | null;
    cls: number;
    restorationAvg: number | null;
  } {
    return performanceMonitor.getWebVitalsSummary();
  }

  /**
   * Get error statistics
   * 
   * @returns Object with error counts by category
   */
  public getErrorStats(): ReturnType<typeof errorHandler.getErrorStats> {
    return errorHandler.getErrorStats();
  }

  /**
   * Get recent error history
   * 
   * @param limit - Maximum number of errors to return
   * @returns Array of recent error contexts
   */
  public getErrorHistory(limit?: number): ReturnType<typeof errorHandler.getErrorHistory> {
    return errorHandler.getErrorHistory(limit);
  }
}

/**
 * Singleton instance of NavigationManager
 * Use this for consistent navigation management across the application
 */
export const navigationManager = new NavigationManager();
