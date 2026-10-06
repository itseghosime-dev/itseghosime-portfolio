import {defineArrayMember, defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons/Tag'

export const outcomesSection = defineType({
  name: 'outcomesSection',
  title: 'Outcomes and learning',
  type: 'object',
  icon: TagIcon,

  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      placeholder: 'Results and reflection',
      validation: (rule) => rule.max(60),
    }),

    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required().max(120),
    }),

    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(320),
    }),

    defineField({
      name: 'items',
      title: 'Outcomes',
      description:
        'Use metrics only when they can be verified. Qualitative outcomes and lessons are also valuable.',
      type: 'array',

      of: [
        defineArrayMember({
          name: 'outcomeItem',
          title: 'Outcome',
          type: 'object',

          fields: [
            defineField({
              name: 'kind',
              title: 'Outcome type',
              type: 'string',
              initialValue: 'qualitative',

              options: {
                list: [
                  {
                    title: 'Qualitative outcome',
                    value: 'qualitative',
                  },
                  {
                    title: 'Verified metric',
                    value: 'metric',
                  },
                  {
                    title: 'Learning',
                    value: 'learning',
                  },
                ],
                layout: 'radio',
              },

              validation: (rule) => rule.required(),
            }),

            defineField({
              name: 'value',
              title: 'Metric value',
              description: 'Enter only a verified value, for example “2 languages”.',
              type: 'string',
              hidden: ({parent}) => parent?.kind !== 'metric',

              validation: (rule) =>
                rule.custom((value, context) => {
                  const parent = context.parent as {
                    kind?: string
                  }

                  if (parent?.kind === 'metric' && !value) {
                    return 'Enter the verified metric value.'
                  }

                  return true
                }),
            }),

            defineField({
              name: 'title',
              title: 'Outcome title',
              type: 'string',
              validation: (rule) => rule.required().max(100),
            }),

            defineField({
              name: 'description',
              title: 'Description',
              description: 'State what changed, what was delivered or what you learned.',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required().max(320),
            }),
          ],

          preview: {
            select: {
              title: 'title',
              kind: 'kind',
              value: 'value',
            },

            prepare({title, kind, value}) {
              return {
                title: value ? `${value} · ${title}` : title || 'Untitled outcome',
                subtitle:
                  kind === 'metric'
                    ? 'Verified metric'
                    : kind === 'learning'
                      ? 'Learning'
                      : 'Qualitative outcome',
              }
            },
          },
        }),
      ],

      validation: (rule) => rule.required().min(1).max(6),
    }),

    defineField({
      name: 'closingNote',
      title: 'Closing reflection',
      description: 'Optional final thought about the project or what you would improve next.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(360),
    }),
  ],

  preview: {
    select: {
      title: 'heading',
      items: 'items',
    },

    prepare({title, items}) {
      const count = Array.isArray(items) ? items.length : 0

      return {
        title: title || 'Outcomes and learning',
        subtitle: `${count} outcome${count === 1 ? '' : 's'}`,
        media: TagIcon,
      }
    },
  },
})
