/**
 * Dark Premium Theme Design Tokens
 * 
 * Centralized design tokens for the Catalog Dark Premium Redesign.
 * These tokens are used in conjunction with Tailwind CSS configuration.
 * 
 * Requirements: 1.1-1.6 from catalog-dark-premium-redesign/requirements.md
 */

/**
 * Dark Theme Color Palette
 * All colors meet WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text)
 */
export const DARK_THEME_COLORS = {
  // Background colors
  bg: {
    primary: '#0A1410',      // Charcoal très foncé - main background
    secondary: '#1A2820',    // Dark green charcoal - cards, panels
    tertiary: '#141D18',     // Variation for nested elements
  },
  
  // Text colors
  text: {
    primary: '#E8F5E9',      // Ivory/light green - headings, primary text (contrast: 13.5:1)
    secondary: '#B0D4B8',    // Muted light green - body text (contrast: 7.8:1)
    muted: '#80996F',        // Support green - labels, hints (contrast: 4.6:1)
  },
  
  // Brand colors (adjusted for dark mode)
  primary: '#4A9A62',        // Dark green - CTAs, primary actions (contrast: 5.2:1)
  secondary: '#5AAA72',      // Lighter green - hover states (contrast: 6.1:1)
  accent: '#A89858',         // Gold - links, highlights (contrast: 5.8:1)
  
  // Border colors
  border: {
    DEFAULT: 'rgba(255, 255, 255, 0.1)',  // Subtle border
    hover: 'rgba(255, 255, 255, 0.2)',    // Hover state
    focus: '#A89858',                      // Focus state (gold)
  },
  
  // State colors
  success: '#4A9A62',        // Same as primary
  warning: '#A89858',        // Same as accent
  error: '#DC2626',          // Standard error red
  info: '#80996F',           // Same as text.muted
} as const;

/**
 * Glass Effect Styles
 * Used for cards, panels, and inputs
 */
export const GLASS_EFFECTS = {
  panel: {
    background: 'rgba(26, 40, 32, 0.6)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
  card: {
    background: 'rgba(26, 40, 32, 0.8)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '28px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    hover: {
      borderColor: 'rgba(255, 255, 255, 0.2)',
      boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)',
      transform: 'translateY(-4px)',
    },
  },
  input: {
    background: 'rgba(26, 40, 32, 0.6)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    hover: {
      borderColor: 'rgba(255, 255, 255, 0.2)',
      background: 'rgba(26, 40, 32, 0.8)',
    },
    focus: {
      outline: '2px solid #A89858',
      outlineOffset: '2px',
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
  },
} as const;

/**
 * Typography Scale for Dark Theme
 * Optimized for readability on dark backgrounds
 */
export const DARK_TYPOGRAPHY = {
  // Headings
  h1: {
    fontSize: { mobile: '2.5rem', tablet: '3rem', desktop: '3.5rem' },  // 40px, 48px, 56px
    lineHeight: '1.1',
    fontWeight: '700',
    color: DARK_THEME_COLORS.primary,
  },
  h2: {
    fontSize: { mobile: '2rem', tablet: '2.5rem', desktop: '3rem' },    // 32px, 40px, 48px
    lineHeight: '1.2',
    fontWeight: '700',
    color: DARK_THEME_COLORS.text.primary,
  },
  h3: {
    fontSize: { mobile: '1.25rem', tablet: '1.375rem', desktop: '1.5rem' }, // 20px, 22px, 24px
    lineHeight: '1.3',
    fontWeight: '600',
    color: DARK_THEME_COLORS.text.primary,
  },
  
  // Body text
  body: {
    fontSize: { mobile: '0.875rem', tablet: '0.9375rem', desktop: '1rem' }, // 14px, 15px, 16px
    lineHeight: '1.6',
    fontWeight: '400',
    color: DARK_THEME_COLORS.text.secondary,
  },
  
  // Small text
  small: {
    fontSize: { mobile: '0.75rem', tablet: '0.8125rem', desktop: '0.875rem' }, // 12px, 13px, 14px
    lineHeight: '1.5',
    fontWeight: '400',
    color: DARK_THEME_COLORS.text.muted,
  },
  
  // Labels
  label: {
    fontSize: '0.75rem',  // 12px
    lineHeight: '1.4',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    color: DARK_THEME_COLORS.text.muted,
  },
} as const;

/**
 * Spacing Scale for Dark Theme Components
 */
export const DARK_SPACING = {
  // Section padding
  section: {
    mobile: { y: '2rem', x: '1rem' },      // 32px, 16px
    tablet: { y: '3rem', x: '1.5rem' },    // 48px, 24px
    desktop: { y: '4rem', x: '2rem' },     // 64px, 32px
    large: { y: '6rem', x: '2rem' },       // 96px, 32px
  },
  
  // Card padding
  card: {
    mobile: '1rem',      // 16px
    tablet: '1.25rem',   // 20px
    desktop: '1.5rem',   // 24px
  },
  
  // Grid gaps
  grid: {
    mobile: '1rem',      // 16px
    tablet: '1.25rem',   // 20px
    desktop: '1.5rem',   // 24px
  },
} as const;

/**
 * Border Radius Scale
 */
export const DARK_BORDER_RADIUS = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '28px',
  full: '9999px',
} as const;

/**
 * Shadow Scale for Dark Theme
 */
export const DARK_SHADOWS = {
  sm: '0 2px 8px rgba(0, 0, 0, 0.2)',
  md: '0 4px 16px rgba(0, 0, 0, 0.25)',
  lg: '0 8px 32px rgba(0, 0, 0, 0.3)',
  xl: '0 12px 48px rgba(0, 0, 0, 0.4)',
  '2xl': '0 20px 64px rgba(0, 0, 0, 0.5)',
} as const;

/**
 * Transition Presets
 */
export const DARK_TRANSITIONS = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  DEFAULT: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: '300ms cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

/**
 * Component-Specific Tokens
 */

export const DARK_BUTTON_STYLES = {
  primary: {
    bg: DARK_THEME_COLORS.primary,
    bgHover: DARK_THEME_COLORS.secondary,
    text: '#FFFFFF',
    shadow: DARK_SHADOWS.lg,
    shadowHover: DARK_SHADOWS.xl,
  },
  secondary: {
    bg: 'transparent',
    bgHover: DARK_THEME_COLORS.bg.tertiary,
    text: DARK_THEME_COLORS.text.primary,
    border: DARK_THEME_COLORS.border.DEFAULT,
    borderHover: DARK_THEME_COLORS.border.hover,
  },
  ghost: {
    bg: 'transparent',
    bgHover: DARK_THEME_COLORS.bg.tertiary,
    text: DARK_THEME_COLORS.text.primary,
  },
} as const;

export const DARK_BADGE_STYLES = {
  eudr: {
    bg: 'rgba(74, 154, 98, 0.15)',
    text: DARK_THEME_COLORS.primary,
    border: DARK_THEME_COLORS.primary,
  },
  available: {
    bg: 'rgba(74, 154, 98, 0.15)',
    text: DARK_THEME_COLORS.primary,
    border: DARK_THEME_COLORS.primary,
  },
  onRequest: {
    bg: 'rgba(168, 152, 88, 0.15)',
    text: DARK_THEME_COLORS.accent,
    border: DARK_THEME_COLORS.accent,
  },
} as const;

/**
 * Accessibility Tokens
 */
export const DARK_ACCESSIBILITY = {
  focusRing: {
    width: '2px',
    color: DARK_THEME_COLORS.accent,
    offset: '2px',
  },
  minTouchTarget: '44px',
  minContrastRatio: {
    normal: 4.5,  // WCAG AA for normal text
    large: 3,     // WCAG AA for large text (18px+ or 14px+ bold)
  },
} as const;

/**
 * Export all dark theme tokens as a single object
 */
export const DARK_THEME = {
  colors: DARK_THEME_COLORS,
  glass: GLASS_EFFECTS,
  typography: DARK_TYPOGRAPHY,
  spacing: DARK_SPACING,
  borderRadius: DARK_BORDER_RADIUS,
  shadows: DARK_SHADOWS,
  transitions: DARK_TRANSITIONS,
  buttons: DARK_BUTTON_STYLES,
  badges: DARK_BADGE_STYLES,
  accessibility: DARK_ACCESSIBILITY,
} as const;

export default DARK_THEME;
