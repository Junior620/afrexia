/**
 * Responsive Grid System Utilities
 * 
 * Provides TypeScript utilities for working with the responsive grid system.
 * Implements Requirements: 17.1, 17.2, 17.3, 17.4, 17.5 from responsive-intelligent-navigation/requirements.md
 */

/**
 * Breakpoint definitions matching Tailwind configuration
 */
export const BREAKPOINTS = {
  mobile: { min: 0, max: 639, columns: 4, gap: 16 },
  tablet: { min: 640, max: 767, columns: 8, gap: 24 },
  desktop: { min: 768, max: 1023, columns: 12, gap: 32 },
  largeDesktop: { min: 1024, max: Infinity, columns: 12, gap: 32 },
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Grid configuration for a specific breakpoint
 */
export interface GridConfig {
  columns: number;
  gap: number;
  breakpoint: Breakpoint;
}

/**
 * Get the current breakpoint based on viewport width
 * 
 * @param width - Viewport width in pixels
 * @returns Current breakpoint name
 */
export function getCurrentBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS.largeDesktop.min) return 'largeDesktop';
  if (width >= BREAKPOINTS.desktop.min) return 'desktop';
  if (width >= BREAKPOINTS.tablet.min) return 'tablet';
  return 'mobile';
}

/**
 * Get grid configuration for a specific breakpoint
 * 
 * @param breakpoint - Breakpoint name
 * @returns Grid configuration with columns and gap
 */
export function getGridConfig(breakpoint: Breakpoint): GridConfig {
  const config = BREAKPOINTS[breakpoint];
  return {
    columns: config.columns,
    gap: config.gap,
    breakpoint,
  };
}

/**
 * Get grid configuration for current viewport width
 * 
 * @param width - Viewport width in pixels (defaults to window.innerWidth)
 * @returns Grid configuration for current breakpoint
 */
export function getCurrentGridConfig(width?: number): GridConfig {
  const viewportWidth = width ?? (typeof window !== 'undefined' ? window.innerWidth : 0);
  const breakpoint = getCurrentBreakpoint(viewportWidth);
  return getGridConfig(breakpoint);
}

/**
 * Calculate the width of a single column at a given breakpoint
 * 
 * @param containerWidth - Total container width in pixels
 * @param breakpoint - Breakpoint name
 * @returns Width of a single column in pixels
 */
export function getColumnWidth(containerWidth: number, breakpoint: Breakpoint): number {
  const config = BREAKPOINTS[breakpoint];
  const totalGapWidth = config.gap * (config.columns - 1);
  const availableWidth = containerWidth - totalGapWidth;
  return availableWidth / config.columns;
}

/**
 * Calculate the total width of a span of columns
 * 
 * @param span - Number of columns to span
 * @param containerWidth - Total container width in pixels
 * @param breakpoint - Breakpoint name
 * @returns Total width including gaps in pixels
 */
export function getSpanWidth(
  span: number,
  containerWidth: number,
  breakpoint: Breakpoint
): number {
  const config = BREAKPOINTS[breakpoint];
  const columnWidth = getColumnWidth(containerWidth, breakpoint);
  const gapWidth = config.gap * (span - 1);
  return columnWidth * span + gapWidth;
}

/**
 * Validate that a column span is valid for a given breakpoint
 * 
 * @param span - Number of columns to span
 * @param breakpoint - Breakpoint name
 * @returns True if span is valid (1 to max columns)
 */
export function isValidSpan(span: number, breakpoint: Breakpoint): boolean {
  const config = BREAKPOINTS[breakpoint];
  return span >= 1 && span <= config.columns && Number.isInteger(span);
}

/**
 * Generate Tailwind CSS classes for responsive column spanning
 * 
 * @param mobile - Column span for mobile (1-4)
 * @param tablet - Column span for tablet (1-8)
 * @param desktop - Column span for desktop (1-12)
 * @returns Space-separated string of Tailwind classes
 */
export function getResponsiveColumnClasses(
  mobile: number,
  tablet?: number,
  desktop?: number
): string {
  const classes: string[] = [];

  // Mobile (default)
  if (isValidSpan(mobile, 'mobile')) {
    classes.push(`col-span-${mobile}`);
  }

  // Tablet
  if (tablet !== undefined && isValidSpan(tablet, 'tablet')) {
    classes.push(`sm:col-span-${tablet}`);
  }

  // Desktop
  if (desktop !== undefined && isValidSpan(desktop, 'desktop')) {
    classes.push(`md:col-span-${desktop}`);
  }

  return classes.join(' ');
}

/**
 * Generate Tailwind CSS classes for responsive grid template columns
 * 
 * @param mobile - Use mobile grid (4 columns)
 * @param tablet - Use tablet grid (8 columns)
 * @param desktop - Use desktop grid (12 columns)
 * @returns Space-separated string of Tailwind classes
 */
export function getResponsiveGridClasses(
  mobile = true,
  tablet = true,
  desktop = true
): string {
  const classes: string[] = [];

  if (mobile) {
    classes.push('grid-cols-4');
  }

  if (tablet) {
    classes.push('sm:grid-cols-8');
  }

  if (desktop) {
    classes.push('md:grid-cols-12');
  }

  return classes.join(' ');
}

/**
 * Generate Tailwind CSS classes for responsive grid gaps
 * 
 * @returns Space-separated string of Tailwind classes for responsive gaps
 */
export function getResponsiveGapClasses(): string {
  return 'gap-4 sm:gap-6 md:gap-8'; // 16px, 24px, 32px
}

/**
 * Get the gap size for a specific breakpoint
 * 
 * @param breakpoint - Breakpoint name
 * @returns Gap size in pixels
 */
export function getGapSize(breakpoint: Breakpoint): number {
  return BREAKPOINTS[breakpoint].gap;
}

/**
 * Get the number of columns for a specific breakpoint
 * 
 * @param breakpoint - Breakpoint name
 * @returns Number of columns
 */
export function getColumnCount(breakpoint: Breakpoint): number {
  return BREAKPOINTS[breakpoint].columns;
}
