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
 * - 4.2: Title "Afrexia × SCPB SARL"
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
    title: 'Afrexia × SCPB SARL',
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
    title: 'Afrexia × SCPB SARL',
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
  es: {
    partnerName: 'SCPB SARL',
    relationship: 'Socio estratégico / filial de Afrexia',
    partnerUrl: 'https://ste-scpb.com',
    eyebrow: 'Socio operacional',
    title: 'Afrexia × SCPB SARL',
    subtitle: 'Fuerte presencia local, estándares internacionales, ejecución lista para auditoría.',
    bodyText: [
      'SCPB SARL gestiona la recolección, almacenamiento y preparación de exportación de nuestros productos directamente en origen. Esta presencia local garantiza un control de calidad riguroso y una trazabilidad completa desde la granja hasta el puerto. Nuestros equipos sobre el terreno supervisan cada paso del proceso, desde la recepción de materias primas hasta la preparación del envío final.',
      'Como socio estratégico de Afrexia, SCPB aplica los mismos estándares de calidad y cumplimiento, con documentación completa que incluye Certificados de Análisis y hojas de especificaciones, además de preparación lista para EUDR para todos los envíos. Esta integración operativa permite una capacidad de respuesta óptima y transparencia total en toda la cadena de suministro.'
    ],
    keyFacts: [
      'Recolección, almacenamiento y preparación de exportación',
      'Control de calidad y documentación (COA / Hojas de especificaciones)',
      'Trazabilidad y cumplimiento listo para EUDR'
    ],
    stats: [
      { label: 'Red de productores', value: '+2000', icon: 'users' },
      { label: 'Capacidad anual', value: '20,000 t', icon: 'scale' },
      { label: 'Infraestructura', value: '5 sitios', icon: 'warehouse' }
    ],
    primaryCTA: {
      label: 'Descubrir SCPB SARL',
      href: 'https://ste-scpb.com',
      external: true
    },
    secondaryCTA: {
      label: 'Ver nuestras capacidades de ejecución',
      href: '/es/solutions#impact',
      external: false
    },
    trustMicrocopy: 'Respuesta en 24h • NDA estándar • Archivos QA bajo solicitud',
    images: [
      {
        src: '/assets/partners/scpb-quality-control.jpg',
        alt: 'Control de calidad SCPB - inspección de granos de cacao',
        priority: true
      },
      {
        src: '/assets/partners/scpb-warehouse.jpg',
        alt: 'Infraestructura de almacenamiento SCPB',
        priority: false
      }
    ],
    photoCaption: 'Control de calidad y trazabilidad en sitio'
  },
  de: {
    partnerName: 'SCPB SARL',
    relationship: 'Strategischer Partner / Afrexia-Tochtergesellschaft',
    partnerUrl: 'https://ste-scpb.com',
    eyebrow: 'Operativer Partner',
    title: 'Afrexia × SCPB SARL',
    subtitle: 'Starke lokale Präsenz, internationale Standards, prüfungsbereite Ausführung.',
    bodyText: [
      'SCPB SARL übernimmt die Sammlung, Lagerung und Exportvorbereitung unserer Produkte direkt an der Quelle. Diese lokale Präsenz gewährleistet eine strenge Qualitätskontrolle und vollständige Rückverfolgbarkeit vom Bauernhof bis zum Hafen. Unsere Teams vor Ort überwachen jeden Schritt des Prozesses, von der Rohstoffannahme über die Qualitätsprüfung bis zur endgültigen Versandvorbereitung.',
      'Als strategischer Partner von Afrexia wendet SCPB die gleichen Qualitäts- und Compliance-Standards an, mit vollständiger Dokumentation einschließlich Analysezertifikaten und Spezifikationsblättern sowie EUDR-bereiter Vorbereitung für alle Sendungen. Diese operative Integration ermöglicht optimale Reaktionsfähigkeit und vollständige Transparenz über die gesamte Lieferkette.'
    ],
    keyFacts: [
      'Sammlung, Lagerung und Exportvorbereitung',
      'Qualitätskontrolle und Dokumentation (COA / Spezifikationsblätter)',
      'Rückverfolgbarkeit und EUDR-bereite Compliance'
    ],
    stats: [
      { label: 'Produzentennetzwerk', value: '+2000', icon: 'users' },
      { label: 'Jahreskapazität', value: '20.000 t', icon: 'scale' },
      { label: 'Infrastruktur', value: '5 Standorte', icon: 'warehouse' }
    ],
    primaryCTA: {
      label: 'SCPB SARL entdecken',
      href: 'https://ste-scpb.com',
      external: true
    },
    secondaryCTA: {
      label: 'Unsere Ausführungsfähigkeiten ansehen',
      href: '/de/solutions#impact',
      external: false
    },
    trustMicrocopy: '24h Antwort • Standard-NDA • QA-Dateien auf Anfrage',
    images: [
      {
        src: '/assets/partners/scpb-quality-control.jpg',
        alt: 'SCPB Qualitätskontrolle - Kakaobohneninspektion',
        priority: true
      },
      {
        src: '/assets/partners/scpb-warehouse.jpg',
        alt: 'SCPB Lagerinfrastruktur',
        priority: false
      }
    ],
    photoCaption: 'Qualitätskontrolle und Rückverfolgbarkeit vor Ort'
  },
  ru: {
    partnerName: 'SCPB SARL',
    relationship: 'Стратегический партнер / дочерняя компания Afrexia',
    partnerUrl: 'https://ste-scpb.com',
    eyebrow: 'Операционный партнер',
    title: 'Afrexia × SCPB SARL',
    subtitle: 'Сильное местное присутствие, международные стандарты, готовность к аудиту.',
    bodyText: [
      'SCPB SARL занимается сбором, хранением и подготовкой к экспорту наших продуктов непосредственно у источника. Это местное присутствие обеспечивает строгий контроль качества и полную отслеживаемость от фермы до порта. Наши команды на местах контролируют каждый этап процесса, от приема сырья через контроль качества до окончательной подготовки к отправке.',
      'Как стратегический партнер Afrexia, SCPB применяет те же стандарты качества и соответствия, с полной документацией, включая сертификаты анализа и спецификации, а также подготовку в соответствии с EUDR для всех отправлений. Эта операционная интеграция обеспечивает оптимальную оперативность и полную прозрачность по всей цепочке поставок.'
    ],
    keyFacts: [
      'Сбор, хранение и подготовка к экспорту',
      'Контроль качества и документация (COA / Спецификации)',
      'Отслеживаемость и соответствие EUDR'
    ],
    stats: [
      { label: 'Сеть производителей', value: '+2000', icon: 'users' },
      { label: 'Годовая мощность', value: '20 000 т', icon: 'scale' },
      { label: 'Инфраструктура', value: '5 объектов', icon: 'warehouse' }
    ],
    primaryCTA: {
      label: 'Узнать о SCPB SARL',
      href: 'https://ste-scpb.com',
      external: true
    },
    secondaryCTA: {
      label: 'Посмотреть наши возможности',
      href: '/ru/solutions#impact',
      external: false
    },
    trustMicrocopy: 'Ответ в течение 24ч • Стандартное NDA • Файлы QA по запросу',
    images: [
      {
        src: '/assets/partners/scpb-quality-control.jpg',
        alt: 'Контроль качества SCPB - инспекция какао-бобов',
        priority: true
      },
      {
        src: '/assets/partners/scpb-warehouse.jpg',
        alt: 'Складская инфраструктура SCPB',
        priority: false
      }
    ],
    photoCaption: 'Контроль качества и отслеживаемость на месте'
  }
};
