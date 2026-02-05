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
      requestQuoteMicro: 'Réponse sous 24h',
      downloadCatalogue: 'Télécharger le catalogue',
      downloadCatalogueMicro: 'PDF – specs & origines',
      ctaPrompt: 'Besoin d\'un devis rapide ou d\'une fiche produit ?',
      noProducts: 'Aucun produit disponible pour le moment',
    },
    en: {
      title: 'Our Premium Products',
      subtitle: 'Discover our selection of high-quality African agricultural commodities',
      viewAll: 'View All Products',
      requestQuote: 'Request a Quote',
      requestQuoteMicro: 'Reply within 24h',
      downloadCatalogue: 'Download Catalogue',
      downloadCatalogueMicro: 'PDF – specs & origins',
      ctaPrompt: 'Need a quick quote or product sheet?',
      noProducts: 'No products available at the moment',
    },
    es: {
      title: 'Nuestros Productos Premium',
      subtitle: 'Descubra nuestra selección de productos agrícolas africanos de alta calidad',
      viewAll: 'Ver Todos los Productos',
      requestQuote: 'Solicitar Cotización',
      requestQuoteMicro: 'Respuesta en 24h',
      downloadCatalogue: 'Descargar Catálogo',
      downloadCatalogueMicro: 'PDF – specs y orígenes',
      ctaPrompt: '¿Necesita una cotización rápida o ficha de producto?',
      noProducts: 'No hay productos disponibles en este momento',
    },
    de: {
      title: 'Unsere Premium-Produkte',
      subtitle: 'Entdecken Sie unsere Auswahl an hochwertigen afrikanischen Agrarprodukten',
      viewAll: 'Alle Produkte Ansehen',
      requestQuote: 'Angebot Anfordern',
      requestQuoteMicro: 'Antwort in 24h',
      downloadCatalogue: 'Katalog Herunterladen',
      downloadCatalogueMicro: 'PDF – Specs & Herkunft',
      ctaPrompt: 'Benötigen Sie ein schnelles Angebot oder Datenblatt?',
      noProducts: 'Derzeit keine Produkte verfügbar',
    },
    ru: {
      title: 'Наши Премиальные Продукты',
      subtitle: 'Откройте для себя наш ассортимент высококачественных африканских сельскохозяйственных товаров',
      viewAll: 'Посмотреть Все Продукты',
      requestQuote: 'Запросить Предложение',
      requestQuoteMicro: 'Ответ в течение 24ч',
      downloadCatalogue: 'Скачать Каталог',
      downloadCatalogueMicro: 'PDF – спецификации и происхождение',
      ctaPrompt: 'Нужно быстрое предложение или спецификация продукта?',
      noProducts: 'В настоящее время нет доступных продуктов',
    },
  };

  const t = content[locale] || content.en;

  // Show first 3 products as featured on homepage
  const featuredProducts = products.slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-dark-bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="fade">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-dark-primary mb-4">
              {t.title}
            </h2>
            <p className="text-lg md:text-xl text-neutral dark:text-dark-text-secondary max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Trust Bar - B2B Proof */}
        <ScrollReveal animation="fade">
          <div className="bg-light dark:bg-dark-bg-secondary rounded-xl p-6 mb-12 border border-neutral/10 dark:border-dark-border/20">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-neutral dark:text-dark-text-secondary">
                <svg className="w-5 h-5 text-primary dark:text-dark-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="font-semibold text-foreground dark:text-dark-text-primary">
                  {locale === 'fr' ? '8+ Certifications' : locale === 'es' ? '8+ Certificaciones' : locale === 'de' ? '8+ Zertifizierungen' : locale === 'ru' ? '8+ Сертификатов' : '8+ Certifications'}
                </span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-neutral/20 dark:bg-dark-border/20"></div>
              <div className="flex items-center gap-2 text-neutral dark:text-dark-text-secondary">
                <svg className="w-5 h-5 text-primary dark:text-dark-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span className="font-semibold text-foreground dark:text-dark-text-primary">
                  {locale === 'fr' ? '100% Traçabilité' : locale === 'es' ? '100% Trazabilidad' : locale === 'de' ? '100% Rückverfolgbarkeit' : locale === 'ru' ? '100% Отслеживаемость' : '100% Traceability'}
                </span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-neutral/20 dark:bg-dark-border/20"></div>
              <div className="flex items-center gap-2 text-neutral dark:text-dark-text-secondary">
                <svg className="w-5 h-5 text-primary dark:text-dark-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-semibold text-foreground dark:text-dark-text-primary">
                  {locale === 'fr' ? 'Documentation QA' : locale === 'es' ? 'Documentación QA' : locale === 'de' ? 'QA-Dokumentation' : locale === 'ru' ? 'Документация QA' : 'QA Documentation'}
                </span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-neutral/20 dark:bg-dark-border/20"></div>
              <div className="flex items-center gap-2 text-neutral dark:text-dark-text-secondary">
                <svg className="w-5 h-5 text-primary dark:text-dark-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-foreground dark:text-dark-text-primary">
                  {locale === 'fr' ? 'EUDR-Ready' : locale === 'es' ? 'EUDR-Ready' : locale === 'de' ? 'EUDR-Ready' : locale === 'ru' ? 'EUDR-Ready' : 'EUDR-Ready'}
                </span>
              </div>
            </div>
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

            {/* CTAs Row with Prompt */}
            <ScrollReveal animation="fade">
              <div className="text-center space-y-6">
                {/* Prompt text */}
                <p className="text-base md:text-lg text-neutral dark:text-dark-text-secondary font-medium">
                  {t.ctaPrompt}
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-start">
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
                  
                  <div className="flex flex-col items-center gap-1">
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
                    <span className="text-xs text-neutral/70 dark:text-dark-text-secondary/70">
                      {t.requestQuoteMicro}
                    </span>
                  </div>
                </div>
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
