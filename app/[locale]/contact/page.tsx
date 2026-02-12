import { Metadata } from 'next';
import { Locale } from '@/types';
import { ContactForm } from '@/components/forms/ContactForm';
import { OfficeLocationMap } from '@/components/maps/OfficeLocationMap';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface ContactPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

/**
 * Generate metadata for Contact page
 */
export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;

  const title =
    locale === 'fr' ? 'Contactez-Nous | Afrexia' : 'Contact Us | Afrexia';
  const description =
    locale === 'fr'
      ? 'Contactez Afrexia pour toute question sur nos produits agricoles africains. Notre équipe est à votre disposition.'
      : 'Contact Afrexia for any questions about our African agricultural products. Our team is at your service.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

/**
 * Contact Page - Dark Green Premium Design
 * Requirements: 14.1, 14.6
 */
export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;

  const content = {
    fr: {
      hero: {
        title: 'Contactez-Nous',
        subtitle: 'Parlons de votre projet d\'approvisionnement',
        description: 'Notre équipe est disponible pour répondre à vos questions sur nos produits, nos services et nos capacités d\'export.',
      },
      form: {
        title: 'Envoyez-nous un Message',
        subtitle: 'NDA possible • Documentation disponible • Réponse sous 24h',
        privacy: 'Vos informations restent confidentielles. Pas de spam.',
      },
      info: {
        title: 'Informations de Contact',
        email: 'Email',
        phone: 'Téléphone',
        address: 'Adresse',
        hours: 'Heures d\'Ouverture',
        hoursValue: 'Lun - Ven: 8h00 - 17h00 WAT',
        hoursNote: 'Email & WhatsApp: 7j/7',
        location: 'Douala, Cameroun',
      },
      quickLinks: {
        title: 'Liens Rapides',
        rfq: 'Demander un Devis',
        products: 'Voir nos Produits',
        quality: 'Qualité & Conformité',
        traceability: 'Traçabilité EUDR',
      },
      office: {
        title: 'Notre Bureau',
        subtitle: 'Visitez-nous à Douala',
      },
      whyContact: {
        title: 'Pourquoi nous contacter',
        reasons: [
          'Devis export personnalisé',
          'Dossier conformité RDUE',
          'Disponibilités & délais',
        ],
      },
      faq: {
        title: 'Questions Fréquentes',
        q1: 'Quel est le délai de réponse moyen?',
        a1: 'Nous nous efforçons de répondre à toutes les demandes dans les 24 heures ouvrables. Pour les demandes urgentes, contactez-nous par téléphone.',
        q2: 'Puis-je visiter vos installations?',
        a2: 'Oui, nous accueillons les visites sur rendez-vous. Contactez-nous pour planifier une visite de nos installations et rencontrer notre équipe.',
        q3: 'Offrez-vous un support dans d\'autres langues?',
        a3: 'Nous offrons un support en français, anglais, espagnol, allemand et russe pour répondre aux besoins de nos clients internationaux.',
      },
      social: 'Suivez-Nous',
    },
    en: {
      hero: {
        title: 'Contact Us',
        subtitle: 'Let\'s discuss your sourcing project',
        description: 'Our team is available to answer your questions about our products, services and export capabilities.',
      },
      form: {
        title: 'Send Us a Message',
        subtitle: 'NDA available • Documentation ready • 24h response',
        privacy: 'Your information remains confidential. No spam.',
      },
      info: {
        title: 'Contact Information',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        hours: 'Business Hours',
        hoursValue: 'Mon - Fri: 8:00 AM - 5:00 PM WAT',
        hoursNote: 'Email & WhatsApp: 7 days/week',
        location: 'Douala, Cameroon',
      },
      quickLinks: {
        title: 'Quick Links',
        rfq: 'Request a Quote',
        products: 'View Our Products',
        quality: 'Quality & Compliance',
        traceability: 'EUDR Traceability',
      },
      office: {
        title: 'Our Office',
        subtitle: 'Visit us in Douala',
      },
      whyContact: {
        title: 'Why contact us',
        reasons: [
          'Custom export quote',
          'EUDR compliance documentation',
          'Availability & lead times',
        ],
      },
      faq: {
        title: 'Frequently Asked Questions',
        q1: 'What is the average response time?',
        a1: 'We strive to respond to all inquiries within 24 business hours. For urgent requests, please contact us by phone.',
        q2: 'Can I visit your facilities?',
        a2: 'Yes, we welcome visits by appointment. Contact us to schedule a tour of our facilities and meet our team.',
        q3: 'Do you offer support in other languages?',
        a3: 'We offer support in French, English, Spanish, German and Russian to meet the needs of our international clients.',
      },
      social: 'Follow Us',
    },
  };

  const t = content[locale] || content.en;

  return (
    <div className="min-h-screen bg-[#0A1410]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/hero.jpg"
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1410]/85 via-[#0A1410]/75 to-[#0A1410]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4A9A62]/10 border border-[#4A9A62]/20 rounded-full text-[#4A9A62] text-sm font-medium mb-6">
              <MessageSquare className="w-4 h-4" />
              <span>{locale === 'fr' ? 'Réponse sous 24h (jours ouvrés)' : 'Response within 24h (business days)'}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#E8F5E9] mb-6">
              {t.hero.title}
            </h1>
            <p className="text-xl text-[#4A9A62] mb-4 font-semibold">
              {t.hero.subtitle}
            </p>
            <p className="text-base text-[#C5D9C0]">
              {t.hero.description}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-[#0F1814] border border-[rgba(255,255,255,0.08)] rounded-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#4A9A62]/10 border border-[#4A9A62]/20 flex items-center justify-center">
                  <Send className="w-5 h-5 text-[#4A9A62]" />
                </div>
                <h2 className="text-2xl font-bold text-[#E8F5E9]">
                  {t.form.title}
                </h2>
              </div>
              <p className="text-sm text-[#80996F] mb-6">
                {t.form.subtitle}
              </p>
              <p className="text-sm text-[#80996F] text-xs">
                {t.form.privacy}
              </p>
              <ContactForm locale={locale} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Contact Details Card */}
              <div className="bg-[#0F1814] border border-[rgba(255,255,255,0.08)] rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#E8F5E9] mb-6">
                  {t.info.title}
                </h3>

                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#4A9A62]/10 border border-[#4A9A62]/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#4A9A62]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#C5D9C0] mb-1">
                        {t.info.email}
                      </p>
                      <a
                        href="mailto:kemajoujulien@afrexiacmr.com"
                        className="text-[#4A9A62] hover:text-[#3d8251] transition-colors text-sm"
                      >
                        kemajoujulien@afrexiacmr.com
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#4A9A62]/10 border border-[#4A9A62]/20 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#4A9A62]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#C5D9C0] mb-1">
                        {t.info.phone}
                      </p>
                      <a
                        href="tel:+237658112510"
                        className="text-[#4A9A62] hover:text-[#3d8251] transition-colors text-sm block"
                      >
                        +237 658 112 510
                      </a>
                      <a
                        href="tel:+33753195242"
                        className="text-[#4A9A62] hover:text-[#3d8251] transition-colors text-sm block mt-1"
                      >
                        +33 753 195 242
                      </a>
                      <a
                        href="https://wa.me/237658112510"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4A9A62] hover:text-[#3d8251] transition-colors text-xs flex items-center gap-1 mt-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        WhatsApp
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#4A9A62]/10 border border-[#4A9A62]/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#4A9A62]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#C5D9C0] mb-1">
                        {t.info.address}
                      </p>
                      <p className="text-sm text-[#80996F]">
                        {t.info.location}
                      </p>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#4A9A62]/10 border border-[#4A9A62]/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[#4A9A62]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#C5D9C0] mb-1">
                        {t.info.hours}
                      </p>
                      <p className="text-sm text-[#80996F]">
                        {t.info.hoursValue}
                      </p>
                      <p className="text-xs text-[#4A9A62] mt-1 font-medium">
                        {t.info.hoursNote}
                      </p>
                      <p className="text-xs text-[#80996F] mt-1">
                        UTC+1 ({locale === 'fr' ? 'Heure du Cameroun' : 'Cameroon Time'})
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Contact Us Card */}
              <div className="bg-[#0F1814] border border-[rgba(255,255,255,0.08)] rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#E8F5E9] mb-4">
                  {t.whyContact.title}
                </h3>
                <ul className="space-y-3">
                  {t.whyContact.reasons.map((reason, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm text-[#C5D9C0]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4A9A62] flex-shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Links Card */}
              <div className="bg-gradient-to-br from-[#4A9A62]/20 to-[#3d8251]/20 border border-[#4A9A62]/30 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-[#E8F5E9] mb-4">
                  {t.quickLinks.title}
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href={`/${locale}/rfq`}
                      className="text-[#E8F5E9] hover:text-[#4A9A62] transition-colors flex items-center gap-2"
                    >
                      <span className="text-[#A89858]">→</span>
                      {t.quickLinks.rfq}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/products`}
                      className="text-[#E8F5E9] hover:text-[#4A9A62] transition-colors flex items-center gap-2"
                    >
                      <span className="text-[#A89858]">→</span>
                      {t.quickLinks.products}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/quality`}
                      className="text-[#E8F5E9] hover:text-[#4A9A62] transition-colors flex items-center gap-2"
                    >
                      <span className="text-[#A89858]">→</span>
                      {t.quickLinks.quality}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/traceability`}
                      className="text-[#E8F5E9] hover:text-[#4A9A62] transition-colors flex items-center gap-2"
                    >
                      <span className="text-[#A89858]">→</span>
                      {t.quickLinks.traceability}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Social Media Card */}
              <div className="bg-[#0F1814] border border-[rgba(255,255,255,0.08)] rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#E8F5E9] mb-4">
                  {t.social}
                </h3>
                <div className="flex gap-3">
                  <a
                    href="https://linkedin.com/company/afrexia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-[#4A9A62]/10 border border-[#4A9A62]/20 flex items-center justify-center text-[#4A9A62] hover:bg-[#4A9A62] hover:text-white transition-all duration-300"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a
                    href="https://twitter.com/afrexia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-[#4A9A62]/10 border border-[#4A9A62]/20 flex items-center justify-center text-[#4A9A62] hover:bg-[#4A9A62] hover:text-white transition-all duration-300"
                    aria-label="Twitter"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Office Location Map */}
        <div className="mt-12">
          <div className="bg-[#0F1814] border border-[rgba(255,255,255,0.08)] rounded-lg p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#E8F5E9] mb-2">
                {t.office.title}
              </h2>
              <p className="text-[#C5D9C0]">
                {t.office.subtitle}
              </p>
            </div>
            <OfficeLocationMap locale={locale} />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-[#0F1814] border border-[rgba(255,255,255,0.08)] rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-[#E8F5E9] mb-8">
            {t.faq.title}
          </h2>
          <div className="space-y-6">
            <div className="border-l-2 border-[#4A9A62] pl-4">
              <h3 className="font-semibold text-[#E8F5E9] mb-2">
                {t.faq.q1}
              </h3>
              <p className="text-[#C5D9C0] text-sm leading-relaxed">
                {t.faq.a1}
              </p>
            </div>
            <div className="border-l-2 border-[#4A9A62] pl-4">
              <h3 className="font-semibold text-[#E8F5E9] mb-2">
                {t.faq.q2}
              </h3>
              <p className="text-[#C5D9C0] text-sm leading-relaxed">
                {t.faq.a2}
              </p>
            </div>
            <div className="border-l-2 border-[#4A9A62] pl-4">
              <h3 className="font-semibold text-[#E8F5E9] mb-2">
                {t.faq.q3}
              </h3>
              <p className="text-[#C5D9C0] text-sm leading-relaxed">
                {t.faq.a3}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* reCAPTCHA Script */}
      <script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        async
        defer
      />
    </div>
  );
}
