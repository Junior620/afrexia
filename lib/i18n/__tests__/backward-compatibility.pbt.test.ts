import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { locales, defaultLocale, localeNames, localeFlags, isValidLocale, getValidLocale } from '../config';
import { getTranslation, getTranslations } from '../translations';
import { Locale } from '@/types';

/**
 * Property-Based Tests for Backward Compatibility
 * 
 * **Property 14: Backward Compatibility**
 * 
 * For any existing functionality that worked with locales ['fr', 'en'], 
 * the same functionality should continue to work identically after adding 
 * ['es', 'de', 'ru'] to the system.
 * 
 * **Validates: Requirements 8.1, 8.2, 8.3**
 */

describe('Property 14: Backward Compatibility', () => {
  // Arbitrary for generating original locales (fr, en)
  const originalLocaleArbitrary = fc.constantFrom<Locale>('fr', 'en');
  
  // Arbitrary for generating translation keys
  const translationKeyArbitrary = fc.constantFrom(
    'navigation.home',
    'navigation.products',
    'navigation.contact',
    'common.learnMore',
    'common.loading',
    'products.title',
    'footer.copyright'
  );

  // Feature: multilingual-expansion, Property 14: Backward Compatibility
  it('should maintain French and English locale validation behavior', () => {
    fc.assert(
      fc.property(originalLocaleArbitrary, (locale) => {
        // Property: Original locales should always be valid
        expect(isValidLocale(locale)).toBe(true);
        
        // Property: getValidLocale should return the same locale for valid inputs
        expect(getValidLocale(locale)).toBe(locale);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: multilingual-expansion, Property 14: Backward Compatibility
  it('should maintain French and English translation retrieval behavior', () => {
    fc.assert(
      fc.property(
        originalLocaleArbitrary,
        translationKeyArbitrary,
        (locale, key) => {
          // Property: Translation retrieval should work for original locales
          const translation = getTranslation(locale, key);
          
          // Should return a non-empty string
          expect(translation).toBeTruthy();
          expect(typeof translation).toBe('string');
          expect(translation.length).toBeGreaterThan(0);
          
          // Should not return the key itself (unless missing)
          // For known keys, should return actual translation
          if (key === 'navigation.home') {
            if (locale === 'fr') {
              expect(translation).toBe('Accueil');
            } else if (locale === 'en') {
              expect(translation).toBe('Home');
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: multilingual-expansion, Property 14: Backward Compatibility
  it('should maintain French and English locale metadata structure', () => {
    fc.assert(
      fc.property(originalLocaleArbitrary, (locale) => {
        // Property: Original locales should have locale names
        expect(localeNames[locale]).toBeDefined();
        expect(typeof localeNames[locale]).toBe('string');
        expect(localeNames[locale].length).toBeGreaterThan(0);
        
        // Property: Original locales should have locale flags
        expect(localeFlags[locale]).toBeDefined();
        expect(typeof localeFlags[locale]).toBe('string');
        expect(localeFlags[locale].length).toBeGreaterThan(0);
        
        // Property: Specific values should remain unchanged
        if (locale === 'fr') {
          expect(localeNames[locale]).toBe('Français');
          expect(localeFlags[locale]).toBe('🇫🇷');
        } else if (locale === 'en') {
          expect(localeNames[locale]).toBe('English');
          expect(localeFlags[locale]).toBe('🇬🇧');
        }
      }),
      { numRuns: 100 }
    );
  });

  // Feature: multilingual-expansion, Property 14: Backward Compatibility
  it('should maintain default locale as French', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        // Property: Default locale should always be 'fr'
        expect(defaultLocale).toBe('fr');
        
        // Property: getValidLocale with undefined should return 'fr'
        expect(getValidLocale(undefined)).toBe('fr');
        
        // Property: getValidLocale with invalid input should return 'fr'
        expect(getValidLocale('invalid')).toBe('fr');
      }),
      { numRuns: 100 }
    );
  });

  // Feature: multilingual-expansion, Property 14: Backward Compatibility
  it('should maintain French and English translation structure', () => {
    fc.assert(
      fc.property(originalLocaleArbitrary, (locale) => {
        const translations = getTranslations(locale);
        
        // Property: Translation structure should have expected sections
        expect(translations).toHaveProperty('navigation');
        expect(translations).toHaveProperty('common');
        expect(translations).toHaveProperty('products');
        expect(translations).toHaveProperty('footer');
        
        // Property: Each section should be an object
        expect(typeof translations.navigation).toBe('object');
        expect(typeof translations.common).toBe('object');
        expect(typeof translations.products).toBe('object');
        expect(typeof translations.footer).toBe('object');
        
        // Property: Navigation section should have expected keys
        expect(translations.navigation).toHaveProperty('home');
        expect(translations.navigation).toHaveProperty('products');
        expect(translations.navigation).toHaveProperty('contact');
        
        // Property: Common section should have expected keys
        expect(translations.common).toHaveProperty('learnMore');
        expect(translations.common).toHaveProperty('loading');
        
        // Property: Products section should have expected keys
        expect(translations.products).toHaveProperty('title');
        
        // Property: Footer section should have expected keys
        expect(translations.footer).toHaveProperty('copyright');
      }),
      { numRuns: 100 }
    );
  });

  // Feature: multilingual-expansion, Property 14: Backward Compatibility
  it('should maintain variable interpolation for French and English', () => {
    fc.assert(
      fc.property(
        originalLocaleArbitrary,
        fc.integer({ min: 2020, max: 2030 }).map(String),
        (locale, year) => {
          // Property: Variable interpolation should work for copyright text
          const translation = getTranslation(locale, 'footer.copyright', { year });
          
          // Should contain the year
          expect(translation).toContain(year);
          
          // Should contain "Afrexia"
          expect(translation).toContain('Afrexia');
          
          // Should not contain the placeholder
          expect(translation).not.toContain('{{year}}');
          
          // Should match expected format for each locale
          if (locale === 'fr') {
            expect(translation).toBe(`© ${year} Afrexia. Tous droits réservés.`);
          } else if (locale === 'en') {
            expect(translation).toBe(`© ${year} Afrexia. All rights reserved.`);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: multilingual-expansion, Property 14: Backward Compatibility
  it('should maintain French and English in locales array', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        // Property: locales array should contain 'fr' and 'en'
        expect(locales).toContain('fr');
        expect(locales).toContain('en');
        
        // Property: 'fr' should be the first locale
        expect(locales[0]).toBe('fr');
        
        // Property: 'en' should be the second locale
        expect(locales[1]).toBe('en');
        
        // Property: locales array should have at least 2 elements
        expect(locales.length).toBeGreaterThanOrEqual(2);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: multilingual-expansion, Property 14: Backward Compatibility
  it('should maintain consistent behavior for invalid locales', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => !['fr', 'en', 'es', 'de', 'ru'].includes(s)),
        (invalidLocale) => {
          // Property: Invalid locales should not be validated
          expect(isValidLocale(invalidLocale)).toBe(false);
          
          // Property: getValidLocale should return default for invalid input
          expect(getValidLocale(invalidLocale)).toBe('fr');
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: multilingual-expansion, Property 14: Backward Compatibility
  it('should maintain French and English translation values unchanged', () => {
    // This test verifies that specific translation values remain exactly the same
    // to ensure backward compatibility
    
    // French translations should remain unchanged
    expect(getTranslation('fr', 'navigation.home')).toBe('Accueil');
    expect(getTranslation('fr', 'navigation.products')).toBe('Produits');
    expect(getTranslation('fr', 'common.learnMore')).toBe('En savoir plus');
    expect(getTranslation('fr', 'products.title')).toBe('Nos Produits');
    
    // English translations should remain unchanged
    expect(getTranslation('en', 'navigation.home')).toBe('Home');
    expect(getTranslation('en', 'navigation.products')).toBe('Products');
    expect(getTranslation('en', 'common.learnMore')).toBe('Learn More');
    expect(getTranslation('en', 'products.title')).toBe('Our Products');
  });
});
