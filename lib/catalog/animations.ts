/**
 * Catalog Animation Utilities
 * Smooth animations and transitions for catalog components
 * Requirements: Task 24.4 - Polish animations and transitions
 */

/**
 * Modal/Drawer Animation Classes
 * Smooth open/close animations for modals and drawers
 */
export const modalAnimations = {
  // Backdrop fade in/out
  backdrop: {
    enter: 'transition-opacity duration-300 ease-out',
    enterFrom: 'opacity-0',
    enterTo: 'opacity-100',
    leave: 'transition-opacity duration-200 ease-in',
    leaveFrom: 'opacity-100',
    leaveTo: 'opacity-0',
  },
  
  // Modal scale and fade
  modal: {
    enter: 'transition-all duration-300 ease-out',
    enterFrom: 'opacity-0 scale-95',
    enterTo: 'opacity-100 scale-100',
    leave: 'transition-all duration-200 ease-in',
    leaveFrom: 'opacity-100 scale-100',
    leaveTo: 'opacity-0 scale-95',
  },
  
  // Drawer slide from right
  drawerRight: {
    enter: 'transition-transform duration-300 ease-out',
    enterFrom: 'translate-x-full',
    enterTo: 'translate-x-0',
    leave: 'transition-transform duration-250 ease-in',
    leaveFrom: 'translate-x-0',
    leaveTo: 'translate-x-full',
  },
  
  // Drawer slide from bottom (mobile)
  drawerBottom: {
    enter: 'transition-transform duration-300 ease-out',
    enterFrom: 'translate-y-full',
    enterTo: 'translate-y-0',
    leave: 'transition-transform duration-250 ease-in',
    leaveFrom: 'translate-y-0',
    leaveTo: 'translate-y-full',
  },
};

/**
 * Card Hover Animation Classes
 * Smooth hover effects for product cards
 */
export const cardAnimations = {
  // Elevation and shadow on hover
  hover: 'transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1',
  
  // Image scale on hover
  imageHover: 'transition-transform duration-500 ease-out group-hover:scale-105',
  
  // Button hover
  buttonHover: 'transition-all duration-200 ease-in-out hover:shadow-lg active:scale-95',
};

/**
 * Filter Animation Classes
 * Smooth transitions for filter application
 */
export const filterAnimations = {
  // Filter chip fade in
  chipEnter: 'animate-in fade-in slide-in-from-left-2 duration-200',
  
  // Filter chip fade out
  chipLeave: 'animate-out fade-out slide-out-to-left-2 duration-150',
  
  // Product count update
  countUpdate: 'transition-all duration-300 ease-out',
  
  // Filter dropdown
  dropdown: {
    enter: 'transition-all duration-200 ease-out',
    enterFrom: 'opacity-0 scale-95 -translate-y-2',
    enterTo: 'opacity-100 scale-100 translate-y-0',
    leave: 'transition-all duration-150 ease-in',
    leaveFrom: 'opacity-100 scale-100 translate-y-0',
    leaveTo: 'opacity-0 scale-95 -translate-y-2',
  },
};

/**
 * Loading Animation Classes
 * Smooth loading states
 */
export const loadingAnimations = {
  // Skeleton pulse
  skeleton: 'animate-pulse',
  
  // Spinner rotation
  spinner: 'animate-spin',
  
  // Fade in when loaded
  fadeIn: 'animate-in fade-in duration-500',
};

/**
 * Scroll Animation Classes
 * Smooth scroll-based animations
 */
export const scrollAnimations = {
  // Sticky header shrink
  stickyHeader: 'transition-all duration-200 ease-out',
  
  // Scroll reveal
  reveal: 'transition-all duration-700 ease-out',
  revealFrom: 'opacity-0 translate-y-8',
  revealTo: 'opacity-100 translate-y-0',
};

/**
 * Toast/Notification Animation Classes
 * Smooth toast notifications
 */
export const toastAnimations = {
  enter: 'transition-all duration-300 ease-out',
  enterFrom: 'opacity-0 translate-y-2 scale-95',
  enterTo: 'opacity-100 translate-y-0 scale-100',
  leave: 'transition-all duration-200 ease-in',
  leaveFrom: 'opacity-100 translate-y-0 scale-100',
  leaveTo: 'opacity-0 translate-y-2 scale-95',
};

/**
 * Stagger Animation Delays
 * For staggered list animations
 */
export const staggerDelays = [
  'delay-0',
  'delay-75',
  'delay-100',
  'delay-150',
  'delay-200',
  'delay-300',
];

/**
 * Animation Timing Functions
 * Custom easing functions
 */
export const easings = {
  // Smooth ease out (default for most animations)
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  
  // Smooth ease in
  easeIn: 'cubic-bezier(0.7, 0, 0.84, 0)',
  
  // Smooth ease in-out
  easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  
  // Spring-like bounce
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
};

/**
 * Reduced Motion Support
 * Respects user's prefers-reduced-motion setting
 */
export const reducedMotionClass = 'motion-reduce:transition-none motion-reduce:animate-none';

/**
 * Helper function to combine animation classes
 */
export function combineAnimations(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Helper function to get animation delay class
 */
export function getStaggerDelay(index: number): string {
  return staggerDelays[Math.min(index, staggerDelays.length - 1)];
}
