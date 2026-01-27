/**
 * Unit tests for dark mode color palette definition
 * Validates: Requirements 2.1, 6.2
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Dark mode color palette definition', () => {
  describe('Tailwind configuration', () => {
    it('should define all required dark mode background colors', () => {
      const configPath = path.join(process.cwd(), 'tailwind.config.ts');
      const configContent = fs.readFileSync(configPath, 'utf-8');
      
      // Check for dark-bg colors
      expect(configContent).toContain("'dark-bg'");
      expect(configContent).toContain('primary:');
      expect(configContent).toContain('secondary:');
      expect(configContent).toContain('tertiary:');
      
      // Verify specific color values
      expect(configContent).toContain('#0A1410'); // dark-bg-primary
      expect(configContent).toContain('#1A2820'); // dark-bg-secondary
      expect(configContent).toContain('#141D18'); // dark-bg-tertiary
    });

    it('should define all required dark mode text colors', () => {
      const configPath = path.join(process.cwd(), 'tailwind.config.ts');
      const configContent = fs.readFileSync(configPath, 'utf-8');
      
      // Check for dark-text colors
      expect(configContent).toContain("'dark-text'");
      
      // Verify specific color values
      expect(configContent).toContain('#E8F5E9'); // dark-text-primary
      expect(configContent).toContain('#B0D4B8'); // dark-text-secondary
      expect(configContent).toContain('#80996F'); // dark-text-muted
    });

    it('should define dark mode border colors', () => {
      const configPath = path.join(process.cwd(), 'tailwind.config.ts');
      const configContent = fs.readFileSync(configPath, 'utf-8');
      
      // Check for dark-border color (updated for better contrast)
      expect(configContent).toContain("'dark-border'");
      expect(configContent).toContain('#6B8273'); // Updated value
    });

    it('should define dark mode brand color variants', () => {
      const configPath = path.join(process.cwd(), 'tailwind.config.ts');
      const configContent = fs.readFileSync(configPath, 'utf-8');
      
      // Check for dark mode brand colors
      expect(configContent).toContain("'dark-primary'");
      expect(configContent).toContain("'dark-secondary'");
      expect(configContent).toContain("'dark-accent'");
      expect(configContent).toContain("'dark-sand'");
      expect(configContent).toContain("'dark-support'");
      
      // Verify specific color values (updated for better contrast)
      expect(configContent).toContain('#4A9A62'); // dark-primary (updated)
      expect(configContent).toContain('#5AAA72'); // dark-secondary
      expect(configContent).toContain('#A89858'); // dark-accent
      expect(configContent).toContain('#5A7268'); // dark-sand (updated)
      expect(configContent).toContain('#9AB08A'); // dark-support
    });

    it('should have dark mode enabled in Tailwind config', () => {
      const configPath = path.join(process.cwd(), 'tailwind.config.ts');
      const configContent = fs.readFileSync(configPath, 'utf-8');
      
      // Verify dark mode is configured with class strategy
      expect(configContent).toContain("darkMode: ['class']");
    });
  });

  describe('Global CSS configuration', () => {
    it('should define CSS custom properties for dark mode', () => {
      const cssPath = path.join(process.cwd(), 'app/globals.css');
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      
      // Check for .dark class definition
      expect(cssContent).toContain('.dark {');
      
      // Check for dark mode CSS variables
      expect(cssContent).toContain('--background:');
      expect(cssContent).toContain('--foreground:');
      expect(cssContent).toContain('--card:');
      expect(cssContent).toContain('--primary:');
      expect(cssContent).toContain('--secondary:');
      expect(cssContent).toContain('--border:');
    });

    it('should define theme transition properties', () => {
      const cssPath = path.join(process.cwd(), 'app/globals.css');
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      
      // Check for transition properties
      expect(cssContent).toContain('transition-property:');
      expect(cssContent).toContain('background-color');
      expect(cssContent).toContain('border-color');
      expect(cssContent).toContain('color');
    });

    it('should set transition duration to 300ms', () => {
      const cssPath = path.join(process.cwd(), 'app/globals.css');
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      
      // Check for 300ms transition duration
      expect(cssContent).toContain('transition-duration: 300ms');
    });

    it('should include prefers-reduced-motion support', () => {
      const cssPath = path.join(process.cwd(), 'app/globals.css');
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      
      // Check for reduced motion media query
      expect(cssContent).toContain('@media (prefers-reduced-motion: reduce)');
      
      // Verify it sets transition duration to 0ms
      expect(cssContent).toMatch(/prefers-reduced-motion.*transition-duration.*0ms/s);
    });

    it('should define dark mode focus indicators', () => {
      const cssPath = path.join(process.cwd(), 'app/globals.css');
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      
      // Check for dark mode focus styles
      expect(cssContent).toContain('.dark *:focus-visible');
      expect(cssContent).toContain('outline-color');
    });
  });

  describe('Color palette completeness', () => {
    it('should have all required color categories defined', () => {
      const configPath = path.join(process.cwd(), 'tailwind.config.ts');
      const configContent = fs.readFileSync(configPath, 'utf-8');
      
      const requiredCategories = [
        "'dark-bg'",
        "'dark-text'",
        "'dark-border'",
        "'dark-primary'",
        "'dark-secondary'",
        "'dark-accent'",
        "'dark-sand'",
        "'dark-support'",
      ];
      
      requiredCategories.forEach((category) => {
        expect(configContent).toContain(category);
      });
    });

    it('should maintain brand color consistency between light and dark modes', () => {
      const configPath = path.join(process.cwd(), 'tailwind.config.ts');
      const configContent = fs.readFileSync(configPath, 'utf-8');
      
      // Verify both light and dark variants exist for brand colors
      expect(configContent).toContain('primary:');
      expect(configContent).toContain("'dark-primary'");
      
      expect(configContent).toContain('secondary:');
      expect(configContent).toContain("'dark-secondary'");
      
      expect(configContent).toContain('accent:');
      expect(configContent).toContain("'dark-accent'");
    });
  });

  describe('CSS transition configuration', () => {
    it('should apply transitions to all elements', () => {
      const cssPath = path.join(process.cwd(), 'app/globals.css');
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      
      // Check that transitions are applied globally
      expect(cssContent).toMatch(/\*,\s*\*::before,\s*\*::after\s*{[^}]*transition-property:/s);
    });

    it('should use cubic-bezier timing function', () => {
      const cssPath = path.join(process.cwd(), 'app/globals.css');
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      
      // Check for cubic-bezier timing function
      expect(cssContent).toContain('transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)');
    });

    it('should only transition color-related properties', () => {
      const cssPath = path.join(process.cwd(), 'app/globals.css');
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      
      // Verify transition properties are limited to colors
      const transitionMatch = cssContent.match(/transition-property:\s*([^;]+);/);
      expect(transitionMatch).toBeTruthy();
      
      if (transitionMatch) {
        const properties = transitionMatch[1];
        expect(properties).toContain('background-color');
        expect(properties).toContain('border-color');
        expect(properties).toContain('color');
        
        // Should NOT include layout properties
        expect(properties).not.toContain('width');
        expect(properties).not.toContain('height');
        expect(properties).not.toContain('transform');
      }
    });
  });
});
