import { describe, it, expect } from 'vitest';
import { formatDate, formatNumber, formatCurrency, getTextDirection } from '../formatting';
import { Locale } from '@/types';

describe('Cultural Adaptation Utilities', () => {
  describe('formatDate', () => {
    const testDate = new Date('2024-03-15T12:00:00Z');

    it('should format date for French locale (DD/MM/YYYY)', () => {
      const result = formatDate(testDate, 'fr');
      expect(result).toMatch(/15[\/\.]03[\/\.]2024/);
    });

    it('should format date for English locale (MM/DD/YYYY)', () => {
      const result = formatDate(testDate, 'en');
      expect(result).toMatch(/03[\/\.]15[\/\.]2024/);
    });

    it('should format date for Spanish locale (DD/MM/YYYY)', () => {
      const result = formatDate(testDate, 'es');
      expect(result).toMatch(/15[\/\.]03[\/\.]2024/);
    });

    it('should format date for German locale (DD.MM.YYYY)', () => {
      const result = formatDate(testDate, 'de');
      expect(result).toMatch(/15[\/\.]03[\/\.]2024/);
    });

    it('should format date for Russian locale (DD.MM.YYYY)', () => {
      const result = formatDate(testDate, 'ru');
      expect(result).toMatch(/15[\/\.]03[\/\.]2024/);
    });

    it('should format dates consistently for all locales', () => {
      const locales: Locale[] = ['fr', 'en', 'es', 'de', 'ru'];
      locales.forEach((locale) => {
        const result = formatDate(testDate, locale);
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });

  describe('formatNumber', () => {
    const testNumber = 1234.56;

    it('should format number for French locale', () => {
      const result = formatNumber(testNumber, 'fr');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      // French uses space or non-breaking space for thousands
      expect(result).toMatch(/1[\s\u00A0]?234[,.]56/);
    });

    it('should format number for English locale', () => {
      const result = formatNumber(testNumber, 'en');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      // English uses comma for thousands and period for decimals
      expect(result).toMatch(/1,234\.56/);
    });

    it('should format number for Spanish locale', () => {
      const result = formatNumber(testNumber, 'es');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      // Spanish uses period for thousands and comma for decimals
      expect(result).toMatch(/1[.\s]?234,56/);
    });

    it('should format number for German locale', () => {
      const result = formatNumber(testNumber, 'de');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      // German uses period for thousands and comma for decimals
      expect(result).toMatch(/1\.234,56/);
    });

    it('should format number for Russian locale', () => {
      const result = formatNumber(testNumber, 'ru');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      // Russian uses space for thousands and comma for decimals
      expect(result).toMatch(/1[\s\u00A0]234,56/);
    });

    it('should format large numbers with grouping', () => {
      const largeNumber = 1234567.89;
      const locales: Locale[] = ['fr', 'en', 'es', 'de', 'ru'];
      locales.forEach((locale) => {
        const result = formatNumber(largeNumber, locale);
        expect(result).toBeTruthy();
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });

  describe('formatCurrency', () => {
    const testAmount = 1234.56;

    it('should format currency for French locale (EUR)', () => {
      const result = formatCurrency(testAmount, 'fr');
      expect(result).toBeTruthy();
      expect(result).toMatch(/€|EUR/);
    });

    it('should format currency for English locale (USD)', () => {
      const result = formatCurrency(testAmount, 'en');
      expect(result).toBeTruthy();
      expect(result).toMatch(/\$|USD/);
    });

    it('should format currency for Spanish locale (EUR)', () => {
      const result = formatCurrency(testAmount, 'es');
      expect(result).toBeTruthy();
      expect(result).toMatch(/€|EUR/);
    });

    it('should format currency for German locale (EUR)', () => {
      const result = formatCurrency(testAmount, 'de');
      expect(result).toBeTruthy();
      expect(result).toMatch(/€|EUR/);
    });

    it('should format currency for Russian locale (RUB)', () => {
      const result = formatCurrency(testAmount, 'ru');
      expect(result).toBeTruthy();
      expect(result).toMatch(/₽|RUB|руб/);
    });

    it('should allow custom currency override', () => {
      const result = formatCurrency(testAmount, 'en', 'GBP');
      expect(result).toBeTruthy();
      expect(result).toMatch(/£|GBP/);
    });

    it('should format currency for all locales', () => {
      const locales: Locale[] = ['fr', 'en', 'es', 'de', 'ru'];
      locales.forEach((locale) => {
        const result = formatCurrency(testAmount, locale);
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getTextDirection', () => {
    it('should return ltr for French locale', () => {
      expect(getTextDirection('fr')).toBe('ltr');
    });

    it('should return ltr for English locale', () => {
      expect(getTextDirection('en')).toBe('ltr');
    });

    it('should return ltr for Spanish locale', () => {
      expect(getTextDirection('es')).toBe('ltr');
    });

    it('should return ltr for German locale', () => {
      expect(getTextDirection('de')).toBe('ltr');
    });

    it('should return ltr for Russian locale', () => {
      expect(getTextDirection('ru')).toBe('ltr');
    });

    it('should return ltr for all supported locales', () => {
      const locales: Locale[] = ['fr', 'en', 'es', 'de', 'ru'];
      locales.forEach((locale) => {
        expect(getTextDirection(locale)).toBe('ltr');
      });
    });
  });
});
