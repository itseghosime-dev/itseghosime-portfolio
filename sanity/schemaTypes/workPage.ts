import {DocumentIcon} from '@sanity/icons/Document'
import {defineField, defineType} from 'sanity'

export const workPage = defineType({
  name: 'workPage',
  title: 'Work page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'seo',
      title: 'SEO and social sharing',
      description: 'Search and sharing metadata for the work archive.',
      type: 'seoMetadata',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({title: 'Work page', subtitle: 'Archive SEO and social sharing'}),
  },
})
