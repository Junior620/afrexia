/**
 * Product Catalog Type Definitions
 * 
 * Core data models for the product catalog redesign.
 * These interfaces define the structure for products, filters, categories, origins, and certifications.
 */

/**
 * Sanity Image Reference
 * Represents an image asset from Sanity CMS with optional hotspot and crop data
 */
export interface SanityImage {
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

/**
 * Product Availability Status
 * Indicates current stock status of a product
 */
export type AvailabilityStatus = 'in-stock' | 'limited' | 'pre-order';

/**
 * Product Documents
 * Indicates which compliance and specification documents are available
 */
export interface ProductDocuments {
  coa: boolean; // Certificate of Analysis
  specSheet: boolean; // Technical specification sheet
  chainOfCustody: boolean; // Traceability documentation
}

/**
 * Minimum Order Quantity
 * Defines the minimum quantity required for ordering
 */
export interface MinimumOrderQuantity {
  value: number;
  unit: string; // e.g., 'kg', 'tons', 'bags'
}

/**
 * Product
 * Core product model containing all product information
 */
export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  category: string;
  heroImage: SanityImage;
  availability: AvailabilityStatus;
  origins: string[]; // ISO country codes
  certifications: string[]; // Certification IDs
  eudrReady: boolean; // EU Deforestation Regulation compliance
  qaAvailable: boolean; // Quality Assurance documentation available
  documents: ProductDocuments;
  moq: MinimumOrderQuantity;
  incoterms: string[]; // International Commercial Terms (e.g., 'FOB', 'CIF', 'DAP')
  packaging?: string;
  grade?: string;
  leadTime?: string;
  notes?: string;
  tags: string[]; // Searchable tags
  markets: string[]; // Target markets
  updatedAt: string; // ISO date string
}

/**
 * MOQ Range
 * Defines a range for filtering by minimum order quantity
 */
export interface MOQRange {
  min: number;
  max: number;
}

/**
 * Filter State
 * Represents the current state of all active filters
 */
export interface FilterState {
  search: string;
  category?: string;
  origins: string[];
  availability: AvailabilityStatus[];
  eudrReady?: boolean;
  certifications: string[];
  incoterms: string[];
  moqRange?: MOQRange;
}

/**
 * Filter Type
 * Union type of all possible filter types
 */
export type FilterType = 
  | 'search'
  | 'category' 
  | 'origins' 
  | 'availability' 
  | 'eudrReady' 
  | 'certifications' 
  | 'incoterms' 
  | 'moqRange';

/**
 * Category
 * Product category definition
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

/**
 * Origin
 * Country of origin definition
 */
export interface Origin {
  id: string;
  name: string;
  code: string; // ISO country code (e.g., 'CI', 'GH', 'CM')
  flag?: string; // Flag emoji or image URL
}

/**
 * Certification
 * Product certification definition
 */
export interface Certification {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}
