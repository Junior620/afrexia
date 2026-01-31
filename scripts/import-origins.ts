/**
 * Import Origin Countries Script
 * 
 * This script imports a predefined list of African origin countries
 * into Sanity CMS for use in product origin references.
 * 
 * Usage:
 *   npx tsx scripts/import-origins.ts
 * 
 * Requirements:
 *   - SANITY_API_TOKEN environment variable with write permissions
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Sanity client with write token
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Origin countries data - African countries for commodities
const origins = [
  {
    _type: 'origin',
    name: {
      fr: 'Cameroun',
      en: 'Cameroon',
      es: 'Camerún',
      de: 'Kamerun',
      ru: 'Камерун',
    },
    code: 'CM',
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
    _type: 'origin',
    name: {
      fr: "Côte d'Ivoire",
      en: 'Ivory Coast',
      es: 'Costa de Marfil',
      de: 'Elfenbeinküste',
      ru: "Кот-д'Ивуар",
    },
    code: 'CI',
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
    _type: 'origin',
    name: {
      fr: 'Ghana',
      en: 'Ghana',
      es: 'Ghana',
      de: 'Ghana',
      ru: 'Гана',
    },
    code: 'GH',
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
    _type: 'origin',
    name: {
      fr: 'Nigéria',
      en: 'Nigeria',
      es: 'Nigeria',
      de: 'Nigeria',
      ru: 'Нигерия',
    },
    code: 'NG',
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
    _type: 'origin',
    name: {
      fr: 'Éthiopie',
      en: 'Ethiopia',
      es: 'Etiopía',
      de: 'Äthiopien',
      ru: 'Эфиопия',
    },
    code: 'ET',
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
    _type: 'origin',
    name: {
      fr: 'Kenya',
      en: 'Kenya',
      es: 'Kenia',
      de: 'Kenia',
      ru: 'Кения',
    },
    code: 'KE',
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
    _type: 'origin',
    name: {
      fr: 'Ouganda',
      en: 'Uganda',
      es: 'Uganda',
      de: 'Uganda',
      ru: 'Уганда',
    },
    code: 'UG',
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
    _type: 'origin',
    name: {
      fr: 'Tanzanie',
      en: 'Tanzania',
      es: 'Tanzania',
      de: 'Tansania',
      ru: 'Танзания',
    },
    code: 'TZ',
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
    _type: 'origin',
    name: {
      fr: 'Rwanda',
      en: 'Rwanda',
      es: 'Ruanda',
      de: 'Ruanda',
      ru: 'Руанда',
    },
    code: 'RW',
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
    _type: 'origin',
    name: {
      fr: 'Burundi',
      en: 'Burundi',
      es: 'Burundi',
      de: 'Burundi',
      ru: 'Бурунди',
    },
    code: 'BI',
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
    _type: 'origin',
    name: {
      fr: 'Togo',
      en: 'Togo',
      es: 'Togo',
      de: 'Togo',
      ru: 'Того',
    },
    code: 'TG',
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
    _type: 'origin',
    name: {
      fr: 'Bénin',
      en: 'Benin',
      es: 'Benín',
      de: 'Benin',
      ru: 'Бенин',
    },
    code: 'BJ',
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
    _type: 'origin',
    name: {
      fr: 'Sénégal',
      en: 'Senegal',
      es: 'Senegal',
      de: 'Senegal',
      ru: 'Сенегал',
    },
    code: 'SN',
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
    _type: 'origin',
    name: {
      fr: 'Madagascar',
      en: 'Madagascar',
      es: 'Madagascar',
      de: 'Madagaskar',
      ru: 'Мадагаскар',
    },
    code: 'MG',
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
    _type: 'origin',
    name: {
      fr: 'Congo (RDC)',
      en: 'Congo (DRC)',
      es: 'Congo (RDC)',
      de: 'Kongo (DRK)',
      ru: 'Конго (ДРК)',
    },
    code: 'CD',
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

async function importOrigins() {
  console.log('🌍 Starting origin countries import...\n');

  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Error: SANITY_API_TOKEN not found in environment variables');
    console.error('Please add SANITY_API_TOKEN to your .env.local file');
    console.error('Get your token from: https://www.sanity.io/manage');
    process.exit(1);
  }

  try {
    // Check if origins already exist
    const existingOrigins = await client.fetch('*[_type == "origin"]');
    
    if (existingOrigins.length > 0) {
      console.log(`⚠️  Found ${existingOrigins.length} existing origin(s)`);
      console.log('Do you want to:');
      console.log('  1. Skip import (keep existing)');
      console.log('  2. Add new origins only (merge)');
      console.log('  3. Delete all and reimport (fresh start)');
      console.log('\nFor now, skipping import to avoid duplicates.');
      console.log('To force reimport, delete existing origins in Sanity Studio first.\n');
      return;
    }

    // Create transaction for batch import
    const transaction = client.transaction();

    origins.forEach((origin) => {
      // Generate a deterministic ID based on country code
      const docId = `origin-${origin.code.toLowerCase()}`;
      
      transaction.createOrReplace({
        _id: docId,
        ...origin,
      });
    });

    // Commit transaction
    const result = await transaction.commit();
    
    console.log(`✅ Successfully imported ${origins.length} origin countries!\n`);
    console.log('Imported countries:');
    origins.forEach((origin, index) => {
      console.log(`  ${index + 1}. ${origin.flag} ${origin.name.en} (${origin.code})`);
    });
    
    console.log('\n🎉 Import complete! You can now use these origins in your products.');
    console.log('👉 Go to Sanity Studio to verify: http://localhost:3333\n');
    
  } catch (error) {
    console.error('❌ Error importing origins:', error);
    process.exit(1);
  }
}

// Run import
importOrigins();
