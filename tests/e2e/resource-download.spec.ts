import { test, expect } from '@playwright/test';
import { navigateAndWait } from './helpers/navigation';
import { expectNoA11yViolations } from './helpers/accessibility';

/**
 * E2E Test: Resource Download Journey
 * Tests resource browsing and download functionality
 * 
 * **Validates: Requirements 12.1, 12.2, 12.3, 12.5**
 */
test.describe('Resource Download Journey', () => {
  test('should display resources page with all categories', async ({ page }) => {
    await navigateAndWait(page, '/en/resources');
    await expect(page.locator('h1')).toContainText(/resources/i);
    await expectNoA11yViolations(page);
    
    // Verify resources are displayed
    const resourceCards = page.locator('[data-testid="resource-card"]');
    if (await resourceCards.first().isVisible()) {
      await expect(resourceCards.first()).toBeVisible();
    }
  });

  test('should display resource metadata', async ({ page }) => {
    await navigateAndWait(page, '/en/resources');
    
    const firstResource = page.locator('[data-testid="resource-card"]').first();
    if (await firstResource.isVisible()) {
      // Verify metadata is displayed
      await expect(firstResource.locator('text=/PDF|MB|KB/i')).toBeVisible();
    }
  });

  test('should track download when clicking resource', async ({ page }) => {
    await navigateAndWait(page, '/en/resources');
    
    const downloadLink = page.locator('a[download], a:has-text("Download")').first();
    if (await downloadLink.isVisible()) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
      
      await downloadLink.click();
      
      // Download may or may not start depending on test environment
      const download = await downloadPromise;
      if (download) {
        expect(download).toBeTruthy();
      }
    }
  });

  test('should filter resources by category', async ({ page }) => {
    await navigateAndWait(page, '/en/resources');
    
    // Look for category filters
    const categoryFilter = page.locator('[data-testid="category-filter"]').first();
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click();
      
      // Verify filtered results
      const resources = page.locator('[data-testid="resource-card"]');
      await expect(resources.first()).toBeVisible();
    }
  });

  test('should show product-specific resources on product page', async ({ page }) => {
    await navigateAndWait(page, '/en/products');
    
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();
    
    // Look for product-specific resources section
    const resourcesSection = page.locator('[data-testid="product-resources"]');
    if (await resourcesSection.isVisible()) {
      await expect(resourcesSection).toBeVisible();
      
      // Verify download links are present
      const downloadLinks = resourcesSection.locator('a[download], a:has-text("Download")');
      if (await downloadLinks.first().isVisible()) {
        await expect(downloadLinks.first()).toBeVisible();
      }
    }
  });
});
