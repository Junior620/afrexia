/**
 * Type definitions for the Programmatic SEO system
 * 
 * This file contains all TypeScript types and interfaces used throughout
 * the SEO programmatic implementation for Afrexia.
 */

// ============================================================================
// Core Types
// ============================================================================

/**
 * Supported locales for the SEO system
 */
export type Locale = 'fr' | 'en' | 'es' | 'de' | 'ru';

/**
 * Content source types to track where content originates
 */
export type ContentSourceType = 'sanity' | 'calculated' | 'template' | 'editorial';

/**
 * Localized string object with translations for all supported locales
 */
export interface LocalizedString {
  fr: string;
  en: string;
  es?: string;
  de?: string;
  ru?: string;
}

// ============================================================================
// Sanity Entity Types
// ============================================================================

/**
 * Export country entity from Sanity
 */
export interface ExportCountry {
  _id: string;
  _type: 'exportCountry';
  name: LocalizedString;
  slug: { current: string };
  code: string; // ISO 3166-1 alpha-2
  flag?: string;
  description?: LocalizedString;
  targetMarkets?: string[];
  mainPorts?: DestinationPort[];
  requiredCertifications?: Certification[];
  customsInfo?: LocalizedString;
  averageTransitTime?: {
    days: number;
    note?: LocalizedString;
  };
  dataCompleteness: number; // 0-100
  approvedForSEO: boolean;
}

/**
 * Destination port entity from Sanity
 */
export interface DestinationPort {
  _id: string;
  _type: 'destinationPort';
  name: LocalizedString;
  slug: { current: string };
  city: string;
  country: ExportCountry;
  locode: string; // UN/LOCODE
  coordinates?: {
    lat: number;
    lng: number;
  };
  description?: LocalizedString;
  capacity?: {
    teu: number;
    note?: LocalizedString;
  };
  transitTimeFromDouala?: {
    days: number;
    note?: LocalizedString;
  };
  estimatedCost?: {
    amount: number;
    currency: string;
    unit: string;
    note?: LocalizedString;
  };
  supportedIncoterms?: Incoterm[];
  dataCompleteness: number;
  approvedForSEO: boolean;
}

/**
 * Harvest season entity from Sanity
 */
export interface HarvestSeason {
  _id: string;
  _type: 'harvestSeason';
  product: Product;
  region: string;
  startMonth: number; // 1-12
  endMonth: number; // 1-12
  peakMonths?: number[];
  availability?: LocalizedString;
  qualityVariations?: LocalizedString;
  priceVariations?: LocalizedString;
  recommendations?: LocalizedString;
  dataCompleteness: number;
  approvedForSEO: boolean;
}

/**
 * Incoterm entity from Sanity
 */
export interface Incoterm {
  _id: string;
  _type: 'incoterm';
  code: string; // FOB, CIF, etc.
  name: LocalizedString;
  slug: { current: string };
  description?: LocalizedString;
  sellerResponsibilities?: LocalizedString;
  buyerResponsibilities?: LocalizedString;
  applicableProducts?: Product[];
  applicablePorts?: DestinationPort[];
  requiredDocuments?: string[];
  dataCompleteness: number;
  approvedForSEO: boolean;
}

/**
 * Container type entity from Sanity
 */
export interface ContainerType {
  _id: string;
  _type: 'containerType';
  type: string; // 20ft, 40ft, etc.
  slug: { current: string };
  name: LocalizedString;
  capacity?: {
    value: number;
    unit: string;
  };
  dimensions?: {
    length: number;
    width: number;
    height: number;
    volume: number;
  };
  suitableProducts?: Product[];
  pricing?: {
    basePrice: number;
    currency: string;
    note?: LocalizedString;
  };
  description?: LocalizedString;
  dataCompleteness: number;
  approvedForSEO: boolean;
}

/**
 * Product entity (existing in Sanity)
 */
export interface Product {
  _id: string;
  _type: 'product';
  name: LocalizedString;
  slug: { current: string };
  description?: LocalizedString;
  category?: string;
  certifications?: Certification[];
  // Add other existing product fields as needed
}

/**
 * Certification entity (existing in Sanity)
 */
export interface Certification {
  _id: string;
  _type: 'certification';
  name: LocalizedString;
  slug: { current: string };
  description?: LocalizedString;
  criteria?: LocalizedString;
  benefits?: LocalizedString;
  applicableProducts?: Product[];
  // Add other existing certification fields as needed
}

// ============================================================================
// Route Validation Types
// ============================================================================

/**
 * Result of route combination validation
 */
export interface RouteValidationResult {
  isValid: boolean;
  reason?: string;
  dataCompleteness?: number;
  approvedForSEO?: boolean;
}

/**
 * Validation report for route combinations
 */
export interface ValidationReport {
  totalCombinations: number;
  validCombinations: number;
  rejectedCombinations: number;
  rejectionReasons: Record<string, number>;
}

// ============================================================================
// Content Generation Types
// ============================================================================

/**
 * Content block with source tracking
 */
export interface ContentBlock {
  content: string;
  sourceType: ContentSourceType;
  locale: Locale;
  wordCount: number;
}

/**
 * FAQ item
 */
export interface FAQ {
  question: string;
  answer: string;
  locale: Locale;
}

/**
 * Content distribution report
 */
export interface ContentDistribution {
  sanity: number; // percentage
  calculated: number;
  template: number;
  editorial: number;
}

// ============================================================================
// SEO Metadata Types
// ============================================================================

/**
 * Page metadata for SEO
 */
export interface PageMetadata {
  title: string;
  description: string;
  canonical: string;
  /** Hreflang map including all 5 locales plus 'x-default' pointing to French */
  hreflang: Record<Locale | 'x-default', string>;
  openGraph: {
    title: string;
    description: string;
    image?: string;
    url: string;
  };
  twitter: {
    card: 'summary' | 'summary_large_image';
    title: string;
    description: string;
    image?: string;
  };
  robots: 'index, follow' | 'noindex, follow';
}

/**
 * Schema.org structured data
 */
export interface SchemaOrgData {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: any;
}

// ============================================================================
// Quality Control Types
// ============================================================================

/**
 * Quality thresholds for page indexability
 */
export interface QualityThreshold {
  minDataCompleteness: number; // percentage
  minContentLength: number; // words
  maxFallbackPercentage: number; // percentage
}

/**
 * Indexability decision result
 */
export interface IndexabilityDecision {
  isIndexable: boolean;
  reasons: string[];
  dataCompleteness: number;
  contentLength: number;
  fallbackPercentage: number;
}

/**
 * Indexability report
 */
export interface IndexabilityReport {
  totalPages: number;
  indexablePages: number;
  nonIndexablePages: number;
  reasonsBreakdown: Record<string, number>;
}

// ============================================================================
// Sitemap Types
// ============================================================================

/**
 * Sitemap entry
 */
export interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number; // 0.0 - 1.0
  locale: Locale;
}

/**
 * Sitemap section
 */
export interface SitemapSection {
  name: string;
  entries: SitemapEntry[];
}

// ============================================================================
// Internal Linking Types
// ============================================================================

/**
 * Internal link
 */
export interface InternalLink {
  url: string;
  anchorText: string;
  locale: Locale;
  isIndexable: boolean;
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
  position: number;
}

// ============================================================================
// Data Freshness Types
// ============================================================================

/**
 * Data freshness indicator
 */
export interface DataFreshnessIndicator {
  lastUpdated: Date;
  source: string;
  isEstimated: boolean;
  disclaimer?: LocalizedString;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Default quality thresholds
 */
export const DEFAULT_QUALITY_THRESHOLD: QualityThreshold = {
  minDataCompleteness: 70,
  minContentLength: 500,
  maxFallbackPercentage: 30,
};

/**
 * ISR revalidation times (in seconds)
 */
export const ISR_REVALIDATION = {
  PRICE_PAGES: 86400, // 24 hours
  PRODUCT_PAGES: 604800, // 7 days
  COMPARISON_PAGES: 604800, // 7 days
  CERTIFICATION_PAGES: 604800, // 7 days
  PORT_PAGES: 604800, // 7 days
  SEASON_PAGES: 31536000, // 1 year
} as const;

/**
 * Supported locales array
 */
export const SUPPORTED_LOCALES: Locale[] = ['fr', 'en', 'es', 'de', 'ru'];

/**
 * Default locale
 */
export const DEFAULT_LOCALE: Locale = 'fr';
