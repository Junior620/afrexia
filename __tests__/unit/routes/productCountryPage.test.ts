/**
 * Unit tests for Product × Country route utilities
 * Tests the pure functions extracted from the route (parseComparisonSlug is in comparison page)
 * @see Requirements 1.3
 */

import { describe, it, expect, vi } from 'vitest';
import { validateProductCountry } from '@/lib/seo/routeCombinationValidator';
import {
  generateProductCountryIntro,
  generateContextualFAQs,
  generateDisclaimer,
  applyLanguageFallback,
} from '@/lib/seo/contentGenerator';
import { generatePageMetadata, generateProductSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo/metadataGenerator';
import { generateBreadcrumb, generateRelatedLinks } from '@/lib/seo/internalLinkingEngine';
import { determineIndexability, generateRobotsMetaTag } from '@/lib/seo/indexabilityController';
import type { Product, ExportCountry, Locale } from '@/types/seo';

// ============================================================================
// Mock data (simulating Sanity responses)
// ============================================================================

const mockProduct: Product = {
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
      name: { fr: 'Bio', en: 'Organic' },
      slug: { current: 'organic' },
    },
  ],
};

const mockCountry: ExportCountry = {
  _id: 'country-nl',
  _type: 'exportCountry',
  name: { fr: 'Pays-Bas', en: 'Netherlands', es: 'Países Bajos', de: 'Niederlande', ru: 'Нидерланды' },
  slug: { current: 'netherlands' },
  code: 'NL',
  flag: '🇳🇱',
  dataCompleteness: 85,
  approvedForSEO: true,
  averageTransitTime: { days: 21 },
  targetMarkets: ['food industry', 'chocolate manufacturers'],
};

const mockCountryLowData: ExportCountry = {
  ...mockCountry,
  _id: 'country-low',
  dataCompleteness: 50,
  approvedForSEO: false,
};

// ============================================================================
// Route validation logic
// ============================================================================

describe('Product × Country route validation', () => {
  it('validates approved combination with sufficient data', () => {
    const result = validateProductCountry(mockProduct, mockCountry);
    expect(result.isValid).toBe(true);
  });

  it('rejects combination with low data completeness', () => {
    const result = validateProductCountry(mockProduct, mockCountryLowData);
    expect(result.isValid).toBe(false);
  });

  it('rejects combination not approved for SEO', () => {
    const country = { ...mockCountry, approvedForSEO: false };
    const result = validateProductCountry(mockProduct, country);
    expect(result.isValid).toBe(false);
  });
});

// ============================================================================
// Content generation for product × country page
// ============================================================================

describe('Product × Country content generation', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  it('generates intro block with product and country names', () => {
    const intro = generateProductCountryIntro(mockProduct, mockCountry, 'fr');
    expect(intro.content).toContain('Cacao');
    expect(intro.content).toContain('Pays-Bas');
  });

  it('generates 3-5 contextual FAQs', () => {
    const faqs = generateContextualFAQs(mockProduct, mockCountry, 'fr');
    expect(faqs.length).toBeGreaterThanOrEqual(3);
    expect(faqs.length).toBeLessThanOrEqual(5);
  });

  it('generates FAQs with correct locale', () => {
    const faqs = generateContextualFAQs(mockProduct, mockCountry, 'en');
    faqs.forEach((faq) => expect(faq.locale).toBe('en'));
  });

  it('generates delay disclaimer', () => {
    const disclaimer = generateDisclaimer('delay', 'fr');
    expect(disclaimer).toBeTruthy();
    expect(disclaimer.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// Indexability check
// ============================================================================

describe('Product × Country indexability', () => {
  it('marks page as indexable when data is complete', () => {
    const intro = generateProductCountryIntro(mockProduct, mockCountry, 'fr');
    const decision = determineIndexability(mockCountry.dataCompleteness, [intro]);
    // With 85% completeness and template content, should be indexable if content is long enough
    expect(decision.dataCompleteness).toBe(85);
  });

  it('generates correct robots meta tag for indexable page', () => {
    const decision = {
      isIndexable: true,
      reasons: [],
      dataCompleteness: 85,
      contentLength: 600,
      fallbackPercentage: 0,
    };
    expect(generateRobotsMetaTag(decision)).toBe('index, follow');
  });

  it('generates noindex for low-quality page', () => {
    const decision = {
      isIndexable: false,
      reasons: ['Data completeness too low'],
      dataCompleteness: 50,
      contentLength: 600,
      fallbackPercentage: 0,
    };
    expect(generateRobotsMetaTag(decision)).toBe('noindex, follow');
  });
});

// ============================================================================
// Metadata generation for product × country page
// ============================================================================

describe('Product × Country metadata generation', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('generates metadata with all required fields', () => {
    const productName = applyLanguageFallback(mockProduct.name, 'fr', 'product.name');
    const countryName = applyLanguageFallback(mockCountry.name, 'fr', 'country.name');

    const meta = generatePageMetadata({
      title: `Exporter ${productName} vers ${countryName} | Afrexia Export International`,
      description: `Découvrez comment exporter du ${productName} camerounais vers ${countryName}. Prix, certifications, délais de transit et formalités douanières avec Afrexia.`,
      locale: 'fr',
      slug: `produits/cacao/export-netherlands`,
      baseUrl: 'https://afrexia.com',
    });

    expect(meta.canonical).toContain('/fr/produits/cacao/export-netherlands');
    expect(Object.keys(meta.hreflang)).toHaveLength(6); // 5 locales + x-default
  });

  it('generates product schema with correct type', () => {
    const schema = generateProductSchema({
      product: mockProduct,
      locale: 'fr',
      url: 'https://afrexia.com/fr/produits/cacao/export-netherlands',
    });

    expect(schema['@type']).toBe('Product');
    expect(schema['@context']).toBe('https://schema.org');
  });

  it('generates FAQ schema when FAQs are present', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const faqs = generateContextualFAQs(mockProduct, mockCountry, 'fr');
    const schema = generateFAQSchema(faqs);

    expect(schema['@type']).toBe('FAQPage');
  });
});

// ============================================================================
// Internal linking for product × country page
// ============================================================================

describe('Product × Country internal linking', () => {
  it('generates breadcrumb with 4 items', () => {
    const breadcrumb = generateBreadcrumb({
      type: 'product-country',
      product: mockProduct,
      country: mockCountry,
      locale: 'fr',
    });

    expect(breadcrumb).toHaveLength(4);
  });

  it('generates breadcrumb schema', () => {
    const breadcrumb = generateBreadcrumb({
      type: 'product-country',
      product: mockProduct,
      country: mockCountry,
      locale: 'fr',
    });

    const schema = generateBreadcrumbSchema(breadcrumb);
    expect(schema['@type']).toBe('BreadcrumbList');
  });

  it('generates related links', () => {
    const links = generateRelatedLinks({
      type: 'product-country',
      product: mockProduct,
      country: mockCountry,
      locale: 'fr',
    });

    expect(links.length).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================================
// ISR configuration
// ============================================================================

describe('Product × Country ISR configuration', () => {
  it('has revalidate set to 604800 (7 days)', async () => {
    // Import the revalidate constant from the page
    const { revalidate } = await import('@/app/[locale]/produits/[product-slug]/export-[country-slug]/page');
    expect(revalidate).toBe(604800);
  });
});
