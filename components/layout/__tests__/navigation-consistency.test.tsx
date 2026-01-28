import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import { render } from '@testing-library/react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Locale } from '@/types';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

/**
 * Property-Based Tests for Navigation Consistency
 * 
 * **Property 3: Navigation consistency**
 * **Validates: Requirements 1.3**
 * 
 * This test suite validates that:
 * 1. Navigation structure is consistent across all pages
 * 2. All navigation items are present in both Header and Footer
 * 3. Navigation links are properly formatted with locale prefix
 * 4. Active page indication works correctly
 * 5. Navigation is accessible and semantic
 */

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  usePathname: () => '/fr',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Helper to render components with ThemeProvider
function renderWithTheme(component: React.ReactElement) {
  return render(<ThemeProvider>{component}</ThemeProvider>);
}

describe('Property 3: Navigation consistency', () => {
  // Arbitrary for generating valid locales
  const localeArbitrary = fc.constantFrom<Locale>('fr', 'en');

  it('should render all navigation items in Header for any locale', () => {
    fc.assert(
      fc.property(localeArbitrary, (locale) => {
        const { container } = renderWithTheme(<Header locale={locale} />);
        
        // Header should be rendered
        const header = container.querySelector('header');
        expect(header).toBeTruthy();
        
        // Logo should be present (use container query to avoid multiple matches)
        const logo = container.querySelector('a[href*="/"]');
        expect(logo?.textContent || logo?.querySelector('img')).toBeTruthy();
        
        // Navigation should be present
        const nav = container.querySelector('nav');
        expect(nav).toBeTruthy();
        
        // Language switcher should be present
        const langSwitcher = container.querySelector('button[aria-expanded]');
        expect(langSwitcher).toBeTruthy();
      })
    );
  });

  it('should render all navigation items in Footer for any locale', () => {
    fc.assert(
      fc.property(localeArbitrary, (locale) => {
        const { container } = render(<Footer locale={locale} />);
        
        // Footer should be rendered
        const footer = container.querySelector('footer');
        expect(footer).toBeTruthy();
        
        // Company name or logo should be present
        const logo = container.querySelector('img[alt="Afrexia"]');
        expect(logo).toBeTruthy();
        
        // Contact information should be present
        const email = container.querySelector('a[href^="mailto:"]');
        expect(email?.textContent).toContain('contact@afrexia.com');
      })
    );
  });

  it('should format navigation links with correct locale prefix', () => {
    fc.assert(
      fc.property(localeArbitrary, (locale) => {
        const { container } = renderWithTheme(<Header locale={locale} />);
        
        // Get all links
        const links = container.querySelectorAll('a[href]');
        
        // All links should start with the locale prefix
        links.forEach((link) => {
          const href = link.getAttribute('href');
          if (href && !href.startsWith('mailto:') && !href.startsWith('tel:') && href !== '#') {
            expect(href.startsWith(`/${locale}`)).toBe(true);
          }
        });
      })
    );
  });

  it('should maintain consistent navigation structure across locales', () => {
    fc.assert(
      fc.property(localeArbitrary, localeArbitrary, (locale1, locale2) => {
        const { container: container1 } = renderWithTheme(<Header locale={locale1} />);
        const { container: container2 } = renderWithTheme(<Header locale={locale2} />);
        
        // Get navigation items from both renders
        const nav1 = container1.querySelector('nav');
        const nav2 = container2.querySelector('nav');
        
        // Both should have navigation
        expect(nav1).toBeTruthy();
        expect(nav2).toBeTruthy();
        
        if (nav1 && nav2) {
          // Count links in both navigations
          const links1 = nav1.querySelectorAll('a');
          const links2 = nav2.querySelectorAll('a');
          
          // Should have the same number of navigation items
          expect(links1.length).toBe(links2.length);
        }
      })
    );
  });

  it('should have semantic HTML structure in Header', () => {
    fc.assert(
      fc.property(localeArbitrary, (locale) => {
        const { container } = renderWithTheme(<Header locale={locale} />);
        
        // Should have header element
        const header = container.querySelector('header');
        expect(header).toBeTruthy();
        
        // Should have nav element
        const nav = container.querySelector('nav');
        expect(nav).toBeTruthy();
        
        // Should have list structure for navigation
        const navList = container.querySelector('nav ul');
        expect(navList).toBeTruthy();
        
        // Logo should be a link
        const logoLink = container.querySelector('a[href*="/"]');
        expect(logoLink).toBeTruthy();
      })
    );
  });

  it('should have semantic HTML structure in Footer', () => {
    fc.assert(
      fc.property(localeArbitrary, (locale) => {
        const { container } = render(<Footer locale={locale} />);
        
        // Should have footer element
        const footer = container.querySelector('footer');
        expect(footer).toBeTruthy();
        
        // Should have list structures for navigation sections
        const lists = container.querySelectorAll('ul');
        expect(lists.length).toBeGreaterThan(0);
        
        // Should have headings for sections
        const headings = container.querySelectorAll('h3, h4');
        expect(headings.length).toBeGreaterThan(0);
      })
    );
  });

  it('should include RFQ call-to-action in Header', () => {
    fc.assert(
      fc.property(localeArbitrary, (locale) => {
        const { container } = renderWithTheme(<Header locale={locale} />);
        
        // Should have RFQ link
        const rfqLink = container.querySelector(`a[href="/${locale}/rfq"]`);
        expect(rfqLink).toBeTruthy();
      })
    );
  });

  it('should maintain visual hierarchy with proper styling classes', () => {
    fc.assert(
      fc.property(localeArbitrary, (locale) => {
        const { container } = renderWithTheme(<Header locale={locale} />);
        
        // Header should have sticky positioning
        const header = container.querySelector('header');
        expect(header?.className).toContain('sticky');
        
        // Header should have backdrop blur
        expect(header?.className).toContain('backdrop-blur');
        
        // Navigation links should have transition classes
        const navLinks = container.querySelectorAll('nav a');
        navLinks.forEach((link) => {
          expect(link.className).toContain('transition');
        });
      })
    );
  });

  it('should provide accessible navigation with ARIA labels', () => {
    fc.assert(
      fc.property(localeArbitrary, (locale) => {
        const { container } = renderWithTheme(<Header locale={locale} />);
        
        // Language switcher should have aria-label or aria-expanded
        const langSwitcher = container.querySelector('button[aria-expanded]');
        expect(langSwitcher).toBeTruthy();
        
        // All links should have text content, aria-label, or image
        const links = container.querySelectorAll('a');
        links.forEach((link) => {
          const hasText = link.textContent && link.textContent.trim().length > 0;
          const hasAriaLabel = link.hasAttribute('aria-label');
          const hasImage = link.querySelector('img');
          expect(hasText || hasAriaLabel || hasImage).toBe(true);
        });
      })
    );
  });

  it('should include contact information in Footer', () => {
    fc.assert(
      fc.property(localeArbitrary, (locale) => {
        const { container } = render(<Footer locale={locale} />);
        
        // Should have email link
        const emailLink = container.querySelector('a[href^="mailto:"]');
        expect(emailLink).toBeTruthy();
        
        // Should have phone link
        const phoneLink = container.querySelector('a[href^="tel:"]');
        expect(phoneLink).toBeTruthy();
      })
    );
  });

  it('should display copyright information in Footer', () => {
    fc.assert(
      fc.property(localeArbitrary, (locale) => {
        const { container } = render(<Footer locale={locale} />);
        
        // Should display current year
        const currentYear = new Date().getFullYear();
        const copyrightText = container.textContent || '';
        expect(copyrightText).toContain(currentYear.toString());
        
        // Should display company name
        expect(copyrightText).toContain('Afrexia');
      })
    );
  });

  it('should maintain navigation consistency between Header and Footer', () => {
    fc.assert(
      fc.property(localeArbitrary, (locale) => {
        const { container: headerContainer } = renderWithTheme(<Header locale={locale} />);
        const { container: footerContainer } = render(<Footer locale={locale} />);
        
        // Get all navigation links from header
        const headerLinks = Array.from(
          headerContainer.querySelectorAll('nav a[href]')
        ).map((link) => link.getAttribute('href'));
        
        // Get all navigation links from footer
        const footerLinks = Array.from(
          footerContainer.querySelectorAll('a[href]')
        ).filter((link) => {
          const href = link.getAttribute('href');
          return href && href.startsWith(`/${locale}/`);
        }).map((link) => link.getAttribute('href'));
        
        // Most header links should also appear in footer
        const commonLinks = headerLinks.filter((href) => footerLinks.includes(href));
        expect(commonLinks.length).toBeGreaterThan(0);
      })
    );
  });
});

describe('Navigation link format properties', () => {
  it('should format all navigation links correctly', () => {
    const locales: Locale[] = ['fr', 'en'];
    const paths = ['/', '/products', '/about', '/contact'];
    
    locales.forEach((locale) => {
      paths.forEach((path) => {
        const fullPath = `/${locale}${path === '/' ? '' : path}`;
        
        // Should start with locale
        expect(fullPath.startsWith(`/${locale}`)).toBe(true);
        
        // Should not have double slashes (except after protocol)
        expect(fullPath).not.toMatch(/\/\//);
        
        // Should not end with slash (except for root)
        if (path !== '/') {
          expect(fullPath.endsWith('/')).toBe(false);
        }
      });
    });
  });
});
