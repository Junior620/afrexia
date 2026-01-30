/**
 * Catalog Performance Tests
 * 
 * Task 22.5: Run performance tests
 * - Test with 10, 25, 50, 100 products
 * - Measure filter application time
 * - Measure search query response time
 * - Measure image loading time
 * - Verify Lighthouse scores (≥85 desktop, ≥75 mobile)
 * 
 * Requirements: 9.7, 9.8
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { applyFilters, searchProducts, matchesAllFilters } from '@/lib/catalog/filters';
import type { Product, FilterState } from '@/types/product';

// Helper function to generate mock products
function generateMockProducts(count: number): Product[] {
  const categories = ['Cocoa', 'Coffee', 'Cashew', 'Shea Butter'];
  const origins = ['CI', 'GH', 'NG', 'BF', 'TG'];
  const availabilities: Array<'in-stock' | 'limited' | 'pre-order'> = ['in-stock', 'limited', 'pre-order'];
  const certifications = ['organic', 'fair-trade', 'rainforest-alliance'];
  const incoterms = ['FOB', 'CIF', 'DAP', 'EXW'];

  return Array.from({ length: count }, (_, i) => ({
    id: `product-${i}`,
    slug: `product-${i}`,
    name: `Product ${i} - ${categories[i % categories.length]}`,
    subtitle: `Premium ${categories[i % categories.length]} from Africa`,
    category: categories[i % categories.length],
    heroImage: {
      asset: {
        _ref: `image-${i}`,
        _type: 'reference' as const,
      },
    },
    availability: availabilities[i % availabilities.length],
    origins: [origins[i % origins.length], origins[(i + 1) % origins.length]],
    certifications: i % 2 === 0 ? [certifications[i % certifications.length]] : [],
    eudrReady: i % 3 === 0,
    qaAvailable: i % 2 === 0,
    documents: {
      coa: i % 2 === 0,
      specSheet: i % 3 === 0,
      chainOfCustody: i % 4 === 0,
    },
    moq: {
      value: 100 + (i * 50),
      unit: 'kg',
    },
    incoterms: [incoterms[i % incoterms.length], incoterms[(i + 1) % incoterms.length]],
    packaging: `Bags ${50 + (i % 3) * 10}kg`,
    grade: `Grade ${i % 3 === 0 ? 'I' : 'II'}`,
    leadTime: `${4 + (i % 4)}-${6 + (i % 4)} weeks`,
    tags: [
      categories[i % categories.length].toLowerCase(),
      i % 2 === 0 ? 'premium' : 'standard',
      i % 3 === 0 ? 'organic' : 'conventional',
    ],
    markets: ['EU', 'US', 'ASIA'].slice(0, (i % 3) + 1),
    updatedAt: new Date(2024, 0, 1 + (i % 30)).toISOString(),
  }));
}

// Performance measurement helper
function measurePerformance<T>(fn: () => T): { result: T; duration: number } {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  return { result, duration: end - start };
}

describe('Catalog Performance Tests', () => {
  describe('Filter Application Performance', () => {
    it('should filter 10 products in under 10ms', () => {
      const products = generateMockProducts(10);
      const filterState: FilterState = {
        search: '',
        category: 'Cocoa',
        origins: ['CI'],
        availability: ['in-stock'],
        certifications: [],
        incoterms: [],
      };

      const { result, duration } = measurePerformance(() =>
        applyFilters(products, filterState)
      );

      expect(result.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(10);
      console.log(`✓ Filtered 10 products in ${duration.toFixed(2)}ms`);
    });

    it('should filter 25 products in under 15ms', () => {
      const products = generateMockProducts(25);
      const filterState: FilterState = {
        search: '',
        category: 'Coffee',
        origins: ['GH', 'NG'],
        availability: ['in-stock', 'limited'],
        certifications: [],
        incoterms: [],
      };

      const { result, duration } = measurePerformance(() =>
        applyFilters(products, filterState)
      );

      expect(result.length).toBeGreaterThanOrEqual(0);
      expect(duration).toBeLessThan(15);
      console.log(`✓ Filtered 25 products in ${duration.toFixed(2)}ms (${result.length} results)`);
    });

    it('should filter 50 products in under 25ms', () => {
      const products = generateMockProducts(50);
      const filterState: FilterState = {
        search: '',
        category: 'Cocoa',
        origins: ['CI', 'GH'],
        availability: ['in-stock'],
        eudrReady: true,
        certifications: ['organic', 'fair-trade'],
        incoterms: ['FOB', 'CIF'],
      };

      const { result, duration } = measurePerformance(() =>
        applyFilters(products, filterState)
      );

      expect(result.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(25);
      console.log(`✓ Filtered 50 products in ${duration.toFixed(2)}ms`);
    });

    it('should filter 100 products in under 50ms', () => {
      const products = generateMockProducts(100);
      const filterState: FilterState = {
        search: '',
        category: 'Coffee',
        origins: ['CI', 'GH', 'NG'],
        availability: ['in-stock', 'limited'],
        certifications: [],
        incoterms: [],
      };

      const { result, duration } = measurePerformance(() =>
        applyFilters(products, filterState)
      );

      expect(result.length).toBeGreaterThanOrEqual(0);
      expect(duration).toBeLessThan(50);
      console.log(`✓ Filtered 100 products in ${duration.toFixed(2)}ms (${result.length} results)`);
    });

    it('should handle complex filter combinations efficiently', () => {
      const products = generateMockProducts(100);
      const filterState: FilterState = {
        search: '',
        category: 'Cocoa',
        origins: ['CI', 'GH', 'NG', 'BF'],
        availability: ['in-stock', 'limited', 'pre-order'],
        eudrReady: true,
        certifications: ['organic', 'fair-trade', 'rainforest-alliance'],
        incoterms: ['FOB', 'CIF', 'DAP', 'EXW'],
        moqRange: { min: 100, max: 5000 },
      };

      const { result, duration } = measurePerformance(() =>
        applyFilters(products, filterState)
      );

      expect(duration).toBeLessThan(50);
      console.log(`✓ Applied complex filters to 100 products in ${duration.toFixed(2)}ms`);
    });
  });

  describe('Search Query Performance', () => {
    it('should search 10 products in under 5ms', () => {
      const products = generateMockProducts(10);
      const query = 'cocoa';

      const { result, duration } = measurePerformance(() =>
        searchProducts(products, query)
      );

      expect(result.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(5);
      console.log(`✓ Searched 10 products in ${duration.toFixed(2)}ms`);
    });

    it('should search 25 products in under 10ms', () => {
      const products = generateMockProducts(25);
      const query = 'premium';

      const { result, duration } = measurePerformance(() =>
        searchProducts(products, query)
      );

      expect(result.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(10);
      console.log(`✓ Searched 25 products in ${duration.toFixed(2)}ms`);
    });

    it('should search 50 products in under 15ms', () => {
      const products = generateMockProducts(50);
      const query = 'coffee';

      const { result, duration } = measurePerformance(() =>
        searchProducts(products, query)
      );

      expect(result.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(15);
      console.log(`✓ Searched 50 products in ${duration.toFixed(2)}ms`);
    });

    it('should search 100 products in under 25ms', () => {
      const products = generateMockProducts(100);
      const query = 'organic';

      const { result, duration } = measurePerformance(() =>
        searchProducts(products, query)
      );

      expect(result.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(25);
      console.log(`✓ Searched 100 products in ${duration.toFixed(2)}ms`);
    });

    it('should handle case-insensitive search efficiently', () => {
      const products = generateMockProducts(100);
      const queries = ['COCOA', 'Coffee', 'premium', 'ORGANIC'];

      queries.forEach((query) => {
        const { result, duration } = measurePerformance(() =>
          searchProducts(products, query)
        );

        expect(duration).toBeLessThan(25);
        console.log(`✓ Case-insensitive search for "${query}" in ${duration.toFixed(2)}ms`);
      });
    });

    it('should handle partial matches efficiently', () => {
      const products = generateMockProducts(100);
      const query = 'coc'; // Partial match for "cocoa"

      const { result, duration } = measurePerformance(() =>
        searchProducts(products, query)
      );

      expect(result.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(25);
      console.log(`✓ Partial match search in ${duration.toFixed(2)}ms`);
    });
  });

  describe('Combined Search and Filter Performance', () => {
    it('should handle search + filters on 10 products in under 15ms', () => {
      const products = generateMockProducts(10);
      const filterState: FilterState = {
        search: 'cocoa',
        category: 'Cocoa',
        origins: ['CI'],
        availability: ['in-stock'],
        certifications: [],
        incoterms: [],
      };

      const { result, duration } = measurePerformance(() =>
        applyFilters(products, filterState)
      );

      expect(duration).toBeLessThan(15);
      console.log(`✓ Search + filter on 10 products in ${duration.toFixed(2)}ms`);
    });

    it('should handle search + filters on 25 products in under 25ms', () => {
      const products = generateMockProducts(25);
      const filterState: FilterState = {
        search: 'premium',
        category: 'Coffee',
        origins: ['GH', 'NG'],
        availability: ['in-stock'],
        certifications: ['organic'],
        incoterms: ['FOB'],
      };

      const { result, duration } = measurePerformance(() =>
        applyFilters(products, filterState)
      );

      expect(duration).toBeLessThan(25);
      console.log(`✓ Search + filter on 25 products in ${duration.toFixed(2)}ms`);
    });

    it('should handle search + filters on 50 products in under 40ms', () => {
      const products = generateMockProducts(50);
      const filterState: FilterState = {
        search: 'organic',
        category: 'Cocoa',
        origins: ['CI', 'GH'],
        availability: ['in-stock', 'limited'],
        eudrReady: true,
        certifications: ['organic'],
        incoterms: ['FOB', 'CIF'],
      };

      const { result, duration } = measurePerformance(() =>
        applyFilters(products, filterState)
      );

      expect(duration).toBeLessThan(40);
      console.log(`✓ Search + filter on 50 products in ${duration.toFixed(2)}ms`);
    });

    it('should handle search + filters on 100 products in under 75ms', () => {
      const products = generateMockProducts(100);
      const filterState: FilterState = {
        search: 'premium',
        category: 'Coffee',
        origins: ['CI', 'GH', 'NG'],
        availability: ['in-stock'],
        eudrReady: true,
        certifications: ['organic', 'fair-trade'],
        incoterms: ['FOB', 'CIF'],
        moqRange: { min: 200, max: 2000 },
      };

      const { result, duration } = measurePerformance(() =>
        applyFilters(products, filterState)
      );

      expect(duration).toBeLessThan(75);
      console.log(`✓ Search + filter on 100 products in ${duration.toFixed(2)}ms`);
    });
  });

  describe('Filter Matching Performance', () => {
    it('should match individual products efficiently', () => {
      const products = generateMockProducts(100);
      const filterState: FilterState = {
        search: '',
        category: 'Cocoa',
        origins: ['CI'],
        availability: ['in-stock'],
        eudrReady: true,
        certifications: ['organic'],
        incoterms: ['FOB'],
      };

      const { duration } = measurePerformance(() => {
        products.forEach((product) => {
          matchesAllFilters(product, filterState);
        });
      });

      expect(duration).toBeLessThan(50);
      console.log(`✓ Matched 100 products individually in ${duration.toFixed(2)}ms`);
    });

    it('should handle empty filter state efficiently', () => {
      const products = generateMockProducts(100);
      const filterState: FilterState = {
        search: '',
        origins: [],
        availability: [],
        certifications: [],
        incoterms: [],
      };

      const { result, duration } = measurePerformance(() =>
        applyFilters(products, filterState)
      );

      expect(result.length).toBe(100);
      expect(duration).toBeLessThan(10);
      console.log(`✓ Handled empty filters on 100 products in ${duration.toFixed(2)}ms`);
    });
  });

  describe('Scalability Tests', () => {
    it('should scale linearly with product count', () => {
      const sizes = [10, 25, 50, 100];
      const durations: number[] = [];

      sizes.forEach((size) => {
        const products = generateMockProducts(size);
        const filterState: FilterState = {
          search: 'premium',
          category: 'Cocoa',
          origins: ['CI', 'GH'],
          availability: ['in-stock'],
          certifications: ['organic'],
          incoterms: ['FOB'],
        };

        const { duration } = measurePerformance(() =>
          applyFilters(products, filterState)
        );

        durations.push(duration);
        console.log(`✓ ${size} products: ${duration.toFixed(2)}ms`);
      });

      // Check that performance scales reasonably (not exponentially)
      // Duration should roughly double when product count doubles
      const ratio1 = durations[1] / durations[0]; // 25/10
      const ratio2 = durations[2] / durations[1]; // 50/25
      const ratio3 = durations[3] / durations[2]; // 100/50

      // Ratios should be less than 4 (indicating better than quadratic scaling)
      expect(ratio1).toBeLessThan(4);
      expect(ratio2).toBeLessThan(4);
      expect(ratio3).toBeLessThan(4);

      console.log(`✓ Scaling ratios: ${ratio1.toFixed(2)}x, ${ratio2.toFixed(2)}x, ${ratio3.toFixed(2)}x`);
    });

    it('should handle worst-case scenarios efficiently', () => {
      const products = generateMockProducts(100);
      
      // Worst case: all filters active, no matches
      const filterState: FilterState = {
        search: 'nonexistent-product-xyz',
        category: 'Cocoa',
        origins: ['CI', 'GH', 'NG', 'BF', 'TG'],
        availability: ['in-stock', 'limited', 'pre-order'],
        eudrReady: true,
        certifications: ['organic', 'fair-trade', 'rainforest-alliance'],
        incoterms: ['FOB', 'CIF', 'DAP', 'EXW'],
        moqRange: { min: 0, max: 10000 },
      };

      const { result, duration } = measurePerformance(() =>
        applyFilters(products, filterState)
      );

      expect(result.length).toBe(0);
      expect(duration).toBeLessThan(75);
      console.log(`✓ Worst-case scenario (no matches) in ${duration.toFixed(2)}ms`);
    });
  });

  describe('Performance Summary', () => {
    it('should generate performance report', () => {
      console.log('\n=== CATALOG PERFORMANCE REPORT ===\n');

      const testCases = [
        { size: 10, maxTime: 10, operation: 'filter' },
        { size: 25, maxTime: 15, operation: 'filter' },
        { size: 50, maxTime: 25, operation: 'filter' },
        { size: 100, maxTime: 50, operation: 'filter' },
        { size: 10, maxTime: 5, operation: 'search' },
        { size: 25, maxTime: 10, operation: 'search' },
        { size: 50, maxTime: 15, operation: 'search' },
        { size: 100, maxTime: 25, operation: 'search' },
      ];

      const results: Array<{ size: number; operation: string; duration: number; passed: boolean }> = [];

      testCases.forEach(({ size, maxTime, operation }) => {
        const products = generateMockProducts(size);
        
        let duration: number;
        if (operation === 'filter') {
          const filterState: FilterState = {
            search: '',
            category: 'Cocoa',
            origins: ['CI'],
            availability: ['in-stock'],
            certifications: [],
            incoterms: [],
          };
          const result = measurePerformance(() => applyFilters(products, filterState));
          duration = result.duration;
        } else {
          const result = measurePerformance(() => searchProducts(products, 'cocoa'));
          duration = result.duration;
        }

        const passed = duration < maxTime;
        results.push({ size, operation, duration, passed });
      });

      console.log('Product Count | Operation | Duration | Max Time | Status');
      console.log('-------------|-----------|----------|----------|--------');
      results.forEach(({ size, operation, duration, passed }) => {
        const maxTime = testCases.find(tc => tc.size === size && tc.operation === operation)?.maxTime;
        const status = passed ? '✓ PASS' : '✗ FAIL';
        console.log(
          `${size.toString().padEnd(13)}| ${operation.padEnd(10)}| ${duration.toFixed(2)}ms${' '.repeat(5 - duration.toFixed(2).length)}| ${maxTime}ms${' '.repeat(5 - maxTime.toString().length)}| ${status}`
        );
      });

      const allPassed = results.every(r => r.passed);
      const passRate = (results.filter(r => r.passed).length / results.length * 100).toFixed(1);

      console.log(`\nPass Rate: ${passRate}%`);
      console.log(`Overall: ${allPassed ? '✓ ALL TESTS PASSED' : '✗ SOME TESTS FAILED'}\n`);

      expect(allPassed).toBe(true);
    });
  });
});
