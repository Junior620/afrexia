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
    'relative w-full overflow-hidden',
    'min-h-[45vh] md:min-h-[50vh]', // Hauteur réduite
    'flex items-center justify-center',
    'py-12 md:py-16 px-4 md:px-6',
    className
  );

  const contentClasses = cn(
    'relative z-10', // Au-dessus de l'image de fond
    'max-w-7xl mx-auto',
    'flex flex-col items-center text-center',
    'space-y-6 md:space-y-8'
  );

  const headingClasses = cn(
    'text-4xl md:text-5xl lg:text-6xl', // Tailles augmentées
    'font-bold',
    'text-[#4A9A62]',
    'leading-tight',
    'drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]' // Ombre pour lisibilité
  );

  const subtitleClasses = cn(
    'text-lg md:text-xl', // Tailles augmentées
    'text-[#B0D4B8]',
    'max-w-[800px]',
    'leading-relaxed',
    'drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]' // Ombre pour lisibilité
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
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/terrain-cocoa-cameroon.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Dark overlay gradient pour lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1410]/85 via-[#0A1410]/90 to-[#0A1410]/95" />
        {/* Vignette pour profondeur */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
        {/* Film grain subtil */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Animated Background Particles */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {/* Pulse particles */}
        <div className="absolute top-[15%] left-[10%] w-32 h-32 bg-[#4A9A62]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-[25%] right-[15%] w-40 h-40 bg-[#4A9A62]/8 rounded-full blur-3xl animate-pulse-delayed-1" />
        <div className="absolute bottom-[20%] left-[20%] w-36 h-36 bg-[#4A9A62]/12 rounded-full blur-3xl animate-pulse-delayed-2" />
        <div className="absolute bottom-[30%] right-[10%] w-28 h-28 bg-[#4A9A62]/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Floating Decorative Circles */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[5%] w-3 h-3 border-2 border-[#4A9A62]/30 rounded-full animate-bounce" />
        <div className="absolute top-[40%] right-[8%] w-2 h-2 border-2 border-[#4A9A62]/40 rounded-full animate-bounce-delayed-1" />
        <div className="absolute bottom-[25%] left-[12%] w-2.5 h-2.5 border-2 border-[#4A9A62]/35 rounded-full animate-bounce-delayed-2" />
        <div className="absolute bottom-[35%] right-[15%] w-3 h-3 border-2 border-[#4A9A62]/30 rounded-full animate-bounce" />
      </div>

      {/* Decorative Lines */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {/* Top line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4A9A62]/30 to-transparent animate-fadeInUp" />
        {/* Bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4A9A62]/30 to-transparent animate-fadeInUp-delayed-1" />
      </div>

      <div className={contentClasses}>
        {/* Heading */}
        <h1 className={cn(headingClasses, 'animate-fadeInUp')}>
          {translations.heading}
        </h1>

        {/* Subtitle */}
        <p className={cn(subtitleClasses, 'animate-fadeInUp-delayed-1')}>
          {translations.subtitle}
        </p>

        {/* Trust Strip */}
        <div className="animate-fadeInUp-delayed-2">
          <TrustStripDark
            items={trustItems}
            variant="compact"
            className="justify-center"
          />
        </div>

        {/* CTAs */}
        <div className={cn(ctaContainerClasses, 'animate-scaleIn-delayed-2')}>
          <ButtonDark
            variant="primary"
            size="lg"
            onClick={onRequestQuote}
            className="w-full sm:w-auto relative overflow-hidden group"
            aria-label={translations.ctaPrimary}
          >
            <span className="relative z-10">{translations.ctaPrimary}</span>
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </ButtonDark>

          <ButtonDark
            variant="secondary"
            size="lg"
            icon={downloadIcon}
            iconPosition="left"
            onClick={onDownloadCatalog}
            className="w-full sm:w-auto relative group"
            aria-label={translations.ctaSecondary}
          >
            <span className="relative z-10 flex items-center gap-2">
              {downloadIcon}
              {translations.ctaSecondary}
            </span>
            {/* Border glow on hover */}
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_15px_rgba(74,154,98,0.5)]" />
          </ButtonDark>
        </div>
      </div>
    </header>
  );
};

CatalogHeaderDark.displayName = 'CatalogHeaderDark';
