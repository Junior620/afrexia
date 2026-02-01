/**
 * Type definitions for responsive design system
 * Requirements: 1.1, 1.3, 1.4, 2.1 from responsive-intelligent-navigation/requirements.md
 */

/**
 * Breakpoint names matching Tailwind configuration
 */
export type Breakpoint = 'mobile' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Breakpoint configuration with pixel values
 */
export interface BreakpointConfig {
  mobile: {
    minWidth: 0;
    maxWidth: 639;
    containerMaxWidth: string;
    containerPadding: number;
    columns: 4;
    gap: 16;
  };
  sm: {
    minWidth: 640;
    maxWidth: 767;
    containerMaxWidth: number;
    containerPadding: number;
    columns: 8;
    gap: 24;
  };
  md: {
    minWidth: 768;
    maxWidth: 1023;
    containerMaxWidth: number;
    containerPadding: number;
    columns: 12;
    gap: 32;
  };
  lg: {
    minWidth: 1024;
    maxWidth: 1279;
    containerMaxWidth: number;
    containerPadding: number;
    columns: 12;
    gap: 32;
  };
  xl: {
    minWidth: 1280;
    maxWidth: number;
    containerMaxWidth: number;
    containerPadding: number;
    columns: 12;
    gap: 32;
  };
}

/**
 * Typography scale configuration
 */
export interface TypographyScale {
  mobile: {
    base: 14;
    h1: 32;
    h2: 24;
    h3: 20;
    h4: 18;
    h5: 16;
    h6: 14;
    lineHeight: { body: 1.5; heading: 1.2 };
    letterSpacing: { heading: -0.02 };
  };
  desktop: {
    base: 16;
    h1: 48;
    h2: 36;
    h3: 28;
    h4: 24;
    h5: 20;
    h6: 16;
    lineHeight: { body: 1.5; heading: 1.2 };
    letterSpacing: { heading: -0.03 };
  };
}

/**
 * Grid configuration for current breakpoint
 */
export interface GridConfig {
  columns: number;
  gap: number;
}

/**
 * Container configuration
 */
export interface ContainerConfig {
  maxWidth: string | number;
  padding: number;
}

/**
 * Responsive state
 */
export interface ResponsiveState {
  breakpoint: Breakpoint;
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  gridConfig: GridConfig;
  containerConfig: ContainerConfig;
}

/**
 * CSS custom properties for responsive design
 */
export interface ResponsiveCSSProperties {
  '--header-height': string;
  '--safe-area-inset-top': string;
  '--safe-area-inset-right': string;
  '--safe-area-inset-bottom': string;
  '--safe-area-inset-left': string;
  '--container-padding': string;
  '--grid-gap': string;
}
