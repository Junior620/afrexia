import Image from 'next/image';
import { getAllTeamMembers } from '@/lib/sanity/queries';
import { urlFor } from '@/sanity/lib/image';
import { Locale } from '@/types';
import { Mail, Phone, Linkedin, MessageCircle } from 'lucide-react';

interface TeamMembersSectionProps {
  locale: Locale;
}

export async function TeamMembersSection({ locale }: TeamMembersSectionProps) {
  const teamMembers = await getAllTeamMembers();

  // Separate leadership from team
  const leadership = teamMembers.filter((m: any) => m.level === 'leadership');
  const team = teamMembers.filter((m: any) => m.level === 'team' || !m.level);

  // Translations
  const t = {
    fr: {
      leadershipTitle: 'Direction',
      teamTitle: 'Notre Équipe',
      emailTooltip: 'Envoyer un email',
      phoneTooltip: 'Appeler',
      whatsappTooltip: 'WhatsApp',
      linkedinTooltip: 'Profil LinkedIn',
    },
    en: {
      leadershipTitle: 'Leadership',
      teamTitle: 'Our Team',
      emailTooltip: 'Send email',
      phoneTooltip: 'Call',
      whatsappTooltip: 'WhatsApp',
      linkedinTooltip: 'LinkedIn profile',
    },
    es: {
      leadershipTitle: 'Liderazgo',
      teamTitle: 'Nuestro Equipo',
      emailTooltip: 'Enviar correo',
      phoneTooltip: 'Llamar',
      whatsappTooltip: 'WhatsApp',
      linkedinTooltip: 'Perfil de LinkedIn',
    },
    de: {
      leadershipTitle: 'Führung',
      teamTitle: 'Unser Team',
      emailTooltip: 'E-Mail senden',
      phoneTooltip: 'Anrufen',
      whatsappTooltip: 'WhatsApp',
      linkedinTooltip: 'LinkedIn-Profil',
    },
    ru: {
      leadershipTitle: 'Руководство',
      teamTitle: 'Наша Команда',
      emailTooltip: 'Отправить email',
      phoneTooltip: 'Позвонить',
      whatsappTooltip: 'WhatsApp',
      linkedinTooltip: 'Профиль LinkedIn',
    },
  };

  const content = t[locale] || t.en;

  if (teamMembers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#C5D9C0]">
          {locale === 'fr' ? 'Aucun membre d\'équipe disponible pour le moment.' :
           locale === 'en' ? 'No team members available at the moment.' :
           locale === 'es' ? 'No hay miembros del equipo disponibles en este momento.' :
           locale === 'de' ? 'Derzeit sind keine Teammitglieder verfügbar.' :
           'В настоящее время нет доступных членов команды.'}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Leadership Section */}
      {leadership.length > 0 && (
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-[#E8F5E9] text-center mb-8 animate-fadeInUp">
            {content.leadershipTitle}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {leadership.map((member: any, index: number) => (
              <article
                key={member._id}
                className={`group bg-[#0F1814] border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden hover:border-[rgba(74,154,98,0.4)] hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(74,154,98,0.2)] ${
                  index === 0 ? 'animate-scaleIn' : 'animate-scaleIn-delayed-1'
                }`}
              >
                {/* Photo */}
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
                  
                  <h4 className="text-xl font-semibold text-[#E8F5E9] mb-2 group-hover:text-[#4A9A62] transition-colors duration-300">
                    {member.name}
                  </h4>
                  <p className="text-[#A89858] text-sm font-medium mb-4">
                    {member.position?.[locale] || member.position?.en || member.position?.fr}
                  </p>

                  {/* Mini-bio */}
                  {member.bio?.[locale] && (
                    <p className="text-sm text-[#C5D9C0] mb-4 line-clamp-2 group-hover:text-[#E8F5E9] transition-colors duration-300">
                      {member.bio[locale]?.[0]?.children?.[0]?.text || ''}
                    </p>
                  )}

                  {/* Contact Links */}
                  <div className="flex items-center gap-2">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="p-2 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 hover:scale-110 transition-all duration-300"
                        aria-label={content.emailTooltip}
                        title={content.emailTooltip}
                      >
                        <Mail className="w-4 h-4 text-[#C5D9C0] hover:text-[#4A9A62] transition-colors" />
                      </a>
                    )}
                    {member.phone && (
                      <>
                        <a
                          href={`tel:${member.phone}`}
                          className="p-2 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 hover:scale-110 transition-all duration-300"
                          aria-label={content.phoneTooltip}
                          title={content.phoneTooltip}
                        >
                          <Phone className="w-4 h-4 text-[#C5D9C0] hover:text-[#4A9A62] transition-colors" />
                        </a>
                        <a
                          href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 hover:scale-110 transition-all duration-300"
                          aria-label={content.whatsappTooltip}
                          title={content.whatsappTooltip}
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
                        aria-label={content.linkedinTooltip}
                        title={content.linkedinTooltip}
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
      )}

      {/* Team Section */}
      {team.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-[#E8F5E9] text-center mb-8 animate-fadeInUp">
            {content.teamTitle}
          </h3>
          
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
                
                {/* Photo */}
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

                {/* Info */}
                <div className="p-4 relative">
                  {/* Animated top border */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-[#4A9A62] to-transparent group-hover:w-full transition-all duration-500" />
                  
                  <h4 className="text-base font-semibold text-[#E8F5E9] mb-1 group-hover:text-[#4A9A62] transition-colors duration-300">
                    {member.name}
                  </h4>
                  <p className="text-[#A89858] text-xs font-medium mb-3 group-hover:text-[#E8F5E9] transition-colors duration-300">
                    {member.position?.[locale] || member.position?.en || member.position?.fr}
                  </p>

                  {/* Contact Links */}
                  <div className="flex items-center gap-1.5">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="p-1.5 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 hover:scale-125 hover:rotate-12 transition-all duration-300"
                        aria-label={content.emailTooltip}
                        title={content.emailTooltip}
                      >
                        <Mail className="w-3.5 h-3.5 text-[#C5D9C0] group-hover:text-[#4A9A62] transition-colors" />
                      </a>
                    )}
                    {member.phone && (
                      <>
                        <a
                          href={`tel:${member.phone}`}
                          className="p-1.5 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 hover:scale-125 hover:rotate-12 transition-all duration-300"
                          aria-label={content.phoneTooltip}
                          title={content.phoneTooltip}
                        >
                          <Phone className="w-3.5 h-3.5 text-[#C5D9C0] group-hover:text-[#4A9A62] transition-colors" />
                        </a>
                        <a
                          href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 hover:scale-125 hover:rotate-12 transition-all duration-300"
                          aria-label={content.whatsappTooltip}
                          title={content.whatsappTooltip}
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
                        aria-label={content.linkedinTooltip}
                        title={content.linkedinTooltip}
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
      )}
    </>
  );
}
