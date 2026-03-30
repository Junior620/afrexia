/**
 * SEO Content Templates — barrel export
 *
 * Re-exports all template modules for convenient importing.
 *
 * @example
 * import {
 *   PRODUCT_COUNTRY_INTRO_TEMPLATES,
 *   selectTemplateVariation,
 *   PRODUCT_COUNTRY_FAQ_TEMPLATES,
 *   PRICE_FAQ_TEMPLATES,
 *   COMPARISON_FAQ_TEMPLATES,
 *   generateFAQs,
 *   selectContentStructure,
 *   getTotalMinWords,
 *   SECTION_HEADINGS,
 * } from '@/lib/seo/templates';
 */

export {
  PRODUCT_COUNTRY_INTRO_TEMPLATES,
  selectTemplateVariation,
} from './productCountryTemplates';

export type {
  ProductCountryTemplateData,
  IntroVariation,
} from './productCountryTemplates';

export {
  PRODUCT_COUNTRY_FAQ_TEMPLATES,
  PRICE_FAQ_TEMPLATES,
  COMPARISON_FAQ_TEMPLATES,
  ALL_FAQ_TEMPLATES,
  generateFAQs,
} from './faqTemplates';

export type {
  FAQItem,
  FAQTemplateData,
  FAQTemplateFn,
  PageType,
} from './faqTemplates';

export {
  PRODUCT_COUNTRY_STRUCTURES,
  PRICE_STRUCTURES,
  COMPARISON_STRUCTURES,
  SECTION_HEADINGS,
  selectContentStructure,
  getTotalMinWords,
} from './contentStructureVariations';

export type {
  SectionType,
  SectionConfig,
  ContentStructure,
  PageTypeForStructure,
} from './contentStructureVariations';
