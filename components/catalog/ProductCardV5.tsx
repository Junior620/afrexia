'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';
import { getProductCardImageUrl } from '@/lib/sanity/image-url';
import { trackQuoteClick, trackSpecClick } from '@/lib/analytics/events';

export interface ProductCardV5Props {
  product: Product;
  locale: 'fr' | 'en';
  translations: ProductCardV5Translations;
  onQuoteClick: () => void;
  onDownloadSpec?: () => void;
  terrainImage?: string;
}

export interface ProductCardV5Translations {
  requestQuote: string;
  downloadSpec: string;
  origin: string;
  moq: string;
  incoterm: string;
  packaging: string;
  microproof: string;
  terrainLabel: string;
  onRequest: string;
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
    certificationsAvailable: string;
  };
  fallback: {
    multiOrigin: string;
  };
}

/**
 * ProductCardV5 - Luxury Export Editorial (Refined)
 * 
 * Improvements over V4:
 * - Stronger scrim gradient (15% top → 70% bottom)
 * - Description limited to 2 lines max (line-clamp-2)
 * - Proofs line BEFORE specs (B2B hierarchy)
 * - Normalized data (no "—", use "Sur demande")
 * - Removed large pin icon (kept terrain vignette only)
 * - Consistent proof display across all cards
 */
export const ProductCardV5: React.FC<ProductCardV5Props> = ({
  product,
  locale,
  translations,
  onQuoteClick,
  onDownloadSpec,
  terrainImage,
}) => {
  const imageUrl = getProductCardImageUrl(product.heroImage);
  const hasImage = imageUrl && imageUrl !== '/assets/placeholder.svg';

  // Category icon for fallback
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

  const getCategoryLabel = () => {
    const labels = translations.categoryLabels;
    return labels[product.category as keyof typeof labels] || product.category;
  };

  const getOriginDisplay = () => {
    if (product.origins && product.origins.length > 0) {
      return product.origins.slice(0, 2).join(', ');
    }
    return translations.fallback.multiOrigin;
  };

  const getPackagingDisplay = () => {
    return product.packaging || translations.onRequest;
  };

  const getMOQDisplay = () => {
    if (product.moq?.value) {
      return `${product.moq.value} ${product.moq.unit}`;
    }
    return translations.onRequest;
  };

  const getIncotermsDisplay = () => {
    if (product.incoterms && product.incoterms.length > 0) {
      // Normalize format: always "FOB, CIF" or "FOB/CIF" - CONSISTENT
      return product.incoterms.slice(0, 3).join(', ');
    }
    return translations.onRequest;
  };

  // Build proofs line
  const getProofsLine = () => {
    const proofs: string[] = [];
    
    if (product.eudrReady) {
      proofs.push('EUDR-ready');
    }
    if (product.qaAvailable || product.documents.coa) {
      proofs.push(translations.proofs.qaDocumented);
    }
    if (product.documents.coa) {
      proofs.push(translations.proofs.coa);
    }
    if (product.documents.chainOfCustody) {
      proofs.push(translations.proofs.chainOfCustody);
    }
    if (product.certifications && product.certifications.length > 0) {
      proofs.push(translations.proofs.certificationsAvailable);
    }
    
    return proofs.length > 0 ? proofs.join(' • ') : translations.proofs.qaDocumented;
  };

  const handleQuoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    trackQuoteClick({
      productId: product.id,
      productName: product.name,
      category: product.category,
      origin: product.origins[0] || 'Unknown',
      availability: product.availability,
      source: 'card-v5-luxury',
    });
    onQuoteClick();
  };

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
        'hover:-translate-y-1',
        'hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
        'hover:border-[rgba(255,255,255,0.12)]',
        'hover:bg-[rgba(26,40,32,0.75)]',
        'focus-within:outline focus-within:outline-2 focus-within:outline-[#A89858] focus-within:outline-offset-2'
      )}
    >
      {/* Media Section - 16:9 ratio (more compact) */}
      <Link 
        href={`/${locale}/products/${product.slug}`}
        className="relative aspect-[16/9] overflow-hidden block group/image"
      >
        {hasImage ? (
          <>
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03] group-hover/image:scale-[1.05]"
              loading="lazy"
              quality={80}
            />
            
            {/* Premium Editorial Gradient - CONSTANT across all cards (adjusted for readability) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
            
            {/* Subtle vignette for editorial depth */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_50%,rgba(0,0,0,0.15)_100%)]" />
            
            {/* Subtle film grain */}
            <div 
              className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A2820] via-[#0F1814] to-[#0A1410]">
            <div className="absolute inset-0 opacity-[0.12]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234A9A62' fill-opacity='1'%3E%3Ccircle cx='10' cy='10' r='1.5'/%3E%3Ccircle cx='30' cy='20' r='1.2'/%3E%3Ccircle cx='50' cy='15' r='1.3'/%3E%3Ccircle cx='20' cy='40' r='1.4'/%3E%3Ccircle cx='45' cy='45' r='1.1'/%3E%3Ccircle cx='15' cy='55' r='1.3'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              {getCategoryIcon()}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
          </div>
        )}
        
        {/* Product Info Overlay - Bottom Left (with padding for vignette) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-4 pl-[72px] sm:pl-[80px] lg:pl-[88px] z-[2]">
          {/* Category smallcaps with text shadow */}
          <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-white/80 font-semibold mb-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
            {getCategoryLabel()}
          </div>
          
          {/* Product name - Large editorial with text shadow for readability */}
          <h3 className="text-[20px] sm:text-[24px] lg:text-[28px] font-semibold leading-[1.1] text-white mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {product.name}
          </h3>
          
          {/* Subtitle - STRICT 1 LINE MAX (luxury = respiration) */}
          {product.subtitle && (
            <p className="text-[12px] sm:text-[13px] text-white/90 leading-snug line-clamp-1 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
              {product.subtitle}
            </p>
          )}
        </div>
        
        {/* Terrain Vignette - Drapeau pays d'origine */}
        <div className="absolute bottom-3 left-4 z-[3] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg">
          <div className={cn(
            'relative',
            'w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] lg:w-[48px] lg:h-[48px]',
            'rounded-[10px]',
            'border border-[rgba(255,255,255,0.10)]',
            'bg-[rgba(10,20,16,0.95)]',
            'backdrop-blur-sm',
            'shadow-[0_4px_16px_rgba(0,0,0,0.4)]',
            'overflow-hidden'
          )}>
            {terrainImage ? (
              <Image
                src={terrainImage}
                alt={`${translations.terrainLabel} - ${product.name}`}
                fill
                className="object-cover"
                sizes="88px"
              />
            ) : (
              /* Fallback: Drapeau Cameroun (vert-rouge-jaune avec étoile) */
              <div className="absolute inset-0 bg-gradient-to-br from-[#2A3A30] to-[#1A2820] flex items-center justify-center">
                {/* Drapeau Cameroun simplifié */}
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 48 48" fill="none">
                    {/* Bandes verticales */}
                    <rect x="0" y="0" width="16" height="48" fill="#007A3D" />
                    <rect x="16" y="0" width="16" height="48" fill="#CE1126" />
                    <rect x="32" y="0" width="16" height="48" fill="#FCD116" />
                    {/* Étoile jaune au centre */}
                    <path 
                      d="M24 14L25.545 19.382H31.18L26.818 22.618L28.363 28L24 24.764L19.637 28L21.182 22.618L16.82 19.382H22.455L24 14Z" 
                      fill="#FCD116"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
          
          {/* Micro-label - Editorial style (removed, takes too much space) */}
        </div>
        
        {/* Subtle Labels - Top (NORMALIZED) */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-[2]">
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
              <span>EUDR-ready</span>
            </div>
          )}
          
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
      </Link>

      {/* Actions Section */}
      <div className="border-t border-[rgba(255,255,255,0.08)] p-4 bg-[rgba(10,20,16,0.3)]">
        <div className="flex flex-col gap-3">
          <button
            onClick={handleQuoteClick}
            className={cn(
              'w-full inline-flex items-center justify-center gap-2',
              'px-4 py-2.5 min-h-[42px]',
              'rounded-xl font-semibold text-[14px]',
              'bg-[#4A9A62] text-white',
              'hover:bg-[#5AAA72]',
              'active:bg-[#3A8A52]',
              'focus:outline-none focus:ring-2 focus:ring-[#A89858] focus:ring-offset-2 focus:ring-offset-[#0A1410]',
              'transition-all duration-200',
              'shadow-sm hover:shadow-md'
            )}
          >
            {translations.requestQuote}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Lien discret pour fiche technique - Style luxury editorial */}
          <button
            onClick={handleDownloadSpec}
            className={cn(
              'w-full inline-flex items-center justify-center gap-1.5',
              'py-2',
              'text-[12px] font-medium',
              'text-[#A89858]/80',
              'hover:text-[#A89858]',
              'focus:outline-none focus:ring-2 focus:ring-[#A89858] focus:ring-offset-2 focus:ring-offset-[#0A1410]',
              'transition-all duration-200',
              'rounded-lg'
            )}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
            </svg>
            <span className="underline decoration-[#A89858]/30 hover:decoration-[#A89858]/60 underline-offset-2">
              {translations.downloadSpec}
            </span>
          </button>

          <p className="text-[10px] text-center text-[#80996F] font-medium">
            {translations.microproof}
          </p>
        </div>
      </div>
    </article>
  );
};

ProductCardV5.displayName = 'ProductCardV5';
