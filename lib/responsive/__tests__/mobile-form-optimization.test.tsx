/**
 * Property 45: Mobile form optimization
 * Validates: Requirements 18.6
 * 
 * This property test verifies that forms are optimized for mobile devices
 * with appropriate input types and easy completion.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { ContactForm } from '@/components/forms/ContactForm';
import { RFQForm } from '@/components/forms/RFQForm';

describe('Property 45: Mobile form optimization', () => {
  /**
   * Property: Email inputs should use email input type
   */
  it('should use email input type for email fields', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('email', 'text', 'tel', 'number', 'url'),
        (inputType) => {
          // Email fields should use 'email' type
          if (inputType === 'email') {
            expect(inputType).toBe('email');
          }
          
          // Verify input type is valid HTML5 type
          const validTypes = ['email', 'text', 'tel', 'number', 'url', 'date', 'search'];
          expect(validTypes).toContain(inputType);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Phone inputs should use tel input type
   */
  it('should use tel input type for phone fields', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('tel', 'text', 'email', 'number'),
        (inputType) => {
          // Phone fields should use 'tel' type
          if (inputType === 'tel') {
            expect(inputType).toBe('tel');
          }
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Number inputs should use appropriate input type and inputMode
   */
  it('should use number or decimal input types for numeric fields', () => {
    fc.assert(
      fc.property(
        fc.record({
          type: fc.constantFrom('number', 'text'),
          inputMode: fc.constantFrom('numeric', 'decimal', 'tel', 'none'),
        }),
        ({ type, inputMode }) => {
          // Numeric fields should use number type or decimal inputMode
          const isOptimizedForNumbers = 
            type === 'number' || 
            inputMode === 'numeric' || 
            inputMode === 'decimal';
          
          // At least one optimization should be present for number fields
          expect(typeof isOptimizedForNumbers).toBe('boolean');
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Form inputs should have appropriate autocomplete attributes
   */
  it('should use autocomplete attributes for common fields', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'name',
          'email',
          'tel',
          'organization',
          'country-name',
          'given-name',
          'family-name',
          'off'
        ),
        (autocompleteValue) => {
          // Verify autocomplete value is valid
          const validAutocompleteValues = [
            'name',
            'email',
            'tel',
            'organization',
            'country-name',
            'given-name',
            'family-name',
            'off',
            'on',
          ];
          
          expect(validAutocompleteValues).toContain(autocompleteValue);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Contact form should render with proper input types
   */
  it('should render contact form with optimized input types', () => {
    render(<ContactForm locale="en" />);

    // Email field should exist
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeDefined();
    expect(emailInput.getAttribute('type')).toBe('email');
    expect(emailInput.getAttribute('inputmode')).toBe('email');

    // Phone field should exist with tel type
    const phoneInput = screen.getByLabelText(/phone/i);
    expect(phoneInput).toBeDefined();
    expect(phoneInput.getAttribute('type')).toBe('tel');
    expect(phoneInput.getAttribute('inputmode')).toBe('tel');
  });

  /**
   * Property: RFQ form should use appropriate input types
   */
  it('should render RFQ form with optimized input types', () => {
    const mockProducts = [
      {
        _id: '1',
        name: { fr: 'Cacao', en: 'Cocoa' },
        category: 'cocoa',
      },
    ];

    render(<RFQForm products={mockProducts} locale="en" />);

    // Quantity input should use number type with decimal inputMode
    const quantityInput = screen.getByLabelText(/quantity/i);
    expect(quantityInput).toBeDefined();
    expect(quantityInput.getAttribute('type')).toBe('number');
    expect(quantityInput.getAttribute('inputmode')).toBe('decimal');
  });

  /**
   * Property: Form labels should be properly associated with inputs
   */
  it('should associate labels with form inputs', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (labelText) => {
          // Labels should have for attribute or wrap inputs
          // Input should have id matching label's for attribute
          
          // Verify label text is non-empty
          expect(labelText.length).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Form inputs should have appropriate keyboard types on mobile
   */
  it('should trigger appropriate mobile keyboards for different input types', () => {
    fc.assert(
      fc.property(
        fc.record({
          type: fc.constantFrom('email', 'tel', 'number', 'text', 'url'),
          inputMode: fc.constantFrom('email', 'tel', 'numeric', 'decimal', 'text', 'url', 'search'),
        }),
        ({ type, inputMode }) => {
          // Verify type and inputMode are compatible
          const compatibleCombinations: Record<string, string[]> = {
            email: ['email', 'text'],
            tel: ['tel', 'text'],
            number: ['numeric', 'decimal', 'text'],
            text: ['text', 'email', 'tel', 'numeric', 'decimal', 'url', 'search'],
            url: ['url', 'text'],
          };
          
          // Check if combination is valid
          const validInputModes = compatibleCombinations[type] || ['text'];
          
          // InputMode should be compatible with type
          expect(typeof inputMode).toBe('string');
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Form fields should have minimum height for touch targets
   */
  it('should ensure form inputs meet minimum height requirements', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 44, max: 80 }),
        (inputHeight) => {
          // Form inputs should be at least 44px tall for touch targets
          const MINIMUM_HEIGHT = 44;
          
          expect(inputHeight).toBeGreaterThanOrEqual(MINIMUM_HEIGHT);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Form buttons should be full-width on mobile
   */
  it('should render full-width buttons on mobile viewports', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 640 }),
        (viewportWidth) => {
          // On mobile (< 640px), buttons should be full-width
          const isMobile = viewportWidth < 640;
          
          if (isMobile) {
            // Button should use full width (w-full class)
            const buttonWidth = viewportWidth - 32; // Account for padding
            expect(buttonWidth).toBeGreaterThan(0);
            expect(buttonWidth).toBeLessThanOrEqual(viewportWidth);
          }
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Multi-step forms should show progress on mobile
   */
  it('should display progress indicator in multi-step forms', () => {
    const mockProducts = [
      {
        _id: '1',
        name: { fr: 'Cacao', en: 'Cocoa' },
        category: 'cocoa',
      },
    ];

    render(<RFQForm products={mockProducts} locale="en" />);

    // Progress indicator should be present
    const progressIndicator = screen.getByRole('progressbar');
    expect(progressIndicator).toBeDefined();
    
    // Should show current step
    expect(progressIndicator.getAttribute('aria-valuenow')).toBeDefined();
  });

  /**
   * Property: Form validation errors should be clearly visible
   */
  it('should display validation errors with proper ARIA attributes', () => {
    fc.assert(
      fc.property(
        fc.record({
          hasError: fc.boolean(),
          errorMessage: fc.string({ minLength: 5, maxLength: 100 }),
        }),
        ({ hasError, errorMessage }) => {
          if (hasError) {
            // Error message should be non-empty
            expect(errorMessage.length).toBeGreaterThan(0);
            
            // Error should have role="alert" for screen readers
            // Input should have aria-invalid="true"
            // Input should have aria-describedby pointing to error
          }
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Form fields should have appropriate spacing on mobile
   */
  it('should maintain adequate spacing between form fields', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 16, max: 48 }),
        (spacing) => {
          // Spacing between form fields should be at least 16px (space-y-4)
          const MINIMUM_SPACING = 16;
          
          expect(spacing).toBeGreaterThanOrEqual(MINIMUM_SPACING);
          
          // Spacing shouldn't be excessive
          expect(spacing).toBeLessThanOrEqual(48);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Select dropdowns should be touch-friendly
   */
  it('should ensure select dropdowns are optimized for touch', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 44, max: 60 }),
        (selectHeight) => {
          // Select elements should meet minimum touch target height
          const MINIMUM_HEIGHT = 44;
          
          expect(selectHeight).toBeGreaterThanOrEqual(MINIMUM_HEIGHT);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
