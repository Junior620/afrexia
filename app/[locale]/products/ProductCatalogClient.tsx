'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Product, FilterState, Category, Origin, Certification } from '@/types/product';
import { CatalogHeader } from '@/components/catalog/CatalogHeader';
import { CatalogFilters } from '@/components/catalog/CatalogFilters';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { ProcessComplianceSection } from '@/components/sections/ProcessComplianceSection';
import { SkipLinks } from '@/components/catalog/SkipLinks';
import { applyFilters, resetFilters } from '@/lib/catalog/filters';
import { RFQFormData } from '@/types/rfq';

// Code-split modals using dynamic imports to reduce initial bundle size
// These components are only loaded when needed (when user opens them)
const RFQDrawer = dynamic(() => import('@/components/catalog/RFQDrawer').then(mod => ({ default: mod.RFQDrawer })), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>
});

const QuickViewModal = dynamic(() => import('@/components/catalog/QuickViewModal').then(mod => ({ default: mod.QuickViewModal })), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>
});

const CatalogDownloadModal = dynamic(() => import('@/components/catalog/CatalogDownloadModal').then(mod => ({ default: mod.CatalogDownloadModal })), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>
});

export interface ProductCatalogClientProps {
  locale: string;
  products: Product[];
  categories: Category[];
  origins: Origin[];
  certifications: Certification[];
  translations: any; // TODO: Type this properly with CatalogTranslations
}

/**
 * ProductCatalogClient Component
 * Client-side wrapper for the product catalog page
 * 
 * Responsibilities:
 * - Manage filter state (Client Component wrapper)
 * - Manage RFQ drawer state
 * - Manage Quick View modal state
 * - Coordinate between all child components
 * - Sync filter state with URL search params
 * 
 * Requirements: 1.1-1.7, 15.1-15.7, 2.1-2.13
 */
export function ProductCatalogClient({
  locale,
  products,
  categories,
  origins,
  certifications,
  translations,
}: ProductCatalogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filter state from URL params
  const [filterState, setFilterState] = useState<FilterState>(() => {
    const search = searchParams.get('q') || '';
    const category = searchParams.get('category') || undefined;
    const originsParam = searchParams.get('origins');
    const availabilityParam = searchParams.get('availability');
    const eudrReadyParam = searchParams.get('eudr');
    const certificationsParam = searchParams.get('certifications');
    const incotermsParam = searchParams.get('incoterms');
    const moqMinParam = searchParams.get('moqMin');
    const moqMaxParam = searchParams.get('moqMax');

    return {
      search,
      category,
      origins: originsParam ? originsParam.split(',') : [],
      availability: availabilityParam ? availabilityParam.split(',') as any[] : [],
      eudrReady: eudrReadyParam === 'true' ? true : eudrReadyParam === 'false' ? false : undefined,
      certifications: certificationsParam ? certificationsParam.split(',') : [],
      incoterms: incotermsParam ? incotermsParam.split(',') : [],
      moqRange: moqMinParam && moqMaxParam ? {
        min: parseInt(moqMinParam),
        max: parseInt(moqMaxParam),
      } : undefined,
    };
  });

  // Modal and drawer states
  const [isRFQDrawerOpen, setIsRFQDrawerOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isCatalogDownloadOpen, setIsCatalogDownloadOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rfqProducts, setRfqProducts] = useState<Product[]>([]);

  // Apply filters to products
  const filteredProducts = useMemo(() => {
    return applyFilters(products, filterState);
  }, [products, filterState]);

  // Update URL when filter state changes
  useEffect(() => {
    const params = new URLSearchParams();

    if (filterState.search) {
      params.set('q', filterState.search);
    }
    if (filterState.category) {
      params.set('category', filterState.category);
    }
    if (filterState.origins.length > 0) {
      params.set('origins', filterState.origins.join(','));
    }
    if (filterState.availability.length > 0) {
      params.set('availability', filterState.availability.join(','));
    }
    if (filterState.eudrReady !== undefined) {
      params.set('eudr', filterState.eudrReady.toString());
    }
    if (filterState.certifications.length > 0) {
      params.set('certifications', filterState.certifications.join(','));
    }
    if (filterState.incoterms.length > 0) {
      params.set('incoterms', filterState.incoterms.join(','));
    }
    if (filterState.moqRange) {
      params.set('moqMin', filterState.moqRange.min.toString());
      params.set('moqMax', filterState.moqRange.max.toString());
    }

    const queryString = params.toString();
    const newUrl = queryString ? `/${locale}/products?${queryString}` : `/${locale}/products`;
    
    // Update URL without triggering a navigation
    window.history.replaceState({}, '', newUrl);
  }, [filterState, locale]);

  // Handle search change
  const handleSearchChange = useCallback((query: string) => {
    setFilterState((prev) => ({ ...prev, search: query }));
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((filterType: string, value: any) => {
    setFilterState((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  }, []);

  // Handle clear all filters
  const handleClearFilters = useCallback(() => {
    setFilterState(resetFilters());
  }, []);

  // Handle quote click from product card
  const handleQuoteClick = useCallback((product: Product) => {
    // Add product to RFQ if not already there
    setRfqProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev;
      }
      return [...prev, product];
    });
    setIsRFQDrawerOpen(true);
  }, []);

  // Handle quick view
  const handleQuickView = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  }, []);

  // Handle product view (for analytics)
  const handleProductView = useCallback((product: Product) => {
    // Analytics tracking is handled in ProductGrid component
  }, []);

  // Handle remove product from RFQ
  const handleRemoveProduct = useCallback((productId: string) => {
    setRfqProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  // Handle RFQ submission
  const handleRFQSubmit = async (data: RFQFormData) => {
    try {
      const response = await fetch('/api/rfq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('RFQ submission failed');
      }

      // Clear RFQ products on success
      setRfqProducts([]);
    } catch (error) {
      console.error('RFQ submission error:', error);
      throw error;
    }
  };

  // Handle catalog download
  const handleCatalogDownload = useCallback(() => {
    setIsCatalogDownloadOpen(true);
  }, []);

  // Handle catalog download submission
  const handleCatalogDownloadSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/catalog-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Catalog download failed');
      }

      const result = await response.json();
      
      // Trigger download
      if (result.downloadUrl) {
        window.open(result.downloadUrl, '_blank');
      }

      return result.downloadUrl;
    } catch (error) {
      console.error('Catalog download error:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Skip Links for Keyboard Navigation */}
      <SkipLinks
        translations={{
          skipToContent: translations.skipLinks?.skipToContent || 'Skip to main content',
          skipToFilters: translations.skipLinks?.skipToFilters || 'Skip to filters',
          skipToProducts: translations.skipLinks?.skipToProducts || 'Skip to products',
        }}
      />

      {/* Catalog Header */}
      <CatalogHeader
        locale={locale}
        translations={{
          heading: translations.heading,
          subtitle: translations.subtitle,
          downloadCatalogCTA: translations.downloadCatalog,
          trustStrip: translations.trust,
        }}
        onDownloadCatalog={handleCatalogDownload}
      />

      {/* Main Content */}
      <main id="main-content">
        {/* Catalog Filters */}
        <div id="catalog-filters">
          <CatalogFilters
            searchQuery={filterState.search}
            activeFilters={filterState}
            categories={categories}
            origins={origins}
            certifications={certifications}
            translations={{
              filters: translations.filters,
              availability: translations.availability,
            }}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            productCount={filteredProducts.length}
          />
        </div>

        {/* Product Grid */}
        <section id="product-grid" className="py-8 md:py-12">
          <ProductGrid
            products={filteredProducts}
            locale={locale}
            translations={translations.product}
            variant="traceability-first"
            onQuoteClick={handleQuoteClick}
            onQuickView={handleQuickView}
            onProductView={handleProductView}
            hasActiveFilters={
              filterState.search !== '' ||
              filterState.category !== undefined ||
              filterState.origins.length > 0 ||
              filterState.availability.length > 0 ||
              filterState.eudrReady !== undefined ||
              filterState.certifications.length > 0 ||
              filterState.incoterms.length > 0 ||
              filterState.moqRange !== undefined
            }
            onClearFilters={handleClearFilters}
          />
        </section>

        {/* Process & Compliance Section */}
        <ProcessComplianceSection
          locale={locale}
          translations={translations.compliance}
        />

        {/* Footer CTA for Multi-Product RFQ */}
        {rfqProducts.length > 0 && (
          <section className="bg-light py-8 md:py-12 border-t border-gray-200">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {translations.multiProductRFQ?.heading || 'Need multiple products?'}
              </h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                {translations.multiProductRFQ?.description || 
                  'You have products in your quote cart. Submit a single request for all selected products.'}
              </p>
              <button
                onClick={() => setIsRFQDrawerOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-3 min-h-[44px] bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                aria-label={`${translations.multiProductRFQ?.cta || 'View Quote Cart'} (${rfqProducts.length} products)`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>
                  {translations.multiProductRFQ?.cta || 'View Quote Cart'} ({rfqProducts.length})
                </span>
              </button>
            </div>
          </section>
        )}
      </main>

      {/* RFQ Drawer */}
      <RFQDrawer
        selectedProducts={rfqProducts}
        locale={locale}
        translations={translations.rfq}
        isOpen={isRFQDrawerOpen}
        onClose={() => setIsRFQDrawerOpen(false)}
        onSubmit={handleRFQSubmit}
        onRemoveProduct={handleRemoveProduct}
      />

      {/* Quick View Modal */}
      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          locale={locale}
          translations={translations.quickView}
          isOpen={isQuickViewOpen}
          onClose={() => {
            setIsQuickViewOpen(false);
            setSelectedProduct(null);
          }}
          onQuoteClick={() => {
            setIsQuickViewOpen(false);
            handleQuoteClick(selectedProduct);
          }}
        />
      )}

      {/* Catalog Download Modal */}
      <CatalogDownloadModal
        locale={locale}
        translations={translations.download}
        isOpen={isCatalogDownloadOpen}
        onClose={() => setIsCatalogDownloadOpen(false)}
        onSubmit={handleCatalogDownloadSubmit}
      />
    </div>
  );
}
