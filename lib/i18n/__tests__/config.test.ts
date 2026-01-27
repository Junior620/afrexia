import { describe, it, expect } from 'vitest';
import { locales, defaultLocale, localeNames, localeFlags, isValidLocale, getValidLocale } from '../config';
import { Locale } from '@/types';

/**
 * Unit Tests for Locale Configuration
 * 
 * Tests the locale configuration to ensure:
 * 1. All five locales are present in the locales array
 * 2. Default locale is 'fr'
 * 3. All five locales have entries in localeNames
 * 4. All five locales have entries in localeFlags
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
 */

describe('Locale Configuration', () => {
  describe('locales array', () => {
    it('should contain all five locales', () => {
      expect(locales).toHaveLength(5);
      expect(locales).toContain('fr');
      expect(locales).toContain('en');
      expect(locales).toContain('es');
      expect(locales).toContain('de');
      expect(locales).toContain('ru');
    });

    it('should have locales in the correct order', () => {
      expect(locales).toEqual(['fr', 'en', 'es', 'de', 'ru']);
    });
  });

  describe('defaultLocale', () => {
    it('should be "fr"', () => {
      expect(defaultLocale).toBe('fr');
    });

    it('should be a valid locale', () => {
      expect(isValidLocale(defaultLocale)).toBe(true);
    });
  });

  describe('localeNames', () => {
    it('should have entries for all five locales', () => {
      expect(Object.keys(localeNames)).toHaveLength(5);
      expect(localeNames).toHaveProperty('fr');
      expect(localeNames).toHaveProperty('en');
      expect(localeNames).toHaveProperty('es');
      expect(localeNames).toHaveProperty('de');
      expect(localeNames).toHaveProperty('ru');
    });

    it('should have correct display names', () => {
      expect(localeNames.fr).toBe('Français');
      expect(localeNames.en).toBe('English');
      expect(localeNames.es).toBe('Español');
      expect(localeNames.de).toBe('Deutsch');
      expect(localeNames.ru).toBe('Русский');
    });

    it('should have non-empty names for all locales', () => {
      locales.forEach((locale) => {
        expect(localeNames[locale]).toBeTruthy();
        expect(localeNames[locale].length).toBeGreaterThan(0);
      });
    });
  });

  describe('localeFlags', () => {
    it('should have entries for all five locales', () => {
      expect(Object.keys(localeFlags)).toHaveLength(5);
      expect(localeFlags).toHaveProperty('fr');
      expect(localeFlags).toHaveProperty('en');
      expect(localeFlags).toHaveProperty('es');
      expect(localeFlags).toHaveProperty('de');
      expect(localeFlags).toHaveProperty('ru');
    });

    it('should have correct flag emojis', () => {
      expect(localeFlags.fr).toBe('🇫🇷');
      expect(localeFlags.en).toBe('🇬🇧');
      expect(localeFlags.es).toBe('🇪🇸');
      expect(localeFlags.de).toBe('🇩🇪');
      expect(localeFlags.ru).toBe('🇷🇺');
    });

    it('should have non-empty flags for all locales', () => {
      locales.forEach((locale) => {
        expect(localeFlags[locale]).toBeTruthy();
        expect(localeFlags[locale].length).toBeGreaterThan(0);
      });
    });
  });

  describe('isValidLocale', () => {
    it('should return true for all valid locales', () => {
      expect(isValidLocale('fr')).toBe(true);
      expect(isValidLocale('en')).toBe(true);
      expect(isValidLocale('es')).toBe(true);
      expect(isValidLocale('de')).toBe(true);
      expect(isValidLocale('ru')).toBe(true);
    });

    it('should return false for invalid locales', () => {
      expect(isValidLocale('invalid')).toBe(false);
      expect(isValidLocale('zh')).toBe(false);
      expect(isValidLocale('ja')).toBe(false);
      expect(isValidLocale('')).toBe(false);
      expect(isValidLocale('FR')).toBe(false); // Case sensitive
    });
  });

  describe('getValidLocale', () => {
    it('should return the locale if valid', () => {
      expect(getValidLocale('fr')).toBe('fr');
      expect(getValidLocale('en')).toBe('en');
      expect(getValidLocale('es')).toBe('es');
      expect(getValidLocale('de')).toBe('de');
      expect(getValidLocale('ru')).toBe('ru');
    });

    it('should return default locale for invalid input', () => {
      expect(getValidLocale('invalid')).toBe('fr');
      expect(getValidLocale('zh')).toBe('fr');
      expect(getValidLocale('')).toBe('fr');
      expect(getValidLocale(undefined)).toBe('fr');
    });
  });
});
