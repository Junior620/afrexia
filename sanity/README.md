# Afrexia Sanity CMS

This directory contains the Sanity CMS configuration and schemas for the Afrexia website.

## Structure

```
sanity/
├── env.ts                      # Environment configuration
├── lib/
│   ├── client.ts              # Sanity client configuration
│   ├── image.ts               # Image URL builder utilities
│   └── roles.ts               # Role and permission definitions
├── schemas/
│   ├── index.ts               # Schema registry
│   ├── blockContent.ts        # Rich text content schema
│   ├── product.ts             # Product schema
│   ├── certification.ts       # Certification schema
│   ├── blogPost.ts            # Blog post schema
│   ├── blogCategory.ts        # Blog category schema
│   ├── teamMember.ts          # Team member schema
│   ├── resource.ts            # Downloadable resource schema
│   ├── page.ts                # Static page schema
│   └── __tests__/             # Schema validation tests
├── sanity.config.ts           # Sanity Studio configuration
├── sanity.cli.ts              # Sanity CLI configuration
├── ROLES_AND_PERMISSIONS.md   # Documentation for CMS roles
└── README.md                  # This file
```

## Getting Started

### Prerequisites

1. Create a Sanity project at https://www.sanity.io/manage
2. Copy the project ID and dataset name
3. Add them to your `.env.local` file:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-24
SANITY_API_TOKEN=your_api_token
SANITY_WEBHOOK_SECRET=your_webhook_secret
```

### Accessing Sanity Studio

Once the environment variables are configured, you can access Sanity Studio at:

```
http://localhost:3000/studio
```

Or in production:

```
https://yourdomain.com/studio
```

## Schemas

### Product Schema
Complete product information including:
- Multilingual name, slug, and description (FR/EN)
- Image gallery with alt text and captions
- Origin regions with coordinates for map display
- Packaging options, MOQ, Incoterms
- Certifications (references)
- QA metrics and specifications
- HS code and availability status
- SEO metadata
- Workflow status (Draft/In Review/Published)

### Certification Schema
Certification information including:
- Multilingual name and description (FR/EN)
- Logo image
- Issuing body and validity date
- Certificate document (PDF)
- Certificate verification URL
- Workflow status

### Blog Post Schema
Blog content including:
- Multilingual title, slug, excerpt, and content (FR/EN)
- Author reference (TeamMember)
- Featured image
- Categories and tags
- Published date and reading time
- SEO metadata
- Workflow status

### Blog Category Schema
Blog organization including:
- Multilingual name, slug, and description (FR/EN)

### Team Member Schema
Team information including:
- Name, position (multilingual), and photo
- Biography (multilingual rich text)
- Contact information (email, phone, LinkedIn)
- Display order
- Workflow status

### Resource Schema
Downloadable documents including:
- Multilingual title and description (FR/EN)
- File upload (PDF, DOC, XLS)
- Category and language
- Related products (references)
- Published date and display order
- Workflow status

### Page Schema
Static page content including:
- Multilingual title, slug, and content (FR/EN)
- Translation ID for linking FR/EN versions
- SEO metadata
- Workflow status

## Multilingual Content

All content schemas support French and English through:

1. **Multilingual fields**: Object fields with `fr` and `en` properties
2. **Translation ID**: `i18nId` field to link FR and EN versions of the same content
3. **Separate slugs**: Each language has its own slug for SEO-friendly URLs

Example:
```typescript
{
  name: {
    fr: "Cacao Premium",
    en: "Premium Cocoa"
  },
  slug: {
    fr: { current: "cacao-premium" },
    en: { current: "premium-cocoa" }
  },
  i18nId: "product-cocoa-premium"
}
```

## Workflow and Permissions

The CMS implements a three-state workflow:

1. **Draft**: Content is being created/edited
2. **In Review**: Content is ready for review
3. **Published**: Content is live on the website

### Roles

- **Administrator**: Full access to all content and settings
- **Editor**: Can create/edit all content, can publish blog posts and pages only
- **Viewer**: Read-only access

See [ROLES_AND_PERMISSIONS.md](./ROLES_AND_PERMISSIONS.md) for detailed configuration instructions.

## Querying Content

### Fetching Published Products

```typescript
import { client } from '@/sanity/lib/client'

const products = await client.fetch(`
  *[_type == "product" && workflowStatus == "published"] {
    _id,
    name,
    slug,
    category,
    gallery,
    certifications[]->
  }
`)
```

### Fetching Blog Posts with Author

```typescript
const posts = await client.fetch(`
  *[_type == "blogPost" && workflowStatus == "published"] 
  | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    publishedAt,
    author->{
      name,
      photo
    }
  }
`)
```

## Image Optimization

Use the `urlForImage` helper to generate optimized image URLs:

```typescript
import { urlForImage } from '@/sanity/lib/image'

const imageUrl = urlForImage(product.gallery[0])
  ?.width(800)
  .height(600)
  .format('webp')
  .quality(80)
  .url()
```

## Testing

Schema validation tests are located in `schemas/__tests__/`. Run tests with:

```bash
npm test -- sanity/schemas/__tests__ --run
```

Tests verify:
- Required field enforcement
- Data format validation (email, URL, date, etc.)
- Multilingual field structure
- Workflow status options
- Schema relationships (references)

## Development

### Adding a New Schema

1. Create a new schema file in `schemas/`
2. Define the schema using `defineType` and `defineField`
3. Add the schema to `schemas/index.ts`
4. Create tests in `schemas/__tests__/`
5. Run tests to verify

### Modifying Existing Schemas

1. Update the schema file
2. Update related tests
3. Run tests to verify
4. Consider data migration if changing field types

## Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Schema Types Reference](https://www.sanity.io/docs/schema-types)
- [Image URLs](https://www.sanity.io/docs/image-url)
