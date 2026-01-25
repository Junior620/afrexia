import { Locale } from '@/types';

export const locales = ['fr', 'en'] as const;
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
  return defaultLocale;
}

/**
 * Get alternate locale (opposite of current)
 */
export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'fr' ? 'en' : 'fr';
}

/**
 * Locale display names
 */
export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
};

/**
 * Locale flags (emoji or icon identifiers)
 */
export const localeFlags: Record<Locale, string> = {
  fr: '🇫🇷',
  en: '🇬🇧',
};
