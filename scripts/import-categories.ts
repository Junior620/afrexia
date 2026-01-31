/**
 * Import Product Categories Script
 * 
 * This script imports predefined product categories into Sanity CMS
 * for use in product category references.
 * 
 * Usage:
 *   npx tsx scripts/import-categories.ts
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

// Product categories data
const categories = [
  {
    _type: 'category',
    name: {
      fr: 'Cacao',
      en: 'Cocoa',
      es: 'Cacao',
      de: 'Kakao',
      ru: 'Какао',
    },
    slug: {
      fr: { current: 'cacao' },
      en: { current: 'cocoa' },
      es: { current: 'cacao' },
      de: { current: 'kakao' },
      ru: { current: 'kakao' },
    },
    description: {
      fr: 'Fèves de cacao fermentées et séchées pour chocolaterie et industrie',
      en: 'Fermented and dried cocoa beans for chocolate and industry',
      es: 'Granos de cacao fermentados y secados para chocolate e industria',
      de: 'Fermentierte und getrocknete Kakaobohnen für Schokolade und Industrie',
      ru: 'Ферментированные и высушенные какао-бобы для шоколада и промышленности',
    },
    sortOrder: 0,
  },
  {
    _type: 'category',
    name: {
      fr: 'Café',
      en: 'Coffee',
      es: 'Café',
      de: 'Kaffee',
      ru: 'Кофе',
    },
    slug: {
      fr: { current: 'cafe' },
      en: { current: 'coffee' },
      es: { current: 'cafe' },
      de: { current: 'kaffee' },
      ru: { current: 'kofe' },
    },
    description: {
      fr: 'Café arabica et robusta en grains verts pour torréfaction',
      en: 'Arabica and robusta green coffee beans for roasting',
      es: 'Café arábica y robusta en grano verde para tostado',
      de: 'Arabica- und Robusta-Rohkaffee zum Rösten',
      ru: 'Зеленый кофе арабика и робуста для обжарки',
    },
    sortOrder: 1,
  },
  {
    _type: 'category',
    name: {
      fr: 'Poivre',
      en: 'Pepper',
      es: 'Pimienta',
      de: 'Pfeffer',
      ru: 'Перец',
    },
    slug: {
      fr: { current: 'poivre' },
      en: { current: 'pepper' },
      es: { current: 'pimienta' },
      de: { current: 'pfeffer' },
      ru: { current: 'perec' },
    },
    description: {
      fr: 'Poivre noir, blanc et vert de qualité export',
      en: 'Export quality black, white and green pepper',
      es: 'Pimienta negra, blanca y verde de calidad exportación',
      de: 'Exportqualität schwarzer, weißer und grüner Pfeffer',
      ru: 'Экспортный черный, белый и зеленый перец',
    },
    sortOrder: 2,
  },
  {
    _type: 'category',
    name: {
      fr: 'Bois',
      en: 'Wood',
      es: 'Madera',
      de: 'Holz',
      ru: 'Древесина',
    },
    slug: {
      fr: { current: 'bois' },
      en: { current: 'wood' },
      es: { current: 'madera' },
      de: { current: 'holz' },
      ru: { current: 'drevesina' },
    },
    description: {
      fr: 'Bois tropicaux certifiés pour construction et ébénisterie',
      en: 'Certified tropical wood for construction and cabinetry',
      es: 'Madera tropical certificada para construcción y ebanistería',
      de: 'Zertifiziertes Tropenholz für Bau und Möbelbau',
      ru: 'Сертифицированная тропическая древесина для строительства и мебели',
    },
    sortOrder: 3,
  },
  {
    _type: 'category',
    name: {
      fr: 'Maïs',
      en: 'Corn',
      es: 'Maíz',
      de: 'Mais',
      ru: 'Кукуруза',
    },
    slug: {
      fr: { current: 'mais' },
      en: { current: 'corn' },
      es: { current: 'maiz' },
      de: { current: 'mais' },
      ru: { current: 'kukuruza' },
    },
    description: {
      fr: 'Maïs jaune et blanc pour alimentation humaine et animale',
      en: 'Yellow and white corn for human and animal feed',
      es: 'Maíz amarillo y blanco para alimentación humana y animal',
      de: 'Gelber und weißer Mais für Mensch und Tier',
      ru: 'Желтая и белая кукуруза для питания человека и животных',
    },
    sortOrder: 4,
  },
];

async function importCategories() {
  console.log('📦 Starting product categories import...\n');

  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Error: SANITY_API_TOKEN not found in environment variables');
    console.error('Please add SANITY_API_TOKEN to your .env.local file');
    console.error('Get your token from: https://www.sanity.io/manage');
    process.exit(1);
  }

  try {
    // Check if categories already exist
    const existingCategories = await client.fetch('*[_type == "category"]');
    
    if (existingCategories.length > 0) {
      console.log(`⚠️  Found ${existingCategories.length} existing category(ies)`);
      console.log('Skipping import to avoid duplicates.');
      console.log('To force reimport, delete existing categories in Sanity Studio first.\n');
      return;
    }

    // Create transaction for batch import
    const transaction = client.transaction();

    categories.forEach((category) => {
      // Generate a deterministic ID based on English slug
      const docId = `category-${category.slug.en.current}`;
      
      transaction.createOrReplace({
        _id: docId,
        ...category,
      });
    });

    // Commit transaction
    const result = await transaction.commit();
    
    console.log(`✅ Successfully imported ${categories.length} product categories!\n`);
    console.log('Imported categories:');
    categories.forEach((category, index) => {
      console.log(`  ${index + 1}. ${category.name.en} (${category.slug.en.current})`);
    });
    
    console.log('\n🎉 Import complete! You can now use these categories in your products.');
    console.log('👉 Go to Sanity Studio to verify: http://localhost:3333\n');
    
  } catch (error) {
    console.error('❌ Error importing categories:', error);
    process.exit(1);
  }
}

// Run import
importCategories();
