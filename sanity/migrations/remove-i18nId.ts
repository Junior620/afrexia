/**
 * Migration to remove i18nId field from all products
 * Run with: npx sanity exec sanity/migrations/remove-i18nId.ts --with-user-token
 */

import { getCliClient } from 'sanity/cli';

const client = getCliClient();

async function removeI18nIdField() {
  console.log('🔍 Fetching products with i18nId field...');
  
  const products = await client.fetch(`
    *[_type == "product" && defined(i18nId)] {
      _id,
      _rev,
      i18nId
    }
  `);

  console.log(`📦 Found ${products.length} products with i18nId field`);

  if (products.length === 0) {
    console.log('✅ No products to update');
    return;
  }

  // Create transaction to remove i18nId field
  const transaction = client.transaction();

  products.forEach((product: any) => {
    console.log(`🗑️  Removing i18nId from product: ${product._id}`);
    transaction.patch(product._id, (patch) => patch.unset(['i18nId']));
  });

  console.log('💾 Committing transaction...');
  await transaction.commit();

  console.log('✅ Migration completed successfully!');
}

removeI18nIdField()
  .catch((err) => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  });
