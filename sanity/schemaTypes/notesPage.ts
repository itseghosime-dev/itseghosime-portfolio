import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineField, defineType} from 'sanity'

export const notesPage = defineType({
  name: 'notesPage',
  title: 'Notes page',
  type: 'document',
  icon: DocumentTextIcon,

  groups: [
    {name: 'archive', title: 'Archive', default: true},
    {name: 'article', title: 'Article defaults'},
    {name: 'seo', title: 'SEO and sharing'},
  ],

  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Archive eyebrow',
      type: 'string',
      group: 'archive',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'heading',
      title: 'Archive heading',
      type: 'string',
      group: 'archive',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'introduction',
      title: 'Archive introduction',
      type: 'text',
      rows: 3,
      group: 'archive',
      validation: (rule) => rule.required().max(320),
    }),
    defineField({
      name: 'archiveNote',
      title: 'Archive note',
      description: 'Short note shown below the archive index.',
      type: 'string',
      group: 'archive',
      validation: (rule) => rule.max(180),
    }),
    defineField({
      name: 'libraryEyebrow',
      title: 'Reading library eyebrow',
      type: 'string',
      group: 'archive',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'libraryHeading',
      title: 'Reading library heading',
      type: 'string',
      group: 'archive',
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: 'backLabel',
      title: 'Back-to-notes label',
      type: 'string',
      group: 'article',
      initialValue: 'Back to notes',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'contentsLabel',
      title: 'Table of contents label',
      type: 'string',
      group: 'article',
      initialValue: 'In this note',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'relatedHeading',
      title: 'Related notes heading',
      type: 'string',
      group: 'article',
      initialValue: 'Continue reading',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'feedbackHeading',
      title: 'Feedback heading',
      type: 'string',
      group: 'article',
      initialValue: 'Have a different approach?',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'feedbackMessage',
      title: 'Feedback message',
      type: 'text',
      rows: 3,
      group: 'article',
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: 'seo',
      title: 'SEO and social sharing',
      type: 'seoMetadata',
      group: 'seo',
    }),
  ],

  preview: {
    select: {title: 'heading', subtitle: 'eyebrow'},
    prepare({title, subtitle}) {
      return {
        title: title || 'Notes page',
        subtitle: subtitle || 'Editorial archive settings',
        media: DocumentTextIcon,
      }
    },
  },
})
