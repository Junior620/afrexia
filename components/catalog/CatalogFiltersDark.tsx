'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { InputDark } from '@/components/ui/InputDark';
import { SelectDark, SelectDarkOption } from '@/components/ui/SelectDark';
import { ButtonDark } from '@/components/ui/ButtonDark';
import { BadgeDark } from '@/components/ui/BadgeDark';
import {
  FilterState,
  FilterType,
  Category,
  Origin,
  Certification,
  AvailabilityStatus,
} from '@/types/product';
import { FilterTranslations, AvailabilityTranslations } from '@/types/translations';
import { trackCatalogFilter } from '@/lib/analytics/events';

export interface CatalogFiltersDarkProps {
  searchQuery: string;
  activeFilters: FilterState;
  categories: Category[];
  origins: Origin[];
  certifications: Certification[];
  translations: {
    filters: FilterTranslations;
    availability: AvailabilityTranslations;
  };
  onSearchChange: (query: string) => void;
  onFilterChange: (filterType: FilterType, value: any) => void;
  onClearFilters: () => void;
  productCount: number;
  className?: string;
}

/**
 * CatalogFiltersDark Component
 * Dark premium filter bar with glass effect
 * 
 * Features:
 * - Sticky positioning with glass effect
 * - Search input with debouncing (300ms)
 * - Filter dropdowns: category, origin, availability, certifications, incoterms
 * - Active filter chips with remove functionality
 * - Product count display
 * - "Clear all filters" button
 * - Mobile filter drawer (< 768px)
 * - Analytics tracking for filter usage
 * 
 * Filter Logic:
 * - Uses applyFilters() from lib/catalog/filters.ts with AND logic
 * - Debounced search with 300ms delay
 * - URL params sync handled by parent component using lib/catalog/url-params.ts
 * 
 * Requirements: 3.1-3.9, 8.1
 */
export const CatalogFiltersDark: React.FC<CatalogFiltersDarkProps> = ({
  searchQuery,
  activeFilters,
  categories,
  origins,
  certifications,
  translations,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  productCount,
  className,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearchQuery);
      
      // Track search filter usage
      if (localSearchQuery.trim() !== '') {
        trackCatalogFilter({
          filterType: 'search',
          filterValue: localSearchQuery,
          resultCount: productCount,
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchQuery, onSearchChange, productCount]);

  // Sync local search with prop changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Track scroll for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Count active filters
  const activeFilterCount = [
    activeFilters.category,
    ...activeFilters.origins,
    ...activeFilters.availability,
    activeFilters.eudrReady !== undefined ? 'eudr' : null,
    ...activeFilters.certifications,
    ...activeFilters.incoterms,
    activeFilters.moqRange,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0 || searchQuery.trim() !== '';

  // Wrap onFilterChange to track analytics
  const handleFilterChange = useCallback(
    (filterType: FilterType, value: any) => {
      onFilterChange(filterType, value);
      
      // Track filter usage
      trackCatalogFilter({
        filterType,
        filterValue: value,
        resultCount: productCount,
      });
    },
    [onFilterChange, productCount]
  );

  // Prepare select options - memoized to avoid recreation on every render
  const categoryOptions: SelectDarkOption[] = useMemo(() => 
    categories.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })),
    [categories]
  );

  const originOptions: SelectDarkOption[] = useMemo(() =>
    origins.map((origin) => ({
      value: origin.code,
      label: origin.name,
    })),
    [origins]
  );

  const availabilityOptions: SelectDarkOption[] = useMemo(() => [
    { value: 'in-stock', label: translations.availability['in-stock'] },
    { value: 'limited', label: translations.availability.limited },
    { value: 'pre-order', label: translations.availability['pre-order'] },
  ], [translations.availability]);

  const certificationOptions: SelectDarkOption[] = useMemo(() =>
    certifications.map((cert) => ({
      value: cert.id,
      label: cert.name,
    })),
    [certifications]
  );

  const incotermOptions: SelectDarkOption[] = useMemo(() => [
    { value: 'FOB', label: 'FOB (Free On Board)' },
    { value: 'CIF', label: 'CIF (Cost, Insurance & Freight)' },
    { value: 'DAP', label: 'DAP (Delivered At Place)' },
    { value: 'EXW', label: 'EXW (Ex Works)' },
    { value: 'FCA', label: 'FCA (Free Carrier)' },
  ], []);

  // Handle filter removal from chips
  const handleRemoveFilter = useCallback(
    (filterType: FilterType, value?: any) => {
      switch (filterType) {
        case 'search':
          setLocalSearchQuery('');
          onSearchChange('');
          break;
        case 'category':
          onFilterChange('category', undefined);
          break;
        case 'origins':
          if (value) {
            const newOrigins = activeFilters.origins.filter((o) => o !== value);
            onFilterChange('origins', newOrigins);
          }
          break;
        case 'availability':
          if (value) {
            const newAvailability = activeFilters.availability.filter((a) => a !== value);
            onFilterChange('availability', newAvailability);
          }
          break;
        case 'eudrReady':
          onFilterChange('eudrReady', undefined);
          break;
        case 'certifications':
          if (value) {
            const newCerts = activeFilters.certifications.filter((c) => c !== value);
            onFilterChange('certifications', newCerts);
          }
          break;
        case 'incoterms':
          if (value) {
            const newIncoterms = activeFilters.incoterms.filter((i) => i !== value);
            onFilterChange('incoterms', newIncoterms);
          }
          break;
        case 'moqRange':
          onFilterChange('moqRange', undefined);
          break;
      }
    },
    [activeFilters, onFilterChange, onSearchChange]
  );

  // Render active filter chips
  const renderActiveFilterChips = () => {
    const chips: React.ReactNode[] = [];

    // Search chip
    if (searchQuery.trim() !== '') {
      chips.push(
        <FilterChipDark
          key="search"
          label={`"${searchQuery}"`}
          onRemove={() => handleRemoveFilter('search')}
        />
      );
    }

    // Category chip
    if (activeFilters.category) {
      const category = categories.find((c) => c.id === activeFilters.category);
      if (category) {
        chips.push(
          <FilterChipDark
            key="category"
            label={category.name}
            onRemove={() => handleRemoveFilter('category')}
          />
        );
      }
    }

    // Origin chips
    activeFilters.origins.forEach((originCode) => {
      const origin = origins.find((o) => o.code === originCode);
      if (origin) {
        chips.push(
          <FilterChipDark
            key={`origin-${originCode}`}
            label={origin.name}
            onRemove={() => handleRemoveFilter('origins', originCode)}
          />
        );
      }
    });

    // Availability chips
    activeFilters.availability.forEach((status) => {
      chips.push(
        <FilterChipDark
          key={`availability-${status}`}
          label={translations.availability[status]}
          onRemove={() => handleRemoveFilter('availability', status)}
        />
      );
    });

    // EUDR chip
    if (activeFilters.eudrReady !== undefined) {
      chips.push(
        <FilterChipDark
          key="eudr"
          label="EUDR Ready"
          onRemove={() => handleRemoveFilter('eudrReady')}
        />
      );
    }

    // Certification chips
    activeFilters.certifications.forEach((certId) => {
      const cert = certifications.find((c) => c.id === certId);
      if (cert) {
        chips.push(
          <FilterChipDark
            key={`cert-${certId}`}
            label={cert.name}
            onRemove={() => handleRemoveFilter('certifications', certId)}
          />
        );
      }
    });

    // Incoterm chips
    activeFilters.incoterms.forEach((incoterm) => {
      chips.push(
        <FilterChipDark
          key={`incoterm-${incoterm}`}
          label={incoterm}
          onRemove={() => handleRemoveFilter('incoterms', incoterm)}
        />
      );
    });

    // MOQ Range chip
    if (activeFilters.moqRange) {
      chips.push(
        <FilterChipDark
          key="moq"
          label={`MOQ: ${activeFilters.moqRange.min}-${activeFilters.moqRange.max} kg`}
          onRemove={() => handleRemoveFilter('moqRange')}
        />
      );
    }

    return chips;
  };

  const filterChips = renderActiveFilterChips();

  return (
    <>
      {/* Desktop Filter Bar */}
      <div
        className={cn(
          'sticky top-0 z-40',
          'bg-[rgba(26,40,32,0.8)] backdrop-blur-[12px]',
          'border-b border-[rgba(255,255,255,0.1)]',
          'transition-all duration-200',
          isScrolled ? 'shadow-[0_8px_32px_rgba(0,0,0,0.3)] py-3' : 'py-4',
          className
        )}
      >
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          {/* Desktop View */}
          <div className="hidden md:block">
            {/* Search and Filters Row */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {/* Search Input */}
              <div className="w-full md:w-80">
                <InputDark
                  type="search"
                  placeholder={translations.filters.searchPlaceholder || 'Rechercher un produit...'}
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  }
                  iconPosition="left"
                  aria-label={translations.filters.search}
                />
              </div>

              {/* Category Filter */}
              <SelectDark
                placeholder={translations.filters.categoryPlaceholder || 'Catégorie'}
                options={categoryOptions}
                value={activeFilters.category}
                onChange={(value) => handleFilterChange('category', value || undefined)}
                className="w-48"
                searchable
              />

              {/* Origin Filter */}
              <SelectDark
                placeholder={translations.filters.originPlaceholder || 'Origine'}
                options={originOptions}
                value={activeFilters.origins}
                onChange={(value) => handleFilterChange('origins', value)}
                multiple
                searchable
                className="w-48"
              />

              {/* Availability Filter */}
              <SelectDark
                placeholder={translations.filters.availabilityPlaceholder || 'Disponibilité'}
                options={availabilityOptions}
                value={activeFilters.availability}
                onChange={(value) => handleFilterChange('availability', value)}
                multiple
                className="w-48"
              />

              {/* Certifications Filter */}
              <SelectDark
                placeholder={translations.filters.certificationsPlaceholder || 'Certifications'}
                options={certificationOptions}
                value={activeFilters.certifications}
                onChange={(value) => handleFilterChange('certifications', value)}
                multiple
                searchable
                className="w-48"
              />

              {/* Incoterms Filter */}
              <SelectDark
                placeholder={translations.filters.incotermsPlaceholder || 'Incoterms'}
                options={incotermOptions}
                value={activeFilters.incoterms}
                onChange={(value) => handleFilterChange('incoterms', value)}
                multiple
                className="w-48"
              />
            </div>

            {/* Active Filters and Count Row */}
            {(hasActiveFilters || filterChips.length > 0) && (
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  {filterChips}
                  {hasActiveFilters && (
                    <button
                      onClick={onClearFilters}
                      className={cn(
                        'text-sm text-[#A89858] hover:text-[#B8A868]',
                        'underline transition-colors',
                        'focus:outline-none focus:ring-2 focus:ring-[#A89858] focus:ring-offset-2 focus:ring-offset-[#0A1410] rounded'
                      )}
                      aria-label="Clear all active filters"
                    >
                      {translations.filters.clearAll}
                    </button>
                  )}
                </div>
                <div 
                  className="text-sm text-[#B0D4B8] font-medium"
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {productCount} {productCount === 1 ? 'produit' : 'produits'}
                </div>
              </div>
            )}

            {/* Product Count (when no active filters) */}
            {!hasActiveFilters && filterChips.length === 0 && (
              <div 
                className="text-sm text-[#B0D4B8] font-medium"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                {productCount} {productCount === 1 ? 'produit' : 'produits'}
              </div>
            )}
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="flex-1">
                <InputDark
                  type="search"
                  placeholder={translations.filters.searchPlaceholder || 'Rechercher...'}
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  }
                  iconPosition="left"
                />
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-3 min-h-[44px]',
                  'bg-[rgba(26,40,32,0.6)] backdrop-blur-[12px]',
                  'border-2 border-[rgba(255,255,255,0.1)] rounded-xl',
                  'text-[#E8F5E9] font-semibold text-sm',
                  'hover:border-[rgba(255,255,255,0.2)] transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-[#A89858] focus:ring-offset-2 focus:ring-offset-[#0A1410]'
                )}
                aria-label={`${translations.filters.showFilters || 'Filtrer'} ${
                  activeFilterCount > 0 ? `(${activeFilterCount} actifs)` : ''
                }`}
                aria-expanded={isMobileDrawerOpen}
                aria-controls="mobile-filter-drawer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span>Filtres</span>
                {activeFilterCount > 0 && (
                  <span
                    className={cn(
                      'absolute -top-2 -right-2',
                      'flex items-center justify-center',
                      'w-6 h-6 rounded-full',
                      'bg-[#4A9A62] text-white text-xs font-bold'
                    )}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Active Filters */}
            {filterChips.length > 0 && (
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                {filterChips}
                <button
                  onClick={onClearFilters}
                  className={cn(
                    'text-sm text-[#A89858] hover:text-[#B8A868]',
                    'underline transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-[#A89858] focus:ring-offset-2 focus:ring-offset-[#0A1410] rounded'
                  )}
                >
                  {translations.filters.clearAll}
                </button>
              </div>
            )}

            {/* Mobile Product Count */}
            <div 
              className="mt-2 text-sm text-[#B0D4B8] font-medium"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {productCount} {productCount === 1 ? 'produit' : 'produits'}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileDrawerOpen && (
        <MobileFilterDrawerDark
          activeFilters={activeFilters}
          categories={categories}
          origins={origins}
          certifications={certifications}
          translations={translations}
          onFilterChange={handleFilterChange}
          onClose={() => setIsMobileDrawerOpen(false)}
          onClearFilters={onClearFilters}
          activeFilterCount={activeFilterCount}
        />
      )}
    </>
  );
};

/**
 * FilterChipDark Component
 * Displays an active filter with remove button in dark theme
 */
interface FilterChipDarkProps {
  label: string;
  onRemove: () => void;
}

const FilterChipDark: React.FC<FilterChipDarkProps> = ({ label, onRemove }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        'px-3 py-1.5 rounded-full',
        'bg-[rgba(74,154,98,0.2)] text-[#4A9A62] text-xs font-semibold',
        'border border-[rgba(74,154,98,0.3)]'
      )}
    >
      <span>{label}</span>
      <button
        onClick={onRemove}
        className={cn(
          'flex items-center justify-center',
          'w-4 h-4 rounded-full',
          'hover:bg-[rgba(74,154,98,0.3)] transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-[#4A9A62] focus:ring-offset-1 focus:ring-offset-[#0A1410]'
        )}
        aria-label={`Remove ${label} filter`}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
};

/**
 * MobileFilterDrawerDark Component
 * Expandable drawer for mobile filter controls in dark theme
 */
interface MobileFilterDrawerDarkProps {
  activeFilters: FilterState;
  categories: Category[];
  origins: Origin[];
  certifications: Certification[];
  translations: {
    filters: FilterTranslations;
    availability: AvailabilityTranslations;
  };
  onFilterChange: (filterType: FilterType, value: any) => void;
  onClose: () => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

const MobileFilterDrawerDark: React.FC<MobileFilterDrawerDarkProps> = ({
  activeFilters,
  categories,
  origins,
  certifications,
  translations,
  onFilterChange,
  onClose,
  onClearFilters,
  activeFilterCount,
}) => {
  // Prepare select options - memoized to avoid recreation on every render
  const categoryOptions: SelectDarkOption[] = useMemo(() =>
    categories.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })),
    [categories]
  );

  const originOptions: SelectDarkOption[] = useMemo(() =>
    origins.map((origin) => ({
      value: origin.code,
      label: origin.name,
    })),
    [origins]
  );

  const availabilityOptions: SelectDarkOption[] = useMemo(() => [
    { value: 'in-stock', label: translations.availability['in-stock'] },
    { value: 'limited', label: translations.availability.limited },
    { value: 'pre-order', label: translations.availability['pre-order'] },
  ], [translations.availability]);

  const certificationOptions: SelectDarkOption[] = useMemo(() =>
    certifications.map((cert) => ({
      value: cert.id,
      label: cert.name,
    })),
    [certifications]
  );

  const incotermOptions: SelectDarkOption[] = useMemo(() => [
    { value: 'FOB', label: 'FOB (Free On Board)' },
    { value: 'CIF', label: 'CIF (Cost, Insurance & Freight)' },
    { value: 'DAP', label: 'DAP (Delivered At Place)' },
    { value: 'EXW', label: 'EXW (Ex Works)' },
    { value: 'FCA', label: 'FCA (Free Carrier)' },
  ], []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 z-50 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        id="mobile-filter-drawer"
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50',
          'bg-[#0A1410] rounded-t-2xl shadow-[0_-4px_32px_rgba(0,0,0,0.5)]',
          'max-h-[80vh] overflow-hidden',
          'md:hidden',
          'animate-slide-up'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Filter options"
        aria-labelledby="mobile-filter-drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[rgba(255,255,255,0.1)]">
          <h2 id="mobile-filter-drawer-title" className="text-lg font-bold text-[#E8F5E9]">
            {translations.filters.activeFilters || 'Filtres'}
            {activeFilterCount > 0 && (
              <span className="ml-2 text-[#4A9A62]">({activeFilterCount})</span>
            )}
          </h2>
          <button
            onClick={onClose}
            className={cn(
              'flex items-center justify-center',
              'w-10 h-10 rounded-full',
              'hover:bg-[rgba(255,255,255,0.05)] transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-[#A89858] focus:ring-offset-2 focus:ring-offset-[#0A1410]'
            )}
            aria-label="Close filters"
          >
            <svg className="w-6 h-6 text-[#E8F5E9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(80vh - 140px)' }}>
          {/* Category Filter */}
          <SelectDark
            label={translations.filters.category}
            placeholder={translations.filters.categoryPlaceholder || 'Sélectionner une catégorie'}
            options={categoryOptions}
            value={activeFilters.category}
            onChange={(value) => onFilterChange('category', value || undefined)}
            searchable
          />

          {/* Origin Filter */}
          <SelectDark
            label={translations.filters.origin}
            placeholder={translations.filters.originPlaceholder || 'Sélectionner des origines'}
            options={originOptions}
            value={activeFilters.origins}
            onChange={(value) => onFilterChange('origins', value)}
            multiple
            searchable
          />

          {/* Availability Filter */}
          <SelectDark
            label={translations.filters.availability}
            placeholder={translations.filters.availabilityPlaceholder || 'Sélectionner la disponibilité'}
            options={availabilityOptions}
            value={activeFilters.availability}
            onChange={(value) => onFilterChange('availability', value)}
            multiple
          />

          {/* Certifications Filter */}
          <SelectDark
            label={translations.filters.certifications}
            placeholder={translations.filters.certificationsPlaceholder || 'Sélectionner des certifications'}
            options={certificationOptions}
            value={activeFilters.certifications}
            onChange={(value) => onFilterChange('certifications', value)}
            multiple
            searchable
          />

          {/* Incoterms Filter */}
          <SelectDark
            label={translations.filters.incoterms}
            placeholder={translations.filters.incotermsPlaceholder || 'Sélectionner des incoterms'}
            options={incotermOptions}
            value={activeFilters.incoterms}
            onChange={(value) => onFilterChange('incoterms', value)}
            multiple
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 p-4 border-t border-[rgba(255,255,255,0.1)] bg-[#1A2820]">
          <ButtonDark
            variant="ghost"
            onClick={() => {
              onClearFilters();
              onClose();
            }}
            className="flex-1"
            disabled={activeFilterCount === 0}
          >
            {translations.filters.clearAll}
          </ButtonDark>
          <ButtonDark onClick={onClose} className="flex-1">
            Appliquer
          </ButtonDark>
        </div>
      </div>
    </>
  );
};

CatalogFiltersDark.displayName = 'CatalogFiltersDark';

