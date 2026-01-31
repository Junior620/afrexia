/**
 * Import All Base Data Script
 * 
 * This script imports all base data (categories, origins, certifications)
 * into Sanity CMS in the correct order.
 * 
 * Usage:
 *   npx tsx scripts/import-all-data.ts
 * 
 * Requirements:
 *   - SANITY_API_TOKEN environment variable with write permissions
 */

import { execSync } from 'child_process';

console.log('🚀 Starting complete data import...\n');
console.log('This will import:');
console.log('  1. Product Categories (Cocoa, Coffee, Pepper, Wood, Corn)');
console.log('  2. Origin Countries (15 African countries)');
console.log('  3. Certifications (optional)\n');

try {
  // Import categories first
  console.log('📦 Step 1/2: Importing categories...');
  execSync('npx tsx scripts/import-categories.ts', { stdio: 'inherit' });
  
  // Import origins
  console.log('\n🌍 Step 2/2: Importing origins...');
  execSync('npx tsx scripts/import-origins.ts', { stdio: 'inherit' });
  
  console.log('\n✅ All data imported successfully!');
  console.log('\n📝 Next steps:');
  console.log('  1. Go to Sanity Studio: http://localhost:3333');
  console.log('  2. Create your first product');
  console.log('  3. Select category and origins from the imported data\n');
  
} catch (error) {
  console.error('\n❌ Import failed:', error);
  process.exit(1);
}
