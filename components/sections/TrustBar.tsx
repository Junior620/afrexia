'use client';

import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { Locale } from '@/types';
import Link from 'next/link';
import { urlForImage } from '@/sanity/lib/image';

interface TrustBarProps {
  locale: Locale;
  complianceBackgroundImage?: any;
}

export function TrustBar({ locale, complianceBackgroundImage }: TrustBarProps) {
  const content = {
    fr: {
      title: 'Du terrain au port. Qualité maîtrisée, traçabilité prouvée.',
      subtitle: 'Sourcing structuré, contrôle qualité, documentation internationale — pour acheteurs exigeants.',
      promises: [
        {
          title: 'Origines sélectionnées & volumes sécurisés',
          detail: 'Cameroun, Côte d\'Ivoire — MOQ flexible',
          icon: 'globe',
        },
        {
          title: 'Spécifications claires, QA documentée',
          detail: 'SOP • Contrôles • Tests labo',
          icon: 'clipboard',
        },
        {
          title: 'Traçabilité & conformité prêtes pour audit',
          detail: 'EUDR • CoC • DDS',
          icon: 'shield',
        },
      ],
      chips: ['EUDR-ready', 'Chain of custody', 'COA / Spec sheets'],
      trustStrip: [
        { icon: 'lock', text: 'NDA standard' },
        { icon: 'clock', text: 'Réponse < 24h' },
        { icon: 'file', text: 'Exemples anonymisés' },
      ],
      ctaPrimary: 'Planifier un échange (15 min)',
      ctaSecondary: 'Recevoir le catalogue & specs (PDF)',
      ctaMicro: 'Réponse < 24h • NDA standard • Dossier audit-ready',
      eudrBadge: 'Priorité 2025',
      cards: [
        {
          title: 'Certifications & Audits',
          link: 'Voir la liste',
          linkUrl: '/quality',
          isEudr: false,
        },
        {
          title: 'Traçabilité EUDR',
          link: 'Voir un exemple',
          linkUrl: '/traceability',
          isEudr: true,
        },
        {
          title: 'Assurance Qualité',
          link: 'Notre process QA',
          linkUrl: '/quality',
          isEudr: false,
        },
        {
          title: 'Documentation (PDF)',
          link: 'Télécharger un exemple',
          linkUrl: '/resources',
          isEudr: false,
        },
      ],
    },
    en: {
      title: 'From farm to port. Quality controlled, traceability proven.',
      subtitle: 'Structured sourcing, quality control, international documentation — for demanding buyers.',
      promises: [
        {
          title: 'Selected origins & secured volumes',
          detail: 'Cameroon, Ivory Coast — Flexible MOQ',
          icon: 'globe',
        },
        {
          title: 'Clear specifications, documented QA',
          detail: 'SOP • Controls • Lab tests',
          icon: 'clipboard',
        },
        {
          title: 'Traceability & compliance audit-ready',
          detail: 'EUDR • CoC • DDS',
          icon: 'shield',
        },
      ],
      chips: ['EUDR-ready', 'Chain of custody', 'COA / Spec sheets'],
      trustStrip: [
        { icon: 'lock', text: 'Standard NDA' },
        { icon: 'clock', text: 'Reply < 24h' },
        { icon: 'file', text: 'Anonymized examples' },
      ],
      ctaPrimary: 'Book a 15-min call',
      ctaSecondary: 'Get Catalog & Specs (PDF)',
      ctaMicro: 'Reply < 24h • Standard NDA • Audit-ready file',
      eudrBadge: '2025 Priority',
      cards: [
        {
          title: 'Certifications & Audits',
          link: 'View list',
          linkUrl: '/quality',
          isEudr: false,
        },
        {
          title: 'EUDR Traceability',
          link: 'View example',
          linkUrl: '/traceability',
          isEudr: true,
        },
        {
          title: 'Quality Assurance',
          link: 'Our QA process',
          linkUrl: '/quality',
          isEudr: false,
        },
        {
          title: 'Documentation (PDF)',
          link: 'Download example',
          linkUrl: '/resources',
          isEudr: false,
        },
      ],
    },
    es: {
      title: 'Del campo al puerto. Calidad controlada, trazabilidad probada.',
      subtitle: 'Sourcing estructurado, control de calidad, documentación internacional — para compradores exigentes.',
      promises: [
        {
          title: 'Orígenes seleccionados y volúmenes asegurados',
          detail: 'Camerún, Costa de Marfil — MOQ flexible',
          icon: 'globe',
        },
        {
          title: 'Especificaciones claras, QA documentado',
          detail: 'SOP • Controles • Pruebas lab',
          icon: 'clipboard',
        },
        {
          title: 'Trazabilidad y cumplimiento listos para auditoría',
          detail: 'EUDR • CoC • DDS',
          icon: 'shield',
        },
      ],
      chips: ['EUDR-ready', 'Cadena de custodia', 'COA / Fichas técnicas'],
      trustStrip: [
        { icon: 'lock', text: 'NDA estándar' },
        { icon: 'clock', text: 'Respuesta < 24h' },
        { icon: 'file', text: 'Ejemplos anónimos' },
      ],
      ctaPrimary: 'Programar una llamada (15 min)',
      ctaSecondary: 'Recibir catálogo y specs (PDF)',
      ctaMicro: 'Respuesta < 24h • NDA estándar • Expediente audit-ready',
      eudrBadge: 'Prioridad 2025',
      cards: [
        {
          title: 'Certificaciones y Auditorías',
          link: 'Ver la lista',
          linkUrl: '/quality',
          isEudr: false,
        },
        {
          title: 'Trazabilidad EUDR',
          link: 'Ver un ejemplo',
          linkUrl: '/traceability',
          isEudr: true,
        },
        {
          title: 'Garantía de Calidad',
          link: 'Nuestro proceso QA',
          linkUrl: '/quality',
          isEudr: false,
        },
        {
          title: 'Documentación (PDF)',
          link: 'Descargar un ejemplo',
          linkUrl: '/resources',
          isEudr: false,
        },
      ],
    },
    de: {
      title: 'Vom Feld zum Hafen. Qualität kontrolliert, Rückverfolgbarkeit bewiesen.',
      subtitle: 'Strukturiertes Sourcing, Qualitätskontrolle, internationale Dokumentation — für anspruchsvolle Käufer.',
      promises: [
        {
          title: 'Ausgewählte Herkünfte & gesicherte Mengen',
          detail: 'Kamerun, Elfenbeinküste — Flexible MOQ',
          icon: 'globe',
        },
        {
          title: 'Klare Spezifikationen, dokumentierte QA',
          detail: 'SOP • Kontrollen • Labortests',
          icon: 'clipboard',
        },
        {
          title: 'Rückverfolgbarkeit & Compliance audit-bereit',
          detail: 'EUDR • CoC • DDS',
          icon: 'shield',
        },
      ],
      chips: ['EUDR-ready', 'Custody-Kette', 'COA / Datenblätter'],
      trustStrip: [
        { icon: 'lock', text: 'Standard-NDA' },
        { icon: 'clock', text: 'Antwort < 24h' },
        { icon: 'file', text: 'Anonymisierte Beispiele' },
      ],
      ctaPrimary: 'Gespräch vereinbaren (15 Min)',
      ctaSecondary: 'Katalog & Specs erhalten (PDF)',
      ctaMicro: 'Antwort < 24h • Standard-NDA • Audit-bereite Unterlagen',
      eudrBadge: 'Priorität 2025',
      cards: [
        {
          title: 'Zertifizierungen & Audits',
          link: 'Liste ansehen',
          linkUrl: '/quality',
          isEudr: false,
        },
        {
          title: 'EUDR-Rückverfolgbarkeit',
          link: 'Beispiel ansehen',
          linkUrl: '/traceability',
          isEudr: true,
        },
        {
          title: 'Qualitätssicherung',
          link: 'Unser QA-Prozess',
          linkUrl: '/quality',
          isEudr: false,
        },
        {
          title: 'Dokumentation (PDF)',
          link: 'Beispiel herunterladen',
          linkUrl: '/resources',
          isEudr: false,
        },
      ],
    },
    ru: {
      title: 'От фермы до порта. Контролируемое качество, доказанная прослеживаемость.',
      subtitle: 'Структурированный сорсинг, контроль качества, международная документация — для требовательных покупателей.',
      promises: [
        {
          title: 'Отобранные источники и обеспеченные объемы',
          detail: 'Камерун, Кот-д\'Ивуар — Гибкий MOQ',
          icon: 'globe',
        },
        {
          title: 'Четкие спецификации, документированный QA',
          detail: 'SOP • Контроль • Лабораторные тесты',
          icon: 'clipboard',
        },
        {
          title: 'Прослеживаемость и соответствие готовы к аудиту',
          detail: 'EUDR • CoC • DDS',
          icon: 'shield',
        },
      ],
      chips: ['EUDR-ready', 'Цепочка поставок', 'COA / Спецификации'],
      trustStrip: [
        { icon: 'lock', text: 'Стандартный NDA' },
        { icon: 'clock', text: 'Ответ < 24ч' },
        { icon: 'file', text: 'Анонимные примеры' },
      ],
      ctaPrimary: 'Запланировать звонок (15 мин)',
      ctaSecondary: 'Получить каталог и спецификации (PDF)',
      ctaMicro: 'Ответ < 24ч • Стандартный NDA • Файл готов к аудиту',
      eudrBadge: 'Приоритет 2025',
      cards: [
        {
          title: 'Сертификаты и Аудиты',
          link: 'Посмотреть список',
          linkUrl: '/quality',
          isEudr: false,
        },
        {
          title: 'Прослеживаемость EUDR',
          link: 'Посмотреть пример',
          linkUrl: '/traceability',
          isEudr: true,
        },
        {
          title: 'Контроль Качества',
          link: 'Наш процесс QA',
          linkUrl: '/quality',
          isEudr: false,
        },
        {
          title: 'Документация (PDF)',
          link: 'Скачать пример',
          linkUrl: '/resources',
          isEudr: false,
        },
      ],
    },
  };

  const t = content[locale] || content.en;

  // Amélioration #4: Icônes spécifiques par promesse
  const getPromiseIcon = (iconType: string) => {
    switch (iconType) {
      case 'globe':
        return (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'clipboard':
        return (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case 'shield':
        return (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Amélioration #2: Icônes pour trust strip
  const getTrustIcon = (iconType: string) => {
    switch (iconType) {
      case 'lock':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case 'clock':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'file':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-20 md:py-28 bg-[#0A1410] dark:bg-[#0A1410] relative overflow-hidden">
      {/* Amélioration #5: Background terrain photo from Sanity CMS */}
      {complianceBackgroundImage?.asset ? (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{
            backgroundImage: `url(${urlForImage(complianceBackgroundImage).width(1920).height(1080).quality(85).format('webp').url()})`,
            filter: 'grayscale(30%)',
          }}
        />
      ) : (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{
            backgroundImage: 'url(/assets/quality-control.jpg)',
            filter: 'grayscale(30%)',
          }}
        />
      )}
      
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A1410]/65 via-[#0A1410]/60 to-[#0A1410]/65" />
      
      {/* Subtle grain texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Editorial Header */}
        <ScrollReveal animation="fade">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F4EBDD] mb-4 leading-tight">
              {t.title}
            </h2>
            <p className="text-base md:text-lg text-[#F4EBDD]/75 max-w-4xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Editorial Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
          {/* Left: Promises + Chips + Trust Strip */}
          <ScrollReveal animation="fade" delay={0.1}>
            <div className="space-y-8">
              {/* Amélioration #4: 3 Promise Lines avec icônes différenciées */}
              <div className="space-y-4">
                {t.promises.map((promise, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#C8A24A]/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-5 h-5 text-[#C8A24A]">
                        {getPromiseIcon(promise.icon)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-base md:text-lg text-[#F4EBDD] leading-tight font-bold mb-1">
                        {promise.title}
                      </p>
                      <p className="text-sm text-[#F4EBDD]/70 leading-relaxed">
                        {promise.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Elegant Chips */}
              <div className="flex flex-wrap gap-3 pt-4">
                {t.chips.map((chip, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8A24A]/10 backdrop-blur-sm border border-[#C8A24A]/30 rounded-full text-[#C8A24A] text-sm font-semibold"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {chip}
                  </span>
                ))}
              </div>

              {/* Amélioration #2: Trust Strip - Micro-preuves visibles */}
              <div className="flex flex-wrap gap-4 pt-6 border-t border-[#C8A24A]/10">
                {t.trustStrip.map((item, index) => (
                  <span key={index} className="flex items-center gap-2 text-xs text-[#F4EBDD]/70">
                    <div className="text-[#C8A24A]">
                      {getTrustIcon(item.icon)}
                    </div>
                    {item.text}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Right: Premium Cards 2x2 Grid avec EUDR mis en avant */}
          <ScrollReveal animation="fade" delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {t.cards.map((card, index) => (
                <Link
                  key={index}
                  href={`/${locale}${card.linkUrl}`}
                  className={`group backdrop-blur-sm rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${
                    card.isEudr
                      ? 'sm:col-span-2 bg-[#C8A24A]/5 border-2 border-[#C8A24A]/40 hover:border-[#C8A24A]/60 hover:shadow-[#C8A24A]/20'
                      : 'bg-white/[0.03] border border-[#C8A24A]/20 hover:bg-white/[0.06] hover:border-[#C8A24A]/40 hover:shadow-[#C8A24A]/10'
                  }`}
                >
                  {/* Amélioration #1: Badge "Priorité 2025" pour EUDR */}
                  {card.isEudr && (
                    <span className="inline-block px-3 py-1 bg-[#C8A24A] text-[#070B0A] text-xs font-bold uppercase rounded-full mb-3">
                      {t.eudrBadge}
                    </span>
                  )}
                  
                  {/* Icon */}
                  <div className={`w-10 h-10 mb-4 rounded-lg flex items-center justify-center ${
                    card.isEudr ? 'bg-[#C8A24A]/20' : 'bg-[#C8A24A]/10'
                  }`}>
                    <svg className="w-5 h-5 text-[#C8A24A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  
                  {/* Title */}
                  <h4 className={`font-bold mb-3 leading-tight ${
                    card.isEudr ? 'text-lg text-[#F4EBDD]' : 'text-base text-[#F4EBDD]'
                  }`}>
                    {card.title}
                  </h4>
                  
                  {/* Link */}
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#C8A24A] group-hover:text-[#D4B05E] transition-colors">
                    <span>{card.link}</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* CTA Bar - Wide, Premium */}
        <ScrollReveal animation="fade" delay={0.3}>
          <div className="bg-white/[0.03] backdrop-blur-sm border border-[#C8A24A]/20 rounded-2xl p-8 md:p-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center justify-center bg-[#C8A24A] hover:bg-[#D4B05E] text-[#070B0A] px-8 py-4 rounded-full font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap min-h-[52px]"
                >
                  {t.ctaPrimary}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </Link>
                <Link
                  href={`/${locale}/resources`}
                  className="inline-flex items-center justify-center bg-transparent hover:bg-[#C8A24A]/10 text-[#C8A24A] border-2 border-[#C8A24A] px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 whitespace-nowrap min-h-[52px]"
                >
                  {t.ctaSecondary}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </Link>
              </div>

              {/* Micro-copy */}
              <div className="text-center lg:text-right">
                <p className="text-sm text-[#F4EBDD]/70 leading-relaxed">
                  {t.ctaMicro}
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Amélioration #3: Sticky CTA Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0A1410]/95 backdrop-blur-lg border-t border-[#C8A24A]/20 p-4 z-50 safe-area-inset-bottom">
        <Link 
          href={`/${locale}/contact`}
          className="block w-full bg-[#C8A24A] hover:bg-[#D4B05E] text-[#070B0A] text-center py-3 rounded-full font-bold transition-all duration-300 shadow-lg"
        >
          {t.ctaPrimary}
        </Link>
      </div>
    </section>
  );
}
