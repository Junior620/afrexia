import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blogCategory',
  title: 'Blog Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Category Name',
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
  ],
  preview: {
    select: {
      title: 'name.en',
    },
  },
})
