import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Locale } from '@/types';
import { getAllCertifications } from '@/lib/sanity/queries';
import { urlFor } from '@/sanity/lib/image';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { QualityHeroBadges } from '@/components/quality/QualityHeroBadges';
import { CompliancePackSection } from '@/components/quality/CompliancePackSection';
import { QualityFAQ } from '@/components/quality/QualityFAQ';
import { getQualityContent } from '@/lib/content/quality-data';
import { Shield } from 'lucide-react';

interface QualityPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export async function generateMetadata({
  params,
}: QualityPageProps): Promise<Metadata> {
  const { locale } = await params;
  const content = getQualityContent(locale);

  return {
    title: `${content.hero.title} | Afrexia`,
    description: content.hero.subtitle,
    alternates: {
      canonical: `/${locale}/quality`,
      languages: {
        fr: '/fr/quality',
        en: '/en/quality',
        es: '/es/quality',
        de: '/de/quality',
        ru: '/ru/quality',
      },
    },
  };
}

export default async function QualityPage({
  params,
}: QualityPageProps) {
  const { locale } = await params;
  const content = getQualityContent(locale);
  const certifications = await getAllCertifications();

  return (
    <main className="min-h-screen bg-[#0A1410]">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[50vh] md:min-h-[55vh] flex items-center justify-center py-16 md:py-20">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/quality-control.jpg"
            alt=""
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1410]/75 via-[#0A1410]/80 to-[#0A1410]/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_50%,rgba(0,0,0,0.3)_100%)]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal animation="fade">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#E8F5E9] leading-tight">
                {content.hero.title}
              </h1>
              <p className="text-xl md:text-2xl text-[#C5D9C0] leading-relaxed mb-8 max-w-3xl mx-auto">
                {content.hero.subtitle}
              </p>

              <QualityHeroBadges badges={content.hero.badges} />

              <p className="text-sm text-[#80996F] mt-6 mb-8">
                {content.hero.trustMicrocopy}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#compliance-pack"
                  className="inline-flex items-center justify-center bg-[#4A9A62] hover:bg-[#5AAA72] text-white px-8 py-4 rounded-xl font-semibold text-base transition-all shadow-lg hover:shadow-xl"
                >
                  {content.hero.ctaPrimary}
                </a>
                <a
                  href="#certifications"
                  className="inline-flex items-center justify-center bg-transparent hover:bg-[rgba(255,255,255,0.1)] text-[#E8F5E9] border-2 border-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.3)] px-8 py-4 rounded-xl font-semibold text-base transition-all"
                >
                  {content.hero.ctaSecondary}
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-20 bg-[#0F1814]">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#E8F5E9] mb-4">
                {content.certifications.title}
              </h2>
              <p className="text-xl text-[#C5D9C0] max-w-3xl mx-auto mb-8">
                {content.certifications.subtitle}
              </p>
            </div>
          </ScrollReveal>

          {certifications.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {certifications.map((cert: any, index: number) => (
                <ScrollReveal
                  key={cert._id}
                  animation="slide-up"
                  delay={index * 0.1}
                >
                  <div className="bg-[#0A1410] rounded-xl p-8 hover:shadow-2xl hover:shadow-[rgba(74,154,98,0.2)] transition-all duration-300 h-full border border-[rgba(255,255,255,0.08)] hover:border-[rgba(74,154,98,0.4)] hover:-translate-y-1">
                    {cert.logo && (
                      <div className="mb-6 flex justify-center">
                        <div className="relative w-32 h-32 bg-white/5 rounded-lg p-4">
                          <Image
                            src={urlFor(cert.logo).width(200).url()}
                            alt={cert.name[locale] || cert.name.en}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-[#E8F5E9] mb-3 text-center">
                      {cert.name[locale] || cert.name.en}
                    </h3>
                    {cert.description && (
                      <p className="text-[#C5D9C0] mb-4 text-center leading-relaxed">
                        {cert.description[locale] || cert.description.en}
                      </p>
                    )}
                    <div className="text-center">
                      <span className="inline-block px-3 py-1 bg-[rgba(168,152,88,0.15)] border border-[rgba(168,152,88,0.3)] rounded-lg text-sm text-[#A89858]">
                        Sur demande
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#80996F] mb-6">
                {locale === 'fr' 
                  ? 'Certifications et capacités disponibles sur demande.'
                  : 'Certifications and capabilities available on request.'}
              </p>
            </div>
          )}

          <ScrollReveal animation="fade">
            <div className="text-center">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[rgba(255,255,255,0.1)] text-[#E8F5E9] border-2 border-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.3)] px-6 py-3 rounded-xl font-semibold text-base transition-all"
              >
                {content.certifications.ctaRequest}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Quality Standards Section */}
      <section className="py-20 bg-[#0A1410]">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#E8F5E9] mb-4">
                {content.standards.title}
              </h2>
              <p className="text-xl text-[#C5D9C0] max-w-3xl mx-auto">
                {content.standards.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {content.standards.items.map((standard, index) => {
              const Icon = standard.icon;
              return (
                <ScrollReveal
                  key={index}
                  animation="slide-up"
                  delay={index * 0.1}
                >
                  <div className="bg-[#0F1814] rounded-xl p-8 hover:shadow-2xl hover:shadow-[rgba(74,154,98,0.2)] transition-all duration-300 h-full border border-[rgba(255,255,255,0.08)] hover:border-[rgba(74,154,98,0.4)] hover:-translate-y-1">
                    <div className="w-16 h-16 bg-[rgba(74,154,98,0.15)] border border-[rgba(74,154,98,0.3)] rounded-lg flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-[#4A9A62]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#E8F5E9] mb-3">
                      {standard.title}
                    </h3>
                    <p className="text-[#C5D9C0] mb-4 leading-relaxed">
                      {standard.description}
                    </p>
                    <ul className="space-y-2 mb-4">
                      {standard.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-2 text-[#C5D9C0] text-sm">
                          <span className="text-[#4A9A62] mt-1">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 border-t border-[rgba(255,255,255,0.08)]">
                      <span className="text-sm text-[#A89858]">{standard.proof}</span>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* QA Process Timeline */}
      <section className="py-20 bg-[#0F1814]">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#E8F5E9] mb-4">
                {content.process.title}
              </h2>
              <p className="text-xl text-[#C5D9C0] max-w-3xl mx-auto">
                {content.process.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[rgba(74,154,98,0.3)] hidden md:block" />

              {content.process.steps.map((step, index) => (
                <ScrollReveal
                  key={index}
                  animation="slide-left"
                  delay={index * 0.1}
                >
                  <div className="relative mb-12 md:ml-20">
                    <div className="absolute -left-20 top-2 w-16 h-16 bg-[#4A9A62] rounded-full flex items-center justify-center text-white font-bold text-xl hidden md:flex shadow-lg shadow-[rgba(74,154,98,0.3)]">
                      {step.step}
                    </div>

                    <div className="bg-[#0A1410] rounded-xl p-6 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(74,154,98,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[rgba(74,154,98,0.2)]">
                      <h3 className="text-xl font-bold text-[#E8F5E9] mb-2">
                        {step.title}
                      </h3>
                      <p className="text-[#C5D9C0] mb-4">{step.description}</p>
                      
                      <ul className="space-y-1">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-[#80996F] text-sm">
                            <span className="text-[#4A9A62] mt-1">→</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Pack Section */}
      <div id="compliance-pack">
        <CompliancePackSection
          title={content.compliancePack.title}
          subtitle={content.compliancePack.subtitle}
          documents={content.compliancePack.documents}
          ctaDownload={content.compliancePack.ctaDownload}
          trustNote={content.compliancePack.trustNote}
          locale={locale}
        />
      </div>

      {/* FAQ Section */}
      <QualityFAQ
        title={content.faq.title}
        items={content.faq.items}
      />

      {/* Final CTA Section */}
      <section className="relative py-20 mb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero-3.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A2820]/95 via-[#0F1814]/97 to-[#0A1410]/98" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <ScrollReveal animation="fade">
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-16 h-16 text-[#4A9A62]" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#E8F5E9] mb-6">
              {content.finalCTA.title}
            </h2>
            <p className="text-lg md:text-xl text-[#C5D9C0] mb-10 max-w-2xl mx-auto leading-relaxed">
              {content.finalCTA.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/rfq`}
                className="inline-flex items-center justify-center bg-[#4A9A62] hover:bg-[#5AAA72] text-white px-8 py-4 rounded-xl font-semibold text-base transition-all shadow-lg hover:shadow-xl"
              >
                {content.finalCTA.ctaPrimary}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center bg-transparent hover:bg-[rgba(255,255,255,0.1)] text-[#E8F5E9] border-2 border-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.3)] px-8 py-4 rounded-xl font-semibold text-base transition-all"
              >
                {content.finalCTA.ctaSecondary}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
