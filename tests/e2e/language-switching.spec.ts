import { test, expect } from '@playwright/test';
import { navigateAndWait, switchLanguage } from './helpers/navigation';
import { expectNoA11yViolations } from './helpers/accessibility';

/**
 * E2E Test: Language Switching Journey
 * Tests language switching functionality across pages
 * 
 * **Validates: Requirements 1.2, 10.3, 10.4, 10.8**
 */
test.describe('Language Switching Journey', () => {
  test('should switch language and maintain page context', async ({ page }) => {
    // Start on English homepage
    await navigateAndWait(page, '/en');
    await expect(page).toHaveURL(/\/en/);
    
    // Switch to French
    await switchLanguage(page, 'fr');
    await expect(page).toHaveURL(/\/fr/);
    await expectNoA11yViolations(page);
    
    // Switch back to English
    await switchLanguage(page, 'en');
    await expect(page).toHaveURL(/\/en/);
  });

  test('should maintain page context when switching language on product page', async ({ page }) => {
    // Navigate to a product page in English
    await navigateAndWait(page, '/en/products');
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();
    
    const englishUrl = page.url();
    const productSlug = englishUrl.split('/').pop();
    
    // Switch to French
    await switchLanguage(page, 'fr');
    
    // Should still be on a product page (same product, French version)
    await expect(page).toHaveURL(/\/fr\/products\//);
  });

  test('should persist language preference across navigation', async ({ page }) => {
    // Set language to French
    await navigateAndWait(page, '/fr');
    
    // Navigate to different pages
    await page.click('text=Produits');
    await expect(page).toHaveURL(/\/fr\/products/);
    
    await page.click('text=Contact');
    await expect(page).toHaveURL(/\/fr\/contact/);
    
    // Language should remain French
    await expect(page).toHaveURL(/\/fr\//);
  });

  test('should update all content when switching language', async ({ page }) => {
    await navigateAndWait(page, '/en');
    
    // Check English content
    await expect(page.locator('text=Products')).toBeVisible();
    
    // Switch to French
    await switchLanguage(page, 'fr');
    
    // Check French content
    await expect(page.locator('text=Produits')).toBeVisible();
  });
});
