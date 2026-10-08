import {defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    project: defineLocations({
      select: {slug: 'slug.current', title: 'title'},
      resolve: (document) => ({
        locations: [
          ...(document?.slug
            ? [
                {
                  href: `/work/${document.slug}`,
                  title: document.title || 'Project case study',
                },
              ]
            : []),
          {href: '/work', title: 'Work archive'},
          {href: '/', title: 'Homepage'},
        ],
      }),
    }),
    note: defineLocations({
      select: {slug: 'slug.current', title: 'title'},
      resolve: (document) => ({
        locations: [
          ...(document?.slug
            ? [
                {
                  href: `/notes/${document.slug}`,
                  title: document.title || 'Technical note',
                },
              ]
            : []),
          {href: '/notes', title: 'Notes archive'},
        ],
      }),
    }),
    labExperiment: defineLocations({
      select: {title: 'title'},
      resolve: (document) => ({
        locations: [
          {href: '/lab', title: document?.title || 'Lab experiment'},
          {href: '/work', title: 'Work archive'},
          {href: '/', title: 'Homepage'},
        ],
      }),
    }),
    aboutPage: defineLocations({
      locations: [{href: '/about', title: 'About page'}],
      message: 'This document controls the About page.',
      tone: 'positive',
    }),
    labPage: defineLocations({
      locations: [{href: '/lab', title: 'Lab page'}],
      message: 'This document controls the Lab archive.',
      tone: 'positive',
    }),
    notesPage: defineLocations({
      locations: [{href: '/notes', title: 'Notes archive'}],
      message: 'This document controls the Notes archive.',
      tone: 'positive',
    }),
    workPage: defineLocations({
      locations: [{href: '/work', title: 'Work archive'}],
      message: 'This document controls the Work archive.',
      tone: 'positive',
    }),
    contactPage: defineLocations({
      locations: [{href: '/contact', title: 'Contact page'}],
      message: 'This document controls the Contact page metadata.',
      tone: 'positive',
    }),
    profile: defineLocations({
      locations: [
        {href: '/', title: 'Homepage'},
        {href: '/about', title: 'About page'},
        {href: '/contact', title: 'Contact page'},
      ],
      message: 'Profile content appears throughout the portfolio.',
      tone: 'positive',
    }),
    siteSettings: defineLocations({
      locations: [{href: '/', title: 'Homepage'}],
      message: 'Global settings affect every page.',
      tone: 'positive',
    }),
  },
}
