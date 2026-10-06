import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

type AccessibleImageValue = {
  asset?: {
    _ref?: string
  }
}

export const mediaShowcaseSection = defineType({
  name: 'mediaShowcaseSection',
  title: 'Media showcase',
  type: 'object',
  icon: ImageIcon,

  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      description: 'Optional label displayed above the heading.',
      type: 'string',
      placeholder: 'Interface showcase',
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
      description: 'Briefly explain what the screenshots or walkthrough demonstrate.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(280),
    }),

    defineField({
      name: 'items',
      title: 'Media items',
      description: 'Add screenshots, interface details or externally hosted videos.',
      type: 'array',

      of: [
        defineArrayMember({
          name: 'mediaItem',
          title: 'Media item',
          type: 'object',

          fields: [
            defineField({
              name: 'mediaType',
              title: 'Media type',
              type: 'string',
              initialValue: 'image',
              options: {
                list: [
                  {
                    title: 'Image',
                    value: 'image',
                  },
                  {
                    title: 'External video',
                    value: 'externalVideo',
                  },
                ],
                layout: 'radio',
              },
              validation: (rule) => rule.required(),
            }),

            defineField({
              name: 'image',
              title: 'Image',
              type: 'accessibleImage',
              hidden: ({parent}) => parent?.mediaType !== 'image',
              validation: (rule) =>
                rule.custom((value, context) => {
                  const parent = context.parent as {
                    mediaType?: string
                  }

                  const image = value as AccessibleImageValue | undefined

                  if (parent?.mediaType === 'image' && !image?.asset?._ref) {
                    return 'Select an image.'
                  }

                  return true
                }),
            }),

            defineField({
              name: 'videoUrl',
              title: 'Video URL',
              description:
                'Use an HTTPS URL from a video service such as YouTube, Vimeo or Loom. Do not upload production video files directly to Sanity.',
              type: 'url',
              hidden: ({parent}) => parent?.mediaType !== 'externalVideo',
              validation: (rule) =>
                rule
                  .uri({
                    scheme: ['https'],
                  })
                  .custom((value, context) => {
                    const parent = context.parent as {
                      mediaType?: string
                    }

                    if (parent?.mediaType === 'externalVideo' && !value) {
                      return 'Enter the external video URL.'
                    }

                    return true
                  }),
            }),

            defineField({
              name: 'posterImage',
              title: 'Video poster image',
              description: 'Optional preview shown before the video is opened.',
              type: 'accessibleImage',
              hidden: ({parent}) => parent?.mediaType !== 'externalVideo',
            }),

            defineField({
              name: 'title',
              title: 'Item title',
              description: 'Name the screen, feature or interaction being shown.',
              type: 'string',
              validation: (rule) => rule.required().max(100),
            }),

            defineField({
              name: 'caption',
              title: 'Caption',
              description: 'Explain why this screen or interaction matters.',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.max(240),
            }),

            defineField({
              name: 'displayContext',
              title: 'Display context',
              description: 'Choose the visual frame that best represents the original interface.',
              type: 'string',
              initialValue: 'browser',
              options: {
                list: [
                  {
                    title: 'No device frame',
                    value: 'none',
                  },
                  {
                    title: 'Desktop browser',
                    value: 'browser',
                  },
                  {
                    title: 'Mobile device',
                    value: 'mobile',
                  },
                ],
                layout: 'radio',
              },
              validation: (rule) => rule.required(),
            }),
          ],

          preview: {
            select: {
              title: 'title',
              mediaType: 'mediaType',
              image: 'image',
              posterImage: 'posterImage',
            },

            prepare({title, mediaType, image, posterImage}) {
              return {
                title: title || 'Untitled media item',
                subtitle: mediaType === 'externalVideo' ? 'External video' : 'Image',
                media: image || posterImage || ImageIcon,
              }
            },
          },
        }),
      ],

      validation: (rule) => rule.required().min(1).max(8),
    }),

    defineField({
      name: 'presentation',
      title: 'Presentation style',
      type: 'string',
      initialValue: 'grid',

      options: {
        list: [
          {
            title: 'Editorial grid',
            value: 'grid',
          },
          {
            title: 'Horizontal carousel',
            value: 'carousel',
          },
          {
            title: 'Full-width sequence',
            value: 'sequence',
          },
        ],
        layout: 'radio',
      },

      validation: (rule) => rule.required(),
    }),
  ],

  preview: {
    select: {
      title: 'heading',
      media: 'items.0.image',
      posterImage: 'items.0.posterImage',

      item1: 'items.0.mediaType',
      item2: 'items.1.mediaType',
      item3: 'items.2.mediaType',
      item4: 'items.3.mediaType',
      item5: 'items.4.mediaType',
      item6: 'items.5.mediaType',
      item7: 'items.6.mediaType',
      item8: 'items.7.mediaType',
    },

    prepare({title, media, posterImage, item1, item2, item3, item4, item5, item6, item7, item8}) {
      const itemCount = [item1, item2, item3, item4, item5, item6, item7, item8].filter(
        Boolean,
      ).length

      return {
        title: title || 'Media showcase',
        subtitle: `${itemCount} media item${itemCount === 1 ? '' : 's'}`,
        media: media || posterImage || ImageIcon,
      }
    },
  },
})
