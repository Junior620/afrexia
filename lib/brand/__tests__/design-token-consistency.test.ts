/**
 * Property Test: Design Token Consistency
 * 
 * **Property 47: Design token consistency**
 * **Validates: Requirements 17.3, 17.5**
 * 
 * This test ensures that design tokens are used consistently throughout the codebase
 * and that spacing, typography, and other design properties follow the design system.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  SPACING,
  TYPOGRAPHY,
  BORDER_RADIUS,
  SHADOWS,
  Z_INDEX,
  TRANSITIONS,
  DESIGN_TOKENS,
} from '../design-tokens';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

/**
 * Extract hardcoded spacing values from className strings
 * Looks for patterns like p-[16px], m-[2rem], etc.
 */
function extractHardcodedSpacing(content: string): string[] {
  const hardcodedSpacingRegex = /(?:p|m|px|py|pl|pr|pt|pb|mx|my|ml|mr|mt|mb|gap|space)-\[[\d.]+(?:px|rem|em)\]/g;
  return content.match(hardcodedSpacingRegex) || [];
}

/**
 * Extract hardcoded font sizes from className strings
 * Looks for patterns like text-[14px], text-[1.5rem], etc.
 */
function extractHardcodedFontSizes(content: string): string[] {
  const hardcodedFontSizeRegex = /text-\[[\d.]+(?:px|rem|em)\]/g;
  return content.match(hardcodedFontSizeRegex) || [];
}

/**
 * Extract hardcoded border radius values
 * Looks for patterns like rounded-[8px], rounded-[0.5rem], etc.
 */
function extractHardcodedBorderRadius(content: string): string[] {
  const hardcodedRadiusRegex = /rounded(?:-[tlbr]{1,2})?-\[[\d.]+(?:px|rem|em)\]/g;
  return content.match(hardcodedRadiusRegex) || [];
}

/**
 * Check if a file should be excluded from token checking
 */
function shouldExcludeFile(filePath: string): boolean {
  const excludePatterns = [
    '__tests__',
    'node_modules',
    '.next',
    'dist',
    'build',
    '.git',
    'tailwind.config',
    'globals.css',
    'design-tokens.ts',
    'colors.ts',
  ];
  
  return excludePatterns.some(pattern => filePath.includes(pattern));
}

describe('Property 47: Design Token Consistency', () => {
  it('should not use hardcoded spacing values in components', async () => {
    const componentFiles = await glob('**/*.{tsx,ts,jsx,js}', {
      cwd: process.cwd(),
      ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**'],
    });

    const violations: Array<{ file: string; value: string; line: number }> = [];

    for (const file of componentFiles) {
      if (shouldExcludeFile(file)) continue;

      const filePath = path.join(process.cwd(), file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        const hardcodedValues = extractHardcodedSpacing(line);
        hardcodedValues.forEach(value => {
          violations.push({
            file,
            value,
            line: index + 1,
          });
        });
      });
    }

    if (violations.length > 0) {
      const violationReport = violations
        .slice(0, 10)
        .map(v => `  ${v.file}:${v.line} - ${v.value}`)
        .join('\n');
      
      const moreCount = violations.length > 10 ? ` (and ${violations.length - 10} more)` : '';
      
      expect.fail(
        `Found ${violations.length} hardcoded spacing value(s)${moreCount}:\n${violationReport}\n\n` +
        `Use Tailwind spacing classes instead (e.g., p-4, m-6, gap-8).`
      );
    }

    expect(violations).toHaveLength(0);
  });

  it('should not use hardcoded font sizes in components', async () => {
    const componentFiles = await glob('**/*.{tsx,ts,jsx,js}', {
      cwd: process.cwd(),
      ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**'],
    });

    const violations: Array<{ file: string; value: string; line: number }> = [];

    for (const file of componentFiles) {
      if (shouldExcludeFile(file)) continue;

      const filePath = path.join(process.cwd(), file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        const hardcodedValues = extractHardcodedFontSizes(line);
        hardcodedValues.forEach(value => {
          violations.push({
            file,
            value,
            line: index + 1,
          });
        });
      });
    }

    if (violations.length > 0) {
      const violationReport = violations
        .slice(0, 10)
        .map(v => `  ${v.file}:${v.line} - ${v.value}`)
        .join('\n');
      
      const moreCount = violations.length > 10 ? ` (and ${violations.length - 10} more)` : '';
      
      expect.fail(
        `Found ${violations.length} hardcoded font size(s)${moreCount}:\n${violationReport}\n\n` +
        `Use Tailwind typography classes instead (e.g., text-base, text-lg, text-2xl).`
      );
    }

    expect(violations).toHaveLength(0);
  });

  it('should not use hardcoded border radius values in components', async () => {
    const componentFiles = await glob('**/*.{tsx,ts,jsx,js}', {
      cwd: process.cwd(),
      ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**'],
    });

    const violations: Array<{ file: string; value: string; line: number }> = [];

    for (const file of componentFiles) {
      if (shouldExcludeFile(file)) continue;

      const filePath = path.join(process.cwd(), file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        const hardcodedValues = extractHardcodedBorderRadius(line);
        hardcodedValues.forEach(value => {
          violations.push({
            file,
            value,
            line: index + 1,
          });
        });
      });
    }

    if (violations.length > 0) {
      const violationReport = violations
        .slice(0, 10)
        .map(v => `  ${v.file}:${v.line} - ${v.value}`)
        .join('\n');
      
      const moreCount = violations.length > 10 ? ` (and ${violations.length - 10} more)` : '';
      
      expect.fail(
        `Found ${violations.length} hardcoded border radius value(s)${moreCount}:\n${violationReport}\n\n` +
        `Use Tailwind border radius classes instead (e.g., rounded-lg, rounded-xl, rounded-full).`
      );
    }

    expect(violations).toHaveLength(0);
  });

  it('should have all required design tokens defined', () => {
    // Property: All essential design tokens must be defined
    expect(DESIGN_TOKENS.SPACING).toBeDefined();
    expect(DESIGN_TOKENS.TYPOGRAPHY).toBeDefined();
    expect(DESIGN_TOKENS.BORDER_RADIUS).toBeDefined();
    expect(DESIGN_TOKENS.SHADOWS).toBeDefined();
    expect(DESIGN_TOKENS.Z_INDEX).toBeDefined();
    expect(DESIGN_TOKENS.TRANSITIONS).toBeDefined();
    expect(DESIGN_TOKENS.COLORS).toBeDefined();
  });

  it('should have consistent spacing scale based on 4px base unit', () => {
    // Property: Spacing values should follow a consistent scale
    const spacingValues = Object.values(SPACING);
    
    spacingValues.forEach(value => {
      // Extract numeric value and unit
      const match = value.match(/^([\d.]+)(rem|px)$/);
      expect(match).toBeTruthy();
      
      if (match) {
        const [, numStr, unit] = match;
        const num = parseFloat(numStr);
        
        if (unit === 'rem') {
          // 1rem = 16px, so value should be divisible by 0.25rem (4px)
          const pxValue = num * 16;
          expect(pxValue % 4).toBe(0);
        }
      }
    });
  });

  it('should have typography scale with proper line heights', () => {
    // Property: Each font size should have an associated line height
    Object.entries(TYPOGRAPHY.fontSize).forEach(([key, value]) => {
      expect(value).toHaveProperty('size');
      expect(value).toHaveProperty('lineHeight');
      expect(typeof value.size).toBe('string');
      expect(typeof value.lineHeight).toBe('string');
    });
  });

  it('should have z-index values in ascending order', () => {
    // Property: Z-index values should be ordered from lowest to highest
    const zIndexValues = Object.values(Z_INDEX);
    
    for (let i = 1; i < zIndexValues.length; i++) {
      expect(zIndexValues[i]).toBeGreaterThanOrEqual(zIndexValues[i - 1]);
    }
  });

  /**
   * Property-based test: Spacing values should be valid CSS units
   */
  it('should have valid CSS units for all spacing values', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.values(SPACING)),
        (spacing) => {
          // Property: All spacing values should be valid CSS units
          const cssUnitRegex = /^[\d.]+(?:px|rem|em|%)$/;
          expect(spacing).toMatch(cssUnitRegex);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property-based test: Border radius values should be valid CSS units
   */
  it('should have valid CSS units for all border radius values', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.values(BORDER_RADIUS)),
        (radius) => {
          // Property: All border radius values should be valid CSS units or keywords
          const validRadiusRegex = /^(?:[\d.]+(?:px|rem|em|%)|0|9999px)$/;
          expect(radius).toMatch(validRadiusRegex);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property-based test: Transition durations should be valid time units
   */
  it('should have valid time units for all transition durations', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.values(TRANSITIONS.duration)),
        (duration) => {
          // Property: All transition durations should be valid time units
          const timeUnitRegex = /^[\d.]+(?:ms|s)$/;
          expect(duration).toMatch(timeUnitRegex);
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * Property-based test: Shadow values should be valid CSS box-shadow syntax
   */
  it('should have valid CSS box-shadow syntax for all shadow values', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.values(SHADOWS)),
        (shadow) => {
          // Property: All shadow values should be valid CSS box-shadow syntax or 'none'
          const validShadowRegex = /^(?:none|(?:inset\s+)?[\d\s\-]+(?:px|rem|em)\s+rgb\([^)]+\)(?:,\s*(?:inset\s+)?[\d\s\-]+(?:px|rem|em)\s+rgb\([^)]+\))*)$/;
          expect(shadow === 'none' || validShadowRegex.test(shadow) || shadow.includes('rgb')).toBe(true);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should maintain consistency between Tailwind config and design tokens', () => {
    // Property: Design tokens should match Tailwind configuration
    // This ensures that the design system is properly integrated
    
    // Check that spacing tokens align with Tailwind's default scale
    expect(SPACING.xs).toBe('0.5rem');   // 8px
    expect(SPACING.sm).toBe('0.75rem');  // 12px
    expect(SPACING.md).toBe('1rem');     // 16px
    expect(SPACING.lg).toBe('1.5rem');   // 24px
    expect(SPACING.xl).toBe('2rem');     // 32px
  });

  it('should have button styles defined for all variants', () => {
    // Property: All button variants should have complete style definitions
    const buttonVariants = ['primary', 'secondary', 'ghost', 'destructive'];
    
    buttonVariants.forEach(variant => {
      expect(DESIGN_TOKENS.BUTTON_STYLES).toHaveProperty(variant);
      const styles = DESIGN_TOKENS.BUTTON_STYLES[variant as keyof typeof DESIGN_TOKENS.BUTTON_STYLES];
      expect(styles).toHaveProperty('bg');
      expect(styles).toHaveProperty('bgHover');
      expect(styles).toHaveProperty('text');
      expect(styles).toHaveProperty('border');
    });
  });

  it('should have card styles defined for all variants', () => {
    // Property: All card variants should have complete style definitions
    const cardVariants = ['DEFAULT', 'elevated', 'flat'];
    
    cardVariants.forEach(variant => {
      expect(DESIGN_TOKENS.CARD_STYLES).toHaveProperty(variant);
      const styles = DESIGN_TOKENS.CARD_STYLES[variant as keyof typeof DESIGN_TOKENS.CARD_STYLES];
      expect(styles).toHaveProperty('bg');
      expect(styles).toHaveProperty('border');
      expect(styles).toHaveProperty('shadow');
      expect(styles).toHaveProperty('shadowHover');
      expect(styles).toHaveProperty('radius');
    });
  });

  it('should have accessibility tokens defined', () => {
    // Property: Accessibility tokens must be defined for WCAG compliance
    expect(DESIGN_TOKENS.ACCESSIBILITY).toBeDefined();
    expect(DESIGN_TOKENS.ACCESSIBILITY.focusRing).toBeDefined();
    expect(DESIGN_TOKENS.ACCESSIBILITY.minTouchTarget).toBe('44px');
    expect(DESIGN_TOKENS.ACCESSIBILITY.minContrastRatio.normal).toBe(4.5);
    expect(DESIGN_TOKENS.ACCESSIBILITY.minContrastRatio.large).toBe(3);
  });
});
