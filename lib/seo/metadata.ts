import { Locale } from '@/types';
import { Metadata } from 'next';

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
 * Generate complete meta tags for a page
 */
export function generateMetaTags(config: MetaTagsConfig): Metadata {
  const { title, description, locale, path, ogImage, noIndex, keywords } = config;

  const canonicalUrl = `${SITE_URL}/${locale}${path}`;
  const alternateLocale: Locale = locale === 'fr' ? 'en' : 'fr';
  const alternateUrl = `${SITE_URL}/${alternateLocale}${path}`;

  const defaultOgImage = `${SITE_URL}/assets/og-image.jpg`;
  const imageUrl = ogImage || defaultOgImage;

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
      languages: {
        [locale]: canonicalUrl,
        [alternateLocale]: alternateUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
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
  return [
    {
      hreflang: 'fr',
      href: `${SITE_URL}/fr${path}`,
    },
    {
      hreflang: 'en',
      href: `${SITE_URL}/en${path}`,
    },
    {
      hreflang: 'x-default',
      href: `${SITE_URL}/fr${path}`, // Default to French
    },
  ];
}
