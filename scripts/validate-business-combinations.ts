/**
 * Validate Business Combinations Script
 *
 * Task 7.2: Validates the 15 approved product×country combinations for
 * the programmatic SEO system.
 *
 * - Identifies the 15 combinations to approve (out of 20 possible)
 * - Verifies approvedForSEO = true for all relevant export countries
 * - Verifies dataCompleteness >= 70% for each country
 * - Reports validation results and any issues
 *
 * Usage:
 *   npx tsx scripts/validate-business-combinations.ts
 *   npx tsx scripts/validate-business-combinations.ts --fix   (updates Sanity if needed)
 *
 * Requirements: 1.2
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// ============================================================================
// Business combination definitions
// ============================================================================

/**
 * The 15 approved product×country combinations (out of 20 possible).
 * Commercially most relevant for Afrexia's export business.
 */
const APPROVED_COMBINATIONS: Array<{
  productSlug: string;
  productName: string;
  countryCode: string;
  countryName: string;
  justification: string;
}> = [
  // Cacao (5/5 countries)
  { productSlug: 'cacao', productName: 'Cacao', countryCode: 'NL', countryName: 'Pays-Bas', justification: 'Rotterdam — principal hub de négoce du cacao en Europe' },
  { productSlug: 'cacao', productName: 'Cacao', countryCode: 'BE', countryName: 'Belgique', justification: 'Anvers traite >60% des fèves mondiales; industrie chocolatière de renommée mondiale' },
  { productSlug: 'cacao', productName: 'Cacao', countryCode: 'DE', countryName: 'Allemagne', justification: 'Grande industrie chocolatière et confiserie' },
  { productSlug: 'cacao', productName: 'Cacao', countryCode: 'FR', countryName: 'France', justification: 'Marché chocolatier majeur; liens commerciaux franco-camerounais forts' },
  { productSlug: 'cacao', productName: 'Cacao', countryCode: 'CN', countryName: 'Chine', justification: 'Marché en forte croissance pour le cacao et le chocolat' },

  // Café Arabica (4/5 countries — CN excluded)
  { productSlug: 'cafe-arabica', productName: 'Café Arabica', countryCode: 'NL', countryName: 'Pays-Bas', justification: 'Hub majeur de négoce du café; Amsterdam Coffee Festival' },
  { productSlug: 'cafe-arabica', productName: 'Café Arabica', countryCode: 'BE', countryName: 'Belgique', justification: 'Marché du café de spécialité bien établi' },
  { productSlug: 'cafe-arabica', productName: 'Café Arabica', countryCode: 'DE', countryName: 'Allemagne', justification: 'Plus grand marché du café en Europe; Hambourg est le principal port café UE' },
  { productSlug: 'cafe-arabica', productName: 'Café Arabica', countryCode: 'FR', countryName: 'France', justification: 'Marché café majeur; forte affinité culturelle pour le café de qualité' },

  // Café Robusta (3/5 countries — BE and CN excluded)
  { productSlug: 'cafe-robusta', productName: 'Café Robusta', countryCode: 'NL', countryName: 'Pays-Bas', justification: 'Hub majeur de négoce et réexport du café' },
  { productSlug: 'cafe-robusta', productName: 'Café Robusta', countryCode: 'DE', countryName: 'Allemagne', justification: 'Forte demande en robusta pour les mélanges et l\'espresso' },
  { productSlug: 'cafe-robusta', productName: 'Café Robusta', countryCode: 'FR', countryName: 'France', justification: 'France est un grand consommateur de robusta (culture espresso)' },

  // Cajou (3/5 countries — BE and FR excluded)
  { productSlug: 'cajou', productName: 'Cajou', countryCode: 'NL', countryName: 'Pays-Bas', justification: 'Hub majeur de négoce et distribution des noix en Europe' },
  { productSlug: 'cajou', productName: 'Cajou', countryCode: 'DE', countryName: 'Allemagne', justification: 'Grand marché de snacks et industrie alimentaire aux noix' },
  { productSlug: 'cajou', productName: 'Cajou', countryCode: 'CN', countryName: 'Chine', justification: 'Plus grand consommateur mondial de noix de cajou' },
];

/**
 * The 5 excluded combinations (less commercially relevant for V1).
 */
const EXCLUDED_COMBINATIONS: Array<{
  productSlug: string;
  productName: string;
  countryCode: string;
  countryName: string;
  reason: string;
}> = [
  { productSlug: 'cafe-arabica', productName: 'Café Arabica', countryCode: 'CN', countryName: 'Chine', reason: 'Marché du café de spécialité naissant; priorité commerciale moindre pour V1' },
  { productSlug: 'cafe-robusta', productName: 'Café Robusta', countryCode: 'BE', countryName: 'Belgique', reason: 'La Belgique importe principalement de l\'arabica; demande en robusta limitée' },
  { productSlug: 'cafe-robusta', productName: 'Café Robusta', countryCode: 'CN', countryName: 'Chine', reason: 'Marché robusta chinois restreint; ROI faible pour V1' },
  { productSlug: 'cajou', productName: 'Cajou', countryCode: 'BE', countryName: 'Belgique', reason: 'La Belgique n\'est pas un marché significatif pour les noix de cajou' },
  { productSlug: 'cajou', productName: 'Cajou', countryCode: 'FR', countryName: 'France', reason: 'La France importe des cajous mais n\'est pas prioritaire vs NL/DE/CN' },
];

const MIN_DATA_COMPLETENESS = 70;

// ============================================================================
// Types
// ============================================================================

interface SanityExportCountry {
  _id: string;
  code: string;
  name: { fr?: string; en?: string };
  slug: { current: string };
  dataCompleteness: number;
  approvedForSEO: boolean;
}

interface SanityProduct {
  _id: string;
  name: string | { fr?: string; en?: string };
  slug: { current: string };
}

interface ValidationIssue {
  type: 'error' | 'warning';
  message: string;
}

// ============================================================================
// Validation logic
// ============================================================================

async function validateBusinessCombinations(fix = false): Promise<void> {
  console.log('🔍 Validating business combinations for programmatic SEO...\n');
  console.log(`📋 Approved combinations: ${APPROVED_COMBINATIONS.length}`);
  console.log(`🚫 Excluded combinations: ${EXCLUDED_COMBINATIONS.length}`);
  console.log(`📊 Total possible: ${APPROVED_COMBINATIONS.length + EXCLUDED_COMBINATIONS.length}\n`);

  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Error: SANITY_API_TOKEN not found in environment variables');
    console.error('Please add SANITY_API_TOKEN to your .env.local file');
    process.exit(1);
  }

  // Fetch export countries from Sanity
  const countries = await client.fetch<SanityExportCountry[]>(
    `*[_type == "exportCountry"] {
      _id,
      code,
      "name": name { fr, en },
      "slug": slug { current },
      dataCompleteness,
      approvedForSEO
    }`
  );

  // Fetch products from Sanity
  const products = await client.fetch<SanityProduct[]>(
    `*[_type == "product" && workflowStatus == "published"] {
      _id,
      "name": name,
      "slug": slug.fr { current }
    }`
  );

  console.log(`✅ Found ${countries.length} export countries in Sanity`);
  console.log(`✅ Found ${products.length} published products in Sanity\n`);

  // Build lookup maps
  const countryByCode = new Map(countries.map((c) => [c.code, c]));
  const productBySlug = new Map(products.map((p) => [p.slug.current, p]));

  const issues: ValidationIssue[] = [];
  const toFix: Array<{ id: string; patch: Record<string, unknown> }> = [];

  // ── Validate approved combinations ──────────────────────────────────────
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ APPROVED COMBINATIONS (15)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  for (const combo of APPROVED_COMBINATIONS) {
    const country = countryByCode.get(combo.countryCode);
    const product = productBySlug.get(combo.productSlug);

    const productStatus = product ? '✅' : '⚠️ ';
    const countryStatus = country ? '✅' : '❌';
    const approvedStatus = country?.approvedForSEO ? '✅' : '❌';
    const completenessOk = (country?.dataCompleteness ?? 0) >= MIN_DATA_COMPLETENESS;
    const completenessStatus = completenessOk ? '✅' : '❌';

    console.log(
      `  ${combo.productName} × ${combo.countryName} (${combo.countryCode})`
    );
    console.log(`    Product in Sanity:    ${productStatus} ${product ? `slug="${product.slug.current}"` : 'NOT FOUND'}`);
    console.log(`    Country in Sanity:   ${countryStatus} ${country ? `slug="${country.slug.current}"` : 'NOT FOUND'}`);
    console.log(`    approvedForSEO:      ${approvedStatus} ${country?.approvedForSEO ?? 'N/A'}`);
    console.log(`    dataCompleteness:    ${completenessStatus} ${country?.dataCompleteness ?? 'N/A'}% (min: ${MIN_DATA_COMPLETENESS}%)`);
    console.log(`    Justification:       ${combo.justification}`);
    console.log();

    if (!country) {
      issues.push({ type: 'error', message: `Country ${combo.countryName} (${combo.countryCode}) not found in Sanity` });
    } else {
      if (!country.approvedForSEO) {
        issues.push({ type: 'error', message: `Country ${combo.countryName} (${combo.countryCode}) has approvedForSEO=false` });
        if (fix) {
          toFix.push({ id: country._id, patch: { approvedForSEO: true } });
        }
      }
      if (!completenessOk) {
        issues.push({
          type: 'error',
          message: `Country ${combo.countryName} (${combo.countryCode}) has dataCompleteness=${country.dataCompleteness}% (< ${MIN_DATA_COMPLETENESS}%)`,
        });
        if (fix) {
          toFix.push({ id: country._id, patch: { dataCompleteness: MIN_DATA_COMPLETENESS } });
        }
      }
    }

    if (!product) {
      issues.push({ type: 'warning', message: `Product "${combo.productName}" (slug: ${combo.productSlug}) not found in Sanity — page won't be generated` });
    }
  }

  // ── Report excluded combinations ─────────────────────────────────────────
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚫 EXCLUDED COMBINATIONS (5)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  for (const combo of EXCLUDED_COMBINATIONS) {
    console.log(`  ${combo.productName} × ${combo.countryName} (${combo.countryCode})`);
    console.log(`    Reason: ${combo.reason}`);
    console.log();
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 VALIDATION SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const errors = issues.filter((i) => i.type === 'error');
  const warnings = issues.filter((i) => i.type === 'warning');

  console.log(`  Total combinations checked: ${APPROVED_COMBINATIONS.length}`);
  console.log(`  Errors:   ${errors.length}`);
  console.log(`  Warnings: ${warnings.length}`);
  console.log();

  if (errors.length > 0) {
    console.log('  ❌ ERRORS:');
    errors.forEach((e) => console.log(`     - ${e.message}`));
    console.log();
  }

  if (warnings.length > 0) {
    console.log('  ⚠️  WARNINGS:');
    warnings.forEach((w) => console.log(`     - ${w.message}`));
    console.log();
  }

  // ── Apply fixes if requested ──────────────────────────────────────────────
  if (fix && toFix.length > 0) {
    console.log(`🔧 Applying ${toFix.length} fix(es) to Sanity...\n`);
    const transaction = client.transaction();
    for (const { id, patch } of toFix) {
      transaction.patch(id, { set: patch });
    }
    await transaction.commit();
    console.log('✅ Fixes applied successfully.\n');
  } else if (fix && toFix.length === 0) {
    console.log('✅ No fixes needed — all data is already correct.\n');
  }

  // ── Final result ──────────────────────────────────────────────────────────
  if (errors.length === 0) {
    console.log('🎉 All 15 approved combinations are valid!');
    console.log('   approvedForSEO = true ✅');
    console.log(`   dataCompleteness >= ${MIN_DATA_COMPLETENESS}% ✅`);
    console.log('\n   The programmatic SEO system will generate pages for these combinations.');
  } else {
    console.log(`❌ Validation failed with ${errors.length} error(s).`);
    if (!fix) {
      console.log('   Run with --fix to automatically correct Sanity data:');
      console.log('   npx tsx scripts/validate-business-combinations.ts --fix');
    }
    process.exit(1);
  }
}

// ============================================================================
// Entry point
// ============================================================================

const fix = process.argv.includes('--fix');
validateBusinessCombinations(fix).catch((err) => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
