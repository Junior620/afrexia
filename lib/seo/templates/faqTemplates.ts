/**
 * FAQ Templates
 *
 * Provides contextual FAQ templates for each page type:
 *  - productCountry: product × country export pages
 *  - price: real-time price pages
 *  - comparison: product vs product comparison guides
 *
 * Each page type has 5 questions per locale (3-5 selected at runtime based on available data).
 *
 * @see Requirements 1.6.5, 2.5
 */

import type { Locale } from '@/types/seo';

// ============================================================================
// Types
// ============================================================================

export interface FAQItem {
  question: string;
  answer: string;
}

export type FAQTemplateData = {
  productName: string;
  countryName?: string;
  transitDays?: number;
  certifications?: string[];
  price?: number;
  currency?: string;
  priceVariation?: number; // percentage change
  priceTrend?: 'up' | 'down' | 'stable';
  productNameB?: string; // for comparison pages
};

export type FAQTemplateFn = (data: FAQTemplateData) => FAQItem;

export type PageType = 'productCountry' | 'price' | 'comparison';

// ============================================================================
// Product × Country FAQ templates (5 per locale)
// ============================================================================

const PRODUCT_COUNTRY_FAQ_FR: FAQTemplateFn[] = [
  (d) => ({
    question: `Comment exporter du ${d.productName} vers ${d.countryName} ?`,
    answer:
      `L'exportation de ${d.productName} vers ${d.countryName} nécessite plusieurs étapes : sélection du produit, ` +
      `contrôle qualité, obtention des certificats phytosanitaires, et organisation du transport maritime. ` +
      `Afrexia gère l'ensemble de ce processus pour vous, de la récolte jusqu'à la livraison au port de destination.`,
  }),
  (d) => ({
    question: `Quelles certifications sont requises pour exporter du ${d.productName} vers ${d.countryName} ?`,
    answer:
      `${d.certifications?.length
        ? `Les certifications ${d.certifications.join(', ')} sont généralement requises pour l'export de ${d.productName} vers ${d.countryName}.`
        : `Des certifications phytosanitaires et de qualité sont requises pour l'export de ${d.productName} vers ${d.countryName}.`
      } Contactez-nous pour une liste complète des documents nécessaires selon votre volume et votre incoterm.`,
  }),
  (d) => ({
    question: `Quel est le délai de livraison pour du ${d.productName} expédié vers ${d.countryName} ?`,
    answer:
      `${d.transitDays
        ? `Le délai de transit moyen est de ${d.transitDays} jours.`
        : `Le délai de transit varie selon le port de destination et les conditions logistiques.`
      } Ce délai est indicatif et peut varier selon les conditions de transport et les formalités douanières. ` +
      `Afrexia vous communique un calendrier précis lors de la confirmation de commande.`,
  }),
  (d) => ({
    question: `Quel est le prix du ${d.productName} camerounais pour l'export vers ${d.countryName} ?`,
    answer:
      `${d.price
        ? `Le prix indicatif est de ${d.price} ${d.currency ?? 'USD'}/tonne.`
        : `Le prix du ${d.productName} varie selon la qualité, le volume et les conditions du marché.`
      } Contactez notre équipe commerciale pour obtenir un devis personnalisé adapté à vos besoins et à votre incoterm.`,
  }),
  (d) => ({
    question: `Quelles sont les formalités douanières pour importer du ${d.productName} en ${d.countryName} ?`,
    answer:
      `L'importation de ${d.productName} en ${d.countryName} est soumise aux réglementations douanières locales. ` +
      `Afrexia vous accompagne dans la préparation de tous les documents nécessaires : certificat d'origine, ` +
      `certificat phytosanitaire, facture commerciale et liste de colisage. Nous travaillons avec des transitaires ` +
      `locaux pour faciliter le dédouanement à l'arrivée.`,
  }),
];

const PRODUCT_COUNTRY_FAQ_EN: FAQTemplateFn[] = [
  (d) => ({
    question: `How to export ${d.productName} to ${d.countryName}?`,
    answer:
      `Exporting ${d.productName} to ${d.countryName} involves several steps: product selection, quality control, ` +
      `obtaining phytosanitary certificates, and arranging maritime transport. ` +
      `Afrexia manages the entire process for you, from harvest to delivery at the destination port.`,
  }),
  (d) => ({
    question: `What certifications are required to export ${d.productName} to ${d.countryName}?`,
    answer:
      `${d.certifications?.length
        ? `The ${d.certifications.join(', ')} certifications are generally required for exporting ${d.productName} to ${d.countryName}.`
        : `Phytosanitary and quality certifications are required for exporting ${d.productName} to ${d.countryName}.`
      } Contact us for a complete list of required documents based on your volume and incoterm.`,
  }),
  (d) => ({
    question: `What is the delivery time for ${d.productName} shipped to ${d.countryName}?`,
    answer:
      `${d.transitDays
        ? `The average transit time is ${d.transitDays} days.`
        : `Transit time varies depending on the destination port and logistics conditions.`
      } This is an indicative timeframe and may vary based on transport conditions and customs formalities. ` +
      `Afrexia provides a precise schedule upon order confirmation.`,
  }),
  (d) => ({
    question: `What is the price of Cameroonian ${d.productName} for export to ${d.countryName}?`,
    answer:
      `${d.price
        ? `The indicative price is ${d.price} ${d.currency ?? 'USD'}/tonne.`
        : `The price of ${d.productName} varies based on quality, volume, and market conditions.`
      } Contact our sales team for a personalized quote tailored to your needs and incoterm.`,
  }),
  (d) => ({
    question: `What are the customs formalities for importing ${d.productName} into ${d.countryName}?`,
    answer:
      `Importing ${d.productName} into ${d.countryName} is subject to local customs regulations. ` +
      `Afrexia assists you in preparing all necessary documents: certificate of origin, phytosanitary certificate, ` +
      `commercial invoice, and packing list. We work with local freight forwarders to facilitate customs clearance on arrival.`,
  }),
];

const PRODUCT_COUNTRY_FAQ_ES: FAQTemplateFn[] = [
  (d) => ({
    question: `¿Cómo exportar ${d.productName} a ${d.countryName}?`,
    answer:
      `La exportación de ${d.productName} a ${d.countryName} implica varios pasos: selección del producto, ` +
      `control de calidad, obtención de certificados fitosanitarios y organización del transporte marítimo. ` +
      `Afrexia gestiona todo el proceso por usted, desde la cosecha hasta la entrega en el puerto de destino.`,
  }),
  (d) => ({
    question: `¿Qué certificaciones se requieren para exportar ${d.productName} a ${d.countryName}?`,
    answer:
      `${d.certifications?.length
        ? `Las certificaciones ${d.certifications.join(', ')} son generalmente requeridas.`
        : `Se requieren certificaciones fitosanitarias y de calidad.`
      } Contáctenos para una lista completa de documentos necesarios según su volumen e incoterm.`,
  }),
  (d) => ({
    question: `¿Cuál es el plazo de entrega para ${d.productName} enviado a ${d.countryName}?`,
    answer:
      `${d.transitDays
        ? `El tiempo de tránsito promedio es de ${d.transitDays} días.`
        : `El tiempo de tránsito varía según el puerto de destino y las condiciones logísticas.`
      } Este plazo es indicativo y puede variar. Afrexia le proporciona un calendario preciso al confirmar el pedido.`,
  }),
  (d) => ({
    question: `¿Cuál es el precio del ${d.productName} camerunés para exportación a ${d.countryName}?`,
    answer:
      `${d.price
        ? `El precio indicativo es de ${d.price} ${d.currency ?? 'USD'}/tonelada.`
        : `El precio varía según la calidad, el volumen y las condiciones del mercado.`
      } Contáctenos para un presupuesto personalizado adaptado a sus necesidades e incoterm.`,
  }),
  (d) => ({
    question: `¿Cuáles son los trámites aduaneros para importar ${d.productName} en ${d.countryName}?`,
    answer:
      `La importación de ${d.productName} en ${d.countryName} está sujeta a las regulaciones aduaneras locales. ` +
      `Afrexia le ayuda a preparar todos los documentos necesarios: certificado de origen, certificado fitosanitario, ` +
      `factura comercial y lista de empaque.`,
  }),
];

const PRODUCT_COUNTRY_FAQ_DE: FAQTemplateFn[] = [
  (d) => ({
    question: `Wie exportiert man ${d.productName} nach ${d.countryName}?`,
    answer:
      `Der Export von ${d.productName} nach ${d.countryName} umfasst mehrere Schritte: Produktauswahl, Qualitätskontrolle, ` +
      `Einholung phytosanitärer Zertifikate und Organisation des Seetransports. ` +
      `Afrexia übernimmt den gesamten Prozess für Sie, von der Ernte bis zur Lieferung im Zielhafen.`,
  }),
  (d) => ({
    question: `Welche Zertifizierungen sind für den Export von ${d.productName} nach ${d.countryName} erforderlich?`,
    answer:
      `${d.certifications?.length
        ? `Die Zertifizierungen ${d.certifications.join(', ')} sind in der Regel erforderlich.`
        : `Phytosanitäre und Qualitätszertifizierungen sind erforderlich.`
      } Kontaktieren Sie uns für eine vollständige Liste der benötigten Dokumente je nach Volumen und Incoterm.`,
  }),
  (d) => ({
    question: `Wie lange dauert die Lieferung von ${d.productName} nach ${d.countryName}?`,
    answer:
      `${d.transitDays
        ? `Die durchschnittliche Transitzeit beträgt ${d.transitDays} Tage.`
        : `Die Transitzeit variiert je nach Zielhafen und Logistikbedingungen.`
      } Dies ist ein Richtwert und kann variieren. Afrexia teilt Ihnen bei Auftragsbestätigung einen genauen Zeitplan mit.`,
  }),
  (d) => ({
    question: `Was kostet kamerunisches ${d.productName} für den Export nach ${d.countryName}?`,
    answer:
      `${d.price
        ? `Der Richtpreis beträgt ${d.price} ${d.currency ?? 'USD'}/Tonne.`
        : `Der Preis variiert je nach Qualität, Volumen und Marktbedingungen.`
      } Kontaktieren Sie unser Vertriebsteam für ein individuelles Angebot entsprechend Ihren Anforderungen.`,
  }),
  (d) => ({
    question: `Welche Zollformalitäten gelten für die Einfuhr von ${d.productName} nach ${d.countryName}?`,
    answer:
      `Die Einfuhr von ${d.productName} nach ${d.countryName} unterliegt den lokalen Zollvorschriften. ` +
      `Afrexia unterstützt Sie bei der Vorbereitung aller erforderlichen Dokumente: Ursprungszeugnis, ` +
      `phytosanitäres Zertifikat, Handelsrechnung und Packliste.`,
  }),
];

const PRODUCT_COUNTRY_FAQ_RU: FAQTemplateFn[] = [
  (d) => ({
    question: `Как экспортировать ${d.productName} в ${d.countryName}?`,
    answer:
      `Экспорт ${d.productName} в ${d.countryName} включает несколько этапов: выбор продукта, контроль качества, ` +
      `получение фитосанитарных сертификатов и организация морской перевозки. ` +
      `Afrexia управляет всем процессом за вас — от сбора урожая до доставки в порт назначения.`,
  }),
  (d) => ({
    question: `Какие сертификаты необходимы для экспорта ${d.productName} в ${d.countryName}?`,
    answer:
      `${d.certifications?.length
        ? `Обычно требуются сертификаты: ${d.certifications.join(', ')}.`
        : `Требуются фитосанитарные и качественные сертификаты.`
      } Свяжитесь с нами для получения полного списка необходимых документов в зависимости от объёма и инкотерма.`,
  }),
  (d) => ({
    question: `Каков срок доставки ${d.productName} в ${d.countryName}?`,
    answer:
      `${d.transitDays
        ? `Среднее время транзита составляет ${d.transitDays} дней.`
        : `Время транзита варьируется в зависимости от порта назначения и логистических условий.`
      } Это ориентировочный срок, который может меняться. Afrexia предоставит точный график при подтверждении заказа.`,
  }),
  (d) => ({
    question: `Какова цена камерунского ${d.productName} для экспорта в ${d.countryName}?`,
    answer:
      `${d.price
        ? `Ориентировочная цена: ${d.price} ${d.currency ?? 'USD'}/тонна.`
        : `Цена варьируется в зависимости от качества, объёма и рыночных условий.`
      } Свяжитесь с нашим отделом продаж для получения индивидуального предложения.`,
  }),
  (d) => ({
    question: `Каковы таможенные формальности для импорта ${d.productName} в ${d.countryName}?`,
    answer:
      `Импорт ${d.productName} в ${d.countryName} регулируется местным таможенным законодательством. ` +
      `Afrexia помогает подготовить все необходимые документы: сертификат происхождения, фитосанитарный сертификат, ` +
      `коммерческий счёт и упаковочный лист.`,
  }),
];

// ============================================================================
// Price page FAQ templates (5 per locale)
// ============================================================================

const PRICE_FAQ_FR: FAQTemplateFn[] = [
  (d) => ({
    question: `Quel est le prix actuel du ${d.productName} camerounais ?`,
    answer:
      `${d.price
        ? `Le prix indicatif actuel du ${d.productName} camerounais est de ${d.price} ${d.currency ?? 'USD'}/tonne.`
        : `Le prix du ${d.productName} camerounais fluctue en fonction des conditions du marché mondial.`
      } Ce prix est indicatif et peut varier selon la qualité, le volume et l'incoterm choisi. Contactez-nous pour un devis précis.`,
  }),
  (d) => ({
    question: `Comment évolue le prix du ${d.productName} sur les 30 derniers jours ?`,
    answer:
      `${d.priceTrend === 'up'
        ? `Le prix du ${d.productName} est en hausse${d.priceVariation ? ` de ${d.priceVariation}%` : ''} sur les 30 derniers jours.`
        : d.priceTrend === 'down'
          ? `Le prix du ${d.productName} est en baisse${d.priceVariation ? ` de ${d.priceVariation}%` : ''} sur les 30 derniers jours.`
          : `Le prix du ${d.productName} est resté stable sur les 30 derniers jours.`
      } Ces variations reflètent les conditions du marché mondial des matières premières agricoles.`,
  }),
  (d) => ({
    question: `Quels facteurs influencent le prix du ${d.productName} camerounais ?`,
    answer:
      `Le prix du ${d.productName} camerounais est influencé par plusieurs facteurs : les conditions climatiques ` +
      `(pluviométrie, températures), la demande mondiale, les cours des devises (USD/EUR), les coûts logistiques ` +
      `et les politiques d'exportation. La qualité du lot (grade, humidité, défauts) joue également un rôle majeur.`,
  }),
  (d) => ({
    question: `Comment obtenir un prix ferme pour du ${d.productName} camerounais ?`,
    answer:
      `Pour obtenir un prix ferme, contactez notre équipe commerciale avec vos spécifications : volume souhaité, ` +
      `qualité requise, incoterm, port de destination et délai de livraison. Nous vous fournirons une offre ferme ` +
      `valable 48 heures, basée sur les cours du marché au moment de votre demande.`,
  }),
  (d) => ({
    question: `Le prix du ${d.productName} inclut-il les frais de transport ?`,
    answer:
      `Le prix affiché est généralement un prix FOB (Free On Board) Douala, qui n'inclut pas le fret maritime. ` +
      `Selon l'incoterm choisi (CIF, CFR, DAP), les frais de transport et d'assurance peuvent être inclus. ` +
      `Afrexia peut vous proposer des prix CIF pour les principaux ports de destination.`,
  }),
];

const PRICE_FAQ_EN: FAQTemplateFn[] = [
  (d) => ({
    question: `What is the current price of Cameroonian ${d.productName}?`,
    answer:
      `${d.price
        ? `The current indicative price of Cameroonian ${d.productName} is ${d.price} ${d.currency ?? 'USD'}/tonne.`
        : `The price of Cameroonian ${d.productName} fluctuates based on global market conditions.`
      } This price is indicative and may vary based on quality, volume, and chosen incoterm. Contact us for a precise quote.`,
  }),
  (d) => ({
    question: `How has the price of ${d.productName} evolved over the last 30 days?`,
    answer:
      `${d.priceTrend === 'up'
        ? `The price of ${d.productName} has increased${d.priceVariation ? ` by ${d.priceVariation}%` : ''} over the last 30 days.`
        : d.priceTrend === 'down'
          ? `The price of ${d.productName} has decreased${d.priceVariation ? ` by ${d.priceVariation}%` : ''} over the last 30 days.`
          : `The price of ${d.productName} has remained stable over the last 30 days.`
      } These variations reflect global agricultural commodity market conditions.`,
  }),
  (d) => ({
    question: `What factors influence the price of Cameroonian ${d.productName}?`,
    answer:
      `The price of Cameroonian ${d.productName} is influenced by several factors: weather conditions ` +
      `(rainfall, temperatures), global demand, currency exchange rates (USD/EUR), logistics costs, ` +
      `and export policies. Batch quality (grade, moisture, defects) also plays a major role.`,
  }),
  (d) => ({
    question: `How to get a firm price for Cameroonian ${d.productName}?`,
    answer:
      `To get a firm price, contact our sales team with your specifications: desired volume, required quality, ` +
      `incoterm, destination port, and delivery timeline. We will provide a firm offer valid for 48 hours, ` +
      `based on market rates at the time of your request.`,
  }),
  (d) => ({
    question: `Does the ${d.productName} price include shipping costs?`,
    answer:
      `The displayed price is generally an FOB (Free On Board) Douala price, which does not include maritime freight. ` +
      `Depending on the chosen incoterm (CIF, CFR, DAP), transport and insurance costs may be included. ` +
      `Afrexia can offer CIF prices for major destination ports.`,
  }),
];

const PRICE_FAQ_ES: FAQTemplateFn[] = [
  (d) => ({
    question: `¿Cuál es el precio actual del ${d.productName} camerunés?`,
    answer:
      `${d.price
        ? `El precio indicativo actual del ${d.productName} camerunés es de ${d.price} ${d.currency ?? 'USD'}/tonelada.`
        : `El precio del ${d.productName} camerunés fluctúa según las condiciones del mercado mundial.`
      } Este precio es indicativo. Contáctenos para un presupuesto preciso.`,
  }),
  (d) => ({
    question: `¿Cómo ha evolucionado el precio del ${d.productName} en los últimos 30 días?`,
    answer:
      `${d.priceTrend === 'up'
        ? `El precio del ${d.productName} ha subido${d.priceVariation ? ` un ${d.priceVariation}%` : ''} en los últimos 30 días.`
        : d.priceTrend === 'down'
          ? `El precio del ${d.productName} ha bajado${d.priceVariation ? ` un ${d.priceVariation}%` : ''} en los últimos 30 días.`
          : `El precio del ${d.productName} se ha mantenido estable en los últimos 30 días.`
      }`,
  }),
  (d) => ({
    question: `¿Qué factores influyen en el precio del ${d.productName} camerunés?`,
    answer:
      `El precio está influenciado por las condiciones climáticas, la demanda mundial, los tipos de cambio, ` +
      `los costos logísticos y las políticas de exportación. La calidad del lote también juega un papel importante.`,
  }),
  (d) => ({
    question: `¿Cómo obtener un precio firme para el ${d.productName} camerunés?`,
    answer:
      `Contacte a nuestro equipo comercial con sus especificaciones: volumen, calidad, incoterm, puerto de destino ` +
      `y plazo de entrega. Le proporcionaremos una oferta firme válida por 48 horas.`,
  }),
  (d) => ({
    question: `¿El precio del ${d.productName} incluye los gastos de transporte?`,
    answer:
      `El precio mostrado es generalmente un precio FOB Douala, que no incluye el flete marítimo. ` +
      `Según el incoterm elegido (CIF, CFR, DAP), los costos de transporte y seguro pueden estar incluidos.`,
  }),
];

const PRICE_FAQ_DE: FAQTemplateFn[] = [
  (d) => ({
    question: `Was ist der aktuelle Preis für kamerunisches ${d.productName}?`,
    answer:
      `${d.price
        ? `Der aktuelle Richtpreis für kamerunisches ${d.productName} beträgt ${d.price} ${d.currency ?? 'USD'}/Tonne.`
        : `Der Preis für kamerunisches ${d.productName} schwankt je nach globalen Marktbedingungen.`
      } Dieser Preis ist ein Richtwert. Kontaktieren Sie uns für ein genaues Angebot.`,
  }),
  (d) => ({
    question: `Wie hat sich der Preis von ${d.productName} in den letzten 30 Tagen entwickelt?`,
    answer:
      `${d.priceTrend === 'up'
        ? `Der Preis von ${d.productName} ist in den letzten 30 Tagen${d.priceVariation ? ` um ${d.priceVariation}%` : ''} gestiegen.`
        : d.priceTrend === 'down'
          ? `Der Preis von ${d.productName} ist in den letzten 30 Tagen${d.priceVariation ? ` um ${d.priceVariation}%` : ''} gefallen.`
          : `Der Preis von ${d.productName} ist in den letzten 30 Tagen stabil geblieben.`
      }`,
  }),
  (d) => ({
    question: `Welche Faktoren beeinflussen den Preis von kamerunischem ${d.productName}?`,
    answer:
      `Der Preis wird durch Wetterbedingungen, globale Nachfrage, Wechselkurse, Logistikkosten und ` +
      `Exportpolitiken beeinflusst. Die Chargenqualität spielt ebenfalls eine wichtige Rolle.`,
  }),
  (d) => ({
    question: `Wie erhält man einen Festpreis für kamerunisches ${d.productName}?`,
    answer:
      `Kontaktieren Sie unser Vertriebsteam mit Ihren Spezifikationen: Volumen, Qualität, Incoterm, Zielhafen ` +
      `und Lieferzeitraum. Wir stellen Ihnen ein 48 Stunden gültiges Festpreisangebot zur Verfügung.`,
  }),
  (d) => ({
    question: `Sind die Transportkosten im ${d.productName}-Preis enthalten?`,
    answer:
      `Der angezeigte Preis ist in der Regel ein FOB-Preis (Douala), der keine Seefracht enthält. ` +
      `Je nach gewähltem Incoterm (CIF, CFR, DAP) können Transport- und Versicherungskosten enthalten sein.`,
  }),
];

const PRICE_FAQ_RU: FAQTemplateFn[] = [
  (d) => ({
    question: `Какова текущая цена камерунского ${d.productName}?`,
    answer:
      `${d.price
        ? `Текущая ориентировочная цена камерунского ${d.productName} составляет ${d.price} ${d.currency ?? 'USD'}/тонна.`
        : `Цена камерунского ${d.productName} колеблется в зависимости от мировых рыночных условий.`
      } Эта цена является ориентировочной. Свяжитесь с нами для получения точного предложения.`,
  }),
  (d) => ({
    question: `Как изменилась цена ${d.productName} за последние 30 дней?`,
    answer:
      `${d.priceTrend === 'up'
        ? `Цена ${d.productName} выросла${d.priceVariation ? ` на ${d.priceVariation}%` : ''} за последние 30 дней.`
        : d.priceTrend === 'down'
          ? `Цена ${d.productName} снизилась${d.priceVariation ? ` на ${d.priceVariation}%` : ''} за последние 30 дней.`
          : `Цена ${d.productName} оставалась стабильной в течение последних 30 дней.`
      }`,
  }),
  (d) => ({
    question: `Какие факторы влияют на цену камерунского ${d.productName}?`,
    answer:
      `На цену влияют погодные условия, мировой спрос, обменные курсы валют, логистические затраты ` +
      `и экспортная политика. Качество партии (сорт, влажность, дефекты) также играет важную роль.`,
  }),
  (d) => ({
    question: `Как получить твёрдую цену на камерунский ${d.productName}?`,
    answer:
      `Свяжитесь с нашим отделом продаж, указав ваши требования: объём, качество, инкотерм, порт назначения ` +
      `и срок поставки. Мы предоставим твёрдое предложение, действительное в течение 48 часов.`,
  }),
  (d) => ({
    question: `Включены ли транспортные расходы в цену ${d.productName}?`,
    answer:
      `Отображаемая цена, как правило, является ценой FOB (Дуала) и не включает морской фрахт. ` +
      `В зависимости от выбранного инкотерма (CIF, CFR, DAP) транспортные расходы и страхование могут быть включены.`,
  }),
];

// ============================================================================
// Comparison page FAQ templates (5 per locale)
// ============================================================================

const COMPARISON_FAQ_FR: FAQTemplateFn[] = [
  (d) => ({
    question: `Quelle est la différence principale entre le ${d.productName} et le ${d.productNameB ?? 'produit B'} ?`,
    answer:
      `Le ${d.productName} et le ${d.productNameB ?? 'produit B'} diffèrent principalement par leurs applications industrielles, ` +
      `leurs profils aromatiques et leurs structures de prix. Le ${d.productName} est davantage orienté vers la chocolaterie ` +
      `et la cosmétique, tandis que le ${d.productNameB ?? 'produit B'} est privilégié pour la torréfaction et les boissons.`,
  }),
  (d) => ({
    question: `Lequel du ${d.productName} ou du ${d.productNameB ?? 'produit B'} est le plus rentable à importer ?`,
    answer:
      `La rentabilité dépend de votre secteur d'activité et de vos volumes. Le ${d.productName} présente généralement ` +
      `des prix plus élevés mais une valeur ajoutée supérieure dans les applications premium. ` +
      `Contactez Afrexia pour une analyse personnalisée selon votre marché cible.`,
  }),
  (d) => ({
    question: `Peut-on importer du ${d.productName} et du ${d.productNameB ?? 'produit B'} simultanément depuis le Cameroun ?`,
    answer:
      `Oui, Afrexia peut gérer des commandes mixtes de ${d.productName} et de ${d.productNameB ?? 'produit B'} ` +
      `dans le même conteneur ou en expéditions séparées selon vos besoins. ` +
      `Nous optimisons la logistique pour réduire vos coûts d'approvisionnement.`,
  }),
  (d) => ({
    question: `Quelles certifications sont disponibles pour le ${d.productName} et le ${d.productNameB ?? 'produit B'} camerounais ?`,
    answer:
      `Les deux produits peuvent être fournis avec des certifications Rainforest Alliance, Fair Trade et Bio ` +
      `selon les lots disponibles. Afrexia vous informe des certifications disponibles pour chaque commande.`,
  }),
  (d) => ({
    question: `Comment choisir entre ${d.productName} et ${d.productNameB ?? 'produit B'} pour mon industrie ?`,
    answer:
      `Le choix dépend de votre usage final : le ${d.productName} est idéal pour la chocolaterie, la cosmétique ` +
      `et les produits premium. Le ${d.productNameB ?? 'produit B'} convient mieux à la torréfaction, les boissons ` +
      `et l'alimentation générale. Notre équipe peut vous conseiller selon vos spécifications techniques.`,
  }),
];

const COMPARISON_FAQ_EN: FAQTemplateFn[] = [
  (d) => ({
    question: `What is the main difference between ${d.productName} and ${d.productNameB ?? 'product B'}?`,
    answer:
      `${d.productName} and ${d.productNameB ?? 'product B'} differ mainly in their industrial applications, aromatic profiles, ` +
      `and price structures. ${d.productName} is more oriented towards chocolate-making and cosmetics, ` +
      `while ${d.productNameB ?? 'product B'} is preferred for roasting and beverages.`,
  }),
  (d) => ({
    question: `Which is more profitable to import, ${d.productName} or ${d.productNameB ?? 'product B'}?`,
    answer:
      `Profitability depends on your industry sector and volumes. ${d.productName} generally commands higher prices ` +
      `but offers superior added value in premium applications. ` +
      `Contact Afrexia for a personalized analysis based on your target market.`,
  }),
  (d) => ({
    question: `Can I import ${d.productName} and ${d.productNameB ?? 'product B'} simultaneously from Cameroon?`,
    answer:
      `Yes, Afrexia can handle mixed orders of ${d.productName} and ${d.productNameB ?? 'product B'} ` +
      `in the same container or separate shipments according to your needs. ` +
      `We optimize logistics to reduce your sourcing costs.`,
  }),
  (d) => ({
    question: `What certifications are available for Cameroonian ${d.productName} and ${d.productNameB ?? 'product B'}?`,
    answer:
      `Both products can be supplied with Rainforest Alliance, Fair Trade, and Organic certifications ` +
      `depending on available batches. Afrexia informs you of available certifications for each order.`,
  }),
  (d) => ({
    question: `How do I choose between ${d.productName} and ${d.productNameB ?? 'product B'} for my industry?`,
    answer:
      `The choice depends on your end use: ${d.productName} is ideal for chocolate-making, cosmetics, and premium products. ` +
      `${d.productNameB ?? 'product B'} is better suited for roasting, beverages, and general food. ` +
      `Our team can advise you based on your technical specifications.`,
  }),
];

const COMPARISON_FAQ_ES: FAQTemplateFn[] = [
  (d) => ({
    question: `¿Cuál es la diferencia principal entre ${d.productName} y ${d.productNameB ?? 'producto B'}?`,
    answer:
      `El ${d.productName} y el ${d.productNameB ?? 'producto B'} difieren principalmente en sus aplicaciones industriales, ` +
      `perfiles aromáticos y estructuras de precios.`,
  }),
  (d) => ({
    question: `¿Cuál es más rentable importar, ${d.productName} o ${d.productNameB ?? 'producto B'}?`,
    answer:
      `La rentabilidad depende de su sector de actividad y sus volúmenes. Contacte a Afrexia para un análisis personalizado.`,
  }),
  (d) => ({
    question: `¿Puedo importar ${d.productName} y ${d.productNameB ?? 'producto B'} simultáneamente desde Camerún?`,
    answer:
      `Sí, Afrexia puede gestionar pedidos mixtos en el mismo contenedor o en envíos separados según sus necesidades.`,
  }),
  (d) => ({
    question: `¿Qué certificaciones están disponibles para el ${d.productName} y ${d.productNameB ?? 'producto B'} cameruneses?`,
    answer:
      `Ambos productos pueden suministrarse con certificaciones Rainforest Alliance, Fair Trade y Bio según los lotes disponibles.`,
  }),
  (d) => ({
    question: `¿Cómo elegir entre ${d.productName} y ${d.productNameB ?? 'producto B'} para mi industria?`,
    answer:
      `La elección depende de su uso final. Nuestro equipo puede asesorarle según sus especificaciones técnicas.`,
  }),
];

const COMPARISON_FAQ_DE: FAQTemplateFn[] = [
  (d) => ({
    question: `Was ist der Hauptunterschied zwischen ${d.productName} und ${d.productNameB ?? 'Produkt B'}?`,
    answer:
      `${d.productName} und ${d.productNameB ?? 'Produkt B'} unterscheiden sich hauptsächlich in ihren industriellen Anwendungen, ` +
      `aromatischen Profilen und Preisstrukturen.`,
  }),
  (d) => ({
    question: `Was ist rentabler zu importieren, ${d.productName} oder ${d.productNameB ?? 'Produkt B'}?`,
    answer:
      `Die Rentabilität hängt von Ihrem Industriesektor und Ihren Volumina ab. Kontaktieren Sie Afrexia für eine personalisierte Analyse.`,
  }),
  (d) => ({
    question: `Kann ich ${d.productName} und ${d.productNameB ?? 'Produkt B'} gleichzeitig aus Kamerun importieren?`,
    answer:
      `Ja, Afrexia kann gemischte Bestellungen im selben Container oder in separaten Sendungen abwickeln.`,
  }),
  (d) => ({
    question: `Welche Zertifizierungen sind für kamerunisches ${d.productName} und ${d.productNameB ?? 'Produkt B'} verfügbar?`,
    answer:
      `Beide Produkte können je nach verfügbaren Chargen mit Rainforest Alliance-, Fair Trade- und Bio-Zertifizierungen geliefert werden.`,
  }),
  (d) => ({
    question: `Wie wähle ich zwischen ${d.productName} und ${d.productNameB ?? 'Produkt B'} für meine Industrie?`,
    answer:
      `Die Wahl hängt von Ihrer Endverwendung ab. Unser Team kann Sie basierend auf Ihren technischen Spezifikationen beraten.`,
  }),
];

const COMPARISON_FAQ_RU: FAQTemplateFn[] = [
  (d) => ({
    question: `В чём основное различие между ${d.productName} и ${d.productNameB ?? 'продуктом Б'}?`,
    answer:
      `${d.productName} и ${d.productNameB ?? 'продукт Б'} различаются главным образом по промышленным применениям, ` +
      `ароматическим профилям и ценовым структурам.`,
  }),
  (d) => ({
    question: `Что выгоднее импортировать, ${d.productName} или ${d.productNameB ?? 'продукт Б'}?`,
    answer:
      `Рентабельность зависит от вашего отраслевого сектора и объёмов. Свяжитесь с Afrexia для персонализированного анализа.`,
  }),
  (d) => ({
    question: `Можно ли одновременно импортировать ${d.productName} и ${d.productNameB ?? 'продукт Б'} из Камеруна?`,
    answer:
      `Да, Afrexia может обрабатывать смешанные заказы в одном контейнере или отдельными отправками.`,
  }),
  (d) => ({
    question: `Какие сертификаты доступны для камерунских ${d.productName} и ${d.productNameB ?? 'продукта Б'}?`,
    answer:
      `Оба продукта могут поставляться с сертификатами Rainforest Alliance, Fair Trade и Organic в зависимости от доступных партий.`,
  }),
  (d) => ({
    question: `Как выбрать между ${d.productName} и ${d.productNameB ?? 'продуктом Б'} для моей отрасли?`,
    answer:
      `Выбор зависит от вашего конечного использования. Наша команда может проконсультировать вас на основе ваших технических спецификаций.`,
  }),
];

// ============================================================================
// Exported maps
// ============================================================================

export const PRODUCT_COUNTRY_FAQ_TEMPLATES: Record<Locale, FAQTemplateFn[]> = {
  fr: PRODUCT_COUNTRY_FAQ_FR,
  en: PRODUCT_COUNTRY_FAQ_EN,
  es: PRODUCT_COUNTRY_FAQ_ES,
  de: PRODUCT_COUNTRY_FAQ_DE,
  ru: PRODUCT_COUNTRY_FAQ_RU,
};

export const PRICE_FAQ_TEMPLATES: Record<Locale, FAQTemplateFn[]> = {
  fr: PRICE_FAQ_FR,
  en: PRICE_FAQ_EN,
  es: PRICE_FAQ_ES,
  de: PRICE_FAQ_DE,
  ru: PRICE_FAQ_RU,
};

export const COMPARISON_FAQ_TEMPLATES: Record<Locale, FAQTemplateFn[]> = {
  fr: COMPARISON_FAQ_FR,
  en: COMPARISON_FAQ_EN,
  es: COMPARISON_FAQ_ES,
  de: COMPARISON_FAQ_DE,
  ru: COMPARISON_FAQ_RU,
};

export const ALL_FAQ_TEMPLATES: Record<PageType, Record<Locale, FAQTemplateFn[]>> = {
  productCountry: PRODUCT_COUNTRY_FAQ_TEMPLATES,
  price: PRICE_FAQ_TEMPLATES,
  comparison: COMPARISON_FAQ_TEMPLATES,
};

/**
 * Generates 3-5 FAQ items for a given page type and locale.
 * Selects questions based on available data to maximize relevance.
 *
 * @param pageType - The type of page (productCountry, price, comparison)
 * @param locale - The target locale
 * @param data - Template data (product name, country, price, etc.)
 * @param count - Number of FAQs to generate (clamped to 3-5)
 */
export function generateFAQs(
  pageType: PageType,
  locale: Locale,
  data: FAQTemplateData,
  count: number = 5
): FAQItem[] {
  const clampedCount = Math.max(3, Math.min(5, count));
  const fallbackLocale: Locale = 'en';

  const templates =
    ALL_FAQ_TEMPLATES[pageType][locale] ??
    ALL_FAQ_TEMPLATES[pageType][fallbackLocale];

  return templates.slice(0, clampedCount).map((fn) => fn(data));
}
