import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllTeamMembers } from '@/lib/sanity/queries';
import { urlFor } from '@/sanity/lib/image';
import { Locale } from '@/types';
import { Mail, Phone, Linkedin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Notre Équipe | Afrexia',
  description: 'Rencontrez l\'équipe d\'experts qui pilote l\'excellence dans l\'export de produits agricoles africains.',
};

interface TeamPageProps {
  params: {
    locale: Locale;
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { locale } = params;
  const teamMembers = await getAllTeamMembers();

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
            {locale === 'fr' ? 'Notre Équipe' : 'Our Team'}
          </h1>
          <p className="text-lg md:text-xl text-[#C5D9C0] max-w-3xl mx-auto">
            {locale === 'fr'
              ? 'Une équipe d\'experts dédiée à l\'excellence dans l\'export de produits agricoles africains de qualité supérieure.'
              : 'A team of experts dedicated to excellence in exporting premium African agricultural products.'}
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {teamMembers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#C5D9C0] text-lg">
                {locale === 'fr'
                  ? 'Aucun membre d\'équipe disponible pour le moment.'
                  : 'No team members available at the moment.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member: any) => (
                <article
                  key={member._id}
                  className="group bg-[#0F1814] border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden hover:border-[rgba(74,154,98,0.4)] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(74,154,98,0.2)]"
                >
                  {/* Photo */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#0A1410]">
                    {member.photo?.asset ? (
                      <Image
                        src={urlFor(member.photo).width(600).height(750).url()}
                        alt={member.photo.alt || member.name}
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

                    {/* Contact Links */}
                    <div className="flex items-center gap-3 mb-4">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 transition-colors"
                          aria-label={`Email ${member.name}`}
                        >
                          <Mail className="w-4 h-4 text-[#C5D9C0]" />
                        </a>
                      )}
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          className="p-2 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 transition-colors"
                          aria-label={`Call ${member.name}`}
                        >
                          <Phone className="w-4 h-4 text-[#C5D9C0]" />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-[#0A1410] border border-[rgba(255,255,255,0.08)] hover:border-[#4A9A62] hover:bg-[#4A9A62]/10 transition-colors"
                          aria-label={`LinkedIn profile of ${member.name}`}
                        >
                          <Linkedin className="w-4 h-4 text-[#C5D9C0]" />
                        </a>
                      )}
                    </div>

                    {/* Bio Preview (if exists) */}
                    {member.bio?.[locale] && (
                      <div className="text-sm text-[#C5D9C0] line-clamp-3">
                        {/* Simple text extraction from blockContent */}
                        {member.bio[locale]?.[0]?.children?.[0]?.text || ''}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/assets/hero-4.jpg"
            alt="Join our team"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1410] via-[#0A1410]/80 to-[#0A1410]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#E8F5E9] mb-6">
            {locale === 'fr' ? 'Rejoignez Notre Équipe' : 'Join Our Team'}
          </h2>
          <p className="text-lg text-[#C5D9C0] mb-8">
            {locale === 'fr'
              ? 'Nous recherchons des talents passionnés pour renforcer notre équipe et contribuer à notre mission d\'excellence.'
              : 'We are looking for passionate talents to strengthen our team and contribute to our mission of excellence.'}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#4A9A62] text-white font-semibold rounded-lg hover:bg-[#3d8251] transition-colors"
          >
            {locale === 'fr' ? 'Nous Contacter' : 'Contact Us'}
          </Link>
        </div>
      </section>
    </main>
  );
}
