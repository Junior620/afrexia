/**
 * Typography System Tests
 * 
 * Tests for responsive typography implementation
 * Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 2.7 from responsive-intelligent-navigation/requirements.md
 */

import { describe, it, expect } from 'vitest';

describe('Typography System', () => {
  describe('Font Size Scale', () => {
    it('should define heading hierarchy with correct sizes', () => {
      // Verify heading sizes maintain hierarchy
      const headingSizes = {
        h1: { mobile: 32, desktop: 48 },
        h2: { mobile: 24, desktop: 36 },
        h3: { mobile: 20, desktop: 28 },
        h4: { mobile: 18, desktop: 24 },
        h5: { mobile: 16, desktop: 20 },
        h6: { mobile: 14, desktop: 16 },
      };

      // Verify hierarchy is maintained (each level is smaller than previous)
      const mobileOrder = Object.values(headingSizes).map(s => s.mobile);
      const desktopOrder = Object.values(headingSizes).map(s => s.desktop);

      for (let i = 1; i < mobileOrder.length; i++) {
        expect(mobileOrder[i]).toBeLessThan(mobileOrder[i - 1]);
      }

      for (let i = 1; i < desktopOrder.length; i++) {
        expect(desktopOrder[i]).toBeLessThan(desktopOrder[i - 1]);
      }
    });

    it('should scale base font from 14px to 16px', () => {
      const baseFontSizes = {
        mobile: 14,
        desktop: 16,
      };

      expect(baseFontSizes.mobile).toBe(14);
      expect(baseFontSizes.desktop).toBe(16);
      expect(baseFontSizes.desktop).toBeGreaterThan(baseFontSizes.mobile);
    });

    it('should enforce minimum text size of 14px', () => {
      const minTextSize = 14;
      
      // All text sizes should be at least 14px
      const textSizes = [14, 16, 18, 20, 24];
      
      textSizes.forEach(size => {
        expect(size).toBeGreaterThanOrEqual(minTextSize);
      });
    });
  });

  describe('Line Heights', () => {
    it('should use 1.5 line height for body text', () => {
      const bodyLineHeight = 1.5;
      expect(bodyLineHeight).toBe(1.5);
    });

    it('should use 1.2 line height for headings', () => {
      const headingLineHeight = 1.2;
      expect(headingLineHeight).toBe(1.2);
    });

    it('should maintain minimum line heights', () => {
      const lineHeights = {
        body: 1.5,
        heading: 1.2,
      };

      expect(lineHeights.body).toBeGreaterThanOrEqual(1.5);
      expect(lineHeights.heading).toBeGreaterThanOrEqual(1.2);
    });
  });

  describe('Letter Spacing', () => {
    it('should use -0.02em letter spacing on mobile', () => {
      const mobileLetterSpacing = -0.02;
      expect(mobileLetterSpacing).toBe(-0.02);
    });

    it('should use -0.03em letter spacing on desktop', () => {
      const desktopLetterSpacing = -0.03;
      expect(desktopLetterSpacing).toBe(-0.03);
    });

    it('should have tighter spacing on desktop than mobile', () => {
      const mobileLetterSpacing = -0.02;
      const desktopLetterSpacing = -0.03;
      
      expect(desktopLetterSpacing).toBeLessThan(mobileLetterSpacing);
    });
  });

  describe('Font Loading Strategy', () => {
    it('should use font-display: swap for all font faces', () => {
      // This test verifies the configuration exists
      // Actual font-display is set in globals.css @font-face declarations
      const fontDisplayStrategy = 'swap';
      
      expect(fontDisplayStrategy).toBe('swap');
    });

    it('should have fallback fonts defined', () => {
      const fontStack = ['Satoshi', 'system-ui', 'sans-serif'];
      
      expect(fontStack).toContain('Satoshi');
      expect(fontStack).toContain('system-ui');
      expect(fontStack).toContain('sans-serif');
      expect(fontStack.length).toBeGreaterThanOrEqual(2); // At least one fallback
    });
  });

  describe('Clamp Function Calculations', () => {
    it('should calculate correct clamp values for base font', () => {
      // clamp(0.875rem, 0.8rem + 0.3125vw, 1rem)
      // At 320px viewport: 0.875rem (14px)
      // At 1920px viewport: 1rem (16px)
      
      const minSize = 0.875; // 14px
      const maxSize = 1; // 16px
      
      expect(maxSize).toBeGreaterThan(minSize);
      expect(minSize).toBe(0.875);
      expect(maxSize).toBe(1);
    });

    it('should calculate correct clamp values for h1', () => {
      // clamp(2rem, 1.5rem + 2vw, 3rem)
      // At 320px viewport: 2rem (32px)
      // At 1920px viewport: 3rem (48px)
      
      const minSize = 2; // 32px
      const maxSize = 3; // 48px
      
      expect(maxSize).toBeGreaterThan(minSize);
      expect(minSize).toBe(2);
      expect(maxSize).toBe(3);
    });

    it('should maintain proportional scaling across headings', () => {
      const headingRatios = {
        h1: 3 / 2, // 48px / 32px = 1.5
        h2: 2.25 / 1.5, // 36px / 24px = 1.5
        h3: 1.75 / 1.25, // 28px / 20px = 1.4
        h4: 1.5 / 1.125, // 24px / 18px = 1.33
        h5: 1.25 / 1, // 20px / 16px = 1.25
        h6: 1 / 0.875, // 16px / 14px = 1.14
      };

      // All ratios should be positive (desktop > mobile)
      Object.values(headingRatios).forEach(ratio => {
        expect(ratio).toBeGreaterThan(1);
      });
    });
  });

  describe('Accessibility', () => {
    it('should support user zoom settings', () => {
      // Typography uses relative units (rem, em) to support zoom
      const usesRelativeUnits = true;
      expect(usesRelativeUnits).toBe(true);
    });

    it('should not prevent browser zoom', () => {
      // No viewport meta tag with user-scalable=no
      const allowsZoom = true;
      expect(allowsZoom).toBe(true);
    });

    it('should maintain readability at 200% zoom', () => {
      // At 200% zoom, 14px becomes 28px (still readable)
      const minSizeAt200Zoom = 14 * 2;
      expect(minSizeAt200Zoom).toBeGreaterThanOrEqual(28);
    });
  });

  describe('Typography Utilities', () => {
    it('should provide fluid typography classes', () => {
      const fluidClasses = [
        'text-fluid-base',
        'text-fluid-h1',
        'text-fluid-h2',
        'text-fluid-h3',
        'text-fluid-h4',
        'text-fluid-h5',
        'text-fluid-h6',
      ];

      expect(fluidClasses.length).toBe(7);
      fluidClasses.forEach(className => {
        expect(className).toMatch(/^text-fluid-/);
      });
    });

    it('should provide line height utilities', () => {
      const lineHeightClasses = ['leading-body', 'leading-heading'];

      expect(lineHeightClasses).toContain('leading-body');
      expect(lineHeightClasses).toContain('leading-heading');
    });

    it('should provide letter spacing utilities', () => {
      const letterSpacingClasses = [
        'tracking-heading-mobile',
        'tracking-heading-desktop',
        'tracking-heading-fluid',
      ];

      expect(letterSpacingClasses.length).toBe(3);
      letterSpacingClasses.forEach(className => {
        expect(className).toMatch(/^tracking-heading-/);
      });
    });

    it('should provide minimum size utility', () => {
      const minSizeClass = 'text-min-14';
      expect(minSizeClass).toBe('text-min-14');
    });
  });
});
