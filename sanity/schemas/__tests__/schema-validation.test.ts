import { describe, it, expect } from 'vitest'
import { Schema } from '@sanity/schema'
import { schema } from '../index'

describe('Schema Validation - Data Format Tests', () => {
  const compiledSchema = Schema.compile(schema)

  describe('Email validation', () => {
    it('should validate email format in teamMember schema', () => {
      const teamMemberType = compiledSchema.get('teamMember')
      const emailField = teamMemberType.fields.find((f: any) => f.name === 'email')
      expect(emailField).toBeDefined()
      expect(emailField.type.name).toBe('string')
    })
  })

  describe('URL validation', () => {
    it('should validate URL format in certification schema', () => {
      const certificationType = compiledSchema.get('certification')
      const urlField = certificationType.fields.find((f: any) => f.name === 'certificateUrl')
      expect(urlField).toBeDefined()
      expect(urlField.type.name).toBe('url')
    })
  })

  describe('Date validation', () => {
    it('should validate date format in certification schema', () => {
      const certificationType = compiledSchema.get('certification')
      const dateField = certificationType.fields.find((f: any) => f.name === 'validUntil')
      expect(dateField).toBeDefined()
      expect(dateField.type.name).toBe('date')
    })

    it('should validate datetime format in blogPost schema', () => {
      const blogPostType = compiledSchema.get('blogPost')
      const datetimeField = blogPostType.fields.find((f: any) => f.name === 'publishedAt')
      expect(datetimeField).toBeDefined()
      expect(datetimeField.type.name).toBe('datetime')
    })

    it('should validate date format in resource schema', () => {
      const resourceType = compiledSchema.get('resource')
      const dateField = resourceType.fields.find((f: any) => f.name === 'publishedAt')
      expect(dateField).toBeDefined()
      expect(dateField.type.name).toBe('date')
    })
  })

  describe('Number validation', () => {
    it('should validate number format in teamMember order field', () => {
      const teamMemberType = compiledSchema.get('teamMember')
      const orderField = teamMemberType.fields.find((f: any) => f.name === 'order')
      expect(orderField).toBeDefined()
      expect(orderField.type.name).toBe('number')
    })

    it('should validate number format in blogPost readingTime field', () => {
      const blogPostType = compiledSchema.get('blogPost')
      const readingTimeField = blogPostType.fields.find((f: any) => f.name === 'readingTime')
      expect(readingTimeField).toBeDefined()
      expect(readingTimeField.type.name).toBe('number')
    })
  })

  describe('Geopoint validation', () => {
    it('should have coordinates field in product originRegions', () => {
      const productType = compiledSchema.get('product')
      const originRegionsField = productType.fields.find((f: any) => f.name === 'originRegions')
      expect(originRegionsField).toBeDefined()
      expect(originRegionsField.type.name).toBe('array')
      
      // Check that coordinates field exists in the object
      const coordinatesField = originRegionsField.type.of[0].fields.find(
        (f: any) => f.name === 'coordinates'
      )
      expect(coordinatesField).toBeDefined()
    })
  })

  describe('File validation', () => {
    it('should validate file format in product specificationPDF', () => {
      const productType = compiledSchema.get('product')
      const pdfField = productType.fields.find((f: any) => f.name === 'specificationPDF')
      expect(pdfField).toBeDefined()
      expect(pdfField.type.name).toBe('file')
    })

    it('should validate file format in certification certificateDocument', () => {
      const certificationType = compiledSchema.get('certification')
      const fileField = certificationType.fields.find((f: any) => f.name === 'certificateDocument')
      expect(fileField).toBeDefined()
      expect(fileField.type.name).toBe('file')
    })

    it('should validate file format in resource file', () => {
      const resourceType = compiledSchema.get('resource')
      const fileField = resourceType.fields.find((f: any) => f.name === 'file')
      expect(fileField).toBeDefined()
      expect(fileField.type.name).toBe('file')
      expect(fileField.type.validation).toBeDefined()
    })
  })

  describe('Image validation', () => {
    it('should validate image format in product gallery', () => {
      const productType = compiledSchema.get('product')
      const galleryField = productType.fields.find((f: any) => f.name === 'gallery')
      expect(galleryField).toBeDefined()
      expect(galleryField.type.name).toBe('array')
      expect(galleryField.type.of[0].name).toBe('image')
    })

    it('should validate image format in certification logo', () => {
      const certificationType = compiledSchema.get('certification')
      const logoField = certificationType.fields.find((f: any) => f.name === 'logo')
      expect(logoField).toBeDefined()
      expect(logoField.type.name).toBe('image')
    })

    it('should validate image format in blogPost featuredImage', () => {
      const blogPostType = compiledSchema.get('blogPost')
      const imageField = blogPostType.fields.find((f: any) => f.name === 'featuredImage')
      expect(imageField).toBeDefined()
      expect(imageField.type.name).toBe('image')
    })

    it('should validate image format in teamMember photo', () => {
      const teamMemberType = compiledSchema.get('teamMember')
      const photoField = teamMemberType.fields.find((f: any) => f.name === 'photo')
      expect(photoField).toBeDefined()
      expect(photoField.type.name).toBe('image')
    })
  })

  describe('Reference validation', () => {
    it('should validate reference format in product certifications', () => {
      const productType = compiledSchema.get('product')
      const certificationsField = productType.fields.find((f: any) => f.name === 'certifications')
      expect(certificationsField).toBeDefined()
      expect(certificationsField.type.name).toBe('array')
      expect(certificationsField.type.of[0].name).toBe('reference')
    })

    it('should validate reference format in blogPost author', () => {
      const blogPostType = compiledSchema.get('blogPost')
      const authorField = blogPostType.fields.find((f: any) => f.name === 'author')
      expect(authorField).toBeDefined()
      expect(authorField.type.name).toBe('reference')
    })

    it('should validate reference format in blogPost categories', () => {
      const blogPostType = compiledSchema.get('blogPost')
      const categoriesField = blogPostType.fields.find((f: any) => f.name === 'categories')
      expect(categoriesField).toBeDefined()
      expect(categoriesField.type.name).toBe('array')
      expect(categoriesField.type.of[0].name).toBe('reference')
    })

    it('should validate reference format in resource relatedProducts', () => {
      const resourceType = compiledSchema.get('resource')
      const relatedProductsField = resourceType.fields.find(
        (f: any) => f.name === 'relatedProducts'
      )
      expect(relatedProductsField).toBeDefined()
      expect(relatedProductsField.type.name).toBe('array')
      expect(relatedProductsField.type.of[0].name).toBe('reference')
    })
  })

  describe('Slug validation', () => {
    it('should have slug fields in all schemas', () => {
      const schemasWithMultilingualSlugs = [
        'product',
        'blogPost',
        'blogCategory',
        'page',
      ]
      
      const schemasWithSingleSlug = [
        'teamMember',
        'resource',
      ]

      schemasWithMultilingualSlugs.forEach((schemaName) => {
        const schemaType = compiledSchema.get(schemaName)
        const slugField = schemaType.fields.find((f: any) => f.name === 'slug')
        expect(slugField).toBeDefined()
        
        // Check if it's a multilingual slug (object with fr/en)
        expect(slugField.type.name).toBe('object')
        const fields = slugField.type.fields
        expect(fields.find((f: any) => f.name === 'fr')).toBeDefined()
        expect(fields.find((f: any) => f.name === 'en')).toBeDefined()
      })
      
      schemasWithSingleSlug.forEach((schemaName) => {
        const schemaType = compiledSchema.get(schemaName)
        const slugField = schemaType.fields.find((f: any) => f.name === 'slug')
        expect(slugField).toBeDefined()
      })
    })
  })

  describe('Required field enforcement', () => {
    it('should enforce required fields in product schema', () => {
      const productType = compiledSchema.get('product')
      const requiredFields = ['name', 'slug', 'category', 'heroImage', 'availability', 'origins', 'moq', 'incoterms']

      requiredFields.forEach((fieldName) => {
        const field = productType.fields.find((f: any) => f.name === fieldName)
        expect(field).toBeDefined()
        expect(field.type.validation).toBeDefined()
      })
    })

    it('should enforce required fields in certification schema', () => {
      const certificationType = compiledSchema.get('certification')
      const requiredFields = ['name', 'logo']

      requiredFields.forEach((fieldName) => {
        const field = certificationType.fields.find((f: any) => f.name === fieldName)
        expect(field).toBeDefined()
        expect(field.type.validation).toBeDefined()
      })
    })

    it('should enforce required fields in blogPost schema', () => {
      const blogPostType = compiledSchema.get('blogPost')
      const requiredFields = [
        'title',
        'slug',
        'i18nId',
        'author',
        'featuredImage',
        'excerpt',
        'content',
        'categories',
        'publishedAt',
      ]

      requiredFields.forEach((fieldName) => {
        const field = blogPostType.fields.find((f: any) => f.name === fieldName)
        expect(field).toBeDefined()
        expect(field.type.validation).toBeDefined()
      })
    })

    it('should have required fields in resource schema', () => {
      const resourceType = compiledSchema.get('resource')
      const requiredFields = ['title', 'slug', 'category', 'file', 'language']

      requiredFields.forEach((fieldName) => {
        const field = resourceType.fields.find((f: any) => f.name === fieldName)
        expect(field).toBeDefined()
      })
    })
  })
})
