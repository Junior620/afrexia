import { Metadata } from 'next';
import Link from 'next/link';
import { Locale } from '@/types';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import {
  MapPin,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Satellite,
  FileCheck,
  Globe,
  Shield,
  Link as LinkIcon,
  Database,
  Download,
} from 'lucide-react';

interface TraceabilityPageProps {
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
}: TraceabilityPageProps): Promise<Metadata> {
  const t = await getTranslations(locale);

  return {
    title: t.traceability.title,
    description: t.traceability.subtitle,
    alternates: {
      canonical: `/${locale}/traceability`,
      languages: {
        fr: '/fr/traceability',
        en: '/en/traceability',
      },
    },
  };
}

export default async function TraceabilityPage({
  params,
}: TraceabilityPageProps) {
  const t = await getTranslations(locale);

  const dueDiligenceSteps = [
    {
      icon: MapPin,
      title: t.traceability.dueDiligence.steps.farmMapping.title,
      description: t.traceability.dueDiligence.steps.farmMapping.description,
    },
    {
      icon: FileText,
      title: t.traceability.dueDiligence.steps.documentation.title,
      description: t.traceability.dueDiligence.steps.documentation.description,
    },
    {
      icon: AlertTriangle,
      title: t.traceability.dueDiligence.steps.riskAssessment.title,
      description: t.traceability.dueDiligence.steps.riskAssessment.description,
    },
    {
      icon: CheckCircle2,
      title: t.traceability.dueDiligence.steps.verification.title,
      description: t.traceability.dueDiligence.steps.verification.description,
    },
    {
      icon: Satellite,
      title: t.traceability.dueDiligence.steps.monitoring.title,
      description: t.traceability.dueDiligence.steps.monitoring.description,
    },
    {
      icon: FileCheck,
      title: t.traceability.dueDiligence.steps.reporting.title,
      description: t.traceability.dueDiligence.steps.reporting.description,
    },
  ];

  const complianceMeasures = [
    {
      icon: Globe,
      title: t.traceability.compliance.measures.geolocation.title,
      description: t.traceability.compliance.measures.geolocation.description,
    },
    {
      icon: LinkIcon,
      title: t.traceability.compliance.measures.chainOfCustody.title,
      description: t.traceability.compliance.measures.chainOfCustody.description,
    },
    {
      icon: Satellite,
      title: t.traceability.compliance.measures.satelliteMonitoring.title,
      description: t.traceability.compliance.measures.satelliteMonitoring.description,
    },
    {
      icon: Shield,
      title: t.traceability.compliance.measures.certification.title,
      description: t.traceability.compliance.measures.certification.description,
    },
    {
      icon: Database,
      title: t.traceability.compliance.measures.auditTrail.title,
      description: t.traceability.compliance.measures.auditTrail.description,
    },
    {
      icon: FileCheck,
      title: t.traceability.compliance.measures.reporting.title,
      description: t.traceability.compliance.measures.reporting.description,
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t.traceability.title}
            </h1>
            <p className="text-xl md:text-2xl text-light max-w-3xl">
              {t.traceability.subtitle}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* EUDR Overview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                {t.traceability.eudr.title}
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                {t.traceability.eudr.subtitle}
              </p>
              <p className="text-lg text-foreground leading-relaxed">
                {t.traceability.eudr.description}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Due Diligence Process Section */}
      <section className="py-20 bg-light">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                {t.traceability.dueDiligence.title}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t.traceability.dueDiligence.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dueDiligenceSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <ScrollReveal
                  key={step.title}
                  animation="slide-up"
                  delay={index * 0.1}
                >
                  <div className="bg-white rounded-xl p-8 hover:shadow-xl transition-shadow h-full border border-neutral">
                    <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-4">
                      {step.title}
                    </h3>
                    <p className="text-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supply Chain Journey Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                {t.traceability.supplyChain.title}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                {t.traceability.supplyChain.subtitle}
              </p>
              <p className="text-lg text-foreground max-w-4xl mx-auto">
                {t.traceability.supplyChain.description}
              </p>
            </div>
          </ScrollReveal>

          {/* Placeholder for SupplyChainAnimation component */}
          <ScrollReveal animation="fade">
            <div className="bg-light rounded-xl p-12 border border-neutral">
              <div className="text-center text-muted-foreground">
                <Satellite className="w-16 h-16 mx-auto mb-4 text-primary" />
                <p className="text-lg">
                  Interactive supply chain visualization coming soon
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Compliance Measures Section */}
      <section className="py-20 bg-light">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                {t.traceability.compliance.title}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t.traceability.compliance.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {complianceMeasures.map((measure, index) => {
              const Icon = measure.icon;
              return (
                <ScrollReveal
                  key={measure.title}
                  animation="slide-up"
                  delay={index * 0.1}
                >
                  <div className="bg-white rounded-xl p-8 hover:shadow-xl transition-shadow h-full">
                    <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-4">
                      {measure.title}
                    </h3>
                    <p className="text-foreground leading-relaxed">
                      {measure.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                {t.traceability.documentation.title}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
                {t.traceability.documentation.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <ScrollReveal animation="slide-up" delay={0}>
              <div className="bg-light rounded-xl p-8 text-center border border-neutral hover:shadow-xl transition-shadow">
                <Download className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold text-primary mb-4">
                  {t.traceability.documentation.eudrGuide}
                </h3>
                <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  {t.common.download}
                </button>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up" delay={0.1}>
              <div className="bg-light rounded-xl p-8 text-center border border-neutral hover:shadow-xl transition-shadow">
                <Download className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold text-primary mb-4">
                  {t.traceability.documentation.dueDiligenceStatement}
                </h3>
                <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  {t.common.download}
                </button>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up" delay={0.2}>
              <div className="bg-light rounded-xl p-8 text-center border border-neutral hover:shadow-xl transition-shadow">
                <Download className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold text-primary mb-4">
                  {t.traceability.documentation.traceabilityReport}
                </h3>
                <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  {t.common.download}
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-secondary to-primary">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal animation="fade">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t.traceability.cta.title}
            </h2>
            <p className="text-xl text-light mb-10 max-w-2xl mx-auto">
              {t.traceability.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/contact`}
                className="bg-white hover:bg-light text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
              >
                {t.traceability.cta.contact}
              </Link>
              <Link
                href={`/${locale}/rfq`}
                className="bg-accent hover:bg-accent-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
              >
                {t.traceability.cta.rfq}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
