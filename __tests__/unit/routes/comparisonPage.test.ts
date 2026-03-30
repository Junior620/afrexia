/**
 * Unit tests for Comparison/Guide route utilities
 * @see Requirements 1.5
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseComparisonSlug } from '@/app/[locale]/guide/[comparison-type]/page';
import { generateBreadcrumb } from '@/lib/seo/internalLinkingEngine';
import { generatePageMetadata } from '@/lib/seo/metadataGenerator';
import type { Product } from '@/types/seo';

// ============================================================================
// Mock data
// ============================================================================

const mockProductA: Product = {
  _id: 'prod-cacao',
  _type: 'product',
  name: { fr: 'Cacao', en: 'Cocoa', es: 'Cacao', de: 'Kakao', ru: 'Какао' },
  slug: { current: 'cacao' },
};

const mockProductB: Product = {
  _id: 'prod-cafe',
  _type: 'product',
  name: { fr: 'Café', en: 'Coffee', es: 'Café', de: 'Kaffee', ru: 'Кофе' },
  slug: { current: 'cafe' },
};

// ============================================================================
// parseComparisonSlug
// ============================================================================

describe('parseComparisonSlug', () => {
  it('parses product-vs-product pattern', () => {
    const result = parseComparisonSlug('cacao-vs-cafe');
    expect(result).not.toBeNull();
    expect(result?.type).toBe('product-vs-product');
    expect(result?.slugA).toBe('cacao');
    expect(result?.slugB).toBe('cafe');
  });

  it('parses multi-word product slugs', () => {
    const result = parseComparisonSlug('cacao-cameroun-vs-cafe-arabica');
    expect(result).not.toBeNull();
    expect(result?.slugA).toBe('cacao-cameroun');
    expect(result?.slugB).toBe('cafe-arabica');
  });

  it('returns null when no -vs- separator', () => {
    expect(parseComparisonSlug('cacao-cafe')).toBeNull();
    expect(parseComparisonSlug('cacao')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(parseComparisonSlug('')).toBeNull();
  });

  it('returns null when left side is empty', () => {
    expect(parseComparisonSlug('-vs-cafe')).toBeNull();
  });

  it('returns null when right side is empty', () => {
    expect(parseComparisonSlug('cacao-vs-')).toBeNull();
  });

  it('parses origin-vs-origin pattern', () => {
    // "cacao-cameroun-vs-ghana" → product=cacao, originA=cameroun, originB=ghana
    const result = parseComparisonSlug('cacao-cameroun-vs-ghana');
    expect(result).not.toBeNull();
    // Right side has no dash → origin pattern
    expect(result?.type).toBe('origin-vs-origin');
    expect(result?.productSlug).toBe('cacao');
    expect(result?.originA).toBe('cameroun');
    expect(result?.originB).toBe('ghana');
  });

  it('handles complex product slugs in product-vs-product', () => {
    const result = parseComparisonSlug('cafe-arabica-vs-cafe-robusta');
    expect(result).not.toBeNull();
    expect(result?.type).toBe('product-vs-product');
    expect(result?.slugA).toBe('cafe-arabica');
    expect(result?.slugB).toBe('cafe-robusta');
  });
});

// ============================================================================
// Comparison page breadcrumb
// ============================================================================

describe('Comparison page breadcrumb', () => {
  it('generates 3 breadcrumb items', () => {
    const breadcrumb = generateBreadcrumb({
      type: 'comparison',
      productA: mockProductA,
      productB: mockProductB,
      locale: 'fr',
    });

    expect(breadcrumb).toHaveLength(3);
  });

  it('starts with home', () => {
    const breadcrumb = generateBreadcrumb({
      type: 'comparison',
      productA: mockProductA,
      productB: mockProductB,
      locale: 'fr',
    });

    expect(breadcrumb[0].name).toBe('Accueil');
  });

  it('includes guides section', () => {
    const breadcrumb = generateBreadcrumb({
      type: 'comparison',
      productA: mockProductA,
      productB: mockProductB,
      locale: 'fr',
    });

    expect(breadcrumb[1].name).toBe('Guides');
  });

  it('includes both product names in last item', () => {
    const breadcrumb = generateBreadcrumb({
      type: 'comparison',
      productA: mockProductA,
      productB: mockProductB,
      locale: 'fr',
    });

    const lastItem = breadcrumb[breadcrumb.length - 1];
    expect(lastItem.name).toContain('Cacao');
    expect(lastItem.name).toContain('Café');
  });

  it('generates correct URL for comparison page', () => {
    const breadcrumb = generateBreadcrumb({
      type: 'comparison',
      productA: mockProductA,
      productB: mockProductB,
      locale: 'fr',
    });

    const lastItem = breadcrumb[breadcrumb.length - 1];
    expect(lastItem.url).toContain('/guide/');
    expect(lastItem.url).toContain('cacao-vs-cafe');
  });
});

// ============================================================================
// Comparison page metadata
// ============================================================================

describe('Comparison page metadata', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('generates metadata with both product names', () => {
    const meta = generatePageMetadata({
      title: 'Cacao vs Café : Comparaison complète | Afrexia Export',
      description: 'Comparez cacao et café camerounais : prix, qualité, certifications, disponibilité et recommandations d\'usage. Guide complet par Afrexia pour choisir la meilleure matière première.',
      locale: 'fr',
      slug: 'guide/cacao-vs-cafe',
      baseUrl: 'https://afrexia.com',
    });

    expect(meta.canonical).toContain('/fr/guide/cacao-vs-cafe');
  });

  it('generates hreflang for all locales', () => {
    const meta = generatePageMetadata({
      title: 'Cacao vs Café : Comparaison complète | Afrexia Export',
      description: 'Comparez cacao et café camerounais : prix, qualité, certifications, disponibilité et recommandations d\'usage. Guide complet par Afrexia pour choisir la meilleure matière première.',
      locale: 'fr',
      slug: 'guide/cacao-vs-cafe',
      baseUrl: 'https://afrexia.com',
    });

    expect(Object.keys(meta.hreflang)).toHaveLength(6);
  });
});

// ============================================================================
// ISR configuration
// ============================================================================

describe('Comparison page ISR configuration', () => {
  it('has revalidate set to 604800 (7 days)', async () => {
    const { revalidate } = await import('@/app/[locale]/guide/[comparison-type]/page');
    expect(revalidate).toBe(604800);
  });
});
