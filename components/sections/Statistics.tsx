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
  link?: {
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
      link: {
        fr: 'Capacité & lead times',
        en: 'Capacity & lead times',
        es: 'Capacidad y plazos',
        de: 'Kapazität & Lieferzeiten',
        ru: 'Мощность и сроки',
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
      link: {
        fr: 'Routes & incoterms',
        en: 'Routes & incoterms',
        es: 'Rutas e incoterms',
        de: 'Routen & Incoterms',
        ru: 'Маршруты и инкотермс',
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
      link: {
        fr: 'Certificats & audits',
        en: 'Certificates & audits',
        es: 'Certificados y auditorías',
        de: 'Zertifikate & Audits',
        ru: 'Сертификаты и аудиты',
      },
      icon: 'certificate',
    },
  ];

  const content = {
    fr: {
      eyebrow: 'AFREXIA EXPORT — DEPUIS 2009',
      title: 'Excellence d\'Export, Prouvée',
      lead: 'Qualité constante, volumes maîtrisés, conformité internationale — du terroir au port.',
      pitch: 'Cacao & café premium — origines tracées, QA documentée, exécution maîtrisée.',
      imageCaption: 'Contrôle qualité & traçabilité sur site',
      ctaPrimary: 'Demander un devis (RFQ)',
      ctaSecondary: 'Télécharger le catalogue (PDF)',
      ctaTertiary: 'Planifier un appel (15 min)',
      ctaMicro: 'Réponse sous 24h • NDA possible',
      proofs: ['MOQ flexible', 'Incoterms: FOB / CIF', 'Lead time: 2–6 semaines', 'Origines: Cameroun, Côte d\'Ivoire'],
      trustBar: ['EUDR-ready', 'QA documentée', 'Chaîne de custody', 'NDA possible', 'Réponse < 24h'],
    },
    en: {
      eyebrow: 'AFREXIA EXPORT — SINCE 2009',
      title: 'Proven Export Excellence',
      lead: 'Consistent quality, controlled volumes, global compliance — from origin to port.',
      pitch: 'Premium cocoa & coffee — traced origins, documented QA, controlled execution.',
      imageCaption: 'Quality control & traceability on-site',
      ctaPrimary: 'Request a Quote (RFQ)',
      ctaSecondary: 'Download Catalogue (PDF)',
      ctaTertiary: 'Schedule a Call (15 min)',
      ctaMicro: 'Reply within 24h • NDA available',
      proofs: ['Flexible MOQ', 'Incoterms: FOB / CIF', 'Lead time: 2–6 weeks', 'Origins: Cameroon, Ivory Coast'],
      trustBar: ['EUDR-ready', 'QA documented', 'Chain of custody', 'NDA available', 'Reply < 24h'],
    },
    es: {
      eyebrow: 'AFREXIA EXPORT — DESDE 2009',
      title: 'Excelencia de Exportación, Probada',
      lead: 'Calidad constante, volúmenes controlados, cumplimiento internacional — del origen al puerto.',
      pitch: 'Cacao y café premium — orígenes rastreados, QA documentado, ejecución controlada.',
      imageCaption: 'Control de calidad y trazabilidad en sitio',
      ctaPrimary: 'Solicitar Cotización (RFQ)',
      ctaSecondary: 'Descargar Catálogo (PDF)',
      ctaTertiary: 'Programar una Llamada (15 min)',
      ctaMicro: 'Respuesta en 24h • NDA disponible',
      proofs: ['MOQ flexible', 'Incoterms: FOB / CIF', 'Plazo: 2–6 semanas', 'Orígenes: Camerún, Costa de Marfil'],
      trustBar: ['EUDR-ready', 'QA documentado', 'Cadena de custodia', 'NDA disponible', 'Respuesta < 24h'],
    },
    de: {
      eyebrow: 'AFREXIA EXPORT — SEIT 2009',
      title: 'Bewährte Export-Exzellenz',
      lead: 'Konstante Qualität, kontrollierte Mengen, internationale Konformität — vom Ursprung zum Hafen.',
      pitch: 'Premium Kakao & Kaffee — nachverfolgbare Herkunft, dokumentierte QA, kontrollierte Ausführung.',
      imageCaption: 'Qualitätskontrolle & Rückverfolgbarkeit vor Ort',
      ctaPrimary: 'Angebot Anfordern (RFQ)',
      ctaSecondary: 'Katalog Herunterladen (PDF)',
      ctaTertiary: 'Anruf Vereinbaren (15 Min)',
      ctaMicro: 'Antwort in 24h • NDA verfügbar',
      proofs: ['Flexible MOQ', 'Incoterms: FOB / CIF', 'Lieferzeit: 2–6 Wochen', 'Herkunft: Kamerun, Elfenbeinküste'],
      trustBar: ['EUDR-ready', 'QA dokumentiert', 'Custody-Kette', 'NDA verfügbar', 'Antwort < 24h'],
    },
    ru: {
      eyebrow: 'AFREXIA EXPORT — С 2009',
      title: 'Доказанное Экспортное Совершенство',
      lead: 'Постоянное качество, контролируемые объемы, международное соответствие — от происхождения до порта.',
      pitch: 'Премиум какао и кофе — отслеживаемое происхождение, документированный QA, контролируемое исполнение.',
      imageCaption: 'Контроль качества и отслеживаемость на месте',
      ctaPrimary: 'Запросить Предложение (RFQ)',
      ctaSecondary: 'Скачать Каталог (PDF)',
      ctaTertiary: 'Запланировать Звонок (15 мин)',
      ctaMicro: 'Ответ в течение 24ч • NDA доступен',
      proofs: ['Гибкий MOQ', 'Инкотермс: FOB / CIF', 'Срок поставки: 2–6 недель', 'Происхождение: Камерун, Кот-д\'Ивуар'],
      trustBar: ['EUDR-ready', 'QA документирован', 'Цепочка поставок', 'NDA доступен', 'Ответ < 24ч'],
    },
  };

  const t = content[locale] || content.en;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'clock':
        return (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'scale':
        return (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        );
      case 'globe':
        return (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'certificate':
        return (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F4EBDD] mb-6 leading-tight">
              {t.title}
            </h2>
            
            {/* Lead */}
            <p className="text-base md:text-lg text-[#F4EBDD]/75 max-w-3xl leading-relaxed mb-6">
              {t.lead}
            </p>
            
            {/* Gold signature line */}
            <div className="w-24 h-[2px] bg-gradient-to-r from-[#C8A24A] to-transparent"></div>
          </div>
        </ScrollReveal>

        {/* Split Layout 60/40 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Left: Editorial Image (60%) */}
          <ScrollReveal animation="fade" delay={0.1} className="lg:col-span-3">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.35)] group animate-float hover:animate-none transition-all duration-300">
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
                
                {/* Trust overlay badges - EUDR highlighted */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-3">
                  {/* Primary badge - EUDR (gold highlight) */}
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8A24A]/90 backdrop-blur-sm border-2 border-[#C8A24A] rounded-full text-[#070B0A] text-sm font-bold shadow-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    EUDR-ready
                  </span>
                  {/* Secondary badges */}
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-sm border border-[#F4EBDD]/30 rounded-full text-[#F4EBDD] text-xs font-semibold">
                    <svg className="w-3.5 h-3.5 text-[#C8A24A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    {locale === 'fr' ? 'QA documentée' : locale === 'es' ? 'QA documentado' : locale === 'de' ? 'QA dokumentiert' : locale === 'ru' ? 'QA документирован' : 'QA documented'}
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-sm border border-[#F4EBDD]/30 rounded-full text-[#F4EBDD] text-xs font-semibold">
                    <svg className="w-3.5 h-3.5 text-[#C8A24A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {locale === 'fr' ? 'Chaîne de custody' : locale === 'es' ? 'Cadena de custodia' : locale === 'de' ? 'Custody-Kette' : locale === 'ru' ? 'Цепочка поставок' : 'Chain of custody'}
                  </span>
                </div>
                
                {/* Caption */}
                <div className="absolute top-6 left-6">
                  <p className="text-[#F4EBDD]/90 text-sm font-medium">
                    {trackRecordImage?.caption?.[locale] || t.imageCaption}
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Bar under photo */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 py-4 border-y border-[#C8A24A]/20">
              {t.trustBar.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && (
                    <div className="hidden sm:block w-px h-4 bg-[#C8A24A]/20 -ml-2 mr-2"></div>
                  )}
                  <span className="text-xs font-medium text-[#F4EBDD]/70 whitespace-nowrap">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Right: Conversion Column (40%) - with gradient background */}
          <ScrollReveal animation="fade" delay={0.2} className="lg:col-span-2">
            <div className="relative h-full flex flex-col">
              {/* Subtle gradient background */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl -z-10"></div>
              
              <div className="space-y-3 flex-1 flex flex-col">
                {/* Pitch (2 lines max) */}
                <p className="text-xs text-[#F4EBDD]/80 leading-snug">
                  {t.pitch}
                </p>

                {/* CTA Block - more compact */}
                <div className="space-y-2 p-3 bg-white/[0.03] border border-[#C8A24A]/20 rounded-lg">
                  {/* Primary CTA */}
                  <Link
                    href={`/${locale}/rfq`}
                    className="block w-full bg-[#C8A24A] hover:bg-[#D4B05E] text-[#070B0A] px-4 py-2 rounded-lg font-bold text-xs text-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {t.ctaPrimary}
                  </Link>

                  {/* Secondary CTA */}
                  <Link
                    href={`/${locale}/resources`}
                    className="block w-full bg-transparent hover:bg-[#C8A24A]/10 text-[#C8A24A] border border-[#C8A24A] px-4 py-1.5 rounded-lg font-semibold text-[10px] text-center transition-all duration-300"
                  >
                    {t.ctaSecondary}
                  </Link>

                  {/* Micro-copy + Proofs combined */}
                  <div className="pt-2 border-t border-[#C8A24A]/10">
                    <p className="text-[9px] text-[#F4EBDD]/60 text-center mb-1.5">
                      {t.ctaMicro}
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {t.proofs.map((proof, index) => (
                        <span key={index} className="text-[9px] text-[#F4EBDD]/70 flex items-center gap-0.5">
                          <svg className="w-2 h-2 text-[#C8A24A] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="leading-tight">{proof}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats cards - more compact */}
                <div className="space-y-2 flex-1">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white/[0.03] border border-[#C8A24A]/20 rounded-lg p-3 hover:bg-white/[0.05] hover:border-[#C8A24A]/30 transition-all duration-300"
                    >
                      <div className="flex items-start gap-2">
                        <div className="text-[#C8A24A] flex-shrink-0">
                          <div className="w-5 h-5">
                            {getIcon(stat.icon)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <CounterAnimation
                            value={stat.value}
                            suffix={stat.suffix}
                            duration={2.5}
                            className="text-xl md:text-2xl font-bold text-[#F4EBDD] leading-none mb-0.5"
                          />
                          <p className="text-[10px] font-semibold text-[#F4EBDD] mb-0.5 leading-tight">
                            {stat.label[locale]}
                          </p>
                          <p className="text-[9px] text-[#F4EBDD]/60 leading-snug mb-1">
                            {stat.context[locale]}
                          </p>
                          {stat.link && (
                            <Link
                              href={`/${locale}/quality`}
                              className="inline-flex items-center gap-0.5 text-[9px] text-[#C8A24A] hover:text-[#D4B05E] font-medium transition-colors group/link"
                            >
                              <span>{stat.link[locale]}</span>
                              <svg className="w-2.5 h-2.5 group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tertiary CTA - smaller */}
                <Link
                  href={`/${locale}/contact`}
                  className="block w-full text-center text-[10px] text-[#C8A24A] hover:text-[#D4B05E] font-medium transition-colors"
                >
                  {t.ctaTertiary} →
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
