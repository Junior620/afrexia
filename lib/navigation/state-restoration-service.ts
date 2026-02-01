/**
 * State Restoration Service
 * 
 * Restores navigation state after transitions including scroll position,
 * section-based restoration, hash navigation, and focus restoration.
 * 
 * Implements priority resolution: hash > section > scroll > top
 * Uses two-pass restoration strategy for layout stabilization
 * 
 * Requirements: 8.2, 8.3, 9.1, 9.2, 9.4, 9.5, 12.2, 12.3
 * from responsive-intelligent-navigation/requirements.md
 */

import { NavigationState, RestorationType } from '@/types/navigation';
import { performanceMonitor } from './performance-monitor';
import {
  getScrollPosition,
  setScrollPosition,
  getHeaderHeightWithSafeArea,
  supportsSmoothScroll
} from './mobile-browser-compat';
import { errorHandler } from './error-handler';

/**
 * Configuration options for StateRestorationService
 */
export interface StateRestorationConfig {
  /** Timeout for layout stabilization in milliseconds (default: 1000ms) */
  layoutStabilizationTimeout?: number;
  /** Smooth scroll duration in milliseconds (default: 400ms) */
  smoothScrollDuration?: number;
  /** Offset margin below header in pixels (default: 16px) */
  headerOffsetMargin?: number;
  /** Default header height if detection fails (default: 80px) */
  defaultHeaderHeight?: number;
  /** Threshold for significant layout change in pixels (default: 100px) */
  layoutChangeThreshold?: number;
}

/**
 * Result of a restoration operation
 */
interface RestorationResult {
  success: boolean;
  type: RestorationType;
  targetY: number;
  actualY: number;
  error?: string;
}

/**
 * Service for restoring navigation state after transitions
 * 
 * Implements:
 * - Priority resolution algorithm (hash > section > scroll > top)
 * - Header height detection and offset calculation
 * - Smooth scroll with prefers-reduced-motion support
 * - Two-pass restoration with ResizeObserver
 * - Layout stabilization with timeout
 * 
 * Validates: Requirements 8.2, 8.3, 9.1, 9.2, 9.4, 9.5, 12.2, 12.3
 */
export class StateRestorationService {
  private config: Required<StateRestorationConfig>;
  private resizeObserver: ResizeObserver | null = null;
  private layoutStabilizationTimer: ReturnType<typeof setTimeout> | null = null;
  private cachedHeaderHeight: number | null = null;
  private isRestoring: boolean = false;

  constructor(config: StateRestorationConfig = {}) {
    this.config = {
      layoutStabilizationTimeout: config.layoutStabilizationTimeout ?? 1000,
      smoothScrollDuration: config.smoothScrollDuration ?? 400,
      headerOffsetMargin: config.headerOffsetMargin ?? 16,
      defaultHeaderHeight: config.defaultHeaderHeight ?? 80,
      layoutChangeThreshold: config.layoutChangeThreshold ?? 100
    };
  }

  /**
   * Clean up observers and timers
   */
  public destroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.layoutStabilizationTimer) {
      clearTimeout(this.layoutStabilizationTimer);
      this.layoutStabilizationTimer = null;
    }

    this.isRestoring = false;
  }

  /**
   * Restore navigation state
   * 
   * Implements two-pass restoration:
   * - Pass 1: Immediate scroll to target position
   * - Pass 2: Adjust after layout stabilization
   * 
   * @param state - Navigation state to restore
   * @returns Promise that resolves when restoration is complete
   * 
   * Validates: Requirements 9.4, 9.5, 12.2, 12.3
   */
  public async restoreState(state: NavigationState): Promise<RestorationResult> {
    if (typeof window === 'undefined') {
      return {
        success: false,
        type: RestorationType.TOP,
        targetY: 0,
        actualY: 0,
        error: 'Not in browser environment'
      };
    }

    // Prevent concurrent restoration operations
    if (this.isRestoring) {
      console.warn('Restoration already in progress, skipping');
      return {
        success: false,
        type: RestorationType.TOP,
        targetY: 0,
        actualY: 0,
        error: 'Restoration already in progress'
      };
    }

    this.isRestoring = true;

    // Mark restoration start for performance monitoring
    performanceMonitor.markRestorationStart({
      stateKey: state.key,
      scrollY: state.scrollY,
      sectionId: state.sectionId,
      hash: state.hash
    });

    try {
      // Determine restoration type and target
      const restorationType = this.determinePriority(state, window.location.hash);
      const result = await this.performTwoPassRestoration(state, restorationType);
      
      // Mark restoration complete
      performanceMonitor.markRestorationComplete({
        success: result.success,
        type: result.type,
        targetY: result.targetY,
        actualY: result.actualY
      });
      
      return result;
    } catch (error) {
      errorHandler.handleRestorationError('State restoration failed', error, {
        stateKey: state.key,
        scrollY: state.scrollY,
        sectionId: state.sectionId
      });
      
      // Mark restoration complete with error
      performanceMonitor.markRestorationComplete({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Fallback to top
      this.scrollToPosition(0, false);
      
      return {
        success: false,
        type: RestorationType.TOP,
        targetY: 0,
        actualY: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      this.isRestoring = false;
    }
  }

  /**
   * Determine restoration priority
   * 
   * Priority order:
   * 1. Hash - if URL contains hash fragment
   * 2. Section - if state contains sectionId and section exists
   * 3. Scroll - if state contains scrollY
   * 4. Top - default fallback
   * 
   * @param state - Navigation state
   * @param currentHash - Current URL hash (including #)
   * @returns Restoration type
   * 
   * Validates: Requirements 8.2, 9.1
   */
  public determinePriority(state: NavigationState, currentHash: string): RestorationType {
    // Priority 1: Hash navigation
    if (currentHash && currentHash.length > 1) {
      const hashId = currentHash.slice(1); // Remove leading #
      const element = document.getElementById(hashId);
      
      if (element) {
        return RestorationType.HASH;
      }
      
      // Hash target doesn't exist, fall through to next priority
      errorHandler.log(`Hash target #${hashId} not found, falling back to next priority`, {
        hashId,
        stateKey: state.key
      });
    }

    // Priority 2: Section-based restoration
    if (state.sectionId) {
      const element = this.findSectionElement(state.sectionId);
      
      if (element) {
        return RestorationType.SECTION;
      }
      
      // Section doesn't exist, fall through to next priority
      errorHandler.log(`Section ${state.sectionId} not found, falling back to next priority`, {
        sectionId: state.sectionId,
        stateKey: state.key
      });
    }

    // Priority 3: Scroll position restoration
    if (state.scrollY !== undefined && state.scrollY > 0) {
      return RestorationType.SCROLL;
    }

    // Priority 4: Default to top
    return RestorationType.TOP;
  }

  /**
   * Perform two-pass restoration with layout stabilization
   * 
   * Pass 1: Immediate scroll to target
   * Pass 2: Adjust after layout changes stabilize
   * 
   * @param state - Navigation state
   * @param restorationType - Type of restoration to perform
   * @returns Promise with restoration result
   * 
   * Validates: Requirements 9.4, 9.5
   */
  public async performTwoPassRestoration(
    state: NavigationState,
    restorationType: RestorationType
  ): Promise<RestorationResult> {
    // Calculate target position for pass 1
    const targetY = this.calculateTargetPosition(state, restorationType);
    
    // Pass 1: Immediate scroll
    const useSmooth = this.shouldUseSmooth();
    this.scrollToPosition(targetY, useSmooth);
    
    const pass1Y = this.getCurrentScrollY();

    // If instant scroll or scroll to top, no need for pass 2
    if (!useSmooth || restorationType === RestorationType.TOP) {
      return {
        success: true,
        type: restorationType,
        targetY,
        actualY: pass1Y
      };
    }

    // Pass 2: Monitor for layout changes and adjust
    return new Promise((resolve) => {
      const initialHeight = document.documentElement.scrollHeight;
      let hasAdjusted = false;

      // Setup ResizeObserver to detect layout changes
      if ('ResizeObserver' in window) {
        this.resizeObserver = new ResizeObserver(() => {
          if (hasAdjusted) {
            return;
          }

          const currentHeight = document.documentElement.scrollHeight;
          const heightChange = Math.abs(currentHeight - initialHeight);

          // If significant layout change detected
          if (heightChange >= this.config.layoutChangeThreshold) {
            hasAdjusted = true;
            
            // Recalculate and adjust position
            const newTargetY = this.calculateTargetPosition(state, restorationType);
            this.scrollToPosition(newTargetY, false); // Instant adjustment
            
            const finalY = this.getCurrentScrollY();
            
            // Clean up and resolve
            this.cleanupPass2();
            resolve({
              success: true,
              type: restorationType,
              targetY: newTargetY,
              actualY: finalY
            });
          }
        });

        // Observe document body for size changes
        this.resizeObserver.observe(document.body);
      }

      // Timeout: Complete restoration after stabilization period
      this.layoutStabilizationTimer = setTimeout(() => {
        const finalY = this.getCurrentScrollY();
        
        this.cleanupPass2();
        resolve({
          success: true,
          type: restorationType,
          targetY,
          actualY: finalY
        });
      }, this.config.layoutStabilizationTimeout);
    });
  }

  /**
   * Calculate target scroll position based on restoration type
   * 
   * @param state - Navigation state
   * @param restorationType - Type of restoration
   * @returns Target Y position in pixels
   * 
   * Validates: Requirements 8.3, 9.2
   */
  private calculateTargetPosition(
    state: NavigationState,
    restorationType: RestorationType
  ): number {
    switch (restorationType) {
      case RestorationType.HASH: {
        const hashId = window.location.hash.slice(1);
        const element = document.getElementById(hashId);
        
        if (element) {
          return this.calculateElementOffset(element);
        }
        
        // Fallback to scroll position if hash target not found
        return state.scrollY || 0;
      }

      case RestorationType.SECTION: {
        if (state.sectionId) {
          const element = this.findSectionElement(state.sectionId);
          
          if (element) {
            return this.calculateElementOffset(element);
          }
        }
        
        // Fallback to scroll position if section not found
        return state.scrollY || 0;
      }

      case RestorationType.SCROLL: {
        return state.scrollY || 0;
      }

      case RestorationType.TOP:
      default: {
        return 0;
      }
    }
  }

  /**
   * Calculate element offset with header height consideration
   * 
   * Offset = element.offsetTop - headerHeight - margin
   * Accounts for safe-area-inset on notched devices
   * 
   * @param element - Target element
   * @returns Y position to scroll to
   * 
   * Validates: Requirements 8.3, 9.2, 13.5
   */
  private calculateElementOffset(element: HTMLElement): number {
    const { scrollY } = getScrollPosition();
    const elementTop = element.getBoundingClientRect().top + scrollY;
    const headerHeight = this.getHeaderHeight();
    const offset = headerHeight + this.config.headerOffsetMargin;
    
    return Math.max(0, elementTop - offset);
  }

  /**
   * Detect and cache header height
   * 
   * Looks for sticky/fixed header elements and calculates their height
   * Accounts for safe-area-inset on notched devices
   * Caches result for performance
   * 
   * @returns Header height in pixels
   * 
   * Validates: Requirements 8.3, 13.5
   */
  private getHeaderHeight(): number {
    // Return cached value if available
    if (this.cachedHeaderHeight !== null) {
      return this.cachedHeaderHeight;
    }

    // Try to find header element
    const headerSelectors = [
      'header[class*="sticky"]',
      'header[class*="fixed"]',
      'nav[class*="sticky"]',
      'nav[class*="fixed"]',
      '[data-header]',
      'header'
    ];

    for (const selector of headerSelectors) {
      const header = document.querySelector(selector);
      
      if (header) {
        // Verify it's actually sticky/fixed
        const style = window.getComputedStyle(header);
        const position = style.position;
        
        if (position === 'sticky' || position === 'fixed') {
          // Use mobile-compat utility to get height with safe area
          const height = getHeaderHeightWithSafeArea(header as HTMLElement);
          this.cachedHeaderHeight = height;
          return height;
        }
      }
    }

    // Fallback to default
    this.cachedHeaderHeight = this.config.defaultHeaderHeight;
    return this.config.defaultHeaderHeight;
  }

  /**
   * Clear cached header height
   * Call this when header might have changed (e.g., responsive breakpoint)
   */
  public clearHeaderHeightCache(): void {
    this.cachedHeaderHeight = null;
  }

  /**
   * Find section element by ID
   * 
   * Checks:
   * 1. data-section attribute
   * 2. id attribute
   * 
   * @param sectionId - Section identifier
   * @returns Section element or null
   */
  private findSectionElement(sectionId: string): HTMLElement | null {
    // Try data-section attribute first
    const byDataAttr = document.querySelector(`[data-section="${sectionId}"]`);
    if (byDataAttr) {
      return byDataAttr as HTMLElement;
    }

    // Try id attribute
    const byId = document.getElementById(sectionId);
    if (byId) {
      return byId;
    }

    return null;
  }

  /**
   * Scroll to position with smooth or instant behavior
   * Uses mobile-compatible scroll utilities
   * 
   * @param targetY - Target Y position
   * @param smooth - Whether to use smooth scrolling
   * 
   * Validates: Requirements 12.2, 12.3, 13.4
   */
  private scrollToPosition(targetY: number, smooth: boolean): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Check if smooth scrolling is supported
    const canUseSmooth = smooth && supportsSmoothScroll();

    // Use mobile-compatible scroll utility
    setScrollPosition(targetY, 0, canUseSmooth);
  }

  /**
   * Determine if smooth scrolling should be used
   * 
   * Respects prefers-reduced-motion setting
   * 
   * @returns True if smooth scrolling should be used
   * 
   * Validates: Requirement 12.3
   */
  private shouldUseSmooth(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    return !prefersReducedMotion;
  }

  /**
   * Get current scroll Y position
   * Uses document.scrollingElement for cross-browser compatibility
   * Particularly important for mobile browsers
   * 
   * @returns Current scroll Y position
   * 
   * Validates: Requirement 13.4
   */
  private getCurrentScrollY(): number {
    if (typeof window === 'undefined') {
      return 0;
    }

    return getScrollPosition().scrollY;
  }

  /**
   * Clean up pass 2 observers and timers
   */
  private cleanupPass2(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.layoutStabilizationTimer) {
      clearTimeout(this.layoutStabilizationTimer);
      this.layoutStabilizationTimer = null;
    }
  }

  /**
   * Check if restoration is currently in progress
   * 
   * @returns True if restoration is in progress
   */
  public isRestorationInProgress(): boolean {
    return this.isRestoring;
  }
}

// Export singleton instance for convenience
export const stateRestorationService = new StateRestorationService();
