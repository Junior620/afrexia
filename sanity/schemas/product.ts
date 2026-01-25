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
        { name: 'fr', type: 'string', title: 'French' },
        { name: 'en', type: 'string', title: 'English' },
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
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'i18nId',
      title: 'Translation ID',
      type: 'string',
      description: 'Unique ID to link FR and EN versions of the same product',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Cocoa', value: 'cocoa' },
          { title: 'Coffee', value: 'coffee' },
          { title: 'Pepper', value: 'pepper' },
          { title: 'Wood', value: 'wood' },
          { title: 'Corn', value: 'corn' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        { name: 'fr', type: 'blockContent', title: 'French' },
        { name: 'en', type: 'blockContent', title: 'English' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
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
              ],
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'originRegions',
      title: 'Origin Regions',
      type: 'array',
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
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'moq',
      title: 'Minimum Order Quantity (MOQ)',
      type: 'string',
      description: 'e.g., "1 container (20 MT)"',
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
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'certification' }] }],
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
      name: 'availability',
      title: 'Availability Status',
      type: 'string',
      options: {
        list: [
          { title: 'In Stock', value: 'in_stock' },
          { title: 'Pre-Order', value: 'pre_order' },
          { title: 'Seasonal', value: 'seasonal' },
          { title: 'Out of Stock', value: 'out_of_stock' },
        ],
      },
      initialValue: 'in_stock',
    }),
    defineField({
      name: 'targetMarkets',
      title: 'Target Markets',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Countries or regions where this product is marketed',
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
          ],
        },
        {
          name: 'metaDescription',
          type: 'object',
          title: 'Meta Description',
          fields: [
            { name: 'fr', type: 'text', title: 'French', rows: 3 },
            { name: 'en', type: 'text', title: 'English', rows: 3 },
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
      subtitle: 'category',
      media: 'gallery.0',
    },
  },
})
