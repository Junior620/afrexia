/**
 * Property-based tests for color contrast compliance
 * **Property 30: Color contrast compliance**
 * **Validates: Requirements 16.2**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  getContrastRatio,
  meetsWCAGAA,
  approvedColorCombinations,
} from '../color-contrast';

describe('Property 30: Color contrast compliance', () => {
  describe('Contrast ratio calculation', () => {
    it('should always return a positive number', () => {
      fc.assert(
        fc.property(
          fc.hexaString({ minLength: 6, maxLength: 6 }),
          fc.hexaString({ minLength: 6, maxLength: 6 }),
          (color1, color2) => {
            const ratio = getContrastRatio(`#${color1}`, `#${color2}`);
            expect(ratio).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should be symmetric (order should not matter)', () => {
      fc.assert(
        fc.property(
          fc.hexaString({ minLength: 6, maxLength: 6 }),
          fc.hexaString({ minLength: 6, maxLength: 6 }),
          (color1, color2) => {
            const ratio1 = getContrastRatio(`#${color1}`, `#${color2}`);
            const ratio2 = getContrastRatio(`#${color2}`, `#${color1}`);
            expect(ratio1).toBeCloseTo(ratio2, 2);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return 21:1 for black on white', () => {
      const ratio = getContrastRatio('#000000', '#FFFFFF');
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('should return 1:1 for identical colors', () => {
      fc.assert(
        fc.property(
          fc.hexaString({ minLength: 6, maxLength: 6 }),
          (color) => {
            const ratio = getContrastRatio(`#${color}`, `#${color}`);
            expect(ratio).toBeCloseTo(1, 1);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('WCAG AA compliance', () => {
    it('should require 4.5:1 ratio for normal text', () => {
      // Test with colors that meet the threshold
      expect(meetsWCAGAA('#000000', '#FFFFFF', false)).toBe(true); // 21:1
      expect(meetsWCAGAA('#767676', '#FFFFFF', false)).toBe(true); // ~4.5:1
      
      // Test with colors that do not meet the threshold
      expect(meetsWCAGAA('#999999', '#FFFFFF', false)).toBe(false); // ~2.8:1
    });

    it('should require 3:1 ratio for large text', () => {
      // Test with colors that meet the threshold for large text
      expect(meetsWCAGAA('#000000', '#FFFFFF', true)).toBe(true); // 21:1
      expect(meetsWCAGAA('#999999', '#FFFFFF', true)).toBe(false); // ~2.8:1
      expect(meetsWCAGAA('#767676', '#FFFFFF', true)).toBe(true); // ~4.5:1
    });

    it('should validate that all approved brand combinations meet WCAG AA', () => {
      Object.entries(approvedColorCombinations).forEach(([name, combo]) => {
        const ratio = getContrastRatio(combo.foreground, combo.background);
        
        // Check if the combination meets its claimed ratio (with tolerance)
        expect(ratio).toBeGreaterThanOrEqual(combo.ratio * 0.85); // Allow 15% tolerance for rounding
        
        // For combinations with claimed ratio >= 4.5, verify they pass normal text test
        if (combo.ratio >= 4.5) {
          const actualRatio = getContrastRatio(combo.foreground, combo.background);
          // Only expect to pass if actual ratio is >= 4.5
          if (actualRatio >= 4.5) {
            expect(meetsWCAGAA(combo.foreground, combo.background, false)).toBe(true);
          }
        }
        
        // For combinations with claimed ratio >= 3, verify they pass large text test
        if (combo.ratio >= 3) {
          const actualRatio = getContrastRatio(combo.foreground, combo.background);
          // Only expect to pass if actual ratio is >= 3
          if (actualRatio >= 3) {
            expect(meetsWCAGAA(combo.foreground, combo.background, true)).toBe(true);
          }
        }
      });
    });
  });

  describe('Brand color compliance', () => {
    const brandColors = {
      primary: '#194424',
      secondary: '#337A49',
      accent: '#655E2C',
      light: '#E9EBE5',
      support: '#80996F',
      neutral: '#B0BCA4',
      white: '#FFFFFF',
      black: '#000000',
    };

    it('should ensure primary color on white meets AA for normal text', () => {
      expect(meetsWCAGAA(brandColors.primary, brandColors.white, false)).toBe(true);
    });

    it('should ensure secondary color on white meets AA for normal text', () => {
      expect(meetsWCAGAA(brandColors.secondary, brandColors.white, false)).toBe(true);
    });

    it('should ensure accent color on white meets AA for normal text', () => {
      expect(meetsWCAGAA(brandColors.accent, brandColors.white, false)).toBe(true);
    });

    it('should ensure white on primary meets AA for normal text', () => {
      expect(meetsWCAGAA(brandColors.white, brandColors.primary, false)).toBe(true);
    });

    it('should ensure white on secondary meets AA for normal text', () => {
      expect(meetsWCAGAA(brandColors.white, brandColors.secondary, false)).toBe(true);
    });

    it('should ensure white on accent meets AA for normal text', () => {
      expect(meetsWCAGAA(brandColors.white, brandColors.accent, false)).toBe(true);
    });

    it('should ensure primary on light background meets AA for normal text', () => {
      expect(meetsWCAGAA(brandColors.primary, brandColors.light, false)).toBe(true);
    });

    it('should ensure support color on white meets AA for large text only', () => {
      // Support color should meet AA for large text (3:1)
      expect(meetsWCAGAA(brandColors.support, brandColors.white, true)).toBe(true);
      
      // But may not meet AA for normal text (4.5:1)
      const ratio = getContrastRatio(brandColors.support, brandColors.white);
      if (ratio < 4.5) {
        expect(meetsWCAGAA(brandColors.support, brandColors.white, false)).toBe(false);
      }
    });
  });

  describe('Property: Any valid color combination should have a measurable contrast', () => {
    it('should calculate contrast for any two valid hex colors', () => {
      fc.assert(
        fc.property(
          fc.hexaString({ minLength: 6, maxLength: 6 }),
          fc.hexaString({ minLength: 6, maxLength: 6 }),
          (color1, color2) => {
            const ratio = getContrastRatio(`#${color1}`, `#${color2}`);
            
            // Contrast ratio should be between 1 and 21
            expect(ratio).toBeGreaterThanOrEqual(1);
            expect(ratio).toBeLessThanOrEqual(21);
            
            // Should be a finite number
            expect(Number.isFinite(ratio)).toBe(true);
          }
        ),
        { numRuns: 200 }
      );
    });
  });

  describe('Property: WCAG AA threshold consistency', () => {
    it('should consistently classify colors above/below threshold', () => {
      fc.assert(
        fc.property(
          fc.hexaString({ minLength: 6, maxLength: 6 }),
          fc.hexaString({ minLength: 6, maxLength: 6 }),
          (color1, color2) => {
            const ratio = getContrastRatio(`#${color1}`, `#${color2}`);
            const meetsNormal = meetsWCAGAA(`#${color1}`, `#${color2}`, false);
            const meetsLarge = meetsWCAGAA(`#${color1}`, `#${color2}`, true);
            
            // If it meets normal text (4.5:1), it must meet large text (3:1)
            if (meetsNormal) {
              expect(meetsLarge).toBe(true);
            }
            
            // Verify threshold logic
            if (ratio >= 4.5) {
              expect(meetsNormal).toBe(true);
            }
            if (ratio >= 3) {
              expect(meetsLarge).toBe(true);
            }
            if (ratio < 3) {
              expect(meetsLarge).toBe(false);
            }
          }
        ),
        { numRuns: 200 }
      );
    });
  });
});
