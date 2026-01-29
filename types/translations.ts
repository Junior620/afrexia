/**
 * Translation Type Definitions
 * 
 * Interfaces for catalog translation strings across all supported locales.
 */

/**
 * Supported Locales
 */
export type Locale = 'fr' | 'en' | 'es' | 'de' | 'ru';

/**
 * Search Translations
 */
export interface SearchTranslations {
  placeholder: string;
  noResults: string;
}

/**
 * Filter Translations
 */
export interface FilterTranslations {
  category: string;
  origin: string;
  availability: string;
  certifications: string;
  incoterms: string;
  moq: string;
  clearAll: string;
}

/**
 * Availability Translations
 */
export interface AvailabilityTranslations {
  'in-stock': string;
  limited: string;
  'pre-order': string;
}

/**
 * Product Card Translations
 */
export interface ProductCardTranslations {
  requestQuote: string;
  viewSpecs: string;
  quickView: string;
  origin: string;
  moq: string;
  incoterm: string;
}

/**
 * Trust Element Translations
 */
export interface TrustTranslations {
  response24h: string;
  ndaAvailable: string;
  eudrCompliant: string;
  qaDocumented: string;
  coaAvailable: string;
}

/**
 * RFQ Drawer Translations
 */
export interface RFQTranslations {
  heading: string;
  selectedProducts: string;
  contactInfo: string;
  orderDetails: string;
  submit: string;
  success: string;
  error: string;
  fields: {
    name: string;
    email: string;
    company: string;
    phone: string;
    quantity: string;
    deliveryLocation: string;
    incoterm: string;
    notes: string;
  };
  validation: {
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    companyRequired: string;
    phoneInvalid: string;
    quantityRequired: string;
    quantityBelowMOQ: string;
    deliveryLocationRequired: string;
  };
}

/**
 * Quick View Modal Translations
 */
export interface QuickViewTranslations {
  heading: string;
  specifications: string;
  certifications: string;
  documents: string;
  availableDocuments: string;
  requestQuote: string;
  viewFullPage: string;
  close: string;
}

/**
 * Catalog Download Modal Translations
 */
export interface DownloadTranslations {
  heading: string;
  description: string;
  downloadButton: string;
  privacyMessage: string;
  fields: {
    name: string;
    email: string;
    company: string;
    country: string;
  };
  validation: {
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    companyRequired: string;
    countryRequired: string;
  };
}

/**
 * Process & Compliance Section Translations
 */
export interface ComplianceTranslations {
  heading: string;
  qualityStandards: {
    title: string;
    description: string;
  };
  traceability: {
    title: string;
    description: string;
  };
  certifications: {
    title: string;
    description: string;
  };
}

/**
 * Complete Catalog Translations
 * All translation strings for the catalog page
 */
export interface CatalogTranslations {
  heading: string;
  subtitle: string;
  downloadCatalog: string;
  productCount: string; // e.g., "{count} produits" with placeholder
  search: SearchTranslations;
  filters: FilterTranslations;
  availability: AvailabilityTranslations;
  product: ProductCardTranslations;
  trust: TrustTranslations;
  rfq: RFQTranslations;
  quickView: QuickViewTranslations;
  download: DownloadTranslations;
  compliance: ComplianceTranslations;
}

/**
 * Translation Dictionary
 * Maps locales to their translation objects
 */
export type TranslationDictionary = Record<Locale, CatalogTranslations>;
