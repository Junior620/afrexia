'use client';

import { useEffect, useState } from 'react';

/**
 * Breakpoint configuration matching Tailwind config
 * Requirements: 1.1 from responsive-intelligent-navigation/requirements.md
 */
export const BREAKPOINTS = {
  mobile: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Hook to get current breakpoint
 * Requirements: 1.2 from responsive-intelligent-navigation/requirements.md
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('mobile');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width >= BREAKPOINTS['2xl']) {
        setBreakpoint('2xl');
      } else if (width >= BREAKPOINTS.xl) {
        setBreakpoint('xl');
      } else if (width >= BREAKPOINTS.lg) {
        setBreakpoint('lg');
      } else if (width >= BREAKPOINTS.md) {
        setBreakpoint('md');
      } else if (width >= BREAKPOINTS.sm) {
        setBreakpoint('sm');
      } else {
        setBreakpoint('mobile');
      }
    };

    // Initial check
    updateBreakpoint();

    // Debounced resize handler
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateBreakpoint, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return breakpoint;
}

/**
 * Hook to check if viewport is at or above a specific breakpoint
 */
export function useMediaQuery(breakpoint: Breakpoint): boolean {
  const currentBreakpoint = useBreakpoint();
  const currentWidth = BREAKPOINTS[currentBreakpoint];
  const targetWidth = BREAKPOINTS[breakpoint];
  
  return currentWidth >= targetWidth;
}

/**
 * Hook to dynamically update header height CSS custom property
 * Requirements: 1.1 from responsive-intelligent-navigation/requirements.md
 */
export function useHeaderHeight(headerSelector: string = 'header'): number {
  const [height, setHeight] = useState(80); // Default 80px

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector(headerSelector);
      if (header) {
        const headerHeight = header.getBoundingClientRect().height;
        setHeight(headerHeight);
        // Update CSS custom property
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
      }
    };

    // Initial measurement
    updateHeaderHeight();

    // Update on resize
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateHeaderHeight, 100);
    };

    // Use ResizeObserver if available for more accurate tracking
    const header = document.querySelector(headerSelector);
    let resizeObserver: ResizeObserver | null = null;
    
    if (header && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateHeaderHeight);
      resizeObserver.observe(header);
    } else {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', handleResize);
      }
      clearTimeout(timeoutId);
    };
  }, [headerSelector]);

  return height;
}

/**
 * Hook to get responsive grid configuration
 * Requirements: 17.1, 17.2, 17.3 from responsive-intelligent-navigation/requirements.md
 */
export function useGridConfig() {
  const breakpoint = useBreakpoint();

  const config = {
    mobile: { columns: 4, gap: 16 },
    sm: { columns: 8, gap: 24 },
    md: { columns: 12, gap: 32 },
    lg: { columns: 12, gap: 32 },
    xl: { columns: 12, gap: 32 },
    '2xl': { columns: 12, gap: 32 },
  };

  return config[breakpoint];
}

/**
 * Hook to check if device is mobile (below tablet breakpoint)
 */
export function useIsMobile(): boolean {
  return !useMediaQuery('md');
}

/**
 * Hook to check if device is tablet (between sm and lg)
 */
export function useIsTablet(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'sm' || breakpoint === 'md';
}

/**
 * Hook to check if device is desktop (lg and above)
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('lg');
}
