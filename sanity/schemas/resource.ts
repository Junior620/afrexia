import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'resource',
  title: 'Resource',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        { name: 'fr', type: 'string', title: 'French' },
        { name: 'en', type: 'string', title: 'English' },
        { name: 'es', type: 'string', title: 'Spanish' },
        { name: 'de', type: 'string', title: 'German' },
        { name: 'ru', type: 'string', title: 'Russian' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        { name: 'fr', type: 'text', title: 'French', rows: 3 },
        { name: 'en', type: 'text', title: 'English', rows: 3 },
        { name: 'es', type: 'text', title: 'Spanish', rows: 3 },
        { name: 'de', type: 'text', title: 'German', rows: 3 },
        { name: 'ru', type: 'text', title: 'Russian', rows: 3 },
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Product Catalogs', value: 'catalogs' },
          { title: 'Technical Specifications', value: 'specifications' },
          { title: 'Certifications', value: 'certifications' },
          { title: 'Compliance Documents', value: 'compliance' },
          { title: 'Guides & Manuals', value: 'guides' },
          { title: 'Case Studies', value: 'case_studies' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'file',
      title: 'File',
      type: 'file',
      options: {
        accept: 'application/pdf,.doc,.docx,.xls,.xlsx',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          { title: 'French', value: 'fr' },
          { title: 'English', value: 'en' },
          { title: 'Spanish', value: 'es' },
          { title: 'German', value: 'de' },
          { title: 'Russian', value: 'ru' },
          { title: 'Multiple', value: 'multiple' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Related Products',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      description: 'Products this resource is related to',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'date',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which resources appear in their category',
      validation: (Rule) => Rule.integer().min(0),
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
      title: 'title.en',
      subtitle: 'category',
    },
  },
})
