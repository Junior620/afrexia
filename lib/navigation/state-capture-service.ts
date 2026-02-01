/**
 * State Capture Service
 * 
 * Captures navigation state before transitions including scroll position,
 * route, timestamp, section ID, and focused element.
 * 
 * Requirements: 7.1, 11.1, 11.5, 12.5 from responsive-intelligent-navigation/requirements.md
 */

import { NavigationState, generateStateKey } from '@/types/navigation';
import { performanceMonitor } from './performance-monitor';
import { getScrollPosition } from './mobile-browser-compat';

/**
 * Configuration options for StateCaptureService
 */
export interface StateCaptureConfig {
  /** Debounce delay for scroll capture in milliseconds (default: 150ms) */
  scrollDebounceDelay?: number;
  /** Threshold for section visibility (default: 0.5 = 50%) */
  sectionVisibilityThreshold?: number;
  /** Attribute name for section identifiers (default: 'data-section') */
  sectionAttribute?: string;
}

/**
 * Service for capturing navigation state before transitions
 * 
 * Implements:
 * - Scroll position capture with debouncing
 * - Section detection using IntersectionObserver
 * - Focused element capture
 * - State key generation
 * 
 * Validates: Requirements 7.1, 11.1, 11.5, 12.5
 */
export class StateCaptureService {
  private config: Required<StateCaptureConfig>;
  private sectionObserver: IntersectionObserver | null = null;
  private currentSectionId: string | null = null;
  private scrollDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private lastCapturedScrollY: number = 0;
  private isInitialized: boolean = false;

  constructor(config: StateCaptureConfig = {}) {
    this.config = {
      scrollDebounceDelay: config.scrollDebounceDelay ?? 150,
      sectionVisibilityThreshold: config.sectionVisibilityThreshold ?? 0.5,
      sectionAttribute: config.sectionAttribute ?? 'data-section'
    };
  }

  /**
   * Initialize the service and start observing sections
   * Should be called once when the service is ready to start capturing
   */
  public initialize(): void {
    if (this.isInitialized) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    this.setupSectionObserver();
    this.isInitialized = true;
  }

  /**
   * Clean up observers and timers
   */
  public destroy(): void {
    if (this.sectionObserver) {
      this.sectionObserver.disconnect();
      this.sectionObserver = null;
    }

    if (this.scrollDebounceTimer) {
      clearTimeout(this.scrollDebounceTimer);
      this.scrollDebounceTimer = null;
    }

    this.isInitialized = false;
  }

  /**
   * Captures the current navigation state
   * 
   * Records:
   * - Scroll position (scrollY, scrollX)
   * - Current route and state key
   * - Timestamp
   * - Current section ID (if available)
   * - Focused element ID (if available)
   * - URL hash (if present)
   * 
   * @returns NavigationState object with current state
   * 
   * Validates: Requirements 7.1, 11.1
   */
  public captureCurrentState(): NavigationState {
    if (typeof window === 'undefined') {
      throw new Error('StateCaptureService can only be used in browser environment');
    }

    // Measure state capture performance
    return performanceMonitor.measureStateCapture(() => {
      const { pathname, search, hash } = window.location;
      const scrollY = this.getScrollY();
      const scrollX = this.getScrollX();
      const timestamp = Date.now();
      const route = pathname;
      const key = generateStateKey(pathname, search);

      // Capture optional fields
      const sectionId = this.currentSectionId ?? undefined;
      const focusedElementId = this.getFocusedElementId();
      const hashValue = hash ? hash.slice(1) : undefined; // Remove leading #

      const state: NavigationState = {
        key,
        scrollY,
        scrollX,
        timestamp,
        route,
        ...(sectionId && { sectionId }),
        ...(focusedElementId && { focusedElementId }),
        ...(hashValue && { hash: hashValue })
      };

      // Update last captured scroll position
      this.lastCapturedScrollY = scrollY;

      return state;
    }, {
      pathname: window.location.pathname,
      scrollY: this.getScrollY()
    });
  }

  /**
   * Determines if state should be captured for a navigation event
   * 
   * State should be captured for:
   * - Internal link clicks
   * - Programmatic navigation
   * - Before popstate events
   * 
   * State should NOT be captured for:
   * - Same-page hash navigation
   * - External links
   * - New tab/window navigation
   * 
   * @param url - Target URL
   * @param isExternal - Whether the link is external
   * @param isSamePage - Whether navigation is to same page (hash only)
   * @returns True if state should be captured
   * 
   * Validates: Requirement 11.5
   */
  public shouldCaptureState(
    url: string,
    isExternal: boolean = false,
    isSamePage: boolean = false
  ): boolean {
    // Don't capture for external links
    if (isExternal) {
      return false;
    }

    // Don't capture for same-page hash navigation
    if (isSamePage) {
      return false;
    }

    // Capture for all other internal navigation
    return true;
  }

  /**
   * Debounced scroll position capture
   * Limits scroll capture to maximum 1 write per debounce delay (default 150ms)
   * 
   * @param callback - Function to call with captured scroll position
   * 
   * Validates: Requirement 12.5
   */
  public debounceScrollCapture(callback: (scrollY: number, scrollX: number) => void): void {
    if (this.scrollDebounceTimer) {
      clearTimeout(this.scrollDebounceTimer);
    }

    this.scrollDebounceTimer = setTimeout(() => {
      const scrollY = this.getScrollY();
      const scrollX = this.getScrollX();

      // Only call callback if scroll position has changed
      if (scrollY !== this.lastCapturedScrollY) {
        callback(scrollY, scrollX);
        this.lastCapturedScrollY = scrollY;
      }

      this.scrollDebounceTimer = null;
    }, this.config.scrollDebounceDelay);
  }

  /**
   * Get current section ID
   * @returns Current section ID or null
   */
  public getCurrentSectionId(): string | null {
    return this.currentSectionId;
  }

  /**
   * Set current section ID (for testing or manual override)
   * @param sectionId - Section ID to set
   */
  public setCurrentSectionId(sectionId: string | null): void {
    this.currentSectionId = sectionId;
  }

  /**
   * Setup IntersectionObserver to track visible sections
   * 
   * Sections are identified by:
   * - data-section attribute
   * - id attribute (fallback)
   * 
   * A section is considered "current" if >50% visible in viewport
   * Priority: highest section in viewport if multiple visible
   * 
   * Validates: Requirement 11.1
   */
  private setupSectionObserver(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    // Disconnect existing observer if any
    if (this.sectionObserver) {
      this.sectionObserver.disconnect();
    }

    const options: IntersectionObserverInit = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: [0, 0.25, 0.5, 0.75, 1.0]
    };

    this.sectionObserver = new IntersectionObserver((entries) => {
      // Find sections that are more than threshold visible
      const visibleSections = entries
        .filter(entry => entry.intersectionRatio >= this.config.sectionVisibilityThreshold)
        .map(entry => ({
          element: entry.target as HTMLElement,
          ratio: entry.intersectionRatio,
          top: entry.boundingClientRect.top
        }))
        .sort((a, b) => a.top - b.top); // Sort by position (highest first)

      if (visibleSections.length > 0) {
        // Use the highest visible section
        const topSection = visibleSections[0];
        const sectionId = this.getSectionId(topSection.element);
        
        if (sectionId) {
          this.currentSectionId = sectionId;
        }
      } else {
        // No sections meet threshold, find the most visible one
        const mostVisible = entries
          .filter(entry => entry.intersectionRatio > 0)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (mostVisible) {
          const sectionId = this.getSectionId(mostVisible.target as HTMLElement);
          if (sectionId) {
            this.currentSectionId = sectionId;
          }
        }
      }
    }, options);

    // Observe all sections
    this.observeSections();
  }

  /**
   * Find and observe all section elements
   */
  private observeSections(): void {
    if (!this.sectionObserver) {
      return;
    }

    // Find elements with data-section attribute
    const sectionsWithAttribute = document.querySelectorAll(`[${this.config.sectionAttribute}]`);
    
    // Find major section elements (common section tags)
    const sectionElements = document.querySelectorAll('section[id], main[id], article[id]');

    // Combine and observe all
    const allSections = new Set([...sectionsWithAttribute, ...sectionElements]);
    
    allSections.forEach(section => {
      this.sectionObserver!.observe(section);
    });
  }

  /**
   * Get section ID from element
   * Priority: data-section attribute > id attribute
   * 
   * @param element - Element to get section ID from
   * @returns Section ID or null
   */
  private getSectionId(element: HTMLElement): string | null {
    // Check data-section attribute first
    const dataSection = element.getAttribute(this.config.sectionAttribute);
    if (dataSection) {
      return dataSection;
    }

    // Fallback to id attribute
    const id = element.id;
    if (id) {
      return id;
    }

    return null;
  }

  /**
   * Get current vertical scroll position
   * Uses document.scrollingElement for cross-browser compatibility
   * Particularly important for mobile browsers
   * 
   * @returns Current scrollY position in pixels
   * 
   * Validates: Requirement 13.4
   */
  private getScrollY(): number {
    if (typeof window === 'undefined') {
      return 0;
    }

    return getScrollPosition().scrollY;
  }

  /**
   * Get current horizontal scroll position
   * Uses document.scrollingElement for cross-browser compatibility
   * 
   * @returns Current scrollX position in pixels
   * 
   * Validates: Requirement 13.4
   */
  private getScrollX(): number {
    if (typeof window === 'undefined') {
      return 0;
    }

    return getScrollPosition().scrollX;
  }

  /**
   * Get ID of currently focused element
   * Only returns ID if element has one
   * 
   * @returns Focused element ID or null
   * 
   * Validates: Requirement 11.1
   */
  private getFocusedElementId(): string | null {
    if (typeof document === 'undefined') {
      return null;
    }

    const activeElement = document.activeElement;
    
    // Check if there's a focused element and it has an ID
    if (activeElement && activeElement !== document.body && activeElement.id) {
      return activeElement.id;
    }

    return null;
  }
}

// Export singleton instance for convenience
export const stateCaptureService = new StateCaptureService();
