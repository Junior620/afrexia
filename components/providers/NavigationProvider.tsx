'use client';

import { useEffect, useRef } from 'react';
import { navigationManager } from '@/lib/navigation';

interface NavigationProviderProps {
  children: React.ReactNode;
  /**
   * Whether to enable navigation state management
   * @default true
   */
  enabled?: boolean;
  /**
   * Whether to enable debug logging
   * @default false in production, true in development
   */
  debug?: boolean;
}

/**
 * Navigation Provider
 * 
 * Initializes and manages the NavigationManager for intelligent navigation
 * with state preservation across the application.
 * 
 * Features:
 * - Scroll position restoration on back/forward navigation
 * - Section-based restoration for CTA links
 * - Hash navigation with proper priority
 * - Focus restoration for accessibility
 * - Mobile browser compatibility
 * 
 * Should be placed in the root layout to ensure navigation state
 * is captured and restored across all pages.
 * 
 * @example
 * ```tsx
 * <NavigationProvider>
 *   <YourApp />
 * </NavigationProvider>
 * ```
 */
export function NavigationProvider({
  children,
  enabled = true,
  debug = process.env.NODE_ENV === 'development',
}: NavigationProviderProps) {
  const isInitialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization in development (React StrictMode)
    if (isInitialized.current) {
      return;
    }

    // Only initialize in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Initialize navigation manager
    if (enabled) {
      try {
        navigationManager.initialize();
        isInitialized.current = true;

        if (debug) {
          console.log('[NavigationProvider] NavigationManager initialized');
        }
      } catch (error) {
        console.error('[NavigationProvider] Failed to initialize NavigationManager:', error);
      }
    }

    // Cleanup on unmount
    return () => {
      if (isInitialized.current) {
        try {
          navigationManager.destroy();
          isInitialized.current = false;

          if (debug) {
            console.log('[NavigationProvider] NavigationManager destroyed');
          }
        } catch (error) {
          console.error('[NavigationProvider] Failed to destroy NavigationManager:', error);
        }
      }
    };
  }, [enabled, debug]);

  return <>{children}</>;
}
