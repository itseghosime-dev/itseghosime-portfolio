import {defineField, defineType} from 'sanity'
import {SearchIcon} from '@sanity/icons/Search'

export const seoMetadata = defineType({
  name: 'seoMetadata',
  title: 'SEO metadata',
  type: 'object',
  icon: SearchIcon,

  fields: [
    defineField({
      name: 'title',
      title: 'Search title',
      description:
        'Optional. Overrides the content title in search results. Aim for approximately 50–60 characters.',
      type: 'string',
      validation: (rule) =>
        rule.max(60).warning('Search engines may truncate titles longer than 60 characters.'),
    }),

    defineField({
      name: 'description',
      title: 'Search description',
      description:
        'Optional. Overrides the card summary in search results. Aim for approximately 120–160 characters.',
      type: 'text',
      rows: 3,
      validation: (rule) =>
        rule
          .max(160)
          .warning('Search engines may truncate descriptions longer than 160 characters.'),
    }),

    defineField({
      name: 'image',
      title: 'Social sharing image',
      description:
        'Used when this page is shared on LinkedIn and social platforms. Recommended size: 1200 × 630 pixels.',
      type: 'accessibleImage',
    }),

    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      description: 'Turn this on only when the page should not appear in search results.',
      type: 'boolean',
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      description: 'description',
      media: 'image',
    },

    prepare({title, description, media}) {
      return {
        title: title || 'Default page metadata',
        subtitle: description || 'The page title and summary will be used.',
        media: media || SearchIcon,
      }
    },
  },
})
