import { Metadata } from 'next';
import Image from 'next/image';
import { Locale } from '@/types';
import { getAllCertifications } from '@/lib/sanity/queries';
import { urlFor } from '@/sanity/lib/image';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { Download, Award, CheckCircle2, FileCheck, ClipboardCheck } from 'lucide-react';

interface QualityPageProps {
  params: Promise<{
    locale: Locale;
  };
}

// Get translations
async function getTranslations(locale: Locale) {
  const translations = await import(`@/public/locales/${locale}.json`);
  return translations.default;
}

export async function generateMetadata({
  params,
}: QualityPageProps): Promise<Metadata> {
  const t = await getTranslations(locale);

  return {
    title: t.quality.title,
    description: t.quality.subtitle,
    alternates: {
      canonical: `/${locale}/quality`,
      languages: {
        fr: '/fr/quality',
        en: '/en/quality',
      },
    },
  };
}

export default async function QualityPage({
  params,
}: QualityPageProps) {
  const t = await getTranslations(locale);
  const certifications = await getAllCertifications();

  const standards = [
    {
      icon: Award,
      title: t.quality.standards.grading.title,
      description: t.quality.standards.grading.description,
    },
    {
      icon: FileCheck,
      title: t.quality.standards.testing.title,
      description: t.quality.standards.testing.description,
    },
    {
      icon: ClipboardCheck,
      title: t.quality.standards.inspection.title,
      description: t.quality.standards.inspection.description,
    },
    {
      icon: CheckCircle2,
      title: t.quality.standards.documentation.title,
      description: t.quality.standards.documentation.description,
    },
  ];

  const processSteps = [
    {
      title: t.quality.process.steps.sourcing.title,
      description: t.quality.process.steps.sourcing.description,
    },
    {
      title: t.quality.process.steps.inspection.title,
      description: t.quality.process.steps.inspection.description,
    },
    {
      title: t.quality.process.steps.testing.title,
      description: t.quality.process.steps.testing.description,
    },
    {
      title: t.quality.process.steps.storage.title,
      description: t.quality.process.steps.storage.description,
    },
    {
      title: t.quality.process.steps.preshipment.title,
      description: t.quality.process.steps.preshipment.description,
    },
    {
      title: t.quality.process.steps.documentation.title,
      description: t.quality.process.steps.documentation.description,
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t.quality.title}
            </h1>
            <p className="text-xl md:text-2xl text-light max-w-3xl">
              {t.quality.subtitle}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                {t.quality.certifications.title}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t.quality.certifications.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certifications.map((cert: any, index: number) => (
              <ScrollReveal
                key={cert._id}
                animation="slide-up"
                delay={index * 0.1}
              >
                <div className="bg-light rounded-xl p-8 hover:shadow-xl transition-shadow h-full border border-neutral">
                  {cert.logo && (
                    <div className="mb-6 flex justify-center">
                      <div className="relative w-32 h-32">
                        <Image
                          src={urlFor(cert.logo).width(200).url()}
                          alt={cert.name[locale] || cert.name.en}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-primary mb-3 text-center">
                    {cert.name[locale] || cert.name.en}
                  </h3>
                  {cert.description && (
                    <p className="text-foreground mb-4 text-center">
                      {cert.description[locale] || cert.description.en}
                    </p>
                  )}
                  {cert.issuingBody && (
                    <p className="text-sm text-muted-foreground mb-2 text-center">
                      <span className="font-semibold">{t.quality.issuedBy}:</span>{' '}
                      {cert.issuingBody}
                    </p>
                  )}
                  {cert.validUntil && (
                    <p className="text-sm text-muted-foreground mb-4 text-center">
                      <span className="font-semibold">{t.quality.validUntil}:</span>{' '}
                      {new Date(cert.validUntil).toLocaleDateString(locale)}
                    </p>
                  )}
                  {cert.certificateDocument?.asset?.url && (
                    <a
                      href={cert.certificateDocument.asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      {t.quality.download}
                    </a>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Standards Section */}
      <section className="py-20 bg-light">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                {t.quality.standards.title}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t.quality.standards.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {standards.map((standard, index) => {
              const Icon = standard.icon;
              return (
                <ScrollReveal
                  key={standard.title}
                  animation="slide-up"
                  delay={index * 0.1}
                >
                  <div className="bg-white rounded-xl p-8 hover:shadow-xl transition-shadow h-full">
                    <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-4">
                      {standard.title}
                    </h3>
                    <p className="text-foreground leading-relaxed">
                      {standard.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* QA Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                {t.quality.process.title}
              </h2>
            </div>
          </ScrollReveal>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block" />

              {processSteps.map((step, index) => (
                <ScrollReveal
                  key={step.title}
                  animation="slide-left"
                  delay={index * 0.1}
                >
                  <div className="relative mb-12 md:ml-20">
                    {/* Timeline dot */}
                    <div className="absolute -left-20 top-2 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl hidden md:flex">
                      {index + 1}
                    </div>

                    <div className="bg-light rounded-xl p-6 border border-neutral">
                      <h3 className="text-xl font-bold text-primary mb-2">
                        {step.title}
                      </h3>
                      <p className="text-foreground">{step.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
