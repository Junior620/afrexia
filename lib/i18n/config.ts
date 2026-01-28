import { Locale } from '@/types';

export const locales = ['fr', 'en', 'es', 'de', 'ru'] as const;
export const defaultLocale: Locale = 'fr';

export const LOCALE_COOKIE = 'NEXT_LOCALE';

/**
 * Check if a string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Get locale from string with fallback to default
 */
export function getValidLocale(locale: string | undefined): Locale {
  if (locale && isValidLocale(locale)) {
    return locale;
  }
  if (locale) {
    console.warn(`Invalid locale "${locale}", falling back to default "${defaultLocale}"`);
  }
  return defaultLocale;
}

/**
 * Locale display names
 */
export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  ru: 'Русский',
};

/**
 * Locale flags (emoji or icon identifiers)
 */
export const localeFlags: Record<Locale, string> = {
  fr: '🇫🇷',
  en: '🇬🇧',
  es: '🇪🇸',
  de: '🇩🇪',
  ru: '🇷🇺',
};
