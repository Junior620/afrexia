'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';
import { getProductCardImageUrl } from '@/lib/sanity/image-url';
import { trackQuoteClick, trackSpecClick } from '@/lib/analytics/events';

export interface ProductCardDarkProps {
  product: Product;
  locale: 'fr' | 'en';
  translations: ProductCardDarkTranslations;
  onQuoteClick: () => void;
  onSpecClick?: () => void;
}

export interface ProductCardDarkTranslations {
  requestQuote: string;
  viewSpecs: string;
  origin: string;
  moq: string;
  incoterm: string;
  microproof: string;
  badges: {
    available: string;
    onRequest: string;
    outOfStock: string;
    eudrReady: string;
  };
  documents: {
    coa: string;
    specSheet: string;
    chainOfCustody: string;
  };
}

/**
 * ProductCardDark Component
 * Premium dark theme product card for catalog redesign
 * 
 * Features:
 * - Glass effect container with backdrop blur
 * - 4:3 aspect ratio image with gradient overlay
 * - Badges for EUDR and availability
 * - Quick specs grid (Origin, MOQ, Incoterms)
 * - Document indicators
 * - Primary CTA and secondary link
 * - Hover and focus states with elevation
 * 
 * Requirements: 4.1-4.11
 */
export const ProductCardDark: React.FC<ProductCardDarkProps> = ({
  product,
  locale,
  translations,
  onQuoteClick,
  onSpecClick,
}) => {
  // Build optimized image URL from Sanity
  const imageUrl = getProductCardImageUrl(product.heroImage);
  const imageAlt = `${product.name} - ${product.category}`;

  // Product detail page URL for prefetching
  const productDetailUrl = `/${locale}/products/${product.slug}`;

  // Card base classes with glass effect
  const cardClasses = cn(
    'group relative',
    'bg-[rgba(26,40,32,0.8)]',
    'border border-[rgba(255,255,255,0.1)]',
    'rounded-[28px]',
    'shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
    'backdrop-blur-[12px]',
    'overflow-hidden',
    'min-h-[520px]',
    'flex flex-col',
    'transition-all duration-300 ease-out',
    // Hover states
    'hover:-translate-y-1',
    'hover:shadow-[0_12px_48px_rgba(0,0,0,0.4)]',
    'hover:border-[rgba(255,255,255,0.2)]',
    // Focus-within for keyboard navigation
    'focus-within:outline focus-within:outline-2 focus-within:outline-[#A89858] focus-within:outline-offset-2'
  );

  // Get availability badge label
  const getAvailabilityLabel = () => {
    switch (product.availability) {
      case 'in-stock':
        return translations.badges.available;
      case 'limited':
        return translations.badges.onRequest;
      case 'pre-order':
        return translations.badges.onRequest;
      default:
        return translations.badges.outOfStock;
    }
  };

  // Handle quote button click with analytics
  const handleQuoteClick = () => {
    trackQuoteClick({
      productId: product.id,
      productName: product.name,
      category: product.category,
      origin: product.origins[0] || 'Unknown',
      availability: product.availability,
      source: 'card',
    });
    onQuoteClick();
  };

  // Handle spec link click with analytics
  const handleSpecClick = () => {
    trackSpecClick({
      productId: product.id,
      productName: product.name,
      category: product.category,
      origin: product.origins[0] || 'Unknown',
    });
    if (onSpecClick) {
      onSpecClick();
    }
  };

  // Prefetch product page on card hover
  const handleCardHover = () => {
    // Next.js will automatically prefetch the Link on hover
    // This is just for additional tracking if needed
  };

  return (
    <article className={cardClasses} onMouseEnter={handleCardHover}>
      {/* Media Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Product Image */}
        {imageUrl && imageUrl !== '/assets/placeholder.svg' ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            quality={80}
          />
        ) : (
          // Premium fallback pattern
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A2820] via-[#0A1410] to-[#141D18]">
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="premium-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="1" fill="#4A9A62" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#premium-pattern)" />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-[#4A9A62] text-6xl font-bold opacity-20">
                {product.name.charAt(0)}
              </div>
            </div>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Badge Group - Top Right */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {/* Availability Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-sm whitespace-nowrap backdrop-blur-[12px] bg-[rgba(74,154,98,0.9)] text-white border border-[#4A9A62]">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{getAvailabilityLabel()}</span>
          </div>
          
          {/* EUDR Badge */}
          {product.eudrReady && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-sm whitespace-nowrap backdrop-blur-[12px] bg-[rgba(74,154,98,0.9)] text-white border border-[#4A9A62]">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{translations.badges.eudrReady}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-6">
        {/* Product Header */}
        <div className="mb-4">
          <h3 className="text-[22px] font-bold leading-tight text-[#E8F5E9] line-clamp-2">
            {product.name}
          </h3>
          {product.subtitle && (
            <p className="text-sm text-[#B0D4B8] mt-1 line-clamp-1">
              {product.subtitle}
            </p>
          )}
        </div>

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Origin */}
          <div className="flex flex-col gap-1">
            <div className="text-xs uppercase tracking-wide text-[#80996F] font-semibold">
              {translations.origin}
            </div>
            <div className="text-sm font-semibold text-[#E8F5E9] truncate">
              {product.origins[0] || '—'}
            </div>
          </div>

          {/* MOQ */}
          <div className="flex flex-col gap-1">
            <div className="text-xs uppercase tracking-wide text-[#80996F] font-semibold">
              {translations.moq}
            </div>
            <div className="text-sm font-semibold text-[#E8F5E9] truncate">
              {product.moq.value} {product.moq.unit}
            </div>
          </div>

          {/* Incoterms - Full width */}
          <div className="flex flex-col gap-1 col-span-2">
            <div className="text-xs uppercase tracking-wide text-[#80996F] font-semibold">
              {translations.incoterm}
            </div>
            <div className="text-sm font-semibold text-[#E8F5E9] truncate">
              {product.incoterms.join(', ')}
            </div>
          </div>
        </div>

        {/* Document Indicators */}
        {(product.documents.coa || product.documents.specSheet || product.documents.chainOfCustody) && (
          <div className="flex items-center gap-3 mb-4">
            {product.documents.coa && (
              <div
                className="flex items-center gap-1 text-xs text-[#B0D4B8]"
                title={translations.documents.coa}
              >
                <svg
                  className="w-5 h-5 text-[#4A9A62] flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">COA</span>
              </div>
            )}
            
            {product.documents.specSheet && (
              <div
                className="flex items-center gap-1 text-xs text-[#B0D4B8]"
                title={translations.documents.specSheet}
              >
                <svg
                  className="w-5 h-5 text-[#4A9A62] flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Spec</span>
              </div>
            )}
            
            {product.documents.chainOfCustody && (
              <div
                className="flex items-center gap-1 text-xs text-[#B0D4B8]"
                title={translations.documents.chainOfCustody}
              >
                <svg
                  className="w-5 h-5 text-[#4A9A62] flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Chain</span>
              </div>
            )}
          </div>
        )}

        {/* Spacer to push actions to bottom */}
        <div className="flex-1" />
      </div>

      {/* Actions Section */}
      <div className="border-t border-[rgba(255,255,255,0.1)] p-6">
        <div className="flex flex-col gap-3">
          {/* Primary CTA Button */}
          <button
            onClick={handleQuoteClick}
            className={cn(
              'w-full inline-flex items-center justify-center gap-2',
              'px-6 py-3 min-h-[44px]',
              'rounded-lg font-semibold text-base',
              'bg-[#4A9A62] text-white',
              'hover:bg-[#5AAA72]',
              'active:bg-[#3A8A52]',
              'focus:outline-none focus:ring-2 focus:ring-[#A89858] focus:ring-offset-2 focus:ring-offset-[#0A1410]',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {translations.requestQuote}
          </button>

          {/* Secondary Link */}
          <Link
            href={productDetailUrl}
            onClick={handleSpecClick}
            prefetch={true}
            className={cn(
              'text-center text-sm font-semibold',
              'text-[#A89858]',
              'hover:text-[#B8A868]',
              'transition-colors duration-200',
              'focus:outline-none focus:underline'
            )}
          >
            {translations.viewSpecs} →
          </Link>

          {/* Microproof */}
          <p className="text-xs text-center text-[#80996F]">
            {translations.microproof}
          </p>
        </div>
      </div>
    </article>
  );
};

ProductCardDark.displayName = 'ProductCardDark';
