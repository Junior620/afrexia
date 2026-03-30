/**
 * Property-Based Tests: MetadataGenerator
 *
 * **Validates: Requirements 1.12**
 *
 * Properties covered:
 * - Property 6: Schema.org Structured Data Presence
 * - Property 29: Metadata Title Length Optimization
 * - Property 30: Metadata Description Length Optimization
 * - Property 31: FAQ Schema.org Presence
 * - Property 32: Social Sharing Metadata
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';
import {
  generatePageMetadata,
  generateProductSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  optimizeTitle,
  optimizeDescription,
} from '@/lib/seo/metadataGenerator';
import type { Locale, Product, FAQ, BreadcrumbItem } from '@/types/seo';

// ============================================================================
// Arbitraries
// ============================================================================

const localeArb: fc.Arbitrary<Locale> = fc.constantFrom('fr', 'en', 'es', 'de', 'ru');
const slugArb = fc.stringMatching(/^[a-z][a-z0-9-]{2,30}$/);
const nonEmptyString = fc.string({ minLength: 1, maxLength: 200 });

const productArb: fc.Arbitrary<Product> = fc.record({
  _id: fc.uuid(),
  _type: fc.constant('product' as const),
  name: fc.record({ fr: nonEmptyString, en: nonEmptyString }),
  slug: slugArb.map((s) => ({ current: s })),
});

const faqArb: fc.Arbitrary<FAQ> = fc.record({
  question: fc.string({ minLength: 10, maxLength: 100 }),
  answer: fc.string({ minLength: 20, maxLength: 300 }),
  locale: localeArb,
});

const breadcrumbItemArb: fc.Arbitrary<BreadcrumbItem> = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }),
  url: fc.webUrl(),
  position: fc.integer({ min: 1, max: 10 }),
});

// ============================================================================
// Property 29: Metadata Title Length Optimization
// **Validates: Requirements 1.12.1**
// ============================================================================

describe('Property 29: Metadata Title Length Optimization', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('optimizeTitle returns title within 50-60 chars when input is in range', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 50, maxLength: 60 }),
        (title) => {
          const result = optimizeTitle(title);
          expect(result.length).toBeGreaterThanOrEqual(50);
          expect(result.length).toBeLessThanOrEqual(60);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('optimizeTitle truncates titles longer than 60 chars to <= 60 chars', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 61, maxLength: 200 }),
        (title) => {
          const result = optimizeTitle(title);
          expect(result.length).toBeLessThanOrEqual(60);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('generatePageMetadata produces title <= 60 chars when input is long', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 61, maxLength: 200 }),
        fc.string({ minLength: 150, maxLength: 160 }),
        localeArb,
        slugArb,
        (title, description, locale, slug) => {
          const meta = generatePageMetadata({
            title,
            description,
            locale,
            slug,
            baseUrl: 'https://afrexia.com',
          });
          expect(meta.title.length).toBeLessThanOrEqual(60);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 30: Metadata Description Length Optimization
// **Validates: Requirements 1.12.2**
// ============================================================================

describe('Property 30: Metadata Description Length Optimization', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('optimizeDescription returns description within 150-160 chars when input is in range', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 150, maxLength: 160 }),
        (description) => {
          const result = optimizeDescription(description);
          expect(result.length).toBeGreaterThanOrEqual(150);
          expect(result.length).toBeLessThanOrEqual(160);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('optimizeDescription truncates descriptions longer than 160 chars to <= 160 chars', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 161, maxLength: 500 }),
        (description) => {
          const result = optimizeDescription(description);
          expect(result.length).toBeLessThanOrEqual(160);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('generatePageMetadata produces description <= 160 chars when input is long', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 50, maxLength: 60 }),
        fc.string({ minLength: 161, maxLength: 500 }),
        localeArb,
        slugArb,
        (title, description, locale, slug) => {
          const meta = generatePageMetadata({
            title,
            description,
            locale,
            slug,
            baseUrl: 'https://afrexia.com',
          });
          expect(meta.description.length).toBeLessThanOrEqual(160);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 6: Schema.org Structured Data Presence
// **Validates: Requirements 1.12.3, 1.12.4**
// ============================================================================

describe('Property 6: Schema.org Structured Data Presence', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('every product page schema has @type Product', () => {
    fc.assert(
      fc.property(productArb, localeArb, fc.webUrl(), (product, locale, url) => {
        const schema = generateProductSchema({ product, locale, url });
        expect(schema['@type']).toBe('Product');
        expect(schema['@context']).toBe('https://schema.org');
      }),
      { numRuns: 100 }
    );
  });

  it('every product schema contains an Offer', () => {
    fc.assert(
      fc.property(productArb, localeArb, fc.webUrl(), (product, locale, url) => {
        const schema = generateProductSchema({ product, locale, url });
        expect(schema.offers).toBeDefined();
        expect((schema.offers as Record<string, unknown>)['@type']).toBe('Offer');
      }),
      { numRuns: 100 }
    );
  });

  it('product schema with price includes price in Offer', () => {
    fc.assert(
      fc.property(
        productArb,
        localeArb,
        fc.webUrl(),
        fc.float({ min: 100, max: 10000 }),
        (product, locale, url, price) => {
          const schema = generateProductSchema({ product, locale, url, price });
          const offer = schema.offers as Record<string, unknown>;
          expect(offer.price).toBe(price);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('product schema always has a name', () => {
    fc.assert(
      fc.property(productArb, localeArb, fc.webUrl(), (product, locale, url) => {
        const schema = generateProductSchema({ product, locale, url });
        expect(typeof schema.name).toBe('string');
        expect((schema.name as string).length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 31: FAQ Schema.org Presence
// **Validates: Requirements 1.12.6**
// ============================================================================

describe('Property 31: FAQ Schema.org Presence', () => {
  it('every page with FAQs contains FAQPage schema', () => {
    fc.assert(
      fc.property(
        fc.array(faqArb, { minLength: 1, maxLength: 5 }),
        (faqs) => {
          const schema = generateFAQSchema(faqs);
          expect(schema['@type']).toBe('FAQPage');
          expect(schema['@context']).toBe('https://schema.org');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('FAQPage schema contains all FAQ questions', () => {
    fc.assert(
      fc.property(
        fc.array(faqArb, { minLength: 1, maxLength: 5 }),
        (faqs) => {
          const schema = generateFAQSchema(faqs);
          const entities = schema.mainEntity as Array<Record<string, unknown>>;
          expect(entities).toHaveLength(faqs.length);
          entities.forEach((entity, i) => {
            expect(entity['@type']).toBe('Question');
            expect(entity.name).toBe(faqs[i].question);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('each FAQ Question has an acceptedAnswer', () => {
    fc.assert(
      fc.property(
        fc.array(faqArb, { minLength: 1, maxLength: 5 }),
        (faqs) => {
          const schema = generateFAQSchema(faqs);
          const entities = schema.mainEntity as Array<Record<string, unknown>>;
          entities.forEach((entity) => {
            const answer = entity.acceptedAnswer as Record<string, unknown>;
            expect(answer['@type']).toBe('Answer');
            expect(typeof answer.text).toBe('string');
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 32: Social Sharing Metadata
// **Validates: Requirements 1.12.7, 1.12.8**
// ============================================================================

describe('Property 32: Social Sharing Metadata', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('every page metadata contains Open Graph data', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 50, maxLength: 60 }),
        fc.string({ minLength: 150, maxLength: 160 }),
        localeArb,
        slugArb,
        (title, description, locale, slug) => {
          const meta = generatePageMetadata({
            title,
            description,
            locale,
            slug,
            baseUrl: 'https://afrexia.com',
          });
          expect(meta.openGraph).toBeDefined();
          expect(meta.openGraph.title).toBeTruthy();
          expect(meta.openGraph.description).toBeTruthy();
          expect(meta.openGraph.url).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('every page metadata contains Twitter Card data', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 50, maxLength: 60 }),
        fc.string({ minLength: 150, maxLength: 160 }),
        localeArb,
        slugArb,
        (title, description, locale, slug) => {
          const meta = generatePageMetadata({
            title,
            description,
            locale,
            slug,
            baseUrl: 'https://afrexia.com',
          });
          expect(meta.twitter).toBeDefined();
          expect(meta.twitter.card).toMatch(/^summary/);
          expect(meta.twitter.title).toBeTruthy();
          expect(meta.twitter.description).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('every page metadata contains hreflang for all 5 locales + x-default', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 50, maxLength: 60 }),
        fc.string({ minLength: 150, maxLength: 160 }),
        localeArb,
        slugArb,
        (title, description, locale, slug) => {
          const meta = generatePageMetadata({
            title,
            description,
            locale,
            slug,
            baseUrl: 'https://afrexia.com',
          });
          const locales: Array<Locale | 'x-default'> = ['fr', 'en', 'es', 'de', 'ru', 'x-default'];
          locales.forEach((loc) => {
            expect(meta.hreflang[loc]).toBeTruthy();
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('x-default hreflang always points to French URL', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 50, maxLength: 60 }),
        fc.string({ minLength: 150, maxLength: 160 }),
        localeArb,
        slugArb,
        (title, description, locale, slug) => {
          const meta = generatePageMetadata({
            title,
            description,
            locale,
            slug,
            baseUrl: 'https://afrexia.com',
          });
          expect(meta.hreflang['x-default']).toContain('/fr/');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('canonical URL contains the correct locale and slug', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 50, maxLength: 60 }),
        fc.string({ minLength: 150, maxLength: 160 }),
        localeArb,
        slugArb,
        (title, description, locale, slug) => {
          const meta = generatePageMetadata({
            title,
            description,
            locale,
            slug,
            baseUrl: 'https://afrexia.com',
          });
          expect(meta.canonical).toContain(`/${locale}/`);
          expect(meta.canonical).toContain(slug);
        }
      ),
      { numRuns: 100 }
    );
  });
});
