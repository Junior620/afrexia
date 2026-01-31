/**
 * Import/Merge Origin Countries Script
 * 
 * This script imports or updates origin countries in Sanity CMS.
 * It will update existing origins and create new ones.
 * 
 * Usage:
 *   npx tsx scripts/import-origins-merge.ts
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const origins = [
  {
    code: 'CM',
    name: {
      fr: 'Cameroun',
      en: 'Cameroon',
      es: 'Camerún',
      de: 'Kamerun',
      ru: 'Камерун',
    },
    flag: '🇨🇲',
    description: {
      fr: 'Principal producteur de cacao et café robusta en Afrique centrale',
      en: 'Major producer of cocoa and robusta coffee in Central Africa',
      es: 'Principal productor de cacao y café robusta en África Central',
      de: 'Hauptproduzent von Kakao und Robusta-Kaffee in Zentralafrika',
      ru: 'Основной производитель какао и кофе робуста в Центральной Африке',
    },
    sortOrder: 0,
  },
  {
    code: 'CI',
    name: {
      fr: "Côte d'Ivoire",
      en: 'Ivory Coast',
      es: 'Costa de Marfil',
      de: 'Elfenbeinküste',
      ru: "Кот-д'Ивуар",
    },
    flag: '🇨🇮',
    description: {
      fr: 'Premier producteur mondial de cacao',
      en: 'World\'s largest cocoa producer',
      es: 'Mayor productor mundial de cacao',
      de: 'Weltgrößter Kakaoproduzent',
      ru: 'Крупнейший в мире производитель какао',
    },
    sortOrder: 1,
  },
  {
    code: 'GH',
    name: {
      fr: 'Ghana',
      en: 'Ghana',
      es: 'Ghana',
      de: 'Ghana',
      ru: 'Гана',
    },
    flag: '🇬🇭',
    description: {
      fr: 'Deuxième producteur mondial de cacao, réputé pour sa qualité',
      en: 'Second largest cocoa producer, renowned for quality',
      es: 'Segundo mayor productor de cacao, reconocido por su calidad',
      de: 'Zweitgrößter Kakaoproduzent, bekannt für Qualität',
      ru: 'Второй по величине производитель какао, известный качеством',
    },
    sortOrder: 2,
  },
  {
    code: 'NG',
    name: {
      fr: 'Nigéria',
      en: 'Nigeria',
      es: 'Nigeria',
      de: 'Nigeria',
      ru: 'Нигерия',
    },
    flag: '🇳🇬',
    description: {
      fr: 'Important producteur de cacao et produits agricoles',
      en: 'Major producer of cocoa and agricultural products',
      es: 'Importante productor de cacao y productos agrícolas',
      de: 'Wichtiger Produzent von Kakao und landwirtschaftlichen Produkten',
      ru: 'Крупный производитель какао и сельскохозяйственной продукции',
    },
    sortOrder: 3,
  },
  {
    code: 'ET',
    name: {
      fr: 'Éthiopie',
      en: 'Ethiopia',
      es: 'Etiopía',
      de: 'Äthiopien',
      ru: 'Эфиопия',
    },
    flag: '🇪🇹',
    description: {
      fr: 'Berceau du café arabica, producteur de cafés de spécialité',
      en: 'Birthplace of arabica coffee, specialty coffee producer',
      es: 'Cuna del café arábica, productor de cafés especiales',
      de: 'Geburtsort des Arabica-Kaffees, Spezialitätenkaffee-Produzent',
      ru: 'Родина кофе арабика, производитель специального кофе',
    },
    sortOrder: 4,
  },
  {
    code: 'KE',
    name: {
      fr: 'Kenya',
      en: 'Kenya',
      es: 'Kenia',
      de: 'Kenia',
      ru: 'Кения',
    },
    flag: '🇰🇪',
    description: {
      fr: 'Réputé pour ses cafés arabica de haute altitude',
      en: 'Renowned for high-altitude arabica coffee',
      es: 'Reconocido por su café arábica de gran altitud',
      de: 'Bekannt für Hochland-Arabica-Kaffee',
      ru: 'Известен высокогорным кофе арабика',
    },
    sortOrder: 5,
  },
  {
    code: 'UG',
    name: {
      fr: 'Ouganda',
      en: 'Uganda',
      es: 'Uganda',
      de: 'Uganda',
      ru: 'Уганда',
    },
    flag: '🇺🇬',
    description: {
      fr: 'Producteur de café robusta et arabica',
      en: 'Producer of robusta and arabica coffee',
      es: 'Productor de café robusta y arábica',
      de: 'Produzent von Robusta- und Arabica-Kaffee',
      ru: 'Производитель кофе робуста и арабика',
    },
    sortOrder: 6,
  },
  {
    code: 'TZ',
    name: {
      fr: 'Tanzanie',
      en: 'Tanzania',
      es: 'Tanzania',
      de: 'Tansania',
      ru: 'Танзания',
    },
    flag: '🇹🇿',
    description: {
      fr: 'Producteur de café arabica et robusta',
      en: 'Producer of arabica and robusta coffee',
      es: 'Productor de café arábica y robusta',
      de: 'Produzent von Arabica- und Robusta-Kaffee',
      ru: 'Производитель кофе арабика и робуста',
    },
    sortOrder: 7,
  },
  {
    code: 'RW',
    name: {
      fr: 'Rwanda',
      en: 'Rwanda',
      es: 'Ruanda',
      de: 'Ruanda',
      ru: 'Руанда',
    },
    flag: '🇷🇼',
    description: {
      fr: 'Cafés de spécialité de haute qualité',
      en: 'High-quality specialty coffee',
      es: 'Café especial de alta calidad',
      de: 'Hochwertiger Spezialitätenkaffee',
      ru: 'Высококачественный специальный кофе',
    },
    sortOrder: 8,
  },
  {
    code: 'BI',
    name: {
      fr: 'Burundi',
      en: 'Burundi',
      es: 'Burundi',
      de: 'Burundi',
      ru: 'Бурунди',
    },
    flag: '🇧🇮',
    description: {
      fr: 'Producteur de café arabica de qualité',
      en: 'Quality arabica coffee producer',
      es: 'Productor de café arábica de calidad',
      de: 'Qualitäts-Arabica-Kaffee-Produzent',
      ru: 'Производитель качественного кофе арабика',
    },
    sortOrder: 9,
  },
  {
    code: 'TG',
    name: {
      fr: 'Togo',
      en: 'Togo',
      es: 'Togo',
      de: 'Togo',
      ru: 'Того',
    },
    flag: '🇹🇬',
    description: {
      fr: 'Producteur de cacao et café',
      en: 'Producer of cocoa and coffee',
      es: 'Productor de cacao y café',
      de: 'Produzent von Kakao und Kaffee',
      ru: 'Производитель какао и кофе',
    },
    sortOrder: 10,
  },
  {
    code: 'BJ',
    name: {
      fr: 'Bénin',
      en: 'Benin',
      es: 'Benín',
      de: 'Benin',
      ru: 'Бенин',
    },
    flag: '🇧🇯',
    description: {
      fr: 'Producteur de produits agricoles',
      en: 'Agricultural products producer',
      es: 'Productor de productos agrícolas',
      de: 'Produzent landwirtschaftlicher Produkte',
      ru: 'Производитель сельскохозяйственной продукции',
    },
    sortOrder: 11,
  },
  {
    code: 'SN',
    name: {
      fr: 'Sénégal',
      en: 'Senegal',
      es: 'Senegal',
      de: 'Senegal',
      ru: 'Сенегал',
    },
    flag: '🇸🇳',
    description: {
      fr: 'Producteur de produits agricoles',
      en: 'Agricultural products producer',
      es: 'Productor de productos agrícolas',
      de: 'Produzent landwirtschaftlicher Produkte',
      ru: 'Производитель сельскохозяйственной продукции',
    },
    sortOrder: 12,
  },
  {
    code: 'MG',
    name: {
      fr: 'Madagascar',
      en: 'Madagascar',
      es: 'Madagascar',
      de: 'Madagaskar',
      ru: 'Мадагаскар',
    },
    flag: '🇲🇬',
    description: {
      fr: 'Producteur de vanille et épices',
      en: 'Producer of vanilla and spices',
      es: 'Productor de vainilla y especias',
      de: 'Produzent von Vanille und Gewürzen',
      ru: 'Производитель ванили и специй',
    },
    sortOrder: 13,
  },
  {
    code: 'CD',
    name: {
      fr: 'Congo (RDC)',
      en: 'Congo (DRC)',
      es: 'Congo (RDC)',
      de: 'Kongo (DRK)',
      ru: 'Конго (ДРК)',
    },
    flag: '🇨🇩',
    description: {
      fr: 'Producteur de café robusta',
      en: 'Robusta coffee producer',
      es: 'Productor de café robusta',
      de: 'Robusta-Kaffee-Produzent',
      ru: 'Производитель кофе робуста',
    },
    sortOrder: 14,
  },
];

async function importOriginsMerge() {
  console.log('🌍 Starting origin countries import/merge...\n');

  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Error: SANITY_API_TOKEN not found');
    process.exit(1);
  }

  try {
    // Fetch existing origins
    const existingOrigins = await client.fetch<Array<{ _id: string; code: string }>>(
      '*[_type == "origin"]{ _id, code }'
    );
    
    console.log(`📊 Found ${existingOrigins.length} existing origin(s)\n`);

    const existingCodes = new Set(existingOrigins.map(o => o.code));
    const transaction = client.transaction();

    let updated = 0;
    let created = 0;

    for (const origin of origins) {
      const docId = `origin-${origin.code.toLowerCase()}`;
      
      if (existingCodes.has(origin.code)) {
        // Update existing
        const existing = existingOrigins.find(o => o.code === origin.code);
        transaction.patch(existing!._id, {
          set: {
            _type: 'origin',
            ...origin,
          },
        });
        console.log(`🔄 Updating: ${origin.flag} ${origin.name.en} (${origin.code})`);
        updated++;
      } else {
        // Create new
        transaction.createOrReplace({
          _id: docId,
          _type: 'origin',
          ...origin,
        });
        console.log(`✨ Creating: ${origin.flag} ${origin.name.en} (${origin.code})`);
        created++;
      }
    }

    // Commit transaction
    await transaction.commit();
    
    console.log(`\n✅ Import complete!`);
    console.log(`   📝 Updated: ${updated} origins`);
    console.log(`   ✨ Created: ${created} new origins`);
    console.log(`   📊 Total: ${origins.length} origins\n`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

importOriginsMerge();
