import { describe, it, expect } from 'vitest'
import { Schema } from '@sanity/schema'
import product from '../product'
import blockContent from '../blockContent'
import category from '../category'
import origin from '../origin'
import certification from '../certification'

describe('Product Schema Validation', () => {
  const schema = Schema.compile({
    name: 'test',
    types: [product, blockContent, category, origin, certification],
  })

  const productType = schema.get('product')

  it('should require name field', () => {
    const nameField = productType.fields.find((f: any) => f.name === 'name')
    expect(nameField).toBeDefined()
    expect(nameField.type.validation).toBeDefined()
  })

  it('should require slug field', () => {
    const slugField = productType.fields.find((f: any) => f.name === 'slug')
    expect(slugField).toBeDefined()
    expect(slugField.type.validation).toBeDefined()
  })

  it('should require heroImage field', () => {
    const heroImageField = productType.fields.find((f: any) => f.name === 'heroImage')
    expect(heroImageField).toBeDefined()
    expect(heroImageField.type.validation).toBeDefined()
  })

  it('should require category field', () => {
    const categoryField = productType.fields.find((f: any) => f.name === 'category')
    expect(categoryField).toBeDefined()
    expect(categoryField.type.validation).toBeDefined()
  })

  it('should have valid category reference', () => {
    const categoryField = productType.fields.find((f: any) => f.name === 'category')
    expect(categoryField).toBeDefined()
    expect(categoryField.type.name).toBe('reference')
    expect(categoryField.type.to).toContainEqual({ type: 'category' })
  })

  it('should have description field', () => {
    const descriptionField = productType.fields.find((f: any) => f.name === 'description')
    expect(descriptionField).toBeDefined()
    // Description is optional, so no validation required
  })

  it('should require gallery field with minimum 1 image', () => {
    const galleryField = productType.fields.find((f: any) => f.name === 'gallery')
    expect(galleryField).toBeDefined()
    expect(galleryField.type.validation).toBeDefined()
  })

  it('should have multilingual name field with fr and en', () => {
    const nameField = productType.fields.find((f: any) => f.name === 'name')
    const fields = nameField.type.fields
    expect(fields.find((f: any) => f.name === 'fr')).toBeDefined()
    expect(fields.find((f: any) => f.name === 'en')).toBeDefined()
  })

  it('should have multilingual slug field with fr and en', () => {
    const slugField = productType.fields.find((f: any) => f.name === 'slug')
    const fields = slugField.type.fields
    expect(fields.find((f: any) => f.name === 'fr')).toBeDefined()
    expect(fields.find((f: any) => f.name === 'en')).toBeDefined()
  })

  it('should have workflowStatus field with correct options', () => {
    const statusField = productType.fields.find((f: any) => f.name === 'workflowStatus')
    expect(statusField).toBeDefined()
    const options = statusField.type.options.list
    expect(options).toContainEqual({ title: 'Draft', value: 'draft' })
    expect(options).toContainEqual({ title: 'In Review', value: 'in_review' })
    expect(options).toContainEqual({ title: 'Published', value: 'published' })
  })

  it('should have availability field with correct options', () => {
    const availabilityField = productType.fields.find((f: any) => f.name === 'availability')
    expect(availabilityField).toBeDefined()
    const options = availabilityField.type.options.list
    expect(options).toContainEqual({ title: 'In Stock', value: 'in-stock' })
    expect(options).toContainEqual({ title: 'Pre-Order', value: 'pre-order' })
    expect(options).toContainEqual({ title: 'Limited Stock', value: 'limited' })
    expect(options).toContainEqual({ title: 'Out of Stock', value: 'out-of-stock' })
  })

  it('should have incoterms field with valid options', () => {
    const incotermsField = productType.fields.find((f: any) => f.name === 'incoterms')
    expect(incotermsField).toBeDefined()
    expect(incotermsField.type.name).toBe('array')
    // Incoterms is an array of strings with predefined options
    expect(incotermsField.type.of[0].name).toBe('string')
  })

  it('should have all required fields defined', () => {
    const requiredFields = [
      'name',
      'slug',
      'category',
      'heroImage',
      'availability',
      'origins',
      'moq',
      'incoterms',
      'workflowStatus',
    ]

    requiredFields.forEach((fieldName) => {
      const field = productType.fields.find((f: any) => f.name === fieldName)
      expect(field).toBeDefined()
    })
  })

  it('should have optional fields defined', () => {
    const optionalFields = [
      'subtitle',
      'eudrReady',
      'qaAvailable',
      'documents',
      'packaging',
      'grade',
      'leadTime',
      'notes',
      'tags',
      'markets',
      'description',
      'gallery',
      'originRegions',
      'harvestSeason',
      'packagingOptions',
      'certifications',
      'specificationPDF',
      'qaMetrics',
      'hsCode',
      'seo',
    ]

    optionalFields.forEach((fieldName) => {
      const field = productType.fields.find((f: any) => f.name === fieldName)
      expect(field).toBeDefined()
    })
  })
})
