/**
 * Product Catalog Filter Utilities
 * 
 * Utility functions for filtering and searching products in the catalog.
 * Implements AND logic for multiple filters and case-insensitive search.
 */

import { Product, FilterState, MOQRange } from '@/types/product';

/**
 * Searches products by query string across name, category, and tags
 * 
 * @param products - Array of products to search
 * @param query - Search query string (case-insensitive)
 * @returns Filtered array of products matching the search query
 * 
 * @example
 * const results = searchProducts(products, 'cacao');
 * // Returns products with 'cacao' in name, category, or tags
 */
export function searchProducts(products: Product[], query: string): Product[] {
  if (!query || query.trim() === '') {
    return products;
  }

  const normalizedQuery = query.toLowerCase().trim();

  return products.filter((product) => {
    // Search in product name
    const nameMatch = product.name.toLowerCase().includes(normalizedQuery);
    
    // Search in category
    const categoryMatch = product.category.toLowerCase().includes(normalizedQuery);
    
    // Search in tags
    const tagsMatch = product.tags.some((tag) =>
      tag.toLowerCase().includes(normalizedQuery)
    );

    return nameMatch || categoryMatch || tagsMatch;
  });
}

/**
 * Checks if a product matches all active filters
 * 
 * @param product - Product to check
 * @param filterState - Current filter state with active filters
 * @returns True if product matches all filters, false otherwise
 * 
 * Uses AND logic: product must match ALL active filters to pass
 */
export function matchesAllFilters(
  product: Product,
  filterState: FilterState
): boolean {
  // Category filter
  if (filterState.category && product.category !== filterState.category) {
    return false;
  }

  // Origins filter (product must have at least one matching origin)
  if (filterState.origins.length > 0) {
    const hasMatchingOrigin = filterState.origins.some((origin) =>
      product.origins.includes(origin)
    );
    if (!hasMatchingOrigin) {
      return false;
    }
  }

  // Availability filter
  if (filterState.availability.length > 0) {
    if (!filterState.availability.includes(product.availability)) {
      return false;
    }
  }

  // EUDR Ready filter
  if (filterState.eudrReady !== undefined) {
    if (product.eudrReady !== filterState.eudrReady) {
      return false;
    }
  }

  // Certifications filter (product must have at least one matching certification)
  if (filterState.certifications.length > 0) {
    const hasMatchingCertification = filterState.certifications.some(
      (certification) => product.certifications.includes(certification)
    );
    if (!hasMatchingCertification) {
      return false;
    }
  }

  // Incoterms filter (product must support at least one matching incoterm)
  if (filterState.incoterms.length > 0) {
    const hasMatchingIncoterm = filterState.incoterms.some((incoterm) =>
      product.incoterms.includes(incoterm)
    );
    if (!hasMatchingIncoterm) {
      return false;
    }
  }

  // MOQ Range filter
  if (filterState.moqRange) {
    const productMOQ = product.moq.value;
    if (
      productMOQ < filterState.moqRange.min ||
      productMOQ > filterState.moqRange.max
    ) {
      return false;
    }
  }

  // Product matches all filters
  return true;
}

/**
 * Applies all active filters to a product collection
 * 
 * @param products - Array of products to filter
 * @param filterState - Current filter state with active filters
 * @returns Filtered array of products matching all criteria
 * 
 * Combines search and filter logic:
 * 1. First applies search query if present
 * 2. Then applies all other filters using AND logic
 * 
 * @example
 * const filtered = applyFilters(products, {
 *   search: 'cacao',
 *   category: 'cocoa',
 *   origins: ['CI'],
 *   availability: ['in-stock'],
 *   eudrReady: true,
 *   certifications: ['organic'],
 *   incoterms: ['FOB'],
 *   moqRange: { min: 100, max: 1000 }
 * });
 */
export function applyFilters(
  products: Product[],
  filterState: FilterState
): Product[] {
  // First apply search if query exists
  let filteredProducts = products;
  if (filterState.search && filterState.search.trim() !== '') {
    filteredProducts = searchProducts(filteredProducts, filterState.search);
  }

  // Then apply all other filters
  filteredProducts = filteredProducts.filter((product) =>
    matchesAllFilters(product, filterState)
  );

  return filteredProducts;
}

/**
 * Counts products matching the current filter state
 * 
 * @param products - Array of products to count
 * @param filterState - Current filter state
 * @returns Number of products matching all filters
 */
export function countFilteredProducts(
  products: Product[],
  filterState: FilterState
): number {
  return applyFilters(products, filterState).length;
}

/**
 * Checks if any filters are active
 * 
 * @param filterState - Current filter state
 * @returns True if any filters are active, false otherwise
 */
export function hasActiveFilters(filterState: FilterState): boolean {
  return (
    (filterState.search && filterState.search.trim() !== '') ||
    filterState.category !== undefined ||
    filterState.origins.length > 0 ||
    filterState.availability.length > 0 ||
    filterState.eudrReady !== undefined ||
    filterState.certifications.length > 0 ||
    filterState.incoterms.length > 0 ||
    filterState.moqRange !== undefined
  );
}

/**
 * Resets all filters to their default state
 * 
 * @returns Empty filter state
 */
export function resetFilters(): FilterState {
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
}
