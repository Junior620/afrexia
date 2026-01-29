/**
 * ProductGrid Component - Usage Examples
 * 
 * This file demonstrates how to use the ProductGrid component
 * with different configurations and scenarios.
 */

import React from 'react';
import { ProductGrid } from './ProductGrid';
import { Product } from '@/types/product';

// Example product data
const exampleProducts: Product[] = [
  {
    id: '1',
    slug: 'premium-cocoa-beans',
    name: 'Premium Cocoa Beans',
    subtitle: 'Single Origin',
    category: 'Cocoa',
    heroImage: {
      asset: {
        _ref: 'image-abc123-1200x900-jpg',
        _type: 'reference',
      },
    },
    availability: 'in-stock',
    origins: ['CI'], // Côte d'Ivoire
    certifications: ['organic', 'fair-trade'],
    eudrReady: true,
    qaAvailable: true,
    documents: {
      coa: true,
      specSheet: true,
      chainOfCustody: true,
    },
    moq: {
      value: 500,
      unit: 'kg',
    },
    incoterms: ['FOB', 'CIF'],
    packaging: 'Sacs 60kg',
    grade: 'Premium',
    leadTime: '4-6 semaines',
    tags: ['cocoa', 'premium', 'organic'],
    markets: ['EU', 'US'],
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    slug: 'arabica-coffee-beans',
    name: 'Arabica Coffee Beans',
    subtitle: 'High Altitude',
    category: 'Coffee',
    heroImage: {
      asset: {
        _ref: 'image-def456-1200x900-jpg',
        _type: 'reference',
      },
    },
    availability: 'limited',
    origins: ['ET'], // Ethiopia
    certifications: ['rainforest-alliance'],
    eudrReady: true,
    qaAvailable: true,
    documents: {
      coa: true,
      specSheet: true,
      chainOfCustody: false,
    },
    moq: {
      value: 1000,
      unit: 'kg',
    },
    incoterms: ['FOB', 'DAP'],
    packaging: 'Sacs 60kg',
    grade: 'Grade 1',
    leadTime: '6-8 semaines',
    tags: ['coffee', 'arabica', 'high-altitude'],
    markets: ['EU', 'Asia'],
    updatedAt: '2024-01-20T14:30:00Z',
  },
];

// Example translations
const exampleTranslations = {
  requestQuote: 'Demander un devis',
  requestQuoteWithDocs: 'Demander un devis + documentation',
  viewSpecs: 'Voir spécifications',
  quickView: 'Aperçu rapide',
  origin: 'Origine',
  moq: 'MOQ',
  incoterm: 'Incoterm',
  documents: {
    coa: 'Certificate of Analysis',
    specSheet: 'Fiche technique',
    chainOfCustody: 'Chaîne de traçabilité',
  },
};

/**
 * Example 1: Basic ProductGrid with Traceability-First Variant
 */
export function BasicProductGridExample() {
  const handleQuoteClick = (product: Product) => {
    console.log('Quote clicked for:', product.name);
  };

  const handleQuickView = (product: Product) => {
    console.log('Quick view for:', product.name);
  };

  const handleProductView = (product: Product) => {
    console.log('Product viewed:', product.name);
  };

  return (
    <ProductGrid
      products={exampleProducts}
      locale="fr"
      translations={exampleTranslations}
      variant="traceability-first"
      onQuoteClick={handleQuoteClick}
      onQuickView={handleQuickView}
      onProductView={handleProductView}
    />
  );
}

/**
 * Example 2: ProductGrid with Luxury-Editorial Variant
 */
export function LuxuryProductGridExample() {
  const handleQuoteClick = (product: Product) => {
    console.log('Quote clicked for:', product.name);
  };

  const handleQuickView = (product: Product) => {
    console.log('Quick view for:', product.name);
  };

  const handleProductView = (product: Product) => {
    console.log('Product viewed:', product.name);
  };

  return (
    <ProductGrid
      products={exampleProducts}
      locale="en"
      translations={{
        requestQuote: 'Request a Quote',
        viewSpecs: 'View Specifications',
        quickView: 'Quick View',
        origin: 'Origin',
        moq: 'MOQ',
        incoterm: 'Incoterm',
        documents: {
          coa: 'Certificate of Analysis',
          specSheet: 'Specification Sheet',
          chainOfCustody: 'Chain of Custody',
        },
      }}
      variant="luxury-editorial"
      onQuoteClick={handleQuoteClick}
      onQuickView={handleQuickView}
      onProductView={handleProductView}
    />
  );
}

/**
 * Example 3: Empty State
 */
export function EmptyProductGridExample() {
  const handleQuoteClick = (product: Product) => {
    console.log('Quote clicked for:', product.name);
  };

  const handleQuickView = (product: Product) => {
    console.log('Quick view for:', product.name);
  };

  const handleProductView = (product: Product) => {
    console.log('Product viewed:', product.name);
  };

  return (
    <ProductGrid
      products={[]} // Empty array
      locale="fr"
      translations={exampleTranslations}
      onQuoteClick={handleQuoteClick}
      onQuickView={handleQuickView}
      onProductView={handleProductView}
    />
  );
}

/**
 * Example 4: Large Product Collection (Testing Grid Layout)
 */
export function LargeProductGridExample() {
  // Generate 12 products for testing grid layout
  const manyProducts = Array.from({ length: 12 }, (_, i) => ({
    ...exampleProducts[0],
    id: `product-${i + 1}`,
    slug: `product-${i + 1}`,
    name: `Product ${i + 1}`,
  }));

  const handleQuoteClick = (product: Product) => {
    console.log('Quote clicked for:', product.name);
  };

  const handleQuickView = (product: Product) => {
    console.log('Quick view for:', product.name);
  };

  const handleProductView = (product: Product) => {
    console.log('Product viewed:', product.name);
  };

  return (
    <ProductGrid
      products={manyProducts}
      locale="fr"
      translations={exampleTranslations}
      onQuoteClick={handleQuoteClick}
      onQuickView={handleQuickView}
      onProductView={handleProductView}
    />
  );
}

/**
 * Responsive Grid Breakpoints Reference:
 * 
 * Mobile (< 768px):     1 column, 16px gap
 * Tablet (768-1024px):  2 columns, 24px gap
 * Desktop (1024-1280px): 3 columns, 24px gap
 * Large (≥ 1280px):     4 columns, 24px gap
 * 
 * Max width: 1440px (centered)
 */
