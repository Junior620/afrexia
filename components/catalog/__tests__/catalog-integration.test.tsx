/**
 * Catalog Integration Tests
 * 
 * Checkpoint 10: Verify basic catalog display works
 * - CatalogHeader renders correctly
 * - CatalogFilters displays and filters work
 * - ProductGrid displays products in responsive grid
 * - ProductCard renders all product information
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { CatalogHeader } from '../CatalogHeader';
import { CatalogFilters } from '../CatalogFilters';
import { ProductGrid } from '../ProductGrid';
import { ProductCard } from '../ProductCard';
import type { Product, Category, Origin, Certification, FilterState } from '@/types/product';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Sample test data
const mockProduct: Product = {
  id: 'test-product-1',
  slug: 'premium-cocoa',
  name: 'Premium Cocoa Beans',
  subtitle: 'Single Origin from Côte d\'Ivoire',
  category: 'Cocoa',
  heroImage: {
    asset: {
      _ref: 'image-abc123-1200x800-jpg',
      _type: 'reference',
    },
  },
  availability: 'in-stock',
  origins: ['CI'],
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
  packaging: 'Jute bags 60kg',
  grade: 'Grade I',
  leadTime: '4-6 weeks',
  tags: ['cocoa', 'premium', 'organic'],
  markets: ['EU', 'US'],
  updatedAt: '2024-01-15T00:00:00Z',
};

const mockCategories: Category[] = [
  { id: 'cocoa', name: 'Cocoa', slug: 'cocoa' },
  { id: 'coffee', name: 'Coffee', slug: 'coffee' },
];

const mockOrigins: Origin[] = [
  { id: 'ci', name: 'Côte d\'Ivoire', code: 'CI' },
  { id: 'gh', name: 'Ghana', code: 'GH' },
];

const mockCertifications: Certification[] = [
  { id: 'organic', name: 'Organic' },
  { id: 'fair-trade', name: 'Fair Trade' },
];

const mockTranslations = {
  heading: 'Our Product Catalog',
  subtitle: 'Premium agricultural products from Africa',
  downloadCatalogCTA: 'Download PDF Catalog',
  trustStrip: {
    response24h: '24h Response',
    ndaAvailable: 'NDA Available',
    eudrCompliant: 'EUDR Compliant',
    qaDocumented: 'QA Documented',
    coaAvailable: 'COA Available',
  },
};

const mockFilterTranslations = {
  filters: {
    search: 'Search',
    category: 'Category',
    origin: 'Origin',
    availability: 'Availability',
    certifications: 'Certifications',
    incoterms: 'Incoterms',
    moq: 'MOQ',
    clearAll: 'Clear all',
    searchPlaceholder: 'Search products...',
    categoryPlaceholder: 'Select category',
    originPlaceholder: 'Select origin',
    availabilityPlaceholder: 'Select availability',
    certificationsPlaceholder: 'Select certifications',
    incotermsPlaceholder: 'Select incoterms',
    activeFilters: 'Active Filters',
    showFilters: 'Show Filters',
  },
  availability: {
    'in-stock': 'In Stock',
    'limited': 'Limited Stock',
    'pre-order': 'Pre-order',
  },
};

const mockProductCardTranslations = {
  requestQuote: 'Request Quote',
  requestQuoteWithDocs: 'Request Quote + Documentation',
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
};

describe('Catalog Integration Tests - Checkpoint 10', () => {
  describe('CatalogHeader', () => {
    it('renders heading and subtitle correctly', () => {
      const onDownloadCatalog = vi.fn();
      
      render(
        <CatalogHeader
          locale="en"
          translations={mockTranslations}
          onDownloadCatalog={onDownloadCatalog}
        />
      );

      expect(screen.getByRole('heading', { name: mockTranslations.heading })).toBeInTheDocument();
      expect(screen.getByText(mockTranslations.subtitle)).toBeInTheDocument();
    });

    it('renders trust strip with all trust items', () => {
      const onDownloadCatalog = vi.fn();
      
      render(
        <CatalogHeader
          locale="en"
          translations={mockTranslations}
          onDownloadCatalog={onDownloadCatalog}
        />
      );

      expect(screen.getByText(mockTranslations.trustStrip.response24h)).toBeInTheDocument();
      expect(screen.getByText(mockTranslations.trustStrip.ndaAvailable)).toBeInTheDocument();
      expect(screen.getByText(mockTranslations.trustStrip.eudrCompliant)).toBeInTheDocument();
      expect(screen.getByText(mockTranslations.trustStrip.qaDocumented)).toBeInTheDocument();
      expect(screen.getByText(mockTranslations.trustStrip.coaAvailable)).toBeInTheDocument();
    });

    it('renders download catalog button and handles click', () => {
      const onDownloadCatalog = vi.fn();
      
      render(
        <CatalogHeader
          locale="en"
          translations={mockTranslations}
          onDownloadCatalog={onDownloadCatalog}
        />
      );

      const downloadButton = screen.getByRole('button', { name: mockTranslations.downloadCatalogCTA });
      expect(downloadButton).toBeInTheDocument();
      
      fireEvent.click(downloadButton);
      expect(onDownloadCatalog).toHaveBeenCalledTimes(1);
    });
  });

  describe('CatalogFilters', () => {
    const defaultFilterState: FilterState = {
      search: '',
      origins: [],
      availability: [],
      certifications: [],
      incoterms: [],
    };

    it('renders search input', () => {
      const onSearchChange = vi.fn();
      const onFilterChange = vi.fn();
      const onClearFilters = vi.fn();

      render(
        <CatalogFilters
          searchQuery=""
          activeFilters={defaultFilterState}
          categories={mockCategories}
          origins={mockOrigins}
          certifications={mockCertifications}
          translations={mockFilterTranslations}
          onSearchChange={onSearchChange}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          productCount={10}
        />
      );

      const searchInputs = screen.getAllByPlaceholderText(mockFilterTranslations.filters.searchPlaceholder);
      expect(searchInputs.length).toBeGreaterThan(0);
      expect(searchInputs[0]).toBeInTheDocument();
    });

    it('displays product count', () => {
      const onSearchChange = vi.fn();
      const onFilterChange = vi.fn();
      const onClearFilters = vi.fn();

      render(
        <CatalogFilters
          searchQuery=""
          activeFilters={defaultFilterState}
          categories={mockCategories}
          origins={mockOrigins}
          certifications={mockCertifications}
          translations={mockFilterTranslations}
          onSearchChange={onSearchChange}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          productCount={24}
        />
      );

      const productCountElements = screen.getAllByText(/24 produits/);
      expect(productCountElements.length).toBeGreaterThan(0);
    });

    it('debounces search input', async () => {
      const onSearchChange = vi.fn();
      const onFilterChange = vi.fn();
      const onClearFilters = vi.fn();

      const { container } = render(
        <CatalogFilters
          searchQuery=""
          activeFilters={defaultFilterState}
          categories={mockCategories}
          origins={mockOrigins}
          certifications={mockCertifications}
          translations={mockFilterTranslations}
          onSearchChange={onSearchChange}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          productCount={10}
        />
      );

      // Get the desktop search input specifically
      const desktopSection = container.querySelector('.hidden.md\\:block');
      const searchInput = desktopSection?.querySelector('input[type="search"]') as HTMLInputElement;
      
      expect(searchInput).toBeTruthy();
      
      // Type in search input
      fireEvent.change(searchInput, { target: { value: 'cocoa' } });
      
      // Should not call immediately
      expect(onSearchChange).not.toHaveBeenCalled();
      
      // Should call after debounce delay (300ms)
      await waitFor(() => {
        expect(onSearchChange).toHaveBeenCalledWith('cocoa');
      }, { timeout: 500 });
    });

    it('displays active filter chips', () => {
      const onSearchChange = vi.fn();
      const onFilterChange = vi.fn();
      const onClearFilters = vi.fn();

      const activeFilters: FilterState = {
        search: 'cocoa',
        category: 'cocoa',
        origins: ['CI'],
        availability: ['in-stock'],
        certifications: [],
        incoterms: [],
      };

      render(
        <CatalogFilters
          searchQuery="cocoa"
          activeFilters={activeFilters}
          categories={mockCategories}
          origins={mockOrigins}
          certifications={mockCertifications}
          translations={mockFilterTranslations}
          onSearchChange={onSearchChange}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          productCount={5}
        />
      );

      // Should display filter chips - use getAllByText since they appear in both desktop and mobile
      const cocoaChips = screen.getAllByText('"cocoa"');
      expect(cocoaChips.length).toBeGreaterThan(0);
      
      const cocoaElements = screen.getAllByText('Cocoa');
      expect(cocoaElements.length).toBeGreaterThan(0);
      
      const ivoryCoastElements = screen.getAllByText('Côte d\'Ivoire');
      expect(ivoryCoastElements.length).toBeGreaterThan(0);
    });

    it('handles clear all filters', () => {
      const onSearchChange = vi.fn();
      const onFilterChange = vi.fn();
      const onClearFilters = vi.fn();

      const activeFilters: FilterState = {
        search: 'cocoa',
        category: 'cocoa',
        origins: ['CI'],
        availability: [],
        certifications: [],
        incoterms: [],
      };

      render(
        <CatalogFilters
          searchQuery="cocoa"
          activeFilters={activeFilters}
          categories={mockCategories}
          origins={mockOrigins}
          certifications={mockCertifications}
          translations={mockFilterTranslations}
          onSearchChange={onSearchChange}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          productCount={5}
        />
      );

      const clearButtons = screen.getAllByText(mockFilterTranslations.filters.clearAll);
      fireEvent.click(clearButtons[0]);
      
      expect(onClearFilters).toHaveBeenCalledTimes(1);
    });
  });

  describe('ProductGrid', () => {
    it('renders products in grid layout', () => {
      const onQuoteClick = vi.fn();
      const onQuickView = vi.fn();
      const onProductView = vi.fn();

      const products = [mockProduct, { ...mockProduct, id: 'test-product-2', name: 'Coffee Beans' }];

      render(
        <ProductGrid
          products={products}
          locale="en"
          translations={mockProductCardTranslations}
          onQuoteClick={onQuoteClick}
          onQuickView={onQuickView}
          onProductView={onProductView}
        />
      );

      expect(screen.getByText('Premium Cocoa Beans')).toBeInTheDocument();
      expect(screen.getByText('Coffee Beans')).toBeInTheDocument();
    });

    it('displays empty state when no products', () => {
      const onQuoteClick = vi.fn();
      const onQuickView = vi.fn();
      const onProductView = vi.fn();

      render(
        <ProductGrid
          products={[]}
          locale="en"
          translations={mockProductCardTranslations}
          onQuoteClick={onQuoteClick}
          onQuickView={onQuickView}
          onProductView={onProductView}
        />
      );

      expect(screen.getByText('No products found')).toBeInTheDocument();
      expect(screen.getByText('No products available at the moment.')).toBeInTheDocument();
    });
  });

  describe('ProductCard', () => {
    it('renders all product information', () => {
      const onQuoteClick = vi.fn();
      const onQuickView = vi.fn();

      render(
        <ProductCard
          product={mockProduct}
          locale="en"
          translations={mockProductCardTranslations}
          onQuoteClick={onQuoteClick}
          onQuickView={onQuickView}
        />
      );

      // Product name and subtitle
      expect(screen.getByText('Premium Cocoa Beans')).toBeInTheDocument();
      expect(screen.getByText('Single Origin from Côte d\'Ivoire')).toBeInTheDocument();

      // Quick specs
      expect(screen.getByText('500 kg')).toBeInTheDocument();
      expect(screen.getByText('FOB, CIF')).toBeInTheDocument();

      // CTAs
      expect(screen.getByRole('button', { name: /Request Quote/i })).toBeInTheDocument();
      expect(screen.getByText(/View Specifications/i)).toBeInTheDocument();
    });

    it('displays availability badge', () => {
      const onQuoteClick = vi.fn();
      const onQuickView = vi.fn();

      render(
        <ProductCard
          product={mockProduct}
          locale="en"
          translations={mockProductCardTranslations}
          onQuoteClick={onQuoteClick}
          onQuickView={onQuickView}
        />
      );

      expect(screen.getByText('In Stock')).toBeInTheDocument();
    });

    it('displays EUDR badge when product is EUDR ready', () => {
      const onQuoteClick = vi.fn();
      const onQuickView = vi.fn();

      render(
        <ProductCard
          product={mockProduct}
          locale="en"
          translations={mockProductCardTranslations}
          onQuoteClick={onQuoteClick}
          onQuickView={onQuickView}
        />
      );

      expect(screen.getByText('EUDR Ready')).toBeInTheDocument();
    });

    it('displays document indicators', () => {
      const onQuoteClick = vi.fn();
      const onQuickView = vi.fn();

      render(
        <ProductCard
          product={mockProduct}
          locale="en"
          translations={mockProductCardTranslations}
          onQuoteClick={onQuoteClick}
          onQuickView={onQuickView}
        />
      );

      // Check for document indicators (COA, Spec, Chain)
      const coaElement = screen.getByTitle(mockProductCardTranslations.documents.coa);
      const specElement = screen.getByTitle(mockProductCardTranslations.documents.specSheet);
      const chainElement = screen.getByTitle(mockProductCardTranslations.documents.chainOfCustody);

      expect(coaElement).toBeInTheDocument();
      expect(specElement).toBeInTheDocument();
      expect(chainElement).toBeInTheDocument();
    });

    it('handles quote button click', () => {
      const onQuoteClick = vi.fn();
      const onQuickView = vi.fn();

      render(
        <ProductCard
          product={mockProduct}
          locale="en"
          translations={mockProductCardTranslations}
          onQuoteClick={onQuoteClick}
          onQuickView={onQuickView}
        />
      );

      const quoteButton = screen.getByRole('button', { name: /Request Quote/i });
      fireEvent.click(quoteButton);

      expect(onQuoteClick).toHaveBeenCalledTimes(1);
    });

    it('handles quick view button click', () => {
      const onQuoteClick = vi.fn();
      const onQuickView = vi.fn();

      render(
        <ProductCard
          product={mockProduct}
          locale="en"
          translations={mockProductCardTranslations}
          onQuoteClick={onQuoteClick}
          onQuickView={onQuickView}
        />
      );

      const quickViewButton = screen.getByLabelText(/Quick View/i);
      fireEvent.click(quickViewButton);

      expect(onQuickView).toHaveBeenCalledTimes(1);
    });

    it('renders traceability-first variant correctly', () => {
      const onQuoteClick = vi.fn();
      const onQuickView = vi.fn();

      render(
        <ProductCard
          product={mockProduct}
          locale="en"
          translations={mockProductCardTranslations}
          variant="traceability-first"
          onQuoteClick={onQuoteClick}
          onQuickView={onQuickView}
        />
      );

      // Should show extended CTA text for traceability variant
      expect(screen.getByText(/Request Quote \+ Documentation/i)).toBeInTheDocument();
    });

    it('renders luxury-editorial variant correctly', () => {
      const onQuoteClick = vi.fn();
      const onQuickView = vi.fn();

      render(
        <ProductCard
          product={mockProduct}
          locale="en"
          translations={mockProductCardTranslations}
          variant="luxury-editorial"
          onQuoteClick={onQuoteClick}
          onQuickView={onQuickView}
        />
      );

      // Should show standard CTA text for luxury variant
      expect(screen.getByText('Request Quote')).toBeInTheDocument();
    });

    it('handles missing optional fields gracefully', () => {
      const minimalProduct: Product = {
        ...mockProduct,
        subtitle: undefined,
        packaging: undefined,
        grade: undefined,
        leadTime: undefined,
        notes: undefined,
      };

      const onQuoteClick = vi.fn();
      const onQuickView = vi.fn();

      render(
        <ProductCard
          product={minimalProduct}
          locale="en"
          translations={mockProductCardTranslations}
          onQuoteClick={onQuoteClick}
          onQuickView={onQuickView}
        />
      );

      // Should still render product name and required fields
      expect(screen.getByText('Premium Cocoa Beans')).toBeInTheDocument();
      expect(screen.getByText('500 kg')).toBeInTheDocument();
    });
  });

  describe('Responsive Grid Layout', () => {
    it('applies correct grid classes for responsive layout', () => {
      const onQuoteClick = vi.fn();
      const onQuickView = vi.fn();
      const onProductView = vi.fn();

      const { container } = render(
        <ProductGrid
          products={[mockProduct]}
          locale="en"
          translations={mockProductCardTranslations}
          onQuoteClick={onQuoteClick}
          onQuickView={onQuickView}
          onProductView={onProductView}
        />
      );

      const gridElement = container.querySelector('.grid');
      expect(gridElement).toHaveClass('grid-cols-1'); // Mobile
      expect(gridElement).toHaveClass('md:grid-cols-2'); // Tablet
      expect(gridElement).toHaveClass('lg:grid-cols-3'); // Desktop
      expect(gridElement).toHaveClass('xl:grid-cols-4'); // Large desktop
    });
  });
});
