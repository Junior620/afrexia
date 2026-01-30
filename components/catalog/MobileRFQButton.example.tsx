/**
 * MobileRFQButton Component Examples
 * 
 * This file demonstrates various usage patterns for the MobileRFQButton component.
 */

import React, { useState } from 'react';
import { MobileRFQButton } from './MobileRFQButton';
import { RFQDrawerDark } from './RFQDrawerDark';
import { Product } from '@/types/product';

// Mock product data
const mockProduct: Product = {
  id: 'cacao-premium-ci',
  slug: 'cacao-premium-cote-ivoire',
  name: 'Cacao Premium Côte d\'Ivoire',
  subtitle: 'Fèves fermentées grade A',
  category: 'Cacao',
  heroImage: null,
  availability: 'available',
  origins: ['Côte d\'Ivoire'],
  certifications: ['Organic', 'Fair Trade'],
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
  tags: ['premium', 'fermented'],
  updatedAt: new Date().toISOString(),
};

// French translations
const frTranslations = {
  button: {
    requestQuote: 'Demander un devis',
  },
  drawer: {
    title: 'Demander un devis',
    close: 'Fermer',
    productLabel: 'Produit sélectionné',
    fields: {
      quantity: 'Quantité',
      quantityPlaceholder: 'Entrez la quantité',
      incoterm: 'Incoterm',
      incotermPlaceholder: 'Sélectionner un incoterm',
      destination: 'Destination/Port',
      destinationPlaceholder: 'Ville, Pays',
      email: 'Email',
      emailPlaceholder: 'votre@email.com',
      company: 'Société',
      companyPlaceholder: 'Nom de votre société',
      notes: 'Notes additionnelles',
      notesPlaceholder: 'Informations complémentaires',
    },
    trustElements: {
      response24h: 'Réponse sous 24h',
      ndaAvailable: 'NDA disponible sur demande',
    },
    submit: 'Envoyer la demande',
    submitting: 'Envoi en cours...',
    success: 'Demande envoyée !',
    successMessage: 'Nous vous répondrons dans les 24 heures.',
    error: 'Erreur',
    errorMessage: 'Une erreur est survenue. Veuillez réessayer.',
  },
};

// English translations
const enTranslations = {
  button: {
    requestQuote: 'Request a Quote',
  },
  drawer: {
    title: 'Request a Quote',
    close: 'Close',
    productLabel: 'Selected Product',
    fields: {
      quantity: 'Quantity',
      quantityPlaceholder: 'Enter quantity',
      incoterm: 'Incoterm',
      incotermPlaceholder: 'Select an incoterm',
      destination: 'Destination/Port',
      destinationPlaceholder: 'City, Country',
      email: 'Email',
      emailPlaceholder: 'your@email.com',
      company: 'Company',
      companyPlaceholder: 'Your company name',
      notes: 'Additional Notes',
      notesPlaceholder: 'Additional information',
    },
    trustElements: {
      response24h: '24h response',
      ndaAvailable: 'NDA available upon request',
    },
    submit: 'Send Request',
    submitting: 'Sending...',
    success: 'Request sent!',
    successMessage: 'We will respond within 24 hours.',
    error: 'Error',
    errorMessage: 'An error occurred. Please try again.',
  },
};

/**
 * Example 1: Basic Usage (French)
 * Simple mobile button that opens RFQ drawer
 */
export function BasicUsageFrench() {
  const [isRFQOpen, setIsRFQOpen] = useState(false);

  const handleRFQSubmit = async (data: any) => {
    console.log('RFQ submitted:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="min-h-screen bg-[#0A1410] p-4">
      <h1 className="text-2xl text-[#E8F5E9] mb-4">Catalogue Produits</h1>
      <p className="text-[#B0D4B8] mb-8">
        Faites défiler vers le bas pour voir le bouton mobile sticky.
      </p>

      {/* Spacer to demonstrate scroll */}
      <div className="h-[150vh]" />

      <MobileRFQButton
        product={mockProduct}
        locale="fr"
        translations={frTranslations.button}
        onClick={() => setIsRFQOpen(true)}
      />

      <RFQDrawerDark
        product={mockProduct}
        locale="fr"
        translations={frTranslations.drawer}
        isOpen={isRFQOpen}
        onClose={() => setIsRFQOpen(false)}
        onSubmit={handleRFQSubmit}
      />
    </div>
  );
}

/**
 * Example 2: Basic Usage (English)
 * Simple mobile button that opens RFQ drawer
 */
export function BasicUsageEnglish() {
  const [isRFQOpen, setIsRFQOpen] = useState(false);

  const handleRFQSubmit = async (data: any) => {
    console.log('RFQ submitted:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="min-h-screen bg-[#0A1410] p-4">
      <h1 className="text-2xl text-[#E8F5E9] mb-4">Product Catalog</h1>
      <p className="text-[#B0D4B8] mb-8">
        Scroll down to see the sticky mobile button.
      </p>

      <div className="h-[150vh]" />

      <MobileRFQButton
        product={mockProduct}
        locale="en"
        translations={enTranslations.button}
        onClick={() => setIsRFQOpen(true)}
      />

      <RFQDrawerDark
        product={mockProduct}
        locale="en"
        translations={enTranslations.drawer}
        isOpen={isRFQOpen}
        onClose={() => setIsRFQOpen(false)}
        onSubmit={handleRFQSubmit}
      />
    </div>
  );
}

/**
 * Example 3: Without Product Context
 * Button without pre-selected product (general RFQ)
 */
export function WithoutProductContext() {
  const [isRFQOpen, setIsRFQOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A1410] p-4">
      <h1 className="text-2xl text-[#E8F5E9] mb-4">General Inquiry</h1>
      
      <div className="h-[150vh]" />

      <MobileRFQButton
        locale="fr"
        translations={frTranslations.button}
        onClick={() => setIsRFQOpen(true)}
      />

      {/* Note: RFQDrawerDark requires a product, so you'd need a product selection step */}
    </div>
  );
}

/**
 * Example 4: With Custom Styling
 * Button with additional custom classes
 */
export function WithCustomStyling() {
  const [isRFQOpen, setIsRFQOpen] = useState(false);

  const handleRFQSubmit = async (data: any) => {
    console.log('RFQ submitted:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="min-h-screen bg-[#0A1410] p-4">
      <h1 className="text-2xl text-[#E8F5E9] mb-4">Custom Styled Button</h1>
      
      <div className="h-[150vh]" />

      <MobileRFQButton
        product={mockProduct}
        locale="fr"
        translations={frTranslations.button}
        onClick={() => setIsRFQOpen(true)}
        className="animate-pulse"
      />

      <RFQDrawerDark
        product={mockProduct}
        locale="fr"
        translations={frTranslations.drawer}
        isOpen={isRFQOpen}
        onClose={() => setIsRFQOpen(false)}
        onSubmit={handleRFQSubmit}
      />
    </div>
  );
}

/**
 * Example 5: In Product Catalog Context
 * Realistic usage within a product catalog page
 */
export function InCatalogContext() {
  const [isRFQOpen, setIsRFQOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>(mockProduct);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setIsRFQOpen(true);
  };

  const handleRFQSubmit = async (data: any) => {
    console.log('RFQ submitted:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="min-h-screen bg-[#0A1410]">
      {/* Header */}
      <header className="bg-gradient-to-b from-[#0A1410] to-[#1A2820] p-6">
        <h1 className="text-4xl font-bold text-[#4A9A62] text-center">
          Catalogue Produits
        </h1>
      </header>

      {/* Product Grid */}
      <main className="p-4">
        <div className="grid grid-cols-1 gap-4">
          {[mockProduct, mockProduct, mockProduct].map((product, index) => (
            <div
              key={index}
              className="bg-[rgba(26,40,32,0.8)] rounded-2xl p-4 border border-[rgba(255,255,255,0.1)]"
            >
              <h3 className="text-lg font-semibold text-[#E8F5E9] mb-2">
                {product.name}
              </h3>
              <p className="text-sm text-[#B0D4B8] mb-4">
                {product.subtitle}
              </p>
              <button
                onClick={() => handleProductSelect(product)}
                className="w-full px-4 py-2 bg-[#4A9A62] text-white rounded-lg hover:bg-[#5AAA72]"
              >
                Demander un devis
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Mobile Sticky Button */}
      <MobileRFQButton
        product={selectedProduct}
        locale="fr"
        translations={frTranslations.button}
        onClick={() => setIsRFQOpen(true)}
      />

      {/* RFQ Drawer */}
      <RFQDrawerDark
        product={selectedProduct}
        locale="fr"
        translations={frTranslations.drawer}
        isOpen={isRFQOpen}
        onClose={() => setIsRFQOpen(false)}
        onSubmit={handleRFQSubmit}
      />
    </div>
  );
}

/**
 * Example 6: Testing Safe Area Insets
 * Demonstrates safe area behavior on devices with notches
 */
export function SafeAreaDemo() {
  const [isRFQOpen, setIsRFQOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A1410] p-4">
      <h1 className="text-2xl text-[#E8F5E9] mb-4">Safe Area Test</h1>
      <p className="text-[#B0D4B8] mb-4">
        Test on iPhone with notch or Android with gesture navigation.
      </p>
      <p className="text-[#80996F] text-sm mb-8">
        The button should respect the safe area insets and not be obscured by
        the home indicator or navigation bar.
      </p>

      <div className="h-[150vh]" />

      <MobileRFQButton
        product={mockProduct}
        locale="en"
        translations={enTranslations.button}
        onClick={() => setIsRFQOpen(true)}
      />

      <RFQDrawerDark
        product={mockProduct}
        locale="en"
        translations={enTranslations.drawer}
        isOpen={isRFQOpen}
        onClose={() => setIsRFQOpen(false)}
        onSubmit={async () => {}}
      />
    </div>
  );
}

/**
 * Example 7: Responsive Behavior Test
 * Shows/hides button based on viewport size
 */
export function ResponsiveDemo() {
  const [isRFQOpen, setIsRFQOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A1410] p-4">
      <h1 className="text-2xl text-[#E8F5E9] mb-4">Responsive Test</h1>
      <p className="text-[#B0D4B8] mb-4">
        Resize your browser window to see the button appear/disappear.
      </p>
      <ul className="text-[#80996F] text-sm space-y-2 mb-8">
        <li>• Mobile (&lt; 768px): Button visible</li>
        <li>• Tablet/Desktop (≥ 768px): Button hidden</li>
      </ul>

      <div className="h-[150vh]" />

      <MobileRFQButton
        product={mockProduct}
        locale="en"
        translations={enTranslations.button}
        onClick={() => setIsRFQOpen(true)}
      />

      <RFQDrawerDark
        product={mockProduct}
        locale="en"
        translations={enTranslations.drawer}
        isOpen={isRFQOpen}
        onClose={() => setIsRFQOpen(false)}
        onSubmit={async () => {}}
      />
    </div>
  );
}
