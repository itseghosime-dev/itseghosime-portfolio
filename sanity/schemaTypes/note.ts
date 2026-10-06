import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const note = defineType({
  name: 'note',
  title: 'Note',
  type: 'document',
  icon: DocumentTextIcon,

  groups: [
    {name: 'editorial', title: 'Editorial details', default: true},
    {name: 'content', title: 'Content'},
    {name: 'classification', title: 'Topics and technologies'},
    {name: 'seo', title: 'SEO and sharing'},
    {name: 'visibility', title: 'Visibility'},
  ],

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'editorial',
      validation: (rule) => rule.required().max(110),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      group: 'editorial',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description: 'A concise summary for note cards and search results.',
      type: 'text',
      rows: 3,
      group: 'editorial',
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'accessibleImage',
      group: 'editorial',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publication date',
      type: 'datetime',
      group: 'editorial',
      validation: (rule) => rule.warning('Add a publication date before publishing.'),
    }),
    defineField({
      name: 'body',
      title: 'Note content',
      type: 'richText',
      group: 'content',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'technologies',
      title: 'Related technologies',
      type: 'array',
      group: 'classification',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'technology'}],
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'topics',
      title: 'Topics',
      description: 'Use a small set of consistent editorial topics.',
      type: 'array',
      group: 'classification',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      validation: (rule) => rule.unique().max(8),
    }),
    defineField({
      name: 'seo',
      title: 'SEO and social sharing',
      type: 'seoMetadata',
      group: 'seo',
    }),
    defineField({
      name: 'featured',
      title: 'Feature on the website',
      type: 'boolean',
      group: 'visibility',
      initialValue: false,
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display order',
      type: 'number',
      group: 'visibility',
      initialValue: 10,
      validation: (rule) => rule.integer().min(0),
    }),
  ],

  orderings: [
    {
      title: 'Publication date, newest first',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],

  preview: {
    select: {
      title: 'title',
      publishedAt: 'publishedAt',
      media: 'coverImage',
    },
    prepare({title, publishedAt, media}) {
      return {
        title: title || 'Untitled note',
        subtitle: publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Unscheduled',
        media: media || DocumentTextIcon,
      }
    },
  },
})
