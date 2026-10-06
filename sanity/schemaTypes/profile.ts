import {UserIcon} from '@sanity/icons/User'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const profile = defineType({
  name: 'profile',
  title: 'Profile and dossier',
  type: 'document',
  icon: UserIcon,

  groups: [
    {name: 'identity', title: 'Professional identity', default: true},
    {name: 'biography', title: 'Biography'},
    {name: 'dossier', title: 'Dossier'},
    {name: 'contact', title: 'Public contact'},
    {name: 'seo', title: 'SEO and sharing'},
  ],

  fields: [
    defineField({
      name: 'fullName',
      title: 'Full name',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'professionalTitle',
      title: 'Professional title',
      description: 'A concise title aligned with the roles you are pursuing.',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'introduction',
      title: 'Short introduction',
      description: 'Used in prominent profile and homepage contexts.',
      type: 'text',
      rows: 3,
      group: 'identity',
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: 'portrait',
      title: 'Professional portrait',
      type: 'accessibleImage',
      group: 'identity',
    }),
    defineField({
      name: 'location',
      title: 'Public location',
      description: 'Use city and country only; do not enter a private street address.',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'string',
      group: 'identity',
      initialValue: 'open',
      options: {
        list: [
          {title: 'Open to opportunities', value: 'open'},
          {title: 'Available for freelance work', value: 'freelance'},
          {title: 'Open to selected projects', value: 'selective'},
          {title: 'Not currently available', value: 'unavailable'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'availabilityNote',
      title: 'Availability note',
      description: 'Optional public context such as preferred roles or working arrangement.',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.max(180),
    }),
    defineField({
      name: 'biography',
      title: 'Professional biography',
      type: 'richText',
      group: 'biography',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'targetRoles',
      title: 'Target roles',
      type: 'array',
      group: 'dossier',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      validation: (rule) => rule.required().min(1).max(6).unique(),
    }),
    defineField({
      name: 'professionalStrengths',
      title: 'Professional strengths',
      description: 'Use concise, supportable statements rather than generic traits.',
      type: 'array',
      group: 'dossier',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'workingPrinciples',
      title: 'Working principles',
      type: 'array',
      group: 'dossier',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: 'resume',
      title: 'Current résumé',
      description:
        'Optional public PDF. Upload only the final résumé you want visitors to download.',
      type: 'file',
      group: 'dossier',
      options: {accept: 'application/pdf'},
      fields: [
        defineField({
          name: 'label',
          title: 'Download label',
          type: 'string',
          initialValue: 'Download résumé',
          validation: (rule) => rule.max(60),
        }),
      ],
    }),
    defineField({
      name: 'email',
      title: 'Public email address',
      description: 'This value is stored in a public dataset. Do not enter a private address.',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Public phone number',
      description: 'Optional. Add this only if you deliberately want the number exposed publicly.',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.max(30),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Professional profiles',
      type: 'array',
      group: 'contact',
      of: [defineArrayMember({type: 'socialLink'})],
      validation: (rule) => rule.required().min(1).max(8),
    }),
    defineField({
      name: 'seo',
      title: 'Profile SEO and sharing',
      type: 'seoMetadata',
      group: 'seo',
    }),
  ],

  preview: {
    select: {
      title: 'fullName',
      professionalTitle: 'professionalTitle',
      location: 'location',
      availability: 'availability',
      media: 'portrait',
    },
    prepare({title, professionalTitle, location, availability, media}) {
      const availabilityLabels: Record<string, string> = {
        open: 'Open to opportunities',
        freelance: 'Available for freelance work',
        selective: 'Open to selected projects',
        unavailable: 'Not currently available',
      }

      return {
        title: title || 'Professional profile',
        subtitle: [
          professionalTitle,
          location,
          availability ? availabilityLabels[availability] : undefined,
        ]
          .filter(Boolean)
          .join(' · '),
        media: media || UserIcon,
      }
    },
  },
})
