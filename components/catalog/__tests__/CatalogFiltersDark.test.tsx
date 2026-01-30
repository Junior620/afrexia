/**
 * CatalogFiltersDark Component Tests
 * 
 * Tests for the dark premium filter bar component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CatalogFiltersDark } from '../CatalogFiltersDark';
import { FilterState, Category, Origin, Certification } from '@/types/product';

// Mock analytics
vi.mock('@/lib/analytics/events', () => ({
  trackCatalogFilter: vi.fn(),
}));

const mockCategories: Category[] = [
  { id: 'cocoa', name: 'Cacao', slug: 'cocoa' },
  { id: 'coffee', name: 'Café', slug: 'coffee' },
];

const mockOrigins: Origin[] = [
  { id: 'ci', name: 'Côte d\'Ivoire', code: 'CI' },
  { id: 'gh', name: 'Ghana', code: 'GH' },
];

const mockCertifications: Certification[] = [
  { id: 'organic', name: 'Bio/Organic' },
  { id: 'fairtrade', name: 'Fairtrade' },
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

describe('CatalogFiltersDark', () => {
  const mockOnSearchChange = vi.fn();
  const mockOnFilterChange = vi.fn();
  const mockOnClearFilters = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders desktop filter bar', () => {
    render(
      <CatalogFiltersDark
        searchQuery=""
        activeFilters={defaultFilterState}
        categories={mockCategories}
        origins={mockOrigins}
        certifications={mockCertifications}
        translations={mockTranslations}
        onSearchChange={mockOnSearchChange}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
        productCount={10}
      />
    );

    // Check search input is present
    expect(screen.getByPlaceholderText('Rechercher un produit...')).toBeInTheDocument();
    
    // Check product count is displayed
    expect(screen.getByText('10 produits')).toBeInTheDocument();
  });

  it('displays product count correctly', () => {
    const { rerender } = render(
      <CatalogFiltersDark
        searchQuery=""
        activeFilters={defaultFilterState}
        categories={mockCategories}
        origins={mockOrigins}
        certifications={mockCertifications}
        translations={mockTranslations}
        onSearchChange={mockOnSearchChange}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
        productCount={1}
      />
    );

    expect(screen.getByText('1 produit')).toBeInTheDocument();

    rerender(
      <CatalogFiltersDark
        searchQuery=""
        activeFilters={defaultFilterState}
        categories={mockCategories}
        origins={mockOrigins}
        certifications={mockCertifications}
        translations={mockTranslations}
        onSearchChange={mockOnSearchChange}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
        productCount={5}
      />
    );

    expect(screen.getByText('5 produits')).toBeInTheDocument();
  });

  it('debounces search input', async () => {
    vi.useFakeTimers();

    render(
      <CatalogFiltersDark
        searchQuery=""
        activeFilters={defaultFilterState}
        categories={mockCategories}
        origins={mockOrigins}
        certifications={mockCertifications}
        translations={mockTranslations}
        onSearchChange={mockOnSearchChange}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
        productCount={10}
      />
    );

    const searchInput = screen.getByPlaceholderText('Rechercher un produit...');
    
    fireEvent.change(searchInput, { target: { value: 'cacao' } });

    // Should not call immediately
    expect(mockOnSearchChange).not.toHaveBeenCalled();

    // Fast-forward 300ms
    vi.advanceTimersByTime(300);

    // Should call after debounce
    await waitFor(() => {
      expect(mockOnSearchChange).toHaveBeenCalledWith('cacao');
    });

    vi.useRealTimers();
  });

  it('displays active filter chips', () => {
    const activeFilters: FilterState = {
      ...defaultFilterState,
      category: 'cocoa',
      origins: ['CI'],
    };

    render(
      <CatalogFiltersDark
        searchQuery=""
        activeFilters={activeFilters}
        categories={mockCategories}
        origins={mockOrigins}
        certifications={mockCertifications}
        translations={mockTranslations}
        onSearchChange={mockOnSearchChange}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
        productCount={10}
      />
    );

    // Check filter chips are displayed (using getAllByText since they appear in multiple places)
    expect(screen.getAllByText('Cacao').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Côte d\'Ivoire').length).toBeGreaterThan(0);
  });

  it('shows clear all button when filters are active', () => {
    const activeFilters: FilterState = {
      ...defaultFilterState,
      category: 'cocoa',
    };

    render(
      <CatalogFiltersDark
        searchQuery=""
        activeFilters={activeFilters}
        categories={mockCategories}
        origins={mockOrigins}
        certifications={mockCertifications}
        translations={mockTranslations}
        onSearchChange={mockOnSearchChange}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
        productCount={10}
      />
    );

    const clearButtons = screen.getAllByText('Réinitialiser');
    expect(clearButtons.length).toBeGreaterThan(0);

    fireEvent.click(clearButtons[0]);
    expect(mockOnClearFilters).toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    render(
      <CatalogFiltersDark
        searchQuery=""
        activeFilters={defaultFilterState}
        categories={mockCategories}
        origins={mockOrigins}
        certifications={mockCertifications}
        translations={mockTranslations}
        onSearchChange={mockOnSearchChange}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
        productCount={10}
      />
    );

    // Check ARIA live region for product count (using getAllByText since it appears in multiple places)
    const productCounts = screen.getAllByText('10 produits');
    expect(productCounts.length).toBeGreaterThan(0);
    expect(productCounts[0]).toHaveAttribute('role', 'status');
    expect(productCounts[0]).toHaveAttribute('aria-live', 'polite');
  });

  it('displays mobile filter button on mobile', () => {
    // Mock mobile viewport
    global.innerWidth = 500;

    render(
      <CatalogFiltersDark
        searchQuery=""
        activeFilters={defaultFilterState}
        categories={mockCategories}
        origins={mockOrigins}
        certifications={mockCertifications}
        translations={mockTranslations}
        onSearchChange={mockOnSearchChange}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
        productCount={10}
      />
    );

    // Mobile filter button should be present
    const filterButton = screen.getByText('Filtres');
    expect(filterButton).toBeInTheDocument();
  });

  it('shows filter count badge on mobile button', () => {
    const activeFilters: FilterState = {
      ...defaultFilterState,
      category: 'cocoa',
      origins: ['CI', 'GH'],
    };

    render(
      <CatalogFiltersDark
        searchQuery=""
        activeFilters={activeFilters}
        categories={mockCategories}
        origins={mockOrigins}
        certifications={mockCertifications}
        translations={mockTranslations}
        onSearchChange={mockOnSearchChange}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
        productCount={10}
      />
    );

    // Should show count of 3 (1 category + 2 origins)
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});

