import { z } from 'zod';

/**
 * RFQ Form Validation Schema
 * Validates all fields for the Request for Quote form
 */

// Quantity unit options
export const quantityUnits = ['kg', 'mt', 'container'] as const;

// Incoterms options
export const incoterms = ['FOB', 'CIF', 'CFR', 'EXW', 'FCA'] as const;

/**
 * RFQ Form Schema
 * Requirements: 3.1, 3.3, 3.4
 */
export const rfqFormSchema = z.object({
  // Contact Information
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'First name contains invalid characters'),

  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Last name contains invalid characters'),

  email: z
    .string()
    .email('Please enter a valid email address')
    .max(100, 'Email must not exceed 100 characters')
    .toLowerCase(),

  phone: z
    .string()
    .min(8, 'Phone number is too short')
    .max(20, 'Phone number is too long')
    .refine((val) => /^\+?[0-9]+$/.test(val), 'Please enter a valid international phone number (e.g., +1234567890)'),

  company: z
    .string()
    .min(1, 'Company name is required')
    .max(100, 'Company name must not exceed 100 characters')
    .transform((val) => val.trim())
    .refine((val) => val.length >= 1, 'Company name is required'),

  country: z
    .string()
    .min(1, 'Please select a country')
    .max(100, 'Country name is too long')
    .transform((val) => val.trim())
    .refine((val) => val.length >= 1, 'Please select a country'),

  // Order Details
  productId: z
    .string()
    .min(1, 'Please select a product')
    .transform((val) => val.trim())
    .refine((val) => val.length >= 1, 'Please select a product'),

  quantity: z
    .union([
      z.number().positive('Quantity must be greater than 0').max(1000000, 'Quantity exceeds maximum allowed'),
      z.string()
        .min(1, 'Quantity is required')
        .regex(/^\d+(\.\d+)?$/, 'Quantity must be a valid number')
        .transform((val) => parseFloat(val))
        .refine((val) => !isNaN(val) && val > 0, 'Quantity must be greater than 0')
        .refine((val) => val <= 1000000, 'Quantity exceeds maximum allowed'),
    ])
    .refine((val) => typeof val === 'number' && !isNaN(val), 'Quantity is required'),

  quantityUnit: z.enum(quantityUnits, {
    errorMap: () => ({ message: 'Please select a valid quantity unit' }),
  }),

  incoterm: z.enum(incoterms, {
    errorMap: () => ({ message: 'Please select a valid Incoterm' }),
  }),

  destinationPort: z
    .string()
    .min(1, 'Destination port is required')
    .max(100, 'Destination port must not exceed 100 characters')
    .transform((val) => val.trim())
    .refine((val) => val.length >= 1, 'Destination port is required'),

  targetDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date (YYYY-MM-DD)')
    .refine(
      (date) => {
        const targetDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return targetDate >= today;
      },
      { message: 'Target date must be today or in the future' }
    ),

  // Additional Information
  message: z
    .string()
    .max(2000, 'Message must not exceed 2000 characters')
    .optional(),

  // Consent
  gdprConsent: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must accept the privacy policy to submit this form',
    }),

  // reCAPTCHA token (added by client)
  recaptchaToken: z.string().optional(),
});

/**
 * Type inference from schema
 */
export type RFQFormData = z.infer<typeof rfqFormSchema>;

/**
 * Partial schema for draft saving (excludes sensitive fields)
 * Requirements: 3.6, 3.8
 */
export const rfqDraftSchema = rfqFormSchema.partial().omit({
  message: true,
  gdprConsent: true,
  recaptchaToken: true,
});

export type RFQDraftData = z.infer<typeof rfqDraftSchema>;

/**
 * Error messages for common validation failures
 */
export const rfqErrorMessages = {
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  invalidPhone: 'Please enter a valid phone number',
  invalidDate: 'Please enter a valid date',
  futureDate: 'Date must be in the future',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must not exceed ${max} characters`,
  positiveNumber: 'Must be a positive number',
  invalidFormat: 'Invalid format',
  consentRequired: 'You must accept the privacy policy',
};
