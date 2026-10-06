import {defineArrayMember, defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons/Play'

export const interactiveSandboxSection = defineType({
  name: 'interactiveSandboxSection',
  title: 'Interactive sandbox',
  type: 'object',
  icon: PlayIcon,

  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      placeholder: 'Try the project',
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
      description: 'Explain what visitors can explore inside the sandbox.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(320),
    }),

    defineField({
      name: 'embedUrl',
      title: 'Sandbox URL',
      description:
        'Use the HTTPS address of the separately deployed project. The frontend must also allowlist this hostname.',
      type: 'url',

      validation: (rule) =>
        rule
          .required()
          .uri({
            scheme: ['https'],
          })
          .custom((value) => {
            if (!value) {
              return true
            }

            try {
              const url = new URL(value)
              const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0']

              if (blockedHosts.includes(url.hostname)) {
                return 'Use a publicly deployed HTTPS address.'
              }

              if (url.username || url.password) {
                return 'Do not include credentials in the sandbox URL.'
              }

              return true
            } catch {
              return 'Enter a valid HTTPS URL.'
            }
          }),
    }),

    defineField({
      name: 'fallbackImage',
      title: 'Fallback image',
      description:
        'Shown if the deployed project cannot be embedded because of availability or security headers.',
      type: 'accessibleImage',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'fallbackMessage',
      title: 'Fallback message',
      type: 'string',
      initialValue:
        'The interactive preview is currently unavailable. Open the live project instead.',
      validation: (rule) => rule.required().max(180),
    }),

    defineField({
      name: 'instructions',
      title: 'Suggested interactions',
      description: 'Optional actions that help visitors understand what to try.',
      type: 'array',

      of: [
        defineArrayMember({
          name: 'sandboxInstruction',
          title: 'Suggested interaction',
          type: 'object',

          fields: [
            defineField({
              name: 'title',
              title: 'Action title',
              type: 'string',
              placeholder: 'Change the website language',
              validation: (rule) => rule.required().max(80),
            }),

            defineField({
              name: 'description',
              title: 'Instruction',
              type: 'text',
              rows: 2,
              validation: (rule) => rule.required().max(220),
            }),
          ],

          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
        }),
      ],

      validation: (rule) => rule.max(6),
    }),

    defineField({
      name: 'availableViewports',
      title: 'Available viewport controls',
      type: 'array',
      initialValue: ['desktop'],

      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],

      options: {
        list: [
          {title: 'Desktop', value: 'desktop'},
          {title: 'Tablet', value: 'tablet'},
          {title: 'Mobile', value: 'mobile'},
        ],
      },

      validation: (rule) => rule.required().min(1).unique(),
    }),

    defineField({
      name: 'initialViewport',
      title: 'Initial viewport',
      type: 'string',
      initialValue: 'desktop',

      options: {
        list: [
          {title: 'Desktop', value: 'desktop'},
          {title: 'Tablet', value: 'tablet'},
          {title: 'Mobile', value: 'mobile'},
        ],
        layout: 'radio',
      },

      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'frameHeight',
      title: 'Sandbox height',
      type: 'string',
      initialValue: 'standard',

      options: {
        list: [
          {title: 'Standard', value: 'standard'},
          {title: 'Tall', value: 'tall'},
          {title: 'Full viewport', value: 'viewport'},
        ],
        layout: 'radio',
      },

      validation: (rule) => rule.required(),
    }),
  ],

  preview: {
    select: {
      title: 'heading',
      url: 'embedUrl',
      media: 'fallbackImage',
    },

    prepare({title, url, media}) {
      let hostname = 'No sandbox URL'

      if (url) {
        try {
          hostname = new URL(url).hostname
        } catch {
          hostname = 'Invalid sandbox URL'
        }
      }

      return {
        title: title || 'Interactive sandbox',
        subtitle: hostname,
        media: media || PlayIcon,
      }
    },
  },
})
