import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
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
            source: 'title.fr',
            maxLength: 96,
          },
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'en',
          type: 'slug',
          title: 'English Slug',
          options: {
            source: 'title.en',
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
      description: 'Unique ID to link FR and EN versions of the same page',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'object',
      fields: [
        { name: 'fr', type: 'blockContent', title: 'French' },
        { name: 'en', type: 'blockContent', title: 'English' },
      ],
      validation: (Rule) => Rule.required(),
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
      title: 'title.en',
    },
  },
})
