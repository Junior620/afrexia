/**
 * Product Catalog Utilities
 * 
 * Centralized exports for catalog-related utilities
 */

export {
  searchProducts,
  matchesAllFilters,
  applyFilters,
  countFilteredProducts,
  hasActiveFilters,
  resetFilters,
} from './filters';

export {
  modalAnimations,
  cardAnimations,
  filterAnimations,
  loadingAnimations,
  scrollAnimations,
  toastAnimations,
  staggerDelays,
  easings,
  reducedMotionClass,
  combineAnimations,
  getStaggerDelay,
} from './animations';

export {
  serializeFiltersToURL,
  deserializeFiltersFromURL,
  updateURLWithFilters,
  hasActiveFiltersInURL,
} from './url-params';
