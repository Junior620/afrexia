import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Blog Post',
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
        {
          name: 'es',
          type: 'slug',
          title: 'Spanish Slug',
          options: {
            source: 'title.es',
            maxLength: 96,
          },
        },
        {
          name: 'de',
          type: 'slug',
          title: 'German Slug',
          options: {
            source: 'title.de',
            maxLength: 96,
          },
        },
        {
          name: 'ru',
          type: 'slug',
          title: 'Russian Slug',
          options: {
            source: 'title.ru',
            maxLength: 96,
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'i18nId',
      title: 'Translation ID',
      type: 'string',
      description: 'Unique ID to link FR and EN versions of the same post',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'teamMember' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
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
      name: 'excerpt',
      title: 'Excerpt',
      type: 'object',
      fields: [
        { name: 'fr', type: 'text', title: 'French', rows: 3 },
        { name: 'en', type: 'text', title: 'English', rows: 3 },
        { name: 'es', type: 'text', title: 'Spanish', rows: 3 },
        { name: 'de', type: 'text', title: 'German', rows: 3 },
        { name: 'ru', type: 'text', title: 'Russian', rows: 3 },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'object',
      fields: [
        { name: 'fr', type: 'blockContent', title: 'French' },
        { name: 'en', type: 'blockContent', title: 'English' },
        { name: 'es', type: 'blockContent', title: 'Spanish' },
        { name: 'de', type: 'blockContent', title: 'German' },
        { name: 'ru', type: 'blockContent', title: 'Russian' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'blogCategory' }] }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading Time (minutes)',
      type: 'number',
      description: 'Estimated reading time in minutes',
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
      title: 'title.en',
      author: 'author.name',
      media: 'featuredImage',
      date: 'publishedAt',
    },
    prepare(selection) {
      const { author, date } = selection
      return {
        ...selection,
        subtitle: author && date ? `${author} - ${new Date(date).toLocaleDateString()}` : '',
      }
    },
  },
})
