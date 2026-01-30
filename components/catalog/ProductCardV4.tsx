'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';
import { getProductCardImageUrl } from '@/lib/sanity/image-url';
import { trackQuoteClick, trackSpecClick } from '@/lib/analytics/events';

export interface ProductCardV4Props {
  product: Product;
  locale: 'fr' | 'en';
  translations: ProductCardV4Translations;
  onQuoteClick: () => void;
  onDownloadSpec?: () => void;
  terrainImage?: string; // Optional terrain vignette image
}

export interface ProductCardV4Translations {
  requestQuote: string;
  downloadSpec: string;
  origin: string;
  moq: string;
  incoterm: string;
  packaging: string;
  microproof: string;
  terrainLabel: string;
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
    eudrReady: string;
  };
  proofs: {
    coa: string;
    chainOfCustody: string;
    qaDocumented: string;
  };
  fallback: {
    terrainOnRequest: string;
    multiOrigin: string;
  };
}

/**
 * ProductCardV4 - Luxury Export Editorial
 * 
 * Premium B2B product card with editorial luxury aesthetic
 * 
 * Key Features:
 * - 16:10 media ratio with editorial gradient overlay
 * - Terrain vignette (72-92px) bottom-left with overlap
 * - Subtle labels (EUDR, availability) - no flashy chips
 * - Editorial typography with smallcaps category
 * - Compact 2-column specs grid
 * - Dual CTAs: RFQ primary + PDF secondary
 * - Premium fallback with jute texture + watermark
 * - Hover states: image zoom, vignette lift, border glow
 */
export const ProductCardV4: React.FC<ProductCardV4Props> = ({
  product,
  locale,
  translations,
  onQuoteClick,
  onDownloadSpec,
  terrainImage,
}) => {
  const imageUrl = getProductCardImageUrl(product.heroImage);
  const hasImage = imageUrl && imageUrl !== '/assets/placeholder.svg';

  // Category icon for fallback watermark
  const getCategoryIcon = () => {
    const iconClass = "w-24 h-24 opacity-[0.08]";
    
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
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
    }
  };

  // Get category label
  const getCategoryLabel = () => {
    const labels = translations.categoryLabels;
    return labels[product.category as keyof typeof labels] || product.category;
  };

  // Get origin display
  const getOriginDisplay = () => {
    if (product.origins && product.origins.length > 0) {
      return product.origins.slice(0, 2).join(', ');
    }
    return translations.fallback.multiOrigin;
  };

  // Get packaging display
  const getPackagingDisplay = () => {
    if (product.packaging) {
      return product.packaging;
    }
    return 'Sur demande';
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
      source: 'card-v4-luxury',
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
        'border border-[rgba(255,255,255,0.08)]',
        'rounded-[24px]',
        'shadow-[0_4px_24px_rgba(0,0,0,0.2)]',
        'backdrop-blur-[12px]',
        'overflow-hidden',
        'flex flex-col',
        'transition-all duration-300 ease-out',
        // Hover states - Luxury editorial
        'hover:-translate-y-1',
        'hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
        'hover:border-[rgba(255,255,255,0.12)]',
        'hover:bg-[rgba(26,40,32,0.75)]',
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
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
              quality={80}
            />
            
            {/* Editorial Gradient Overlay - Top 15% light, Bottom 55-65% dense */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/15" />
            
            {/* Optional: Subtle film grain overlay */}
            <div 
              className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />
          </>
        ) : (
          /* Premium Fallback - Gradient + Jute Texture + Watermark */
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A2820] via-[#0F1814] to-[#0A1410]">
            {/* Jute texture */}
            <div className="absolute inset-0 opacity-[0.12]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234A9A62' fill-opacity='1'%3E%3Ccircle cx='10' cy='10' r='1.5'/%3E%3Ccircle cx='30' cy='20' r='1.2'/%3E%3Ccircle cx='50' cy='15' r='1.3'/%3E%3Ccircle cx='20' cy='40' r='1.4'/%3E%3Ccircle cx='45' cy='45' r='1.1'/%3E%3Ccircle cx='15' cy='55' r='1.3'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }} />
            
            {/* Vignette for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
            
            {/* Watermark icon - centered, large, subtle */}
            <div className="absolute inset-0 flex items-center justify-center">
              {getCategoryIcon()}
            </div>
            
            {/* Gradient overlay for consistency */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/15" />
          </div>
        )}
        
        {/* Product Name & Subtitle Overlay - Bottom Left Editorial */}
        <div className="absolute bottom-0 left-0 right-0 p-5 pb-6 z-[2]">
          {/* Category smallcaps */}
          <div className="text-[11px] sm:text-[12px] uppercase tracking-[0.15em] text-white/70 font-semibold mb-1.5">
            {getCategoryLabel()}
          </div>
          
          {/* Product name - Large editorial */}
          <h3 className="text-[22px] sm:text-[28px] lg:text-[32px] font-semibold leading-[1.1] text-white mb-1.5">
            {product.name}
          </h3>
          
          {/* Subtitle */}
          {product.subtitle && (
            <p className="text-[14px] sm:text-[15px] text-white/80 leading-snug">
              {product.subtitle || 'Qualité Premium'}
            </p>
          )}
        </div>
        
        {/* Terrain Vignette - Bottom Left, overlaps content by 12-16px */}
        <div className="absolute bottom-[-12px] left-5 z-[3] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg">
          <div className={cn(
            'relative',
            'w-[56px] h-[56px] sm:w-[72px] sm:h-[72px] lg:w-[84px] lg:h-[84px]',
            'rounded-[16px]',
            'border border-[rgba(255,255,255,0.12)]',
            'bg-[rgba(10,20,16,0.95)]',
            'backdrop-blur-sm',
            'shadow-[0_4px_12px_rgba(0,0,0,0.3)]',
            'overflow-hidden'
          )}>
            {terrainImage ? (
              <Image
                src={terrainImage}
                alt={`${translations.terrainLabel} - ${product.name}`}
                fill
                className="object-cover"
                sizes="92px"
              />
            ) : (
              /* Fallback: Jute texture + icon */
              <div className="absolute inset-0 bg-gradient-to-br from-[#1A2820] to-[#0A1410]">
                <div className="absolute inset-0 opacity-[0.15]" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234A9A62'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='30' cy='20' r='0.8'/%3E%3Ccircle cx='20' cy='30' r='0.9'/%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '40px 40px'
                }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#4A9A62] opacity-40" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          
          {/* Micro-label under vignette */}
          <div className="absolute -bottom-4 left-0 right-0 text-center">
            <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-white/60 font-medium">
              {translations.terrainLabel}
            </span>
          </div>
        </div>
        
        {/* Subtle Labels - Top Left & Top Right */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-[2]">
          {/* EUDR Label - Top Left */}
          {product.eudrReady && (
            <div className={cn(
              'inline-flex items-center gap-1.5',
              'px-2.5 py-1',
              'rounded-full',
              'bg-[rgba(255,255,255,0.06)]',
              'text-[rgba(255,255,255,0.85)]',
              'border border-[rgba(255,255,255,0.08)]',
              'backdrop-blur-sm',
              'text-[11px] sm:text-[12px] font-medium'
            )}>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>EUDR</span>
            </div>
          )}
          
          {/* Availability - Top Right */}
          <div className={cn(
            'inline-flex items-center gap-1.5',
            'px-2.5 py-1',
            'rounded-full',
            'bg-[rgba(255,255,255,0.06)]',
            'text-[rgba(255,255,255,0.85)]',
            'border border-[rgba(255,255,255,0.08)]',
            'backdrop-blur-sm',
            'text-[11px] sm:text-[12px] font-medium'
          )}>
            <span className={cn(
              'w-1.5 h-1.5 rounded-full',
              product.availability === 'in-stock' ? 'bg-[#4A9A62]' : 'bg-[#A89858]'
            )} />
            <span>
              {product.availability === 'in-stock' 
                ? translations.badges.inStock 
                : translations.badges.onRequest}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section - Compact Editorial */}
      <div className="flex-1 flex flex-col p-5 pt-7">
        {/* Description - Max 2 lines */}
        {product.description && (
          <p className="text-[13px] sm:text-[14px] text-[#B0D4B8] leading-relaxed line-clamp-2 mb-4">
            {product.description}
          </p>
        )}
        
        {/* Proofs Row - Text only, no pills */}
        <div className="flex items-center gap-2 mb-4 text-[11px] sm:text-[12px] text-[#80996F]/75 font-medium">
          {product.documents.coa && (
            <>
              <span>{translations.proofs.coa}</span>
              <span>•</span>
            </>
          )}
          {product.documents.chainOfCustody && (
            <>
              <span>{translations.proofs.chainOfCustody}</span>
              <span>•</span>
            </>
          )}
          <span>{translations.proofs.qaDocumented}</span>
        </div>

        {/* Specs Grid - 2 columns, compact */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
          {/* Origin */}
          <div className="flex flex-col gap-0.5">
            <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#80996F]/65 font-semibold">
              {translations.origin}
            </div>
            <div className="text-[13px] sm:text-[14px] font-semibold text-[#E8F5E9] truncate">
              {getOriginDisplay()}
            </div>
          </div>

          {/* MOQ */}
          <div className="flex flex-col gap-0.5">
            <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#80996F]/65 font-semibold">
              {translations.moq}
            </div>
            <div className="text-[13px] sm:text-[14px] font-semibold text-[#E8F5E9]">
              {product.moq.value} {product.moq.unit}
            </div>
          </div>

          {/* Incoterms */}
          <div className="flex flex-col gap-0.5">
            <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#80996F]/65 font-semibold">
              {translations.incoterm}
            </div>
            <div className="text-[13px] sm:text-[14px] font-semibold text-[#E8F5E9] truncate">
              {product.incoterms.slice(0, 2).join(', ')}
            </div>
          </div>

          {/* Packaging */}
          <div className="flex flex-col gap-0.5">
            <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#80996F]/65 font-semibold">
              {translations.packaging}
            </div>
            <div className="text-[13px] sm:text-[14px] font-semibold text-[#E8F5E9] truncate">
              {getPackagingDisplay()}
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />
      </div>

      {/* Actions Section - Dual CTAs */}
      <div className="border-t border-[rgba(255,255,255,0.08)] p-5 bg-[rgba(10,20,16,0.3)]">
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
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Secondary CTA - PDF Download */}
          <button
            onClick={handleDownloadSpec}
            className={cn(
              'w-full inline-flex items-center justify-center gap-2',
              'px-5 py-2.5 min-h-[42px]',
              'rounded-xl font-semibold text-[14px]',
              'bg-transparent text-[#A89858]',
              'border border-[rgba(168,152,88,0.3)]',
              'hover:bg-[rgba(168,152,88,0.1)]',
              'hover:border-[rgba(168,152,88,0.5)]',
              'active:bg-[rgba(168,152,88,0.15)]',
              'focus:outline-none focus:ring-2 focus:ring-[#A89858] focus:ring-offset-2 focus:ring-offset-[#0A1410]',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
            </svg>
            {translations.downloadSpec}
          </button>

          {/* Microproof Trust */}
          <p className="text-[11px] text-center text-[#80996F] font-medium">
            {translations.microproof}
          </p>
        </div>
      </div>
    </article>
  );
};

ProductCardV4.displayName = 'ProductCardV4';
