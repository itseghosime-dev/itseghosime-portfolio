import {LinkIcon} from '@sanity/icons/Link'
import {defineField, defineType} from 'sanity'

export const navigationItem = defineType({
  name: 'navigationItem',
  title: 'Navigation item',
  type: 'object',
  icon: LinkIcon,

  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'destination',
      title: 'Destination',
      type: 'string',
      options: {
        list: [
          {title: 'Home', value: 'home'},
          {title: 'Projects', value: 'projects'},
          {title: 'Lab', value: 'lab'},
          {title: 'Notes', value: 'notes'},
          {title: 'Experience', value: 'experience'},
          {title: 'Profile', value: 'profile'},
          {title: 'Contact', value: 'contact'},
          {title: 'External URL', value: 'external'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      hidden: ({parent}) => parent?.destination !== 'external',
      validation: (rule) =>
        rule.uri({scheme: ['https']}).custom((value, context) => {
          const parent = context.parent as {destination?: string}
          if (parent?.destination === 'external' && !value) {
            return 'Add the external destination URL.'
          }
          return true
        }),
    }),
  ],

  preview: {
    select: {title: 'label', destination: 'destination'},
    prepare({title, destination}) {
      return {
        title: title || 'Navigation item',
        subtitle: destination || 'No destination',
        media: LinkIcon,
      }
    },
  },
})
