import Link from 'next/link';
import Image from 'next/image';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { Locale } from '@/types';
import { urlFor } from '@/sanity/lib/image';

interface CertificationsSectionProps {
  certifications: any[];
  locale: Locale;
}

export function CertificationsSection({
  certifications,
  locale,
}: CertificationsSectionProps) {
  const content = {
    fr: {
      title: 'Certifications & Conformité',
      subtitle: 'Nos certifications internationales garantissent la qualité et la traçabilité de nos produits',
      viewAll: 'Voir Toutes les Certifications',
      learnMore: 'En Savoir Plus',
    },
    en: {
      title: 'Certifications & Compliance',
      subtitle: 'Our international certifications guarantee the quality and traceability of our products',
      viewAll: 'View All Certifications',
      learnMore: 'Learn More',
    },
  };

  const t = content[locale] || content.en; // Fallback to English if locale not found

  // Show first 6 certifications
  const displayedCertifications = certifications.slice(0, 6);

  return (
    <section className="py-16 md:py-24 bg-white">
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

        {/* Certifications Grid */}
        {displayedCertifications.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 mb-12">
            {displayedCertifications.map((cert, index) => (
              <ScrollReveal
                key={cert._id}
                animation="scale"
                delay={index * 0.05}
              >
                <div className="bg-light rounded-lg p-6 flex items-center justify-center hover:shadow-md transition-shadow group">
                  {cert.logo ? (
                    <Image
                      src={urlFor(cert.logo)?.width(120).height(120).url() || ''}
                      alt={cert.name}
                      width={80}
                      height={80}
                      className="object-contain group-hover:scale-110 transition-transform"
                      title={cert.name}
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg
                          className="w-8 h-8 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                          />
                        </svg>
                      </div>
                      <p className="text-xs text-foreground font-medium">
                        {cert.name}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 bg-light rounded-lg px-6 py-4">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              <span className="text-foreground font-medium">
                {locale === 'fr'
                  ? 'Certifications internationales disponibles'
                  : 'International certifications available'}
              </span>
            </div>
          </div>
        )}

        {/* CTA */}
        <ScrollReveal animation="fade">
          <div className="text-center">
            <Link
              href={`/${locale}/quality`}
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold text-lg transition-colors group"
            >
              {t.learnMore}
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
