/**
 * Property-Based Tests for Header Component
 * Feature: dark-mode-implementation
 */

import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import { Header } from '../Header';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { vi } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/en',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock translations
vi.mock('@/lib/i18n/translations', () => ({
  getTranslation: (locale: string, key: string) => {
    const translations: Record<string, string> = {
      'navigation.home': 'Home',
      'navigation.products': 'Products',
      'navigation.solutions': 'Solutions',
      'navigation.quality': 'Quality',
      'navigation.traceability': 'Traceability',
      'navigation.about': 'About',
      'navigation.resources': 'Resources',
      'navigation.blog': 'Blog',
      'navigation.contact': 'Contact',
      'navigation.rfq': 'RFQ',
    };
    return translations[key] || key;
  },
}));

describe('Feature: dark-mode-implementation, Property 6: Logo Variant Selection', () => {
  /**
   * Property 6: Logo Variant Selection
   * 
   * For any theme state, the displayed logo source should correspond to that theme
   * (light theme uses standard logo, dark theme uses dark variant logo).
   * 
   * Validates: Requirements 3.6
   */
  it('should display the correct logo variant for each theme state', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('light' as const, 'dark' as const),
        (theme) => {
          const { container } = render(
            <ThemeProvider defaultTheme={theme}>
              <Header locale="en" />
            </ThemeProvider>
          );

          // Find the logo image element
          const logoImage = container.querySelector('img[alt="Afrexia"]');
          expect(logoImage).toBeTruthy();

          // Verify the logo source matches the theme
          // Next.js Image component transforms src, so we check if it contains the expected path
          const expectedSrc = theme === 'dark' ? 'logo-dark.png' : 'logo.png';
          const src = logoImage?.getAttribute('src');
          expect(src).toBeTruthy();
          expect(src).toContain(expectedSrc);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should always have a valid logo source regardless of theme', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('light' as const, 'dark' as const),
        (theme) => {
          const { container } = render(
            <ThemeProvider defaultTheme={theme}>
              <Header locale="en" />
            </ThemeProvider>
          );

          const logoImage = container.querySelector('img[alt="Afrexia"]');
          const src = logoImage?.getAttribute('src');
          
          // Logo source should be defined and point to a valid path
          expect(src).toBeTruthy();
          // Check that it contains either logo.png or logo-dark.png
          const hasValidLogo = src?.includes('logo.png') || src?.includes('logo-dark.png');
          expect(hasValidLogo).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain logo dimensions across theme changes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('light' as const, 'dark' as const),
        (theme) => {
          const { container } = render(
            <ThemeProvider defaultTheme={theme}>
              <Header locale="en" />
            </ThemeProvider>
          );

          const logoImage = container.querySelector('img[alt="Afrexia"]');
          
          // Logo should have consistent dimensions regardless of theme
          expect(logoImage?.getAttribute('width')).toBe('180');
          expect(logoImage?.getAttribute('height')).toBe('63');
        }
      ),
      { numRuns: 100 }
    );
  });
});
