import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Site Settings',
      readOnly: true,
    }),
    defineField({
      name: 'trackRecordImage',
      title: 'Track Record Section Image',
      type: 'image',
      description: 'Image terrain pour la section "Track Record & Capacité d\'Exécution" (contrôle qualité, logistique, coopérative). Recommandé: 1600x1200px minimum, format 4:3',
      options: {
        hotspot: true,
        metadata: ['blurhash', 'lqip', 'palette'],
      },
      fields: [
        {
          name: 'alt',
          type: 'object',
          title: 'Alt Text (Multilingual)',
          fields: [
            { name: 'fr', type: 'string', title: 'Français' },
            { name: 'en', type: 'string', title: 'English' },
            { name: 'es', type: 'string', title: 'Español' },
            { name: 'de', type: 'string', title: 'Deutsch' },
            { name: 'ru', type: 'string', title: 'Русский' },
          ],
        },
        {
          name: 'caption',
          type: 'object',
          title: 'Caption (Multilingual)',
          fields: [
            { name: 'fr', type: 'string', title: 'Français' },
            { name: 'en', type: 'string', title: 'English' },
            { name: 'es', type: 'string', title: 'Español' },
            { name: 'de', type: 'string', title: 'Deutsch' },
            { name: 'ru', type: 'string', title: 'Русский' },
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      };
    },
  },
});
