/**
 * Unit Tests for Dark Mode Integration
 * Feature: dark-mode-implementation
 * Validates: Requirements 3.1
 */

import { render } from '@testing-library/react';
import { Header } from '../Header';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ProductCard } from '@/components/product/ProductCard';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { ContactForm } from '@/components/forms/ContactForm';
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

// Mock Sanity image URL builder
vi.mock('@/sanity/lib/image', () => ({
  urlFor: (image: any) => ({
    width: () => ({ height: () => ({ url: () => '/test-image.jpg' }) }),
    url: () => '/test-image.jpg',
  }),
  getImageUrl: () => '/test-image.jpg',
}));

// Mock analytics
vi.mock('@/lib/analytics', () => ({
  trackContactSubmission: vi.fn(),
}));

describe('Dark Mode Integration Tests', () => {
  describe('Header Component', () => {
    it('should render with dark mode classes when theme is dark', () => {
      const { container } = render(
        <ThemeProvider defaultTheme="dark">
          <Header locale="en" />
        </ThemeProvider>
      );

      const header = container.querySelector('header');
      expect(header).toBeTruthy();
      expect(header?.className).toContain('dark:bg-dark-bg-primary');
      expect(header?.className).toContain('dark:border-dark-border');
    });

    it('should render with light mode classes when theme is light', () => {
      const { container } = render(
        <ThemeProvider defaultTheme="light">
          <Header locale="en" />
        </ThemeProvider>
      );

      const header = container.querySelector('header');
      expect(header).toBeTruthy();
      expect(header?.className).toContain('bg-white');
      expect(header?.className).toContain('border-neutral');
    });

    it('should have dark mode classes on navigation links', () => {
      const { container } = render(
        <ThemeProvider defaultTheme="dark">
          <Header locale="en" />
        </ThemeProvider>
      );

      // Check that navigation links have dark mode classes
      const navLinks = container.querySelectorAll('nav a');
      expect(navLinks.length).toBeGreaterThan(0);
      
      // At least one link should have dark mode text color classes
      const hasDarkModeClasses = Array.from(navLinks).some(link => 
        link.className.includes('dark:text-dark-text')
      );
      expect(hasDarkModeClasses).toBe(true);
    });
  });

  describe('ProductCard Component', () => {
    const mockProduct = {
      _id: '1',
      name: { en: 'Test Product', fr: 'Produit Test' },
      slug: { en: { current: 'test-product' }, fr: { current: 'produit-test' } },
      category: 'cocoa',
      description: { en: 'Test description', fr: 'Description test' },
      gallery: [{ _type: 'image', asset: { _ref: 'test' } }],
      availability: 'in_stock',
    };

    it('should render with dark mode classes', () => {
      const { container } = render(
        <ThemeProvider defaultTheme="dark">
          <ProductCard product={mockProduct} locale="en" />
        </ThemeProvider>
      );

      const card = container.querySelector('a');
      expect(card).toBeTruthy();
      expect(card?.className).toContain('dark:bg-dark-bg-secondary');
    });

    it('should have dark mode text colors', () => {
      const { container } = render(
        <ThemeProvider defaultTheme="dark">
          <ProductCard product={mockProduct} locale="en" />
        </ThemeProvider>
      );

      // Check for dark mode text color classes
      const textElements = container.querySelectorAll('[class*="dark:text"]');
      expect(textElements.length).toBeGreaterThan(0);
    });
  });

  describe('BlogPostCard Component', () => {
    const mockPost = {
      _id: '1',
      title: { en: 'Test Post', fr: 'Article Test' },
      slug: { en: { current: 'test-post' }, fr: { current: 'article-test' } },
      excerpt: { en: 'Test excerpt', fr: 'Extrait test' },
      content: { en: [], fr: [] },
      featuredImage: {
        asset: { _ref: 'test' },
        alt: 'Test image',
      },
      publishedAt: '2024-01-01',
      categories: [],
    };

    it('should render with dark mode classes', () => {
      const { container } = render(
        <ThemeProvider defaultTheme="dark">
          <BlogPostCard post={mockPost} locale="en" />
        </ThemeProvider>
      );

      const card = container.querySelector('article');
      expect(card).toBeTruthy();
      expect(card?.className).toContain('dark:bg-dark-bg-secondary');
    });

    it('should have dark mode text colors', () => {
      const { container } = render(
        <ThemeProvider defaultTheme="dark">
          <BlogPostCard post={mockPost} locale="en" />
        </ThemeProvider>
      );

      // Check for dark mode text color classes
      const textElements = container.querySelectorAll('[class*="dark:text"]');
      expect(textElements.length).toBeGreaterThan(0);
    });
  });

  describe('ContactForm Component', () => {
    it('should render form inputs with dark mode classes', () => {
      const { container } = render(
        <ThemeProvider defaultTheme="dark">
          <ContactForm locale="en" />
        </ThemeProvider>
      );

      const inputs = container.querySelectorAll('input, textarea');
      expect(inputs.length).toBeGreaterThan(0);

      // Check that inputs have dark mode classes
      const hasDarkModeClasses = Array.from(inputs).some(input => 
        input.className.includes('dark:bg-dark-bg-tertiary') ||
        input.className.includes('dark:border-dark-border')
      );
      expect(hasDarkModeClasses).toBe(true);
    });

    it('should have dark mode text colors on labels', () => {
      const { container } = render(
        <ThemeProvider defaultTheme="dark">
          <ContactForm locale="en" />
        </ThemeProvider>
      );

      const labels = container.querySelectorAll('label');
      expect(labels.length).toBeGreaterThan(0);

      // Check that labels have dark mode text color classes
      const hasDarkModeClasses = Array.from(labels).some(label => 
        label.className.includes('dark:text-dark-text')
      );
      expect(hasDarkModeClasses).toBe(true);
    });

    it('should render submit button with dark mode classes', () => {
      const { container } = render(
        <ThemeProvider defaultTheme="dark">
          <ContactForm locale="en" />
        </ThemeProvider>
      );

      const button = container.querySelector('button[type="submit"]');
      expect(button).toBeTruthy();
      expect(button?.className).toContain('dark:bg-dark-primary');
    });
  });
});
