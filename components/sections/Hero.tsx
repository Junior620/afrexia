'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { Locale } from '@/types';
import { useState, useEffect } from 'react';

interface HeroProps {
  locale: Locale;
}

export function Hero({ locale }: HeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Array of hero images - add more images as needed
  const heroImages = [
    '/assets/hero-1.jpg',
    '/assets/hero-2.jpg',
    '/assets/hero-3.jpg',
    '/assets/hero-4.jpg',
  ];

  // Auto-rotate images every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [heroImages.length]);
  const content = {
    fr: {
      headline: 'Connecter l\'Afrique aux marchés mondiaux',
      subheadline: 'Nous sommes une entreprise mondiale de sourcing et de négoce de produits agricoles, autonomisant les agriculteurs et créant un impact socio-économique grâce à des partenariats stratégiques, l\'innovation et l\'expertise sectorielle.',
      ctaPrimary: 'Voir nos produits',
      ctaSecondary: 'Nous contacter',
    },
    en: {
      headline: 'Connecting Africa to global markets',
      subheadline: 'We are a global agro-commodities sourcing and trading company empowering farmers and creating socio-economic impact through strategic partnerships, innovation, and industry expertise.',
      ctaPrimary: 'See our products',
      ctaSecondary: 'Contact us',
    },
    es: {
      headline: 'Conectando África con los mercados globales',
      subheadline: 'Somos una empresa global de abastecimiento y comercio de productos agrícolas, empoderando a los agricultores y creando impacto socioeconómico a través de asociaciones estratégicas, innovación y experiencia en la industria.',
      ctaPrimary: 'Ver nuestros productos',
      ctaSecondary: 'Contáctenos',
    },
    de: {
      headline: 'Afrika mit globalen Märkten verbinden',
      subheadline: 'Wir sind ein globales Unternehmen für Beschaffung und Handel von Agrarprodukten, das Landwirte stärkt und sozioökonomische Auswirkungen durch strategische Partnerschaften, Innovation und Branchenexpertise schafft.',
      ctaPrimary: 'Unsere Produkte ansehen',
      ctaSecondary: 'Kontaktieren Sie uns',
    },
    ru: {
      headline: 'Соединяя Африку с мировыми рынками',
      subheadline: 'Мы являемся глобальной компанией по закупке и торговле сельскохозяйственными товарами, расширяющей возможности фермеров и создающей социально-экономическое воздействие через стратегические партнерства, инновации и отраслевой опыт.',
      ctaPrimary: 'Посмотреть наши продукты',
      ctaSecondary: 'Свяжитесь с нами',
    },
  };

  const t = content[locale] || content.en;

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-sand dark:bg-dark-bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            <ScrollReveal animation="fade" delay={0.1}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-primary dark:text-dark-primary mb-6 leading-[1.1]">
                {t.headline}
              </h1>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={0.3}>
              <p className="text-base sm:text-lg text-neutral dark:text-dark-text-secondary mb-8 max-w-xl leading-relaxed">
                {t.subheadline}
              </p>
            </ScrollReveal>

            {/* Buttons without ScrollReveal - visible immediately */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${locale}/products`}
                className="inline-flex items-center justify-center bg-accent hover:bg-accent-dark text-white px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {t.ctaPrimary}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center bg-transparent hover:bg-primary/5 dark:hover:bg-dark-primary/10 text-primary dark:text-dark-primary border-2 border-primary dark:border-dark-primary px-8 py-4 rounded-full font-semibold text-base transition-all duration-300"
              >
                {t.ctaSecondary}
              </Link>
            </div>
          </div>

          {/* Right Image with Organic Blob Shape */}
          <div className="relative lg:block">
            <div className="relative">
              {/* Animated gradient background */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-secondary/15 to-primary/20 blur-3xl animate-pulse" />
              </div>

              {/* Main product image with organic blob shape */}
              <div className="relative aspect-square overflow-hidden shadow-2xl"
                   style={{
                     borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                   }}>
                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-secondary/10 z-10 pointer-events-none" />
                
                {/* Carousel Images */}
                <div className="relative w-full h-full">
                  {heroImages.map((image, index) => (
                    <div
                      key={image}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`African agricultural products ${index + 1}`}
                        fill
                        priority={index === 0}
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        quality={90}
                      />
                    </div>
                  ))}
                </div>

                {/* Subtle overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>

              {/* Carousel indicators */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-accent w-8' 
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>

              {/* Decorative floating elements */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-accent to-secondary rounded-full opacity-20 blur-2xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-primary to-accent rounded-full opacity-15 blur-3xl -z-10" />
              
              {/* Small accent dots */}
              <div className="absolute top-16 right-16 w-3 h-3 bg-accent rounded-full shadow-lg shadow-accent/50" />
              <div className="absolute bottom-20 left-20 w-2 h-2 bg-secondary rounded-full shadow-lg shadow-secondary/50" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <ScrollReveal animation="fade" delay={0.8}>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden lg:block">
          <svg
            className="w-6 h-6 text-primary dark:text-dark-primary"
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
    </section>
  );
}
