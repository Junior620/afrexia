import { Metadata } from 'next';
import { Locale } from '@/types';
import { getAllProducts } from '@/lib/sanity/queries';
import { ProductCard } from '@/components/product/ProductCard';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    fr: 'Nos Produits - Commodités Agricoles Africaines Premium | Afrexia',
    en: 'Our Products - Premium African Agricultural Commodities | Afrexia',
  };

  const descriptions = {
    fr: 'Découvrez notre gamme de produits agricoles africains de qualité supérieure : cacao, café, poivre, bois et maïs. Certifications internationales, traçabilité complète.',
    en: 'Discover our range of premium African agricultural products: cocoa, coffee, pepper, wood and corn. International certifications, full traceability.',
  };

  const title = titles[locale];
  const description = descriptions[locale];
  const canonicalUrl = `https://afrexia.com/${locale}/products`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: 'https://afrexia.com/fr/products',
        en: 'https://afrexia.com/en/products',
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Afrexia',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      type: 'website',
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
  const products = await getAllProducts();

  // Group products by category
  const productsByCategory = products.reduce((acc: any, product: any) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  const categories = ['cocoa', 'coffee', 'pepper', 'wood', 'corn'];
  
  const categoryLabels: Record<string, { fr: string; en: string }> = {
    cocoa: { fr: 'Cacao', en: 'Cocoa' },
    coffee: { fr: 'Café', en: 'Coffee' },
    pepper: { fr: 'Poivre', en: 'Pepper' },
    wood: { fr: 'Bois', en: 'Wood' },
    corn: { fr: 'Maïs', en: 'Corn' },
  };

  const headings = {
    fr: {
      title: 'Nos Produits',
      subtitle: 'Commodités agricoles africaines de qualité supérieure',
      allProducts: 'Tous les produits',
      noProducts: 'Aucun produit disponible pour le moment.',
    },
    en: {
      title: 'Our Products',
      subtitle: 'Premium African agricultural commodities',
      allProducts: 'All Products',
      noProducts: 'No products available at the moment.',
    },
  };

  const content = headings[locale];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {content.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              {content.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">{content.noProducts}</p>
            </div>
          ) : (
            <>
              {/* All Products */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-8">
                  {content.allProducts}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {products.map((product: any) => (
                    <ProductCard key={product._id} product={product} locale={locale} />
                  ))}
                </div>
              </div>

              {/* Products by Category */}
              {categories.map((category) => {
                const categoryProducts = productsByCategory[category];
                if (!categoryProducts || categoryProducts.length === 0) return null;

                return (
                  <div key={category} className="mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-8">
                      {categoryLabels[category][locale]}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      {categoryProducts.map((product: any) => (
                        <ProductCard key={product._id} product={product} locale={locale} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-light py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {locale === 'fr' 
              ? 'Vous ne trouvez pas ce que vous cherchez ?' 
              : "Can't find what you're looking for?"}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {locale === 'fr'
              ? 'Contactez-nous pour discuter de vos besoins spécifiques. Nous pouvons sourcer une large gamme de produits agricoles africains.'
              : 'Contact us to discuss your specific needs. We can source a wide range of African agricultural products.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/${locale}/rfq`}
              className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {locale === 'fr' ? 'Demander un devis' : 'Request a Quote'}
            </a>
            <a
              href={`/${locale}/contact`}
              className="inline-block bg-white hover:bg-light text-primary border-2 border-primary px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {locale === 'fr' ? 'Nous contacter' : 'Contact Us'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
