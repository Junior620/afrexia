'use client';

import { CounterAnimation } from '@/components/animations/CounterAnimation';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { Locale } from '@/types';
import Link from 'next/link';
import { urlForImage } from '@/sanity/lib/image';

interface StatisticsProps {
  locale: Locale;
  trackRecordImage?: any;
}

interface Stat {
  value: number;
  suffix: string;
  label: {
    fr: string;
    en: string;
    es: string;
    de: string;
    ru: string;
  };
  context: {
    fr: string;
    en: string;
    es: string;
    de: string;
    ru: string;
  };
  icon: string;
}

export function Statistics({ locale, trackRecordImage }: StatisticsProps) {
  const stats: Stat[] = [
    {
      value: 15,
      suffix: '+',
      label: {
        fr: 'Années d\'Expérience',
        en: 'Years of Experience',
        es: 'Años de Experiencia',
        de: 'Jahre Erfahrung',
        ru: 'Лет Опыта',
      },
      context: {
        fr: 'Depuis 2009',
        en: 'Since 2009',
        es: 'Desde 2009',
        de: 'Seit 2009',
        ru: 'С 2009 года',
      },
      icon: 'clock',
    },
    {
      value: 10000,
      suffix: '+',
      label: {
        fr: 'Tonnes Exportées',
        en: 'Tons Exported',
        es: 'Toneladas Exportadas',
        de: 'Exportierte Tonnen',
        ru: 'Тонн Экспортировано',
      },
      context: {
        fr: 'Capacité annuelle (cacao, café)',
        en: 'Annual capacity (cocoa, coffee)',
        es: 'Capacidad anual (cacao, café)',
        de: 'Jahreskapazität (Kakao, Kaffee)',
        ru: 'Годовая мощность (какао, кофе)',
      },
      icon: 'scale',
    },
    {
      value: 25,
      suffix: '+',
      label: {
        fr: 'Pays Desservis',
        en: 'Countries Served',
        es: 'Países Atendidos',
        de: 'Bediente Länder',
        ru: 'Обслуживаемых Стран',
      },
      context: {
        fr: 'Europe, MENA, Asie',
        en: 'Europe, MENA, Asia',
        es: 'Europa, MENA, Asia',
        de: 'Europa, MENA, Asien',
        ru: 'Европа, MENA, Азия',
      },
      icon: 'globe',
    },
    {
      value: 8,
      suffix: '+',
      label: {
        fr: 'Certifications',
        en: 'Certifications',
        es: 'Certificaciones',
        de: 'Zertifizierungen',
        ru: 'Сертификатов',
      },
      context: {
        fr: 'Internationales (EUDR, QA, Traçabilité)',
        en: 'International (EUDR, QA, Traceability)',
        es: 'Internacionales (EUDR, QA, Trazabilidad)',
        de: 'International (EUDR, QA, Rückverfolgbarkeit)',
        ru: 'Международных (EUDR, QA, Отслеживаемость)',
      },
      icon: 'certificate',
    },
  ];

  const content = {
    fr: {
      eyebrow: 'AFREXIA EXPORT — DEPUIS 2009',
      title: 'Excellence d\'Export, Prouvée',
      lead: 'Cacao & café premium — origines tracées, QA documentée, expédition maîtrisée.',
      imageCaption: 'Contrôle qualité & traçabilité sur site',
      ctaPrimary: 'Demander un devis',
      ctaSecondary: 'Télécharger le catalogue',
      ctaMicro: 'Réponse sous 24h • NDA possible • Specs & origines',
      statsLinks: {
        certifications: 'Voir nos certificats & audits',
        capacity: 'Capacité & lead times',
        countries: 'Routes & incoterms',
      },
      trustBar: [
        'EUDR-ready',
        'QA documentée',
        'Chaîne de custody',
        'Incoterms flexibles',
        'Multi-origine',
      ],
    },
    en: {
      eyebrow: 'AFREXIA EXPORT — SINCE 2009',
      title: 'Proven Export Excellence',
      lead: 'Premium cocoa & coffee — traceable origins, documented QA, reliable execution.',
      imageCaption: 'Quality control & traceability on-site',
      ctaPrimary: 'Request a Quote',
      ctaSecondary: 'Download Catalogue',
      ctaMicro: 'Reply within 24h • NDA available • Specs & origins',
      statsLinks: {
        certifications: 'View our certificates & audits',
        capacity: 'Capacity & lead times',
        countries: 'Routes & incoterms',
      },
      trustBar: [
        'EUDR-ready',
        'QA documented',
        'Chain of custody',
        'Flexible Incoterms',
        'Multi-origin',
      ],
    },
    es: {
      eyebrow: 'AFREXIA EXPORT — DESDE 2009',
      title: 'Excelencia de Exportación, Probada',
      lead: 'Cacao y café premium — orígenes rastreables, QA documentado, ejecución confiable.',
      imageCaption: 'Control de calidad y trazabilidad en sitio',
      ctaPrimary: 'Solicitar Cotización',
      ctaSecondary: 'Descargar Catálogo',
      ctaMicro: 'Respuesta en 24h • NDA disponible • Specs y orígenes',
      statsLinks: {
        certifications: 'Ver nuestros certificados y auditorías',
        capacity: 'Capacidad y plazos',
        countries: 'Rutas e incoterms',
      },
      trustBar: [
        'EUDR-ready',
        'QA documentado',
        'Cadena de custodia',
        'Incoterms flexibles',
        'Multi-origen',
      ],
    },
    de: {
      eyebrow: 'AFREXIA EXPORT — SEIT 2009',
      title: 'Bewährte Export-Exzellenz',
      lead: 'Premium Kakao & Kaffee — rückverfolgbare Herkunft, dokumentierte QA, zuverlässige Ausführung.',
      imageCaption: 'Qualitätskontrolle & Rückverfolgbarkeit vor Ort',
      ctaPrimary: 'Angebot Anfordern',
      ctaSecondary: 'Katalog Herunterladen',
      ctaMicro: 'Antwort in 24h • NDA verfügbar • Specs & Herkunft',
      statsLinks: {
        certifications: 'Unsere Zertifikate & Audits ansehen',
        capacity: 'Kapazität & Lieferzeiten',
        countries: 'Routen & Incoterms',
      },
      trustBar: [
        'EUDR-ready',
        'QA dokumentiert',
        'Custody-Kette',
        'Flexible Incoterms',
        'Multi-Herkunft',
      ],
    },
    ru: {
      eyebrow: 'AFREXIA EXPORT — С 2009',
      title: 'Доказанное Экспортное Совершенство',
      lead: 'Премиум какао и кофе — отслеживаемое происхождение, документированный QA, надежное исполнение.',
      imageCaption: 'Контроль качества и отслеживаемость на месте',
      ctaPrimary: 'Запросить Предложение',
      ctaSecondary: 'Скачать Каталог',
      ctaMicro: 'Ответ в течение 24ч • NDA доступен • Спецификации и происхождение',
      statsLinks: {
        certifications: 'Посмотреть наши сертификаты и аудиты',
        capacity: 'Мощность и сроки',
        countries: 'Маршруты и инкотермс',
      },
      trustBar: [
        'EUDR-ready',
        'QA документирован',
        'Цепочка поставок',
        'Гибкие Инкотермс',
        'Мульти-происхождение',
      ],
    },
  };

  const t = content[locale] || content.en;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'clock':
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'scale':
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        );
      case 'globe':
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'certificate':
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-24 md:py-32 bg-[#070B0A] dark:bg-[#070B0A] relative overflow-hidden">
      {/* Subtle grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Editorial Header */}
        <ScrollReveal animation="fade">
          <div className="mb-16 md:mb-20">
            {/* Eyebrow */}
            <p className="text-[#C8A24A] text-xs md:text-sm uppercase tracking-[0.12em] font-semibold mb-4">
              {t.eyebrow}
            </p>
            
            {/* H2 Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F4EBDD] mb-6 leading-[1.12]">
              {t.title}
            </h2>
            
            {/* Lead */}
            <p className="text-base md:text-lg text-[#F4EBDD]/75 max-w-3xl leading-relaxed mb-8">
              {t.lead}
            </p>
            
            {/* CTA Block - Above the fold */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link
                href={`/${locale}/rfq`}
                className="inline-flex items-center justify-center bg-[#C8A24A] hover:bg-[#D4B05E] text-[#070B0A] px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {t.ctaPrimary}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href={`/${locale}/resources`}
                className="inline-flex items-center justify-center bg-transparent hover:bg-[#C8A24A]/10 text-[#C8A24A] border-2 border-[#C8A24A] px-8 py-4 rounded-full font-semibold text-base transition-all duration-300"
              >
                {t.ctaSecondary}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </Link>
            </div>
            
            {/* Micro-copy under CTAs */}
            <p className="text-xs text-[#F4EBDD]/60 mb-6">
              {t.ctaMicro}
            </p>
            
            {/* Gold signature line */}
            <div className="w-24 h-[2px] bg-gradient-to-r from-[#C8A24A] to-transparent"></div>
          </div>
        </ScrollReveal>

        {/* Split Layout 60/40 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          {/* Left: Editorial Image (60%) */}
          <ScrollReveal animation="fade" delay={0.1} className="lg:col-span-3">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.35)] group">
              {/* Terrain photo */}
              <div className="aspect-[4/3] relative">
                {trackRecordImage?.asset ? (
                  <img
                    src={urlForImage(trackRecordImage)
                      .width(1600)
                      .height(1200)
                      .quality(95)
                      .format('webp')
                      .url()}
                    srcSet={`
                      ${urlForImage(trackRecordImage).width(800).height(600).quality(95).format('webp').url()} 800w,
                      ${urlForImage(trackRecordImage).width(1200).height(900).quality(95).format('webp').url()} 1200w,
                      ${urlForImage(trackRecordImage).width(1600).height(1200).quality(95).format('webp').url()} 1600w,
                      ${urlForImage(trackRecordImage).width(2000).height(1500).quality(95).format('webp').url()} 2000w
                    `}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    alt={trackRecordImage.alt?.[locale] || t.imageCaption}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1a1f1e] to-[#0a0d0c]"></div>
                )}
                {/* Vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Trust overlay badges - Top left for visibility */}
                <div className="absolute top-6 left-6 flex flex-wrap gap-2 max-w-md">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-sm border border-[#C8A24A]/40 rounded-full text-[#F4EBDD] text-xs font-semibold">
                    <svg className="w-3.5 h-3.5 text-[#C8A24A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    EUDR-ready
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-sm border border-[#C8A24A]/40 rounded-full text-[#F4EBDD] text-xs font-semibold">
                    <svg className="w-3.5 h-3.5 text-[#C8A24A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    {locale === 'fr' ? 'QA documentée' : locale === 'es' ? 'QA documentado' : locale === 'de' ? 'QA dokumentiert' : locale === 'ru' ? 'QA документирован' : 'QA documented'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-sm border border-[#C8A24A]/40 rounded-full text-[#F4EBDD] text-xs font-semibold">
                    <svg className="w-3.5 h-3.5 text-[#C8A24A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {locale === 'fr' ? 'Chaîne de custody' : locale === 'es' ? 'Cadena de custodia' : locale === 'de' ? 'Custody-Kette' : locale === 'ru' ? 'Цепочка поставок' : 'Chain of custody'}
                  </span>
                </div>
                
                {/* Caption - Bottom left */}
                <div className="absolute bottom-6 left-6">
                  <p className="text-[#F4EBDD]/90 text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    {trackRecordImage?.caption?.[locale] || t.imageCaption}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: Key Figures Column (40%) */}
          <ScrollReveal animation="fade" delay={0.2} className="lg:col-span-2">
            <div className="space-y-4">
              {stats.map((stat, index) => {
                // Determine link for each stat
                let linkHref = '';
                let linkText = '';
                
                if (stat.icon === 'certificate') {
                  linkHref = `/${locale}/quality`;
                  linkText = t.statsLinks.certifications;
                } else if (stat.icon === 'scale') {
                  linkHref = `/${locale}/products`;
                  linkText = t.statsLinks.capacity;
                } else if (stat.icon === 'globe') {
                  linkHref = `/${locale}/contact`;
                  linkText = t.statsLinks.countries;
                }
                
                return (
                  <div
                    key={index}
                    className="bg-white/[0.03] border border-[#C8A24A]/20 rounded-xl p-5 hover:bg-white/[0.05] hover:border-[#C8A24A]/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-[#C8A24A] flex-shrink-0">
                        {getIcon(stat.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CounterAnimation
                          value={stat.value}
                          suffix={stat.suffix}
                          duration={2.5}
                          className="text-3xl md:text-4xl font-bold text-[#F4EBDD] mb-1"
                        />
                        <p className="text-sm font-semibold text-[#F4EBDD] mb-1">
                          {stat.label[locale]}
                        </p>
                        <p className="text-xs text-[#F4EBDD]/60 leading-relaxed mb-2">
                          {stat.context[locale]}
                        </p>
                        
                        {/* Clickable link for actionable stats */}
                        {linkHref && (
                          <Link
                            href={linkHref}
                            className="inline-flex items-center gap-1 text-xs text-[#C8A24A] hover:text-[#D4B05E] font-medium transition-colors group-hover:underline"
                          >
                            {linkText}
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>

        {/* Trust Bar - Immediately below hero */}
        <ScrollReveal animation="fade" delay={0.3}>
          <div className="border-t border-b border-[#C8A24A]/20 py-6">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              {t.trustBar.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && (
                    <div className="hidden sm:block w-px h-5 bg-[#C8A24A]/30 -ml-4 mr-2"></div>
                  )}
                  <svg className="w-4 h-4 text-[#C8A24A] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-semibold text-[#F4EBDD] whitespace-nowrap">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
