/**
 * ISR (Incremental Static Regeneration) Configuration
 * 
 * This module defines revalidation constants for programmatic SEO pages.
 * These values determine how often Next.js regenerates static pages in the background.
 * 
 * @see Requirements 1.15 - ISR System Configuration
 */

/**
 * ISR revalidation times in seconds
 * 
 * These constants define how long a page remains cached before Next.js
 * regenerates it in the background (stale-while-revalidate strategy).
 */
export const ISR_REVALIDATION = {
  /**
   * Price pages: 24 hours (86400 seconds)
   * 
   * Price data changes frequently, so we regenerate daily to keep
   * pricing information current while maintaining good performance.
   * 
   * Routes: /[locale]/prix/[product-slug]-cameroun
   */
  PRICE_PAGES: 86400,

  /**
   * Product × Country pages: 7 days (604800 seconds)
   * 
   * Product and country information is relatively stable, so weekly
   * regeneration provides a good balance between freshness and performance.
   * 
   * Routes: /[locale]/produits/[product-slug]/export-[country-slug]
   */
  PRODUCT_COUNTRY_PAGES: 604800,

  /**
   * Comparison and guide pages: 7 days (604800 seconds)
   * 
   * Comparison content is relatively stable, requiring less frequent updates.
   * 
   * Routes: /[locale]/guide/[product-a]-vs-[product-b]
   *         /[locale]/guide/[product]-[origin-a]-vs-[origin-b]
   */
  COMPARISON_PAGES: 604800,

  /**
   * Certification × Product pages: 7 days (604800 seconds)
   * 
   * Certification information changes infrequently.
   * 
   * Routes: /[locale]/certifications/[certification-slug]-[product-slug]
   */
  CERTIFICATION_PAGES: 604800,

  /**
   * Port × Product pages: 7 days (604800 seconds)
   * 
   * Logistics information is relatively stable.
   * 
   * Routes: /[locale]/logistique/export-[product-slug]-port-[port-slug]
   */
  PORT_PAGES: 604800,

  /**
   * Harvest season pages: 1 year (31536000 seconds)
   * 
   * Seasonal information only needs annual updates.
   * 
   * Routes: /[locale]/recolte/[product-slug]-cameroun-saison-[year]
   *         /[locale]/calendrier-recolte/[product-slug]-afrique-ouest
   */
  SEASON_PAGES: 31536000,

  /**
   * Incoterm pages: 7 days (604800 seconds)
   * 
   * Incoterm information is stable but may have pricing updates.
   * 
   * Routes: /[locale]/incoterms/[product-slug]-[incoterm]-[port-slug]
   */
  INCOTERM_PAGES: 604800,

  /**
   * Container/Volume pages: 7 days (604800 seconds)
   * 
   * Container specifications and pricing are relatively stable.
   * 
   * Routes: /[locale]/commande/[product-slug]-container-[container-type]
   */
  CONTAINER_PAGES: 604800,
} as const;

/**
 * Type for ISR revalidation page types
 */
export type ISRPageType = keyof typeof ISR_REVALIDATION;

/**
 * Get revalidation time for a specific page type
 * 
 * @param pageType - The type of programmatic SEO page
 * @returns Revalidation time in seconds
 * 
 * @example
 * ```typescript
 * const revalidate = getRevalidationTime('PRICE_PAGES'); // 86400
 * ```
 */
export function getRevalidationTime(pageType: ISRPageType): number {
  return ISR_REVALIDATION[pageType];
}

/**
 * Determine page type from route path
 * 
 * @param path - The route path (e.g., '/fr/prix/cacao-cameroun')
 * @returns The ISR page type or null if not a programmatic SEO page
 * 
 * @example
 * ```typescript
 * const pageType = getPageTypeFromPath('/fr/prix/cacao-cameroun');
 * // Returns: 'PRICE_PAGES'
 * ```
 */
export function getPageTypeFromPath(path: string): ISRPageType | null {
  // Remove locale prefix
  const pathWithoutLocale = path.replace(/^\/(fr|en|es|de|ru)/, '');

  // Match against known patterns
  if (pathWithoutLocale.startsWith('/prix/')) {
    return 'PRICE_PAGES';
  }
  if (pathWithoutLocale.match(/^\/produits\/[^/]+\/export-/)) {
    return 'PRODUCT_COUNTRY_PAGES';
  }
  if (pathWithoutLocale.startsWith('/guide/')) {
    return 'COMPARISON_PAGES';
  }
  if (pathWithoutLocale.startsWith('/certifications/')) {
    return 'CERTIFICATION_PAGES';
  }
  if (pathWithoutLocale.startsWith('/logistique/')) {
    return 'PORT_PAGES';
  }
  if (pathWithoutLocale.match(/^\/(recolte|calendrier-recolte)\//)) {
    return 'SEASON_PAGES';
  }
  if (pathWithoutLocale.startsWith('/incoterms/')) {
    return 'INCOTERM_PAGES';
  }
  if (pathWithoutLocale.startsWith('/commande/')) {
    return 'CONTAINER_PAGES';
  }

  return null;
}

/**
 * Get revalidation time from route path
 * 
 * @param path - The route path
 * @returns Revalidation time in seconds, or undefined if not a programmatic SEO page
 * 
 * @example
 * ```typescript
 * const revalidate = getRevalidationFromPath('/fr/prix/cacao-cameroun');
 * // Returns: 86400
 * ```
 */
export function getRevalidationFromPath(path: string): number | undefined {
  const pageType = getPageTypeFromPath(path);
  return pageType ? getRevalidationTime(pageType) : undefined;
}
