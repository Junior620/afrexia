'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { TrustStrip, getDefaultTrustItems, TrustItem } from './TrustStrip';

export interface CatalogHeaderProps {
  locale: string;
  translations: {
    heading: string;
    subtitle: string;
    downloadCatalogCTA: string;
    trustStrip: {
      response24h: string;
      response24hTooltip?: string;
      ndaAvailable: string;
      ndaAvailableTooltip?: string;
      eudrCompliant: string;
      eudrCompliantTooltip?: string;
      qaDocumented: string;
      qaDocumentedTooltip?: string;
      coaAvailable: string;
      coaAvailableTooltip?: string;
    };
  };
  onDownloadCatalog: () => void;
  className?: string;
}

/**
 * CatalogHeader component - Compact header section with page title, subtitle, and trust indicators
 * 
 * Visual Specifications:
 * - Max height: 20vh (viewport height)
 * - Background: Subtle gradient or solid color matching brand
 * - Padding: 48px vertical, 24px horizontal (desktop), 32px vertical, 16px horizontal (mobile)
 * - H1: 36-42px font size, bold weight, dark green (#194424) or charcoal
 * - Subtitle: 16-18px font size, regular weight, 60% opacity
 * - Trust strip: Horizontal row of icons + text, 14px font size
 * 
 * Layout:
 * ┌────────────────────────────────────────────┐
 * │  Notre Catalogue de Produits              │ ← H1
 * │  Cacao, café et produits agricoles...     │ ← Subtitle
 * │                                            │
 * │  [24h] [NDA] [EUDR] [QA] [COA]           │ ← Trust strip
 * │                                            │
 * │  [Télécharger le catalogue PDF]           │ ← CTA button
 * └────────────────────────────────────────────┘
 * 
 * Requirements: 1.1, 6.1-6.5, 8.6
 */
export const CatalogHeader: React.FC<CatalogHeaderProps> = ({
  locale,
  translations,
  onDownloadCatalog,
  className,
}) => {
  // Build trust items with tooltips
  const trustItems: TrustItem[] = React.useMemo(() => {
    return getDefaultTrustItems({
      response24h: translations.trustStrip.response24h,
      ndaAvailable: translations.trustStrip.ndaAvailable,
      eudrCompliant: translations.trustStrip.eudrCompliant,
      qaDocumented: translations.trustStrip.qaDocumented,
      coaAvailable: translations.trustStrip.coaAvailable,
    }).map((item, index) => {
      // Add tooltips if available
      const tooltipKeys = [
        'response24hTooltip',
        'ndaAvailableTooltip',
        'eudrCompliantTooltip',
        'qaDocumentedTooltip',
        'coaAvailableTooltip',
      ] as const;
      
      const tooltipKey = tooltipKeys[index];
      const tooltip = translations.trustStrip[tooltipKey];
      
      return {
        ...item,
        tooltip: tooltip || item.label,
      };
    });
  }, [translations.trustStrip]);

  const containerClasses = cn(
    'w-full max-h-[20vh]',
    'bg-gradient-to-b from-light/30 to-transparent dark:from-dark-bg-secondary/30',
    'py-8 md:py-12 px-4 md:px-6',
    className
  );

  const contentClasses = cn(
    'max-w-7xl mx-auto',
    'flex flex-col items-center text-center',
    'space-y-4 md:space-y-6'
  );

  const headingClasses = cn(
    'text-3xl md:text-4xl lg:text-5xl',
    'font-bold',
    'text-primary dark:text-dark-primary',
    'leading-tight'
  );

  const subtitleClasses = cn(
    'text-base md:text-lg',
    'text-primary/60 dark:text-dark-text-secondary',
    'max-w-3xl'
  );

  const downloadIcon = (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );

  return (
    <header className={containerClasses} role="banner">
      <div className={contentClasses}>
        {/* Heading */}
        <h1 className={headingClasses}>
          {translations.heading}
        </h1>

        {/* Subtitle */}
        <p className={subtitleClasses}>
          {translations.subtitle}
        </p>

        {/* Trust Strip */}
        <TrustStrip
          items={trustItems}
          variant="compact"
          className="justify-center"
        />

        {/* Download CTA */}
        <Button
          variant="primary"
          icon={downloadIcon}
          iconPosition="left"
          onClick={onDownloadCatalog}
          className="mt-2"
          aria-label={translations.downloadCatalogCTA}
        >
          {translations.downloadCatalogCTA}
        </Button>
      </div>
    </header>
  );
};

CatalogHeader.displayName = 'CatalogHeader';
