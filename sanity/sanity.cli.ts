import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 's3e4rrk9',
    dataset: 'production',
  },
  typegen: {
    path: '../web/sanity/lib/queries.ts',
    schema: './schema.json',
    generates: '../web/sanity.types.ts',
    overloadClientMethods: true,
  },
  deployment: {
    autoUpdates: true,
    appId: 'tn8g450u40m5gyug43oswjzp',
  },
})
