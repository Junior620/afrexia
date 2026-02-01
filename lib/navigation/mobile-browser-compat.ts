/**
 * Mobile Browser Compatibility Utilities
 * 
 * Handles iOS Safari and mobile browser specific issues:
 * - Address bar show/hide transitions
 * - Safe-area-inset support for notched devices
 * - Document-based scroll calculations
 * - Viewport height stability
 * 
 * Requirements: 13.1, 13.4, 13.5, 13.6
 * from responsive-intelligent-navigation/requirements.md
 */

/**
 * Detect if running on iOS Safari
 */
export function isIOSSafari(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isWebKit = /WebKit/.test(ua);
  const isNotChrome = !/CriOS/.test(ua);
  const isNotFirefox = !/FxiOS/.test(ua);

  return isIOS && isWebKit && isNotChrome && isNotFirefox;
}

/**
 * Detect if running on any mobile browser
 */
export function isMobileBrowser(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  const ua = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

/**
 * Get the scrolling element for the document
 * Uses document.scrollingElement for cross-browser compatibility
 * 
 * Validates: Requirement 13.4
 * 
 * @returns The scrolling element (document.scrollingElement or document.documentElement)
 */
export function getScrollingElement(): Element {
  if (typeof document === 'undefined') {
    throw new Error('getScrollingElement can only be called in browser environment');
  }

  // Use document.scrollingElement for better mobile browser support
  // Falls back to document.documentElement for older browsers
  return document.scrollingElement || document.documentElement;
}

/**
 * Get current scroll position using document-based calculation
 * More reliable than window.scrollY on mobile browsers
 * 
 * Validates: Requirement 13.4
 * 
 * @returns Object with scrollY and scrollX positions
 */
export function getScrollPosition(): { scrollY: number; scrollX: number } {
  const scrollingElement = getScrollingElement();
  
  return {
    scrollY: Math.round(scrollingElement.scrollTop),
    scrollX: Math.round(scrollingElement.scrollLeft)
  };
}

/**
 * Set scroll position using document-based calculation
 * More reliable than window.scrollTo on some mobile browsers
 * 
 * @param scrollY - Target Y position
 * @param scrollX - Target X position
 * @param smooth - Whether to use smooth scrolling
 */
export function setScrollPosition(
  scrollY: number,
  scrollX: number = 0,
  smooth: boolean = false
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const scrollOptions: ScrollToOptions = {
    top: scrollY,
    left: scrollX,
    behavior: smooth ? 'smooth' : 'auto'
  };

  // Use window.scrollTo for best compatibility
  window.scrollTo(scrollOptions);
}

/**
 * Get safe area insets for notched devices
 * Returns the CSS env() values for safe-area-inset
 * 
 * Validates: Requirement 13.5
 * 
 * @returns Object with safe area inset values in pixels
 */
export function getSafeAreaInsets(): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  if (typeof window === 'undefined' || typeof getComputedStyle === 'undefined') {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  // Get computed style from root element
  const rootStyle = getComputedStyle(document.documentElement);

  // Parse CSS custom properties
  const parseInset = (value: string): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  return {
    top: parseInset(rootStyle.getPropertyValue('--safe-area-inset-top')),
    right: parseInset(rootStyle.getPropertyValue('--safe-area-inset-right')),
    bottom: parseInset(rootStyle.getPropertyValue('--safe-area-inset-bottom')),
    left: parseInset(rootStyle.getPropertyValue('--safe-area-inset-left'))
  };
}

/**
 * Mobile Address Bar Handler
 * 
 * Handles iOS Safari and mobile browser address bar show/hide transitions
 * to maintain stable scroll positions.
 * 
 * Validates: Requirement 13.6
 */
export class MobileAddressBarHandler {
  private lastViewportHeight: number = 0;
  private lastScrollY: number = 0;
  private isHandlingResize: boolean = false;
  private resizeTimeout: ReturnType<typeof setTimeout> | null = null;
  private listeners: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.lastViewportHeight = window.innerHeight;
      this.lastScrollY = getScrollPosition().scrollY;
    }
  }

  /**
   * Initialize the address bar handler
   * Sets up event listeners for viewport changes
   */
  public initialize(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Only initialize on mobile browsers
    if (!isMobileBrowser()) {
      return;
    }

    // Listen for resize events (triggered by address bar show/hide)
    const resizeHandler = this.handleResize.bind(this);
    window.addEventListener('resize', resizeHandler, { passive: true });
    this.listeners.push(() => {
      window.removeEventListener('resize', resizeHandler);
    });

    // Listen for scroll events to track position
    const scrollHandler = this.handleScroll.bind(this);
    window.addEventListener('scroll', scrollHandler, { passive: true });
    this.listeners.push(() => {
      window.removeEventListener('scroll', scrollHandler);
    });

    // Listen for orientationchange events
    const orientationHandler = this.handleOrientationChange.bind(this);
    window.addEventListener('orientationchange', orientationHandler);
    this.listeners.push(() => {
      window.removeEventListener('orientationchange', orientationHandler);
    });
  }

  /**
   * Destroy the handler and clean up listeners
   */
  public destroy(): void {
    // Clear timeout
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }

    // Remove all event listeners
    this.listeners.forEach(cleanup => cleanup());
    this.listeners = [];
  }

  /**
   * Handle resize events (address bar show/hide)
   * 
   * Validates: Requirement 13.6
   */
  private handleResize(): void {
    if (this.isHandlingResize) {
      return;
    }

    this.isHandlingResize = true;

    // Clear existing timeout
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    // Debounce resize handling
    this.resizeTimeout = setTimeout(() => {
      const currentHeight = window.innerHeight;
      const heightDiff = Math.abs(currentHeight - this.lastViewportHeight);

      // Check if this is likely an address bar transition
      // Address bar changes are typically 40-100px on mobile
      const isAddressBarChange = heightDiff > 30 && heightDiff < 150;

      if (isAddressBarChange) {
        // Maintain scroll position during address bar transition
        const currentScrollY = getScrollPosition().scrollY;
        
        // If scroll position changed unexpectedly, restore it
        const scrollDiff = Math.abs(currentScrollY - this.lastScrollY);
        
        if (scrollDiff > 5) {
          // Scroll position jumped, restore to last known position
          setScrollPosition(this.lastScrollY, 0, false);
        }
      }

      // Update last known values
      this.lastViewportHeight = currentHeight;
      this.isHandlingResize = false;
      this.resizeTimeout = null;
    }, 100);
  }

  /**
   * Handle scroll events to track position
   */
  private handleScroll(): void {
    // Update last known scroll position
    this.lastScrollY = getScrollPosition().scrollY;
  }

  /**
   * Handle orientation change events
   */
  private handleOrientationChange(): void {
    // Reset viewport height on orientation change
    if (typeof window !== 'undefined') {
      this.lastViewportHeight = window.innerHeight;
      this.lastScrollY = getScrollPosition().scrollY;
    }
  }

  /**
   * Get the current viewport height
   * Useful for calculations that need to account for address bar
   * 
   * @returns Current viewport height in pixels
   */
  public getViewportHeight(): number {
    return typeof window !== 'undefined' ? window.innerHeight : 0;
  }

  /**
   * Get the stable viewport height
   * Returns the last known stable height (before address bar changes)
   * 
   * @returns Stable viewport height in pixels
   */
  public getStableViewportHeight(): number {
    return this.lastViewportHeight;
  }
}

/**
 * Singleton instance of MobileAddressBarHandler
 */
export const mobileAddressBarHandler = new MobileAddressBarHandler();

/**
 * Calculate header height with safe area inset consideration
 * 
 * Validates: Requirement 13.5
 * 
 * @param headerElement - The header element
 * @returns Total header height including safe area inset
 */
export function getHeaderHeightWithSafeArea(headerElement: HTMLElement | null): number {
  if (!headerElement) {
    return 0;
  }

  const headerHeight = headerElement.getBoundingClientRect().height;
  const safeAreaInsets = getSafeAreaInsets();

  // Add safe area inset top if header is fixed/sticky
  const style = window.getComputedStyle(headerElement);
  const position = style.position;

  if (position === 'fixed' || position === 'sticky') {
    return headerHeight + safeAreaInsets.top;
  }

  return headerHeight;
}

/**
 * Check if the browser supports smooth scrolling
 * 
 * @returns True if smooth scrolling is supported
 */
export function supportsSmoothScroll(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check if CSS scroll-behavior is supported
  return 'scrollBehavior' in document.documentElement.style;
}

/**
 * Get viewport dimensions accounting for mobile browser quirks
 * 
 * @returns Object with width and height
 */
export function getViewportDimensions(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }

  // Use visualViewport API if available (more accurate on mobile)
  if (window.visualViewport) {
    return {
      width: window.visualViewport.width,
      height: window.visualViewport.height
    };
  }

  // Fallback to window.innerWidth/innerHeight
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

/**
 * Initialize all mobile browser compatibility features
 * Call this once when the application starts
 */
export function initializeMobileBrowserCompat(): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Initialize address bar handler on mobile browsers
  if (isMobileBrowser()) {
    mobileAddressBarHandler.initialize();
  }
}

/**
 * Clean up mobile browser compatibility features
 * Call this when the application is destroyed
 */
export function destroyMobileBrowserCompat(): void {
  mobileAddressBarHandler.destroy();
}
