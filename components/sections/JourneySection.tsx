'use client';

import Link from 'next/link';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { Locale } from '@/types';

interface JourneySectionProps {
  locale: Locale;
}

export function JourneySection({ locale }: JourneySectionProps) {
  const content = {
    fr: {
      title: 'Votre Parcours avec Afrexia',
      subtitle: 'Nous accompagnons chaque client selon ses besoins spécifiques',
      buyer: {
        title: 'Parcours Acheteur',
        description: 'Pour les acheteurs B2B recherchant des commodités agricoles de qualité',
        proofs: [
          { icon: '📦', text: 'MOQ flexible' },
          { icon: '🚢', text: 'Incoterms: FOB/CIF' },
          { icon: '📄', text: 'Fiches techniques PDF' },
        ],
        steps: [
          {
            title: 'Sélectionner un produit',
            description: 'Grades, origine, certifications',
          },
          {
            title: 'Valider les specs',
            description: 'MOQ, Incoterms, emballage, QA',
          },
          {
            title: 'Recevoir une offre chiffrée',
            description: 'Prix indicatif, lead time, documentation',
          },
        ],
        ctaPrimary: 'Demander un devis (24h)',
        ctaSecondary: 'Voir un exemple de fiche technique',
        trustItems: ['Réponse sous 24h', 'NDA possible', 'Docs disponibles'],
      },
      institutional: {
        title: 'Parcours Institutionnel',
        description: 'Pour les partenaires institutionnels et investisseurs',
        proofs: [
          { icon: '✓', text: 'EUDR-Ready' },
          { icon: '📍', text: 'Traçabilité par parcelle' },
          { icon: '🔍', text: 'Audit & conformité' },
        ],
        steps: [
          {
            title: 'Tracer & prouver',
            description: 'EUDR, géolocalisation, chaîne de custody',
          },
          {
            title: 'Audit qualité & conformité',
            description: 'Process QA, certificats, rapports',
          },
          {
            title: 'Mettre en place un contrat cadre',
            description: 'Volumes, planning, SLA',
          },
        ],
        ctaPrimary: 'Planifier un appel (15 min)',
        ctaSecondary: 'Voir notre conformité EUDR',
        trustItems: ['15 min', 'NDA standard', 'Process documenté'],
      },
      trustBar: {
        items: [
          'EUDR-Ready',
          'QA & SGS inspection',
          'Incoterms FOB/CIF/CFR',
          '25+ pays',
          '10,000+ tonnes/an',
        ],
      },
    },
    en: {
      title: 'Your Journey with Afrexia',
      subtitle: 'We support each client according to their specific needs',
      buyer: {
        title: 'Buyer Journey',
        description: 'For B2B buyers seeking quality agricultural commodities',
        proofs: [
          { icon: '📦', text: 'Flexible MOQ' },
          { icon: '🚢', text: 'Incoterms: FOB/CIF' },
          { icon: '📄', text: 'PDF Spec Sheets' },
        ],
        steps: [
          {
            title: 'Select a product',
            description: 'Grades, origin, certifications',
          },
          {
            title: 'Validate specs',
            description: 'MOQ, Incoterms, packaging, QA',
          },
          {
            title: 'Receive a detailed offer',
            description: 'Indicative price, lead time, documentation',
          },
        ],
        ctaPrimary: 'Request a Quote (24h)',
        ctaSecondary: 'View sample spec sheet',
        trustItems: ['Reply within 24h', 'NDA available', 'Docs ready'],
      },
      institutional: {
        title: 'Institutional Journey',
        description: 'For institutional partners and investors',
        proofs: [
          { icon: '✓', text: 'EUDR-Ready' },
          { icon: '📍', text: 'Plot traceability' },
          { icon: '🔍', text: 'Audit & compliance' },
        ],
        steps: [
          {
            title: 'Trace & prove',
            description: 'EUDR, geolocation, chain of custody',
          },
          {
            title: 'Quality audit & compliance',
            description: 'QA process, certificates, reports',
          },
          {
            title: 'Establish framework agreement',
            description: 'Volumes, planning, SLA',
          },
        ],
        ctaPrimary: 'Schedule a Call (15 min)',
        ctaSecondary: 'View our EUDR compliance',
        trustItems: ['15 min', 'Standard NDA', 'Documented process'],
      },
      trustBar: {
        items: [
          'EUDR-Ready',
          'QA & SGS inspection',
          'Incoterms FOB/CIF/CFR',
          '25+ countries',
          '10,000+ tons/year',
        ],
      },
    },
    es: {
      title: 'Su Viaje con Afrexia',
      subtitle: 'Apoyamos a cada cliente según sus necesidades específicas',
      buyer: {
        title: 'Recorrido del Comprador',
        description: 'Para compradores B2B que buscan productos agrícolas de calidad',
        proofs: [
          { icon: '📦', text: 'MOQ flexible' },
          { icon: '🚢', text: 'Incoterms: FOB/CIF' },
          { icon: '📄', text: 'Fichas técnicas PDF' },
        ],
        steps: [
          {
            title: 'Seleccionar un producto',
            description: 'Grados, origen, certificaciones',
          },
          {
            title: 'Validar especificaciones',
            description: 'MOQ, Incoterms, embalaje, QA',
          },
          {
            title: 'Recibir una oferta detallada',
            description: 'Precio indicativo, plazo, documentación',
          },
        ],
        ctaPrimary: 'Solicitar Cotización (24h)',
        ctaSecondary: 'Ver ficha técnica de ejemplo',
        trustItems: ['Respuesta en 24h', 'NDA disponible', 'Docs listos'],
      },
      institutional: {
        title: 'Recorrido Institucional',
        description: 'Para socios institucionales e inversores',
        proofs: [
          { icon: '✓', text: 'EUDR-Ready' },
          { icon: '📍', text: 'Trazabilidad por parcela' },
          { icon: '🔍', text: 'Auditoría y cumplimiento' },
        ],
        steps: [
          {
            title: 'Rastrear y probar',
            description: 'EUDR, geolocalización, cadena de custodia',
          },
          {
            title: 'Auditoría de calidad y cumplimiento',
            description: 'Proceso QA, certificados, informes',
          },
          {
            title: 'Establecer acuerdo marco',
            description: 'Volúmenes, planificación, SLA',
          },
        ],
        ctaPrimary: 'Programar una Llamada (15 min)',
        ctaSecondary: 'Ver nuestro cumplimiento EUDR',
        trustItems: ['15 min', 'NDA estándar', 'Proceso documentado'],
      },
      trustBar: {
        items: [
          'EUDR-Ready',
          'Inspección QA & SGS',
          'Incoterms FOB/CIF/CFR',
          '25+ países',
          '10,000+ toneladas/año',
        ],
      },
    },
    de: {
      title: 'Ihre Reise mit Afrexia',
      subtitle: 'Wir unterstützen jeden Kunden entsprechend seinen spezifischen Bedürfnissen',
      buyer: {
        title: 'Käufer-Reise',
        description: 'Für B2B-Käufer, die hochwertige Agrarprodukte suchen',
        proofs: [
          { icon: '📦', text: 'Flexible MOQ' },
          { icon: '🚢', text: 'Incoterms: FOB/CIF' },
          { icon: '📄', text: 'PDF-Datenblätter' },
        ],
        steps: [
          {
            title: 'Produkt auswählen',
            description: 'Qualitäten, Herkunft, Zertifizierungen',
          },
          {
            title: 'Spezifikationen validieren',
            description: 'MOQ, Incoterms, Verpackung, QA',
          },
          {
            title: 'Detailliertes Angebot erhalten',
            description: 'Richtpreis, Lieferzeit, Dokumentation',
          },
        ],
        ctaPrimary: 'Angebot Anfordern (24h)',
        ctaSecondary: 'Beispiel-Datenblatt ansehen',
        trustItems: ['Antwort in 24h', 'NDA verfügbar', 'Docs bereit'],
      },
      institutional: {
        title: 'Institutionelle Reise',
        description: 'Für institutionelle Partner und Investoren',
        proofs: [
          { icon: '✓', text: 'EUDR-Ready' },
          { icon: '📍', text: 'Parzellen-Rückverfolgbarkeit' },
          { icon: '🔍', text: 'Audit & Compliance' },
        ],
        steps: [
          {
            title: 'Verfolgen & nachweisen',
            description: 'EUDR, Geolokalisierung, Custody-Kette',
          },
          {
            title: 'Qualitätsprüfung & Compliance',
            description: 'QA-Prozess, Zertifikate, Berichte',
          },
          {
            title: 'Rahmenvertrag etablieren',
            description: 'Volumen, Planung, SLA',
          },
        ],
        ctaPrimary: 'Anruf Vereinbaren (15 Min)',
        ctaSecondary: 'Unsere EUDR-Konformität ansehen',
        trustItems: ['15 Min', 'Standard-NDA', 'Dokumentierter Prozess'],
      },
      trustBar: {
        items: [
          'EUDR-Ready',
          'QA & SGS Inspektion',
          'Incoterms FOB/CIF/CFR',
          '25+ Länder',
          '10,000+ Tonnen/Jahr',
        ],
      },
    },
    ru: {
      title: 'Ваш Путь с Afrexia',
      subtitle: 'Мы поддерживаем каждого клиента в соответствии с его конкретными потребностями',
      buyer: {
        title: 'Путь Покупателя',
        description: 'Для B2B покупателей, ищущих качественные сельскохозяйственные товары',
        proofs: [
          { icon: '📦', text: 'Гибкий MOQ' },
          { icon: '🚢', text: 'Инкотермс: FOB/CIF' },
          { icon: '📄', text: 'PDF спецификации' },
        ],
        steps: [
          {
            title: 'Выбрать продукт',
            description: 'Сорта, происхождение, сертификаты',
          },
          {
            title: 'Проверить спецификации',
            description: 'MOQ, Инкотермс, упаковка, QA',
          },
          {
            title: 'Получить детальное предложение',
            description: 'Ориентировочная цена, срок, документация',
          },
        ],
        ctaPrimary: 'Запросить Предложение (24ч)',
        ctaSecondary: 'Посмотреть образец спецификации',
        trustItems: ['Ответ в течение 24ч', 'NDA доступен', 'Docs готовы'],
      },
      institutional: {
        title: 'Институциональный Путь',
        description: 'Для институциональных партнеров и инвесторов',
        proofs: [
          { icon: '✓', text: 'EUDR-Ready' },
          { icon: '📍', text: 'Отслеживаемость участка' },
          { icon: '🔍', text: 'Аудит и соответствие' },
        ],
        steps: [
          {
            title: 'Отследить и доказать',
            description: 'EUDR, геолокация, цепочка поставок',
          },
          {
            title: 'Аудит качества и соответствия',
            description: 'Процесс QA, сертификаты, отчеты',
          },
          {
            title: 'Установить рамочное соглашение',
            description: 'Объемы, планирование, SLA',
          },
        ],
        ctaPrimary: 'Запланировать Звонок (15 мин)',
        ctaSecondary: 'Посмотреть наше соответствие EUDR',
        trustItems: ['15 мин', 'Стандартный NDA', 'Документированный процесс'],
      },
      trustBar: {
        items: [
          'EUDR-Ready',
          'Инспекция QA & SGS',
          'Инкотермс FOB/CIF/CFR',
          '25+ стран',
          '10,000+ тонн/год',
        ],
      },
    },
  };

  const t = content[locale] || content.en;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-light dark:from-dark-bg-primary dark:to-dark-bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Reduced size & lighter color */}
        <ScrollReveal animation="fade">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white dark:text-white mb-2">
              {t.title}
            </h2>
            <p className="text-sm md:text-base text-white/70 dark:text-dark-text-secondary max-w-2xl mx-auto mb-3">
              {t.subtitle}
            </p>
            {/* Micro-tagline for branding */}
            <p className="text-xs text-white/50 dark:text-dark-text-secondary/50 max-w-3xl mx-auto">
              {locale === 'fr' ? 'Export & sourcing de cacao/café — conformité EUDR, QA, logistique internationale' :
               locale === 'es' ? 'Exportación y sourcing de cacao/café — cumplimiento EUDR, QA, logística internacional' :
               locale === 'de' ? 'Export & Sourcing von Kakao/Kaffee — EUDR-Konformität, QA, internationale Logistik' :
               locale === 'ru' ? 'Экспорт и поставки какао/кофе — соответствие EUDR, QA, международная логистика' :
               'Export & sourcing of cocoa/coffee — EUDR compliance, QA, international logistics'}
            </p>
          </div>
        </ScrollReveal>

        {/* Journeys Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
          {/* Buyer Journey Card - Olive/Gold accent */}
          <ScrollReveal animation="fade" delay={0.1}>
            <Link
              href={`/${locale}/rfq`}
              className="group block bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 md:p-8 hover:-translate-y-1 border-2 border-transparent hover:border-[#655E2C]/20"
            >
              {/* Card Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#655E2C] to-[#8A7F3D] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground dark:text-dark-text-primary">
                    {t.buyer.title}
                  </h3>
                </div>
                <p className="text-sm text-foreground/70 dark:text-dark-text-secondary mb-4">
                  {t.buyer.description}
                </p>

                {/* Proof Chips with icons & hover - desaturated gold */}
                <div className="flex flex-wrap gap-2">
                  {t.buyer.proofs.map((proof, index) => (
                    <span
                      key={index}
                      className="group/chip bg-[#7A7340]/10 hover:bg-[#7A7340]/15 dark:bg-[#7A7340]/15 dark:hover:bg-[#7A7340]/25 text-[#5A5330] dark:text-[#9A9360] px-3 py-1.5 rounded-full text-xs font-semibold border-2 border-[#7A7340]/25 hover:border-[#7A7340]/40 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 text-[#7A7340]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {index === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />}
                        {index === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />}
                        {index === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
                      </svg>
                      <span>{proof.text}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Steps - Compact with strict grid alignment */}
              <div className="space-y-4 mb-6">
                {t.buyer.steps.map((step, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#7A7340] dark:bg-[#9A9360] rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-foreground dark:text-dark-text-primary leading-tight mb-1">
                        {step.title}
                      </h4>
                      <p className="text-xs text-foreground/60 dark:text-dark-text-secondary leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                {/* Primary CTA - 70% width with trust items on right */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-[#655E2C] hover:bg-[#655E2C]/90 dark:bg-[#8A7F3D] dark:hover:bg-[#8A7F3D]/90 text-white px-5 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md group-hover:shadow-lg">
                    <span>{t.buyer.ctaPrimary}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-0.5 text-[10px] text-foreground/60 dark:text-dark-text-secondary font-medium">
                    {t.buyer.trustItems.map((item, index) => (
                      <span key={index} className="whitespace-nowrap">• {item}</span>
                    ))}
                  </div>
                </div>

                {/* Secondary CTA - Ghost button style, left-aligned */}
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#655E2C]/5 hover:bg-[#655E2C]/10 dark:bg-[#8A7F3D]/5 dark:hover:bg-[#8A7F3D]/10 text-[#655E2C] dark:text-[#8A7F3D] text-xs font-medium transition-all duration-200 group/link border border-[#655E2C]/20 hover:border-[#655E2C]/30">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{t.buyer.ctaSecondary}</span>
                  <svg className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </Link>
          </ScrollReveal>

          {/* Institutional Journey Card - Blue/Teal accent */}
          <ScrollReveal animation="fade" delay={0.2}>
            <Link
              href={`/${locale}/contact`}
              className="group block bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 md:p-8 hover:-translate-y-1 border-2 border-transparent hover:border-[#337A49]/20"
            >
              {/* Card Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#337A49] to-[#4A9A62] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground dark:text-dark-text-primary">
                    {t.institutional.title}
                  </h3>
                </div>
                <p className="text-sm text-foreground/70 dark:text-dark-text-secondary mb-4">
                  {t.institutional.description}
                </p>

                {/* Proof Chips with icons & hover */}
                <div className="flex flex-wrap gap-2">
                  {t.institutional.proofs.map((proof, index) => (
                    <span
                      key={index}
                      className="group/chip bg-[#337A49]/10 hover:bg-[#337A49]/20 dark:bg-[#337A49]/20 dark:hover:bg-[#337A49]/30 text-[#337A49] dark:text-[#4A9A62] px-3 py-1.5 rounded-full text-xs font-semibold border-2 border-[#337A49]/20 hover:border-[#337A49]/40 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 text-[#337A49]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {index === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
                        {index === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />}
                        {index === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />}
                      </svg>
                      <span>{proof.text}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Steps - Compact with strict grid alignment */}
              <div className="space-y-4 mb-6">
                {t.institutional.steps.map((step, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#337A49] dark:bg-[#4A9A62] rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-foreground dark:text-dark-text-primary leading-tight mb-1">
                        {step.title}
                      </h4>
                      <p className="text-xs text-foreground/60 dark:text-dark-text-secondary leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                {/* Primary CTA - 70% width with trust items on right */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-[#337A49] hover:bg-[#337A49]/90 dark:bg-[#4A9A62] dark:hover:bg-[#4A9A62]/90 text-white px-5 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md group-hover:shadow-lg">
                    <span>{t.institutional.ctaPrimary}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-0.5 text-[10px] text-foreground/60 dark:text-dark-text-secondary font-medium">
                    {t.institutional.trustItems.map((item, index) => (
                      <span key={index} className="whitespace-nowrap">• {item}</span>
                    ))}
                  </div>
                </div>

                {/* Secondary CTA - Ghost button style, left-aligned */}
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#337A49]/5 hover:bg-[#337A49]/10 dark:bg-[#4A9A62]/5 dark:hover:bg-[#4A9A62]/10 text-[#337A49] dark:text-[#4A9A62] text-xs font-medium transition-all duration-200 group/link border border-[#337A49]/20 hover:border-[#337A49]/30">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>{t.institutional.ctaSecondary}</span>
                  <svg className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </Link>
          </ScrollReveal>
        </div>

        {/* Trust Bar - Hard proof */}
        <ScrollReveal animation="fade" delay={0.3}>
          <div className="bg-white dark:bg-dark-bg-secondary rounded-xl p-5 border border-foreground/10 dark:border-dark-border/20 shadow-sm">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm">
              {t.trustBar.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && (
                    <div className="hidden sm:block w-px h-5 bg-foreground/10 dark:bg-dark-border/20 -ml-2 mr-2"></div>
                  )}
                  <span className="font-semibold text-foreground dark:text-dark-text-primary whitespace-nowrap">
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
