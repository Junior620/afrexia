import { Locale } from '@/types';

/**
 * Catalog Dark Premium Redesign Translations
 * Complete translations for FR and EN with fallback support
 * Requirements: 7.1-7.7
 */

export interface CatalogDarkTranslations {
  header: {
    heading: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  filters: {
    search: string;
    searchPlaceholder: string;
    category: string;
    categoryPlaceholder: string;
    origin: string;
    originPlaceholder: string;
    availability: string;
    availabilityPlaceholder: string;
    certifications: string;
    certificationsPlaceholder: string;
    incoterms: string;
    incotermsPlaceholder: string;
    moq: string;
    clearAll: string;
    showFilters: string;
    activeFilters: string;
  };
  sort: {
    label: string;
    relevance: string;
    availability: string;
    moq: string;
    origin: string;
  };
  availability: {
    'in-stock': string;
    'limited': string;
    'pre-order': string;
  };
  product: {
    requestQuote: string;
    viewSpecs: string;
    downloadSpec: string;
    origin: string;
    moq: string;
    incoterm: string;
    packaging: string;
    microproof: string;
    terrainLabel: string;
  };
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
  proofs: {
    coa: string;
    chainOfCustody: string;
    qaDocumented: string;
  };
  fallback: {
    comingSoon: string;
    multiOrigin: string;
    toSpecify: string;
  };
  trust: {
    response24h: string;
    response24hTooltip: string;
    ndaAvailable: string;
    ndaAvailableTooltip: string;
    eudrCompliant: string;
    eudrCompliantTooltip: string;
    qaDocumented: string;
    qaDocumentedTooltip: string;
    coaAvailable: string;
    coaAvailableTooltip: string;
  };
  rfq: {
    title: string;
    close: string;
    productLabel: string;
    fields: {
      quantity: string;
      quantityPlaceholder: string;
      incoterm: string;
      incotermPlaceholder: string;
      destination: string;
      destinationPlaceholder: string;
      email: string;
      emailPlaceholder: string;
      company: string;
      companyPlaceholder: string;
      notes: string;
      notesPlaceholder: string;
    };
    trustElements: {
      response24h: string;
      ndaAvailable: string;
    };
    submit: string;
    submitting: string;
    success: string;
    successMessage: string;
    error: string;
    errorMessage: string;
  };
  download: {
    heading: string;
    description: string;
    downloadButton: string;
    privacyMessage: string;
    fields: {
      name: string;
      email: string;
      company: string;
      country: string;
    };
  };
  emptyState: {
    noProducts: string;
  };
  skipLinks: {
    skipToContent: string;
    skipToFilters: string;
    skipToProducts: string;
  };
}

const FR_TRANSLATIONS: CatalogDarkTranslations = {
  header: {
    heading: 'Catalogue Produits',
    subtitle: 'Cacao, café & commodités africaines — QA documentée, traçabilité prête pour audit.',
    ctaPrimary: 'Demander un devis',
    ctaSecondary: 'Télécharger le catalogue (PDF)',
  },
  filters: {
    search: 'Rechercher',
    searchPlaceholder: 'Rechercher un produit...',
    category: 'Catégorie',
    categoryPlaceholder: 'Sélectionner une catégorie',
    origin: 'Origine',
    originPlaceholder: 'Sélectionner une origine',
    availability: 'Disponibilité',
    availabilityPlaceholder: 'Sélectionner la disponibilité',
    certifications: 'Certifications',
    certificationsPlaceholder: 'Sélectionner des certifications',
    incoterms: 'Incoterms',
    incotermsPlaceholder: 'Sélectionner des incoterms',
    moq: 'MOQ',
    clearAll: 'Réinitialiser',
    showFilters: 'Filtrer',
    activeFilters: 'Filtres actifs',
  },
  sort: {
    label: 'Trier par',
    relevance: 'Pertinence',
    availability: 'Disponibilité',
    moq: 'MOQ',
    origin: 'Origine',
  },
  availability: {
    'in-stock': 'Disponible',
    'limited': 'Stock limité',
    'pre-order': 'Précommande',
  },
  product: {
    requestQuote: 'Demander un devis',
    viewSpecs: 'Voir fiche technique',
    downloadSpec: 'Fiche technique (PDF)',
    origin: 'Origine',
    moq: 'MOQ',
    incoterm: 'Incoterms',
    packaging: 'Conditionnement',
    microproof: 'Réponse sous 24h • NDA possible',
    terrainLabel: 'Terrain',
  },
  categoryLabels: {
    cocoa: 'Cacao',
    coffee: 'Café',
    corn: 'Maïs',
    pepper: 'Poivre',
    wood: 'Bois',
  },
  badges: {
    inStock: 'En stock',
    onRequest: 'Sur demande',
    contractable: 'Contractable',
    eudrReady: 'EUDR-ready',
  },
  proofs: {
    coa: 'COA',
    chainOfCustody: 'Chain of Custody',
    qaDocumented: 'QA documentée',
  },
  fallback: {
    comingSoon: 'Photo à venir',
    multiOrigin: 'Multi-origine',
    toSpecify: 'À préciser',
  },
  trust: {
    response24h: '24h',
    response24hTooltip: 'Réponse sous 24 heures',
    ndaAvailable: 'NDA',
    ndaAvailableTooltip: 'NDA disponible sur demande',
    eudrCompliant: 'EUDR',
    eudrCompliantTooltip: 'Conforme EUDR',
    qaDocumented: 'QA',
    qaDocumentedTooltip: 'Documentation QA',
    coaAvailable: 'COA',
    coaAvailableTooltip: 'COA & fiches techniques',
  },
  rfq: {
    title: 'Demander un devis',
    close: 'Fermer',
    productLabel: 'Produit sélectionné',
    fields: {
      quantity: 'Quantité',
      quantityPlaceholder: '500',
      incoterm: 'Incoterm',
      incotermPlaceholder: 'Sélectionner un incoterm',
      destination: 'Destination/Port',
      destinationPlaceholder: 'Ville, Pays',
      email: 'Email',
      emailPlaceholder: 'votre@email.com',
      company: 'Société',
      companyPlaceholder: 'Nom de votre société',
      notes: 'Notes additionnelles',
      notesPlaceholder: 'Informations complémentaires...',
    },
    trustElements: {
      response24h: 'Réponse sous 24h',
      ndaAvailable: 'NDA disponible sur demande',
    },
    submit: 'Envoyer la demande',
    submitting: 'Envoi en cours...',
    success: 'Demande envoyée !',
    successMessage: 'Nous vous répondrons dans les 24 heures.',
    error: 'Erreur',
    errorMessage: 'Une erreur est survenue. Veuillez réessayer.',
  },
  download: {
    heading: 'Télécharger notre catalogue',
    description: 'Recevez notre catalogue PDF complet avec tous nos produits et spécifications.',
    downloadButton: 'Télécharger le catalogue',
    privacyMessage: 'Vos données sont protégées',
    fields: {
      name: 'Nom complet',
      email: 'Email professionnel',
      company: 'Entreprise',
      country: 'Pays',
    },
  },
  emptyState: {
    noProducts: 'Aucun produit trouvé',
  },
  skipLinks: {
    skipToContent: 'Aller au contenu principal',
    skipToFilters: 'Aller aux filtres',
    skipToProducts: 'Aller aux produits',
  },
};

const EN_TRANSLATIONS: CatalogDarkTranslations = {
  header: {
    heading: 'Product Catalog',
    subtitle: 'Cocoa, coffee & African commodities — Documented QA, audit-ready traceability.',
    ctaPrimary: 'Request a Quote',
    ctaSecondary: 'Download Catalog (PDF)',
  },
  filters: {
    search: 'Search',
    searchPlaceholder: 'Search for a product...',
    category: 'Category',
    categoryPlaceholder: 'Select a category',
    origin: 'Origin',
    originPlaceholder: 'Select an origin',
    availability: 'Availability',
    availabilityPlaceholder: 'Select availability',
    certifications: 'Certifications',
    certificationsPlaceholder: 'Select certifications',
    incoterms: 'Incoterms',
    incotermsPlaceholder: 'Select incoterms',
    moq: 'MOQ',
    clearAll: 'Reset',
    showFilters: 'Filter',
    activeFilters: 'Active filters',
  },
  sort: {
    label: 'Sort by',
    relevance: 'Relevance',
    availability: 'Availability',
    moq: 'MOQ',
    origin: 'Origin',
  },
  availability: {
    'in-stock': 'In Stock',
    'limited': 'Limited Stock',
    'pre-order': 'Pre-order',
  },
  product: {
    requestQuote: 'Request a Quote',
    viewSpecs: 'View Specifications',
    downloadSpec: 'Spec Sheet (PDF)',
    origin: 'Origin',
    moq: 'MOQ',
    incoterm: 'Incoterms',
    packaging: 'Packaging',
    microproof: '24h response • NDA available',
    terrainLabel: 'Field',
  },
  categoryLabels: {
    cocoa: 'Cocoa',
    coffee: 'Coffee',
    corn: 'Corn',
    pepper: 'Pepper',
    wood: 'Wood',
  },
  badges: {
    inStock: 'In Stock',
    onRequest: 'On Request',
    contractable: 'Contractable',
    eudrReady: 'EUDR-ready',
  },
  proofs: {
    coa: 'COA',
    chainOfCustody: 'Chain of Custody',
    qaDocumented: 'QA Documented',
  },
  fallback: {
    comingSoon: 'Photo coming soon',
    multiOrigin: 'Multi-origin',
    toSpecify: 'To be specified',
  },
  trust: {
    response24h: '24h',
    response24hTooltip: '24h response time',
    ndaAvailable: 'NDA',
    ndaAvailableTooltip: 'NDA available upon request',
    eudrCompliant: 'EUDR',
    eudrCompliantTooltip: 'EUDR compliant',
    qaDocumented: 'QA',
    qaDocumentedTooltip: 'QA documentation',
    coaAvailable: 'COA',
    coaAvailableTooltip: 'COA & spec sheets',
  },
  rfq: {
    title: 'Request a Quote',
    close: 'Close',
    productLabel: 'Selected Product',
    fields: {
      quantity: 'Quantity',
      quantityPlaceholder: '500',
      incoterm: 'Incoterm',
      incotermPlaceholder: 'Select an incoterm',
      destination: 'Destination/Port',
      destinationPlaceholder: 'City, Country',
      email: 'Email',
      emailPlaceholder: 'your@email.com',
      company: 'Company',
      companyPlaceholder: 'Your company name',
      notes: 'Additional Notes',
      notesPlaceholder: 'Additional information...',
    },
    trustElements: {
      response24h: '24h response',
      ndaAvailable: 'NDA available upon request',
    },
    submit: 'Send Request',
    submitting: 'Sending...',
    success: 'Request Sent!',
    successMessage: 'We will respond within 24 hours.',
    error: 'Error',
    errorMessage: 'An error occurred. Please try again.',
  },
  download: {
    heading: 'Download Our Catalog',
    description: 'Receive our complete PDF catalog with all our products and specifications.',
    downloadButton: 'Download Catalog',
    privacyMessage: 'Your data is protected',
    fields: {
      name: 'Full Name',
      email: 'Business Email',
      company: 'Company',
      country: 'Country',
    },
  },
  emptyState: {
    noProducts: 'No products found',
  },
  skipLinks: {
    skipToContent: 'Skip to main content',
    skipToFilters: 'Skip to filters',
    skipToProducts: 'Skip to products',
  },
};

/**
 * Get catalog dark translations for a specific locale
 * Fallback to English if locale not found
 * Requirements: 7.1-7.7
 */
export function getCatalogDarkTranslations(locale: Locale): CatalogDarkTranslations {
  const translations: Record<Locale, CatalogDarkTranslations> = {
    fr: FR_TRANSLATIONS,
    en: EN_TRANSLATIONS,
    // Fallback to English for other locales
    es: EN_TRANSLATIONS,
    de: EN_TRANSLATIONS,
    ru: EN_TRANSLATIONS,
  };

  return translations[locale] || EN_TRANSLATIONS;
}
