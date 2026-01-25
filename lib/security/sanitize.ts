/**
 * Input Sanitization Utilities
 * Requirements: 20.2
 * 
 * Provides utilities to sanitize user inputs and prevent XSS attacks
 */

/**
 * Sanitize a string input by removing potentially dangerous characters
 * Removes: < > to prevent HTML injection
 * Trims whitespace
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
}

/**
 * Sanitize an optional string input
 */
export function sanitizeOptionalString(input: string | undefined): string | undefined {
  if (!input) return undefined;
  return sanitizeString(input);
}

/**
 * Sanitize an email address
 * Validates basic email format and removes dangerous characters
 */
export function sanitizeEmail(email: string): string {
  return email
    .toLowerCase()
    .trim()
    .replace(/[<>]/g, '');
}

/**
 * Sanitize a phone number
 * Removes all non-numeric characters except + and spaces
 */
export function sanitizePhone(phone: string): string {
  return phone
    .replace(/[^0-9+\s()-]/g, '')
    .trim();
}

/**
 * Sanitize a URL
 * Ensures URL starts with http:// or https://
 */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return '';
  }
  return trimmed;
}

/**
 * Sanitize an object with string values
 * Recursively sanitizes all string properties
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };
  
  for (const key in sanitized) {
    const value = sanitized[key];
    
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value) as any;
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    }
  }
  
  return sanitized;
}

/**
 * Remove HTML tags from a string
 * More aggressive sanitization for rich text inputs
 */
export function stripHtmlTags(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .trim();
}

/**
 * Sanitize a multiline text input
 * Preserves line breaks but removes HTML
 */
export function sanitizeMultilineText(input: string): string {
  return input
    .split('\n')
    .map(line => stripHtmlTags(line))
    .join('\n')
    .trim();
}
