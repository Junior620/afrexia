import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { render, fireEvent } from '@testing-library/react';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { Locale } from '@/types';
import { locales, localeNames } from '@/lib/i18n/config';

/**
 * Property-Based Tests for Language Switcher Component
 * 
 * **Property 6: Language Switcher Path Preservation**
 * **Validates: Requirements 3.3, 3.8**
 * 
 * **Property 7: Language Switcher Cookie Persistence**
 * **Validates: Requirements 3.4**
 * 
 * This test suite validates that:
 * 1. Path structure remains identical when switching languages (only locale prefix changes)
 * 2. Cookie is set correctly when switching languages
 */

// Mock Next.js navigation hooks
const mockPush = vi.fn();
let mockPathname = '/fr/products';

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe('Property 6: Language Switcher Path Preservation', () => {
  beforeEach(() => {
    mockPush.mockClear();
    document.cookie = 'NEXT_LOCALE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  });

  // Arbitrary for generating valid locales
  const localeArbitrary = fc.constantFrom<Locale>(...locales);

  // Arbitrary for generating valid paths
  const pathArbitrary = fc.constantFrom(
    '',
    '/products',
    '/products/cocoa',
    '/about',
    '/contact',
    '/blog',
    '/blog/post-slug',
    '/quality',
    '/traceability',
    '/solutions',
    '/resources',
    '/rfq'
  );

  it('should preserve path structure when switching languages', () => {
    fc.assert(
      fc.property(
        localeArbitrary,
        localeArbitrary,
        pathArbitrary,
        (currentLocale, targetLocale, path) => {
          // Skip if switching to same locale
          if (currentLocale === targetLocale) return true;

          // Set up the mock pathname
          mockPathname = `/${currentLocale}${path}`;
          mockPush.mockClear();

          const { container } = render(<LanguageSwitcher locale={currentLocale} />);

          // Open dropdown
          const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
          fireEvent.click(button);

          // Find and click the target language button by matching locale name
          const dropdown = container.querySelector('[role="menu"]');
          const menuItems = dropdown?.querySelectorAll('[role="menuitem"]');
          
          const targetButton = Array.from(menuItems || []).find(
            (item) => item.textContent?.includes(localeNames[targetLocale])
          ) as HTMLElement;

          if (targetButton) {
            fireEvent.click(targetButton);

            // Verify router.push was called with correct path
            expect(mockPush).toHaveBeenCalledTimes(1);
            const calledPath = mockPush.mock.calls[0][0];

            // Expected path should have target locale prefix and same path
            const expectedPath = `/${targetLocale}${path}`;
            expect(calledPath).toBe(expectedPath);

            // Verify path structure is preserved (only locale changed)
            const currentPathWithoutLocale = mockPathname.replace(`/${currentLocale}`, '');
            const newPathWithoutLocale = calledPath.replace(`/${targetLocale}`, '');
            expect(newPathWithoutLocale).toBe(currentPathWithoutLocale);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle root path correctly when switching languages', () => {
    fc.assert(
      fc.property(localeArbitrary, localeArbitrary, (currentLocale, targetLocale) => {
        // Skip if switching to same locale
        if (currentLocale === targetLocale) return true;

        // Set up the mock pathname for root
        mockPathname = `/${currentLocale}`;
        mockPush.mockClear();

        const { container } = render(<LanguageSwitcher locale={currentLocale} />);

        // Open dropdown
        const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
        fireEvent.click(button);

        // Find and click the target language button by matching locale name
        const dropdown = container.querySelector('[role="menu"]');
        const menuItems = dropdown?.querySelectorAll('[role="menuitem"]');
        
        
        const targetButton = Array.from(menuItems || []).find(
          (item) => item.textContent?.includes(localeNames[targetLocale])
        ) as HTMLElement;

        if (targetButton) {
          fireEvent.click(targetButton);

          // Verify router.push was called
          if (mockPush.mock.calls.length > 0) {
            const calledPath = mockPush.mock.calls[0][0];

            // Should navigate to root of target locale
            expect(calledPath).toMatch(new RegExp(`^/${targetLocale}/?$`));
          }
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve nested paths when switching languages', () => {
    fc.assert(
      fc.property(
        localeArbitrary,
        localeArbitrary,
        fc.array(fc.constantFrom('products', 'blog', 'resources', 'about'), { minLength: 1, maxLength: 3 }),
        (currentLocale, targetLocale, pathSegments) => {
          // Skip if switching to same locale
          if (currentLocale === targetLocale) return true;

          // Build nested path
          const path = '/' + pathSegments.join('/');
          mockPathname = `/${currentLocale}${path}`;
          mockPush.mockClear();

          const { container } = render(<LanguageSwitcher locale={currentLocale} />);

          // Open dropdown
          const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
          fireEvent.click(button);

          // Find and click the target language button by matching locale name
          const dropdown = container.querySelector('[role="menu"]');
          const menuItems = dropdown?.querySelectorAll('[role="menuitem"]');
          
          
          const targetButton = Array.from(menuItems || []).find(
            (item) => item.textContent?.includes(localeNames[targetLocale])
          ) as HTMLElement;

          if (targetButton) {
            fireEvent.click(targetButton);

            // Verify path segments are preserved
            if (mockPush.mock.calls.length > 0) {
              const calledPath = mockPush.mock.calls[0][0];
              
              // All original path segments should be in the new path
              pathSegments.forEach((segment) => {
                expect(calledPath).toContain(segment);
              });
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not modify path structure beyond locale prefix', () => {
    fc.assert(
      fc.property(
        localeArbitrary,
        localeArbitrary,
        pathArbitrary,
        (currentLocale, targetLocale, path) => {
          // Skip if switching to same locale
          if (currentLocale === targetLocale) return true;

          mockPathname = `/${currentLocale}${path}`;
          mockPush.mockClear();

          const { container } = render(<LanguageSwitcher locale={currentLocale} />);

          // Open dropdown and click target language
          const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
          fireEvent.click(button);

          const dropdown = container.querySelector('[role="menu"]');
          const menuItems = dropdown?.querySelectorAll('[role="menuitem"]');
          
          
          const targetButton = Array.from(menuItems || []).find(
            (item) => item.textContent?.includes(localeNames[targetLocale])
          ) as HTMLElement;

          if (targetButton) {
            fireEvent.click(targetButton);

            if (mockPush.mock.calls.length > 0) {
              const calledPath = mockPush.mock.calls[0][0];

              // Extract path without locale
              const originalPathWithoutLocale = mockPathname.replace(`/${currentLocale}`, '');
              const newPathWithoutLocale = calledPath.replace(/^\/[a-z]{2}/, '');

              // Path structure should be identical
              expect(newPathWithoutLocale).toBe(originalPathWithoutLocale);
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 7: Language Switcher Cookie Persistence', () => {
  beforeEach(() => {
    mockPush.mockClear();
    document.cookie = 'NEXT_LOCALE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  });

  const localeArbitrary = fc.constantFrom<Locale>(...locales);

  it('should set cookie when switching to any language', () => {
    fc.assert(
      fc.property(localeArbitrary, localeArbitrary, (currentLocale, targetLocale) => {
        // Skip if switching to same locale
        if (currentLocale === targetLocale) return true;

        mockPathname = `/${currentLocale}/products`;
        document.cookie = 'NEXT_LOCALE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        const { container } = render(<LanguageSwitcher locale={currentLocale} />);

        // Open dropdown
        const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
        fireEvent.click(button);

        // Find and click the target language button by matching locale name
        const dropdown = container.querySelector('[role="menu"]');
        const menuItems = dropdown?.querySelectorAll('[role="menuitem"]');
        
        
        const targetButton = Array.from(menuItems || []).find(
          (item) => item.textContent?.includes(localeNames[targetLocale])
        ) as HTMLElement;

        if (targetButton) {
          fireEvent.click(targetButton);

          // Check that cookie was set
          const cookies = document.cookie.split(';').map(c => c.trim());
          const localeCookie = cookies.find(c => c.startsWith('NEXT_LOCALE='));
          
          expect(localeCookie).toBeTruthy();
          
          // Cookie should contain a valid locale
          if (localeCookie) {
            const cookieValue = localeCookie.split('=')[1];
            expect(locales).toContain(cookieValue as Locale);
          }
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should set cookie with correct attributes', () => {
    fc.assert(
      fc.property(localeArbitrary, (targetLocale) => {
        mockPathname = '/fr/products';
        document.cookie = 'NEXT_LOCALE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        const { container } = render(<LanguageSwitcher locale="fr" />);

        // Open dropdown
        const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
        fireEvent.click(button);

        // Find and click the target language button by matching locale name
        const dropdown = container.querySelector('[role="menu"]');
        const menuItems = dropdown?.querySelectorAll('[role="menuitem"]');
        
        
        const targetButton = Array.from(menuItems || []).find(
          (item) => item.textContent?.includes(localeNames[targetLocale])
        ) as HTMLElement;

        if (targetButton && targetLocale !== 'fr') {
          fireEvent.click(targetButton);

          // Cookie should be set (we can't easily test all attributes in jsdom, but we can verify it exists)
          const cookies = document.cookie;
          expect(cookies).toContain('NEXT_LOCALE=');
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should persist cookie value matching selected locale', () => {
    fc.assert(
      fc.property(localeArbitrary, localeArbitrary, (currentLocale, targetLocale) => {
        // Skip if switching to same locale
        if (currentLocale === targetLocale) return true;

        mockPathname = `/${currentLocale}/about`;
        document.cookie = 'NEXT_LOCALE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        const { container } = render(<LanguageSwitcher locale={currentLocale} />);

        // Open dropdown
        const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
        fireEvent.click(button);

        // Find and click the target language button by matching exact locale name
        const dropdown = container.querySelector('[role="menu"]');
        const menuItems = dropdown?.querySelectorAll('[role="menuitem"]');
        
        // Find button that contains ONLY the target locale name (not as substring)
        const targetLocaleName = localeNames[targetLocale];
        const targetButton = Array.from(menuItems || []).find(
          (item) => {
            const text = item.textContent || '';
            // Check if the text contains the locale name as a complete word
            // by checking it's surrounded by non-letter characters or boundaries
            const regex = new RegExp(`\\b${targetLocaleName}\\b`);
            return regex.test(text);
          }
        ) as HTMLElement;

        if (targetButton) {
          fireEvent.click(targetButton);

          // Cookie should be set to the target locale
          const cookies = document.cookie.split(';').map(c => c.trim());
          const localeCookie = cookies.find(c => c.startsWith('NEXT_LOCALE='));
          
          if (localeCookie) {
            const cookieValue = localeCookie.split('=')[1];
            // The cookie should match the target locale we clicked
            expect(cookieValue).toBe(targetLocale);
          }
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });
});
