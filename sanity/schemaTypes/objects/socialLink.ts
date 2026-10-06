import {LinkIcon} from '@sanity/icons/Link'
import {defineField, defineType} from 'sanity'

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social link',
  type: 'object',
  icon: LinkIcon,

  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          {title: 'GitHub', value: 'github'},
          {title: 'LinkedIn', value: 'linkedin'},
          {title: 'X / Twitter', value: 'x'},
          {title: 'YouTube', value: 'youtube'},
          {title: 'Other', value: 'other'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Accessible label',
      description: 'For example: Abdulrahman Bello on GitHub.',
      type: 'string',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'url',
      title: 'Profile URL',
      type: 'url',
      validation: (rule) => rule.required().uri({scheme: ['https']}),
    }),
  ],

  preview: {
    select: {title: 'label', subtitle: 'platform'},
    prepare({title, subtitle}) {
      return {title: title || 'Social link', subtitle, media: LinkIcon}
    },
  },
})
