import {defineArrayMember, defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons/Case'

export const contributionGridSection = defineType({
  name: 'contributionGridSection',
  title: 'Contributions and ownership',
  type: 'object',
  icon: CaseIcon,

  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      placeholder: 'Scope and ownership',
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
      name: 'items',
      title: 'Contributions',
      description:
        'Add specific responsibilities, features or technical contributions.',
      type: 'array',

      of: [
        defineArrayMember({
          name: 'contribution',
          title: 'Contribution',
          type: 'object',

          fields: [
            defineField({
              name: 'label',
              title: 'Category label',
              description: 'A short category displayed above the title.',
              type: 'string',
              placeholder: 'Frontend development',
              validation: (rule) => rule.max(50),
            }),

            defineField({
              name: 'title',
              title: 'Contribution title',
              type: 'string',
              validation: (rule) => rule.required().max(100),
            }),

            defineField({
              name: 'description',
              title: 'Description',
              description:
                'Explain what you contributed and how you approached it.',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required().max(280),
            }),
          ],

          preview: {
            select: {
              title: 'title',
              subtitle: 'label',
            },
          },
        }),
      ],

      validation: (rule) => rule.required().min(1).max(6),
    }),

    defineField({
      name: 'presentation',
      title: 'Presentation style',
      type: 'string',
      initialValue: 'grid',

      options: {
        list: [
          {
            title: 'Card grid',
            value: 'grid',
          },
          {
            title: 'Editorial list',
            value: 'list',
          },
        ],
        layout: 'radio',
      },

      validation: (rule) => rule.required(),
    }),
  ],

  preview: {
    select: {
      title: 'heading',
      items: 'items',
    },

    prepare({title, items}) {
      const itemCount = Array.isArray(items) ? items.length : 0

      return {
        title: title || 'Contributions and ownership',
        subtitle: `${itemCount} contribution${itemCount === 1 ? '' : 's'}`,
        media: CaseIcon,
      }
    },
  },
})