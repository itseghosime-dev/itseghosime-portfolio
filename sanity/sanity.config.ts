import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {resolve} from './presentation/resolve'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {studioTheme} from './studioTheme'
import {StudioIcon} from './studio/components/StudioIcon'

const singletonTypes = new Set([
  'profile',
  'aboutPage',
  'contactPage',
  'labPage',
  'notesPage',
  'siteSettings',
  'workPage',
])

const isLocalStudio =
  typeof location !== 'undefined' && ['localhost', '127.0.0.1'].includes(location.hostname)
const previewOrigin = isLocalStudio ? 'http://localhost:3000' : 'https://itseghosime.com'

export default defineConfig({
  name: 'default',
  title: 'ITSEGHOSIME',
  icon: StudioIcon,

  projectId: 's3e4rrk9',
  dataset: 'production',

  theme: studioTheme,

  plugins: [
    structureTool({structure}),
    presentationTool({
      previewUrl: {
        initial: previewOrigin,
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
      resolve,
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((template) => !singletonTypes.has(template.schemaType)),
  },

  document: {
    actions: (previousActions, context) => {
      if (!singletonTypes.has(context.schemaType)) {
        return previousActions
      }

      return previousActions.filter(
        (action) => action.action !== 'duplicate' && action.action !== 'delete',
      )
    },
  },
})
