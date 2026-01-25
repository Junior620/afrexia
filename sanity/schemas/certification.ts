import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'certification',
  title: 'Certification',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Certification Name',
      type: 'object',
      fields: [
        { name: 'fr', type: 'string', title: 'French' },
        { name: 'en', type: 'string', title: 'English' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Certification Logo',
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
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        { name: 'fr', type: 'text', title: 'French', rows: 4 },
        { name: 'en', type: 'text', title: 'English', rows: 4 },
      ],
    }),
    defineField({
      name: 'issuingBody',
      title: 'Issuing Body',
      type: 'string',
      description: 'Organization that issued the certification',
    }),
    defineField({
      name: 'validUntil',
      title: 'Valid Until',
      type: 'date',
      description: 'Expiration date of the certification',
    }),
    defineField({
      name: 'certificateDocument',
      title: 'Certificate Document',
      type: 'file',
      options: {
        accept: 'application/pdf',
      },
      description: 'PDF of the actual certificate',
    }),
    defineField({
      name: 'certificateUrl',
      title: 'Certificate URL',
      type: 'url',
      description: 'External link to verify the certification',
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
      subtitle: 'issuingBody',
      media: 'logo',
    },
  },
})
