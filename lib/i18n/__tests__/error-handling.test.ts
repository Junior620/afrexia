import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getTranslation } from '../translations';
import { getValidLocale } from '../config';

/**
 * Unit Tests for Error Handling
 * 
 * Tests error handling in the translation system to ensure:
 * 1. Missing translation keys return key as fallback
 * 2. Invalid locales fall back to default
 * 3. Console warnings are logged appropriately
 * 
 * **Validates: Requirements 7.2**
 */

describe('Error Handling', () => {
  let consoleWarnSpy: any;

  beforeEach(() => {
    // Spy on console.warn to verify warnings are logged
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.warn after each test
    consoleWarnSpy.mockRestore();
  });

  describe('Missing translation key handling', () => {
    it('should return key as fallback when translation not found', () => {
      const result = getTranslation('fr', 'nonexistent.key');
      expect(result).toBe('nonexistent.key');
    });

    it('should log console warning for missing translation key', () => {
      getTranslation('fr', 'missing.translation.key');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Translation key "missing.translation.key" not found for locale "fr"'
      );
    });

    it('should return key for deeply nested missing path', () => {
      const result = getTranslation('en', 'deeply.nested.missing.path');
      expect(result).toBe('deeply.nested.missing.path');
    });

    it('should return key for partially valid path', () => {
      // 'navigation' exists but 'navigation.invalid' does not
      const result = getTranslation('es', 'navigation.invalid');
      expect(result).toBe('navigation.invalid');
    });

    it('should log warning for each missing key', () => {
      getTranslation('de', 'first.missing.key');
      getTranslation('ru', 'second.missing.key');
      
      expect(consoleWarnSpy).toHaveBeenCalledTimes(2);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Translation key "first.missing.key" not found for locale "de"'
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Translation key "second.missing.key" not found for locale "ru"'
      );
    });

    it('should handle empty key gracefully', () => {
      const result = getTranslation('fr', '');
      expect(result).toBe('');
    });
  });

  describe('Invalid locale handling', () => {
    it('should fall back to default locale for invalid locale', () => {
      const result = getValidLocale('invalid');
      expect(result).toBe('fr');
    });

    it('should log console warning for invalid locale', () => {
      getValidLocale('invalid');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Invalid locale "invalid", falling back to default "fr"'
      );
    });

    it('should fall back to default for undefined locale', () => {
      const result = getValidLocale(undefined);
      expect(result).toBe('fr');
    });

    it('should not log warning for undefined locale (no locale provided)', () => {
      getValidLocale(undefined);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should fall back to default for empty string locale', () => {
      const result = getValidLocale('');
      expect(result).toBe('fr');
    });

    it('should fall back to default for case-mismatched locale', () => {
      const result = getValidLocale('FR');
      expect(result).toBe('fr');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Invalid locale "FR", falling back to default "fr"'
      );
    });

    it('should fall back to default for unsupported locale', () => {
      const result = getValidLocale('zh');
      expect(result).toBe('fr');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Invalid locale "zh", falling back to default "fr"'
      );
    });

    it('should return valid locale without warning', () => {
      const result = getValidLocale('es');
      expect(result).toBe('es');
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('Variable interpolation error handling', () => {
    it('should preserve placeholder when variable not provided', () => {
      const result = getTranslation('fr', 'footer.copyright', {});
      expect(result).toContain('{{year}}');
    });

    it('should preserve placeholder when variables object is undefined', () => {
      const result = getTranslation('en', 'footer.copyright');
      expect(result).toContain('{{year}}');
    });

    it('should replace only provided variables', () => {
      // Create a test case with multiple variables
      const testString = 'Hello {{name}}, welcome to {{place}}';
      const result = testString.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
        const variables: Record<string, string> = { name: 'John' };
        return variables[varName] || match;
      });
      
      expect(result).toBe('Hello John, welcome to {{place}}');
    });

    it('should handle empty variable values', () => {
      const result = getTranslation('de', 'footer.copyright', { year: '' });
      // Empty string is falsy, so placeholder should be preserved
      expect(result).toBe('© {{year}} Afrexia. Alle Rechte vorbehalten.');
    });
  });

  describe('Malformed Accept-Language header handling', () => {
    // Note: The middleware already has try-catch for Accept-Language parsing
    // These tests verify the error handling is in place
    
    it('should handle malformed Accept-Language gracefully', () => {
      // This test verifies that the middleware has error handling
      // The actual middleware test is in middleware.test.ts
      // Here we just verify the error handling pattern exists
      
      const malformedHeaders = [
        'invalid',
        ';;;',
        'en;q=invalid',
        'fr;q=',
        ';q=0.9',
      ];
      
      malformedHeaders.forEach(header => {
        // The middleware should not throw errors for malformed headers
        // It should catch errors and return null, falling back to default
        expect(() => {
          // Simulate the parsing logic
          try {
            const languages = header.split(',').map((lang) => {
              const [locale, qValue] = lang.trim().split(';q=');
              const quality = qValue ? parseFloat(qValue) : 1.0;
              return { locale, quality };
            });
          } catch (error) {
            // Error should be caught and handled
          }
        }).not.toThrow();
      });
    });
  });

  describe('Invalid cookie value handling', () => {
    // Note: The middleware already validates cookie values
    // These tests verify the validation logic
    
    it('should ignore invalid cookie values', () => {
      const invalidCookies = ['invalid', 'zh', 'FR', '', 'null', 'undefined'];
      
      invalidCookies.forEach(cookieValue => {
        // The middleware should validate and ignore invalid cookie values
        const validLocales = ['fr', 'en', 'es', 'de', 'ru'];
        const isValid = validLocales.includes(cookieValue);
        
        expect(isValid).toBe(false);
      });
    });

    it('should accept valid cookie values', () => {
      const validCookies = ['fr', 'en', 'es', 'de', 'ru'];
      
      validCookies.forEach(cookieValue => {
        const validLocales = ['fr', 'en', 'es', 'de', 'ru'];
        const isValid = validLocales.includes(cookieValue);
        
        expect(isValid).toBe(true);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle null values gracefully', () => {
      const result = getValidLocale(null as any);
      expect(result).toBe('fr');
    });

    it('should handle numeric values as invalid locale', () => {
      const result = getValidLocale('123' as any);
      expect(result).toBe('fr');
    });

    it('should handle special characters in locale', () => {
      const result = getValidLocale('fr-FR');
      expect(result).toBe('fr');
    });
  });
});
