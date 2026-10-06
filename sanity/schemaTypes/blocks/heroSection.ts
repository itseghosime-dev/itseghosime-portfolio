import {defineField, defineType} from 'sanity'
import {BlockContentIcon} from '@sanity/icons/BlockContent'

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero section',
  type: 'object',
  icon: BlockContentIcon,

  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      description: 'Small contextual text displayed above the headline.',
      type: 'string',
      placeholder: 'Featured project',
      validation: (rule) => rule.max(60),
    }),

    defineField({
      name: 'headline',
      title: 'Headline override',
      description: 'Optional. Leave empty to use the project title as the headline.',
      type: 'string',
      validation: (rule) => rule.max(100),
    }),

    defineField({
      name: 'introduction',
      title: 'Introduction',
      description: 'A concise opening statement explaining the project and its value.',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().max(320),
    }),

    defineField({
      name: 'image',
      title: 'Hero image',
      description: 'Optional for editorial heroes, but recommended for split and immersive heroes.',
      type: 'accessibleImage',
    }),

    defineField({
      name: 'presentation',
      title: 'Presentation style',
      description: 'Controls the visual composition without changing the content.',
      type: 'string',
      initialValue: 'editorial',
      options: {
        list: [
          {
            title: 'Editorial — text-led introduction',
            value: 'editorial',
          },
          {
            title: 'Split — text and image side by side',
            value: 'split',
          },
          {
            title: 'Immersive — prominent full-width media',
            value: 'immersive',
          },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
  ],

  preview: {
    select: {
      headline: 'headline',
      eyebrow: 'eyebrow',
      presentation: 'presentation',
      media: 'image',
    },

    prepare({headline, eyebrow, presentation, media}) {
      return {
        title: headline || eyebrow || 'Project hero',
        subtitle: `Hero section · ${presentation || 'editorial'}`,
        media: media || BlockContentIcon,
      }
    },
  },
})
