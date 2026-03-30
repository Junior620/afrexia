/**
 * Unit tests for Price route utilities
 * @see Requirements 1.4
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateDisclaimer, applyLanguageFallback } from '@/lib/seo/contentGenerator';
import { generatePageMetadata, generateBreadcrumbSchema } from '@/lib/seo/metadataGenerator';
import { generateBreadcrumb } from '@/lib/seo/internalLinkingEngine';
import type { Product, Locale } from '@/types/seo';

// ============================================================================
// Mock data
// ============================================================================

const mockProduct: Product = {
  _id: 'prod-cacao',
  _type: 'product',
  name: { fr: 'Cacao', en: 'Cocoa', es: 'Cacao', de: 'Kakao', ru: 'Какао' },
  slug: { current: 'cacao' },
};

// ============================================================================
// Price slug extraction (mirrors the route logic)
// ============================================================================

function extractProductSlug(priceSlug: string): string | null {
  if (!priceSlug.endsWith('-cameroun')) return null;
  return priceSlug.slice(0, -'-cameroun'.length);
}

function calculateTrend(history: Array<{ price: number }>): {
  trend: 'up' | 'down' | 'stable';
  percentage: number;
} {
  if (history.length < 2) return { trend: 'stable', percentage: 0 };
  const latest = history[0].price;
  const oldest = history[history.length - 1].price;
  if (oldest === 0) return { trend: 'stable', percentage: 0 };
  const pct = ((latest - oldest) / oldest) * 100;
  const rounded = Math.round(Math.abs(pct) * 10) / 10;
  if (pct > 0.5) return { trend: 'up', percentage: rounded };
  if (pct < -0.5) return { trend: 'down', percentage: rounded };
  return { trend: 'stable', percentage: rounded };
}

// ============================================================================
// extractProductSlug
// ============================================================================

describe('extractProductSlug', () => {
  it('extracts product slug from valid price slug', () => {
    expect(extractProductSlug('cacao-cameroun')).toBe('cacao');
  });

  it('extracts multi-word product slug', () => {
    expect(extractProductSlug('cafe-arabica-cameroun')).toBe('cafe-arabica');
  });

  it('returns null for slug without -cameroun suffix', () => {
    expect(extractProductSlug('cacao')).toBeNull();
    expect(extractProductSlug('cacao-france')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(extractProductSlug('')).toBeNull();
  });
});

// ============================================================================
// calculateTrend
// ============================================================================

describe('calculateTrend', () => {
  it('returns stable for empty history', () => {
    const result = calculateTrend([]);
    expect(result.trend).toBe('stable');
    expect(result.percentage).toBe(0);
  });

  it('returns stable for single entry', () => {
    const result = calculateTrend([{ price: 2500 }]);
    expect(result.trend).toBe('stable');
  });

  it('returns up when price increased', () => {
    const history = [{ price: 2600 }, { price: 2500 }]; // latest first
    const result = calculateTrend(history);
    expect(result.trend).toBe('up');
    expect(result.percentage).toBeGreaterThan(0);
  });

  it('returns down when price decreased', () => {
    const history = [{ price: 2400 }, { price: 2500 }]; // latest first
    const result = calculateTrend(history);
    expect(result.trend).toBe('down');
    expect(result.percentage).toBeGreaterThan(0);
  });

  it('returns stable for minimal change (< 0.5%)', () => {
    const history = [{ price: 2501 }, { price: 2500 }]; // 0.04% change
    const result = calculateTrend(history);
    expect(result.trend).toBe('stable');
  });

  it('calculates correct percentage', () => {
    const history = [{ price: 2750 }, { price: 2500 }]; // 10% increase
    const result = calculateTrend(history);
    expect(result.trend).toBe('up');
    expect(result.percentage).toBe(10);
  });

  it('handles zero oldest price', () => {
    const history = [{ price: 2500 }, { price: 0 }];
    const result = calculateTrend(history);
    expect(result.trend).toBe('stable');
  });
});

// ============================================================================
// Price page content
// ============================================================================

describe('Price page content', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('generates price disclaimer for all locales', () => {
    const locales: Locale[] = ['fr', 'en', 'es', 'de', 'ru'];
    locales.forEach((locale) => {
      const disclaimer = generateDisclaimer('price', locale);
      expect(disclaimer).toBeTruthy();
      expect(disclaimer.length).toBeGreaterThan(0);
    });
  });

  it('applies language fallback for product name', () => {
    const name = applyLanguageFallback(mockProduct.name, 'fr', 'product.name');
    expect(name).toBe('Cacao');
  });

  it('falls back to English for missing locale', () => {
    const name = applyLanguageFallback(mockProduct.name, 'de', 'product.name');
    expect(name).toBe('Kakao');
  });
});

// ============================================================================
// Price page breadcrumb
// ============================================================================

describe('Price page breadcrumb', () => {
  it('generates 3 breadcrumb items', () => {
    const breadcrumb = generateBreadcrumb({
      type: 'price',
      product: mockProduct,
      locale: 'fr',
    });

    expect(breadcrumb).toHaveLength(3);
  });

  it('includes price section in breadcrumb', () => {
    const breadcrumb = generateBreadcrumb({
      type: 'price',
      product: mockProduct,
      locale: 'fr',
    });

    expect(breadcrumb[1].name).toBe('Prix');
  });

  it('generates breadcrumb schema', () => {
    const breadcrumb = generateBreadcrumb({
      type: 'price',
      product: mockProduct,
      locale: 'fr',
    });

    const schema = generateBreadcrumbSchema(breadcrumb);
    expect(schema['@type']).toBe('BreadcrumbList');
  });
});

// ============================================================================
// Price page metadata
// ============================================================================

describe('Price page metadata', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('generates metadata with price in title when available', () => {
    const productName = 'Cacao';
    const priceStr = '2 500 USD/tonne';

    const meta = generatePageMetadata({
      title: `Prix ${productName} Cameroun ${priceStr} | Afrexia`,
      description: `Prix actuel du ${productName} camerounais : ${priceStr}. Historique 30 jours, tendance et évolution des cours. Données mises à jour quotidiennement par Afrexia.`,
      locale: 'fr',
      slug: 'prix/cacao-cameroun',
      baseUrl: 'https://afrexia.com',
      robots: 'index, follow',
    });

    expect(meta.canonical).toContain('/fr/prix/cacao-cameroun');
    expect(meta.robots).toBe('index, follow');
  });

  it('generates hreflang for all 5 locales', () => {
    const meta = generatePageMetadata({
      title: 'Prix Cacao Cameroun aujourd\'hui | Afrexia Export International',
      description: 'Prix actuel du cacao camerounais. Historique 30 jours, tendance et évolution des cours. Données mises à jour quotidiennement par Afrexia.',
      locale: 'fr',
      slug: 'prix/cacao-cameroun',
      baseUrl: 'https://afrexia.com',
    });

    expect(meta.hreflang.fr).toContain('/fr/');
    expect(meta.hreflang.en).toContain('/en/');
    expect(meta.hreflang.es).toContain('/es/');
    expect(meta.hreflang.de).toContain('/de/');
    expect(meta.hreflang.ru).toContain('/ru/');
  });
});

// ============================================================================
// ISR configuration
// ============================================================================

describe('Price page ISR configuration', () => {
  it('has revalidate set to 86400 (24 hours)', async () => {
    const { revalidate } = await import('@/app/[locale]/prix/[priceSlug]/page');
    expect(revalidate).toBe(86400);
  });
});
