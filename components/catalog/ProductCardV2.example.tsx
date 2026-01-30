'use client';

import React from 'react';
import { ProductCardV2 } from './ProductCardV2';
import { Product } from '@/types/product';

/**
 * ProductCardV2 Example
 * Demonstrates the improved B2B commodity cards with 3 products
 */

// Mock translations
const translations = {
  requestQuote: 'Demander un devis',
  downloadSpec: 'Fiche technique (PDF)',
  origin: 'Origine',
  moq: 'MOQ',
  incoterm: 'Incoterms',
  microproof: 'Réponse sous 24h • NDA possible',
  categoryLabels: {
    cocoa: 'Cacao',
    coffee: 'Café',
    corn: 'Maïs',
    pepper: 'Poivre',
    wood: 'Bois',
  },
  badges: {
    inStock: 'En stock',
    onRequest: 'Sur demande',
    contractable: 'Contractable',
    eudrReady: 'EUDR-ready',
  },
  fallback: {
    comingSoon: 'Photo à venir',
    multiOrigin: 'Multi-origine',
    toSpecify: 'À préciser',
  },
};

// Mock products
const mockProducts: Product[] = [
  // 1. Cacao - With image, EUDR-ready, In stock
  {
    id: '1',
    slug: 'cacao-premium',
    name: 'Cacao',
    subtitle: 'Fèves de cacao premium — traçabilité complète',
    category: 'cocoa',
    heroImage: {
      asset: {
        _ref: 'image-cocoa-beans',
        _type: 'reference',
      },
    },
    availability: 'in-stock',
    origins: ['Côte d\'Ivoire', 'Ghana'],
    certifications: ['cert-1'],
    eudrReady: true,
    qaAvailable: true,
    documents: {
      coa: true,
      specSheet: true,
      chainOfCustody: true,
    },
    moq: { value: 500, unit: 'kg' },
    incoterms: ['FOB', 'CIF'],
    grade: 'Grade I',
    packaging: 'Sacs jute 60kg',
    leadTime: '2-3 semaines',
    notes: '',
    tags: ['premium', 'organic'],
    markets: ['EU', 'US'],
    updatedAt: '2024-01-15T10:00:00Z',
  },
  
  // 2. Café - With image, On request
  {
    id: '2',
    slug: 'cafe-arabica-robusta',
    name: 'Café',
    subtitle: 'Arabica & Robusta — premium sourcing',
    category: 'coffee',
    heroImage: {
      asset: {
        _ref: 'image-coffee-beans',
        _type: 'reference',
      },
    },
    availability: 'limited',
    origins: ['Cameroun'],
    certifications: ['cert-2'],
    eudrReady: false,
    qaAvailable: true,
    documents: {
      coa: true,
      specSheet: true,
      chainOfCustody: false,
    },
    moq: { value: 1000, unit: 'kg' },
    incoterms: ['FOB', 'CIF', 'DAP'],
    grade: 'AA',
    packaging: 'Sacs jute 60kg',
    leadTime: '3-4 semaines',
    notes: '',
    tags: ['arabica', 'robusta'],
    markets: ['EU'],
    updatedAt: '2024-01-15T10:00:00Z',
  },
  
  // 3. Maïs - No image (fallback), Contractable, EUDR-ready
  {
    id: '3',
    slug: 'mais-jaune',
    name: 'Maïs',
    subtitle: 'Maïs jaune de haute qualité — culture durable',
    category: 'corn',
    heroImage: {
      asset: {
        _ref: '',
        _type: 'reference',
      },
    },
    availability: 'pre-order',
    origins: ['Nigeria', 'Bénin'],
    certifications: [],
    eudrReady: true,
    qaAvailable: false,
    documents: {
      coa: false,
      specSheet: true,
      chainOfCustody: false,
    },
    moq: { value: 2000, unit: 'kg' },
    incoterms: ['FOB', 'CIF'],
    grade: '',
    packaging: 'Sacs PP 50kg',
    leadTime: '4-6 semaines',
    notes: '',
    tags: ['yellow-corn'],
    markets: ['Africa', 'EU'],
    updatedAt: '2024-01-15T10:00:00Z',
  },
];

export function ProductCardV2Example() {
  const handleQuoteClick = (productName: string) => {
    console.log(`Quote requested for: ${productName}`);
    alert(`Demande de devis pour: ${productName}`);
  };

  const handleDownloadSpec = (productName: string) => {
    console.log(`Spec download for: ${productName}`);
    alert(`Téléchargement fiche technique: ${productName}`);
  };

  return (
    <div className="min-h-screen bg-[#0A1410] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#E8F5E9] mb-2">
            ProductCardV2 - Exemples
          </h1>
          <p className="text-[#B0D4B8]">
            Cards optimisées B2B commodities avec ratio 16:10, fallback premium, et double CTA
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProducts.map((product) => (
            <ProductCardV2
              key={product.id}
              product={product}
              locale="fr"
              translations={translations}
              onQuoteClick={() => handleQuoteClick(product.name)}
              onDownloadSpec={() => handleDownloadSpec(product.name)}
            />
          ))}
        </div>

        {/* Features List */}
        <div className="mt-12 p-6 bg-[rgba(26,40,32,0.6)] border border-[rgba(255,255,255,0.1)] rounded-2xl backdrop-blur-sm">
          <h2 className="text-xl font-bold text-[#E8F5E9] mb-4">
            ✨ Améliorations V2
          </h2>
          <ul className="space-y-2 text-[#B0D4B8]">
            <li className="flex items-start gap-2">
              <span className="text-[#4A9A62] mt-1">✓</span>
              <span><strong>Ratio 16:10</strong> (vs 4:3) — Hauteur réduite ~420px (vs 520px)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4A9A62] mt-1">✓</span>
              <span><strong>Fallback premium</strong> — Pattern + icône catégorie + "Photo à venir"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4A9A62] mt-1">✓</span>
              <span><strong>Badges B2B</strong> — En stock / Sur demande / Contractable (couleurs différenciées)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4A9A62] mt-1">✓</span>
              <span><strong>Badge EUDR</strong> — Visible si applicable</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4A9A62] mt-1">✓</span>
              <span><strong>Catégorie label</strong> — Top-left, petit, discret</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4A9A62] mt-1">✓</span>
              <span><strong>Hiérarchie titre</strong> — H3 21px + subtitle 14px</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4A9A62] mt-1">✓</span>
              <span><strong>Origine intelligente</strong> — Fallback "Multi-origine" si vide</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4A9A62] mt-1">✓</span>
              <span><strong>Double CTA</strong> — Primary (RFQ) + Secondary outline (PDF)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4A9A62] mt-1">✓</span>
              <span><strong>Microproof</strong> — "Réponse sous 24h • NDA possible"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4A9A62] mt-1">✓</span>
              <span><strong>Hover optimisé</strong> — Élévation + border gold + shadow</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4A9A62] mt-1">✓</span>
              <span><strong>Focus a11y</strong> — Outline gold pour navigation clavier</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProductCardV2Example;
