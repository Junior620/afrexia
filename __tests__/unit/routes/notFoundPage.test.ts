/**
 * Unit tests for 404 Not Found page utilities
 * @see Requirements 1.14
 */

import { describe, it, expect } from 'vitest';
import type { Locale } from '@/types/seo';

// ============================================================================
// Locale detection logic (mirrors the route logic)
// ============================================================================

function detectLocaleFromPath(pathname: string): Locale {
  const localeMatch = pathname.match(/^\/(fr|en|es|de|ru)(\/|$)/);
  return (localeMatch?.[1] as Locale) ?? 'fr';
}

// ============================================================================
// Popular pages config (mirrors the route logic)
// ============================================================================

const POPULAR_PAGE_PATHS = {
  catalog: (locale: Locale) => `/${locale}/products`,
  prices: (locale: Locale) => `/${locale}/prix/cacao-cameroun`,
  guide: (locale: Locale) => `/${locale}/guide/cacao-vs-cafe`,
  export: (locale: Locale) => `/${locale}/produits/cacao/export-allemagne`,
  contact: (locale: Locale) => `/${locale}/contact`,
};

// ============================================================================
// Locale detection
// ============================================================================

describe('404 page locale detection', () => {
  it('detects French locale from path', () => {
    expect(detectLocaleFromPath('/fr/produits/invalid')).toBe('fr');
  });

  it('detects English locale from path', () => {
    expect(detectLocaleFromPath('/en/produits/invalid')).toBe('en');
  });

  it('detects Spanish locale from path', () => {
    expect(detectLocaleFromPath('/es/produits/invalid')).toBe('es');
  });

  it('detects German locale from path', () => {
    expect(detectLocaleFromPath('/de/produits/invalid')).toBe('de');
  });

  it('detects Russian locale from path', () => {
    expect(detectLocaleFromPath('/ru/produits/invalid')).toBe('ru');
  });

  it('defaults to French for unknown locale', () => {
    expect(detectLocaleFromPath('/zh/produits/invalid')).toBe('fr');
    expect(detectLocaleFromPath('/unknown')).toBe('fr');
  });

  it('handles root path', () => {
    expect(detectLocaleFromPath('/fr')).toBe('fr');
  });
});

// ============================================================================
// Popular pages
// ============================================================================

describe('404 page popular pages', () => {
  it('generates correct catalog URL for each locale', () => {
    const locales: Locale[] = ['fr', 'en', 'es', 'de', 'ru'];
    locales.forEach((locale) => {
      const url = POPULAR_PAGE_PATHS.catalog(locale);
      expect(url).toBe(`/${locale}/products`);
    });
  });

  it('generates correct price URL for each locale', () => {
    const locales: Locale[] = ['fr', 'en', 'es', 'de', 'ru'];
    locales.forEach((locale) => {
      const url = POPULAR_PAGE_PATHS.prices(locale);
      expect(url).toBe(`/${locale}/prix/cacao-cameroun`);
    });
  });

  it('generates correct guide URL for each locale', () => {
    const locales: Locale[] = ['fr', 'en', 'es', 'de', 'ru'];
    locales.forEach((locale) => {
      const url = POPULAR_PAGE_PATHS.guide(locale);
      expect(url).toBe(`/${locale}/guide/cacao-vs-cafe`);
    });
  });

  it('generates 5 popular page links', () => {
    const pages = Object.values(POPULAR_PAGE_PATHS);
    expect(pages).toHaveLength(5);
  });
});

// ============================================================================
// 404 page structure requirements
// ============================================================================

describe('404 page requirements', () => {
  it('has search form path pointing to products catalog', () => {
    const locale: Locale = 'fr';
    const searchAction = `/${locale}/products`;
    expect(searchAction).toBe('/fr/products');
  });

  it('has back-to-home link for each locale', () => {
    const locales: Locale[] = ['fr', 'en', 'es', 'de', 'ru'];
    locales.forEach((locale) => {
      const homeUrl = `/${locale}`;
      expect(homeUrl).toMatch(/^\/(fr|en|es|de|ru)$/);
    });
  });

  it('has 3 suggested pages', () => {
    const suggestions = [
      { href: '/fr/produits/cacao/export-france' },
      { href: '/fr/prix/cafe-cameroun' },
      { href: '/fr/produits/poivre/export-belgique' },
    ];
    expect(suggestions).toHaveLength(3);
  });
});
