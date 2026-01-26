# Getting Started with Afrexia CMS

This guide will help you get started with the Afrexia Content Management System.

## Accessing the CMS

### Login

1. Navigate to your website's `/studio` path (e.g., `https://afrexia.com/studio`)
2. Click **"Sign in with Sanity"**
3. Enter your credentials (email and password)
4. You'll be redirected to the Sanity Studio interface

### First-Time Setup

If this is your first time logging in:

1. You'll receive an invitation email from Sanity
2. Click the invitation link
3. Create your password
4. Complete your profile information
5. You're ready to start managing content!

## Understanding the Interface

### Main Navigation

The Sanity Studio interface has several key areas:

```
┌─────────────────────────────────────────────────┐
│  [Logo]  Content  Desk  Vision  [User Menu]    │  ← Top Bar
├──────────┬──────────────────────────────────────┤
│          │                                      │
│  Content │  Document List / Editor              │
│  Types   │                                      │
│          │  [Main Content Area]                 │
│  • Products                                     │
│  • Blog Posts                                   │
│  • Certifications                               │
│  • Team Members                                 │
│  • Resources                                    │
│  • Blog Categories                              │
│  • Pages                                        │
│          │                                      │
└──────────┴──────────────────────────────────────┘
```

### Top Bar

- **Logo**: Click to return to home
- **Content**: Main content management area
- **Desk**: Alternative view for content organization
- **Vision**: Query tool for developers (advanced)
- **User Menu**: Your profile, settings, and logout

### Sidebar (Left)

Lists all content types you can manage:
- Click any content type to see all documents of that type
- Use the search bar to find specific documents

### Main Area (Center/Right)

- **Document List**: Shows all documents when a content type is selected
- **Document Editor**: Opens when you create or edit a document
- **Preview**: Shows how content will appear on the website (if configured)

## Creating Your First Document

Let's create a simple blog category as an example:

### Step 1: Select Content Type

1. Click **"Blog Category"** in the sidebar
2. You'll see a list of existing categories (if any)

### Step 2: Create New Document

1. Click the **"+ Create"** button (top right)
2. The document editor opens with empty fields

### Step 3: Fill in Fields

1. **Title (French)**: Enter "Actualités"
2. **Title (English)**: Enter "News"
3. **Slug (French)**: Click "Generate" button
4. **Slug (English)**: Click "Generate" button
5. **Description (French)**: Enter a brief description
6. **Description (English)**: Enter a brief description

### Step 4: Publish

1. Review your content
2. Click **"Publish"** button (top right)
3. Your content is now live!

## Understanding Field Types

### Text Fields

Simple single-line text input:
- Product names
- Email addresses
- Phone numbers

### Text Area

Multi-line text input:
- Descriptions
- Excerpts
- Notes

### Rich Text (Block Content)

Formatted text with styling options:
- Headings (H2, H3, H4)
- Bold, italic, underline
- Lists (bulleted, numbered)
- Links
- Embedded images

**Tip**: Use the toolbar above the editor to format text.

### Image Fields

Upload and manage images:
1. Click **"Upload"** or drag and drop
2. Crop/adjust if hotspot is enabled
3. Add alt text (required for accessibility)
4. Add caption (optional)

**Supported formats**: JPG, PNG, WebP, GIF
**Max file size**: 10MB

### File Fields

Upload documents:
1. Click **"Upload"** or drag and drop
2. File is uploaded to Sanity CDN

**Supported formats**: PDF, DOC, DOCX, XLS, XLSX
**Max file size**: 10MB

### Reference Fields

Link to other documents:
1. Click **"Select"** or **"Create new"**
2. Search for the document you want to reference
3. Click to select

**Example**: Linking a certification to a product

### Array Fields

Add multiple items:
1. Click **"Add item"**
2. Fill in the item fields
3. Repeat for more items
4. Drag to reorder items
5. Click **"×"** to remove items

**Example**: Adding multiple packaging options to a product

### Object Fields

Grouped fields (often for multilingual content):
- Expand to see sub-fields
- Fill in each language version

**Example**: Product name with French and English versions

### Geopoint Fields

Set geographic coordinates:
1. Click the map
2. Or enter latitude and longitude manually
3. Zoom and pan to adjust

**Example**: Product origin locations

## Multilingual Content

Most content in Afrexia CMS is multilingual (French and English).

### How It Works

Fields with multilingual support have two sub-fields:
- **French (fr)**: Content in French
- **English (en)**: Content in English

### Best Practices

1. **Always fill both languages**: Ensure content is complete in both FR and EN
2. **Keep translations consistent**: Meaning should be the same, not word-for-word
3. **Use appropriate terminology**: Use industry terms correctly in each language
4. **Review both versions**: Check for typos and formatting in both languages

### Translation IDs (i18nId)

Some content types have a **Translation ID** field:
- This links French and English versions of the same content
- Use a consistent format: `product-cocoa-001`, `blog-market-2024`
- This enables the language switcher on the website

**Example**: A product with i18nId `cocoa-001` will have:
- French version: `/fr/products/feves-de-cacao-premium`
- English version: `/en/products/premium-cocoa-beans`
- Clicking the language switcher maintains context

## Saving and Publishing

### Auto-Save

Sanity automatically saves your work as you type:
- Look for the **"Saved"** indicator in the top bar
- No need to manually save drafts

### Publishing

To make content visible on the website:

1. Review your content
2. Ensure all required fields are filled
3. Click **"Publish"** button (top right)
4. Content appears on the website within 60 seconds

### Unpublishing

To remove content from the website:

1. Open the published document
2. Click the **"•••"** menu (top right)
3. Select **"Unpublish"**
4. Content is removed from the website but remains in the CMS

## Keyboard Shortcuts

Speed up your workflow with keyboard shortcuts:

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Save | Ctrl + S | Cmd + S |
| Publish | Ctrl + Alt + P | Cmd + Option + P |
| Search | Ctrl + K | Cmd + K |
| Undo | Ctrl + Z | Cmd + Z |
| Redo | Ctrl + Shift + Z | Cmd + Shift + Z |

## Next Steps

Now that you understand the basics:

1. Read the [Managing Products](./managing-products.md) guide
2. Learn about the [Workflow Guide](./workflow-guide.md)
3. Review [Best Practices](./best-practices.md)
4. Start creating content!

## Getting Help

If you're stuck:
- Check the [Troubleshooting Guide](./troubleshooting.md)
- Contact your technical team
- Visit Sanity documentation: https://www.sanity.io/docs
