/**
 * Automated accessibility tests with axe-core
 * **Property 35: WCAG AA compliance**
 * **Validates: Requirements 16.1**
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Navigation } from '@/components/layout/Navigation';
import { MobileNav } from '@/components/layout/MobileNav';
import { ContactForm } from '@/components/forms/ContactForm';
import { RFQForm } from '@/components/forms/RFQForm';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/en',
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('Property 35: WCAG AA compliance', () => {
  const mockNavItems = [
    { href: '/en', label: 'Home' },
    { href: '/en/products', label: 'Products' },
    { href: '/en/contact', label: 'Contact' },
  ];
  
  const mockRfqItem = { href: '/en/rfq', label: 'Request for Quote' };

  describe('Layout components accessibility', () => {
    it('should have no accessibility violations in Header', async () => {
      const { container } = render(<Header locale="en" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations in Footer', async () => {
      const { container } = render(<Footer locale="en" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations in Navigation', async () => {
      const { container } = render(
        <Navigation locale="en" navItems={mockNavItems} rfqItem={mockRfqItem} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations in MobileNav', async () => {
      const { container } = render(
        <MobileNav locale="en" navItems={mockNavItems} rfqItem={mockRfqItem} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Form components accessibility', () => {
    it('should have no accessibility violations in ContactForm', async () => {
      const { container } = render(<ContactForm locale="en" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations in RFQForm', async () => {
      const mockProducts = [
        {
          _id: '1',
          name: { fr: 'Cacao', en: 'Cocoa' },
          category: 'cocoa',
        },
      ];

      const { container } = render(
        <RFQForm products={mockProducts} locale="en" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('WCAG 2.1 Level AA compliance', () => {
    it('should pass WCAG AA color contrast requirements', async () => {
      const { container } = render(<Header locale="en" />);
      
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      });
      
      expect(results).toHaveNoViolations();
    });

    it('should pass WCAG AA keyboard accessibility requirements', async () => {
      const { container } = render(
        <Navigation locale="en" navItems={mockNavItems} rfqItem={mockRfqItem} />
      );
      
      const results = await axe(container, {
        rules: {
          'tabindex': { enabled: true },
          'focus-order-semantics': { enabled: true },
        },
      });
      
      expect(results).toHaveNoViolations();
    });

    it('should pass WCAG AA form label requirements', async () => {
      const { container } = render(<ContactForm locale="en" />);
      
      const results = await axe(container, {
        rules: {
          'label': { enabled: true },
          'label-title-only': { enabled: true },
        },
      });
      
      expect(results).toHaveNoViolations();
    });

    it('should pass WCAG AA ARIA requirements', async () => {
      const { container } = render(
        <MobileNav locale="en" navItems={mockNavItems} rfqItem={mockRfqItem} />
      );
      
      const results = await axe(container, {
        rules: {
          'aria-valid-attr': { enabled: true },
          'aria-valid-attr-value': { enabled: true },
          'aria-required-attr': { enabled: true },
        },
      });
      
      expect(results).toHaveNoViolations();
    });

    it('should pass WCAG AA semantic HTML requirements', async () => {
      const { container } = render(<Footer locale="en" />);
      
      const results = await axe(container, {
        rules: {
          'landmark-one-main': { enabled: false }, // Footer doesn't need main
          'region': { enabled: true },
        },
      });
      
      expect(results).toHaveNoViolations();
    });
  });

  describe('Property: Components must maintain accessibility across locales', () => {
    it('should have no violations in French locale', async () => {
      const { container } = render(<Header locale="fr" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations in English locale', async () => {
      const { container } = render(<Header locale="en" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Property: Interactive elements must be accessible', () => {
    it('should have accessible buttons', async () => {
      const { container } = render(
        <MobileNav locale="en" navItems={mockNavItems} rfqItem={mockRfqItem} />
      );
      
      const results = await axe(container, {
        rules: {
          'button-name': { enabled: true },
        },
      });
      
      expect(results).toHaveNoViolations();
    });

    it('should have accessible links', async () => {
      const { container } = render(
        <Navigation locale="en" navItems={mockNavItems} rfqItem={mockRfqItem} />
      );
      
      const results = await axe(container, {
        rules: {
          'link-name': { enabled: true },
        },
      });
      
      expect(results).toHaveNoViolations();
    });
  });
});
