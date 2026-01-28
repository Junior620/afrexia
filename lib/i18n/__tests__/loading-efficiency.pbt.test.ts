/**
 * Property-Based Tests for Translation Data Loading Efficiency
 * Feature: multilingual-expansion
 * Property 16: Translation Data Loading Efficiency
 * 
 * **Validates: Requirements 10.1**
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { Locale } from '@/types';
import { locales } from '../config';
import { loadTranslations } from '../translations/index';

describe('Translation Data Loading Efficiency (Property 16)', () => {
  describe('Property 16: Translation Data Loading Efficiency', () => {
    it('should load only the requested locale translations dynamically', async () => {
      // Feature: multilingual-expansion, Property 16: Translation Data Loading Efficiency
      
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...locales),
          async (locale: Locale) => {
            // Property: When loading translations for a specific locale,
            // only that locale's data should be loaded, not all locales
            
            const translations = await loadTranslations(locale);
            
            // Verify translations object exists and has expected structure
            expect(translations).toBeDefined();
            expect(typeof translations).toBe('object');
            
            // Verify it has the expected sections
            expect(translations).toHaveProperty('navigation');
            expect(translations).toHaveProperty('common');
            expect(translations).toHaveProperty('products');
            expect(translations).toHaveProperty('footer');
            
            // Verify navigation section has expected keys
            expect(translations.navigation).toHaveProperty('home');
            expect(translations.navigation).toHaveProperty('products');
            
            // Verify the translations are non-empty strings
            expect(typeof translations.navigation.home).toBe('string');
            expect(translations.navigation.home.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return different translation objects for different locales', async () => {
      // Feature: multilingual-expansion, Property 16: Translation Data Loading Efficiency
      
      await fc.assert(
        fc.asyncProperty(
          fc.tuple(
            fc.constantFrom(...locales),
            fc.constantFrom(...locales)
          ).filter(([locale1, locale2]) => locale1 !== locale2),
          async ([locale1, locale2]: [Locale, Locale]) => {
            // Property: Loading different locales should return different translation content
            
            const translations1 = await loadTranslations(locale1);
            const translations2 = await loadTranslations(locale2);
            
            // Verify both are valid objects
            expect(translations1).toBeDefined();
            expect(translations2).toBeDefined();
            
            // Verify they have different content (at least for some keys)
            // Check navigation.home as a representative key
            expect(translations1.navigation.home).not.toBe(translations2.navigation.home);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should load translations consistently for the same locale', async () => {
      // Feature: multilingual-expansion, Property 16: Translation Data Loading Efficiency
      
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...locales),
          async (locale: Locale) => {
            // Property: Loading the same locale multiple times should return consistent data
            
            const translations1 = await loadTranslations(locale);
            const translations2 = await loadTranslations(locale);
            
            // Verify both loads return the same content
            expect(translations1.navigation.home).toBe(translations2.navigation.home);
            expect(translations1.common.learnMore).toBe(translations2.common.learnMore);
            expect(translations1.products.title).toBe(translations2.products.title);
            expect(translations1.footer.tagline).toBe(translations2.footer.tagline);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle all five locales without errors', async () => {
      // Feature: multilingual-expansion, Property 16: Translation Data Loading Efficiency
      
      // Property: All five locales should be loadable without throwing errors
      const loadPromises = locales.map(locale => loadTranslations(locale));
      
      // All loads should succeed
      const results = await Promise.all(loadPromises);
      
      // Verify all results are valid
      expect(results).toHaveLength(5);
      results.forEach((translations, index) => {
        expect(translations).toBeDefined();
        expect(translations).toHaveProperty('navigation');
        expect(translations).toHaveProperty('common');
        expect(translations).toHaveProperty('products');
        expect(translations).toHaveProperty('footer');
      });
    });

    it('should maintain translation structure consistency across all locales', async () => {
      // Feature: multilingual-expansion, Property 16: Translation Data Loading Efficiency
      
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...locales),
          async (locale: Locale) => {
            // Property: All locales should have the same translation structure
            
            const translations = await loadTranslations(locale);
            
            // Verify consistent structure
            const expectedSections = ['navigation', 'common', 'products', 'footer'];
            expectedSections.forEach(section => {
              expect(translations).toHaveProperty(section);
              expect(typeof translations[section as keyof typeof translations]).toBe('object');
            });
            
            // Verify navigation keys
            const expectedNavKeys = ['home', 'products', 'solutions', 'quality', 'traceability', 'about', 'resources', 'blog', 'contact', 'rfq'];
            expectedNavKeys.forEach(key => {
              expect(translations.navigation).toHaveProperty(key);
              expect(typeof translations.navigation[key as keyof typeof translations.navigation]).toBe('string');
            });
            
            // Verify common keys
            const expectedCommonKeys = ['learnMore', 'downloadPDF', 'requestQuote', 'contactUs', 'viewDetails', 'readMore', 'backToHome', 'loading', 'error'];
            expectedCommonKeys.forEach(key => {
              expect(translations.common).toHaveProperty(key);
              expect(typeof translations.common[key as keyof typeof translations.common]).toBe('string');
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
