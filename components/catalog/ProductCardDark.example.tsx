/**
 * ProductCardDark Component Examples
 * 
 * This file demonstrates various usage patterns for the ProductCardDark component.
 */

import React, { useState } from 'react';
import { ProductCardDark } from './ProductCardDark';
import { Product } from '@/types/product';

// Example product data
const exampleProduct: Product = {
  id: 'cacao-premium-ci',
  slug: 'cacao-premium-cote-ivoire',
  name: 'Cacao Premium Côte d\'Ivoire',
  subtitle: 'Fèves fermentées grade A',
  category: 'Cacao',
  heroImage: {
    asset: {
      _ref: 'image-abc123-800x600-jpg',
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
  packaging: 'Sacs jute 60kg',
  grade: 'Grade A',
  leadTime: '2-3 semaines',
  tags: ['premium', 'organic', 'eudr-ready'],
  markets: ['EU', 'US', 'Asia'],
  updatedAt: '2024-01-15T00:00:00Z',
};

// French translations
const frTranslations = {
  requestQuote: 'Demander un devis',
  viewSpecs: 'Voir fiche technique',
  origin: 'Origine',
  moq: 'MOQ',
  incoterm: 'Incoterms',
  microproof: 'Réponse sous 24h • NDA possible',
  badges: {
    available: 'Disponible',
    onRequest: 'Sur demande',
    outOfStock: 'Épuisé',
    eudrReady: 'EUDR-ready',
  },
  documents: {
    coa: 'Certificat d\'analyse',
    specSheet: 'Fiche technique',
    chainOfCustody: 'Chaîne de traçabilité',
  },
};

// English translations
const enTranslations = {
  requestQuote: 'Request a Quote',
  viewSpecs: 'View Specifications',
  origin: 'Origin',
  moq: 'MOQ',
  incoterm: 'Incoterms',
  microproof: '24h response • NDA available',
  badges: {
    available: 'Available',
    onRequest: 'On Request',
    outOfStock: 'Out of Stock',
    eudrReady: 'EUDR-ready',
  },
  documents: {
    coa: 'Certificate of Analysis',
    specSheet: 'Specification Sheet',
    chainOfCustody: 'Chain of Custody',
  },
};

/**
 * Example 1: Basic Usage (French)
 */
export function BasicExampleFR() {
  const [rfqOpen, setRfqOpen] = useState(false);

  const handleQuoteClick = () => {
    setRfqOpen(true);
    console.log('Opening RFQ drawer for:', exampleProduct.name);
  };

  return (
    <div className="bg-[#0A1410] p-8">
      <div className="max-w-sm">
        <ProductCardDark
          product={exampleProduct}
          locale="fr"
          translations={frTranslations}
          onQuoteClick={handleQuoteClick}
        />
      </div>
      {rfqOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-bold mb-4">RFQ Drawer</h2>
            <p>Product: {exampleProduct.name}</p>
            <button
              onClick={() => setRfqOpen(false)}
              className="mt-4 px-4 py-2 bg-gray-200 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Example 2: Basic Usage (English)
 */
export function BasicExampleEN() {
  const handleQuoteClick = () => {
    console.log('Opening RFQ drawer for:', exampleProduct.name);
  };

  return (
    <div className="bg-[#0A1410] p-8">
      <div className="max-w-sm">
        <ProductCardDark
          product={exampleProduct}
          locale="en"
          translations={enTranslations}
          onQuoteClick={handleQuoteClick}
        />
      </div>
    </div>
  );
}

/**
 * Example 3: Product Grid Layout
 */
export function GridExample() {
  const products = [
    exampleProduct,
    {
      ...exampleProduct,
      id: 'coffee-arabica-ethiopia',
      slug: 'coffee-arabica-ethiopia',
      name: 'Café Arabica Éthiopie',
      subtitle: 'Grade 1, lavé',
      category: 'Café',
      origins: ['Éthiopie'],
      eudrReady: false,
    },
    {
      ...exampleProduct,
      id: 'cashew-raw-benin',
      slug: 'cashew-raw-benin',
      name: 'Noix de cajou brutes Bénin',
      subtitle: 'W320, qualité export',
      category: 'Noix',
      origins: ['Bénin'],
      availability: 'limited' as const,
    },
  ];

  const handleQuoteClick = (productId: string) => {
    console.log('Quote requested for:', productId);
  };

  return (
    <div className="bg-[#0A1410] p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCardDark
            key={product.id}
            product={product as Product}
            locale="fr"
            translations={frTranslations}
            onQuoteClick={() => handleQuoteClick(product.id)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Example 4: Product Without Image (Fallback Pattern)
 */
export function FallbackExample() {
  const productWithoutImage = {
    ...exampleProduct,
    heroImage: null as any,
  };

  const handleQuoteClick = () => {
    console.log('Quote requested');
  };

  return (
    <div className="bg-[#0A1410] p-8">
      <div className="max-w-sm">
        <ProductCardDark
          product={productWithoutImage}
          locale="fr"
          translations={frTranslations}
          onQuoteClick={handleQuoteClick}
        />
      </div>
    </div>
  );
}

/**
 * Example 5: Product Without EUDR Badge
 */
export function NoEUDRExample() {
  const productWithoutEUDR = {
    ...exampleProduct,
    eudrReady: false,
  };

  const handleQuoteClick = () => {
    console.log('Quote requested');
  };

  return (
    <div className="bg-[#0A1410] p-8">
      <div className="max-w-sm">
        <ProductCardDark
          product={productWithoutEUDR}
          locale="fr"
          translations={frTranslations}
          onQuoteClick={handleQuoteClick}
        />
      </div>
    </div>
  );
}

/**
 * Example 6: Product With Limited Documents
 */
export function LimitedDocumentsExample() {
  const productWithLimitedDocs = {
    ...exampleProduct,
    documents: {
      coa: true,
      specSheet: false,
      chainOfCustody: false,
    },
  };

  const handleQuoteClick = () => {
    console.log('Quote requested');
  };

  return (
    <div className="bg-[#0A1410] p-8">
      <div className="max-w-sm">
        <ProductCardDark
          product={productWithLimitedDocs}
          locale="fr"
          translations={frTranslations}
          onQuoteClick={handleQuoteClick}
        />
      </div>
    </div>
  );
}

/**
 * Example 7: With Custom Spec Click Handler
 */
export function CustomSpecClickExample() {
  const handleQuoteClick = () => {
    console.log('Quote requested');
  };

  const handleSpecClick = () => {
    console.log('Custom spec click handler');
    // Could open a modal, track custom analytics, etc.
  };

  return (
    <div className="bg-[#0A1410] p-8">
      <div className="max-w-sm">
        <ProductCardDark
          product={exampleProduct}
          locale="fr"
          translations={frTranslations}
          onQuoteClick={handleQuoteClick}
          onSpecClick={handleSpecClick}
        />
      </div>
    </div>
  );
}

/**
 * Example 8: Responsive Grid (Mobile to Desktop)
 */
export function ResponsiveGridExample() {
  const products = Array(8).fill(exampleProduct).map((p, i) => ({
    ...p,
    id: `product-${i}`,
    slug: `product-${i}`,
  }));

  const handleQuoteClick = (productId: string) => {
    console.log('Quote requested for:', productId);
  };

  return (
    <div className="bg-[#0A1410] min-h-screen p-4 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCardDark
            key={product.id}
            product={product as Product}
            locale="fr"
            translations={frTranslations}
            onQuoteClick={() => handleQuoteClick(product.id)}
          />
        ))}
      </div>
    </div>
  );
}
