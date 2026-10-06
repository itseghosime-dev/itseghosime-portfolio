import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

export const processSection = defineType({
  name: 'processSection',
  title: 'Process',
  type: 'object',
  icon: DocumentTextIcon,

  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      placeholder: 'Design and development process',
      validation: (rule) => rule.max(60),
    }),

    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required().max(120),
    }),

    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(280),
    }),

    defineField({
      name: 'steps',
      title: 'Process steps',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'processStep',
          title: 'Process step',
          type: 'object',

          fields: [
            defineField({
              name: 'phase',
              title: 'Phase label',
              type: 'string',
              placeholder: '01 · Discovery',
              validation: (rule) => rule.max(50),
            }),

            defineField({
              name: 'title',
              title: 'Step title',
              type: 'string',
              validation: (rule) => rule.required().max(100),
            }),

            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 4,
              validation: (rule) => rule.required().max(400),
            }),

            defineField({
              name: 'deliverables',
              title: 'Deliverables',
              description: 'Only include outputs actually produced.',
              type: 'array',
              of: [defineArrayMember({type: 'string'})],
              options: {
                layout: 'tags',
              },
              validation: (rule) => rule.unique().max(6),
            }),

            defineField({
              name: 'image',
              title: 'Supporting image',
              type: 'accessibleImage',
            }),
          ],

          preview: {
            select: {
              title: 'title',
              subtitle: 'phase',
              media: 'image',
            },
          },
        }),
      ],

      validation: (rule) => rule.required().min(1).max(8),
    }),

    defineField({
      name: 'presentation',
      title: 'Presentation style',
      type: 'string',
      initialValue: 'numbered',

      options: {
        list: [
          {title: 'Numbered sequence', value: 'numbered'},
          {title: 'Process cards', value: 'cards'},
          {title: 'Editorial steps', value: 'editorial'},
        ],
        layout: 'radio',
      },

      validation: (rule) => rule.required(),
    }),
  ],

  preview: {
    select: {
      title: 'heading',
      steps: 'steps',
    },

    prepare({title, steps}) {
      const count = Array.isArray(steps) ? steps.length : 0

      return {
        title: title || 'Project process',
        subtitle: `${count} process step${count === 1 ? '' : 's'}`,
        media: DocumentTextIcon,
      }
    },
  },
})
