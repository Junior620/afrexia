import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  generateOrganizationSchema,
  generateProductSchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateWebSiteSchema,
  type ProductSchemaData,
  type ArticleSchemaData,
  type BreadcrumbItem,
} from '../schema';
import { Locale } from '@/types';

/**
 * Property 22: Schema.org structured data
 * 
 * **Validates: Requirements 6.4, 13.7**
 * 
 * This property verifies that all Schema.org structured data generators
 * produce valid, complete JSON-LD objects that conform to Schema.org specifications.
 */
describe('Property 22: Schema.org structured data', () => {
  const localeArbitrary = fc.constantFrom<Locale>('fr', 'en');

  describe('Organization Schema', () => {
    it('should generate valid Organization schema with all required fields', () => {
      fc.assert(
        fc.property(localeArbitrary, (locale) => {
          const schema = generateOrganizationSchema(locale);

          // Property: Must have correct @context and @type
          expect(schema['@context']).toBe('https://schema.org');
          expect(schema['@type']).toBe('Organization');

          // Property: Must have required Organization fields
          expect(schema.name).toBeDefined();
          expect(typeof schema.name).toBe('string');
          expect(schema.url).toBeDefined();
          expect(schema.url).toContain(locale);
          expect(schema.logo).toBeDefined();
          expect(schema.description).toBeDefined();

          // Property: Must have valid address
          expect(schema.address).toBeDefined();
          expect(schema.address['@type']).toBe('PostalAddress');
          expect(schema.address.addressCountry).toBeDefined();

          // Property: Must have valid contact point
          expect(schema.contactPoint).toBeDefined();
          expect(schema.contactPoint['@type']).toBe('ContactPoint');
          expect(schema.contactPoint.contactType).toBeDefined();
          expect(schema.contactPoint.email).toBeDefined();
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Product Schema', () => {
    const productDataArbitrary: fc.Arbitrary<ProductSchemaData> = fc.record({
      name: fc.string({ minLength: 5, maxLength: 100 }),
      description: fc.string({ minLength: 20, maxLength: 500 }),
      image: fc.array(fc.webUrl(), { minLength: 1, maxLength: 5 }),
      category: fc.constantFrom('Cocoa', 'Coffee', 'Pepper', 'Wood', 'Corn'),
      brand: fc.option(fc.string({ minLength: 3, maxLength: 50 }), { nil: undefined }),
      offers: fc.option(
        fc.record({
          price: fc.option(fc.string(), { nil: undefined }),
          priceCurrency: fc.option(fc.constantFrom('USD', 'EUR', 'XAF'), { nil: undefined }),
          availability: fc.constantFrom('InStock', 'OutOfStock', 'PreOrder'),
          seller: fc.record({
            name: fc.string({ minLength: 3, maxLength: 50 }),
          }),
        }),
        { nil: undefined }
      ),
      aggregateRating: fc.option(
        fc.record({
          ratingValue: fc.double({ min: 1, max: 5 }),
          reviewCount: fc.integer({ min: 1, max: 1000 }),
        }),
        { nil: undefined }
      ),
    });

    const slugArbitrary = fc.stringOf(
      fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f', '-'),
      { minLength: 5, maxLength: 30 }
    );

    it('should generate valid Product schema with all required fields', () => {
      fc.assert(
        fc.property(
          productDataArbitrary,
          localeArbitrary,
          slugArbitrary,
          (data, locale, slug) => {
            const schema = generateProductSchema(data, locale, slug);

            // Property: Must have correct @context and @type
            expect(schema['@context']).toBe('https://schema.org');
            expect(schema['@type']).toBe('Product');

            // Property: Must have required Product fields
            expect(schema.name).toBe(data.name);
            expect(schema.description).toBe(data.description);
            expect(schema.image).toEqual(data.image);
            expect(schema.category).toBe(data.category);
            expect(schema.url).toBeDefined();
            expect(schema.url).toContain(locale);
            expect(schema.url).toContain(slug);

            // Property: Must have valid brand
            expect(schema.brand).toBeDefined();
            expect(schema.brand['@type']).toBe('Brand');
            expect(schema.brand.name).toBeDefined();

            // Property: If offers provided, must be valid
            if (data.offers) {
              expect(schema.offers).toBeDefined();
              expect(schema.offers['@type']).toBe('Offer');
              expect(schema.offers.availability).toContain('schema.org');
              expect(schema.offers.seller).toBeDefined();
              expect(schema.offers.seller['@type']).toBe('Organization');
            }

            // Property: If rating provided, must be valid
            if (data.aggregateRating) {
              expect(schema.aggregateRating).toBeDefined();
              expect(schema.aggregateRating['@type']).toBe('AggregateRating');
              expect(schema.aggregateRating.ratingValue).toBe(data.aggregateRating.ratingValue);
              expect(schema.aggregateRating.reviewCount).toBe(data.aggregateRating.reviewCount);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Article Schema', () => {
    const articleDataArbitrary: fc.Arbitrary<ArticleSchemaData> = fc.record({
      title: fc.string({ minLength: 10, maxLength: 100 }),
      description: fc.string({ minLength: 50, maxLength: 300 }),
      image: fc.webUrl(),
      datePublished: fc.date({ min: new Date('2020-01-01'), max: new Date() }).map(d => d.toISOString()),
      dateModified: fc.option(
        fc.date({ min: new Date('2020-01-01'), max: new Date() }).map(d => d.toISOString()),
        { nil: undefined }
      ),
      author: fc.record({
        name: fc.string({ minLength: 3, maxLength: 50 }),
        url: fc.option(fc.webUrl(), { nil: undefined }),
      }),
      publisher: fc.option(
        fc.record({
          name: fc.string({ minLength: 3, maxLength: 50 }),
          logo: fc.webUrl(),
        }),
        { nil: undefined }
      ),
    });

    const slugArbitrary = fc.stringOf(
      fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f', '-'),
      { minLength: 5, maxLength: 30 }
    );

    it('should generate valid Article schema with all required fields', () => {
      fc.assert(
        fc.property(
          articleDataArbitrary,
          localeArbitrary,
          slugArbitrary,
          (data, locale, slug) => {
            const schema = generateArticleSchema(data, locale, slug);

            // Property: Must have correct @context and @type
            expect(schema['@context']).toBe('https://schema.org');
            expect(schema['@type']).toBe('Article');

            // Property: Must have required Article fields
            expect(schema.headline).toBe(data.title);
            expect(schema.description).toBe(data.description);
            expect(schema.image).toBe(data.image);
            expect(schema.datePublished).toBe(data.datePublished);
            expect(schema.dateModified).toBeDefined();

            // Property: Must have valid author
            expect(schema.author).toBeDefined();
            expect(schema.author['@type']).toBe('Person');
            expect(schema.author.name).toBe(data.author.name);

            // Property: Must have valid publisher
            expect(schema.publisher).toBeDefined();
            expect(schema.publisher['@type']).toBe('Organization');
            expect(schema.publisher.name).toBeDefined();
            expect(schema.publisher.logo).toBeDefined();
            expect(schema.publisher.logo['@type']).toBe('ImageObject');

            // Property: Must have valid mainEntityOfPage
            expect(schema.mainEntityOfPage).toBeDefined();
            expect(schema.mainEntityOfPage['@type']).toBe('WebPage');
            expect(schema.mainEntityOfPage['@id']).toContain(locale);
            expect(schema.mainEntityOfPage['@id']).toContain(slug);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use dateModified or fallback to datePublished', () => {
      fc.assert(
        fc.property(
          articleDataArbitrary,
          localeArbitrary,
          slugArbitrary,
          (data, locale, slug) => {
            const schema = generateArticleSchema(data, locale, slug);

            // Property: dateModified must be present
            expect(schema.dateModified).toBeDefined();

            // Property: If dateModified provided, use it; otherwise use datePublished
            if (data.dateModified) {
              expect(schema.dateModified).toBe(data.dateModified);
            } else {
              expect(schema.dateModified).toBe(data.datePublished);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Breadcrumb Schema', () => {
    const breadcrumbItemArbitrary: fc.Arbitrary<BreadcrumbItem> = fc.record({
      name: fc.string({ minLength: 3, maxLength: 30 }),
      path: fc.oneof(
        fc.constant(''),
        fc.constant('/products'),
        fc.constant('/blog'),
        fc.stringOf(
          fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f', '-', '/'),
          { minLength: 1, maxLength: 30 }
        ).map(s => '/' + s.replace(/\/+/g, '/').replace(/^\//, ''))
      ),
    });

    const breadcrumbsArbitrary = fc.array(breadcrumbItemArbitrary, { minLength: 1, maxLength: 5 });

    it('should generate valid BreadcrumbList schema', () => {
      fc.assert(
        fc.property(breadcrumbsArbitrary, localeArbitrary, (items, locale) => {
          const schema = generateBreadcrumbSchema(items, locale);

          // Property: Must have correct @context and @type
          expect(schema['@context']).toBe('https://schema.org');
          expect(schema['@type']).toBe('BreadcrumbList');

          // Property: Must have itemListElement array
          expect(schema.itemListElement).toBeDefined();
          expect(Array.isArray(schema.itemListElement)).toBe(true);
          expect(schema.itemListElement.length).toBe(items.length);

          // Property: Each item must be valid ListItem
          schema.itemListElement.forEach((item: any, index: number) => {
            expect(item['@type']).toBe('ListItem');
            expect(item.position).toBe(index + 1);
            expect(item.name).toBe(items[index].name);
            expect(item.item).toContain(locale);
            expect(item.item).toContain(items[index].path);
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should maintain correct position ordering', () => {
      fc.assert(
        fc.property(breadcrumbsArbitrary, localeArbitrary, (items, locale) => {
          const schema = generateBreadcrumbSchema(items, locale);

          // Property: Positions must be sequential starting from 1
          schema.itemListElement.forEach((item: any, index: number) => {
            expect(item.position).toBe(index + 1);
          });

          // Property: First item must have position 1
          if (schema.itemListElement.length > 0) {
            expect(schema.itemListElement[0].position).toBe(1);
          }

          // Property: Last item must have position equal to array length
          if (schema.itemListElement.length > 0) {
            const lastIndex = schema.itemListElement.length - 1;
            expect(schema.itemListElement[lastIndex].position).toBe(items.length);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('WebSite Schema', () => {
    it('should generate valid WebSite schema with search action', () => {
      fc.assert(
        fc.property(localeArbitrary, (locale) => {
          const schema = generateWebSiteSchema(locale);

          // Property: Must have correct @context and @type
          expect(schema['@context']).toBe('https://schema.org');
          expect(schema['@type']).toBe('WebSite');

          // Property: Must have required WebSite fields
          expect(schema.name).toBeDefined();
          expect(schema.url).toBeDefined();
          expect(schema.url).toContain(locale);

          // Property: Must have valid SearchAction
          expect(schema.potentialAction).toBeDefined();
          expect(schema.potentialAction['@type']).toBe('SearchAction');
          expect(schema.potentialAction.target).toBeDefined();
          expect(schema.potentialAction.target['@type']).toBe('EntryPoint');
          expect(schema.potentialAction.target.urlTemplate).toBeDefined();
          expect(schema.potentialAction.target.urlTemplate).toContain(locale);
          expect(schema.potentialAction.target.urlTemplate).toContain('{search_term_string}');
          expect(schema.potentialAction['query-input']).toBe('required name=search_term_string');
        }),
        { numRuns: 50 }
      );
    });
  });
});
