import {CodeIcon} from '@sanity/icons/Code'
import {defineField, defineType} from 'sanity'

export const codeBlock = defineType({
  name: 'codeBlock',
  title: 'Code block',
  type: 'object',
  icon: CodeIcon,

  fields: [
    defineField({
      name: 'filename',
      title: 'Filename',
      type: 'string',
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
          {title: 'Python', value: 'python'},
          {title: 'HTML', value: 'html'},
          {title: 'CSS', value: 'css'},
          {title: 'JSON', value: 'json'},
          {title: 'GROQ', value: 'groq'},
          {title: 'Markdown', value: 'markdown'},
          {title: 'Shell', value: 'shell'},
          {title: 'Plain text', value: 'text'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'code',
      title: 'Code',
      type: 'text',
      rows: 16,
      validation: (rule) => rule.required().max(12000),
    }),
    defineField({
      name: 'caption',
      title: 'Explanation',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(360),
    }),
  ],

  preview: {
    select: {filename: 'filename', language: 'language'},
    prepare({filename, language}) {
      return {
        title: filename || 'Code block',
        subtitle: language || 'Plain text',
        media: CodeIcon,
      }
    },
  },
})
