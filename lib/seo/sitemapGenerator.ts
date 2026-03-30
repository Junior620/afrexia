/**
 * SitemapGenerator (V1)
 *
 * Generates the XML sitemap for all V1 programmatic SEO pages:
 * - Product × Country pages
 * - Price pages
 * - Comparison/guide pages
 *
 * Only indexable pages (not marked noindex) are included.
 *
 * @see Requirements 1.11
 */

import { groq } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import type { SitemapEntry, SitemapSection } from '@/types/seo';
import { SUPPORTED_LOCALES } from '@/types/seo';

// ============================================================================
// Constants
// ============================================================================

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://afrexia.com';

/** Priorities per page type (Requirement 1.11.4) */
const PRIORITY = {
  PRODUCT_COUNTRY: 0.8,
  PRICE: 0.7,
  COMPARISON: 0.7,
} as const;

/** Change frequencies per page type (Requirement 1.11.5) */
const CHANGEFREQ = {
  PRODUCT_COUNTRY: 'weekly',
  PRICE: 'daily',
  COMPARISON: 'weekly',
} as const satisfies Record<string, SitemapEntry['changefreq']>;

// ============================================================================
// Sanity Query Types
// ============================================================================

interface SanityProductRow {
  slug: string;
  updatedAt: string;
}

// ============================================================================
// Entry Generators
// ============================================================================

/**
 * Generates sitemap entries for all approved Product × Country combinations.
 *
 * Queries Sanity for combinations where both the product is published and
 * the country has approvedForSEO = true and dataCompleteness >= 70.
 * Generates one entry per locale (5 locales × N combinations).
 *
 * @returns SitemapEntry[] for all valid product × country pages
 */
export async function generateProductCountryEntries(): Promise<SitemapEntry[]> {
  const query = groq`
    *[_type == "exportCountry" && approvedForSEO == true && dataCompleteness >= 70] {
      "countrySlug": slug.current,
      "updatedAt": _updatedAt,
      "products": *[_type == "product" && workflowStatus == "published"] {
        "productSlug": slug.fr.current,
        "updatedAt": _updatedAt
      }
    }
  `;

  type Row = {
    countrySlug: string;
    updatedAt: string;
    products: { productSlug: string; updatedAt: string }[];
  };

  const rows: Row[] = await client.fetch(query, {}, { next: { revalidate: 3600 } });

  const entries: SitemapEntry[] = [];

  for (const row of rows) {
    for (const product of row.products) {
      if (!product.productSlug) continue;

      const lastmod = laterDate(product.updatedAt, row.updatedAt);

      for (const locale of SUPPORTED_LOCALES) {
        entries.push({
          url: `${BASE_URL}/${locale}/produits/${product.productSlug}/export-${row.countrySlug}`,
          lastmod,
          changefreq: CHANGEFREQ.PRODUCT_COUNTRY,
          priority: PRIORITY.PRODUCT_COUNTRY,
          locale,
        });
      }
    }
  }

  return entries;
}

/**
 * Generates sitemap entries for all Price pages (one per published product × locale).
 *
 * Price pages are regenerated daily so changefreq is "daily".
 *
 * @returns SitemapEntry[] for all price pages
 */
export async function generatePriceEntries(): Promise<SitemapEntry[]> {
  const query = groq`
    *[_type == "product" && workflowStatus == "published"] {
      "slug": slug.fr.current,
      "updatedAt": _updatedAt
    }
  `;

  const products: SanityProductRow[] = await client.fetch(
    query,
    {},
    { next: { revalidate: 3600 } }
  );

  const entries: SitemapEntry[] = [];

  for (const product of products) {
    if (!product.slug) continue;

    for (const locale of SUPPORTED_LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/prix/${product.slug}-cameroun`,
        lastmod: toISODate(product.updatedAt),
        changefreq: CHANGEFREQ.PRICE,
        priority: PRIORITY.PRICE,
        locale,
      });
    }
  }

  return entries;
}

/**
 * Generates sitemap entries for Comparison/guide pages.
 *
 * Builds product-vs-product comparison pages for all unique pairs of
 * published products (A vs B, where A < B alphabetically to avoid duplicates).
 *
 * @returns SitemapEntry[] for all comparison pages
 */
export async function generateComparisonEntries(): Promise<SitemapEntry[]> {
  const query = groq`
    *[_type == "product" && workflowStatus == "published"] | order(slug.fr.current asc) {
      "slug": slug.fr.current,
      "updatedAt": _updatedAt
    }
  `;

  const products: SanityProductRow[] = await client.fetch(
    query,
    {},
    { next: { revalidate: 3600 } }
  );

  const entries: SitemapEntry[] = [];

  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      const a = products[i];
      const b = products[j];

      if (!a.slug || !b.slug) continue;

      const lastmod = laterDate(a.updatedAt, b.updatedAt);

      for (const locale of SUPPORTED_LOCALES) {
        entries.push({
          url: `${BASE_URL}/${locale}/guide/${a.slug}-vs-${b.slug}`,
          lastmod,
          changefreq: CHANGEFREQ.COMPARISON,
          priority: PRIORITY.COMPARISON,
          locale,
        });
      }
    }
  }

  return entries;
}

// ============================================================================
// Aggregator
// ============================================================================

/**
 * Aggregates all V1 sitemap entries into sections.
 *
 * Filters out any entries that should not be indexed (noindex pages are
 * excluded upstream by not being generated at all for V1).
 *
 * @returns SitemapSection[] organised by page type
 */
export async function generateSitemap(): Promise<SitemapSection[]> {
  const [productCountryEntries, priceEntries, comparisonEntries] = await Promise.all([
    generateProductCountryEntries(),
    generatePriceEntries(),
    generateComparisonEntries(),
  ]);

  return [
    { name: 'product-country', entries: productCountryEntries },
    { name: 'price', entries: priceEntries },
    { name: 'comparison', entries: comparisonEntries },
  ];
}

// ============================================================================
// XML Serialisation
// ============================================================================

/**
 * Converts an array of SitemapSection objects into a valid XML sitemap string.
 *
 * Produces a standard sitemaps.org XML document with <url> elements for each
 * entry. Sections are separated by XML comments for readability.
 *
 * @param sections - Sitemap sections from generateSitemap()
 * @returns Valid XML sitemap string
 */
export function entriesToXML(sections: SitemapSection[]): string {
  const urlElements: string[] = [];

  for (const section of sections) {
    if (section.entries.length === 0) continue;

    urlElements.push(`  <!-- Section: ${section.name} -->`);

    for (const entry of section.entries) {
      urlElements.push(entryToXML(entry));
    }
  }

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urlElements,
    '</urlset>',
  ].join('\n');
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Serialises a single SitemapEntry to an XML <url> block.
 */
function entryToXML(entry: SitemapEntry): string {
  const lines = [
    '  <url>',
    `    <loc>${escapeXml(entry.url)}</loc>`,
    `    <lastmod>${entry.lastmod}</lastmod>`,
    `    <changefreq>${entry.changefreq}</changefreq>`,
    `    <priority>${entry.priority.toFixed(1)}</priority>`,
    '  </url>',
  ];
  return lines.join('\n');
}

/**
 * Returns the later of two ISO date strings as a YYYY-MM-DD string.
 */
function laterDate(a: string, b: string): string {
  return toISODate(new Date(a) >= new Date(b) ? a : b);
}

/**
 * Converts an ISO datetime string to a YYYY-MM-DD date string.
 */
function toISODate(dateStr: string): string {
  return dateStr.slice(0, 10);
}

/**
 * Escapes special XML characters in a string.
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
