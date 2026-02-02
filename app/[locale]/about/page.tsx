import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Locale } from '@/types';
import { Award, Eye, Leaf, Handshake, Building2, Users, Target, TrendingUp } from 'lucide-react';
import { ScrollRevealWrapper } from '@/app/[locale]/about/ScrollRevealWrapper';

interface AboutPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export const metadata: Metadata = {
  title: 'À Propos | Afrexia',
  description: 'Votre partenaire de confiance pour l\'export de produits agricoles africains premium.',
};

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;

  // Content translations
  const content: Record<string, any> = {
    fr: {
      hero: {
        title: 'À Propos d\'Afrexia',
        subtitle: 'Votre partenaire de confiance pour l\'export de produits agricoles africains premium.',
        badges: ['Basés à Douala', 'Réseau producteurs', 'Export B2B'],
      },
      intro: {
        title: 'Qui sommes-nous ?',
        paragraphs: [
          'AFREXIA est une entreprise camerounaise engagée dans le négoce structuré, la transformation locale et l\'exportation de commodités agricoles à forte valeur ajoutée.',
          'S\'appuyant sur un réseau de plus de 2 000 coopératives partenaires à travers le pays, AFREXIA mobilise chaque année plusieurs milliers de tonnes de café, cacao, poivre, huiles et autres produits tropicaux, répondant aux standards de qualité et de traçabilité exigés par les marchés internationaux.',
          'Son modèle intègre toute la chaîne de valeur : de la collecte à la transformation industrielle, jusqu\'à la logistique d\'exportation, afin d\'offrir à ses clients une solution professionnelle, fiable et transparente.',
          'À travers une approche contractuelle rigoureuse et une présence active sur le terrain, AFREXIA ambitionne de repositionner le Cameroun comme un acteur de référence dans le commerce agro-industriel africain.',
        ],
        stats: [
          { value: '2 000+', label: 'Coopératives partenaires' },
          { value: 'Milliers', label: 'Tonnes mobilisées/an' },
          { value: '100%', label: 'Traçabilité garantie' },
        ],
      },
      bridge: {
        title: 'Afrexia bâtit des ponts entre producteurs africains et marchés mondiaux',
        paragraphs: [
          'Afrexia est une entreprise émergente fondée au Cameroun, qui déploie ses premières opérations dans le domaine du négoce, de l\'intermédiation et de la valorisation des matières premières agricoles et forestières locales.',
          'Notre vision est panafricaine, mais notre ancrage initial repose sur les richesses et les savoir-faire du terroir camerounais.',
          'Nous mettons en relation producteurs, coopératives et acheteurs internationaux grâce à un modèle d\'opérateur intégré, traçable et responsable, centré sur la performance, l\'impact local et la transparence commerciale.',
          'Notre mission est de valoriser les ressources agricoles camerounaises et africaines, structurer les filières et garantir un accès équitable et rentable aux marchés mondiaux.',
        ],
      },
      commitment: {
        title: 'Notre engagement envers les producteurs',
        paragraphs: [
          'AFREXIA maximise la valeur des productions locales en connectant les producteurs à des acheteurs solvables, des marchés rentables et des chaînes d\'exportation sécurisées, dans une logique de performance économique partagée.',
          'Tout en optimisant leur rentabilité, nous veillons à préserver leurs intérêts à chaque étape de la chaîne de valeur.',
        ],
      },
      story: {
        title: 'Notre Histoire',
        content: 'Afrexia est née de la volonté de connecter les producteurs africains aux marchés internationaux avec transparence et qualité. Nous structurons la chaîne d\'approvisionnement de la ferme au port, en garantissant traçabilité, conformité et documentation audit-ready.',
      },
      mission: {
        title: 'Notre Mission',
        content: 'Faciliter l\'export de commodités agricoles africaines en offrant sourcing terrain, contrôle qualité, conformité RDUE et logistique intégrée. Nous garantissons des produits premium avec documentation complète pour sécuriser vos expéditions.',
      },
      values: {
        title: 'Nos Valeurs',
        items: [
          {
            title: 'Excellence Qualité',
            description: 'Standards rigoureux • COA • Inspections • Traçabilité lot',
          },
          {
            title: 'Transparence',
            description: 'Traçabilité complète • Documentation • Preuves géolocalisées',
          },
          {
            title: 'Durabilité',
            description: 'Pratiques responsables • Conformité RDUE • Impact social',
          },
          {
            title: 'Partenariat',
            description: 'Relations long terme • Confiance • Réactivité <24h',
          },
        ],
      },
      approach: {
        title: 'Notre Approche',
        subtitle: 'De la ferme au port, une chaîne maîtrisée',
        steps: [
          {
            title: 'Sourcing Terrain',
            description: 'Réseau producteurs et coopératives • Sélection rigoureuse • Vérification origine',
          },
          {
            title: 'Contrôle Qualité',
            description: 'Inspections • Analyses • COA • Documentation QA complète',
          },
          {
            title: 'Conformité & Traçabilité',
            description: 'Documentation RDUE • Géolocalisation • Chaîne de traçabilité • Audit-ready',
          },
          {
            title: 'Logistique Export',
            description: 'Entreposage • Conteneurisation • Incoterms FOB/CIF/DAP • Gestion expéditions',
          },
        ],
      },
      cta: {
        title: 'Parlons de votre projet',
        subtitle: 'Volumes, spécifications, destination, niveau de preuve documentaire',
        primary: 'Demander un Devis',
        secondary: 'Nous Contacter',
      },
    },
    en: {
      hero: {
        title: 'About Afrexia',
        subtitle: 'Your trusted partner for premium African agricultural commodity exports.',
        badges: ['Based in Douala', 'Producer network', 'B2B Export'],
      },
      intro: {
        title: 'Who We Are',
        paragraphs: [
          'AFREXIA is a Cameroonian company engaged in structured trading, local processing and export of high value-added agricultural commodities.',
          'Relying on a network of more than 2,000 partner cooperatives across the country, AFREXIA mobilizes several thousand tons of coffee, cocoa, pepper, oils and other tropical products each year, meeting the quality and traceability standards required by international markets.',
          'Its model integrates the entire value chain: from collection to industrial processing, to export logistics, in order to offer its customers a professional, reliable and transparent solution.',
          'Through a rigorous contractual approach and an active presence in the field, AFREXIA aims to reposition Cameroon as a reference player in African agro-industrial trade.',
        ],
        stats: [
          { value: '2,000+', label: 'Partner cooperatives' },
          { value: 'Thousands', label: 'Tons mobilized/year' },
          { value: '100%', label: 'Guaranteed traceability' },
        ],
      },
      bridge: {
        title: 'Afrexia builds bridges between African producers and global markets',
        paragraphs: [
          'Afrexia is an emerging company founded in Cameroon, deploying its first operations in the trading, intermediation and valorization of local agricultural and forestry raw materials.',
          'Our vision is pan-African, but our initial foundation rests on the wealth and expertise of Cameroonian terroir.',
          'We connect producers, cooperatives and international buyers through an integrated, traceable and responsible operator model, focused on performance, local impact and commercial transparency.',
          'Our mission is to valorize Cameroonian and African agricultural resources, structure supply chains and guarantee equitable and profitable access to global markets.',
        ],
      },
      commitment: {
        title: 'Our commitment to producers',
        paragraphs: [
          'AFREXIA maximizes the value of local productions by connecting producers to solvent buyers, profitable markets and secure export chains, in a logic of shared economic performance.',
          'While optimizing their profitability, we ensure to preserve their interests at every stage of the value chain.',
        ],
      },
      story: {
        title: 'Our Story',
        content: 'Afrexia was born from the desire to connect African producers to international markets with transparency and quality. We structure the supply chain from farm to port, ensuring traceability, compliance and audit-ready documentation.',
      },
      mission: {
        title: 'Our Mission',
        content: 'Facilitate the export of African agricultural commodities by offering field sourcing, quality control, EUDR compliance and integrated logistics. We guarantee premium products with complete documentation to secure your shipments.',
      },
      values: {
        title: 'Our Values',
        items: [
          {
            title: 'Quality Excellence',
            description: 'Rigorous standards • COA • Inspections • Lot traceability',
          },
          {
            title: 'Transparency',
            description: 'Complete traceability • Documentation • Geolocated evidence',
          },
          {
            title: 'Sustainability',
            description: 'Responsible practices • EUDR compliance • Social impact',
          },
          {
            title: 'Partnership',
            description: 'Long-term relationships • Trust • <24h responsiveness',
          },
        ],
      },
      approach: {
        title: 'Our Approach',
        subtitle: 'From farm to port, a controlled chain',
        steps: [
          {
            title: 'Field Sourcing',
            description: 'Producer and cooperative network • Rigorous selection • Origin verification',
          },
          {
            title: 'Quality Control',
            description: 'Inspections • Analysis • COA • Complete QA documentation',
          },
          {
            title: 'Compliance & Traceability',
            description: 'EUDR documentation • Geolocation • Traceability chain • Audit-ready',
          },
          {
            title: 'Export Logistics',
            description: 'Warehousing • Containerization • Incoterms FOB/CIF/DAP • Shipment management',
          },
        ],
      },
      cta: {
        title: 'Let\'s discuss your project',
        subtitle: 'Volumes, specifications, destination, documentation requirements',
        primary: 'Request a Quote',
        secondary: 'Contact Us',
      },
    },
    es: {
      hero: {
        title: 'Acerca de Afrexia',
        subtitle: 'Su socio de confianza para la exportación de productos agrícolas africanos premium.',
        badges: ['Con sede en Douala', 'Red de productores', 'Exportación B2B'],
      },
      intro: {
        title: '¿Quiénes somos?',
        paragraphs: [
          'AFREXIA es una empresa camerunesa dedicada al comercio estructurado, la transformación local y la exportación de productos agrícolas de alto valor añadido.',
          'Apoyándose en una red de más de 2.000 cooperativas asociadas en todo el país, AFREXIA moviliza cada año varios miles de toneladas de café, cacao, pimienta, aceites y otros productos tropicales, cumpliendo con los estándares de calidad y trazabilidad exigidos por los mercados internacionales.',
          'Su modelo integra toda la cadena de valor: desde la recolección hasta la transformación industrial y la logística de exportación, para ofrecer a sus clientes una solución profesional, fiable y transparente.',
          'A través de un enfoque contractual riguroso y una presencia activa sobre el terreno, AFREXIA aspira a reposicionar Camerún como actor de referencia en el comercio agroindustrial africano.',
        ],
        stats: [
          { value: '2.000+', label: 'Cooperativas asociadas' },
          { value: 'Miles', label: 'Toneladas movilizadas/año' },
          { value: '100%', label: 'Trazabilidad garantizada' },
        ],
      },
      bridge: {
        title: 'Afrexia construye puentes entre productores africanos y mercados globales',
        paragraphs: [
          'Afrexia es una empresa emergente fundada en Camerún, que despliega sus primeras operaciones en el ámbito del comercio, la intermediación y la valorización de materias primas agrícolas y forestales locales.',
          'Nuestra visión es panafricana, pero nuestro anclaje inicial se basa en las riquezas y el saber hacer del territorio camerunés.',
          'Conectamos productores, cooperativas y compradores internacionales mediante un modelo de operador integrado, trazable y responsable, centrado en el rendimiento, el impacto local y la transparencia comercial.',
          'Nuestra misión es valorizar los recursos agrícolas cameruneses y africanos, estructurar las cadenas de suministro y garantizar un acceso equitativo y rentable a los mercados globales.',
        ],
      },
      commitment: {
        title: 'Nuestro compromiso con los productores',
        paragraphs: [
          'AFREXIA maximiza el valor de las producciones locales conectando a los productores con compradores solventes, mercados rentables y cadenas de exportación seguras, en una lógica de rendimiento económico compartido.',
          'Al optimizar su rentabilidad, velamos por preservar sus intereses en cada etapa de la cadena de valor.',
        ],
      },
      story: {
        title: 'Nuestra Historia',
        content: 'Afrexia nació del deseo de conectar a los productores africanos con los mercados internacionales con transparencia y calidad. Estructuramos la cadena de suministro de la granja al puerto, garantizando trazabilidad, cumplimiento y documentación lista para auditoría.',
      },
      mission: {
        title: 'Nuestra Misión',
        content: 'Facilitar la exportación de productos agrícolas africanos ofreciendo abastecimiento en campo, control de calidad, cumplimiento EUDR y logística integrada. Garantizamos productos premium con documentación completa para asegurar sus envíos.',
      },
      values: {
        title: 'Nuestros Valores',
        items: [
          {
            title: 'Excelencia en Calidad',
            description: 'Estándares rigurosos • COA • Inspecciones • Trazabilidad por lote',
          },
          {
            title: 'Transparencia',
            description: 'Trazabilidad completa • Documentación • Pruebas geolocalizadas',
          },
          {
            title: 'Sostenibilidad',
            description: 'Prácticas responsables • Cumplimiento EUDR • Impacto social',
          },
          {
            title: 'Asociación',
            description: 'Relaciones a largo plazo • Confianza • Respuesta <24h',
          },
        ],
      },
      approach: {
        title: 'Nuestro Enfoque',
        subtitle: 'De la granja al puerto, una cadena controlada',
        steps: [
          {
            title: 'Abastecimiento en Campo',
            description: 'Red de productores y cooperativas • Selección rigurosa • Verificación de origen',
          },
          {
            title: 'Control de Calidad',
            description: 'Inspecciones • Análisis • COA • Documentación QA completa',
          },
          {
            title: 'Cumplimiento y Trazabilidad',
            description: 'Documentación EUDR • Geolocalización • Cadena de trazabilidad • Lista para auditoría',
          },
          {
            title: 'Logística de Exportación',
            description: 'Almacenamiento • Contenedorización • Incoterms FOB/CIF/DAP • Gestión de envíos',
          },
        ],
      },
      cta: {
        title: 'Hablemos de su proyecto',
        subtitle: 'Volúmenes, especificaciones, destino, requisitos de documentación',
        primary: 'Solicitar Cotización',
        secondary: 'Contáctenos',
      },
    },
    de: {
      hero: {
        title: 'Über Afrexia',
        subtitle: 'Ihr vertrauenswürdiger Partner für den Export hochwertiger afrikanischer Agrarprodukte.',
        badges: ['Sitz in Douala', 'Produzentennetzwerk', 'B2B-Export'],
      },
      intro: {
        title: 'Wer sind wir?',
        paragraphs: [
          'AFREXIA ist ein kamerunisches Unternehmen, das sich dem strukturierten Handel, der lokalen Verarbeitung und dem Export hochwertiger landwirtschaftlicher Rohstoffe widmet.',
          'Gestützt auf ein Netzwerk von über 2.000 Partnergenossenschaften im ganzen Land, mobilisiert AFREXIA jährlich mehrere tausend Tonnen Kaffee, Kakao, Pfeffer, Öle und andere tropische Produkte und erfüllt dabei die von internationalen Märkten geforderten Qualitäts- und Rückverfolgbarkeitsstandards.',
          'Sein Modell integriert die gesamte Wertschöpfungskette: von der Sammlung über die industrielle Verarbeitung bis zur Exportlogistik, um seinen Kunden eine professionelle, zuverlässige und transparente Lösung zu bieten.',
          'Durch einen strengen vertraglichen Ansatz und eine aktive Präsenz vor Ort strebt AFREXIA an, Kamerun als führenden Akteur im afrikanischen Agrar-Industriehandel zu positionieren.',
        ],
        stats: [
          { value: '2.000+', label: 'Partnergenossenschaften' },
          { value: 'Tausende', label: 'Tonnen mobilisiert/Jahr' },
          { value: '100%', label: 'Garantierte Rückverfolgbarkeit' },
        ],
      },
      bridge: {
        title: 'Afrexia baut Brücken zwischen afrikanischen Produzenten und globalen Märkten',
        paragraphs: [
          'Afrexia ist ein aufstrebendes Unternehmen mit Sitz in Kamerun, das seine ersten Operationen im Bereich Handel, Vermittlung und Verwertung lokaler land- und forstwirtschaftlicher Rohstoffe durchführt.',
          'Unsere Vision ist panafrikanisch, aber unsere anfängliche Verankerung basiert auf dem Reichtum und Know-how des kamerunischen Terroirs.',
          'Wir verbinden Produzenten, Genossenschaften und internationale Käufer durch ein integriertes, rückverfolgbares und verantwortungsvolles Betreibermodell, das sich auf Leistung, lokale Auswirkungen und kommerzielle Transparenz konzentriert.',
          'Unsere Mission ist es, kamerunische und afrikanische landwirtschaftliche Ressourcen zu verwerten, Lieferketten zu strukturieren und einen gerechten und profitablen Zugang zu globalen Märkten zu gewährleisten.',
        ],
      },
      commitment: {
        title: 'Unser Engagement für Produzenten',
        paragraphs: [
          'AFREXIA maximiert den Wert lokaler Produktionen, indem es Produzenten mit zahlungsfähigen Käufern, profitablen Märkten und sicheren Exportketten verbindet, in einer Logik gemeinsamer wirtschaftlicher Leistung.',
          'Während wir ihre Rentabilität optimieren, achten wir darauf, ihre Interessen in jeder Phase der Wertschöpfungskette zu wahren.',
        ],
      },
      story: {
        title: 'Unsere Geschichte',
        content: 'Afrexia entstand aus dem Wunsch, afrikanische Produzenten mit internationalen Märkten transparent und qualitativ hochwertig zu verbinden. Wir strukturieren die Lieferkette vom Bauernhof zum Hafen und garantieren Rückverfolgbarkeit, Compliance und prüfungsbereite Dokumentation.',
      },
      mission: {
        title: 'Unsere Mission',
        content: 'Erleichterung des Exports afrikanischer Agrarprodukte durch Feldbeschaffung, Qualitätskontrolle, EUDR-Compliance und integrierte Logistik. Wir garantieren Premium-Produkte mit vollständiger Dokumentation zur Sicherung Ihrer Sendungen.',
      },
      values: {
        title: 'Unsere Werte',
        items: [
          {
            title: 'Qualitätsexzellenz',
            description: 'Strenge Standards • COA • Inspektionen • Chargenrückverfolgbarkeit',
          },
          {
            title: 'Transparenz',
            description: 'Vollständige Rückverfolgbarkeit • Dokumentation • Geolokalisierte Nachweise',
          },
          {
            title: 'Nachhaltigkeit',
            description: 'Verantwortungsvolle Praktiken • EUDR-Compliance • Soziale Auswirkungen',
          },
          {
            title: 'Partnerschaft',
            description: 'Langfristige Beziehungen • Vertrauen • <24h Reaktionszeit',
          },
        ],
      },
      approach: {
        title: 'Unser Ansatz',
        subtitle: 'Vom Bauernhof zum Hafen, eine kontrollierte Kette',
        steps: [
          {
            title: 'Feldbeschaffung',
            description: 'Produzenten- und Genossenschaftsnetzwerk • Strenge Auswahl • Herkunftsüberprüfung',
          },
          {
            title: 'Qualitätskontrolle',
            description: 'Inspektionen • Analysen • COA • Vollständige QA-Dokumentation',
          },
          {
            title: 'Compliance & Rückverfolgbarkeit',
            description: 'EUDR-Dokumentation • Geolokalisierung • Rückverfolgbarkeitskette • Prüfungsbereit',
          },
          {
            title: 'Exportlogistik',
            description: 'Lagerung • Containerisierung • Incoterms FOB/CIF/DAP • Sendungsverwaltung',
          },
        ],
      },
      cta: {
        title: 'Lassen Sie uns über Ihr Projekt sprechen',
        subtitle: 'Volumen, Spezifikationen, Ziel, Dokumentationsanforderungen',
        primary: 'Angebot Anfordern',
        secondary: 'Kontaktieren Sie Uns',
      },
    },
    ru: {
      hero: {
        title: 'О компании Afrexia',
        subtitle: 'Ваш надежный партнер по экспорту премиальной африканской сельскохозяйственной продукции.',
        badges: ['Офис в Дуале', 'Сеть производителей', 'B2B экспорт'],
      },
      intro: {
        title: 'Кто мы?',
        paragraphs: [
          'AFREXIA — камерунская компания, занимающаяся структурированной торговлей, местной переработкой и экспортом высококачественных сельскохозяйственных товаров.',
          'Опираясь на сеть из более чем 2000 партнерских кооперативов по всей стране, AFREXIA ежегодно мобилизует несколько тысяч тонн кофе, какао, перца, масел и других тропических продуктов, соответствующих стандартам качества и прослеживаемости, требуемым международными рынками.',
          'Ее модель интегрирует всю цепочку создания стоимости: от сбора до промышленной переработки и экспортной логистики, чтобы предложить своим клиентам профессиональное, надежное и прозрачное решение.',
          'Благодаря строгому контрактному подходу и активному присутствию на местах, AFREXIA стремится позиционировать Камерун как ведущего игрока в африканской агропромышленной торговле.',
        ],
        stats: [
          { value: '2 000+', label: 'Партнерских кооперативов' },
          { value: 'Тысячи', label: 'Тонн мобилизовано/год' },
          { value: '100%', label: 'Гарантированная прослеживаемость' },
        ],
      },
      bridge: {
        title: 'Afrexia строит мосты между африканскими производителями и мировыми рынками',
        paragraphs: [
          'Afrexia — развивающаяся компания, основанная в Камеруне, которая развертывает свои первые операции в области торговли, посредничества и использования местного сельскохозяйственного и лесного сырья.',
          'Наше видение панафриканское, но наша первоначальная основа опирается на богатство и ноу-хау камерунского терруара.',
          'Мы связываем производителей, кооперативы и международных покупателей через интегрированную, прослеживаемую и ответственную модель оператора, ориентированную на производительность, местное воздействие и коммерческую прозрачность.',
          'Наша миссия — использовать камерунские и африканские сельскохозяйственные ресурсы, структурировать цепочки поставок и гарантировать справедливый и прибыльный доступ к мировым рынкам.',
        ],
      },
      commitment: {
        title: 'Наша приверженность производителям',
        paragraphs: [
          'AFREXIA максимизирует ценность местных производств, связывая производителей с платежеспособными покупателями, прибыльными рынками и безопасными экспортными цепочками, в логике общей экономической эффективности.',
          'Оптимизируя их рентабельность, мы следим за сохранением их интересов на каждом этапе цепочки создания стоимости.',
        ],
      },
      story: {
        title: 'Наша История',
        content: 'Afrexia родилась из желания связать африканских производителей с международными рынками с прозрачностью и качеством. Мы структурируем цепочку поставок от фермы до порта, гарантируя прослеживаемость, соответствие требованиям и документацию, готовую к аудиту.',
      },
      mission: {
        title: 'Наша Миссия',
        content: 'Содействие экспорту африканских сельскохозяйственных товаров путем предоставления полевых закупок, контроля качества, соответствия EUDR и интегрированной логистики. Мы гарантируем премиальные продукты с полной документацией для обеспечения ваших отправок.',
      },
      values: {
        title: 'Наши Ценности',
        items: [
          {
            title: 'Качественное Превосходство',
            description: 'Строгие стандарты • COA • Инспекции • Прослеживаемость партий',
          },
          {
            title: 'Прозрачность',
            description: 'Полная прослеживаемость • Документация • Геолокационные доказательства',
          },
          {
            title: 'Устойчивость',
            description: 'Ответственные практики • Соответствие EUDR • Социальное воздействие',
          },
          {
            title: 'Партнерство',
            description: 'Долгосрочные отношения • Доверие • Ответ <24ч',
          },
        ],
      },
      approach: {
        title: 'Наш Подход',
        subtitle: 'От фермы до порта, контролируемая цепочка',
        steps: [
          {
            title: 'Полевые Закупки',
            description: 'Сеть производителей и кооперативов • Строгий отбор • Проверка происхождения',
          },
          {
            title: 'Контроль Качества',
            description: 'Инспекции • Анализы • COA • Полная документация QA',
          },
          {
            title: 'Соответствие и Прослеживаемость',
            description: 'Документация EUDR • Геолокация • Цепочка прослеживаемости • Готовность к аудиту',
          },
          {
            title: 'Экспортная Логистика',
            description: 'Складирование • Контейнеризация • Инкотермс FOB/CIF/DAP • Управление отправками',
          },
        ],
      },
      cta: {
        title: 'Давайте обсудим ваш проект',
        subtitle: 'Объемы, спецификации, направление, требования к документации',
        primary: 'Запросить Предложение',
        secondary: 'Свяжитесь с Нами',
      },
    },
  };

  const t = content[locale] || content.en;

  const valueIcons = [Award, Eye, Leaf, Handshake];
  const approachIcons = [Users, Target, Building2, TrendingUp];

  return (
    <ScrollRevealWrapper>
      <main className="min-h-screen bg-[#0A1410]">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/apropo.jpg"
            alt="About Afrexia"
            fill
            className="object-cover opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1410]/60 via-[#0A1410]/70 to-[#0A1410]" />
        </div>

        {/* Animated Background Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#4A9A62]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s', animationDuration: '4s' }} />
          <div className="absolute top-40 right-20 w-40 h-40 bg-[#A89858]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '5s' }} />
          <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-[#4A9A62]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '6s' }} />
          <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-[#A89858]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Decorative top line */}
          <div className="flex items-center justify-center mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#4A9A62] to-transparent" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#E8F5E9] mb-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            {t.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-[#C5D9C0] max-w-3xl mx-auto mb-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            {t.hero.subtitle}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            {t.hero.badges.map((badge: string, index: number) => (
              <span
                key={index}
                className="group relative px-4 py-2 bg-[#0F1814]/80 border border-[rgba(255,255,255,0.08)] rounded-full text-[#A89858] hover:border-[#A89858]/40 hover:bg-[#0F1814] transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="relative z-10">{badge}</span>
              </span>
            ))}
          </div>

          {/* Decorative bottom element */}
          <div className="flex items-center justify-center mt-8 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#4A9A62] to-transparent rounded-full" />
          </div>
        </div>

        {/* Floating decorative circles */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-[#4A9A62] rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-20 right-16 w-3 h-3 bg-[#A89858] rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }} />
        <div className="absolute bottom-32 left-20 w-2 h-2 bg-[#4A9A62] rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute bottom-20 right-32 w-3 h-3 bg-[#A89858] rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.2s' }} />
      </section>

      {/* Intro Section - Qui sommes-nous */}
      <section className="scroll-reveal py-20 px-4 sm:px-6 lg:px-8 opacity-0 translate-y-8 transition-all duration-700 relative overflow-hidden">
        {/* Large animated background blurs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#4A9A62]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#A89858]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Content - 60% */}
            <div className="lg:col-span-3">
              <h2 className="text-3xl md:text-4xl font-bold text-[#E8F5E9] mb-6 animate-fadeInUp">
                {t.intro.title}
              </h2>
              
              <div className="space-y-4">
                {t.intro.paragraphs.map((paragraph: string, index: number) => (
                  <p key={index} className="text-base text-[#C5D9C0] leading-relaxed animate-fadeInUp" style={{ animationDelay: `${0.1 + index * 0.1}s` }}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                {t.intro.stats.map((stat: { value: string; label: string }, index: number) => (
                  <div
                    key={index}
                    className="group relative bg-gradient-to-br from-[#0F1814] to-[#0A1410] border border-[rgba(255,255,255,0.08)] rounded-lg p-6 text-center hover:border-[rgba(74,154,98,0.4)] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(74,154,98,0.15)] animate-scaleIn overflow-hidden"
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                  >
                    {/* Animated corner decoration */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#4A9A62]/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Subtle glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4A9A62]/0 to-[#4A9A62]/0 group-hover:from-[#4A9A62]/5 group-hover:to-[#4A9A62]/5 transition-all duration-300 rounded-lg" />
                    
                    {/* Animated bottom border */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#4A9A62] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="text-3xl font-bold text-[#4A9A62] mb-2 group-hover:scale-110 transition-transform duration-300">
                        {stat.value}
                      </div>
                      <div className="text-sm text-[#C5D9C0]">
                        {stat.label}
                      </div>
                    </div>

                    {/* Pulse ring effect */}
                    <div className="absolute inset-0 rounded-lg border-2 border-[#4A9A62]/0 group-hover:border-[#4A9A62]/30 group-hover:scale-105 transition-all duration-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Image - 40% */}
            <div className="lg:col-span-2 animate-scaleIn" style={{ animationDelay: '0.3s' }}>
              <div className="group relative h-full min-h-[400px] rounded-lg overflow-hidden border border-[rgba(255,255,255,0.08)] shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:shadow-[0_25px_70px_rgba(74,154,98,0.2)] hover:border-[rgba(74,154,98,0.3)] transition-all duration-500 hover:-translate-y-2 hover:rotate-1">
                <Image
                  src="/assets/rogess.jpg"
                  alt="AFREXIA operations"
                  fill
                  className="object-cover group-hover:scale-110 group-hover:rotate-2 transition-transform duration-700"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1410]/40 via-transparent to-transparent" />
                
                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#4A9A62]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#4A9A62]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bridge Section - Building Bridges */}
      <section className="scroll-reveal py-20 px-4 sm:px-6 lg:px-8 bg-[#0F1814]/30 opacity-0 translate-y-8 transition-all duration-700 relative overflow-hidden">
        {/* Background particles */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#4A9A62]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#A89858]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '9s', animationDelay: '1s' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Image - 40% (Left side) */}
            <div className="lg:col-span-2 order-2 lg:order-1 animate-scaleIn" style={{ animationDelay: '0.2s' }}>
              <div className="group relative h-full min-h-[400px] rounded-lg overflow-hidden border border-[rgba(255,255,255,0.08)] shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:shadow-[0_25px_70px_rgba(74,154,98,0.2)] hover:border-[rgba(74,154,98,0.3)] transition-all duration-500 hover:-translate-y-2 hover:-rotate-1">
                <Image
                  src="/assets/roger1.jpg"
                  alt="Afrexia field operations"
                  fill
                  className="object-cover group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-700"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1410]/40 via-transparent to-transparent" />
                
                {/* Animated corner accents */}
                <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#4A9A62]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#4A9A62]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>

            {/* Content - 60% (Right side) */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-[#4A9A62] mb-6 leading-tight animate-fadeInUp relative inline-block">
                {t.bridge.title}
                {/* Underline decoration */}
                <div className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-[#4A9A62] to-transparent rounded-full animate-slideInRight" />
              </h2>
              
              <div className="space-y-4">
                {t.bridge.paragraphs.map((paragraph: string, index: number) => (
                  <p key={index} className="text-base text-[#C5D9C0] leading-relaxed animate-fadeInUp" style={{ animationDelay: `${0.1 + index * 0.1}s` }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Section - Notre engagement envers les producteurs */}
      <section className="scroll-reveal py-20 px-4 sm:px-6 lg:px-8 opacity-0 translate-y-8 transition-all duration-700 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#A89858]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Content - 40% (Left side) */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl md:text-4xl font-bold text-[#A89858] mb-6 leading-tight animate-fadeInUp relative inline-block">
                {t.commitment.title}
                {/* Decorative underline */}
                <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-[#A89858] to-transparent rounded-full animate-slideInRight" />
              </h2>
              
              <div className="space-y-4">
                {t.commitment.paragraphs.map((paragraph: string, index: number) => (
                  <p key={index} className="text-base text-[#C5D9C0] leading-relaxed animate-fadeInUp" style={{ animationDelay: `${0.1 + index * 0.1}s` }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Images Grid - 60% (Right side) */}
            <div className="lg:col-span-3 animate-scaleIn" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                {/* Small image - Top Left (extends beyond left edge) */}
                <div className="absolute -top-6 -left-12 w-1/3 z-10 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                  <div className="group relative h-32 rounded-lg overflow-hidden border border-[rgba(255,255,255,0.08)] shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:shadow-[0_25px_70px_rgba(74,154,98,0.2)] hover:border-[rgba(74,154,98,0.3)] transition-all duration-500 hover:-translate-y-2 hover:rotate-3">
                    <Image
                      src="/assets/1.jpg"
                      alt="Engagement producteurs 1"
                      fill
                      className="object-cover group-hover:scale-110 group-hover:rotate-2 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1410]/40 via-transparent to-transparent" />
                  </div>
                </div>

                {/* Large image - Center */}
                <div className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-[rgba(255,255,255,0.08)] shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:shadow-[0_25px_70px_rgba(74,154,98,0.2)] hover:border-[rgba(74,154,98,0.3)] transition-all duration-500 hover:-translate-y-2 animate-scaleIn" style={{ animationDelay: '0.5s' }}>
                  <Image
                    src="/assets/2.jpg"
                    alt="Engagement producteurs 2"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1410]/40 via-transparent to-transparent" />
                  
                  {/* Corner accents */}
                  <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-[#A89858]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-[#A89858]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Small image - Bottom Right (extends beyond right edge) */}
                <div className="absolute -bottom-6 -right-12 w-2/5 z-10 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                  <div className="group relative h-40 rounded-lg overflow-hidden border border-[rgba(255,255,255,0.08)] shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:shadow-[0_25px_70px_rgba(74,154,98,0.2)] hover:border-[rgba(74,154,98,0.3)] transition-all duration-500 hover:-translate-y-2 hover:-rotate-3">
                    <Image
                      src="/assets/3.jpg"
                      alt="Engagement producteurs 3"
                      fill
                      className="object-cover group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1410]/40 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story & Mission Section - Side by Side */}
      <section className="scroll-reveal py-20 px-4 sm:px-6 lg:px-8 bg-[#0F1814]/30 opacity-0 translate-y-8 transition-all duration-700 relative overflow-hidden">
        {/* Background particles */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#4A9A62]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-[#A89858]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Story */}
            <div className="group relative bg-[#0F1814] border border-[rgba(255,255,255,0.08)] rounded-lg p-8 hover:border-[rgba(74,154,98,0.4)] hover:-translate-y-1 transition-all duration-300 animate-scaleIn overflow-hidden" style={{ animationDelay: '0.1s' }}>
              {/* Animated top border */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#4A9A62] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
              
              {/* Corner glow */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#4A9A62]/10 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <h2 className="text-2xl md:text-3xl font-bold text-[#E8F5E9] mb-4 relative z-10">
                {t.story.title}
              </h2>
              <p className="text-base text-[#C5D9C0] leading-relaxed relative z-10">
                {t.story.content}
              </p>

              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-lg border-2 border-[#4A9A62]/0 group-hover:border-[#4A9A62]/20 group-hover:scale-105 transition-all duration-500" />
            </div>

            {/* Mission */}
            <div className="group relative bg-[#0F1814] border border-[rgba(255,255,255,0.08)] rounded-lg p-8 hover:border-[rgba(74,154,98,0.4)] hover:-translate-y-1 transition-all duration-300 animate-scaleIn overflow-hidden" style={{ animationDelay: '0.2s' }}>
              {/* Animated top border */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#4A9A62] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
              
              {/* Corner glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#4A9A62]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-12 h-12 rounded-lg bg-[#4A9A62]/10 border border-[#4A9A62]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <Eye className="w-6 h-6 text-[#4A9A62]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#E8F5E9]">
                  {t.mission.title}
                </h2>
              </div>
              <p className="text-base text-[#C5D9C0] leading-relaxed relative z-10">
                {t.mission.content}
              </p>

              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-lg border-2 border-[#4A9A62]/0 group-hover:border-[#4A9A62]/20 group-hover:scale-105 transition-all duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="scroll-reveal py-20 px-4 sm:px-6 lg:px-8 opacity-0 translate-y-8 transition-all duration-700 relative overflow-hidden">
        {/* Large background blurs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#4A9A62]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#A89858]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '11s', animationDelay: '2s' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#E8F5E9] text-center mb-4 animate-fadeInUp">
            {t.values.title}
          </h2>
          <p className="text-lg text-[#C5D9C0] text-center mb-12 max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            {locale === 'fr' ? 'Les principes qui guident notre action quotidienne' : 
             locale === 'en' ? 'The principles that guide our daily actions' :
             locale === 'es' ? 'Los principios que guían nuestra acción diaria' :
             locale === 'de' ? 'Die Prinzipien, die unser tägliches Handeln leiten' :
             'Принципы, которые направляют наши ежедневные действия'}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.values.items.map((value: { title: string; description: string }, index: number) => {
              const Icon = valueIcons[index];
              return (
                <div
                  key={index}
                  className="group relative bg-[#0F1814] border border-[rgba(255,255,255,0.08)] rounded-lg p-6 hover:border-[rgba(74,154,98,0.4)] hover:-translate-y-1 transition-all duration-300 animate-scaleIn overflow-hidden"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  {/* Corner decoration */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#4A9A62]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Animated bottom border */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#4A9A62] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-[#4A9A62]/10 border border-[#4A9A62]/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                      <Icon className="w-6 h-6 text-[#4A9A62]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#E8F5E9] mb-3">
                      {value.title}
                    </h3>
                    <p className="text-sm text-[#C5D9C0] leading-relaxed">
                      {value.description}
                    </p>
                  </div>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4A9A62]/0 to-[#4A9A62]/0 group-hover:from-[#4A9A62]/5 group-hover:to-[#4A9A62]/5 transition-all duration-300 rounded-lg" />
                  
                  {/* Pulse ring */}
                  <div className="absolute inset-0 rounded-lg border-2 border-[#4A9A62]/0 group-hover:border-[#4A9A62]/20 group-hover:scale-105 transition-all duration-500" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="scroll-reveal py-20 px-4 sm:px-6 lg:px-8 bg-[#0F1814]/30 opacity-0 translate-y-8 transition-all duration-700 relative overflow-hidden">
        {/* Background particles */}
        <div className="absolute top-10 left-10 w-80 h-80 bg-[#4A9A62]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#A89858]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '1.5s' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#E8F5E9] mb-4 animate-fadeInUp">
              {t.approach.title}
            </h2>
            <p className="text-lg text-[#C5D9C0] animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              {t.approach.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {t.approach.steps.map((step: { title: string; description: string }, index: number) => {
              const Icon = approachIcons[index];
              return (
                <div
                  key={index}
                  className="group relative bg-[#0F1814] border border-[rgba(255,255,255,0.08)] rounded-lg p-8 hover:border-[rgba(74,154,98,0.4)] hover:-translate-y-1 transition-all duration-300 animate-scaleIn overflow-hidden"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  {/* Animated top border */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#4A9A62] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                  
                  {/* Corner glow */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#4A9A62]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-[#4A9A62]/10 border border-[#4A9A62]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                      <Icon className="w-6 h-6 text-[#4A9A62]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm font-bold text-[#4A9A62] bg-[#4A9A62]/10 px-3 py-1 rounded-full group-hover:scale-110 transition-transform duration-300">
                          {index + 1}
                        </span>
                        <h3 className="text-xl font-semibold text-[#E8F5E9]">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-sm text-[#C5D9C0] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4A9A62]/0 to-[#4A9A62]/0 group-hover:from-[#4A9A62]/5 group-hover:to-[#4A9A62]/5 transition-all duration-300 rounded-lg" />
                  
                  {/* Pulse ring */}
                  <div className="absolute inset-0 rounded-lg border-2 border-[#4A9A62]/0 group-hover:border-[#4A9A62]/20 group-hover:scale-105 transition-all duration-500" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/hero-5.jpg"
            alt="Contact us"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1410] via-[#0A1410]/80 to-[#0A1410]" />
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-3 h-3 bg-[#4A9A62] rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute top-20 right-20 w-2 h-2 bg-[#A89858] rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }} />
          <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-[#4A9A62] rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className="absolute bottom-32 right-1/3 w-2 h-2 bg-[#A89858] rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.2s' }} />
        </div>

        {/* Animated rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-[#4A9A62]/10 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[#A89858]/10 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#E8F5E9] mb-4 animate-fadeInUp">
            {t.cta.title}
          </h2>
          <p className="text-lg text-[#C5D9C0] mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            {t.cta.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <Link
              href={`/${locale}/rfq`}
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-[#4A9A62] text-white font-semibold rounded-lg hover:bg-[#3d8251] transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="relative z-10">{t.cta.primary}</span>
              <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-[#0F1814] border border-[rgba(255,255,255,0.08)] text-[#E8F5E9] font-semibold rounded-lg hover:border-[#4A9A62] transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              {/* Border glow effect */}
              <div className="absolute inset-0 rounded-lg border-2 border-[#4A9A62]/0 group-hover:border-[#4A9A62]/30 transition-all duration-300" />
              <span className="relative z-10">{t.cta.secondary}</span>
            </Link>
          </div>

          {/* Pulse dot indicator */}
          <div className="flex items-center justify-center gap-2 mt-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="w-2 h-2 bg-[#4A9A62] rounded-full animate-pulse" />
            <span className="text-sm text-[#C5D9C0]">
              {locale === 'fr' ? 'Réponse sous 24h' : 
               locale === 'en' ? 'Response within 24h' :
               locale === 'es' ? 'Respuesta en 24h' :
               locale === 'de' ? 'Antwort innerhalb 24h' :
               'Ответ в течение 24ч'}
            </span>
          </div>
        </div>
      </section>
    </main>
    </ScrollRevealWrapper>
  );
}
