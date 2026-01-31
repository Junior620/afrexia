import { client } from '@/sanity/lib/client';
import { Locale } from '@/types';
import { groq } from 'next-sanity';

/**
 * GROQ query fragments for reusable fields
 */
const productFields = groq`
  _id,
  _type,
  _createdAt,
  _updatedAt,
  name,
  slug,
  i18nId,
  category,
  description,
  heroImage {
    asset,
    alt,
    hotspot,
    crop
  },
  gallery[] {
    asset,
    alt,
    caption,
    hotspot
  },
  originRegions[] {
    region,
    coordinates,
    description
  },
  harvestSeason,
  packagingOptions[] {
    type,
    weight,
    description
  },
  moq,
  incoterms,
  certifications[]-> {
    _id,
    name,
    logo,
    description,
    issuingBody,
    validUntil
  },
  specificationPDF {
    asset-> {
      _id,
      url,
      originalFilename,
      size
    }
  },
  qaMetrics[] {
    metric,
    value,
    standard
  },
  hsCode,
  availability,
  eudrReady,
  targetMarkets,
  seo,
  workflowStatus
`;

/**
 * Get all published products
 */
export async function getAllProducts() {
  const query = groq`*[_type == "product" && workflowStatus == "published"] | order(_createdAt desc) {
    ${productFields}
  }`;

  return client.fetch(query, {}, { next: { revalidate: 60 } });
}

/**
 * Get product by slug for a specific locale
 */
export async function getProductBySlug(slug: string, locale: Locale) {
  const query = groq`*[_type == "product" && slug.${locale}.current == $slug && workflowStatus == "published"][0] {
    ${productFields}
  }`;

  return client.fetch(query, { slug }, { next: { revalidate: 60 } });
}

/**
 * Get product by i18nId (for language switching)
 */
export async function getProductByI18nId(i18nId: string) {
  const query = groq`*[_type == "product" && i18nId == $i18nId && workflowStatus == "published"][0] {
    ${productFields}
  }`;

  return client.fetch(query, { i18nId }, { next: { revalidate: 60 } });
}

/**
 * Get all product slugs for static generation
 */
export async function getAllProductSlugs() {
  const query = groq`*[_type == "product" && workflowStatus == "published"] {
    "slugFr": slug.fr.current,
    "slugEn": slug.en.current,
    i18nId
  }`;

  return client.fetch(query);
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string) {
  const query = groq`*[_type == "product" && category == $category && workflowStatus == "published"] | order(_createdAt desc) {
    ${productFields}
  }`;

  return client.fetch(query, { category }, { next: { revalidate: 60 } });
}

/**
 * Get all published certifications
 */
export async function getAllCertifications() {
  const query = groq`*[_type == "certification" && workflowStatus == "published"] | order(_createdAt desc) {
    _id,
    name,
    logo,
    description,
    issuingBody,
    validUntil,
    certificateDocument {
      asset-> {
        _id,
        url,
        originalFilename,
        size
      }
    }
  }`;

  return client.fetch(query, {}, { next: { revalidate: 3600 } });
}

/**
 * GROQ query fragments for blog posts
 */
const blogPostFields = groq`
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  i18nId,
  excerpt,
  content,
  featuredImage {
    asset,
    alt,
    hotspot
  },
  author-> {
    _id,
    name,
    role,
    bio,
    photo {
      asset,
      alt
    }
  },
  publishedAt,
  categories[]-> {
    _id,
    name,
    slug,
    description
  },
  tags,
  seo,
  workflowStatus
`;

/**
 * Get all published blog posts
 */
export async function getAllBlogPosts() {
  const query = groq`*[_type == "blogPost" && workflowStatus == "published"] | order(publishedAt desc) {
    ${blogPostFields}
  }`;

  return client.fetch(query, {}, { next: { revalidate: 300 } });
}

/**
 * Get blog post by slug for a specific locale
 */
export async function getBlogPostBySlug(slug: string, locale: Locale) {
  const query = groq`*[_type == "blogPost" && slug.${locale}.current == $slug && workflowStatus == "published"][0] {
    ${blogPostFields}
  }`;

  return client.fetch(query, { slug }, { next: { revalidate: 300 } });
}

/**
 * Get blog post by i18nId (for language switching)
 */
export async function getBlogPostByI18nId(i18nId: string) {
  const query = groq`*[_type == "blogPost" && i18nId == $i18nId && workflowStatus == "published"][0] {
    ${blogPostFields}
  }`;

  return client.fetch(query, { i18nId }, { next: { revalidate: 300 } });
}

/**
 * Get all blog post slugs for static generation
 */
export async function getAllBlogPostSlugs() {
  const query = groq`*[_type == "blogPost" && workflowStatus == "published"] {
    "slugFr": slug.fr.current,
    "slugEn": slug.en.current,
    i18nId
  }`;

  return client.fetch(query);
}

/**
 * Get related blog posts based on categories and tags
 */
export async function getRelatedBlogPosts(
  postId: string,
  categories: string[],
  tags: string[],
  limit: number = 4
) {
  const query = groq`*[
    _type == "blogPost" && 
    workflowStatus == "published" && 
    _id != $postId &&
    (
      count((categories[]->_id)[@ in $categories]) > 0 ||
      count(tags[@ in $tags]) > 0
    )
  ] | order(publishedAt desc) [0...$limit] {
    ${blogPostFields}
  }`;

  return client.fetch(
    query,
    { postId, categories, tags, limit },
    { next: { revalidate: 300 } }
  );
}

/**
 * Get all blog categories
 */
export async function getAllBlogCategories() {
  const query = groq`*[_type == "blogCategory"] | order(name.en asc) {
    _id,
    name,
    slug,
    description
  }`;

  return client.fetch(query, {}, { next: { revalidate: 3600 } });
}

/**
 * Get all team members
 */
export async function getAllTeamMembers() {
  const query = groq`*[_type == "teamMember" && workflowStatus == "published"] | order(order asc) {
    _id,
    name,
    slug,
    position,
    bio,
    photo {
      asset,
      alt,
      hotspot
    },
    email,
    phone,
    linkedin,
    order,
    level
  }`;

  return client.fetch(query, {}, { next: { revalidate: 3600 } });
}

/**
 * Get all resources
 */
export async function getAllResources() {
  const query = groq`*[_type == "resource" && workflowStatus == "published"] | order(_createdAt desc) {
    _id,
    title,
    description,
    category,
    file {
      asset-> {
        _id,
        url,
        originalFilename,
        size,
        extension,
        _updatedAt
      }
    },
    relatedProducts[]-> {
      _id,
      name,
      slug
    },
    tags,
    _createdAt,
    _updatedAt
  }`;

  return client.fetch(query, {}, { next: { revalidate: 3600 } });
}

/**
 * Get resource by ID
 */
export async function getResourceById(id: string) {
  const query = groq`*[_type == "resource" && _id == $id && workflowStatus == "published"][0] {
    _id,
    title,
    description,
    category,
    file {
      asset-> {
        _id,
        url,
        originalFilename,
        size,
        extension
      }
    },
    relatedProducts[]-> {
      _id,
      name,
      slug
    },
    tags
  }`;

  return client.fetch(query, { id });
}

/**
 * Get site settings (singleton)
 */
export async function getSiteSettings() {
  const query = groq`*[_type == "siteSettings"][0] {
    _id,
    trackRecordImage {
      asset,
      alt,
      caption,
      hotspot
    },
    complianceBackgroundImage {
      asset,
      alt,
      hotspot
    }
  }`;

  return client.fetch(query, {}, { next: { revalidate: 3600 } });
}
