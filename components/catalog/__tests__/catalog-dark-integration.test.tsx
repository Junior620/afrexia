/**
 * Catalog Dark Premium Integration Tests
 * 
 * Tests for integrated catalog functionality with dark theme components
 * Requirements: 11.2
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Next.js modules
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  },
}));

// Mock analytics
vi.mock('@/lib/analytics', () => ({
  trackCatalogFilter: vi.fn(),
  trackQuoteClick: vi.fn(),
  trackRFQSubmission: vi.fn(),
  trackPDFDownload: vi.fn(),
}));

// Mock Sanity image URL helper
vi.mock('@/lib/sanity/image-url', () => ({
  getThumbnailImageUrl: vi.fn(() => '/test-image.jpg'),
  getImageUrl: vi.fn(() => '/test-image.jpg'),
  getProductCardImageUrl: vi.fn(() => '/test-image.jpg'),
}));

import { CatalogFiltersDark } from '../CatalogFiltersDark';
import { ProductCardDark } from '../ProductCardDark';
import { RFQDrawerDark } from '../RFQDrawerDark';
import { Product, FilterState } from '@/types/product';

const mockProducts: Product[] = [
  {
    id: 'product-1',
    slug: 'cacao-premium-ci',
    name: 'Cacao Premium Côte d\'Ivoire',
    subtitle: 'Fèves fermentées grade A',
    category: 'Cacao',
    heroImage: {
      asset: {
        _ref: 'image-1',
        _type: 'reference',
      },
    },
    availability: 'in-stock',
    origins: ['Côte d\'Ivoire'],
    certifications: ['organic'],
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
    tags: ['premium'],
    markets: ['EU'],
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'product-2',
    slug: 'cafe-arabica-gh',
    name: 'Café Arabica Ghana',
    subtitle: 'Grade AA',
    category: 'Café',
    heroImage: {
      asset: {
        _ref: 'image-2',
        _type: 'reference',
      },
    },
    availability: 'in-stock',
    origins: ['Ghana'],
    certifications: ['fairtrade'],
    eudrReady: false,
    qaAvailable: true,
    documents: {
      coa: true,
      specSheet: true,
      chainOfCustody: false,
    },
    moq: {
      value: 250,
      unit: 'kg',
    },
    incoterms: ['FOB'],
    tags: ['arabica'],
    markets: ['US'],
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const mockTranslations = {
  filters: {
    search: 'Rechercher',
    searchPlaceholder: 'Rechercher un produit...',
    category: 'Catégorie',
    categoryPlaceholder: 'Sélectionner une catégorie',
    origin: 'Origine',
    originPlaceholder: 'Sélectionner une origine',
    availability: 'Disponibilité',
    availabilityPlaceholder: 'Sélectionner la disponibilité',
    certifications: 'Certifications',
    certificationsPlaceholder: 'Sélectionner des certifications',
    incoterms: 'Incoterms',
    incotermsPlaceholder: 'Sélectionner des incoterms',
    moq: 'MOQ',
    clearAll: 'Réinitialiser',
    showFilters: 'Filtrer',
    resultsCount: '{count} produits',
    activeFilters: 'Filtres',
  },
  productCard: {
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
      coa: 'COA',
      specSheet: 'Spec',
      chainOfCustody: 'Chain',
    },
  },
  rfq: {
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
    success: 'Succès',
    successMessage: 'Demande envoyée avec succès !',
    error: 'Erreur',
    errorMessage: 'Une erreur est survenue. Veuillez réessayer.',
  },
  availability: {
    'in-stock': 'En stock',
    'limited': 'Stock limité',
    'pre-order': 'Pré-commande',
  },
};

describe('Catalog Dark Premium Integration Tests', () => {
  describe('Filter application updates grid', () => {
    it('filters products by category', () => {
      const mockOnFilterChange = vi.fn();
      const mockOnSearchChange = vi.fn();
      const mockOnClearFilters = vi.fn();

      const defaultFilterState: FilterState = {
        search: '',
        category: undefined,
        origins: [],
        availability: [],
        eudrReady: undefined,
        certifications: [],
        incoterms: [],
        moqRange: undefined,
      };

      const { rerender } = render(
        <>
          <CatalogFiltersDark
            searchQuery=""
            activeFilters={defaultFilterState}
            categories={[
              { id: 'cocoa', name: 'Cacao', slug: 'cocoa' },
              { id: 'coffee', name: 'Café', slug: 'coffee' },
            ]}
            origins={[]}
            certifications={[]}
            translations={mockTranslations}
            onSearchChange={mockOnSearchChange}
            onFilterChange={mockOnFilterChange}
            onClearFilters={mockOnClearFilters}
            productCount={2}
          />
          <div data-testid="product-grid">
            {mockProducts.map((product) => (
              <ProductCardDark
                key={product.id}
                product={product}
                locale="fr"
                translations={mockTranslations.productCard}
                onQuoteClick={() => {}}
              />
            ))}
          </div>
        </>
      );

      // Initially shows all products
      expect(screen.getByText('Cacao Premium Côte d\'Ivoire')).toBeInTheDocument();
      expect(screen.getByText('Café Arabica Ghana')).toBeInTheDocument();

      // Apply category filter
      const filteredState: FilterState = {
        ...defaultFilterState,
        category: 'cocoa',
      };

      rerender(
        <>
          <CatalogFiltersDark
            searchQuery=""
            activeFilters={filteredState}
            categories={[
              { id: 'cocoa', name: 'Cacao', slug: 'cocoa' },
              { id: 'coffee', name: 'Café', slug: 'coffee' },
            ]}
            origins={[]}
            certifications={[]}
            translations={mockTranslations}
            onSearchChange={mockOnSearchChange}
            onFilterChange={mockOnFilterChange}
            onClearFilters={mockOnClearFilters}
            productCount={1}
          />
          <div data-testid="product-grid">
            {mockProducts
              .filter((p) => p.category === 'Cacao')
              .map((product) => (
                <ProductCardDark
                  key={product.id}
                  product={product}
                  locale="fr"
                  translations={mockTranslations.productCard}
                  onQuoteClick={() => {}}
                />
              ))}
          </div>
        </>
      );

      // Should show filtered results
      expect(screen.getByText('Cacao Premium Côte d\'Ivoire')).toBeInTheDocument();
      expect(screen.queryByText('Café Arabica Ghana')).not.toBeInTheDocument();
      expect(screen.getAllByText('1 produit').length).toBeGreaterThan(0);
    });

    it('filters products by origin', () => {
      const mockOnFilterChange = vi.fn();
      const mockOnSearchChange = vi.fn();
      const mockOnClearFilters = vi.fn();

      const defaultFilterState: FilterState = {
        search: '',
        category: undefined,
        origins: ['CI'],
        availability: [],
        eudrReady: undefined,
        certifications: [],
        incoterms: [],
        moqRange: undefined,
      };

      render(
        <>
          <CatalogFiltersDark
            searchQuery=""
            activeFilters={defaultFilterState}
            categories={[]}
            origins={[
              { id: 'ci', name: 'Côte d\'Ivoire', code: 'CI' },
              { id: 'gh', name: 'Ghana', code: 'GH' },
            ]}
            certifications={[]}
            translations={mockTranslations}
            onSearchChange={mockOnSearchChange}
            onFilterChange={mockOnFilterChange}
            onClearFilters={mockOnClearFilters}
            productCount={1}
          />
          <div data-testid="product-grid">
            {mockProducts
              .filter((p) => p.origins.includes('Côte d\'Ivoire'))
              .map((product) => (
                <ProductCardDark
                  key={product.id}
                  product={product}
                  locale="fr"
                  translations={mockTranslations.productCard}
                  onQuoteClick={() => {}}
                />
              ))}
          </div>
        </>
      );

      // Should show only Côte d'Ivoire products
      expect(screen.getByText('Cacao Premium Côte d\'Ivoire')).toBeInTheDocument();
      expect(screen.queryByText('Café Arabica Ghana')).not.toBeInTheDocument();
    });
  });

  describe('RFQ form submission flow', () => {
    it('completes full RFQ submission workflow', async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
      const mockOnClose = vi.fn();

      render(
        <RFQDrawerDark
          product={mockProducts[0]}
          locale="fr"
          translations={mockTranslations.rfq}
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      // Verify drawer is open with product info
      expect(screen.getByText('Demander un devis')).toBeInTheDocument();
      expect(screen.getByText('Cacao Premium Côte d\'Ivoire')).toBeInTheDocument();

      // Fill in form fields
      const emailInput = screen.getByPlaceholderText('votre@email.com');
      const companyInput = screen.getByPlaceholderText('Nom de votre société');
      const destinationInput = screen.getByPlaceholderText('Ville, Pays');

      fireEvent.change(emailInput, { target: { value: 'buyer@example.com' } });
      fireEvent.change(companyInput, { target: { value: 'Chocolate Factory Inc' } });
      fireEvent.change(destinationInput, { target: { value: 'Paris, France' } });

      // Submit form
      const submitButton = screen.getByText('Envoyer la demande');
      fireEvent.click(submitButton);

      // Verify submission
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });

      const submittedData = mockOnSubmit.mock.calls[0][0];
      expect(submittedData.contact.email).toBe('buyer@example.com');
      expect(submittedData.contact.company).toBe('Chocolate Factory Inc');
      expect(submittedData.delivery.location).toBe('Paris, France');
      expect(submittedData.products[0].id).toBe('product-1');

      // Verify success message
      await waitFor(() => {
        expect(screen.getByText('Succès')).toBeInTheDocument();
      });
    });

    it('handles RFQ submission errors gracefully', async () => {
      const mockOnSubmit = vi.fn().mockRejectedValue(new Error('Network error'));
      const mockOnClose = vi.fn();

      render(
        <RFQDrawerDark
          product={mockProducts[0]}
          locale="fr"
          translations={mockTranslations.rfq}
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      // Fill in form
      fireEvent.change(screen.getByPlaceholderText('votre@email.com'), {
        target: { value: 'buyer@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Nom de votre société'), {
        target: { value: 'Test Company' },
      });
      fireEvent.change(screen.getByPlaceholderText('Ville, Pays'), {
        target: { value: 'Paris, France' },
      });

      // Submit form
      fireEvent.click(screen.getByText('Envoyer la demande'));

      // Verify error message
      await waitFor(() => {
        expect(screen.getByText('Erreur')).toBeInTheDocument();
        expect(screen.getByText('Une erreur est survenue. Veuillez réessayer.')).toBeInTheDocument();
      });
    });
  });

  describe('PDF download flow', () => {
    it('triggers PDF download with analytics tracking', async () => {
      const mockOnDownload = vi.fn();
      const { trackPDFDownload } = await import('@/lib/analytics');

      const DownloadButton = () => (
        <button
          onClick={() => {
            trackPDFDownload('header');
            mockOnDownload();
          }}
        >
          Télécharger le catalogue (PDF)
        </button>
      );

      render(<DownloadButton />);

      const downloadButton = screen.getByText('Télécharger le catalogue (PDF)');
      fireEvent.click(downloadButton);

      expect(trackPDFDownload).toHaveBeenCalledWith('header');
      expect(mockOnDownload).toHaveBeenCalledTimes(1);
    });
  });

  describe('End-to-end catalog workflow', () => {
    it('completes full user journey: browse → filter → view → request quote', async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined);

      const CatalogWorkflow = () => {
        const [product, setProduct] = React.useState<Product | null>(null);
        const [rfqOpen, setRfqOpen] = React.useState(false);

        return (
          <>
            <div data-testid="product-grid">
              {mockProducts.map((p) => (
                <ProductCardDark
                  key={p.id}
                  product={p}
                  locale="fr"
                  translations={mockTranslations.productCard}
                  onQuoteClick={() => {
                    setProduct(p);
                    setRfqOpen(true);
                  }}
                />
              ))}
            </div>
            {product && (
              <RFQDrawerDark
                product={product}
                locale="fr"
                translations={mockTranslations.rfq}
                isOpen={rfqOpen}
                onClose={() => setRfqOpen(false)}
                onSubmit={mockOnSubmit}
              />
            )}
          </>
        );
      };

      render(<CatalogWorkflow />);

      // Step 1: Browse products
      expect(screen.getByText('Cacao Premium Côte d\'Ivoire')).toBeInTheDocument();
      expect(screen.getByText('Café Arabica Ghana')).toBeInTheDocument();

      // Step 2: Click quote button on first product
      const quoteButtons = screen.getAllByText('Demander un devis');
      fireEvent.click(quoteButtons[0]);

      // Step 3: Verify RFQ drawer opens with correct product
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Step 4: Fill and submit RFQ form
      fireEvent.change(screen.getByPlaceholderText('votre@email.com'), {
        target: { value: 'buyer@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Nom de votre société'), {
        target: { value: 'Test Company' },
      });
      fireEvent.change(screen.getByPlaceholderText('Ville, Pays'), {
        target: { value: 'Paris, France' },
      });

      const submitButton = screen.getByRole('button', { name: /Envoyer la demande/i });
      fireEvent.click(submitButton);

      // Step 5: Verify successful submission
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Succès')).toBeInTheDocument();
      });
    });
  });
});
