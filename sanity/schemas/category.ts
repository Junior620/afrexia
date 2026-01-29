import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'category',
  title: 'Product Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Category Name',
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
      type: 'slug',
      options: {
        source: 'name.en',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon name or emoji for the category',
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
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Order in which categories appear in filters',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'name.en',
      subtitle: 'slug.current',
      icon: 'icon',
    },
    prepare({ title, subtitle, icon }) {
      return {
        title: title || 'Untitled Category',
        subtitle: subtitle || 'No slug',
        media: icon ? undefined : undefined,
      }
    },
  },
})
