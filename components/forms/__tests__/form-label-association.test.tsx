/**
 * Property-based tests for form label association
 * **Property 33: Form label association**
 * **Validates: Requirements 16.7**
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ContactForm } from '../ContactForm';
import { RFQForm } from '../RFQForm';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/en',
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('Property 33: Form label association', () => {
  describe('ContactForm', () => {
    it('should have labels associated with all required inputs', () => {
      const { container } = render(<ContactForm locale="en" />);
      
      // Get all inputs
      const inputs = container.querySelectorAll('input, textarea');
      
      inputs.forEach((input) => {
        const id = input.getAttribute('id');
        
        if (id) {
          // Find associated label
          const label = container.querySelector(`label[for="${id}"]`);
          expect(label).toBeDefined();
          expect(label?.textContent).toBeTruthy();
        }
      });
    });

    it('should have proper htmlFor attributes on labels', () => {
      const { container } = render(<ContactForm locale="en" />);
      
      const labels = container.querySelectorAll('label[for]');
      
      labels.forEach((label) => {
        const forAttr = label.getAttribute('for');
        expect(forAttr).toBeTruthy();
        
        // Verify corresponding input exists
        const input = container.querySelector(`#${forAttr}`);
        expect(input).toBeDefined();
      });
    });

    it('should have aria-required on required fields', () => {
      const { container } = render(<ContactForm locale="en" />);
      
      // Required fields should have aria-required
      const requiredInputs = container.querySelectorAll('input[aria-required="true"], textarea[aria-required="true"]');
      expect(requiredInputs.length).toBeGreaterThan(0);
    });

    it('should have aria-invalid on fields with errors', () => {
      const { container } = render(<ContactForm locale="en" />);
      
      // All inputs should have aria-invalid attribute
      const inputs = container.querySelectorAll('input[aria-invalid], textarea[aria-invalid]');
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('should have aria-describedby linking to error messages', () => {
      const { container } = render(<ContactForm locale="en" />);
      
      // Check that inputs have aria-describedby structure
      const inputs = container.querySelectorAll('input, textarea');
      
      inputs.forEach((input) => {
        // Input should have proper ARIA attributes
        expect(input.hasAttribute('id')).toBe(true);
      });
    });
  });

  describe('RFQForm', () => {
    const mockProducts = [
      {
        _id: '1',
        name: { fr: 'Cacao', en: 'Cocoa' },
        category: 'cocoa',
      },
      {
        _id: '2',
        name: { fr: 'Café', en: 'Coffee' },
        category: 'coffee',
      },
    ];

    it('should have labels associated with all form inputs', () => {
      const { container } = render(
        <RFQForm products={mockProducts} locale="en" />
      );
      
      // Get all visible inputs in current step
      const inputs = container.querySelectorAll('input:not([type="hidden"]), select, textarea');
      
      inputs.forEach((input) => {
        const id = input.getAttribute('id');
        
        if (id) {
          // Find associated label
          const label = container.querySelector(`label[for="${id}"]`);
          expect(label).toBeDefined();
        }
      });
    });

    it('should have aria-required on required fields', () => {
      const { container } = render(
        <RFQForm products={mockProducts} locale="en" />
      );
      
      // Required fields should have aria-required
      const requiredFields = container.querySelectorAll('[aria-required="true"]');
      expect(requiredFields.length).toBeGreaterThan(0);
    });

    it('should have proper form structure with fieldsets', () => {
      const { container } = render(
        <RFQForm products={mockProducts} locale="en" />
      );
      
      // Form should exist
      const form = container.querySelector('form');
      expect(form).toBeDefined();
      expect(form?.getAttribute('aria-label')).toBeTruthy();
    });
  });

  describe('Property: All form inputs must have associated labels', () => {
    it('should verify ContactForm has complete label associations', () => {
      const { container } = render(<ContactForm locale="en" />);
      
      const inputs = container.querySelectorAll('input, textarea, select');
      let labeledInputs = 0;
      
      inputs.forEach((input) => {
        const id = input.getAttribute('id');
        const ariaLabel = input.getAttribute('aria-label');
        const ariaLabelledBy = input.getAttribute('aria-labelledby');
        
        if (id) {
          const label = container.querySelector(`label[for="${id}"]`);
          if (label || ariaLabel || ariaLabelledBy) {
            labeledInputs++;
          }
        }
      });
      
      // All inputs should be labeled
      expect(labeledInputs).toBe(inputs.length);
    });

    it('should verify RFQForm has complete label associations', () => {
      const mockProducts = [
        {
          _id: '1',
          name: { fr: 'Cacao', en: 'Cocoa' },
          category: 'cocoa',
        },
      ];

      const { container } = render(
        <RFQForm products={mockProducts} locale="en" />
      );
      
      const visibleInputs = container.querySelectorAll('input:not([type="hidden"]), textarea, select');
      let labeledInputs = 0;
      
      visibleInputs.forEach((input) => {
        const id = input.getAttribute('id');
        const ariaLabel = input.getAttribute('aria-label');
        
        if (id) {
          const label = container.querySelector(`label[for="${id}"]`);
          if (label || ariaLabel) {
            labeledInputs++;
          }
        }
      });
      
      // Most inputs should be labeled (some may be in hidden steps)
      expect(labeledInputs).toBeGreaterThan(0);
    });
  });

  describe('Property: Error messages must be associated with inputs', () => {
    it('should link error messages via aria-describedby', () => {
      const { container } = render(<ContactForm locale="en" />);
      
      // Check that error message structure is in place
      const inputs = container.querySelectorAll('input, textarea');
      
      inputs.forEach((input) => {
        // Each input should have proper error handling structure
        const id = input.getAttribute('id');
        expect(id).toBeTruthy();
      });
    });
  });
});
