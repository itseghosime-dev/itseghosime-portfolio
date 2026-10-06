import {CogIcon} from '@sanity/icons/Cog'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,

  groups: [
    {name: 'identity', title: 'Site identity', default: true},
    {name: 'navigation', title: 'Navigation'},
    {name: 'contact', title: 'Contact call to action'},
    {name: 'seo', title: 'Default SEO'},
    {name: 'search', title: 'Search engines'},
  ],

  fields: [
    defineField({
      name: 'siteName',
      title: 'Site name',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site description',
      type: 'text',
      rows: 3,
      group: 'identity',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical site URL',
      description: 'The final production domain, without a trailing slash.',
      type: 'url',
      group: 'identity',
      validation: (rule) => rule.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'navigation',
      title: 'Primary navigation',
      description: 'Drag items into the order used by the website navigation.',
      type: 'array',
      group: 'navigation',
      of: [defineArrayMember({type: 'navigationItem'})],
      validation: (rule) => rule.required().min(1).max(8),
    }),
    defineField({
      name: 'contactHeading',
      title: 'Contact heading',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'contactMessage',
      title: 'Contact message',
      type: 'text',
      rows: 3,
      group: 'contact',
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: 'contactButtonLabel',
      title: 'Contact button label',
      type: 'string',
      group: 'contact',
      initialValue: 'Start a conversation',
      validation: (rule) => rule.required().max(50),
    }),
    defineField({
      name: 'footerText',
      title: 'Footer text',
      description: 'Do not include the year; the frontend will add it automatically.',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO and sharing',
      description: 'Fallback metadata used when a page does not provide an override.',
      type: 'seoMetadata',
      group: 'seo',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'indexing',
      title: 'Search indexing',
      description: 'Block indexing only while the entire website should remain private.',
      type: 'string',
      group: 'search',
      initialValue: 'block',
      options: {
        list: [
          {title: 'Allow search indexing', value: 'allow'},
          {title: 'Block search indexing', value: 'block'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'googleSiteVerification',
      title: 'Google site verification',
      description: 'Optional verification value supplied by Google Search Console.',
      type: 'string',
      group: 'search',
      validation: (rule) => rule.max(200),
    }),
  ],

  preview: {
    select: {title: 'siteName', canonicalUrl: 'canonicalUrl', indexing: 'indexing'},
    prepare({title, canonicalUrl, indexing}) {
      const searchStatus = indexing === 'allow' ? 'Search indexing enabled' : 'Search indexing blocked'
      return {
        title: title || 'Site settings',
        subtitle: [canonicalUrl || 'Domain not configured', searchStatus].join(' · '),
        media: CogIcon,
      }
    },
  },
})
