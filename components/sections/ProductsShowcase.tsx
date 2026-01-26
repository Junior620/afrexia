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
    },
    en: {
      title: 'Our Premium Products',
      subtitle: 'Discover our selection of high-quality African agricultural commodities',
      viewAll: 'View All Products',
    },
  };

  const t = content[locale] || content.en; // Fallback to English if locale not found

  // Show first 3 or 4 products as featured
  const featuredProducts = products.slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="fade">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
              {t.title}
            </h2>
            <p className="text-lg md:text-xl text-support max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Products Grid */}
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

        {/* View All CTA */}
        <ScrollReveal animation="fade">
          <div className="text-center">
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
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
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
