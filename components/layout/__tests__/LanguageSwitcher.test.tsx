import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { Locale } from '@/types';
import { locales, localeNames, localeFlags } from '@/lib/i18n/config';

/**
 * Unit Tests for Language Switcher Component
 * 
 * **Validates: Requirements 3.1, 3.5, 3.6, 3.7**
 * 
 * This test suite validates that:
 * 1. Dropdown renders all five languages
 * 2. Current language is highlighted with checkmark
 * 3. Clicking outside closes dropdown
 * 4. Escape key closes dropdown
 * 5. Language names are in native form
 * 6. Flags are displayed for each language
 */

// Mock Next.js navigation hooks
const mockPush = vi.fn();
const mockPathname = '/fr/products';

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe('LanguageSwitcher Component', () => {
  beforeEach(() => {
    mockPush.mockClear();
    // Clear any cookies
    document.cookie = 'NEXT_LOCALE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  });

  describe('Dropdown rendering', () => {
    it('should render dropdown button with current language', () => {
      const { container } = render(<LanguageSwitcher locale="fr" />);
      
      const button = container.querySelector('button[aria-label="Select language"]');
      expect(button).toBeTruthy();
      expect(button?.textContent).toContain(localeFlags['fr']);
      expect(button?.textContent).toContain(localeNames['fr']);
    });

    it('should render all five languages when dropdown is opened', () => {
      const { container } = render(<LanguageSwitcher locale="fr" />);
      
      const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
      fireEvent.click(button);
      
      // Check that all five locales are rendered in the dropdown menu
      const dropdown = container.querySelector('[role="menu"]');
      expect(dropdown).toBeTruthy();
      
      locales.forEach((locale) => {
        const localeButtons = screen.getAllByText(localeNames[locale]);
        // Should find at least one (in dropdown, possibly also in main button)
        expect(localeButtons.length).toBeGreaterThan(0);
      });
    });

    it('should display flags for all languages', () => {
      const { container } = render(<LanguageSwitcher locale="fr" />);
      
      const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
      fireEvent.click(button);
      
      // Check that all flags are present in the dropdown
      const dropdown = container.querySelector('[role="menu"]');
      expect(dropdown).toBeTruthy();
      
      locales.forEach((locale) => {
        const flags = screen.getAllByText(localeFlags[locale]);
        // Should find at least one (in dropdown, possibly also in main button)
        expect(flags.length).toBeGreaterThan(0);
      });
    });

    it('should display language names in native form', () => {
      const { container } = render(<LanguageSwitcher locale="en" />);
      
      const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
      fireEvent.click(button);
      
      // Verify native language names in dropdown
      const dropdown = container.querySelector('[role="menu"]');
      expect(dropdown).toBeTruthy();
      
      expect(screen.getAllByText('Français').length).toBeGreaterThan(0);
      expect(screen.getAllByText('English').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Español').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Deutsch').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Русский').length).toBeGreaterThan(0);
    });
  });

  describe('Current language highlighting', () => {
    it('should highlight current language with checkmark', () => {
      const { container } = render(<LanguageSwitcher locale="fr" />);
      
      const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
      fireEvent.click(button);
      
      // Find the French language button in the dropdown menu
      const dropdown = container.querySelector('[role="menu"]');
      const menuItems = dropdown?.querySelectorAll('[role="menuitem"]');
      const frenchButton = Array.from(menuItems || []).find(
        (item) => item.textContent?.includes('Français')
      );
      
      expect(frenchButton).toBeTruthy();
      
      // Check for checkmark SVG in the French button
      const checkmark = frenchButton?.querySelector('svg path[d*="16.707"]');
      expect(checkmark).toBeTruthy();
    });

    it('should apply active styling to current language', () => {
      const { container } = render(<LanguageSwitcher locale="de" />);
      
      const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
      fireEvent.click(button);
      
      // Find the German language button in the dropdown menu
      const dropdown = container.querySelector('[role="menu"]');
      const menuItems = dropdown?.querySelectorAll('[role="menuitem"]');
      const germanButton = Array.from(menuItems || []).find(
        (item) => item.textContent?.includes('Deutsch')
      ) as HTMLElement;
      
      expect(germanButton?.className).toContain('font-semibold');
    });

    it('should set aria-current on current language', () => {
      const { container } = render(<LanguageSwitcher locale="es" />);
      
      const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
      fireEvent.click(button);
      
      // Find the Spanish language button in the dropdown menu
      const dropdown = container.querySelector('[role="menu"]');
      const menuItems = dropdown?.querySelectorAll('[role="menuitem"]');
      const spanishButton = Array.from(menuItems || []).find(
        (item) => item.textContent?.includes('Español')
      ) as HTMLElement;
      
      expect(spanishButton?.getAttribute('aria-current')).toBe('true');
    });
  });

  describe('Dropdown interaction', () => {
    it('should open dropdown when button is clicked', () => {
      const { container } = render(<LanguageSwitcher locale="fr" />);
      
      const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
      expect(button.getAttribute('aria-expanded')).toBe('false');
      
      fireEvent.click(button);
      
      expect(button.getAttribute('aria-expanded')).toBe('true');
      const dropdown = container.querySelector('[role="menu"]');
      expect(dropdown).toBeTruthy();
    });

    it('should close dropdown when clicking outside', async () => {
      const { container } = render(
        <div>
          <LanguageSwitcher locale="fr" />
          <div data-testid="outside">Outside element</div>
        </div>
      );
      
      const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
      fireEvent.click(button);
      
      // Dropdown should be open
      let dropdown = container.querySelector('[role="menu"]');
      expect(dropdown).toBeTruthy();
      
      // Click outside
      const outside = screen.getByTestId('outside');
      fireEvent.mouseDown(outside);
      
      // Wait for dropdown to close
      await waitFor(() => {
        dropdown = container.querySelector('[role="menu"]');
        expect(dropdown).toBeFalsy();
      });
    });

    it('should close dropdown when Escape key is pressed', async () => {
      const { container } = render(<LanguageSwitcher locale="fr" />);
      
      const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
      fireEvent.click(button);
      
      // Dropdown should be open
      let dropdown = container.querySelector('[role="menu"]');
      expect(dropdown).toBeTruthy();
      
      // Press Escape key
      fireEvent.keyDown(document, { key: 'Escape' });
      
      // Wait for dropdown to close
      await waitFor(() => {
        dropdown = container.querySelector('[role="menu"]');
        expect(dropdown).toBeFalsy();
      });
    });

    it('should toggle dropdown on multiple button clicks', () => {
      const { container } = render(<LanguageSwitcher locale="fr" />);
      
      const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
      
      // First click - open
      fireEvent.click(button);
      expect(container.querySelector('[role="menu"]')).toBeTruthy();
      
      // Second click - close
      fireEvent.click(button);
      expect(container.querySelector('[role="menu"]')).toBeFalsy();
      
      // Third click - open again
      fireEvent.click(button);
      expect(container.querySelector('[role="menu"]')).toBeTruthy();
    });
  });

  describe('ARIA attributes', () => {
    it('should have proper ARIA attributes on button', () => {
      const { container } = render(<LanguageSwitcher locale="fr" />);
      
      const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
      expect(button.getAttribute('aria-label')).toBe('Select language');
      expect(button.getAttribute('aria-haspopup')).toBe('true');
      expect(button.getAttribute('aria-expanded')).toBe('false');
    });

    it('should update aria-expanded when dropdown opens', () => {
      const { container } = render(<LanguageSwitcher locale="fr" />);
      
      const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
      expect(button.getAttribute('aria-expanded')).toBe('false');
      
      fireEvent.click(button);
      expect(button.getAttribute('aria-expanded')).toBe('true');
    });

    it('should have role="menu" on dropdown', () => {
      const { container } = render(<LanguageSwitcher locale="fr" />);
      
      const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
      fireEvent.click(button);
      
      const dropdown = container.querySelector('[role="menu"]');
      expect(dropdown).toBeTruthy();
      expect(dropdown?.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('should have role="menuitem" on language options', () => {
      const { container } = render(<LanguageSwitcher locale="fr" />);
      
      const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
      fireEvent.click(button);
      
      const menuItems = container.querySelectorAll('[role="menuitem"]');
      expect(menuItems.length).toBe(5);
    });
  });

  describe('Responsive behavior', () => {
    it('should show language name on desktop (sm:inline)', () => {
      const { container } = render(<LanguageSwitcher locale="fr" />);
      
      const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
      const languageName = button.querySelector('span.hidden.sm\\:inline');
      
      expect(languageName).toBeTruthy();
      expect(languageName?.textContent).toBe(localeNames['fr']);
    });
  });

  describe('Dark mode support', () => {
    it('should have dark mode classes on button', () => {
      const { container } = render(<LanguageSwitcher locale="fr" />);
      
      const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
      expect(button.className).toContain('dark:text-dark-text-primary');
      expect(button.className).toContain('dark:hover:bg-dark-bg-secondary');
    });

    it('should have dark mode classes on dropdown', () => {
      const { container } = render(<LanguageSwitcher locale="fr" />);
      
      const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
      fireEvent.click(button);
      
      const dropdown = container.querySelector('[role="menu"]');
      expect(dropdown?.className).toContain('dark:border-dark-border');
      expect(dropdown?.className).toContain('dark:bg-dark-bg-secondary');
    });

    it('should have dark mode classes on menu items', () => {
      const { container } = render(<LanguageSwitcher locale="fr" />);
      
      const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
      fireEvent.click(button);
      
      const menuItems = container.querySelectorAll('[role="menuitem"]');
      menuItems.forEach((item) => {
        expect(item.className).toContain('dark:hover:bg-dark-bg-primary');
      });
    });
  });

  describe('Visual indicators', () => {
    it('should show chevron icon that rotates when open', () => {
      const { container } = render(<LanguageSwitcher locale="fr" />);
      
      const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
      const chevron = button.querySelector('svg');
      
      expect(chevron).toBeTruthy();
      // Check that rotate-180 is not in the class initially
      const initialClasses = chevron?.getAttribute('class') || '';
      expect(initialClasses).not.toContain('rotate-180');
      
      fireEvent.click(button);
      
      // After clicking, check that rotate-180 is in the class
      const chevronAfter = button.querySelector('svg');
      const afterClasses = chevronAfter?.getAttribute('class') || '';
      expect(afterClasses).toContain('rotate-180');
    });

    it('should hide decorative icons from screen readers', () => {
      const { container } = render(<LanguageSwitcher locale="fr" />);
      
      const button = container.querySelector('button[aria-label="Select language"]') as HTMLElement;
      fireEvent.click(button);
      
      // Check that flag emojis have aria-hidden
      const flags = container.querySelectorAll('span[aria-hidden="true"]');
      expect(flags.length).toBeGreaterThan(0);
    });
  });
});
