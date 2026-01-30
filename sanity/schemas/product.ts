import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'object',
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
      options: {
        list: [
          { title: 'Cocoa', value: 'cocoa' },
          { title: 'Coffee', value: 'coffee' },
          { title: 'Corn', value: 'corn' },
          { title: 'Pepper', value: 'pepper' },
          { title: 'Wood', value: 'wood' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
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
    defineField({
      name: 'availability',
      title: 'Availability Status',
      type: 'string',
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
      name: 'origins',
      title: 'Origin Countries',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'origin' }] }],
      description: 'Countries where this product originates',
    }),
    defineField({
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'certification' }] }],
      description: 'Product certifications (Bio, Fair Trade, etc.)',
    }),
    defineField({
      name: 'eudrReady',
      title: 'EUDR Ready',
      type: 'boolean',
      description: 'EU Deforestation Regulation compliant',
      initialValue: false,
    }),
    defineField({
      name: 'qaAvailable',
      title: 'QA Documentation Available',
      type: 'boolean',
      description: 'Quality Assurance documentation available',
      initialValue: true,
    }),
    defineField({
      name: 'documents',
      title: 'Available Documents',
      type: 'object',
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
      name: 'moq',
      title: 'Minimum Order Quantity (MOQ)',
      type: 'object',
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
      name: 'notes',
      title: 'Additional Notes',
      type: 'object',
      description: 'Additional product notes (localized)',
      fields: [
        { name: 'fr', type: 'text', title: 'French', rows: 3 },
        { name: 'en', type: 'text', title: 'English', rows: 3 },
        { name: 'es', type: 'text', title: 'Spanish', rows: 3 },
        { name: 'de', type: 'text', title: 'German', rows: 3 },
        { name: 'ru', type: 'text', title: 'Russian', rows: 3 },
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
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
      of: [{ type: 'string' }],
      description: 'Countries or regions where this product is marketed',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
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
      name: 'originRegions',
      title: 'Origin Regions',
      type: 'array',
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
    defineField({
      name: 'harvestSeason',
      title: 'Harvest Season',
      type: 'string',
      description: 'e.g., "October - March"',
    }),
    defineField({
      name: 'packagingOptions',
      title: 'Packaging Options',
      type: 'array',
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
    defineField({
      name: 'specificationPDF',
      title: 'Specification Sheet PDF',
      type: 'file',
      options: {
        accept: 'application/pdf',
      },
    }),
    defineField({
      name: 'qaMetrics',
      title: 'Quality Assurance Metrics',
      type: 'array',
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
      description: 'Harmonized System Code for customs',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
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
    defineField({
      name: 'workflowStatus',
      title: 'Workflow Status',
      type: 'string',
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
