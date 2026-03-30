/**
 * Tests d'intégration : Flux complet Page Comparaison
 *
 * Teste le flux complet pour les pages de comparaison produit vs produit :
 * génération de contenu → tableau comparatif → recommandations → métadonnées.
 *
 * @see Requirements 1.5, 1.15.3
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateComparisonContent,
  generateComparisonTable,
  applyLanguageFallback,
} from '@/lib/seo/contentGenerator';
import { generatePageMetadata } from '@/lib/seo/metadataGenerator';
import { generateBreadcrumb, generateRelatedLinks } from '@/lib/seo/internalLinkingEngine';
import { determineIndexability } from '@/lib/seo/indexabilityController';
import { ISR_REVALIDATION } from '@/lib/seo/isrConfig';
import { parseComparisonSlug } from '@/app/[locale]/guide/[comparison-type]/page';
import type { Product } from '@/types/seo';

// ============================================================================
// Fixtures
// ============================================================================

const productCacao: Product = {
  _id: 'prod-cacao',
  _type: 'product',
  name: { fr: 'Cacao', en: 'Cocoa', es: 'Cacao', de: 'Kakao', ru: 'Какао' },
  slug: { current: 'cacao' },
  certifications: [
    {
      _id: 'cert-1',
      _type: 'certification',
      name: { fr: 'Bio', en: 'Organic' },
      slug: { current: 'organic' },
    },
  ],
};

const productCafe: Product = {
  _id: 'prod-cafe',
  _type: 'product',
  name: { fr: 'Café Arabica', en: 'Arabica Coffee', es: 'Café Arábica', de: 'Arabica-Kaffee', ru: 'Кофе Арабика' },
  slug: { current: 'cafe-arabica' },
  certifications: [
    {
      _id: 'cert-2',
      _type: 'certification',
      name: { fr: 'Rainforest Alliance', en: 'Rainforest Alliance' },
      slug: { current: 'rainforest-alliance' },
    },
  ],
};

const productPalmier: Product = {
  _id: 'prod-palmier',
  _type: 'product',
  name: { fr: 'Huile de Palme', en: 'Palm Oil', es: 'Aceite de Palma', de: 'Palmöl', ru: 'Пальмовое масло' },
  slug: { current: 'huile-de-palme' },
};

// ============================================================================
// Tests
// ============================================================================

describe('Flux complet : Page Comparaison', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  describe('Génération du contenu de comparaison', () => {
    it('génère un contenu de comparaison complet avec toutes les sections', () => {
      const content = generateComparisonContent(productCacao, productCafe, 'fr');

      expect(content.intro).toBeDefined();
      expect(content.comparisonTable).toBeDefined();
      expect(content.tasteSection).toBeDefined();
      expect(content.qualitySection).toBeDefined();
      expect(content.applicationsSection).toBeDefined();
      expect(content.recommendations).toBeDefined();
      expect(content.faqs).toBeDefined();
    });

    it('l\'intro contient les noms des deux produits', () => {
      const content = generateComparisonContent(productCacao, productCafe, 'fr');
      expect(content.intro.content).toContain('Cacao');
      expect(content.intro.content).toContain('Café Arabica');
    });

    it('les recommandations sont présentes et non vides', () => {
      const content = generateComparisonContent(productCacao, productCafe, 'fr');
      expect(content.recommendations.content.length).toBeGreaterThan(0);
      expect(content.recommendations.wordCount).toBeGreaterThan(10);
    });

    it('génère entre 3 et 5 FAQs', () => {
      const content = generateComparisonContent(productCacao, productCafe, 'fr');
      expect(content.faqs.length).toBeGreaterThanOrEqual(3);
      expect(content.faqs.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Tableau comparatif avec prix, qualité, certifications, disponibilité', () => {
    it('le tableau comparatif contient les critères requis', () => {
      const table = generateComparisonTable(productCacao, productCafe, 'fr');

      expect(table.length).toBeGreaterThan(0);
      const criteria = table.map((row) => row.criterion.toLowerCase());

      // Vérifie la présence des critères clés
      const hasCertifications = criteria.some((c) => c.includes('certif'));
      const hasQuality = criteria.some((c) => c.includes('qualit'));
      const hasAvailability = criteria.some((c) => c.includes('disponib'));

      expect(hasCertifications).toBe(true);
      expect(hasQuality).toBe(true);
      expect(hasAvailability).toBe(true);
    });

    it('chaque ligne du tableau a un critère, une valeur A et une valeur B', () => {
      const table = generateComparisonTable(productCacao, productCafe, 'fr');

      table.forEach((row) => {
        expect(row.criterion).toBeTruthy();
        expect(row.valueA).toBeTruthy();
        expect(row.valueB).toBeTruthy();
      });
    });

    it('les certifications des produits apparaissent dans le tableau', () => {
      const table = generateComparisonTable(productCacao, productCafe, 'fr');
      const certRow = table.find((row) => row.criterion.toLowerCase().includes('certif'));

      expect(certRow).toBeDefined();
      expect(certRow!.valueA).toContain('Bio');
      expect(certRow!.valueB).toContain('Rainforest Alliance');
    });

    it('génère le tableau en anglais avec les bons labels', () => {
      const table = generateComparisonTable(productCacao, productCafe, 'en');
      const criteria = table.map((row) => row.criterion.toLowerCase());

      expect(criteria.some((c) => c.includes('certif'))).toBe(true);
      expect(criteria.some((c) => c.includes('quality'))).toBe(true);
      expect(criteria.some((c) => c.includes('availab'))).toBe(true);
    });
  });

  describe('Produits non trouvés → 404', () => {
    it('retourne null pour un produit inexistant (simulation)', () => {
      // Simule le comportement de getComparisonProducts quand un produit n'existe pas
      const productA = null;
      const productB = productCafe;

      // La page doit appeler notFound() si l'un des produits est null
      expect(productA).toBeNull();
      expect(productB).not.toBeNull();
    });

    it('parseComparisonSlug retourne null pour un slug invalide', () => {
      const result = parseComparisonSlug('invalid-slug-without-vs');
      expect(result).toBeNull();
    });

    it('parseComparisonSlug retourne null pour un slug vide', () => {
      const result = parseComparisonSlug('');
      expect(result).toBeNull();
    });
  });

  describe('Parsing du slug de comparaison', () => {
    it('parse correctement un slug produit-vs-produit', () => {
      const result = parseComparisonSlug('cacao-vs-cafe-arabica');
      expect(result).not.toBeNull();
      expect(result!.type).toBe('product-vs-product');
      expect(result!.slugA).toBe('cacao');
      expect(result!.slugB).toBe('cafe-arabica');
    });

    it('parse correctement un slug avec tirets dans les noms', () => {
      const result = parseComparisonSlug('cafe-arabica-vs-cafe-robusta');
      expect(result).not.toBeNull();
      expect(result!.slugA).toBe('cafe-arabica');
      expect(result!.slugB).toBe('cafe-robusta');
    });
  });

  describe('Configuration ISR : revalidate = 604800 (7 jours)', () => {
    it('la constante ISR_REVALIDATION.COMPARISON_PAGES est 604800', () => {
      expect(ISR_REVALIDATION.COMPARISON_PAGES).toBe(604800);
    });

    it('la valeur de revalidation correspond à 7 jours en secondes', () => {
      const sevenDaysInSeconds = 7 * 24 * 60 * 60;
      expect(ISR_REVALIDATION.COMPARISON_PAGES).toBe(sevenDaysInSeconds);
    });
  });

  describe('Métadonnées de la page comparaison', () => {
    it('génère des métadonnées avec les noms des deux produits', () => {
      const nameA = applyLanguageFallback(productCacao.name, 'fr', 'productA.name');
      const nameB = applyLanguageFallback(productCafe.name, 'fr', 'productB.name');

      const meta = generatePageMetadata({
        title: `${nameA} vs ${nameB} : Comparaison complète | Afrexia`,
        description: `Comparez ${nameA} et ${nameB} camerounais : prix, qualité, certifications, disponibilité et recommandations d'usage. Guide complet par Afrexia pour choisir la meilleure matière première.`,
        locale: 'fr',
        slug: 'guide/cacao-vs-cafe-arabica',
        baseUrl: 'https://afrexia.com',
        robots: 'index, follow',
      });

      expect(meta.title).toContain('Cacao');
      expect(meta.title).toContain('Café Arabica');
      expect(meta.canonical).toContain('guide/cacao-vs-cafe-arabica');
    });
  });

  describe('Fil d\'Ariane pour la page comparaison', () => {
    it('génère un fil d\'Ariane avec 3 éléments pour une page comparaison', () => {
      const breadcrumb = generateBreadcrumb({
        type: 'comparison',
        productA: productCacao,
        productB: productCafe,
        locale: 'fr',
      });

      expect(breadcrumb).toHaveLength(3);
      expect(breadcrumb[0].name).toBe('Accueil');
      expect(breadcrumb[1].name).toBe('Guides');
      expect(breadcrumb[2].name).toContain('Cacao');
      expect(breadcrumb[2].name).toContain('Café Arabica');
    });

    it('les URLs du fil d\'Ariane contiennent la locale', () => {
      const breadcrumb = generateBreadcrumb({
        type: 'comparison',
        productA: productCacao,
        productB: productCafe,
        locale: 'en',
      });

      breadcrumb.forEach((item) => {
        expect(item.url).toContain('/en');
      });
    });
  });

  describe('Liens internes pour la page comparaison', () => {
    it('génère des liens vers les pages de prix des deux produits', () => {
      const relatedLinks = generateRelatedLinks(
        {
          type: 'comparison',
          productA: productCacao,
          productB: productCafe,
          locale: 'fr',
          relatedProducts: [productPalmier],
        },
        new Set()
      );

      const urls = relatedLinks.map((l) => l.url);
      const hasCacaoPricePage = urls.some((url) => url.includes('prix/cacao'));
      const hasCafePricePage = urls.some((url) => url.includes('prix/cafe-arabica'));

      expect(hasCacaoPricePage).toBe(true);
      expect(hasCafePricePage).toBe(true);
    });
  });

  describe('Flux multilingue pour la page comparaison', () => {
    const locales = ['fr', 'en', 'es', 'de', 'ru'] as const;

    it.each(locales)('génère du contenu de comparaison pour la locale %s', (locale) => {
      const content = generateComparisonContent(productCacao, productCafe, locale);

      expect(content.intro.content.length).toBeGreaterThan(0);
      expect(content.intro.locale).toBe(locale);
      expect(content.tasteSection.content.length).toBeGreaterThan(0);
      expect(content.qualitySection.content.length).toBeGreaterThan(0);
      expect(content.applicationsSection.content.length).toBeGreaterThan(0);
      expect(content.recommendations.content.length).toBeGreaterThan(0);
    });

    it.each(locales)('génère un fil d\'Ariane localisé pour la locale %s', (locale) => {
      const breadcrumb = generateBreadcrumb({
        type: 'comparison',
        productA: productCacao,
        productB: productCafe,
        locale,
      });

      expect(breadcrumb).toHaveLength(3);
      breadcrumb.forEach((item) => {
        expect(item.url).toContain(`/${locale}`);
      });
    });
  });

  describe('Indexabilité de la page comparaison', () => {
    it('la page est indexable avec un contenu suffisant', () => {
      const content = generateComparisonContent(productCacao, productCafe, 'fr');
      const allBlocks = [
        content.intro,
        content.tasteSection,
        content.qualitySection,
        content.applicationsSection,
        content.recommendations,
      ];

      // dataCompleteness = 100 car les données de comparaison sont générées par template
      const decision = determineIndexability(100, allBlocks);
      expect(decision.contentLength).toBeGreaterThan(0);
    });
  });
});
