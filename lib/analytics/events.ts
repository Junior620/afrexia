/**
 * Analytics Event Tracking Utilities
 * Sends events to Plausible, GA4 (with consent), and Vercel Analytics
 */

// Type definitions for analytics events
export type ConversionEvent =
  | 'rfq_submission'
  | 'contact_submission'
  | 'resource_download'
  | 'product_view'
  | 'cta_click';

export interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

// Check if user has given analytics consent
function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('analytics-consent') === 'true';
}

// Check if Do Not Track is enabled
function isDNTEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const dnt = navigator.doNotTrack || (window as any).doNotTrack || (navigator as any).msDoNotTrack;
  return dnt === '1' || dnt === 'yes';
}

/**
 * Send event to Plausible Analytics
 * Plausible is privacy-friendly and doesn't require consent
 */
function trackPlausible(eventName: string, props?: EventProperties): void {
  if (typeof window === 'undefined') return;
  
  // Respect Do Not Track
  if (isDNTEnabled()) return;

  try {
    const plausible = (window as any).plausible;
    if (plausible) {
      plausible(eventName, { props });
    }
  } catch (error) {
    console.error('Plausible tracking error:', error);
  }
}

/**
 * Send event to Google Analytics 4
 * Only sends if user has given consent
 */
function trackGA4(eventName: string, props?: EventProperties): void {
  if (typeof window === 'undefined') return;
  
  // Only track if user has given consent
  if (!hasAnalyticsConsent()) return;
  
  // Respect Do Not Track
  if (isDNTEnabled()) return;

  try {
    const gtag = (window as any).gtag;
    if (gtag) {
      gtag('event', eventName, props);
    }
  } catch (error) {
    console.error('GA4 tracking error:', error);
  }
}

/**
 * Send event to Vercel Analytics
 */
function trackVercel(eventName: string, props?: EventProperties): void {
  if (typeof window === 'undefined') return;
  
  // Respect Do Not Track
  if (isDNTEnabled()) return;

  try {
    const va = (window as any).va;
    if (va) {
      va('track', eventName, props);
    }
  } catch (error) {
    console.error('Vercel Analytics tracking error:', error);
  }
}

/**
 * Main tracking function - sends to all analytics platforms
 */
export function trackEvent(eventName: ConversionEvent, properties?: EventProperties): void {
  // Send to all platforms
  trackPlausible(eventName, properties);
  trackGA4(eventName, properties);
  trackVercel(eventName, properties);
}

/**
 * Track RFQ form submission
 */
export function trackRFQSubmission(data: {
  productId?: string;
  productName?: string;
  quantity?: number;
  incoterm?: string;
  country?: string;
}): void {
  trackEvent('rfq_submission', {
    product_id: data.productId,
    product_name: data.productName,
    quantity: data.quantity,
    incoterm: data.incoterm,
    country: data.country,
  });
}

/**
 * Track contact form submission
 */
export function trackContactSubmission(data: {
  subject?: string;
  hasCompany?: boolean;
}): void {
  trackEvent('contact_submission', {
    subject: data.subject,
    has_company: data.hasCompany,
  });
}

/**
 * Track resource download
 */
export function trackResourceDownload(data: {
  resourceId: string;
  resourceTitle: string;
  resourceCategory?: string;
  fileFormat?: string;
}): void {
  trackEvent('resource_download', {
    resource_id: data.resourceId,
    resource_title: data.resourceTitle,
    resource_category: data.resourceCategory,
    file_format: data.fileFormat,
  });
}

/**
 * Track product page view
 */
export function trackProductView(data: {
  productId: string;
  productName: string;
  productCategory: string;
  locale: string;
}): void {
  trackEvent('product_view', {
    product_id: data.productId,
    product_name: data.productName,
    product_category: data.productCategory,
    locale: data.locale,
  });
}

/**
 * Track CTA button click
 */
export function trackCTAClick(data: {
  ctaText: string;
  ctaLocation: string;
  ctaDestination: string;
}): void {
  trackEvent('cta_click', {
    cta_text: data.ctaText,
    cta_location: data.ctaLocation,
    cta_destination: data.ctaDestination,
  });
}

/**
 * Check if analytics tracking is enabled
 * Returns false if DNT is enabled
 */
export function isTrackingEnabled(): boolean {
  return !isDNTEnabled();
}
