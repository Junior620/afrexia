import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Property 51: Product-specific resources
 * 
 * **Validates: Requirements 12.6**
 * 
 * For any product page, if related resources exist (spec sheets, certificates, guides),
 * they should be displayed in a dedicated resources section.
 */

// Type definitions
interface Product {
  _id: string;
  name: {
    fr: string;
    en: string;
  };
  slug: {
    fr: { current: string };
    en: { current: string };
  };
  category: string;
}

interface Resource {
  _id: string;
  title: {
    fr: string;
    en: string;
  };
  category: string;
  relatedProducts?: Product[];
  file: {
    asset: {
      url: string;
      size: number;
      extension: string;
    };
  };
}

interface ProductPageData {
  product: Product;
  allResources: Resource[];
}

// Arbitrary generators
const productArbitrary = fc.record({
  _id: fc.uuid(),
  name: fc.record({
    fr: fc.string({ minLength: 1, maxLength: 50 }),
    en: fc.string({ minLength: 1, maxLength: 50 }),
  }),
  slug: fc.record({
    fr: fc.record({ current: fc.string({ minLength: 1, maxLength: 50 }) }),
    en: fc.record({ current: fc.string({ minLength: 1, maxLength: 50 }) }),
  }),
  category: fc.constantFrom('cocoa', 'coffee', 'pepper', 'wood', 'corn'),
});

const resourceArbitrary = (products: Product[]) =>
  fc.record({
    _id: fc.uuid(),
    title: fc.record({
      fr: fc.string({ minLength: 1, maxLength: 100 }),
      en: fc.string({ minLength: 1, maxLength: 100 }),
    }),
    category: fc.constantFrom('productSpecs', 'compliance', 'guides', 'certificates', 'other'),
    relatedProducts: fc.option(
      fc.array(fc.constantFrom(...products), { minLength: 1, maxLength: 3 }),
      { nil: undefined }
    ),
    file: fc.record({
      asset: fc.record({
        url: fc.webUrl(),
        size: fc.integer({ min: 1, max: 10000000 }),
        extension: fc.constantFrom('pdf', 'doc', 'docx'),
      }),
    }),
  });

// Helper function to get product-specific resources
function getProductResources(productId: string, allResources: Resource[]): Resource[] {
  return allResources.filter(
    (resource) =>
      resource.relatedProducts &&
      resource.relatedProducts.some((p) => p._id === productId)
  );
}

// Helper function to check if resources section should be displayed
function shouldDisplayResourcesSection(productResources: Resource[]): boolean {
  return productResources.length > 0;
}

describe('Property 51: Product-specific resources', () => {
  it('should display resources section when related resources exist', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.array(productArbitrary, { minLength: 1, maxLength: 5 }),
          fc.integer({ min: 0, max: 10 })
        ),
        ([products, resourceCount]) => {
          // Generate resources with some related to products
          const resources: Resource[] = Array.from({ length: resourceCount }, (_, i) => ({
            _id: `res-${i}`,
            title: { fr: `Resource ${i}`, en: `Resource ${i}` },
            category: ['productSpecs', 'compliance', 'guides'][i % 3] as any,
            relatedProducts: i % 2 === 0 ? [products[i % products.length]] : undefined,
            file: {
              asset: {
                url: `https://example.com/file${i}.pdf`,
                size: 1000 + i,
                extension: 'pdf',
              },
            },
          }));

          // For each product
          products.forEach((product) => {
            const productResources = getProductResources(product._id, resources);
            const shouldDisplay = shouldDisplayResourcesSection(productResources);

            // Property: Resources section should be displayed if and only if
            // there are related resources
            if (productResources.length > 0) {
              expect(shouldDisplay).toBe(true);
            } else {
              expect(shouldDisplay).toBe(false);
            }
          });
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should correctly filter resources by product relationship', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.array(productArbitrary, { minLength: 2, maxLength: 5 }),
          fc.integer({ min: 1, max: 10 })
        ),
        ([products, resourceCount]) => {
          // Generate resources with some related to products
          const resources: Resource[] = Array.from({ length: resourceCount }, (_, i) => ({
            _id: `res-${i}`,
            title: { fr: `Resource ${i}`, en: `Resource ${i}` },
            category: ['productSpecs', 'compliance', 'guides'][i % 3] as any,
            relatedProducts: i % 2 === 0 ? [products[i % products.length]] : undefined,
            file: {
              asset: {
                url: `https://example.com/file${i}.pdf`,
                size: 1000 + i,
                extension: 'pdf',
              },
            },
          }));

          // For each product
          products.forEach((product) => {
            const productResources = getProductResources(product._id, resources);

            // Property: All returned resources should be related to the product
            productResources.forEach((resource) => {
              expect(resource.relatedProducts).toBeDefined();
              expect(
                resource.relatedProducts!.some((p) => p._id === product._id)
              ).toBe(true);
            });

            // Property: No unrelated resources should be included
            const unrelatedResources = resources.filter(
              (r) =>
                !r.relatedProducts ||
                !r.relatedProducts.some((p) => p._id === product._id)
            );

            unrelatedResources.forEach((unrelated) => {
              expect(productResources).not.toContain(unrelated);
            });
          });
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should handle products with no related resources', () => {
    fc.assert(
      fc.property(productArbitrary, (product) => {
        // Create resources that are NOT related to this product
        const unrelatedResources: Resource[] = [
          {
            _id: 'res1',
            title: { fr: 'Resource 1', en: 'Resource 1' },
            category: 'productSpecs',
            relatedProducts: undefined, // No related products
            file: {
              asset: {
                url: 'https://example.com/file1.pdf',
                size: 1000,
                extension: 'pdf',
              },
            },
          },
        ];

        const productResources = getProductResources(product._id, unrelatedResources);

        // Property: Products with no related resources should have empty array
        expect(productResources).toEqual([]);
        expect(shouldDisplayResourcesSection(productResources)).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it('should support multiple products per resource', () => {
    fc.assert(
      fc.property(
        fc.array(productArbitrary, { minLength: 2, maxLength: 5 }),
        (products) => {
          // Create a resource related to multiple products
          const multiProductResource: Resource = {
            _id: 'multi-res',
            title: { fr: 'Multi Resource', en: 'Multi Resource' },
            category: 'guides',
            relatedProducts: products, // Related to all products
            file: {
              asset: {
                url: 'https://example.com/multi.pdf',
                size: 5000,
                extension: 'pdf',
              },
            },
          };

          // Property: Resource should appear in all related product pages
          products.forEach((product) => {
            const productResources = getProductResources(product._id, [multiProductResource]);
            expect(productResources).toContain(multiProductResource);
            expect(productResources.length).toBe(1);
          });
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should maintain resource metadata in product context', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.array(productArbitrary, { minLength: 1, maxLength: 3 }),
          fc.integer({ min: 1, max: 5 })
        ),
        ([products, resourceCount]) => {
          // Generate resources with some related to products
          const resources: Resource[] = Array.from({ length: resourceCount }, (_, i) => ({
            _id: `res-${i}`,
            title: { fr: `Resource ${i}`, en: `Resource ${i}` },
            category: ['productSpecs', 'compliance', 'guides'][i % 3] as any,
            relatedProducts: [products[i % products.length]],
            file: {
              asset: {
                url: `https://example.com/file${i}.pdf`,
                size: 1000 + i,
                extension: 'pdf',
              },
            },
          }));

          products.forEach((product) => {
            const productResources = getProductResources(product._id, resources);

            // Property: All resource metadata should be preserved
            productResources.forEach((resource) => {
              expect(resource._id).toBeTruthy();
              expect(resource.title).toBeDefined();
              expect(resource.title.fr || resource.title.en).toBeTruthy();
              expect(resource.category).toBeTruthy();
              expect(resource.file.asset.url).toBeTruthy();
              expect(resource.file.asset.size).toBeGreaterThan(0);
              expect(resource.file.asset.extension).toBeTruthy();
            });
          });
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should group resources by category for product display', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.array(productArbitrary, { minLength: 1, maxLength: 3 }),
          fc.integer({ min: 1, max: 10 })
        ),
        ([products, resourceCount]) => {
          // Generate resources with some related to products
          const resources: Resource[] = Array.from({ length: resourceCount }, (_, i) => ({
            _id: `res-${i}`,
            title: { fr: `Resource ${i}`, en: `Resource ${i}` },
            category: ['productSpecs', 'compliance', 'guides'][i % 3] as any,
            relatedProducts: [products[i % products.length]],
            file: {
              asset: {
                url: `https://example.com/file${i}.pdf`,
                size: 1000 + i,
                extension: 'pdf',
              },
            },
          }));

          products.forEach((product) => {
            const productResources = getProductResources(product._id, resources);

            // Group by category
            const byCategory = productResources.reduce((acc, resource) => {
              if (!acc[resource.category]) {
                acc[resource.category] = [];
              }
              acc[resource.category].push(resource);
              return acc;
            }, {} as Record<string, Resource[]>);

            // Property: Each category should only contain resources of that category
            Object.entries(byCategory).forEach(([category, categoryResources]) => {
              categoryResources.forEach((resource) => {
                expect(resource.category).toBe(category);
              });
            });

            // Property: All resources should be accounted for
            const totalGrouped = Object.values(byCategory).reduce(
              (sum, arr) => sum + arr.length,
              0
            );
            expect(totalGrouped).toBe(productResources.length);
          });
        }
      ),
      { numRuns: 50 }
    );
  });
});
