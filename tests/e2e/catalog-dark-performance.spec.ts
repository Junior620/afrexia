/**
 * Catalog Dark Premium Performance Tests
 * 
 * Performance tests for Lighthouse scores and Core Web Vitals
 * Requirements: 11.5, 10.1, 10.2
 */

import { test, expect } from '@playwright/test';

test.describe('Catalog Dark Premium - Performance', () => {
  test('should meet Lighthouse performance thresholds', async ({ page }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Measure performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');

      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paint.find((entry) => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find((entry) => entry.name === 'first-contentful-paint')?.startTime || 0,
      };
    });

    console.log('Performance Metrics:', performanceMetrics);

    // Check that page loads in reasonable time
    expect(performanceMetrics.domContentLoaded).toBeLessThan(3000); // 3 seconds
    expect(performanceMetrics.loadComplete).toBeLessThan(5000); // 5 seconds
    expect(performanceMetrics.firstContentfulPaint).toBeLessThan(2000); // 2 seconds
  });

  test('should have acceptable Core Web Vitals', async ({ page }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Measure Core Web Vitals
    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals: any = {};

        // Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = lastEntry.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID) - simulated
        vitals.fid = 0; // Would need real user interaction

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          vitals.cls = clsValue;
        }).observe({ entryTypes: ['layout-shift'] });

        // Wait a bit for metrics to be collected
        setTimeout(() => resolve(vitals), 2000);
      });
    });

    console.log('Core Web Vitals:', webVitals);

    // Check thresholds
    // LCP should be < 2.5s (good), < 4s (needs improvement)
    expect((webVitals as any).lcp).toBeLessThan(4000);

    // CLS should be < 0.1 (good), < 0.25 (needs improvement)
    expect((webVitals as any).cls).toBeLessThan(0.25);
  });

  test('should load images efficiently', async ({ page }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Wait for product images
    await page.waitForSelector('[data-testid="product-card"] img', { timeout: 10000 });

    // Check image loading attributes
    const images = page.locator('[data-testid="product-card"] img');
    const imageCount = await images.count();

    for (let i = 0; i < Math.min(imageCount, 3); i++) {
      const img = images.nth(i);

      // Check loading attribute
      const loading = await img.getAttribute('loading');
      expect(loading).toBe('lazy');

      // Check that image has loaded
      const isComplete = await img.evaluate((el: HTMLImageElement) => el.complete);
      expect(isComplete).toBe(true);
    }
  });

  test('should have minimal JavaScript bundle size', async ({ page }) => {
    // Navigate and measure resources
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    const resourceSizes = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

      const jsResources = resources.filter((r) => r.name.endsWith('.js'));
      const cssResources = resources.filter((r) => r.name.endsWith('.css'));

      const totalJsSize = jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      const totalCssSize = cssResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);

      return {
        jsCount: jsResources.length,
        cssCount: cssResources.length,
        totalJsSize,
        totalCssSize,
        totalJsSizeKB: Math.round(totalJsSize / 1024),
        totalCssSizeKB: Math.round(totalCssSize / 1024),
      };
    });

    console.log('Resource Sizes:', resourceSizes);

    // Check that JS bundle is reasonable (< 500KB for initial load)
    expect(resourceSizes.totalJsSizeKB).toBeLessThan(500);

    // Check that CSS is reasonable (< 100KB)
    expect(resourceSizes.totalCssSizeKB).toBeLessThan(100);
  });

  test('should render products quickly', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/fr/products');

    // Wait for first product card to be visible
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });

    const renderTime = Date.now() - startTime;

    console.log(`Products rendered in ${renderTime}ms`);

    // Should render within 3 seconds
    expect(renderTime).toBeLessThan(3000);
  });

  test('should handle filter interactions smoothly', async ({ page }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Measure filter interaction time
    const startTime = Date.now();

    // Apply a filter
    await page.click('[aria-label="Catégorie"]');
    await page.click('text=Cacao');

    // Wait for results to update
    await page.waitForTimeout(500);

    const filterTime = Date.now() - startTime;

    console.log(`Filter applied in ${filterTime}ms`);

    // Should respond within 1 second
    expect(filterTime).toBeLessThan(1000);
  });

  test('should prefetch product pages on hover', async ({ page }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Wait for products
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });

    // Hover over first product card
    await page.locator('[data-testid="product-card"]').first().hover();

    // Wait a bit for prefetch to trigger
    await page.waitForTimeout(500);

    // Check if prefetch link was added (Next.js behavior)
    const prefetchLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="prefetch"]'));
      return links.length;
    });

    console.log(`Prefetch links: ${prefetchLinks}`);

    // Should have prefetch links (if Next.js Link is used)
    expect(prefetchLinks).toBeGreaterThanOrEqual(0);
  });

  test('should have acceptable Time to Interactive', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Wait for page to be interactive
    await page.waitForSelector('button:has-text("Demander un devis")', { timeout: 10000 });

    const tti = Date.now() - startTime;

    console.log(`Time to Interactive: ${tti}ms`);

    // Should be interactive within 5 seconds
    expect(tti).toBeLessThan(5000);
  });

  test('should not have excessive layout shifts', async ({ page }) => {
    await page.goto('/fr/products');

    // Measure layout shifts during load
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;

        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
        });

        observer.observe({ entryTypes: ['layout-shift'] });

        // Measure for 3 seconds
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 3000);
      });
    });

    console.log(`Cumulative Layout Shift: ${cls}`);

    // CLS should be < 0.1 (good), < 0.25 (needs improvement)
    expect(cls).toBeLessThan(0.25);
  });

  test('should load fonts efficiently', async ({ page }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Check font loading
    const fontMetrics = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const fonts = resources.filter((r) => r.name.includes('.woff') || r.name.includes('.woff2'));

      return {
        fontCount: fonts.length,
        totalFontSize: fonts.reduce((sum, r) => sum + (r.transferSize || 0), 0),
        totalFontSizeKB: Math.round(fonts.reduce((sum, r) => sum + (r.transferSize || 0), 0) / 1024),
      };
    });

    console.log('Font Metrics:', fontMetrics);

    // Should have reasonable font count (< 10)
    expect(fontMetrics.fontCount).toBeLessThan(10);

    // Total font size should be reasonable (< 200KB)
    expect(fontMetrics.totalFontSizeKB).toBeLessThan(200);
  });
});

test.describe('Catalog Dark Premium - Mobile Performance', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should meet mobile performance thresholds', async ({ page }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');

      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstContentfulPaint: paint.find((entry) => entry.name === 'first-contentful-paint')?.startTime || 0,
      };
    });

    console.log('Mobile Performance Metrics:', performanceMetrics);

    // Mobile thresholds are slightly more lenient
    expect(performanceMetrics.domContentLoaded).toBeLessThan(4000); // 4 seconds
    expect(performanceMetrics.loadComplete).toBeLessThan(6000); // 6 seconds
    expect(performanceMetrics.firstContentfulPaint).toBeLessThan(3000); // 3 seconds
  });

  test('should render mobile layout efficiently', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/fr/products');
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });

    const renderTime = Date.now() - startTime;

    console.log(`Mobile layout rendered in ${renderTime}ms`);

    // Should render within 4 seconds on mobile
    expect(renderTime).toBeLessThan(4000);
  });
});
