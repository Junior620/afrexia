/**
 * Core type definitions for the Afrexia website
 */

// Locale types
export type Locale = 'fr' | 'en' | 'es' | 'de' | 'ru';

// Multilingual content
export interface MultilingualString {
  fr: string;
  en: string;
  es: string;
  de: string;
  ru: string;
}

export interface MultilingualText {
  fr: string;
  en: string;
  es: string;
  de: string;
  ru: string;
}

// Common types
export interface Image {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Link {
  href: string;
  label: string;
  external?: boolean;
}

// Navigation
export interface NavItem {
  label: MultilingualString;
  href: string;
  children?: NavItem[];
}

// Contact information
export interface ContactInfo {
  email: string;
  phone: string;
  address: MultilingualText;
}

// Social links
export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

// SEO
export interface SEOMetadata {
  title: MultilingualString;
  description: MultilingualString;
  keywords?: string[];
  ogImage?: string;
}

// Form types
export interface FormField {
  name: string;
  label: MultilingualString;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'number';
  required?: boolean;
  placeholder?: MultilingualString;
  options?: { value: string; label: MultilingualString }[];
}

// Analytics
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean>;
}

// Blog types
export interface BlogPost {
  _id: string;
  _type: 'blogPost';
  title: MultilingualString;
  slug: {
    fr: { current: string };
    en: { current: string };
    es: { current: string };
    de: { current: string };
    ru: { current: string };
  };
  i18nId: string;
  excerpt: MultilingualText;
  content: {
    fr: any[];
    en: any[];
    es: any[];
    de: any[];
    ru: any[];
  };
  featuredImage: {
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
    hotspot?: {
      x: number;
      y: number;
      height: number;
      width: number;
    };
  };
  author: TeamMember;
  publishedAt: string;
  categories: BlogCategory[];
  tags: string[];
  seo?: {
    metaTitle?: MultilingualString;
    metaDescription?: MultilingualText;
  };
  workflowStatus?: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: MultilingualString;
  bio?: MultilingualText;
  photo?: {
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
  };
}

export interface BlogCategory {
  _id: string;
  name: MultilingualString;
  slug: {
    fr: { current: string };
    en: { current: string };
    es: { current: string };
    de: { current: string };
    ru: { current: string };
  };
  description?: MultilingualText;
}
