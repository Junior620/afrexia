'use client';

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
  };
  locale: Locale;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const name = product.name[locale] || product.name.en;
  const slug = product.slug[locale]?.current || product.slug.en.current;
  
  // Extract plain text from block content description
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
        .slice(0, 100) + '...';
    }
    return '';
  };

  const description = getDescriptionText(product.description[locale] || product.description.en);
  
  // Get first image from gallery
  const mainImage = product.gallery?.[0];
  const imageUrl = mainImage ? urlFor(mainImage)?.width(600).height(400).url() : '/assets/placeholder.svg';
  const imageAlt = mainImage?.alt || name;

  // Availability badge
  const availabilityLabels: Record<string, { fr: string; en: string; es: string; de: string; ru: string; color: string }> = {
    in_stock: { 
      fr: 'En stock', 
      en: 'In Stock', 
      es: 'En Stock',
      de: 'Auf Lager',
      ru: 'В наличии',
      color: 'bg-success/10 text-success border border-success/20' 
    },
    pre_order: { 
      fr: 'Pré-commande', 
      en: 'Pre-Order', 
      es: 'Pre-Pedido',
      de: 'Vorbestellung',
      ru: 'Предзаказ',
      color: 'bg-info/10 text-info border border-info/20' 
    },
    seasonal: { 
      fr: 'Saisonnier', 
      en: 'Seasonal', 
      es: 'Estacional',
      de: 'Saisonal',
      ru: 'Сезонный',
      color: 'bg-warning/10 text-warning border border-warning/20' 
    },
    out_of_stock: { 
      fr: 'Rupture', 
      en: 'Out of Stock', 
      es: 'Agotado',
      de: 'Ausverkauft',
      ru: 'Нет в наличии',
      color: 'bg-muted/10 text-muted-foreground border border-muted/20' 
    },
  };

  const availabilityInfo = availabilityLabels[product.availability] || availabilityLabels.in_stock;
  const availabilityLabel = availabilityInfo[locale] || availabilityInfo.en;

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
      origin: 'Origine',
      moq: 'MOQ',
      incoterms: 'Incoterms',
      requestQuote: 'Demander un devis',
      specSheet: 'Fiche technique',
    },
    en: {
      origin: 'Origin',
      moq: 'MOQ',
      incoterms: 'Incoterms',
      requestQuote: 'Request Quote',
      specSheet: 'Spec Sheet',
    },
    es: {
      origin: 'Origen',
      moq: 'MOQ',
      incoterms: 'Incoterms',
      requestQuote: 'Solicitar Cotización',
      specSheet: 'Ficha Técnica',
    },
    de: {
      origin: 'Herkunft',
      moq: 'MOQ',
      incoterms: 'Incoterms',
      requestQuote: 'Angebot Anfordern',
      specSheet: 'Datenblatt',
    },
    ru: {
      origin: 'Происхождение',
      moq: 'MOQ',
      incoterms: 'Инкотермс',
      requestQuote: 'Запросить Предложение',
      specSheet: 'Спецификация',
    },
  };

  const t = b2bLabels[locale] || b2bLabels.en;

  // Get origin (first region)
  const origin = product.originRegions?.[0]?.region || null;

  // Get incoterms (first 2)
  const incoterms = product.incoterms?.slice(0, 2).join(', ') || null;

  return (
    <div className="group bg-white dark:bg-dark-bg-secondary rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-neutral/10 dark:border-dark-border/20">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted dark:bg-dark-bg-tertiary">
        <Image
          src={imageUrl || '/assets/placeholder.svg'}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Availability badge - premium style */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${availabilityInfo.color}`}>
            {availabilityLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Category */}
        <div className="text-xs uppercase tracking-wider text-primary dark:text-dark-primary font-semibold mb-2">
          {categoryLabel}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-foreground dark:text-dark-text-primary mb-2 group-hover:text-primary dark:group-hover:text-dark-primary transition-colors line-clamp-2">
          {name}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground dark:text-dark-text-muted text-sm mb-4 line-clamp-2 flex-grow">
          {description}
        </p>

        {/* B2B Specs - 3 key infos */}
        <div className="mb-4 space-y-2 text-sm">
          {origin && (
            <div className="flex items-center gap-2 text-neutral dark:text-dark-text-secondary">
              <svg className="w-4 h-4 text-primary dark:text-dark-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium text-xs">{t.origin}:</span>
              <span className="text-foreground dark:text-dark-text-primary font-semibold">{origin}</span>
            </div>
          )}
          {product.moq && (
            <div className="flex items-center gap-2 text-neutral dark:text-dark-text-secondary">
              <svg className="w-4 h-4 text-primary dark:text-dark-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="font-medium text-xs">{t.moq}:</span>
              <span className="text-foreground dark:text-dark-text-primary font-semibold">{product.moq}</span>
            </div>
          )}
          {incoterms && (
            <div className="flex items-center gap-2 text-neutral dark:text-dark-text-secondary">
              <svg className="w-4 h-4 text-primary dark:text-dark-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium text-xs">{t.incoterms}:</span>
              <span className="text-foreground dark:text-dark-text-primary font-semibold">{incoterms}</span>
            </div>
          )}
        </div>

        {/* Certifications badges */}
        {product.certifications && product.certifications.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {product.certifications.slice(0, 3).map((cert) => {
              const certName = typeof cert.name === 'object' ? (cert.name[locale] || cert.name.en) : cert.name;
              return (
                <div
                  key={cert._id}
                  className="inline-flex items-center gap-1.5 bg-light dark:bg-dark-bg-tertiary rounded-md px-2 py-1 border border-neutral/10 dark:border-dark-border/20"
                  title={certName}
                >
                  {cert.logo && (
                    <Image
                      src={urlFor(cert.logo)?.width(24).height(24).url() || ''}
                      alt={certName}
                      width={14}
                      height={14}
                      className="object-contain"
                    />
                  )}
                  <span className="text-xs font-medium text-foreground dark:text-dark-text-primary">{certName}</span>
                </div>
              );
            })}
            {product.certifications.length > 3 && (
              <span className="text-xs text-muted-foreground dark:text-dark-text-muted self-center">
                +{product.certifications.length - 3}
              </span>
            )}
          </div>
        )}

        {/* CTAs - B2B style */}
        <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-4 border-t border-neutral/10 dark:border-dark-border/20">
          <Link
            href={`/${locale}/rfq?product=${slug}`}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark dark:bg-dark-primary dark:hover:bg-dark-primary/90 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {t.requestQuote}
          </Link>
          <Link
            href={`/${locale}/products/${slug}`}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-white dark:bg-dark-bg-tertiary hover:bg-light dark:hover:bg-dark-bg-primary text-primary dark:text-dark-primary border border-primary/20 dark:border-dark-primary/20 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t.specSheet}
          </Link>
        </div>
      </div>
    </div>
  );
}
