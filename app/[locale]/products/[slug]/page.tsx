import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Locale } from '@/types';
import { getProductBySlug, getAllProductSlugs } from '@/lib/sanity/queries';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductOriginMap } from '@/components/product/ProductOriginMap';
import { ProductSpecifications } from '@/components/product/ProductSpecifications';
import { ProductViewTracker } from '@/components/product/ProductViewTracker';
import { StickyCTA } from '@/components/product/StickyCTA';
import { DescriptionExpander } from '@/components/product/DescriptionExpander';
import { BadgesPopover } from '@/components/product/BadgesPopover';
import { CTAButton } from '@/components/ui/CTAButton';
import { urlFor } from '@/sanity/lib/image';
import { cn } from '@/lib/utils';

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateStaticParams() {
  const products = await getAllProductSlugs();
  
  const params: { locale: Locale; slug: string }[] = [];
  
  products.forEach((product: any) => {
    params.push(
      { locale: 'fr', slug: product.slugFr },
      { locale: 'en', slug: product.slugEn }
    );
  });
  
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug, locale);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const title = product.seo?.metaTitle?.[locale] || `${product.name[locale]} | Afrexia`;
  
  // Extract description from block content
  const getDescriptionText = (description: any): string => {
    if (typeof description === 'string') return description;
    if (Array.isArray(description)) {
      return description
        .filter((block: any) => block._type === 'block')
        .map((block: any) => 
          block.children
            ?.filter((child: any) => child._type === 'span')
            .map((child: any) => child.text)
            .join('')
        )
        .join(' ')
        .slice(0, 160);
    }
    return '';
  };

  const description = product.seo?.metaDescription?.[locale] || 
    (product.description?.[locale] ? getDescriptionText(product.description[locale]) : '');

  const canonicalUrl = `https://afrexia.com/${locale}/products/${slug}`;
  const alternateUrls = {
    fr: `https://afrexia.com/fr/products/${product.slug.fr.current}`,
    en: `https://afrexia.com/en/products/${product.slug.en.current}`,
  };

  const ogImage = product.gallery?.[0] 
    ? urlFor(product.gallery[0])?.width(1200).height(630).url()
    : undefined;

  // Generate Product Schema.org structured data
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name[locale],
    description,
    image: product.gallery?.map((img: any) => urlFor(img)?.width(800).url()).filter(Boolean),
    brand: {
      '@type': 'Organization',
      name: 'Afrexia',
    },
    category: product.category,
    manufacturer: {
      '@type': 'Organization',
      name: 'Afrexia',
    },
    additionalProperty: [
      ...(product.moq ? [{
        '@type': 'PropertyValue',
        name: 'Minimum Order Quantity',
        value: product.moq,
      }] : []),
      ...(product.hsCode ? [{
        '@type': 'PropertyValue',
        name: 'HS Code',
        value: product.hsCode,
      }] : []),
      ...(product.incoterms?.map((term: string) => ({
        '@type': 'PropertyValue',
        name: 'Incoterm',
        value: term,
      })) || []),
    ],
  };

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateUrls,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Afrexia',
      images: ogImage ? [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: product.name[locale],
        },
      ] : [],
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    other: {
      'product:schema': JSON.stringify(productSchema),
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug, locale);

  // If product not found, check if slug exists in alternate language
  if (!product) {
    const alternateLocale = locale === 'fr' ? 'en' : 'fr';
    const alternateProduct = await getProductBySlug(slug, alternateLocale);
    
    if (alternateProduct) {
      // Redirect to correct language version
      const correctSlug = alternateProduct.slug[locale].current;
      redirect(`/${locale}/products/${correctSlug}`);
    }
    
    // Product doesn't exist in any language
    notFound();
  }

  const name = product.name[locale];
  
  // Extract plain text from block content
  const getDescriptionText = (description: any): string => {
    if (typeof description === 'string') return description;
    if (Array.isArray(description)) {
      return description
        .filter((block: any) => block._type === 'block')
        .map((block: any) => 
          block.children
            ?.filter((child: any) => child._type === 'span')
            .map((child: any) => child.text)
            .join('')
        )
        .join('\n\n');
    }
    return '';
  };

  const description = product.description?.[locale] 
    ? getDescriptionText(product.description[locale]) 
    : '';

  // Category labels
  const categoryLabels: Record<string, { fr: string; en: string }> = {
    cocoa: { fr: 'Cacao', en: 'Cocoa' },
    coffee: { fr: 'Café', en: 'Coffee' },
    pepper: { fr: 'Poivre', en: 'Pepper' },
    wood: { fr: 'Bois', en: 'Wood' },
    corn: { fr: 'Maïs', en: 'Corn' },
    rice: { fr: 'Riz', en: 'Rice' },
    'refined-sugar': { fr: 'Sucre Raffiné', en: 'Refined Sugar' },
    'petroleum-products': { fr: 'Produits Pétroliers', en: 'Petroleum Products' },
    'palm-oil': { fr: 'Huile de Palme', en: 'Palm Oil' },
    'tropical-fruits': { fr: 'Fruits Tropicaux', en: 'Tropical Fruits' },
  };

  const categoryLabel = categoryLabels[product.category]?.[locale] || product.category;

  // Availability labels
  const availabilityLabels: Record<string, { fr: string; en: string; color: string }> = {
    in_stock: { fr: 'En stock', en: 'In Stock', color: 'bg-success-light text-success-dark' },
    pre_order: { fr: 'Pré-commande', en: 'Pre-Order', color: 'bg-info-light text-info-dark' },
    seasonal: { fr: 'Saisonnier', en: 'Seasonal', color: 'bg-warning-light text-warning-dark' },
    out_of_stock: { fr: 'Rupture', en: 'Out of Stock', color: 'bg-muted text-muted-foreground' },
  };

  const availabilityInfo = availabilityLabels[product.availability] || availabilityLabels.in_stock;

  // Prepare origin regions for map
  const originRegions = product.originRegions?.map((region: any) => ({
    region: region.region,
    coordinates: {
      lat: region.coordinates.lat,
      lng: region.coordinates.lng,
    },
    description: region.description,
  })) || [];

  // Product Schema for structured data
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name[locale],
    description,
    image: product.gallery?.map((img: any) => urlFor(img)?.width(800).url()).filter(Boolean),
    brand: {
      '@type': 'Organization',
      name: 'Afrexia',
    },
    category: product.category,
  };

  return (
    <>
      {/* Product View Tracker */}
      <ProductViewTracker
        productId={product._id}
        productName={name}
        productCategory={product.category}
        locale={locale}
      />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="min-h-screen bg-[#0A1410]">
        {/* Breadcrumb */}
        <div className="bg-[rgba(26,40,32,0.4)] border-b border-[rgba(255,255,255,0.08)] py-4">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link href={`/${locale}`} className="text-[#80996F] hover:text-[#A89858] transition-colors">
                {locale === 'fr' ? 'Accueil' : 'Home'}
              </Link>
              <span className="text-[#80996F]/50">/</span>
              <Link href={`/${locale}/products`} className="text-[#80996F] hover:text-[#A89858] transition-colors">
                {locale === 'fr' ? 'Produits' : 'Products'}
              </Link>
              <span className="text-[#80996F]/50">/</span>
              <span className="text-[#E8F5E9] font-medium">{name}</span>
            </nav>
          </div>
        </div>

        {/* Product Header - 2 columns layout */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 lg:gap-12">
              {/* Left Column: Gallery */}
              <div className="lg:sticky lg:top-8 lg:self-start">
                <ProductGallery images={product.gallery} productName={name} locale={locale} />
              </div>

              {/* Right Column: All Product Info */}
              <div className="space-y-6">
                {/* Category & Availability */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-semibold text-[#A89858] uppercase tracking-wide">
                    {categoryLabel}
                  </span>
                  <span className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold',
                    'bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.85)]',
                    'border border-[rgba(255,255,255,0.08)]'
                  )}>
                    <span className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      product.availability === 'in_stock' ? 'bg-[#4A9A62]' : 'bg-[#A89858]'
                    )} />
                    {availabilityInfo[locale]}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-[#E8F5E9] mb-2">
                    {name}
                  </h1>
                  <p className="text-base text-[#A89858] font-medium">
                    {locale === 'fr' 
                      ? `Export structuré & documentation complète` 
                      : `Structured export & complete documentation`}
                  </p>
                </div>

                {/* Description courte + Lire plus */}
                <DescriptionExpander
                  description={description}
                  locale={locale}
                  maxLines={3}
                />

                {/* Key Facts Grid 2x3 - AVANT les CTAs */}
                <div className="bg-[rgba(26,40,32,0.6)] border border-[rgba(255,255,255,0.08)] rounded-xl p-5 backdrop-blur-[12px]">
                  <h3 className="text-xs font-semibold text-[#80996F] uppercase tracking-wider mb-4">
                    {locale === 'fr' ? 'Informations clés' : 'Key Information'}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Origine */}
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[rgba(74,154,98,0.15)] border border-[rgba(74,154,98,0.3)] flex items-center justify-center text-[#4A9A62] flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs uppercase tracking-wider text-[#80996F] font-semibold mb-0.5">
                          {locale === 'fr' ? 'Origine' : 'Origin'}
                        </p>
                        <p className="text-sm font-semibold text-[#E8F5E9] truncate">
                          {product.originRegions?.[0]?.region || (locale === 'fr' ? 'Multi-origine' : 'Multi-origin')}
                        </p>
                      </div>
                    </div>

                    {/* MOQ */}
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[rgba(168,152,88,0.15)] border border-[rgba(168,152,88,0.3)] flex items-center justify-center text-[#A89858] flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs uppercase tracking-wider text-[#80996F] font-semibold mb-0.5">
                          MOQ
                        </p>
                        <p className="text-sm font-semibold text-[#E8F5E9]">
                          {product.moq || (locale === 'fr' ? 'Flexible (sur demande)' : 'Flexible (on request)')}
                        </p>
                      </div>
                    </div>

                    {/* Incoterms */}
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[rgba(74,154,98,0.15)] border border-[rgba(74,154,98,0.3)] flex items-center justify-center text-[#4A9A62] flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs uppercase tracking-wider text-[#80996F] font-semibold mb-0.5">
                          Incoterms
                        </p>
                        <p className="text-sm font-semibold text-[#E8F5E9] truncate">
                          {product.incoterms?.slice(0, 3).join(' • ') || 'FOB • CIF • DAP'}
                        </p>
                      </div>
                    </div>

                    {/* Conditionnement */}
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[rgba(168,152,88,0.15)] border border-[rgba(168,152,88,0.3)] flex items-center justify-center text-[#A89858] flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs uppercase tracking-wider text-[#80996F] font-semibold mb-0.5">
                          {locale === 'fr' ? 'Conditionnement' : 'Packaging'}
                        </p>
                        <p className="text-sm font-semibold text-[#E8F5E9] truncate">
                          {product.packagingOptions?.[0]?.type || (locale === 'fr' ? 'Sacs 25/50kg • Vrac' : 'Bags 25/50kg • Bulk')}
                        </p>
                      </div>
                    </div>

                    {/* Lead time */}
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[rgba(74,154,98,0.15)] border border-[rgba(74,154,98,0.3)] flex items-center justify-center text-[#4A9A62] flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs uppercase tracking-wider text-[#80996F] font-semibold mb-0.5">
                          Lead time
                        </p>
                        <p className="text-sm font-semibold text-[#E8F5E9]">
                          {product.harvestSeason || (locale === 'fr' ? 'Selon destination' : 'By destination')}
                        </p>
                      </div>
                    </div>

                    {/* Docs */}
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[rgba(168,152,88,0.15)] border border-[rgba(168,152,88,0.3)] flex items-center justify-center text-[#A89858] flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs uppercase tracking-wider text-[#80996F] font-semibold mb-0.5">
                          Docs
                        </p>
                        <p className="text-sm font-semibold text-[#E8F5E9]">
                          COA • Spec sheet • Packing list
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Micro-link détails logistiques */}
                  <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.08)]">
                    <a
                      href="#logistics"
                      className="text-xs text-[#A89858] hover:text-[#B8A868] font-medium inline-flex items-center gap-1 transition-colors"
                    >
                      {locale === 'fr' ? 'Voir détails logistiques' : 'View logistics details'}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Badges: Max 3 visibles + overflow with popover */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#80996F] font-semibold mb-3">
                    {locale === 'fr' ? 'Conformité & Export' : 'Compliance & Export'}
                  </p>
                  <BadgesPopover
                    badges={[
                      {
                        label: 'EUDR-ready',
                        variant: 'success',
                        icon: (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        ),
                      },
                      {
                        label: locale === 'fr' ? 'QA documentée' : 'QA documented',
                        icon: (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        ),
                      },
                      {
                        label: locale === 'fr' ? 'COA disponible' : 'COA available',
                        icon: (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ),
                      },
                      {
                        label: locale === 'fr' ? 'Traçabilité lot' : 'Lot traceability',
                        icon: (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        ),
                      },
                      {
                        label: locale === 'fr' ? 'Chain of custody' : 'Chain of custody',
                        icon: (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        ),
                      },
                    ]}
                    visibleCount={3}
                    locale={locale}
                  />
                </div>

                {/* Certifications */}
                {product.certifications && product.certifications.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#E8F5E9] uppercase tracking-wider mb-3">
                      {locale === 'fr' ? 'Certifications' : 'Certifications'}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {product.certifications.map((cert: any) => (
                        <div
                          key={cert._id}
                          className="inline-flex items-center gap-2 bg-[rgba(26,40,32,0.6)] rounded-lg px-4 py-2 border border-[rgba(255,255,255,0.08)]"
                          title={cert.name}
                        >
                          {cert.logo && (
                            <img
                              src={urlFor(cert.logo)?.width(32).height(32).url() || ''}
                              alt={cert.name}
                              className="w-6 h-6 object-contain"
                            />
                          )}
                          <span className="text-sm font-medium text-[#E8F5E9]">{cert.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTAs - Primary + Secondary PDF */}
                <div className="space-y-3 pt-2">
                  <CTAButton
                    href={`/${locale}/rfq?product=${product._id}`}
                    text={locale === 'fr' ? 'Demander un devis' : 'Request a Quote'}
                    ctaLocation="product_detail_page_top"
                    variant="primary"
                    className="w-full inline-flex items-center justify-center bg-[#4A9A62] hover:bg-[#5AAA72] text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {locale === 'fr' ? 'Demander un devis' : 'Request a Quote'}
                  </CTAButton>
                  
                  {/* Secondary CTA: PDF */}
                  {product.specificationPDF?.asset ? (
                    <a
                      href={product.specificationPDF.asset.url}
                      download
                      className="w-full inline-flex items-center justify-center bg-transparent hover:bg-[rgba(168,152,88,0.1)] text-[#A89858] border-2 border-[rgba(168,152,88,0.3)] hover:border-[rgba(168,152,88,0.5)] px-8 py-3.5 rounded-xl font-semibold transition-all text-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {locale === 'fr' ? 'Télécharger fiche technique (PDF)' : 'Download Spec Sheet (PDF)'}
                    </a>
                  ) : (
                    <a
                      href={`/${locale}/contact?subject=spec-sheet&product=${product._id}`}
                      className="w-full inline-flex items-center justify-center bg-transparent hover:bg-[rgba(168,152,88,0.1)] text-[#A89858] border-2 border-[rgba(168,152,88,0.3)] hover:border-[rgba(168,152,88,0.5)] px-8 py-3.5 rounded-xl font-semibold transition-all text-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {locale === 'fr' ? 'Recevoir la fiche technique (PDF)' : 'Get Spec Sheet (PDF)'}
                    </a>
                  )}

                  <p className="text-xs text-center text-[#80996F] font-medium">
                    {locale === 'fr' 
                      ? 'Réponse sous 24h • NDA possible • Documentation audit-ready' 
                      : '24h response • NDA available • Audit-ready documentation'}
                  </p>
                </div>

                {/* Informations export - Buyer-grade */}
                <div className="bg-[rgba(26,40,32,0.4)] border border-[rgba(255,255,255,0.08)] rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-[#E8F5E9] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#A89858]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {locale === 'fr' ? 'Informations export' : 'Export information'}
                  </h3>
                  <div className="space-y-2 text-sm text-[#C5D9C0]">
                    <p className="flex items-start gap-2">
                      <span className="text-[#4A9A62] mt-0.5">•</span>
                      <span>{locale === 'fr' ? 'Incoterms FOB/CIF/DAP' : 'Incoterms FOB/CIF/DAP'}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-[#4A9A62] mt-0.5">•</span>
                      <span>{locale === 'fr' ? 'Packing list & BL inclus' : 'Packing list & BL included'}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-[#4A9A62] mt-0.5">•</span>
                      <span>{locale === 'fr' ? 'Ports & routes : selon disponibilité' : 'Ports & routes: by availability'}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-[#4A9A62] mt-0.5">•</span>
                      <span>{locale === 'fr' ? 'Inspection : sur demande (SGS/BV)' : 'Inspection: on request (SGS/BV)'}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-[#4A9A62] mt-0.5">•</span>
                      <span>{locale === 'fr' ? 'Lead time : selon destination' : 'Lead time: by destination'}</span>
                    </p>
                  </div>
                  <a
                    href="#logistics"
                    className="inline-flex items-center gap-1 text-xs text-[#A89858] hover:text-[#B8A868] font-medium mt-3 transition-colors"
                  >
                    {locale === 'fr' ? 'Routes & lead times' : 'Routes & lead times'}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Origin Map */}
        {originRegions.length > 0 && (
          <section className="py-12 md:py-16 bg-[rgba(26,40,32,0.4)]">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-[#E8F5E9] mb-8">
                {locale === 'fr' ? 'Origine du Produit' : 'Product Origin'}
              </h2>
              <ProductOriginMap origins={originRegions} productName={name} locale={locale} />
            </div>
          </section>
        )}

        {/* Specifications */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-[#E8F5E9] mb-8">
              {locale === 'fr' ? 'Spécifications Techniques' : 'Technical Specifications'}
            </h2>
            <ProductSpecifications
              specifications={{
                qaMetrics: product.qaMetrics,
                packagingOptions: product.packagingOptions,
                moq: product.moq,
                incoterms: product.incoterms,
                hsCode: product.hsCode,
                harvestSeason: product.harvestSeason,
                availability: product.availability,
              }}
              locale={locale}
            />
          </div>
        </section>

        {/* CTA Section - Premium B2B avec image de fond */}
        <section className="relative py-16 md:py-24 mb-20 overflow-hidden">
          {/* Background image avec overlay */}
          <div className="absolute inset-0 z-0">
            {/* Image de fond (utilise la première image du produit ou une image par défaut) */}
            {product.gallery?.[0] && (
              <div className="absolute inset-0">
                <img
                  src={urlFor(product.gallery[0])?.width(1920).height(600).url() || ''}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {/* Overlay gradient dark premium */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A2820]/95 via-[#0F1814]/97 to-[#0A1410]/98" />
            {/* Vignette pour profondeur */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
            {/* Grain subtil */}
            <div 
              className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              {/* Badge premium */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(74,154,98,0.15)] border border-[rgba(74,154,98,0.3)] text-[#4A9A62] text-sm font-medium mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{locale === 'fr' ? 'Export premium • EUDR-ready' : 'Premium export • EUDR-ready'}</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[#E8F5E9]">
                {locale === 'fr' ? 'Recevoir une offre chiffrée' : 'Get a Detailed Quote'}
              </h2>
              <p className="text-lg md:text-xl text-[#C5D9C0] mb-8 leading-relaxed">
                {locale === 'fr'
                  ? 'Specs, origine, MOQ, lead time, incoterms — réponse sous 24h'
                  : 'Specs, origin, MOQ, lead time, incoterms — 24h response'}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <CTAButton
                  href={`/${locale}/rfq?product=${product._id}`}
                  text={locale === 'fr' ? 'Demander un devis' : 'Request a Quote'}
                  ctaLocation="product_detail_page_bottom"
                  className="inline-flex items-center justify-center bg-[#4A9A62] hover:bg-[#5AAA72] text-white px-10 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl text-base"
                />
                <CTAButton
                  href={`/${locale}/contact`}
                  text={locale === 'fr' ? 'Nous contacter' : 'Contact Us'}
                  ctaLocation="product_detail_page_bottom"
                  variant="ghost"
                  className="inline-flex items-center justify-center bg-transparent hover:bg-[rgba(255,255,255,0.1)] text-[#E8F5E9] border-2 border-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.3)] px-10 py-4 rounded-xl font-semibold transition-all text-base"
                />
              </div>

              {/* Trust elements */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#80996F]">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#4A9A62]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{locale === 'fr' ? 'Réponse sous 24h' : '24h response'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#4A9A62]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="font-medium">{locale === 'fr' ? 'NDA possible' : 'NDA available'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#4A9A62]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-medium">{locale === 'fr' ? 'Documentation audit-ready' : 'Audit-ready documentation'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky CTA - appears after 300px scroll */}
      <StickyCTA
        locale={locale}
        productId={product._id}
        productName={name}
        quoteHref={`/${locale}/rfq?product=${product._id}`}
        pdfHref={
          product.specificationPDF?.asset
            ? product.specificationPDF.asset.url
            : `/${locale}/contact?subject=spec-sheet&product=${product._id}`
        }
        hasPDF={!!product.specificationPDF?.asset}
        badges={[
          {
            label: 'EUDR-ready',
            icon: (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            ),
          },
          {
            label: locale === 'fr' ? 'QA documentée' : 'QA documented',
            icon: (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ),
          },
        ]}
      />
    </>
  );
}
