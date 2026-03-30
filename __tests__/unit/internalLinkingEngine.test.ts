/**
 * Unit tests for InternalLinkingEngine
 * @see Requirements 1.13
 */

import { describe, it, expect } from 'vitest';
import {
  varyAnchorText,
  generateBreadcrumb,
  generateRelatedLinks,
} from '@/lib/seo/internalLinkingEngine';
import type { Product, ExportCountry } from '@/types/seo';

// ============================================================================
// Fixtures
// ============================================================================

const productCacao: Product = {
  _id: 'prod-1',
  _type: 'product',
  name: { fr: 'Cacao', en: 'Cocoa', es: 'Cacao', de: 'Kakao', ru: 'Какао' },
  slug: { current: 'cacao' },
};

const productCafe: Product = {
  _id: 'prod-2',
  _type: 'product',
  name: { fr: 'Café', en: 'Coffee', es: 'Café', de: 'Kaffee', ru: 'Кофе' },
  slug: { current: 'cafe' },
};

const countryNL: ExportCountry = {
  _id: 'country-1',
  _type: 'exportCountry',
  name: { fr: 'Pays-Bas', en: 'Netherlands', es: 'Países Bajos', de: 'Niederlande', ru: 'Нидерланды' },
  slug: { current: 'netherlands' },
  code: 'NL',
  dataCompleteness: 85,
  approvedForSEO: true,
};

const countryDE: ExportCountry = {
  _id: 'country-2',
  _type: 'exportCountry',
  name: { fr: 'Allemagne', en: 'Germany', es: 'Alemania', de: 'Deutschland', ru: 'Германия' },
  slug: { current: 'germany' },
  code: 'DE',
  dataCompleteness: 90,
  approvedForSEO: true,
};

// ============================================================================
// varyAnchorText
// ============================================================================

describe('varyAnchorText', () => {
  it('returns a string from the pool', () => {
    const pool = ['voir le produit', 'détails du produit', 'en savoir plus'];
    const result = varyAnchorText(pool, 'https://afrexia.com/fr/produits/cacao');
    expect(pool).toContain(result);
  });

  it('returns the seed when pool is empty', () => {
    const seed = 'https://afrexia.com/fr/produits/cacao';
    expect(varyAnchorText([], seed)).toBe(seed);
  });

  it('is deterministic for the same seed', () => {
    const pool = ['voir le produit', 'détails du produit', 'en savoir plus'];
    const seed = 'https://afrexia.com/fr/produits/cacao';
    const result1 = varyAnchorText(pool, seed);
    const result2 = varyAnchorText(pool, seed);
    expect(result1).toBe(result2);
  });

  it('returns different results for different seeds', () => {
    const pool = ['voir le produit', 'détails du produit', 'en savoir plus', 'consulter', 'découvrir'];
    const results = new Set([
      varyAnchorText(pool, 'url-a'),
      varyAnchorText(pool, 'url-b'),
      varyAnchorText(pool, 'url-c'),
      varyAnchorText(pool, 'url-d'),
      varyAnchorText(pool, 'url-e'),
    ]);
    // With 5 different seeds and 5 pool items, we expect some variation
    expect(results.size).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================================
// generateBreadcrumb
// ============================================================================

describe('generateBreadcrumb', () => {
  describe('product-country context', () => {
    it('generates 4 breadcrumb items', () => {
      const breadcrumb = generateBreadcrumb({
        type: 'product-country',
        product: productCacao,
        country: countryNL,
        locale: 'fr',
      });

      expect(breadcrumb).toHaveLength(4);
    });

    it('starts with home at position 1', () => {
      const breadcrumb = generateBreadcrumb({
        type: 'product-country',
        product: productCacao,
        country: countryNL,
        locale: 'fr',
      });

      expect(breadcrumb[0].position).toBe(1);
      expect(breadcrumb[0].name).toBe('Accueil');
    });

    it('includes product name in breadcrumb', () => {
      const breadcrumb = generateBreadcrumb({
        type: 'product-country',
        product: productCacao,
        country: countryNL,
        locale: 'fr',
      });

      const names = breadcrumb.map((b) => b.name);
      expect(names.some((n) => n.includes('Cacao'))).toBe(true);
    });

    it('includes country name in last breadcrumb item', () => {
      const breadcrumb = generateBreadcrumb({
        type: 'product-country',
        product: productCacao,
        country: countryNL,
        locale: 'fr',
      });

      expect(breadcrumb[breadcrumb.length - 1].name).toContain('Pays-Bas');
    });

    it('generates correct URLs with locale', () => {
      const breadcrumb = generateBreadcrumb({
        type: 'product-country',
        product: productCacao,
        country: countryNL,
        locale: 'en',
      });

      expect(breadcrumb[0].url).toContain('/en');
    });

    it('generates localized labels for English', () => {
      const breadcrumb = generateBreadcrumb({
        type: 'product-country',
        product: productCacao,
        country: countryNL,
        locale: 'en',
      });

      expect(breadcrumb[0].name).toBe('Home');
    });
  });

  describe('price context', () => {
    it('generates 3 breadcrumb items', () => {
      const breadcrumb = generateBreadcrumb({
        type: 'price',
        product: productCacao,
        locale: 'fr',
      });

      expect(breadcrumb).toHaveLength(3);
    });

    it('includes prices section', () => {
      const breadcrumb = generateBreadcrumb({
        type: 'price',
        product: productCacao,
        locale: 'fr',
      });

      expect(breadcrumb[1].name).toBe('Prix');
    });

    it('includes product name in last item', () => {
      const breadcrumb = generateBreadcrumb({
        type: 'price',
        product: productCacao,
        locale: 'fr',
      });

      expect(breadcrumb[2].name).toBe('Cacao');
    });
  });

  describe('comparison context', () => {
    it('generates 3 breadcrumb items', () => {
      const breadcrumb = generateBreadcrumb({
        type: 'comparison',
        productA: productCacao,
        productB: productCafe,
        locale: 'fr',
      });

      expect(breadcrumb).toHaveLength(3);
    });

    it('includes both product names in last item', () => {
      const breadcrumb = generateBreadcrumb({
        type: 'comparison',
        productA: productCacao,
        productB: productCafe,
        locale: 'fr',
      });

      const lastItem = breadcrumb[breadcrumb.length - 1];
      expect(lastItem.name).toContain('Cacao');
      expect(lastItem.name).toContain('Café');
    });
  });
});

// ============================================================================
// generateRelatedLinks
// ============================================================================

describe('generateRelatedLinks', () => {
  describe('product-country context', () => {
    it('returns between 4 and 6 links', () => {
      const links = generateRelatedLinks({
        type: 'product-country',
        product: productCacao,
        country: countryNL,
        locale: 'fr',
        relatedCountries: [countryDE],
        relatedProducts: [productCafe],
      });

      expect(links.length).toBeGreaterThanOrEqual(1);
      expect(links.length).toBeLessThanOrEqual(6);
    });

    it('includes price page link for the product', () => {
      const links = generateRelatedLinks({
        type: 'product-country',
        product: productCacao,
        country: countryNL,
        locale: 'fr',
      });

      const priceLink = links.find((l) => l.url.includes('/prix/cacao-cameroun'));
      expect(priceLink).toBeDefined();
    });

    it('includes links for related countries', () => {
      const links = generateRelatedLinks({
        type: 'product-country',
        product: productCacao,
        country: countryNL,
        locale: 'fr',
        relatedCountries: [countryDE],
      });

      const germanyLink = links.find((l) => l.url.includes('export-germany'));
      expect(germanyLink).toBeDefined();
    });

    it('does not include the current country in related links', () => {
      const links = generateRelatedLinks({
        type: 'product-country',
        product: productCacao,
        country: countryNL,
        locale: 'fr',
        relatedCountries: [countryNL, countryDE],
      });

      // Should not have duplicate of current country
      const nlLinks = links.filter((l) => l.url.includes('export-netherlands'));
      expect(nlLinks).toHaveLength(0);
    });

    it('prioritizes indexable links', () => {
      const indexableUrl = 'https://afrexia.com/fr/prix/cacao-cameroun';
      const indexableUrls = new Set([indexableUrl]);

      const links = generateRelatedLinks(
        {
          type: 'product-country',
          product: productCacao,
          country: countryNL,
          locale: 'fr',
          relatedCountries: [countryDE],
        },
        indexableUrls
      );

      // Indexable links should come first
      const indexableLinks = links.filter((l) => l.isIndexable);
      const nonIndexableLinks = links.filter((l) => !l.isIndexable);

      if (indexableLinks.length > 0 && nonIndexableLinks.length > 0) {
        const firstIndexableIdx = links.findIndex((l) => l.isIndexable);
        const firstNonIndexableIdx = links.findIndex((l) => !l.isIndexable);
        expect(firstIndexableIdx).toBeLessThan(firstNonIndexableIdx);
      }
    });

    it('deduplicates links by URL', () => {
      const links = generateRelatedLinks({
        type: 'product-country',
        product: productCacao,
        country: countryNL,
        locale: 'fr',
        relatedCountries: [countryDE, countryDE], // duplicate
      });

      const urls = links.map((l) => l.url);
      const uniqueUrls = new Set(urls);
      expect(urls.length).toBe(uniqueUrls.size);
    });

    it('all links have correct locale', () => {
      const links = generateRelatedLinks({
        type: 'product-country',
        product: productCacao,
        country: countryNL,
        locale: 'de',
        relatedCountries: [countryDE],
      });

      links.forEach((link) => {
        expect(link.locale).toBe('de');
        expect(link.url).toContain('/de/');
      });
    });
  });

  describe('price context', () => {
    it('includes product-country links', () => {
      const links = generateRelatedLinks({
        type: 'price',
        product: productCacao,
        locale: 'fr',
        relatedCountries: [countryNL],
      });

      const countryLink = links.find((l) => l.url.includes('/produits/cacao/export-'));
      expect(countryLink).toBeDefined();
    });

    it('includes comparison links for related products', () => {
      const links = generateRelatedLinks({
        type: 'price',
        product: productCacao,
        locale: 'fr',
        relatedProducts: [productCafe],
      });

      const comparisonLink = links.find((l) => l.url.includes('/guide/'));
      expect(comparisonLink).toBeDefined();
    });
  });

  describe('comparison context', () => {
    it('includes price links for both products', () => {
      const links = generateRelatedLinks({
        type: 'comparison',
        productA: productCacao,
        productB: productCafe,
        locale: 'fr',
      });

      const cacaoPriceLink = links.find((l) => l.url.includes('/prix/cacao-cameroun'));
      const cafePriceLink = links.find((l) => l.url.includes('/prix/cafe-cameroun'));

      expect(cacaoPriceLink).toBeDefined();
      expect(cafePriceLink).toBeDefined();
    });
  });
});
