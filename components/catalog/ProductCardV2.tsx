'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';
import { getProductCardImageUrl } from '@/lib/sanity/image-url';
import { trackQuoteClick, trackSpecClick } from '@/lib/analytics/events';

export interface ProductCardV2Props {
  product: Product;
  locale: 'fr' | 'en';
  translations: ProductCardV2Translations;
  onQuoteClick: () => void;
  onDownloadSpec?: () => void;
}

export interface ProductCardV2Translations {
  requestQuote: string;
  downloadSpec: string;
  origin: string;
  moq: string;
  incoterm: string;
  microproof: string;
  categoryLabels: {
    cocoa: string;
    coffee: string;
    corn: string;
    pepper: string;
    wood: string;
  };
  badges: {
    inStock: string;
    onRequest: string;
    contractable: string;
    eudrReady: string;
  };
  fallback: {
    comingSoon: string;
    multiOrigin: string;
    toSpecify: string;
  };
}

/**
 * ProductCardV2 Component
 * Premium B2B commodity card - Optimized for conversion
 * 
 * Key improvements:
 * - Ratio 16:10 (vs 4:3) pour réduire hauteur
 * - Fallback premium avec icônes catégorie
 * - Badges B2B (En stock / Sur demande / Contractable)
 * - 2 CTAs (RFQ primary + PDF secondary)
 * - Origine avec fallback intelligent
 * - Microproof trust (24h • NDA)
 * - Catégorie label top-left
 * - Hauteur réduite ~420px (vs 520px)
 */
export const ProductCardV2: React.FC<ProductCardV2Props> = ({
  product,
  locale,
  translations,
  onQuoteClick,
  onDownloadSpec,
}) => {
  const imageUrl = getProductCardImageUrl(product.heroImage);
  const hasImage = imageUrl && imageUrl !== '/assets/placeholder.svg';

  // Get category icon SVG
  const getCategoryIcon = () => {
    const iconClass = "w-20 h-20 text-[#4A9A62] opacity-20";
    
    switch (product.category) {
      case 'coffee':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 21h18v-2H2v2zM20 8h-2V5h2c1.1 0 2 .9 2 2s-.9 2-2 2zm-2 2v5H4V5h14v5h2c2.21 0 4-1.79 4-4s-1.79-4-4-4h-2c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2z"/>
          </svg>
        );
      case 'cocoa':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
        );
      case 'corn':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm6 9.09c0 4-2.55 7.7-6 8.83-3.45-1.13-6-4.82-6-8.83V6.31l6-2.12 6 2.12v4.78z"/>
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
          </svg>
        );
    }
  };

  // Get availability badge
  const getAvailabilityBadge = () => {
    let label = translations.badges.inStock;
    let bgColor = 'bg-[rgba(74,154,98,0.9)]';
    let borderColor = 'border-[#4A9A62]';

    if (product.availability === 'limited') {
      label = translations.badges.onRequest;
      bgColor = 'bg-[rgba(168,152,88,0.9)]';
      borderColor = 'border-[#A89858]';
    } else if (product.availability === 'pre-order') {
      label = translations.badges.contractable;
      bgColor = 'bg-[rgba(128,153,111,0.9)]';
      borderColor = 'border-[#80996F]';
    }

    return { label, bgColor, borderColor };
  };

  const availabilityBadge = getAvailabilityBadge();

  // Get origin display with fallback
  const getOriginDisplay = () => {
    if (product.origins && product.origins.length > 0) {
      if (product.origins.length > 1) {
        return product.origins.slice(0, 2).join(', ');
      }
      return product.origins[0];
    }
    return translations.fallback.multiOrigin;
  };

  // Get category label
  const getCategoryLabel = () => {
    const labels = translations.categoryLabels;
    return labels[product.category as keyof typeof labels] || product.category;
  };

  // Handle quote click
  const handleQuoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    trackQuoteClick({
      productId: product.id,
      productName: product.name,
      category: product.category,
      origin: product.origins[0] || 'Unknown',
      availability: product.availability,
      source: 'card-v2',
    });
    onQuoteClick();
  };

  // Handle spec download
  const handleDownloadSpec = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    trackSpecClick({
      productId: product.id,
      productName: product.name,
      category: product.category,
      origin: product.origins[0] || 'Unknown',
    });
    if (onDownloadSpec) {
      onDownloadSpec();
    }
  };

  return (
    <article
      className={cn(
        'group relative',
        'bg-[rgba(26,40,32,0.6)]',
        'border border-[rgba(255,255,255,0.1)]',
        'rounded-[24px]',
        'shadow-[0_4px_24px_rgba(0,0,0,0.2)]',
        'backdrop-blur-[12px]',
        'overflow-hidden',
        'flex flex-col',
        'transition-all duration-300 ease-out',
        // Hover states - CRO optimized
        'hover:-translate-y-1',
        'hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
        'hover:border-[rgba(168,152,88,0.4)]',
        'hover:bg-[rgba(26,40,32,0.8)]',
        // Focus-within for a11y
        'focus-within:outline focus-within:outline-2 focus-within:outline-[#A89858] focus-within:outline-offset-2'
      )}
    >
      {/* Media Section - 16:10 ratio */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {hasImage ? (
          <>
            {/* Product Image */}
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              quality={80}
            />
          </>
        ) : (
          /* Premium Fallback - JAMAIS VIDE */
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A2820] via-[#0F1814] to-[#0A1410]">
            {/* Texture jute premium */}
            <div className="absolute inset-0 opacity-[0.12]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234A9A62' fill-opacity='1'%3E%3Ccircle cx='10' cy='10' r='1.5'/%3E%3Ccircle cx='30' cy='20' r='1.2'/%3E%3Ccircle cx='50' cy='15' r='1.3'/%3E%3Ccircle cx='20' cy='40' r='1.4'/%3E%3Ccircle cx='45' cy='45' r='1.1'/%3E%3Ccircle cx='15' cy='55' r='1.3'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }} />
            
            {/* Vignette gradient pour depth */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40" />
            
            {/* Watermark icône catégorie - GRAND et centré */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.08]">
              <div className="scale-150">
                {getCategoryIcon()}
              </div>
            </div>
            
            {/* Overlay content - Nom produit + label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <h4 className="text-2xl font-bold text-[#E8F5E9] mb-2 opacity-90">
                {product.name}
              </h4>
              <div className="px-4 py-2 rounded-lg bg-[rgba(26,40,32,0.95)] border border-[rgba(74,154,98,0.4)] backdrop-blur-sm">
                <p className="text-xs font-medium text-[#B0D4B8]">
                  📸 Photo terrain sur demande
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Gradient Overlay - Bottom only */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Badges - Top Right ONLY */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {/* EUDR Badge */}
          {product.eudrReady && (
            <div 
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-xs whitespace-nowrap backdrop-blur-sm bg-[rgba(74,154,98,0.95)] text-white border border-[#4A9A62] shadow-sm"
              title={translations.badges.eudrReady}
            >
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>EUDR</span>
            </div>
          )}
          
          {/* Availability Badge */}
          <div 
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-xs whitespace-nowrap backdrop-blur-sm text-white border shadow-sm',
              availabilityBadge.bgColor,
              availabilityBadge.borderColor
            )}
          >
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{availabilityBadge.label}</span>
          </div>
        </div>
      </div>

      {/* Content Section - Compact */}
      <div className="flex-1 flex flex-col p-5">
        {/* Product Header */}
        <div className="mb-4">
          {/* Category label au-dessus du titre - Style editorial */}
          <div className="text-[10px] uppercase tracking-[0.12em] text-[#80996F] font-bold mb-1.5 px-0.5">
            {getCategoryLabel()}
          </div>
          
          <h3 className="text-[22px] font-bold leading-tight text-[#E8F5E9] mb-2">
            {product.name}
          </h3>
          
          {product.subtitle && (
            <p className="text-[14px] text-[#B0D4B8] line-clamp-2 leading-snug mb-3">
              {product.subtitle}
            </p>
          )}
          
          {/* B2B Highlights Pills - NOUVEAU */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium">
            {product.eudrReady && (
              <>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[rgba(74,154,98,0.15)] text-[#4A9A62] border border-[rgba(74,154,98,0.3)]">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  EUDR
                </span>
                <span className="text-[#80996F]">•</span>
              </>
            )}
            {product.documents.coa && (
              <>
                <span className="text-[#B0D4B8]">COA</span>
                <span className="text-[#80996F]">•</span>
              </>
            )}
            <span className="text-[#B0D4B8]">{product.incoterms.slice(0, 2).join('/')}</span>
            {product.grade && (
              <>
                <span className="text-[#80996F]">•</span>
                <span className="text-[#B0D4B8]">{product.grade}</span>
              </>
            )}
          </div>
        </div>

        {/* Quick Specs Grid - 2 columns */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-4">
          {/* Origin */}
          <div className="flex flex-col gap-0.5">
            <div className="text-[10px] uppercase tracking-wider text-[#80996F] font-semibold">
              {translations.origin}
            </div>
            <div 
              className="text-[13px] font-semibold text-[#E8F5E9] truncate"
              title={getOriginDisplay()}
            >
              {getOriginDisplay()}
            </div>
          </div>

          {/* MOQ */}
          <div className="flex flex-col gap-0.5">
            <div className="text-[10px] uppercase tracking-wider text-[#80996F] font-semibold">
              {translations.moq}
            </div>
            <div className="text-[13px] font-semibold text-[#E8F5E9]">
              {product.moq.value} {product.moq.unit}
            </div>
          </div>

          {/* Incoterms - Full width */}
          <div className="flex flex-col gap-0.5 col-span-2">
            <div className="text-[10px] uppercase tracking-wider text-[#80996F] font-semibold">
              {translations.incoterm}
            </div>
            <div className="text-[13px] font-semibold text-[#E8F5E9] truncate">
              {product.incoterms.join(', ')}
            </div>
          </div>

          {/* Optional: Grade/Moisture if available */}
          {product.grade && (
            <div className="flex flex-col gap-0.5 col-span-2">
              <div className="text-[10px] uppercase tracking-wider text-[#80996F] font-semibold">
                Grade
              </div>
              <div className="text-[13px] font-semibold text-[#E8F5E9] truncate">
                {product.grade}
              </div>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />
      </div>

      {/* Actions Section - Compact */}
      <div className="border-t border-[rgba(255,255,255,0.1)] p-5 pt-4 bg-[rgba(10,20,16,0.4)]">
        <div className="flex flex-col gap-2.5">
          {/* Primary CTA - RFQ */}
          <button
            onClick={handleQuoteClick}
            className={cn(
              'w-full inline-flex items-center justify-center gap-2',
              'px-5 py-3 min-h-[44px]',
              'rounded-xl font-semibold text-[15px]',
              'bg-[#4A9A62] text-white',
              'hover:bg-[#5AAA72]',
              'active:bg-[#3A8A52]',
              'focus:outline-none focus:ring-2 focus:ring-[#A89858] focus:ring-offset-2 focus:ring-offset-[#0A1410]',
              'transition-all duration-200',
              'shadow-sm hover:shadow-md',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {translations.requestQuote}
          </button>

          {/* Secondary CTA - PDF Spec - AMÉLIORÉ */}
          <button
            onClick={handleDownloadSpec}
            className={cn(
              'w-full inline-flex items-center justify-center gap-2',
              'px-5 py-2.5 min-h-[42px]',
              'rounded-xl font-semibold text-[14px]',
              'bg-transparent text-[#A89858]',
              'border-2 border-[rgba(168,152,88,0.5)]',
              'hover:bg-[rgba(168,152,88,0.15)]',
              'hover:border-[rgba(168,152,88,0.8)]',
              'active:bg-[rgba(168,152,88,0.2)]',
              'focus:outline-none focus:ring-2 focus:ring-[#A89858] focus:ring-offset-2 focus:ring-offset-[#0A1410]',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
            </svg>
            Télécharger fiche technique
          </button>

          {/* Microproof Trust + COA mention */}
          <div className="text-center space-y-1">
            <p className="text-[11px] font-medium text-[#80996F]">
              {translations.microproof}
            </p>
            {product.documents.coa && (
              <p className="text-[10px] text-[#80996F]">
                COA & SDS sur demande
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

ProductCardV2.displayName = 'ProductCardV2';
