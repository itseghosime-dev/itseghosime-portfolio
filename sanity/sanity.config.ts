import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {studioTheme} from './studioTheme'
import {StudioIcon} from './studio/components/StudioIcon'

const singletonTypes = new Set(['profile', 'aboutPage', 'siteSettings'])

export default defineConfig({
  name: 'default',
  title: 'ITSEGHOSIME',
  icon: StudioIcon,

  projectId: 's3e4rrk9',
  dataset: 'production',

  theme: studioTheme,

  plugins: [structureTool({structure}), visionTool()],

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
