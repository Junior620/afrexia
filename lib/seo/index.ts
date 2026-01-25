/**
 * SEO utilities for metadata generation and structured data
 */

export {
  generateMetaTags,
  generateHreflangTags,
  type MetaTagsConfig,
} from './metadata';

export {
  generateOrganizationSchema,
  generateProductSchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateWebSiteSchema,
  type ProductSchemaData,
  type ArticleSchemaData,
  type BreadcrumbItem,
} from './schema';
