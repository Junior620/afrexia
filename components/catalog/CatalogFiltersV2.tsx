'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { InputDark } from '@/components/ui/InputDark';
import { SelectDark, SelectDarkOption } from '@/components/ui/SelectDark';
import { ButtonDark } from '@/components/ui/ButtonDark';
import { FilterState, Category, Origin, Certification } from '@/types/product';

export interface CatalogFiltersV2Props {
  searchQuery: string;
  activeFilters: FilterState;
  categories: Category[];
  origins: Origin[];
  certifications: Certification[];
  translations: any;
  onSearchChange: (query: string) => void;
  onFilterChange: (filterType: string, value: any) => void;
  onClearFilters: () => void;
  onSortChange: (sortBy: string) => void;
  productCount: number;
  sortBy?: string;
}

/**
 * CatalogFiltersV2 - Improved B2B catalog filters
 * 
 * New features:
 * - Sort dropdown (Pertinence, Disponibilité, MOQ, Origine)
 * - Active filter chips with remove
 * - Visible result counter
 * - Compact layout (1 row on desktop)
 * - Clear all button
 */
export const CatalogFiltersV2: React.FC<CatalogFiltersV2Props> = ({
  searchQuery,
  activeFilters,
  categories,
  origins,
  certifications,
  translations,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  onSortChange,
  productCount,
  sortBy = 'relevance',
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => onSearchChange(localSearch), 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  // Sort options
  const sortOptions: SelectDarkOption[] = [
    { value: 'relevance', label: translations.sort?.relevance || 'Pertinence' },
    { value: 'availability', label: translations.sort?.availability || 'Disponibilité' },
    { value: 'moq', label: translations.sort?.moq || 'MOQ' },
    { value: 'origin', label: translations.sort?.origin || 'Origine' },
  ];

  // Category options
  const categoryOptions: SelectDarkOption[] = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  // Origin options
  const originOptions: SelectDarkOption[] = origins.map((origin) => ({
    value: origin.id,
    label: `${origin.flag} ${origin.name}`,
  }));

  // Count active filters
  const activeFilterCount = [
    activeFilters.category,
    ...activeFilters.origins,
    ...activeFilters.availability,
    ...activeFilters.certifications,
    ...activeFilters.incoterms,
  ].filter(Boolean).length;

  // Remove individual filter
  const removeFilter = (type: string, value?: string) => {
    if (type === 'category') {
      onFilterChange('category', undefined);
    } else if (type === 'origins' && value) {
      const newOrigins = activeFilters.origins.filter((o) => o !== value);
      onFilterChange('origins', newOrigins);
    }
    // Add more types as needed
  };

  return (
    <div className="sticky top-0 z-40 bg-[rgba(10,20,16,0.95)] backdrop-blur-[16px] border-b border-[rgba(255,255,255,0.1)] shadow-lg">
      <div className="container mx-auto px-4 lg:px-6 max-w-7xl py-3">
        {/* Top Row: Search + Sort + Result Count */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          {/* Search */}
          <div className="flex-1 min-w-[240px]">
            <InputDark
              type="search"
              placeholder={translations.filters?.searchPlaceholder || 'Rechercher...'}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Sort */}
          <div className="w-[180px]">
            <SelectDark
              placeholder={translations.sort?.label || 'Trier par'}
              options={sortOptions}
              value={sortBy}
              onChange={(value) => onSortChange(value as string)}
            />
          </div>

          {/* Result Counter - VISIBLE */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[rgba(26,40,32,0.6)] border border-[rgba(255,255,255,0.1)] rounded-xl">
            <span className="text-sm font-semibold text-[#E8F5E9]">{productCount}</span>
            <span className="text-sm text-[#B0D4B8]">
              {productCount === 1 ? 'produit' : 'produits'}
            </span>
          </div>

          {/* Clear All - Only if filters active */}
          {activeFilterCount > 0 && (
            <ButtonDark
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-[#A89858] hover:text-[#B8A868]"
            >
              ✕ Réinitialiser
            </ButtonDark>
          )}
        </div>

        {/* Bottom Row: Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category */}
          <div className="w-[160px]">
            <SelectDark
              placeholder="Catégorie"
              options={categoryOptions}
              value={activeFilters.category}
              onChange={(value) => onFilterChange('category', value)}
            />
          </div>

          {/* Origin */}
          <div className="w-[160px]">
            <SelectDark
              placeholder="Origine"
              options={originOptions}
              value={activeFilters.origins[0]}
              onChange={(value) => onFilterChange('origins', value ? [value] : [])}
            />
          </div>

          {/* More filters button (mobile) */}
          <button
            className="md:hidden px-3 py-2 text-sm font-medium text-[#B0D4B8] hover:text-[#E8F5E9] transition-colors"
          >
            + Filtres
          </button>
        </div>

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[rgba(255,255,255,0.08)]">
            <span className="text-xs uppercase tracking-wider text-[#80996F] font-bold">
              Filtres actifs:
            </span>
            
            {/* Category chip */}
            {activeFilters.category && (
              <button
                onClick={() => removeFilter('category')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[rgba(74,154,98,0.15)] text-[#4A9A62] border border-[rgba(74,154,98,0.3)] hover:bg-[rgba(74,154,98,0.25)] transition-colors"
              >
                <span>
                  {categories.find((c) => c.id === activeFilters.category)?.name}
                </span>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}

            {/* Origin chips */}
            {activeFilters.origins.map((originId) => {
              const origin = origins.find((o) => o.id === originId);
              return origin ? (
                <button
                  key={originId}
                  onClick={() => removeFilter('origins', originId)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[rgba(74,154,98,0.15)] text-[#4A9A62] border border-[rgba(74,154,98,0.3)] hover:bg-[rgba(74,154,98,0.25)] transition-colors"
                >
                  <span>{origin.flag} {origin.name}</span>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              ) : null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

CatalogFiltersV2.displayName = 'CatalogFiltersV2';
