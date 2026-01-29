/**
 * Content data for the SEPACAM Partner Section
 */

import { Locale } from '@/types';
import { PartnerContent } from '@/types/partner-section';

export const sepacamSectionContent: Record<Locale, PartnerContent> = {
  fr: {
    partnerName: 'SEPACAM',
    relationship: 'Partenaire industriel / Co-fondateur Roger GWODOK',
    partnerUrl: '#',
    eyebrow: 'Partenaire transformation',
    title: 'Afrexia × SEPACAM',
    subtitle: 'Transformation locale, technologies modernes, montée en gamme industrielle.',
    bodyText: [
      'AFREXIA s\'est associé à SEPACAM pour exploiter conjointement une unité de transformation de cacao située à Édéa. Cette usine, récemment construite sous la direction de Roger GWODOK — co-fondateur d\'AFREXIA et Directeur Général de SEPACAM — représente un investissement de plus de 112 millions XAF et est équipée de technologies modernes permettant la transformation du cacao brut en produits à forte valeur ajoutée (pâte, beurre, tourteau).',
      'Grâce à ce partenariat, AFREXIA pourra orienter une partie des volumes de cacao collectés via son réseau de coopératives vers cette unité industrielle, consolidant ainsi sa montée en gamme tout en créant de la valeur localement, par la transformation sur place, l\'emploi et l\'impact économique durable au Cameroun.'
    ],
    keyFacts: [
      'Transformation cacao brut en produits à forte valeur ajoutée',
      'Investissement 112M+ XAF, technologies modernes',
      'Création d\'emplois & impact économique local'
    ],
    stats: [
      { label: 'Investissement', value: '112M+ XAF', icon: 'scale' },
      { label: 'Localisation', value: 'Édéa', icon: 'warehouse' },
      { label: 'Produits', value: 'Pâte, beurre, tourteau', icon: 'users' }
    ],
    primaryCTA: {
      label: 'Découvrir l\'usine',
      href: '/fr/solutions#transformation',
      external: false
    },
    secondaryCTA: {
      label: 'Voir l\'impact local',
      href: '/fr/solutions#impact',
      external: false
    },
    trustMicrocopy: 'Transformation locale • Emplois créés • Impact durable',
    images: [
      {
        src: '/assets/partners/sepacam-factory.jpg',
        alt: 'Usine SEPACAM - équipements de transformation du cacao',
        priority: false
      },
      {
        src: '/assets/partners/sepacam-building.jpg',
        alt: 'Infrastructure SEPACAM à Édéa',
        priority: false
      }
    ],
    photoCaption: 'Unité de transformation moderne à Édéa'
  },
  en: {
    partnerName: 'SEPACAM',
    relationship: 'Industrial partner / Co-founder Roger GWODOK',
    partnerUrl: '#',
    eyebrow: 'Processing partner',
    title: 'Afrexia × SEPACAM',
    subtitle: 'Local processing, modern technologies, industrial value upgrade.',
    bodyText: [
      'AFREXIA has partnered with SEPACAM to jointly operate a cocoa processing unit located in Édéa. This factory, recently built under the direction of Roger GWODOK — co-founder of AFREXIA and General Manager of SEPACAM — represents an investment of over 112 million XAF and is equipped with modern technologies enabling the transformation of raw cocoa into high-value-added products (paste, butter, cake).',
      'Through this partnership, AFREXIA can direct part of the cocoa volumes collected via its cooperative network to this industrial unit, thus consolidating its value upgrade while creating local value through on-site processing, employment, and sustainable economic impact in Cameroon.'
    ],
    keyFacts: [
      'Raw cocoa transformation into high-value products',
      '112M+ XAF investment, modern technologies',
      'Job creation & local economic impact'
    ],
    stats: [
      { label: 'Investment', value: '112M+ XAF', icon: 'scale' },
      { label: 'Location', value: 'Édéa', icon: 'warehouse' },
      { label: 'Products', value: 'Paste, butter, cake', icon: 'users' }
    ],
    primaryCTA: {
      label: 'Discover the factory',
      href: '/en/solutions#transformation',
      external: false
    },
    secondaryCTA: {
      label: 'View local impact',
      href: '/en/solutions#impact',
      external: false
    },
    trustMicrocopy: 'Local processing • Jobs created • Sustainable impact',
    images: [
      {
        src: '/assets/partners/sepacam-factory.jpg',
        alt: 'SEPACAM factory - cocoa processing equipment',
        priority: false
      },
      {
        src: '/assets/partners/sepacam-building.jpg',
        alt: 'SEPACAM infrastructure in Édéa',
        priority: false
      }
    ],
    photoCaption: 'Modern processing unit in Édéa'
  },
  es: {
    partnerName: 'SEPACAM',
    relationship: 'Socio industrial / Cofundador Roger GWODOK',
    partnerUrl: '#',
    eyebrow: 'Socio de procesamiento',
    title: 'Afrexia × SEPACAM',
    subtitle: 'Procesamiento local, tecnologías modernas, mejora del valor industrial.',
    bodyText: [
      'AFREXIA se ha asociado con SEPACAM para operar conjuntamente una unidad de procesamiento de cacao ubicada en Édéa. Esta fábrica, recientemente construida bajo la dirección de Roger GWODOK — cofundador de AFREXIA y Director General de SEPACAM — representa una inversión de más de 112 millones de XAF y está equipada con tecnologías modernas que permiten la transformación del cacao crudo en productos de alto valor agregado (pasta, manteca, torta).',
      'A través de esta asociación, AFREXIA puede dirigir parte de los volúmenes de cacao recolectados a través de su red de cooperativas a esta unidad industrial, consolidando así su mejora de valor mientras crea valor local a través del procesamiento in situ, empleo e impacto económico sostenible en Camerún.'
    ],
    keyFacts: [
      'Transformación de cacao crudo en productos de alto valor',
      'Inversión de 112M+ XAF, tecnologías modernas',
      'Creación de empleo e impacto económico local'
    ],
    stats: [
      { label: 'Inversión', value: '112M+ XAF', icon: 'scale' },
      { label: 'Ubicación', value: 'Édéa', icon: 'warehouse' },
      { label: 'Productos', value: 'Pasta, manteca, torta', icon: 'users' }
    ],
    primaryCTA: {
      label: 'Descubrir la fábrica',
      href: '/es/solutions#transformation',
      external: false
    },
    secondaryCTA: {
      label: 'Ver impacto local',
      href: '/es/solutions#impact',
      external: false
    },
    trustMicrocopy: 'Procesamiento local • Empleos creados • Impacto sostenible',
    images: [
      {
        src: '/assets/partners/sepacam-factory.jpg',
        alt: 'Fábrica SEPACAM - equipos de procesamiento de cacao',
        priority: false
      },
      {
        src: '/assets/partners/sepacam-building.jpg',
        alt: 'Infraestructura SEPACAM en Édéa',
        priority: false
      }
    ],
    photoCaption: 'Unidad de procesamiento moderna en Édéa'
  },
  de: {
    partnerName: 'SEPACAM',
    relationship: 'Industriepartner / Mitbegründer Roger GWODOK',
    partnerUrl: '#',
    eyebrow: 'Verarbeitungspartner',
    title: 'Afrexia × SEPACAM',
    subtitle: 'Lokale Verarbeitung, moderne Technologien, industrielle Wertsteigerung.',
    bodyText: [
      'AFREXIA hat sich mit SEPACAM zusammengeschlossen, um gemeinsam eine Kakao-Verarbeitungseinheit in Édéa zu betreiben. Diese Fabrik, die kürzlich unter der Leitung von Roger GWODOK — Mitbegründer von AFREXIA und Geschäftsführer von SEPACAM — gebaut wurde, stellt eine Investition von über 112 Millionen XAF dar und ist mit modernen Technologien ausgestattet, die die Umwandlung von Rohkakao in hochwertige Produkte (Paste, Butter, Kuchen) ermöglichen.',
      'Durch diese Partnerschaft kann AFREXIA einen Teil der über sein Kooperativennetzwerk gesammelten Kakaovolumen an diese Industrieeinheit leiten und so seine Wertsteigerung konsolidieren, während gleichzeitig lokaler Wert durch Vor-Ort-Verarbeitung, Beschäftigung und nachhaltige wirtschaftliche Auswirkungen in Kamerun geschaffen wird.'
    ],
    keyFacts: [
      'Umwandlung von Rohkakao in hochwertige Produkte',
      'Investition von 112M+ XAF, moderne Technologien',
      'Schaffung von Arbeitsplätzen und lokale wirtschaftliche Auswirkungen'
    ],
    stats: [
      { label: 'Investition', value: '112M+ XAF', icon: 'scale' },
      { label: 'Standort', value: 'Édéa', icon: 'warehouse' },
      { label: 'Produkte', value: 'Paste, Butter, Kuchen', icon: 'users' }
    ],
    primaryCTA: {
      label: 'Fabrik entdecken',
      href: '/de/solutions#transformation',
      external: false
    },
    secondaryCTA: {
      label: 'Lokale Auswirkungen ansehen',
      href: '/de/solutions#impact',
      external: false
    },
    trustMicrocopy: 'Lokale Verarbeitung • Geschaffene Arbeitsplätze • Nachhaltige Auswirkungen',
    images: [
      {
        src: '/assets/partners/sepacam-factory.jpg',
        alt: 'SEPACAM-Fabrik - Kakao-Verarbeitungsausrüstung',
        priority: false
      },
      {
        src: '/assets/partners/sepacam-building.jpg',
        alt: 'SEPACAM-Infrastruktur in Édéa',
        priority: false
      }
    ],
    photoCaption: 'Moderne Verarbeitungseinheit in Édéa'
  },
  ru: {
    partnerName: 'SEPACAM',
    relationship: 'Промышленный партнер / Соучредитель Roger GWODOK',
    partnerUrl: '#',
    eyebrow: 'Партнер по переработке',
    title: 'Afrexia × SEPACAM',
    subtitle: 'Местная переработка, современные технологии, промышленное повышение ценности.',
    bodyText: [
      'AFREXIA заключила партнерство с SEPACAM для совместной эксплуатации предприятия по переработке какао, расположенного в Эдеа. Этот завод, недавно построенный под руководством Роже ГВОДОКА — соучредителя AFREXIA и генерального директора SEPACAM — представляет собой инвестицию более 112 миллионов франков КФА и оснащен современными технологиями, позволяющими перерабатывать сырое какао в продукты с высокой добавленной стоимостью (паста, масло, жмых).',
      'Благодаря этому партнерству AFREXIA может направлять часть объемов какао, собранных через свою сеть кооперативов, на это промышленное предприятие, тем самым укрепляя свое повышение ценности, создавая при этом местную ценность через переработку на месте, занятость и устойчивое экономическое воздействие в Камеруне.'
    ],
    keyFacts: [
      'Переработка сырого какао в продукты высокой ценности',
      'Инвестиции 112M+ XAF, современные технологии',
      'Создание рабочих мест и местное экономическое воздействие'
    ],
    stats: [
      { label: 'Инвестиции', value: '112M+ XAF', icon: 'scale' },
      { label: 'Местоположение', value: 'Эдеа', icon: 'warehouse' },
      { label: 'Продукты', value: 'Паста, масло, жмых', icon: 'users' }
    ],
    primaryCTA: {
      label: 'Узнать о заводе',
      href: '/ru/solutions#transformation',
      external: false
    },
    secondaryCTA: {
      label: 'Посмотреть местное воздействие',
      href: '/ru/solutions#impact',
      external: false
    },
    trustMicrocopy: 'Местная переработка • Созданные рабочие места • Устойчивое воздействие',
    images: [
      {
        src: '/assets/partners/sepacam-factory.jpg',
        alt: 'Завод SEPACAM - оборудование для переработки какао',
        priority: false
      },
      {
        src: '/assets/partners/sepacam-building.jpg',
        alt: 'Инфраструктура SEPACAM в Эдеа',
        priority: false
      }
    ],
    photoCaption: 'Современное предприятие по переработке в Эдеа'
  }
};
