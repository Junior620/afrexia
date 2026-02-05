import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fieldsets: [
    {
      name: 'basic',
      title: 'Basic Information',
      options: { collapsible: false },
    },
    {
      name: 'status',
      title: 'Availability & Status',
      options: { collapsible: true, collapsed: false },
    },
    {
      name: 'logistics',
      title: 'Logistics & Trade Terms',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'quality',
      title: 'Quality & Compliance',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'origin',
      title: 'Origin & Traceability',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'content',
      title: 'Content & Media',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'advanced',
      title: 'Advanced Options',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'seo',
      title: 'SEO & Metadata',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    // ========================================
    // BASIC INFORMATION
    // ========================================
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'object',
      fieldset: 'basic',
      fields: [
        { name: 'fr', type: 'string', title: 'French', validation: (Rule) => Rule.required() },
        { name: 'en', type: 'string', title: 'English', validation: (Rule) => Rule.required() },
        { name: 'es', type: 'string', title: 'Spanish' },
        { name: 'de', type: 'string', title: 'German' },
        { name: 'ru', type: 'string', title: 'Russian' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'object',
      fieldset: 'basic',
      fields: [
        {
          name: 'fr',
          type: 'slug',
          title: 'French Slug',
          options: {
            source: 'name.fr',
            maxLength: 96,
          },
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'en',
          type: 'slug',
          title: 'English Slug',
          options: {
            source: 'name.en',
            maxLength: 96,
          },
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'es',
          type: 'slug',
          title: 'Spanish Slug',
          options: {
            source: 'name.es',
            maxLength: 96,
          },
        },
        {
          name: 'de',
          type: 'slug',
          title: 'German Slug',
          options: {
            source: 'name.de',
            maxLength: 96,
          },
        },
        {
          name: 'ru',
          type: 'slug',
          title: 'Russian Slug',
          options: {
            source: 'name.ru',
            maxLength: 96,
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'object',
      fieldset: 'basic',
      description: 'Short descriptive subtitle for the product',
      fields: [
        { name: 'fr', type: 'string', title: 'French' },
        { name: 'en', type: 'string', title: 'English' },
        { name: 'es', type: 'string', title: 'Spanish' },
        { name: 'de', type: 'string', title: 'German' },
        { name: 'ru', type: 'string', title: 'Russian' },
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      fieldset: 'basic',
      options: {
        list: [
          { title: 'Cocoa', value: 'cocoa' },
          { title: 'Coffee', value: 'coffee' },
          { title: 'Corn', value: 'corn' },
          { title: 'Pepper', value: 'pepper' },
          { title: 'Wood', value: 'wood' },
          { title: 'Rice', value: 'rice' },
          { title: 'Refined Sugar', value: 'refined-sugar' },
          { title: 'Petroleum Products', value: 'petroleum-products' },
          { title: 'Palm Oil', value: 'palm-oil' },
          { title: 'Tropical Fruits', value: 'tropical-fruits' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      fieldset: 'basic',
      description: 'Main product image for catalog cards',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    // ========================================
    // AVAILABILITY & STATUS
    // ========================================
    defineField({
      name: 'availability',
      title: 'Availability Status',
      type: 'string',
      fieldset: 'status',
      options: {
        list: [
          { title: 'In Stock', value: 'in-stock' },
          { title: 'Limited Stock', value: 'limited' },
          { title: 'Pre-Order', value: 'pre-order' },
          { title: 'Out of Stock', value: 'out-of-stock' },
        ],
      },
      initialValue: 'in-stock',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'workflowStatus',
      title: 'Workflow Status',
      type: 'string',
      fieldset: 'status',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'In Review', value: 'in_review' },
          { title: 'Published', value: 'published' },
        ],
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eudrReady',
      title: 'EUDR Ready',
      type: 'boolean',
      fieldset: 'status',
      description: 'EU Deforestation Regulation compliant',
      initialValue: false,
    }),
    defineField({
      name: 'qaAvailable',
      title: 'QA Documentation Available',
      type: 'boolean',
      fieldset: 'status',
      description: 'Quality Assurance documentation available',
      initialValue: true,
    }),

    // ========================================
    // LOGISTICS & TRADE TERMS
    // ========================================
    defineField({
      name: 'moq',
      title: 'Minimum Order Quantity (MOQ)',
      type: 'object',
      fieldset: 'logistics',
      description: 'Minimum order quantity with unit',
      fields: [
        {
          name: 'value',
          type: 'number',
          title: 'Value',
          validation: (Rule) => Rule.positive(),
        },
        {
          name: 'unit',
          type: 'string',
          title: 'Unit',
          options: {
            list: [
              { title: 'kg', value: 'kg' },
              { title: 'MT (Metric Tons)', value: 'MT' },
              { title: 'tons', value: 'tons' },
              { title: 'containers', value: 'containers' },
              { title: 'bags', value: 'bags' },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'incoterms',
      title: 'Available Incoterms',
      type: 'array',
      fieldset: 'logistics',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'FOB - Free On Board', value: 'FOB' },
          { title: 'CIF - Cost, Insurance and Freight', value: 'CIF' },
          { title: 'CFR - Cost and Freight', value: 'CFR' },
          { title: 'EXW - Ex Works', value: 'EXW' },
          { title: 'FCA - Free Carrier', value: 'FCA' },
          { title: 'DAP - Delivered At Place', value: 'DAP' },
          { title: 'DDP - Delivered Duty Paid', value: 'DDP' },
        ],
      },
    }),
    defineField({
      name: 'packaging',
      title: 'Packaging',
      type: 'object',
      fieldset: 'logistics',
      description: 'Packaging information (localized)',
      fields: [
        { name: 'fr', type: 'string', title: 'French' },
        { name: 'en', type: 'string', title: 'English' },
        { name: 'es', type: 'string', title: 'Spanish' },
        { name: 'de', type: 'string', title: 'German' },
        { name: 'ru', type: 'string', title: 'Russian' },
      ],
    }),
    defineField({
      name: 'grade',
      title: 'Grade',
      type: 'object',
      fieldset: 'logistics',
      description: 'Product grade or quality level (localized)',
      fields: [
        { name: 'fr', type: 'string', title: 'French' },
        { name: 'en', type: 'string', title: 'English' },
        { name: 'es', type: 'string', title: 'Spanish' },
        { name: 'de', type: 'string', title: 'German' },
        { name: 'ru', type: 'string', title: 'Russian' },
      ],
    }),
    defineField({
      name: 'leadTime',
      title: 'Lead Time',
      type: 'object',
      fieldset: 'logistics',
      description: 'Delivery lead time (localized)',
      fields: [
        { name: 'fr', type: 'string', title: 'French' },
        { name: 'en', type: 'string', title: 'English' },
        { name: 'es', type: 'string', title: 'Spanish' },
        { name: 'de', type: 'string', title: 'German' },
        { name: 'ru', type: 'string', title: 'Russian' },
      ],
    }),
    defineField({
      name: 'harvestSeason',
      title: 'Harvest Season',
      type: 'string',
      fieldset: 'logistics',
      description: 'e.g., "October - March"',
    }),

    // ========================================
    // QUALITY & COMPLIANCE
    // ========================================
    defineField({
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      fieldset: 'quality',
      of: [{ type: 'reference', to: [{ type: 'certification' }] }],
      description: 'Product certifications (Bio, Fair Trade, etc.)',
    }),
    defineField({
      name: 'documents',
      title: 'Available Documents',
      type: 'object',
      fieldset: 'quality',
      description: 'Document availability indicators',
      fields: [
        {
          name: 'coa',
          type: 'boolean',
          title: 'Certificate of Analysis (COA)',
          initialValue: false,
        },
        {
          name: 'specSheet',
          type: 'boolean',
          title: 'Specification Sheet',
          initialValue: false,
        },
        {
          name: 'chainOfCustody',
          type: 'boolean',
          title: 'Chain of Custody',
          initialValue: false,
        },
      ],
    }),
    defineField({
      name: 'qaMetrics',
      title: 'Quality Assurance Metrics',
      type: 'array',
      fieldset: 'quality',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'metric',
              type: 'string',
              title: 'Metric Name',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'value',
              type: 'string',
              title: 'Value/Range',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'standard',
              type: 'string',
              title: 'Standard Reference',
              description: 'e.g., "ISO 2451", "AFNOR"',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'hsCode',
      title: 'HS Code',
      type: 'string',
      fieldset: 'quality',
      description: 'Harmonized System Code for customs',
    }),
    defineField({
      name: 'specificationPDF',
      title: 'Specification Sheet PDF',
      type: 'file',
      fieldset: 'quality',
      options: {
        accept: 'application/pdf',
      },
    }),

    // ========================================
    // ORIGIN & TRACEABILITY
    // ========================================
    defineField({
      name: 'origins',
      title: 'Origin Countries',
      type: 'array',
      fieldset: 'origin',
      of: [{ type: 'reference', to: [{ type: 'origin' }] }],
      description: 'Countries where this product originates',
    }),
    defineField({
      name: 'originRegions',
      title: 'Origin Regions',
      type: 'array',
      fieldset: 'origin',
      description: 'Detailed origin regions with coordinates',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'region',
              type: 'string',
              title: 'Region Name',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'coordinates',
              type: 'geopoint',
              title: 'Coordinates',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              type: 'object',
              title: 'Description',
              fields: [
                { name: 'fr', type: 'text', title: 'French' },
                { name: 'en', type: 'text', title: 'English' },
                { name: 'es', type: 'text', title: 'Spanish' },
                { name: 'de', type: 'text', title: 'German' },
                { name: 'ru', type: 'text', title: 'Russian' },
              ],
            },
          ],
        },
      ],
    }),

    // ========================================
    // CONTENT & MEDIA
    // ========================================
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
      fieldset: 'content',
      fields: [
        { name: 'fr', type: 'blockContent', title: 'French' },
        { name: 'en', type: 'blockContent', title: 'English' },
        { name: 'es', type: 'blockContent', title: 'Spanish' },
        { name: 'de', type: 'blockContent', title: 'German' },
        { name: 'ru', type: 'blockContent', title: 'Russian' },
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      fieldset: 'content',
      description: 'Additional product images',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'caption',
              type: 'object',
              title: 'Caption',
              fields: [
                { name: 'fr', type: 'string', title: 'French' },
                { name: 'en', type: 'string', title: 'English' },
                { name: 'es', type: 'string', title: 'Spanish' },
                { name: 'de', type: 'string', title: 'German' },
                { name: 'ru', type: 'string', title: 'Russian' },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'notes',
      title: 'Additional Notes',
      type: 'object',
      fieldset: 'content',
      description: 'Additional product notes (localized)',
      fields: [
        { name: 'fr', type: 'text', title: 'French', rows: 3 },
        { name: 'en', type: 'text', title: 'English', rows: 3 },
        { name: 'es', type: 'text', title: 'Spanish', rows: 3 },
        { name: 'de', type: 'text', title: 'German', rows: 3 },
        { name: 'ru', type: 'text', title: 'Russian', rows: 3 },
      ],
    }),

    // ========================================
    // ADVANCED OPTIONS
    // ========================================
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      fieldset: 'advanced',
      of: [{ type: 'string' }],
      description: 'Searchable tags for filtering',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'markets',
      title: 'Target Markets',
      type: 'array',
      fieldset: 'advanced',
      of: [{ type: 'string' }],
      description: 'Countries or regions where this product is marketed',
    }),
    defineField({
      name: 'packagingOptions',
      title: 'Packaging Options',
      type: 'array',
      fieldset: 'advanced',
      description: 'Detailed packaging options',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'type',
              type: 'string',
              title: 'Packaging Type',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'weight',
              type: 'string',
              title: 'Weight/Volume',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              type: 'object',
              title: 'Description',
              fields: [
                { name: 'fr', type: 'text', title: 'French' },
                { name: 'en', type: 'text', title: 'English' },
                { name: 'es', type: 'text', title: 'Spanish' },
                { name: 'de', type: 'text', title: 'German' },
                { name: 'ru', type: 'text', title: 'Russian' },
              ],
            },
          ],
        },
      ],
    }),

    // ========================================
    // SEO & METADATA
    // ========================================
    // ========================================
    // SEO & METADATA
    // ========================================
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fieldset: 'seo',
      fields: [
        {
          name: 'metaTitle',
          type: 'object',
          title: 'Meta Title',
          fields: [
            { name: 'fr', type: 'string', title: 'French' },
            { name: 'en', type: 'string', title: 'English' },
            { name: 'es', type: 'string', title: 'Spanish' },
            { name: 'de', type: 'string', title: 'German' },
            { name: 'ru', type: 'string', title: 'Russian' },
          ],
        },
        {
          name: 'metaDescription',
          type: 'object',
          title: 'Meta Description',
          fields: [
            { name: 'fr', type: 'text', title: 'French', rows: 3 },
            { name: 'en', type: 'text', title: 'English', rows: 3 },
            { name: 'es', type: 'text', title: 'Spanish', rows: 3 },
            { name: 'de', type: 'text', title: 'German', rows: 3 },
            { name: 'ru', type: 'text', title: 'Russian', rows: 3 },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name.en',
      category: 'category',
      media: 'heroImage',
      availability: 'availability',
    },
    prepare({ title, category, media, availability }) {
      return {
        title: title || 'Untitled Product',
        subtitle: `${category || 'No category'} - ${availability || 'unknown'}`,
        media,
      }
    },
  },
})
