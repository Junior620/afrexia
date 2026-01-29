/**
 * CatalogFilters Component Usage Example
 * 
 * This example demonstrates how to use the CatalogFilters component
 * in a product catalog page.
 */

'use client';

import React, { useState } from 'react';
import { CatalogFilters } from './CatalogFilters';
import { FilterState, Category, Origin, Certification } from '@/types/product';
import { applyFilters } from '@/lib/catalog/filters';

// Example data
const exampleCategories: Category[] = [
  { id: 'cocoa', name: 'Cacao', slug: 'cocoa' },
  { id: 'coffee', name: 'Café', slug: 'coffee' },
  { id: 'spices', name: 'Épices', slug: 'spices' },
];

const exampleOrigins: Origin[] = [
  { id: '1', name: 'Côte d\'Ivoire', code: 'CI', flag: '🇨🇮' },
  { id: '2', name: 'Ghana', code: 'GH', flag: '🇬🇭' },
  { id: '3', name: 'Cameroun', code: 'CM', flag: '🇨🇲' },
  { id: '4', name: 'Nigeria', code: 'NG', flag: '🇳🇬' },
];

const exampleCertifications: Certification[] = [
  { id: 'organic', name: 'Bio', icon: '🌱' },
  { id: 'fairtrade', name: 'Fair Trade', icon: '🤝' },
  { id: 'rainforest', name: 'Rainforest Alliance', icon: '🌳' },
];

const exampleTranslations = {
  filters: {
    search: 'Rechercher',
    searchPlaceholder: 'Rechercher un produit...',
    category: 'Catégorie',
    categoryPlaceholder: 'Toutes les catégories',
    origin: 'Origine',
    originPlaceholder: 'Tous les pays',
    availability: 'Disponibilité',
    availabilityPlaceholder: 'Toutes disponibilités',
    certifications: 'Certifications',
    certificationsPlaceholder: 'Toutes certifications',
    incoterms: 'Incoterms',
    incotermsPlaceholder: 'Tous incoterms',
    moq: 'MOQ',
    clearAll: 'Effacer tous les filtres',
    showFilters: 'Afficher les filtres',
    hideFilters: 'Masquer les filtres',
  },
  availability: {
    'in-stock': 'En stock',
    'limited': 'Stock limité',
    'pre-order': 'Précommande',
  },
};

export function CatalogFiltersExample() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    search: '',
    category: undefined,
    origins: [],
    availability: [],
    eudrReady: undefined,
    certifications: [],
    incoterms: [],
    moqRange: undefined,
  });

  // Example products (would come from CMS in real implementation)
  const products = [
    // ... your products here
  ];

  // Apply filters to get filtered products
  const filteredProducts = applyFilters(products, {
    ...activeFilters,
    search: searchQuery,
  });

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filterType: any, value: any) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveFilters({
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
    <div>
      <CatalogFilters
        searchQuery={searchQuery}
        activeFilters={activeFilters}
        categories={exampleCategories}
        origins={exampleOrigins}
        certifications={exampleCertifications}
        translations={exampleTranslations}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        productCount={filteredProducts.length}
      />

      {/* Your product grid would go here */}
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">
          Showing {filteredProducts.length} products
        </p>
        {/* ProductGrid component */}
      </div>
    </div>
  );
}
