import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'commodityPrice',
  title: 'Prix des Matières Premières',
  type: 'document',
  fields: [
    defineField({
      name: 'product',
      title: 'Produit',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Prix',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'unit',
      title: 'Unité',
      type: 'string',
      initialValue: 'FCFA/KG',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'trend',
      title: 'Tendance',
      type: 'string',
      options: {
        list: [
          { title: 'Hausse', value: 'up' },
          { title: 'Baisse', value: 'down' },
          { title: 'Stable', value: 'stable' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'change',
      title: 'Variation (%)',
      type: 'number',
      description: 'Variation en pourcentage (positif pour hausse, négatif pour baisse)',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Dernière mise à jour',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'URL ou nom de la source des données',
    }),
  ],
  preview: {
    select: {
      title: 'product',
      price: 'price',
      unit: 'unit',
      trend: 'trend',
    },
    prepare({ title, price, unit, trend }) {
      const trendIcon = trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️';
      return {
        title: `${title}`,
        subtitle: `${price} ${unit} ${trendIcon}`,
      };
    },
  },
});
