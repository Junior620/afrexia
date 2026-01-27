import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from '../ThemeProvider';
import { useTheme } from '@/hooks/useTheme';

describe('ThemeProvider - localStorage error handling', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    vi.restoreAllMocks();
  });

  it('should handle localStorage.getItem throwing an error', () => {
    // Mock localStorage.getItem to throw an error
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('localStorage unavailable');
    });

    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider storageKey="test-theme">
          {children}
        </ThemeProvider>
      ),
    });

    // Should fall back to system preference (light in test environment)
    expect(result.current.theme).toBe('light');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Failed to read theme from localStorage:',
      expect.any(Error)
    );

    getItemSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it('should handle localStorage.setItem throwing an error', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('localStorage quota exceeded');
    });

    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider storageKey="test-theme">
          {children}
        </ThemeProvider>
      ),
    });

    // Try to set theme
    act(() => {
      result.current.setTheme('dark');
    });

    // Theme should still be updated in memory even if storage fails
    expect(result.current.theme).toBe('dark');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Failed to save theme to localStorage:',
      expect.any(Error)
    );

    setItemSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it('should continue functioning without persistence when localStorage is unavailable', () => {
    // Mock both getItem and setItem to throw errors
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('localStorage unavailable');
    });
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('localStorage unavailable');
    });

    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider storageKey="test-theme">
          {children}
        </ThemeProvider>
      ),
    });

    // Should initialize with system preference
    expect(result.current.theme).toBe('light');

    // Should be able to toggle theme
    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Should be able to toggle back
    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Verify warnings were logged
    expect(consoleWarnSpy).toHaveBeenCalled();

    getItemSpy.mockRestore();
    setItemSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it('should fall back to in-memory state when localStorage fails', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('localStorage unavailable');
    });
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('localStorage unavailable');
    });

    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result, unmount } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider defaultTheme="dark" storageKey="test-theme">
          {children}
        </ThemeProvider>
      ),
    });

    // Should use defaultTheme when localStorage fails
    expect(result.current.theme).toBe('dark');

    // Should maintain state in memory
    act(() => {
      result.current.setTheme('light');
    });

    expect(result.current.theme).toBe('light');

    unmount();

    getItemSpy.mockRestore();
    setItemSpy.mockRestore();
  });
});

describe('ThemeProvider - preference priority logic', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    vi.restoreAllMocks();
  });

  it('should use user preference when it overrides system preference', () => {
    const storageKey = 'test-theme-priority';
    
    // Set user preference to dark
    localStorage.setItem(storageKey, 'dark');
    
    // Mock system preference to light (opposite of user preference)
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: false, // System prefers light
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    })) as any;

    const { result, unmount } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider storageKey={storageKey}>
          {children}
        </ThemeProvider>
      ),
    });

    // Should use stored user preference (dark), not system preference (light)
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    unmount();
    window.matchMedia = originalMatchMedia;
    localStorage.removeItem(storageKey);
  });

  it('should use system preference when no user preference exists', () => {
    const storageKey = 'test-theme-system';
    
    // Ensure no stored preference
    localStorage.removeItem(storageKey);
    
    // Mock system preference to dark
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)', // System prefers dark
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    })) as any;

    const { result, unmount } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider storageKey={storageKey}>
          {children}
        </ThemeProvider>
      ),
    });

    // Should use system preference (dark)
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    unmount();
    window.matchMedia = originalMatchMedia;
  });

  it('should detect system preference changes when no user preference is stored', () => {
    const storageKey = 'test-theme-change';
    
    // Ensure no stored preference
    localStorage.removeItem(storageKey);
    
    // Create a mock MediaQueryList with event listener support
    let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;
    const mockMediaQueryList = {
      matches: false, // Initially light
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: (event: string, handler: any) => {
        if (event === 'change') {
          changeHandler = handler;
        }
      },
      removeEventListener: () => {
        changeHandler = null;
      },
      dispatchEvent: () => true,
    };

    const originalMatchMedia = window.matchMedia;
    window.matchMedia = (() => mockMediaQueryList) as any;

    const { result, unmount } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider storageKey={storageKey}>
          {children}
        </ThemeProvider>
      ),
    });

    // Initially should be light (system preference)
    expect(result.current.theme).toBe('light');

    // Simulate system preference change to dark
    act(() => {
      mockMediaQueryList.matches = true;
      if (changeHandler) {
        changeHandler({
          matches: true,
          media: '(prefers-color-scheme: dark)',
        } as MediaQueryListEvent);
      }
    });

    // Should update to dark
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    unmount();
    window.matchMedia = originalMatchMedia;
  });

  it('should NOT update theme on system preference change when user preference exists', () => {
    const storageKey = 'test-theme-no-change';
    
    // Set user preference to light
    localStorage.setItem(storageKey, 'light');
    
    // Create a mock MediaQueryList with event listener support
    let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;
    const mockMediaQueryList = {
      matches: false, // Initially light
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: (event: string, handler: any) => {
        if (event === 'change') {
          changeHandler = handler;
        }
      },
      removeEventListener: () => {
        changeHandler = null;
      },
      dispatchEvent: () => true,
    };

    const originalMatchMedia = window.matchMedia;
    window.matchMedia = (() => mockMediaQueryList) as any;

    const { result, unmount } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider storageKey={storageKey}>
          {children}
        </ThemeProvider>
      ),
    });

    // Should use stored preference (light)
    expect(result.current.theme).toBe('light');

    // Simulate system preference change to dark
    act(() => {
      mockMediaQueryList.matches = true;
      if (changeHandler) {
        changeHandler({
          matches: true,
          media: '(prefers-color-scheme: dark)',
        } as MediaQueryListEvent);
      }
    });

    // Should still be light (user preference takes priority)
    expect(result.current.theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    unmount();
    window.matchMedia = originalMatchMedia;
    localStorage.removeItem(storageKey);
  });
});
