'use client';

import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { Locale } from '@/types';

interface ProcessComplianceSectionProps {
  locale: Locale;
}

export function ProcessComplianceSection({ locale }: ProcessComplianceSectionProps) {
  const content = {
    fr: {
      title: 'Processus & Conformité',
      subtitle: 'Normes rigoureuses et traçabilité complète pour garantir l\'excellence',
      sections: [
        {
          id: 'quality',
          icon: 'quality',
          title: 'Normes de Qualité',
          description: 'Nous respectons les normes internationales les plus élevées pour les commodités agricoles.',
          items: [
            'Classement selon normes ISO, USDA, ICO',
            'Tests en laboratoire accrédités',
            'Inspection pré-expédition indépendante',
            'Documentation complète et traçabilité',
          ],
        },
        {
          id: 'traceability',
          icon: 'traceability',
          title: 'Processus de Traçabilité',
          description: 'Suivi complet de la ferme au port avec documentation audit-ready.',
          items: [
            'Géolocalisation GPS des parcelles',
            'Chaîne de traçabilité documentée',
            'Surveillance satellite continue',
            'Système digital blockchain',
          ],
        },
        {
          id: 'certifications',
          icon: 'certifications',
          title: 'Certifications',
          description: 'Certifications internationalement reconnues démontrant notre engagement.',
          items: [
            'EUDR Ready - Conformité totale',
            'Bio & Fair Trade certifiés',
            'Rainforest Alliance',
            'ISO 9001 & ISO 22000',
          ],
        },
      ],
    },
    en: {
      title: 'Process & Compliance',
      subtitle: 'Rigorous standards and complete traceability ensuring excellence',
      sections: [
        {
          id: 'quality',
          icon: 'quality',
          title: 'Quality Standards',
          description: 'We adhere to the highest international standards for agricultural commodities.',
          items: [
            'Grading per ISO, USDA, ICO standards',
            'Accredited laboratory testing',
            'Independent pre-shipment inspection',
            'Complete documentation and traceability',
          ],
        },
        {
          id: 'traceability',
          icon: 'traceability',
          title: 'Traceability Process',
          description: 'Complete tracking from farm to port with audit-ready documentation.',
          items: [
            'GPS geolocation of plots',
            'Documented chain of custody',
            'Continuous satellite monitoring',
            'Blockchain digital system',
          ],
        },
        {
          id: 'certifications',
          icon: 'certifications',
          title: 'Certifications',
          description: 'Internationally recognized certifications demonstrating our commitment.',
          items: [
            'EUDR Ready - Full compliance',
            'Organic & Fair Trade certified',
            'Rainforest Alliance',
            'ISO 9001 & ISO 22000',
          ],
        },
      ],
    },
    es: {
      title: 'Proceso y Conformidad',
      subtitle: 'Normas rigurosas y trazabilidad completa garantizando la excelencia',
      sections: [
        {
          id: 'quality',
          icon: 'quality',
          title: 'Normas de Calidad',
          description: 'Cumplimos con los más altos estándares internacionales para commodities agrícolas.',
          items: [
            'Clasificación según normas ISO, USDA, ICO',
            'Pruebas de laboratorio acreditadas',
            'Inspección pre-embarque independiente',
            'Documentación completa y trazabilidad',
          ],
        },
        {
          id: 'traceability',
          icon: 'traceability',
          title: 'Proceso de Trazabilidad',
          description: 'Seguimiento completo de la finca al puerto con documentación lista para auditoría.',
          items: [
            'Geolocalización GPS de parcelas',
            'Cadena de custodia documentada',
            'Monitoreo satelital continuo',
            'Sistema digital blockchain',
          ],
        },
        {
          id: 'certifications',
          icon: 'certifications',
          title: 'Certificaciones',
          description: 'Certificaciones reconocidas internacionalmente demostrando nuestro compromiso.',
          items: [
            'EUDR Ready - Cumplimiento total',
            'Orgánico y Comercio Justo certificados',
            'Rainforest Alliance',
            'ISO 9001 e ISO 22000',
          ],
        },
      ],
    },
    de: {
      title: 'Prozess & Konformität',
      subtitle: 'Strenge Standards und vollständige Rückverfolgbarkeit für Exzellenz',
      sections: [
        {
          id: 'quality',
          icon: 'quality',
          title: 'Qualitätsstandards',
          description: 'Wir halten uns an die höchsten internationalen Standards für landwirtschaftliche Rohstoffe.',
          items: [
            'Einstufung nach ISO, USDA, ICO Standards',
            'Akkreditierte Labortests',
            'Unabhängige Vorversandinspektion',
            'Vollständige Dokumentation und Rückverfolgbarkeit',
          ],
        },
        {
          id: 'traceability',
          icon: 'traceability',
          title: 'Rückverfolgbarkeitsprozess',
          description: 'Vollständige Verfolgung vom Bauernhof zum Hafen mit audit-bereiter Dokumentation.',
          items: [
            'GPS-Geolokalisierung von Parzellen',
            'Dokumentierte Custody-Kette',
            'Kontinuierliche Satellitenüberwachung',
            'Blockchain-Digitalsystem',
          ],
        },
        {
          id: 'certifications',
          icon: 'certifications',
          title: 'Zertifizierungen',
          description: 'International anerkannte Zertifizierungen, die unser Engagement zeigen.',
          items: [
            'EUDR Ready - Vollständige Konformität',
            'Bio & Fair Trade zertifiziert',
            'Rainforest Alliance',
            'ISO 9001 & ISO 22000',
          ],
        },
      ],
    },
    ru: {
      title: 'Процесс и Соответствие',
      subtitle: 'Строгие стандарты и полная прослеживаемость обеспечивают превосходство',
      sections: [
        {
          id: 'quality',
          icon: 'quality',
          title: 'Стандарты Качества',
          description: 'Мы придерживаемся самых высоких международных стандартов для сельскохозяйственных товаров.',
          items: [
            'Классификация по стандартам ISO, USDA, ICO',
            'Аккредитованное лабораторное тестирование',
            'Независимая предотгрузочная инспекция',
            'Полная документация и прослеживаемость',
          ],
        },
        {
          id: 'traceability',
          icon: 'traceability',
          title: 'Процесс Прослеживаемости',
          description: 'Полное отслеживание от фермы до порта с документацией готовой к аудиту.',
          items: [
            'GPS геолокация участков',
            'Документированная цепочка поставок',
            'Непрерывный спутниковый мониторинг',
            'Цифровая система блокчейн',
          ],
        },
        {
          id: 'certifications',
          icon: 'certifications',
          title: 'Сертификации',
          description: 'Международно признанные сертификации, демонстрирующие нашу приверженность.',
          items: [
            'EUDR Ready - Полное соответствие',
            'Органический и Fair Trade сертифицированы',
            'Rainforest Alliance',
            'ISO 9001 и ISO 22000',
          ],
        },
      ],
    },
  };

  const t = content[locale] || content.en;

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'quality':
        return (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'traceability':
        return (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        );
      case 'certifications':
        return (
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <ScrollReveal animation="fade">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t.title}
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.sections.map((section, index) => (
            <ScrollReveal key={section.id} animation="fade" delay={index * 0.1}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-[#194424] dark:bg-[#C8A24A] flex items-center justify-center text-white dark:text-gray-900 mb-6">
                  <div className="w-8 h-8">{getIcon(section.icon)}</div>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  {section.title}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {section.description}
                </p>

                {/* Items List */}
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-[#194424] dark:text-[#C8A24A] flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
