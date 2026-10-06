import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const richText = defineType({
  name: 'richText',
  title: 'Rich text',
  type: 'array',
  icon: DocumentTextIcon,

  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading 2', value: 'h2'},
        {title: 'Heading 3', value: 'h3'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet list', value: 'bullet'},
        {title: 'Numbered list', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Inline code', value: 'code'},
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
                validation: (rule) => rule.required().uri({scheme: ['http', 'https', 'mailto']}),
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
    defineArrayMember({type: 'accessibleImage'}),
    defineArrayMember({type: 'codeBlock'}),
  ],
})
