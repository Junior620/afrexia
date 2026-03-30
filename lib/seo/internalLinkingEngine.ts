/**
 * InternalLinkingEngine
 *
 * Generates internal links for programmatic SEO pages:
 * - Related page links (4–6 per page, prioritising indexable pages)
 * - Breadcrumb navigation with clickable links
 * - Anchor text variation to avoid over-optimisation
 *
 * @see Requirements 1.13
 */

import type {
  Locale,
  InternalLink,
  BreadcrumbItem,
  Product,
  ExportCountry,
} from '@/types/seo';

// ============================================================================
// Constants
// ============================================================================

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://afrexia.com';

/** Min/max related links per page (Requirement 1.13.5) */
const MIN_RELATED_LINKS = 4;
const MAX_RELATED_LINKS = 6;

// ============================================================================
// Page Context Types
// ============================================================================

export type PageType =
  | 'product-country'
  | 'price'
  | 'comparison'
  | 'certification-product'
  | 'port-product'
  | 'harvest-season';

export interface ProductCountryContext {
  type: 'product-country';
  product: Product;
  country: ExportCountry;
  locale: Locale;
  /** Other approved countries for the same product */
  relatedCountries?: ExportCountry[];
  /** Other products */
  relatedProducts?: Product[];
}

export interface PriceContext {
  type: 'price';
  product: Product;
  locale: Locale;
  relatedProducts?: Product[];
  relatedCountries?: ExportCountry[];
}

export interface ComparisonContext {
  type: 'comparison';
  productA: Product;
  productB: Product;
  locale: Locale;
  relatedProducts?: Product[];
}

export type PageContext = ProductCountryContext | PriceContext | ComparisonContext;

// ============================================================================
// Anchor Text Pools (Requirement 1.13.6 — vary anchor texts)
// ============================================================================

type AnchorVariants = Record<Locale, string[]>;

/**
 * Anchor text variants for product links.
 * Each locale has multiple phrasings to avoid over-optimisation.
 */
const PRODUCT_ANCHOR_VARIANTS: AnchorVariants = {
  fr: [
    'voir le produit',
    'détails du produit',
    'en savoir plus',
    'consulter la fiche produit',
    'découvrir ce produit',
  ],
  en: [
    'view product',
    'product details',
    'learn more',
    'see product page',
    'explore this product',
  ],
  es: [
    'ver producto',
    'detalles del producto',
    'saber más',
    'consultar ficha',
    'explorar producto',
  ],
  de: [
    'Produkt ansehen',
    'Produktdetails',
    'mehr erfahren',
    'Produktseite aufrufen',
    'Produkt entdecken',
  ],
  ru: [
    'посмотреть продукт',
    'подробнее о продукте',
    'узнать больше',
    'открыть страницу продукта',
    'изучить продукт',
  ],
};

/** Anchor text variants for price page links */
const PRICE_ANCHOR_VARIANTS: AnchorVariants = {
  fr: [
    'voir les prix',
    'prix actuels',
    'consulter les tarifs',
    'cours du marché',
    'prix en temps réel',
  ],
  en: [
    'view prices',
    'current prices',
    'check rates',
    'market prices',
    'real-time pricing',
  ],
  es: [
    'ver precios',
    'precios actuales',
    'consultar tarifas',
    'precios de mercado',
    'cotización actual',
  ],
  de: [
    'Preise ansehen',
    'aktuelle Preise',
    'Preise prüfen',
    'Marktpreise',
    'Echtzeit-Preise',
  ],
  ru: [
    'посмотреть цены',
    'текущие цены',
    'проверить тарифы',
    'рыночные цены',
    'цены в реальном времени',
  ],
};

/** Anchor text variants for export destination links */
const COUNTRY_ANCHOR_VARIANTS: AnchorVariants = {
  fr: [
    'export vers ce pays',
    'destination d\'export',
    'marché cible',
    'voir les détails d\'export',
    'informations d\'exportation',
  ],
  en: [
    'export to this country',
    'export destination',
    'target market',
    'view export details',
    'export information',
  ],
  es: [
    'exportar a este país',
    'destino de exportación',
    'mercado objetivo',
    'ver detalles de exportación',
    'información de exportación',
  ],
  de: [
    'Export in dieses Land',
    'Exportziel',
    'Zielmarkt',
    'Exportdetails ansehen',
    'Exportinformationen',
  ],
  ru: [
    'экспорт в эту страну',
    'направление экспорта',
    'целевой рынок',
    'подробности экспорта',
    'информация об экспорте',
  ],
};

/** Anchor text variants for comparison/guide links */
const COMPARISON_ANCHOR_VARIANTS: AnchorVariants = {
  fr: [
    'comparer les produits',
    'guide comparatif',
    'voir la comparaison',
    'analyse comparative',
    'différences et similitudes',
  ],
  en: [
    'compare products',
    'comparison guide',
    'view comparison',
    'comparative analysis',
    'differences and similarities',
  ],
  es: [
    'comparar productos',
    'guía comparativa',
    'ver comparación',
    'análisis comparativo',
    'diferencias y similitudes',
  ],
  de: [
    'Produkte vergleichen',
    'Vergleichsguide',
    'Vergleich ansehen',
    'vergleichende Analyse',
    'Unterschiede und Gemeinsamkeiten',
  ],
  ru: [
    'сравнить продукты',
    'сравнительный гид',
    'посмотреть сравнение',
    'сравнительный анализ',
    'различия и сходства',
  ],
};

// ============================================================================
// Breadcrumb Label Translations
// ============================================================================

const BREADCRUMB_LABELS: Record<string, Record<Locale, string>> = {
  home: { fr: 'Accueil', en: 'Home', es: 'Inicio', de: 'Startseite', ru: 'Главная' },
  products: { fr: 'Produits', en: 'Products', es: 'Productos', de: 'Produkte', ru: 'Продукты' },
  prices: { fr: 'Prix', en: 'Prices', es: 'Precios', de: 'Preise', ru: 'Цены' },
  guides: { fr: 'Guides', en: 'Guides', es: 'Guías', de: 'Ratgeber', ru: 'Руководства' },
  export: { fr: 'Export', en: 'Export', es: 'Exportación', de: 'Export', ru: 'Экспорт' },
};

// ============================================================================
// Core: varyAnchorText (Requirement 1.13.6)
// ============================================================================

/**
 * Selects a varied anchor text from a pool to avoid over-optimisation.
 * Uses a deterministic index based on the URL to ensure consistency
 * across renders while still varying across different links.
 *
 * @param pool - Array of anchor text variants
 * @param seed - Deterministic seed (e.g. URL string)
 * @returns Selected anchor text
 */
export function varyAnchorText(pool: string[], seed: string): string {
  if (pool.length === 0) return seed;
  const hash = seed.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return pool[hash % pool.length];
}

// ============================================================================
// Core: generateBreadcrumb (Requirement 1.13.4)
// ============================================================================

/**
 * Generates a breadcrumb trail with clickable links for a given page context.
 *
 * Structure varies by page type:
 * - product-country: Home > Products > [Product] > Export [Country]
 * - price:           Home > Prices > [Product] Price
 * - comparison:      Home > Guides > [ProductA] vs [ProductB]
 *
 * @param context - Page context describing the current page
 * @returns BreadcrumbItem[] ordered from root to current page
 */
export function generateBreadcrumb(context: PageContext): BreadcrumbItem[] {
  const { locale } = context;
  const label = (key: string) => BREADCRUMB_LABELS[key]?.[locale] ?? BREADCRUMB_LABELS[key]?.en ?? key;

  const home: BreadcrumbItem = {
    name: label('home'),
    url: `${BASE_URL}/${locale}`,
    position: 1,
  };

  switch (context.type) {
    case 'product-country': {
      const productName = getLocalizedName(context.product.name, locale);
      const countryName = getLocalizedName(context.country.name, locale);
      const productSlug = context.product.slug.current;
      const countrySlug = context.country.slug.current;

      return [
        home,
        {
          name: label('products'),
          url: `${BASE_URL}/${locale}/produits`,
          position: 2,
        },
        {
          name: productName,
          url: `${BASE_URL}/${locale}/produits/${productSlug}`,
          position: 3,
        },
        {
          name: `${label('export')} ${countryName}`,
          url: `${BASE_URL}/${locale}/produits/${productSlug}/export-${countrySlug}`,
          position: 4,
        },
      ];
    }

    case 'price': {
      const productName = getLocalizedName(context.product.name, locale);
      const productSlug = context.product.slug.current;

      return [
        home,
        {
          name: label('prices'),
          url: `${BASE_URL}/${locale}/prix`,
          position: 2,
        },
        {
          name: productName,
          url: `${BASE_URL}/${locale}/prix/${productSlug}-cameroun`,
          position: 3,
        },
      ];
    }

    case 'comparison': {
      const nameA = getLocalizedName(context.productA.name, locale);
      const nameB = getLocalizedName(context.productB.name, locale);
      const slugA = context.productA.slug.current;
      const slugB = context.productB.slug.current;

      return [
        home,
        {
          name: label('guides'),
          url: `${BASE_URL}/${locale}/guide`,
          position: 2,
        },
        {
          name: `${nameA} vs ${nameB}`,
          url: `${BASE_URL}/${locale}/guide/${slugA}-vs-${slugB}`,
          position: 3,
        },
      ];
    }
  }
}

// ============================================================================
// Core: generateRelatedLinks (Requirements 1.13.1–1.13.5, 1.13.7)
// ============================================================================

/**
 * Generates 4–6 relevant internal links for a given page context.
 *
 * Link strategy per page type:
 * - product-country: price page for same product + other country pages + comparison pages
 * - price:           product-country pages + comparison pages
 * - comparison:      price pages for both products + product-country pages
 *
 * Indexable pages are prioritised over non-indexable ones (Requirement 1.13.7).
 * Anchor texts are varied using varyAnchorText() (Requirement 1.13.6).
 *
 * @param context - Page context describing the current page
 * @param indexableUrls - Set of URLs known to be indexable (for prioritisation)
 * @returns InternalLink[] with 4–6 links, indexable pages first
 */
export function generateRelatedLinks(
  context: PageContext,
  indexableUrls: Set<string> = new Set()
): InternalLink[] {
  const { locale } = context;
  const candidates: InternalLink[] = [];

  switch (context.type) {
    case 'product-country': {
      const { product, country, relatedCountries = [], relatedProducts = [] } = context;
      const productSlug = product.slug.current;
      const countrySlug = country.slug.current;

      // 1. Price page for this product (Requirement 1.13.2)
      const priceUrl = `${BASE_URL}/${locale}/prix/${productSlug}-cameroun`;
      candidates.push({
        url: priceUrl,
        anchorText: varyAnchorText(PRICE_ANCHOR_VARIANTS[locale], priceUrl),
        locale,
        isIndexable: indexableUrls.has(priceUrl),
      });

      // 2. Other country pages for the same product
      for (const relCountry of relatedCountries) {
        if (relCountry.slug.current === countrySlug) continue;
        const url = `${BASE_URL}/${locale}/produits/${productSlug}/export-${relCountry.slug.current}`;
        const countryName = getLocalizedName(relCountry.name, locale);
        candidates.push({
          url,
          anchorText: varyAnchorText(COUNTRY_ANCHOR_VARIANTS[locale], url) + ` — ${countryName}`,
          locale,
          isIndexable: indexableUrls.has(url),
        });
      }

      // 3. Same country pages for related products
      for (const relProduct of relatedProducts) {
        if (relProduct.slug.current === productSlug) continue;
        const url = `${BASE_URL}/${locale}/produits/${relProduct.slug.current}/export-${countrySlug}`;
        const productName = getLocalizedName(relProduct.name, locale);
        candidates.push({
          url,
          anchorText: varyAnchorText(PRODUCT_ANCHOR_VARIANTS[locale], url) + ` — ${productName}`,
          locale,
          isIndexable: indexableUrls.has(url),
        });
      }

      // 4. Comparison pages between related products
      for (const relProduct of relatedProducts) {
        if (relProduct.slug.current === productSlug) continue;
        const [slugA, slugB] = [productSlug, relProduct.slug.current].sort();
        const url = `${BASE_URL}/${locale}/guide/${slugA}-vs-${slugB}`;
        candidates.push({
          url,
          anchorText: varyAnchorText(COMPARISON_ANCHOR_VARIANTS[locale], url),
          locale,
          isIndexable: indexableUrls.has(url),
        });
      }
      break;
    }

    case 'price': {
      const { product, relatedProducts = [], relatedCountries = [] } = context;
      const productSlug = product.slug.current;

      // 1. Product × country pages (Requirement 1.13.2)
      for (const country of relatedCountries) {
        const url = `${BASE_URL}/${locale}/produits/${productSlug}/export-${country.slug.current}`;
        const countryName = getLocalizedName(country.name, locale);
        candidates.push({
          url,
          anchorText: varyAnchorText(COUNTRY_ANCHOR_VARIANTS[locale], url) + ` — ${countryName}`,
          locale,
          isIndexable: indexableUrls.has(url),
        });
      }

      // 2. Price pages for related products
      for (const relProduct of relatedProducts) {
        if (relProduct.slug.current === productSlug) continue;
        const url = `${BASE_URL}/${locale}/prix/${relProduct.slug.current}-cameroun`;
        const productName = getLocalizedName(relProduct.name, locale);
        candidates.push({
          url,
          anchorText: varyAnchorText(PRICE_ANCHOR_VARIANTS[locale], url) + ` — ${productName}`,
          locale,
          isIndexable: indexableUrls.has(url),
        });
      }

      // 3. Comparison pages
      for (const relProduct of relatedProducts) {
        if (relProduct.slug.current === productSlug) continue;
        const [slugA, slugB] = [productSlug, relProduct.slug.current].sort();
        const url = `${BASE_URL}/${locale}/guide/${slugA}-vs-${slugB}`;
        candidates.push({
          url,
          anchorText: varyAnchorText(COMPARISON_ANCHOR_VARIANTS[locale], url),
          locale,
          isIndexable: indexableUrls.has(url),
        });
      }
      break;
    }

    case 'comparison': {
      const { productA, productB, relatedProducts = [] } = context;
      const slugA = productA.slug.current;
      const slugB = productB.slug.current;

      // 1. Price pages for both compared products (Requirement 1.13.3)
      for (const product of [productA, productB]) {
        const url = `${BASE_URL}/${locale}/prix/${product.slug.current}-cameroun`;
        const productName = getLocalizedName(product.name, locale);
        candidates.push({
          url,
          anchorText: varyAnchorText(PRICE_ANCHOR_VARIANTS[locale], url) + ` — ${productName}`,
          locale,
          isIndexable: indexableUrls.has(url),
        });
      }

      // 2. Other comparison pages involving these products
      for (const relProduct of relatedProducts) {
        if (relProduct.slug.current === slugA || relProduct.slug.current === slugB) continue;

        for (const baseSlug of [slugA, slugB]) {
          const [s1, s2] = [baseSlug, relProduct.slug.current].sort();
          const url = `${BASE_URL}/${locale}/guide/${s1}-vs-${s2}`;
          candidates.push({
            url,
            anchorText: varyAnchorText(COMPARISON_ANCHOR_VARIANTS[locale], url),
            locale,
            isIndexable: indexableUrls.has(url),
          });
        }
      }
      break;
    }
  }

  return selectLinks(candidates);
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Selects 4–6 links from candidates, prioritising indexable pages.
 * Deduplicates by URL before selection (Requirement 1.13.7).
 */
function selectLinks(candidates: InternalLink[]): InternalLink[] {
  // Deduplicate by URL
  const seen = new Set<string>();
  const unique = candidates.filter((link) => {
    if (seen.has(link.url)) return false;
    seen.add(link.url);
    return true;
  });

  // Sort: indexable first, then non-indexable
  const sorted = [
    ...unique.filter((l) => l.isIndexable),
    ...unique.filter((l) => !l.isIndexable),
  ];

  // Clamp to [MIN_RELATED_LINKS, MAX_RELATED_LINKS]
  return sorted.slice(0, MAX_RELATED_LINKS).length >= MIN_RELATED_LINKS
    ? sorted.slice(0, MAX_RELATED_LINKS)
    : sorted.slice(0, Math.max(sorted.length, MIN_RELATED_LINKS));
}

/**
 * Returns the localised name string, falling back to English then French.
 */
function getLocalizedName(
  name: { fr: string; en: string; es?: string; de?: string; ru?: string },
  locale: Locale
): string {
  return name[locale] ?? name.en ?? name.fr;
}
