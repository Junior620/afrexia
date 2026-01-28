'use client';

import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { Locale } from '@/types';
import Link from 'next/link';

interface TrustBarProps {
  locale: Locale;
}

export function TrustBar({ locale }: TrustBarProps) {
  const content = {
    fr: {
      title: 'Conformité, Traçabilité & Assurance Qualité',
      subtitle: 'Documentation complète disponible sur demande',
      certifications: 'Certifications',
      traceability: 'Traçabilité EUDR',
      quality: 'Contrôle Qualité',
      documentation: 'Documentation',
      viewCertifications: 'Voir nos certificats',
      learnMore: 'En savoir plus',
    },
    en: {
      title: 'Compliance, Traceability & Quality Assurance',
      subtitle: 'Complete documentation available upon request',
      certifications: 'Certifications',
      traceability: 'EUDR Traceability',
      quality: 'Quality Control',
      documentation: 'Documentation',
      viewCertifications: 'View our certificates',
      learnMore: 'Learn more',
    },
    es: {
      title: 'Cumplimiento, Trazabilidad y Garantía de Calidad',
      subtitle: 'Documentación completa disponible bajo solicitud',
      certifications: 'Certificaciones',
      traceability: 'Trazabilidad EUDR',
      quality: 'Control de Calidad',
      documentation: 'Documentación',
      viewCertifications: 'Ver nuestros certificados',
      learnMore: 'Más información',
    },
    de: {
      title: 'Compliance, Rückverfolgbarkeit & Qualitätssicherung',
      subtitle: 'Vollständige Dokumentation auf Anfrage verfügbar',
      certifications: 'Zertifizierungen',
      traceability: 'EUDR-Rückverfolgbarkeit',
      quality: 'Qualitätskontrolle',
      documentation: 'Dokumentation',
      viewCertifications: 'Unsere Zertifikate ansehen',
      learnMore: 'Mehr erfahren',
    },
    ru: {
      title: 'Соответствие, Прослеживаемость и Контроль Качества',
      subtitle: 'Полная документация доступна по запросу',
      certifications: 'Сертификаты',
      traceability: 'Прослеживаемость EUDR',
      quality: 'Контроль Качества',
      documentation: 'Документация',
      viewCertifications: 'Посмотреть наши сертификаты',
      learnMore: 'Узнать больше',
    },
  };

  const t = content[locale] || content.en;

  const trustItems = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      label: t.certifications,
      count: '8+',
      link: `/${locale}/quality`,
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      label: t.traceability,
      count: '100%',
      link: `/${locale}/traceability`,
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: t.quality,
      count: 'ISO',
      link: `/${locale}/quality`,
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      label: t.documentation,
      count: 'PDF',
      link: `/${locale}/resources`,
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-primary/5 dark:bg-dark-primary/5 border-y border-primary/10 dark:border-dark-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal animation="fade">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-primary dark:text-dark-primary mb-2">
              {t.title}
            </h3>
            <p className="text-sm md:text-base text-neutral dark:text-dark-text-secondary">
              {t.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Trust Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustItems.map((item, index) => (
            <ScrollReveal
              key={index}
              animation="fade"
              delay={index * 0.1}
            >
              <Link
                href={item.link}
                className="group flex flex-col items-center text-center p-4 rounded-lg hover:bg-white dark:hover:bg-dark-bg-secondary transition-all duration-300 hover:shadow-md"
              >
                <div className="text-accent dark:text-dark-accent mb-3 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="text-2xl font-bold text-primary dark:text-dark-primary mb-1">
                  {item.count}
                </div>
                <div className="text-sm font-medium text-neutral dark:text-dark-text-secondary group-hover:text-primary dark:group-hover:text-dark-primary transition-colors">
                  {item.label}
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal animation="fade">
          <div className="text-center mt-8">
            <Link
              href={`/${locale}/quality`}
              className="inline-flex items-center gap-2 text-primary dark:text-dark-primary hover:text-accent dark:hover:text-dark-accent font-semibold text-sm transition-colors"
            >
              {t.viewCertifications}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
