// sanity/schemas/exportCountry.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'exportCountry',
  title: 'Pays d\'Export',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom du Pays',
      type: 'object',
      fields: [
        { name: 'fr', type: 'string', title: 'Français', validation: (Rule) => Rule.required() },
        { name: 'en', type: 'string', title: 'Anglais', validation: (Rule) => Rule.required() },
        { name: 'es', type: 'string', title: 'Espagnol' },
        { name: 'de', type: 'string', title: 'Allemand' },
        { name: 'ru', type: 'string', title: 'Russe' },
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
      name: 'code',
      title: 'Code ISO',
      type: 'string',
      description: 'Code ISO 3166-1 alpha-2 (ex: NL, BE, DE)',
      validation: (Rule) => Rule.required().length(2),
    }),
    defineField({
      name: 'flag',
      title: 'Drapeau',
      type: 'string',
      description: 'Emoji du drapeau (ex: 🇳🇱)',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        { name: 'fr', type: 'text', title: 'Français', rows: 4 },
        { name: 'en', type: 'text', title: 'Anglais', rows: 4 },
        { name: 'es', type: 'text', title: 'Espagnol', rows: 4 },
        { name: 'de', type: 'text', title: 'Allemand', rows: 4 },
        { name: 'ru', type: 'text', title: 'Russe', rows: 4 },
      ],
    }),
    defineField({
      name: 'targetMarkets',
      title: 'Marchés Cibles',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Industries ou secteurs cibles dans ce pays',
    }),
    defineField({
      name: 'mainPorts',
      title: 'Ports Principaux',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'destinationPort' }] }],
      description: 'Ports de destination recommandés pour ce pays',
    }),
    defineField({
      name: 'requiredCertifications',
      title: 'Certifications Requises',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'certification' }] }],
      description: 'Certifications obligatoires pour exporter vers ce pays',
    }),
    defineField({
      name: 'customsInfo',
      title: 'Informations Douanières',
      type: 'object',
      fields: [
        { name: 'fr', type: 'text', title: 'Français', rows: 4 },
        { name: 'en', type: 'text', title: 'Anglais', rows: 4 },
        { name: 'es', type: 'text', title: 'Espagnol', rows: 4 },
        { name: 'de', type: 'text', title: 'Allemand', rows: 4 },
        { name: 'ru', type: 'text', title: 'Russe', rows: 4 },
      ],
    }),
    defineField({
      name: 'averageTransitTime',
      title: 'Délai de Transit Moyen',
      type: 'object',
      fields: [
        { name: 'days', type: 'number', title: 'Jours' },
        {
          name: 'note',
          type: 'object',
          title: 'Note',
          fields: [
            { name: 'fr', type: 'string', title: 'Français' },
            { name: 'en', type: 'string', title: 'Anglais' },
            { name: 'es', type: 'string', title: 'Espagnol' },
            { name: 'de', type: 'string', title: 'Allemand' },
            { name: 'ru', type: 'string', title: 'Russe' },
          ],
        },
      ],
    }),
    defineField({
      name: 'dataCompleteness',
      title: 'Complétude des Données',
      type: 'number',
      description: 'Pourcentage de complétude (0-100)',
      validation: (Rule) => Rule.min(0).max(100),
      initialValue: 0,
    }),
    defineField({
      name: 'approvedForSEO',
      title: 'Approuvé pour SEO',
      type: 'boolean',
      description: 'Combinaison validée métier pour génération de pages',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name.en',
      subtitle: 'code',
      flag: 'flag',
    },
    prepare({ title, subtitle, flag }: { title?: string; subtitle?: string; flag?: string }) {
      return {
        title: `${flag || ''} ${title || 'Sans nom'}`,
        subtitle: subtitle || 'Pas de code',
      };
    },
  },
});
