import { z } from 'zod';

/**
 * Catalog RFQ Form Validation Schema
 * Validates multi-product RFQ requests from the product catalog
 * Requirements: 4.7, 4.8, 4.10, 4.11
 */

/**
 * RFQ Product Schema
 * Validates individual product in the RFQ cart
 */
export const rfqProductSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  quantity: z
    .number()
    .positive('Quantity must be greater than 0')
    .max(1000000, 'Quantity exceeds maximum allowed'),
  unit: z.string().min(1, 'Unit is required'),
});

/**
 * Contact Info Schema
 * Validates contact information fields
 */
export const contactInfoSchema = z.object({
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

  phone: z
    .string()
    .trim()
    .min(8, 'Phone number is too short')
    .max(20, 'Phone number is too long')
    .regex(/^\+?[0-9\s()-]+$/, 'Please enter a valid phone number'),
});

/**
 * Delivery Info Schema
 * Validates delivery details
 */
export const deliveryInfoSchema = z.object({
  location: z
    .string()
    .trim()
    .min(1, 'Delivery location is required')
    .max(200, 'Delivery location must not exceed 200 characters'),

  incoterm: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || ['FOB', 'CIF', 'CFR', 'EXW', 'FCA', 'DAP', 'DDP'].includes(val),
      'Please select a valid Incoterm'
    ),
});

/**
 * Catalog RFQ Form Schema
 * Complete validation for multi-product RFQ submissions
 */
export const catalogRFQFormSchema = z.object({
  products: z
    .array(rfqProductSchema)
    .min(1, 'At least one product is required')
    .max(20, 'Maximum 20 products allowed per RFQ'),

  contact: contactInfoSchema,

  delivery: deliveryInfoSchema,

  notes: z
    .string()
    .max(2000, 'Notes must not exceed 2000 characters')
    .optional()
    .default(''),

  // Optional locale for email templates
  locale: z.enum(['fr', 'en', 'es', 'de', 'ru']).optional().default('en'),

  // reCAPTCHA token (added by client)
  recaptchaToken: z.string().optional(),
});

/**
 * Type inference from schema
 */
export type CatalogRFQFormData = z.infer<typeof catalogRFQFormSchema>;

/**
 * Error messages for common validation failures
 */
export const catalogRFQErrorMessages = {
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  invalidPhone: 'Please enter a valid phone number',
  minProducts: 'At least one product is required',
  maxProducts: 'Maximum 20 products allowed per RFQ',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must not exceed ${max} characters`,
  positiveNumber: 'Must be a positive number',
  invalidFormat: 'Invalid format',
};
