/**
 * ProductCard Component Examples
 * 
 * This file demonstrates how to use the ProductCard component
 * with both traceability-first and luxury-editorial variants.
 */

import { ProductCard } from './ProductCard';
import type { Product } from '@/types/product';

// Example product data
const exampleProduct: Product = {
  id: '1',
  slug: 'premium-cocoa-beans',
  name: 'Premium Cocoa Beans',
  subtitle: 'Single-origin, organic certified',
  category: 'cocoa',
  heroImage: {
    asset: {
      _ref: 'image-abc123-1200x900-jpg',
      _type: 'reference',
    },
  },
  availability: 'in-stock',
  origins: ['Côte d\'Ivoire'],
  certifications: ['organic', 'fairtrade'],
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
  incoterms: ['FOB', 'CIF', 'DAP'],
  packaging: 'Sacs de 60kg',
  grade: 'Premium',
  leadTime: '4-6 semaines',
  tags: ['organic', 'premium', 'single-origin'],
  markets: ['EU', 'US', 'Asia'],
  updatedAt: '2024-01-15T10:00:00Z',
};

// Example translations (French)
const frenchTranslations = {
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

// Example translations (English)
const englishTranslations = {
  requestQuote: 'Request Quote',
  requestQuoteWithDocs: 'Request Quote + Documentation',
  viewSpecs: 'View Specifications',
  quickView: 'Quick View',
  origin: 'Origin',
  moq: 'MOQ',
  incoterm: 'Incoterm',
  documents: {
    coa: 'Certificate of Analysis',
    specSheet: 'Spec Sheet',
    chainOfCustody: 'Chain of Custody',
  },
};

/**
 * Example 1: Traceability-First Variant (Default)
 * 
 * This variant emphasizes compliance, documentation, and transparency.
 * Best for buyers who prioritize regulatory compliance (EU market, large corporations).
 */
export function TraceabilityFirstExample() {
  return (
    <div className="max-w-sm">
      <ProductCard
        product={exampleProduct}
        locale="fr"
        translations={frenchTranslations}
        variant="traceability-first"
        onQuoteClick={() => console.log('Quote clicked')}
        onQuickView={() => console.log('Quick view clicked')}
      />
    </div>
  );
}

/**
 * Example 2: Luxury-Editorial Variant
 * 
 * This variant emphasizes premium aesthetics, storytelling, and brand prestige.
 * Best for premium buyers who value artisanal quality (chocolatiers, specialty roasters).
 */
export function LuxuryEditorialExample() {
  return (
    <div className="max-w-sm">
      <ProductCard
        product={exampleProduct}
        locale="en"
        translations={englishTranslations}
        variant="luxury-editorial"
        onQuoteClick={() => console.log('Quote clicked')}
        onQuickView={() => console.log('Quick view clicked')}
      />
    </div>
  );
}

/**
 * Example 3: Product Grid with Multiple Cards
 * 
 * Demonstrates how ProductCard components work in a responsive grid layout.
 */
export function ProductGridExample() {
  const products = [exampleProduct, exampleProduct, exampleProduct];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {products.map((product, index) => (
        <ProductCard
          key={index}
          product={product}
          locale="fr"
          translations={frenchTranslations}
          variant="traceability-first"
          onQuoteClick={() => console.log(`Quote clicked for product ${index}`)}
          onQuickView={() => console.log(`Quick view for product ${index}`)}
        />
      ))}
    </div>
  );
}

/**
 * Example 4: Product with Limited Availability
 */
export function LimitedStockExample() {
  const limitedProduct: Product = {
    ...exampleProduct,
    availability: 'limited',
  };

  return (
    <div className="max-w-sm">
      <ProductCard
        product={limitedProduct}
        locale="en"
        translations={englishTranslations}
        variant="traceability-first"
        onQuoteClick={() => console.log('Quote clicked')}
        onQuickView={() => console.log('Quick view clicked')}
      />
    </div>
  );
}

/**
 * Example 5: Product with Minimal Documentation
 */
export function MinimalDocsExample() {
  const minimalProduct: Product = {
    ...exampleProduct,
    documents: {
      coa: false,
      specSheet: true,
      chainOfCustody: false,
    },
    certifications: [],
    eudrReady: false,
  };

  return (
    <div className="max-w-sm">
      <ProductCard
        product={minimalProduct}
        locale="en"
        translations={englishTranslations}
        variant="luxury-editorial"
        onQuoteClick={() => console.log('Quote clicked')}
        onQuickView={() => console.log('Quick view clicked')}
      />
    </div>
  );
}
