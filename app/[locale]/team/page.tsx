import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllTeamMembers } from '@/lib/sanity/queries';
import { urlFor } from '@/sanity/lib/image';
import { Locale } from '@/types';
import { Mail, Phone, Linkedin, MessageCircle, FileText, Award, TrendingUp, Shield, Package } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Notre Équipe | Afrexia',
  description: 'Équipe terrain + export : sourcing, QA, conformité RDUE et logistique, de la ferme au port.',
};

interface TeamPageProps {
  params: {
    locale: Locale;
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { locale } = params;
  const teamMembers = await getAllTeamMembers();

  // Separate leadership from team
  const leadership = teamMembers.filter((m: any) => m.level === 'leadership');
  const team = teamMembers.filter((m: any) => m.level === 'team' || !m.level);

  // Content translations
  const content = {
    fr: {
      title: 'Notre Équipe',
      subtitle: 'Équipe terrain + export : sourcing, QA, conformité RDUE et logistique, de la ferme au port.',
      badges: ['Basés à Douala', 'Réseau producteurs/coops', 'Documentation audit-ready'],
      leadershipTitle: 'Direction',
      teamTitle: 'Notre Équipe',
      noMembers: 'Aucun membre d\'équipe disponible pour le moment.',
      emailTooltip: 'Envoyer un email',
      phoneTooltip: 'Appeler',
      whatsappTooltip: 'WhatsApp',
      linkedinTooltip: 'Profil LinkedIn',
      organizationTitle: 'Notre Organisation',
      organizationSubtitle: 'Une structure complète pour garantir qualité et conformité',
      departments: [
        {
          title: 'Export & Négociation',
          description: 'Pilotage contrats • Incoterms FOB/CIF/DAP • Gestion expéditions',
        },
        {
          title: 'Qualité & Conformité',
          description: 'COA • Inspections • Documentation RDUE • Traçabilité lot',
        },
        {
          title: 'Logistique & Terrain',
          description: 'Sourcing producteurs • Contrôle réception • Entreposage • Conteneurisation',
        },
      ],
      trustTitle: 'Confiance & Réactivité',
      trustMetrics: [
        { label: 'Réponse', value: '<24h' },
        { label: 'COA', value: 'Sur demande' },
        { label: 'Incoterms', value: 'FOB/CIF/DAP' },
        { label: 'Documentation', value: 'Audit-ready' },
      ],
      ctaTitle: 'Parlons de votre besoin',
      ctaSubtitle: 'Volumes, spécifications, destination, niveau de preuve documentaire',
      ctaPrimary: 'Demander un Devis',
      ctaSecondary: 'Télécharger notre Profil',
      recruitmentNote: 'Nous recrutons des agents terrain et partenaires logistiques',
      recruitmentLink: 'Nous contacter',
    },
    en: {
      title: 'Our Team',
      subtitle: 'Field + export team: sourcing, QA, EUDR compliance and logistics, from farm to port.',
      badges: ['Based in Douala', 'Producer/coop network', 'Audit-ready documentation'],
      leadershipTitle: 'Leadership',
      teamTitle: 'Our Team',
      noMembers: 'No team members available at the moment.',
      emailTooltip: 'Send email',
      phoneTooltip: 'Call',
      whatsappTooltip: 'WhatsApp',
      linkedinTooltip: 'LinkedIn profile',
      organizationTitle: 'Our Organization',
      organizationSubtitle: 'A complete structure to ensure quality and compliance',
      departments: [
        {
          title: 'Export & Trading',
          description: 'Contract management • Incoterms FOB/CIF/DAP • Shipment coordination',
        },
        {
          title: 'Quality & Compliance',
          description: 'COA • Inspections • EUDR documentation • Lot traceability',
        },
        {
          title: 'Logistics & Field',
          description: 'Producer sourcing • Reception control • Warehousing • Containerization',
        },
      ],
      trustTitle: 'Trust & Responsiveness',
      trustMetrics: [
        { label: 'Response', value: '<24h' },
        { label: 'COA', value: 'On request' },
        { label: 'Incoterms', value: 'FOB/CIF/DAP' },
        { label: 'Documentation', value: 'Audit-ready' },
      ],
      ctaTitle: 'Let\'s discuss your needs',
      ctaSubtitle: 'Volumes, specifications, destination, documentation requirements',
      ctaPrimary: 'Request a Quote',
      ctaSecondary: 'Download our Profile',
      recruitmentNote: 'We are recruiting field agents and logistics partners',
      recruitmentLink: 'Contact us',
    },
  };

  const t = content[locale] || content.en;

  return (
    <main className="min-h-screen bg-[#0A1410]">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/assets/hero-3.jpg"
            alt="Team background"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1410]/80 via-[#0A1410]/90 to-[#0A1410]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#E8F5E9] mb-6">
            {t.title}
          </h1>
          <p className="text-lg md:text-xl text-[#C5D9C0] max-w-3xl mx-auto mb-6">
            {t.subtitle}
          </p>
          
          {/* Micro-badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            {t.badges.map((badge, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-[#0F1814]/80 border border-[rgba(255,255,255,0.08)] rounded-full text-[#A89858]"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      {leadership.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-[#E8F5E9] text-center mb-12">
              {t.leadershipTitle}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {leadership.map((member: any) => (
                <article
                  key={member._id}
                  className="group bg-[#0F1814] border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden hover:border-[rgba(74,154,98,0.4)] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(74,154,98,0.2)]"
                >
                  {/* Photo - Smaller aspect ratio */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#0A1410]">
                    {member.photo?.asset ? (
                      <Image
                        src={urlFor(member.photo).width(500).height(667).url()}
                        alt={member.photo.alt || `Photo de ${member.name}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl text-[#80996F]">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1814] via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#E8F5E9] mb-2">
                      {member.name}
                    </h3>
                    <p className="text-[#A89858] text-sm font-medium mb-4">
                      {member.position?.[locale] || member.position?.en || member.position?.fr}
                    </p>

                    {/* Mini-bio (2 lines) */}
                    {member.bio?.[locale] && (
                      <p className="text-sm text-[#C5D9C0] mb-4 line-clamp-2">
                        {member.bio[locale]?.[0]?.children?.[0]?.text || ''}
                      </p>
                    )}

                    {/* Contact Links with tooltips */}
                    <div className="flex items-center gap-2">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 transition-colors"
                          aria-label={t.emailTooltip}
                          title={t.emailTooltip}
                        >
                          <Mail className="w-4 h-4 text-[#C5D9C0]" />
                        </a>
                      )}
                      {member.phone && (
                        <>
                          <a
                            href={`tel:${member.phone}`}
                            className="p-2 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 transition-colors"
                            aria-label={t.phoneTooltip}
                            title={t.phoneTooltip}
                          >
                            <Phone className="w-4 h-4 text-[#C5D9C0]" />
                          </a>
                          <a
                            href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 transition-colors"
                            aria-label={t.whatsappTooltip}
                            title={t.whatsappTooltip}
                          >
                            <MessageCircle className="w-4 h-4 text-[#C5D9C0]" />
                          </a>
                        </>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 transition-colors"
                          aria-label={t.linkedinTooltip}
                          title={t.linkedinTooltip}
                        >
                          <Linkedin className="w-4 h-4 text-[#C5D9C0]" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {team.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F1814]/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-[#E8F5E9] text-center mb-12">
              {t.teamTitle}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {team.map((member: any) => (
                <article
                  key={member._id}
                  className="group bg-[#0F1814] border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden hover:border-[rgba(74,154,98,0.4)] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(74,154,98,0.2)]"
                >
                  {/* Photo - Smaller */}
                  <div className="relative aspect-square overflow-hidden bg-[#0A1410]">
                    {member.photo?.asset ? (
                      <Image
                        src={urlFor(member.photo).width(400).height(400).url()}
                        alt={member.photo.alt || `Photo de ${member.name}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl text-[#80996F]">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1814] via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Info - Compact */}
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-[#E8F5E9] mb-1">
                      {member.name}
                    </h3>
                    <p className="text-[#A89858] text-xs font-medium mb-3">
                      {member.position?.[locale] || member.position?.en || member.position?.fr}
                    </p>

                    {/* Contact Links - Compact */}
                    <div className="flex items-center gap-1.5">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-1.5 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 transition-colors"
                          aria-label={t.emailTooltip}
                          title={t.emailTooltip}
                        >
                          <Mail className="w-3.5 h-3.5 text-[#C5D9C0]" />
                        </a>
                      )}
                      {member.phone && (
                        <>
                          <a
                            href={`tel:${member.phone}`}
                            className="p-1.5 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 transition-colors"
                            aria-label={t.phoneTooltip}
                            title={t.phoneTooltip}
                          >
                            <Phone className="w-3.5 h-3.5 text-[#C5D9C0]" />
                          </a>
                          <a
                            href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 transition-colors"
                            aria-label={t.whatsappTooltip}
                            title={t.whatsappTooltip}
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-[#C5D9C0]" />
                          </a>
                        </>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 transition-colors"
                          aria-label={t.linkedinTooltip}
                          title={t.linkedinTooltip}
                        >
                          <Linkedin className="w-3.5 h-3.5 text-[#C5D9C0]" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Organization Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F1814]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#E8F5E9] mb-4">
              {t.organizationTitle}
            </h2>
            <p className="text-lg text-[#C5D9C0] max-w-2xl mx-auto">
              {t.organizationSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.departments.map((dept, index) => {
              const icons = [TrendingUp, Shield, Package];
              const Icon = icons[index];
              
              return (
                <div
                  key={index}
                  className="bg-[#0F1814] border border-[rgba(255,255,255,0.08)] rounded-lg p-8 hover:border-[rgba(74,154,98,0.4)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#4A9A62]/10 border border-[#4A9A62]/20 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-[#4A9A62]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#E8F5E9] mb-3">
                    {dept.title}
                  </h3>
                  <p className="text-sm text-[#C5D9C0] leading-relaxed">
                    {dept.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Metrics Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold text-[#E8F5E9] text-center mb-8">
            {t.trustTitle}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {t.trustMetrics.map((metric, index) => (
              <div
                key={index}
                className="bg-[#0F1814] border border-[rgba(255,255,255,0.08)] rounded-lg p-6 text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-[#4A9A62] mb-2">
                  {metric.value}
                </div>
                <div className="text-sm text-[#C5D9C0]">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Business Focus */}
      <section className="relative py-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/assets/hero-4.jpg"
            alt="Contact us"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1410] via-[#0A1410]/80 to-[#0A1410]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#E8F5E9] mb-4">
            {t.ctaTitle}
          </h2>
          <p className="text-lg text-[#C5D9C0] mb-8">
            {t.ctaSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href={`/${locale}/rfq`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#4A9A62] text-white font-semibold rounded-lg hover:bg-[#3d8251] transition-colors"
            >
              {t.ctaPrimary}
            </Link>
            <Link
              href={`/${locale}/resources`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0F1814] border border-[rgba(255,255,255,0.08)] text-[#E8F5E9] font-semibold rounded-lg hover:border-[#4A9A62] transition-colors"
            >
              <FileText className="w-5 h-5" />
              {t.ctaSecondary}
            </Link>
          </div>

          {/* Recruitment note */}
          <div className="pt-8 border-t border-[rgba(255,255,255,0.08)]">
            <p className="text-sm text-[#C5D9C0] mb-2">
              {t.recruitmentNote}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="text-sm text-[#4A9A62] hover:text-[#3d8251] underline"
            >
              {t.recruitmentLink}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
