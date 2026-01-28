'use client';

import { CounterAnimation } from '@/components/animations/CounterAnimation';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { Locale } from '@/types';

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
    },
    {
      value: 10000,
      suffix: '+',
      label: {
        fr: 'Tonnes Exportées Annuellement',
        en: 'Tons Exported Annually',
        es: 'Toneladas Exportadas Anualmente',
        de: 'Jährlich Exportierte Tonnen',
        ru: 'Тонн Экспортируется Ежегодно',
      },
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
    },
    {
      value: 8,
      suffix: '+',
      label: {
        fr: 'Certifications Internationales',
        en: 'International Certifications',
        es: 'Certificaciones Internacionales',
        de: 'Internationale Zertifizierungen',
        ru: 'Международных Сертификатов',
      },
    },
  ];

  const content = {
    fr: {
      title: 'Notre Impact en Chiffres',
      subtitle: 'Des résultats qui témoignent de notre engagement envers l\'excellence',
    },
    en: {
      title: 'Our Impact in Numbers',
      subtitle: 'Results that demonstrate our commitment to excellence',
    },
    es: {
      title: 'Nuestro Impacto en Cifras',
      subtitle: 'Resultados que demuestran nuestro compromiso con la excelencia',
    },
    de: {
      title: 'Unsere Wirkung in Zahlen',
      subtitle: 'Ergebnisse, die unser Engagement für Exzellenz demonstrieren',
    },
    ru: {
      title: 'Наше Влияние в Цифрах',
      subtitle: 'Результаты, демонстрирующие нашу приверженность совершенству',
    },
  };

  const t = content[locale] || content.en; // Fallback to English if locale not found

  return (
    <section className="py-16 md:py-24 bg-sand">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="fade">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
              {t.title}
            </h2>
            <p className="text-lg md:text-xl text-support max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <ScrollReveal
              key={index}
              animation="scale"
              delay={index * 0.1}
            >
              <div className="text-center">
                <div className="mb-3">
                  <CounterAnimation
                    value={stat.value}
                    suffix={stat.suffix}
                    duration={2.5}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary"
                  />
                </div>
                <p className="text-base md:text-lg text-foreground font-medium">
                  {stat.label[locale]}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
