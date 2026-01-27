import { Metadata } from 'next';
import { Locale } from '@/types';
import { getAllProducts } from '@/lib/sanity/queries';
import { ProductCard } from '@/components/product/ProductCard';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const titles: Record<Locale, string> = {
    fr: 'Nos Produits - Commodités Agricoles Africaines Premium | Afrexia',
    en: 'Our Products - Premium African Agricultural Commodities | Afrexia',
    es: 'Nuestros Productos - Productos Agrícolas Africanos Premium | Afrexia',
    de: 'Unsere Produkte - Premium Afrikanische Agrarprodukte | Afrexia',
    ru: 'Наши Продукты - Премиальные Африканские Сельскохозяйственные Товары | Afrexia',
  };

  const descriptions: Record<Locale, string> = {
    fr: 'Découvrez notre gamme de produits agricoles africains de qualité supérieure : cacao, café, poivre, bois et maïs. Certifications internationales, traçabilité complète.',
    en: 'Discover our range of premium African agricultural products: cocoa, coffee, pepper, wood and corn. International certifications, full traceability.',
    es: 'Descubra nuestra gama de productos agrícolas africanos premium: cacao, café, pimienta, madera y maíz. Certificaciones internacionales, trazabilidad completa.',
    de: 'Entdecken Sie unser Sortiment an Premium-Agrarprodukten aus Afrika: Kakao, Kaffee, Pfeffer, Holz und Mais. Internationale Zertifizierungen, vollständige Rückverfolgbarkeit.',
    ru: 'Откройте для себя наш ассортимент премиальных африканских сельскохозяйственных продуктов: какао, кофе, перец, древесина и кукуруза. Международные сертификаты, полная отслеживаемость.',
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
  
  const categoryLabels: Record<string, Record<Locale, string>> = {
    cocoa: { fr: 'Cacao', en: 'Cocoa', es: 'Cacao', de: 'Kakao', ru: 'Какао' },
    coffee: { fr: 'Café', en: 'Coffee', es: 'Café', de: 'Kaffee', ru: 'Кофе' },
    pepper: { fr: 'Poivre', en: 'Pepper', es: 'Pimienta', de: 'Pfeffer', ru: 'Перец' },
    wood: { fr: 'Bois', en: 'Wood', es: 'Madera', de: 'Holz', ru: 'Древесина' },
    corn: { fr: 'Maïs', en: 'Corn', es: 'Maíz', de: 'Mais', ru: 'Кукуруза' },
  };

  const headings: Record<Locale, { title: string; subtitle: string; allProducts: string; noProducts: string }> = {
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
    es: {
      title: 'Nuestros Productos',
      subtitle: 'Productos agrícolas africanos premium',
      allProducts: 'Todos los Productos',
      noProducts: 'No hay productos disponibles en este momento.',
    },
    de: {
      title: 'Unsere Produkte',
      subtitle: 'Premium afrikanische Agrarprodukte',
      allProducts: 'Alle Produkte',
      noProducts: 'Derzeit sind keine Produkte verfügbar.',
    },
    ru: {
      title: 'Наши Продукты',
      subtitle: 'Премиальные африканские сельскохозяйственные товары',
      allProducts: 'Все Продукты',
      noProducts: 'В настоящее время продукты недоступны.',
    },
  };

  const content = headings[locale] || headings.en;

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
                      {categoryLabels[category]?.[locale] || categoryLabels[category]?.en || category}
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
            {locale === 'fr' && 'Vous ne trouvez pas ce que vous cherchez ?'}
            {locale === 'en' && "Can't find what you're looking for?"}
            {locale === 'es' && '¿No encuentra lo que busca?'}
            {locale === 'de' && 'Finden Sie nicht, was Sie suchen?'}
            {locale === 'ru' && 'Не можете найти то, что ищете?'}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {locale === 'fr' && 'Contactez-nous pour discuter de vos besoins spécifiques. Nous pouvons sourcer une large gamme de produits agricoles africains.'}
            {locale === 'en' && 'Contact us to discuss your specific needs. We can source a wide range of African agricultural products.'}
            {locale === 'es' && 'Contáctenos para discutir sus necesidades específicas. Podemos obtener una amplia gama de productos agrícolas africanos.'}
            {locale === 'de' && 'Kontaktieren Sie uns, um Ihre spezifischen Bedürfnisse zu besprechen. Wir können eine breite Palette afrikanischer Agrarprodukte beschaffen.'}
            {locale === 'ru' && 'Свяжитесь с нами, чтобы обсудить Ваши конкретные потребности. Мы можем поставить широкий ассортимент африканских сельскохозяйственных продуктов.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/${locale}/rfq`}
              className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {locale === 'fr' && 'Demander un devis'}
              {locale === 'en' && 'Request a Quote'}
              {locale === 'es' && 'Solicitar Cotización'}
              {locale === 'de' && 'Angebot anfordern'}
              {locale === 'ru' && 'Запросить предложение'}
            </a>
            <a
              href={`/${locale}/contact`}
              className="inline-block bg-white hover:bg-light text-primary border-2 border-primary px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {locale === 'fr' && 'Nous contacter'}
              {locale === 'en' && 'Contact Us'}
              {locale === 'es' && 'Contáctenos'}
              {locale === 'de' && 'Kontaktieren Sie uns'}
              {locale === 'ru' && 'Свяжитесь с нами'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
