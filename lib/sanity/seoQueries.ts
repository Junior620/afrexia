/**
 * Sanity GROQ queries for programmatic SEO pages
 *
 * @see Requirements 1.2, 1.3
 */

import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import type { Product, ExportCountry } from '@/types/seo';

// ============================================================================
// Field fragments
// ============================================================================

const localizedStringFields = groq`fr, en, es, de, ru`;

const exportCountryFields = groq`
  _id,
  _type,
  "name": name { ${localizedStringFields} },
  "slug": slug { current },
  code,
  flag,
  "description": description { ${localizedStringFields} },
  targetMarkets,
  "customsInfo": customsInfo { ${localizedStringFields} },
  "averageTransitTime": averageTransitTime {
    days,
    "note": note { ${localizedStringFields} }
  },
  dataCompleteness,
  approvedForSEO,
  "requiredCertifications": requiredCertifications[]-> {
    _id,
    _type,
    "name": name { ${localizedStringFields} },
    "slug": slug { current }
  },
  "mainPorts": mainPorts[]-> {
    _id,
    _type,
    "name": name { ${localizedStringFields} },
    "slug": slug { current },
    city,
    locode
  }
`;

const seoProductFields = groq`
  _id,
  _type,
  "name": name,
  "slug": slug.fr { current },
  "description": description,
  "certifications": certifications[]-> {
    _id,
    _type,
    "name": name { ${localizedStringFields} },
    "slug": slug { current }
  }
`;

// ============================================================================
// Queries
// ============================================================================

/**
 * Fetches all approved export countries for static params generation.
 */
export async function getApprovedExportCountries(): Promise<
  Pick<ExportCountry, '_id' | 'slug' | 'dataCompleteness' | 'approvedForSEO'>[]
> {
  const query = groq`*[_type == "exportCountry" && approvedForSEO == true && dataCompleteness >= 70] {
    _id,
    "slug": slug { current },
    dataCompleteness,
    approvedForSEO
  }`;

  return client.fetch(query, {}, { next: { revalidate: 604800 } });
}

/**
 * Fetches all published products for static params generation.
 */
export async function getSEOProducts(): Promise<
  Pick<Product, '_id' | 'slug'>[]
> {
  const query = groq`*[_type == "product" && workflowStatus == "published"] {
    _id,
    "slug": slug.fr { current }
  }`;

  return client.fetch(query, {}, { next: { revalidate: 604800 } });
}

/**
 * Fetches a single product by its French slug for SEO pages.
 */
export async function getSEOProductBySlug(slug: string | undefined | null): Promise<Product | null> {
  if (!slug) return null;
  const query = groq`*[_type == "product" && slug.fr.current == $slug && workflowStatus == "published"][0] {
    ${seoProductFields}
  }`;

  return client.fetch(query, { slug }, { next: { revalidate: 604800 } });
}

/**
 * Fetches a single export country by slug.
 */
export async function getExportCountryBySlug(slug: string | undefined | null): Promise<ExportCountry | null> {
  if (!slug) return null;
  const query = groq`*[_type == "exportCountry" && slug.current == $slug][0] {
    ${exportCountryFields}
  }`;

  return client.fetch(query, { slug }, { next: { revalidate: 604800 } });
}

/**
 * Fetches all approved export countries with full data for a given product.
 * Used for generating related links.
 */
export async function getRelatedExportCountries(
  excludeSlug: string
): Promise<Pick<ExportCountry, '_id' | 'slug' | 'name'>[]> {
  const query = groq`*[_type == "exportCountry" && approvedForSEO == true && dataCompleteness >= 70 && slug.current != $excludeSlug] {
    _id,
    "slug": slug { current },
    "name": name { ${localizedStringFields} }
  }`;

  return client.fetch(query, { excludeSlug }, { next: { revalidate: 604800 } });
}

/**
 * Fetches all published products except the given one.
 * Used for generating related links.
 */
export async function getRelatedSEOProducts(
  excludeSlug: string
): Promise<Pick<Product, '_id' | 'slug' | 'name'>[]> {
  const query = groq`*[_type == "product" && workflowStatus == "published" && slug.fr.current != $excludeSlug] {
    _id,
    "slug": slug.fr { current },
    "name": name
  }`;

  return client.fetch(query, { excludeSlug }, { next: { revalidate: 604800 } });
}

// ============================================================================
// Price Route Queries (Requirement 1.4)
// ============================================================================

export interface CurrentPriceData {
  product: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  source: string;
  lastUpdated: string;
}

export interface PriceHistoryPoint {
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  source: string;
  recordedAt: string;
}

/**
 * Fetches the current price for a product by its Sanity product name.
 * The product name in commodityPrice matches the product's display name.
 */
export async function getCurrentPriceByProductSlug(
  productSlug: string
): Promise<CurrentPriceData | null> {
  // First get the product name from the slug
  const productQuery = groq`*[_type == "product" && slug.fr.current == $slug && workflowStatus == "published"][0] {
    "name": name.fr
  }`;

  const product = await client.fetch<{ name: string } | null>(
    productQuery,
    { slug: productSlug },
    { next: { revalidate: 86400 } }
  );

  if (!product?.name) return null;

  const priceQuery = groq`*[_type == "commodityPrice" && product == $productName][0] {
    product,
    price,
    unit,
    trend,
    change,
    source,
    lastUpdated
  }`;

  return client.fetch<CurrentPriceData | null>(
    priceQuery,
    { productName: product.name },
    { next: { revalidate: 86400 } }
  );
}

/**
 * Fetches 30-day price history for a product by its Sanity product name.
 */
export async function getPriceHistoryByProductSlug(
  productSlug: string,
  limit = 30
): Promise<PriceHistoryPoint[]> {
  const productQuery = groq`*[_type == "product" && slug.fr.current == $slug && workflowStatus == "published"][0] {
    "name": name.fr
  }`;

  const product = await client.fetch<{ name: string } | null>(
    productQuery,
    { slug: productSlug },
    { next: { revalidate: 86400 } }
  );

  if (!product?.name) return [];

  const historyQuery = groq`*[_type == "priceHistory" && product == $productName] | order(recordedAt desc) [0...$limit] {
    price,
    unit,
    trend,
    change,
    source,
    recordedAt
  }`;

  return client.fetch<PriceHistoryPoint[]>(
    historyQuery,
    { productName: product.name, limit },
    { next: { revalidate: 86400 } }
  );
}

// ============================================================================
// Comparison Route Queries (Requirement 1.5)
// ============================================================================

/**
 * Fetches two products by their French slugs for comparison pages.
 * Returns null for either product if not found.
 */
export async function getComparisonProducts(
  slugA: string,
  slugB: string
): Promise<{ productA: import('@/types/seo').Product | null; productB: import('@/types/seo').Product | null }> {
  const query = groq`{
    "productA": *[_type == "product" && slug.fr.current == $slugA && workflowStatus == "published"][0] {
      ${seoProductFields}
    },
    "productB": *[_type == "product" && slug.fr.current == $slugB && workflowStatus == "published"][0] {
      ${seoProductFields}
    }
  }`;

  return client.fetch(query, { slugA, slugB }, { next: { revalidate: 604800 } });
}

/**
 * Generates all valid product-vs-product comparison slug pairs.
 * Returns unique pairs (A vs B, not B vs A again).
 */
export async function getComparisonStaticParams(): Promise<
  { slugA: string; slugB: string }[]
> {
  const products = await getSEOProducts();
  const pairs: { slugA: string; slugB: string }[] = [];

  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      pairs.push({
        slugA: products[i].slug.current,
        slugB: products[j].slug.current,
      });
    }
  }

  return pairs;
}
