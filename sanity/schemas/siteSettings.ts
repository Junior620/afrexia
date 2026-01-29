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
    defineField({
      name: 'complianceBackgroundImage',
      title: 'Compliance Section Background Image',
      type: 'image',
      description: 'Image terrain en fond pour la section "Conformité, Traçabilité & QA" (contrôle qualité, audit, documentation). Recommandé: 1920x1080px minimum, sera désaturée et floutée. Privilégier photos avec contraste moyen.',
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
      ],
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
