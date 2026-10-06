import {CalendarIcon} from '@sanity/icons/Calendar'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const careerMilestone = defineType({
  name: 'careerMilestone',
  title: 'Career milestone',
  type: 'document',
  icon: CalendarIcon,

  groups: [
    {name: 'identity', title: 'Milestone', default: true},
    {name: 'contributions', title: 'Contributions and evidence'},
    {name: 'relationships', title: 'Related work'},
    {name: 'visibility', title: 'Visibility'},
  ],

  fields: [
    defineField({
      name: 'title',
      title: 'Title or programme',
      description: 'For example: Frontend Developer or B.Eng. Industrial Engineering.',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'milestoneType',
      title: 'Milestone type',
      type: 'string',
      group: 'identity',
      options: {
        list: [
          {title: 'Employment', value: 'employment'},
          {title: 'Freelance work', value: 'freelance'},
          {title: 'Education', value: 'education'},
          {title: 'Training programme', value: 'training'},
          {title: 'Certification or badge', value: 'certification'},
          {title: 'Award or recognition', value: 'award'},
          {title: 'Community and teaching', value: 'community'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'organisation',
      title: 'Organisation',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'engagementType',
      title: 'Engagement type',
      type: 'string',
      group: 'identity',
      hidden: ({parent}) =>
        parent?.milestoneType !== 'employment' && parent?.milestoneType !== 'freelance',
      options: {
        list: [
          {title: 'Full-time', value: 'fullTime'},
          {title: 'Part-time', value: 'partTime'},
          {title: 'Contract', value: 'contract'},
          {title: 'Freelance', value: 'freelance'},
          {title: 'Internship', value: 'internship'},
          {title: 'Volunteer', value: 'volunteer'},
        ],
      },
    }),
    defineField({
      name: 'location',
      title: 'Location',
      description: 'City and country, or Remote.',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'identity',
      initialValue: 'completed',
      options: {
        list: [
          {title: 'Completed', value: 'completed'},
          {title: 'In progress', value: 'inProgress'},
          {title: 'Upcoming', value: 'upcoming'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'date',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End date',
      type: 'date',
      group: 'identity',
      hidden: ({parent}) => parent?.status === 'inProgress',
      validation: (rule) =>
        rule.custom((endDate, context) => {
          const startDate = context.document?.startDate
          if (startDate && endDate && endDate < startDate) {
            return 'End date must be after the start date.'
          }
          if (context.document?.status === 'completed' && !endDate) {
            return 'Add an end date for a completed milestone.'
          }
          return true
        }),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      description: 'Explain the role, programme or achievement without unsupported claims.',
      type: 'text',
      rows: 3,
      group: 'contributions',
      validation: (rule) => rule.required().max(360),
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      description: 'Add specific responsibilities, contributions, coursework or outcomes.',
      type: 'array',
      group: 'contributions',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: 'credentialTitle',
      title: 'Credential title',
      description: 'Preserve the title exactly as issued.',
      type: 'string',
      group: 'contributions',
      hidden: ({parent}) =>
        parent?.milestoneType !== 'education' &&
        parent?.milestoneType !== 'training' &&
        parent?.milestoneType !== 'certification',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'credentialUrl',
      title: 'Credential URL',
      type: 'url',
      group: 'contributions',
      hidden: ({parent}) =>
        parent?.milestoneType !== 'training' && parent?.milestoneType !== 'certification',
      validation: (rule) => rule.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Related projects',
      type: 'array',
      group: 'relationships',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'project'}],
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'technologies',
      title: 'Related technologies',
      type: 'array',
      group: 'relationships',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'technology'}],
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'organisationLogo',
      title: 'Organisation logo',
      description: 'Optional. Use only when you have permission to display it.',
      type: 'accessibleImage',
      group: 'relationships',
    }),
    defineField({
      name: 'featured',
      title: 'Feature in the dossier',
      type: 'boolean',
      group: 'visibility',
      initialValue: true,
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display order',
      description: 'Used when an editorial order is preferred over date order.',
      type: 'number',
      group: 'visibility',
      initialValue: 10,
      validation: (rule) => rule.integer().min(0),
    }),
  ],

  orderings: [
    {
      title: 'Newest first',
      name: 'startDateDesc',
      by: [{field: 'startDate', direction: 'desc'}],
    },
    {
      title: 'Display order',
      name: 'displayOrder',
      by: [
        {field: 'displayOrder', direction: 'asc'},
        {field: 'startDate', direction: 'desc'},
      ],
    },
  ],

  preview: {
    select: {
      title: 'title',
      organisation: 'organisation',
      startDate: 'startDate',
      status: 'status',
      media: 'organisationLogo',
    },
    prepare({title, organisation, startDate, status, media}) {
      const details = [organisation, startDate?.slice(0, 4), status].filter(Boolean).join(' · ')
      return {
        title: title || 'Untitled milestone',
        subtitle: details,
        media: media || CalendarIcon,
      }
    },
  },
})
