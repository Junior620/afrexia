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
  const { locale } = await params;
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

        {/* Animated particles */}
        <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-[#4A9A62]/30 animate-ripple" />
        <div className="absolute top-40 right-20 w-2 h-2 rounded-full bg-[#4A9A62]/30 animate-ripple-delayed-1" />
        <div className="absolute bottom-20 left-1/3 w-2 h-2 rounded-full bg-[#4A9A62]/30 animate-ripple-delayed-2" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Animated decorative elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-20 bg-gradient-to-b from-transparent via-[#4A9A62]/30 to-transparent animate-slideInRight" />
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#E8F5E9] mb-6 animate-fadeInUp relative">
            {t.title}
            {/* Animated underline */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-transparent via-[#4A9A62] to-transparent group-hover:w-full animate-slideInRight" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }} />
          </h1>
          
          <p className="text-lg md:text-xl text-[#C5D9C0] max-w-3xl mx-auto mb-6 animate-fadeInUp-delayed-1 relative">
            {t.subtitle}
            {/* Animated quotation marks */}
            <span className="absolute -left-4 top-0 text-[#4A9A62]/30 text-3xl animate-pulse">"</span>
            <span className="absolute -right-4 bottom-0 text-[#4A9A62]/30 text-3xl animate-pulse-delayed-1">"</span>
          </p>
          
          {/* Micro-badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm animate-fadeInUp-delayed-2">
            {t.badges.map((badge, index) => (
              <span
                key={index}
                className="group relative px-4 py-2 bg-[#0F1814]/80 border border-[rgba(255,255,255,0.08)] rounded-full text-[#A89858] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 transition-all duration-300 hover:scale-105 overflow-hidden"
                style={{ 
                  animation: `scaleIn 0.5s ease-out ${0.6 + index * 0.1}s both`
                }}
              >
                {/* Animated background shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4A9A62]/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
                
                {/* Badge icon */}
                <span className="relative z-10 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A9A62] animate-pulse" />
                  {badge}
                </span>
                
                {/* Animated border glow */}
                <div className="absolute inset-0 rounded-full border border-[#4A9A62]/0 group-hover:border-[#4A9A62]/50 transition-all duration-300" />
              </span>
            ))}
          </div>
          
          {/* Floating decorative elements */}
          <div className="absolute bottom-10 left-10 w-20 h-20 border border-[#4A9A62]/10 rounded-full animate-float" />
          <div className="absolute bottom-20 right-10 w-16 h-16 border border-[#4A9A62]/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        </div>
      </section>

      {/* Leadership Section */}
      {leadership.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-[#E8F5E9] text-center mb-12 animate-fadeInUp">
              {t.leadershipTitle}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {leadership.map((member: any, index: number) => (
                <article
                  key={member._id}
                  className={`group bg-[#0F1814] border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden hover:border-[rgba(74,154,98,0.4)] hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(74,154,98,0.2)] ${
                    index === 0 ? 'animate-scaleIn' : 'animate-scaleIn-delayed-1'
                  }`}
                >
                  {/* Photo - Medium aspect ratio */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#0A1410]">
                    {member.photo?.asset ? (
                      <Image
                        src={urlFor(member.photo).width(500).height(667).url()}
                        alt={member.photo.alt || `Photo de ${member.name}`}
                        fill
                        className="object-contain object-top group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl text-[#80996F] group-hover:scale-110 transition-transform duration-500">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1814] via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                    
                    {/* Animated corner accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#4A9A62]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Info */}
                  <div className="p-6 relative">
                    {/* Animated border on hover */}
                    <div className="absolute top-0 left-0 w-0 h-0.5 bg-[#4A9A62] group-hover:w-full transition-all duration-500" />
                    
                    <h3 className="text-xl font-semibold text-[#E8F5E9] mb-2 group-hover:text-[#4A9A62] transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-[#A89858] text-sm font-medium mb-4">
                      {member.position?.[locale] || member.position?.en || member.position?.fr}
                    </p>

                    {/* Mini-bio (2 lines) */}
                    {member.bio?.[locale] && (
                      <p className="text-sm text-[#C5D9C0] mb-4 line-clamp-2 group-hover:text-[#E8F5E9] transition-colors duration-300">
                        {member.bio[locale]?.[0]?.children?.[0]?.text || ''}
                      </p>
                    )}

                    {/* Contact Links with tooltips */}
                    <div className="flex items-center gap-2">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 hover:scale-110 transition-all duration-300"
                          aria-label={t.emailTooltip}
                          title={t.emailTooltip}
                        >
                          <Mail className="w-4 h-4 text-[#C5D9C0] hover:text-[#4A9A62] transition-colors" />
                        </a>
                      )}
                      {member.phone && (
                        <>
                          <a
                            href={`tel:${member.phone}`}
                            className="p-2 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 hover:scale-110 transition-all duration-300"
                            aria-label={t.phoneTooltip}
                            title={t.phoneTooltip}
                          >
                            <Phone className="w-4 h-4 text-[#C5D9C0] hover:text-[#4A9A62] transition-colors" />
                          </a>
                          <a
                            href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 hover:scale-110 transition-all duration-300"
                            aria-label={t.whatsappTooltip}
                            title={t.whatsappTooltip}
                          >
                            <MessageCircle className="w-4 h-4 text-[#C5D9C0] hover:text-[#4A9A62] transition-colors" />
                          </a>
                        </>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 hover:scale-110 transition-all duration-300"
                          aria-label={t.linkedinTooltip}
                          title={t.linkedinTooltip}
                        >
                          <Linkedin className="w-4 h-4 text-[#C5D9C0] hover:text-[#4A9A62] transition-colors" />
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
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F1814]/30 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#4A9A62]/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4A9A62]/5 rounded-full blur-3xl animate-pulse-delayed-1" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="text-3xl font-bold text-[#E8F5E9] text-center mb-12 animate-fadeInUp">
              {t.teamTitle}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {team.map((member: any, index: number) => (
                <article
                  key={member._id}
                  className={`group bg-[#0F1814] border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden hover:border-[rgba(74,154,98,0.4)] hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(74,154,98,0.2)] relative ${
                    index % 4 === 0 ? 'animate-fadeInUp' :
                    index % 4 === 1 ? 'animate-fadeInUp-delayed-1' :
                    index % 4 === 2 ? 'animate-fadeInUp-delayed-2' :
                    'animate-scaleIn'
                  }`}
                >
                  {/* Animated corner decoration */}
                  <div className="absolute top-0 left-0 w-0 h-0 border-t-[30px] border-t-[#4A9A62]/0 border-r-[30px] border-r-transparent group-hover:border-t-[#4A9A62]/20 transition-all duration-300" />
                  
                  {/* Photo - Smaller */}
                  <div className="relative aspect-square overflow-hidden bg-[#0A1410]">
                    {member.photo?.asset ? (
                      <Image
                        src={urlFor(member.photo).width(400).height(400).url()}
                        alt={member.photo.alt || `Photo de ${member.name}`}
                        fill
                        className="object-contain object-top group-hover:scale-110 group-hover:rotate-2 transition-all duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl text-[#80996F] group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1814] via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                    
                    {/* Animated pulse ring */}
                    <div className="absolute inset-0 border-2 border-[#4A9A62]/0 group-hover:border-[#4A9A62]/30 rounded-lg transition-all duration-300 group-hover:animate-pulse" />
                  </div>

                  {/* Info - Compact */}
                  <div className="p-4 relative">
                    {/* Animated top border */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-[#4A9A62] to-transparent group-hover:w-full transition-all duration-500" />
                    
                    <h3 className="text-base font-semibold text-[#E8F5E9] mb-1 group-hover:text-[#4A9A62] transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-[#A89858] text-xs font-medium mb-3 group-hover:text-[#E8F5E9] transition-colors duration-300">
                      {member.position?.[locale] || member.position?.en || member.position?.fr}
                    </p>

                    {/* Contact Links - Compact */}
                    <div className="flex items-center gap-1.5">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-1.5 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 hover:scale-125 hover:rotate-12 transition-all duration-300"
                          aria-label={t.emailTooltip}
                          title={t.emailTooltip}
                        >
                          <Mail className="w-3.5 h-3.5 text-[#C5D9C0] group-hover:text-[#4A9A62] transition-colors" />
                        </a>
                      )}
                      {member.phone && (
                        <>
                          <a
                            href={`tel:${member.phone}`}
                            className="p-1.5 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 hover:scale-125 hover:rotate-12 transition-all duration-300"
                            aria-label={t.phoneTooltip}
                            title={t.phoneTooltip}
                          >
                            <Phone className="w-3.5 h-3.5 text-[#C5D9C0] group-hover:text-[#4A9A62] transition-colors" />
                          </a>
                          <a
                            href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 hover:scale-125 hover:rotate-12 transition-all duration-300"
                            aria-label={t.whatsappTooltip}
                            title={t.whatsappTooltip}
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-[#C5D9C0] group-hover:text-[#4A9A62] transition-colors" />
                          </a>
                        </>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 hover:scale-125 hover:rotate-12 transition-all duration-300"
                          aria-label={t.linkedinTooltip}
                          title={t.linkedinTooltip}
                        >
                          <Linkedin className="w-3.5 h-3.5 text-[#C5D9C0] group-hover:text-[#4A9A62] transition-colors" />
                        </a>
                      )}
                    </div>
                    
                    {/* Animated bottom accent */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4A9A62]/0 to-transparent group-hover:via-[#4A9A62]/50 transition-all duration-500" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Organization Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F1814]/50 relative overflow-hidden">
        {/* Background animated particles */}
        <div className="absolute top-10 right-10 w-2 h-2 rounded-full bg-[#4A9A62]/20 animate-ripple" />
        <div className="absolute bottom-20 left-20 w-2 h-2 rounded-full bg-[#4A9A62]/20 animate-ripple-delayed-1" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#E8F5E9] mb-4 animate-fadeInUp">
              {t.organizationTitle}
            </h2>
            <p className="text-lg text-[#C5D9C0] max-w-2xl mx-auto animate-fadeInUp-delayed-1">
              {t.organizationSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.departments.map((dept, index) => {
              const icons = [TrendingUp, Shield, Package];
              const Icon = icons[index];
              const animations = ['animate-scaleIn', 'animate-scaleIn-delayed-1', 'animate-scaleIn-delayed-2'];
              
              return (
                <div
                  key={index}
                  className={`group bg-[#0F1814] border border-[rgba(255,255,255,0.08)] rounded-lg p-8 hover:border-[rgba(74,154,98,0.4)] hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(74,154,98,0.25)] ${animations[index]} relative overflow-hidden`}
                >
                  {/* Animated background glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4A9A62]/0 to-[#4A9A62]/0 group-hover:from-[#4A9A62]/5 group-hover:to-[#4A9A62]/10 transition-all duration-500" />
                  
                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-lg bg-[#4A9A62]/10 border border-[#4A9A62]/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${
                      index === 0 ? 'animate-glow' : 
                      index === 1 ? 'animate-glow-delayed-1' : 
                      'animate-glow-delayed-2'
                    }`}>
                      <Icon className="w-6 h-6 text-[#4A9A62] group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#E8F5E9] mb-3 group-hover:text-[#4A9A62] transition-colors duration-300">
                      {dept.title}
                    </h3>
                    <p className="text-sm text-[#C5D9C0] leading-relaxed group-hover:text-[#E8F5E9] transition-colors duration-300">
                      {dept.description}
                    </p>
                  </div>
                  
                  {/* Animated bottom border */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#4A9A62] to-[#3d8251] group-hover:w-full transition-all duration-500" />
                </div>
              );
            })}
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

        {/* Animated particles */}
        <div className="absolute top-10 left-10 w-3 h-3 rounded-full bg-[#4A9A62]/40 animate-bounce" />
        <div className="absolute top-20 right-20 w-2 h-2 rounded-full bg-[#4A9A62]/30 animate-bounce-delayed-1" />
        <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-[#4A9A62]/30 animate-bounce-delayed-2" />
        <div className="absolute bottom-10 right-1/3 w-3 h-3 rounded-full bg-[#4A9A62]/40 animate-bounce" />
        
        {/* Animated rings */}
        <div className="absolute top-1/2 left-10 w-32 h-32 border-2 border-[#4A9A62]/10 rounded-full animate-ripple" />
        <div className="absolute top-1/3 right-20 w-40 h-40 border-2 border-[#4A9A62]/10 rounded-full animate-ripple-delayed-1" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#E8F5E9] mb-4 animate-fadeInUp">
            {t.ctaTitle}
          </h2>
          <p className="text-lg text-[#C5D9C0] mb-8 animate-fadeInUp-delayed-1">
            {t.ctaSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-scaleIn">
            <Link
              href={`/${locale}/rfq`}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-[#4A9A62] text-white font-semibold rounded-lg hover:bg-[#3d8251] transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgba(74,154,98,0.4)] relative overflow-hidden"
            >
              <span className="relative z-10">{t.ctaPrimary}</span>
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              {/* Arrow animation */}
              <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href={`/${locale}/resources`}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-[#0F1814] border-2 border-[rgba(255,255,255,0.08)] text-[#E8F5E9] font-semibold rounded-lg hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 transition-all duration-300 hover:scale-105 relative overflow-hidden"
            >
              <FileText className="w-5 h-5 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
              <span>{t.ctaSecondary}</span>
              {/* Animated border glow */}
              <div className="absolute inset-0 border-2 border-[#4A9A62]/0 group-hover:border-[#4A9A62]/50 rounded-lg transition-all duration-300" />
            </Link>
          </div>

          {/* Recruitment note */}
          <div className="pt-8 border-t border-[rgba(255,255,255,0.08)] animate-fadeInUp-delayed-2">
            <p className="text-sm text-[#C5D9C0] mb-2 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4A9A62] animate-pulse" />
              {t.recruitmentNote}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 text-sm text-[#4A9A62] hover:text-[#3d8251] underline hover:no-underline transition-all duration-300 group"
            >
              {t.recruitmentLink}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
