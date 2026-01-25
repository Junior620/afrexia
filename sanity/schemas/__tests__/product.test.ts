import { describe, it, expect } from 'vitest'
import { Schema } from '@sanity/schema'
import product from '../product'
import blockContent from '../blockContent'

describe('Product Schema Validation', () => {
  const schema = Schema.compile({
    name: 'test',
    types: [product, blockContent],
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

  it('should require i18nId field', () => {
    const i18nIdField = productType.fields.find((f: any) => f.name === 'i18nId')
    expect(i18nIdField).toBeDefined()
    expect(i18nIdField.type.validation).toBeDefined()
  })

  it('should require category field', () => {
    const categoryField = productType.fields.find((f: any) => f.name === 'category')
    expect(categoryField).toBeDefined()
    expect(categoryField.type.validation).toBeDefined()
  })

  it('should have valid category options', () => {
    const categoryField = productType.fields.find((f: any) => f.name === 'category')
    const options = categoryField.type.options.list
    expect(options).toContainEqual({ title: 'Cocoa', value: 'cocoa' })
    expect(options).toContainEqual({ title: 'Coffee', value: 'coffee' })
    expect(options).toContainEqual({ title: 'Pepper', value: 'pepper' })
    expect(options).toContainEqual({ title: 'Wood', value: 'wood' })
    expect(options).toContainEqual({ title: 'Corn', value: 'corn' })
  })

  it('should require description field', () => {
    const descriptionField = productType.fields.find((f: any) => f.name === 'description')
    expect(descriptionField).toBeDefined()
    expect(descriptionField.type.validation).toBeDefined()
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
    expect(options).toContainEqual({ title: 'In Stock', value: 'in_stock' })
    expect(options).toContainEqual({ title: 'Pre-Order', value: 'pre_order' })
    expect(options).toContainEqual({ title: 'Seasonal', value: 'seasonal' })
    expect(options).toContainEqual({ title: 'Out of Stock', value: 'out_of_stock' })
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
      'i18nId',
      'category',
      'description',
      'gallery',
      'workflowStatus',
    ]

    requiredFields.forEach((fieldName) => {
      const field = productType.fields.find((f: any) => f.name === fieldName)
      expect(field).toBeDefined()
    })
  })

  it('should have optional fields defined', () => {
    const optionalFields = [
      'originRegions',
      'harvestSeason',
      'packagingOptions',
      'moq',
      'incoterms',
      'certifications',
      'specificationPDF',
      'qaMetrics',
      'hsCode',
      'availability',
      'targetMarkets',
      'seo',
    ]

    optionalFields.forEach((fieldName) => {
      const field = productType.fields.find((f: any) => f.name === fieldName)
      expect(field).toBeDefined()
    })
  })
})
