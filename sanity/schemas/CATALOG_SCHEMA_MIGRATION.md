# Catalog Schema Migration Guide

## Overview

This document describes the schema updates made for the Product Catalog Redesign feature. The schemas have been updated to support the new catalog functionality with enhanced filtering, localization, and B2B features.

## New Schemas

### 1. Category Schema (`category.ts`)

**Purpose:** Product categories for filtering and organization.

**Key Fields:**
- `name` (localized): Category name in all 5 languages
- `slug`: URL-friendly identifier
- `icon`: Icon name or emoji
- `description` (localized): Category description
- `sortOrder`: Display order in filters

**Usage:** Referenced by products via `category` field.

### 2. Origin Schema (`origin.ts`)

**Purpose:** Country of origin for products.

**Key Fields:**
- `name` (localized): Country name in all 5 languages
- `code`: ISO 3166-1 alpha-2 country code (e.g., "CI", "GH")
- `flag`: Flag emoji or URL
- `flagImage`: Optional flag image
- `description` (localized): Origin description
- `sortOrder`: Display order in filters

**Usage:** Referenced by products via `origins` array field.

## Updated Schemas

### 3. Product Schema (`product.ts`)

**Major Changes:**

#### New Required Fields:
- `subtitle` (localized): Short product subtitle
- `heroImage`: Main catalog card image (replaces gallery[0])
- `availability`: Status enum (in-stock, limited, pre-order, out-of-stock)
- `origins`: Array of origin references (replaces originRegions for catalog)
- `eudrReady`: Boolean for EUDR compliance
- `qaAvailable`: Boolean for QA documentation availability
- `documents`: Object with COA, specSheet, chainOfCustody booleans
- `moq`: Object with value (number) and unit (string)
- `packaging` (localized): Packaging information
- `grade` (localized): Product grade
- `leadTime` (localized): Delivery lead time
- `notes` (localized): Additional notes
- `tags`: Array of searchable tags
- `markets`: Array of target markets

#### Changed Fields:
- `category`: Now a reference to category schema (was string enum)
- `name`: French and English now required (was all optional)
- `incoterms`: Now required with min 1 item
- `moq`: Now structured object (was string)
- `availability`: Updated enum values to match catalog requirements

#### Preserved Fields:
- `description` (localized, blockContent)
- `gallery`: Additional product images
- `originRegions`: Detailed origin info with coordinates
- `harvestSeason`: Harvest season string
- `packagingOptions`: Detailed packaging options
- `specificationPDF`: PDF specification sheet
- `qaMetrics`: Quality metrics array
- `hsCode`: Harmonized System Code
- `seo`: SEO metadata
- `workflowStatus`: Draft/Review/Published status

### 4. Certification Schema (`certification.ts`)

**Changes:**
- Added `icon` field for badge display
- Added `sortOrder` field for display ordering
- Made French and English names required

## Migration Steps

### For Existing Products:

1. **Add Hero Image:**
   - If product has gallery images, set first image as heroImage
   - Ensure alt text is present

2. **Update Category:**
   - Create category documents for existing categories
   - Update product category field to reference new category documents

3. **Add Origins:**
   - Create origin documents for all countries
   - Update products to reference origin documents instead of using originRegions

4. **Set Availability:**
   - Map old availability values to new enum:
     - `in_stock` → `in-stock`
     - `pre_order` → `pre-order`
     - `out_of_stock` → `out-of-stock`
     - Add `limited` for limited stock items

5. **Structure MOQ:**
   - Parse existing MOQ strings into value + unit objects
   - Example: "500 kg" → { value: 500, unit: "kg" }

6. **Add New Boolean Fields:**
   - Set `eudrReady` based on compliance status
   - Set `qaAvailable` to true if QA docs exist
   - Set `documents` object based on available documentation

7. **Add Localized Fields:**
   - Add `subtitle` in French and English (minimum)
   - Localize `packaging`, `grade`, `leadTime`, `notes` if needed

8. **Add Tags:**
   - Extract searchable keywords from product data
   - Add to `tags` array for better filtering

## Sanity Studio Updates

After deploying these schema changes:

1. Restart Sanity Studio to load new schemas
2. Create initial category documents
3. Create initial origin documents
4. Update existing products with new required fields
5. Test product creation with new schema

## Validation Rules

### Product:
- `name.fr` and `name.en` are required
- `slug.fr` and `slug.en` are required
- `category` reference is required
- `heroImage` is required
- `availability` is required
- `origins` array must have at least 1 item
- `moq.value` must be positive number
- `moq.unit` is required
- `incoterms` array must have at least 1 item

### Category:
- `name.fr` and `name.en` are required
- `slug` is required

### Origin:
- `name.fr` and `name.en` are required
- `code` must be exactly 2 uppercase letters (ISO format)

### Certification:
- `name.fr` and `name.en` are required
- `logo` is required with alt text

## Breaking Changes

⚠️ **Important:** These changes may break existing queries:

1. **Category field type changed** from string to reference
   - Update queries to resolve category reference
   - Access category name via `category.name.en`

2. **MOQ field type changed** from string to object
   - Update queries to access `moq.value` and `moq.unit`

3. **Availability enum values changed**
   - Update any hardcoded availability checks
   - Use new hyphenated values: `in-stock`, `pre-order`, etc.

4. **Origins is now required**
   - All products must have at least one origin
   - Update product creation forms

## Query Examples

### Fetch Product with New Fields:

```groq
*[_type == "product" && workflowStatus == "published"] {
  _id,
  name,
  slug,
  subtitle,
  "category": category->{
    name,
    slug,
    icon
  },
  heroImage,
  availability,
  "origins": origins[]->{
    name,
    code,
    flag
  },
  "certifications": certifications[]->{
    name,
    icon,
    logo
  },
  eudrReady,
  qaAvailable,
  documents,
  moq,
  incoterms,
  packaging,
  grade,
  leadTime,
  notes,
  tags,
  markets
}
```

### Fetch All Categories:

```groq
*[_type == "category"] | order(sortOrder asc) {
  _id,
  name,
  slug,
  icon
}
```

### Fetch All Origins:

```groq
*[_type == "origin"] | order(sortOrder asc) {
  _id,
  name,
  code,
  flag
}
```

## Testing Checklist

- [ ] Create new category document
- [ ] Create new origin document
- [ ] Create new product with all required fields
- [ ] Verify product preview shows correctly
- [ ] Test category reference resolution
- [ ] Test origin reference resolution
- [ ] Verify localized fields display correctly
- [ ] Test MOQ object structure
- [ ] Verify availability enum values
- [ ] Test document availability flags
- [ ] Verify EUDR and QA boolean fields

## Support

For questions or issues with the schema migration, refer to:
- Product Catalog Redesign requirements: `.kiro/specs/product-catalog-redesign/requirements.md`
- Product Catalog Redesign design: `.kiro/specs/product-catalog-redesign/design.md`
