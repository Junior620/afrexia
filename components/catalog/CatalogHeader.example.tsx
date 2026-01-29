/**
 * Example usage of CatalogHeader component
 * This file demonstrates how to use the CatalogHeader in a page
 */

import { CatalogHeader } from './CatalogHeader';

// Example with French translations
export function CatalogHeaderFrenchExample() {
  const handleDownload = () => {
    console.log('Download catalog clicked');
    // Implement download logic
  };

  return (
    <CatalogHeader
      locale="fr"
      translations={{
        heading: 'Notre Catalogue de Produits',
        subtitle: 'Cacao, café et produits agricoles premium d\'Afrique avec traçabilité complète et conformité RDUE',
        downloadCatalogCTA: 'Télécharger le catalogue PDF',
        trustStrip: {
          response24h: 'Réponse sous 24h',
          response24hTooltip: 'Nous répondons à toutes les demandes dans les 24 heures ouvrables',
          ndaAvailable: 'NDA disponible',
          ndaAvailableTooltip: 'Accord de confidentialité disponible sur demande',
          eudrCompliant: 'Conforme RDUE',
          eudrCompliantTooltip: 'Tous nos produits respectent le Règlement de l\'UE sur la Déforestation',
          qaDocumented: 'Documentation QA',
          qaDocumentedTooltip: 'Assurance qualité complète et documentation de test',
          coaAvailable: 'COA & fiches techniques',
          coaAvailableTooltip: 'Certificats d\'analyse et fiches techniques disponibles',
        },
      }}
      onDownloadCatalog={handleDownload}
    />
  );
}

// Example with English translations
export function CatalogHeaderEnglishExample() {
  const handleDownload = () => {
    console.log('Download catalog clicked');
    // Implement download logic
  };

  return (
    <CatalogHeader
      locale="en"
      translations={{
        heading: 'Our Product Catalog',
        subtitle: 'Premium cocoa, coffee, and agricultural products from Africa with full traceability and EUDR compliance',
        downloadCatalogCTA: 'Download PDF Catalog',
        trustStrip: {
          response24h: '24h Response',
          response24hTooltip: 'We respond to all inquiries within 24 business hours',
          ndaAvailable: 'NDA Available',
          ndaAvailableTooltip: 'Non-disclosure agreement available upon request',
          eudrCompliant: 'EUDR Compliant',
          eudrCompliantTooltip: 'All our products comply with EU Deforestation Regulation',
          qaDocumented: 'QA Documented',
          qaDocumentedTooltip: 'Complete quality assurance and testing documentation',
          coaAvailable: 'COA & Spec Sheets',
          coaAvailableTooltip: 'Certificates of Analysis and specification sheets available',
        },
      }}
      onDownloadCatalog={handleDownload}
    />
  );
}

// Example with custom styling
export function CatalogHeaderCustomExample() {
  const handleDownload = () => {
    console.log('Download catalog clicked');
  };

  return (
    <CatalogHeader
      locale="en"
      translations={{
        heading: 'Our Product Catalog',
        subtitle: 'Premium cocoa, coffee, and agricultural products from Africa with full traceability and EUDR compliance',
        downloadCatalogCTA: 'Download PDF Catalog',
        trustStrip: {
          response24h: '24h Response',
          ndaAvailable: 'NDA Available',
          eudrCompliant: 'EUDR Compliant',
          qaDocumented: 'QA Documented',
          coaAvailable: 'COA & Spec Sheets',
        },
      }}
      onDownloadCatalog={handleDownload}
      className="bg-sand/20"
    />
  );
}
