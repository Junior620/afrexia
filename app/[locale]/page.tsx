import { Locale } from '@/types';
import { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { Statistics } from '@/components/sections/Statistics';
import { TrustBar } from '@/components/sections/TrustBar';
import { ProductsShowcase } from '@/components/sections/ProductsShowcase';
import { JourneySection } from '@/components/sections/JourneySection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { PartnerSection } from '@/components/sections/PartnerSection';
import { getAllProducts, getSiteSettings } from '@/lib/sanity/queries';
import { generateMetaTags } from '@/lib/seo/metadata';
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo/schema';
import { sepacamSectionContent } from '@/lib/content/sepacam-section';

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

/**
 * Generate metadata for homepage
 */
export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;

  const content = {
    fr: {
      title: 'Afrexia - Exportateur de Commodités Agricoles Africaines Premium',
      description:
        'Votre partenaire de confiance pour l\'export de cacao, café, poivre, bois et maïs depuis l\'Afrique. Certifications internationales, traçabilité complète, qualité garantie.',
      keywords: [
        'cacao africain',
        'café africain',
        'poivre cameroun',
        'bois tropical',
        'maïs export',
        'commodités agricoles',
        'export afrique',
        'afrexia',
        'traçabilité EUDR',
      ],
    },
    en: {
      title: 'Afrexia - Premium African Agricultural Commodities Exporter',
      description:
        'Your trusted partner for exporting cocoa, coffee, pepper, wood, and corn from Africa. International certifications, full traceability, guaranteed quality.',
      keywords: [
        'african cocoa',
        'african coffee',
        'cameroon pepper',
        'tropical wood',
        'corn export',
        'agricultural commodities',
        'africa export',
        'afrexia',
        'EUDR traceability',
      ],
    },
  };

  const t = content[locale] || content.en; // Fallback to English if locale not found

  const metadata = generateMetaTags({
    title: t.title,
    description: t.description,
    locale,
    path: '',
    keywords: t.keywords,
  });

  // Add Organization and WebSite structured data
  const organizationSchema = generateOrganizationSchema(locale);
  const websiteSchema = generateWebSiteSchema(locale);

  return {
    ...metadata,
    other: {
      'script:ld+json': JSON.stringify([organizationSchema, websiteSchema]),
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  // Fetch data for homepage sections
  const [products, siteSettings] = await Promise.all([
    getAllProducts(),
    getSiteSettings(),
  ]);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero locale={locale} />

      {/* Statistics Section */}
      <Statistics locale={locale} trackRecordImage={siteSettings?.trackRecordImage} />

      {/* Trust Bar - Proof Section */}
      <TrustBar locale={locale} complianceBackgroundImage={siteSettings?.complianceBackgroundImage} />

      {/* Products Showcase Section */}
      <ProductsShowcase products={products} locale={locale} />

      {/* Journey Section */}
      <JourneySection locale={locale} />

      {/* Services Section */}
      <ServicesSection locale={locale} />

      {/* Partner Section - SCPB SARL */}
      <PartnerSection locale={locale} />

      {/* Separator */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      </div>

      {/* Partner Section - SEPACAM */}
      <PartnerSection locale={locale} content={sepacamSectionContent[locale]} />
    </main>
  );
}
