/**
 * Analytics Type Definitions
 * 
 * Event interfaces for tracking user interactions with the product catalog.
 */

import { AvailabilityStatus } from './product';

/**
 * Base Analytics Event
 * Common structure for all analytics events
 */
export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: number;
}

/**
 * Product View Event
 * Fired when a product card enters the viewport
 */
export interface ProductViewEvent extends AnalyticsEvent {
  event: 'product_card_view';
  properties: {
    productId: string;
    productName: string;
    category: string;
    origin: string;
    availability: AvailabilityStatus;
  };
}

/**
 * Filter Used Event
 * Fired when a user applies a filter
 */
export interface FilterUsedEvent extends AnalyticsEvent {
  event: 'catalog_filter_used';
  properties: {
    filterType: string;
    filterValue: any;
    resultCount: number;
  };
}

/**
 * Product Card CTA Click Event
 * Fired when a user clicks the quote CTA on a product card
 */
export interface ProductCardCTAClickEvent extends AnalyticsEvent {
  event: 'product_card_cta_quote_click';
  properties: {
    productId: string;
    productName: string;
    category: string;
    origin: string;
    availability: AvailabilityStatus;
  };
}

/**
 * Product Card Spec Click Event
 * Fired when a user clicks the specifications link on a product card
 */
export interface ProductCardSpecClickEvent extends AnalyticsEvent {
  event: 'product_card_spec_click';
  properties: {
    productId: string;
    productName: string;
    category: string;
  };
}

/**
 * Quick View Open Event
 * Fired when a user opens the Quick View modal
 */
export interface QuickViewOpenEvent extends AnalyticsEvent {
  event: 'quick_view_open';
  properties: {
    productId: string;
    productName: string;
    category: string;
    origin: string;
  };
}

/**
 * RFQ Submit Event
 * Fired when a user submits an RFQ
 */
export interface RFQSubmitEvent extends AnalyticsEvent {
  event: 'rfq_submit';
  properties: {
    productIds: string[];
    productCount: number;
    totalQuantity: number;
    company: string;
    country: string;
  };
}

/**
 * Catalog Download Event
 * Fired when a user downloads the catalog PDF
 */
export interface CatalogDownloadEvent extends AnalyticsEvent {
  event: 'catalog_download';
  properties: {
    company: string;
    country: string;
    email: string;
  };
}

/**
 * Union type of all analytics events
 */
export type CatalogAnalyticsEvent =
  | ProductViewEvent
  | FilterUsedEvent
  | ProductCardCTAClickEvent
  | ProductCardSpecClickEvent
  | QuickViewOpenEvent
  | RFQSubmitEvent
  | CatalogDownloadEvent;
