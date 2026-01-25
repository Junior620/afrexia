import { Locale } from '@/types';

/**
 * Route mapping utilities for i18nId-based navigation
 * This allows switching languages while preserving page context
 * For example, switching from /fr/products/cacao to /en/products/cocoa
 */

export interface RouteMapping {
  fr: string;
  en: string;
  i18nId?: string;
}

/**
 * Get the translated route for a given path and target locale
 * This is a placeholder that will be enhanced when we have Sanity data
 * For now, it does a simple locale replacement
 */
export async function getTranslatedRoute(
  currentPath: string,
  currentLocale: Locale,
  targetLocale: Locale
): Promise<string> {
  // Remove current locale from path
  const pathWithoutLocale = currentPath.replace(`/${currentLocale}`, '') || '/';
  
  // For dynamic routes (products, blog posts), we would query Sanity here
  // to find the corresponding slug in the target language using i18nId
  // Example:
  // if (pathWithoutLocale.startsWith('/products/')) {
  //   const slug = pathWithoutLocale.replace('/products/', '');
  //   const translatedSlug = await getTranslatedProductSlug(slug, currentLocale, targetLocale);
  //   return `/${targetLocale}/products/${translatedSlug}`;
  // }
  
  // For now, just replace the locale prefix
  return `/${targetLocale}${pathWithoutLocale}`;
}

/**
 * Static route mappings for pages that don't come from CMS
 */
export const staticRouteMap: Record<string, RouteMapping> = {
  '/': {
    fr: '/',
    en: '/',
  },
  '/products': {
    fr: '/products',
    en: '/products',
  },
  '/solutions': {
    fr: '/solutions',
    en: '/solutions',
  },
  '/quality': {
    fr: '/quality',
    en: '/quality',
  },
  '/traceability': {
    fr: '/traceability',
    en: '/traceability',
  },
  '/about': {
    fr: '/about',
    en: '/about',
  },
  '/resources': {
    fr: '/resources',
    en: '/resources',
  },
  '/blog': {
    fr: '/blog',
    en: '/blog',
  },
  '/contact': {
    fr: '/contact',
    en: '/contact',
  },
  '/rfq': {
    fr: '/rfq',
    en: '/rfq',
  },
};

/**
 * Get translated path for static routes
 */
export function getStaticTranslatedPath(
  path: string,
  targetLocale: Locale
): string | null {
  const mapping = staticRouteMap[path];
  if (mapping) {
    return mapping[targetLocale];
  }
  return null;
}
