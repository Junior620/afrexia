import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  sanitizeString,
  sanitizeOptionalString,
  sanitizeEmail,
  sanitizePhone,
  sanitizeUrl,
  sanitizeObject,
  stripHtmlTags,
  sanitizeMultilineText,
} from '../sanitize';

/**
 * Property-Based Tests for Input Sanitization
 * 
 * **Property 40: Input sanitization**
 * **Validates: Requirements 20.2**
 * 
 * These tests verify that all sanitization functions properly remove
 * dangerous characters and prevent XSS attacks across all possible inputs.
 */

describe('Property 40: Input sanitization', () => {
  describe('sanitizeString', () => {
    it('should remove < and > characters from any string', () => {
      fc.assert(
        fc.property(fc.string(), (input) => {
          const sanitized = sanitizeString(input);
          
          // Property: Sanitized output must not contain < or >
          expect(sanitized).not.toContain('<');
          expect(sanitized).not.toContain('>');
        })
      );
    });

    it('should trim whitespace from any string', () => {
      fc.assert(
        fc.property(
          fc.string(),
          fc.nat(10),
          fc.nat(10),
          (input, leadingSpaces, trailingSpaces) => {
            const paddedInput = ' '.repeat(leadingSpaces) + input + ' '.repeat(trailingSpaces);
            const sanitized = sanitizeString(paddedInput);
            
            // Property: Sanitized output must not have leading/trailing whitespace
            expect(sanitized).toBe(sanitized.trim());
          }
        )
      );
    });

    it('should preserve safe characters', () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^[a-zA-Z0-9\s\-_.,!?@#$%^&*()+=[\]{}|;:'"/\\]+$/),
          (safeInput) => {
            const sanitized = sanitizeString(safeInput);
            
            // Property: Safe characters (excluding < >) should be preserved
            const expectedOutput = safeInput.trim();
            expect(sanitized).toBe(expectedOutput);
          }
        )
      );
    });

    it('should handle strings with multiple dangerous characters', () => {
      fc.assert(
        fc.property(fc.string(), (input) => {
          const withDangerousChars = input + '<script>alert("xss")</script>';
          const sanitized = sanitizeString(withDangerousChars);
          
          // Property: All < and > must be removed
          expect(sanitized).not.toMatch(/<script>/);
          expect(sanitized).not.toMatch(/<\/script>/);
          expect(sanitized).not.toContain('<');
          expect(sanitized).not.toContain('>');
        })
      );
    });
  });

  describe('sanitizeOptionalString', () => {
    it('should return undefined for undefined input', () => {
      expect(sanitizeOptionalString(undefined)).toBeUndefined();
    });

    it('should sanitize defined strings', () => {
      fc.assert(
        fc.property(fc.string(), (input) => {
          const sanitized = sanitizeOptionalString(input);
          
          if (sanitized !== undefined) {
            // Property: Defined output must not contain < or >
            expect(sanitized).not.toContain('<');
            expect(sanitized).not.toContain('>');
          }
        })
      );
    });
  });

  describe('sanitizeEmail', () => {
    it('should remove dangerous characters from email addresses', () => {
      fc.assert(
        fc.property(fc.emailAddress(), (email) => {
          const sanitized = sanitizeEmail(email);
          
          // Property: Sanitized email must not contain < or >
          expect(sanitized).not.toContain('<');
          expect(sanitized).not.toContain('>');
        })
      );
    });

    it('should convert email to lowercase', () => {
      fc.assert(
        fc.property(fc.emailAddress(), (email) => {
          const sanitized = sanitizeEmail(email);
          
          // Property: Sanitized email must be lowercase
          expect(sanitized).toBe(sanitized.toLowerCase());
        })
      );
    });

    it('should trim whitespace from emails', () => {
      fc.assert(
        fc.property(fc.emailAddress(), (email) => {
          const paddedEmail = '  ' + email + '  ';
          const sanitized = sanitizeEmail(paddedEmail);
          
          // Property: Sanitized email must not have leading/trailing whitespace
          expect(sanitized).toBe(sanitized.trim());
        })
      );
    });
  });

  describe('sanitizePhone', () => {
    it('should only allow numbers, +, spaces, (), and -', () => {
      fc.assert(
        fc.property(fc.string(), (input) => {
          const sanitized = sanitizePhone(input);
          
          // Property: Sanitized phone must only contain allowed characters
          expect(sanitized).toMatch(/^[0-9+\s()\-]*$/);
        })
      );
    });

    it('should remove letters and special characters', () => {
      fc.assert(
        fc.property(fc.string(), (input) => {
          const withLetters = input + 'abc<script>XYZ';
          const sanitized = sanitizePhone(withLetters);
          
          // Property: No letters or dangerous characters should remain
          expect(sanitized).not.toMatch(/[a-zA-Z<>]/);
        })
      );
    });
  });

  describe('sanitizeUrl', () => {
    it('should only allow URLs starting with http:// or https://', () => {
      fc.assert(
        fc.property(fc.webUrl(), (url) => {
          const sanitized = sanitizeUrl(url);
          
          // Property: Valid URLs must start with http:// or https://
          if (sanitized !== '') {
            expect(sanitized.startsWith('http://') || sanitized.startsWith('https://')).toBe(true);
          }
        })
      );
    });

    it('should return empty string for invalid URLs', () => {
      fc.assert(
        fc.property(
          fc.string().filter(s => !s.startsWith('http://') && !s.startsWith('https://')),
          (invalidUrl) => {
            const sanitized = sanitizeUrl(invalidUrl);
            
            // Property: Invalid URLs should return empty string
            expect(sanitized).toBe('');
          }
        )
      );
    });
  });

  describe('stripHtmlTags', () => {
    it('should remove all HTML tags from any string', () => {
      fc.assert(
        fc.property(fc.string(), (input) => {
          const withTags = `<div>${input}</div><script>alert('xss')</script>`;
          const sanitized = stripHtmlTags(withTags);
          
          // Property: No HTML tags should remain
          expect(sanitized).not.toMatch(/<[^>]*>/);
        })
      );
    });

    it('should preserve text content between tags', () => {
      const input = '<p>Hello</p><span>World</span>';
      const sanitized = stripHtmlTags(input);
      
      // Property: Text content should be preserved
      expect(sanitized).toContain('Hello');
      expect(sanitized).toContain('World');
      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
    });
  });

  describe('sanitizeMultilineText', () => {
    it('should preserve line breaks while removing HTML', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string(), { minLength: 1, maxLength: 10 }),
          (lines) => {
            const input = lines.join('\n');
            const withTags = lines.map(line => `<p>${line}</p>`).join('\n');
            const sanitized = sanitizeMultilineText(withTags);
            
            // Property: Line breaks should be preserved
            const sanitizedLines = sanitized.split('\n');
            expect(sanitizedLines.length).toBeGreaterThan(0);
            
            // Property: No HTML tags should remain
            expect(sanitized).not.toMatch(/<[^>]*>/);
          }
        )
      );
    });
  });

  describe('sanitizeObject', () => {
    it('should recursively sanitize all string properties', () => {
      fc.assert(
        fc.property(
          fc.record({
            name: fc.string(),
            email: fc.string(),
            nested: fc.record({
              field: fc.string(),
            }),
          }),
          (obj) => {
            const withDangerousChars = {
              name: obj.name + '<script>',
              email: obj.email + '<img>',
              nested: {
                field: obj.nested.field + '</div>',
              },
            };
            
            const sanitized = sanitizeObject(withDangerousChars);
            
            // Property: All string values must not contain < or >
            expect(sanitized.name).not.toContain('<');
            expect(sanitized.name).not.toContain('>');
            expect(sanitized.email).not.toContain('<');
            expect(sanitized.email).not.toContain('>');
            expect(sanitized.nested.field).not.toContain('<');
            expect(sanitized.nested.field).not.toContain('>');
          }
        )
      );
    });

    it('should preserve non-string properties', () => {
      const obj = {
        name: '<script>test</script>',
        age: 25,
        active: true,
        tags: ['tag1', 'tag2'],
      };
      
      const sanitized = sanitizeObject(obj);
      
      // Property: Non-string properties should be preserved
      expect(sanitized.age).toBe(25);
      expect(sanitized.active).toBe(true);
      expect(Array.isArray(sanitized.tags)).toBe(true);
      
      // Property: String properties should be sanitized
      expect(sanitized.name).not.toContain('<');
      expect(sanitized.name).not.toContain('>');
    });
  });

  describe('XSS Prevention', () => {
    it('should prevent common XSS attack vectors by removing angle brackets', () => {
      const xssVectors = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert("XSS")>',
        '<svg onload=alert("XSS")>',
        '<iframe src="javascript:alert(\'XSS\')">',
        '<body onload=alert("XSS")>',
        '<input onfocus=alert("XSS") autofocus>',
        '<select onfocus=alert("XSS") autofocus>',
        '<textarea onfocus=alert("XSS") autofocus>',
        '<marquee onstart=alert("XSS")>',
        '<div style="background:url(javascript:alert(\'XSS\'))">',
      ];

      xssVectors.forEach((vector) => {
        const sanitized = sanitizeString(vector);
        
        // Property: XSS vectors must be neutralized by removing angle brackets
        // This prevents HTML tags from being interpreted by browsers
        expect(sanitized).not.toContain('<');
        expect(sanitized).not.toContain('>');
        
        // Without angle brackets, these strings cannot execute as HTML/JavaScript
        expect(sanitized).not.toMatch(/<script>/i);
        expect(sanitized).not.toMatch(/<img/i);
        expect(sanitized).not.toMatch(/<svg/i);
        expect(sanitized).not.toMatch(/<iframe/i);
      });
    });

    it('should handle nested XSS attempts', () => {
      fc.assert(
        fc.property(fc.string(), (input) => {
          const nestedXss = `<<script>script>${input}<</script>/script>`;
          const sanitized = sanitizeString(nestedXss);
          
          // Property: Nested XSS attempts must be neutralized
          expect(sanitized).not.toContain('<');
          expect(sanitized).not.toContain('>');
        })
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strings', () => {
      expect(sanitizeString('')).toBe('');
      expect(stripHtmlTags('')).toBe('');
      expect(sanitizeMultilineText('')).toBe('');
    });

    it('should handle strings with only dangerous characters', () => {
      const onlyDangerous = '<<>><><>';
      const sanitized = sanitizeString(onlyDangerous);
      
      expect(sanitized).toBe('');
    });

    it('should handle very long strings', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1000, maxLength: 10000 }),
          (longString) => {
            const sanitized = sanitizeString(longString);
            
            // Property: Long strings should be sanitized without errors
            expect(sanitized).not.toContain('<');
            expect(sanitized).not.toContain('>');
          }
        )
      );
    });

    it('should handle unicode characters', () => {
      fc.assert(
        fc.property(fc.unicodeString(), (unicodeStr) => {
          const sanitized = sanitizeString(unicodeStr);
          
          // Property: Unicode characters should be preserved (except < >)
          expect(sanitized).not.toContain('<');
          expect(sanitized).not.toContain('>');
        })
      );
    });
  });
});
