import {ImageIcon} from '@sanity/icons/Image'
import {defineField, defineType} from 'sanity'

export const accessibleImage = defineType({
  name: 'accessibleImage',
  title: 'Accessible image',
  type: 'image',
  icon: ImageIcon,

  options: {
    hotspot: true,
  },

  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      description: 'Describe the useful information in the image for people who cannot see it.',
      type: 'string',
      validation: (rule) =>
        rule.required().max(160).error('Alternative text is required for accessibility.'),
    }),

    defineField({
      name: 'caption',
      title: 'Caption',
      description: 'Optional text displayed below the image.',
      type: 'string',
      validation: (rule) => rule.max(180),
    }),
  ],

  preview: {
    select: {
      title: 'alt',
      subtitle: 'caption',
      media: 'asset',
    },

    prepare({title, subtitle, media}) {
      return {
        title: title || 'Image without alternative text',
        subtitle,
        media,
      }
    },
  },
})
