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
 * RFQ Page - Dark Green Premium Design
 * Requirements: 3.1, 14.6
 */
export default async function RFQPage({ params, searchParams }: RFQPageProps) {
  const { locale } = await params;
  const { product: preselectedProductId } = await searchParams;

  // Fetch all products for the form
  const products = await getAllProducts();

  const content = {
    fr: {
      hero: {
        badge: 'Devis personnalisé sous 24-48h',
        title: 'Demande de Devis',
        subtitle: 'Obtenez un devis sur mesure pour vos besoins',
        description: 'Parlez-nous de vos besoins et nous vous fournirons un devis personnalisé adapté à vos exigences. Notre équipe commerciale vous répondra dans les 24-48 heures.',
      },
      form: {
        title: 'Remplissez le Formulaire',
        subtitle: 'Devis gratuit • Documentation disponible • Réponse rapide',
        privacy: 'Vos informations restent confidentielles. Pas de spam.',
      },
      help: {
        title: 'Besoin d\'Aide?',
        description: 'Notre équipe commerciale est disponible pour répondre à vos questions et vous accompagner.',
        email: 'Email',
        phone: 'Téléphone',
        hours: 'Heures d\'Ouverture',
        hoursValue: 'Lun - Ven: 8h00 - 17h00 WAT',
        hoursNote: 'Email & WhatsApp: 7j/7',
      },
      why: {
        title: 'Pourquoi Afrexia?',
        reasons: [
          'Produits certifiés de qualité premium',
          'Traçabilité complète EUDR',
          'Livraison fiable et ponctuelle',
          'Support client dédié multilingue',
          'Prix compétitifs et transparents',
        ],
      },
      process: {
        title: 'Que se passe-t-il ensuite?',
        steps: [
          {
            number: '1',
            title: 'Soumission',
            description: 'Vous soumettez votre demande avec vos besoins spécifiques et quantités souhaitées.',
          },
          {
            number: '2',
            title: 'Analyse',
            description: 'Notre équipe analyse votre demande et prépare un devis personnalisé avec documentation.',
          },
          {
            number: '3',
            title: 'Réponse',
            description: 'Vous recevez votre devis détaillé avec prix, délais et conditions dans les 24-48h.',
          },
        ],
      },
      certifications: {
        title: 'Certifications & Conformité',
        description: 'Nos produits sont certifiés selon les normes internationales les plus strictes. Documentation complète disponible sur demande.',
      },
    },
    en: {
      hero: {
        badge: 'Custom quote within 24-48h',
        title: 'Request for Quote',
        subtitle: 'Get a tailored quote for your needs',
        description: 'Tell us about your requirements and we\'ll provide a customized quote adapted to your needs. Our sales team will respond within 24-48 hours.',
      },
      form: {
        title: 'Fill Out the Form',
        subtitle: 'Free quote • Documentation available • Fast response',
        privacy: 'Your information remains confidential. No spam.',
      },
      help: {
        title: 'Need Help?',
        description: 'Our sales team is available to answer your questions and assist you.',
        email: 'Email',
        phone: 'Phone',
        hours: 'Business Hours',
        hoursValue: 'Mon - Fri: 8:00 AM - 5:00 PM WAT',
        hoursNote: 'Email & WhatsApp: 7 days/week',
      },
      why: {
        title: 'Why Choose Afrexia?',
        reasons: [
          'Certified premium quality products',
          'Full EUDR traceability',
          'Reliable and timely delivery',
          'Dedicated multilingual customer support',
          'Competitive and transparent pricing',
        ],
      },
      process: {
        title: 'What Happens Next?',
        steps: [
          {
            number: '1',
            title: 'Submission',
            description: 'You submit your request with your specific requirements and desired quantities.',
          },
          {
            number: '2',
            title: 'Review',
            description: 'Our team reviews your request and prepares a customized quote with documentation.',
          },
          {
            number: '3',
            title: 'Response',
            description: 'You receive your detailed quote with pricing, timelines and terms within 24-48h.',
          },
        ],
      },
      certifications: {
        title: 'Certifications & Compliance',
        description: 'Our products are certified to the highest international standards. Complete documentation available upon request.',
      },
    },
  };

  const t = content[locale] || content.en;

  return (
    <div className="min-h-screen bg-[#0A1410]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/devis.jpg"
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1410]/80 via-[#0A1410]/70 to-[#0A1410]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4A9A62]/10 border border-[#4A9A62]/20 rounded-full text-[#4A9A62] text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{t.hero.badge}</span>
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
                  <svg className="w-5 h-5 text-[#4A9A62]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#E8F5E9]">
                  {t.form.title}
                </h2>
              </div>
              <p className="text-sm text-[#80996F] mb-6">
                {t.form.subtitle}
              </p>
              <p className="text-xs text-[#80996F] mb-6">
                {t.form.privacy}
              </p>
              <RFQForm
                products={products}
                locale={locale}
                preselectedProductId={preselectedProductId}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Help Card */}
              <div className="bg-[#0F1814] border border-[rgba(255,255,255,0.08)] rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#E8F5E9] mb-4">
                  {t.help.title}
                </h3>
                <p className="text-sm text-[#C5D9C0] mb-6">
                  {t.help.description}
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#4A9A62]/10 border border-[#4A9A62]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#4A9A62]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#C5D9C0] mb-1">
                        {t.help.email}
                      </p>
                      <a
                        href="mailto:sales@afrexia.com"
                        className="text-[#4A9A62] hover:text-[#3d8251] transition-colors text-sm"
                      >
                        sales@afrexia.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#4A9A62]/10 border border-[#4A9A62]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#4A9A62]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#C5D9C0] mb-1">
                        {t.help.phone}
                      </p>
                      <a
                        href="tel:+237XXXXXXXXX"
                        className="text-[#4A9A62] hover:text-[#3d8251] transition-colors text-sm block"
                      >
                        +237 XXX XXX XXX
                      </a>
                      <a
                        href="https://wa.me/237XXXXXXXXX"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4A9A62] hover:text-[#3d8251] transition-colors text-xs flex items-center gap-1 mt-1"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#4A9A62]/10 border border-[#4A9A62]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#4A9A62]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#C5D9C0] mb-1">
                        {t.help.hours}
                      </p>
                      <p className="text-sm text-[#80996F]">
                        {t.help.hoursValue}
                      </p>
                      <p className="text-xs text-[#4A9A62] mt-1 font-medium">
                        {t.help.hoursNote}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Choose Us Card */}
              <div className="bg-gradient-to-br from-[#4A9A62]/20 to-[#3d8251]/20 border border-[#4A9A62]/30 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-[#E8F5E9] mb-4">
                  {t.why.title}
                </h3>
                <ul className="space-y-3">
                  {t.why.reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-[#C5D9C0]">
                      <svg className="w-5 h-5 text-[#4A9A62] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Certifications Card */}
              <div className="bg-[#0F1814] border border-[rgba(255,255,255,0.08)] rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#E8F5E9] mb-3">
                  {t.certifications.title}
                </h3>
                <p className="text-sm text-[#C5D9C0] leading-relaxed">
                  {t.certifications.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="mt-12 bg-[#0F1814] border border-[rgba(255,255,255,0.08)] rounded-lg p-6 md:p-8 relative overflow-hidden">
          {/* Background animated particles */}
          <div className="absolute top-10 left-10 w-2 h-2 rounded-full bg-[#4A9A62]/30 animate-ripple" />
          <div className="absolute top-20 right-20 w-2 h-2 rounded-full bg-[#4A9A62]/30 animate-ripple-delayed-1" />
          <div className="absolute bottom-10 left-1/3 w-2 h-2 rounded-full bg-[#4A9A62]/30 animate-ripple-delayed-2" />
          
          <h2 className="text-2xl font-bold text-[#E8F5E9] mb-8 text-center animate-fadeInUp relative">
            {t.process.title}
            {/* Decorative underline */}
            <div className="mx-auto mt-3 w-20 h-1 bg-gradient-to-r from-transparent via-[#4A9A62] to-transparent animate-slideInRight" />
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3 relative">
            {t.process.steps.map((step, index) => (
              <div 
                key={index} 
                className={`text-center relative group ${
                  index === 0 ? 'animate-fadeInUp' : 
                  index === 1 ? 'animate-fadeInUp-delayed-1' : 
                  'animate-fadeInUp-delayed-2'
                }`}
              >
                <div className="mb-4 flex justify-center relative">
                  {/* Outer ripple effect */}
                  <div className={`absolute inset-0 flex items-center justify-center ${
                    index === 0 ? 'animate-ripple' : 
                    index === 1 ? 'animate-ripple-delayed-1' : 
                    'animate-ripple-delayed-2'
                  }`}>
                    <div className="w-16 h-16 rounded-full border-2 border-[#4A9A62]/50" />
                  </div>
                  
                  {/* Main circle */}
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-[#4A9A62] text-2xl font-bold text-white relative overflow-hidden z-10 transition-transform duration-300 group-hover:scale-110 ${
                    index === 0 ? 'animate-glow' : 
                    index === 1 ? 'animate-glow-delayed-1' : 
                    'animate-glow-delayed-2'
                  }`}>
                    <span className={`relative z-10 ${
                      index === 0 ? 'animate-heartbeat' : 
                      index === 1 ? 'animate-heartbeat-delayed-1' : 
                      'animate-heartbeat-delayed-2'
                    }`}>{step.number}</span>
                    
                    {/* Shimmer effect */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent ${
                        index === 0 ? 'animate-shimmer' : 
                        index === 1 ? 'animate-shimmer-delayed-1' : 
                        'animate-shimmer-delayed-2'
                      }`}
                    />
                    
                    {/* Rotating ring effect */}
                    <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-spin" style={{ animationDuration: '4s' }} />
                    
                    {/* Secondary rotating ring (opposite direction) */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/20" style={{ animation: 'spin 6s linear infinite reverse' }} />
                  </div>
                  
                  {/* Floating particles around circle */}
                  <div className={`absolute top-0 left-0 w-1 h-1 rounded-full bg-[#4A9A62] ${
                    index === 0 ? 'animate-bounce' : 
                    index === 1 ? 'animate-bounce-delayed-1' : 
                    'animate-bounce-delayed-2'
                  }`} />
                  <div className={`absolute bottom-0 right-0 w-1 h-1 rounded-full bg-[#4A9A62] ${
                    index === 0 ? 'animate-bounce-delayed-1' : 
                    index === 1 ? 'animate-bounce-delayed-2' : 
                    'animate-bounce'
                  }`} />
                </div>
                
                <h3 className={`mb-3 text-xl font-bold text-[#E8F5E9] transition-colors duration-300 group-hover:text-[#4A9A62] ${
                  index === 0 ? 'animate-scaleIn' : 
                  index === 1 ? 'animate-scaleIn-delayed-1' : 
                  'animate-scaleIn-delayed-2'
                }`}>
                  {step.title}
                </h3>
                
                <p className="text-sm text-[#C5D9C0] leading-relaxed transition-all duration-300 group-hover:text-[#E8F5E9]">
                  {step.description}
                </p>
                
                {/* Connecting line with animation */}
                {index < t.process.steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-[#4A9A62]/20 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r from-[#4A9A62] to-[#4A9A62]/50 ${
                        index === 0 ? 'animate-progress' : 'animate-progress-delayed'
                      }`}
                    />
                    {/* Animated dots traveling along the line */}
                    <div className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#4A9A62] shadow-lg shadow-[#4A9A62]/50 ${
                      index === 0 ? 'animate-progress' : 'animate-progress-delayed'
                    }`} style={{ left: '0%' }} />
                  </div>
                )}
                
                {/* Hover effect - bottom border */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#4A9A62] transition-all duration-300 group-hover:w-full" />
              </div>
            ))}
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
