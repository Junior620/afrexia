import { Locale } from '@/types';

// Re-export the main translation functions
export { getTranslation, getTranslations } from '../translations';

// Export locale-specific translation loaders for client-side optimization
export { getTranslationsFr } from './fr';
export { getTranslationsEn } from './en';
export { getTranslationsEs } from './es';
export { getTranslationsDe } from './de';
export { getTranslationsRu } from './ru';

/**
 * Dynamically load translations for a specific locale
 * This function enables code-splitting so only the required locale is loaded
 */
export async function loadTranslations(locale: Locale) {
  switch (locale) {
    case 'fr':
      return (await import('./fr')).getTranslationsFr();
    case 'en':
      return (await import('./en')).getTranslationsEn();
    case 'es':
      return (await import('./es')).getTranslationsEs();
    case 'de':
      return (await import('./de')).getTranslationsDe();
    case 'ru':
      return (await import('./ru')).getTranslationsRu();
    default:
      return (await import('./fr')).getTranslationsFr();
  }
}
