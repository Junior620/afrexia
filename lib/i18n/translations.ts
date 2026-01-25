import { Locale } from '@/types';

export const translations = {
  fr: {
    navigation: {
      home: 'Accueil',
      products: 'Produits',
      solutions: 'Solutions',
      quality: 'Qualité & Conformité',
      traceability: 'Traçabilité',
      about: 'À Propos',
      resources: 'Ressources',
      blog: 'Blog',
      contact: 'Contact',
      rfq: 'Demande de Devis',
    },
    common: {
      learnMore: 'En savoir plus',
      downloadPDF: 'Télécharger le PDF',
      requestQuote: 'Demander un devis',
      contactUs: 'Nous contacter',
      viewDetails: 'Voir les détails',
      readMore: 'Lire la suite',
      backToHome: 'Retour à l\'accueil',
      loading: 'Chargement...',
      error: 'Une erreur est survenue',
    },
    products: {
      title: 'Nos Produits',
      subtitle: 'Commodités agricoles africaines de qualité supérieure',
      allProducts: 'Tous les produits',
      noProducts: 'Aucun produit disponible pour le moment.',
      viewProduct: 'Voir le produit',
      specifications: 'Spécifications',
      certifications: 'Certifications',
      origin: 'Origine',
      packaging: 'Conditionnement',
    },
    footer: {
      tagline: 'Votre partenaire de confiance pour les commodités agricoles africaines',
      products: 'Produits',
      company: 'Entreprise',
      quickLinks: 'Liens Rapides',
      legal: 'Mentions Légales',
      followUs: 'Suivez-nous',
      copyright: '© {{year}} Afrexia. Tous droits réservés.',
      privacyPolicy: 'Politique de Confidentialité',
      termsOfService: 'Conditions d\'Utilisation',
    },
  },
  en: {
    navigation: {
      home: 'Home',
      products: 'Products',
      solutions: 'Solutions',
      quality: 'Quality & Compliance',
      traceability: 'Traceability',
      about: 'About',
      resources: 'Resources',
      blog: 'Blog',
      contact: 'Contact',
      rfq: 'Request for Quote',
    },
    common: {
      learnMore: 'Learn More',
      downloadPDF: 'Download PDF',
      requestQuote: 'Request a Quote',
      contactUs: 'Contact Us',
      viewDetails: 'View Details',
      readMore: 'Read More',
      backToHome: 'Back to Home',
      loading: 'Loading...',
      error: 'An error occurred',
    },
    products: {
      title: 'Our Products',
      subtitle: 'Premium African agricultural commodities',
      allProducts: 'All Products',
      noProducts: 'No products available at the moment.',
      viewProduct: 'View Product',
      specifications: 'Specifications',
      certifications: 'Certifications',
      origin: 'Origin',
      packaging: 'Packaging',
    },
    footer: {
      tagline: 'Your trusted partner for African agricultural commodities',
      products: 'Products',
      company: 'Company',
      quickLinks: 'Quick Links',
      legal: 'Legal',
      followUs: 'Follow Us',
      copyright: '© {{year}} Afrexia. All rights reserved.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
    },
  },
};

export function getTranslations(locale: Locale) {
  return translations[locale];
}

/**
 * Get a specific translation by key path
 * @param locale - The locale to use
 * @param key - The key path (e.g., 'navigation.home')
 * @param variables - Optional variables to replace in the translation (e.g., { year: '2024' })
 * @returns The translation string
 */
export function getTranslation(
  locale: Locale,
  key: string,
  variables?: Record<string, string>
): string {
  const keys = key.split('.');
  let value: any = translations[locale];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  if (typeof value !== 'string') {
    return key;
  }
  
  // Replace variables in the format {{variableName}}
  if (variables) {
    return value.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      return variables[varName] || match;
    });
  }
  
  return value;
}
