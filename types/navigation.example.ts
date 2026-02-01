/**
 * Example usage of navigation types and utilities
 * This file demonstrates how to use the NavigationState interface and related functions
 */

import {
  NavigationState,
  generateStateKey,
  validateNavigationState,
  isNavigationState,
  RestorationType,
  NavigationEvent,
} from './navigation';

// Example 1: Creating a navigation state
function captureNavigationState(): NavigationState {
  const pathname = window.location.pathname;
  const search = window.location.search.slice(1); // Remove leading ?
  
  return {
    key: generateStateKey(pathname, search),
    scrollY: window.scrollY,
    scrollX: window.scrollX,
    timestamp: Date.now(),
    route: pathname,
    hash: window.location.hash,
    // Optional: capture section ID if available
    sectionId: getCurrentSectionId(),
    // Optional: capture focused element if available
    focusedElementId: document.activeElement?.id,
  };
}

// Example 2: Validating a state from storage
function restoreStateFromStorage(key: string): NavigationState | null {
  try {
    const stored = sessionStorage.getItem(`nav_state_${key}`);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    
    // Validate the state before using it
    if (validateNavigationState(parsed)) {
      return parsed;
    }
    
    console.warn('Invalid navigation state in storage:', parsed);
    return null;
  } catch (error) {
    console.error('Failed to restore state:', error);
    return null;
  }
}

// Example 3: Determining restoration priority
function determineRestorationType(
  state: NavigationState,
  currentHash: string
): RestorationType {
  // Priority 1: Hash navigation
  if (currentHash) {
    return RestorationType.HASH;
  }
  
  // Priority 2: Section-based restoration
  if (state.sectionId && document.getElementById(state.sectionId)) {
    return RestorationType.SECTION;
  }
  
  // Priority 3: Scroll position restoration
  if (state.scrollY > 0) {
    return RestorationType.SCROLL;
  }
  
  // Default: Scroll to top
  return RestorationType.TOP;
}

// Example 4: Type guard usage
function processUnknownState(data: unknown): void {
  if (isNavigationState(data)) {
    // TypeScript now knows data is NavigationState
    console.log('Valid state:', data.key, data.scrollY);
    restoreScrollPosition(data);
  } else {
    console.warn('Invalid state data received');
  }
}

// Example 5: Creating a navigation event
function createNavigationEvent(
  type: 'link-click' | 'popstate' | 'page-load',
  state?: NavigationState
): NavigationEvent {
  return {
    type,
    url: window.location.href,
    timestamp: Date.now(),
    state,
  };
}

// Helper functions (implementation examples)
function getCurrentSectionId(): string | undefined {
  // Use IntersectionObserver to detect current section
  // This is a simplified example
  const sections = document.querySelectorAll('[data-section]');
  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
      return section.id;
    }
  }
  return undefined;
}

function restoreScrollPosition(state: NavigationState): void {
  // Simplified restoration example
  window.scrollTo({
    top: state.scrollY,
    left: state.scrollX,
    behavior: 'smooth',
  });
}

// Example 6: State key generation for different URLs
const examples = {
  simple: generateStateKey('/products'),
  // Result: "/products"
  
  withQuery: generateStateKey('/products', 'category=electronics'),
  // Result: "/products?category=electronics"
  
  complex: generateStateKey('/products', 'category=electronics&sort=price&page=2'),
  // Result: "/products?category=electronics&sort=price&page=2"
  
  normalized: generateStateKey('products', '?category=electronics'),
  // Result: "/products?category=electronics"
};

console.log('State key examples:', examples);
