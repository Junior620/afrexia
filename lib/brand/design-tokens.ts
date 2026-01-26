/**
 * Design Tokens for Afrexia Brand
 * 
 * Centralized design system tokens for consistent spacing, sizing, typography,
 * and other design properties across the application.
 * 
 * These tokens are used in conjunction with Tailwind CSS configuration.
 */

import { BRAND_COLORS } from './colors';

/**
 * Spacing Scale
 * Based on 4px base unit (Tailwind default)
 */
export const SPACING = {
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
  '5xl': '8rem',   // 128px
} as const;

/**
 * Typography Scale
 * Font sizes with corresponding line heights
 */
export const TYPOGRAPHY = {
  fontSize: {
    xs: { size: '0.75rem', lineHeight: '1rem' },      // 12px
    sm: { size: '0.875rem', lineHeight: '1.25rem' },  // 14px
    base: { size: '1rem', lineHeight: '1.5rem' },     // 16px
    lg: { size: '1.125rem', lineHeight: '1.75rem' },  // 18px
    xl: { size: '1.25rem', lineHeight: '1.75rem' },   // 20px
    '2xl': { size: '1.5rem', lineHeight: '2rem' },    // 24px
    '3xl': { size: '1.875rem', lineHeight: '2.25rem' }, // 30px
    '4xl': { size: '2.25rem', lineHeight: '2.5rem' }, // 36px
    '5xl': { size: '3rem', lineHeight: '1' },         // 48px
    '6xl': { size: '3.75rem', lineHeight: '1' },      // 60px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  fontFamily: {
    sans: 'var(--font-inter), system-ui, sans-serif',
  },
} as const;

/**
 * Border Radius Scale
 */
export const BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

/**
 * Shadow Scale
 */
export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
} as const;

/**
 * Z-Index Scale
 * Consistent layering system
 */
export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

/**
 * Breakpoints
 * Responsive design breakpoints
 */
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
  '4xl': '2560px',
} as const;

/**
 * Container Max Widths
 */
export const CONTAINER_MAX_WIDTH = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
  '4xl': '2560px',
} as const;

/**
 * Transition Durations
 */
export const TRANSITIONS = {
  duration: {
    fast: '150ms',
    DEFAULT: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  timing: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

/**
 * Component-Specific Tokens
 */

export const BUTTON_STYLES = {
  primary: {
    bg: BRAND_COLORS.primary.DEFAULT,
    bgHover: BRAND_COLORS.primary.dark,
    text: BRAND_COLORS.white,
    border: 'transparent',
  },
  secondary: {
    bg: BRAND_COLORS.white,
    bgHover: BRAND_COLORS.light,
    text: BRAND_COLORS.primary.DEFAULT,
    border: BRAND_COLORS.primary.DEFAULT,
  },
  ghost: {
    bg: 'transparent',
    bgHover: BRAND_COLORS.light,
    text: BRAND_COLORS.primary.DEFAULT,
    border: 'transparent',
  },
  destructive: {
    bg: BRAND_COLORS.error.DEFAULT,
    bgHover: BRAND_COLORS.error.dark,
    text: BRAND_COLORS.white,
    border: 'transparent',
  },
} as const;

export const CARD_STYLES = {
  DEFAULT: {
    bg: BRAND_COLORS.white,
    border: BRAND_COLORS.neutral,
    shadow: SHADOWS.md,
    shadowHover: SHADOWS.xl,
    radius: BORDER_RADIUS.xl,
  },
  elevated: {
    bg: BRAND_COLORS.white,
    border: 'transparent',
    shadow: SHADOWS.lg,
    shadowHover: SHADOWS['2xl'],
    radius: BORDER_RADIUS.xl,
  },
  flat: {
    bg: BRAND_COLORS.light,
    border: BRAND_COLORS.neutral,
    shadow: SHADOWS.none,
    shadowHover: SHADOWS.sm,
    radius: BORDER_RADIUS.lg,
  },
} as const;

export const INPUT_STYLES = {
  DEFAULT: {
    bg: BRAND_COLORS.white,
    border: BRAND_COLORS.neutral,
    borderFocus: BRAND_COLORS.primary.DEFAULT,
    text: BRAND_COLORS.gray[900],
    placeholder: BRAND_COLORS.gray[400],
    radius: BORDER_RADIUS.lg,
  },
  error: {
    border: BRAND_COLORS.error.DEFAULT,
    text: BRAND_COLORS.error.DEFAULT,
  },
} as const;

/**
 * Layout Tokens
 */
export const LAYOUT = {
  headerHeight: '4rem',      // 64px
  footerHeight: 'auto',
  sidebarWidth: '16rem',     // 256px
  contentMaxWidth: '80rem',  // 1280px
  containerPadding: {
    mobile: '1rem',          // 16px
    tablet: '1.5rem',        // 24px
    desktop: '2rem',         // 32px
  },
} as const;

/**
 * Animation Tokens
 */
export const ANIMATIONS = {
  fadeIn: {
    duration: TRANSITIONS.duration.DEFAULT,
    timing: TRANSITIONS.timing.out,
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  slideUp: {
    duration: TRANSITIONS.duration.slow,
    timing: TRANSITIONS.timing.out,
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  scaleIn: {
    duration: TRANSITIONS.duration.DEFAULT,
    timing: TRANSITIONS.timing.out,
    from: { opacity: 0, transform: 'scale(0.95)' },
    to: { opacity: 1, transform: 'scale(1)' },
  },
} as const;

/**
 * Accessibility Tokens
 */
export const ACCESSIBILITY = {
  focusRing: {
    width: '2px',
    color: BRAND_COLORS.primary.DEFAULT,
    offset: '2px',
    style: 'solid',
  },
  minTouchTarget: '44px',
  minContrastRatio: {
    normal: 4.5,
    large: 3,
  },
} as const;

/**
 * Helper function to get a token value by path
 * @example getToken('SPACING.lg') // '1.5rem'
 */
export function getToken(path: string): any {
  const parts = path.split('.');
  const tokens: Record<string, any> = {
    SPACING,
    TYPOGRAPHY,
    BORDER_RADIUS,
    SHADOWS,
    Z_INDEX,
    BREAKPOINTS,
    CONTAINER_MAX_WIDTH,
    TRANSITIONS,
    BUTTON_STYLES,
    CARD_STYLES,
    INPUT_STYLES,
    LAYOUT,
    ANIMATIONS,
    ACCESSIBILITY,
  };
  
  let value: any = tokens;
  for (const part of parts) {
    value = value[part];
    if (value === undefined) {
      console.warn(`Token path "${path}" not found`);
      return undefined;
    }
  }
  
  return value;
}

/**
 * Export all tokens as a single object for convenience
 */
export const DESIGN_TOKENS = {
  SPACING,
  TYPOGRAPHY,
  BORDER_RADIUS,
  SHADOWS,
  Z_INDEX,
  BREAKPOINTS,
  CONTAINER_MAX_WIDTH,
  TRANSITIONS,
  BUTTON_STYLES,
  CARD_STYLES,
  INPUT_STYLES,
  LAYOUT,
  ANIMATIONS,
  ACCESSIBILITY,
  COLORS: BRAND_COLORS,
} as const;

export default DESIGN_TOKENS;
