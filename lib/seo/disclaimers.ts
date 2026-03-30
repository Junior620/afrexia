/**
 * Disclaimers for estimated data
 *
 * Provides localized disclaimer strings for estimated prices, transit delays,
 * and logistics costs across all 5 supported locales.
 *
 * @see Requirements 1.10
 */

import type { Locale } from '@/types/seo';

// ============================================================================
// Types
// ============================================================================

export type DisclaimerType = 'price' | 'delay' | 'logistics';

export type LocalizedDisclaimers = Record<Locale, string>;

export type DisclaimersMap = Record<DisclaimerType, LocalizedDisclaimers>;

// ============================================================================
// Price disclaimers
// "WHEN estimated prices are displayed, THE Content_Generator SHALL include a disclaimer
//  'Prix indicatif, contactez-nous pour un devis précis'" (Req 1.10)
// ============================================================================

export const PRICE_DISCLAIMERS: LocalizedDisclaimers = {
  fr: 'Prix indicatif, contactez-nous pour un devis précis.',
  en: 'Indicative price, contact us for a precise quote.',
  es: 'Precio indicativo, contáctenos para un presupuesto preciso.',
  de: 'Richtpreis, kontaktieren Sie uns für ein genaues Angebot.',
  ru: 'Ориентировочная цена, свяжитесь с нами для точного предложения.',
};

// ============================================================================
// Delay disclaimers
// "WHEN estimated delays are displayed, THE Content_Generator SHALL include a disclaimer
//  'Délais indicatifs, variables selon les conditions'" (Req 1.10)
// ============================================================================

export const DELAY_DISCLAIMERS: LocalizedDisclaimers = {
  fr: 'Délais indicatifs, variables selon les conditions.',
  en: 'Indicative transit times, subject to conditions.',
  es: 'Plazos indicativos, variables según las condiciones.',
  de: 'Richtwerte für Transitzeiten, abhängig von den Bedingungen.',
  ru: 'Ориентировочные сроки, зависят от условий.',
};

// ============================================================================
// Logistics cost disclaimers
// "WHEN estimated logistics costs are displayed, THE Content_Generator SHALL include a disclaimer
//  'Coûts estimatifs, sujets à variation'" (Req 1.10)
// ============================================================================

export const LOGISTICS_DISCLAIMERS: LocalizedDisclaimers = {
  fr: 'Coûts estimatifs, sujets à variation.',
  en: 'Estimated costs, subject to variation.',
  es: 'Costos estimativos, sujetos a variación.',
  de: 'Geschätzte Kosten, Änderungen vorbehalten.',
  ru: 'Ориентировочные затраты, могут изменяться.',
};

// ============================================================================
// Combined map for easy lookup by type and locale
// ============================================================================

export const DISCLAIMERS: DisclaimersMap = {
  price: PRICE_DISCLAIMERS,
  delay: DELAY_DISCLAIMERS,
  logistics: LOGISTICS_DISCLAIMERS,
};

/**
 * Returns the localized disclaimer string for the given type and locale.
 *
 * @param type - The type of estimated data: 'price', 'delay', or 'logistics'
 * @param locale - The target locale
 * @returns The localized disclaimer string
 *
 * @example
 * getDisclaimer('price', 'fr')
 * // → 'Prix indicatif, contactez-nous pour un devis précis.'
 *
 * @example
 * getDisclaimer('delay', 'en')
 * // → 'Indicative transit times, subject to conditions.'
 */
export function getDisclaimer(type: DisclaimerType, locale: Locale): string {
  return DISCLAIMERS[type][locale];
}
