import { describe, it, expect } from 'vitest'
import { Schema } from '@sanity/schema'
import certification from '../certification'

describe('Certification Schema Validation', () => {
  const schema = Schema.compile({
    name: 'test',
    types: [certification],
  })

  const certificationType = schema.get('certification')

  it('should require name field', () => {
    const nameField = certificationType.fields.find((f: any) => f.name === 'name')
    expect(nameField).toBeDefined()
    expect(nameField.type.validation).toBeDefined()
  })

  it('should require logo field', () => {
    const logoField = certificationType.fields.find((f: any) => f.name === 'logo')
    expect(logoField).toBeDefined()
    expect(logoField.type.validation).toBeDefined()
  })

  it('should have multilingual name field with fr and en', () => {
    const nameField = certificationType.fields.find((f: any) => f.name === 'name')
    const fields = nameField.type.fields
    expect(fields.find((f: any) => f.name === 'fr')).toBeDefined()
    expect(fields.find((f: any) => f.name === 'en')).toBeDefined()
  })

  it('should have description field with fr and en', () => {
    const descriptionField = certificationType.fields.find((f: any) => f.name === 'description')
    expect(descriptionField).toBeDefined()
    const fields = descriptionField.type.fields
    expect(fields.find((f: any) => f.name === 'fr')).toBeDefined()
    expect(fields.find((f: any) => f.name === 'en')).toBeDefined()
  })

  it('should have issuingBody field', () => {
    const issuingBodyField = certificationType.fields.find((f: any) => f.name === 'issuingBody')
    expect(issuingBodyField).toBeDefined()
  })

  it('should have validUntil date field', () => {
    const validUntilField = certificationType.fields.find((f: any) => f.name === 'validUntil')
    expect(validUntilField).toBeDefined()
    expect(validUntilField.type.name).toBe('date')
  })

  it('should have certificateDocument file field', () => {
    const certificateDocumentField = certificationType.fields.find(
      (f: any) => f.name === 'certificateDocument'
    )
    expect(certificateDocumentField).toBeDefined()
    expect(certificateDocumentField.type.name).toBe('file')
  })

  it('should have certificateUrl field', () => {
    const certificateUrlField = certificationType.fields.find(
      (f: any) => f.name === 'certificateUrl'
    )
    expect(certificateUrlField).toBeDefined()
    expect(certificateUrlField.type.name).toBe('url')
  })

  it('should have workflowStatus field', () => {
    const statusField = certificationType.fields.find((f: any) => f.name === 'workflowStatus')
    expect(statusField).toBeDefined()
    expect(statusField.type.validation).toBeDefined()
  })
})
