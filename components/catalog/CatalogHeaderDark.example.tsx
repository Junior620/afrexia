/**
 * CatalogHeaderDark Example Usage
 * 
 * This file demonstrates how to use the CatalogHeaderDark component
 * with proper translations and event handlers.
 */

import React from 'react';
import { CatalogHeaderDark } from './CatalogHeaderDark';

// Example with French translations
export function CatalogHeaderDarkExampleFR() {
  const handleRequestQuote = () => {
    console.log('Request quote clicked');
    // Open RFQ drawer or navigate to RFQ page
  };

  const handleDownloadCatalog = () => {
    console.log('Download catalog clicked');
    // Trigger PDF download or open download modal
  };

  return (
    <CatalogHeaderDark
      locale="fr"
      translations={{
        heading: 'Catalogue Produits',
        subtitle: 'Cacao, café & commodités africaines — QA documentée, traçabilité prête pour audit.',
        ctaPrimary: 'Demander un devis',
        ctaSecondary: 'Télécharger le catalogue (PDF)',
        trust: {
          response24h: '24h',
          response24hTooltip: 'Réponse sous 24 heures',
          ndaAvailable: 'NDA',
          ndaAvailableTooltip: 'NDA disponible sur demande',
          eudrCompliant: 'EUDR',
          eudrCompliantTooltip: 'Conforme EUDR',
          qaDocumented: 'QA',
          qaDocumentedTooltip: 'Documentation QA complète',
          coaAvailable: 'COA',
          coaAvailableTooltip: 'COA & fiches techniques disponibles',
        },
      }}
      onRequestQuote={handleRequestQuote}
      onDownloadCatalog={handleDownloadCatalog}
    />
  );
}

// Example with English translations
export function CatalogHeaderDarkExampleEN() {
  const handleRequestQuote = () => {
    console.log('Request quote clicked');
    // Open RFQ drawer or navigate to RFQ page
  };

  const handleDownloadCatalog = () => {
    console.log('Download catalog clicked');
    // Trigger PDF download or open download modal
  };

  return (
    <CatalogHeaderDark
      locale="en"
      translations={{
        heading: 'Product Catalog',
        subtitle: 'Cocoa, coffee & African commodities — Documented QA, audit-ready traceability.',
        ctaPrimary: 'Request a Quote',
        ctaSecondary: 'Download Catalog (PDF)',
        trust: {
          response24h: '24h',
          response24hTooltip: '24h response time',
          ndaAvailable: 'NDA',
          ndaAvailableTooltip: 'NDA available upon request',
          eudrCompliant: 'EUDR',
          eudrCompliantTooltip: 'EUDR compliant',
          qaDocumented: 'QA',
          qaDocumentedTooltip: 'Comprehensive QA documentation',
          coaAvailable: 'COA',
          coaAvailableTooltip: 'COA & spec sheets available',
        },
      }}
      onRequestQuote={handleRequestQuote}
      onDownloadCatalog={handleDownloadCatalog}
    />
  );
}

// Example with translations from i18n system
export function CatalogHeaderDarkExampleWithI18n() {
  const locale = 'fr'; // or 'en' from router/context
  
  // In a real app, you would get these from your i18n system
  // import { getTranslations } from '@/lib/i18n/translations';
  // const t = getTranslations(locale);
  
  const translations = {
    fr: {
      heading: 'Catalogue Produits',
      subtitle: 'Cacao, café & commodités africaines — QA documentée, traçabilité prête pour audit.',
      ctaPrimary: 'Demander un devis',
      ctaSecondary: 'Télécharger le catalogue (PDF)',
      trust: {
        response24h: '24h',
        response24hTooltip: 'Réponse sous 24 heures',
        ndaAvailable: 'NDA',
        ndaAvailableTooltip: 'NDA disponible sur demande',
        eudrCompliant: 'EUDR',
        eudrCompliantTooltip: 'Conforme EUDR',
        qaDocumented: 'QA',
        qaDocumentedTooltip: 'Documentation QA complète',
        coaAvailable: 'COA',
        coaAvailableTooltip: 'COA & fiches techniques disponibles',
      },
    },
    en: {
      heading: 'Product Catalog',
      subtitle: 'Cocoa, coffee & African commodities — Documented QA, audit-ready traceability.',
      ctaPrimary: 'Request a Quote',
      ctaSecondary: 'Download Catalog (PDF)',
      trust: {
        response24h: '24h',
        response24hTooltip: '24h response time',
        ndaAvailable: 'NDA',
        ndaAvailableTooltip: 'NDA available upon request',
        eudrCompliant: 'EUDR',
        eudrCompliantTooltip: 'EUDR compliant',
        qaDocumented: 'QA',
        qaDocumentedTooltip: 'Comprehensive QA documentation',
        coaAvailable: 'COA',
        coaAvailableTooltip: 'COA & spec sheets available',
      },
    },
  };

  const handleRequestQuote = () => {
    console.log('Request quote clicked');
  };

  const handleDownloadCatalog = () => {
    console.log('Download catalog clicked');
  };

  return (
    <CatalogHeaderDark
      locale={locale}
      translations={translations[locale]}
      onRequestQuote={handleRequestQuote}
      onDownloadCatalog={handleDownloadCatalog}
    />
  );
}
