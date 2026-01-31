import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/types';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { PartnerSection } from '@/components/sections/PartnerSection';
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
    title: t.solutions?.title || 'Our Solutions & Services',
    description: t.solutions?.subtitle || 'Comprehensive supply chain solutions for African agricultural commodities',
    alternates: {
      canonical: `/${locale}/solutions`,
      languages: {
        fr: '/fr/solutions',
        en: '/en/solutions',
        es: '/es/solutions',
        de: '/de/solutions',
        ru: '/ru/solutions',
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
      title: t.solutions?.services?.logistics?.title || 'Logistics & Shipping',
      description: t.solutions?.services?.logistics?.description || 'End-to-end logistics management',
      image: '/assets/services/logistique.jpg',
    },
    {
      icon: Warehouse,
      title: t.solutions?.services?.warehousing?.title || 'Warehousing & Storage',
      description: t.solutions?.services?.warehousing?.description || 'Climate-controlled storage facilities',
      image: '/assets/services/entreposage.jpg',
    },
    {
      icon: Package,
      title: t.solutions?.services?.processing?.title || 'Processing & Packaging',
      description: t.solutions?.services?.processing?.description || 'Custom processing and packaging solutions',
      image: '/assets/services/transformation.jpg',
    },
    {
      icon: Shield,
      title: t.solutions?.services?.traceability?.title || 'Traceability & Compliance',
      description: t.solutions?.services?.traceability?.description || 'Full supply chain traceability',
      image: '/assets/services/traceabilite.jpg',
    },
    {
      icon: CheckCircle,
      title: t.solutions?.services?.quality?.title || 'Quality Assurance',
      description: t.solutions?.services?.quality?.description || 'Rigorous quality control',
      image: '/assets/services/qualite.jpg',
    },
    {
      icon: TrendingUp,
      title: t.solutions?.services?.consulting?.title || 'Trade Consulting',
      description: t.solutions?.services?.consulting?.description || 'Expert guidance on international trade',
      image: '/assets/services/conseil.jpg',
    },
  ];

  return (
    <main className="min-h-screen bg-[#0A1410]">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[45vh] md:min-h-[50vh] flex items-center justify-center py-12 md:py-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero-4.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1410]/85 via-[#0A1410]/90 to-[#0A1410]/95" />
          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
          {/* Film grain */}
          <div 
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal animation="fade">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#4A9A62] leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {t.solutions.title}
              </h1>
              <p className="text-lg md:text-xl text-[#B0D4B8] leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
                {t.solutions.subtitle}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-[#0A1410]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <ScrollReveal
                  key={service.title}
                  animation="slide-up"
                  delay={index * 0.1}
                >
                  <div className="group relative h-[380px] rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.08)] hover:border-[rgba(74,154,98,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[rgba(74,154,98,0.2)]">
                    {/* Background Image with zoom effect */}
                    <div className="absolute inset-0 overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={index < 3}
                      />
                    </div>

                    {/* Gradient Overlay - plus fort */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 group-hover:from-black/90 group-hover:via-black/50 transition-colors duration-300" />
                    
                    {/* Icon badge - top */}
                    <div className="absolute top-5 left-5 z-10">
                      <div className="w-12 h-12 bg-[rgba(74,154,98,0.15)] border border-[rgba(74,154,98,0.3)] rounded-lg flex items-center justify-center group-hover:bg-[rgba(74,154,98,0.25)] group-hover:scale-110 transition-all duration-300">
                        <Icon className="w-6 h-6 text-[#4A9A62]" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-end p-6 z-10">
                      <h3 className="text-xl font-bold text-[#E8F5E9] mb-3">
                        {service.title}
                      </h3>
                      <p className="text-[#C5D9C0] leading-relaxed mb-4">
                        {service.description}
                      </p>
                      
                      {/* CTA Ghost - visible on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-transparent border border-[#4A9A62] rounded-lg text-[#4A9A62] font-semibold text-sm hover:bg-[rgba(74,154,98,0.1)] transition-colors">
                          {locale === 'fr' ? 'En savoir plus' : 'Learn more'}
                          <svg
                            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partner Section - SCPB */}
      <PartnerSection locale={locale} />

      {/* CTA Section */}
      <section className="relative py-20 mb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/quality-control.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A2820]/95 via-[#0F1814]/97 to-[#0A1410]/98" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <ScrollReveal animation="fade">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#E8F5E9] mb-6">
              {t.solutions.cta.title}
            </h2>
            <p className="text-lg md:text-xl text-[#C5D9C0] mb-10 max-w-2xl mx-auto leading-relaxed">
              {t.solutions.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center bg-transparent hover:bg-[rgba(255,255,255,0.1)] text-[#E8F5E9] border-2 border-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.3)] px-8 py-4 rounded-xl font-semibold text-base transition-all"
              >
                {t.solutions.cta.contact}
              </Link>
              <Link
                href={`/${locale}/rfq`}
                className="inline-flex items-center justify-center bg-[#4A9A62] hover:bg-[#5AAA72] text-white px-8 py-4 rounded-xl font-semibold text-base transition-all shadow-lg hover:shadow-xl"
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
