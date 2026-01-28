import { Locale } from '@/types';
import { Metadata } from 'next';
import { locales } from '@/lib/i18n/config';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://afrexia.com';
const SITE_NAME = 'Afrexia';

export interface MetaTagsConfig {
  title: string;
  description: string;
  locale: Locale;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
  keywords?: string[];
}

/**
 * Map locale to Open Graph locale format
 */
function getOpenGraphLocale(locale: Locale): string {
  const localeMap: Record<Locale, string> = {
    fr: 'fr_FR',
    en: 'en_US',
    es: 'es_ES',
    de: 'de_DE',
    ru: 'ru_RU',
  };
  return localeMap[locale];
}

/**
 * Generate complete meta tags for a page
 */
export function generateMetaTags(config: MetaTagsConfig): Metadata {
  const { title, description, locale, path, ogImage, noIndex, keywords } = config;

  const canonicalUrl = `${SITE_URL}/${locale}${path}`;

  const defaultOgImage = `${SITE_URL}/assets/og-image.jpg`;
  const imageUrl = ogImage || defaultOgImage;

  // Generate language alternates for all locales
  const languages: Record<string, string> = {};
  locales.forEach((loc) => {
    languages[loc] = `${SITE_URL}/${loc}${path}`;
  });
  // Add x-default pointing to French version
  languages['x-default'] = `${SITE_URL}/fr${path}`;

  return {
    title,
    description,
    keywords: keywords?.join(', '),
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: getOpenGraphLocale(locale),
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

/**
 * Generate hreflang tags for a page
 */
export function generateHreflangTags(path: string): Array<{
  hreflang: string;
  href: string;
}> {
  const tags: Array<{ hreflang: string; href: string }> = [];
  
  // Add hreflang tag for each locale
  locales.forEach((locale) => {
    tags.push({
      hreflang: locale,
      href: `${SITE_URL}/${locale}${path}`,
    });
  });
  
  // Add x-default pointing to French version
  tags.push({
    hreflang: 'x-default',
    href: `${SITE_URL}/fr${path}`,
  });
  
  return tags;
}
