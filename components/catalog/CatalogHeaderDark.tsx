'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ButtonDark } from '@/components/ui/ButtonDark';
import { TrustStripDark } from './TrustStripDark';
import { getDefaultTrustItemsDark } from './TrustStripDarkHelpers';

export interface CatalogHeaderDarkProps {
  locale: 'fr' | 'en';
  translations: {
    heading: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trust: {
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
  onRequestQuote: () => void;
  onDownloadCatalog: () => void;
  className?: string;
}

/**
 * CatalogHeaderDark component - Dark Premium Theme
 * 
 * Header premium dark avec messaging B2B clair et CTAs visibles.
 * 
 * Visual Specifications:
 * - Background: linear-gradient(180deg, #0A1410 0%, #1A2820 100%)
 * - Max height: 30vh desktop, 40vh mobile
 * - Padding: 64px vertical desktop, 48px mobile
 * - H1: 56px desktop / 44px mobile, color: #4A9A62, bold
 * - Subtitle: 18px, color: #B0D4B8, max-width: 800px, center-aligned
 * - Trust strip: Horizontal flex, gap 32px desktop / 16px mobile
 * - CTAs: Flex row, gap 16px, center-aligned
 * 
 * Layout:
 * ┌────────────────────────────────────────────────────────┐
 * │                                                        │
 * │              Catalogue Produits                        │ ← H1 (56px, green)
 * │                                                        │
 * │  Cacao, café & commodités africaines — QA documentée, │ ← Subtitle (18px)
 * │        traçabilité prête pour audit.                   │
 * │                                                        │
 * │  [24h] [NDA] [EUDR] [QA] [COA]                       │ ← Trust strip
 * │                                                        │
 * │  [Demander un devis]  [Télécharger le catalogue]     │ ← CTAs
 * │                                                        │
 * └────────────────────────────────────────────────────────┘
 * 
 * Requirements: 2.1-2.7
 */
export const CatalogHeaderDark: React.FC<CatalogHeaderDarkProps> = ({
  locale,
  translations,
  onRequestQuote,
  onDownloadCatalog,
  className,
}) => {
  // Build trust items with translations
  const trustItems = React.useMemo(() => {
    return getDefaultTrustItemsDark(translations.trust);
  }, [translations.trust]);

  const containerClasses = cn(
    'w-full',
    'bg-gradient-to-b from-[#0A1410] to-[#1A2820]',
    'py-8 md:py-10 px-4 md:px-6', // Réduit de 12/16 à 8/10
    className
  );

  const contentClasses = cn(
    'max-w-7xl mx-auto',
    'flex flex-col items-center text-center',
    'space-y-3 md:space-y-4' // Réduit de 4/6 à 3/4
  );

  const headingClasses = cn(
    'text-[2.25rem] md:text-[2.75rem]', // Réduit: 36px mobile, 44px desktop (vs 44/56)
    'font-bold',
    'text-[#4A9A62]',
    'leading-tight'
  );

  const subtitleClasses = cn(
    'text-base md:text-lg', // 16px mobile, 18px desktop
    'text-[#B0D4B8]',
    'max-w-[700px]', // Réduit de 800 à 700
    'leading-snug' // Plus compact
  );

  const ctaContainerClasses = cn(
    'flex flex-col sm:flex-row items-center justify-center',
    'gap-4',
    'w-full sm:w-auto'
  );

  // Download icon for secondary CTA
  const downloadIcon = (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
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
        <TrustStripDark
          items={trustItems}
          variant="compact"
          className="justify-center"
        />

        {/* CTAs */}
        <div className={ctaContainerClasses}>
          <ButtonDark
            variant="primary"
            size="lg"
            onClick={onRequestQuote}
            className="w-full sm:w-auto"
            aria-label={translations.ctaPrimary}
          >
            {translations.ctaPrimary}
          </ButtonDark>

          <ButtonDark
            variant="secondary"
            size="lg"
            icon={downloadIcon}
            iconPosition="left"
            onClick={onDownloadCatalog}
            className="w-full sm:w-auto"
            aria-label={translations.ctaSecondary}
          >
            {translations.ctaSecondary}
          </ButtonDark>
        </div>
      </div>
    </header>
  );
};

CatalogHeaderDark.displayName = 'CatalogHeaderDark';
