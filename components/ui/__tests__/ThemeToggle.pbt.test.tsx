import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import fc from 'fast-check';
import React from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ThemeToggle } from '../ThemeToggle';

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

  describe('Property 7: Icon State Correspondence', () => {
    it('**Validates: Requirements 1.4** - should display icon corresponding to current theme state', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('light' as const, 'dark' as const),
          (themeState) => {
            const storageKey = `test-theme-${Math.random()}`;
            
            const { container, unmount } = render(
              <ThemeProvider defaultTheme={themeState} storageKey={storageKey}>
                <ThemeToggle />
              </ThemeProvider>
            );

            // Get the button element
            const button = screen.getByRole('button', {
              name: themeState === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            });

            expect(button).toBeDefined();

            // Get all SVG elements (both icons)
            const svgs = container.querySelectorAll('svg');
            expect(svgs.length).toBe(2);

            // First SVG is the sun icon (for light mode)
            const sunIcon = svgs[0];
            // Second SVG is the moon icon (for dark mode)
            const moonIcon = svgs[1];

            if (themeState === 'light') {
              // In light mode, sun icon should be visible (opacity-100, scale-100)
              // Check using classList which works in test environment
              expect(sunIcon.classList.contains('opacity-100')).toBe(true);
              expect(sunIcon.classList.contains('scale-100')).toBe(true);
              
              // Moon icon should be hidden (opacity-0, scale-0)
              expect(moonIcon.classList.contains('opacity-0')).toBe(true);
              expect(moonIcon.classList.contains('scale-0')).toBe(true);
            } else {
              // In dark mode, moon icon should be visible (opacity-100, scale-100)
              expect(moonIcon.classList.contains('opacity-100')).toBe(true);
              expect(moonIcon.classList.contains('scale-100')).toBe(true);
              
              // Sun icon should be hidden (opacity-0, scale-0)
              expect(sunIcon.classList.contains('opacity-0')).toBe(true);
              expect(sunIcon.classList.contains('scale-0')).toBe(true);
            }

            unmount();
            localStorage.removeItem(storageKey);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
