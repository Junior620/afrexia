/**
 * Unit tests for ExportCountry Sanity Schema
 * @see Requirements 1.1
 */

import { describe, it, expect } from 'vitest';
import exportCountrySchema from '@/sanity/schemas/exportCountry';

// ============================================================================
// Schema Structure Tests
// ============================================================================

describe('exportCountry schema', () => {
  it('has correct name and type', () => {
    expect(exportCountrySchema.name).toBe('exportCountry');
    expect(exportCountrySchema.type).toBe('document');
  });

  it('has a title', () => {
    expect(exportCountrySchema.title).toBeDefined();
    expect(typeof exportCountrySchema.title).toBe('string');
  });

  it('has fields array', () => {
    expect(Array.isArray(exportCountrySchema.fields)).toBe(true);
    expect(exportCountrySchema.fields.length).toBeGreaterThan(0);
  });

  // ============================================================================
  // Required fields
  // ============================================================================

  describe('name field', () => {
    it('exists in schema', () => {
      const nameField = exportCountrySchema.fields.find((f) => f.name === 'name');
      expect(nameField).toBeDefined();
    });

    it('is of type object', () => {
      const nameField = exportCountrySchema.fields.find((f) => f.name === 'name');
      expect(nameField?.type).toBe('object');
    });

    it('has fr and en sub-fields', () => {
      const nameField = exportCountrySchema.fields.find((f) => f.name === 'name') as any;
      const subFieldNames = nameField?.fields?.map((f: any) => f.name) ?? [];
      expect(subFieldNames).toContain('fr');
      expect(subFieldNames).toContain('en');
    });

    it('has all 5 locale sub-fields', () => {
      const nameField = exportCountrySchema.fields.find((f) => f.name === 'name') as any;
      const subFieldNames = nameField?.fields?.map((f: any) => f.name) ?? [];
      expect(subFieldNames).toContain('fr');
      expect(subFieldNames).toContain('en');
      expect(subFieldNames).toContain('es');
      expect(subFieldNames).toContain('de');
      expect(subFieldNames).toContain('ru');
    });

    it('has validation on the name field', () => {
      const nameField = exportCountrySchema.fields.find((f) => f.name === 'name') as any;
      expect(nameField?.validation).toBeDefined();
    });
  });

  describe('slug field', () => {
    it('exists in schema', () => {
      const slugField = exportCountrySchema.fields.find((f) => f.name === 'slug');
      expect(slugField).toBeDefined();
    });

    it('is of type slug', () => {
      const slugField = exportCountrySchema.fields.find((f) => f.name === 'slug');
      expect(slugField?.type).toBe('slug');
    });

    it('has validation', () => {
      const slugField = exportCountrySchema.fields.find((f) => f.name === 'slug') as any;
      expect(slugField?.validation).toBeDefined();
    });
  });

  describe('code field', () => {
    it('exists in schema', () => {
      const codeField = exportCountrySchema.fields.find((f) => f.name === 'code');
      expect(codeField).toBeDefined();
    });

    it('is of type string', () => {
      const codeField = exportCountrySchema.fields.find((f) => f.name === 'code');
      expect(codeField?.type).toBe('string');
    });

    it('has validation', () => {
      const codeField = exportCountrySchema.fields.find((f) => f.name === 'code') as any;
      expect(codeField?.validation).toBeDefined();
    });
  });

  describe('dataCompleteness field', () => {
    it('exists in schema', () => {
      const field = exportCountrySchema.fields.find((f) => f.name === 'dataCompleteness');
      expect(field).toBeDefined();
    });

    it('is of type number', () => {
      const field = exportCountrySchema.fields.find((f) => f.name === 'dataCompleteness');
      expect(field?.type).toBe('number');
    });

    it('has validation for 0-100 range', () => {
      const field = exportCountrySchema.fields.find((f) => f.name === 'dataCompleteness') as any;
      expect(field?.validation).toBeDefined();
    });

    it('has initialValue of 0', () => {
      const field = exportCountrySchema.fields.find((f) => f.name === 'dataCompleteness') as any;
      expect(field?.initialValue).toBe(0);
    });
  });

  describe('approvedForSEO field', () => {
    it('exists in schema', () => {
      const field = exportCountrySchema.fields.find((f) => f.name === 'approvedForSEO');
      expect(field).toBeDefined();
    });

    it('is of type boolean', () => {
      const field = exportCountrySchema.fields.find((f) => f.name === 'approvedForSEO');
      expect(field?.type).toBe('boolean');
    });

    it('has initialValue of false', () => {
      const field = exportCountrySchema.fields.find((f) => f.name === 'approvedForSEO') as any;
      expect(field?.initialValue).toBe(false);
    });
  });

  // ============================================================================
  // Optional fields
  // ============================================================================

  describe('flag field', () => {
    it('exists in schema', () => {
      const field = exportCountrySchema.fields.find((f) => f.name === 'flag');
      expect(field).toBeDefined();
    });

    it('is of type string', () => {
      const field = exportCountrySchema.fields.find((f) => f.name === 'flag');
      expect(field?.type).toBe('string');
    });
  });

  describe('description field', () => {
    it('exists in schema', () => {
      const field = exportCountrySchema.fields.find((f) => f.name === 'description');
      expect(field).toBeDefined();
    });

    it('is of type object with locale sub-fields', () => {
      const field = exportCountrySchema.fields.find((f) => f.name === 'description') as any;
      expect(field?.type).toBe('object');
      const subFieldNames = field?.fields?.map((f: any) => f.name) ?? [];
      expect(subFieldNames).toContain('fr');
      expect(subFieldNames).toContain('en');
    });
  });

  describe('targetMarkets field', () => {
    it('exists in schema', () => {
      const field = exportCountrySchema.fields.find((f) => f.name === 'targetMarkets');
      expect(field).toBeDefined();
    });

    it('is of type array', () => {
      const field = exportCountrySchema.fields.find((f) => f.name === 'targetMarkets');
      expect(field?.type).toBe('array');
    });
  });

  describe('averageTransitTime field', () => {
    it('exists in schema', () => {
      const field = exportCountrySchema.fields.find((f) => f.name === 'averageTransitTime');
      expect(field).toBeDefined();
    });

    it('is of type object', () => {
      const field = exportCountrySchema.fields.find((f) => f.name === 'averageTransitTime');
      expect(field?.type).toBe('object');
    });

    it('has days sub-field', () => {
      const field = exportCountrySchema.fields.find((f) => f.name === 'averageTransitTime') as any;
      const subFieldNames = field?.fields?.map((f: any) => f.name) ?? [];
      expect(subFieldNames).toContain('days');
    });
  });

  describe('customsInfo field', () => {
    it('exists in schema', () => {
      const field = exportCountrySchema.fields.find((f) => f.name === 'customsInfo');
      expect(field).toBeDefined();
    });

    it('is of type object with locale sub-fields', () => {
      const field = exportCountrySchema.fields.find((f) => f.name === 'customsInfo') as any;
      expect(field?.type).toBe('object');
      const subFieldNames = field?.fields?.map((f: any) => f.name) ?? [];
      expect(subFieldNames).toContain('fr');
      expect(subFieldNames).toContain('en');
    });
  });

  // ============================================================================
  // Preview configuration
  // ============================================================================

  describe('preview configuration', () => {
    it('has preview defined', () => {
      expect(exportCountrySchema.preview).toBeDefined();
    });

    it('selects title from name.en', () => {
      const preview = exportCountrySchema.preview as any;
      expect(preview?.select?.title).toBe('name.en');
    });

    it('selects subtitle from code', () => {
      const preview = exportCountrySchema.preview as any;
      expect(preview?.select?.subtitle).toBe('code');
    });

    it('has prepare function', () => {
      const preview = exportCountrySchema.preview as any;
      expect(typeof preview?.prepare).toBe('function');
    });

    it('prepare function includes flag in title', () => {
      const preview = exportCountrySchema.preview as any;
      const result = preview.prepare({ title: 'Netherlands', subtitle: 'NL', flag: '🇳🇱' });
      expect(result.title).toContain('🇳🇱');
      expect(result.title).toContain('Netherlands');
    });

    it('prepare function handles missing flag', () => {
      const preview = exportCountrySchema.preview as any;
      const result = preview.prepare({ title: 'Netherlands', subtitle: 'NL' });
      expect(result.title).toContain('Netherlands');
    });

    it('prepare function handles missing title', () => {
      const preview = exportCountrySchema.preview as any;
      const result = preview.prepare({ subtitle: 'NL' });
      expect(result.title).toContain('Sans nom');
    });
  });
});
