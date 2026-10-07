import {DocumentIcon} from '@sanity/icons/Document'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  icon: DocumentIcon,

  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'story', title: 'Story and focus'},
    {name: 'tools', title: 'Tools'},
    {name: 'journey', title: 'Experience and education'},
    {name: 'closing', title: 'Principles and call to action'},
  ],

  fields: [
    defineField({
      name: 'heroEyebrow',
      title: 'Hero eyebrow',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero heading',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'heroIntroduction',
      title: 'Hero introduction',
      type: 'text',
      rows: 4,
      group: 'hero',
      validation: (rule) => rule.required().max(460),
    }),
    defineField({
      name: 'identityFacts',
      title: 'Identity facts',
      description: 'Short facts displayed beneath the hero introduction.',
      type: 'array',
      group: 'hero',
      of: [
        defineArrayMember({
          name: 'identityFact',
          title: 'Identity fact',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required().max(30),
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: (rule) => rule.required().max(100),
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'value'},
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(4),
    }),
    defineField({
      name: 'primaryAction',
      title: 'Primary action',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required().max(40)}),
        defineField({name: 'href', title: 'Path', type: 'string', validation: (rule) => rule.required().regex(/^\//, {name: 'internal path', invert: false})}),
      ],
    }),
    defineField({
      name: 'secondaryAction',
      title: 'Secondary action',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required().max(40)}),
        defineField({name: 'href', title: 'Path', type: 'string', validation: (rule) => rule.required().regex(/^\//, {name: 'internal path', invert: false})}),
      ],
    }),
    defineField({
      name: 'storyEyebrow',
      title: 'Story eyebrow',
      type: 'string',
      group: 'story',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'quickFacts',
      title: 'Quick facts',
      type: 'array',
      group: 'story',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.required().min(1).max(5).unique(),
    }),
    defineField({
      name: 'focusHeading',
      title: 'Focus heading',
      type: 'string',
      group: 'story',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'focusLabel',
      title: 'Focus side label',
      type: 'string',
      group: 'story',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'focusItems',
      title: 'Focus items',
      type: 'array',
      group: 'story',
      of: [
        defineArrayMember({
          name: 'focusItem',
          title: 'Focus item',
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required().max(70)}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 3, validation: (rule) => rule.required().max(320)}),
          ],
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
      validation: (rule) => rule.required().min(1).max(8),
    }),
    defineField({
      name: 'toolsHeading',
      title: 'Tools heading',
      type: 'string',
      group: 'tools',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'toolsLabel',
      title: 'Tools side label',
      type: 'string',
      group: 'tools',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'technologyGroups',
      title: 'Technology groups',
      description: 'Choose and order only the tools worth highlighting on this page.',
      type: 'array',
      group: 'tools',
      of: [
        defineArrayMember({
          name: 'technologyGroup',
          title: 'Technology group',
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required().max(60)}),
            defineField({
              name: 'technologies',
              title: 'Technologies',
              type: 'array',
              of: [defineArrayMember({type: 'reference', to: [{type: 'technology'}]})],
              validation: (rule) => rule.required().min(1).max(10).unique(),
            }),
          ],
          preview: {
            select: {title: 'label', technologies: 'technologies'},
            prepare({title, technologies}) {
              const count = Array.isArray(technologies) ? technologies.length : 0
              return {title: title || 'Technology group', subtitle: `${count} technologies`}
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(5),
    }),
    defineField({
      name: 'experienceHeading',
      title: 'Experience heading',
      type: 'string',
      group: 'journey',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'experienceLabel',
      title: 'Experience side label',
      type: 'string',
      group: 'journey',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'experienceMilestones',
      title: 'Selected experience',
      description: 'Order these exactly as they should appear on the page.',
      type: 'array',
      group: 'journey',
      of: [defineArrayMember({type: 'reference', to: [{type: 'careerMilestone'}]})],
      validation: (rule) => rule.required().min(1).max(8).unique(),
    }),
    defineField({
      name: 'educationHeading',
      title: 'Education heading',
      type: 'string',
      group: 'journey',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'learningHeading',
      title: 'Active learning heading',
      type: 'string',
      group: 'journey',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'educationMilestones',
      title: 'Education and completed training',
      type: 'array',
      group: 'journey',
      of: [defineArrayMember({type: 'reference', to: [{type: 'careerMilestone'}]})],
      validation: (rule) => rule.required().min(1).max(8).unique(),
    }),
    defineField({
      name: 'learningMilestones',
      title: 'Active learning',
      type: 'array',
      group: 'journey',
      of: [defineArrayMember({type: 'reference', to: [{type: 'careerMilestone'}]})],
      validation: (rule) => rule.max(8).unique(),
    }),
    defineField({
      name: 'principlesHeading',
      title: 'Principles heading',
      type: 'string',
      group: 'closing',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'principlesLabel',
      title: 'Principles side label',
      type: 'string',
      group: 'closing',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'ctaEyebrow',
      title: 'Call-to-action eyebrow',
      type: 'string',
      group: 'closing',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'ctaHeading',
      title: 'Call-to-action heading',
      type: 'string',
      group: 'closing',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'ctaMessage',
      title: 'Call-to-action message',
      type: 'text',
      rows: 3,
      group: 'closing',
      validation: (rule) => rule.required().max(320),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Call-to-action button label',
      type: 'string',
      group: 'closing',
      validation: (rule) => rule.required().max(50),
    }),
  ],

  preview: {
    prepare() {
      return {title: 'About page', subtitle: 'Editorial profile and professional journey'}
    },
  },
})
