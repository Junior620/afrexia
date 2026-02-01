'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';
import { Badge, AvailabilityBadge, EUDRBadge, CertificationBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { trackProductCardCTAClick, trackProductCardSpecClick } from '@/lib/analytics';
import { getProductCardImageUrl } from '@/lib/sanity/image-url';

export interface ProductCardProps {
  product: Product;
  locale: string;
  translations: ProductCardTranslations;
  variant?: 'traceability-first' | 'luxury-editorial';
  onQuoteClick: () => void;
  onQuickView: () => void;
}

export interface ProductCardTranslations {
  requestQuote: string;
  requestQuoteWithDocs?: string;
  viewSpecs: string;
  quickView: string;
  origin: string;
  moq: string;
  incoterm: string;
  documents: {
    coa: string;
    specSheet: string;
    chainOfCustody: string;
  };
}

/**
 * ProductCard Component (v2)
 * Enhanced product card with improved readability, quick specs, and clear CTAs
 * 
 * Features:
 * - Media section with gradient overlay and badges
 * - Content section with product info and quick specs
 * - Actions section with primary/secondary CTAs
 * - Two variants: traceability-first and luxury-editorial
 * - Hover effects with elevation and shadow
 * 
 * Requirements: 3.1-3.14
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  locale,
  translations,
  variant = 'traceability-first',
  onQuoteClick,
  onQuickView,
}) => {
  const isLuxury = variant === 'luxury-editorial';
  const isTraceability = variant === 'traceability-first';

  // Build optimized image URL from Sanity image with CDN optimization
  const imageUrl = getProductCardImageUrl(product.heroImage);
  const imageAlt = `${product.name} - ${product.category}`;

  // Primary CTA text based on variant
  const primaryCTAText = isTraceability && translations.requestQuoteWithDocs
    ? translations.requestQuoteWithDocs
    : translations.requestQuote;

  // Handle quote button click with analytics
  const handleQuoteClick = () => {
    trackProductCardCTAClick({
      productId: product.id,
      productName: product.name,
      category: product.category,
      origin: product.origins[0] || 'Unknown',
      availability: product.availability,
    });
    onQuoteClick();
  };

  // Handle spec link click with analytics
  const handleSpecClick = () => {
    trackProductCardSpecClick({
      productId: product.id,
      productName: product.name,
      category: product.category,
    });
  };

  // Handle card hover for prefetching
  const handleCardHover = useCallback(() => {
    // Prefetch the product detail page on hover
    // Next.js Link component with prefetch prop will handle this automatically
    // This improves perceived performance when user clicks through
  }, []);

  // Card styling based on variant
  const cardClasses = cn(
    'group relative bg-white overflow-hidden',
    'transition-all duration-300 ease-in-out',
    'min-h-[480px] flex flex-col',
    {
      // Luxury variant
      'rounded-[24px] md:rounded-[28px]': isLuxury,
      'shadow-md hover:shadow-2xl hover:-translate-y-1': isLuxury,
      'hover:ring-2 hover:ring-accent/30': isLuxury, // Gold accent on hover
      
      // Traceability variant
      'rounded-2xl': isTraceability,
      'shadow-sm border border-black/8 hover:shadow-xl': isTraceability,
    }
  );

  return (
    <article className={cardClasses} onMouseEnter={handleCardHover}>
      {/* Media Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Product Image */}
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          loading="lazy" // Lazy loading for non-critical images
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={false}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Badge Group - Top Right */}
        <div className={cn('absolute top-3 right-3 flex flex-col gap-2 z-10', {
          'gap-2.5': isTraceability, // Larger gap for traceability variant
        })}>
          {/* Availability Badge */}
          <div className={cn({
            'scale-110': isTraceability, // Larger badges for traceability
          })}>
            <AvailabilityBadge
              status={product.availability}
              label={getAvailabilityLabel(product.availability, locale)}
            />
          </div>
          
          {/* EUDR Badge - Prominent in traceability variant */}
          {product.eudrReady && (
            <div className={cn({
              'scale-110': isTraceability,
            })}>
              <EUDRBadge label={getEUDRLabel(locale)} />
            </div>
          )}
          
          {/* Certification Badges - More visible in traceability variant */}
          {product.certifications.slice(0, isTraceability ? 2 : 1).map((certId) => (
            <div
              key={certId}
              className={cn({
                'scale-110': isTraceability,
              })}
            >
              <CertificationBadge
                label={getCertificationLabel(certId, locale)}
              />
            </div>
          ))}
        </div>

        {/* Quick View Button - Top Left on hover */}
        <button
          onClick={onQuickView}
          className="absolute top-3 left-3 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label={`${translations.quickView} - ${product.name}`}
          title={translations.quickView}
        >
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
      </div>

      {/* Content Section */}
      <div className={cn('flex-1 flex flex-col', {
        'p-6': isLuxury,
        'p-5': isTraceability,
      })}>
        {/* Product Header */}
        <div className="mb-4">
          <h3 className={cn('font-bold leading-tight line-clamp-2', {
            'text-[22px]': isLuxury,
            'font-serif': isLuxury, // Optional serif typography for luxury
            'text-[20px]': isTraceability,
          })}>
            {product.name}
          </h3>
          {product.subtitle && (
            <p className={cn('text-sm mt-1 line-clamp-1', {
              'text-gray-500': isLuxury,
              'text-gray-600': isTraceability,
            })}>
              {product.subtitle}
            </p>
          )}
        </div>

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Origin */}
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-primary flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500">{translations.origin}</div>
              <div className="text-sm font-semibold text-gray-900 truncate">
                {product.origins[0] || '—'}
              </div>
            </div>
          </div>

          {/* MOQ */}
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-primary flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500">{translations.moq}</div>
              <div className="text-sm font-semibold text-gray-900 truncate">
                {product.moq.value} {product.moq.unit}
              </div>
            </div>
          </div>

          {/* Incoterm */}
          <div className="flex items-start gap-2 col-span-2">
            <svg
              className="w-4 h-4 text-primary flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
            </svg>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500">{translations.incoterm}</div>
              <div className="text-sm font-semibold text-gray-900 truncate">
                {product.incoterms.join(', ')}
              </div>
            </div>
          </div>
        </div>

        {/* Document Indicators */}
        {(product.documents.coa || product.documents.specSheet || product.documents.chainOfCustody) && (
          <div className={cn('flex items-center gap-2 mb-4', {
            'gap-3': isTraceability,
          })}>
            {product.documents.coa && (
              <div
                className="flex items-center gap-1 text-xs text-gray-600"
                title={translations.documents.coa}
              >
                <svg
                  className={cn('flex-shrink-0', {
                    'w-5 h-5 text-success': isTraceability,
                    'w-4 h-4': isLuxury,
                  })}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                    clipRule="evenodd"
                  />
                </svg>
                {isTraceability && <span className="font-medium">COA</span>}
              </div>
            )}
            
            {product.documents.specSheet && (
              <div
                className="flex items-center gap-1 text-xs text-gray-600"
                title={translations.documents.specSheet}
              >
                <svg
                  className={cn('flex-shrink-0', {
                    'w-5 h-5 text-success': isTraceability,
                    'w-4 h-4': isLuxury,
                  })}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
                {isTraceability && <span className="font-medium">Spec</span>}
              </div>
            )}
            
            {product.documents.chainOfCustody && (
              <div
                className="flex items-center gap-1 text-xs text-gray-600"
                title={translations.documents.chainOfCustody}
              >
                <svg
                  className={cn('flex-shrink-0', {
                    'w-5 h-5 text-success': isTraceability,
                    'w-4 h-4': isLuxury,
                  })}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                    clipRule="evenodd"
                  />
                </svg>
                {isTraceability && <span className="font-medium">Chain</span>}
              </div>
            )}
          </div>
        )}

        {/* Spacer to push actions to bottom */}
        <div className="flex-1" />
      </div>

      {/* Actions Section */}
      <div className={cn('border-t border-black/8', {
        'p-6 pt-4': isLuxury,
        'p-5 pt-4': isTraceability,
      })}>
        <div className="flex flex-col gap-3">
          {/* Primary CTA */}
          <Button
            variant="primary"
            onClick={handleQuoteClick}
            className={cn('w-full', {
              'hover:shadow-lg hover:shadow-accent/20 hover:ring-2 hover:ring-accent/50': isLuxury,
            })}
          >
            {primaryCTAText}
          </Button>

          {/* Secondary CTA */}
          <Link
            href={`/${locale}/products/${product.slug}`}
            prefetch={true}
            onClick={handleSpecClick}
            className={cn(
              'text-center text-sm font-semibold transition-colors',
              'hover:text-primary focus:outline-none focus:underline',
              {
                'text-gray-700': isTraceability,
                'text-gray-600 hover:text-accent': isLuxury, // Gold accent on hover for luxury
              }
            )}
          >
            {translations.viewSpecs} →
          </Link>
        </div>
      </div>
    </article>
  );
};

// Helper functions for labels
function getAvailabilityLabel(status: string, locale: string): string {
  const labels: Record<string, Record<string, string>> = {
    'in-stock': {
      fr: 'En stock',
      en: 'In Stock',
      es: 'En existencia',
      de: 'Auf Lager',
      ru: 'В наличии',
    },
    limited: {
      fr: 'Stock limité',
      en: 'Limited Stock',
      es: 'Stock limitado',
      de: 'Begrenzter Vorrat',
      ru: 'Ограниченный запас',
    },
    'pre-order': {
      fr: 'Précommande',
      en: 'Pre-order',
      es: 'Pedido anticipado',
      de: 'Vorbestellung',
      ru: 'Предзаказ',
    },
  };

  return labels[status]?.[locale] || labels[status]?.en || status;
}

function getEUDRLabel(locale: string): string {
  return 'EUDR Ready'; // Same in all languages
}

function getCertificationLabel(certId: string, locale: string): string {
  // This would typically come from a certifications lookup
  // For now, return the ID formatted
  return certId.charAt(0).toUpperCase() + certId.slice(1);
}
