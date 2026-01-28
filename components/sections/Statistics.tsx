'use client';

import { CounterAnimation } from '@/components/animations/CounterAnimation';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { Locale } from '@/types';
import Link from 'next/link';

interface StatisticsProps {
  locale: Locale;
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

export function Statistics({ locale }: StatisticsProps) {
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
        fr: 'Cacao, café & commodités/an',
        en: 'Cocoa, coffee & commodities/year',
        es: 'Cacao, café y productos/año',
        de: 'Kakao, Kaffee & Rohstoffe/Jahr',
        ru: 'Какао, кофе и товары/год',
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
        fr: 'Internationales',
        en: 'International',
        es: 'Internacionales',
        de: 'International',
        ru: 'Международных',
      },
      icon: 'certificate',
    },
  ];

  const content = {
    fr: {
      title: 'Notre Impact en Chiffres',
      subtitle: 'Des résultats qui témoignent de notre engagement envers l\'excellence',
      ctaPrimary: 'Demander un devis',
      ctaSecondary: 'Télécharger le catalogue',
      viewCertifications: 'Voir nos certificats',
    },
    en: {
      title: 'Our Impact in Numbers',
      subtitle: 'Results that demonstrate our commitment to excellence',
      ctaPrimary: 'Request a Quote',
      ctaSecondary: 'Download Catalogue',
      viewCertifications: 'View our certificates',
    },
    es: {
      title: 'Nuestro Impacto en Cifras',
      subtitle: 'Resultados que demuestran nuestro compromiso con la excelencia',
      ctaPrimary: 'Solicitar Cotización',
      ctaSecondary: 'Descargar Catálogo',
      viewCertifications: 'Ver nuestros certificados',
    },
    de: {
      title: 'Unsere Wirkung in Zahlen',
      subtitle: 'Ergebnisse, die unser Engagement für Exzellenz demonstrieren',
      ctaPrimary: 'Angebot Anfordern',
      ctaSecondary: 'Katalog Herunterladen',
      viewCertifications: 'Unsere Zertifikate ansehen',
    },
    ru: {
      title: 'Наше Влияние в Цифрах',
      subtitle: 'Результаты, демонстрирующие нашу приверженность совершенству',
      ctaPrimary: 'Запросить Предложение',
      ctaSecondary: 'Скачать Каталог',
      viewCertifications: 'Посмотреть наши сертификаты',
    },
  };

  const t = content[locale] || content.en;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'clock':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'scale':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        );
      case 'globe':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'certificate':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-16 md:py-24 bg-sand dark:bg-dark-bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="fade">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-dark-primary mb-4">
              {t.title}
            </h2>
            <p className="text-lg md:text-xl text-neutral dark:text-dark-text-secondary max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Statistics Grid - Cards with Context */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <ScrollReveal
              key={index}
              animation="scale"
              delay={index * 0.1}
            >
              <div className="bg-white dark:bg-dark-bg-primary rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-primary/10 dark:border-dark-primary/20">
                {/* Icon */}
                <div className="text-accent dark:text-dark-accent mb-4">
                  {getIcon(stat.icon)}
                </div>
                
                {/* Number */}
                <div className="mb-2">
                  <CounterAnimation
                    value={stat.value}
                    suffix={stat.suffix}
                    duration={2.5}
                    className="text-4xl md:text-5xl font-bold text-primary dark:text-dark-primary"
                  />
                </div>
                
                {/* Label */}
                <p className="text-base font-semibold text-primary dark:text-dark-primary mb-1">
                  {stat.label[locale]}
                </p>
                
                {/* Context */}
                <p className="text-sm text-neutral dark:text-dark-text-secondary">
                  {stat.context[locale]}
                </p>
                
                {/* Special link for certifications */}
                {stat.icon === 'certificate' && (
                  <Link 
                    href={`/${locale}/quality`}
                    className="inline-flex items-center gap-1 text-sm text-accent dark:text-dark-accent hover:underline mt-2"
                  >
                    {t.viewCertifications}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA Buttons */}
        <ScrollReveal animation="fade">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={`/${locale}/rfq`}
              className="inline-flex items-center justify-center bg-accent hover:bg-accent-dark dark:bg-dark-accent dark:hover:bg-dark-accent/90 text-white px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {t.ctaPrimary}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href={`/${locale}/resources`}
              className="inline-flex items-center justify-center bg-transparent hover:bg-primary/5 dark:hover:bg-dark-primary/10 text-primary dark:text-dark-primary border-2 border-primary dark:border-dark-primary px-8 py-4 rounded-full font-semibold text-base transition-all duration-300"
            >
              {t.ctaSecondary}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
