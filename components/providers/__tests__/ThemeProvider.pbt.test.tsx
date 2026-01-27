import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import fc from 'fast-check';
import React from 'react';
import { ThemeProvider } from '../ThemeProvider';
import { useTheme } from '@/hooks/useTheme';

describe('Feature: dark-mode-implementation', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Remove dark class from document
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  describe('Property 1: Theme Toggle State Transition', () => {
    it('**Validates: Requirements 1.2, 3.1** - should toggle to opposite theme state and update DOM', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('light' as const, 'dark' as const),
          (initialTheme) => {
            const { result, unmount } = renderHook(() => useTheme(), {
              wrapper: ({ children }) => (
                <ThemeProvider defaultTheme={initialTheme} storageKey={`test-theme-${Math.random()}`}>
                  {children}
                </ThemeProvider>
              ),
            });

            // Verify initial state
            expect(result.current.theme).toBe(initialTheme);

            // Toggle theme
            act(() => {
              result.current.toggleTheme();
            });

            // Verify toggled state
            const expectedTheme = initialTheme === 'light' ? 'dark' : 'light';
            expect(result.current.theme).toBe(expectedTheme);
            
            // Verify DOM class matches new state
            expect(document.documentElement.classList.contains('dark')).toBe(
              expectedTheme === 'dark'
            );

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 2: Theme Persistence Round Trip', () => {
    it('**Validates: Requirements 4.1, 4.2** - should persist theme to localStorage and retrieve it correctly', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('light' as const, 'dark' as const),
          (themeToStore) => {
            const storageKey = `test-theme-${Math.random()}`;
            
            // First render: set the theme
            const { result: result1, unmount: unmount1 } = renderHook(() => useTheme(), {
              wrapper: ({ children }) => (
                <ThemeProvider storageKey={storageKey}>
                  {children}
                </ThemeProvider>
              ),
            });

            // Set theme (this should persist to localStorage)
            act(() => {
              result1.current.setTheme(themeToStore);
            });

            // Verify it was set
            expect(result1.current.theme).toBe(themeToStore);
            
            // Verify it was stored
            expect(localStorage.getItem(storageKey)).toBe(themeToStore);

            unmount1();

            // Second render: should retrieve the stored theme
            const { result: result2, unmount: unmount2 } = renderHook(() => useTheme(), {
              wrapper: ({ children }) => (
                <ThemeProvider storageKey={storageKey}>
                  {children}
                </ThemeProvider>
              ),
            });

            // Verify the theme was retrieved from storage
            expect(result2.current.theme).toBe(themeToStore);

            unmount2();
            
            // Cleanup
            localStorage.removeItem(storageKey);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 3: System Preference Detection', () => {
    it('**Validates: Requirements 5.1** - should match system preference when no stored preference exists', () => {
      fc.assert(
        fc.property(
          fc.boolean(),
          (prefersDark) => {
            const storageKey = `test-theme-${Math.random()}`;
            
            // Mock matchMedia to return the system preference
            const originalMatchMedia = window.matchMedia;
            window.matchMedia = ((query: string) => ({
              matches: query === '(prefers-color-scheme: dark)' ? prefersDark : false,
              media: query,
              onchange: null,
              addListener: () => {},
              removeListener: () => {},
              addEventListener: () => {},
              removeEventListener: () => {},
              dispatchEvent: () => true,
            })) as any;

            // Render without stored preference
            const { result, unmount } = renderHook(() => useTheme(), {
              wrapper: ({ children }) => (
                <ThemeProvider storageKey={storageKey}>
                  {children}
                </ThemeProvider>
              ),
            });

            // Verify theme matches system preference
            const expectedTheme = prefersDark ? 'dark' : 'light';
            expect(result.current.theme).toBe(expectedTheme);

            unmount();
            
            // Restore original matchMedia
            window.matchMedia = originalMatchMedia;
            
            // Cleanup
            localStorage.removeItem(storageKey);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 4: User Preference Priority', () => {
    it('**Validates: Requirements 5.4** - should prioritize stored user preference over system preference', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('light' as const, 'dark' as const),
          fc.boolean(),
          (storedTheme, systemPrefersDark) => {
            const storageKey = `test-theme-${Math.random()}`;
            
            // Store user preference
            localStorage.setItem(storageKey, storedTheme);
            
            // Mock matchMedia to return different system preference
            const originalMatchMedia = window.matchMedia;
            window.matchMedia = ((query: string) => ({
              matches: query === '(prefers-color-scheme: dark)' ? systemPrefersDark : false,
              media: query,
              onchange: null,
              addListener: () => {},
              removeListener: () => {},
              addEventListener: () => {},
              removeEventListener: () => {},
              dispatchEvent: () => true,
            })) as any;

            // Render with both stored preference and system preference
            const { result, unmount } = renderHook(() => useTheme(), {
              wrapper: ({ children }) => (
                <ThemeProvider storageKey={storageKey}>
                  {children}
                </ThemeProvider>
              ),
            });

            // Verify stored preference takes priority
            expect(result.current.theme).toBe(storedTheme);

            unmount();
            
            // Restore original matchMedia
            window.matchMedia = originalMatchMedia;
            
            // Cleanup
            localStorage.removeItem(storageKey);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 5: System Preference Change Response', () => {
    it('**Validates: Requirements 5.5** - should update theme when system preference changes and no user preference exists', () => {
      fc.assert(
        fc.property(
          fc.boolean(),
          fc.boolean(),
          (initialPrefersDark, changedPrefersDark) => {
            // Skip if preferences are the same (no change to test)
            if (initialPrefersDark === changedPrefersDark) return true;
            
            const storageKey = `test-theme-${Math.random()}`;
            
            // Create a mock MediaQueryList with event listener support
            let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;
            const mockMediaQueryList = {
              matches: initialPrefersDark,
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

            // Mock matchMedia
            const originalMatchMedia = window.matchMedia;
            window.matchMedia = (() => mockMediaQueryList) as any;

            // Render without stored preference
            const { result, unmount } = renderHook(() => useTheme(), {
              wrapper: ({ children }) => (
                <ThemeProvider storageKey={storageKey}>
                  {children}
                </ThemeProvider>
              ),
            });

            // Verify initial theme matches initial system preference
            const initialExpectedTheme = initialPrefersDark ? 'dark' : 'light';
            expect(result.current.theme).toBe(initialExpectedTheme);

            // Simulate system preference change
            if (changeHandler) {
              act(() => {
                mockMediaQueryList.matches = changedPrefersDark;
                changeHandler!({
                  matches: changedPrefersDark,
                  media: '(prefers-color-scheme: dark)',
                } as MediaQueryListEvent);
              });

              // Verify theme updated to match new system preference
              const changedExpectedTheme = changedPrefersDark ? 'dark' : 'light';
              expect(result.current.theme).toBe(changedExpectedTheme);
            }

            unmount();
            
            // Restore original matchMedia
            window.matchMedia = originalMatchMedia;
            
            // Cleanup
            localStorage.removeItem(storageKey);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
