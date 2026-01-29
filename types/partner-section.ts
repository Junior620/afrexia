/**
 * Type definitions for the SCPB Partner Section component
 */

import { Locale } from './index';

/**
 * Configuration for a call-to-action button
 */
export interface CTAConfig {
  label: string;
  href: string;
  external?: boolean;
}

/**
 * Configuration for an image in the partner section
 */
export interface ImageConfig {
  src: string;
  alt: string;
  priority?: boolean;
}

/**
 * Statistical card data for trust indicators
 */
export interface StatCard {
  label: string;
  value: string;
  icon?: string;
}

/**
 * Complete content structure for the partner section
 */
export interface PartnerContent {
  partnerName: string;
  relationship: string;
  partnerUrl: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  bodyText: string[];
  keyFacts: string[];
  stats?: StatCard[];
  primaryCTA: CTAConfig;
  secondaryCTA: CTAConfig;
  trustMicrocopy: string;
  images: ImageConfig[];
  photoCaption: string;
}

/**
 * Props for the PartnerSection component
 */
export interface PartnerSectionProps {
  locale: Locale;
  content?: PartnerContent;
  className?: string;
}
