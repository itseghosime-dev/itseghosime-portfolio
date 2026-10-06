import {TagIcon} from '@sanity/icons/Tag'
import {defineField, defineType} from 'sanity'

export const technology = defineType({
  name: 'technology',
  title: 'Technology',
  type: 'document',
  icon: TagIcon,

  groups: [
    {name: 'identity', title: 'Technology', default: true},
    {name: 'classification', title: 'Classification'},
    {name: 'details', title: 'Details'},
    {name: 'visibility', title: 'Visibility'},
  ],

  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required().max(80),
    }),

    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      group: 'identity',
      options: {source: 'name', maxLength: 80},
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'summary',
      title: 'Professional context',
      description: 'Briefly explain how you use or are learning this technology.',
      type: 'text',
      rows: 3,
      group: 'identity',
      validation: (rule) => rule.max(280),
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'classification',
      options: {
        list: [
          {title: 'Programming language', value: 'language'},
          {title: 'Framework', value: 'framework'},
          {title: 'Library', value: 'library'},
          {title: 'Runtime', value: 'runtime'},
          {title: 'Content management', value: 'cms'},
          {title: 'Styling and UI', value: 'styling'},
          {title: 'Testing and quality', value: 'testing'},
          {title: 'Automation', value: 'automation'},
          {title: 'AI and machine learning', value: 'ai'},
          {title: 'Developer tooling', value: 'tooling'},
          {title: 'Platform and infrastructure', value: 'platform'},
          {title: 'Database', value: 'database'},
          {title: 'Other', value: 'other'},
        ],
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'relationship',
      title: 'Current relationship',
      description: 'Use an honest status instead of a percentage or skill bar.',
      type: 'string',
      group: 'classification',
      initialValue: 'working',
      options: {
        list: [
          {title: 'Core skill', value: 'core'},
          {title: 'Working knowledge', value: 'working'},
          {title: 'Currently learning', value: 'learning'},
          {title: 'Exploring', value: 'exploring'},
          {title: 'Previously used', value: 'historical'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'firstUsedYear',
      title: 'First used',
      description: 'Optional year. Only enter a date you can support.',
      type: 'number',
      group: 'details',
      validation: (rule) => rule.integer().min(2020).max(new Date().getFullYear()),
    }),

    defineField({
      name: 'officialUrl',
      title: 'Official website',
      type: 'url',
      group: 'details',
      validation: (rule) => rule.uri({scheme: ['https']}),
    }),

    defineField({
      name: 'logo',
      title: 'Logo or mark',
      description: 'Optional. Use an asset you have permission to display.',
      type: 'accessibleImage',
      group: 'details',
    }),

    defineField({
      name: 'featured',
      title: 'Feature prominently',
      type: 'boolean',
      group: 'visibility',
      initialValue: false,
    }),

    defineField({
      name: 'displayOrder',
      title: 'Display order',
      description: 'Lower numbers appear first within a category.',
      type: 'number',
      group: 'visibility',
      initialValue: 10,
      validation: (rule) => rule.integer().min(0),
    }),
  ],

  orderings: [
    {
      title: 'Display order',
      name: 'displayOrder',
      by: [
        {field: 'displayOrder', direction: 'asc'},
        {field: 'name', direction: 'asc'},
      ],
    },
    {
      title: 'Name',
      name: 'name',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],

  preview: {
    select: {
      title: 'name',
      category: 'category',
      relationship: 'relationship',
      media: 'logo',
    },
    prepare({title, category, relationship, media}) {
      return {
        title: title || 'Untitled technology',
        subtitle: [category, relationship].filter(Boolean).join(' · '),
        media: media || TagIcon,
      }
    },
  },
})
