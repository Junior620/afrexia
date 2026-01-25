import { describe, it, expect } from 'vitest'
import { Schema } from '@sanity/schema'
import blogPost from '../blogPost'
import blockContent from '../blockContent'

describe('BlogPost Schema Validation', () => {
  const schema = Schema.compile({
    name: 'test',
    types: [blogPost, blockContent],
  })

  const blogPostType = schema.get('blogPost')

  it('should require title field', () => {
    const titleField = blogPostType.fields.find((f: any) => f.name === 'title')
    expect(titleField).toBeDefined()
    expect(titleField.type.validation).toBeDefined()
  })

  it('should require slug field', () => {
    const slugField = blogPostType.fields.find((f: any) => f.name === 'slug')
    expect(slugField).toBeDefined()
    expect(slugField.type.validation).toBeDefined()
  })

  it('should require i18nId field', () => {
    const i18nIdField = blogPostType.fields.find((f: any) => f.name === 'i18nId')
    expect(i18nIdField).toBeDefined()
    expect(i18nIdField.type.validation).toBeDefined()
  })

  it('should require author field', () => {
    const authorField = blogPostType.fields.find((f: any) => f.name === 'author')
    expect(authorField).toBeDefined()
    expect(authorField.type.validation).toBeDefined()
    expect(authorField.type.name).toBe('reference')
  })

  it('should require featuredImage field', () => {
    const featuredImageField = blogPostType.fields.find((f: any) => f.name === 'featuredImage')
    expect(featuredImageField).toBeDefined()
    expect(featuredImageField.type.validation).toBeDefined()
  })

  it('should require excerpt field', () => {
    const excerptField = blogPostType.fields.find((f: any) => f.name === 'excerpt')
    expect(excerptField).toBeDefined()
    expect(excerptField.type.validation).toBeDefined()
  })

  it('should require content field', () => {
    const contentField = blogPostType.fields.find((f: any) => f.name === 'content')
    expect(contentField).toBeDefined()
    expect(contentField.type.validation).toBeDefined()
  })

  it('should require categories field with minimum 1 category', () => {
    const categoriesField = blogPostType.fields.find((f: any) => f.name === 'categories')
    expect(categoriesField).toBeDefined()
    expect(categoriesField.type.validation).toBeDefined()
  })

  it('should require publishedAt field', () => {
    const publishedAtField = blogPostType.fields.find((f: any) => f.name === 'publishedAt')
    expect(publishedAtField).toBeDefined()
    expect(publishedAtField.type.validation).toBeDefined()
    expect(publishedAtField.type.name).toBe('datetime')
  })

  it('should have multilingual title field with fr and en', () => {
    const titleField = blogPostType.fields.find((f: any) => f.name === 'title')
    const fields = titleField.type.fields
    expect(fields.find((f: any) => f.name === 'fr')).toBeDefined()
    expect(fields.find((f: any) => f.name === 'en')).toBeDefined()
  })

  it('should have multilingual slug field with fr and en', () => {
    const slugField = blogPostType.fields.find((f: any) => f.name === 'slug')
    const fields = slugField.type.fields
    expect(fields.find((f: any) => f.name === 'fr')).toBeDefined()
    expect(fields.find((f: any) => f.name === 'en')).toBeDefined()
  })

  it('should have tags field', () => {
    const tagsField = blogPostType.fields.find((f: any) => f.name === 'tags')
    expect(tagsField).toBeDefined()
    expect(tagsField.type.name).toBe('array')
  })

  it('should have readingTime field', () => {
    const readingTimeField = blogPostType.fields.find((f: any) => f.name === 'readingTime')
    expect(readingTimeField).toBeDefined()
    expect(readingTimeField.type.name).toBe('number')
  })

  it('should have workflowStatus field', () => {
    const statusField = blogPostType.fields.find((f: any) => f.name === 'workflowStatus')
    expect(statusField).toBeDefined()
    expect(statusField.type.validation).toBeDefined()
  })
})
