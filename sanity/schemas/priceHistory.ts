import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'priceHistory',
  title: 'Historique des Prix',
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
    }),
    defineField({
      name: 'change',
      title: 'Variation (%)',
      type: 'number',
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
    }),
    defineField({
      name: 'recordedAt',
      title: "Date d'enregistrement",
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Date (récent en premier)',
      name: 'recordedAtDesc',
      by: [{ field: 'recordedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'product',
      price: 'price',
      unit: 'unit',
      trend: 'trend',
      date: 'recordedAt',
    },
    prepare({ title, price, unit, trend, date }) {
      const trendIcon = trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️';
      return {
        title: `${title} — ${price} ${unit} ${trendIcon}`,
        subtitle: new Date(date).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
    },
  },
});
