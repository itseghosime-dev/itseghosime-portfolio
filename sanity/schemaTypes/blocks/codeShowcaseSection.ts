import {defineArrayMember, defineField, defineType} from 'sanity'
import {CodeIcon} from '@sanity/icons/Code'

export const codeShowcaseSection = defineType({
  name: 'codeShowcaseSection',
  title: 'Code showcase',
  type: 'object',
  icon: CodeIcon,

  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      placeholder: 'Technical implementation',
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
      description: 'Explain why these implementation details are relevant.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(320),
    }),

    defineField({
      name: 'snippets',
      title: 'Code snippets',
      description: 'Show small, focused examples—not entire application files.',
      type: 'array',

      of: [
        defineArrayMember({
          name: 'codeSnippet',
          title: 'Code snippet',
          type: 'object',

          fields: [
            defineField({
              name: 'title',
              title: 'Snippet title',
              type: 'string',
              validation: (rule) => rule.required().max(100),
            }),

            defineField({
              name: 'filename',
              title: 'Filename',
              type: 'string',
              placeholder: 'components/LanguageSwitcher.tsx',
              validation: (rule) => rule.max(140),
            }),

            defineField({
              name: 'language',
              title: 'Language',
              type: 'string',
              options: {
                list: [
                  {title: 'TypeScript', value: 'typescript'},
                  {title: 'TSX', value: 'tsx'},
                  {title: 'JavaScript', value: 'javascript'},
                  {title: 'JSX', value: 'jsx'},
                  {title: 'HTML', value: 'html'},
                  {title: 'CSS', value: 'css'},
                  {title: 'JSON', value: 'json'},
                  {title: 'Markdown', value: 'markdown'},
                  {title: 'GROQ', value: 'groq'},
                  {title: 'Shell', value: 'shell'},
                ],
              },
              validation: (rule) => rule.required(),
            }),

            defineField({
              name: 'code',
              title: 'Code',
              description:
                'Paste the smallest amount of code needed to explain the implementation.',
              type: 'text',
              rows: 16,
              validation: (rule) => rule.required().max(8000),
            }),

            defineField({
              name: 'explanation',
              title: 'Explanation',
              description: 'Explain the problem, approach and important decision shown.',
              type: 'text',
              rows: 4,
              validation: (rule) => rule.required().max(500),
            }),

            defineField({
              name: 'sourceUrl',
              title: 'Source URL',
              description: 'Optional link to the corresponding public repository file.',
              type: 'url',
              validation: (rule) =>
                rule.uri({
                  scheme: ['https'],
                }),
            }),
          ],

          preview: {
            select: {
              title: 'title',
              filename: 'filename',
              language: 'language',
            },

            prepare({title, filename, language}) {
              return {
                title: title || filename || 'Untitled code snippet',
                subtitle: [filename, language].filter(Boolean).join(' · '),
                media: CodeIcon,
              }
            },
          },
        }),
      ],

      validation: (rule) => rule.required().min(1).max(4),
    }),

    defineField({
      name: 'presentation',
      title: 'Presentation style',
      type: 'string',
      initialValue: 'tabs',

      options: {
        list: [
          {title: 'Code tabs', value: 'tabs'},
          {title: 'Stacked snippets', value: 'stacked'},
        ],
        layout: 'radio',
      },

      validation: (rule) => rule.required(),
    }),
  ],

  preview: {
    select: {
      title: 'heading',
      snippets: 'snippets',
    },

    prepare({title, snippets}) {
      const count = Array.isArray(snippets) ? snippets.length : 0

      return {
        title: title || 'Code showcase',
        subtitle: `${count} code snippet${count === 1 ? '' : 's'}`,
        media: CodeIcon,
      }
    },
  },
})
