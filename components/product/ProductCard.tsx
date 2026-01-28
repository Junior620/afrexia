'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/types';
import { urlFor } from '@/sanity/lib/image';

interface ProductCardProps {
  product: {
    _id: string;
    name: {
      fr: string;
      en: string;
      es?: string;
      de?: string;
      ru?: string;
    };
    slug: {
      fr: { current: string };
      en: { current: string };
      es?: { current: string };
      de?: { current: string };
      ru?: { current: string };
    };
    category: string;
    description: {
      fr: any;
      en: any;
      es?: any;
      de?: any;
      ru?: any;
    };
    gallery: any[];
    certifications?: Array<{
      _id: string;
      name: {
        fr: string;
        en: string;
        es?: string;
        de?: string;
        ru?: string;
      };
      logo?: any;
    }>;
    availability: string;
    moq?: string;
    incoterms?: string[];
    originRegions?: Array<{
      region: string;
      coordinates?: any;
      description?: any;
    }>;
    specificationPDF?: {
      asset?: {
        url?: string;
      };
    };
  };
  locale: Locale;
  variant?: 'standard' | 'featured';
}

export function ProductCard({ product, locale, variant = 'standard' }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const name = product.name[locale] || product.name.en;
  const slug = product.slug[locale]?.current || product.slug.en.current;
  
  // Get all images from gallery
  const galleryImages = product.gallery || [];
  const hasMultipleImages = galleryImages.length > 1;

  // Current image - higher quality
  const currentImage = galleryImages[currentImageIndex];
  const imageUrl = currentImage ? urlFor(currentImage)?.width(1200).height(900).quality(90).url() : '/assets/placeholder.svg';
  const imageAlt = currentImage?.alt || name;

  // Carousel effect on hover
  useEffect(() => {
    if (isHovered && hasMultipleImages) {
      // Start carousel - cycle through images every 1.5 seconds
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 1500);
    } else {
      // Stop carousel and reset to first image
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentImageIndex(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, hasMultipleImages, galleryImages.length]);

  // Category labels
  const categoryLabels: Record<string, { fr: string; en: string; es: string; de: string; ru: string }> = {
    cocoa: { fr: 'Cacao', en: 'Cocoa', es: 'Cacao', de: 'Kakao', ru: 'Какао' },
    coffee: { fr: 'Café', en: 'Coffee', es: 'Café', de: 'Kaffee', ru: 'Кофе' },
    pepper: { fr: 'Poivre', en: 'Pepper', es: 'Pimienta', de: 'Pfeffer', ru: 'Перец' },
    wood: { fr: 'Bois', en: 'Wood', es: 'Madera', de: 'Holz', ru: 'Древесина' },
    corn: { fr: 'Maïs', en: 'Corn', es: 'Maíz', de: 'Mais', ru: 'Кукуруза' },
  };

  const categoryLabel = categoryLabels[product.category]?.[locale] || categoryLabels[product.category]?.en || product.category;

  // B2B Info labels
  const b2bLabels = {
    fr: {
      requestQuote: 'Demander un devis',
      specSheet: 'Fiche technique',
      viewDetails: 'Voir détails',
      traceable: 'Traçable',
      eudrReady: 'EUDR Ready',
      certified: 'Certifié',
      availableNow: 'Disponible',
      seasonal: 'Saisonnier',
      preOrder: 'Pré-commande',
      onRequest: 'Sur demande',
      multiOrigin: 'Multi-origine',
      flexible: 'Flexible',
      premiumGrade: 'Qualité Premium',
      origin: 'Origine',
      moqLabel: 'MOQ',
      incotermsLabel: 'Incoterms',
      responseTime: 'Réponse sous 24h',
    },
    en: {
      requestQuote: 'Request Quote',
      specSheet: 'Spec Sheet',
      viewDetails: 'View Details',
      traceable: 'Traceable',
      eudrReady: 'EUDR Ready',
      certified: 'Certified',
      availableNow: 'Available',
      seasonal: 'Seasonal',
      preOrder: 'Pre-Order',
      onRequest: 'On Request',
      multiOrigin: 'Multi-origin',
      flexible: 'Flexible',
      premiumGrade: 'Premium Grade',
      origin: 'Origin',
      moqLabel: 'MOQ',
      incotermsLabel: 'Incoterms',
      responseTime: 'Reply within 24h',
    },
    es: {
      requestQuote: 'Solicitar Cotización',
      specSheet: 'Ficha Técnica',
      viewDetails: 'Ver Detalles',
      traceable: 'Trazable',
      eudrReady: 'EUDR Ready',
      certified: 'Certificado',
      availableNow: 'Disponible',
      seasonal: 'Estacional',
      preOrder: 'Pre-Pedido',
      onRequest: 'Bajo Pedido',
      multiOrigin: 'Multi-origen',
      flexible: 'Flexible',
      premiumGrade: 'Calidad Premium',
      origin: 'Origen',
      moqLabel: 'MOQ',
      incotermsLabel: 'Incoterms',
      responseTime: 'Respuesta en 24h',
    },
    de: {
      requestQuote: 'Angebot Anfordern',
      specSheet: 'Datenblatt',
      viewDetails: 'Details Ansehen',
      traceable: 'Rückverfolgbar',
      eudrReady: 'EUDR Ready',
      certified: 'Zertifiziert',
      availableNow: 'Verfügbar',
      seasonal: 'Saisonal',
      preOrder: 'Vorbestellung',
      onRequest: 'Auf Anfrage',
      multiOrigin: 'Multi-Herkunft',
      flexible: 'Flexibel',
      premiumGrade: 'Premium-Qualität',
      origin: 'Herkunft',
      moqLabel: 'MOQ',
      incotermsLabel: 'Incoterms',
      responseTime: 'Antwort in 24h',
    },
    ru: {
      requestQuote: 'Запросить Предложение',
      specSheet: 'Спецификация',
      viewDetails: 'Подробнее',
      traceable: 'Отслеживаемый',
      eudrReady: 'EUDR Ready',
      certified: 'Сертифицировано',
      availableNow: 'Доступно',
      seasonal: 'Сезонный',
      preOrder: 'Предзаказ',
      onRequest: 'По запросу',
      multiOrigin: 'Мульти-происхождение',
      flexible: 'Гибкий',
      premiumGrade: 'Премиум Качество',
      origin: 'Происхождение',
      moqLabel: 'MOQ',
      incotermsLabel: 'Incoterms',
      responseTime: 'Ответ в течение 24ч',
    },
  };

  const t = b2bLabels[locale] || b2bLabels.en;

  // SMART FALLBACKS - No "—" allowed!
  
  // Origin with fallback
  const origin = product.originRegions?.[0]?.region || t.multiOrigin;

  // MOQ with fallback
  const moq = product.moq || t.onRequest;

  // Incoterms with fallback
  const incoterms = product.incoterms?.slice(0, 2).join('/') || t.flexible;

  // Availability with smart text and styling (more subtle colors)
  const availabilityConfig = {
    in_stock: { 
      text: t.availableNow, 
      color: 'bg-[#337A49]/80 text-white',
      icon: '●'
    },
    seasonal: { 
      text: t.seasonal, 
      color: 'bg-[#655E2C]/80 text-white',
      icon: '●'
    },
    pre_order: { 
      text: t.preOrder, 
      color: 'bg-[#80996F]/80 text-white',
      icon: '●'
    },
    out_of_stock: { 
      text: t.onRequest, 
      color: 'bg-neutral/60 dark:bg-neutral/50 text-white',
      icon: '●'
    },
  };

  const availability = availabilityConfig[product.availability as keyof typeof availabilityConfig] || availabilityConfig.in_stock;

  // Compliance badges (smaller, more discrete)
  const complianceBadges = [];
  
  // Check if traceable (has origin regions)
  if (product.originRegions && product.originRegions.length > 0) {
    complianceBadges.push({
      label: t.traceable,
      icon: '✓',
    });
  }
  
  // Always show EUDR Ready for commodities
  complianceBadges.push({
    label: t.eudrReady,
    icon: '',
  });

  // Limit to 1 badge for cleaner look
  const displayBadges = complianceBadges.slice(0, 1);

  // Trust chips (certifications)
  const trustChips = [];
  if (product.certifications && product.certifications.length > 0) {
    product.certifications.slice(0, 3).forEach((cert) => {
      const certName = typeof cert.name === 'object' 
        ? (cert.name[locale] || cert.name.en)
        : cert.name;
      trustChips.push(certName);
    });
  }

  // Subtitle generation (category + grade)
  const subtitle = `${categoryLabel} • ${t.premiumGrade}`;

  // PDF URL
  const pdfUrl = product.specificationPDF?.asset?.url;

  return (
    <div 
      className="group relative bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 animate-float"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image with Enhanced Gradient Overlay - 4:3 ratio */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          key={currentImageIndex} // Force re-render on image change
          src={imageUrl || '/assets/placeholder.svg'}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-all duration-700"
        />
        
        {/* Lighter gradient overlay - only at bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

        {/* Image counter indicator (if multiple images) */}
        {hasMultipleImages && isHovered && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-md text-[9px] font-semibold z-20">
            {currentImageIndex + 1} / {galleryImages.length}
          </div>
        )}

        {/* Top Row: Compliance Badge (Left) + Availability Status (Right) - Smaller */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2 z-10">
          {/* Left: Single compliance badge (smaller) */}
          {displayBadges.map((badge, index) => (
            <span
              key={index}
              className="bg-[#194424]/80 dark:bg-[#194424]/85 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[10px] font-semibold border border-white/10 shadow-sm flex items-center gap-1"
            >
              {badge.icon && <span className="text-[8px]">{badge.icon}</span>}
              <span>{badge.label}</span>
            </span>
          ))}
          
          {/* Right: Availability status (smaller, more subtle) */}
          <span className={`${availability.color} backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-semibold shadow-sm whitespace-nowrap flex items-center gap-1`}>
            <span className="text-[6px]">{availability.icon}</span>
            <span>{availability.text}</span>
          </span>
        </div>

        {/* Content Overlay - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          {/* Title + Subtitle */}
          <div className="mb-3">
            <h3 className="text-2xl font-bold text-white mb-0.5 line-clamp-1 tracking-tight">
              {name}
            </h3>
            <p className="text-xs text-white/80 font-medium line-clamp-1">
              {subtitle}
            </p>
          </div>

          {/* Trust Chips (Certifications) - if available */}
          {trustChips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {trustChips.map((chip, index) => (
                <span
                  key={index}
                  className="bg-white/15 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[9px] font-semibold border border-white/10"
                >
                  ✓ {chip}
                </span>
              ))}
            </div>
          )}

          {/* Decision Data - 3 columns with stronger values */}
          <div className="bg-black/50 backdrop-blur-md rounded-xl p-3 mb-3 border border-white/10">
            <div className="grid grid-cols-3 gap-2.5 text-white">
              {/* Origin */}
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider text-white/50 font-semibold mb-0.5">
                  {t.origin}
                </span>
                <span className="text-sm font-bold line-clamp-1">
                  {origin}
                </span>
              </div>
              
              {/* MOQ */}
              <div className="flex flex-col border-l border-white/10 pl-2.5">
                <span className="text-[9px] uppercase tracking-wider text-white/50 font-semibold mb-0.5">
                  {t.moqLabel}
                </span>
                <span className="text-sm font-bold line-clamp-1">
                  {moq}
                </span>
              </div>
              
              {/* Incoterms */}
              <div className="flex flex-col border-l border-white/10 pl-2.5">
                <span className="text-[9px] uppercase tracking-wider text-white/50 font-semibold mb-0.5">
                  {t.incotermsLabel}
                </span>
                <span className="text-sm font-bold line-clamp-1">
                  {incoterms}
                </span>
              </div>
            </div>
          </div>

          {/* Actions: Primary + Secondary CTAs */}
          <div className="space-y-2">
            {/* Primary CTA */}
            <Link
              href={`/${locale}/rfq?product=${slug}`}
              className="w-full bg-[#194424] hover:bg-[#194424]/90 dark:bg-[#337A49] dark:hover:bg-[#337A49]/90 text-white px-4 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {t.requestQuote}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Secondary CTA + Micro-proof */}
            <div className="flex items-center justify-between gap-2">
              {/* Secondary CTA - Spec Sheet or View Details */}
              {pdfUrl ? (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-transparent hover:bg-white/10 border border-white/30 hover:border-white/50 text-white px-3 py-2 rounded-lg font-medium text-xs inline-flex items-center justify-center gap-1.5 transition-all duration-200"
                  title={t.specSheet}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{t.specSheet}</span>
                </a>
              ) : (
                <Link
                  href={`/${locale}/products/${slug}`}
                  className="flex-1 bg-transparent hover:bg-white/10 border border-white/30 hover:border-white/50 text-white px-3 py-2 rounded-lg font-medium text-xs inline-flex items-center justify-center gap-1.5 transition-all duration-200"
                  title={t.viewDetails}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t.viewDetails}</span>
                </Link>
              )}

              {/* Micro-proof */}
              <span className="text-white/70 text-[9px] font-medium whitespace-nowrap">
                {t.responseTime}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
