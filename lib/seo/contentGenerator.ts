/**
 * Content Generator
 *
 * Generates unique content for programmatic SEO pages with template variations,
 * multilingual support, content source tracking, and disclaimer management.
 *
 * @see Requirements 1.6, 1.7, 1.8, 1.10
 */

import type {
  Locale,
  ContentSourceType,
  ContentBlock,
  FAQ,
  ContentDistribution,
  Product,
  ExportCountry,
  LocalizedString,
} from '@/types/seo';
import { DISCLAIMERS } from './disclaimers';

// Re-export template modules so consumers can import from a single location
export {
  PRODUCT_COUNTRY_INTRO_TEMPLATES,
  selectTemplateVariation,
  PRODUCT_COUNTRY_FAQ_TEMPLATES,
  PRICE_FAQ_TEMPLATES,
  COMPARISON_FAQ_TEMPLATES,
  ALL_FAQ_TEMPLATES,
  generateFAQs as generateFAQsFromTemplates,
  PRODUCT_COUNTRY_STRUCTURES,
  PRICE_STRUCTURES,
  COMPARISON_STRUCTURES,
  SECTION_HEADINGS,
  selectContentStructure,
  getTotalMinWords,
} from './templates';

// ============================================================================
// Constants
// ============================================================================

const FALLBACK_LOCALE: Locale = 'en';
const MIN_CONTENT_LENGTH = 500; // words

// ============================================================================
// Intro Templates (minimum 5 variations per requirement 1.6.1)
// ============================================================================

type IntroTemplateData = {
  productName: string;
  countryName: string;
  transitDays?: number;
  certifications?: string[];
  price?: number;
  currency?: string;
};

const INTRO_TEMPLATES_FR: Array<(data: IntroTemplateData) => string> = [
  (d) =>
    `L'exportation de ${d.productName} vers ${d.countryName} représente une opportunité commerciale majeure pour les acheteurs internationaux. ` +
    `Avec un délai de transit moyen${d.transitDays ? ` de ${d.transitDays} jours` : ''}, Afrexia vous accompagne dans chaque étape de votre approvisionnement. ` +
    `${d.certifications?.length ? `Nos produits sont certifiés ${d.certifications.join(', ')}, garantissant la conformité aux exigences du marché ${d.countryName}.` : ''}`,

  (d) =>
    `Vous recherchez du ${d.productName} de qualité pour le marché ${d.countryName} ? Afrexia est votre partenaire d'export de confiance depuis le Cameroun. ` +
    `${d.price ? `Avec un prix indicatif de ${d.price} ${d.currency ?? 'USD'}/tonne, ` : ''}nous vous proposons des solutions d'approvisionnement adaptées à vos volumes. ` +
    `${d.certifications?.length ? `Nos ${d.productName} répondent aux certifications ${d.certifications.join(' et ')} exigées sur votre marché.` : ''}`,

  (d) =>
    `Le ${d.productName} camerounais est reconnu mondialement pour sa qualité exceptionnelle. ` +
    `Afrexia facilite son exportation vers ${d.countryName} en gérant l'ensemble de la chaîne logistique. ` +
    `${d.transitDays ? `Le transit jusqu'à ${d.countryName} prend en moyenne ${d.transitDays} jours, ` : ''}` +
    `vous permettant de planifier vos stocks avec précision.`,

  (d) =>
    `Importer du ${d.productName} depuis le Cameroun vers ${d.countryName} n'a jamais été aussi simple. ` +
    `Afrexia prend en charge toutes les formalités d'export, de la récolte jusqu'à la livraison. ` +
    `${d.certifications?.length ? `Nos produits sont disponibles avec les certifications ${d.certifications.join(', ')}.` : ''}` +
    `${d.price ? ` Prix indicatif : ${d.price} ${d.currency ?? 'USD'}/tonne.` : ''}`,

  (d) =>
    `Découvrez notre offre de ${d.productName} certifié pour l'export vers ${d.countryName}. ` +
    `Afrexia sélectionne les meilleures origines camerounaises pour répondre aux standards de qualité internationaux. ` +
    `${d.transitDays ? `Délai de livraison estimé : ${d.transitDays} jours.` : ''}` +
    `${d.certifications?.length ? ` Certifications disponibles : ${d.certifications.join(', ')}.` : ''}`,
];

const INTRO_TEMPLATES_EN: Array<(data: IntroTemplateData) => string> = [
  (d) =>
    `Exporting ${d.productName} to ${d.countryName} is a major commercial opportunity for international buyers. ` +
    `With an average transit time${d.transitDays ? ` of ${d.transitDays} days` : ''}, Afrexia guides you through every step of your sourcing. ` +
    `${d.certifications?.length ? `Our products are certified ${d.certifications.join(', ')}, ensuring compliance with ${d.countryName} market requirements.` : ''}`,

  (d) =>
    `Looking for quality ${d.productName} for the ${d.countryName} market? Afrexia is your trusted export partner from Cameroon. ` +
    `${d.price ? `With an indicative price of ${d.price} ${d.currency ?? 'USD'}/tonne, ` : ''}we offer sourcing solutions tailored to your volumes. ` +
    `${d.certifications?.length ? `Our ${d.productName} meets the ${d.certifications.join(' and ')} certifications required in your market.` : ''}`,

  (d) =>
    `Cameroonian ${d.productName} is globally recognized for its exceptional quality. ` +
    `Afrexia facilitates its export to ${d.countryName} by managing the entire logistics chain. ` +
    `${d.transitDays ? `Transit to ${d.countryName} takes an average of ${d.transitDays} days, ` : ''}` +
    `allowing you to plan your inventory with precision.`,

  (d) =>
    `Importing ${d.productName} from Cameroon to ${d.countryName} has never been easier. ` +
    `Afrexia handles all export formalities, from harvest to delivery. ` +
    `${d.certifications?.length ? `Our products are available with ${d.certifications.join(', ')} certifications.` : ''}` +
    `${d.price ? ` Indicative price: ${d.price} ${d.currency ?? 'USD'}/tonne.` : ''}`,

  (d) =>
    `Discover our certified ${d.productName} offering for export to ${d.countryName}. ` +
    `Afrexia selects the best Cameroonian origins to meet international quality standards. ` +
    `${d.transitDays ? `Estimated delivery time: ${d.transitDays} days.` : ''}` +
    `${d.certifications?.length ? ` Available certifications: ${d.certifications.join(', ')}.` : ''}`,
];

const INTRO_TEMPLATES_ES: Array<(data: IntroTemplateData) => string> = [
  (d) =>
    `La exportación de ${d.productName} a ${d.countryName} representa una gran oportunidad comercial. ` +
    `${d.transitDays ? `Con un tiempo de tránsito promedio de ${d.transitDays} días, ` : ''}Afrexia le acompaña en cada etapa de su aprovisionamiento. ` +
    `${d.certifications?.length ? `Nuestros productos están certificados ${d.certifications.join(', ')}.` : ''}`,

  (d) =>
    `¿Busca ${d.productName} de calidad para el mercado de ${d.countryName}? Afrexia es su socio exportador de confianza desde Camerún. ` +
    `${d.price ? `Precio indicativo: ${d.price} ${d.currency ?? 'USD'}/tonelada.` : ''}`,

  (d) =>
    `El ${d.productName} camerunés es reconocido mundialmente por su calidad excepcional. ` +
    `Afrexia facilita su exportación a ${d.countryName} gestionando toda la cadena logística.`,

  (d) =>
    `Importar ${d.productName} desde Camerún a ${d.countryName} nunca ha sido tan sencillo. ` +
    `Afrexia gestiona todos los trámites de exportación, desde la cosecha hasta la entrega.`,

  (d) =>
    `Descubra nuestra oferta de ${d.productName} certificado para exportación a ${d.countryName}. ` +
    `${d.certifications?.length ? `Certificaciones disponibles: ${d.certifications.join(', ')}.` : ''}`,
];

const INTRO_TEMPLATES_DE: Array<(data: IntroTemplateData) => string> = [
  (d) =>
    `Der Export von ${d.productName} nach ${d.countryName} bietet große Handelschancen. ` +
    `${d.transitDays ? `Mit einer durchschnittlichen Transitzeit von ${d.transitDays} Tagen ` : ''}begleitet Afrexia Sie bei jedem Schritt Ihrer Beschaffung. ` +
    `${d.certifications?.length ? `Unsere Produkte sind ${d.certifications.join(', ')} zertifiziert.` : ''}`,

  (d) =>
    `Suchen Sie qualitatives ${d.productName} für den ${d.countryName}-Markt? Afrexia ist Ihr vertrauenswürdiger Exportpartner aus Kamerun. ` +
    `${d.price ? `Richtpreis: ${d.price} ${d.currency ?? 'USD'}/Tonne.` : ''}`,

  (d) =>
    `Kamerunisches ${d.productName} ist weltweit für seine außergewöhnliche Qualität bekannt. ` +
    `Afrexia erleichtert den Export nach ${d.countryName} durch vollständiges Logistikmanagement.`,

  (d) =>
    `${d.productName} aus Kamerun nach ${d.countryName} zu importieren war noch nie so einfach. ` +
    `Afrexia übernimmt alle Exportformalitäten von der Ernte bis zur Lieferung.`,

  (d) =>
    `Entdecken Sie unser zertifiziertes ${d.productName}-Angebot für den Export nach ${d.countryName}. ` +
    `${d.certifications?.length ? `Verfügbare Zertifizierungen: ${d.certifications.join(', ')}.` : ''}`,
];

const INTRO_TEMPLATES_RU: Array<(data: IntroTemplateData) => string> = [
  (d) =>
    `Экспорт ${d.productName} в ${d.countryName} представляет собой крупную коммерческую возможность. ` +
    `${d.transitDays ? `Среднее время транзита составляет ${d.transitDays} дней. ` : ''}Afrexia сопровождает вас на каждом этапе поставки. ` +
    `${d.certifications?.length ? `Наша продукция сертифицирована: ${d.certifications.join(', ')}.` : ''}`,

  (d) =>
    `Ищете качественный ${d.productName} для рынка ${d.countryName}? Afrexia — ваш надёжный экспортный партнёр из Камеруна. ` +
    `${d.price ? `Ориентировочная цена: ${d.price} ${d.currency ?? 'USD'}/тонна.` : ''}`,

  (d) =>
    `Камерунский ${d.productName} признан во всём мире за исключительное качество. ` +
    `Afrexia обеспечивает его экспорт в ${d.countryName}, управляя всей логистической цепочкой.`,

  (d) =>
    `Импортировать ${d.productName} из Камеруна в ${d.countryName} ещё никогда не было так просто. ` +
    `Afrexia берёт на себя все экспортные формальности от сбора урожая до доставки.`,

  (d) =>
    `Откройте для себя наше предложение сертифицированного ${d.productName} для экспорта в ${d.countryName}. ` +
    `${d.certifications?.length ? `Доступные сертификаты: ${d.certifications.join(', ')}.` : ''}`,
];

const INTRO_TEMPLATES: Record<Locale, Array<(data: IntroTemplateData) => string>> = {
  fr: INTRO_TEMPLATES_FR,
  en: INTRO_TEMPLATES_EN,
  es: INTRO_TEMPLATES_ES,
  de: INTRO_TEMPLATES_DE,
  ru: INTRO_TEMPLATES_RU,
};

// ============================================================================
// FAQ Templates (Req 1.6.5 - 3-5 unique FAQs per page)
// ============================================================================

type FAQTemplateData = {
  productName: string;
  countryName: string;
  transitDays?: number;
  certifications?: string[];
  price?: number;
  currency?: string;
};

type FAQTemplate = (data: FAQTemplateData) => { question: string; answer: string };

const FAQ_TEMPLATES: Record<Locale, FAQTemplate[]> = {
  fr: [
    (d) => ({
      question: `Comment exporter du ${d.productName} vers ${d.countryName} ?`,
      answer: `L'exportation de ${d.productName} vers ${d.countryName} nécessite plusieurs étapes : sélection du produit, contrôle qualité, obtention des certificats phytosanitaires, et organisation du transport maritime. Afrexia gère l'ensemble de ce processus pour vous.`,
    }),
    (d) => ({
      question: `Quelles certifications sont requises pour exporter du ${d.productName} vers ${d.countryName} ?`,
      answer: `${d.certifications?.length ? `Les certifications ${d.certifications.join(', ')} sont généralement requises pour l'export de ${d.productName} vers ${d.countryName}.` : `Des certifications phytosanitaires et de qualité sont requises pour l'export de ${d.productName} vers ${d.countryName}.`} Contactez-nous pour une liste complète des documents nécessaires.`,
    }),
    (d) => ({
      question: `Quel est le délai de livraison pour du ${d.productName} expédié vers ${d.countryName} ?`,
      answer: `${d.transitDays ? `Le délai de transit moyen est de ${d.transitDays} jours.` : `Le délai de transit varie selon le port de destination et les conditions logistiques.`} Ce délai est indicatif et peut varier selon les conditions de transport et les formalités douanières.`,
    }),
    (d) => ({
      question: `Quel est le prix du ${d.productName} camerounais pour l'export vers ${d.countryName} ?`,
      answer: `${d.price ? `Le prix indicatif est de ${d.price} ${d.currency ?? 'USD'}/tonne.` : `Le prix du ${d.productName} varie selon la qualité, le volume et les conditions du marché.`} Contactez notre équipe commerciale pour obtenir un devis personnalisé adapté à vos besoins.`,
    }),
    (d) => ({
      question: `Quelles sont les formalités douanières pour importer du ${d.productName} en ${d.countryName} ?`,
      answer: `L'importation de ${d.productName} en ${d.countryName} est soumise aux réglementations douanières locales. Afrexia vous accompagne dans la préparation de tous les documents nécessaires : certificat d'origine, certificat phytosanitaire, facture commerciale et liste de colisage.`,
    }),
  ],
  en: [
    (d) => ({
      question: `How to export ${d.productName} to ${d.countryName}?`,
      answer: `Exporting ${d.productName} to ${d.countryName} involves several steps: product selection, quality control, obtaining phytosanitary certificates, and arranging maritime transport. Afrexia manages the entire process for you.`,
    }),
    (d) => ({
      question: `What certifications are required to export ${d.productName} to ${d.countryName}?`,
      answer: `${d.certifications?.length ? `The ${d.certifications.join(', ')} certifications are generally required for exporting ${d.productName} to ${d.countryName}.` : `Phytosanitary and quality certifications are required for exporting ${d.productName} to ${d.countryName}.`} Contact us for a complete list of required documents.`,
    }),
    (d) => ({
      question: `What is the delivery time for ${d.productName} shipped to ${d.countryName}?`,
      answer: `${d.transitDays ? `The average transit time is ${d.transitDays} days.` : `Transit time varies depending on the destination port and logistics conditions.`} This is an indicative timeframe and may vary based on transport conditions and customs formalities.`,
    }),
    (d) => ({
      question: `What is the price of Cameroonian ${d.productName} for export to ${d.countryName}?`,
      answer: `${d.price ? `The indicative price is ${d.price} ${d.currency ?? 'USD'}/tonne.` : `The price of ${d.productName} varies based on quality, volume, and market conditions.`} Contact our sales team for a personalized quote tailored to your needs.`,
    }),
    (d) => ({
      question: `What are the customs formalities for importing ${d.productName} into ${d.countryName}?`,
      answer: `Importing ${d.productName} into ${d.countryName} is subject to local customs regulations. Afrexia assists you in preparing all necessary documents: certificate of origin, phytosanitary certificate, commercial invoice, and packing list.`,
    }),
  ],
  es: [
    (d) => ({
      question: `¿Cómo exportar ${d.productName} a ${d.countryName}?`,
      answer: `La exportación de ${d.productName} a ${d.countryName} implica varios pasos: selección del producto, control de calidad, obtención de certificados fitosanitarios y organización del transporte marítimo. Afrexia gestiona todo el proceso por usted.`,
    }),
    (d) => ({
      question: `¿Qué certificaciones se requieren para exportar ${d.productName} a ${d.countryName}?`,
      answer: `${d.certifications?.length ? `Las certificaciones ${d.certifications.join(', ')} son generalmente requeridas.` : `Se requieren certificaciones fitosanitarias y de calidad.`} Contáctenos para una lista completa de documentos necesarios.`,
    }),
    (d) => ({
      question: `¿Cuál es el plazo de entrega para ${d.productName} enviado a ${d.countryName}?`,
      answer: `${d.transitDays ? `El tiempo de tránsito promedio es de ${d.transitDays} días.` : `El tiempo de tránsito varía según el puerto de destino y las condiciones logísticas.`} Este plazo es indicativo y puede variar.`,
    }),
    (d) => ({
      question: `¿Cuál es el precio del ${d.productName} camerunés para exportación a ${d.countryName}?`,
      answer: `${d.price ? `El precio indicativo es de ${d.price} ${d.currency ?? 'USD'}/tonelada.` : `El precio varía según la calidad, el volumen y las condiciones del mercado.`} Contáctenos para un presupuesto personalizado.`,
    }),
    (d) => ({
      question: `¿Cuáles son los trámites aduaneros para importar ${d.productName} en ${d.countryName}?`,
      answer: `La importación de ${d.productName} en ${d.countryName} está sujeta a las regulaciones aduaneras locales. Afrexia le ayuda a preparar todos los documentos necesarios.`,
    }),
  ],
  de: [
    (d) => ({
      question: `Wie exportiert man ${d.productName} nach ${d.countryName}?`,
      answer: `Der Export von ${d.productName} nach ${d.countryName} umfasst mehrere Schritte: Produktauswahl, Qualitätskontrolle, Einholung phytosanitärer Zertifikate und Organisation des Seetransports. Afrexia übernimmt den gesamten Prozess für Sie.`,
    }),
    (d) => ({
      question: `Welche Zertifizierungen sind für den Export von ${d.productName} nach ${d.countryName} erforderlich?`,
      answer: `${d.certifications?.length ? `Die Zertifizierungen ${d.certifications.join(', ')} sind in der Regel erforderlich.` : `Phytosanitäre und Qualitätszertifizierungen sind erforderlich.`} Kontaktieren Sie uns für eine vollständige Liste der benötigten Dokumente.`,
    }),
    (d) => ({
      question: `Wie lange dauert die Lieferung von ${d.productName} nach ${d.countryName}?`,
      answer: `${d.transitDays ? `Die durchschnittliche Transitzeit beträgt ${d.transitDays} Tage.` : `Die Transitzeit variiert je nach Zielhafen und Logistikbedingungen.`} Dies ist ein Richtwert und kann variieren.`,
    }),
    (d) => ({
      question: `Was kostet kamerunisches ${d.productName} für den Export nach ${d.countryName}?`,
      answer: `${d.price ? `Der Richtpreis beträgt ${d.price} ${d.currency ?? 'USD'}/Tonne.` : `Der Preis variiert je nach Qualität, Volumen und Marktbedingungen.`} Kontaktieren Sie unser Vertriebsteam für ein individuelles Angebot.`,
    }),
    (d) => ({
      question: `Welche Zollformalitäten gelten für die Einfuhr von ${d.productName} nach ${d.countryName}?`,
      answer: `Die Einfuhr von ${d.productName} nach ${d.countryName} unterliegt den lokalen Zollvorschriften. Afrexia unterstützt Sie bei der Vorbereitung aller erforderlichen Dokumente.`,
    }),
  ],
  ru: [
    (d) => ({
      question: `Как экспортировать ${d.productName} в ${d.countryName}?`,
      answer: `Экспорт ${d.productName} в ${d.countryName} включает несколько этапов: выбор продукта, контроль качества, получение фитосанитарных сертификатов и организация морской перевозки. Afrexia управляет всем процессом за вас.`,
    }),
    (d) => ({
      question: `Какие сертификаты необходимы для экспорта ${d.productName} в ${d.countryName}?`,
      answer: `${d.certifications?.length ? `Обычно требуются сертификаты: ${d.certifications.join(', ')}.` : `Требуются фитосанитарные и качественные сертификаты.`} Свяжитесь с нами для получения полного списка необходимых документов.`,
    }),
    (d) => ({
      question: `Каков срок доставки ${d.productName} в ${d.countryName}?`,
      answer: `${d.transitDays ? `Среднее время транзита составляет ${d.transitDays} дней.` : `Время транзита варьируется в зависимости от порта назначения и логистических условий.`} Это ориентировочный срок, который может меняться.`,
    }),
    (d) => ({
      question: `Какова цена камерунского ${d.productName} для экспорта в ${d.countryName}?`,
      answer: `${d.price ? `Ориентировочная цена: ${d.price} ${d.currency ?? 'USD'}/тонна.` : `Цена варьируется в зависимости от качества, объёма и рыночных условий.`} Свяжитесь с нашим отделом продаж для получения индивидуального предложения.`,
    }),
    (d) => ({
      question: `Каковы таможенные формальности для импорта ${d.productName} в ${d.countryName}?`,
      answer: `Импорт ${d.productName} в ${d.countryName} регулируется местным таможенным законодательством. Afrexia помогает подготовить все необходимые документы.`,
    }),
  ],
};

// ============================================================================
// Helper: count words in a string
// ============================================================================

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ============================================================================
// 1. applyLanguageFallback (Req 1.7)
// ============================================================================

/**
 * Returns the localized string value for the given locale.
 * Falls back to English if the requested locale is missing, and logs the fallback.
 */
export function applyLanguageFallback(
  localizedString: LocalizedString,
  locale: Locale,
  fieldName?: string
): string {
  const value = localizedString[locale];
  if (value) return value;

  // Fallback to English
  const fallback = localizedString[FALLBACK_LOCALE];
  if (fallback) {
    console.warn(
      `[ContentGenerator] Language fallback used: locale="${locale}" → "${FALLBACK_LOCALE}"${fieldName ? ` for field "${fieldName}"` : ''}. Add translation to improve quality.`
    );
    return fallback;
  }

  // Last resort: French (always required)
  console.warn(
    `[ContentGenerator] Language fallback to "fr": locale="${locale}"${fieldName ? ` for field "${fieldName}"` : ''}. Both "${locale}" and "en" translations are missing.`
  );
  return localizedString.fr;
}

// ============================================================================
// 2. markContentSource (Req 1.8)
// ============================================================================

/**
 * Wraps a content string into a ContentBlock with source tracking.
 */
export function markContentSource(
  content: string,
  sourceType: ContentSourceType,
  locale: Locale
): ContentBlock {
  return {
    content,
    sourceType,
    locale,
    wordCount: countWords(content),
  };
}

// ============================================================================
// 3. calculateContentLength (Req 1.6.6)
// ============================================================================

/**
 * Returns the total word count across all content blocks.
 */
export function calculateContentLength(blocks: ContentBlock[]): number {
  return blocks.reduce((sum, block) => sum + block.wordCount, 0);
}

// ============================================================================
// 4. meetsMinimumLength (Req 1.6.6)
// ============================================================================

/**
 * Returns true if the total word count meets the minimum threshold (default 500).
 */
export function meetsMinimumLength(blocks: ContentBlock[], minWords: number = MIN_CONTENT_LENGTH): boolean {
  return calculateContentLength(blocks) >= minWords;
}

// ============================================================================
// 5. calculateFallbackPercentage (Req 1.7.9)
// ============================================================================

/**
 * Returns the percentage of template blocks as a proxy for fallback content.
 * Pages with >30% template content should be marked noindex.
 */
export function calculateFallbackPercentage(blocks: ContentBlock[]): number {
  if (blocks.length === 0) return 0;
  const templateBlocks = blocks.filter((b) => b.sourceType === 'template');
  return Math.round((templateBlocks.length / blocks.length) * 100);
}

// ============================================================================
// 6. logContentDistribution (Req 1.8.4)
// ============================================================================

/**
 * Logs the content source distribution for quality audit purposes.
 */
export function logContentDistribution(blocks: ContentBlock[], pageId?: string): void {
  if (blocks.length === 0) {
    console.info(`[ContentGenerator] No content blocks${pageId ? ` for page "${pageId}"` : ''}.`);
    return;
  }

  const distribution: ContentDistribution = {
    sanity: 0,
    calculated: 0,
    template: 0,
    editorial: 0,
  };

  for (const block of blocks) {
    distribution[block.sourceType]++;
  }

  const total = blocks.length;
  const pct = (n: number) => `${Math.round((n / total) * 100)}%`;

  console.info(
    `[ContentGenerator] Content distribution${pageId ? ` for "${pageId}"` : ''}: ` +
      `sanity=${pct(distribution.sanity)} (${distribution.sanity}), ` +
      `calculated=${pct(distribution.calculated)} (${distribution.calculated}), ` +
      `template=${pct(distribution.template)} (${distribution.template}), ` +
      `editorial=${pct(distribution.editorial)} (${distribution.editorial})`
  );
}

// ============================================================================
// 7. generateDisclaimer (Req 1.10)
// ============================================================================

/**
 * Returns the appropriate disclaimer string for estimated data.
 */
export function generateDisclaimer(
  type: 'price' | 'delay' | 'logistics',
  locale: Locale
): string {
  return DISCLAIMERS[type][locale];
}

// ============================================================================
// 8. generateProductCountryIntro (Req 1.6.1, 1.6.2)
// ============================================================================

/**
 * Generates a unique introduction ContentBlock for a product × country page.
 * Selects a template variation based on the product+country combination to ensure
 * different pages get different templates (Req 1.6.7 - avoid identical phrases).
 */
export function generateProductCountryIntro(
  product: Product,
  country: ExportCountry,
  locale: Locale
): ContentBlock {
  const productName = applyLanguageFallback(product.name, locale, 'product.name');
  const countryName = applyLanguageFallback(country.name, locale, 'country.name');

  const certifications = product.certifications?.map((c) =>
    applyLanguageFallback(c.name, locale, 'certification.name')
  );

  const data: IntroTemplateData = {
    productName,
    countryName,
    transitDays: country.averageTransitTime?.days,
    certifications,
  };

  // Pick template variation deterministically based on product+country slugs
  const templates = INTRO_TEMPLATES[locale] ?? INTRO_TEMPLATES[FALLBACK_LOCALE];
  const hash = (product.slug.current + country.slug.current)
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const templateIndex = hash % templates.length;

  const introText = templates[templateIndex](data);

  // Pad to ensure meaningful contribution toward 500-word minimum
  const contextParagraph = buildContextParagraph(productName, countryName, country, locale);
  const fullContent = `${introText}\n\n${contextParagraph}`;

  return markContentSource(fullContent, 'template', locale);
}

/**
 * Builds an additional context paragraph with country-specific details.
 */
function buildContextParagraph(
  productName: string,
  countryName: string,
  country: ExportCountry,
  locale: Locale
): string {
  const paragraphs: Record<Locale, string> = {
    fr:
      `Le marché de ${countryName} représente une destination stratégique pour les exportateurs camerounais de ${productName}. ` +
      `${country.customsInfo ? applyLanguageFallback(country.customsInfo, locale, 'customsInfo') + ' ' : ''}` +
      `${country.targetMarkets?.length ? `Les principaux secteurs acheteurs incluent : ${country.targetMarkets.join(', ')}. ` : ''}` +
      `Afrexia dispose d'une expertise reconnue dans l'export de matières premières agricoles vers ${countryName}, ` +
      `avec une maîtrise complète des réglementations douanières, des normes de qualité et des exigences logistiques spécifiques à ce marché. ` +
      `Notre équipe vous accompagne de la sélection des lots jusqu'à la livraison finale, en garantissant traçabilité et conformité à chaque étape.`,

    en:
      `The ${countryName} market is a strategic destination for Cameroonian ${productName} exporters. ` +
      `${country.customsInfo ? applyLanguageFallback(country.customsInfo, locale, 'customsInfo') + ' ' : ''}` +
      `${country.targetMarkets?.length ? `Key buying sectors include: ${country.targetMarkets.join(', ')}. ` : ''}` +
      `Afrexia has recognized expertise in exporting agricultural commodities to ${countryName}, ` +
      `with full command of customs regulations, quality standards, and logistics requirements specific to this market. ` +
      `Our team supports you from batch selection to final delivery, ensuring traceability and compliance at every step.`,

    es:
      `El mercado de ${countryName} es un destino estratégico para los exportadores cameruneses de ${productName}. ` +
      `${country.targetMarkets?.length ? `Los principales sectores compradores incluyen: ${country.targetMarkets.join(', ')}. ` : ''}` +
      `Afrexia cuenta con experiencia reconocida en la exportación de materias primas agrícolas a ${countryName}, ` +
      `con pleno dominio de las regulaciones aduaneras, normas de calidad y requisitos logísticos específicos de este mercado.`,

    de:
      `Der Markt in ${countryName} ist ein strategisches Ziel für kamerunische ${productName}-Exporteure. ` +
      `${country.targetMarkets?.length ? `Zu den wichtigsten Käufersektoren gehören: ${country.targetMarkets.join(', ')}. ` : ''}` +
      `Afrexia verfügt über anerkannte Expertise beim Export landwirtschaftlicher Rohstoffe nach ${countryName}, ` +
      `mit vollständiger Beherrschung der Zollvorschriften, Qualitätsstandards und logistischen Anforderungen dieses Marktes.`,

    ru:
      `Рынок ${countryName} является стратегическим направлением для камерунских экспортёров ${productName}. ` +
      `${country.targetMarkets?.length ? `Основные покупательские секторы включают: ${country.targetMarkets.join(', ')}. ` : ''}` +
      `Afrexia обладает признанной экспертизой в экспорте сельскохозяйственного сырья в ${countryName}, ` +
      `с полным знанием таможенных правил, стандартов качества и логистических требований этого рынка.`,
  };

  return paragraphs[locale] ?? paragraphs[FALLBACK_LOCALE];
}

// ============================================================================
// 9. generateContextualFAQs (Req 1.6.5)
// ============================================================================

/**
 * Generates 3-5 unique contextual FAQs for a product × country page.
 * Selects questions based on available data to maximize relevance.
 */
export function generateContextualFAQs(
  product: Product,
  country: ExportCountry,
  locale: Locale,
  count: number = 5
): FAQ[] {
  const clampedCount = Math.max(3, Math.min(5, count));

  const productName = applyLanguageFallback(product.name, locale, 'product.name');
  const countryName = applyLanguageFallback(country.name, locale, 'country.name');

  const certifications = product.certifications?.map((c) =>
    applyLanguageFallback(c.name, locale, 'certification.name')
  );

  const data: FAQTemplateData = {
    productName,
    countryName,
    transitDays: country.averageTransitTime?.days,
    certifications,
  };

  const templates = FAQ_TEMPLATES[locale] ?? FAQ_TEMPLATES[FALLBACK_LOCALE];

  // Select up to clampedCount templates, cycling if needed
  const selected = templates.slice(0, clampedCount);

  return selected.map((template) => {
    const { question, answer } = template(data);
    return { question, answer, locale };
  });
}

// ============================================================================
// 10. Comparison Content Generation (Req 1.5)
// ============================================================================

/**
 * Comparison row for the comparison table
 */
export interface ComparisonRow {
  criterion: string;
  valueA: string;
  valueB: string;
}

/**
 * Full comparison content for a product-vs-product page
 */
export interface ComparisonContent {
  intro: ContentBlock;
  comparisonTable: ComparisonRow[];
  tasteSection: ContentBlock;
  qualitySection: ContentBlock;
  applicationsSection: ContentBlock;
  recommendations: ContentBlock;
  faqs: FAQ[];
}

// Comparison intro templates
const COMPARISON_INTRO_TEMPLATES: Record<Locale, Array<(nameA: string, nameB: string) => string>> = {
  fr: [
    (a, b) => `Vous hésitez entre le ${a} et le ${b} pour votre approvisionnement ? Cette comparaison détaillée vous aide à choisir la matière première la plus adaptée à vos besoins. Afrexia, expert en export de commodités agricoles africaines, analyse pour vous les différences clés entre ces deux produits.`,
    (a, b) => `Le ${a} et le ${b} sont deux produits phares de l'agriculture camerounaise. Bien que complémentaires, ils présentent des caractéristiques distinctes en termes de qualité, de prix et d'applications. Découvrez notre analyse comparative pour faire le meilleur choix.`,
    (a, b) => `Comparer le ${a} et le ${b} est essentiel pour tout acheteur international souhaitant optimiser sa stratégie d'approvisionnement. Afrexia vous présente une analyse objective basée sur les données du marché actuel.`,
  ],
  en: [
    (a, b) => `Choosing between ${a} and ${b} for your sourcing? This detailed comparison helps you select the most suitable commodity for your needs. Afrexia, expert in African agricultural commodity exports, analyzes the key differences between these two products.`,
    (a, b) => `${a} and ${b} are two flagship products of Cameroonian agriculture. While complementary, they have distinct characteristics in terms of quality, price, and applications. Discover our comparative analysis to make the best choice.`,
    (a, b) => `Comparing ${a} and ${b} is essential for any international buyer looking to optimize their sourcing strategy. Afrexia presents an objective analysis based on current market data.`,
  ],
  es: [
    (a, b) => `¿Dudando entre ${a} y ${b} para su aprovisionamiento? Esta comparación detallada le ayuda a elegir la materia prima más adecuada para sus necesidades. Afrexia, experto en exportación de materias primas agrícolas africanas, analiza las diferencias clave entre estos dos productos.`,
    (a, b) => `El ${a} y el ${b} son dos productos emblemáticos de la agricultura camerunesa. Aunque complementarios, presentan características distintas en términos de calidad, precio y aplicaciones.`,
    (a, b) => `Comparar ${a} y ${b} es esencial para cualquier comprador internacional que desee optimizar su estrategia de aprovisionamiento.`,
  ],
  de: [
    (a, b) => `Unentschlossen zwischen ${a} und ${b} für Ihre Beschaffung? Dieser detaillierte Vergleich hilft Ihnen, den am besten geeigneten Rohstoff für Ihre Bedürfnisse auszuwählen. Afrexia, Experte für den Export afrikanischer Agrarrohstoffe, analysiert die wichtigsten Unterschiede zwischen diesen beiden Produkten.`,
    (a, b) => `${a} und ${b} sind zwei Flaggschiffprodukte der kamerunischen Landwirtschaft. Obwohl komplementär, weisen sie unterschiedliche Merkmale in Bezug auf Qualität, Preis und Anwendungen auf.`,
    (a, b) => `Der Vergleich von ${a} und ${b} ist für jeden internationalen Käufer unerlässlich, der seine Beschaffungsstrategie optimieren möchte.`,
  ],
  ru: [
    (a, b) => `Выбираете между ${a} и ${b} для вашего снабжения? Это подробное сравнение поможет вам выбрать наиболее подходящее сырьё для ваших нужд. Afrexia, эксперт в экспорте африканского сельскохозяйственного сырья, анализирует ключевые различия между этими двумя продуктами.`,
    (a, b) => `${a} и ${b} — два флагманских продукта камерунского сельского хозяйства. Хотя они дополняют друг друга, они имеют различные характеристики с точки зрения качества, цены и применения.`,
    (a, b) => `Сравнение ${a} и ${b} необходимо для любого международного покупателя, стремящегося оптимизировать свою стратегию закупок.`,
  ],
};

// Taste/quality/applications section templates
const TASTE_TEMPLATES: Record<Locale, (nameA: string, nameB: string) => string> = {
  fr: (a, b) =>
    `Le ${a} et le ${b} présentent des profils organoleptiques distincts. Le ${a} camerounais est reconnu pour ses arômes intenses et sa richesse en matière grasse, idéal pour les applications chocolatières haut de gamme. Le ${b}, quant à lui, offre des notes aromatiques complexes appréciées par les torréfacteurs et les industriels de l'agroalimentaire. Ces différences de goût influencent directement les choix des acheteurs selon leurs marchés finaux.`,
  en: (a, b) =>
    `${a} and ${b} present distinct organoleptic profiles. Cameroonian ${a} is recognized for its intense aromas and high fat content, ideal for premium chocolate applications. ${b}, on the other hand, offers complex aromatic notes appreciated by roasters and food industry professionals. These taste differences directly influence buyer choices based on their end markets.`,
  es: (a, b) =>
    `El ${a} y el ${b} presentan perfiles organolépticos distintos. El ${a} camerunés es reconocido por sus aromas intensos y su alto contenido en grasa, ideal para aplicaciones chocolateras de alta gama. El ${b}, por su parte, ofrece notas aromáticas complejas apreciadas por los tostadores y los industriales de la agroalimentación.`,
  de: (a, b) =>
    `${a} und ${b} weisen unterschiedliche organoleptische Profile auf. Kamerunisches ${a} ist für seine intensiven Aromen und seinen hohen Fettgehalt bekannt, ideal für Premium-Schokoladenanwendungen. ${b} hingegen bietet komplexe Aromennoten, die von Röstern und Lebensmittelindustriellen geschätzt werden.`,
  ru: (a, b) =>
    `${a} и ${b} имеют различные органолептические профили. Камерунский ${a} известен своими интенсивными ароматами и высоким содержанием жира, идеально подходит для премиальных шоколадных изделий. ${b}, в свою очередь, предлагает сложные ароматические ноты, ценимые обжарщиками и специалистами пищевой промышленности.`,
};

const QUALITY_TEMPLATES: Record<Locale, (nameA: string, nameB: string) => string> = {
  fr: (a, b) =>
    `En termes de qualité, le ${a} et le ${b} camerounais répondent tous deux aux standards internationaux les plus exigeants. Le ${a} bénéficie de certifications reconnues (Rainforest Alliance, Fair Trade, Bio) qui garantissent des pratiques durables et une traçabilité complète. Le ${b} est soumis à des contrôles rigoureux de teneur en humidité, de granulométrie et d'absence de défauts. Afrexia assure un contrôle qualité systématique avant chaque expédition pour garantir la conformité aux spécifications de l'acheteur.`,
  en: (a, b) =>
    `In terms of quality, both Cameroonian ${a} and ${b} meet the most demanding international standards. ${a} benefits from recognized certifications (Rainforest Alliance, Fair Trade, Organic) that guarantee sustainable practices and full traceability. ${b} is subject to rigorous controls for moisture content, granulometry, and absence of defects. Afrexia ensures systematic quality control before each shipment to guarantee compliance with buyer specifications.`,
  es: (a, b) =>
    `En términos de calidad, tanto el ${a} como el ${b} cameruneses cumplen con los estándares internacionales más exigentes. El ${a} se beneficia de certificaciones reconocidas que garantizan prácticas sostenibles y trazabilidad completa. El ${b} está sujeto a controles rigurosos de contenido de humedad, granulometría y ausencia de defectos.`,
  de: (a, b) =>
    `In Bezug auf die Qualität erfüllen sowohl kamerunisches ${a} als auch ${b} die anspruchsvollsten internationalen Standards. ${a} profitiert von anerkannten Zertifizierungen, die nachhaltige Praktiken und vollständige Rückverfolgbarkeit garantieren. ${b} unterliegt strengen Kontrollen hinsichtlich Feuchtigkeitsgehalt, Granulometrie und Fehlerfreiheit.`,
  ru: (a, b) =>
    `С точки зрения качества, как камерунский ${a}, так и ${b} соответствуют самым строгим международным стандартам. ${a} имеет признанные сертификаты, гарантирующие устойчивые практики и полную прослеживаемость. ${b} подвергается строгому контролю влажности, гранулометрии и отсутствия дефектов.`,
};

const APPLICATIONS_TEMPLATES: Record<Locale, (nameA: string, nameB: string) => string> = {
  fr: (a, b) =>
    `Les applications industrielles du ${a} et du ${b} sont complémentaires. Le ${a} est principalement utilisé dans la fabrication de chocolat, de beurre de cacao, de poudre de cacao et de produits cosmétiques. Le ${b} trouve ses débouchés dans la torréfaction, l'industrie des boissons, la confiserie et l'extraction d'huile. Le choix entre ces deux produits dépend donc directement de votre secteur d'activité et de vos besoins de transformation.`,
  en: (a, b) =>
    `The industrial applications of ${a} and ${b} are complementary. ${a} is primarily used in the manufacture of chocolate, cocoa butter, cocoa powder, and cosmetic products. ${b} finds its outlets in roasting, the beverage industry, confectionery, and oil extraction. The choice between these two products therefore depends directly on your industry sector and processing needs.`,
  es: (a, b) =>
    `Las aplicaciones industriales del ${a} y del ${b} son complementarias. El ${a} se utiliza principalmente en la fabricación de chocolate, manteca de cacao, cacao en polvo y productos cosméticos. El ${b} encuentra sus salidas en la torrefacción, la industria de bebidas, la confitería y la extracción de aceite.`,
  de: (a, b) =>
    `Die industriellen Anwendungen von ${a} und ${b} sind komplementär. ${a} wird hauptsächlich bei der Herstellung von Schokolade, Kakaobutter, Kakaopulver und Kosmetikprodukten verwendet. ${b} findet seine Absatzmärkte in der Rösterei, der Getränkeindustrie, der Süßwarenindustrie und der Ölgewinnung.`,
  ru: (a, b) =>
    `Промышленные применения ${a} и ${b} дополняют друг друга. ${a} в основном используется при производстве шоколада, какао-масла, какао-порошка и косметических продуктов. ${b} находит применение в обжарке, производстве напитков, кондитерской промышленности и извлечении масла.`,
};

const RECOMMENDATIONS_TEMPLATES: Record<Locale, (nameA: string, nameB: string) => string> = {
  fr: (a, b) =>
    `Notre recommandation : si vous êtes chocolatier, confiseur ou acteur de l'industrie cosmétique, le ${a} camerounais est le choix optimal. Si vous opérez dans la torréfaction, la restauration ou l'industrie des boissons, le ${b} répondra mieux à vos besoins. Dans tous les cas, Afrexia vous accompagne pour sécuriser votre approvisionnement avec des produits de qualité certifiée, des délais maîtrisés et une logistique fiable. Contactez notre équipe commerciale pour un devis personnalisé.`,
  en: (a, b) =>
    `Our recommendation: if you are a chocolatier, confectioner, or cosmetics industry player, Cameroonian ${a} is the optimal choice. If you operate in roasting, food service, or the beverage industry, ${b} will better meet your needs. In all cases, Afrexia supports you in securing your supply with certified quality products, controlled lead times, and reliable logistics. Contact our sales team for a personalized quote.`,
  es: (a, b) =>
    `Nuestra recomendación: si es chocolatero, confitero o actor de la industria cosmética, el ${a} camerunés es la elección óptima. Si opera en la torrefacción, la restauración o la industria de bebidas, el ${b} satisfará mejor sus necesidades. En todos los casos, Afrexia le acompaña para asegurar su aprovisionamiento.`,
  de: (a, b) =>
    `Unsere Empfehlung: Wenn Sie Chocolatier, Konditor oder in der Kosmetikindustrie tätig sind, ist kamerunisches ${a} die optimale Wahl. Wenn Sie in der Rösterei, der Gastronomie oder der Getränkeindustrie tätig sind, wird ${b} Ihre Bedürfnisse besser erfüllen. In jedem Fall unterstützt Afrexia Sie bei der Sicherung Ihrer Versorgung.`,
  ru: (a, b) =>
    `Наша рекомендация: если вы шоколатье, кондитер или работаете в косметической промышленности, камерунский ${a} является оптимальным выбором. Если вы работаете в обжарке, общественном питании или производстве напитков, ${b} лучше удовлетворит ваши потребности. В любом случае, Afrexia поддерживает вас в обеспечении поставок.`,
};

// Comparison FAQ templates
const COMPARISON_FAQ_TEMPLATES: Record<Locale, Array<(nameA: string, nameB: string) => { question: string; answer: string }>> = {
  fr: [
    (a, b) => ({
      question: `Quelle est la différence principale entre le ${a} et le ${b} ?`,
      answer: `Le ${a} et le ${b} diffèrent principalement par leurs applications industrielles, leurs profils aromatiques et leurs structures de prix. Le ${a} est davantage orienté vers la chocolaterie et la cosmétique, tandis que le ${b} est privilégié pour la torréfaction et les boissons.`,
    }),
    (a, b) => ({
      question: `Lequel du ${a} ou du ${b} est le plus rentable à importer ?`,
      answer: `La rentabilité dépend de votre secteur d'activité et de vos volumes. Le ${a} présente généralement des prix plus élevés mais une valeur ajoutée supérieure dans les applications premium. Le ${b} offre des volumes plus importants et une demande plus régulière. Contactez Afrexia pour une analyse personnalisée.`,
    }),
    (a, b) => ({
      question: `Peut-on importer du ${a} et du ${b} simultanément depuis le Cameroun ?`,
      answer: `Oui, Afrexia peut gérer des commandes mixtes de ${a} et de ${b} dans le même conteneur ou en expéditions séparées selon vos besoins. Nous optimisons la logistique pour réduire vos coûts d'approvisionnement.`,
    }),
    (a, b) => ({
      question: `Quelles certifications sont disponibles pour le ${a} et le ${b} camerounais ?`,
      answer: `Les deux produits peuvent être fournis avec des certifications Rainforest Alliance, Fair Trade et Bio selon les lots disponibles. Afrexia vous informe des certifications disponibles pour chaque commande.`,
    }),
    (a, b) => ({
      question: `Comment choisir entre ${a} et ${b} pour mon industrie ?`,
      answer: `Le choix dépend de votre usage final : le ${a} est idéal pour la chocolaterie, la cosmétique et les produits premium. Le ${b} convient mieux à la torréfaction, les boissons et l'alimentation générale. Notre équipe peut vous conseiller selon vos spécifications techniques.`,
    }),
  ],
  en: [
    (a, b) => ({
      question: `What is the main difference between ${a} and ${b}?`,
      answer: `${a} and ${b} differ mainly in their industrial applications, aromatic profiles, and price structures. ${a} is more oriented towards chocolate-making and cosmetics, while ${b} is preferred for roasting and beverages.`,
    }),
    (a, b) => ({
      question: `Which is more profitable to import, ${a} or ${b}?`,
      answer: `Profitability depends on your industry sector and volumes. ${a} generally commands higher prices but offers superior added value in premium applications. ${b} offers larger volumes and more regular demand. Contact Afrexia for a personalized analysis.`,
    }),
    (a, b) => ({
      question: `Can I import ${a} and ${b} simultaneously from Cameroon?`,
      answer: `Yes, Afrexia can handle mixed orders of ${a} and ${b} in the same container or separate shipments according to your needs. We optimize logistics to reduce your sourcing costs.`,
    }),
    (a, b) => ({
      question: `What certifications are available for Cameroonian ${a} and ${b}?`,
      answer: `Both products can be supplied with Rainforest Alliance, Fair Trade, and Organic certifications depending on available batches. Afrexia informs you of available certifications for each order.`,
    }),
    (a, b) => ({
      question: `How do I choose between ${a} and ${b} for my industry?`,
      answer: `The choice depends on your end use: ${a} is ideal for chocolate-making, cosmetics, and premium products. ${b} is better suited for roasting, beverages, and general food. Our team can advise you based on your technical specifications.`,
    }),
  ],
  es: [
    (a, b) => ({
      question: `¿Cuál es la diferencia principal entre ${a} y ${b}?`,
      answer: `El ${a} y el ${b} difieren principalmente en sus aplicaciones industriales, perfiles aromáticos y estructuras de precios. El ${a} está más orientado hacia la chocolatería y la cosmética, mientras que el ${b} se prefiere para la torrefacción y las bebidas.`,
    }),
    (a, b) => ({
      question: `¿Cuál es más rentable importar, ${a} o ${b}?`,
      answer: `La rentabilidad depende de su sector de actividad y sus volúmenes. Contacte a Afrexia para un análisis personalizado.`,
    }),
    (a, b) => ({
      question: `¿Puedo importar ${a} y ${b} simultáneamente desde Camerún?`,
      answer: `Sí, Afrexia puede gestionar pedidos mixtos de ${a} y ${b} en el mismo contenedor o en envíos separados según sus necesidades.`,
    }),
    (a, b) => ({
      question: `¿Qué certificaciones están disponibles para el ${a} y ${b} cameruneses?`,
      answer: `Ambos productos pueden suministrarse con certificaciones Rainforest Alliance, Fair Trade y Bio según los lotes disponibles.`,
    }),
    (a, b) => ({
      question: `¿Cómo elegir entre ${a} y ${b} para mi industria?`,
      answer: `La elección depende de su uso final. Nuestro equipo puede asesorarle según sus especificaciones técnicas.`,
    }),
  ],
  de: [
    (a, b) => ({
      question: `Was ist der Hauptunterschied zwischen ${a} und ${b}?`,
      answer: `${a} und ${b} unterscheiden sich hauptsächlich in ihren industriellen Anwendungen, aromatischen Profilen und Preisstrukturen. ${a} ist stärker auf die Schokoladen- und Kosmetikherstellung ausgerichtet, während ${b} für das Rösten und Getränke bevorzugt wird.`,
    }),
    (a, b) => ({
      question: `Was ist rentabler zu importieren, ${a} oder ${b}?`,
      answer: `Die Rentabilität hängt von Ihrem Industriesektor und Ihren Volumina ab. Kontaktieren Sie Afrexia für eine personalisierte Analyse.`,
    }),
    (a, b) => ({
      question: `Kann ich ${a} und ${b} gleichzeitig aus Kamerun importieren?`,
      answer: `Ja, Afrexia kann gemischte Bestellungen von ${a} und ${b} im selben Container oder in separaten Sendungen je nach Ihren Bedürfnissen abwickeln.`,
    }),
    (a, b) => ({
      question: `Welche Zertifizierungen sind für kamerunisches ${a} und ${b} verfügbar?`,
      answer: `Beide Produkte können je nach verfügbaren Chargen mit Rainforest Alliance-, Fair Trade- und Bio-Zertifizierungen geliefert werden.`,
    }),
    (a, b) => ({
      question: `Wie wähle ich zwischen ${a} und ${b} für meine Industrie?`,
      answer: `Die Wahl hängt von Ihrer Endverwendung ab. Unser Team kann Sie basierend auf Ihren technischen Spezifikationen beraten.`,
    }),
  ],
  ru: [
    (a, b) => ({
      question: `В чём основное различие между ${a} и ${b}?`,
      answer: `${a} и ${b} различаются главным образом по промышленным применениям, ароматическим профилям и ценовым структурам. ${a} больше ориентирован на производство шоколада и косметики, тогда как ${b} предпочтителен для обжарки и напитков.`,
    }),
    (a, b) => ({
      question: `Что выгоднее импортировать, ${a} или ${b}?`,
      answer: `Рентабельность зависит от вашего отраслевого сектора и объёмов. Свяжитесь с Afrexia для персонализированного анализа.`,
    }),
    (a, b) => ({
      question: `Можно ли одновременно импортировать ${a} и ${b} из Камеруна?`,
      answer: `Да, Afrexia может обрабатывать смешанные заказы ${a} и ${b} в одном контейнере или отдельными отправками в зависимости от ваших потребностей.`,
    }),
    (a, b) => ({
      question: `Какие сертификаты доступны для камерунских ${a} и ${b}?`,
      answer: `Оба продукта могут поставляться с сертификатами Rainforest Alliance, Fair Trade и Organic в зависимости от доступных партий.`,
    }),
    (a, b) => ({
      question: `Как выбрать между ${a} и ${b} для моей отрасли?`,
      answer: `Выбор зависит от вашего конечного использования. Наша команда может проконсультировать вас на основе ваших технических спецификаций.`,
    }),
  ],
};

/**
 * Generates comparison table rows for two products.
 * Req 1.5.3 — comparison table with price, quality, certifications, availability
 */
export function generateComparisonTable(
  productA: Product,
  productB: Product,
  locale: Locale
): ComparisonRow[] {
  const nameA = applyLanguageFallback(productA.name, locale, 'productA.name');
  const nameB = applyLanguageFallback(productB.name, locale, 'productB.name');

  const certsA = productA.certifications?.map((c) => applyLanguageFallback(c.name, locale, 'cert.name')).join(', ') ?? '—';
  const certsB = productB.certifications?.map((c) => applyLanguageFallback(c.name, locale, 'cert.name')).join(', ') ?? '—';

  const labels: Record<Locale, { price: string; quality: string; certifications: string; availability: string; origin: string; applications: string }> = {
    fr: { price: 'Prix indicatif', quality: 'Qualité', certifications: 'Certifications', availability: 'Disponibilité', origin: 'Origine', applications: 'Applications principales' },
    en: { price: 'Indicative price', quality: 'Quality', certifications: 'Certifications', availability: 'Availability', origin: 'Origin', applications: 'Main applications' },
    es: { price: 'Precio indicativo', quality: 'Calidad', certifications: 'Certificaciones', availability: 'Disponibilidad', origin: 'Origen', applications: 'Aplicaciones principales' },
    de: { price: 'Richtpreis', quality: 'Qualität', certifications: 'Zertifizierungen', availability: 'Verfügbarkeit', origin: 'Herkunft', applications: 'Hauptanwendungen' },
    ru: { price: 'Ориентировочная цена', quality: 'Качество', certifications: 'Сертификаты', availability: 'Доступность', origin: 'Происхождение', applications: 'Основные применения' },
  };

  const availableLabel: Record<Locale, string> = {
    fr: 'Disponible toute l\'année',
    en: 'Available year-round',
    es: 'Disponible todo el año',
    de: 'Ganzjährig verfügbar',
    ru: 'Доступен круглый год',
  };

  const qualityLabel: Record<Locale, string> = {
    fr: 'Qualité export premium',
    en: 'Premium export quality',
    es: 'Calidad de exportación premium',
    de: 'Premium-Exportqualität',
    ru: 'Премиальное экспортное качество',
  };

  const l = labels[locale] ?? labels.fr;

  return [
    { criterion: l.origin, valueA: 'Cameroun', valueB: 'Cameroun' },
    { criterion: l.quality, valueA: qualityLabel[locale] ?? qualityLabel.fr, valueB: qualityLabel[locale] ?? qualityLabel.fr },
    { criterion: l.certifications, valueA: certsA, valueB: certsB },
    { criterion: l.availability, valueA: availableLabel[locale] ?? availableLabel.fr, valueB: availableLabel[locale] ?? availableLabel.fr },
    { criterion: l.applications, valueA: nameA, valueB: nameB },
  ];
}

/**
 * Generates full comparison content for a product-vs-product page.
 * Req 1.5.3, 1.5.4, 1.5.5
 */
export function generateComparisonContent(
  productA: Product,
  productB: Product,
  locale: Locale
): ComparisonContent {
  const nameA = applyLanguageFallback(productA.name, locale, 'productA.name');
  const nameB = applyLanguageFallback(productB.name, locale, 'productB.name');

  // Pick intro template deterministically
  const introTemplates = COMPARISON_INTRO_TEMPLATES[locale] ?? COMPARISON_INTRO_TEMPLATES.en;
  const hash = (productA.slug.current + productB.slug.current)
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const introText = introTemplates[hash % introTemplates.length](nameA, nameB);

  const intro = markContentSource(introText, 'template', locale);
  const tasteSection = markContentSource(TASTE_TEMPLATES[locale]?.(nameA, nameB) ?? TASTE_TEMPLATES.en(nameA, nameB), 'template', locale);
  const qualitySection = markContentSource(QUALITY_TEMPLATES[locale]?.(nameA, nameB) ?? QUALITY_TEMPLATES.en(nameA, nameB), 'template', locale);
  const applicationsSection = markContentSource(APPLICATIONS_TEMPLATES[locale]?.(nameA, nameB) ?? APPLICATIONS_TEMPLATES.en(nameA, nameB), 'template', locale);
  const recommendations = markContentSource(RECOMMENDATIONS_TEMPLATES[locale]?.(nameA, nameB) ?? RECOMMENDATIONS_TEMPLATES.en(nameA, nameB), 'template', locale);

  const comparisonTable = generateComparisonTable(productA, productB, locale);

  // Generate FAQs (3-5)
  const faqTemplates = COMPARISON_FAQ_TEMPLATES[locale] ?? COMPARISON_FAQ_TEMPLATES.en;
  const faqs: FAQ[] = faqTemplates.slice(0, 5).map((tpl) => {
    const { question, answer } = tpl(nameA, nameB);
    return { question, answer, locale };
  });

  return {
    intro,
    comparisonTable,
    tasteSection,
    qualitySection,
    applicationsSection,
    recommendations,
    faqs,
  };
}
