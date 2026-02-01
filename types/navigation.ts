/**
 * Type definitions for intelligent navigation and state management
 * Requirements: 7.4, 10.3, 10.5 from responsive-intelligent-navigation/requirements.md
 */

/**
 * Navigation state interface representing the complete navigation context for a page view
 * 
 * @property key - Unique identifier composed of pathname + search params
 * @property scrollY - Vertical scroll position in pixels
 * @property scrollX - Horizontal scroll position in pixels (usually 0)
 * @property timestamp - Unix timestamp when state was captured
 * @property route - Full pathname without query params
 * @property sectionId - Optional ID of the section user was viewing
 * @property focusedElementId - Optional ID of the element that had focus
 * @property hash - Optional URL hash fragment if present
 * 
 * Validates: Requirements 7.4, 10.5
 */
export interface NavigationState {
  key: string;
  scrollY: number;
  scrollX: number;
  timestamp: number;
  route: string;
  sectionId?: string;
  focusedElementId?: string;
  hash?: string;
}

/**
 * Type guard to check if an object is a valid NavigationState
 * 
 * @param state - Object to validate
 * @returns True if the object is a valid NavigationState
 */
export function isNavigationState(state: unknown): state is NavigationState {
  if (!state || typeof state !== 'object') {
    return false;
  }

  const s = state as Record<string, unknown>;

  // Check required fields
  if (typeof s.key !== 'string' || s.key.length === 0) {
    return false;
  }

  if (typeof s.scrollY !== 'number' || s.scrollY < 0) {
    return false;
  }

  if (typeof s.scrollX !== 'number' || s.scrollX < 0) {
    return false;
  }

  if (typeof s.timestamp !== 'number' || s.timestamp <= 0) {
    return false;
  }

  if (typeof s.route !== 'string' || s.route.length === 0) {
    return false;
  }

  // Check optional fields if present
  if (s.sectionId !== undefined && typeof s.sectionId !== 'string') {
    return false;
  }

  if (s.focusedElementId !== undefined && typeof s.focusedElementId !== 'string') {
    return false;
  }

  if (s.hash !== undefined && typeof s.hash !== 'string') {
    return false;
  }

  return true;
}

/**
 * Generates a unique state key from pathname and search parameters
 * 
 * Format: pathname + (search ? `?${search}` : '')
 * Example: "/products?category=electronics"
 * 
 * @param pathname - The URL pathname (e.g., "/products")
 * @param search - The URL search parameters (e.g., "category=electronics")
 * @returns Unique state key
 * 
 * Validates: Requirement 10.3
 */
export function generateStateKey(pathname: string, search?: string): string {
  if (!pathname) {
    throw new Error('Pathname is required to generate state key');
  }

  // Ensure pathname starts with /
  const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;

  // Remove leading ? from search if present
  const normalizedSearch = search?.startsWith('?') ? search.slice(1) : search;

  return normalizedSearch 
    ? `${normalizedPathname}?${normalizedSearch}`
    : normalizedPathname;
}

/**
 * Validates a navigation state object
 * 
 * @param state - State object to validate
 * @returns True if valid, false otherwise
 * 
 * Validates: Requirement 10.5
 */
export function validateNavigationState(state: unknown): state is NavigationState {
  return isNavigationState(state);
}

/**
 * Restoration type priority enum
 * Defines the priority order for scroll restoration
 */
export enum RestorationType {
  HASH = 'hash',
  SECTION = 'section',
  SCROLL = 'scroll',
  TOP = 'top'
}

/**
 * Mobile menu state interface
 */
export interface MobileMenuState {
  isOpen: boolean;
  focusTrapActive: boolean;
  previousFocusElement: HTMLElement | null;
  animationDuration: 300;
}

/**
 * Navigation event types
 */
export type NavigationEventType = 
  | 'link-click'
  | 'popstate'
  | 'page-load'
  | 'hash-change'
  | 'programmatic';

/**
 * Navigation event interface
 */
export interface NavigationEvent {
  type: NavigationEventType;
  url: string;
  timestamp: number;
  state?: NavigationState;
}
