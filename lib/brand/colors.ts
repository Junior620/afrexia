/**
 * Brand Color Palette
 * 
 * Centralized color definitions for the Afrexia brand.
 * Use these constants in email templates, inline styles, and anywhere
 * Tailwind classes cannot be used.
 * 
 * For component styling, prefer Tailwind classes:
 * - bg-primary, text-primary
 * - bg-secondary, text-secondary
 * - bg-accent, text-accent
 * - bg-success, text-success
 * - bg-warning, text-warning
 * - bg-info, text-info
 */

export const BRAND_COLORS = {
  // Primary brand colors
  primary: {
    DEFAULT: '#194424',
    dark: '#0F2916',
    light: '#2D6B3F',
  },
  secondary: {
    DEFAULT: '#337A49',
    dark: '#265A36',
    light: '#4A9A62',
  },
  accent: {
    DEFAULT: '#655E2C',
    dark: '#4A441F',
    light: '#8A7F3D',
  },
  
  // Supporting colors
  light: '#E9EBE5',
  support: '#80996F',
  neutral: '#B0BCA4',
  
  // Semantic colors (mapped to brand palette)
  success: {
    DEFAULT: '#337A49', // secondary
    light: '#E8F5E9',   // Very light green for backgrounds (better contrast)
    dark: '#194424',    // Primary dark green for text (better contrast)
  },
  warning: {
    DEFAULT: '#655E2C', // accent
    light: '#FFF9E6',   // Very light gold for backgrounds (better contrast)
    dark: '#4A441F',
  },
  info: {
    DEFAULT: '#80996F', // support
    light: '#F1F5EE',   // Very light green for backgrounds (better contrast)
    dark: '#556A47',    // Darker for text (better contrast)
  },
  
  // Neutral colors for backgrounds and text
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#E9EBE5',  // light
    100: '#D4D7CE',
    200: '#B0BCA4', // neutral
    300: '#8C9A7A',
    400: '#80996F', // support
    500: '#6A8159',
    600: '#556A47',
    700: '#405035',
    800: '#2D6B3F', // primary-light
    900: '#194424', // primary
  },
  
  // Error color (not from brand palette, but necessary for errors)
  error: {
    DEFAULT: '#DC2626',
    light: '#FEE2E2',
    dark: '#991B1B',
  },
} as const;

/**
 * Get a color value by path
 * @example getColor('primary') // '#194424'
 * @example getColor('primary.dark') // '#0F2916'
 */
export function getColor(path: string): string {
  const parts = path.split('.');
  let value: any = BRAND_COLORS;
  
  for (const part of parts) {
    value = value[part];
    if (value === undefined) {
      console.warn(`Color path "${path}" not found in BRAND_COLORS`);
      return '#000000';
    }
  }
  
  return typeof value === 'string' ? value : value.DEFAULT;
}

/**
 * Email-specific color palette
 * Optimized for email client compatibility
 */
export const EMAIL_COLORS = {
  header: BRAND_COLORS.primary.DEFAULT,
  headerText: BRAND_COLORS.white,
  body: BRAND_COLORS.white,
  bodyText: '#333333',
  footer: BRAND_COLORS.light,
  footerText: BRAND_COLORS.primary.DEFAULT,
  border: BRAND_COLORS.neutral,
  link: BRAND_COLORS.primary.DEFAULT,
  linkHover: BRAND_COLORS.primary.dark,
  success: BRAND_COLORS.success.light,
  successText: BRAND_COLORS.success.dark,
  warning: BRAND_COLORS.warning.light,
  warningText: BRAND_COLORS.warning.dark,
  info: BRAND_COLORS.info.light,
  infoText: BRAND_COLORS.info.dark,
  muted: '#F6F9FC',
  mutedText: '#555555',
} as const;
