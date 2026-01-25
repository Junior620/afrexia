import { Locale } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://afrexia.com';
const SITE_NAME = 'Afrexia';

/**
 * Organization Schema.org structured data
 */
export function generateOrganizationSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/assets/logo.png`,
    description:
      locale === 'fr'
        ? 'Exportateur de commodités agricoles africaines - Cacao, Café, Poivre, Bois, Maïs'
        : 'African Agricultural Commodities Exporter - Cocoa, Coffee, Pepper, Wood, Corn',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CM',
      addressLocality: 'Douala',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'contact@afrexia.com',
    },
    sameAs: [
      // Add social media URLs when available
    ],
  };
}

export interface ProductSchemaData {
  name: string;
  description: string;
  image: string[];
  category: string;
  brand?: string;
  offers?: {
    price?: string;
    priceCurrency?: string;
    availability: string;
    seller: {
      name: string;
    };
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

/**
 * Product Schema.org structured data
 */
export function generateProductSchema(
  data: ProductSchemaData,
  locale: Locale,
  slug: string
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: data.description,
    image: data.image,
    brand: {
      '@type': 'Brand',
      name: data.brand || SITE_NAME,
    },
    category: data.category,
    url: `${SITE_URL}/${locale}/products/${slug}`,
    offers: data.offers
      ? {
          '@type': 'Offer',
          price: data.offers.price,
          priceCurrency: data.offers.priceCurrency || 'USD',
          availability: `https://schema.org/${data.offers.availability}`,
          seller: {
            '@type': 'Organization',
            name: data.offers.seller.name,
          },
        }
      : undefined,
    aggregateRating: data.aggregateRating
      ? {
          '@type': 'AggregateRating',
          ratingValue: data.aggregateRating.ratingValue,
          reviewCount: data.aggregateRating.reviewCount,
        }
      : undefined,
  };
}

export interface ArticleSchemaData {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
  };
  publisher?: {
    name: string;
    logo: string;
  };
}

/**
 * Article Schema.org structured data
 */
export function generateArticleSchema(
  data: ArticleSchemaData,
  locale: Locale,
  slug: string
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    image: data.image,
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    author: {
      '@type': 'Person',
      name: data.author.name,
      url: data.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: data.publisher?.name || SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: data.publisher?.logo || `${SITE_URL}/assets/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${locale}/blog/${slug}`,
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * BreadcrumbList Schema.org structured data
 */
export function generateBreadcrumbSchema(
  items: BreadcrumbItem[],
  locale: Locale
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}/${locale}${item.path}`,
    })),
  };
}

/**
 * WebSite Schema.org structured data with search action
 */
export function generateWebSiteSchema(locale: Locale): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${SITE_URL}/${locale}`,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/${locale}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
