'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Product, FilterState, Category, Origin, Certification } from '@/types/product';
import { CatalogHeaderDark } from '@/components/catalog/CatalogHeaderDark';
import { CatalogFiltersV2 } from '@/components/catalog/CatalogFiltersV2';
import { ProductCardV4 } from '@/components/catalog/ProductCardV4';
import { MobileRFQButton } from '@/components/catalog/MobileRFQButton';
import { SkipLinks } from '@/components/catalog/SkipLinks';
import { applyFilters, resetFilters } from '@/lib/catalog/filters';
import { RFQFormData } from '@/types/rfq';
import { trackProductCardView } from '@/lib/analytics/events';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getCatalogDarkTranslations, CatalogDarkTranslations } from '@/lib/i18n/catalog-dark-translations';

// Code-split modals using dynamic imports to reduce initial bundle size
const RFQDrawerDark = dynamic(() => import('@/components/catalog/RFQDrawerDark').then(mod => ({ default: mod.RFQDrawerDark })), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <LoadingSpinner size="lg" className="text-white" />
    </div>
  )
});

const CatalogDownloadModal = dynamic(() => import('@/components/catalog/CatalogDownloadModal').then(mod => ({ default: mod.CatalogDownloadModal })), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <LoadingSpinner size="lg" className="text-white" />
    </div>
  )
});

export interface ProductCatalogPageDarkProps {
  locale: 'fr' | 'en';
  products: Product[];
  categories: Category[];
  origins: Origin[];
  certifications: Certification[];
}

/**
 * ProductCatalogPageDark Component
 * Dark premium theme catalog page with full state management
 * 
 * Responsibilities:
 * - Fetch products depuis Sanity (handled by parent server component)
 * - Manage filter state
 * - Manage RFQ drawer state
 * - Coordinate entre composants
 * - Sync filter state with URL search params
 * 
 * Requirements: 1.1-1.7, 7.1-7.7
 */
export function ProductCatalogPageDark({
  locale,
  products,
  categories,
  origins,
  certifications,
}: ProductCatalogPageDarkProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get translations for the locale with fallback to EN - Requirements: 7.1-7.7
  const translations = getCatalogDarkTranslations(locale);

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
  const [isCatalogDownloadOpen, setIsCatalogDownloadOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rfqProducts, setRfqProducts] = useState<Product[]>([]);
  
  // Sort state
  const [sortBy, setSortBy] = useState<string>('relevance');

  // Apply filters to products - Requirements: 3.1-3.9
  const filteredProducts = useMemo(() => {
    let results = applyFilters(products, filterState);
    
    // Apply sorting
    if (sortBy === 'availability') {
      results = results.sort((a, b) => {
        const order = { 'in-stock': 0, 'limited': 1, 'pre-order': 2 };
        return order[a.availability] - order[b.availability];
      });
    } else if (sortBy === 'moq') {
      results = results.sort((a, b) => a.moq.value - b.moq.value);
    } else if (sortBy === 'origin') {
      results = results.sort((a, b) => {
        const originA = a.origins[0] || '';
        const originB = b.origins[0] || '';
        return originA.localeCompare(originB);
      });
    }
    
    return results;
  }, [products, filterState, sortBy]);

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
  
  // Handle sort change
  const handleSortChange = useCallback((newSortBy: string) => {
    setSortBy(newSortBy);
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
    setSelectedProduct(product);
    setIsRFQDrawerOpen(true);
  }, []);

  // Handle remove product from RFQ
  const handleRemoveProduct = useCallback((productId: string) => {
    setRfqProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  // Handle RFQ submission
  const handleRFQSubmit = async (data: RFQFormData) => {
    try {
      const response = await fetch('/api/catalog-rfq', {
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
      setSelectedProduct(null);
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
    <div className="min-h-screen bg-[#0A1410]">
      {/* Skip Links for Keyboard Navigation */}
      <SkipLinks
        translations={translations.skipLinks}
      />

      {/* Catalog Header Dark */}
      <CatalogHeaderDark
        locale={locale}
        translations={{
          heading: translations.header.heading,
          subtitle: translations.header.subtitle,
          ctaPrimary: translations.header.ctaPrimary,
          ctaSecondary: translations.header.ctaSecondary,
          trust: translations.trust,
        }}
        onRequestQuote={() => setIsRFQDrawerOpen(true)}
        onDownloadCatalog={handleCatalogDownload}
      />

      {/* Main Content */}
      <main id="main-content">
        {/* Catalog Filters V2 */}
        <div id="catalog-filters">
          <CatalogFiltersV2
            searchQuery={filterState.search}
            activeFilters={filterState}
            categories={categories}
            origins={origins}
            certifications={certifications}
            translations={translations}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onSortChange={handleSortChange}
            productCount={filteredProducts.length}
            sortBy={sortBy}
          />
        </div>

        {/* Product Grid - Requirements: 9.2 */}
        <section id="product-grid" className="py-8 md:py-12">
          <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
            {/* Grid with 3 columns on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProducts.map((product) => {
                // Track product view
                const handleProductView = () => {
                  trackProductCardView({
                    productId: product.id,
                    productName: product.name,
                    category: product.category,
                    origin: product.origins[0] || 'Unknown',
                    availability: product.availability,
                  });
                };

                return (
                  <div
                    key={product.id}
                    data-product-id={product.id}
                    onMouseEnter={handleProductView}
                  >
                    <ProductCardV4
                      product={product}
                      locale={locale}
                      translations={{
                        requestQuote: translations.product.requestQuote,
                        downloadSpec: translations.product.downloadSpec,
                        origin: translations.product.origin,
                        moq: translations.product.moq,
                        incoterm: translations.product.incoterm,
                        packaging: translations.product.packaging,
                        microproof: translations.product.microproof,
                        terrainLabel: translations.product.terrainLabel,
                        categoryLabels: translations.categoryLabels,
                        badges: translations.badges,
                        proofs: translations.proofs,
                        fallback: translations.fallback,
                      }}
                      onQuoteClick={() => handleQuoteClick(product)}
                      onDownloadSpec={() => {
                        // Navigate to product detail page or trigger PDF download
                        router.push(`/${locale}/products/${product.slug}`);
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-[#80996F] text-lg mb-4">
                  {translations.emptyState.noProducts}
                </div>
                <button
                  onClick={handleClearFilters}
                  className="text-[#A89858] hover:text-[#B8A868] underline focus:outline-none focus:ring-2 focus:ring-[#A89858] focus:ring-offset-2 focus:ring-offset-[#0A1410] rounded"
                >
                  {translations.filters.clearAll}
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Mobile RFQ Button - Requirements: 5.8, 9.6 */}
      {selectedProduct && (
        <MobileRFQButton
          product={selectedProduct}
          locale={locale}
          translations={{
            requestQuote: translations.product.requestQuote,
          }}
          onClick={() => setIsRFQDrawerOpen(true)}
        />
      )}

      {/* RFQ Drawer Dark */}
      <RFQDrawerDark
        product={selectedProduct}
        locale={locale}
        translations={translations.rfq}
        isOpen={isRFQDrawerOpen}
        onClose={() => {
          setIsRFQDrawerOpen(false);
          // Don't clear selectedProduct to keep mobile button visible
        }}
        onSubmit={handleRFQSubmit}
      />

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
