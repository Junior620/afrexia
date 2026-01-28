'use client';

import Link from 'next/link';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { Locale } from '@/types';

interface JourneySectionProps {
  locale: Locale;
}

interface Journey {
  title: {
    fr: string;
    en: string;
    es: string;
    de: string;
    ru: string;
  };
  description: {
    fr: string;
    en: string;
    es: string;
    de: string;
    ru: string;
  };
  steps: {
    title: {
      fr: string;
      en: string;
      es: string;
      de: string;
      ru: string;
    };
    description: {
      fr: string;
      en: string;
      es: string;
      de: string;
      ru: string;
    };
  }[];
  cta: {
    text: {
      fr: string;
      en: string;
      es: string;
      de: string;
      ru: string;
    };
    href: string;
  };
  icon: string;
}

export function JourneySection({ locale }: JourneySectionProps) {
  const journeys: Journey[] = [
    {
      title: {
        fr: 'Parcours Acheteur',
        en: 'Buyer Journey',
        es: 'Recorrido del Comprador',
        de: 'Käufer-Reise',
        ru: 'Путь Покупателя',
      },
      description: {
        fr: 'Pour les acheteurs B2B recherchant des commodités agricoles de qualité',
        en: 'For B2B buyers seeking quality agricultural commodities',
        es: 'Para compradores B2B que buscan productos agrícolas de calidad',
        de: 'Für B2B-Käufer, die hochwertige Agrarprodukte suchen',
        ru: 'Для B2B покупателей, ищущих качественные сельскохозяйственные товары',
      },
      steps: [
        {
          title: {
            fr: 'Découvrir',
            en: 'Discover',
            es: 'Descubrir',
            de: 'Entdecken',
            ru: 'Открыть',
          },
          description: {
            fr: 'Explorez notre gamme de produits premium avec spécifications détaillées',
            en: 'Explore our range of premium products with detailed specifications',
            es: 'Explore nuestra gama de productos premium con especificaciones detalladas',
            de: 'Entdecken Sie unser Sortiment an Premium-Produkten mit detaillierten Spezifikationen',
            ru: 'Изучите наш ассортимент премиальных продуктов с подробными спецификациями',
          },
        },
        {
          title: {
            fr: 'Évaluer',
            en: 'Evaluate',
            es: 'Evaluar',
            de: 'Bewerten',
            ru: 'Оценить',
          },
          description: {
            fr: 'Consultez les certifications, origines et options logistiques',
            en: 'Review certifications, origins, and logistics options',
            es: 'Revise certificaciones, orígenes y opciones logísticas',
            de: 'Überprüfen Sie Zertifizierungen, Herkunft und Logistikoptionen',
            ru: 'Ознакомьтесь с сертификатами, происхождением и логистическими опциями',
          },
        },
        {
          title: {
            fr: 'Commander',
            en: 'Order',
            es: 'Ordenar',
            de: 'Bestellen',
            ru: 'Заказать',
          },
          description: {
            fr: 'Demandez un devis personnalisé adapté à vos besoins',
            en: 'Request a customized quote tailored to your needs',
            es: 'Solicite una cotización personalizada adaptada a sus necesidades',
            de: 'Fordern Sie ein individuelles Angebot an, das auf Ihre Bedürfnisse zugeschnitten ist',
            ru: 'Запросите индивидуальное предложение, адаптированное под ваши потребности',
          },
        },
      ],
      cta: {
        text: {
          fr: 'Demander un Devis',
          en: 'Request a Quote',
          es: 'Solicitar Cotización',
          de: 'Angebot Anfordern',
          ru: 'Запросить Предложение',
        },
        href: '/rfq',
      },
      icon: 'shopping',
    },
    {
      title: {
        fr: 'Parcours Institutionnel',
        en: 'Institutional Journey',
        es: 'Recorrido Institucional',
        de: 'Institutionelle Reise',
        ru: 'Институциональный Путь',
      },
      description: {
        fr: 'Pour les partenaires institutionnels et investisseurs',
        en: 'For institutional partners and investors',
        es: 'Para socios institucionales e inversores',
        de: 'Für institutionelle Partner und Investoren',
        ru: 'Для институциональных партнеров и инвесторов',
      },
      steps: [
        {
          title: {
            fr: 'Traçabilité',
            en: 'Traceability',
            es: 'Trazabilidad',
            de: 'Rückverfolgbarkeit',
            ru: 'Отслеживаемость',
          },
          description: {
            fr: 'Vérifiez notre conformité EUDR et notre chaîne d\'approvisionnement',
            en: 'Verify our EUDR compliance and supply chain',
            es: 'Verifique nuestro cumplimiento EUDR y cadena de suministro',
            de: 'Überprüfen Sie unsere EUDR-Konformität und Lieferkette',
            ru: 'Проверьте наше соответствие EUDR и цепочку поставок',
          },
        },
        {
          title: {
            fr: 'Qualité',
            en: 'Quality',
            es: 'Calidad',
            de: 'Qualität',
            ru: 'Качество',
          },
          description: {
            fr: 'Découvrez nos certifications et processus d\'assurance qualité',
            en: 'Discover our certifications and quality assurance processes',
            es: 'Descubra nuestras certificaciones y procesos de aseguramiento de calidad',
            de: 'Entdecken Sie unsere Zertifizierungen und Qualitätssicherungsprozesse',
            ru: 'Откройте для себя наши сертификаты и процессы обеспечения качества',
          },
        },
        {
          title: {
            fr: 'Partenariat',
            en: 'Partnership',
            es: 'Asociación',
            de: 'Partnerschaft',
            ru: 'Партнерство',
          },
          description: {
            fr: 'Établissez une collaboration à long terme avec notre équipe',
            en: 'Establish a long-term collaboration with our team',
            es: 'Establezca una colaboración a largo plazo con nuestro equipo',
            de: 'Etablieren Sie eine langfristige Zusammenarbeit mit unserem Team',
            ru: 'Установите долгосрочное сотрудничество с нашей командой',
          },
        },
      ],
      cta: {
        text: {
          fr: 'Nous Contacter',
          en: 'Contact Us',
          es: 'Contáctenos',
          de: 'Kontaktieren Sie Uns',
          ru: 'Свяжитесь с Нами',
        },
        href: '/contact',
      },
      icon: 'partnership',
    },
  ];

  const content = {
    fr: {
      title: 'Votre Parcours avec Afrexia',
      subtitle: 'Nous accompagnons chaque client selon ses besoins spécifiques',
    },
    en: {
      title: 'Your Journey with Afrexia',
      subtitle: 'We support each client according to their specific needs',
    },
    es: {
      title: 'Su Viaje con Afrexia',
      subtitle: 'Apoyamos a cada cliente según sus necesidades específicas',
    },
    de: {
      title: 'Ihre Reise mit Afrexia',
      subtitle: 'Wir unterstützen jeden Kunden entsprechend seinen spezifischen Bedürfnissen',
    },
    ru: {
      title: 'Ваш Путь с Afrexia',
      subtitle: 'Мы поддерживаем каждого клиента в соответствии с его конкретными потребностями',
    },
  };

  const t = content[locale] || content.en; // Fallback to English if locale not found

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="fade">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
              {t.title}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Journeys Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {journeys.map((journey, journeyIndex) => (
            <ScrollReveal
              key={journeyIndex}
              animation="fade"
              delay={journeyIndex * 0.2}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 hover:shadow-xl transition-shadow">
                {/* Journey Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      {journey.icon === 'shopping' ? (
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-primary">
                      {journey.title[locale]}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-base md:text-lg">
                    {journey.description[locale]}
                  </p>
                </div>

                {/* Timeline Steps */}
                <div className="space-y-6 mb-8">
                  {journey.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex gap-4">
                      {/* Step Number */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold">
                          {stepIndex + 1}
                        </div>
                        {stepIndex < journey.steps.length - 1 && (
                          <div className="w-0.5 h-12 bg-secondary/30 mx-auto mt-2" />
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 pt-1">
                        <h4 className="text-lg font-semibold text-foreground mb-1">
                          {step.title[locale]}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {step.description[locale]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  href={`/${locale}${journey.cta.href}`}
                  className="block w-full bg-primary hover:bg-primary-dark text-white text-center px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  {journey.cta.text[locale]}
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
