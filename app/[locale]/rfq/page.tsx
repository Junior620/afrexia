import { Metadata } from 'next';
import { Locale } from '@/types';
import { getAllProducts } from '@/lib/sanity/queries';
import { RFQForm } from '@/components/forms/RFQForm';

interface RFQPageProps {
  params: Promise<{
    locale: Locale;
  }>;
  searchParams: Promise<{
    product?: string;
  }>;
}

/**
 * Generate metadata for RFQ page
 */
export async function generateMetadata({
  params,
}: RFQPageProps): Promise<Metadata> {
  const { locale } = await params;

  const title =
    locale === 'fr' ? 'Demande de Devis | Afrexia' : 'Request for Quote | Afrexia';
  const description =
    locale === 'fr'
      ? 'Demandez un devis personnalisé pour nos produits agricoles africains. Cacao, café, poivre, bois et maïs de qualité premium.'
      : 'Request a customized quote for our African agricultural products. Premium quality cocoa, coffee, pepper, wood, and corn.';

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
 * RFQ Page
 * Requirements: 3.1, 14.6
 */
export default async function RFQPage({ params, searchParams }: RFQPageProps) {
  const { locale } = await params;
  const { product: preselectedProductId } = await searchParams;

  // Fetch all products for the form
  const products = await getAllProducts();

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-primary md:text-5xl">
              {locale === 'fr' ? 'Demande de Devis' : 'Request for Quote'}
            </h1>
            <p className="text-lg text-gray-700">
              {locale === 'fr'
                ? 'Parlez-nous de vos besoins et nous vous fournirons un devis personnalisé dans les 24-48 heures.'
                : "Tell us about your requirements and we'll provide a customized quote within 24-48 hours."}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="rounded-xl bg-white p-6 shadow-md md:p-8">
                <RFQForm
                  products={products}
                  locale={locale}
                  preselectedProductId={preselectedProductId}
                />
              </div>
            </div>

            {/* Contact Information Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Contact Card */}
                <div className="rounded-xl bg-white p-6 shadow-md">
                  <h3 className="mb-4 text-xl font-bold text-primary">
                    {locale === 'fr'
                      ? 'Besoin d\'Aide?'
                      : 'Need Help?'}
                  </h3>
                  <p className="mb-4 text-sm text-gray-600">
                    {locale === 'fr'
                      ? 'Notre équipe commerciale est disponible pour répondre à vos questions.'
                      : 'Our sales team is available to answer your questions.'}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Email
                      </p>
                      <a
                        href="mailto:sales@afrexia.com"
                        className="text-primary hover:underline"
                      >
                        sales@afrexia.com
                      </a>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        {locale === 'fr' ? 'Téléphone' : 'Phone'}
                      </p>
                      <a
                        href="tel:+237XXXXXXXXX"
                        className="text-primary hover:underline"
                      >
                        +237 XXX XXX XXX
                      </a>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        {locale === 'fr' ? 'Heures d\'Ouverture' : 'Business Hours'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {locale === 'fr'
                          ? 'Lun - Ven: 8h00 - 17h00 WAT'
                          : 'Mon - Fri: 8:00 AM - 5:00 PM WAT'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Why Choose Us Card */}
                <div className="rounded-xl bg-primary p-6 text-white shadow-md">
                  <h3 className="mb-4 text-xl font-bold">
                    {locale === 'fr'
                      ? 'Pourquoi Afrexia?'
                      : 'Why Choose Afrexia?'}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>
                        {locale === 'fr'
                          ? 'Produits certifiés de qualité premium'
                          : 'Certified premium quality products'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>
                        {locale === 'fr'
                          ? 'Traçabilité complète EUDR'
                          : 'Full EUDR traceability'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>
                        {locale === 'fr'
                          ? 'Livraison fiable et ponctuelle'
                          : 'Reliable and timely delivery'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>
                        {locale === 'fr'
                          ? 'Support client dédié'
                          : 'Dedicated customer support'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>
                        {locale === 'fr'
                          ? 'Prix compétitifs'
                          : 'Competitive pricing'}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Trust Indicators */}
                <div className="rounded-xl bg-white p-6 shadow-md">
                  <h3 className="mb-4 text-lg font-bold text-primary">
                    {locale === 'fr' ? 'Certifications' : 'Certifications'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {locale === 'fr'
                      ? 'Nos produits sont certifiés selon les normes internationales les plus strictes.'
                      : 'Our products are certified to the highest international standards.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-primary">
              {locale === 'fr'
                ? 'Que se passe-t-il ensuite?'
                : 'What Happens Next?'}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                  1
                </div>
                <h3 className="mb-2 font-semibold">
                  {locale === 'fr' ? 'Soumission' : 'Submission'}
                </h3>
                <p className="text-sm text-gray-600">
                  {locale === 'fr'
                    ? 'Vous soumettez votre demande avec vos besoins spécifiques.'
                    : 'You submit your request with your specific requirements.'}
                </p>
              </div>
              <div>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                  2
                </div>
                <h3 className="mb-2 font-semibold">
                  {locale === 'fr' ? 'Analyse' : 'Review'}
                </h3>
                <p className="text-sm text-gray-600">
                  {locale === 'fr'
                    ? 'Notre équipe analyse votre demande et prépare un devis personnalisé.'
                    : 'Our team reviews your request and prepares a customized quote.'}
                </p>
              </div>
              <div>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                  3
                </div>
                <h3 className="mb-2 font-semibold">
                  {locale === 'fr' ? 'Réponse' : 'Response'}
                </h3>
                <p className="text-sm text-gray-600">
                  {locale === 'fr'
                    ? 'Vous recevez votre devis détaillé dans les 24-48 heures.'
                    : 'You receive your detailed quote within 24-48 hours.'}
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
