/**
 * Content data for the SCPB Partner Section
 * 
 * This file contains all text content, CTAs, and image configurations
 * for the partner section in both French and English.
 */

import { Locale } from '@/types';
import { PartnerContent } from '@/types/partner-section';

/**
 * Partner section content for all supported locales
 * 
 * Requirements:
 * - 4.1: Eyebrow label "Partenaire opérationnel"
 * - 4.2: Title "Afexia × SCPB SARL"
 * - 4.3: Subtitle with proof-oriented messaging
 * - 4.4: Body text limited to 90-120 words
 * - 4.5: Exactly 3 key facts as bullet points
 * - 4.6: Trust microcopy below CTAs
 * - 10.1: French content support
 * - 10.2: English content support
 */
export const partnerSectionContent: Record<Locale, PartnerContent> = {
  fr: {
    partnerName: 'SCPB SARL',
    relationship: 'Partenaire stratégique / filleule Afrexia',
    partnerUrl: 'https://ste-scpb.com',
    eyebrow: 'Partenaire opérationnel',
    title: 'Afexia × SCPB SARL',
    subtitle: 'Un ancrage local solide, des standards internationaux, une exécution prête pour audit.',
    bodyText: [
      'SCPB SARL assure la collecte, le stockage et la préparation export de nos produits directement à la source. Cette présence locale garantit un contrôle qualité rigoureux et une traçabilité complète de la ferme au port. Nos équipes sur le terrain supervisent chaque étape du processus, de la réception des matières premières jusqu\'à l\'expédition finale.',
      'En tant que partenaire stratégique d\'Afrexia, SCPB applique les mêmes standards de qualité et de conformité, avec une documentation complète (COA, spec sheets) et une préparation EUDR-ready pour tous les envois. Cette intégration opérationnelle permet une réactivité optimale et une transparence totale sur l\'ensemble de la chaîne d\'approvisionnement.'
    ],
    keyFacts: [
      'Collecte, stockage & préparation export',
      'Contrôle qualité & documentation (COA / Spec sheets)',
      'Traçabilité & conformité EUDR-ready'
    ],
    stats: [
      { label: 'Réseau producteurs', value: '+2000', icon: 'users' },
      { label: 'Capacité annuelle', value: '20,000 t', icon: 'scale' },
      { label: 'Infrastructure', value: '5 sites', icon: 'warehouse' }
    ],
    primaryCTA: {
      label: 'Découvrir SCPB SARL',
      href: 'https://ste-scpb.com',
      external: true
    },
    secondaryCTA: {
      label: 'Voir nos capacités d\'exécution',
      href: '/fr/solutions#impact',
      external: false
    },
    trustMicrocopy: 'Réponse sous 24h • NDA standard • Dossiers QA sur demande',
    images: [
      {
        src: '/assets/partners/scpb-quality-control.jpg',
        alt: 'Contrôle qualité SCPB - inspection des fèves de cacao',
        priority: true
      },
      {
        src: '/assets/partners/scpb-warehouse.jpg',
        alt: 'Infrastructure de stockage SCPB',
        priority: false
      }
    ],
    photoCaption: 'Contrôle qualité & traçabilité sur site'
  },
  en: {
    partnerName: 'SCPB SARL',
    relationship: 'Strategic partner / Afrexia subsidiary',
    partnerUrl: 'https://ste-scpb.com',
    eyebrow: 'Operational partner',
    title: 'Afexia × SCPB SARL',
    subtitle: 'Strong local presence, international standards, audit-ready execution.',
    bodyText: [
      'SCPB SARL handles collection, storage, and export preparation of our products directly at source. This local presence ensures rigorous quality control and complete traceability from farm to port. Our on-ground teams supervise every step of the process, from raw material reception through quality inspection to final shipment preparation.',
      'As a strategic partner of Afrexia, SCPB applies the same quality and compliance standards, with complete documentation including Certificates of Analysis and specification sheets, plus EUDR-ready preparation for all shipments. This operational integration enables optimal responsiveness and full transparency across the entire supply chain.'
    ],
    keyFacts: [
      'Collection, storage & export preparation',
      'Quality control & documentation (COA / Spec sheets)',
      'Traceability & EUDR-ready compliance'
    ],
    stats: [
      { label: 'Producer network', value: '+2000', icon: 'users' },
      { label: 'Annual capacity', value: '20,000 t', icon: 'scale' },
      { label: 'Infrastructure', value: '5 sites', icon: 'warehouse' }
    ],
    primaryCTA: {
      label: 'Discover SCPB SARL',
      href: 'https://ste-scpb.com',
      external: true
    },
    secondaryCTA: {
      label: 'View our execution capabilities',
      href: '/en/solutions#impact',
      external: false
    },
    trustMicrocopy: '24h response • Standard NDA • QA files on request',
    images: [
      {
        src: '/assets/partners/scpb-quality-control.jpg',
        alt: 'SCPB quality control - cocoa bean inspection',
        priority: true
      },
      {
        src: '/assets/partners/scpb-warehouse.jpg',
        alt: 'SCPB storage infrastructure',
        priority: false
      }
    ],
    photoCaption: 'On-site quality control & traceability'
  },
  // Fallback locales use English content
  es: {
    partnerName: 'SCPB SARL',
    relationship: 'Strategic partner / Afrexia subsidiary',
    partnerUrl: 'https://ste-scpb.com',
    eyebrow: 'Operational partner',
    title: 'Afexia × SCPB SARL',
    subtitle: 'Strong local presence, international standards, audit-ready execution.',
    bodyText: [
      'SCPB SARL handles collection, storage, and export preparation of our products directly at source. This local presence ensures rigorous quality control and complete traceability from farm to port. Our on-ground teams supervise every step of the process, from raw material reception through quality inspection to final shipment preparation.',
      'As a strategic partner of Afrexia, SCPB applies the same quality and compliance standards, with complete documentation including Certificates of Analysis and specification sheets, plus EUDR-ready preparation for all shipments. This operational integration enables optimal responsiveness and full transparency across the entire supply chain.'
    ],
    keyFacts: [
      'Collection, storage & export preparation',
      'Quality control & documentation (COA / Spec sheets)',
      'Traceability & EUDR-ready compliance'
    ],
    stats: [
      { label: 'Producer network', value: '+2000', icon: 'users' },
      { label: 'Annual capacity', value: '20,000 t', icon: 'scale' },
      { label: 'Infrastructure', value: '5 sites', icon: 'warehouse' }
    ],
    primaryCTA: {
      label: 'Discover SCPB SARL',
      href: 'https://ste-scpb.com',
      external: true
    },
    secondaryCTA: {
      label: 'View our execution capabilities',
      href: '/en/solutions#impact',
      external: false
    },
    trustMicrocopy: '24h response • Standard NDA • QA files on request',
    images: [
      {
        src: '/assets/partners/scpb-quality-control.jpg',
        alt: 'SCPB quality control - cocoa bean inspection',
        priority: true
      },
      {
        src: '/assets/partners/scpb-warehouse.jpg',
        alt: 'SCPB storage infrastructure',
        priority: false
      }
    ],
    photoCaption: 'On-site quality control & traceability'
  },
  de: {
    partnerName: 'SCPB SARL',
    relationship: 'Strategic partner / Afrexia subsidiary',
    partnerUrl: 'https://ste-scpb.com',
    eyebrow: 'Operational partner',
    title: 'Afexia × SCPB SARL',
    subtitle: 'Strong local presence, international standards, audit-ready execution.',
    bodyText: [
      'SCPB SARL handles collection, storage, and export preparation of our products directly at source. This local presence ensures rigorous quality control and complete traceability from farm to port. Our on-ground teams supervise every step of the process, from raw material reception through quality inspection to final shipment preparation.',
      'As a strategic partner of Afrexia, SCPB applies the same quality and compliance standards, with complete documentation including Certificates of Analysis and specification sheets, plus EUDR-ready preparation for all shipments. This operational integration enables optimal responsiveness and full transparency across the entire supply chain.'
    ],
    keyFacts: [
      'Collection, storage & export preparation',
      'Quality control & documentation (COA / Spec sheets)',
      'Traceability & EUDR-ready compliance'
    ],
    stats: [
      { label: 'Producer network', value: '+2000', icon: 'users' },
      { label: 'Annual capacity', value: '20,000 t', icon: 'scale' },
      { label: 'Infrastructure', value: '5 sites', icon: 'warehouse' }
    ],
    primaryCTA: {
      label: 'Discover SCPB SARL',
      href: 'https://ste-scpb.com',
      external: true
    },
    secondaryCTA: {
      label: 'View our execution capabilities',
      href: '/en/solutions#impact',
      external: false
    },
    trustMicrocopy: '24h response • Standard NDA • QA files on request',
    images: [
      {
        src: '/assets/partners/scpb-quality-control.jpg',
        alt: 'SCPB quality control - cocoa bean inspection',
        priority: true
      },
      {
        src: '/assets/partners/scpb-warehouse.jpg',
        alt: 'SCPB storage infrastructure',
        priority: false
      }
    ],
    photoCaption: 'On-site quality control & traceability'
  },
  ru: {
    partnerName: 'SCPB SARL',
    relationship: 'Strategic partner / Afrexia subsidiary',
    partnerUrl: 'https://ste-scpb.com',
    eyebrow: 'Operational partner',
    title: 'Afexia × SCPB SARL',
    subtitle: 'Strong local presence, international standards, audit-ready execution.',
    bodyText: [
      'SCPB SARL handles collection, storage, and export preparation of our products directly at source. This local presence ensures rigorous quality control and complete traceability from farm to port. Our on-ground teams supervise every step of the process, from raw material reception through quality inspection to final shipment preparation.',
      'As a strategic partner of Afrexia, SCPB applies the same quality and compliance standards, with complete documentation including Certificates of Analysis and specification sheets, plus EUDR-ready preparation for all shipments. This operational integration enables optimal responsiveness and full transparency across the entire supply chain.'
    ],
    keyFacts: [
      'Collection, storage & export preparation',
      'Quality control & documentation (COA / Spec sheets)',
      'Traceability & EUDR-ready compliance'
    ],
    stats: [
      { label: 'Producer network', value: '+2000', icon: 'users' },
      { label: 'Annual capacity', value: '20,000 t', icon: 'scale' },
      { label: 'Infrastructure', value: '5 sites', icon: 'warehouse' }
    ],
    primaryCTA: {
      label: 'Discover SCPB SARL',
      href: 'https://ste-scpb.com',
      external: true
    },
    secondaryCTA: {
      label: 'View our execution capabilities',
      href: '/en/solutions#impact',
      external: false
    },
    trustMicrocopy: '24h response • Standard NDA • QA files on request',
    images: [
      {
        src: '/assets/partners/scpb-quality-control.jpg',
        alt: 'SCPB quality control - cocoa bean inspection',
        priority: true
      },
      {
        src: '/assets/partners/scpb-warehouse.jpg',
        alt: 'SCPB storage infrastructure',
        priority: false
      }
    ],
    photoCaption: 'On-site quality control & traceability'
  }
};
