import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { isValidLocale, getValidLocale, locales } from '../config';
import { getStaticTranslatedPath } from '../route-mapping';
import { Locale } from '@/types';

/**
 * Property-Based Tests for Language Switching
 * 
 * **Property 1: Language switching preserves page context**
 * **Validates: Requirements 1.2, 1.4, 10.4, 10.8**
 * 
 * This test suite validates that:
 * 1. Route mappings are bidirectional (can switch both ways)
 * 2. Static routes maintain their structure across languages
 */

describe('Property 1: Language switching preserves page context', () => {
  // Arbitrary for generating valid locales (updated for 5 locales)
  const localeArbitrary = fc.constantFrom<Locale>('fr', 'en', 'es', 'de', 'ru');

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

  it('should maintain route structure when switching languages', () => {
    fc.assert(
      fc.property(
        localeArbitrary,
        localeArbitrary,
        staticPathArbitrary,
        (sourceLocale, targetLocale, path) => {
          // Skip if source and target are the same
          fc.pre(sourceLocale !== targetLocale);
          
          // Get translated path
          const translatedPath = getStaticTranslatedPath(path, targetLocale);
          
          // If translation exists, it should be a valid path
          if (translatedPath !== null && translatedPath !== undefined) {
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
        localeArbitrary,
        staticPathArbitrary,
        (sourceLocale, targetLocale, path) => {
          // Skip if source and target are the same
          fc.pre(sourceLocale !== targetLocale);
          
          const translatedPath = getStaticTranslatedPath(path, targetLocale);
          
          if (translatedPath !== null && translatedPath !== undefined) {
            // Construct full paths
            const sourcePath = `/${sourceLocale}${path}`;
            const targetPath = `/${targetLocale}${translatedPath}`;
            
            // Both paths should be valid
            expect(sourcePath).toMatch(/^\/(fr|en|es|de|ru)\//);
            expect(targetPath).toMatch(/^\/(fr|en|es|de|ru)\//);
            
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
    expect(isValidLocale('es')).toBe(true);
    expect(isValidLocale('de')).toBe(true);
    expect(isValidLocale('ru')).toBe(true);
    expect(isValidLocale('zh')).toBe(false);
    expect(isValidLocale('ja')).toBe(false);
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
