/**
 * Tests for Responsive Header/Navigation Component
 * Feature: responsive-intelligent-navigation
 * 
 * Tests for task 4: Implement responsive Header/Navigation component
 * - 4.1: Desktop navigation bar with hover states and touch targets
 * - 4.2: Mobile hamburger menu with accessibility features
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Header } from '../Header';
import { MobileNav } from '../MobileNav';
import { Navigation } from '../Navigation';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

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
    const translations: Record<string, Record<string, string>> = {
      en: {
        'navigation.home': 'Home',
        'navigation.products': 'Products',
        'navigation.solutions': 'Solutions',
        'navigation.quality': 'Quality',
        'navigation.traceability': 'Traceability',
        'navigation.about': 'About',
        'navigation.team': 'Team',
        'navigation.contact': 'Contact',
        'navigation.rfq': 'Request for Quote',
      },
      fr: {
        'navigation.home': 'Accueil',
        'navigation.products': 'Produits',
        'navigation.solutions': 'Solutions',
        'navigation.quality': 'Qualité',
        'navigation.traceability': 'Traçabilité',
        'navigation.about': 'À Propos',
        'navigation.team': 'Équipe',
        'navigation.contact': 'Contact',
        'navigation.rfq': 'Demande de Devis',
      },
    };
    return translations[locale]?.[key] || key;
  },
}));

// Mock focus-trap
vi.mock('@/lib/accessibility/focus-trap', () => ({
  trapFocus: vi.fn(() => vi.fn()),
}));

describe('Task 4.1: Desktop Navigation Bar', () => {
  const navItems = [
    { href: '/en', label: 'Home' },
    { href: '/en/products', label: 'Products' },
    { href: '/en/about', label: 'About' },
  ];
  const rfqItem = { href: '/en/rfq', label: 'Request for Quote' };

  it('should render desktop navigation with all links', () => {
    render(
      <ThemeProvider>
        <Navigation locale="en" navItems={navItems} rfqItem={rfqItem} />
      </ThemeProvider>
    );

    // Desktop navigation should be present
    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(nav).toBeTruthy();

    // All navigation items should be rendered (check in desktop nav only)
    const desktopNav = nav.querySelector('ul');
    expect(desktopNav).toBeTruthy();
    
    navItems.forEach((item) => {
      const links = screen.getAllByRole('link', { name: item.label });
      // Should have at least one link (desktop or mobile)
      expect(links.length).toBeGreaterThan(0);
      expect(links[0].getAttribute('href')).toBe(item.href);
    });
  });

  it('should have minimum 44x44px touch targets for all interactive elements', () => {
    const { container } = render(
      <ThemeProvider>
        <Header locale="en" />
      </ThemeProvider>
    );

    // Check logo link has minimum touch target
    const logoLink = container.querySelector('a[aria-label*="Home"]');
    expect(logoLink?.classList.contains('min-h-[44px]')).toBe(true);
    expect(logoLink?.classList.contains('min-w-[44px]')).toBe(true);

    // Check RFQ button has minimum touch target (get all and check the desktop one)
    const rfqButtons = screen.getAllByRole('link', { name: /request for quote/i });
    const desktopRfqButton = rfqButtons.find(btn => btn.classList.contains('sm:flex'));
    expect(desktopRfqButton?.classList.contains('min-h-[44px]')).toBe(true);
  });

  it('should have visible focus indicators on navigation links', () => {
    const { container } = render(
      <ThemeProvider>
        <Navigation locale="en" navItems={navItems} rfqItem={rfqItem} />
      </ThemeProvider>
    );

    const links = container.querySelectorAll('nav a');
    links.forEach((link) => {
      // Check for focus ring classes
      const hasRingClass = link.className.includes('focus:ring');
      expect(hasRingClass).toBe(true);
    });
  });

  it('should calculate and expose header height via CSS custom property', () => {
    render(
      <ThemeProvider>
        <Header locale="en" />
      </ThemeProvider>
    );

    // Wait for useEffect to run
    waitFor(() => {
      const headerHeight = document.documentElement.style.getPropertyValue('--header-height');
      expect(headerHeight).toBeTruthy();
    });
  });
});

describe('Task 4.2: Mobile Hamburger Menu', () => {
  const navItems = [
    { href: '/en', label: 'Home' },
    { href: '/en/products', label: 'Products' },
    { href: '/en/about', label: 'About' },
  ];
  const rfqItem = { href: '/en/rfq', label: 'Request for Quote' };

  beforeEach(() => {
    // Reset body overflow
    document.body.style.overflow = '';
  });

  it('should render hamburger button with proper ARIA labels (Requirement 5.1, 6.4)', () => {
    render(
      <ThemeProvider>
        <MobileNav locale="en" navItems={navItems} rfqItem={rfqItem} />
      </ThemeProvider>
    );

    const hamburgerButton = screen.getByRole('button', { name: /open menu/i });
    expect(hamburgerButton).toBeTruthy();
    expect(hamburgerButton.getAttribute('aria-expanded')).toBe('false');
    expect(hamburgerButton.getAttribute('aria-controls')).toBe('mobile-menu');
  });

  it('should open menu with slide-in animation on button click (Requirement 5.1)', () => {
    render(
      <ThemeProvider>
        <MobileNav locale="en" navItems={navItems} rfqItem={rfqItem} />
      </ThemeProvider>
    );

    const hamburgerButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(hamburgerButton);

    // Menu should be visible
    const menu = screen.getByRole('dialog', { name: /mobile navigation/i });
    expect(menu).toBeTruthy();
    
    // Check for animation class
    expect(menu.classList.contains('duration-300')).toBe(true);
    expect(menu.classList.contains('translate-x-0')).toBe(true);

    // Button label should change (get all buttons and find the hamburger one)
    const buttons = screen.getAllByRole('button');
    const hamburger = buttons.find(btn => btn.getAttribute('aria-controls') === 'mobile-menu');
    expect(hamburger?.getAttribute('aria-expanded')).toBe('true');
    expect(hamburger?.getAttribute('aria-label')).toMatch(/close menu/i);
  });

  it('should prevent body scroll when menu is open (Requirement 5.5)', async () => {
    render(
      <ThemeProvider>
        <MobileNav locale="en" navItems={navItems} rfqItem={rfqItem} />
      </ThemeProvider>
    );

    const hamburgerButton = screen.getByRole('button', { name: /open menu/i });
    
    // Initially body should be scrollable
    expect(document.body.style.overflow).not.toBe('hidden');

    // Open menu
    fireEvent.click(hamburgerButton);

    // Body scroll should be locked
    await waitFor(() => {
      expect(document.body.style.overflow).toBe('hidden');
    });
  });

  it('should close menu on ESC key press (Requirement 5.4)', async () => {
    render(
      <ThemeProvider>
        <MobileNav locale="en" navItems={navItems} rfqItem={rfqItem} />
      </ThemeProvider>
    );

    const hamburgerButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(hamburgerButton);

    // Menu should be open
    let menu = screen.getByRole('dialog', { name: /mobile navigation/i });
    expect(menu).toBeTruthy();
    expect(menu.classList.contains('translate-x-0')).toBe(true);

    // Press ESC key
    fireEvent.keyDown(document, { key: 'Escape' });

    // Menu should be closed (translate-x-full class)
    await waitFor(() => {
      const closedMenu = document.getElementById('mobile-menu');
      expect(closedMenu?.classList.contains('translate-x-full')).toBe(true);
    });
  });

  it('should close menu on outside click (Requirement 5.6)', async () => {
    render(
      <ThemeProvider>
        <MobileNav locale="en" navItems={navItems} rfqItem={rfqItem} />
      </ThemeProvider>
    );

    const hamburgerButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(hamburgerButton);

    // Menu should be open
    const menu = screen.getByRole('dialog', { name: /mobile navigation/i });
    expect(menu).toBeTruthy();
    expect(menu.classList.contains('translate-x-0')).toBe(true);

    // Click overlay
    const overlay = document.querySelector('.fixed.inset-0.bg-black\\/50');
    expect(overlay).toBeTruthy();
    fireEvent.click(overlay!);

    // Menu should be closed (translate-x-full class)
    await waitFor(() => {
      const closedMenu = document.getElementById('mobile-menu');
      expect(closedMenu?.classList.contains('translate-x-full')).toBe(true);
    });
  });

  it('should have minimum 44x44px touch targets for all menu items (Requirement 6.2)', () => {
    render(
      <ThemeProvider>
        <MobileNav locale="en" navItems={navItems} rfqItem={rfqItem} />
      </ThemeProvider>
    );

    const hamburgerButton = screen.getByRole('button', { name: /open menu/i });
    
    // Hamburger button should have minimum touch target
    expect(hamburgerButton.classList.contains('h-11')).toBe(true);
    expect(hamburgerButton.classList.contains('w-11')).toBe(true);

    // Open menu
    fireEvent.click(hamburgerButton);

    // All menu links should have minimum touch target
    const menuLinks = screen.getAllByRole('link');
    menuLinks.forEach((link) => {
      expect(link.classList.contains('min-h-[44px]')).toBe(true);
    });
  });

  it('should use localized ARIA labels for French locale (Requirement 20.2)', () => {
    render(
      <ThemeProvider>
        <MobileNav locale="fr" navItems={navItems} rfqItem={rfqItem} />
      </ThemeProvider>
    );

    // French labels should be used - get the hamburger button specifically
    const buttons = screen.getAllByRole('button');
    const hamburgerButton = buttons.find(btn => btn.getAttribute('aria-controls') === 'mobile-menu');
    const ariaLabel = hamburgerButton?.getAttribute('aria-label');
    
    // Should contain French text (either "Ouvrir le menu" or "Fermer le menu")
    expect(ariaLabel).toMatch(/menu/i);
    expect(ariaLabel).toMatch(/ouvrir|fermer/i);
  });

  it('should have proper animation duration of 300ms (Requirement 5.1)', () => {
    render(
      <ThemeProvider>
        <MobileNav locale="en" navItems={navItems} rfqItem={rfqItem} />
      </ThemeProvider>
    );

    const hamburgerButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(hamburgerButton);

    const menu = screen.getByRole('dialog', { name: /mobile navigation/i });
    
    // Check for 300ms animation duration
    expect(menu.classList.contains('duration-300')).toBe(true);

    // Check hamburger icon animation
    const hamburgerSpans = hamburgerButton.querySelectorAll('span');
    hamburgerSpans.forEach((span) => {
      expect(span.classList.contains('duration-300')).toBe(true);
    });
  });

  it('should announce menu state changes to screen readers (Requirement 6.5)', () => {
    render(
      <ThemeProvider>
        <MobileNav locale="en" navItems={navItems} rfqItem={rfqItem} />
      </ThemeProvider>
    );

    const hamburgerButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(hamburgerButton);

    const menu = screen.getByRole('dialog', { name: /mobile navigation/i });
    
    // Menu should have aria-live for screen reader announcements
    expect(menu.getAttribute('aria-live')).toBe('polite');
    expect(menu.getAttribute('aria-modal')).toBe('true');
  });
});

describe('Integration: Header Component', () => {
  it('should render complete header with all components', () => {
    render(
      <ThemeProvider>
        <Header locale="en" />
      </ThemeProvider>
    );

    // Logo should be present
    const logo = screen.getByAltText('Afrexia');
    expect(logo).toBeTruthy();

    // Navigation should be present
    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(nav).toBeTruthy();

    // Mobile menu button should be present
    const mobileButton = screen.getByRole('button', { name: /open menu/i });
    expect(mobileButton).toBeTruthy();
  });

  it('should be sticky positioned at top of viewport', () => {
    const { container } = render(
      <ThemeProvider>
        <Header locale="en" />
      </ThemeProvider>
    );

    const header = container.querySelector('header');
    expect(header?.classList.contains('sticky')).toBe(true);
    expect(header?.classList.contains('top-0')).toBe(true);
    expect(header?.classList.contains('z-50')).toBe(true);
  });
});
