import { Metadata } from 'next';
import Link from 'next/link';
import { Locale } from '@/types';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { TraceabilityHeroBadges } from '@/components/traceability';
import {
  MapPin,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Satellite,
  FileCheck,
  Globe,
  Shield,
  Link as LinkIcon,
  Database,
  Download,
} from 'lucide-react';

interface TraceabilityPageProps {
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
}: TraceabilityPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations(locale);

  return {
    title: t.traceability.title,
    description: t.traceability.subtitle,
    alternates: {
      canonical: `/${locale}/traceability`,
      languages: {
        fr: '/fr/traceability',
        en: '/en/traceability',
      },
    },
  };
}

export default async function TraceabilityPage({
  params,
}: TraceabilityPageProps) {
  const { locale } = await params;
  const t = await getTranslations(locale);

  const dueDiligenceSteps = locale === 'fr' ? [
    {
      icon: MapPin,
      title: 'Cartographie & géolocalisation des fermes',
      description: 'Coordonnées GPS et limites de parcelles, avec vérification et historique de localisation.',
    },
    {
      icon: FileText,
      title: 'Collecte de documentation',
      description: 'Dossiers : origine, producteurs, lots, dates, pièces qualité et documents export.',
    },
    {
      icon: AlertTriangle,
      title: 'Évaluation des risques',
      description: 'Analyse du risque basée sur localisation, pratiques et données disponibles.',
    },
    {
      icon: CheckCircle2,
      title: 'Vérification par tiers',
      description: 'Audits et contrôles indépendants (sur demande) pour renforcer le dossier.',
    },
    {
      icon: Satellite,
      title: 'Surveillance continue',
      description: 'Suivi périodique (terrain et/ou données) pour maintenir la conformité dans le temps.',
    },
    {
      icon: FileCheck,
      title: 'Rapports de conformité',
      description: 'Génération d\'un dossier justificatif et traçable pour due diligence et dédouanement.',
    },
  ] : [
    {
      icon: MapPin,
      title: t.traceability.dueDiligence.steps.farmMapping.title,
      description: t.traceability.dueDiligence.steps.farmMapping.description,
    },
    {
      icon: FileText,
      title: t.traceability.dueDiligence.steps.documentation.title,
      description: t.traceability.dueDiligence.steps.documentation.description,
    },
    {
      icon: AlertTriangle,
      title: t.traceability.dueDiligence.steps.riskAssessment.title,
      description: t.traceability.dueDiligence.steps.riskAssessment.description,
    },
    {
      icon: CheckCircle2,
      title: t.traceability.dueDiligence.steps.verification.title,
      description: t.traceability.dueDiligence.steps.verification.description,
    },
    {
      icon: Satellite,
      title: t.traceability.dueDiligence.steps.monitoring.title,
      description: t.traceability.dueDiligence.steps.monitoring.description,
    },
    {
      icon: FileCheck,
      title: t.traceability.dueDiligence.steps.reporting.title,
      description: t.traceability.dueDiligence.steps.reporting.description,
    },
  ];

  const complianceMeasures = locale === 'fr' ? [
    {
      icon: Globe,
      title: 'Données de Géolocalisation',
      description: 'Parcelles & sites de production, cartographie polygonale.',
    },
    {
      icon: LinkIcon,
      title: 'Chaîne de Traçabilité',
      description: 'Transferts horodatés et preuves par lot.',
    },
    {
      icon: Satellite,
      title: 'Surveillance Satellite',
      description: 'Détection de changements d\'usage des terres (selon données disponibles).',
    },
    {
      icon: Shield,
      title: 'Vérification des Certifications',
      description: 'Validation documents durabilité & conformité.',
    },
    {
      icon: Database,
      title: 'Piste d\'Audit Numérique',
      description: 'Registres sécurisés, intégrité des données.',
    },
    {
      icon: FileCheck,
      title: 'Rapports Réglementaires',
      description: 'Dossier RDUE & pièces justificatives.',
    },
  ] : [
    {
      icon: Globe,
      title: t.traceability.compliance.measures.geolocation.title,
      description: t.traceability.compliance.measures.geolocation.description,
    },
    {
      icon: LinkIcon,
      title: t.traceability.compliance.measures.chainOfCustody.title,
      description: t.traceability.compliance.measures.chainOfCustody.description,
    },
    {
      icon: Satellite,
      title: t.traceability.compliance.measures.satelliteMonitoring.title,
      description: t.traceability.compliance.measures.satelliteMonitoring.description,
    },
    {
      icon: Shield,
      title: t.traceability.compliance.measures.certification.title,
      description: t.traceability.compliance.measures.certification.description,
    },
    {
      icon: Database,
      title: t.traceability.compliance.measures.auditTrail.title,
      description: t.traceability.compliance.measures.auditTrail.description,
    },
    {
      icon: FileCheck,
      title: t.traceability.compliance.measures.reporting.title,
      description: t.traceability.compliance.measures.reporting.description,
    },
  ];

  // Hero badges
  const heroBadges = [
    { label: locale === 'fr' ? 'Données sécurisées' : 'Secure data', icon: 'database' },
    { label: locale === 'fr' ? 'Parcelles géolocalisées' : 'Geolocated plots', icon: 'map-pin' },
    { label: locale === 'fr' ? 'Dossier justificatif' : 'Supporting documentation', icon: 'file-check' },
    { label: locale === 'fr' ? 'Audit-ready' : 'Audit-ready', icon: 'lock' },
  ];

  return (
    <main className="min-h-screen bg-[#0A1410]">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[50vh] md:min-h-[55vh] flex items-center justify-center py-16 md:py-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/terrain-cocoa-cameroon.jpg"
            alt=""
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1410]/70 via-[#0A1410]/80 to-[#0A1410]/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_50%,rgba(0,0,0,0.3)_100%)]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal animation="fade">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#E8F5E9] leading-tight">
                {locale === 'fr' ? 'Traçabilité & Conformité RDUE' : t.traceability.title}
              </h1>
              <p className="text-xl md:text-2xl text-[#C5D9C0] leading-relaxed max-w-3xl mx-auto mb-8">
                {locale === 'fr' 
                  ? 'Transparence de la ferme au port — traçabilité lot et documentation de diligence raisonnable pour l\'Union Européenne.'
                  : t.traceability.subtitle}
              </p>

              <TraceabilityHeroBadges badges={heroBadges} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* EUDR Overview Section */}
      <section className="py-20 bg-[#0F1814]">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-[#E8F5E9] mb-6">
                {locale === 'fr' ? 'Conformité RDUE' : t.traceability.eudr.title}
              </h2>
              <p className="text-lg text-[#C5D9C0] leading-relaxed">
                {locale === 'fr'
                  ? 'Nous structurons la traçabilité et la documentation nécessaires pour sécuriser les expéditions vers l\'UE, avec un niveau de preuve adapté aux exigences de diligence raisonnable.'
                  : t.traceability.eudr.description}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Due Diligence Process Section */}
      <section className="py-20 bg-[#0A1410]">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#E8F5E9] mb-4">
                {locale === 'fr' ? 'Processus de Diligence Raisonnable' : t.traceability.dueDiligence.title}
              </h2>
              <p className="text-xl text-[#C5D9C0] max-w-3xl mx-auto">
                {locale === 'fr' 
                  ? 'Six étapes pour structurer la conformité et la traçabilité de vos expéditions.'
                  : t.traceability.dueDiligence.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dueDiligenceSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <ScrollReveal
                  key={step.title}
                  animation="slide-up"
                  delay={index * 0.1}
                >
                  <div className="bg-[#0F1814] rounded-xl p-8 hover:shadow-2xl hover:shadow-[rgba(74,154,98,0.2)] transition-all duration-300 h-full border border-[rgba(255,255,255,0.08)] hover:border-[rgba(74,154,98,0.4)] hover:-translate-y-1">
                    <div className="w-16 h-16 bg-[rgba(74,154,98,0.15)] border border-[rgba(74,154,98,0.3)] rounded-lg flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-[#4A9A62]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#E8F5E9] mb-4">
                      {step.title}
                    </h3>
                    <p className="text-[#C5D9C0] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supply Chain Journey Section */}
      <section className="py-20 bg-[#0F1814]">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#E8F5E9] mb-4">
                {locale === 'fr' ? 'Parcours de la Chaîne d\'Approvisionnement' : t.traceability.supplyChain.title}
              </h2>
              <p className="text-xl text-[#C5D9C0] max-w-3xl mx-auto mb-4">
                {locale === 'fr' 
                  ? 'Suivez vos produits de l\'origine à la destination.'
                  : t.traceability.supplyChain.subtitle}
              </p>
              <p className="text-base text-[#80996F] max-w-4xl mx-auto">
                {locale === 'fr'
                  ? 'Visualisation intégrée : parcelle → lot → entrepôt → port → conteneur.'
                  : t.traceability.supplyChain.description}
              </p>
            </div>
          </ScrollReveal>

          {/* Placeholder for SupplyChainAnimation component */}
          <ScrollReveal animation="fade">
            <div className="bg-[#0A1410] rounded-xl p-12 border border-[rgba(255,255,255,0.08)]">
              <div className="text-center text-[#80996F]">
                <Satellite className="w-16 h-16 mx-auto mb-4 text-[#4A9A62]" />
                <p className="text-lg">
                  {locale === 'fr' 
                    ? 'Visualisation interactive de la chaîne d\'approvisionnement à venir'
                    : 'Interactive supply chain visualization coming soon'}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Compliance Measures Section */}
      <section className="py-20 bg-[#0A1410]">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#E8F5E9] mb-4">
                {locale === 'fr' ? 'Mesures de Conformité' : t.traceability.compliance.title}
              </h2>
              <p className="text-xl text-[#C5D9C0] max-w-3xl mx-auto">
                {locale === 'fr'
                  ? 'Outils et processus pour garantir la conformité réglementaire.'
                  : t.traceability.compliance.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {complianceMeasures.map((measure, index) => {
              const Icon = measure.icon;
              return (
                <ScrollReveal
                  key={measure.title}
                  animation="slide-up"
                  delay={index * 0.1}
                >
                  <div className="bg-[#0F1814] rounded-xl p-8 hover:shadow-2xl hover:shadow-[rgba(74,154,98,0.2)] transition-all duration-300 h-full border border-[rgba(255,255,255,0.08)] hover:border-[rgba(74,154,98,0.4)] hover:-translate-y-1">
                    <div className="w-16 h-16 bg-[rgba(74,154,98,0.15)] border border-[rgba(74,154,98,0.3)] rounded-lg flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-[#4A9A62]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#E8F5E9] mb-4">
                      {measure.title}
                    </h3>
                    <p className="text-[#C5D9C0] leading-relaxed">
                      {measure.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section className="py-20 bg-[#0F1814]">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-[#E8F5E9] mb-4">
                {locale === 'fr' ? 'Documentation disponible' : t.traceability.documentation.title}
              </h2>
              <p className="text-xl text-[#C5D9C0] max-w-3xl mx-auto mb-12">
                {locale === 'fr' 
                  ? 'Téléchargez nos guides et modèles pour faciliter votre conformité.'
                  : t.traceability.documentation.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <ScrollReveal animation="slide-up" delay={0}>
              <div className="bg-[#0A1410] rounded-xl p-8 text-center border border-[rgba(255,255,255,0.08)] hover:border-[rgba(74,154,98,0.4)] hover:shadow-2xl hover:shadow-[rgba(74,154,98,0.2)] transition-all duration-300 hover:-translate-y-1">
                <Download className="w-12 h-12 mx-auto mb-4 text-[#4A9A62]" />
                <h3 className="text-xl font-bold text-[#E8F5E9] mb-4">
                  {locale === 'fr' ? 'Guide de Conformité RDUE' : t.traceability.documentation.eudrGuide}
                </h3>
                <button className="bg-[#4A9A62] hover:bg-[#5AAA72] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  {t.common.download}
                </button>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up" delay={0.1}>
              <div className="bg-[#0A1410] rounded-xl p-8 text-center border border-[rgba(255,255,255,0.08)] hover:border-[rgba(74,154,98,0.4)] hover:shadow-2xl hover:shadow-[rgba(74,154,98,0.2)] transition-all duration-300 hover:-translate-y-1">
                <Download className="w-12 h-12 mx-auto mb-4 text-[#4A9A62]" />
                <h3 className="text-xl font-bold text-[#E8F5E9] mb-4">
                  {locale === 'fr' ? 'Modèle de Déclaration de Diligence Raisonnable' : t.traceability.documentation.dueDiligenceStatement}
                </h3>
                <button className="bg-[#4A9A62] hover:bg-[#5AAA72] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  {t.common.download}
                </button>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up" delay={0.2}>
              <div className="bg-[#0A1410] rounded-xl p-8 text-center border border-[rgba(255,255,255,0.08)] hover:border-[rgba(74,154,98,0.4)] hover:shadow-2xl hover:shadow-[rgba(74,154,98,0.2)] transition-all duration-300 hover:-translate-y-1">
                <Download className="w-12 h-12 mx-auto mb-4 text-[#4A9A62]" />
                <h3 className="text-xl font-bold text-[#E8F5E9] mb-4">
                  {locale === 'fr' ? 'Exemple de Rapport de Traçabilité' : t.traceability.documentation.traceabilityReport}
                </h3>
                <button className="bg-[#4A9A62] hover:bg-[#5AAA72] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  {t.common.download}
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 mb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero-5.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A2820]/95 via-[#0F1814]/97 to-[#0A1410]/98" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <ScrollReveal animation="fade">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#E8F5E9] mb-6">
              {locale === 'fr' ? 'Besoin de produits conformes au RDUE ?' : t.traceability.cta.title}
            </h2>
            <p className="text-lg md:text-xl text-[#C5D9C0] mb-10 max-w-2xl mx-auto leading-relaxed">
              {locale === 'fr'
                ? 'Parlons de vos exigences : origine, volumes, incoterms, niveau de preuve documentaire.'
                : t.traceability.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center bg-transparent hover:bg-[rgba(255,255,255,0.1)] text-[#E8F5E9] border-2 border-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.3)] px-8 py-4 rounded-xl font-semibold text-base transition-all"
              >
                {locale === 'fr' ? 'Nous contacter' : t.traceability.cta.contact}
              </Link>
              <Link
                href={`/${locale}/rfq`}
                className="inline-flex items-center justify-center bg-[#4A9A62] hover:bg-[#5AAA72] text-white px-8 py-4 rounded-xl font-semibold text-base transition-all shadow-lg hover:shadow-xl"
              >
                {locale === 'fr' ? 'Demander un devis' : t.traceability.cta.rfq}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
