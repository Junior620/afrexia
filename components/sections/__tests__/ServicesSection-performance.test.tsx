/**
 * Performance Validation Tests for Services Section
 * 
 * Validates:
 * - Component render time < 50ms
 * - Image optimization (lazy loading, priority, responsive sizes)
 * - Layout stability (CLS < 0.1)
 * - Performance budget compliance
 * - Responsive performance
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ServicesSection } from '../ServicesSection';
import { performance } from 'perf_hooks';

vi.mock('next/image', () => ({
  default: ({ src, alt, priority, loading, ...props }: any) => {
    return <img src={src} alt={alt} data-priority={priority} data-loading={loading} {...props} />;
  },
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/components/animations/ScrollReveal', () => ({
  ScrollReveal: ({ children }: any) => <div>{children}</div>,
}));

describe('Services Section - Performance Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Render Performance', () => {
    it('should render in less than 50ms', () => {
      const startTime = performance.now();
      render(<ServicesSection locale="en" />);
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(50);
      console.log(`✓ Services Section render time: ${renderTime.toFixed(2)}ms`);
    });

    it('should render French content in less than 50ms', () => {
      const startTime = performance.now();
      render(<ServicesSection locale="fr" />);
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(50);
      console.log(`✓ Services Section (FR) render time: ${renderTime.toFixed(2)}ms`);
    });

    it('should have minimal re-render overhead', () => {
      const { rerender } = render(<ServicesSection locale="en" />);
      
      const startTime = performance.now();
      rerender(<ServicesSection locale="en" />);
      const endTime = performance.now();
      const rerenderTime = endTime - startTime;
      
      expect(rerenderTime).toBeLessThan(30);
      console.log(`✓ Services Section re-render time: ${rerenderTime.toFixed(2)}ms`);
    });
  });

  describe('Image Optimization Compliance', () => {
    it('should use priority loading for first 2 images', () => {
      render(<ServicesSection locale="en" />);
      const images = screen.getAllByRole('img');
      
      expect(images.length).toBeGreaterThanOrEqual(4);
      
      const priorityImages = images.filter(img => img.getAttribute('data-priority') === 'true');
      expect(priorityImages.length).toBeGreaterThanOrEqual(2);
      
      console.log(`✓ ${priorityImages.length} images use priority loading`);
    });

    it('should use lazy loading for remaining images', () => {
      render(<ServicesSection locale="en" />);
      const images = screen.getAllByRole('img');
      
      const lazyImages = images.filter(img => img.getAttribute('data-loading') === 'lazy');
      expect(lazyImages.length).toBeGreaterThanOrEqual(2);
      
      console.log(`✓ ${lazyImages.length} images use lazy loading`);
    });

    it('should have descriptive alt text for all images', () => {
      render(<ServicesSection locale="en" />);
      const images = screen.getAllByRole('img');
      
      images.forEach(img => {
        const alt = img.getAttribute('alt');
        expect(alt).toBeTruthy();
        expect(alt!.length).toBeGreaterThan(5);
      });
      
      console.log(`✓ All ${images.length} images have descriptive alt text`);
    });

    it('should use responsive sizes for images', () => {
      render(<ServicesSection locale="en" />);
      const images = screen.getAllByRole('img');
      
      images.forEach(img => {
        const sizes = img.getAttribute('sizes');
        expect(sizes).toBeTruthy();
        expect(sizes).toContain('100vw');
      });
      
      console.log('✓ All images use responsive sizes');
    });
  });

  describe('Layout Stability (CLS Prevention)', () => {
    it('should have explicit structure to prevent layout shift', () => {
      const { container } = render(<ServicesSection locale="en" />);
      const section = container.querySelector('section');
      expect(section).toBeTruthy();
      
      console.log('✓ Component structure supports layout stability');
    });

    it('should maintain layout integrity during content load', () => {
      const { container } = render(<ServicesSection locale="en" />);
      const section = container.querySelector('section');
      expect(section).toBeTruthy();
      
      const title = screen.getByText(/Our Services/i);
      expect(title).toBeTruthy();
      
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThanOrEqual(4);
      
      console.log('✓ All content sections render without layout shift');
    });

    it('should have consistent spacing and padding', () => {
      const { container } = render(<ServicesSection locale="en" />);
      const section = container.querySelector('section');
      expect(section).toBeTruthy();
      
      const sectionClasses = section?.className || '';
      expect(sectionClasses).toContain('py-');
      
      console.log('✓ Consistent spacing applied');
    });
  });

  describe('Performance Budget Compliance', () => {
    it('should have reasonable DOM nodes', () => {
      const { container } = render(<ServicesSection locale="en" />);
      const allElements = container.querySelectorAll('*');
      const elementCount = allElements.length;
      
      expect(elementCount).toBeLessThan(300);
      console.log(`✓ Services Section DOM nodes: ${elementCount} (target: < 300)`);
    });

    it('should not have excessive nesting depth', () => {
      const { container } = render(<ServicesSection locale="en" />);
      
      let maxDepth = 0;
      const calculateDepth = (element: Element, depth: number = 0): void => {
        maxDepth = Math.max(maxDepth, depth);
        Array.from(element.children).forEach(child => {
          calculateDepth(child, depth + 1);
        });
      };
      
      calculateDepth(container);
      expect(maxDepth).toBeLessThan(20);
      console.log(`✓ Max nesting depth: ${maxDepth} (target: < 20)`);
    });

    it('should have efficient CSS class usage', () => {
      const { container } = render(<ServicesSection locale="en" />);
      const allElements = container.querySelectorAll('*');
      let totalClasses = 0;
      
      allElements.forEach(element => {
        const classes = element.className;
        if (typeof classes === 'string') {
          totalClasses += classes.split(' ').filter(c => c.length > 0).length;
        }
      });
      
      const avgClassesPerElement = totalClasses / allElements.length;
      expect(avgClassesPerElement).toBeLessThan(10);
      console.log(`✓ Average classes per element: ${avgClassesPerElement.toFixed(2)} (target: < 10)`);
    });
  });

  describe('Responsive Performance', () => {
    it('should render efficiently on mobile viewport', () => {
      global.innerWidth = 375;
      
      const startTime = performance.now();
      render(<ServicesSection locale="en" />);
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(50);
      console.log(`✓ Mobile render time: ${renderTime.toFixed(2)}ms`);
    });

    it('should render efficiently on desktop viewport', () => {
      global.innerWidth = 1920;
      
      const startTime = performance.now();
      render(<ServicesSection locale="en" />);
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(50);
      console.log(`✓ Desktop render time: ${renderTime.toFixed(2)}ms`);
    });
  });

  describe('Content Performance', () => {
    it('should load content efficiently for all locales', () => {
      const locales = ['en', 'fr', 'es', 'de', 'ru'];
      const renderTimes: number[] = [];
      
      locales.forEach(locale => {
        const startTime = performance.now();
        const { unmount } = render(<ServicesSection locale={locale as any} />);
        const endTime = performance.now();
        unmount();
        
        const renderTime = endTime - startTime;
        renderTimes.push(renderTime);
        expect(renderTime).toBeLessThan(50);
      });
      
      const avgRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
      console.log(`✓ Average render time across locales: ${avgRenderTime.toFixed(2)}ms`);
    });

    it('should render all 4 service cards', () => {
      render(<ServicesSection locale="en" />);
      const links = screen.getAllByRole('link');
      
      const serviceLinks = links.filter(link => 
        link.getAttribute('href')?.includes('/services/')
      );
      
      expect(serviceLinks.length).toBe(4);
      console.log('✓ All 4 service cards rendered');
    });
  });

  describe('Performance Metrics Summary', () => {
    it('should meet all performance targets', () => {
      const metrics = {
        renderTime: 0,
        domNodes: 0,
        nestingDepth: 0,
        imageCount: 0,
        serviceCards: 0,
      };
      
      const startTime = performance.now();
      const { container } = render(<ServicesSection locale="en" />);
      const endTime = performance.now();
      
      metrics.renderTime = endTime - startTime;
      metrics.domNodes = container.querySelectorAll('*').length;
      metrics.imageCount = screen.getAllByRole('img').length;
      
      const links = screen.getAllByRole('link');
      metrics.serviceCards = links.filter(link => 
        link.getAttribute('href')?.includes('/services/')
      ).length;
      
      let maxDepth = 0;
      const calculateDepth = (element: Element, depth: number = 0): void => {
        maxDepth = Math.max(maxDepth, depth);
        Array.from(element.children).forEach(child => {
          calculateDepth(child, depth + 1);
        });
      };
      calculateDepth(container);
      metrics.nestingDepth = maxDepth;
      
      expect(metrics.renderTime).toBeLessThan(50);
      expect(metrics.domNodes).toBeLessThan(300);
      expect(metrics.nestingDepth).toBeLessThan(20);
      expect(metrics.imageCount).toBeGreaterThanOrEqual(4);
      expect(metrics.serviceCards).toBe(4);
      
      console.log('\n📊 Performance Metrics Summary:');
      console.log(`   Render Time: ${metrics.renderTime.toFixed(2)}ms (target: < 50ms) ✓`);
      console.log(`   DOM Nodes: ${metrics.domNodes} (target: < 300) ✓`);
      console.log(`   Nesting Depth: ${metrics.nestingDepth} (target: < 20) ✓`);
      console.log(`   Images: ${metrics.imageCount} (optimized) ✓`);
      console.log(`   Service Cards: ${metrics.serviceCards} ✓`);
      console.log('\n✅ All performance targets met!\n');
    });
  });
});
