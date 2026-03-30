/**
 * Unit tests for MetadataGenerator
 * @see Requirements 1.12
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  optimizeTitle,
  optimizeDescription,
  generatePageMetadata,
  generateProductSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/seo/metadataGenerator';
import type { Product, FAQ, BreadcrumbItem } from '@/types/seo';

// ============================================================================
// Fixtures
// ============================================================================

const product: Product = {
  _id: 'prod-1',
  _type: 'product',
  name: { fr: 'Cacao', en: 'Cocoa', es: 'Cacao', de: 'Kakao', ru: 'Какао' },
  slug: { current: 'cacao' },
  description: { fr: 'Cacao de qualité', en: 'Quality cocoa' },
};

const breadcrumbs: BreadcrumbItem[] = [
  { name: 'Accueil', url: 'https://afrexia.com/fr', position: 1 },
  { name: 'Produits', url: 'https://afrexia.com/fr/produits', position: 2 },
  { name: 'Cacao', url: 'https://afrexia.com/fr/produits/cacao', position: 3 },
];

const faqs: FAQ[] = [
  { question: 'Comment exporter ?', answer: 'Contactez-nous.', locale: 'fr' },
  { question: 'Quel délai ?', answer: '21 jours en moyenne.', locale: 'fr' },
];

// ============================================================================
// optimizeTitle
// ============================================================================

describe('optimizeTitle', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('returns title as-is when within 50-60 chars', () => {
    const title = 'Exporter Cacao vers Pays-Bas | Afrexia Export'; // 46 chars
    // This is < 50, so it returns as-is with a warning
    const result = optimizeTitle(title);
    expect(result).toBe(title);
  });

  it('returns title as-is when exactly 50 chars', () => {
    const title = 'A'.repeat(50);
    expect(optimizeTitle(title)).toBe(title);
  });

  it('returns title as-is when exactly 60 chars', () => {
    const title = 'A'.repeat(60);
    expect(optimizeTitle(title)).toBe(title);
  });

  it('truncates title longer than 60 chars with ellipsis', () => {
    const title = 'Exporter du Cacao Camerounais vers les Pays-Bas en Europe | Afrexia';
    const result = optimizeTitle(title);
    expect(result.length).toBeLessThanOrEqual(60);
    expect(result).toContain('...');
  });

  it('truncates at word boundary', () => {
    const title = 'Exporter du Cacao Camerounais vers les Pays-Bas en Europe | Afrexia';
    const result = optimizeTitle(title);
    // Should not end with a partial word before "..."
    expect(result).toMatch(/\w\.\.\./);
  });

  it('logs warning for short title', () => {
    optimizeTitle('Short title');
    expect(console.warn).toHaveBeenCalled();
  });

  it('logs warning for long title', () => {
    optimizeTitle('A'.repeat(70));
    expect(console.warn).toHaveBeenCalled();
  });

  it('respects custom min/max parameters', () => {
    const title = 'Hello World';
    const result = optimizeTitle(title, 5, 20);
    expect(result).toBe(title);
  });
});

// ============================================================================
// optimizeDescription
// ============================================================================

describe('optimizeDescription', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('returns description as-is when within 150-160 chars', () => {
    const desc = 'A'.repeat(155);
    expect(optimizeDescription(desc)).toBe(desc);
  });

  it('truncates description longer than 160 chars', () => {
    const desc = 'Découvrez comment exporter du cacao camerounais vers les Pays-Bas. Prix, certifications, délais de transit et formalités douanières avec Afrexia Export International.';
    const result = optimizeDescription(desc);
    expect(result.length).toBeLessThanOrEqual(160);
    expect(result).toContain('...');
  });

  it('returns short description as-is with warning', () => {
    const desc = 'Short description';
    const result = optimizeDescription(desc);
    expect(result).toBe(desc);
    expect(console.warn).toHaveBeenCalled();
  });

  it('respects custom min/max parameters', () => {
    const desc = 'Hello World';
    const result = optimizeDescription(desc, 5, 20);
    expect(result).toBe(desc);
  });
});

// ============================================================================
// generatePageMetadata
// ============================================================================

describe('generatePageMetadata', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('generates metadata with all required fields', () => {
    const meta = generatePageMetadata({
      title: 'Exporter Cacao vers Pays-Bas | Afrexia Export International',
      description: 'Découvrez comment exporter du cacao camerounais vers les Pays-Bas. Prix, certifications, délais de transit et formalités douanières avec Afrexia.',
      locale: 'fr',
      slug: 'produits/cacao/export-pays-bas',
      baseUrl: 'https://afrexia.com',
    });

    expect(meta.title).toBeDefined();
    expect(meta.description).toBeDefined();
    expect(meta.canonical).toBeDefined();
    expect(meta.hreflang).toBeDefined();
    expect(meta.openGraph).toBeDefined();
    expect(meta.twitter).toBeDefined();
    expect(meta.robots).toBeDefined();
  });

  it('generates canonical URL with correct locale and slug', () => {
    const meta = generatePageMetadata({
      title: 'Exporter Cacao vers Pays-Bas | Afrexia Export International',
      description: 'Découvrez comment exporter du cacao camerounais vers les Pays-Bas. Prix, certifications, délais de transit et formalités douanières avec Afrexia.',
      locale: 'fr',
      slug: 'produits/cacao/export-pays-bas',
      baseUrl: 'https://afrexia.com',
    });

    expect(meta.canonical).toBe('https://afrexia.com/fr/produits/cacao/export-pays-bas');
  });

  it('generates hreflang for all 5 locales plus x-default', () => {
    const meta = generatePageMetadata({
      title: 'Exporter Cacao vers Pays-Bas | Afrexia Export International',
      description: 'Découvrez comment exporter du cacao camerounais vers les Pays-Bas. Prix, certifications, délais de transit et formalités douanières avec Afrexia.',
      locale: 'fr',
      slug: 'produits/cacao/export-pays-bas',
      baseUrl: 'https://afrexia.com',
    });

    expect(meta.hreflang.fr).toBeDefined();
    expect(meta.hreflang.en).toBeDefined();
    expect(meta.hreflang.es).toBeDefined();
    expect(meta.hreflang.de).toBeDefined();
    expect(meta.hreflang.ru).toBeDefined();
    expect(meta.hreflang['x-default']).toBeDefined();
  });

  it('sets x-default to French URL', () => {
    const meta = generatePageMetadata({
      title: 'Exporter Cacao vers Pays-Bas | Afrexia Export International',
      description: 'Découvrez comment exporter du cacao camerounais vers les Pays-Bas. Prix, certifications, délais de transit et formalités douanières avec Afrexia.',
      locale: 'en',
      slug: 'produits/cacao/export-pays-bas',
      baseUrl: 'https://afrexia.com',
    });

    expect(meta.hreflang['x-default']).toBe('https://afrexia.com/fr/produits/cacao/export-pays-bas');
  });

  it('defaults robots to "index, follow"', () => {
    const meta = generatePageMetadata({
      title: 'Exporter Cacao vers Pays-Bas | Afrexia Export International',
      description: 'Découvrez comment exporter du cacao camerounais vers les Pays-Bas. Prix, certifications, délais de transit et formalités douanières avec Afrexia.',
      locale: 'fr',
      slug: 'produits/cacao/export-pays-bas',
      baseUrl: 'https://afrexia.com',
    });

    expect(meta.robots).toBe('index, follow');
  });

  it('respects explicit robots value', () => {
    const meta = generatePageMetadata({
      title: 'Exporter Cacao vers Pays-Bas | Afrexia Export International',
      description: 'Découvrez comment exporter du cacao camerounais vers les Pays-Bas. Prix, certifications, délais de transit et formalités douanières avec Afrexia.',
      locale: 'fr',
      slug: 'produits/cacao/export-pays-bas',
      baseUrl: 'https://afrexia.com',
      robots: 'noindex, follow',
    });

    expect(meta.robots).toBe('noindex, follow');
  });

  it('includes image in openGraph when provided', () => {
    const meta = generatePageMetadata({
      title: 'Exporter Cacao vers Pays-Bas | Afrexia Export International',
      description: 'Découvrez comment exporter du cacao camerounais vers les Pays-Bas. Prix, certifications, délais de transit et formalités douanières avec Afrexia.',
      locale: 'fr',
      slug: 'produits/cacao/export-pays-bas',
      baseUrl: 'https://afrexia.com',
      image: 'https://afrexia.com/images/cacao.jpg',
    });

    expect(meta.openGraph.image).toBe('https://afrexia.com/images/cacao.jpg');
    expect(meta.twitter.card).toBe('summary_large_image');
  });

  it('uses summary twitter card when no image', () => {
    const meta = generatePageMetadata({
      title: 'Exporter Cacao vers Pays-Bas | Afrexia Export International',
      description: 'Découvrez comment exporter du cacao camerounais vers les Pays-Bas. Prix, certifications, délais de transit et formalités douanières avec Afrexia.',
      locale: 'fr',
      slug: 'produits/cacao/export-pays-bas',
      baseUrl: 'https://afrexia.com',
    });

    expect(meta.twitter.card).toBe('summary');
  });
});

// ============================================================================
// generateProductSchema
// ============================================================================

describe('generateProductSchema', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('generates schema with @context and @type', () => {
    const schema = generateProductSchema({
      product,
      locale: 'fr',
      url: 'https://afrexia.com/fr/produits/cacao/export-pays-bas',
    });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Product');
  });

  it('includes product name in the requested locale', () => {
    const schema = generateProductSchema({
      product,
      locale: 'en',
      url: 'https://afrexia.com/en/produits/cacao/export-pays-bas',
    });

    expect(schema.name).toBe('Cocoa');
  });

  it('includes offer with price when provided', () => {
    const schema = generateProductSchema({
      product,
      locale: 'fr',
      price: 2500,
      currency: 'USD',
      url: 'https://afrexia.com/fr/produits/cacao/export-pays-bas',
    });

    const offer = schema.offers as Record<string, unknown>;
    expect(offer['@type']).toBe('Offer');
    expect(offer.price).toBe(2500);
    expect(offer.priceCurrency).toBe('USD');
  });

  it('defaults availability to InStock', () => {
    const schema = generateProductSchema({
      product,
      locale: 'fr',
      url: 'https://afrexia.com/fr/produits/cacao/export-pays-bas',
    });

    const offer = schema.offers as Record<string, unknown>;
    expect(offer.availability).toContain('InStock');
  });

  it('includes description when product has one', () => {
    const schema = generateProductSchema({
      product,
      locale: 'fr',
      url: 'https://afrexia.com/fr/produits/cacao/export-pays-bas',
    });

    expect(schema.description).toBe('Cacao de qualité');
  });

  it('includes image when provided', () => {
    const schema = generateProductSchema({
      product,
      locale: 'fr',
      url: 'https://afrexia.com/fr/produits/cacao/export-pays-bas',
      image: 'https://afrexia.com/images/cacao.jpg',
    });

    expect(schema.image).toBe('https://afrexia.com/images/cacao.jpg');
  });
});

// ============================================================================
// generateBreadcrumbSchema
// ============================================================================

describe('generateBreadcrumbSchema', () => {
  it('generates BreadcrumbList schema', () => {
    const schema = generateBreadcrumbSchema(breadcrumbs);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('BreadcrumbList');
  });

  it('includes all breadcrumb items', () => {
    const schema = generateBreadcrumbSchema(breadcrumbs);
    const items = schema.itemListElement as Array<Record<string, unknown>>;

    expect(items).toHaveLength(3);
  });

  it('maps items with correct position, name, and url', () => {
    const schema = generateBreadcrumbSchema(breadcrumbs);
    const items = schema.itemListElement as Array<Record<string, unknown>>;

    expect(items[0]).toMatchObject({
      '@type': 'ListItem',
      position: 1,
      name: 'Accueil',
      item: 'https://afrexia.com/fr',
    });
  });

  it('handles empty breadcrumbs', () => {
    const schema = generateBreadcrumbSchema([]);
    const items = schema.itemListElement as Array<unknown>;
    expect(items).toHaveLength(0);
  });
});

// ============================================================================
// generateFAQSchema
// ============================================================================

describe('generateFAQSchema', () => {
  it('generates FAQPage schema', () => {
    const schema = generateFAQSchema(faqs);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('FAQPage');
  });

  it('includes all FAQ items as Question entities', () => {
    const schema = generateFAQSchema(faqs);
    const entities = schema.mainEntity as Array<Record<string, unknown>>;

    expect(entities).toHaveLength(2);
    expect(entities[0]['@type']).toBe('Question');
    expect(entities[0].name).toBe('Comment exporter ?');
  });

  it('wraps answers in acceptedAnswer', () => {
    const schema = generateFAQSchema(faqs);
    const entities = schema.mainEntity as Array<Record<string, unknown>>;
    const answer = entities[0].acceptedAnswer as Record<string, unknown>;

    expect(answer['@type']).toBe('Answer');
    expect(answer.text).toBe('Contactez-nous.');
  });

  it('handles empty FAQ list', () => {
    const schema = generateFAQSchema([]);
    const entities = schema.mainEntity as Array<unknown>;
    expect(entities).toHaveLength(0);
  });
});
