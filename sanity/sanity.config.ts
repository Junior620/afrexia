import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { apiVersion, dataset, projectId } from './env'
import { schema } from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Afrexia Website',

  projectId,
  dataset,

  basePath: '/studio',

  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],

  schema,
})
