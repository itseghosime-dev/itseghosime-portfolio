import {DocumentIcon} from '@sanity/icons/Document'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: DocumentIcon,

  groups: [
    {
      name: 'identity',
      title: 'Project information',
      default: true,
    },
    {
      name: 'content',
      title: 'Page sections',
    },
    {
      name: 'classification',
      title: 'Classification',
    },
    {
      name: 'links',
      title: 'Links',
    },
    {
      name: 'visibility',
      title: 'Visibility',
    },
  ],

  fields: [
    defineField({
      name: 'title',
      title: 'Project title',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'URL slug',
      description: 'The project URL, for example: /projects/skinnycans',
      type: 'slug',
      group: 'identity',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'subtitle',
      title: 'Project subtitle',
      description: 'A short description of what the product or website is.',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required().max(120),
    }),

    defineField({
      name: 'summary',
      title: 'Card summary',
      description: 'A concise summary used on the homepage and project archive.',
      type: 'text',
      rows: 3,
      group: 'identity',
      validation: (rule) => rule.required().max(260),
    }),

    defineField({
      name: 'role',
      title: 'My role',
      type: 'string',
      group: 'identity',
      placeholder: 'Frontend Developer',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'client',
      title: 'Client or organisation',
      description: 'Leave this empty for personal projects.',
      type: 'string',
      group: 'identity',
    }),

    defineField({
      name: 'year',
      title: 'Project year',
      type: 'number',
      group: 'identity',
      validation: (rule) => rule.required().integer().min(2020),
    }),

    defineField({
      name: 'timeline',
      title: 'Project timeline',
      description: 'For example: 6 weeks or June–August 2026.',
      type: 'string',
      group: 'identity',
    }),

    defineField({
      name: 'projectType',
      title: 'Project type',
      type: 'string',
      group: 'classification',
      options: {
        list: [
          {title: 'Website', value: 'website'},
          {title: 'Web application', value: 'webApplication'},
          {title: 'Software product', value: 'softwareProduct'},
          {title: 'Automation', value: 'automation'},
          {title: 'Experiment', value: 'experiment'},
          {title: 'Concept project', value: 'concept'},
        ],
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'status',
      title: 'Project status',
      type: 'string',
      group: 'classification',
      initialValue: 'concept',
      options: {
        list: [
          {title: 'Concept', value: 'concept'},
          {title: 'In progress', value: 'inProgress'},
          {title: 'Live', value: 'live'},
          {title: 'Archived', value: 'archived'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'technologies',
      title: 'Technologies used',
      description: 'Only include technologies actually used on this project.',
      type: 'array',
      group: 'classification',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
      options: {
        layout: 'tags',
      },
      validation: (rule) => rule.required().min(1).unique(),
    }),

    defineField({
      name: 'coverImage',
      title: 'Cover image',
      description: 'The primary image used on project cards and social previews.',
      type: 'accessibleImage',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'sections',
      title: 'Project page sections',
      description: 'Build the case study by adding and reordering reusable sections.',
      type: 'projectSections',
      group: 'content',
    }),

    defineField({
      name: 'liveUrl',
      title: 'Live website',
      type: 'url',
      group: 'links',
    }),

    defineField({
      name: 'repositoryUrl',
      title: 'GitHub repository',
      type: 'url',
      group: 'links',
    }),

    defineField({
      name: 'featured',
      title: 'Feature on homepage',
      type: 'boolean',
      group: 'visibility',
      initialValue: false,
    }),

    defineField({
      name: 'displayOrder',
      title: 'Display order',
      description: 'Lower numbers appear first.',
      type: 'number',
      group: 'visibility',
      initialValue: 10,
      validation: (rule) => rule.integer().min(0),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      role: 'role',
      year: 'year',
      media: 'coverImage',
    },

    prepare({title, role, year, media}) {
      const details = [role, year].filter(Boolean).join(' · ')

      return {
        title: title || 'Untitled project',
        subtitle: details,
        media,
      }
    },
  },
})
