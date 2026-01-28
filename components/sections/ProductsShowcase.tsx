import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { Locale } from '@/types';

interface ProductsShowcaseProps {
  products: any[];
  locale: Locale;
}

export function ProductsShowcase({ products, locale }: ProductsShowcaseProps) {
  const content = {
    fr: {
      title: 'Nos Produits Premium',
      subtitle: 'Découvrez notre sélection de commodités agricoles africaines de haute qualité',
      viewAll: 'Voir Tous les Produits',
      requestQuote: 'Demander un devis',
      noProducts: 'Aucun produit disponible pour le moment',
    },
    en: {
      title: 'Our Premium Products',
      subtitle: 'Discover our selection of high-quality African agricultural commodities',
      viewAll: 'View All Products',
      requestQuote: 'Request a Quote',
      noProducts: 'No products available at the moment',
    },
    es: {
      title: 'Nuestros Productos Premium',
      subtitle: 'Descubra nuestra selección de productos agrícolas africanos de alta calidad',
      viewAll: 'Ver Todos los Productos',
      requestQuote: 'Solicitar Cotización',
      noProducts: 'No hay productos disponibles en este momento',
    },
    de: {
      title: 'Unsere Premium-Produkte',
      subtitle: 'Entdecken Sie unsere Auswahl an hochwertigen afrikanischen Agrarprodukten',
      viewAll: 'Alle Produkte Ansehen',
      requestQuote: 'Angebot Anfordern',
      noProducts: 'Derzeit keine Produkte verfügbar',
    },
    ru: {
      title: 'Наши Премиальные Продукты',
      subtitle: 'Откройте для себя наш ассортимент высококачественных африканских сельскохозяйственных товаров',
      viewAll: 'Посмотреть Все Продукты',
      requestQuote: 'Запросить Предложение',
      noProducts: 'В настоящее время нет доступных продуктов',
    },
  };

  const t = content[locale] || content.en;

  // Show first 6 products as featured (better for B2B showcase)
  const featuredProducts = products.slice(0, 6);

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-dark-bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="fade">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-dark-primary mb-4">
              {t.title}
            </h2>
            <p className="text-lg md:text-xl text-neutral dark:text-dark-text-secondary max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Products Grid - Immediately visible */}
        {featuredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProducts.map((product, index) => (
                <ScrollReveal
                  key={product._id}
                  animation="fade"
                  delay={index * 0.1}
                >
                  <ProductCard product={product} locale={locale} />
                </ScrollReveal>
              ))}
            </div>

            {/* CTAs Row */}
            <ScrollReveal animation="fade">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href={`/${locale}/products`}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark dark:bg-dark-primary dark:hover:bg-dark-primary/90 text-white px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {t.viewAll}
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
                <Link
                  href={`/${locale}/rfq`}
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark dark:bg-dark-accent dark:hover:bg-dark-accent/90 text-white px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {t.requestQuote}
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-neutral dark:text-dark-text-secondary">
              {t.noProducts}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
