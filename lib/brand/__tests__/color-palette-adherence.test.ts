/**
 * Property Test: Color Palette Adherence
 * 
 * **Property 46: Color palette adherence**
 * **Validates: Requirements 17.1**
 * 
 * This test ensures that only approved brand colors are used throughout the codebase.
 * It scans component files for hardcoded color values and verifies they match the brand palette.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { BRAND_COLORS } from '../colors';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

// Approved brand colors (hex values)
const APPROVED_COLORS = new Set([
  // Primary colors
  '#194424', '#0F2916', '#2D6B3F',
  // Secondary colors
  '#337A49', '#265A36', '#4A9A62',
  // Accent colors
  '#655E2C', '#4A441F', '#8A7F3D',
  // Supporting colors
  '#E9EBE5', '#80996F', '#B0BCA4',
  // Neutral colors
  '#FFFFFF', '#000000',
  // Gray scale (derived from brand)
  '#D4D7CE', '#8C9A7A', '#6A8159', '#556A47', '#405035',
  // Success colors (updated for better contrast)
  '#E8F5E9',
  // Warning colors (updated for better contrast)
  '#FFF9E6',
  // Info colors (updated for better contrast)
  '#F1F5EE',
  // Error colors (necessary for errors, not from brand palette)
  '#DC2626', '#FEE2E2', '#991B1B',
  // Email-specific colors
  '#F6F9FC', '#333333', '#555555',
]);

// Approved Tailwind color classes (brand colors only)
const APPROVED_TAILWIND_CLASSES = new Set([
  'primary', 'primary-dark', 'primary-light',
  'secondary', 'secondary-dark', 'secondary-light',
  'accent', 'accent-dark', 'accent-light',
  'light', 'support', 'neutral',
  'success', 'success-light', 'success-dark',
  'warning', 'warning-light', 'warning-dark',
  'info', 'info-light', 'info-dark',
  'muted', 'muted-foreground',
  'destructive', 'destructive-foreground',
  'border', 'input', 'ring',
  'background', 'foreground',
  'card', 'card-foreground',
  'popover', 'popover-foreground',
  'white', 'black',
]);

/**
 * Extract hex color codes from a string
 */
function extractHexColors(content: string): string[] {
  const hexColorRegex = /#[0-9A-Fa-f]{3,6}\b/g;
  const matches = content.match(hexColorRegex) || [];
  // Normalize to uppercase and expand 3-digit hex to 6-digit
  return matches.map(color => {
    const normalized = color.toUpperCase();
    if (normalized.length === 4) {
      // Expand #RGB to #RRGGBB
      return `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`;
    }
    return normalized;
  });
}

/**
 * Extract Tailwind color classes from a string
 * Looks for patterns like bg-red-500, text-blue-600, etc.
 */
function extractTailwindColorClasses(content: string): string[] {
  // Match Tailwind color classes: bg-{color}-{shade}, text-{color}-{shade}, etc.
  const tailwindColorRegex = /(?:bg|text|border|ring|from|to|via)-(?:red|blue|green|yellow|purple|pink|indigo|gray|slate|zinc|stone|orange|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-\d+/g;
  return content.match(tailwindColorRegex) || [];
}

/**
 * Check if a file should be excluded from color checking
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
    'shadcn-customization.md',
  ];
  
  return excludePatterns.some(pattern => filePath.includes(pattern));
}

describe('Property 46: Color Palette Adherence', () => {
  it('should only use approved brand colors in hex format', async () => {
    const componentFiles = await glob('**/*.{tsx,ts,jsx,js,css}', {
      cwd: process.cwd(),
      ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**'],
    });

    const violations: Array<{ file: string; color: string; line: number }> = [];

    for (const file of componentFiles) {
      if (shouldExcludeFile(file)) continue;

      const filePath = path.join(process.cwd(), file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        const colors = extractHexColors(line);
        colors.forEach(color => {
          if (!APPROVED_COLORS.has(color)) {
            violations.push({
              file,
              color,
              line: index + 1,
            });
          }
        });
      });
    }

    if (violations.length > 0) {
      const violationReport = violations
        .map(v => `  ${v.file}:${v.line} - ${v.color}`)
        .join('\n');
      
      expect.fail(
        `Found ${violations.length} unapproved color(s):\n${violationReport}\n\n` +
        `Only brand colors from BRAND_COLORS should be used.`
      );
    }

    expect(violations).toHaveLength(0);
  });

  it('should not use non-brand Tailwind color classes', async () => {
    const componentFiles = await glob('**/*.{tsx,ts,jsx,js}', {
      cwd: process.cwd(),
      ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**'],
    });

    const violations: Array<{ file: string; className: string; line: number }> = [];

    for (const file of componentFiles) {
      if (shouldExcludeFile(file)) continue;

      const filePath = path.join(process.cwd(), file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        const colorClasses = extractTailwindColorClasses(line);
        colorClasses.forEach(className => {
          violations.push({
            file,
            className,
            line: index + 1,
          });
        });
      });
    }

    if (violations.length > 0) {
      const violationReport = violations
        .slice(0, 20) // Show first 20 violations
        .map(v => `  ${v.file}:${v.line} - ${v.className}`)
        .join('\n');
      
      const moreCount = violations.length > 20 ? ` (and ${violations.length - 20} more)` : '';
      
      expect.fail(
        `Found ${violations.length} non-brand Tailwind color class(es)${moreCount}:\n${violationReport}\n\n` +
        `Use brand color classes instead (e.g., bg-primary, text-success, bg-muted).`
      );
    }

    expect(violations).toHaveLength(0);
  });

  it('should have all brand colors defined in BRAND_COLORS', () => {
    // Property: All brand colors must be defined in the BRAND_COLORS constant
    expect(BRAND_COLORS.primary.DEFAULT).toBe('#194424');
    expect(BRAND_COLORS.secondary.DEFAULT).toBe('#337A49');
    expect(BRAND_COLORS.accent.DEFAULT).toBe('#655E2C');
    expect(BRAND_COLORS.light).toBe('#E9EBE5');
    expect(BRAND_COLORS.support).toBe('#80996F');
    expect(BRAND_COLORS.neutral).toBe('#B0BCA4');
  });

  it('should maintain color consistency across semantic mappings', () => {
    // Property: Semantic colors should map to brand colors
    expect(BRAND_COLORS.success.DEFAULT).toBe(BRAND_COLORS.secondary.DEFAULT);
    expect(BRAND_COLORS.warning.DEFAULT).toBe(BRAND_COLORS.accent.DEFAULT);
    expect(BRAND_COLORS.info.DEFAULT).toBe(BRAND_COLORS.support);
  });

  /**
   * Property-based test: Color values should be valid hex codes
   */
  it('should have valid hex color codes for all brand colors', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          ...Object.values(BRAND_COLORS).flatMap(colorGroup => 
            typeof colorGroup === 'string' 
              ? [colorGroup]
              : Object.values(colorGroup).filter(v => typeof v === 'string')
          )
        ),
        (color) => {
          // Property: All color values should be valid hex codes
          const hexRegex = /^#[0-9A-Fa-f]{6}$/;
          expect(color).toMatch(hexRegex);
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property-based test: Color contrast should be sufficient
   */
  it('should maintain sufficient contrast between text and background colors', () => {
    // Helper function to calculate relative luminance
    function getLuminance(hex: string): number {
      const rgb = parseInt(hex.slice(1), 16);
      const r = ((rgb >> 16) & 0xff) / 255;
      const g = ((rgb >> 8) & 0xff) / 255;
      const b = (rgb & 0xff) / 255;

      const [rs, gs, bs] = [r, g, b].map(c => 
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      );

      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    // Helper function to calculate contrast ratio
    function getContrastRatio(color1: string, color2: string): number {
      const lum1 = getLuminance(color1);
      const lum2 = getLuminance(color2);
      const lighter = Math.max(lum1, lum2);
      const darker = Math.min(lum1, lum2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    // Test common text/background combinations
    const textBackgroundPairs = [
      { text: BRAND_COLORS.primary.DEFAULT, bg: BRAND_COLORS.white, minRatio: 4.5 },
      { text: BRAND_COLORS.white, bg: BRAND_COLORS.primary.DEFAULT, minRatio: 4.5 },
      { text: BRAND_COLORS.success.dark, bg: BRAND_COLORS.success.light, minRatio: 4.5 },
      { text: BRAND_COLORS.warning.dark, bg: BRAND_COLORS.warning.light, minRatio: 4.5 },
    ];

    textBackgroundPairs.forEach(({ text, bg, minRatio }) => {
      const ratio = getContrastRatio(text, bg);
      expect(ratio).toBeGreaterThanOrEqual(minRatio);
    });
  });
});
