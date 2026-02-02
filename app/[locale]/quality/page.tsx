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

        {/* Animated Background Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#4A9A62]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s', animationDuration: '4s' }} />
          <div className="absolute top-40 right-20 w-40 h-40 bg-[#A89858]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '5s' }} />
          <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-[#4A9A62]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '6s' }} />
          <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-[#A89858]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }} />
        </div>

        {/* Floating decorative circles */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-[#4A9A62] rounded-full animate-bounce z-[1]" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-20 right-16 w-3 h-3 bg-[#A89858] rounded-full animate-bounce z-[1]" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }} />
        <div className="absolute bottom-32 left-20 w-2 h-2 bg-[#4A9A62] rounded-full animate-bounce z-[1]" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute bottom-20 right-32 w-3 h-3 bg-[#A89858] rounded-full animate-bounce z-[1]" style={{ animationDelay: '1.5s', animationDuration: '3.2s' }} />

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal animation="fade">
            <div className="max-w-5xl mx-auto text-center">
              {/* Decorative top line */}
              <div className="flex items-center justify-center mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#4A9A62] to-transparent" />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#E8F5E9] leading-tight animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                {content.hero.title}
              </h1>
              <p className="text-xl md:text-2xl text-[#C5D9C0] leading-relaxed mb-8 max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                {content.hero.subtitle}
              </p>

              <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                <QualityHeroBadges badges={content.hero.badges} />
              </div>

              <p className="text-sm text-[#80996F] mt-6 mb-8 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                {content.hero.trustMicrocopy}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                <a
                  href="#compliance-pack"
                  className="group relative inline-flex items-center justify-center bg-[#4A9A62] hover:bg-[#5AAA72] text-white px-8 py-4 rounded-xl font-semibold text-base transition-all shadow-lg hover:shadow-xl hover:scale-105 overflow-hidden"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative z-10">{content.hero.ctaPrimary}</span>
                </a>
                <a
                  href="#certifications"
                  className="group relative inline-flex items-center justify-center bg-transparent hover:bg-[rgba(255,255,255,0.1)] text-[#E8F5E9] border-2 border-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.3)] px-8 py-4 rounded-xl font-semibold text-base transition-all hover:scale-105 overflow-hidden"
                >
                  {/* Border glow effect */}
                  <div className="absolute inset-0 rounded-xl border-2 border-[#4A9A62]/0 group-hover:border-[#4A9A62]/30 transition-all duration-300" />
                  <span className="relative z-10">{content.hero.ctaSecondary}</span>
                </a>
              </div>

              {/* Decorative bottom element */}
              <div className="flex items-center justify-center mt-8 animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#4A9A62] to-transparent rounded-full" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-20 bg-[#0F1814] relative overflow-hidden">
        {/* Background particles */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#4A9A62]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#A89858]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '9s', animationDelay: '1s' }} />

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal animation="fade">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#E8F5E9] mb-4 animate-fadeInUp relative inline-block">
                {content.certifications.title}
                {/* Decorative underline */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#4A9A62] to-transparent rounded-full animate-slideInRight" />
              </h2>
              <p className="text-xl text-[#C5D9C0] max-w-3xl mx-auto mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
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
                  <div className="group relative bg-[#0A1410] rounded-xl p-8 hover:shadow-2xl hover:shadow-[rgba(74,154,98,0.2)] transition-all duration-300 h-full border border-[rgba(255,255,255,0.08)] hover:border-[rgba(74,154,98,0.4)] hover:-translate-y-1 overflow-hidden">
                    {/* Corner decoration */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#4A9A62]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Animated top border */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#4A9A62] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                    
                    <div className="relative z-10">
                      {cert.logo && (
                        <div className="mb-6 flex justify-center">
                          <div className="relative w-32 h-32 bg-white/5 rounded-lg p-4 group-hover:scale-105 transition-transform duration-300">
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
                        <span className="inline-block px-3 py-1 bg-[rgba(168,152,88,0.15)] border border-[rgba(168,152,88,0.3)] rounded-lg text-sm text-[#A89858] group-hover:scale-105 transition-transform duration-300">
                          Sur demande
                        </span>
                      </div>
                    </div>

                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4A9A62]/0 to-[#4A9A62]/0 group-hover:from-[#4A9A62]/5 group-hover:to-[#4A9A62]/5 transition-all duration-300 rounded-xl" />
                    
                    {/* Pulse ring */}
                    <div className="absolute inset-0 rounded-xl border-2 border-[#4A9A62]/0 group-hover:border-[#4A9A62]/20 group-hover:scale-105 transition-all duration-500" />
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
                className="group relative inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[rgba(255,255,255,0.1)] text-[#E8F5E9] border-2 border-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.3)] px-6 py-3 rounded-xl font-semibold text-base transition-all hover:scale-105 overflow-hidden"
              >
                {/* Border glow effect */}
                <div className="absolute inset-0 rounded-xl border-2 border-[#4A9A62]/0 group-hover:border-[#4A9A62]/30 transition-all duration-300" />
                <span className="relative z-10">{content.certifications.ctaRequest}</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Quality Standards Section */}
      <section className="py-20 bg-[#0A1410] relative overflow-hidden">
        {/* Large background blurs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#4A9A62]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#A89858]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal animation="fade">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#E8F5E9] mb-4 animate-fadeInUp">
                {content.standards.title}
              </h2>
              <p className="text-xl text-[#C5D9C0] max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
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
                  <div className="group relative bg-[#0F1814] rounded-xl p-8 hover:shadow-2xl hover:shadow-[rgba(74,154,98,0.2)] transition-all duration-300 h-full border border-[rgba(255,255,255,0.08)] hover:border-[rgba(74,154,98,0.4)] hover:-translate-y-1 overflow-hidden">
                    {/* Corner decoration */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#4A9A62]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Animated top border */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#4A9A62] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                    
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-[rgba(74,154,98,0.15)] border border-[rgba(74,154,98,0.3)] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
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

                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4A9A62]/0 to-[#4A9A62]/0 group-hover:from-[#4A9A62]/5 group-hover:to-[#4A9A62]/5 transition-all duration-300 rounded-xl" />
                    
                    {/* Pulse ring */}
                    <div className="absolute inset-0 rounded-xl border-2 border-[#4A9A62]/0 group-hover:border-[#4A9A62]/20 group-hover:scale-105 transition-all duration-500" />
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* QA Process Timeline */}
      <section className="py-20 bg-[#0F1814] relative overflow-hidden">
        {/* Background particles */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#4A9A62]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-[#A89858]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal animation="fade">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#E8F5E9] mb-4 animate-fadeInUp">
                {content.process.title}
              </h2>
              <p className="text-xl text-[#C5D9C0] max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
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
                    <div className="absolute -left-20 top-2 w-16 h-16 bg-[#4A9A62] rounded-full flex items-center justify-center text-white font-bold text-xl hidden md:flex shadow-lg shadow-[rgba(74,154,98,0.3)] animate-pulse" style={{ animationDuration: '2s', animationDelay: `${index * 0.2}s` }}>
                      {step.step}
                    </div>

                    <div className="group relative bg-[#0A1410] rounded-xl p-6 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(74,154,98,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[rgba(74,154,98,0.2)] overflow-hidden">
                      {/* Corner glow */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#4A9A62]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Animated left border */}
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[#4A9A62] to-transparent scale-y-0 group-hover:scale-y-100 transition-transform duration-700" />
                      
                      <div className="relative z-10">
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

                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#4A9A62]/0 to-[#4A9A62]/0 group-hover:from-[#4A9A62]/5 group-hover:to-[#4A9A62]/5 transition-all duration-300 rounded-xl" />
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

        {/* Animated particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
          <div className="absolute top-10 left-10 w-3 h-3 bg-[#4A9A62] rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute top-20 right-20 w-2 h-2 bg-[#A89858] rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }} />
          <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-[#4A9A62] rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className="absolute bottom-32 right-1/3 w-2 h-2 bg-[#A89858] rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.2s' }} />
        </div>

        {/* Animated rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-[#4A9A62]/10 rounded-full animate-ping z-[1]" style={{ animationDuration: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[#A89858]/10 rounded-full animate-ping z-[1]" style={{ animationDuration: '4s', animationDelay: '1s' }} />

        <div className="container mx-auto px-4 text-center relative z-10">
          <ScrollReveal animation="fade">
            <div className="flex items-center justify-center mb-6 animate-fadeInUp">
              <Shield className="w-16 h-16 text-[#4A9A62] animate-pulse" style={{ animationDuration: '2s' }} />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#E8F5E9] mb-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              {content.finalCTA.title}
            </h2>
            <p className="text-lg md:text-xl text-[#C5D9C0] mb-10 max-w-2xl mx-auto leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              {content.finalCTA.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <Link
                href={`/${locale}/rfq`}
                className="group relative inline-flex items-center justify-center bg-[#4A9A62] hover:bg-[#5AAA72] text-white px-8 py-4 rounded-xl font-semibold text-base transition-all shadow-lg hover:shadow-xl hover:scale-105 overflow-hidden"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="relative z-10">{content.finalCTA.ctaPrimary}</span>
                <span className="relative z-10 ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="group relative inline-flex items-center justify-center bg-transparent hover:bg-[rgba(255,255,255,0.1)] text-[#E8F5E9] border-2 border-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.3)] px-8 py-4 rounded-xl font-semibold text-base transition-all hover:scale-105 overflow-hidden"
              >
                {/* Border glow effect */}
                <div className="absolute inset-0 rounded-xl border-2 border-[#4A9A62]/0 group-hover:border-[#4A9A62]/30 transition-all duration-300" />
                <span className="relative z-10">{content.finalCTA.ctaSecondary}</span>
              </Link>
            </div>

            {/* Pulse dot indicator */}
            <div className="flex items-center justify-center gap-2 mt-6 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <div className="w-2 h-2 bg-[#4A9A62] rounded-full animate-pulse" />
              <span className="text-sm text-[#C5D9C0]">
                {locale === 'fr' ? 'Réponse sous 24h' : 
                 locale === 'en' ? 'Response within 24h' :
                 'Response within 24h'}
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
