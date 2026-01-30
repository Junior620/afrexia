import { Metadata } from 'next';
import { Suspense } from 'react';
import { Locale } from '@/types';
import { getAllProducts, getAllCertifications } from '@/lib/sanity/queries';
import { Product, Category, Origin, Certification, AvailabilityStatus } from '@/types/product';
import { ProductCatalogPageDark } from './ProductCatalogPageDark';
import { StructuredData } from '@/components/seo/StructuredData';
import { generateItemListSchema, ItemListProduct } from '@/lib/seo/schema';
import { buildSanityImageUrl } from '@/lib/sanity/image-url';
import { ProductGridSkeleton } from '@/components/catalog/ProductCardSkeleton';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const titles: Record<Locale, string> = {
    fr: 'Notre Catalogue de Produits - Cacao, Café & Produits Agricoles Premium | Afrexia',
    en: 'Our Product Catalog - Cocoa, Coffee & Premium Agricultural Products | Afrexia',
    es: 'Nuestro Catálogo de Productos - Cacao, Café y Productos Agrícolas Premium | Afrexia',
    de: 'Unser Produktkatalog - Kakao, Kaffee & Premium Agrarprodukte | Afrexia',
    ru: 'Наш Каталог Продукции - Какао, Кофе и Премиальные Сельскохозяйственные Продукты | Afrexia',
  };

  const descriptions: Record<Locale, string> = {
    fr: 'Explorez notre catalogue complet de produits agricoles africains premium : cacao, café, poivre, bois et maïs. Certifications internationales, traçabilité EUDR, documentation QA complète.',
    en: 'Explore our complete catalog of premium African agricultural products: cocoa, coffee, pepper, wood and corn. International certifications, EUDR traceability, complete QA documentation.',
    es: 'Explore nuestro catálogo completo de productos agrícolas africanos premium: cacao, café, pimienta, madera y maíz. Certificaciones internacionales, trazabilidad EUDR, documentación QA completa.',
    de: 'Entdecken Sie unseren vollständigen Katalog an Premium-Agrarprodukten aus Afrika: Kakao, Kaffee, Pfeffer, Holz und Mais. Internationale Zertifizierungen, EUDR-Rückverfolgbarkeit, vollständige QA-Dokumentation.',
    ru: 'Изучите наш полный каталог премиальных африканских сельскохозяйственных продуктов: какао, кофе, перец, древесина и кукуруза. Международные сертификаты, отслеживаемость EUDR, полная документация QA.',
  };

  const title = titles[locale] || titles.en;
  const description = descriptions[locale] || descriptions.en;
  const canonicalUrl = `https://afrexia.com/${locale}/products`;

  const localeMap: Record<Locale, string> = {
    fr: 'fr_FR',
    en: 'en_US',
    es: 'es_ES',
    de: 'de_DE',
    ru: 'ru_RU',
  };

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: 'https://afrexia.com/fr/products',
        en: 'https://afrexia.com/en/products',
        es: 'https://afrexia.com/es/products',
        de: 'https://afrexia.com/de/products',
        ru: 'https://afrexia.com/ru/products',
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Afrexia',
      locale: localeMap[locale] || 'en_US',
      type: 'website',
      images: [
        {
          url: 'https://afrexia.com/og-catalog.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ProductsPage({ params }: PageProps) {
  const { locale } = await params;
  
  // Fetch all data in parallel
  const [rawProducts, rawCertifications] = await Promise.all([
    getAllProducts(),
    getAllCertifications(),
  ]);

  // Transform Sanity data to Product type
  const products: Product[] = rawProducts.map((p: any) => {
    // Normalize availability status
    const normalizeAvailability = (status: any): AvailabilityStatus => {
      if (!status) return 'in-stock';
      const normalized = String(status).toLowerCase().trim();
      if (normalized === 'in-stock' || normalized === 'instock' || normalized === 'in stock') return 'in-stock';
      if (normalized === 'limited' || normalized === 'limited-stock' || normalized === 'limited stock') return 'limited';
      if (normalized === 'pre-order' || normalized === 'preorder' || normalized === 'pre order') return 'pre-order';
      return 'in-stock'; // Default fallback
    };

    // Extract text from Sanity block content
    const extractText = (blockContent: any): string => {
      if (!blockContent) return '';
      if (typeof blockContent === 'string') return blockContent;
      if (Array.isArray(blockContent)) {
        return blockContent
          .map((block: any) => {
            if (block._type === 'block' && block.children) {
              return block.children
                .map((child: any) => child.text || '')
                .join('');
            }
            return '';
          })
          .join(' ')
          .trim();
      }
      return '';
    };

    return {
      id: p._id,
      slug: p.slug?.current || p.slug?.en?.current || '',
      name: p.name?.[locale] || p.name?.en || p.name || '',
      subtitle: extractText(p.description?.[locale] || p.description?.en || p.description),
      category: p.category || 'other',
      heroImage: p.gallery?.[0] || { asset: { _ref: '', _type: 'reference' } },
      availability: normalizeAvailability(p.availability),
      origins: p.originRegions?.map((r: any) => r.region) || [],
      certifications: p.certifications?.map((c: any) => c._id) || [],
      eudrReady: p.eudrReady || false,
      qaAvailable: p.qaMetrics && p.qaMetrics.length > 0,
      documents: {
        coa: !!p.specificationPDF,
        specSheet: !!p.specificationPDF,
        chainOfCustody: p.certifications && p.certifications.length > 0,
      },
      moq: p.moq ? { value: p.moq, unit: 'kg' } : { value: 500, unit: 'kg' },
      incoterms: p.incoterms || ['FOB', 'CIF'],
      packaging: extractText(p.packagingOptions?.[0]?.description?.[locale] || p.packagingOptions?.[0]?.description?.en),
      grade: extractText(p.grade?.[locale] || p.grade?.en),
      leadTime: extractText(p.leadTime?.[locale] || p.leadTime?.en),
      notes: extractText(p.notes?.[locale] || p.notes?.en),
      tags: p.tags || [],
      markets: p.targetMarkets || [],
      updatedAt: p._updatedAt || new Date().toISOString(),
    };
  });

  // Transform certifications
  const certifications: Certification[] = rawCertifications.map((c: any) => ({
    id: c._id,
    name: c.name?.[locale] || c.name?.en || c.name || '',
    icon: c.logo?.asset?._ref || '',
    description: c.description?.[locale] || c.description?.en || '',
  }));

  // Define categories (hardcoded for now, could be fetched from CMS)
  const categories: Category[] = [
    { id: 'cocoa', name: locale === 'fr' ? 'Cacao' : locale === 'es' ? 'Cacao' : locale === 'de' ? 'Kakao' : locale === 'ru' ? 'Какао' : 'Cocoa', slug: 'cocoa' },
    { id: 'coffee', name: locale === 'fr' ? 'Café' : locale === 'es' ? 'Café' : locale === 'de' ? 'Kaffee' : locale === 'ru' ? 'Кофе' : 'Coffee', slug: 'coffee' },
    { id: 'pepper', name: locale === 'fr' ? 'Poivre' : locale === 'es' ? 'Pimienta' : locale === 'de' ? 'Pfeffer' : locale === 'ru' ? 'Перец' : 'Pepper', slug: 'pepper' },
    { id: 'wood', name: locale === 'fr' ? 'Bois' : locale === 'es' ? 'Madera' : locale === 'de' ? 'Holz' : locale === 'ru' ? 'Древесина' : 'Wood', slug: 'wood' },
    { id: 'corn', name: locale === 'fr' ? 'Maïs' : locale === 'es' ? 'Maíz' : locale === 'de' ? 'Mais' : locale === 'ru' ? 'Кукуруза' : 'Corn', slug: 'corn' },
  ];

  // Define origins (hardcoded for now, could be fetched from CMS)
  const origins: Origin[] = [
    { id: 'ci', name: locale === 'fr' ? 'Côte d\'Ivoire' : 'Ivory Coast', code: 'CI', flag: '🇨🇮' },
    { id: 'gh', name: 'Ghana', code: 'GH', flag: '🇬🇭' },
    { id: 'cm', name: locale === 'fr' ? 'Cameroun' : locale === 'es' ? 'Camerún' : locale === 'de' ? 'Kamerun' : locale === 'ru' ? 'Камерун' : 'Cameroon', code: 'CM', flag: '🇨🇲' },
    { id: 'ng', name: locale === 'fr' ? 'Nigéria' : locale === 'es' ? 'Nigeria' : locale === 'de' ? 'Nigeria' : locale === 'ru' ? 'Нигерия' : 'Nigeria', code: 'NG', flag: '🇳🇬' },
  ];

  // Define translations
  const translations = getTranslations(locale);

  // Prepare structured data for SEO
  const itemListProducts: ItemListProduct[] = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.subtitle,
    image: buildSanityImageUrl(p.heroImage, { width: 800, height: 600 }),
    category: p.category,
    availability: p.availability,
  }));

  const structuredData = generateItemListSchema(itemListProducts, locale);

  return (
    <>
      <StructuredData data={structuredData} />
      <Suspense fallback={<CatalogLoadingFallback locale={locale} />}>
        <ProductCatalogPageDark
          locale={locale}
          products={products}
          categories={categories}
          origins={origins}
          certifications={certifications}
        />
      </Suspense>
    </>
  );
}

// Loading fallback component - Dark Theme
function CatalogLoadingFallback({ locale }: { locale: Locale }) {
  const headings: Record<Locale, string> = {
    fr: 'Chargement du catalogue...',
    en: 'Loading catalog...',
    es: 'Cargando catálogo...',
    de: 'Katalog wird geladen...',
    ru: 'Загрузка каталога...',
  };

  return (
    <div className="min-h-screen bg-[#0A1410]">
      {/* Header Skeleton - Dark */}
      <div className="w-full max-h-[30vh] bg-gradient-to-b from-[#0A1410] to-[#1A2820] py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-4 md:space-y-6">
          <div className="h-14 w-96 bg-[rgba(255,255,255,0.1)] animate-pulse rounded" />
          <div className="h-6 w-full max-w-3xl bg-[rgba(255,255,255,0.1)] animate-pulse rounded" />
          <div className="flex gap-4 md:gap-8 mt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-24 bg-[rgba(255,255,255,0.1)] animate-pulse rounded" />
            ))}
          </div>
          <div className="flex gap-4 mt-4">
            <div className="h-12 w-48 bg-[rgba(74,154,98,0.3)] animate-pulse rounded-xl" />
            <div className="h-12 w-48 bg-[rgba(255,255,255,0.1)] animate-pulse rounded-xl" />
          </div>
        </div>
      </div>

      {/* Filter Bar Skeleton - Dark */}
      <div className="sticky top-0 z-40 bg-[rgba(26,40,32,0.8)] backdrop-blur-[12px] border-b border-[rgba(255,255,255,0.1)] py-4">
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <div className="flex flex-wrap gap-3">
            <div className="h-12 w-64 bg-[rgba(255,255,255,0.1)] animate-pulse rounded-xl" />
            <div className="h-12 w-32 bg-[rgba(255,255,255,0.1)] animate-pulse rounded-xl" />
            <div className="h-12 w-32 bg-[rgba(255,255,255,0.1)] animate-pulse rounded-xl" />
            <div className="h-12 w-32 bg-[rgba(255,255,255,0.1)] animate-pulse rounded-xl" />
          </div>
        </div>
      </div>

      {/* Product Grid Skeleton - Dark */}
      <div className="py-8 md:py-12">
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-[rgba(26,40,32,0.6)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.1)] rounded-[28px] overflow-hidden animate-pulse"
                style={{ minHeight: '520px' }}
              >
                <div className="aspect-[4/3] bg-[rgba(255,255,255,0.05)]" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-[rgba(255,255,255,0.1)] rounded" />
                  <div className="h-4 bg-[rgba(255,255,255,0.1)] rounded w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-[rgba(255,255,255,0.1)] rounded" />
                    <div className="h-4 bg-[rgba(255,255,255,0.1)] rounded" />
                  </div>
                  <div className="h-12 bg-[rgba(74,154,98,0.3)] rounded-xl mt-6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Message */}
      <div className="sr-only" role="status" aria-live="polite">
        {headings[locale]}
      </div>
    </div>
  );
}

// Translation helper function
function getTranslations(locale: Locale) {
  const translations: Record<Locale, any> = {
    fr: {
      heading: 'Notre Catalogue de Produits',
      subtitle: 'Cacao, café et produits agricoles premium d\'Afrique avec traçabilité complète et certifications internationales',
      downloadCatalog: 'Télécharger le catalogue PDF',
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
        clearAll: 'Effacer les filtres',
        showFilters: 'Afficher les filtres',
        activeFilters: 'Filtres actifs',
      },
      availability: {
        'in-stock': 'En stock',
        'limited': 'Stock limité',
        'pre-order': 'Précommande',
      },
      product: {
        requestQuote: 'Demander un devis',
        viewSpecs: 'Voir spécifications',
        quickView: 'Aperçu rapide',
        origin: 'Origine',
        moq: 'MOQ',
        incoterm: 'Incoterm',
      },
      trust: {
        response24h: 'Réponse sous 24h',
        response24hTooltip: 'Nous répondons à toutes les demandes dans les 24 heures',
        ndaAvailable: 'NDA disponible',
        ndaAvailableTooltip: 'Accord de confidentialité disponible sur demande',
        eudrCompliant: 'Conforme EUDR',
        eudrCompliantTooltip: 'Conformité au règlement européen sur la déforestation',
        qaDocumented: 'Documentation QA',
        qaDocumentedTooltip: 'Documentation complète d\'assurance qualité',
        coaAvailable: 'COA & fiches techniques',
        coaAvailableTooltip: 'Certificats d\'analyse et fiches techniques disponibles',
      },
      rfq: {
        title: 'Demander un devis',
        close: 'Fermer',
        selectedProducts: 'Produits sélectionnés',
        addMore: 'Ajouter plus',
        removeProduct: 'Retirer',
        contactInfo: 'Vos coordonnées',
        orderDetails: 'Détails de la commande',
        additionalNotes: 'Notes additionnelles',
        fields: {
          name: 'Nom complet',
          namePlaceholder: 'Votre nom',
          email: 'Email',
          emailPlaceholder: 'votre@email.com',
          company: 'Entreprise',
          companyPlaceholder: 'Nom de votre entreprise',
          phone: 'Téléphone',
          phonePlaceholder: '+33 1 23 45 67 89',
          quantity: 'Quantité',
          quantityPlaceholder: '500',
          unit: 'kg',
          deliveryLocation: 'Lieu de livraison',
          deliveryLocationPlaceholder: 'Ville, Pays',
          incoterm: 'Incoterm',
          incotermPlaceholder: 'Sélectionner un incoterm',
          notes: 'Notes additionnelles',
          notesPlaceholder: 'Informations complémentaires sur votre demande...',
        },
        trustElements: {
          response24h: 'Réponse sous 24h',
          ndaAvailable: 'NDA disponible sur demande',
          secureData: 'Vos données sont sécurisées',
        },
        submit: 'Envoyer la demande',
        submitting: 'Envoi en cours...',
        success: 'Demande envoyée !',
        successMessage: 'Nous vous répondrons dans les 24 heures.',
        error: 'Erreur',
        errorMessage: 'Une erreur est survenue. Veuillez réessayer.',
        emptyCart: 'Panier vide',
        emptyCartMessage: 'Ajoutez des produits pour demander un devis.',
      },
      quickView: {
        title: 'Aperçu rapide',
        close: 'Fermer',
        specifications: 'Spécifications',
        certifications: 'Certifications',
        documents: 'Documents disponibles',
        requestQuote: 'Demander un devis',
        viewFullPage: 'Voir la page complète',
        availability: 'Disponibilité',
        category: 'Catégorie',
        origins: 'Origine',
        moq: 'MOQ',
        incoterms: 'Incoterms',
        packaging: 'Conditionnement',
        grade: 'Grade',
        leadTime: 'Délai',
        notes: 'Notes',
        documentsLabels: {
          coa: 'Certificat d\'analyse (COA)',
          specSheet: 'Fiche technique',
          chainOfCustody: 'Chaîne de traçabilité',
        },
        availabilityLabels: {
          inStock: 'En stock',
          limited: 'Stock limité',
          preOrder: 'Précommande',
        },
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
        validation: {
          nameRequired: 'Le nom est requis',
          emailRequired: 'L\'email est requis',
          emailInvalid: 'Email invalide',
          companyRequired: 'L\'entreprise est requise',
          countryRequired: 'Le pays est requis',
        },
      },
      compliance: {
        heading: 'Qualité & Conformité',
        qualityStandards: {
          title: 'Standards de qualité',
          description: 'Certifications ISO et processus QA rigoureux',
        },
        traceability: {
          title: 'Traçabilité',
          description: 'Suivi de la ferme au port avec blockchain',
        },
        certifications: {
          title: 'Certifications',
          description: 'EUDR, Bio, Fair Trade, Rainforest Alliance',
        },
      },
      multiProductRFQ: {
        heading: 'Besoin de plusieurs produits ?',
        description: 'Vous avez des produits dans votre panier. Soumettez une seule demande pour tous les produits sélectionnés.',
        cta: 'Voir le panier',
      },
    },
    en: {
      heading: 'Our Product Catalog',
      subtitle: 'Premium cocoa, coffee and agricultural products from Africa with full traceability and international certifications',
      downloadCatalog: 'Download PDF Catalog',
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
        clearAll: 'Clear filters',
        showFilters: 'Show filters',
        activeFilters: 'Active filters',
      },
      availability: {
        'in-stock': 'In Stock',
        'limited': 'Limited Stock',
        'pre-order': 'Pre-order',
      },
      product: {
        requestQuote: 'Request a Quote',
        viewSpecs: 'View Specifications',
        quickView: 'Quick View',
        origin: 'Origin',
        moq: 'MOQ',
        incoterm: 'Incoterm',
      },
      trust: {
        response24h: '24h Response',
        response24hTooltip: 'We respond to all inquiries within 24 hours',
        ndaAvailable: 'NDA Available',
        ndaAvailableTooltip: 'Non-disclosure agreement available upon request',
        eudrCompliant: 'EUDR Compliant',
        eudrCompliantTooltip: 'Compliant with EU Deforestation Regulation',
        qaDocumented: 'QA Documentation',
        qaDocumentedTooltip: 'Complete quality assurance documentation',
        coaAvailable: 'COA & Spec Sheets',
        coaAvailableTooltip: 'Certificates of analysis and specification sheets available',
      },
      rfq: {
        title: 'Request a Quote',
        close: 'Close',
        selectedProducts: 'Selected Products',
        addMore: 'Add More',
        removeProduct: 'Remove',
        contactInfo: 'Your Contact Information',
        orderDetails: 'Order Details',
        additionalNotes: 'Additional Notes',
        fields: {
          name: 'Full Name',
          namePlaceholder: 'Your name',
          email: 'Email',
          emailPlaceholder: 'your@email.com',
          company: 'Company',
          companyPlaceholder: 'Your company name',
          phone: 'Phone',
          phonePlaceholder: '+1 234 567 8900',
          quantity: 'Quantity',
          quantityPlaceholder: '500',
          unit: 'kg',
          deliveryLocation: 'Delivery Location',
          deliveryLocationPlaceholder: 'City, Country',
          incoterm: 'Incoterm',
          incotermPlaceholder: 'Select an incoterm',
          notes: 'Additional Notes',
          notesPlaceholder: 'Additional information about your request...',
        },
        trustElements: {
          response24h: '24h response time',
          ndaAvailable: 'NDA available upon request',
          secureData: 'Your data is secure',
        },
        submit: 'Send Request',
        submitting: 'Sending...',
        success: 'Request Sent!',
        successMessage: 'We will respond within 24 hours.',
        error: 'Error',
        errorMessage: 'An error occurred. Please try again.',
        emptyCart: 'Empty Cart',
        emptyCartMessage: 'Add products to request a quote.',
      },
      quickView: {
        title: 'Quick View',
        close: 'Close',
        specifications: 'Specifications',
        certifications: 'Certifications',
        documents: 'Available Documents',
        requestQuote: 'Request a Quote',
        viewFullPage: 'View Full Page',
        availability: 'Availability',
        category: 'Category',
        origins: 'Origin',
        moq: 'MOQ',
        incoterms: 'Incoterms',
        packaging: 'Packaging',
        grade: 'Grade',
        leadTime: 'Lead Time',
        notes: 'Notes',
        documentsLabels: {
          coa: 'Certificate of Analysis (COA)',
          specSheet: 'Specification Sheet',
          chainOfCustody: 'Chain of Custody',
        },
        availabilityLabels: {
          inStock: 'In Stock',
          limited: 'Limited Stock',
          preOrder: 'Pre-order',
        },
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
        validation: {
          nameRequired: 'Name is required',
          emailRequired: 'Email is required',
          emailInvalid: 'Invalid email',
          companyRequired: 'Company is required',
          countryRequired: 'Country is required',
        },
      },
      compliance: {
        heading: 'Quality & Compliance',
        qualityStandards: {
          title: 'Quality Standards',
          description: 'ISO certifications and rigorous QA processes',
        },
        traceability: {
          title: 'Traceability',
          description: 'Farm-to-port tracking with blockchain',
        },
        certifications: {
          title: 'Certifications',
          description: 'EUDR, Organic, Fair Trade, Rainforest Alliance',
        },
      },
      multiProductRFQ: {
        heading: 'Need Multiple Products?',
        description: 'You have products in your quote cart. Submit a single request for all selected products.',
        cta: 'View Quote Cart',
      },
    },
    // Add other locales (es, de, ru) with similar structure
    es: {
      heading: 'Nuestro Catálogo de Productos',
      subtitle: 'Cacao, café y productos agrícolas premium de África con trazabilidad completa y certificaciones internacionales',
      downloadCatalog: 'Descargar Catálogo PDF',
      // ... (similar structure to fr/en)
    },
    de: {
      heading: 'Unser Produktkatalog',
      subtitle: 'Premium Kakao, Kaffee und landwirtschaftliche Produkte aus Afrika mit vollständiger Rückverfolgbarkeit und internationalen Zertifizierungen',
      downloadCatalog: 'PDF-Katalog herunterladen',
      // ... (similar structure to fr/en)
    },
    ru: {
      heading: 'Наш Каталог Продукции',
      subtitle: 'Премиальное какао, кофе и сельскохозяйственные продукты из Африки с полной отслеживаемостью и международными сертификатами',
      downloadCatalog: 'Скачать PDF каталог',
      // ... (similar structure to fr/en)
    },
  };

  // Return translations for the locale, fallback to English
  return translations[locale] || translations.en;
}
