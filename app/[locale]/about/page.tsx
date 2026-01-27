import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Locale } from '@/types';
import { getAllTeamMembers } from '@/lib/sanity/queries';
import { urlFor } from '@/sanity/lib/image';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import {
  Award,
  Eye,
  Leaf,
  Handshake,
  Building2,
  Users,
  Linkedin,
} from 'lucide-react';

interface AboutPageProps {
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
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations(locale);

  return {
    title: t.about.title,
    description: t.about.subtitle,
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        fr: '/fr/about',
        en: '/en/about',
      },
    },
  };
}

export default async function AboutPage({
  params,
}: AboutPageProps) {
  const { locale } = await params;
  const t = await getTranslations(locale);
  const teamMembers = await getAllTeamMembers();

  const values = [
    {
      icon: Award,
      title: t.about.values.quality.title,
      description: t.about.values.quality.description,
    },
    {
      icon: Eye,
      title: t.about.values.transparency.title,
      description: t.about.values.transparency.description,
    },
    {
      icon: Leaf,
      title: t.about.values.sustainability.title,
      description: t.about.values.sustainability.description,
    },
    {
      icon: Handshake,
      title: t.about.values.partnership.title,
      description: t.about.values.partnership.description,
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t.about.title}
            </h1>
            <p className="text-xl md:text-2xl text-light max-w-3xl">
              {t.about.subtitle}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal animation="fade">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 text-center">
                {t.about.story.title}
              </h2>
              <p className="text-lg text-foreground leading-relaxed text-center">
                {t.about.story.content}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-sand">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal animation="fade">
              <div className="bg-white rounded-xl p-12 shadow-lg border border-neutral">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 text-center">
                  {t.about.mission.title}
                </h2>
                <p className="text-lg text-foreground leading-relaxed text-center">
                  {t.about.mission.content}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                {t.about.values.title}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <ScrollReveal
                  key={value.title}
                  animation="slide-up"
                  delay={index * 0.1}
                >
                  <div className="bg-light rounded-xl p-8 text-center hover:shadow-xl transition-shadow h-full border border-neutral">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-3">
                      {value.title}
                    </h3>
                    <p className="text-foreground">{value.description}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {teamMembers.length > 0 && (
        <section className="py-20 bg-light">
          <div className="container mx-auto px-4">
            <ScrollReveal animation="fade">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                  {t.about.team.title}
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  {t.about.team.subtitle}
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member: any, index: number) => (
                <ScrollReveal
                  key={member._id}
                  animation="slide-up"
                  delay={index * 0.1}
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    {member.photo && (
                      <div className="relative h-80 bg-muted">
                        <Image
                          src={urlFor(member.photo).width(400).height(500).url()}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-primary mb-2">
                        {member.name}
                      </h3>
                      {member.role && (
                        <p className="text-secondary font-semibold mb-4">
                          {member.role[locale] || member.role.en}
                        </p>
                      )}
                      {member.bio && (
                        <p className="text-foreground text-sm leading-relaxed mb-4">
                          {member.bio[locale] || member.bio.en}
                        </p>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
                        >
                          <Linkedin className="w-5 h-5" />
                          <span className="text-sm font-semibold">LinkedIn</span>
                        </a>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Governance Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal animation="fade">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                  {t.about.governance.title}
                </h2>
                <p className="text-xl text-muted-foreground mb-6">
                  {t.about.governance.subtitle}
                </p>
                <p className="text-lg text-foreground leading-relaxed">
                  {t.about.governance.content}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Partnerships Section */}
      <section className="py-20 bg-sand">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal animation="fade">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                  {t.about.partnerships.title}
                </h2>
                <p className="text-xl text-muted-foreground mb-6">
                  {t.about.partnerships.subtitle}
                </p>
                <p className="text-lg text-foreground leading-relaxed">
                  {t.about.partnerships.content}
                </p>
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
              {t.about.cta.title}
            </h2>
            <p className="text-xl text-light mb-10 max-w-2xl mx-auto">
              {t.about.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/contact`}
                className="bg-white hover:bg-light text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
              >
                {t.about.cta.contact}
              </Link>
              <Link
                href={`/${locale}/rfq`}
                className="bg-accent hover:bg-accent-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
              >
                {t.about.cta.rfq}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
