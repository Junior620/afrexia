/**
 * URL Parameters Utilities for Catalog Filters
 * 
 * Utilities for syncing filter state with URL query parameters.
 * Enables shareable filter URLs and browser back/forward navigation.
 */

import { FilterState, MOQRange } from '@/types/product';

/**
 * Serializes filter state to URL search params
 * 
 * @param filterState - Current filter state
 * @returns URLSearchParams object with filter values
 * 
 * @example
 * const params = serializeFiltersToURL(filterState);
 * router.push(`/products?${params.toString()}`);
 */
export function serializeFiltersToURL(filterState: FilterState): URLSearchParams {
  const params = new URLSearchParams();

  // Search query
  if (filterState.search && filterState.search.trim() !== '') {
    params.set('q', filterState.search);
  }

  // Category
  if (filterState.category) {
    params.set('category', filterState.category);
  }

  // Origins (comma-separated)
  if (filterState.origins.length > 0) {
    params.set('origins', filterState.origins.join(','));
  }

  // Availability (comma-separated)
  if (filterState.availability.length > 0) {
    params.set('availability', filterState.availability.join(','));
  }

  // EUDR Ready
  if (filterState.eudrReady !== undefined) {
    params.set('eudr', filterState.eudrReady ? '1' : '0');
  }

  // Certifications (comma-separated)
  if (filterState.certifications.length > 0) {
    params.set('certifications', filterState.certifications.join(','));
  }

  // Incoterms (comma-separated)
  if (filterState.incoterms.length > 0) {
    params.set('incoterms', filterState.incoterms.join(','));
  }

  // MOQ Range
  if (filterState.moqRange) {
    params.set('moq_min', filterState.moqRange.min.toString());
    params.set('moq_max', filterState.moqRange.max.toString());
  }

  return params;
}

/**
 * Deserializes URL search params to filter state
 * 
 * @param searchParams - URLSearchParams from URL
 * @returns FilterState object
 * 
 * @example
 * const filterState = deserializeFiltersFromURL(searchParams);
 */
export function deserializeFiltersFromURL(searchParams: URLSearchParams): FilterState {
  const filterState: FilterState = {
    search: '',
    category: undefined,
    origins: [],
    availability: [],
    eudrReady: undefined,
    certifications: [],
    incoterms: [],
    moqRange: undefined,
  };

  // Search query
  const search = searchParams.get('q');
  if (search) {
    filterState.search = search;
  }

  // Category
  const category = searchParams.get('category');
  if (category) {
    filterState.category = category;
  }

  // Origins
  const origins = searchParams.get('origins');
  if (origins) {
    filterState.origins = origins.split(',').filter(Boolean);
  }

  // Availability
  const availability = searchParams.get('availability');
  if (availability) {
    filterState.availability = availability.split(',').filter(Boolean) as any[];
  }

  // EUDR Ready
  const eudr = searchParams.get('eudr');
  if (eudr !== null) {
    filterState.eudrReady = eudr === '1';
  }

  // Certifications
  const certifications = searchParams.get('certifications');
  if (certifications) {
    filterState.certifications = certifications.split(',').filter(Boolean);
  }

  // Incoterms
  const incoterms = searchParams.get('incoterms');
  if (incoterms) {
    filterState.incoterms = incoterms.split(',').filter(Boolean);
  }

  // MOQ Range
  const moqMin = searchParams.get('moq_min');
  const moqMax = searchParams.get('moq_max');
  if (moqMin && moqMax) {
    filterState.moqRange = {
      min: parseInt(moqMin, 10),
      max: parseInt(moqMax, 10),
    };
  }

  return filterState;
}

/**
 * Updates URL with current filter state without page reload
 * 
 * @param filterState - Current filter state
 * @param pathname - Current pathname
 * 
 * @example
 * updateURLWithFilters(filterState, '/products');
 */
export function updateURLWithFilters(filterState: FilterState, pathname: string): void {
  if (typeof window === 'undefined') return;

  const params = serializeFiltersToURL(filterState);
  const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
  
  // Update URL without page reload
  window.history.replaceState({}, '', url);
}

/**
 * Checks if filter state has any active filters
 * 
 * @param filterState - Filter state to check
 * @returns True if any filters are active
 */
export function hasActiveFiltersInURL(filterState: FilterState): boolean {
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

