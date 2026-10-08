import {CodeIcon} from '@sanity/icons/Code'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const labExperiment = defineType({
  name: 'labExperiment',
  title: 'Lab experiment',
  type: 'document',
  icon: CodeIcon,

  groups: [
    {name: 'identity', title: 'Experiment', default: true},
    {name: 'content', title: 'Process and findings'},
    {name: 'classification', title: 'Technologies'},
    {name: 'links', title: 'Links'},
    {name: 'seo', title: 'SEO and sharing'},
    {name: 'visibility', title: 'Visibility'},
  ],

  fields: [
    defineField({
      name: 'title',
      title: 'Experiment title',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required().max(110),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      group: 'identity',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'experimentNumber',
      title: 'Experiment number',
      description: 'The archive number shown as LAB 017, LAB 016, and so on.',
      type: 'number',
      group: 'identity',
      validation: (rule) => rule.required().integer().positive(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      description: 'What did you explore, build or test?',
      type: 'text',
      rows: 3,
      group: 'identity',
      validation: (rule) => rule.required().max(260),
    }),
    defineField({
      name: 'question',
      title: 'Question or hypothesis',
      description: 'State the technical question the experiment was intended to answer.',
      type: 'text',
      rows: 3,
      group: 'identity',
      validation: (rule) => rule.max(360),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'identity',
      initialValue: 'exploring',
      options: {
        list: [
          {title: 'Planned', value: 'planned'},
          {title: 'Exploring', value: 'exploring'},
          {title: 'Completed', value: 'completed'},
          {title: 'Paused', value: 'paused'},
          {title: 'Archived', value: 'archived'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'version',
      title: 'Version',
      description: 'Optional public version label, for example v1.4.',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.max(24),
    }),
    defineField({
      name: 'category',
      title: 'Primary category',
      type: 'string',
      group: 'classification',
      options: {
        list: [
          {title: 'Interaction', value: 'interaction'},
          {title: 'UI and forms', value: 'uiForms'},
          {title: 'Data and visualisation', value: 'dataViz'},
          {title: '3D and shaders', value: 'threeDShaders'},
          {title: 'Motion', value: 'motion'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'presentation',
      title: 'Interactive presentation',
      description:
        'Select the local interactive canvas that demonstrates this experiment. Choose none when the experiment is documented with an image or text only.',
      type: 'string',
      group: 'content',
      initialValue: 'none',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Spatial depth study', value: 'spatialDepth'},
          {title: 'Magnetic navigation', value: 'magneticNavigation'},
          {title: 'Kinetic typography', value: 'kineticTypography'},
          {title: 'Autonomous micro-form', value: 'autonomousMicroForm'},
          {title: 'Streaming data canvas', value: 'streamingData'},
          {title: 'Spring carousel', value: 'springCarousel'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startedAt',
      title: 'Started',
      type: 'date',
      group: 'identity',
    }),
    defineField({
      name: 'completedAt',
      title: 'Completed',
      type: 'date',
      group: 'identity',
      hidden: ({parent}) => parent?.status !== 'completed',
      validation: (rule) =>
        rule.custom((completedAt, context) => {
          const startedAt = context.document?.startedAt
          if (startedAt && completedAt && completedAt < startedAt) {
            return 'Completion date must be after the start date.'
          }
          return true
        }),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'accessibleImage',
      group: 'identity',
    }),
    defineField({
      name: 'body',
      title: 'Experiment log',
      description: 'Document the approach, important decisions and implementation details.',
      type: 'richText',
      group: 'content',
    }),
    defineField({
      name: 'findings',
      title: 'Findings and lessons',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          name: 'finding',
          title: 'Finding',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Finding',
              type: 'string',
              validation: (rule) => rule.required().max(100),
            }),
            defineField({
              name: 'description',
              title: 'Explanation',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required().max(360),
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies explored',
      type: 'array',
      group: 'classification',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'technology'}],
        }),
      ],
      validation: (rule) => rule.unique().min(1).warning('Add the technologies explored.'),
    }),
    defineField({
      name: 'relatedProject',
      title: 'Related project',
      description: 'Optional project that led to or benefited from this experiment.',
      type: 'reference',
      to: [{type: 'project'}],
      group: 'classification',
    }),
    defineField({
      name: 'demoUrl',
      title: 'Live demonstration',
      type: 'url',
      group: 'links',
      validation: (rule) => rule.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'repositoryUrl',
      title: 'Source repository',
      type: 'url',
      group: 'links',
      validation: (rule) => rule.uri({scheme: ['https']}),
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

  preview: {
    select: {title: 'title', status: 'status', media: 'coverImage'},
    prepare({title, status, media}) {
      const statusLabels: Record<string, string> = {
        planned: 'Planned',
        exploring: 'Exploring',
        completed: 'Completed',
        paused: 'Paused',
        archived: 'Archived',
      }
      return {
        title: title || 'Untitled experiment',
        subtitle: status ? statusLabels[status] : 'No status',
        media: media || CodeIcon,
      }
    },
  },
})
