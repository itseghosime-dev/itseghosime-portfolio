import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {defineField, defineType} from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact page',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'seo',
      title: 'SEO and social sharing',
      description: 'Search and sharing metadata for the contact page.',
      type: 'seoMetadata',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({title: 'Contact page', subtitle: 'Contact SEO and social sharing'}),
  },
})
