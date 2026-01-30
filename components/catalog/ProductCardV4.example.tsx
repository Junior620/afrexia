import { ProductCardV4, ProductCardV4Translations } from './ProductCardV4';
import { Product } from '@/types/product';

// Example translations FR
const translationsFR: ProductCardV4Translations = {
  requestQuote: 'Demander un devis',
  downloadSpec: 'Télécharger fiche technique',
  origin: 'Origine',
  moq: 'MOQ',
  incoterm: 'Incoterms',
  packaging: 'Conditionnement',
  microproof: 'Réponse sous 24h • NDA possible',
  terrainLabel: 'Terrain',
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
    eudrReady: 'EUDR-ready',
  },
  proofs: {
    coa: 'COA',
    chainOfCustody: 'Chain of Custody',
    qaDocumented: 'QA documentée',
  },
  fallback: {
    terrainOnRequest: 'Photo terrain sur demande',
    multiOrigin: 'Multi-origine',
  },
};

// Example translations EN
const translationsEN: ProductCardV4Translations = {
  requestQuote: 'Request Quote',
  downloadSpec: 'Download Spec Sheet',
  origin: 'Origin',
  moq: 'MOQ',
  incoterm: 'Incoterms',
  packaging: 'Packaging',
  microproof: 'Response within 24h • NDA available',
  terrainLabel: 'Field',
  categoryLabels: {
    cocoa: 'Cocoa',
    coffee: 'Coffee',
    corn: 'Corn',
    pepper: 'Pepper',
    wood: 'Wood',
  },
  badges: {
    inStock: 'In Stock',
    onRequest: 'On Request',
    eudrReady: 'EUDR-ready',
  },
  proofs: {
    coa: 'COA',
    chainOfCustody: 'Chain of Custody',
    qaDocumented: 'QA Documented',
  },
  fallback: {
    terrainOnRequest: 'Field photo on request',
    multiOrigin: 'Multi-origin',
  },
};

// Example product data - Premium Cocoa
const exampleProductCocoa: Product = {
  id: 'cocoa-premium-001',
  name: 'Cacao Premium Cameroun',
  slug: 'cacao-premium-cameroun',
  category: 'cocoa',
  subtitle: 'Grade export supérieur',
  description: 'Fèves de cacao fermentées et séchées selon protocole SCPB. Traçabilité complète de la plantation à l\'export. Certification EUDR en cours.',
  heroImage: {
    asset: {
      _ref: 'image-abc123',
      _type: 'reference',
    },
    alt: 'Cacao Premium Cameroun',
  },
  origins: ['Cameroun', 'Région Centre'],
  availability: 'in-stock',
  eudrReady: true,
  moq: {
    value: 20,
    unit: 'MT',
  },
  incoterms: ['FOB', 'CIF'],
  packaging: 'Sacs jute 60kg',
  grade: 'Grade 1',
  documents: {
    coa: true,
    specSheet: true,
    chainOfCustody: true,
  },
  certifications: ['EUDR', 'ISO 9001'],
  createdAt: '2024-01-15',
  updatedAt: '2024-01-20',
};

// Example product data - Coffee with terrain image
const exampleProductCoffee: Product = {
  id: 'coffee-arabica-001',
  name: 'Café Arabica Éthiopie',
  slug: 'cafe-arabica-ethiopie',
  category: 'coffee',
  subtitle: 'Qualité Premium',
  description: 'Arabica lavé altitude 1800-2200m. Notes florales et agrumes. Score cupping 85+. Récolte manuelle et traçabilité GPS.',
  heroImage: {
    asset: {
      _ref: 'image-def456',
      _type: 'reference',
    },
    alt: 'Café Arabica Éthiopie',
  },
  origins: ['Éthiopie', 'Sidamo'],
  availability: 'limited',
  eudrReady: true,
  moq: {
    value: 10,
    unit: 'MT',
  },
  incoterms: ['FOB', 'CFR', 'CIF'],
  packaging: 'Sacs jute 60kg',
  grade: 'Grade 1 - Score 85+',
  documents: {
    coa: true,
    specSheet: true,
    chainOfCustody: true,
  },
  certifications: ['EUDR', 'Rainforest Alliance'],
  createdAt: '2024-01-10',
  updatedAt: '2024-01-18',
};

// Example product data - No image (fallback test)
const exampleProductNoImage: Product = {
  id: 'pepper-white-001',
  name: 'Poivre Blanc Cameroun',
  slug: 'poivre-blanc-cameroun',
  category: 'pepper',
  subtitle: 'Qualité export',
  description: 'Poivre blanc séché naturellement. Arôme intense et piquant équilibré. Production artisanale contrôlée.',
  heroImage: undefined,
  origins: ['Cameroun'],
  availability: 'in-stock',
  eudrReady: false,
  moq: {
    value: 5,
    unit: 'MT',
  },
  incoterms: ['FOB', 'CIF'],
  packaging: 'Sur demande',
  documents: {
    coa: true,
    specSheet: false,
    chainOfCustody: false,
  },
  certifications: [],
  createdAt: '2024-01-12',
  updatedAt: '2024-01-19',
};

// Example usage component
export function ProductCardV4Examples() {
  const handleQuoteClick = () => {
    console.log('Quote requested');
  };

  const handleDownloadSpec = () => {
    console.log('Spec download requested');
  };

  return (
    <div className="min-h-screen bg-[#0A1410] p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            ProductCardV4 - Luxury Export Editorial
          </h1>
          <p className="text-[#B0D4B8] mb-8">
            Premium B2B product cards with editorial luxury aesthetic
          </p>
        </div>

        {/* Grid Layout - 3 columns desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example 1: Premium Cocoa with image */}
          <ProductCardV4
            product={exampleProductCocoa}
            locale="fr"
            translations={translationsFR}
            onQuoteClick={handleQuoteClick}
            onDownloadSpec={handleDownloadSpec}
          />

          {/* Example 2: Coffee with terrain image */}
          <ProductCardV4
            product={exampleProductCoffee}
            locale="fr"
            translations={translationsFR}
            onQuoteClick={handleQuoteClick}
            onDownloadSpec={handleDownloadSpec}
            terrainImage="/assets/terrain-coffee-ethiopia.jpg"
          />

          {/* Example 3: No image (fallback test) */}
          <ProductCardV4
            product={exampleProductNoImage}
            locale="fr"
            translations={translationsFR}
            onQuoteClick={handleQuoteClick}
            onDownloadSpec={handleDownloadSpec}
          />
        </div>

        {/* English version examples */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">English Version</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCardV4
              product={exampleProductCocoa}
              locale="en"
              translations={translationsEN}
              onQuoteClick={handleQuoteClick}
              onDownloadSpec={handleDownloadSpec}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
