/**
 * Afrexia Brand System
 * 
 * Centralized export for all brand-related constants, tokens, and utilities.
 * Import from this file to access colors, design tokens, and brand utilities.
 * 
 * @example
 * import { BRAND_COLORS, DESIGN_TOKENS, getColor } from '@/lib/brand';
 */

export * from './colors';
export * from './design-tokens';

// Re-export commonly used items for convenience
export { BRAND_COLORS, EMAIL_COLORS, getColor } from './colors';
export { DESIGN_TOKENS, getToken } from './design-tokens';
