import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getAlternateLocale, isValidLocale, getValidLocale } from '../config';
import { getStaticTranslatedPath } from '../route-mapping';
import { Locale } from '@/types';

/**
 * Property-Based Tests for Language Switching
 * 
 * **Property 1: Language switching preserves page context**
 * **Validates: Requirements 1.2, 1.4, 10.4, 10.8**
 * 
 * This test suite validates that:
 * 1. Language switching always produces valid locales
 * 2. Switching back and forth returns to the original locale
 * 3. Route mappings are bidirectional (can switch both ways)
 * 4. Static routes maintain their structure across languages
 */

describe('Property 1: Language switching preserves page context', () => {
  // Arbitrary for generating valid locales
  const localeArbitrary = fc.constantFrom<Locale>('fr', 'en');

  // Arbitrary for generating paths
  const staticPathArbitrary = fc.constantFrom(
    '/',
    '/products',
    '/solutions',
    '/quality',
    '/traceability',
    '/about',
    '/resources',
    '/blog',
    '/contact',
    '/rfq'
  );

  it('should always produce a valid alternate locale', () => {
    fc.assert(
      fc.property(localeArbitrary, (locale) => {
        const alternate = getAlternateLocale(locale);
        
        // The alternate locale must be valid
        expect(isValidLocale(alternate)).toBe(true);
        
        // The alternate locale must be different from the original
        expect(alternate).not.toBe(locale);
      })
    );
  });

  it('should be reversible (switching twice returns to original)', () => {
    fc.assert(
      fc.property(localeArbitrary, (locale) => {
        const alternate = getAlternateLocale(locale);
        const backToOriginal = getAlternateLocale(alternate);
        
        // Switching twice should return to the original locale
        expect(backToOriginal).toBe(locale);
      })
    );
  });

  it('should maintain route structure when switching languages', () => {
    fc.assert(
      fc.property(
        localeArbitrary,
        staticPathArbitrary,
        (sourceLocale, path) => {
          const targetLocale = getAlternateLocale(sourceLocale);
          
          // Get translated path
          const translatedPath = getStaticTranslatedPath(path, targetLocale);
          
          // If translation exists, it should be a valid path
          if (translatedPath !== null) {
            expect(translatedPath).toBeTruthy();
            expect(typeof translatedPath).toBe('string');
            
            // Path should start with / or be /
            expect(translatedPath === '/' || translatedPath.startsWith('/')).toBe(true);
          }
        }
      )
    );
  });

  it('should preserve route mapping bidirectionality', () => {
    fc.assert(
      fc.property(staticPathArbitrary, (path) => {
        // Get French version
        const frPath = getStaticTranslatedPath(path, 'fr');
        
        // Get English version
        const enPath = getStaticTranslatedPath(path, 'en');
        
        // Both should exist for static routes
        expect(frPath).not.toBeNull();
        expect(enPath).not.toBeNull();
        
        // If we have both paths, they should map to each other
        if (frPath && enPath) {
          // Going from FR to EN should give us the EN path
          const frToEn = getStaticTranslatedPath(frPath, 'en');
          expect(frToEn).toBe(enPath);
          
          // Going from EN to FR should give us the FR path
          const enToFr = getStaticTranslatedPath(enPath, 'fr');
          expect(enToFr).toBe(frPath);
        }
      })
    );
  });

  it('should handle invalid locale strings gracefully', () => {
    fc.assert(
      fc.property(fc.string(), (invalidLocale) => {
        // Filter out valid locales for this test
        fc.pre(!isValidLocale(invalidLocale));
        
        // getValidLocale should always return a valid locale
        const result = getValidLocale(invalidLocale);
        expect(isValidLocale(result)).toBe(true);
        
        // Should default to 'fr'
        expect(result).toBe('fr');
      })
    );
  });

  it('should maintain locale consistency in full path construction', () => {
    fc.assert(
      fc.property(
        localeArbitrary,
        staticPathArbitrary,
        (locale, path) => {
          const targetLocale = getAlternateLocale(locale);
          const translatedPath = getStaticTranslatedPath(path, targetLocale);
          
          if (translatedPath !== null) {
            // Construct full paths
            const sourcePath = `/${locale}${path}`;
            const targetPath = `/${targetLocale}${translatedPath}`;
            
            // Both paths should be valid
            expect(sourcePath).toMatch(/^\/(fr|en)\//);
            expect(targetPath).toMatch(/^\/(fr|en)\//);
            
            // Locales should be different
            expect(sourcePath.split('/')[1]).not.toBe(targetPath.split('/')[1]);
          }
        }
      )
    );
  });
});

describe('Locale validation properties', () => {
  it('should correctly identify valid locales', () => {
    expect(isValidLocale('fr')).toBe(true);
    expect(isValidLocale('en')).toBe(true);
    expect(isValidLocale('es')).toBe(false);
    expect(isValidLocale('de')).toBe(false);
    expect(isValidLocale('')).toBe(false);
  });

  it('should always return valid locale from getValidLocale', () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        const result = getValidLocale(input);
        expect(isValidLocale(result)).toBe(true);
      })
    );
  });
});
