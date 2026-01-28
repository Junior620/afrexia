import { Locale } from '@/types';
import { getTranslationsFr } from './translations/fr';
import { getTranslationsEn } from './translations/en';
import { getTranslationsEs } from './translations/es';
import { getTranslationsDe } from './translations/de';
import { getTranslationsRu } from './translations/ru';

// Build translations object from individual locale files
// This maintains backward compatibility while enabling code-splitting
export const translations = {
  fr: getTranslationsFr(),
  en: getTranslationsEn(),
  es: getTranslationsEs(),
  de: getTranslationsDe(),
  ru: getTranslationsRu(),
};

export function getTranslations(locale: Locale) {
  return translations[locale];
}

/**
 * Get a specific translation by key path
 * @param locale - The locale to use
 * @param key - The key path (e.g., 'navigation.home')
 * @param variables - Optional variables to replace in the translation (e.g., { year: '2024' })
 * @returns The translation string
 */
export function getTranslation(
  locale: Locale,
  key: string,
  variables?: Record<string, string>
): string {
  const keys = key.split('.');
  let value: any = translations[locale];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  // Fallback: return key if translation not found
  if (typeof value !== 'string') {
    console.warn(`Translation key "${key}" not found for locale "${locale}"`);
    return key;
  }
  
  // Replace variables in the format {{variableName}}
  if (variables) {
    return value.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      return variables[varName] || match;
    });
  }
  
  return value;
}
