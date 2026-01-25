import { z } from 'zod';

/**
 * Contact Form Validation Schema
 * Validates all fields for the Contact form
 * Requirements: 14.1, 14.2, 14.4, 14.5
 */

// Phone number validation (international format)
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

/**
 * Contact Form Schema
 */
export const contactFormSchema = z.object({
  // Contact Information
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

  phone: z
    .string()
    .regex(phoneRegex, 'Please enter a valid international phone number (e.g., +1234567890)')
    .min(8, 'Phone number is too short')
    .max(20, 'Phone number is too long')
    .optional()
    .or(z.literal('')),

  company: z
    .string()
    .trim()
    .max(100, 'Company name must not exceed 100 characters')
    .optional()
    .or(z.literal('')),

  subject: z
    .string()
    .trim()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject must not exceed 200 characters'),

  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must not exceed 2000 characters'),

  // reCAPTCHA token (added by client)
  recaptchaToken: z.string().optional(),
});

/**
 * Type inference from schema
 */
export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Error messages for common validation failures
 */
export const contactErrorMessages = {
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  invalidPhone: 'Please enter a valid phone number',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must not exceed ${max} characters`,
  invalidFormat: 'Invalid format',
};
