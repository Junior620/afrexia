# Managing Products

This guide explains how to add, edit, and manage products in the Afrexia CMS.

## Overview

Products are the core content type for the Afrexia website. Each product represents an agricultural commodity (cocoa, coffee, pepper, wood, corn) with complete specifications, images, and commercial information.

## Product Structure

A product document contains:

- **Basic Information**: Name, category, description
- **Images**: Product gallery with multiple photos
- **Origin**: Geographic regions with coordinates
- **Specifications**: Harvest season, packaging, MOQ, Incoterms
- **Quality**: QA metrics, certifications, HS code
- **SEO**: Meta tags for search engines
- **Workflow**: Draft/Review/Published status

## Creating a New Product

### Step 1: Access Products

1. Click **"Product"** in the sidebar
2. Click **"+ Create"** button

### Step 2: Basic Information

#### Product Name (Required)

Enter the product name in both languages:
- **French**: e.g., "Fèves de Cacao Premium"
- **English**: e.g., "Premium Cocoa Beans"

**Tips**:
- Use descriptive names that buyers will search for
- Include quality indicators (Premium, Grade A, etc.)
- Keep names concise but informative

#### Slug (Required)

Generate URL-friendly slugs:
1. Click **"Generate"** button for French slug
2. Click **"Generate"** button for English slug

**Example**:
- French slug: `feves-de-cacao-premium`
- English slug: `premium-cocoa-beans`

**Tips**:
- Slugs are auto-generated from names
- Edit manually if needed (lowercase, hyphens only)
- Slugs must be unique per language

#### Translation ID (Required)

Enter a unique identifier to link FR/EN versions:
- Format: `category-product-number`
- Example: `cocoa-beans-001`

**Tips**:
- Use consistent naming: `cocoa-001`, `coffee-001`, etc.
- This enables language switching on the website
- Keep it simple and memorable

#### Category (Required)

Select the product category:
- **Cocoa**: Cocoa beans and derivatives
- **Coffee**: Coffee beans (Arabica, Robusta)
- **Pepper**: Penja pepper (white, black)
- **Wood**: Timber and wood products
- **Corn**: Yellow corn and maize

#### Description (Required)

Write compelling product descriptions:

**French**:
```
Nos fèves de cacao premium proviennent des meilleures 
plantations du Cameroun. Cultivées de manière durable 
et récoltées à maturité optimale, elles offrent un 
profil aromatique riche et complexe.
```

**English**:
```
Our premium cocoa beans come from the finest plantations 
in Cameroon. Sustainably grown and harvested at optimal 
maturity, they offer a rich and complex aromatic profile.
```

**Tips**:
- Start with key benefits
- Mention origin and quality
- Include target use cases
- Use formatting (headings, lists) for readability
- Keep it professional but engaging

### Step 3: Image Gallery (Required)

Add product photos:

1. Click **"Add item"** in Gallery section
2. Upload image or drag and drop
3. Crop/adjust if needed
4. **Alt Text** (Required): Describe the image
   - Example: "Premium cocoa beans in jute bag"
5. **Caption** (Optional): Add French and English captions
6. Repeat for more images (minimum 1 required)

**Tips**:
- Use high-quality images (minimum 1200px width)
- First image is the main product photo
- Include multiple angles and close-ups
- Show packaging and quality details
- Ensure good lighting and focus

**Image Guidelines**:
- Format: JPG or PNG
- Size: 1200-2400px width recommended
- File size: Under 2MB per image
- Aspect ratio: 4:3 or 16:9 preferred

### Step 4: Origin Regions

Add geographic origin information:

1. Click **"Add item"** in Origin Regions
2. **Region Name**: e.g., "Centre Region, Cameroon"
3. **Coordinates**: Click map or enter lat/lng
   - Example: Latitude 4.0511, Longitude 11.5021
4. **Description**: Explain the region (FR/EN)
   - Example: "Known for fertile soils and ideal climate"
5. Repeat for multiple origin regions

**Tips**:
- Be specific about regions (not just "Cameroon")
- Use accurate coordinates (important for EUDR compliance)
- Describe what makes each region special
- Include 1-3 origin regions per product

### Step 5: Harvest and Packaging

#### Harvest Season

Enter the harvest period:
- Example: "October - March"
- Example: "Year-round"
- Example: "November - February, May - July"

#### Packaging Options

Add available packaging types:

1. Click **"Add item"**
2. **Type**: e.g., "Jute Bags", "Bulk Container"
3. **Weight/Volume**: e.g., "60-65 kg", "20 MT"
4. **Description** (Optional): Additional details (FR/EN)
5. Repeat for each packaging option

**Common packaging types**:
- Jute Bags (60-65 kg)
- PP Bags (50 kg)
- Bulk Container (20-25 MT)
- Vacuum Sealed Bags (25 kg)
- Wooden Crates (variable)

#### Minimum Order Quantity (MOQ)

Enter the minimum order:
- Example: "1 container (20 MT)"
- Example: "500 kg"
- Example: "5 MT"

**Tips**:
- Be clear about units (kg, MT, containers)
- Mention container size if applicable
- Consider buyer expectations for your market

#### Available Incoterms

Select applicable Incoterms:
- **FOB** (Free On Board): Most common for exports
- **CIF** (Cost, Insurance, Freight): Includes shipping
- **CFR** (Cost and Freight): Shipping without insurance
- **EXW** (Ex Works): Buyer arranges everything
- **FCA** (Free Carrier): Delivery to carrier
- **DAP** (Delivered At Place): Delivery to destination
- **DDP** (Delivered Duty Paid): Full delivery service

**Tips**:
- Select 2-4 common options
- FOB and CIF are standard for most products
- Consult with logistics team if unsure

### Step 6: Certifications

Link relevant certifications:

1. Click **"Select"** in Certifications field
2. Search for certification name
3. Click to select
4. Repeat for multiple certifications

**Common certifications**:
- EU Organic Certification
- Rainforest Alliance
- Fair Trade
- ISO 22000
- HACCP
- EUDR Compliant

**Tips**:
- Only link certifications you actually have
- Certifications must be created first (see Certifications guide)
- Update when certifications expire

### Step 7: Quality Assurance

#### Specification Sheet PDF (Optional)

Upload detailed product specifications:
1. Click **"Upload"**
2. Select PDF file
3. File is uploaded to Sanity CDN

**Tips**:
- Include detailed technical specifications
- Use professional formatting
- Update regularly
- File size: Under 5MB

#### Quality Assurance Metrics

Add QA metrics:

1. Click **"Add item"**
2. **Metric Name**: e.g., "Moisture Content"
3. **Value/Range**: e.g., "≤ 7.5%"
4. **Standard Reference**: e.g., "ISO 2451"
5. Repeat for all relevant metrics

**Common QA metrics by product**:

**Cocoa**:
- Moisture Content: ≤ 7.5% (ISO 2451)
- Bean Count: 100-110 beans/100g (ISO 1114)
- Fermentation: ≥ 75% well fermented (ISO 1114)
- Defects: ≤ 3% (AFNOR)

**Coffee**:
- Moisture Content: 10-12% (SCA)
- Screen Size: 15-18 (SCA)
- Defects: ≤ 5 per 300g (SCA Grade 1)
- Cup Score: 83-86 points (SCA)

**Pepper**:
- Moisture Content: ≤ 12% (ISO 959)
- Piperine Content: ≥ 4.5% (ISO 5564)
- Bulk Density: 550-600 g/L (ISO 948)

#### HS Code

Enter the Harmonized System customs code:
- Example: "1801.00.00" (Cocoa beans)
- Example: "0901.11.00" (Coffee, Arabica)
- Example: "0904.11.00" (Pepper)

**Tips**:
- Use the correct 8-10 digit code
- Consult customs documentation if unsure
- Important for international trade

### Step 8: Availability and Markets

#### Availability Status

Select current availability:
- **In Stock**: Available for immediate order
- **Pre-Order**: Available for future delivery
- **Seasonal**: Available during harvest season
- **Out of Stock**: Temporarily unavailable

#### Target Markets

Add target market regions:
1. Click **"Add item"**
2. Enter market name: "Europe", "North America", "Asia", etc.
3. Repeat for each market

**Common markets**:
- Europe
- North America
- Asia
- Middle East
- Africa

### Step 9: SEO Optimization

Optimize for search engines:

#### Meta Title

Create compelling page titles (50-60 characters):
- **French**: "Fèves de Cacao Premium du Cameroun | Afrexia"
- **English**: "Premium Cocoa Beans from Cameroon | Afrexia"

**Tips**:
- Include product name and key benefit
- Add "| Afrexia" at the end
- Keep under 60 characters
- Make it click-worthy

#### Meta Description

Write search result descriptions (150-160 characters):
- **French**: "Fèves de cacao premium certifiées biologiques et équitables du Cameroun. Qualité supérieure pour chocolatiers exigeants."
- **English**: "Premium organic and fair trade certified cocoa beans from Cameroon. Superior quality for demanding chocolatiers."

**Tips**:
- Summarize key benefits
- Include certifications
- Add call-to-action
- Keep under 160 characters

### Step 10: Workflow Status

Set the document status:
- **Draft**: Work in progress, not visible on website
- **In Review**: Ready for approval (if using workflow)
- **Published**: Live on website

### Step 11: Publish

1. Review all fields
2. Ensure required fields are complete
3. Click **"Publish"** button
4. Product appears on website within 60 seconds

## Editing Existing Products

### Finding a Product

1. Click **"Product"** in sidebar
2. Use search bar to find by name
3. Or scroll through the list
4. Click the product to open

### Making Changes

1. Edit any field
2. Changes auto-save as you type
3. Click **"Publish"** to update the website

### Viewing History

To see previous versions:
1. Click **"•••"** menu (top right)
2. Select **"Review changes"**
3. View all changes with timestamps
4. Restore previous version if needed

## Product Checklist

Before publishing, ensure:

- [ ] Product name in French and English
- [ ] Slugs generated for both languages
- [ ] Translation ID is unique
- [ ] Category selected
- [ ] Description written in both languages
- [ ] At least 1 image uploaded with alt text
- [ ] Origin regions added with coordinates
- [ ] Harvest season specified
- [ ] Packaging options listed
- [ ] MOQ specified
- [ ] Incoterms selected
- [ ] Certifications linked (if applicable)
- [ ] QA metrics added
- [ ] HS code entered
- [ ] Availability status set
- [ ] Target markets listed
- [ ] SEO meta title and description in both languages
- [ ] Workflow status set to "Published"

## Best Practices

### Content Quality

- **Be specific**: Provide detailed, accurate information
- **Use professional language**: Maintain B2B tone
- **Keep updated**: Review and update regularly
- **Check translations**: Ensure both languages are complete

### Images

- **High quality**: Use professional product photography
- **Multiple angles**: Show product from different views
- **Consistent style**: Maintain visual consistency across products
- **Optimize size**: Balance quality and file size

### SEO

- **Unique content**: Don't copy from other sources
- **Keywords**: Use terms buyers search for
- **Complete metadata**: Fill all SEO fields
- **Regular updates**: Fresh content ranks better

### Compliance

- **Accurate certifications**: Only claim what you have
- **Precise coordinates**: Important for EUDR compliance
- **Up-to-date QA metrics**: Reflect current standards
- **Correct HS codes**: Essential for customs

## Common Issues

### Product Not Appearing on Website

**Possible causes**:
- Workflow status is "Draft" or "In Review"
- Required fields are missing
- ISR revalidation hasn't occurred yet (wait 60 seconds)

**Solution**:
- Check workflow status is "Published"
- Verify all required fields are filled
- Wait a minute and refresh the website

### Images Not Loading

**Possible causes**:
- Image file too large
- Unsupported format
- Missing alt text

**Solution**:
- Compress images before upload
- Use JPG or PNG format
- Add alt text to all images

### Language Switcher Not Working

**Possible cause**:
- Missing or incorrect Translation ID

**Solution**:
- Ensure Translation ID is set
- Use consistent format across languages
- Check that both FR and EN versions exist

## Next Steps

- Learn about [Managing Blog Posts](./managing-blog-posts.md)
- Review [Workflow Guide](./workflow-guide.md)
- Check [Best Practices](./best-practices.md)
