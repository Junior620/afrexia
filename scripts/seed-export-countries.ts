/**
 * Seed Export Countries Script
 *
 * Creates 5 test export country documents in Sanity CMS for the
 * programmatic SEO system (task 7.1).
 *
 * Countries: Pays-Bas (NL), Belgique (BE), Allemagne (DE), France (FR), Chine (CN)
 *
 * Usage:
 *   npx tsx scripts/seed-export-countries.ts
 *
 * Requirements:
 *   - SANITY_API_TOKEN environment variable with write permissions
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const exportCountries = [
  {
    _id: 'export-country-nl',
    _type: 'exportCountry',
    name: {
      fr: 'Pays-Bas',
      en: 'Netherlands',
      es: 'Países Bajos',
      de: 'Niederlande',
      ru: 'Нидерланды',
    },
    slug: { current: 'netherlands' },
    code: 'NL',
    flag: '🇳🇱',
    description: {
      fr: "Les Pays-Bas constituent l'une des principales portes d'entrée des matières premières africaines en Europe. Le port de Rotterdam, le plus grand d'Europe, offre des connexions logistiques exceptionnelles pour l'importation de cacao, café et autres produits agricoles d'Afrique centrale et de l'Ouest.",
      en: 'The Netherlands is one of the main entry points for African raw materials into Europe. The port of Rotterdam, the largest in Europe, offers exceptional logistics connections for importing cocoa, coffee and other agricultural products from Central and West Africa.',
      es: 'Los Países Bajos son una de las principales puertas de entrada de materias primas africanas en Europa. El puerto de Rotterdam, el más grande de Europa, ofrece conexiones logísticas excepcionales para importar cacao, café y otros productos agrícolas de África Central y Occidental.',
      de: 'Die Niederlande sind einer der wichtigsten Einfuhrorte für afrikanische Rohstoffe in Europa. Der Hafen von Rotterdam, der größte Europas, bietet außergewöhnliche Logistikverbindungen für den Import von Kakao, Kaffee und anderen landwirtschaftlichen Produkten aus Zentral- und Westafrika.',
      ru: 'Нидерланды являются одним из главных пунктов ввоза африканского сырья в Европу. Порт Роттердам, крупнейший в Европе, предлагает исключительные логистические связи для импорта какао, кофе и других сельскохозяйственных продуктов из Центральной и Западной Африки.',
    },
    targetMarkets: [
      'Chocolaterie & confiserie',
      'Torréfaction de café',
      'Industrie alimentaire',
      'Négoce de matières premières',
      'Distribution en gros',
    ],
    customsInfo: {
      fr: "Les Pays-Bas appliquent les réglementations douanières de l'Union Européenne. Les produits agricoles doivent respecter les normes phytosanitaires européennes et les règlements EUDR (déforestation). Les droits de douane varient selon les accords commerciaux en vigueur avec le Cameroun.",
      en: 'The Netherlands applies European Union customs regulations. Agricultural products must comply with European phytosanitary standards and EUDR (deforestation) regulations. Customs duties vary according to trade agreements in force with Cameroon.',
      es: 'Los Países Bajos aplican las regulaciones aduaneras de la Unión Europea. Los productos agrícolas deben cumplir con las normas fitosanitarias europeas y los reglamentos EUDR (deforestación). Los aranceles varían según los acuerdos comerciales vigentes con Camerún.',
      de: 'Die Niederlande wenden die Zollvorschriften der Europäischen Union an. Landwirtschaftliche Produkte müssen europäische phytosanitäre Standards und EUDR-Vorschriften (Entwaldung) einhalten. Die Zölle variieren je nach den mit Kamerun geltenden Handelsabkommen.',
      ru: 'Нидерланды применяют таможенные правила Европейского Союза. Сельскохозяйственная продукция должна соответствовать европейским фитосанитарным стандартам и правилам EUDR (обезлесение). Таможенные пошлины варьируются в зависимости от торговых соглашений с Камеруном.',
    },
    averageTransitTime: {
      days: 21,
      note: {
        fr: 'Via le port de Rotterdam depuis Douala',
        en: 'Via Rotterdam port from Douala',
        es: 'Vía puerto de Rotterdam desde Douala',
        de: 'Über den Hafen Rotterdam von Douala',
        ru: 'Через порт Роттердам из Дуалы',
      },
    },
    dataCompleteness: 85,
    approvedForSEO: true,
  },
  {
    _id: 'export-country-be',
    _type: 'exportCountry',
    name: {
      fr: 'Belgique',
      en: 'Belgium',
      es: 'Bélgica',
      de: 'Belgien',
      ru: 'Бельгия',
    },
    slug: { current: 'belgium' },
    code: 'BE',
    flag: '🇧🇪',
    description: {
      fr: "La Belgique entretient des liens historiques forts avec l'Afrique centrale et dispose d'une industrie chocolatière de renommée mondiale. Anvers est le premier port mondial pour le commerce du cacao, traitant plus de 60% des fèves de cacao mondiales. Le pays représente un marché stratégique pour les exportateurs camerounais.",
      en: 'Belgium has strong historical ties with Central Africa and has a world-renowned chocolate industry. Antwerp is the world\'s leading port for cocoa trade, handling more than 60% of the world\'s cocoa beans. The country represents a strategic market for Cameroonian exporters.',
      es: 'Bélgica tiene fuertes lazos históricos con África Central y cuenta con una industria chocolatera de renombre mundial. Amberes es el principal puerto mundial para el comercio del cacao, procesando más del 60% de los granos de cacao del mundo. El país representa un mercado estratégico para los exportadores cameruneses.',
      de: 'Belgien hat starke historische Verbindungen zu Zentralafrika und verfügt über eine weltbekannte Schokoladenindustrie. Antwerpen ist der weltweit führende Hafen für den Kakaohandel und verarbeitet mehr als 60% der weltweiten Kakaobohnen. Das Land ist ein strategischer Markt für kamerunische Exporteure.',
      ru: 'Бельгия имеет прочные исторические связи с Центральной Африкой и обладает всемирно известной шоколадной промышленностью. Антверпен является ведущим мировым портом для торговли какао, обрабатывая более 60% мировых какао-бобов. Страна представляет стратегический рынок для камерунских экспортеров.',
    },
    targetMarkets: [
      'Industrie chocolatière',
      'Transformation du cacao',
      'Négoce international',
      'Industrie alimentaire',
      'Secteur pharmaceutique',
    ],
    customsInfo: {
      fr: "La Belgique applique les réglementations douanières de l'Union Européenne via le port d'Anvers. Les importateurs doivent se conformer aux règlements EUDR et aux normes de traçabilité. Des facilités douanières existent dans le cadre des accords de partenariat économique UE-Afrique.",
      en: "Belgium applies European Union customs regulations through the port of Antwerp. Importers must comply with EUDR regulations and traceability standards. Customs facilities exist under EU-Africa economic partnership agreements.",
      es: 'Bélgica aplica las regulaciones aduaneras de la Unión Europea a través del puerto de Amberes. Los importadores deben cumplir con las regulaciones EUDR y los estándares de trazabilidad. Existen facilidades aduaneras en el marco de los acuerdos de asociación económica UE-África.',
      de: 'Belgien wendet die Zollvorschriften der Europäischen Union über den Hafen Antwerpen an. Importeure müssen EUDR-Vorschriften und Rückverfolgbarkeitsstandards einhalten. Im Rahmen der EU-Afrika-Wirtschaftspartnerschaftsabkommen bestehen Zollerleichterungen.',
      ru: 'Бельгия применяет таможенные правила Европейского Союза через порт Антверпен. Импортеры должны соблюдать правила EUDR и стандарты прослеживаемости. В рамках соглашений об экономическом партнерстве ЕС-Африка существуют таможенные льготы.',
    },
    averageTransitTime: {
      days: 20,
      note: {
        fr: "Via le port d'Anvers depuis Douala",
        en: 'Via Antwerp port from Douala',
        es: 'Vía puerto de Amberes desde Douala',
        de: 'Über den Hafen Antwerpen von Douala',
        ru: 'Через порт Антверпен из Дуалы',
      },
    },
    dataCompleteness: 90,
    approvedForSEO: true,
  },
  {
    _id: 'export-country-de',
    _type: 'exportCountry',
    name: {
      fr: 'Allemagne',
      en: 'Germany',
      es: 'Alemania',
      de: 'Deutschland',
      ru: 'Германия',
    },
    slug: { current: 'germany' },
    code: 'DE',
    flag: '🇩🇪',
    description: {
      fr: "L'Allemagne est le premier importateur européen de café et l'un des plus grands marchés pour les matières premières agricoles. Hambourg est le principal port d'entrée du café en Europe. Le marché allemand valorise particulièrement les certifications de durabilité et la traçabilité des produits.",
      en: 'Germany is the leading European importer of coffee and one of the largest markets for agricultural raw materials. Hamburg is the main entry port for coffee in Europe. The German market particularly values sustainability certifications and product traceability.',
      es: 'Alemania es el principal importador europeo de café y uno de los mercados más grandes para las materias primas agrícolas. Hamburgo es el principal puerto de entrada del café en Europa. El mercado alemán valora especialmente las certificaciones de sostenibilidad y la trazabilidad de los productos.',
      de: 'Deutschland ist der führende europäische Kaffeeimporteur und einer der größten Märkte für landwirtschaftliche Rohstoffe. Hamburg ist der wichtigste Einfuhrhafen für Kaffee in Europa. Der deutsche Markt schätzt besonders Nachhaltigkeitszertifizierungen und Produktrückverfolgbarkeit.',
      ru: 'Германия является ведущим европейским импортером кофе и одним из крупнейших рынков сельскохозяйственного сырья. Гамбург является главным портом ввоза кофе в Европу. Немецкий рынок особенно ценит сертификаты устойчивости и прослеживаемость продукции.',
    },
    targetMarkets: [
      'Torréfaction et café spécialisé',
      'Industrie alimentaire',
      'Transformation du cacao',
      'Commerce de détail bio',
      'Industrie pharmaceutique',
    ],
    customsInfo: {
      fr: "L'Allemagne applique les réglementations douanières de l'Union Européenne. Le marché allemand exige des certifications de durabilité (Rainforest Alliance, Fairtrade, Bio) pour accéder aux segments premium. Les importateurs doivent respecter les nouvelles obligations EUDR en vigueur depuis 2024.",
      en: 'Germany applies European Union customs regulations. The German market requires sustainability certifications (Rainforest Alliance, Fairtrade, Organic) to access premium segments. Importers must comply with the new EUDR obligations in force since 2024.',
      es: 'Alemania aplica las regulaciones aduaneras de la Unión Europea. El mercado alemán requiere certificaciones de sostenibilidad (Rainforest Alliance, Fairtrade, Orgánico) para acceder a los segmentos premium. Los importadores deben cumplir con las nuevas obligaciones EUDR vigentes desde 2024.',
      de: 'Deutschland wendet die Zollvorschriften der Europäischen Union an. Der deutsche Markt erfordert Nachhaltigkeitszertifizierungen (Rainforest Alliance, Fairtrade, Bio) für den Zugang zu Premium-Segmenten. Importeure müssen die seit 2024 geltenden neuen EUDR-Verpflichtungen einhalten.',
      ru: 'Германия применяет таможенные правила Европейского Союза. Немецкий рынок требует сертификатов устойчивости (Rainforest Alliance, Fairtrade, Organic) для доступа к премиальным сегментам. Импортеры должны соблюдать новые обязательства EUDR, действующие с 2024 года.',
    },
    averageTransitTime: {
      days: 22,
      note: {
        fr: 'Via le port de Hambourg depuis Douala',
        en: 'Via Hamburg port from Douala',
        es: 'Vía puerto de Hamburgo desde Douala',
        de: 'Über den Hafen Hamburg von Douala',
        ru: 'Через порт Гамбург из Дуалы',
      },
    },
    dataCompleteness: 88,
    approvedForSEO: true,
  },
  {
    _id: 'export-country-fr',
    _type: 'exportCountry',
    name: {
      fr: 'France',
      en: 'France',
      es: 'Francia',
      de: 'Frankreich',
      ru: 'Франция',
    },
    slug: { current: 'france' },
    code: 'FR',
    flag: '🇫🇷',
    description: {
      fr: "La France est le principal partenaire commercial du Cameroun en Europe et partage des liens linguistiques et culturels forts. Le marché français est particulièrement réceptif aux produits d'Afrique francophone et dispose d'une industrie agroalimentaire développée. Le port du Havre et Marseille sont les principales portes d'entrée.",
      en: "France is Cameroon's main trading partner in Europe and shares strong linguistic and cultural ties. The French market is particularly receptive to products from French-speaking Africa and has a developed agri-food industry. The ports of Le Havre and Marseille are the main entry points.",
      es: 'Francia es el principal socio comercial de Camerún en Europa y comparte fuertes lazos lingüísticos y culturales. El mercado francés es particularmente receptivo a los productos del África francófona y cuenta con una desarrollada industria agroalimentaria. Los puertos de El Havre y Marsella son las principales puertas de entrada.',
      de: 'Frankreich ist Kameruns wichtigster Handelspartner in Europa und teilt starke sprachliche und kulturelle Verbindungen. Der französische Markt ist besonders empfänglich für Produkte aus dem frankophonen Afrika und verfügt über eine entwickelte Agrar- und Lebensmittelindustrie. Die Häfen Le Havre und Marseille sind die wichtigsten Einfuhrorte.',
      ru: 'Франция является главным торговым партнером Камеруна в Европе и имеет прочные языковые и культурные связи. Французский рынок особенно восприимчив к продуктам из франкоязычной Африки и имеет развитую агропродовольственную промышленность. Порты Гавр и Марсель являются главными пунктами ввоза.',
    },
    targetMarkets: [
      'Grande distribution alimentaire',
      'Industrie chocolatière artisanale',
      'Torréfacteurs spécialisés',
      'Commerce équitable',
      'Restauration et hôtellerie',
    ],
    customsInfo: {
      fr: "La France applique les réglementations douanières de l'Union Européenne. Les relations commerciales franco-camerounaises bénéficient d'accords préférentiels dans le cadre des APE (Accords de Partenariat Économique). Les produits biologiques et équitables bénéficient d'une forte demande sur le marché français.",
      en: "France applies European Union customs regulations. Franco-Cameroonian trade relations benefit from preferential agreements under the EPA (Economic Partnership Agreements). Organic and fair trade products are in high demand on the French market.",
      es: 'Francia aplica las regulaciones aduaneras de la Unión Europea. Las relaciones comerciales franco-camerunesas se benefician de acuerdos preferenciales en el marco de los APE (Acuerdos de Asociación Económica). Los productos orgánicos y de comercio justo tienen una gran demanda en el mercado francés.',
      de: 'Frankreich wendet die Zollvorschriften der Europäischen Union an. Die französisch-kamerunischen Handelsbeziehungen profitieren von Vorzugsabkommen im Rahmen der WPA (Wirtschaftspartnerschaftsabkommen). Bio- und Fairtrade-Produkte sind auf dem französischen Markt sehr gefragt.',
      ru: 'Франция применяет таможенные правила Европейского Союза. Французско-камерунские торговые отношения пользуются преференциальными соглашениями в рамках СПЭ (Соглашений об экономическом партнерстве). Органические продукты и продукты справедливой торговли пользуются высоким спросом на французском рынке.',
    },
    averageTransitTime: {
      days: 18,
      note: {
        fr: 'Via le port du Havre ou Marseille depuis Douala',
        en: 'Via Le Havre or Marseille port from Douala',
        es: 'Vía puerto de El Havre o Marsella desde Douala',
        de: 'Über den Hafen Le Havre oder Marseille von Douala',
        ru: 'Через порт Гавр или Марсель из Дуалы',
      },
    },
    dataCompleteness: 90,
    approvedForSEO: true,
  },
  {
    _id: 'export-country-cn',
    _type: 'exportCountry',
    name: {
      fr: 'Chine',
      en: 'China',
      es: 'China',
      de: 'China',
      ru: 'Китай',
    },
    slug: { current: 'china' },
    code: 'CN',
    flag: '🇨🇳',
    description: {
      fr: "La Chine est le plus grand marché émergent pour les matières premières africaines et représente une opportunité de croissance majeure pour les exportateurs camerounais. La demande chinoise en cacao, café et bois tropicaux est en forte croissance. Les ports de Shanghai et Guangzhou sont les principales destinations.",
      en: 'China is the largest emerging market for African raw materials and represents a major growth opportunity for Cameroonian exporters. Chinese demand for cocoa, coffee and tropical wood is growing strongly. The ports of Shanghai and Guangzhou are the main destinations.',
      es: 'China es el mayor mercado emergente para las materias primas africanas y representa una importante oportunidad de crecimiento para los exportadores cameruneses. La demanda china de cacao, café y madera tropical está creciendo fuertemente. Los puertos de Shanghái y Guangzhou son los principales destinos.',
      de: 'China ist der größte Schwellenmarkt für afrikanische Rohstoffe und stellt eine wichtige Wachstumschance für kamerunische Exporteure dar. Die chinesische Nachfrage nach Kakao, Kaffee und Tropenholz wächst stark. Die Häfen Shanghai und Guangzhou sind die wichtigsten Ziele.',
      ru: 'Китай является крупнейшим развивающимся рынком для африканского сырья и представляет собой важную возможность роста для камерунских экспортеров. Китайский спрос на какао, кофе и тропическую древесину стремительно растет. Порты Шанхай и Гуанчжоу являются основными направлениями.',
    },
    targetMarkets: [
      'Industrie alimentaire et confiserie',
      'Industrie du bois et ameublement',
      'Transformation du cacao',
      'Marché du café premium',
      'Industrie cosmétique et pharmaceutique',
    ],
    customsInfo: {
      fr: "La Chine applique ses propres réglementations douanières avec des droits variables selon les produits. Les exportateurs doivent obtenir les certifications GACC (General Administration of Customs China) pour les produits alimentaires. Les accords de libre-échange Chine-Afrique offrent des opportunités de réduction tarifaire.",
      en: 'China applies its own customs regulations with variable duties depending on the products. Exporters must obtain GACC (General Administration of Customs China) certifications for food products. China-Africa free trade agreements offer tariff reduction opportunities.',
      es: 'China aplica sus propias regulaciones aduaneras con aranceles variables según los productos. Los exportadores deben obtener las certificaciones GACC (Administración General de Aduanas de China) para productos alimentarios. Los acuerdos de libre comercio China-África ofrecen oportunidades de reducción arancelaria.',
      de: 'China wendet seine eigenen Zollvorschriften mit variablen Zöllen je nach Produkt an. Exporteure müssen GACC-Zertifizierungen (General Administration of Customs China) für Lebensmittelprodukte erhalten. China-Afrika-Freihandelsabkommen bieten Möglichkeiten zur Zollsenkung.',
      ru: 'Китай применяет собственные таможенные правила с переменными пошлинами в зависимости от продукции. Экспортеры должны получить сертификаты GACC (Главное таможенное управление Китая) для пищевых продуктов. Соглашения о свободной торговле Китай-Африка предоставляют возможности для снижения тарифов.',
    },
    averageTransitTime: {
      days: 35,
      note: {
        fr: 'Via les ports de Shanghai ou Guangzhou depuis Douala',
        en: 'Via Shanghai or Guangzhou ports from Douala',
        es: 'Vía puertos de Shanghái o Guangzhou desde Douala',
        de: 'Über die Häfen Shanghai oder Guangzhou von Douala',
        ru: 'Через порты Шанхай или Гуанчжоу из Дуалы',
      },
    },
    dataCompleteness: 80,
    approvedForSEO: true,
  },
];

async function seedExportCountries() {
  console.log('🌍 Starting export countries seed...\n');

  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Error: SANITY_API_TOKEN not found in environment variables');
    console.error('Please add SANITY_API_TOKEN to your .env.local file');
    process.exit(1);
  }

  try {
    // Check for existing documents
    const existing = await client.fetch('*[_type == "exportCountry"]{ _id, name }');

    if (existing.length > 0) {
      console.log(`⚠️  Found ${existing.length} existing exportCountry document(s):`);
      existing.forEach((doc: { _id: string; name?: { en?: string } }) => {
        console.log(`   - ${doc._id}: ${doc.name?.en ?? 'unknown'}`);
      });
      console.log('\nUsing createOrReplace to upsert all 5 countries...\n');
    }

    const transaction = client.transaction();

    exportCountries.forEach((country) => {
      transaction.createOrReplace(country);
    });

    await transaction.commit();

    console.log(`✅ Successfully seeded ${exportCountries.length} export countries!\n`);
    console.log('Countries created:');
    exportCountries.forEach((c, i) => {
      console.log(`  ${i + 1}. ${c.flag} ${c.name.fr} (${c.code}) — slug: ${c.slug.current} — completeness: ${c.dataCompleteness}% — SEO: ${c.approvedForSEO}`);
    });

    console.log('\n🎉 Seed complete! Verify in Sanity Studio: http://localhost:3333');
    console.log('   Navigate to "Pays d\'Export" to see the new documents.\n');
  } catch (error) {
    console.error('❌ Error seeding export countries:', error);
    process.exit(1);
  }
}

seedExportCountries();
