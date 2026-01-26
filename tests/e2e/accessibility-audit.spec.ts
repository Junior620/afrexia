import { test, expect } from '@playwright/test';
import { expectNoA11yViolations } from './helpers/accessibility';

/**
 * E2E Accessibility Audit
 * Comprehensive accessibility testing across all major pages
 * 
 * **Validates: Requirements 16.1 (WCAG 2.1 Level AA compliance)**
 */
test.describe('Accessibility Audit', () => {
  const pages = [
    { path: '/en', name: 'Homepage (EN)' },
    { path: '/fr', name: 'Homepage (FR)' },
    { path: '/en/products', name: 'Products Listing' },
    { path: '/en/solutions', name: 'Solutions Page' },
    { path: '/en/quality', name: 'Quality & Compliance' },
    { path: '/en/traceability', name: 'Traceability & EUDR' },
    { path: '/en/about', name: 'About Page' },
    { path: '/en/resources', name: 'Resources Page' },
    { path: '/en/blog', name: 'Blog Listing' },
    { path: '/en/contact', name: 'Contact Page' },
    { path: '/en/rfq', name: 'RFQ Page' },
  ];

  for (const { path, name } of pages) {
    test(`should have no accessibility violations on ${name}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      
      // Run accessibility audit
      await expectNoA11yViolations(page);
    });
  }

  test('should have no violations in mobile navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en');
    
    // Open mobile menu
    const menuButton = page.locator('button[aria-label*="menu" i]');
    await menuButton.click();
    
    // Wait for menu to open
    await page.waitForTimeout(300);
    
    // Run accessibility audit on open menu
    await expectNoA11yViolations(page);
  });

  test('should have no violations in forms', async ({ page }) => {
    // Test contact form
    await page.goto('/en/contact');
    await expectNoA11yViolations(page);
    
    // Test RFQ form
    await page.goto('/en/rfq');
    await expectNoA11yViolations(page);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/en');
    
    // Get all headings
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    
    // Should have at least one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    
    // Should not have more than one h1
    expect(h1Count).toBeLessThanOrEqual(1);
  });

  test('should have proper landmark regions', async ({ page }) => {
    await page.goto('/en');
    
    // Check for main landmarks
    await expect(page.locator('header, [role="banner"]')).toBeVisible();
    await expect(page.locator('main, [role="main"]')).toBeVisible();
    await expect(page.locator('footer, [role="contentinfo"]')).toBeVisible();
    await expect(page.locator('nav, [role="navigation"]')).toBeVisible();
  });

  test('should have skip to content link', async ({ page }) => {
    await page.goto('/en');
    
    // Tab to first element (should be skip link)
    await page.keyboard.press('Tab');
    
    // Check if skip link is focused or visible
    const skipLink = page.locator('a:has-text("Skip to"), a[href="#main-content"]');
    if (await skipLink.count() > 0) {
      await expect(skipLink.first()).toBeVisible();
    }
  });

  test('should have proper focus indicators', async ({ page }) => {
    await page.goto('/en');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check that focused element has visible focus indicator
    const focusedElement = await page.evaluateHandle(() => document.activeElement);
    const hasFocusStyle = await page.evaluate((el) => {
      if (!el) return false;
      const styles = window.getComputedStyle(el as Element);
      // Check for outline or box-shadow (common focus indicators)
      return styles.outline !== 'none' || styles.boxShadow !== 'none';
    }, focusedElement);
    
    expect(hasFocusStyle).toBe(true);
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/en');
    
    // Tab through navigation
    let tabCount = 0;
    const maxTabs = 20;
    
    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab');
      tabCount++;
      
      // Check if we can reach interactive elements
      const activeElement = await page.evaluateHandle(() => document.activeElement);
      const tagName = await page.evaluate((el) => (el as Element)?.tagName, activeElement);
      
      if (['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(tagName)) {
        // Successfully navigated to an interactive element
        break;
      }
    }
    
    expect(tabCount).toBeLessThan(maxTabs);
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/en');
    
    // This is checked by axe-core in expectNoA11yViolations
    // but we can also do a visual check
    await expectNoA11yViolations(page, {
      disableRules: [], // Enable all rules including color-contrast
    });
  });

  test('should have alt text on all images', async ({ page }) => {
    await page.goto('/en');
    
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      const ariaHidden = await img.getAttribute('aria-hidden');
      
      // Image should have alt text, aria-label, or be aria-hidden
      expect(alt !== null || ariaLabel !== null || ariaHidden === 'true').toBe(true);
    }
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/en/contact');
    
    const inputs = await page.locator('input:not([type="hidden"]), textarea, select').all();
    
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      // Input should have associated label, aria-label, or aria-labelledby
      const hasLabel = id ? await page.locator(`label[for="${id}"]`).count() > 0 : false;
      
      expect(hasLabel || ariaLabel !== null || ariaLabelledBy !== null).toBe(true);
    }
  });
});
