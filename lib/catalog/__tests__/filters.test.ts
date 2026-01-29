/**
 * Filter Utilities Tests
 * 
 * Unit tests for product catalog filter functions
 */

import { describe, it, expect } from 'vitest';
import {
  searchProducts,
  matchesAllFilters,
  applyFilters,
  countFilteredProducts,
  hasActiveFilters,
  resetFilters,
} from '../filters';
import { Product, FilterState } from '@/types/product';

// Mock product data for testing
const mockProducts: Product[] = [
  {
    id: '1',
    slug: 'cacao-premium',
    name: 'Cacao Premium',
    subtitle: 'High quality cocoa beans',
    category: 'cocoa',
    heroImage: {
      asset: { _ref: 'image-1', _type: 'reference' },
    },
    availability: 'in-stock',
    origins: ['CI', 'GH'],
    certifications: ['organic', 'fair-trade'],
    eudrReady: true,
    qaAvailable: true,
    documents: {
      coa: true,
      specSheet: true,
      chainOfCustody: true,
    },
    moq: { value: 500, unit: 'kg' },
    incoterms: ['FOB', 'CIF'],
    packaging: 'Bags 60kg',
    grade: 'Premium',
    leadTime: '4-6 weeks',
    tags: ['cacao', 'premium', 'organic'],
    markets: ['EU', 'US'],
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    slug: 'coffee-arabica',
    name: 'Coffee Arabica',
    subtitle: 'Premium arabica coffee',
    category: 'coffee',
    heroImage: {
      asset: { _ref: 'image-2', _type: 'reference' },
    },
    availability: 'limited',
    origins: ['CM'],
    certifications: ['rainforest-alliance'],
    eudrReady: false,
    qaAvailable: true,
    documents: {
      coa: true,
      specSheet: true,
      chainOfCustody: false,
    },
    moq: { value: 1000, unit: 'kg' },
    incoterms: ['FOB', 'DAP'],
    packaging: 'Bags 70kg',
    grade: 'Grade A',
    leadTime: '6-8 weeks',
    tags: ['coffee', 'arabica'],
    markets: ['EU'],
    updatedAt: '2024-01-02',
  },
  {
    id: '3',
    slug: 'cacao-standard',
    name: 'Cacao Standard',
    subtitle: 'Standard quality cocoa',
    category: 'cocoa',
    heroImage: {
      asset: { _ref: 'image-3', _type: 'reference' },
    },
    availability: 'in-stock',
    origins: ['CI'],
    certifications: [],
    eudrReady: true,
    qaAvailable: false,
    documents: {
      coa: true,
      specSheet: false,
      chainOfCustody: true,
    },
    moq: { value: 250, unit: 'kg' },
    incoterms: ['FOB'],
    tags: ['cacao', 'standard'],
    markets: ['EU', 'ASIA'],
    updatedAt: '2024-01-03',
  },
];

describe('searchProducts', () => {
  it('should return all products when query is empty', () => {
    const result = searchProducts(mockProducts, '');
    expect(result).toEqual(mockProducts);
  });

  it('should search by product name (case-insensitive)', () => {
    const result = searchProducts(mockProducts, 'cacao');
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Cacao Premium');
    expect(result[1].name).toBe('Cacao Standard');
  });

  it('should search by category', () => {
    const result = searchProducts(mockProducts, 'coffee');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Coffee Arabica');
  });

  it('should search by tags', () => {
    const result = searchProducts(mockProducts, 'premium');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Cacao Premium');
  });

  it('should be case-insensitive', () => {
    const result = searchProducts(mockProducts, 'CACAO');
    expect(result).toHaveLength(2);
  });

  it('should handle whitespace in query', () => {
    const result = searchProducts(mockProducts, '  cacao  ');
    expect(result).toHaveLength(2);
  });
});

describe('matchesAllFilters', () => {
  const emptyFilters: FilterState = {
    search: '',
    origins: [],
    availability: [],
    certifications: [],
    incoterms: [],
  };

  it('should return true when no filters are active', () => {
    const result = matchesAllFilters(mockProducts[0], emptyFilters);
    expect(result).toBe(true);
  });

  it('should filter by category', () => {
    const filters: FilterState = {
      ...emptyFilters,
      category: 'cocoa',
    };
    expect(matchesAllFilters(mockProducts[0], filters)).toBe(true);
    expect(matchesAllFilters(mockProducts[1], filters)).toBe(false);
  });

  it('should filter by origins', () => {
    const filters: FilterState = {
      ...emptyFilters,
      origins: ['CI'],
    };
    expect(matchesAllFilters(mockProducts[0], filters)).toBe(true);
    expect(matchesAllFilters(mockProducts[1], filters)).toBe(false);
  });

  it('should filter by availability', () => {
    const filters: FilterState = {
      ...emptyFilters,
      availability: ['in-stock'],
    };
    expect(matchesAllFilters(mockProducts[0], filters)).toBe(true);
    expect(matchesAllFilters(mockProducts[1], filters)).toBe(false);
  });

  it('should filter by EUDR ready status', () => {
    const filters: FilterState = {
      ...emptyFilters,
      eudrReady: true,
    };
    expect(matchesAllFilters(mockProducts[0], filters)).toBe(true);
    expect(matchesAllFilters(mockProducts[1], filters)).toBe(false);
  });

  it('should filter by certifications', () => {
    const filters: FilterState = {
      ...emptyFilters,
      certifications: ['organic'],
    };
    expect(matchesAllFilters(mockProducts[0], filters)).toBe(true);
    expect(matchesAllFilters(mockProducts[1], filters)).toBe(false);
  });

  it('should filter by incoterms', () => {
    const filters: FilterState = {
      ...emptyFilters,
      incoterms: ['DAP'],
    };
    expect(matchesAllFilters(mockProducts[0], filters)).toBe(false);
    expect(matchesAllFilters(mockProducts[1], filters)).toBe(true);
  });

  it('should filter by MOQ range', () => {
    const filters: FilterState = {
      ...emptyFilters,
      moqRange: { min: 400, max: 800 },
    };
    expect(matchesAllFilters(mockProducts[0], filters)).toBe(true);
    expect(matchesAllFilters(mockProducts[1], filters)).toBe(false);
    expect(matchesAllFilters(mockProducts[2], filters)).toBe(false);
  });

  it('should use AND logic for multiple filters', () => {
    const filters: FilterState = {
      ...emptyFilters,
      category: 'cocoa',
      origins: ['CI'],
      eudrReady: true,
    };
    expect(matchesAllFilters(mockProducts[0], filters)).toBe(true);
    expect(matchesAllFilters(mockProducts[1], filters)).toBe(false);
    expect(matchesAllFilters(mockProducts[2], filters)).toBe(true);
  });
});

describe('applyFilters', () => {
  const emptyFilters: FilterState = {
    search: '',
    origins: [],
    availability: [],
    certifications: [],
    incoterms: [],
  };

  it('should return all products when no filters are active', () => {
    const result = applyFilters(mockProducts, emptyFilters);
    expect(result).toEqual(mockProducts);
  });

  it('should apply search and filters together', () => {
    const filters: FilterState = {
      ...emptyFilters,
      search: 'cacao',
      eudrReady: true,
    };
    const result = applyFilters(mockProducts, filters);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Cacao Premium');
    expect(result[1].name).toBe('Cacao Standard');
  });

  it('should apply multiple filters with AND logic', () => {
    const filters: FilterState = {
      ...emptyFilters,
      category: 'cocoa',
      origins: ['CI'],
      availability: ['in-stock'],
    };
    const result = applyFilters(mockProducts, filters);
    expect(result).toHaveLength(2);
  });

  it('should return empty array when no products match', () => {
    const filters: FilterState = {
      ...emptyFilters,
      category: 'tea',
    };
    const result = applyFilters(mockProducts, filters);
    expect(result).toHaveLength(0);
  });
});

describe('countFilteredProducts', () => {
  const emptyFilters: FilterState = {
    search: '',
    origins: [],
    availability: [],
    certifications: [],
    incoterms: [],
  };

  it('should count all products when no filters are active', () => {
    const count = countFilteredProducts(mockProducts, emptyFilters);
    expect(count).toBe(3);
  });

  it('should count filtered products correctly', () => {
    const filters: FilterState = {
      ...emptyFilters,
      category: 'cocoa',
    };
    const count = countFilteredProducts(mockProducts, filters);
    expect(count).toBe(2);
  });
});

describe('hasActiveFilters', () => {
  it('should return false when no filters are active', () => {
    const filters: FilterState = {
      search: '',
      origins: [],
      availability: [],
      certifications: [],
      incoterms: [],
    };
    expect(hasActiveFilters(filters)).toBe(false);
  });

  it('should return true when search is active', () => {
    const filters: FilterState = {
      search: 'cacao',
      origins: [],
      availability: [],
      certifications: [],
      incoterms: [],
    };
    expect(hasActiveFilters(filters)).toBe(true);
  });

  it('should return true when any filter is active', () => {
    const filters: FilterState = {
      search: '',
      category: 'cocoa',
      origins: [],
      availability: [],
      certifications: [],
      incoterms: [],
    };
    expect(hasActiveFilters(filters)).toBe(true);
  });
});

describe('resetFilters', () => {
  it('should return empty filter state', () => {
    const filters = resetFilters();
    expect(filters.search).toBe('');
    expect(filters.category).toBeUndefined();
    expect(filters.origins).toEqual([]);
    expect(filters.availability).toEqual([]);
    expect(filters.eudrReady).toBeUndefined();
    expect(filters.certifications).toEqual([]);
    expect(filters.incoterms).toEqual([]);
    expect(filters.moqRange).toBeUndefined();
  });
});
