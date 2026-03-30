import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import { generateSitemap } from '@/lib/seo/sitemapGenerator';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://afrexia.com';

type Locale = 'fr' | 'en';

interface SanityDocument {
  slug: {
    fr: { current: string };
    en: { current: string };
  };
  _updatedAt: string;
}

/**
 * Fetch all products from Sanity
 */
async function getProducts(): Promise<SanityDocument[]> {
  try {
    const query = `*[_type == "product" && !(_id in path("drafts.**"))] {
      "slug": slug,
      _updatedAt
    }`;
    return await client.fetch(query);
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
    return [];
  }
}

/**
 * Fetch all blog posts from Sanity
 */
async function getBlogPosts(): Promise<SanityDocument[]> {
  try {
    const query = `*[_type == "blogPost" && !(_id in path("drafts.**"))] {
      "slug": slug,
      _updatedAt
    }`;
    return await client.fetch(query);
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
    return [];
  }
}

/**
 * Generate sitemap entries for a list of documents
 */
function generateDocumentEntries(
  documents: SanityDocument[],
  basePath: string
): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const locales: Locale[] = ['fr', 'en'];

  for (const doc of documents) {
    for (const locale of locales) {
      const slug = doc.slug?.[locale]?.current;
      if (slug) {
        entries.push({
          url: `${SITE_URL}/${locale}${basePath}/${slug}`,
          lastModified: new Date(doc._updatedAt),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }
  }

  return entries;
}

/**
 * Generate static page entries
 */
function generateStaticEntries(): MetadataRoute.Sitemap {
  const locales: Locale[] = ['fr', 'en'];
  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/products', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/solutions', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/quality', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/traceability', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/resources', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/contact', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/rfq', priority: 0.9, changeFrequency: 'monthly' as const },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  return entries;
}

/**
 * Convert V1 programmatic SEO sections from SitemapGenerator into
 * Next.js MetadataRoute.Sitemap format.
 *
 * Pages marked noindex are excluded upstream by SitemapGenerator
 * (only approved/published entries are generated).
 *
 * Sections:
 *   - product-country  → priority 0.8, changeFrequency weekly
 *   - price            → priority 0.7, changeFrequency daily
 *   - comparison       → priority 0.7, changeFrequency weekly
 *
 * @see Requirements 1.11
 */
async function generateProgrammaticSEOEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const sections = await generateSitemap();
    const entries: MetadataRoute.Sitemap = [];

    for (const section of sections) {
      for (const entry of section.entries) {
        entries.push({
          url: entry.url,
          lastModified: new Date(entry.lastmod),
          changeFrequency: entry.changefreq as MetadataRoute.Sitemap[number]['changeFrequency'],
          priority: entry.priority,
        });
      }
    }

    return entries;
  } catch (error) {
    console.error('Error generating programmatic SEO sitemap entries:', error);
    return [];
  }
}

/**
 * Generate complete sitemap combining static pages, blog/product content,
 * and V1 programmatic SEO pages (product×country, prix, guides/comparaisons).
 *
 * Regenerated at every deployment (no revalidate export → build-time generation).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, blogPosts, programmaticEntries] = await Promise.all([
    getProducts(),
    getBlogPosts(),
    generateProgrammaticSEOEntries(),
  ]);

  const staticEntries = generateStaticEntries();
  const productEntries = generateDocumentEntries(products, '/products');
  const blogEntries = generateDocumentEntries(blogPosts, '/blog');

  return [
    ...staticEntries,
    ...productEntries,
    ...blogEntries,
    // V1 programmatic SEO pages (product×country, prix, guides)
    // noindex pages are excluded by SitemapGenerator (only approved/published entries)
    ...programmaticEntries,
  ];
}
