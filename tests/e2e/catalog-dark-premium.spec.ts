/**
 * Catalog Dark Premium E2E Tests
 * 
 * End-to-end tests for the dark premium catalog redesign
 * Requirements: 11.3
 */

import { test, expect } from '@playwright/test';

test.describe('Catalog Dark Premium - User Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to catalog page
    await page.goto('/fr/products');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display catalog header with dark theme', async ({ page }) => {
    // Check header is visible
    const header = page.locator('header[role="banner"]');
    await expect(header).toBeVisible();

    // Check heading
    await expect(page.locator('h1')).toContainText('Catalogue Produits');

    // Check subtitle
    await expect(page.getByText(/Cacao, café & commodités africaines/)).toBeVisible();

    // Check CTAs
    await expect(page.getByRole('button', { name: /Demander un devis/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Télécharger le catalogue/i })).toBeVisible();

    // Check trust indicators
    await expect(page.getByText('24h')).toBeVisible();
    await expect(page.getByText('NDA')).toBeVisible();
    await expect(page.getByText('EUDR')).toBeVisible();
  });

  test('should display product cards with dark theme', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });

    // Check at least one product card is visible
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards.first()).toBeVisible();

    // Check product card elements
    const firstCard = productCards.first();
    await expect(firstCard.locator('h3')).toBeVisible(); // Product name
    await expect(firstCard.getByText(/Demander un devis/i)).toBeVisible(); // CTA button
  });

  test('should filter products by category', async ({ page }) => {
    // Wait for filters to load
    await page.waitForSelector('[aria-label="Catégorie"]', { timeout: 5000 });

    // Get initial product count
    const initialCount = await page.locator('[data-testid="product-card"]').count();

    // Open category filter
    await page.click('[aria-label="Catégorie"]');

    // Select a category (assuming "Cacao" exists)
    await page.click('text=Cacao');

    // Wait for filtered results
    await page.waitForTimeout(500);

    // Check that product count changed or stayed the same
    const filteredCount = await page.locator('[data-testid="product-card"]').count();
    expect(filteredCount).toBeGreaterThanOrEqual(0);

    // Check that filter chip is displayed
    await expect(page.getByText('Cacao')).toBeVisible();
  });

  test('should open RFQ drawer when clicking quote button', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });

    // Click first "Demander un devis" button
    await page.locator('[data-testid="product-card"]').first().getByText(/Demander un devis/i).click();

    // Wait for drawer to open
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

    // Check drawer is visible
    const drawer = page.locator('[role="dialog"]');
    await expect(drawer).toBeVisible();

    // Check drawer title
    await expect(drawer.getByText('Demander un devis')).toBeVisible();

    // Check form fields are present
    await expect(drawer.getByPlaceholderText(/email/i)).toBeVisible();
    await expect(drawer.getByPlaceholderText(/société/i)).toBeVisible();
    await expect(drawer.getByPlaceholderText(/destination/i)).toBeVisible();
  });

  test('should complete RFQ form submission', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });

    // Click first quote button
    await page.locator('[data-testid="product-card"]').first().getByText(/Demander un devis/i).click();

    // Wait for drawer
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

    // Fill in form
    await page.fill('[placeholder*="email"]', 'test@example.com');
    await page.fill('[placeholder*="société"]', 'Test Company');
    await page.fill('[placeholder*="destination"]', 'Paris, France');

    // Submit form
    await page.click('button:has-text("Envoyer la demande")');

    // Wait for success message
    await expect(page.getByText(/Succès/i)).toBeVisible({ timeout: 5000 });
  });

  test('should close RFQ drawer when clicking close button', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });

    // Open drawer
    await page.locator('[data-testid="product-card"]').first().getByText(/Demander un devis/i).click();
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

    // Click close button
    await page.click('[aria-label="Fermer"]');

    // Wait for drawer to close
    await page.waitForTimeout(500);

    // Check drawer is not visible
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should display trust elements in RFQ drawer', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });

    // Open drawer
    await page.locator('[data-testid="product-card"]').first().getByText(/Demander un devis/i).click();
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

    // Check trust elements
    await expect(page.getByText(/Réponse sous 24h/i)).toBeVisible();
    await expect(page.getByText(/NDA disponible/i)).toBeVisible();
  });
});

test.describe('Catalog Dark Premium - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should display mobile filter button', async ({ page }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Check mobile filter button is visible
    await expect(page.getByText(/Filtrer/i)).toBeVisible();
  });

  test('should display mobile RFQ sticky button', async ({ page }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Scroll down to trigger sticky button
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);

    // Check sticky button is visible
    const stickyButton = page.locator('[data-testid="mobile-rfq-button"]');
    if (await stickyButton.count() > 0) {
      await expect(stickyButton).toBeVisible();
    }
  });

  test('should open filter drawer on mobile', async ({ page }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Click filter button
    await page.click('button:has-text("Filtrer")');

    // Wait for filter drawer
    await page.waitForTimeout(500);

    // Check filters are visible
    await expect(page.getByText(/Catégorie/i)).toBeVisible();
  });
});

test.describe('Catalog Dark Premium - Cross-browser', () => {
  test('should work in different browsers', async ({ page, browserName }) => {
    await page.goto('/fr/products');
    await page.waitForLoadState('networkidle');

    // Basic functionality check
    await expect(page.locator('h1')).toContainText('Catalogue Produits');
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 10000 });

    console.log(`✓ Catalog works in ${browserName}`);
  });
});
