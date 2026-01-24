/**
 * Core type definitions for the Afrexia website
 */

// Locale types
export type Locale = 'fr' | 'en';

// Multilingual content
export interface MultilingualString {
  fr: string;
  en: string;
}

export interface MultilingualText {
  fr: string;
  en: string;
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
