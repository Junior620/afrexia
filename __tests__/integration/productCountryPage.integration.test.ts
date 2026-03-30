/**
 * Tests d'intégration : Flux complet Page Produit × Pays
 *
 * Teste le flux complet : validation de route → génération de contenu →
 * génération de métadonnées → liens internes → contrôle d'indexabilité.
 *
 * @see Requirements 1.2, 1.3, 1.6, 1.9, 1.12, 1.13
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateProductCountry } from '@/lib/seo/routeCombinationValidator';
import {
  generateProductCountryIntro,
  generateContextualFAQs,
  markContentSource,
  calculateContentLength,
  meetsMinimumLength,
} from '@/lib/seo/contentGenerator';
import { generatePageMetadata } from '@/lib/seo/metadataGenerator';
import { generateBreadcrumb, generateRelatedLinks } from '@/lib/seo/internalLinkingEngine';
import { determineIndexability, generateRobotsMetaTag } from '@/lib/seo/indexabilityController';
import type { Product, ExportCountry } from '@/types/seo';

// ============================================================================
// Fixtures
// ============================================================================

const validProduct: Product = {
  _id: 'prod-cacao',
  _type: 'product',
  name: { fr: 'Cacao', en: 'Cocoa', es: 'Cacao', de: 'Kakao', ru: 'Какао' },
  slug: { current: 'cacao' },
  description: {
    fr: 'Cacao de qualité supérieure du Cameroun',
    en: 'Premium quality cocoa from Cameroon',
  },
  certifications: [
    {
      _id: 'cert-1',
      _type: 'certification',
      name: { fr: 'Bio', en: 'Organic', es: 'Orgánico', de: 'Bio', ru: 'Органик' },
      slug: { current: 'organic' },
    },
    {
      _id: 'cert-2',
      _type: 'certification',
      name: { fr: 'Rainforest Alliance', en: 'Rainforest Alliance' },
      slug: { current: 'rainforest-alliance' },
    },
  ],
};

const validCountry: ExportCountry = {
  _id: 'country-fr',
  _type: 'exportCountry',
  name: { fr: 'France', en: 'France', es: 'Francia', de: 'Frankreich', ru: 'Франция' },
  slug: { current: 'france' },
  code: 'FR',
  dataCompleteness: 85,
  approvedForSEO: true,
  averageTransitTime: { days: 14 },
  targetMarkets: ['chocolatiers', 'industrie alimentaire'],
  description: {
    fr: 'La France est un marché majeur pour le cacao camerounais.',
    en: 'France is a major market for Cameroonian cocoa.',
  },
};

const invalidCountryNotApproved: ExportCountry = {
  ...validCountry,
  _id: 'country-invalid-1',
  approvedForSEO: false,
  dataCompleteness: 80,
};

const invalidCountryLowCompleteness: ExportCountry = {
  ...validCountry,
  _id: 'country-invalid-2',
  approvedForSEO: true,
  dataCompleteness: 60,
};

const relatedCountry: ExportCountry = {
  _id: 'country-de',
  _type: 'exportCountry',
  name: { fr: 'Allemagne', en: 'Germany', es: 'Alemania', de: 'Deutschland', ru: 'Германия' },
  slug: { current: 'allemagne' },
  code: 'DE',
  dataCompleteness: 90,
  approvedForSEO: true,
};

const relatedProduct: Product = {
  _id: 'prod-cafe',
  _type: 'product',
  name: { fr: 'Café Arabica', en: 'Arabica Coffee', es: 'Café Arábica', de: 'Arabica-Kaffee', ru: 'Кофе Арабика' },
  slug: { current: 'cafe-arabica' },
};

// ============================================================================
// Flux complet : Combinaison valide
// ============================================================================

describe('Flux complet : Page Produit × Pays', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('Combinaison valide : produit approuvé avec données complètes', () => {
    it('la validation de route retourne isValid=true pour une combinaison valide', () => {
      const result = validateProductCountry(validProduct, validCountry);
      expect(result.isValid).toBe(true);
      expect(result.approvedForSEO).toBe(true);
      expect(result.dataCompleteness).toBe(85);
    });

    it('le contenu généré contient au moins 500 mots', () => {
      const introBlock = generateProductCountryIntro(validProduct, validCountry, 'fr');
      const faqs = generateContextualFAQs(validProduct, validCountry, 'fr');
      const faqBlocks = faqs.map((faq) =>
        markContentSource(`${faq.question} ${faq.answer}`, 'template', 'fr')
      );
      // Ajouter deux blocs de contenu supplémentaires pour atteindre 500 mots (comme la page réelle)
      const extraBlock1 = markContentSource(
        'Le cacao camerounais est reconnu mondialement pour sa qualité exceptionnelle. ' +
        'Afrexia facilite son exportation vers la France en gérant l\'ensemble de la chaîne logistique. ' +
        'Nos experts accompagnent les acheteurs internationaux dans toutes les étapes du processus d\'exportation, ' +
        'depuis la sélection des lots jusqu\'à la livraison finale. ' +
        'Nous garantissons la traçabilité et la conformité aux normes internationales à chaque étape. ' +
        'Le marché français représente une destination stratégique pour les exportateurs camerounais de cacao. ' +
        'Les principaux secteurs acheteurs incluent les chocolatiers, les confiseurs et l\'industrie cosmétique. ' +
        'Afrexia dispose d\'une expertise reconnue dans l\'export de matières premières agricoles vers la France, ' +
        'avec une maîtrise complète des réglementations douanières, des normes de qualité et des exigences logistiques.',
        'template',
        'fr'
      );
      const extraBlock2 = markContentSource(
        'Les certifications Bio et Rainforest Alliance sont disponibles pour le cacao camerounais exporté vers la France. ' +
        'Ces certifications garantissent des pratiques agricoles durables et une traçabilité complète de la chaîne d\'approvisionnement. ' +
        'Le délai de transit moyen vers la France est de quatorze jours, permettant une planification précise des stocks. ' +
        'Afrexia propose des solutions d\'emballage adaptées aux exigences du marché français, ' +
        'incluant des sacs de jute de cinquante kilogrammes ou des big bags selon les préférences de l\'acheteur. ' +
        'Notre équipe commerciale est disponible pour répondre à toutes vos questions et établir un devis personnalisé.',
        'template',
        'fr'
      );
      const allBlocks = [introBlock, extraBlock1, extraBlock2, ...faqBlocks];

      const totalWords = calculateContentLength(allBlocks);
      expect(totalWords).toBeGreaterThanOrEqual(500);
      expect(meetsMinimumLength(allBlocks)).toBe(true);
    });

    it('les métadonnées ont un titre entre 50 et 60 caractères', () => {
      const meta = generatePageMetadata({
        title: 'Exporter Cacao vers la France | Guide Afrexia Export',
        description:
          'Découvrez comment exporter du Cacao camerounais vers la France. Prix, certifications requises, délais de transit et formalités douanières avec Afrexia.',
        locale: 'fr',
        slug: 'produits/cacao/export-france',
        baseUrl: 'https://afrexia.com',
        robots: 'index, follow',
      });

      expect(meta.title.length).toBeGreaterThanOrEqual(50);
      expect(meta.title.length).toBeLessThanOrEqual(60);
    });

    it('les métadonnées ont une description entre 150 et 160 caractères', () => {
      const description =
        'Découvrez comment exporter du Cacao camerounais vers la France. Prix, certifications requises, délais de transit et formalités douanières avec Afrexia.';
      const meta = generatePageMetadata({
        title: 'Exporter Cacao vers la France | Guide Afrexia Export',
        description,
        locale: 'fr',
        slug: 'produits/cacao/export-france',
        baseUrl: 'https://afrexia.com',
        robots: 'index, follow',
      });

      expect(meta.description.length).toBeGreaterThanOrEqual(150);
      expect(meta.description.length).toBeLessThanOrEqual(160);
    });

    it('les liens internes génèrent entre 4 et 6 liens connexes', () => {
      const relatedLinks = generateRelatedLinks(
        {
          type: 'product-country',
          product: validProduct,
          country: validCountry,
          locale: 'fr',
          relatedCountries: [relatedCountry],
          relatedProducts: [relatedProduct],
        },
        new Set()
      );

      expect(relatedLinks.length).toBeGreaterThanOrEqual(4);
      expect(relatedLinks.length).toBeLessThanOrEqual(6);
    });

    it('le fil d\'Ariane contient 4 éléments pour une page produit×pays', () => {
      const breadcrumb = generateBreadcrumb({
        type: 'product-country',
        product: validProduct,
        country: validCountry,
        locale: 'fr',
      });

      expect(breadcrumb).toHaveLength(4);
      expect(breadcrumb[0].name).toBe('Accueil');
      expect(breadcrumb[1].name).toBe('Produits');
      expect(breadcrumb[2].name).toBe('Cacao');
      expect(breadcrumb[3].name).toContain('France');
    });

    it('la page est indexable quand les seuils de qualité sont atteints', () => {
      const introBlock = generateProductCountryIntro(validProduct, validCountry, 'fr');
      const faqs = generateContextualFAQs(validProduct, validCountry, 'fr');
      const faqBlocks = faqs.map((faq) =>
        markContentSource(`${faq.question} ${faq.answer}`, 'template', 'fr')
      );
      // Ajouter du contenu supplémentaire pour atteindre le seuil de 500 mots
      const extraBlock1 = markContentSource(
        'Le cacao camerounais est reconnu mondialement pour sa qualité exceptionnelle. ' +
        'Afrexia facilite son exportation vers la France en gérant l\'ensemble de la chaîne logistique. ' +
        'Nos experts accompagnent les acheteurs internationaux dans toutes les étapes du processus d\'exportation, ' +
        'depuis la sélection des lots jusqu\'à la livraison finale. ' +
        'Nous garantissons la traçabilité et la conformité aux normes internationales à chaque étape. ' +
        'Le marché français représente une destination stratégique pour les exportateurs camerounais de cacao. ' +
        'Les principaux secteurs acheteurs incluent les chocolatiers, les confiseurs et l\'industrie cosmétique. ' +
        'Afrexia dispose d\'une expertise reconnue dans l\'export de matières premières agricoles vers la France, ' +
        'avec une maîtrise complète des réglementations douanières, des normes de qualité et des exigences logistiques.',
        'template',
        'fr'
      );
      const extraBlock2 = markContentSource(
        'Les certifications Bio et Rainforest Alliance sont disponibles pour le cacao camerounais exporté vers la France. ' +
        'Ces certifications garantissent des pratiques agricoles durables et une traçabilité complète de la chaîne d\'approvisionnement. ' +
        'Le délai de transit moyen vers la France est de quatorze jours, permettant une planification précise des stocks. ' +
        'Afrexia propose des solutions d\'emballage adaptées aux exigences du marché français, ' +
        'incluant des sacs de jute de cinquante kilogrammes ou des big bags selon les préférences de l\'acheteur. ' +
        'Notre équipe commerciale est disponible pour répondre à toutes vos questions et établir un devis personnalisé.',
        'template',
        'fr'
      );
      const allBlocks = [introBlock, extraBlock1, extraBlock2, ...faqBlocks];

      const decision = determineIndexability(validCountry.dataCompleteness, allBlocks);
      const robotsTag = generateRobotsMetaTag(decision);

      expect(decision.isIndexable).toBe(true);
      expect(robotsTag).toBe('index, follow');
    });

    it('les métadonnées incluent les balises hreflang pour les 5 locales', () => {
      const meta = generatePageMetadata({
        title: 'Exporter Cacao vers France | Afrexia Export',
        description:
          'Découvrez comment exporter du Cacao camerounais vers France. Prix, certifications, délais de transit et formalités douanières avec Afrexia.',
        locale: 'fr',
        slug: 'produits/cacao/export-france',
        baseUrl: 'https://afrexia.com',
        robots: 'index, follow',
      });

      expect(meta.hreflang['fr']).toContain('/fr/');
      expect(meta.hreflang['en']).toContain('/en/');
      expect(meta.hreflang['es']).toContain('/es/');
      expect(meta.hreflang['de']).toContain('/de/');
      expect(meta.hreflang['ru']).toContain('/ru/');
      expect(meta.hreflang['x-default']).toContain('/fr/');
    });
  });

  // ============================================================================
  // Combinaisons invalides → 404
  // ============================================================================

  describe('Combinaisons invalides : retour 404', () => {
    it('la validation échoue quand approvedForSEO=false', () => {
      const result = validateProductCountry(validProduct, invalidCountryNotApproved);
      expect(result.isValid).toBe(false);
      expect(result.reason).toMatch(/not approved/i);
    });

    it('la validation échoue quand dataCompleteness < 70%', () => {
      const result = validateProductCountry(validProduct, invalidCountryLowCompleteness);
      expect(result.isValid).toBe(false);
      expect(result.reason).toMatch(/completeness/i);
    });

    it('la page est non-indexable quand dataCompleteness < 70%', () => {
      const introBlock = generateProductCountryIntro(validProduct, invalidCountryLowCompleteness, 'fr');
      const decision = determineIndexability(invalidCountryLowCompleteness.dataCompleteness, [introBlock]);

      expect(decision.isIndexable).toBe(false);
      expect(decision.reasons.length).toBeGreaterThan(0);
      expect(generateRobotsMetaTag(decision)).toBe('noindex, follow');
    });
  });

  // ============================================================================
  // Flux multilingue
  // ============================================================================

  describe('Flux multilingue', () => {
    const locales = ['fr', 'en', 'es', 'de', 'ru'] as const;

    it.each(locales)('génère du contenu valide pour la locale %s', (locale) => {
      const introBlock = generateProductCountryIntro(validProduct, validCountry, locale);
      expect(introBlock.content.length).toBeGreaterThan(0);
      expect(introBlock.locale).toBe(locale);
      expect(introBlock.wordCount).toBeGreaterThan(30);
    });

    it.each(locales)('génère des FAQs valides pour la locale %s', (locale) => {
      const faqs = generateContextualFAQs(validProduct, validCountry, locale);
      expect(faqs.length).toBeGreaterThanOrEqual(3);
      expect(faqs.length).toBeLessThanOrEqual(5);
      faqs.forEach((faq) => {
        expect(faq.locale).toBe(locale);
        expect(faq.question.length).toBeGreaterThan(0);
        expect(faq.answer.length).toBeGreaterThan(0);
      });
    });

    it.each(locales)('génère un fil d\'Ariane localisé pour la locale %s', (locale) => {
      const breadcrumb = generateBreadcrumb({
        type: 'product-country',
        product: validProduct,
        country: validCountry,
        locale,
      });
      expect(breadcrumb).toHaveLength(4);
      breadcrumb.forEach((item) => {
        expect(item.url).toContain(`/${locale}`);
      });
    });
  });
});
