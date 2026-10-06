import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

export const narrativeSection = defineType({
  name: 'narrativeSection',
  title: 'Narrative section',
  type: 'object',
  icon: DocumentTextIcon,

  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      description: 'Optional small label displayed above the heading.',
      type: 'string',
      placeholder: 'The challenge',
      validation: (rule) => rule.max(60),
    }),

    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required().max(120),
    }),

    defineField({
      name: 'body',
      title: 'Content',
      description: 'Explain the context, problem, process, solution, outcome or learning.',
      type: 'array',

      of: [
        defineArrayMember({
          type: 'block',

          styles: [
            {
              title: 'Normal',
              value: 'normal',
            },
            {
              title: 'Quote',
              value: 'blockquote',
            },
          ],

          lists: [
            {
              title: 'Bullet list',
              value: 'bullet',
            },
            {
              title: 'Numbered list',
              value: 'number',
            },
          ],

          marks: {
            decorators: [
              {
                title: 'Strong',
                value: 'strong',
              },
              {
                title: 'Emphasis',
                value: 'em',
              },
            ],

            annotations: [
              defineArrayMember({
                name: 'link',
                title: 'Link',
                type: 'object',

                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (rule) =>
                      rule.required().uri({
                        scheme: ['http', 'https', 'mailto'],
                      }),
                  }),

                  defineField({
                    name: 'openInNewTab',
                    title: 'Open in a new tab',
                    type: 'boolean',
                    initialValue: true,
                  }),
                ],
              }),
            ],
          },
        }),
      ],

      validation: (rule) => rule.required().min(1),
    }),

    defineField({
      name: 'image',
      title: 'Supporting image',
      description: 'Optional image displayed alongside or below the narrative.',
      type: 'accessibleImage',
    }),

    defineField({
      name: 'presentation',
      title: 'Presentation style',
      type: 'string',
      initialValue: 'textOnly',

      options: {
        list: [
          {
            title: 'Text only',
            value: 'textOnly',
          },
          {
            title: 'Image on the left',
            value: 'mediaLeft',
          },
          {
            title: 'Image on the right',
            value: 'mediaRight',
          },
        ],
        layout: 'radio',
      },

      validation: (rule) => rule.required(),
    }),
  ],

  preview: {
    select: {
      heading: 'heading',
      eyebrow: 'eyebrow',
      presentation: 'presentation',
      media: 'image',
    },

    prepare({heading, eyebrow, presentation, media}) {
      return {
        title: heading || 'Untitled narrative',
        subtitle: [eyebrow, `Narrative · ${presentation || 'textOnly'}`]
          .filter(Boolean)
          .join(' · '),
        media: media || DocumentTextIcon,
      }
    },
  },
})
