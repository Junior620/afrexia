/**
 * Product × Country Introduction Templates
 *
 * Provides 5+ meaningfully different introduction variations for product×country pages.
 * Each variation uses a distinct narrative angle to avoid duplicate content penalties.
 *
 * Variation angles:
 *  1. Commercial opportunity focus
 *  2. Buyer-centric / sourcing focus
 *  3. Product quality & origin focus
 *  4. Logistics simplicity focus
 *  5. Certification & compliance focus
 *  6. Market intelligence focus  (bonus variation)
 *  7. Partnership & trust focus  (bonus variation)
 *
 * @see Requirements 1.6.1, 1.6.2, 1.6.7
 */

import type { Locale, ContentSourceType } from '@/types/seo';

// ============================================================================
// Types
// ============================================================================

export interface ProductCountryTemplateData {
  productName: string;
  countryName: string;
  transitDays?: number;
  certifications?: string[];
  price?: number;
  currency?: string;
  targetMarkets?: string[];
  customsInfo?: string;
  sourceType?: ContentSourceType;
}

export type IntroVariation = (data: ProductCountryTemplateData) => string;

// ============================================================================
// French templates (7 variations)
// ============================================================================

const FR_TEMPLATES: IntroVariation[] = [
  // 1. Commercial opportunity
  (d) =>
    `L'exportation de ${d.productName} vers ${d.countryName} représente une opportunité commerciale majeure pour les acheteurs internationaux. ` +
    `Avec un délai de transit moyen${d.transitDays ? ` de ${d.transitDays} jours` : ' compétitif'}, Afrexia vous accompagne dans chaque étape de votre approvisionnement. ` +
    `${d.certifications?.length ? `Nos produits sont certifiés ${d.certifications.join(', ')}, garantissant la conformité aux exigences du marché ${d.countryName}.` : `Nos produits répondent aux standards d'exportation les plus exigeants.`}`,

  // 2. Buyer-centric / sourcing
  (d) =>
    `Vous recherchez du ${d.productName} de qualité pour le marché ${d.countryName} ? Afrexia est votre partenaire d'export de confiance depuis le Cameroun. ` +
    `${d.price ? `Avec un prix indicatif de ${d.price} ${d.currency ?? 'USD'}/tonne, ` : ''}nous vous proposons des solutions d'approvisionnement adaptées à vos volumes et à vos délais. ` +
    `${d.certifications?.length ? `Nos ${d.productName} répondent aux certifications ${d.certifications.join(' et ')} exigées sur votre marché.` : `Notre équipe sélectionne les meilleurs lots pour garantir une qualité constante.`}`,

  // 3. Product quality & origin
  (d) =>
    `Le ${d.productName} camerounais est reconnu mondialement pour sa qualité exceptionnelle et ses caractéristiques organoleptiques uniques. ` +
    `Afrexia facilite son exportation vers ${d.countryName} en gérant l'ensemble de la chaîne logistique, de la récolte jusqu'au port de destination. ` +
    `${d.transitDays ? `Le transit jusqu'à ${d.countryName} prend en moyenne ${d.transitDays} jours, ` : `Nos délais de livraison sont optimisés, `}` +
    `vous permettant de planifier vos stocks avec précision et de répondre aux demandes de vos clients.`,

  // 4. Logistics simplicity
  (d) =>
    `Importer du ${d.productName} depuis le Cameroun vers ${d.countryName} n'a jamais été aussi simple avec Afrexia. ` +
    `Nous prenons en charge toutes les formalités d'export : contrôle qualité, certification phytosanitaire, dédouanement et organisation du fret maritime. ` +
    `${d.certifications?.length ? `Nos produits sont disponibles avec les certifications ${d.certifications.join(', ')}.` : `Chaque expédition est accompagnée de tous les documents requis.`}` +
    `${d.price ? ` Prix indicatif : ${d.price} ${d.currency ?? 'USD'}/tonne.` : ''}`,

  // 5. Certification & compliance
  (d) =>
    `Découvrez notre offre de ${d.productName} certifié pour l'export vers ${d.countryName}, conforme aux réglementations les plus strictes. ` +
    `Afrexia sélectionne les meilleures origines camerounaises pour répondre aux standards de qualité internationaux et aux exigences spécifiques du marché ${d.countryName}. ` +
    `${d.transitDays ? `Délai de livraison estimé : ${d.transitDays} jours.` : ''}` +
    `${d.certifications?.length ? ` Certifications disponibles : ${d.certifications.join(', ')}.` : ' Nos produits sont soumis à des contrôles qualité rigoureux avant chaque expédition.'}`,

  // 6. Market intelligence
  (d) =>
    `Le marché ${d.countryName} représente l'une des destinations les plus dynamiques pour les exportateurs de ${d.productName} africain. ` +
    `${d.targetMarkets?.length ? `Les secteurs acheteurs clés incluent ${d.targetMarkets.join(', ')}, ` : ''}` +
    `avec une demande soutenue tout au long de l'année. Afrexia vous donne accès à ce marché grâce à son réseau logistique établi et sa connaissance approfondie des réglementations locales. ` +
    `${d.price ? `Prix indicatif actuel : ${d.price} ${d.currency ?? 'USD'}/tonne.` : 'Contactez-nous pour connaître les prix du marché en temps réel.'}`,

  // 7. Partnership & trust
  (d) =>
    `Depuis des années, Afrexia construit des partenariats durables entre les producteurs camerounais de ${d.productName} et les acheteurs de ${d.countryName}. ` +
    `Notre approche repose sur la transparence, la traçabilité et la qualité certifiée à chaque étape de la chaîne d'approvisionnement. ` +
    `${d.customsInfo ? `${d.customsInfo} ` : ''}` +
    `${d.certifications?.length ? `Nos ${d.productName} sont disponibles avec les certifications ${d.certifications.join(', ')}, ` : ''}` +
    `pour vous permettre de répondre aux exigences de vos clients finaux avec confiance.`,
];

// ============================================================================
// English templates (7 variations)
// ============================================================================

const EN_TEMPLATES: IntroVariation[] = [
  // 1. Commercial opportunity
  (d) =>
    `Exporting ${d.productName} to ${d.countryName} is a major commercial opportunity for international buyers. ` +
    `With an average transit time${d.transitDays ? ` of ${d.transitDays} days` : ' that is highly competitive'}, Afrexia guides you through every step of your sourcing. ` +
    `${d.certifications?.length ? `Our products are certified ${d.certifications.join(', ')}, ensuring compliance with ${d.countryName} market requirements.` : `Our products meet the most demanding export standards.`}`,

  // 2. Buyer-centric / sourcing
  (d) =>
    `Looking for quality ${d.productName} for the ${d.countryName} market? Afrexia is your trusted export partner from Cameroon. ` +
    `${d.price ? `With an indicative price of ${d.price} ${d.currency ?? 'USD'}/tonne, ` : ''}we offer sourcing solutions tailored to your volumes and timelines. ` +
    `${d.certifications?.length ? `Our ${d.productName} meets the ${d.certifications.join(' and ')} certifications required in your market.` : `Our team selects the best batches to guarantee consistent quality.`}`,

  // 3. Product quality & origin
  (d) =>
    `Cameroonian ${d.productName} is globally recognized for its exceptional quality and unique organoleptic characteristics. ` +
    `Afrexia facilitates its export to ${d.countryName} by managing the entire logistics chain, from harvest to destination port. ` +
    `${d.transitDays ? `Transit to ${d.countryName} takes an average of ${d.transitDays} days, ` : `Our delivery timelines are optimized, `}` +
    `allowing you to plan your inventory with precision and meet your customers' demands.`,

  // 4. Logistics simplicity
  (d) =>
    `Importing ${d.productName} from Cameroon to ${d.countryName} has never been easier with Afrexia. ` +
    `We handle all export formalities: quality control, phytosanitary certification, customs clearance, and maritime freight organization. ` +
    `${d.certifications?.length ? `Our products are available with ${d.certifications.join(', ')} certifications.` : `Every shipment comes with all required documentation.`}` +
    `${d.price ? ` Indicative price: ${d.price} ${d.currency ?? 'USD'}/tonne.` : ''}`,

  // 5. Certification & compliance
  (d) =>
    `Discover our certified ${d.productName} offering for export to ${d.countryName}, compliant with the strictest regulations. ` +
    `Afrexia selects the best Cameroonian origins to meet international quality standards and the specific requirements of the ${d.countryName} market. ` +
    `${d.transitDays ? `Estimated delivery time: ${d.transitDays} days.` : ''}` +
    `${d.certifications?.length ? ` Available certifications: ${d.certifications.join(', ')}.` : ' Our products undergo rigorous quality checks before every shipment.'}`,

  // 6. Market intelligence
  (d) =>
    `The ${d.countryName} market is one of the most dynamic destinations for African ${d.productName} exporters. ` +
    `${d.targetMarkets?.length ? `Key buying sectors include ${d.targetMarkets.join(', ')}, ` : ''}` +
    `with sustained demand throughout the year. Afrexia gives you access to this market through its established logistics network and deep knowledge of local regulations. ` +
    `${d.price ? `Current indicative price: ${d.price} ${d.currency ?? 'USD'}/tonne.` : 'Contact us for real-time market pricing.'}`,

  // 7. Partnership & trust
  (d) =>
    `For years, Afrexia has been building lasting partnerships between Cameroonian ${d.productName} producers and buyers in ${d.countryName}. ` +
    `Our approach is built on transparency, traceability, and certified quality at every step of the supply chain. ` +
    `${d.customsInfo ? `${d.customsInfo} ` : ''}` +
    `${d.certifications?.length ? `Our ${d.productName} is available with ${d.certifications.join(', ')} certifications, ` : ''}` +
    `enabling you to meet your end customers' requirements with confidence.`,
];

// ============================================================================
// Spanish templates (5 variations)
// ============================================================================

const ES_TEMPLATES: IntroVariation[] = [
  (d) =>
    `La exportación de ${d.productName} a ${d.countryName} representa una gran oportunidad comercial para los compradores internacionales. ` +
    `${d.transitDays ? `Con un tiempo de tránsito promedio de ${d.transitDays} días, ` : ''}Afrexia le acompaña en cada etapa de su aprovisionamiento. ` +
    `${d.certifications?.length ? `Nuestros productos están certificados ${d.certifications.join(', ')}, garantizando el cumplimiento de los requisitos del mercado ${d.countryName}.` : `Nuestros productos cumplen con los estándares de exportación más exigentes.`}`,

  (d) =>
    `¿Busca ${d.productName} de calidad para el mercado de ${d.countryName}? Afrexia es su socio exportador de confianza desde Camerún. ` +
    `${d.price ? `Con un precio indicativo de ${d.price} ${d.currency ?? 'USD'}/tonelada, ` : ''}le ofrecemos soluciones de aprovisionamiento adaptadas a sus volúmenes. ` +
    `${d.certifications?.length ? `Nuestro ${d.productName} cumple con las certificaciones ${d.certifications.join(' y ')} exigidas en su mercado.` : ''}`,

  (d) =>
    `El ${d.productName} camerunés es reconocido mundialmente por su calidad excepcional y sus características organolépticas únicas. ` +
    `Afrexia facilita su exportación a ${d.countryName} gestionando toda la cadena logística, desde la cosecha hasta el puerto de destino. ` +
    `${d.transitDays ? `El tránsito hasta ${d.countryName} tarda en promedio ${d.transitDays} días.` : ''}`,

  (d) =>
    `Importar ${d.productName} desde Camerún a ${d.countryName} nunca ha sido tan sencillo con Afrexia. ` +
    `Nos encargamos de todos los trámites de exportación: control de calidad, certificación fitosanitaria, despacho aduanero y organización del flete marítimo. ` +
    `${d.certifications?.length ? `Nuestros productos están disponibles con las certificaciones ${d.certifications.join(', ')}.` : ''}` +
    `${d.price ? ` Precio indicativo: ${d.price} ${d.currency ?? 'USD'}/tonelada.` : ''}`,

  (d) =>
    `Descubra nuestra oferta de ${d.productName} certificado para exportación a ${d.countryName}, conforme con las regulaciones más estrictas. ` +
    `${d.targetMarkets?.length ? `Los sectores compradores clave incluyen ${d.targetMarkets.join(', ')}. ` : ''}` +
    `${d.certifications?.length ? `Certificaciones disponibles: ${d.certifications.join(', ')}.` : 'Nuestros productos se someten a rigurosos controles de calidad antes de cada envío.'}`,
];

// ============================================================================
// German templates (5 variations)
// ============================================================================

const DE_TEMPLATES: IntroVariation[] = [
  (d) =>
    `Der Export von ${d.productName} nach ${d.countryName} bietet große Handelschancen für internationale Käufer. ` +
    `${d.transitDays ? `Mit einer durchschnittlichen Transitzeit von ${d.transitDays} Tagen ` : ''}begleitet Afrexia Sie bei jedem Schritt Ihrer Beschaffung. ` +
    `${d.certifications?.length ? `Unsere Produkte sind ${d.certifications.join(', ')} zertifiziert und erfüllen die Anforderungen des ${d.countryName}-Marktes.` : `Unsere Produkte erfüllen die anspruchsvollsten Exportstandards.`}`,

  (d) =>
    `Suchen Sie qualitatives ${d.productName} für den ${d.countryName}-Markt? Afrexia ist Ihr vertrauenswürdiger Exportpartner aus Kamerun. ` +
    `${d.price ? `Zum Richtpreis von ${d.price} ${d.currency ?? 'USD'}/Tonne ` : ''}bieten wir Ihnen maßgeschneiderte Beschaffungslösungen für Ihre Volumina. ` +
    `${d.certifications?.length ? `Unser ${d.productName} erfüllt die ${d.certifications.join(' und ')}-Zertifizierungen, die auf Ihrem Markt gefordert werden.` : ''}`,

  (d) =>
    `Kamerunisches ${d.productName} ist weltweit für seine außergewöhnliche Qualität und einzigartigen organoleptischen Eigenschaften bekannt. ` +
    `Afrexia erleichtert den Export nach ${d.countryName} durch vollständiges Management der Logistikkette, von der Ernte bis zum Zielhafen. ` +
    `${d.transitDays ? `Die Transitzeit nach ${d.countryName} beträgt durchschnittlich ${d.transitDays} Tage.` : ''}`,

  (d) =>
    `${d.productName} aus Kamerun nach ${d.countryName} zu importieren war noch nie so einfach wie mit Afrexia. ` +
    `Wir übernehmen alle Exportformalitäten: Qualitätskontrolle, phytosanitäre Zertifizierung, Zollabfertigung und Organisation des Seetransports. ` +
    `${d.certifications?.length ? `Unsere Produkte sind mit ${d.certifications.join(', ')}-Zertifizierungen erhältlich.` : ''}` +
    `${d.price ? ` Richtpreis: ${d.price} ${d.currency ?? 'USD'}/Tonne.` : ''}`,

  (d) =>
    `Entdecken Sie unser zertifiziertes ${d.productName}-Angebot für den Export nach ${d.countryName}, konform mit den strengsten Vorschriften. ` +
    `${d.targetMarkets?.length ? `Zu den wichtigsten Käufersektoren gehören ${d.targetMarkets.join(', ')}. ` : ''}` +
    `${d.certifications?.length ? `Verfügbare Zertifizierungen: ${d.certifications.join(', ')}.` : 'Unsere Produkte werden vor jeder Lieferung strengen Qualitätskontrollen unterzogen.'}`,
];

// ============================================================================
// Russian templates (5 variations)
// ============================================================================

const RU_TEMPLATES: IntroVariation[] = [
  (d) =>
    `Экспорт ${d.productName} в ${d.countryName} представляет собой крупную коммерческую возможность для международных покупателей. ` +
    `${d.transitDays ? `Среднее время транзита составляет ${d.transitDays} дней. ` : ''}Afrexia сопровождает вас на каждом этапе поставки. ` +
    `${d.certifications?.length ? `Наша продукция сертифицирована: ${d.certifications.join(', ')}, что гарантирует соответствие требованиям рынка ${d.countryName}.` : `Наша продукция соответствует самым строгим экспортным стандартам.`}`,

  (d) =>
    `Ищете качественный ${d.productName} для рынка ${d.countryName}? Afrexia — ваш надёжный экспортный партнёр из Камеруна. ` +
    `${d.price ? `Ориентировочная цена: ${d.price} ${d.currency ?? 'USD'}/тонна. ` : ''}Мы предлагаем решения по снабжению, адаптированные к вашим объёмам и срокам. ` +
    `${d.certifications?.length ? `Наш ${d.productName} соответствует сертификатам ${d.certifications.join(' и ')}, требуемым на вашем рынке.` : ''}`,

  (d) =>
    `Камерунский ${d.productName} признан во всём мире за исключительное качество и уникальные органолептические характеристики. ` +
    `Afrexia обеспечивает его экспорт в ${d.countryName}, управляя всей логистической цепочкой — от сбора урожая до порта назначения. ` +
    `${d.transitDays ? `Время транзита до ${d.countryName} составляет в среднем ${d.transitDays} дней.` : ''}`,

  (d) =>
    `Импортировать ${d.productName} из Камеруна в ${d.countryName} ещё никогда не было так просто, как с Afrexia. ` +
    `Мы берём на себя все экспортные формальности: контроль качества, фитосанитарную сертификацию, таможенное оформление и организацию морской перевозки. ` +
    `${d.certifications?.length ? `Наша продукция доступна с сертификатами ${d.certifications.join(', ')}.` : ''}` +
    `${d.price ? ` Ориентировочная цена: ${d.price} ${d.currency ?? 'USD'}/тонна.` : ''}`,

  (d) =>
    `Откройте для себя наше предложение сертифицированного ${d.productName} для экспорта в ${d.countryName}, соответствующего самым строгим нормам. ` +
    `${d.targetMarkets?.length ? `Ключевые покупательские секторы включают ${d.targetMarkets.join(', ')}. ` : ''}` +
    `${d.certifications?.length ? `Доступные сертификаты: ${d.certifications.join(', ')}.` : 'Наша продукция проходит строгий контроль качества перед каждой отправкой.'}`,
];

// ============================================================================
// Exported map
// ============================================================================

export const PRODUCT_COUNTRY_INTRO_TEMPLATES: Record<Locale, IntroVariation[]> = {
  fr: FR_TEMPLATES,
  en: EN_TEMPLATES,
  es: ES_TEMPLATES,
  de: DE_TEMPLATES,
  ru: RU_TEMPLATES,
};

/**
 * Selects a template variation deterministically based on a hash of the product+country slugs.
 * This ensures the same page always gets the same variation, while different pages get different ones.
 */
export function selectTemplateVariation(
  templates: IntroVariation[],
  productSlug: string,
  countrySlug: string
): IntroVariation {
  const hash = (productSlug + countrySlug)
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return templates[hash % templates.length];
}
