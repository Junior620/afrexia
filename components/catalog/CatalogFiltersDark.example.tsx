/**
 * CatalogFiltersDark Component - Usage Example
 * 
 * This example demonstrates how to use the CatalogFiltersDark component
 * with filter state management and URL synchronization.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { CatalogFiltersDark } from './CatalogFiltersDark';
import { applyFilters } from '@/lib/catalog/filters';
import { updateURLWithFilters, deserializeFiltersFromURL } from '@/lib/catalog/url-params';
import { FilterState, Product, Category, Origin, Certification } from '@/types/product';

// Example data
const mockCategories: Category[] = [
  { id: 'cocoa', name: 'Cacao', slug: 'cocoa' },
  { id: 'coffee', name: 'Café', slug: 'coffee' },
  { id: 'spices', name: 'Épices', slug: 'spices' },
];

const mockOrigins: Origin[] = [
  { id: 'ci', name: 'Côte d\'Ivoire', code: 'CI' },
  { id: 'gh', name: 'Ghana', code: 'GH' },
  { id: 'cm', name: 'Cameroun', code: 'CM' },
];

const mockCertifications: Certification[] = [
  { id: 'organic', name: 'Bio/Organic' },
  { id: 'fairtrade', name: 'Fairtrade' },
  { id: 'rainforest', name: 'Rainforest Alliance' },
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
  availability: {
    'in-stock': 'En stock',
    'limited': 'Stock limité',
    'pre-order': 'Pré-commande',
  },
};

export function CatalogFiltersDarkExample() {
  // Initialize filter state from URL on mount
  const [filterState, setFilterState] = useState<FilterState>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      return deserializeFiltersFromURL(searchParams);
    }
    return {
      search: '',
      category: undefined,
      origins: [],
      availability: [],
      eudrReady: undefined,
      certifications: [],
      incoterms: [],
      moqRange: undefined,
    };
  });

  // Mock products (in real app, fetch from API/CMS)
  const [products, setProducts] = useState<Product[]>([]);
  
  // Apply filters to get filtered products
  const filteredProducts = applyFilters(products, filterState);

  // Update URL when filters change
  useEffect(() => {
    updateURLWithFilters(filterState, window.location.pathname);
  }, [filterState]);

  // Handle search change
  const handleSearchChange = (query: string) => {
    setFilterState((prev) => ({
      ...prev,
      search: query,
    }));
  };

  // Handle filter change
  const handleFilterChange = (filterType: string, value: any) => {
    setFilterState((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Handle clear all filters
  const handleClearFilters = () => {
    setFilterState({
      search: '',
      category: undefined,
      origins: [],
      availability: [],
      eudrReady: undefined,
      certifications: [],
      incoterms: [],
      moqRange: undefined,
    });
  };

  return (
    <div className="min-h-screen bg-[#0A1410]">
      <CatalogFiltersDark
        searchQuery={filterState.search}
        activeFilters={filterState}
        categories={mockCategories}
        origins={mockOrigins}
        certifications={mockCertifications}
        translations={mockTranslations}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        productCount={filteredProducts.length}
      />

      {/* Product Grid would go here */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-[#E8F5E9]">
          {filteredProducts.length} products found
        </div>
      </div>
    </div>
  );
}

