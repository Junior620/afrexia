import { Metadata } from 'next';
import { Locale } from '@/types';
import { ContactForm } from '@/components/forms/ContactForm';
import { OfficeLocationMap } from '@/components/maps/OfficeLocationMap';

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
 * Contact Page
 * Requirements: 14.1, 14.6
 */
export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-primary md:text-5xl">
              {locale === 'fr' ? 'Contactez-Nous' : 'Contact Us'}
            </h1>
            <p className="text-lg text-foreground">
              {locale === 'fr'
                ? 'Nous sommes là pour répondre à toutes vos questions. Envoyez-nous un message et nous vous répondrons dans les plus brefs délais.'
                : "We're here to answer all your questions. Send us a message and we'll get back to you as soon as possible."}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="rounded-xl bg-white p-6 shadow-md md:p-8">
                <h2 className="mb-6 text-2xl font-bold text-primary">
                  {locale === 'fr' ? 'Envoyez-nous un Message' : 'Send Us a Message'}
                </h2>
                <ContactForm locale={locale} />
              </div>
            </div>

            {/* Contact Information Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Contact Details Card */}
                <div className="rounded-xl bg-white p-6 shadow-md">
                  <h3 className="mb-4 text-xl font-bold text-primary">
                    {locale === 'fr'
                      ? 'Informations de Contact'
                      : 'Contact Information'}
                  </h3>

                  <div className="space-y-4">
                    {/* Email */}
                    <div className="flex items-start">
                      <div className="mr-3 mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <svg
                          className="h-5 w-5 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Email
                        </p>
                        <a
                          href="mailto:contact@afrexia.com"
                          className="text-primary hover:underline"
                        >
                          contact@afrexia.com
                        </a>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start">
                      <div className="mr-3 mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <svg
                          className="h-5 w-5 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {locale === 'fr' ? 'Téléphone' : 'Phone'}
                        </p>
                        <a
                          href="tel:+237XXXXXXXXX"
                          className="text-primary hover:underline"
                        >
                          +237 XXX XXX XXX
                        </a>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start">
                      <div className="mr-3 mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <svg
                          className="h-5 w-5 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {locale === 'fr' ? 'Adresse' : 'Address'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {locale === 'fr'
                            ? 'Douala, Cameroun'
                            : 'Douala, Cameroon'}
                        </p>
                      </div>
                    </div>

                    {/* Business Hours */}
                    <div className="flex items-start">
                      <div className="mr-3 mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <svg
                          className="h-5 w-5 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {locale === 'fr'
                            ? "Heures d'Ouverture"
                            : 'Business Hours'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {locale === 'fr'
                            ? 'Lun - Ven: 8h00 - 17h00 WAT'
                            : 'Mon - Fri: 8:00 AM - 5:00 PM WAT'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Links Card */}
                <div className="rounded-xl bg-primary p-6 text-white shadow-md">
                  <h3 className="mb-4 text-xl font-bold">
                    {locale === 'fr' ? 'Liens Rapides' : 'Quick Links'}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a
                        href={`/${locale}/rfq`}
                        className="hover:underline"
                      >
                        {locale === 'fr'
                          ? '→ Demander un Devis'
                          : '→ Request a Quote'}
                      </a>
                    </li>
                    <li>
                      <a
                        href={`/${locale}/products`}
                        className="hover:underline"
                      >
                        {locale === 'fr'
                          ? '→ Voir nos Produits'
                          : '→ View Our Products'}
                      </a>
                    </li>
                    <li>
                      <a
                        href={`/${locale}/quality`}
                        className="hover:underline"
                      >
                        {locale === 'fr'
                          ? '→ Qualité & Conformité'
                          : '→ Quality & Compliance'}
                      </a>
                    </li>
                    <li>
                      <a
                        href={`/${locale}/traceability`}
                        className="hover:underline"
                      >
                        {locale === 'fr'
                          ? '→ Traçabilité EUDR'
                          : '→ EUDR Traceability'}
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Social Media Card */}
                <div className="rounded-xl bg-white p-6 shadow-md">
                  <h3 className="mb-4 text-xl font-bold text-primary">
                    {locale === 'fr' ? 'Suivez-Nous' : 'Follow Us'}
                  </h3>
                  <div className="flex gap-3">
                    <a
                      href="https://linkedin.com/company/afrexia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-dark"
                      aria-label="LinkedIn"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a
                      href="https://twitter.com/afrexia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-dark"
                      aria-label="Twitter"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
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
            <div className="rounded-xl bg-white p-6 shadow-md">
              <h2 className="mb-6 text-2xl font-bold text-primary">
                {locale === 'fr' ? 'Notre Bureau' : 'Our Office'}
              </h2>
              <OfficeLocationMap locale={locale} />
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12 rounded-xl bg-white p-6 shadow-md md:p-8">
            <h2 className="mb-6 text-2xl font-bold text-primary">
              {locale === 'fr'
                ? 'Questions Fréquentes'
                : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  {locale === 'fr'
                    ? 'Quel est le délai de réponse moyen?'
                    : 'What is the average response time?'}
                </h3>
                <p className="text-muted-foreground">
                  {locale === 'fr'
                    ? 'Nous nous efforçons de répondre à toutes les demandes dans les 24 à 48 heures ouvrables.'
                    : 'We strive to respond to all inquiries within 24-48 business hours.'}
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  {locale === 'fr'
                    ? 'Puis-je visiter vos installations?'
                    : 'Can I visit your facilities?'}
                </h3>
                <p className="text-muted-foreground">
                  {locale === 'fr'
                    ? 'Oui, nous accueillons les visites sur rendez-vous. Veuillez nous contacter pour planifier votre visite.'
                    : 'Yes, we welcome visits by appointment. Please contact us to schedule your visit.'}
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  {locale === 'fr'
                    ? 'Offrez-vous un support dans d\'autres langues?'
                    : 'Do you offer support in other languages?'}
                </h3>
                <p className="text-muted-foreground">
                  {locale === 'fr'
                    ? 'Nous offrons un support en français et en anglais. Pour d\'autres langues, veuillez nous contacter.'
                    : 'We offer support in French and English. For other languages, please contact us.'}
                </p>
              </div>
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
