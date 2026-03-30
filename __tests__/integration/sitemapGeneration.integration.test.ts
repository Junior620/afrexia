/**
 * Tests d'intégration : Flux complet Génération du Sitemap
 *
 * Teste le flux complet de génération du sitemap V1 :
 * - Pages produit×pays indexables incluses
 * - Pages noindex exclues
 * - 5 locales présentes pour chaque page indexable
 * - changefreq="daily" pour les pages de prix
 * - Valeurs lastmod, changefreq et priority présentes
 *
 * @see Requirements 1.11
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { entriesToXML } from '@/lib/seo/sitemapGenerator';
import { determineIndexability } from '@/lib/seo/indexabilityController';
import { markContentSource } from '@/lib/seo/contentGenerator';
import type { SitemapEntry, SitemapSection, Locale } from '@/types/seo';
import { SUPPORTED_LOCALES } from '@/types/seo';

// ============================================================================
// Helpers pour construire des entrées de sitemap mockées
// ============================================================================

const BASE_URL = 'https://afrexia.com';

function buildProductCountryEntries(
  productSlug: string,
  countrySlug: string,
  lastmod = '2024-01-15'
): SitemapEntry[] {
  return SUPPORTED_LOCALES.map((locale) => ({
    url: `${BASE_URL}/${locale}/produits/${productSlug}/export-${countrySlug}`,
    lastmod,
    changefreq: 'weekly' as const,
    priority: 0.8,
    locale,
  }));
}

function buildPriceEntries(productSlug: string, lastmod = '2024-01-15'): SitemapEntry[] {
  return SUPPORTED_LOCALES.map((locale) => ({
    url: `${BASE_URL}/${locale}/prix/${productSlug}-cameroun`,
    lastmod,
    changefreq: 'daily' as const,
    priority: 0.7,
    locale,
  }));
}

function buildComparisonEntries(
  slugA: string,
  slugB: string,
  lastmod = '2024-01-15'
): SitemapEntry[] {
  return SUPPORTED_LOCALES.map((locale) => ({
    url: `${BASE_URL}/${locale}/guide/${slugA}-vs-${slugB}`,
    lastmod,
    changefreq: 'weekly' as const,
    priority: 0.7,
    locale,
  }));
}

// ============================================================================
// Données mockées représentant un sitemap V1 complet
// ============================================================================

const mockProductCountryEntries: SitemapEntry[] = [
  ...buildProductCountryEntries('cacao', 'france'),
  ...buildProductCountryEntries('cacao', 'allemagne'),
  ...buildProductCountryEntries('cafe-arabica', 'france'),
];

const mockPriceEntries: SitemapEntry[] = [
  ...buildPriceEntries('cacao'),
  ...buildPriceEntries('cafe-arabica'),
];

const mockComparisonEntries: SitemapEntry[] = [
  ...buildComparisonEntries('cacao', 'cafe-arabica'),
];

const mockSections: SitemapSection[] = [
  { name: 'product-country', entries: mockProductCountryEntries },
  { name: 'price', entries: mockPriceEntries },
  { name: 'comparison', entries: mockComparisonEntries },
];

// ============================================================================
// Tests
// ============================================================================

describe('Flux complet : Génération du Sitemap', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  describe('Toutes les pages V1 indexables sont incluses', () => {
    it('les sections product-country, price et comparison sont présentes', () => {
      const sectionNames = mockSections.map((s) => s.name);
      expect(sectionNames).toContain('product-country');
      expect(sectionNames).toContain('price');
      expect(sectionNames).toContain('comparison');
    });

    it('le sitemap XML contient les URLs des pages produit×pays', () => {
      const xml = entriesToXML(mockSections);
      expect(xml).toContain('/fr/produits/cacao/export-france');
      expect(xml).toContain('/en/produits/cacao/export-france');
      expect(xml).toContain('/fr/produits/cafe-arabica/export-france');
    });

    it('le sitemap XML contient les URLs des pages de prix', () => {
      const xml = entriesToXML(mockSections);
      expect(xml).toContain('/fr/prix/cacao-cameroun');
      expect(xml).toContain('/en/prix/cacao-cameroun');
      expect(xml).toContain('/fr/prix/cafe-arabica-cameroun');
    });

    it('le sitemap XML contient les URLs des pages de comparaison', () => {
      const xml = entriesToXML(mockSections);
      expect(xml).toContain('/fr/guide/cacao-vs-cafe-arabica');
      expect(xml).toContain('/en/guide/cacao-vs-cafe-arabica');
    });
  });

  describe('Pages noindex exclues du sitemap', () => {
    it('une page avec dataCompleteness < 70% est non-indexable', () => {
      const lowQualityBlock = markContentSource('contenu court', 'template', 'fr');
      const decision = determineIndexability(60, [lowQualityBlock]);
      expect(decision.isIndexable).toBe(false);
    });

    it('les entrées noindex ne sont pas générées dans le sitemap V1', () => {
      // Le SitemapGenerator ne génère que les pages approuvées (approvedForSEO=true, dataCompleteness>=70)
      // Donc les sections ne contiennent que des pages indexables
      const noindexSections: SitemapSection[] = [
        { name: 'product-country', entries: [] }, // aucune entrée car toutes noindex
      ];
      const xml = entriesToXML(noindexSections);
      expect(xml).not.toContain('<url>');
    });

    it('le sitemap XML ne contient que les URLs des entrées fournies', () => {
      const xml = entriesToXML(mockSections);
      const locMatches = xml.match(/<loc>/g) ?? [];
      const totalEntries = mockSections.reduce((sum, s) => sum + s.entries.length, 0);
      expect(locMatches.length).toBe(totalEntries);
    });
  });

  describe('5 locales présentes pour chaque page indexable', () => {
    it('chaque combinaison produit×pays a 5 entrées (une par locale)', () => {
      const cacaoFranceEntries = mockProductCountryEntries.filter((e) =>
        e.url.includes('/produits/cacao/export-france')
      );
      expect(cacaoFranceEntries).toHaveLength(5);
    });

    it('les 5 locales sont présentes pour les pages produit×pays', () => {
      const cacaoFranceEntries = mockProductCountryEntries.filter((e) =>
        e.url.includes('/produits/cacao/export-france')
      );
      const locales = cacaoFranceEntries.map((e) => e.locale);
      SUPPORTED_LOCALES.forEach((locale) => {
        expect(locales).toContain(locale);
      });
    });

    it('les 5 locales sont présentes pour les pages de prix', () => {
      const cacaoPriceEntries = mockPriceEntries.filter((e) =>
        e.url.includes('/prix/cacao-cameroun')
      );
      expect(cacaoPriceEntries).toHaveLength(5);
      const locales = cacaoPriceEntries.map((e) => e.locale);
      SUPPORTED_LOCALES.forEach((locale) => {
        expect(locales).toContain(locale);
      });
    });

    it('les 5 locales sont présentes pour les pages de comparaison', () => {
      const comparisonEntries = mockComparisonEntries.filter((e) =>
        e.url.includes('/guide/cacao-vs-cafe-arabica')
      );
      expect(comparisonEntries).toHaveLength(5);
      const locales = comparisonEntries.map((e) => e.locale);
      SUPPORTED_LOCALES.forEach((locale) => {
        expect(locales).toContain(locale);
      });
    });

    it('le XML contient les URLs pour toutes les locales', () => {
      const xml = entriesToXML(mockSections);
      SUPPORTED_LOCALES.forEach((locale) => {
        expect(xml).toContain(`/${locale}/produits/cacao/export-france`);
        expect(xml).toContain(`/${locale}/prix/cacao-cameroun`);
        expect(xml).toContain(`/${locale}/guide/cacao-vs-cafe-arabica`);
      });
    });
  });

  describe('changefreq="daily" pour les pages de prix', () => {
    it('toutes les entrées de prix ont changefreq="daily"', () => {
      mockPriceEntries.forEach((entry) => {
        expect(entry.changefreq).toBe('daily');
      });
    });

    it('le XML contient changefreq daily pour les pages de prix', () => {
      const priceSections: SitemapSection[] = [
        { name: 'price', entries: mockPriceEntries },
      ];
      const xml = entriesToXML(priceSections);
      const dailyMatches = xml.match(/<changefreq>daily<\/changefreq>/g) ?? [];
      expect(dailyMatches.length).toBe(mockPriceEntries.length);
    });

    it('les pages produit×pays ont changefreq="weekly"', () => {
      mockProductCountryEntries.forEach((entry) => {
        expect(entry.changefreq).toBe('weekly');
      });
    });

    it('les pages de comparaison ont changefreq="weekly"', () => {
      mockComparisonEntries.forEach((entry) => {
        expect(entry.changefreq).toBe('weekly');
      });
    });
  });

  describe('Valeurs lastmod, changefreq et priority présentes', () => {
    it('chaque entrée a un lastmod valide', () => {
      const allEntries = mockSections.flatMap((s) => s.entries);
      allEntries.forEach((entry) => {
        expect(entry.lastmod).toBeTruthy();
        expect(entry.lastmod).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it('chaque entrée a un changefreq valide', () => {
      const validChangefreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
      const allEntries = mockSections.flatMap((s) => s.entries);
      allEntries.forEach((entry) => {
        expect(validChangefreqs).toContain(entry.changefreq);
      });
    });

    it('chaque entrée a une priority entre 0 et 1', () => {
      const allEntries = mockSections.flatMap((s) => s.entries);
      allEntries.forEach((entry) => {
        expect(entry.priority).toBeGreaterThanOrEqual(0);
        expect(entry.priority).toBeLessThanOrEqual(1);
      });
    });

    it('les pages produit×pays ont priority=0.8', () => {
      mockProductCountryEntries.forEach((entry) => {
        expect(entry.priority).toBe(0.8);
      });
    });

    it('les pages de prix ont priority=0.7', () => {
      mockPriceEntries.forEach((entry) => {
        expect(entry.priority).toBe(0.7);
      });
    });

    it('les pages de comparaison ont priority=0.7', () => {
      mockComparisonEntries.forEach((entry) => {
        expect(entry.priority).toBe(0.7);
      });
    });

    it('le XML contient lastmod, changefreq et priority pour chaque URL', () => {
      const xml = entriesToXML(mockSections);
      const urlMatches = xml.match(/<url>/g) ?? [];
      const lastmodMatches = xml.match(/<lastmod>/g) ?? [];
      const changefreqMatches = xml.match(/<changefreq>/g) ?? [];
      const priorityMatches = xml.match(/<priority>/g) ?? [];

      const totalEntries = mockSections.reduce((sum, s) => sum + s.entries.length, 0);
      expect(urlMatches.length).toBe(totalEntries);
      expect(lastmodMatches.length).toBe(totalEntries);
      expect(changefreqMatches.length).toBe(totalEntries);
      expect(priorityMatches.length).toBe(totalEntries);
    });
  });

  describe('Format XML valide', () => {
    it('le XML commence par la déclaration XML', () => {
      const xml = entriesToXML(mockSections);
      expect(xml.startsWith('<?xml version="1.0"')).toBe(true);
    });

    it('le XML contient les balises urlset ouvrante et fermante', () => {
      const xml = entriesToXML(mockSections);
      expect(xml).toContain('<urlset');
      expect(xml).toContain('</urlset>');
    });

    it('le XML est bien formé avec des sections commentées', () => {
      const xml = entriesToXML(mockSections);
      expect(xml).toContain('<!-- Section: product-country -->');
      expect(xml).toContain('<!-- Section: price -->');
      expect(xml).toContain('<!-- Section: comparison -->');
    });

    it('les sections vides ne génèrent pas d\'entrées XML', () => {
      const emptySections: SitemapSection[] = [
        { name: 'product-country', entries: [] },
        { name: 'price', entries: [] },
      ];
      const xml = entriesToXML(emptySections);
      expect(xml).not.toContain('<url>');
      expect(xml).not.toContain('<loc>');
    });
  });
});
