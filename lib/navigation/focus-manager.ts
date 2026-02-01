/**
 * Focus Manager
 * 
 * Manages focus capture and restoration during navigation to preserve
 * user interaction context when using browser back/forward buttons.
 * 
 * Requirements: 19.1, 19.2, 19.3, 19.4, 19.5
 * from responsive-intelligent-navigation/requirements.md
 */

import { errorHandler } from './error-handler';

/**
 * Configuration options for FocusManager
 */
export interface FocusManagerConfig {
  /** Whether to scroll element into view when restoring focus (default: true) */
  scrollIntoView?: boolean;
  /** Scroll behavior when bringing element into view (default: 'smooth') */
  scrollBehavior?: ScrollBehavior;
  /** Block alignment for scrollIntoView (default: 'center') */
  scrollBlock?: ScrollLogicalPosition;
}

/**
 * Focus Manager Class
 * 
 * Captures and restores keyboard focus during navigation to maintain
 * user interaction context. Handles edge cases like missing elements
 * and non-focusable elements gracefully.
 * 
 * Features:
 * - Focus capture (stores activeElement.id)
 * - Focus restoration with existence check
 * - scrollIntoView for restored focus elements
 * - Fallback when element doesn't exist
 * - Validation of focusable elements
 * 
 * Validates: Requirements 19.1, 19.2, 19.3, 19.4, 19.5
 */
export class FocusManager {
  private config: Required<FocusManagerConfig>;

  constructor(config: FocusManagerConfig = {}) {
    this.config = {
      scrollIntoView: config.scrollIntoView ?? true,
      scrollBehavior: config.scrollBehavior ?? 'smooth',
      scrollBlock: config.scrollBlock ?? 'center'
    };
  }

  /**
   * Capture the ID of the currently focused element
   * 
   * Only captures focus if:
   * - An element is focused (not body)
   * - The element has an ID attribute
   * 
   * @returns Focused element ID or null if no valid focus
   * 
   * Validates: Requirements 19.1, 19.4
   */
  public captureFocus(): string | null {
    if (typeof document === 'undefined') {
      return null;
    }

    const activeElement = document.activeElement;

    // Check if there's a focused element
    if (!activeElement || activeElement === document.body) {
      return null;
    }

    // Check if element has an ID
    if (!activeElement.id) {
      return null;
    }

    return activeElement.id;
  }

  /**
   * Restore focus to an element by its ID
   * 
   * Performs the following checks:
   * 1. Element exists in the DOM
   * 2. Element is focusable (not disabled, not hidden)
   * 3. Element is visible in the viewport (optional scroll)
   * 
   * If restoration fails, allows natural focus flow without error.
   * 
   * @param elementId - ID of the element to focus
   * @returns True if focus was successfully restored, false otherwise
   * 
   * Validates: Requirements 19.2, 19.3, 19.5
   */
  public restoreFocus(elementId: string): boolean {
    if (typeof document === 'undefined') {
      return false;
    }

    // Check if element ID is valid
    if (!elementId || typeof elementId !== 'string') {
      return false;
    }

    // Try to find the element
    const element = document.getElementById(elementId);

    // Element doesn't exist - fallback to natural focus flow
    if (!element) {
      return false;
    }

    // Check if element is focusable
    if (!this.isFocusable(element)) {
      return false;
    }

    try {
      // Restore focus
      element.focus();

      // Verify focus was actually set
      if (document.activeElement !== element) {
        return false;
      }

      // Ensure element is visible if configured
      if (this.config.scrollIntoView) {
        this.ensureVisible(element);
      }

      return true;
    } catch (error) {
      // Focus restoration failed, allow natural focus flow
      errorHandler.handleFocusError(`Failed to restore focus to element #${elementId}`, error, {
        elementId
      });
      return false;
    }
  }

  /**
   * Ensure an element is visible in the viewport
   * 
   * Scrolls the element into view if it's not currently visible.
   * Respects prefers-reduced-motion setting.
   * 
   * @param element - Element to make visible
   * 
   * Validates: Requirement 19.5
   */
  public ensureVisible(element: HTMLElement): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      // Check if element is already visible
      if (this.isElementVisible(element)) {
        return;
      }

      // Determine scroll behavior based on user preferences
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const behavior = prefersReducedMotion ? 'auto' : this.config.scrollBehavior;

      // Scroll element into view
      element.scrollIntoView({
        behavior,
        block: this.config.scrollBlock,
        inline: 'nearest'
      });
    } catch (error) {
      // scrollIntoView failed, element is still focused
      errorHandler.handleFocusError('Failed to scroll element into view', error, {
        elementId: element.id
      });
    }
  }

  /**
   * Check if an element is focusable
   * 
   * An element is focusable if:
   * - It's not disabled
   * - It's not hidden (display: none, visibility: hidden)
   * - It has tabindex >= -1 OR is naturally focusable
   * 
   * @param element - Element to check
   * @returns True if element is focusable
   */
  private isFocusable(element: HTMLElement): boolean {
    // Check if element is disabled
    if ('disabled' in element && (element as HTMLInputElement).disabled) {
      return false;
    }

    // Check if element is hidden
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') {
      return false;
    }

    // Check if element has opacity 0 (might be intentionally hidden)
    if (style.opacity === '0') {
      return false;
    }

    // Check if element or any parent has inert attribute
    if (this.isInert(element)) {
      return false;
    }

    // Check if element is naturally focusable or has tabindex
    if (this.isNaturallyFocusable(element)) {
      return true;
    }

    // Check for explicit tabindex
    const tabindex = element.getAttribute('tabindex');
    if (tabindex !== null) {
      const tabindexValue = parseInt(tabindex, 10);
      return !isNaN(tabindexValue) && tabindexValue >= -1;
    }

    return false;
  }

  /**
   * Check if an element is naturally focusable
   * 
   * Naturally focusable elements include:
   * - Links with href
   * - Buttons
   * - Form inputs
   * - Textareas
   * - Selects
   * - Elements with contenteditable
   * 
   * @param element - Element to check
   * @returns True if element is naturally focusable
   */
  private isNaturallyFocusable(element: HTMLElement): boolean {
    const tagName = element.tagName.toLowerCase();

    // Links with href
    if (tagName === 'a' && element.hasAttribute('href')) {
      return true;
    }

    // Buttons
    if (tagName === 'button') {
      return true;
    }

    // Form inputs (not hidden)
    if (tagName === 'input') {
      const type = (element as HTMLInputElement).type;
      return type !== 'hidden';
    }

    // Other form elements
    if (tagName === 'textarea' || tagName === 'select') {
      return true;
    }

    // Elements with contenteditable
    if (element.hasAttribute('contenteditable')) {
      const value = element.getAttribute('contenteditable');
      return value === 'true' || value === '';
    }

    return false;
  }

  /**
   * Check if an element or any of its parents has the inert attribute
   * 
   * @param element - Element to check
   * @returns True if element is inert
   */
  private isInert(element: HTMLElement): boolean {
    let current: HTMLElement | null = element;

    while (current) {
      if (current.hasAttribute('inert')) {
        return true;
      }

      // Check for aria-hidden on ancestors
      if (current.getAttribute('aria-hidden') === 'true') {
        return true;
      }

      current = current.parentElement;
    }

    return false;
  }

  /**
   * Check if an element is visible in the viewport
   * 
   * @param element - Element to check
   * @returns True if element is at least partially visible
   */
  private isElementVisible(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    // Check if element is at least partially in viewport
    const verticallyVisible = rect.top < windowHeight && rect.bottom > 0;
    const horizontallyVisible = rect.left < windowWidth && rect.right > 0;

    return verticallyVisible && horizontallyVisible;
  }

  /**
   * Check if an element with the given ID exists and is focusable
   * 
   * Useful for validation before attempting restoration
   * 
   * @param elementId - ID of the element to check
   * @returns True if element exists and is focusable
   */
  public canRestoreFocus(elementId: string): boolean {
    if (typeof document === 'undefined') {
      return false;
    }

    if (!elementId || typeof elementId !== 'string') {
      return false;
    }

    const element = document.getElementById(elementId);

    if (!element) {
      return false;
    }

    return this.isFocusable(element);
  }

  /**
   * Get the currently focused element ID
   * 
   * @returns ID of currently focused element or null
   */
  public getCurrentFocusId(): string | null {
    return this.captureFocus();
  }

  /**
   * Clear focus from the currently focused element
   * 
   * Useful for resetting focus state
   */
  public clearFocus(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const activeElement = document.activeElement;

    if (activeElement && activeElement !== document.body && 'blur' in activeElement) {
      (activeElement as HTMLElement).blur();
    }
  }
}

/**
 * Singleton instance of FocusManager
 * Use this for consistent focus management across the application
 */
export const focusManager = new FocusManager();
