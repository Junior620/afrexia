'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { Locale } from '@/types';

interface ServicesSectionProps {
  locale: Locale;
}

export function ServicesSection({ locale }: ServicesSectionProps) {
  const content = {
    fr: {
      title: 'Nos Services',
      subtitle: 'Du sourcing au port : un service complet, conforme et prêt pour audit.',
      proofBadges: ['EUDR-ready', 'Chain of custody', 'QA documentée'],
      services: [
        {
          id: 'negoce',
          title: 'Négoce & Import-Export',
          subtitle: 'Commodités',
          microcopy: 'Sourcing direct, volumes sécurisés',
          description: 'Accès direct aux origines, négociation transparente, contrats flexibles adaptés aux acheteurs industriels.',
          tags: ['Cacao', 'Café', 'Poivre'],
          image: '/assets/services/negoce.jpg',
          icon: 'trade',
          link: '/services/negoce',
          cta: 'Découvrir',
        },
        {
          id: 'logistique',
          title: 'Logistique & Entrepôt',
          subtitle: 'Export',
          microcopy: 'Stockage sécurisé, export maîtrisé',
          description: 'Entrepôts certifiés, gestion documentaire complète, coordination port-to-port pour livraisons fiables.',
          tags: ['Stockage', 'Export', 'Incoterms'],
          image: '/assets/services/logistique.jpg',
          icon: 'warehouse',
          link: '/services/logistique',
          cta: 'Voir comment',
        },
        {
          id: 'transformation',
          title: 'Transformation & Impact Local',
          subtitle: 'Valeur ajoutée',
          microcopy: 'Transformation locale, impact social',
          description: 'Unités de transformation locales, création d\'emplois, valorisation des produits à la source.',
          tags: ['Torréfaction', 'Séchage', 'Impact'],
          image: '/assets/services/transformation.jpg',
          icon: 'impact',
          link: '/services/transformation',
          cta: 'Découvrir',
        },
        {
          id: 'traceabilite',
          title: 'Digitalisation & Traçabilité',
          subtitle: 'EUDR-ready',
          microcopy: 'Traçabilité complète, conformité EUDR',
          description: 'Système digital de traçabilité, géolocalisation parcelles, documentation audit-ready pour conformité totale.',
          tags: ['EUDR', 'Blockchain', 'CoC'],
          image: '/assets/services/traceabilite.jpg',
          icon: 'traceability',
          link: '/services/traceabilite',
          cta: 'Voir le système',
        },
      ],
      ctaPrimary: 'Planifier un appel (15 min)',
      ctaSecondary: 'Demander un devis (RFQ)',
      ctaMicro: 'Réponse sous 24h • NDA standard',
    },
    en: {
      title: 'Our Services',
      subtitle: 'From sourcing to port: complete, compliant, audit-ready service.',
      proofBadges: ['EUDR-ready', 'Chain of custody', 'QA documented'],
      services: [
        {
          id: 'negoce',
          title: 'Trading & Import-Export',
          subtitle: 'Commodities',
          microcopy: 'Direct sourcing, secured volumes',
          description: 'Direct access to origins, transparent negotiation, flexible contracts tailored for industrial buyers.',
          tags: ['Cocoa', 'Coffee', 'Pepper'],
          image: '/assets/services/negoce.jpg',
          icon: 'trade',
          link: '/services/negoce',
          cta: 'Discover',
        },
        {
          id: 'logistique',
          title: 'Logistics & Warehouse',
          subtitle: 'Export',
          microcopy: 'Secure storage, controlled export',
          description: 'Certified warehouses, complete documentation management, port-to-port coordination for reliable deliveries.',
          tags: ['Storage', 'Export', 'Incoterms'],
          image: '/assets/services/logistique.jpg',
          icon: 'warehouse',
          link: '/services/logistique',
          cta: 'See how',
        },
        {
          id: 'transformation',
          title: 'Processing & Local Impact',
          subtitle: 'Added value',
          microcopy: 'Local processing, social impact',
          description: 'Local processing units, job creation, product valorization at source.',
          tags: ['Roasting', 'Drying', 'Impact'],
          image: '/assets/services/transformation.jpg',
          icon: 'impact',
          link: '/services/transformation',
          cta: 'Discover',
        },
        {
          id: 'traceabilite',
          title: 'Digitalization & Traceability',
          subtitle: 'EUDR-ready',
          microcopy: 'Full traceability, EUDR compliance',
          description: 'Digital traceability system, plot geolocation, audit-ready documentation for total compliance.',
          tags: ['EUDR', 'Blockchain', 'CoC'],
          image: '/assets/services/traceabilite.jpg',
          icon: 'traceability',
          link: '/services/traceabilite',
          cta: 'See system',
        },
      ],
      ctaPrimary: 'Book a call (15 min)',
      ctaSecondary: 'Request a quote (RFQ)',
      ctaMicro: 'Reply within 24h • Standard NDA',
    },
    es: {
      title: 'Nuestros Servicios',
      subtitle: 'Del sourcing al puerto: servicio completo, conforme y listo para auditoría.',
      proofBadges: ['EUDR-ready', 'Cadena de custodia', 'QA documentado'],
      services: [
        {
          id: 'negoce',
          title: 'Comercio e Importación-Exportación',
          subtitle: 'Commodities',
          microcopy: 'Sourcing directo, volúmenes asegurados',
          description: 'Acceso directo a orígenes, negociación transparente, contratos flexibles adaptados a compradores industriales.',
          tags: ['Cacao', 'Café', 'Pimienta'],
          image: '/assets/services/negoce.jpg',
          icon: 'trade',
          link: '/services/negoce',
          cta: 'Descubrir',
        },
        {
          id: 'logistique',
          title: 'Logística y Almacén',
          subtitle: 'Exportación',
          microcopy: 'Almacenamiento seguro, exportación controlada',
          description: 'Almacenes certificados, gestión documental completa, coordinación puerto a puerto para entregas confiables.',
          tags: ['Almacenamiento', 'Exportación', 'Incoterms'],
          image: '/assets/services/logistique.jpg',
          icon: 'warehouse',
          link: '/services/logistique',
          cta: 'Ver cómo',
        },
        {
          id: 'transformation',
          title: 'Transformación e Impacto Local',
          subtitle: 'Valor agregado',
          microcopy: 'Transformación local, impacto social',
          description: 'Unidades de transformación locales, creación de empleos, valorización de productos en origen.',
          tags: ['Tostado', 'Secado', 'Impacto'],
          image: '/assets/services/transformation.jpg',
          icon: 'impact',
          link: '/services/transformation',
          cta: 'Descubrir',
        },
        {
          id: 'traceabilite',
          title: 'Digitalización y Trazabilidad',
          subtitle: 'EUDR-ready',
          microcopy: 'Trazabilidad completa, cumplimiento EUDR',
          description: 'Sistema digital de trazabilidad, geolocalización de parcelas, documentación lista para auditoría para cumplimiento total.',
          tags: ['EUDR', 'Blockchain', 'CoC'],
          image: '/assets/services/traceabilite.jpg',
          icon: 'traceability',
          link: '/services/traceabilite',
          cta: 'Ver sistema',
        },
      ],
      ctaPrimary: 'Programar una llamada (15 min)',
      ctaSecondary: 'Solicitar cotización (RFQ)',
      ctaMicro: 'Respuesta en 24h • NDA estándar',
    },
    de: {
      title: 'Unsere Dienstleistungen',
      subtitle: 'Vom Sourcing bis zum Hafen: vollständiger, konformer und audit-bereiter Service.',
      proofBadges: ['EUDR-ready', 'Custody-Kette', 'QA dokumentiert'],
      services: [
        {
          id: 'negoce',
          title: 'Handel & Import-Export',
          subtitle: 'Commodities',
          microcopy: 'Direktes Sourcing, gesicherte Mengen',
          description: 'Direkter Zugang zu Herkünften, transparente Verhandlung, flexible Verträge für industrielle Käufer.',
          tags: ['Kakao', 'Kaffee', 'Pfeffer'],
          image: '/assets/services/negoce.jpg',
          icon: 'trade',
          link: '/services/negoce',
          cta: 'Entdecken',
        },
        {
          id: 'logistique',
          title: 'Logistik & Lager',
          subtitle: 'Export',
          microcopy: 'Sichere Lagerung, kontrollierter Export',
          description: 'Zertifizierte Lager, vollständige Dokumentenverwaltung, Hafen-zu-Hafen-Koordination für zuverlässige Lieferungen.',
          tags: ['Lagerung', 'Export', 'Incoterms'],
          image: '/assets/services/logistique.jpg',
          icon: 'warehouse',
          link: '/services/logistique',
          cta: 'Wie es funktioniert',
        },
        {
          id: 'transformation',
          title: 'Verarbeitung & Lokale Wirkung',
          subtitle: 'Mehrwert',
          microcopy: 'Lokale Verarbeitung, soziale Wirkung',
          description: 'Lokale Verarbeitungseinheiten, Arbeitsplatzschaffung, Produktvalorisierung an der Quelle.',
          tags: ['Röstung', 'Trocknung', 'Wirkung'],
          image: '/assets/services/transformation.jpg',
          icon: 'impact',
          link: '/services/transformation',
          cta: 'Entdecken',
        },
        {
          id: 'traceabilite',
          title: 'Digitalisierung & Rückverfolgbarkeit',
          subtitle: 'EUDR-ready',
          microcopy: 'Vollständige Rückverfolgbarkeit, EUDR-Konformität',
          description: 'Digitales Rückverfolgbarkeitssystem, Parzellen-Geolokalisierung, audit-bereite Dokumentation für vollständige Konformität.',
          tags: ['EUDR', 'Blockchain', 'CoC'],
          image: '/assets/services/traceabilite.jpg',
          icon: 'traceability',
          link: '/services/traceabilite',
          cta: 'System ansehen',
        },
      ],
      ctaPrimary: 'Gespräch vereinbaren (15 Min)',
      ctaSecondary: 'Angebot anfordern (RFQ)',
      ctaMicro: 'Antwort in 24h • Standard-NDA',
    },
    ru: {
      title: 'Наши Услуги',
      subtitle: 'От сорсинга до порта: полный, соответствующий и готовый к аудиту сервис.',
      proofBadges: ['EUDR-ready', 'Цепочка поставок', 'QA задокументирован'],
      services: [
        {
          id: 'negoce',
          title: 'Торговля и Импорт-Экспорт',
          subtitle: 'Commodities',
          microcopy: 'Прямой сорсинг, обеспеченные объемы',
          description: 'Прямой доступ к источникам, прозрачные переговоры, гибкие контракты для промышленных покупателей.',
          tags: ['Какао', 'Кофе', 'Перец'],
          image: '/assets/services/negoce.jpg',
          icon: 'trade',
          link: '/services/negoce',
          cta: 'Узнать',
        },
        {
          id: 'logistique',
          title: 'Логистика и Склад',
          subtitle: 'Экспорт',
          microcopy: 'Безопасное хранение, контролируемый экспорт',
          description: 'Сертифицированные склады, полное управление документацией, координация порт-порт для надежных поставок.',
          tags: ['Хранение', 'Экспорт', 'Incoterms'],
          image: '/assets/services/logistique.jpg',
          icon: 'warehouse',
          link: '/services/logistique',
          cta: 'Как это работает',
        },
        {
          id: 'transformation',
          title: 'Переработка и Местное Воздействие',
          subtitle: 'Добавленная стоимость',
          microcopy: 'Местная переработка, социальное воздействие',
          description: 'Местные перерабатывающие предприятия, создание рабочих мест, повышение ценности продуктов у источника.',
          tags: ['Обжарка', 'Сушка', 'Воздействие'],
          image: '/assets/services/transformation.jpg',
          icon: 'impact',
          link: '/services/transformation',
          cta: 'Узнать',
        },
        {
          id: 'traceabilite',
          title: 'Цифровизация и Прослеживаемость',
          subtitle: 'EUDR-ready',
          microcopy: 'Полная прослеживаемость, соответствие EUDR',
          description: 'Цифровая система прослеживаемости, геолокация участков, документация готовая к аудиту для полного соответствия.',
          tags: ['EUDR', 'Blockchain', 'CoC'],
          image: '/assets/services/traceabilite.jpg',
          icon: 'traceability',
          link: '/services/traceabilite',
          cta: 'Посмотреть систему',
        },
      ],
      ctaPrimary: 'Запланировать звонок (15 мин)',
      ctaSecondary: 'Запросить предложение (RFQ)',
      ctaMicro: 'Ответ в течение 24ч • Стандартный NDA',
    },
  };

  const t = content[locale] || content.en;

  const getServiceIcon = (iconType: string) => {
    switch (iconType) {
      case 'trade':
        return (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'warehouse':
        return (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'impact':
        return (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'traceability':
        return (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-14 md:py-22 bg-[#0A1410] dark:bg-[#0A1410] relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <ScrollReveal animation="fade">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#E8F5E9] mb-4 leading-tight">
              {t.title}
            </h2>
            <p className="text-base md:text-lg text-[#C5D9C0] max-w-3xl mx-auto mb-6">
              {t.subtitle}
            </p>
            
            {/* Proof Badges */}
            <div className="flex flex-wrap justify-center gap-3">
              {t.proofBadges.map((badge, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-[rgba(74,154,98,0.15)] backdrop-blur-sm border border-[rgba(74,154,98,0.3)] rounded-full text-[#4A9A62] text-xs font-semibold"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Services Grid - 4 colonnes desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {t.services.map((service, index) => (
            <ScrollReveal key={service.id} animation="fade" delay={index * 0.1}>
              <Link
                href={`/${locale}${service.link}`}
                className="group relative block h-[420px] rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#4A9A62]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#4A9A62]/20"
              >
                {/* Background Image with zoom effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    priority={index < 2}
                    loading={index < 2 ? 'eager' : 'lazy'}
                  />
                </div>

                {/* Gradient Overlay - plus fort */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 group-hover:from-black/90 group-hover:via-black/50 transition-colors duration-300" />

                {/* Labels/Badges - Top */}
                <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2 z-10">
                  {service.tags.slice(0, 2).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[rgba(74,154,98,0.15)] backdrop-blur-sm border border-[rgba(74,154,98,0.3)] rounded-full text-[#4A9A62] text-xs font-semibold"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Content (bottom) */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  {/* Subtitle */}
                  <p className="text-[#A89858] text-xs font-semibold uppercase tracking-wider mb-2">
                    {service.subtitle}
                  </p>

                  {/* Title */}
                  <h3 className="text-[#E8F5E9] text-lg font-bold mb-2 leading-tight">
                    {service.title}
                  </h3>

                  {/* Microcopy */}
                  <p className="text-[#C5D9C0] text-sm mb-4 line-clamp-1">
                    {service.microcopy}
                  </p>

                  {/* CTA Ghost - visible on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-transparent border border-[#4A9A62] rounded-lg text-[#4A9A62] font-semibold text-sm hover:bg-[rgba(74,154,98,0.1)] transition-colors">
                      {service.cta}
                      <svg
                        className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA Section */}
        <ScrollReveal animation="fade">
          <div className="bg-white/[0.03] backdrop-blur-sm border border-[rgba(74,154,98,0.2)] rounded-2xl p-8 md:p-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Text */}
              <div className="text-center lg:text-left">
                <h3 className="text-xl md:text-2xl font-bold text-[#E8F5E9] mb-2">
                  {locale === 'fr' ? 'Besoin d\'un devis rapide ?' : 'Need a quick quote?'}
                </h3>
                <p className="text-sm text-[#C5D9C0]">
                  {t.ctaMicro}
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <Link
                  href={`/${locale}/rfq`}
                  className="inline-flex items-center justify-center bg-[#4A9A62] hover:bg-[#5AAA72] text-white px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
                >
                  {t.ctaSecondary}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center justify-center bg-transparent hover:bg-[rgba(74,154,98,0.1)] text-[#4A9A62] border-2 border-[#4A9A62] px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 whitespace-nowrap"
                >
                  {t.ctaPrimary}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
