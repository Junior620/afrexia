import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Locale } from '@/types';
import { getProductBySlug, getAllProductSlugs } from '@/lib/sanity/queries';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductOriginMap } from '@/components/product/ProductOriginMap';
import { ProductSpecifications } from '@/components/product/ProductSpecifications';
import { ProductViewTracker } from '@/components/product/ProductViewTracker';
import { CTAButton } from '@/components/ui/CTAButton';
import { urlFor } from '@/sanity/lib/image';

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

  const description = product.seo?.metaDescription?.[locale] || getDescriptionText(product.description[locale]);

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

  const description = getDescriptionText(product.description[locale]);

  // Category labels
  const categoryLabels: Record<string, { fr: string; en: string }> = {
    cocoa: { fr: 'Cacao', en: 'Cocoa' },
    coffee: { fr: 'Café', en: 'Coffee' },
    pepper: { fr: 'Poivre', en: 'Pepper' },
    wood: { fr: 'Bois', en: 'Wood' },
    corn: { fr: 'Maïs', en: 'Corn' },
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

      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-light py-4">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link href={`/${locale}`} className="text-muted-foreground hover:text-primary">
                {locale === 'fr' ? 'Accueil' : 'Home'}
              </Link>
              <span className="text-muted-foreground">/</span>
              <Link href={`/${locale}/products`} className="text-muted-foreground hover:text-primary">
                {locale === 'fr' ? 'Produits' : 'Products'}
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">{name}</span>
            </nav>
          </div>
        </div>

        {/* Product Header */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Gallery */}
              <div>
                <ProductGallery images={product.gallery} productName={name} locale={locale} />
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Category & Availability */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                    {categoryLabel}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${availabilityInfo.color}`}>
                    {availabilityInfo[locale]}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                  {name}
                </h1>

                {/* Description */}
                <div className="prose prose-lg max-w-none text-foreground">
                  {description.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                {/* Certifications */}
                {product.certifications && product.certifications.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">
                      {locale === 'fr' ? 'Certifications' : 'Certifications'}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {product.certifications.map((cert: any) => (
                        <div
                          key={cert._id}
                          className="inline-flex items-center gap-2 bg-light rounded-lg px-4 py-2 border border-border"
                          title={cert.name}
                        >
                          {cert.logo && (
                            <img
                              src={urlFor(cert.logo)?.width(32).height(32).url() || ''}
                              alt={cert.name}
                              className="w-6 h-6 object-contain"
                            />
                          )}
                          <span className="text-sm font-medium text-foreground">{cert.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <CTAButton
                    href={`/${locale}/rfq?product=${product._id}`}
                    text={locale === 'fr' ? 'Demander un devis' : 'Request a Quote'}
                    ctaLocation="product_detail_page_top"
                    variant="primary"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {locale === 'fr' ? 'Demander un devis' : 'Request a Quote'}
                  </CTAButton>
                  
                  {product.specificationPDF?.asset && (
                    <a
                      href={product.specificationPDF.asset.url}
                      download
                      className="inline-flex items-center justify-center bg-white hover:bg-light text-primary border-2 border-primary px-8 py-4 rounded-lg font-semibold transition-colors text-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {locale === 'fr' ? 'Télécharger la fiche technique' : 'Download Spec Sheet'}
                    </a>
                  )}
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  {product.moq && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {locale === 'fr' ? 'MOQ' : 'MOQ'}
                      </p>
                      <p className="font-semibold text-foreground">{product.moq}</p>
                    </div>
                  )}
                  {product.harvestSeason && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {locale === 'fr' ? 'Saison' : 'Season'}
                      </p>
                      <p className="font-semibold text-foreground">{product.harvestSeason}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Origin Map */}
        {originRegions.length > 0 && (
          <section className="py-12 md:py-16 bg-light">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-foreground mb-8">
                {locale === 'fr' ? 'Origine du Produit' : 'Product Origin'}
              </h2>
              <ProductOriginMap origins={originRegions} productName={name} locale={locale} />
            </div>
          </section>
        )}

        {/* Specifications */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground mb-8">
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

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-primary to-secondary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {locale === 'fr' ? 'Intéressé par ce produit ?' : 'Interested in this product?'}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {locale === 'fr'
                ? 'Contactez notre équipe commerciale pour discuter de vos besoins et obtenir un devis personnalisé.'
                : 'Contact our sales team to discuss your needs and get a personalized quote.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton
                href={`/${locale}/rfq?product=${product._id}`}
                text={locale === 'fr' ? 'Demander un devis' : 'Request a Quote'}
                ctaLocation="product_detail_page_bottom"
                className="inline-block bg-white hover:bg-light text-primary px-8 py-3 rounded-lg font-semibold transition-colors"
              />
              <CTAButton
                href={`/${locale}/contact`}
                text={locale === 'fr' ? 'Nous contacter' : 'Contact Us'}
                ctaLocation="product_detail_page_bottom"
                variant="ghost"
                className="inline-block bg-white/10 hover:bg-white/20 text-white border-2 border-white px-8 py-3 rounded-lg font-semibold transition-colors"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
