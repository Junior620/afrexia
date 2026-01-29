import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'origin',
  title: 'Origin Country',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Country Name',
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
      name: 'code',
      title: 'ISO Country Code',
      type: 'string',
      description: 'ISO 3166-1 alpha-2 country code (e.g., CI, GH, BR)',
      validation: (Rule) =>
        Rule.required()
          .length(2)
          .uppercase()
          .regex(/^[A-Z]{2}$/, {
            name: 'ISO code',
            invert: false,
          }),
    }),
    defineField({
      name: 'flag',
      title: 'Flag',
      type: 'string',
      description: 'Flag emoji or URL to flag image',
    }),
    defineField({
      name: 'flagImage',
      title: 'Flag Image',
      type: 'image',
      description: 'Optional flag image (alternative to emoji)',
      options: {
        hotspot: false,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
      description: 'Brief description of the origin',
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
      description: 'Order in which origins appear in filters',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'name.en',
      code: 'code',
      flag: 'flag',
      media: 'flagImage',
    },
    prepare({ title, code, flag, media }) {
      return {
        title: `${flag || ''} ${title || 'Untitled Origin'}`.trim(),
        subtitle: code || 'No ISO code',
        media,
      }
    },
  },
})
