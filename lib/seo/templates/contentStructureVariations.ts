/**
 * Content Structure Variations
 *
 * Defines different section orderings and structures for each page type
 * to avoid duplicate content penalties across similar pages.
 *
 * Each variation produces a meaningfully different page layout:
 *  - Different section ordering
 *  - Different emphasis (logistics-first vs quality-first vs price-first)
 *  - Different content depth per section
 *
 * @see Requirements 1.6.4, 1.6.7
 */

import type { Locale, ContentSourceType } from '@/types/seo';

// ============================================================================
// Types
// ============================================================================

export type SectionType =
  | 'intro'
  | 'quality'
  | 'logistics'
  | 'pricing'
  | 'certifications'
  | 'market'
  | 'faq'
  | 'cta'
  | 'comparison_table'
  | 'taste'
  | 'applications'
  | 'recommendations'
  | 'price_chart'
  | 'price_trend'
  | 'price_factors';

export interface SectionConfig {
  type: SectionType;
  /** Relative weight/importance — affects heading level and word count target */
  weight: 'primary' | 'secondary' | 'tertiary';
  /** Minimum word count target for this section */
  minWords: number;
  sourceType: ContentSourceType;
}

export interface ContentStructure {
  id: string;
  description: string;
  sections: SectionConfig[];
}

// ============================================================================
// Product × Country structures (3 variations)
// ============================================================================

/** Variation A: Logistics-first — emphasizes transit, ports, customs */
const PRODUCT_COUNTRY_STRUCTURE_A: ContentStructure = {
  id: 'product-country-logistics-first',
  description: 'Logistics-first structure: intro → logistics → quality → certifications → market → pricing → FAQ → CTA',
  sections: [
    { type: 'intro',          weight: 'primary',   minWords: 80,  sourceType: 'template' },
    { type: 'logistics',      weight: 'primary',   minWords: 100, sourceType: 'calculated' },
    { type: 'quality',        weight: 'secondary', minWords: 80,  sourceType: 'template' },
    { type: 'certifications', weight: 'secondary', minWords: 60,  sourceType: 'sanity' },
    { type: 'market',         weight: 'tertiary',  minWords: 60,  sourceType: 'template' },
    { type: 'pricing',        weight: 'tertiary',  minWords: 50,  sourceType: 'calculated' },
    { type: 'faq',            weight: 'secondary', minWords: 100, sourceType: 'template' },
    { type: 'cta',            weight: 'tertiary',  minWords: 30,  sourceType: 'editorial' },
  ],
};

/** Variation B: Quality-first — emphasizes product quality, certifications, origin */
const PRODUCT_COUNTRY_STRUCTURE_B: ContentStructure = {
  id: 'product-country-quality-first',
  description: 'Quality-first structure: intro → quality → certifications → market → logistics → pricing → FAQ → CTA',
  sections: [
    { type: 'intro',          weight: 'primary',   minWords: 80,  sourceType: 'template' },
    { type: 'quality',        weight: 'primary',   minWords: 100, sourceType: 'template' },
    { type: 'certifications', weight: 'primary',   minWords: 80,  sourceType: 'sanity' },
    { type: 'market',         weight: 'secondary', minWords: 70,  sourceType: 'template' },
    { type: 'logistics',      weight: 'secondary', minWords: 70,  sourceType: 'calculated' },
    { type: 'pricing',        weight: 'tertiary',  minWords: 50,  sourceType: 'calculated' },
    { type: 'faq',            weight: 'secondary', minWords: 100, sourceType: 'template' },
    { type: 'cta',            weight: 'tertiary',  minWords: 30,  sourceType: 'editorial' },
  ],
};

/** Variation C: Market-first — emphasizes destination market, demand, sectors */
const PRODUCT_COUNTRY_STRUCTURE_C: ContentStructure = {
  id: 'product-country-market-first',
  description: 'Market-first structure: intro → market → pricing → quality → logistics → certifications → FAQ → CTA',
  sections: [
    { type: 'intro',          weight: 'primary',   minWords: 80,  sourceType: 'template' },
    { type: 'market',         weight: 'primary',   minWords: 100, sourceType: 'template' },
    { type: 'pricing',        weight: 'primary',   minWords: 80,  sourceType: 'calculated' },
    { type: 'quality',        weight: 'secondary', minWords: 70,  sourceType: 'template' },
    { type: 'logistics',      weight: 'secondary', minWords: 70,  sourceType: 'calculated' },
    { type: 'certifications', weight: 'tertiary',  minWords: 50,  sourceType: 'sanity' },
    { type: 'faq',            weight: 'secondary', minWords: 100, sourceType: 'template' },
    { type: 'cta',            weight: 'tertiary',  minWords: 30,  sourceType: 'editorial' },
  ],
};

export const PRODUCT_COUNTRY_STRUCTURES: ContentStructure[] = [
  PRODUCT_COUNTRY_STRUCTURE_A,
  PRODUCT_COUNTRY_STRUCTURE_B,
  PRODUCT_COUNTRY_STRUCTURE_C,
];

// ============================================================================
// Price page structures (2 variations)
// ============================================================================

/** Variation A: Chart-first — price chart prominently at top */
const PRICE_STRUCTURE_A: ContentStructure = {
  id: 'price-chart-first',
  description: 'Chart-first: intro → price_chart → price_trend → pricing → price_factors → FAQ → CTA',
  sections: [
    { type: 'intro',         weight: 'primary',   minWords: 60,  sourceType: 'template' },
    { type: 'price_chart',   weight: 'primary',   minWords: 50,  sourceType: 'calculated' },
    { type: 'price_trend',   weight: 'primary',   minWords: 80,  sourceType: 'calculated' },
    { type: 'pricing',       weight: 'secondary', minWords: 70,  sourceType: 'calculated' },
    { type: 'price_factors', weight: 'secondary', minWords: 80,  sourceType: 'template' },
    { type: 'faq',           weight: 'secondary', minWords: 100, sourceType: 'template' },
    { type: 'cta',           weight: 'tertiary',  minWords: 30,  sourceType: 'editorial' },
  ],
};

/** Variation B: Context-first — market context before chart */
const PRICE_STRUCTURE_B: ContentStructure = {
  id: 'price-context-first',
  description: 'Context-first: intro → price_factors → price_trend → price_chart → pricing → FAQ → CTA',
  sections: [
    { type: 'intro',         weight: 'primary',   minWords: 60,  sourceType: 'template' },
    { type: 'price_factors', weight: 'primary',   minWords: 100, sourceType: 'template' },
    { type: 'price_trend',   weight: 'primary',   minWords: 80,  sourceType: 'calculated' },
    { type: 'price_chart',   weight: 'secondary', minWords: 50,  sourceType: 'calculated' },
    { type: 'pricing',       weight: 'secondary', minWords: 70,  sourceType: 'calculated' },
    { type: 'faq',           weight: 'secondary', minWords: 100, sourceType: 'template' },
    { type: 'cta',           weight: 'tertiary',  minWords: 30,  sourceType: 'editorial' },
  ],
};

export const PRICE_STRUCTURES: ContentStructure[] = [
  PRICE_STRUCTURE_A,
  PRICE_STRUCTURE_B,
];

// ============================================================================
// Comparison page structures (2 variations)
// ============================================================================

/** Variation A: Table-first — comparison table at top */
const COMPARISON_STRUCTURE_A: ContentStructure = {
  id: 'comparison-table-first',
  description: 'Table-first: intro → comparison_table → taste → quality → applications → recommendations → FAQ → CTA',
  sections: [
    { type: 'intro',             weight: 'primary',   minWords: 80,  sourceType: 'template' },
    { type: 'comparison_table',  weight: 'primary',   minWords: 60,  sourceType: 'calculated' },
    { type: 'taste',             weight: 'secondary', minWords: 80,  sourceType: 'template' },
    { type: 'quality',           weight: 'secondary', minWords: 80,  sourceType: 'template' },
    { type: 'applications',      weight: 'secondary', minWords: 80,  sourceType: 'template' },
    { type: 'recommendations',   weight: 'primary',   minWords: 80,  sourceType: 'template' },
    { type: 'faq',               weight: 'secondary', minWords: 100, sourceType: 'template' },
    { type: 'cta',               weight: 'tertiary',  minWords: 30,  sourceType: 'editorial' },
  ],
};

/** Variation B: Narrative-first — story before table */
const COMPARISON_STRUCTURE_B: ContentStructure = {
  id: 'comparison-narrative-first',
  description: 'Narrative-first: intro → taste → quality → applications → comparison_table → recommendations → FAQ → CTA',
  sections: [
    { type: 'intro',             weight: 'primary',   minWords: 80,  sourceType: 'template' },
    { type: 'taste',             weight: 'primary',   minWords: 100, sourceType: 'template' },
    { type: 'quality',           weight: 'primary',   minWords: 80,  sourceType: 'template' },
    { type: 'applications',      weight: 'secondary', minWords: 80,  sourceType: 'template' },
    { type: 'comparison_table',  weight: 'secondary', minWords: 60,  sourceType: 'calculated' },
    { type: 'recommendations',   weight: 'primary',   minWords: 80,  sourceType: 'template' },
    { type: 'faq',               weight: 'secondary', minWords: 100, sourceType: 'template' },
    { type: 'cta',               weight: 'tertiary',  minWords: 30,  sourceType: 'editorial' },
  ],
};

export const COMPARISON_STRUCTURES: ContentStructure[] = [
  COMPARISON_STRUCTURE_A,
  COMPARISON_STRUCTURE_B,
];

// ============================================================================
// Section heading translations
// ============================================================================

export const SECTION_HEADINGS: Record<SectionType, Record<Locale, string>> = {
  intro: {
    fr: 'Introduction',
    en: 'Introduction',
    es: 'Introducción',
    de: 'Einführung',
    ru: 'Введение',
  },
  quality: {
    fr: 'Qualité et caractéristiques',
    en: 'Quality and characteristics',
    es: 'Calidad y características',
    de: 'Qualität und Eigenschaften',
    ru: 'Качество и характеристики',
  },
  logistics: {
    fr: 'Logistique et délais',
    en: 'Logistics and transit times',
    es: 'Logística y plazos',
    de: 'Logistik und Lieferzeiten',
    ru: 'Логистика и сроки',
  },
  pricing: {
    fr: 'Prix et conditions commerciales',
    en: 'Pricing and commercial terms',
    es: 'Precios y condiciones comerciales',
    de: 'Preise und Handelsbedingungen',
    ru: 'Цены и коммерческие условия',
  },
  certifications: {
    fr: 'Certifications et conformité',
    en: 'Certifications and compliance',
    es: 'Certificaciones y conformidad',
    de: 'Zertifizierungen und Konformität',
    ru: 'Сертификаты и соответствие',
  },
  market: {
    fr: 'Le marché destination',
    en: 'The destination market',
    es: 'El mercado de destino',
    de: 'Der Zielmarkt',
    ru: 'Рынок назначения',
  },
  faq: {
    fr: 'Questions fréquentes',
    en: 'Frequently asked questions',
    es: 'Preguntas frecuentes',
    de: 'Häufig gestellte Fragen',
    ru: 'Часто задаваемые вопросы',
  },
  cta: {
    fr: 'Demander un devis',
    en: 'Request a quote',
    es: 'Solicitar presupuesto',
    de: 'Angebot anfordern',
    ru: 'Запросить предложение',
  },
  comparison_table: {
    fr: 'Tableau comparatif',
    en: 'Comparison table',
    es: 'Tabla comparativa',
    de: 'Vergleichstabelle',
    ru: 'Сравнительная таблица',
  },
  taste: {
    fr: 'Profils aromatiques et goût',
    en: 'Aromatic profiles and taste',
    es: 'Perfiles aromáticos y sabor',
    de: 'Aromatische Profile und Geschmack',
    ru: 'Ароматические профили и вкус',
  },
  applications: {
    fr: 'Applications industrielles',
    en: 'Industrial applications',
    es: 'Aplicaciones industriales',
    de: 'Industrielle Anwendungen',
    ru: 'Промышленные применения',
  },
  recommendations: {
    fr: 'Notre recommandation',
    en: 'Our recommendation',
    es: 'Nuestra recomendación',
    de: 'Unsere Empfehlung',
    ru: 'Наша рекомендация',
  },
  price_chart: {
    fr: 'Évolution des prix sur 30 jours',
    en: '30-day price evolution',
    es: 'Evolución de precios en 30 días',
    de: 'Preisentwicklung über 30 Tage',
    ru: 'Динамика цен за 30 дней',
  },
  price_trend: {
    fr: 'Tendance et analyse',
    en: 'Trend and analysis',
    es: 'Tendencia y análisis',
    de: 'Trend und Analyse',
    ru: 'Тренд и анализ',
  },
  price_factors: {
    fr: 'Facteurs influençant les prix',
    en: 'Price influencing factors',
    es: 'Factores que influyen en los precios',
    de: 'Preisbeeinflussende Faktoren',
    ru: 'Факторы, влияющие на цены',
  },
};

// ============================================================================
// Structure selector
// ============================================================================

export type PageTypeForStructure = 'productCountry' | 'price' | 'comparison';

const STRUCTURE_MAP: Record<PageTypeForStructure, ContentStructure[]> = {
  productCountry: PRODUCT_COUNTRY_STRUCTURES,
  price: PRICE_STRUCTURES,
  comparison: COMPARISON_STRUCTURES,
};

/**
 * Selects a content structure variation deterministically based on a hash key.
 * Different pages get different structures; the same page always gets the same one.
 *
 * @param pageType - The type of page
 * @param hashKey - A string to hash (e.g. product slug + country slug)
 */
export function selectContentStructure(
  pageType: PageTypeForStructure,
  hashKey: string
): ContentStructure {
  const structures = STRUCTURE_MAP[pageType];
  const hash = hashKey
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return structures[hash % structures.length];
}

/**
 * Returns the total minimum word count for a given structure.
 * Used to verify the 500-word minimum requirement.
 */
export function getTotalMinWords(structure: ContentStructure): number {
  return structure.sections.reduce((sum, s) => sum + s.minWords, 0);
}
