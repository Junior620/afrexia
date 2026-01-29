import { type SchemaTypeDefinition } from 'sanity'

import blockContent from './blockContent'
import product from './product'
import category from './category'
import origin from './origin'
import certification from './certification'
import blogPost from './blogPost'
import blogCategory from './blogCategory'
import teamMember from './teamMember'
import resource from './resource'
import page from './page'
import siteSettings from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContent,
    product,
    category,
    origin,
    certification,
    blogPost,
    blogCategory,
    teamMember,
    resource,
    page,
    siteSettings,
  ],
}
