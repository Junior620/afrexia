# Sanity CMS Population Guide

This guide explains how to populate the Afrexia CMS with the sample data provided.

## Prerequisites

1. Ensure Sanity Studio is running: `npm run dev`
2. Navigate to `/studio` in your browser
3. Log in with your Sanity credentials

## Step-by-Step Population Process

### 1. Populate Certifications First

Certifications are referenced by products, so they must be created first.

**For each certification in `certifications.json`:**

1. Go to **Content** → **Certification** → **Create new**
2. Fill in the fields:
   - **Certification Name**: Enter French and English names
   - **Logo**: Upload a certification logo image (or use placeholder)
   - **Alt Text**: Describe the logo for accessibility
   - **Description**: Enter French and English descriptions
   - **Issuing Body**: Enter the organization name
   - **Valid Until**: Select the expiration date
   - **Certificate Document**: Upload PDF certificate (optional)
   - **Certificate URL**: Enter verification URL (optional)
   - **Workflow Status**: Set to "Published"
3. Click **Publish**

**Sample certifications to create:**
- EU Organic Certification (Ecocert)
- Rainforest Alliance Certified
- Fair Trade Certified
- ISO 22000 Food Safety
- HACCP Certified
- EUDR Compliant

### 2. Populate Team Members

Team members are referenced by blog posts as authors.

**For each team member in `team-members.json`:**

1. Go to **Content** → **Team Member** → **Create new**
2. Fill in the fields:
   - **Full Name**: Enter the person's name
   - **Slug**: Click "Generate" to auto-generate from name
   - **Position**: Enter French and English job titles
   - **Photo**: Upload a professional photo (or use placeholder)
   - **Alt Text**: Describe the photo
   - **Biography**: Enter French and English bios (optional)
   - **Email**: Enter contact email
   - **Phone**: Enter phone number
   - **LinkedIn URL**: Enter LinkedIn profile (optional)
   - **Display Order**: Enter a number (1, 2, 3, etc.)
   - **Workflow Status**: Set to "Published"
3. Click **Publish**

**Sample team members to create:**
- Jean-Paul Mbarga (CEO)
- Marie-Claire Nkolo (COO)
- Thomas Ekani (Quality Manager)
- Sophie Atangana (Sales Director)
- David Fouda (Logistics Manager)

### 3. Populate Blog Categories

Blog categories are referenced by blog posts.

**For each category in `blog-categories.json`:**

1. Go to **Content** → **Blog Category** → **Create new**
2. Fill in the fields:
   - **Title**: Enter French and English titles
   - **Slug**: Click "Generate" for each language
   - **Description**: Enter French and English descriptions
3. Click **Publish**

**Sample categories to create:**
- Market News / Actualités du Marché
- Sustainability / Durabilité
- Quality and Certifications / Qualité et Certifications
- Practical Guides / Guides Pratiques
- Traceability / Traçabilité

### 4. Populate Products

Products can reference certifications.

**For each product in `products.json`:**

1. Go to **Content** → **Product** → **Create new**
2. Fill in the fields:
   - **Product Name**: Enter French and English names
   - **Slug**: Click "Generate" for each language
   - **Translation ID**: Enter a unique ID (e.g., "cocoa-beans-001")
   - **Category**: Select from dropdown (cocoa, coffee, pepper, wood, corn)
   - **Description**: Enter French and English rich text descriptions
   - **Image Gallery**: Upload product images (minimum 1 required)
     - For each image, add Alt Text and optional Caption (FR/EN)
   - **Origin Regions**: Add one or more regions
     - Region Name: e.g., "Centre Region, Cameroon"
     - Coordinates: Click map to set location or enter lat/lng
     - Description: Enter French and English descriptions
   - **Harvest Season**: e.g., "October - March"
   - **Packaging Options**: Add packaging types
     - Type: e.g., "Jute Bags"
     - Weight/Volume: e.g., "60-65 kg"
     - Description: French and English (optional)
   - **Minimum Order Quantity (MOQ)**: e.g., "1 container (20 MT)"
   - **Available Incoterms**: Select applicable terms (FOB, CIF, etc.)
   - **Certifications**: Select previously created certifications
   - **Specification Sheet PDF**: Upload PDF (optional)
   - **Quality Assurance Metrics**: Add QA metrics
     - Metric Name: e.g., "Moisture Content"
     - Value/Range: e.g., "≤ 7.5%"
     - Standard Reference: e.g., "ISO 2451"
   - **HS Code**: Enter customs code
   - **Availability Status**: Select status (in_stock, seasonal, etc.)
   - **Target Markets**: Add market names (e.g., "Europe", "Asia")
   - **SEO**: Enter meta title and description (FR/EN)
   - **Workflow Status**: Set to "Published"
3. Click **Publish**

**Sample products to create:**
- Premium Cocoa Beans / Fèves de Cacao Premium
- Highland Arabica Coffee / Café Arabica des Hauts Plateaux
- Penja White Pepper / Poivre Blanc de Penja
- Sapelli Timber / Bois de Sapelli
- Yellow Corn / Maïs Jaune

### 5. Populate Blog Posts

Blog posts reference team members (authors) and categories.

**For each blog post in `blog-posts.json`:**

1. Go to **Content** → **Blog Post** → **Create new**
2. Fill in the fields:
   - **Title**: Enter French and English titles
   - **Slug**: Click "Generate" for each language
   - **Translation ID**: Enter unique ID (e.g., "blog-cocoa-market-2024")
   - **Author**: Select a team member
   - **Featured Image**: Upload an image
     - Alt Text: Describe the image
   - **Excerpt**: Enter French and English excerpts (short summaries)
   - **Content**: Enter French and English rich text content
     - Use formatting tools for headings, lists, etc.
   - **Categories**: Select one or more categories
   - **Tags**: Add relevant tags (comma-separated)
   - **Published At**: Select publication date and time
   - **Reading Time**: Enter estimated minutes (optional)
   - **SEO**: Enter meta title and description (FR/EN)
   - **Workflow Status**: Set to "Published"
3. Click **Publish**

**Sample blog posts to create:**
- Cocoa Market Trends in 2024
- Understanding EUDR Regulation: Complete Guide
- Arabica Coffee Quality Criteria

### 6. Populate Resources

Resources can reference products.

**For each resource in `resources.json`:**

1. Go to **Content** → **Resource** → **Create new**
2. Fill in the fields:
   - **Title**: Enter French and English titles
   - **Slug**: Click "Generate"
   - **Description**: Enter French and English descriptions
   - **Category**: Select category (catalogs, specifications, etc.)
   - **File**: Upload the document (PDF, DOC, XLS, etc.)
   - **Language**: Select language (fr, en, or both)
   - **Related Products**: Select related products (optional)
   - **Published At**: Select publication date
   - **Display Order**: Enter a number
   - **Workflow Status**: Set to "Published"
3. Click **Publish**

**Sample resources to create:**
- Product Catalog 2024
- Technical Specifications (for each product)
- ISO 22000 Certificate
- EUDR Compliance Guide
- Incoterms 2020 Guide
- Case Studies

## Tips for Efficient Population

### Using Placeholders

If you don't have actual content ready:

- **Images**: Use placeholder images from services like:
  - Unsplash: https://unsplash.com
  - Pexels: https://pexels.com
  - Or use Sanity's built-in image upload with temporary images

- **PDFs**: Create simple placeholder PDFs with basic information

- **Coordinates**: Use approximate coordinates for regions:
  - Cameroon Centre: 4.0511, 11.5021
  - Cameroon South: 2.9333, 11.5167
  - Cameroon West: 5.4667, 10.4167

### Workflow Status

- Use **"Draft"** for content that's not ready
- Use **"In Review"** for content awaiting approval
- Use **"Published"** for content that should appear on the website

### Translation IDs (i18nId)

The `i18nId` field links French and English versions of the same content:
- Use consistent IDs like: `product-cocoa-001`, `blog-market-2024`
- This allows the language switcher to navigate between translations

### Bulk Import (Advanced)

For large datasets, you can use the Sanity CLI to import data programmatically:

```bash
# Install Sanity CLI
npm install -g @sanity/cli

# Import data using a script
sanity dataset import data.ndjson production
```

See Sanity documentation for details: https://www.sanity.io/docs/importing-data

## Verification

After populating content, verify:

1. **Preview on Website**: Check that content appears correctly
2. **Language Switching**: Verify FR/EN versions are linked
3. **References**: Ensure all references (certifications, authors, etc.) work
4. **Images**: Check that all images load properly
5. **SEO**: Verify meta tags are complete

## Troubleshooting

### Content Not Appearing on Website

- Check **Workflow Status** is set to "Published"
- Verify ISR revalidation is working (may take up to 60 seconds)
- Check browser console for errors

### Missing References

- Ensure referenced content (certifications, team members, categories) is created first
- Check that referenced items are also "Published"

### Image Upload Issues

- Ensure images are in supported formats (JPG, PNG, WebP)
- Check file size limits (Sanity default: 10MB)
- Verify Sanity project has sufficient storage

### Slug Conflicts

- Each slug must be unique within its content type
- Use descriptive, URL-friendly slugs
- Regenerate if conflicts occur

## Next Steps

After populating content:

1. Review all content for accuracy
2. Test the website thoroughly
3. Train content editors on the CMS
4. Set up regular content update schedules
5. Monitor analytics to see which content performs best

## Support

For Sanity-specific issues:
- Documentation: https://www.sanity.io/docs
- Community: https://www.sanity.io/community
- Support: https://www.sanity.io/support

For Afrexia-specific questions:
- Contact the development team
- Refer to the CMS documentation (see task 26.2)
