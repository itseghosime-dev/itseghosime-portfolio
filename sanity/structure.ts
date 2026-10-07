import {CalendarIcon} from '@sanity/icons/Calendar'
import {CodeIcon} from '@sanity/icons/Code'
import {CogIcon} from '@sanity/icons/Cog'
import {DocumentIcon} from '@sanity/icons/Document'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {TagIcon} from '@sanity/icons/Tag'
import {UserIcon} from '@sanity/icons/User'
import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('ITSEGHOSIME')
    .items([
      S.divider().title('CONTENT'),
      S.documentTypeListItem('project').title('Projects').icon(DocumentIcon),
      S.documentTypeListItem('labExperiment').title('Lab').icon(CodeIcon),
      S.documentTypeListItem('note').title('Notes').icon(DocumentTextIcon),
      S.documentTypeListItem('careerMilestone').title('Experience').icon(CalendarIcon),

      S.divider().title('LIBRARY'),
      S.documentTypeListItem('technology').title('Technologies').icon(TagIcon),

      S.divider().title('SETTINGS'),
      S.listItem()
        .id('profile')
        .title('Profile')
        .icon(UserIcon)
        .child(
          S.document().schemaType('profile').documentId('profile').title('Profile and dossier'),
        ),
      S.listItem()
        .id('aboutPage')
        .title('About Page')
        .icon(DocumentIcon)
        .child(S.document().schemaType('aboutPage').documentId('aboutPage').title('About page')),
      S.listItem()
        .id('siteSettings')
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings').title('Site settings'),
        ),
    ])
