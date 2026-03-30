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

export {
  ISR_REVALIDATION,
  getRevalidationTime,
  getPageTypeFromPath,
  getRevalidationFromPath,
  type ISRPageType,
} from './isrConfig';

export {
  generateCacheControl,
  generateETag,
  generateCacheHeaders,
  applyCacheHeaders,
  hasMatchingETag,
  createCachedResponse,
  type CacheHeaderConfig,
} from './cacheHeaders';

export {
  ISRErrorType,
  handleISRError,
  createISRError,
  withISRErrorHandling,
  logISRSuccess,
  withISRRegeneration,
  type ISRError,
  type ISRErrorHandlerOptions,
  type ISRRegenerationContext,
} from './isrErrorHandler';
