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

        {/* Animated Background Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#4A9A62]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s', animationDuration: '4s' }} />
          <div className="absolute top-40 right-20 w-40 h-40 bg-[#A89858]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '5s' }} />
          <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-[#4A9A62]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '6s' }} />
          <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-[#A89858]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }} />
        </div>

        {/* Floating decorative circles */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-[#4A9A62] rounded-full animate-bounce z-[1]" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-20 right-16 w-3 h-3 bg-[#A89858] rounded-full animate-bounce z-[1]" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }} />
        <div className="absolute bottom-32 left-20 w-2 h-2 bg-[#4A9A62] rounded-full animate-bounce z-[1]" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute bottom-20 right-32 w-3 h-3 bg-[#A89858] rounded-full animate-bounce z-[1]" style={{ animationDelay: '1.5s', animationDuration: '3.2s' }} />

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal animation="fade">
            <div className="max-w-5xl mx-auto text-center">
              {/* Decorative top line */}
              <div className="flex items-center justify-center mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#4A9A62] to-transparent" />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#E8F5E9] leading-tight animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                {locale === 'fr' ? 'Traçabilité & Conformité RDUE' : t.traceability.title}
              </h1>
              <p className="text-xl md:text-2xl text-[#C5D9C0] leading-relaxed max-w-3xl mx-auto mb-8 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                {locale === 'fr' 
                  ? 'Transparence de la ferme au port — traçabilité lot et documentation de diligence raisonnable pour l\'Union Européenne.'
                  : t.traceability.subtitle}
              </p>

              <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                <TraceabilityHeroBadges badges={heroBadges} />
              </div>

              {/* Decorative bottom element */}
              <div className="flex items-center justify-center mt-8 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#4A9A62] to-transparent rounded-full" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* EUDR Overview Section */}
      <section className="py-20 bg-[#0F1814] relative overflow-hidden">
        {/* Background particles */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#4A9A62]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#A89858]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '9s', animationDelay: '1s' }} />

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal animation="fade">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-[#E8F5E9] mb-6 animate-fadeInUp relative inline-block">
                {locale === 'fr' ? 'Conformité RDUE' : t.traceability.eudr.title}
                {/* Decorative underline */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#4A9A62] to-transparent rounded-full animate-slideInRight" />
              </h2>
              <p className="text-lg text-[#C5D9C0] leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                {locale === 'fr'
                  ? 'Nous structurons la traçabilité et la documentation nécessaires pour sécuriser les expéditions vers l\'UE, avec un niveau de preuve adapté aux exigences de diligence raisonnable.'
                  : t.traceability.eudr.description}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Due Diligence Process Section */}
      <section className="py-20 bg-[#0A1410] relative overflow-hidden">
        {/* Large background blurs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#4A9A62]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#A89858]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal animation="fade">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#E8F5E9] mb-4 animate-fadeInUp">
                {locale === 'fr' ? 'Processus de Diligence Raisonnable' : t.traceability.dueDiligence.title}
              </h2>
              <p className="text-xl text-[#C5D9C0] max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
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
                  <div className="group relative bg-[#0F1814] rounded-xl p-8 hover:shadow-2xl hover:shadow-[rgba(74,154,98,0.2)] transition-all duration-300 h-full border border-[rgba(255,255,255,0.08)] hover:border-[rgba(74,154,98,0.4)] hover:-translate-y-1 overflow-hidden">
                    {/* Corner decoration */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#4A9A62]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Animated top border */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#4A9A62] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                    
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-[rgba(74,154,98,0.15)] border border-[rgba(74,154,98,0.3)] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                        <Icon className="w-8 h-8 text-[#4A9A62]" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#E8F5E9] mb-4">
                        {step.title}
                      </h3>
                      <p className="text-[#C5D9C0] leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4A9A62]/0 to-[#4A9A62]/0 group-hover:from-[#4A9A62]/5 group-hover:to-[#4A9A62]/5 transition-all duration-300 rounded-xl" />
                    
                    {/* Pulse ring */}
                    <div className="absolute inset-0 rounded-xl border-2 border-[#4A9A62]/0 group-hover:border-[#4A9A62]/20 group-hover:scale-105 transition-all duration-500" />
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supply Chain Journey Section */}
      <section className="py-20 bg-[#0F1814] relative overflow-hidden">
        {/* Background particles */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#4A9A62]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-[#A89858]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal animation="fade">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#E8F5E9] mb-4 animate-fadeInUp">
                {locale === 'fr' ? 'Parcours de la Chaîne d\'Approvisionnement' : t.traceability.supplyChain.title}
              </h2>
              <p className="text-xl text-[#C5D9C0] max-w-3xl mx-auto mb-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                {locale === 'fr' 
                  ? 'Suivez vos produits de l\'origine à la destination.'
                  : t.traceability.supplyChain.subtitle}
              </p>
              <p className="text-base text-[#80996F] max-w-4xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                {locale === 'fr'
                  ? 'Visualisation intégrée : parcelle → lot → entrepôt → port → conteneur.'
                  : t.traceability.supplyChain.description}
              </p>
            </div>
          </ScrollReveal>

          {/* Placeholder for SupplyChainAnimation component */}
          <ScrollReveal animation="fade">
            <div className="group relative bg-[#0A1410] rounded-xl p-12 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(74,154,98,0.4)] transition-all duration-300 overflow-hidden">
              {/* Animated rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-[#4A9A62]/10 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-[#A89858]/10 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
              
              <div className="text-center text-[#80996F] relative z-10">
                <Satellite className="w-16 h-16 mx-auto mb-4 text-[#4A9A62] group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse" />
                <p className="text-lg">
                  {locale === 'fr' 
                    ? 'Visualisation interactive de la chaîne d\'approvisionnement à venir'
                    : 'Interactive supply chain visualization coming soon'}
                </p>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A9A62]/0 to-[#4A9A62]/0 group-hover:from-[#4A9A62]/5 group-hover:to-[#4A9A62]/5 transition-all duration-300 rounded-xl" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Compliance Measures Section */}
      <section className="py-20 bg-[#0A1410] relative overflow-hidden">
        {/* Large background blurs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#4A9A62]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#A89858]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '11s', animationDelay: '2s' }} />

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal animation="fade">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#E8F5E9] mb-4 animate-fadeInUp">
                {locale === 'fr' ? 'Mesures de Conformité' : t.traceability.compliance.title}
              </h2>
              <p className="text-xl text-[#C5D9C0] max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
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
                  <div className="group relative bg-[#0F1814] rounded-xl p-8 hover:shadow-2xl hover:shadow-[rgba(74,154,98,0.2)] transition-all duration-300 h-full border border-[rgba(255,255,255,0.08)] hover:border-[rgba(74,154,98,0.4)] hover:-translate-y-1 overflow-hidden">
                    {/* Corner decoration */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#4A9A62]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Animated bottom border */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#4A9A62] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-[rgba(74,154,98,0.15)] border border-[rgba(74,154,98,0.3)] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                        <Icon className="w-8 h-8 text-[#4A9A62]" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#E8F5E9] mb-4">
                        {measure.title}
                      </h3>
                      <p className="text-[#C5D9C0] leading-relaxed">
                        {measure.description}
                      </p>
                    </div>

                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4A9A62]/0 to-[#4A9A62]/0 group-hover:from-[#4A9A62]/5 group-hover:to-[#4A9A62]/5 transition-all duration-300 rounded-xl" />
                    
                    {/* Pulse ring */}
                    <div className="absolute inset-0 rounded-xl border-2 border-[#4A9A62]/0 group-hover:border-[#4A9A62]/20 group-hover:scale-105 transition-all duration-500" />
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section className="py-20 bg-[#0F1814] relative overflow-hidden">
        {/* Background particles */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#4A9A62]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#A89858]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '9s', animationDelay: '1s' }} />

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal animation="fade">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-[#E8F5E9] mb-4 animate-fadeInUp">
                {locale === 'fr' ? 'Documentation disponible' : t.traceability.documentation.title}
              </h2>
              <p className="text-xl text-[#C5D9C0] max-w-3xl mx-auto mb-12 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                {locale === 'fr' 
                  ? 'Téléchargez nos guides et modèles pour faciliter votre conformité.'
                  : t.traceability.documentation.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <ScrollReveal animation="slide-up" delay={0}>
              <div className="group relative bg-[#0A1410] rounded-xl p-8 text-center border border-[rgba(255,255,255,0.08)] hover:border-[rgba(74,154,98,0.4)] hover:shadow-2xl hover:shadow-[rgba(74,154,98,0.2)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                {/* Corner glow */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#4A9A62]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <Download className="w-12 h-12 mx-auto mb-4 text-[#4A9A62] group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300" />
                <h3 className="text-xl font-bold text-[#E8F5E9] mb-4 relative z-10">
                  {locale === 'fr' ? 'Guide de Conformité RDUE' : t.traceability.documentation.eudrGuide}
                </h3>
                <button className="group/btn relative bg-[#4A9A62] hover:bg-[#5AAA72] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 overflow-hidden">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative z-10">{t.common.download}</span>
                </button>

                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-xl border-2 border-[#4A9A62]/0 group-hover:border-[#4A9A62]/20 group-hover:scale-105 transition-all duration-500" />
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up" delay={0.1}>
              <div className="group relative bg-[#0A1410] rounded-xl p-8 text-center border border-[rgba(255,255,255,0.08)] hover:border-[rgba(74,154,98,0.4)] hover:shadow-2xl hover:shadow-[rgba(74,154,98,0.2)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                {/* Corner glow */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#4A9A62]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <Download className="w-12 h-12 mx-auto mb-4 text-[#4A9A62] group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300" />
                <h3 className="text-xl font-bold text-[#E8F5E9] mb-4 relative z-10">
                  {locale === 'fr' ? 'Modèle de Déclaration de Diligence Raisonnable' : t.traceability.documentation.dueDiligenceStatement}
                </h3>
                <button className="group/btn relative bg-[#4A9A62] hover:bg-[#5AAA72] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 overflow-hidden">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative z-10">{t.common.download}</span>
                </button>

                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-xl border-2 border-[#4A9A62]/0 group-hover:border-[#4A9A62]/20 group-hover:scale-105 transition-all duration-500" />
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up" delay={0.2}>
              <div className="group relative bg-[#0A1410] rounded-xl p-8 text-center border border-[rgba(255,255,255,0.08)] hover:border-[rgba(74,154,98,0.4)] hover:shadow-2xl hover:shadow-[rgba(74,154,98,0.2)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                {/* Corner glow */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#4A9A62]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <Download className="w-12 h-12 mx-auto mb-4 text-[#4A9A62] group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300" />
                <h3 className="text-xl font-bold text-[#E8F5E9] mb-4 relative z-10">
                  {locale === 'fr' ? 'Exemple de Rapport de Traçabilité' : t.traceability.documentation.traceabilityReport}
                </h3>
                <button className="group/btn relative bg-[#4A9A62] hover:bg-[#5AAA72] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 overflow-hidden">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative z-10">{t.common.download}</span>
                </button>

                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-xl border-2 border-[#4A9A62]/0 group-hover:border-[#4A9A62]/20 group-hover:scale-105 transition-all duration-500" />
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

        {/* Animated particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
          <div className="absolute top-10 left-10 w-3 h-3 bg-[#4A9A62] rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute top-20 right-20 w-2 h-2 bg-[#A89858] rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }} />
          <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-[#4A9A62] rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className="absolute bottom-32 right-1/3 w-2 h-2 bg-[#A89858] rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.2s' }} />
        </div>

        {/* Animated rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-[#4A9A62]/10 rounded-full animate-ping z-[1]" style={{ animationDuration: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[#A89858]/10 rounded-full animate-ping z-[1]" style={{ animationDuration: '4s', animationDelay: '1s' }} />

        <div className="container mx-auto px-4 text-center relative z-10">
          <ScrollReveal animation="fade">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#E8F5E9] mb-6 animate-fadeInUp">
              {locale === 'fr' ? 'Besoin de produits conformes au RDUE ?' : t.traceability.cta.title}
            </h2>
            <p className="text-lg md:text-xl text-[#C5D9C0] mb-10 max-w-2xl mx-auto leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              {locale === 'fr'
                ? 'Parlons de vos exigences : origine, volumes, incoterms, niveau de preuve documentaire.'
                : t.traceability.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <Link
                href={`/${locale}/contact`}
                className="group relative inline-flex items-center justify-center bg-transparent hover:bg-[rgba(255,255,255,0.1)] text-[#E8F5E9] border-2 border-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.3)] px-8 py-4 rounded-xl font-semibold text-base transition-all hover:scale-105 overflow-hidden"
              >
                {/* Border glow effect */}
                <div className="absolute inset-0 rounded-xl border-2 border-[#4A9A62]/0 group-hover:border-[#4A9A62]/30 transition-all duration-300" />
                <span className="relative z-10">{locale === 'fr' ? 'Nous contacter' : t.traceability.cta.contact}</span>
              </Link>
              <Link
                href={`/${locale}/rfq`}
                className="group relative inline-flex items-center justify-center bg-[#4A9A62] hover:bg-[#5AAA72] text-white px-8 py-4 rounded-xl font-semibold text-base transition-all shadow-lg hover:shadow-xl hover:scale-105 overflow-hidden"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="relative z-10">{locale === 'fr' ? 'Demander un devis' : t.traceability.cta.rfq}</span>
                <span className="relative z-10 ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </div>

            {/* Pulse dot indicator */}
            <div className="flex items-center justify-center gap-2 mt-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <div className="w-2 h-2 bg-[#4A9A62] rounded-full animate-pulse" />
              <span className="text-sm text-[#C5D9C0]">
                {locale === 'fr' ? 'Réponse sous 24h' : 
                 locale === 'en' ? 'Response within 24h' :
                 'Response within 24h'}
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
