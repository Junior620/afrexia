/**
 * Quality & Compliance Page Data
 * 
 * Centralized data structure for quality page content
 * Supports FR/EN localization with fallback to FR
 */

import { Locale } from '@/types';
import { Award, FileCheck, ClipboardCheck, CheckCircle2, Shield, FileText, Package, Globe } from 'lucide-react';

export interface QualityBadge {
  label: string;
  icon: string;
}

export interface QualityStandard {
  icon: any;
  title: string;
  description: string;
  bullets: string[];
  proof: string;
}

export interface QAStep {
  step: number;
  title: string;
  description: string;
  details: string[];
}

export interface ComplianceDoc {
  label: string;
  note?: string;
}

export interface QualityFAQ {
  question: string;
  answer: string;
}

export interface QualityPageContent {
  hero: {
    title: string;
    subtitle: string;
    badges: QualityBadge[];
    trustMicrocopy: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  certifications: {
    title: string;
    subtitle: string;
    ctaRequest: string;
  };
  standards: {
    title: string;
    subtitle: string;
    items: QualityStandard[];
  };
  process: {
    title: string;
    subtitle: string;
    steps: QAStep[];
  };
  compliancePack: {
    title: string;
    subtitle: string;
    documents: ComplianceDoc[];
    ctaDownload: string;
    trustNote: string;
  };
  faq: {
    title: string;
    items: QualityFAQ[];
  };
  finalCTA: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
}

export const qualityPageContent: Record<Locale, QualityPageContent> = {
  fr: {
    hero: {
      title: 'Qualité & Conformité',
      subtitle: 'Normes rigoureuses et documentation audit-ready pour chaque expédition.',
      badges: [
        { label: 'QA documentée', icon: 'file-check' },
        { label: 'EUDR-ready', icon: 'shield' },
        { label: 'COA / Spec sheet', icon: 'file-text' },
        { label: 'NDA possible', icon: 'lock' },
        { label: 'Réponse < 24h', icon: 'clock' },
      ],
      trustMicrocopy: 'Documents disponibles sur demande • Partage sous NDA si requis',
      ctaPrimary: 'Recevoir le pack conformité',
      ctaSecondary: 'Voir nos certifications',
    },
    certifications: {
      title: 'Nos Certifications',
      subtitle: 'Capacités certifiées et documentation disponible sur demande pour audit.',
      ctaRequest: 'Demander la liste complète (NDA)',
    },
    standards: {
      title: 'Normes de Qualité',
      subtitle: 'Standards internationaux appliqués à chaque étape de la chaîne d\'approvisionnement.',
      items: [
        {
          icon: Award,
          title: 'Normes de Classement',
          description: 'Classification selon standards internationaux',
          bullets: [
            'Grading selon normes FCC/ICCO pour cacao',
            'Classification par origine et qualité',
            'Rapports de classement disponibles',
          ],
          proof: 'Rapports sur demande',
        },
        {
          icon: FileCheck,
          title: 'Tests en Laboratoire',
          description: 'Analyses complètes par laboratoires tiers accrédités',
          bullets: [
            'Tests physico-chimiques complets',
            'Analyses microbiologiques',
            'Détection contaminants et métaux lourds',
          ],
          proof: 'COA disponibles sur demande',
        },
        {
          icon: ClipboardCheck,
          title: 'Inspection Pré-Expédition',
          description: 'Vérification indépendante avant chaque envoi',
          bullets: [
            'Inspection par organisme tiers (sur demande)',
            'Vérification qualité, poids, conditionnement',
            'Certificat d\'inspection disponible',
          ],
          proof: 'Rapports d\'inspection sur demande',
        },
        {
          icon: CheckCircle2,
          title: 'Documentation & Traçabilité',
          description: 'Traçabilité complète du lot à l\'expédition',
          bullets: [
            'Traçabilité parcelle → lot → container',
            'Documentation complète (COA, spec sheets)',
            'Chain-of-custody disponible',
          ],
          proof: 'Package documentaire complet',
        },
      ],
    },
    process: {
      title: 'Notre Processus QA',
      subtitle: 'Six étapes de contrôle qualité pour garantir la conformité.',
      steps: [
        {
          step: 1,
          title: 'Sourcing & Sélection',
          description: 'Partenariat avec producteurs certifiés et coopératives structurées.',
          details: [
            'Sélection producteurs selon critères qualité',
            'Vérification certifications (si applicables)',
            'Contrats d\'approvisionnement structurés',
          ],
        },
        {
          step: 2,
          title: 'Inspection Initiale',
          description: 'Contrôle qualité aux points de collecte.',
          details: [
            'Vérification visuelle et organoleptique',
            'Échantillonnage pour tests',
            'Rejet des lots non conformes',
          ],
        },
        {
          step: 3,
          title: 'Tests Laboratoire',
          description: 'Analyses complètes par laboratoires accrédités.',
          details: [
            'Tests physico-chimiques',
            'Analyses microbiologiques',
            'Détection contaminants',
            'Émission COA',
          ],
        },
        {
          step: 4,
          title: 'Stockage Contrôlé',
          description: 'Entreposage en conditions optimales.',
          details: [
            'Température et humidité contrôlées',
            'Traçabilité par lot',
            'Inspections régulières',
          ],
        },
        {
          step: 5,
          title: 'Vérification Pré-Expédition',
          description: 'Inspection finale avant export.',
          details: [
            'Vérification qualité finale',
            'Contrôle poids et conditionnement',
            'Inspection tierce partie (sur demande)',
          ],
        },
        {
          step: 6,
          title: 'Documentation',
          description: 'Package documentaire complet pour audit.',
          details: [
            'COA et spec sheets',
            'Certificats d\'origine',
            'Documents de traçabilité',
            'Shipping docs selon Incoterm',
          ],
        },
      ],
    },
    compliancePack: {
      title: 'Pack Conformité',
      subtitle: 'Documentation complète disponible pour audit et due diligence.',
      documents: [
        { label: 'COA (Certificate of Analysis)', note: 'Par lot' },
        { label: 'Spec Sheet', note: 'Spécifications produit' },
        { label: 'Packing List', note: 'Détail conditionnement' },
        { label: 'Certificat d\'Origine', note: 'Si applicable' },
        { label: 'Traçabilité Lot', note: 'Chain-of-custody' },
        { label: 'Documents Shipping', note: 'Selon Incoterm' },
        { label: 'Certificats Tiers', note: 'Sur demande' },
      ],
      ctaDownload: 'Recevoir le pack conformité',
      trustNote: 'Réponse sous 24h • Partage sous NDA',
    },
    faq: {
      title: 'Questions Fréquentes',
      items: [
        {
          question: 'Qu\'est-ce que vous fournissez pour l\'audit ?',
          answer: 'Nous fournissons un package documentaire complet incluant COA, spec sheets, certificats d\'origine, documents de traçabilité et shipping docs selon l\'Incoterm. Tous les documents sont disponibles sur demande et peuvent être partagés sous NDA.',
        },
        {
          question: 'Pouvez-vous partager la documentation sous NDA ?',
          answer: 'Oui, nous signons des NDA standards pour partager la documentation complète, incluant rapports de laboratoire, certificats tiers et documents de traçabilité détaillés.',
        },
        {
          question: 'Comment gérez-vous la traçabilité lot ?',
          answer: 'Chaque lot est tracé de la parcelle au container, avec documentation à chaque étape : collecte, stockage, conditionnement, expédition. La chain-of-custody complète est disponible sur demande.',
        },
        {
          question: 'Quels tests laboratoire sont disponibles ?',
          answer: 'Nous réalisons des tests physico-chimiques complets, analyses microbiologiques et détection de contaminants par laboratoires tiers accrédités. Les COA sont fournis pour chaque lot.',
        },
        {
          question: 'Quels Incoterms, ports et lead times proposez-vous ?',
          answer: 'Nous travaillons principalement en FOB et CIF depuis les ports de Douala et Kribi (Cameroun). Lead times standards : 4-6 semaines selon destination et volume. Détails spécifiques fournis sur devis.',
        },
        {
          question: 'Êtes-vous EUDR-ready ?',
          answer: 'Nous préparons activement la conformité EUDR avec traçabilité géolocalisée et documentation due diligence. Statut et capacités détaillées disponibles sur demande.',
        },
        {
          question: 'Proposez-vous des inspections tierces ?',
          answer: 'Oui, nous pouvons organiser des inspections pré-expédition par organismes tiers accrédités (SGS, Bureau Veritas, etc.) sur demande de l\'acheteur. Coûts selon scope d\'inspection.',
        },
      ],
    },
    finalCTA: {
      title: 'Besoin d\'un COA ou Spec Sheet ?',
      subtitle: 'Contactez-nous pour recevoir la documentation complète et discuter de vos besoins en conformité.',
      ctaPrimary: 'Demander un devis',
      ctaSecondary: 'Nous contacter',
    },
  },
  en: {
    hero: {
      title: 'Quality & Compliance',
      subtitle: 'Rigorous standards and audit-ready documentation for every shipment.',
      badges: [
        { label: 'Documented QA', icon: 'file-check' },
        { label: 'EUDR-ready', icon: 'shield' },
        { label: 'COA / Spec sheet', icon: 'file-text' },
        { label: 'NDA available', icon: 'lock' },
        { label: 'Response < 24h', icon: 'clock' },
      ],
      trustMicrocopy: 'Documents available on request • Shared under NDA if required',
      ctaPrimary: 'Get compliance pack',
      ctaSecondary: 'View certifications',
    },
    certifications: {
      title: 'Our Certifications',
      subtitle: 'Certified capabilities and documentation available on request for audit.',
      ctaRequest: 'Request full list (NDA)',
    },
    standards: {
      title: 'Quality Standards',
      subtitle: 'International standards applied at every stage of the supply chain.',
      items: [
        {
          icon: Award,
          title: 'Grading Standards',
          description: 'Classification according to international standards',
          bullets: [
            'Grading per FCC/ICCO standards for cocoa',
            'Classification by origin and quality',
            'Grading reports available',
          ],
          proof: 'Reports on request',
        },
        {
          icon: FileCheck,
          title: 'Laboratory Testing',
          description: 'Comprehensive analysis by accredited third-party labs',
          bullets: [
            'Complete physico-chemical tests',
            'Microbiological analysis',
            'Contaminant and heavy metal detection',
          ],
          proof: 'COA available on request',
        },
        {
          icon: ClipboardCheck,
          title: 'Pre-Shipment Inspection',
          description: 'Independent verification before each shipment',
          bullets: [
            'Third-party inspection (on request)',
            'Quality, weight, packaging verification',
            'Inspection certificate available',
          ],
          proof: 'Inspection reports on request',
        },
        {
          icon: CheckCircle2,
          title: 'Documentation & Traceability',
          description: 'Complete traceability from lot to shipment',
          bullets: [
            'Traceability plot → lot → container',
            'Complete documentation (COA, spec sheets)',
            'Chain-of-custody available',
          ],
          proof: 'Complete documentation package',
        },
      ],
    },
    process: {
      title: 'Our QA Process',
      subtitle: 'Six quality control steps to ensure compliance.',
      steps: [
        {
          step: 1,
          title: 'Sourcing & Selection',
          description: 'Partnership with certified producers and structured cooperatives.',
          details: [
            'Producer selection per quality criteria',
            'Certification verification (if applicable)',
            'Structured supply contracts',
          ],
        },
        {
          step: 2,
          title: 'Initial Inspection',
          description: 'Quality control at collection points.',
          details: [
            'Visual and organoleptic verification',
            'Sampling for testing',
            'Rejection of non-compliant lots',
          ],
        },
        {
          step: 3,
          title: 'Laboratory Testing',
          description: 'Comprehensive analysis by accredited laboratories.',
          details: [
            'Physico-chemical tests',
            'Microbiological analysis',
            'Contaminant detection',
            'COA issuance',
          ],
        },
        {
          step: 4,
          title: 'Controlled Storage',
          description: 'Warehousing under optimal conditions.',
          details: [
            'Controlled temperature and humidity',
            'Lot traceability',
            'Regular inspections',
          ],
        },
        {
          step: 5,
          title: 'Pre-Shipment Verification',
          description: 'Final inspection before export.',
          details: [
            'Final quality verification',
            'Weight and packaging control',
            'Third-party inspection (on request)',
          ],
        },
        {
          step: 6,
          title: 'Documentation',
          description: 'Complete documentation package for audit.',
          details: [
            'COA and spec sheets',
            'Certificates of origin',
            'Traceability documents',
            'Shipping docs per Incoterm',
          ],
        },
      ],
    },
    compliancePack: {
      title: 'Compliance Pack',
      subtitle: 'Complete documentation available for audit and due diligence.',
      documents: [
        { label: 'COA (Certificate of Analysis)', note: 'Per lot' },
        { label: 'Spec Sheet', note: 'Product specifications' },
        { label: 'Packing List', note: 'Packaging details' },
        { label: 'Certificate of Origin', note: 'If applicable' },
        { label: 'Lot Traceability', note: 'Chain-of-custody' },
        { label: 'Shipping Documents', note: 'Per Incoterm' },
        { label: 'Third-Party Certificates', note: 'On request' },
      ],
      ctaDownload: 'Get compliance pack',
      trustNote: 'Response within 24h • Shared under NDA',
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'What do you provide for audit?',
          answer: 'We provide a complete documentation package including COA, spec sheets, certificates of origin, traceability documents and shipping docs per Incoterm. All documents are available on request and can be shared under NDA.',
        },
        {
          question: 'Can you share documentation under NDA?',
          answer: 'Yes, we sign standard NDAs to share complete documentation, including laboratory reports, third-party certificates and detailed traceability documents.',
        },
        {
          question: 'How do you manage lot traceability?',
          answer: 'Each lot is traced from plot to container, with documentation at every step: collection, storage, packaging, shipment. Complete chain-of-custody is available on request.',
        },
        {
          question: 'What laboratory tests are available?',
          answer: 'We perform complete physico-chemical tests, microbiological analysis and contaminant detection by accredited third-party laboratories. COAs are provided for each lot.',
        },
        {
          question: 'What Incoterms, ports and lead times do you offer?',
          answer: 'We primarily work FOB and CIF from Douala and Kribi ports (Cameroon). Standard lead times: 4-6 weeks depending on destination and volume. Specific details provided on quote.',
        },
        {
          question: 'Are you EUDR-ready?',
          answer: 'We are actively preparing EUDR compliance with geolocated traceability and due diligence documentation. Detailed status and capabilities available on request.',
        },
        {
          question: 'Do you offer third-party inspections?',
          answer: 'Yes, we can arrange pre-shipment inspections by accredited third-party organizations (SGS, Bureau Veritas, etc.) on buyer request. Costs depend on inspection scope.',
        },
      ],
    },
    finalCTA: {
      title: 'Need a COA or Spec Sheet?',
      subtitle: 'Contact us to receive complete documentation and discuss your compliance needs.',
      ctaPrimary: 'Request a quote',
      ctaSecondary: 'Contact us',
    },
  },
  es: {
    hero: {
      title: 'Calidad y Cumplimiento',
      subtitle: 'Estándares rigurosos y documentación lista para auditoría en cada envío.',
      badges: [
        { label: 'QA documentado', icon: 'file-check' },
        { label: 'EUDR-ready', icon: 'shield' },
        { label: 'COA / Spec sheet', icon: 'file-text' },
        { label: 'NDA disponible', icon: 'lock' },
        { label: 'Respuesta < 24h', icon: 'clock' },
      ],
      trustMicrocopy: 'Documentos disponibles bajo solicitud • Compartidos bajo NDA si es necesario',
      ctaPrimary: 'Obtener pack de cumplimiento',
      ctaSecondary: 'Ver certificaciones',
    },
    certifications: {
      title: 'Nuestras Certificaciones',
      subtitle: 'Capacidades certificadas y documentación disponible bajo solicitud para auditoría.',
      ctaRequest: 'Solicitar lista completa (NDA)',
    },
    standards: {
      title: 'Estándares de Calidad',
      subtitle: 'Estándares internacionales aplicados en cada etapa de la cadena de suministro.',
      items: [
        {
          icon: Award,
          title: 'Estándares de Clasificación',
          description: 'Clasificación según estándares internacionales',
          bullets: [
            'Clasificación según normas FCC/ICCO para cacao',
            'Clasificación por origen y calidad',
            'Informes de clasificación disponibles',
          ],
          proof: 'Informes bajo solicitud',
        },
        {
          icon: FileCheck,
          title: 'Pruebas de Laboratorio',
          description: 'Análisis completo por laboratorios acreditados de terceros',
          bullets: [
            'Pruebas fisicoquímicas completas',
            'Análisis microbiológico',
            'Detección de contaminantes y metales pesados',
          ],
          proof: 'COA disponible bajo solicitud',
        },
        {
          icon: ClipboardCheck,
          title: 'Inspección Pre-Envío',
          description: 'Verificación independiente antes de cada envío',
          bullets: [
            'Inspección de terceros (bajo solicitud)',
            'Verificación de calidad, peso, embalaje',
            'Certificado de inspección disponible',
          ],
          proof: 'Informes de inspección bajo solicitud',
        },
        {
          icon: CheckCircle2,
          title: 'Documentación y Trazabilidad',
          description: 'Trazabilidad completa desde el lote hasta el envío',
          bullets: [
            'Trazabilidad parcela → lote → contenedor',
            'Documentación completa (COA, spec sheets)',
            'Cadena de custodia disponible',
          ],
          proof: 'Paquete de documentación completo',
        },
      ],
    },
    process: {
      title: 'Nuestro Proceso de QA',
      subtitle: 'Seis pasos de control de calidad para garantizar el cumplimiento.',
      steps: [
        {
          step: 1,
          title: 'Abastecimiento y Selección',
          description: 'Asociación con productores certificados y cooperativas estructuradas.',
          details: [
            'Selección de productores según criterios de calidad',
            'Verificación de certificaciones (si aplica)',
            'Contratos de suministro estructurados',
          ],
        },
        {
          step: 2,
          title: 'Inspección Inicial',
          description: 'Control de calidad en puntos de recolección.',
          details: [
            'Verificación visual y organoléptica',
            'Muestreo para pruebas',
            'Rechazo de lotes no conformes',
          ],
        },
        {
          step: 3,
          title: 'Pruebas de Laboratorio',
          description: 'Análisis completo por laboratorios acreditados.',
          details: [
            'Pruebas fisicoquímicas',
            'Análisis microbiológico',
            'Detección de contaminantes',
            'Emisión de COA',
          ],
        },
        {
          step: 4,
          title: 'Almacenamiento Controlado',
          description: 'Almacenamiento en condiciones óptimas.',
          details: [
            'Temperatura y humedad controladas',
            'Trazabilidad por lote',
            'Inspecciones regulares',
          ],
        },
        {
          step: 5,
          title: 'Verificación Pre-Envío',
          description: 'Inspección final antes de la exportación.',
          details: [
            'Verificación de calidad final',
            'Control de peso y embalaje',
            'Inspección de terceros (bajo solicitud)',
          ],
        },
        {
          step: 6,
          title: 'Documentación',
          description: 'Paquete de documentación completo para auditoría.',
          details: [
            'COA y spec sheets',
            'Certificados de origen',
            'Documentos de trazabilidad',
            'Documentos de envío según Incoterm',
          ],
        },
      ],
    },
    compliancePack: {
      title: 'Pack de Cumplimiento',
      subtitle: 'Documentación completa disponible para auditoría y debida diligencia.',
      documents: [
        { label: 'COA (Certificado de Análisis)', note: 'Por lote' },
        { label: 'Spec Sheet', note: 'Especificaciones del producto' },
        { label: 'Lista de Embalaje', note: 'Detalles de embalaje' },
        { label: 'Certificado de Origen', note: 'Si aplica' },
        { label: 'Trazabilidad del Lote', note: 'Cadena de custodia' },
        { label: 'Documentos de Envío', note: 'Según Incoterm' },
        { label: 'Certificados de Terceros', note: 'Bajo solicitud' },
      ],
      ctaDownload: 'Obtener pack de cumplimiento',
      trustNote: 'Respuesta en 24h • Compartido bajo NDA',
    },
    faq: {
      title: 'Preguntas Frecuentes',
      items: [
        {
          question: '¿Qué proporcionan para la auditoría?',
          answer: 'Proporcionamos un paquete de documentación completo que incluye COA, spec sheets, certificados de origen, documentos de trazabilidad y documentos de envío según Incoterm. Todos los documentos están disponibles bajo solicitud y pueden compartirse bajo NDA.',
        },
        {
          question: '¿Pueden compartir documentación bajo NDA?',
          answer: 'Sí, firmamos NDAs estándar para compartir documentación completa, incluidos informes de laboratorio, certificados de terceros y documentos de trazabilidad detallados.',
        },
        {
          question: '¿Cómo gestionan la trazabilidad del lote?',
          answer: 'Cada lote se rastrea desde la parcela hasta el contenedor, con documentación en cada paso: recolección, almacenamiento, embalaje, envío. La cadena de custodia completa está disponible bajo solicitud.',
        },
        {
          question: '¿Qué pruebas de laboratorio están disponibles?',
          answer: 'Realizamos pruebas fisicoquímicas completas, análisis microbiológico y detección de contaminantes por laboratorios acreditados de terceros. Se proporcionan COAs para cada lote.',
        },
        {
          question: '¿Qué Incoterms, puertos y plazos de entrega ofrecen?',
          answer: 'Trabajamos principalmente FOB y CIF desde los puertos de Douala y Kribi (Camerún). Plazos de entrega estándar: 4-6 semanas según destino y volumen. Detalles específicos proporcionados en cotización.',
        },
        {
          question: '¿Están listos para EUDR?',
          answer: 'Estamos preparando activamente el cumplimiento de EUDR con trazabilidad geolocalizada y documentación de debida diligencia. Estado y capacidades detalladas disponibles bajo solicitud.',
        },
        {
          question: '¿Ofrecen inspecciones de terceros?',
          answer: 'Sí, podemos organizar inspecciones pre-envío por organizaciones acreditadas de terceros (SGS, Bureau Veritas, etc.) bajo solicitud del comprador. Los costos dependen del alcance de la inspección.',
        },
      ],
    },
    finalCTA: {
      title: '¿Necesita un COA o Spec Sheet?',
      subtitle: 'Contáctenos para recibir documentación completa y discutir sus necesidades de cumplimiento.',
      ctaPrimary: 'Solicitar cotización',
      ctaSecondary: 'Contáctenos',
    },
  },
  de: {
    hero: {
      title: 'Qualität & Compliance',
      subtitle: 'Strenge Standards und audit-bereite Dokumentation für jede Lieferung.',
      badges: [
        { label: 'Dokumentierte QA', icon: 'file-check' },
        { label: 'EUDR-ready', icon: 'shield' },
        { label: 'COA / Spec sheet', icon: 'file-text' },
        { label: 'NDA verfügbar', icon: 'lock' },
        { label: 'Antwort < 24h', icon: 'clock' },
      ],
      trustMicrocopy: 'Dokumente auf Anfrage verfügbar • Unter NDA geteilt falls erforderlich',
      ctaPrimary: 'Compliance-Paket erhalten',
      ctaSecondary: 'Zertifizierungen ansehen',
    },
    certifications: {
      title: 'Unsere Zertifizierungen',
      subtitle: 'Zertifizierte Fähigkeiten und Dokumentation auf Anfrage für Audit verfügbar.',
      ctaRequest: 'Vollständige Liste anfordern (NDA)',
    },
    standards: {
      title: 'Qualitätsstandards',
      subtitle: 'Internationale Standards in jeder Phase der Lieferkette angewendet.',
      items: [
        {
          icon: Award,
          title: 'Klassifizierungsstandards',
          description: 'Klassifizierung nach internationalen Standards',
          bullets: [
            'Klassifizierung nach FCC/ICCO-Standards für Kakao',
            'Klassifizierung nach Herkunft und Qualität',
            'Klassifizierungsberichte verfügbar',
          ],
          proof: 'Berichte auf Anfrage',
        },
        {
          icon: FileCheck,
          title: 'Labortests',
          description: 'Umfassende Analyse durch akkreditierte Drittlabore',
          bullets: [
            'Vollständige physikalisch-chemische Tests',
            'Mikrobiologische Analyse',
            'Kontaminanten- und Schwermetallerkennung',
          ],
          proof: 'COA auf Anfrage verfügbar',
        },
        {
          icon: ClipboardCheck,
          title: 'Vorversandinspektion',
          description: 'Unabhängige Verifizierung vor jeder Lieferung',
          bullets: [
            'Drittinspektion (auf Anfrage)',
            'Qualitäts-, Gewichts-, Verpackungsverifizierung',
            'Inspektionszertifikat verfügbar',
          ],
          proof: 'Inspektionsberichte auf Anfrage',
        },
        {
          icon: CheckCircle2,
          title: 'Dokumentation & Rückverfolgbarkeit',
          description: 'Vollständige Rückverfolgbarkeit vom Los bis zur Lieferung',
          bullets: [
            'Rückverfolgbarkeit Parzelle → Los → Container',
            'Vollständige Dokumentation (COA, Spec Sheets)',
            'Chain-of-Custody verfügbar',
          ],
          proof: 'Vollständiges Dokumentationspaket',
        },
      ],
    },
    process: {
      title: 'Unser QA-Prozess',
      subtitle: 'Sechs Qualitätskontrollschritte zur Sicherstellung der Compliance.',
      steps: [
        {
          step: 1,
          title: 'Beschaffung & Auswahl',
          description: 'Partnerschaft mit zertifizierten Produzenten und strukturierten Genossenschaften.',
          details: [
            'Produzentenauswahl nach Qualitätskriterien',
            'Zertifizierungsverifizierung (falls zutreffend)',
            'Strukturierte Lieferverträge',
          ],
        },
        {
          step: 2,
          title: 'Erstinspektion',
          description: 'Qualitätskontrolle an Sammelstellen.',
          details: [
            'Visuelle und organoleptische Verifizierung',
            'Probenahme für Tests',
            'Ablehnung nicht konformer Lose',
          ],
        },
        {
          step: 3,
          title: 'Labortests',
          description: 'Umfassende Analyse durch akkreditierte Labore.',
          details: [
            'Physikalisch-chemische Tests',
            'Mikrobiologische Analyse',
            'Kontaminantenerkennung',
            'COA-Ausstellung',
          ],
        },
        {
          step: 4,
          title: 'Kontrollierte Lagerung',
          description: 'Lagerung unter optimalen Bedingungen.',
          details: [
            'Kontrollierte Temperatur und Luftfeuchtigkeit',
            'Los-Rückverfolgbarkeit',
            'Regelmäßige Inspektionen',
          ],
        },
        {
          step: 5,
          title: 'Vorversandverifizierung',
          description: 'Abschließende Inspektion vor dem Export.',
          details: [
            'Abschließende Qualitätsverifizierung',
            'Gewichts- und Verpackungskontrolle',
            'Drittinspektion (auf Anfrage)',
          ],
        },
        {
          step: 6,
          title: 'Dokumentation',
          description: 'Vollständiges Dokumentationspaket für Audit.',
          details: [
            'COA und Spec Sheets',
            'Ursprungszeugnisse',
            'Rückverfolgbarkeitsdokumente',
            'Versanddokumente gemäß Incoterm',
          ],
        },
      ],
    },
    compliancePack: {
      title: 'Compliance-Paket',
      subtitle: 'Vollständige Dokumentation für Audit und Due Diligence verfügbar.',
      documents: [
        { label: 'COA (Analysezertifikat)', note: 'Pro Los' },
        { label: 'Spec Sheet', note: 'Produktspezifikationen' },
        { label: 'Packliste', note: 'Verpackungsdetails' },
        { label: 'Ursprungszeugnis', note: 'Falls zutreffend' },
        { label: 'Los-Rückverfolgbarkeit', note: 'Chain-of-Custody' },
        { label: 'Versanddokumente', note: 'Gemäß Incoterm' },
        { label: 'Drittzertifikate', note: 'Auf Anfrage' },
      ],
      ctaDownload: 'Compliance-Paket erhalten',
      trustNote: 'Antwort innerhalb 24h • Unter NDA geteilt',
    },
    faq: {
      title: 'Häufig gestellte Fragen',
      items: [
        {
          question: 'Was stellen Sie für das Audit bereit?',
          answer: 'Wir stellen ein vollständiges Dokumentationspaket bereit, einschließlich COA, Spec Sheets, Ursprungszeugnissen, Rückverfolgbarkeitsdokumenten und Versanddokumenten gemäß Incoterm. Alle Dokumente sind auf Anfrage verfügbar und können unter NDA geteilt werden.',
        },
        {
          question: 'Können Sie Dokumentation unter NDA teilen?',
          answer: 'Ja, wir unterzeichnen Standard-NDAs, um vollständige Dokumentation zu teilen, einschließlich Laborberichten, Drittzertifikaten und detaillierten Rückverfolgbarkeitsdokumenten.',
        },
        {
          question: 'Wie verwalten Sie die Los-Rückverfolgbarkeit?',
          answer: 'Jedes Los wird von der Parzelle bis zum Container verfolgt, mit Dokumentation bei jedem Schritt: Sammlung, Lagerung, Verpackung, Versand. Die vollständige Chain-of-Custody ist auf Anfrage verfügbar.',
        },
        {
          question: 'Welche Labortests sind verfügbar?',
          answer: 'Wir führen vollständige physikalisch-chemische Tests, mikrobiologische Analysen und Kontaminantenerkennung durch akkreditierte Drittlabore durch. COAs werden für jedes Los bereitgestellt.',
        },
        {
          question: 'Welche Incoterms, Häfen und Lieferzeiten bieten Sie an?',
          answer: 'Wir arbeiten hauptsächlich FOB und CIF von den Häfen Douala und Kribi (Kamerun). Standard-Lieferzeiten: 4-6 Wochen je nach Ziel und Volumen. Spezifische Details werden im Angebot bereitgestellt.',
        },
        {
          question: 'Sind Sie EUDR-ready?',
          answer: 'Wir bereiten aktiv die EUDR-Compliance mit geolokalisierter Rückverfolgbarkeit und Due-Diligence-Dokumentation vor. Detaillierter Status und Fähigkeiten auf Anfrage verfügbar.',
        },
        {
          question: 'Bieten Sie Drittinspektionen an?',
          answer: 'Ja, wir können Vorversandinspektionen durch akkreditierte Drittorganisationen (SGS, Bureau Veritas, etc.) auf Käuferanfrage arrangieren. Kosten hängen vom Inspektionsumfang ab.',
        },
      ],
    },
    finalCTA: {
      title: 'Benötigen Sie ein COA oder Spec Sheet?',
      subtitle: 'Kontaktieren Sie uns, um vollständige Dokumentation zu erhalten und Ihre Compliance-Anforderungen zu besprechen.',
      ctaPrimary: 'Angebot anfordern',
      ctaSecondary: 'Kontaktieren Sie uns',
    },
  },
  ru: {
    hero: {
      title: 'Качество и соответствие',
      subtitle: 'Строгие стандарты и документация, готовая к аудиту, для каждой поставки.',
      badges: [
        { label: 'Документированная QA', icon: 'file-check' },
        { label: 'EUDR-ready', icon: 'shield' },
        { label: 'COA / Spec sheet', icon: 'file-text' },
        { label: 'NDA доступно', icon: 'lock' },
        { label: 'Ответ < 24ч', icon: 'clock' },
      ],
      trustMicrocopy: 'Документы доступны по запросу • Предоставляются под NDA при необходимости',
      ctaPrimary: 'Получить пакет соответствия',
      ctaSecondary: 'Посмотреть сертификаты',
    },
    certifications: {
      title: 'Наши сертификаты',
      subtitle: 'Сертифицированные возможности и документация доступны по запросу для аудита.',
      ctaRequest: 'Запросить полный список (NDA)',
    },
    standards: {
      title: 'Стандарты качества',
      subtitle: 'Международные стандарты применяются на каждом этапе цепочки поставок.',
      items: [
        {
          icon: Award,
          title: 'Стандарты классификации',
          description: 'Классификация согласно международным стандартам',
          bullets: [
            'Классификация по стандартам FCC/ICCO для какао',
            'Классификация по происхождению и качеству',
            'Отчеты о классификации доступны',
          ],
          proof: 'Отчеты по запросу',
        },
        {
          icon: FileCheck,
          title: 'Лабораторные испытания',
          description: 'Комплексный анализ аккредитованными сторонними лабораториями',
          bullets: [
            'Полные физико-химические тесты',
            'Микробиологический анализ',
            'Обнаружение загрязнителей и тяжелых металлов',
          ],
          proof: 'COA доступен по запросу',
        },
        {
          icon: ClipboardCheck,
          title: 'Предотгрузочная инспекция',
          description: 'Независимая проверка перед каждой поставкой',
          bullets: [
            'Инспекция третьей стороной (по запросу)',
            'Проверка качества, веса, упаковки',
            'Сертификат инспекции доступен',
          ],
          proof: 'Отчеты об инспекции по запросу',
        },
        {
          icon: CheckCircle2,
          title: 'Документация и отслеживаемость',
          description: 'Полная отслеживаемость от партии до поставки',
          bullets: [
            'Отслеживаемость участок → партия → контейнер',
            'Полная документация (COA, spec sheets)',
            'Chain-of-custody доступна',
          ],
          proof: 'Полный пакет документации',
        },
      ],
    },
    process: {
      title: 'Наш процесс QA',
      subtitle: 'Шесть шагов контроля качества для обеспечения соответствия.',
      steps: [
        {
          step: 1,
          title: 'Закупка и отбор',
          description: 'Партнерство с сертифицированными производителями и структурированными кооперативами.',
          details: [
            'Отбор производителей по критериям качества',
            'Проверка сертификации (если применимо)',
            'Структурированные контракты на поставку',
          ],
        },
        {
          step: 2,
          title: 'Первичная инспекция',
          description: 'Контроль качества в пунктах сбора.',
          details: [
            'Визуальная и органолептическая проверка',
            'Отбор проб для тестирования',
            'Отклонение несоответствующих партий',
          ],
        },
        {
          step: 3,
          title: 'Лабораторные испытания',
          description: 'Комплексный анализ аккредитованными лабораториями.',
          details: [
            'Физико-химические тесты',
            'Микробиологический анализ',
            'Обнаружение загрязнителей',
            'Выдача COA',
          ],
        },
        {
          step: 4,
          title: 'Контролируемое хранение',
          description: 'Складирование в оптимальных условиях.',
          details: [
            'Контролируемая температура и влажность',
            'Отслеживаемость партий',
            'Регулярные инспекции',
          ],
        },
        {
          step: 5,
          title: 'Предотгрузочная проверка',
          description: 'Окончательная инспекция перед экспортом.',
          details: [
            'Окончательная проверка качества',
            'Контроль веса и упаковки',
            'Инспекция третьей стороной (по запросу)',
          ],
        },
        {
          step: 6,
          title: 'Документация',
          description: 'Полный пакет документации для аудита.',
          details: [
            'COA и spec sheets',
            'Сертификаты происхождения',
            'Документы отслеживаемости',
            'Документы на отгрузку согласно Incoterm',
          ],
        },
      ],
    },
    compliancePack: {
      title: 'Пакет соответствия',
      subtitle: 'Полная документация доступна для аудита и должной осмотрительности.',
      documents: [
        { label: 'COA (Сертификат анализа)', note: 'На партию' },
        { label: 'Spec Sheet', note: 'Спецификации продукта' },
        { label: 'Упаковочный лист', note: 'Детали упаковки' },
        { label: 'Сертификат происхождения', note: 'Если применимо' },
        { label: 'Отслеживаемость партии', note: 'Chain-of-custody' },
        { label: 'Документы на отгрузку', note: 'Согласно Incoterm' },
        { label: 'Сертификаты третьих сторон', note: 'По запросу' },
      ],
      ctaDownload: 'Получить пакет соответствия',
      trustNote: 'Ответ в течение 24ч • Предоставляется под NDA',
    },
    faq: {
      title: 'Часто задаваемые вопросы',
      items: [
        {
          question: 'Что вы предоставляете для аудита?',
          answer: 'Мы предоставляем полный пакет документации, включая COA, spec sheets, сертификаты происхождения, документы отслеживаемости и документы на отгрузку согласно Incoterm. Все документы доступны по запросу и могут быть предоставлены под NDA.',
        },
        {
          question: 'Можете ли вы предоставить документацию под NDA?',
          answer: 'Да, мы подписываем стандартные NDA для предоставления полной документации, включая лабораторные отчеты, сертификаты третьих сторон и подробные документы отслеживаемости.',
        },
        {
          question: 'Как вы управляете отслеживаемостью партий?',
          answer: 'Каждая партия отслеживается от участка до контейнера, с документацией на каждом этапе: сбор, хранение, упаковка, отгрузка. Полная chain-of-custody доступна по запросу.',
        },
        {
          question: 'Какие лабораторные испытания доступны?',
          answer: 'Мы проводим полные физико-химические тесты, микробиологический анализ и обнаружение загрязнителей аккредитованными сторонними лабораториями. COA предоставляются для каждой партии.',
        },
        {
          question: 'Какие Incoterms, порты и сроки доставки вы предлагаете?',
          answer: 'Мы в основном работаем FOB и CIF из портов Дуала и Криби (Камерун). Стандартные сроки доставки: 4-6 недель в зависимости от пункта назначения и объема. Конкретные детали предоставляются в предложении.',
        },
        {
          question: 'Готовы ли вы к EUDR?',
          answer: 'Мы активно готовим соответствие EUDR с геолокализованной отслеживаемостью и документацией должной осмотрительности. Подробный статус и возможности доступны по запросу.',
        },
        {
          question: 'Предлагаете ли вы инспекции третьих сторон?',
          answer: 'Да, мы можем организовать предотгрузочные инспекции аккредитованными сторонними организациями (SGS, Bureau Veritas и т.д.) по запросу покупателя. Стоимость зависит от объема инспекции.',
        },
      ],
    },
    finalCTA: {
      title: 'Нужен COA или Spec Sheet?',
      subtitle: 'Свяжитесь с нами, чтобы получить полную документацию и обсудить ваши требования к соответствию.',
      ctaPrimary: 'Запросить предложение',
      ctaSecondary: 'Свяжитесь с нами',
    },
  },
};

// Fallback logic
export function getQualityContent(locale: Locale): QualityPageContent {
  return qualityPageContent[locale] || qualityPageContent.en;
}
