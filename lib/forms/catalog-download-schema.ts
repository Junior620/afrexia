import { z } from 'zod';

/**
 * Catalog Download Lead Capture Schema
 * Validates lead information before allowing catalog PDF download
 * Requirements: 7.3, 7.4, 7.5
 */

/**
 * Catalog Download Form Schema
 * Validates lead capture form for catalog downloads
 */
export const catalogDownloadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Name contains invalid characters'),

  email: z
    .string()
    .email('Please enter a valid email address')
    .max(100, 'Email must not exceed 100 characters')
    .toLowerCase(),

  company: z
    .string()
    .trim()
    .min(1, 'Company name is required')
    .max(100, 'Company name must not exceed 100 characters'),

  country: z
    .string()
    .trim()
    .min(1, 'Please select a country')
    .max(100, 'Country name is too long'),

  // Optional locale for tracking
  locale: z.enum(['fr', 'en', 'es', 'de', 'ru']).optional().default('en'),

  // reCAPTCHA token (added by client)
  recaptchaToken: z.string().optional(),
});

/**
 * Type inference from schema
 */
export type CatalogDownloadData = z.infer<typeof catalogDownloadSchema>;

/**
 * Error messages for common validation failures
 */
export const catalogDownloadErrorMessages = {
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must not exceed ${max} characters`,
  invalidFormat: 'Invalid format',
  selectCountry: 'Please select a country',
};
