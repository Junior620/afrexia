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
    '/assets/hero.jpg',
    '/assets/hero-2.jpg',
    '/assets/hero-3.jpg',
    '/assets/hero-4.jpg',
    '/assets/hero-5.jpg',
    '/assets/hero-6.jpg',
    '/assets/hero-7.jpg',
    '/assets/hero-8.jpg',
    '/assets/hero-9.jpg',
    '/assets/hero-10.jpg',
    '/assets/hero-11.jpg',
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
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large pulse particles */}
        <div className="absolute top-[10%] left-[5%] w-40 h-40 bg-accent/10 dark:bg-dark-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-[20%] right-[10%] w-48 h-48 bg-secondary/8 dark:bg-dark-primary/8 rounded-full blur-3xl animate-pulse-delayed-1" />
        <div className="absolute bottom-[15%] left-[15%] w-44 h-44 bg-primary/12 dark:bg-dark-primary/12 rounded-full blur-3xl animate-pulse-delayed-2" />
        <div className="absolute bottom-[25%] right-[8%] w-36 h-36 bg-accent/10 dark:bg-dark-primary/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Floating Decorative Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[8%] w-3 h-3 border-2 border-accent/40 dark:border-dark-primary/40 rounded-full animate-bounce" />
        <div className="absolute top-[35%] right-[12%] w-2 h-2 border-2 border-secondary/50 dark:border-dark-primary/50 rounded-full animate-bounce-delayed-1" />
        <div className="absolute bottom-[20%] left-[10%] w-2.5 h-2.5 border-2 border-primary/45 dark:border-dark-primary/45 rounded-full animate-bounce-delayed-2" />
        <div className="absolute bottom-[40%] right-[18%] w-3 h-3 border-2 border-accent/40 dark:border-dark-primary/40 rounded-full animate-bounce" />
      </div>

      {/* Decorative Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 dark:via-dark-primary/30 to-transparent animate-fadeInUp" />
        {/* Bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 dark:via-dark-primary/30 to-transparent animate-fadeInUp-delayed-1" />
      </div>

      {/* Responsive container with proper padding at each breakpoint */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[100%] sm:max-w-[720px] md:max-w-[960px] lg:max-w-[1200px]">
        {/* Vertical stack on mobile, horizontal on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            <ScrollReveal animation="fade" delay={0.1}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary dark:text-dark-primary mb-6 leading-[1.1]">
                {t.headline}
              </h1>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={0.3}>
              <p className="text-base sm:text-lg text-neutral dark:text-dark-text-secondary mb-8 max-w-xl leading-relaxed">
                {t.subheadline}
              </p>
            </ScrollReveal>

            {/* Buttons with animations */}
            <div className="flex flex-col sm:flex-row gap-4 animate-scaleIn-delayed-2">
              <Link
                href={`/${locale}/products`}
                className="inline-flex items-center justify-center bg-accent hover:bg-accent-dark dark:bg-dark-primary dark:hover:bg-dark-primary/90 text-white px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 relative overflow-hidden group"
              >
                <span className="relative z-10">{t.ctaPrimary}</span>
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center bg-transparent hover:bg-primary/5 dark:hover:bg-dark-primary/10 text-primary dark:text-dark-primary border-2 border-primary dark:border-dark-primary px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 relative group"
              >
                <span className="relative z-10">{t.ctaSecondary}</span>
                {/* Border glow on hover */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_15px_rgba(74,154,98,0.5)]" />
              </Link>
            </div>
          </div>

          {/* Right Image with Organic Blob Shape - Matching original design */}
          <div className="relative lg:block lg:translate-x-24 xl:translate-x-40 lg:scale-125 xl:scale-150 animate-fadeInUp-delayed-1">
            <div className="relative">
              {/* Animated gradient background */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-secondary/15 to-primary/20 dark:from-dark-primary/20 dark:via-dark-primary/15 dark:to-dark-primary/20 blur-3xl animate-pulse" />
              </div>

              {/* Main product image with organic blob shape - Large circular form */}
              <div className="relative w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] md:w-[700px] md:h-[700px] lg:w-[650px] lg:h-[650px] xl:w-[750px] xl:h-[750px] overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-105"
                   style={{
                     borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                   }}>
                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-secondary/10 dark:from-dark-primary/10 dark:to-dark-primary/10 z-10 pointer-events-none" />
                
                {/* Carousel Images with priority loading */}
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
                        priority={index === 0} // Priority loading for first hero image
                        className="object-cover object-center"
                        sizes="(max-width: 640px) 500px, (max-width: 768px) 600px, (max-width: 1024px) 700px, (max-width: 1280px) 650px, 750px"
                        quality={95}
                      />
                    </div>
                  ))}
                </div>

                {/* Subtle overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                
                {/* Animated pulse ring */}
                <div className="absolute inset-0 rounded-[60%_40%_30%_70%_/_60%_30%_70%_40%] border-2 border-accent/30 dark:border-dark-primary/30 animate-pulse" />
              </div>

              {/* Carousel indicators */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-accent dark:bg-dark-primary w-8 animate-pulse' 
                        : 'bg-white/50 hover:bg-white/80 dark:bg-dark-text-secondary/50 dark:hover:bg-dark-text-secondary/80'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>

              {/* Decorative floating elements with animations */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-accent to-secondary dark:from-dark-primary dark:to-dark-primary/80 rounded-full opacity-20 blur-2xl -z-10 animate-pulse-delayed-1" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-primary to-accent dark:from-dark-primary dark:to-dark-primary/80 rounded-full opacity-15 blur-3xl -z-10 animate-pulse-delayed-2" />
              
              {/* Small accent dots with animations */}
              <div className="absolute top-16 right-16 w-3 h-3 bg-accent dark:bg-dark-primary rounded-full shadow-lg shadow-accent/50 dark:shadow-dark-primary/50 animate-bounce" />
              <div className="absolute bottom-20 left-20 w-2 h-2 bg-secondary dark:bg-dark-primary rounded-full shadow-lg shadow-secondary/50 dark:shadow-dark-primary/50 animate-bounce-delayed-1" />
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
