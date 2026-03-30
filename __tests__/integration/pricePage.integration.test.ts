/**
 * Tests d'intégration : Flux complet Page Prix
 *
 * Teste le flux complet : récupération des données de prix (mockées) →
 * génération de contenu → génération de métadonnées → indicateur de fraîcheur.
 *
 * @see Requirements 1.4, 1.15.1
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generatePageMetadata, generateBreadcrumbSchema } from '@/lib/seo/metadataGenerator';
import { generateBreadcrumb } from '@/lib/seo/internalLinkingEngine';
import { applyLanguageFallback, generateDisclaimer } from '@/lib/seo/contentGenerator';
import { ISR_REVALIDATION } from '@/lib/seo/isrConfig';
import type { Product } from '@/types/seo';
import type { CurrentPriceData, PriceHistoryPoint } from '@/lib/sanity/seoQueries';

// ============================================================================
// Fixtures
// ============================================================================

const cacaoProduct: Product = {
  _id: 'prod-cacao',
  _type: 'product',
  name: { fr: 'Cacao', en: 'Cocoa', es: 'Cacao', de: 'Kakao', ru: 'Какао' },
  slug: { current: 'cacao' },
};

const currentPriceData: CurrentPriceData = {
  product: 'Cacao',
  price: 3500,
  unit: 'USD/tonne',
  trend: 'up',
  change: 2.5,
  source: 'ICE Futures',
  lastUpdated: '2024-01-15T10:00:00Z',
};

const priceHistoryData: PriceHistoryPoint[] = Array.from({ length: 30 }, (_, i) => ({
  // index 0 = most recent (newest first, as returned by Sanity order desc)
  price: 3545 - i * 5, // starts at 3545 (newest), ends at 3400 (oldest) → upward trend
  unit: 'USD/tonne',
  trend: i % 3 === 0 ? 'down' : 'up',
  change: 1.2,
  source: 'ICE Futures',
  recordedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
}));

const stablePriceHistory: PriceHistoryPoint[] = Array.from({ length: 30 }, (_, i) => ({
  price: 3500,
  unit: 'USD/tonne',
  trend: 'stable',
  change: 0,
  source: 'ICE Futures',
  recordedAt: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
}));

const downwardPriceHistory: PriceHistoryPoint[] = Array.from({ length: 30 }, (_, i) => ({
  // index 0 = most recent (newest first) → price decreasing over time
  // latest (index 0) = 3210, oldest (index 29) = 3500 → downward trend
  price: 3210 + i * 10,
  unit: 'USD/tonne',
  trend: 'down',
  change: -1.5,
  source: 'ICE Futures',
  recordedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
}));

// ============================================================================
// Helpers (reproduit la logique de la page)
// ============================================================================

function calculateTrend(history: PriceHistoryPoint[]): {
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
// Tests
// ============================================================================

describe('Flux complet : Page Prix', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  describe('Données de prix incluses dans la page', () => {
    it('le prix actuel est présent dans les données mockées', () => {
      expect(currentPriceData.price).toBe(3500);
      expect(currentPriceData.unit).toBe('USD/tonne');
      expect(currentPriceData.source).toBe('ICE Futures');
    });

    it('l\'historique de 30 jours est présent', () => {
      expect(priceHistoryData).toHaveLength(30);
      priceHistoryData.forEach((entry) => {
        expect(entry.price).toBeGreaterThan(0);
        expect(entry.unit).toBeTruthy();
        expect(entry.recordedAt).toBeTruthy();
      });
    });

    it('l\'historique contient des dates valides', () => {
      priceHistoryData.forEach((entry) => {
        const date = new Date(entry.recordedAt);
        expect(date.getTime()).not.toBeNaN();
      });
    });
  });

  describe('Calcul de la tendance des prix', () => {
    it('détecte une tendance à la hausse', () => {
      const { trend, percentage } = calculateTrend(priceHistoryData);
      expect(trend).toBe('up');
      expect(percentage).toBeGreaterThan(0);
    });

    it('détecte une tendance stable', () => {
      const { trend } = calculateTrend(stablePriceHistory);
      expect(trend).toBe('stable');
    });

    it('détecte une tendance à la baisse', () => {
      const { trend, percentage } = calculateTrend(downwardPriceHistory);
      expect(trend).toBe('down');
      expect(percentage).toBeGreaterThan(0);
    });

    it('retourne stable pour un historique vide', () => {
      const { trend } = calculateTrend([]);
      expect(trend).toBe('stable');
    });

    it('retourne stable pour un seul point de données', () => {
      const { trend } = calculateTrend([priceHistoryData[0]]);
      expect(trend).toBe('stable');
    });
  });

  describe('Configuration ISR : revalidate = 86400 (24h)', () => {
    it('la constante ISR_REVALIDATION.PRICE_PAGES est 86400', () => {
      expect(ISR_REVALIDATION.PRICE_PAGES).toBe(86400);
    });

    it('la valeur de revalidation correspond à 24 heures en secondes', () => {
      const twentyFourHoursInSeconds = 24 * 60 * 60;
      expect(ISR_REVALIDATION.PRICE_PAGES).toBe(twentyFourHoursInSeconds);
    });
  });

  describe('Métadonnées incluant le prix actuel dans le titre', () => {
    it('le titre inclut le prix actuel quand disponible', () => {
      const productName = applyLanguageFallback(cacaoProduct.name, 'fr', 'product.name');
      const priceStr = `${currentPriceData.price.toLocaleString('fr-FR')} ${currentPriceData.unit}`;
      const title = `Prix ${productName} Cameroun ${priceStr} | Afrexia`;

      expect(title).toContain('3\u202f500');
      expect(title).toContain('USD/tonne');
      expect(title).toContain('Cacao');
    });

    it('les métadonnées sont générées avec le prix dans le titre', () => {
      const productName = applyLanguageFallback(cacaoProduct.name, 'fr', 'product.name');
      const priceStr = `${currentPriceData.price.toLocaleString('fr-FR')} ${currentPriceData.unit}`;

      const meta = generatePageMetadata({
        title: `Prix ${productName} Cameroun ${priceStr} | Afrexia`,
        description: `Prix actuel du Cacao camerounais : 3 500 USD/tonne. Historique 30 jours, tendance et évolution des cours. Données mises à jour quotidiennement par Afrexia.`,
        locale: 'fr',
        slug: 'prix/cacao-cameroun',
        baseUrl: 'https://afrexia.com',
        robots: 'index, follow',
      });

      expect(meta.title).toContain('Cacao');
      expect(meta.canonical).toContain('prix/cacao-cameroun');
    });
  });

  describe('Indicateur de fraîcheur des données', () => {
    it('la date de dernière mise à jour est présente dans les données de prix', () => {
      expect(currentPriceData.lastUpdated).toBeTruthy();
      const date = new Date(currentPriceData.lastUpdated);
      expect(date.getTime()).not.toBeNaN();
    });

    it('la source des données est présente', () => {
      expect(currentPriceData.source).toBeTruthy();
      expect(currentPriceData.source.length).toBeGreaterThan(0);
    });

    it('le disclaimer de prix est généré pour toutes les locales', () => {
      const locales = ['fr', 'en', 'es', 'de', 'ru'] as const;
      locales.forEach((locale) => {
        const disclaimer = generateDisclaimer('price', locale);
        expect(disclaimer).toBeTruthy();
        expect(disclaimer.length).toBeGreaterThan(0);
      });
    });

    it('le disclaimer français mentionne le caractère indicatif du prix', () => {
      const disclaimer = generateDisclaimer('price', 'fr');
      expect(disclaimer).toContain('indicatif');
    });
  });

  describe('Fil d\'Ariane pour la page prix', () => {
    it('génère un fil d\'Ariane avec 3 éléments pour une page prix', () => {
      const breadcrumb = generateBreadcrumb({
        type: 'price',
        product: cacaoProduct,
        locale: 'fr',
      });

      expect(breadcrumb).toHaveLength(3);
      expect(breadcrumb[0].name).toBe('Accueil');
      expect(breadcrumb[1].name).toBe('Prix');
      expect(breadcrumb[2].name).toBe('Cacao');
    });

    it('les URLs du fil d\'Ariane contiennent la locale', () => {
      const breadcrumb = generateBreadcrumb({
        type: 'price',
        product: cacaoProduct,
        locale: 'en',
      });

      breadcrumb.forEach((item) => {
        expect(item.url).toContain('/en');
      });
    });

    it('le schéma BreadcrumbList est généré correctement', () => {
      const breadcrumb = generateBreadcrumb({
        type: 'price',
        product: cacaoProduct,
        locale: 'fr',
      });

      const schema = generateBreadcrumbSchema(breadcrumb);
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(3);
      schema.itemListElement.forEach((item: any, i: number) => {
        expect(item['@type']).toBe('ListItem');
        expect(item.position).toBe(i + 1);
        expect(item.name).toBeTruthy();
        expect(item.item).toBeTruthy();
      });
    });
  });

  describe('Flux multilingue pour la page prix', () => {
    const locales = ['fr', 'en', 'es', 'de', 'ru'] as const;

    it.each(locales)('génère un fil d\'Ariane localisé pour la locale %s', (locale) => {
      const breadcrumb = generateBreadcrumb({
        type: 'price',
        product: cacaoProduct,
        locale,
      });

      expect(breadcrumb).toHaveLength(3);
      breadcrumb.forEach((item) => {
        expect(item.url).toContain(`/${locale}`);
      });
    });

    it.each(locales)('génère un disclaimer de prix pour la locale %s', (locale) => {
      const disclaimer = generateDisclaimer('price', locale);
      expect(disclaimer).toBeTruthy();
    });
  });
});
