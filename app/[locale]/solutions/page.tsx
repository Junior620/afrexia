import { Metadata } from 'next';
import Link from 'next/link';
import { Locale } from '@/types';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import {
  Truck,
  Warehouse,
  Package,
  Shield,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';

interface SolutionsPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

// Get translations
async function getTranslations(locale: Locale) {
  const translations = await import(`@/public/locales/${locale}.json`);
  return translations.default;
}

export async function generateMetadata({
  params,
}: SolutionsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations(locale);

  return {
    title: t.solutions.title,
    description: t.solutions.subtitle,
    alternates: {
      canonical: `/${locale}/solutions`,
      languages: {
        fr: '/fr/solutions',
        en: '/en/solutions',
      },
    },
  };
}

export default async function SolutionsPage({
  params,
}: SolutionsPageProps) {
  const { locale } = await params;
  const t = await getTranslations(locale);

  const services = [
    {
      icon: Truck,
      title: t.solutions.services.logistics.title,
      description: t.solutions.services.logistics.description,
    },
    {
      icon: Warehouse,
      title: t.solutions.services.warehousing.title,
      description: t.solutions.services.warehousing.description,
    },
    {
      icon: Package,
      title: t.solutions.services.processing.title,
      description: t.solutions.services.processing.description,
    },
    {
      icon: Shield,
      title: t.solutions.services.traceability.title,
      description: t.solutions.services.traceability.description,
    },
    {
      icon: CheckCircle,
      title: t.solutions.services.quality.title,
      description: t.solutions.services.quality.description,
    },
    {
      icon: TrendingUp,
      title: t.solutions.services.consulting.title,
      description: t.solutions.services.consulting.description,
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t.solutions.title}
            </h1>
            <p className="text-xl md:text-2xl text-light max-w-3xl">
              {t.solutions.subtitle}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <ScrollReveal
                  key={service.title}
                  animation="slide-up"
                  delay={index * 0.1}
                >
                  <div className="bg-light rounded-xl p-8 hover:shadow-xl transition-shadow h-full border border-neutral">
                    <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-4">
                      {service.title}
                    </h3>
                    <p className="text-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-secondary to-primary">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal animation="fade">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t.solutions.cta.title}
            </h2>
            <p className="text-xl text-light mb-10 max-w-2xl mx-auto">
              {t.solutions.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/contact`}
                className="bg-white hover:bg-light text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
              >
                {t.solutions.cta.contact}
              </Link>
              <Link
                href={`/${locale}/rfq`}
                className="bg-accent hover:bg-accent-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
              >
                {t.solutions.cta.rfq}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
