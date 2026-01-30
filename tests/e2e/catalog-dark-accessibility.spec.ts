/**
 * Catalog Dark Premium Accessibility Tests
 * 
 * Automated accessibility tests using axe-core
 * Requirements: 11.4, 6.1-6.9
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Catalog Dark Premium - Accessibility', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Log violations if any
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Accessibility violations found:');
      accessibilityScanResults.violations.forEach((violation) => {
        console.log(`- ${violation.id}: ${violation.description}`);
        console.log(`  Impact: ${violation.impact}`);
        console.log(`  Help: ${violation.helpUrl}`);
      });
    }

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Check H1 exists and is unique
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);

    // Check H1 content
    await expect(page.locator('h1')).toContainText('Catalogue Produits');
  });

  test('should have proper ARIA labels on interactive elements', async ({ page }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Check header has banner role
    const header = page.locator('header[role="banner"]');
    await expect(header).toBeVisible();

    // Check buttons have accessible names
    const primaryButton = page.getByRole('button', { name: /Demander un devis/i });
    await expect(primaryButton).toBeVisible();

    const secondaryButton = page.getByRole('button', { name: /Télécharger le catalogue/i });
    await expect(secondaryButton).toBeVisible();
  });

  test('should have sufficient color contrast (WCAG AA)', async ({ page }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Run axe scan specifically for color contrast
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast'
    );

    if (contrastViolations.length > 0) {
      console.log('Color contrast violations:');
      contrastViolations.forEach((violation) => {
        console.log(`- ${violation.description}`);
        violation.nodes.forEach((node) => {
          console.log(`  Element: ${node.html}`);
          console.log(`  Failure: ${node.failureSummary}`);
        });
      });
    }

    expect(contrastViolations).toEqual([]);
  });

  test('should have proper form labels and associations', async ({ page }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Open RFQ drawer
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });
    await page.locator('[data-testid="product-card"]').first().getByText(/Demander un devis/i).click();
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

    // Check form inputs have labels
    const emailInput = page.locator('[placeholder*="email"]');
    await expect(emailInput).toBeVisible();

    const companyInput = page.locator('[placeholder*="société"]');
    await expect(companyInput).toBeVisible();

    // Run axe scan on the form
    const formScanResults = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const labelViolations = formScanResults.violations.filter(
      (v) => v.id === 'label' || v.id === 'label-title-only'
    );

    expect(labelViolations).toEqual([]);
  });

  test('should have proper focus indicators', async ({ page }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Tab to first interactive element
    await page.keyboard.press('Tab');

    // Check that focused element is visible
    const focusedElement = await page.evaluateHandle(() => document.activeElement);
    const isVisible = await page.evaluate((el) => {
      if (!el) return false;
      const rect = (el as Element).getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }, focusedElement);

    expect(isVisible).toBe(true);
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Tab through interactive elements
    await page.keyboard.press('Tab'); // First button
    await page.keyboard.press('Tab'); // Second button
    await page.keyboard.press('Tab'); // Filter or product card

    // Check that focus moved
    const focusedElement = await page.evaluateHandle(() => document.activeElement);
    const tagName = await page.evaluate((el) => (el as Element)?.tagName, focusedElement);

    // Should be on an interactive element (button, input, link, etc.)
    expect(['BUTTON', 'A', 'INPUT', 'SELECT']).toContain(tagName);
  });

  test('should have proper alt text for images', async ({ page }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Wait for product images to load
    await page.waitForSelector('[data-testid="product-card"] img', { timeout: 10000 });

    // Check all images have alt text
    const images = page.locator('[data-testid="product-card"] img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt?.length).toBeGreaterThan(0);
    }
  });

  test('should have proper touch target sizes on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Check button sizes
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const box = await button.boundingBox();

      if (box) {
        // WCAG 2.1 requires minimum 44x44px touch targets
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('should have semantic HTML structure', async ({ page }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Check for semantic elements
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();

    // Check header has banner role
    const header = page.locator('header[role="banner"]');
    await expect(header).toBeVisible();
  });

  test('should have proper ARIA live regions for dynamic content', async ({ page }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Check for ARIA live regions (product count)
    const liveRegions = page.locator('[aria-live="polite"]');
    const count = await liveRegions.count();

    // Should have at least one live region for product count
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Catalog Dark Premium - Keyboard Navigation', () => {
  test('should navigate through filters using keyboard', async ({ page }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Tab to filters
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Press Enter to open a filter dropdown
    await page.keyboard.press('Enter');

    // Wait for dropdown to open
    await page.waitForTimeout(300);

    // Arrow down to select an option
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // Check that filter was applied
    await page.waitForTimeout(500);
  });

  test('should close RFQ drawer with Escape key', async ({ page }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Open RFQ drawer
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });
    await page.locator('[data-testid="product-card"]').first().getByText(/Demander un devis/i).click();
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

    // Press Escape
    await page.keyboard.press('Escape');

    // Wait for drawer to close
    await page.waitForTimeout(500);

    // Check drawer is not visible
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should trap focus within RFQ drawer', async ({ page }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Open RFQ drawer
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });
    await page.locator('[data-testid="product-card"]').first().getByText(/Demander un devis/i).click();
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

    // Tab through elements in drawer
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
    }

    // Check that focus is still within the drawer
    const focusedElement = await page.evaluateHandle(() => document.activeElement);
    const isInDrawer = await page.evaluate((el) => {
      const drawer = document.querySelector('[role="dialog"]');
      return drawer?.contains(el as Node) || false;
    }, focusedElement);

    expect(isInDrawer).toBe(true);
  });
});
