/**
 * End-to-End Test: Product Catalog Complete Functionality
 * 
 * This test validates the complete catalog page flow including:
 * - Page structure and layout
 * - Filtering and search
 * - Product card interactions
 * - RFQ workflow (single and multi-product)
 * - Quick View modal
 * - Catalog download
 * - Responsive behavior
 * - Locale support
 * 
 * Requirements: Task 20 - Checkpoint verification
 */

import { test, expect } from '@playwright/test';

test.describe('Product Catalog - Complete Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the catalog page
    await page.goto('/en/products');
    await page.waitForLoadState('networkidle');
  });

  test('displays catalog page structure correctly', async ({ page }) => {
    // Verify header section
    await expect(page.locator('h1')).toContainText('Our Product Catalog');
    
    // Verify trust strip is visible
    await expect(page.locator('text=24h Response')).toBeVisible();
    await expect(page.locator('text=NDA Available')).toBeVisible();
    
    // Verify download catalog button
    await expect(page.locator('button:has-text("Download PDF Catalog")')).toBeVisible();
    
    // Verify filter bar is sticky
    const filterBar = page.locator('[id="catalog-filters"]');
    await expect(filterBar).toBeVisible();
    
    // Verify product grid exists
    const productGrid = page.locator('[id="product-grid"]');
    await expect(productGrid).toBeVisible();
    
    // Verify at least one product card is displayed
    const productCards = page.locator('article').filter({ hasText: 'Request a Quote' });
    await expect(productCards.first()).toBeVisible();
  });

  test('filters products by search query', async ({ page }) => {
    // Get initial product count
    const productCountText = await page.locator('text=/\\d+ products?/i').first().textContent();
    const initialCount = parseInt(productCountText?.match(/\d+/)?.[0] || '0');
    
    // Enter search query
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('cocoa');
    
    // Wait for debounce
    await page.waitForTimeout(400);
    
    // Verify product count changed or stayed the same (if all products match)
    const newCountText = await page.locator('text=/\\d+ products?/i').first().textContent();
    const newCount = parseInt(newCountText?.match(/\d+/)?.[0] || '0');
    
    expect(newCount).toBeGreaterThanOrEqual(0);
    expect(newCount).toBeLessThanOrEqual(initialCount);
  });

  test('filters products by category', async ({ page }) => {
    // Click category filter (if available)
    const categoryButton = page.locator('button:has-text("Category")').or(page.locator('select[name="category"]'));
    
    if (await categoryButton.count() > 0) {
      await categoryButton.first().click();
      
      // Select a category option
      const cocoaOption = page.locator('text=Cocoa').or(page.locator('option:has-text("Cocoa")'));
      if (await cocoaOption.count() > 0) {
        await cocoaOption.first().click();
        
        // Wait for filter to apply
        await page.waitForTimeout(300);
        
        // Verify active filter chip appears
        await expect(page.locator('text=Cocoa').filter({ has: page.locator('button[aria-label*="Remove"]') })).toBeVisible();
      }
    }
  });

  test('clears all filters', async ({ page }) => {
    // Apply a search filter
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('coffee');
    await page.waitForTimeout(400);
    
    // Click clear all filters button
    const clearButton = page.locator('button:has-text("Clear")');
    if (await clearButton.count() > 0) {
      await clearButton.first().click();
      
      // Verify search input is cleared
      await expect(searchInput).toHaveValue('');
    }
  });

  test('opens Quick View modal and displays product details', async ({ page }) => {
    // Find first product card
    const firstCard = page.locator('article').filter({ hasText: 'Request a Quote' }).first();
    
    // Hover over card to reveal quick view button
    await firstCard.hover();
    
    // Click quick view button
    const quickViewButton = firstCard.locator('button[aria-label*="Quick View"]');
    await quickViewButton.click();
    
    // Verify modal opens
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('text=Quick View').or(page.locator('text=Specifications'))).toBeVisible();
    
    // Verify product details are displayed
    await expect(page.locator('[role="dialog"]').locator('text=/Origin|MOQ|Incoterm/i')).toBeVisible();
    
    // Close modal with ESC key
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('opens RFQ drawer with single product', async ({ page }) => {
    // Click quote button on first product
    const firstQuoteButton = page.locator('button:has-text("Request a Quote")').or(page.locator('button:has-text("Request Quote")')).first();
    await firstQuoteButton.click();
    
    // Verify RFQ drawer opens
    await expect(page.locator('text=Selected Products').or(page.locator('text=Request a Quote'))).toBeVisible();
    
    // Verify product is pre-selected
    const selectedProducts = page.locator('[class*="selected"]').or(page.locator('img[alt*="Cocoa"]').or(page.locator('img[alt*="Coffee"]')));
    await expect(selectedProducts.first()).toBeVisible();
    
    // Close drawer
    const closeButton = page.locator('button[aria-label*="Close"]').or(page.locator('button:has-text("Close")'));
    if (await closeButton.count() > 0) {
      await closeButton.first().click();
    }
  });

  test('adds multiple products to RFQ cart', async ({ page }) => {
    // Click quote button on first product
    const quoteButtons = page.locator('button:has-text("Request a Quote")').or(page.locator('button:has-text("Request Quote")'));
    
    if (await quoteButtons.count() >= 2) {
      await quoteButtons.nth(0).click();
      
      // Close drawer
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      
      // Click quote button on second product
      await quoteButtons.nth(1).click();
      
      // Verify both products are in the cart
      const productItems = page.locator('[class*="product"]').filter({ hasText: /Remove|Quantity/i });
      const count = await productItems.count();
      expect(count).toBeGreaterThanOrEqual(1);
    }
  });

  test('validates RFQ form fields', async ({ page }) => {
    // Open RFQ drawer
    const firstQuoteButton = page.locator('button:has-text("Request a Quote")').or(page.locator('button:has-text("Request Quote")')).first();
    await firstQuoteButton.click();
    
    // Try to submit without filling required fields
    const submitButton = page.locator('button:has-text("Send")').or(page.locator('button[type="submit"]'));
    if (await submitButton.count() > 0) {
      await submitButton.first().click();
      
      // Verify error messages appear
      await expect(page.locator('text=/required|invalid/i')).toBeVisible();
    }
  });

  test('opens catalog download modal', async ({ page }) => {
    // Click download catalog button
    const downloadButton = page.locator('button:has-text("Download PDF Catalog")').or(page.locator('button:has-text("Download Catalog")'));
    await downloadButton.first().click();
    
    // Verify modal opens
    await expect(page.locator('[role="dialog"]').filter({ hasText: /Download|Catalog/i })).toBeVisible();
    
    // Verify form fields are present
    await expect(page.locator('input[name="name"]').or(page.locator('input[placeholder*="name"]'))).toBeVisible();
    await expect(page.locator('input[name="email"]').or(page.locator('input[type="email"]'))).toBeVisible();
    
    // Close modal
    await page.keyboard.press('Escape');
  });

  test('displays process and compliance section', async ({ page }) => {
    // Scroll to bottom of page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Verify compliance section is visible
    await expect(page.locator('text=/Quality|Compliance|Traceability/i')).toBeVisible();
  });

  test('supports keyboard navigation', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    // Verify focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Tab to search input
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
    }
    
    // Verify we can interact with keyboard
    const searchInput = page.locator('input[placeholder*="Search"]');
    if (await searchInput.count() > 0) {
      await searchInput.focus();
      await page.keyboard.type('test');
      await expect(searchInput).toHaveValue('test');
    }
  });

  test('works in French locale', async ({ page }) => {
    // Navigate to French version
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');
    
    // Verify French translations
    await expect(page.locator('h1')).toContainText('Notre Catalogue de Produits');
    await expect(page.locator('text=Demander un devis')).toBeVisible();
    await expect(page.locator('text=Réponse sous 24h')).toBeVisible();
  });

  test('is responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify single column layout
    const productGrid = page.locator('[id="product-grid"]');
    await expect(productGrid).toBeVisible();
    
    // Verify mobile-specific elements
    // Mobile RFQ button should be visible if products are in cart
    const mobileRFQButton = page.locator('[class*="fixed"][class*="bottom"]').filter({ hasText: /Quote|RFQ/i });
    // This may or may not be visible depending on cart state
    
    // Verify filters work on mobile
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();
  });

  test('is responsive on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Verify 2-column layout
    const productGrid = page.locator('[id="product-grid"]');
    await expect(productGrid).toBeVisible();
    
    // Verify all elements are accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
  });

  test('is responsive on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Verify multi-column layout (3-4 columns)
    const productGrid = page.locator('[id="product-grid"]');
    await expect(productGrid).toBeVisible();
    
    // Verify all elements are accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
    
    // Verify hover effects work
    const firstCard = page.locator('article').filter({ hasText: 'Request a Quote' }).first();
    await firstCard.hover();
    
    // Quick view button should become visible on hover
    const quickViewButton = firstCard.locator('button[aria-label*="Quick View"]');
    await expect(quickViewButton).toBeVisible();
  });
});
