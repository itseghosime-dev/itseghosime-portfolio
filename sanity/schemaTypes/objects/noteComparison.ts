import {ThLargeIcon} from '@sanity/icons/ThLarge'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const noteComparison = defineType({
  name: 'noteComparison',
  title: 'Pattern comparison',
  type: 'object',
  icon: ThLargeIcon,

  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(140),
    }),
    defineField({
      name: 'items',
      title: 'Comparison items',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'comparisonItem',
          title: 'Comparison item',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required().max(40),
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required().max(80),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required().max(220),
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'label'},
          },
        }),
      ],
      validation: (rule) => rule.required().min(2).max(4),
    }),
  ],

  preview: {
    select: {title: 'title', eyebrow: 'eyebrow'},
    prepare({title, eyebrow}) {
      return {
        title: title || 'Pattern comparison',
        subtitle: eyebrow || 'Editorial comparison',
        media: ThLargeIcon,
      }
    },
  },
})
