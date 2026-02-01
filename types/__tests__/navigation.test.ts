/**
 * Unit tests for navigation types and utilities
 * Requirements: 7.4, 10.3, 10.5
 */

import { describe, it, expect } from 'vitest';
import {
  NavigationState,
  generateStateKey,
  validateNavigationState,
  isNavigationState,
  RestorationType,
} from '../navigation';

describe('Navigation Types', () => {
  describe('generateStateKey', () => {
    it('should generate key from pathname only', () => {
      const key = generateStateKey('/products');
      expect(key).toBe('/products');
    });

    it('should generate key from pathname and search params', () => {
      const key = generateStateKey('/products', 'category=electronics');
      expect(key).toBe('/products?category=electronics');
    });

    it('should handle search params with leading ?', () => {
      const key = generateStateKey('/products', '?category=electronics');
      expect(key).toBe('/products?category=electronics');
    });

    it('should normalize pathname without leading /', () => {
      const key = generateStateKey('products', 'category=electronics');
      expect(key).toBe('/products?category=electronics');
    });

    it('should throw error for empty pathname', () => {
      expect(() => generateStateKey('')).toThrow('Pathname is required');
    });

    it('should handle empty search params', () => {
      const key = generateStateKey('/products', '');
      expect(key).toBe('/products');
    });

    it('should handle complex search params', () => {
      const key = generateStateKey('/products', 'category=electronics&sort=price&page=2');
      expect(key).toBe('/products?category=electronics&sort=price&page=2');
    });
  });

  describe('isNavigationState', () => {
    it('should validate a complete valid state', () => {
      const state: NavigationState = {
        key: '/products?category=electronics',
        scrollY: 1250,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/products',
        sectionId: 'featured-products',
        focusedElementId: 'product-card-42',
        hash: '#section',
      };

      expect(isNavigationState(state)).toBe(true);
    });

    it('should validate a minimal valid state', () => {
      const state: NavigationState = {
        key: '/products',
        scrollY: 0,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/products',
      };

      expect(isNavigationState(state)).toBe(true);
    });

    it('should reject null', () => {
      expect(isNavigationState(null)).toBe(false);
    });

    it('should reject undefined', () => {
      expect(isNavigationState(undefined)).toBe(false);
    });

    it('should reject non-object', () => {
      expect(isNavigationState('string')).toBe(false);
      expect(isNavigationState(123)).toBe(false);
      expect(isNavigationState(true)).toBe(false);
    });

    it('should reject state with missing key', () => {
      const state = {
        scrollY: 100,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/products',
      };

      expect(isNavigationState(state)).toBe(false);
    });

    it('should reject state with empty key', () => {
      const state = {
        key: '',
        scrollY: 100,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/products',
      };

      expect(isNavigationState(state)).toBe(false);
    });

    it('should reject state with negative scrollY', () => {
      const state = {
        key: '/products',
        scrollY: -100,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/products',
      };

      expect(isNavigationState(state)).toBe(false);
    });

    it('should reject state with negative scrollX', () => {
      const state = {
        key: '/products',
        scrollY: 100,
        scrollX: -10,
        timestamp: Date.now(),
        route: '/products',
      };

      expect(isNavigationState(state)).toBe(false);
    });

    it('should reject state with invalid timestamp', () => {
      const state = {
        key: '/products',
        scrollY: 100,
        scrollX: 0,
        timestamp: 0,
        route: '/products',
      };

      expect(isNavigationState(state)).toBe(false);
    });

    it('should reject state with missing route', () => {
      const state = {
        key: '/products',
        scrollY: 100,
        scrollX: 0,
        timestamp: Date.now(),
      };

      expect(isNavigationState(state)).toBe(false);
    });

    it('should reject state with empty route', () => {
      const state = {
        key: '/products',
        scrollY: 100,
        scrollX: 0,
        timestamp: Date.now(),
        route: '',
      };

      expect(isNavigationState(state)).toBe(false);
    });

    it('should reject state with invalid optional sectionId type', () => {
      const state = {
        key: '/products',
        scrollY: 100,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/products',
        sectionId: 123,
      };

      expect(isNavigationState(state)).toBe(false);
    });

    it('should reject state with invalid optional focusedElementId type', () => {
      const state = {
        key: '/products',
        scrollY: 100,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/products',
        focusedElementId: true,
      };

      expect(isNavigationState(state)).toBe(false);
    });

    it('should reject state with invalid optional hash type', () => {
      const state = {
        key: '/products',
        scrollY: 100,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/products',
        hash: 123,
      };

      expect(isNavigationState(state)).toBe(false);
    });
  });

  describe('validateNavigationState', () => {
    it('should validate a valid state', () => {
      const state: NavigationState = {
        key: '/products',
        scrollY: 100,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/products',
      };

      expect(validateNavigationState(state)).toBe(true);
    });

    it('should reject an invalid state', () => {
      const state = {
        key: '/products',
        scrollY: -100,
        scrollX: 0,
        timestamp: Date.now(),
        route: '/products',
      };

      expect(validateNavigationState(state)).toBe(false);
    });
  });

  describe('RestorationType', () => {
    it('should have correct enum values', () => {
      expect(RestorationType.HASH).toBe('hash');
      expect(RestorationType.SECTION).toBe('section');
      expect(RestorationType.SCROLL).toBe('scroll');
      expect(RestorationType.TOP).toBe('top');
    });
  });
});
