'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { Locale } from '@/types';

interface HeroProps {
  locale: Locale;
}

export function Hero({ locale }: HeroProps) {
  const content = {
    fr: {
      headline: 'Commodités Agricoles Africaines Premium',
      subheadline: 'Votre partenaire de confiance pour l\'export de cacao, café, poivre, bois et maïs depuis l\'Afrique vers les marchés internationaux',
      ctaPrimary: 'Demander un Devis',
      ctaSecondary: 'Découvrir nos Produits',
    },
    en: {
      headline: 'Premium African Agricultural Commodities',
      subheadline: 'Your trusted partner for exporting cocoa, coffee, pepper, wood, and corn from Africa to international markets',
      ctaPrimary: 'Request a Quote',
      ctaSecondary: 'Explore Products',
    },
    es: {
      headline: 'Productos Agrícolas Africanos Premium',
      subheadline: 'Su socio de confianza para la exportación de cacao, café, pimienta, madera y maíz desde África a los mercados internacionales',
      ctaPrimary: 'Solicitar Cotización',
      ctaSecondary: 'Explorar Productos',
    },
    de: {
      headline: 'Premium Afrikanische Agrarprodukte',
      subheadline: 'Ihr vertrauenswürdiger Partner für den Export von Kakao, Kaffee, Pfeffer, Holz und Mais aus Afrika auf internationale Märkte',
      ctaPrimary: 'Angebot Anfordern',
      ctaSecondary: 'Produkte Entdecken',
    },
    ru: {
      headline: 'Премиальные Африканские Сельскохозяйственные Товары',
      subheadline: 'Ваш надежный партнер по экспорту какао, кофе, перца, древесины и кукурузы из Африки на международные рынки',
      ctaPrimary: 'Запросить Предложение',
      ctaSecondary: 'Изучить Продукты',
    },
  };

  const t = content[locale] || content.en; // Fallback to English if locale not found

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero.jpg"
          alt="African agricultural commodities"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={90}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal animation="fade" delay={0.2}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {t.headline}
          </h1>
        </ScrollReveal>

        <ScrollReveal animation="fade" delay={0.4}>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            {t.subheadline}
          </p>
        </ScrollReveal>

        <ScrollReveal animation="fade" delay={0.6}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Primary CTA */}
            <Link
              href={`/${locale}/rfq`}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto"
            >
              {t.ctaPrimary}
            </Link>

            {/* Secondary CTA */}
            <Link
              href={`/${locale}/products`}
              className="bg-white hover:bg-light text-primary border-2 border-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto"
            >
              {t.ctaSecondary}
            </Link>
          </div>
        </ScrollReveal>

        {/* Scroll indicator */}
        <ScrollReveal animation="fade" delay={0.8}>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
