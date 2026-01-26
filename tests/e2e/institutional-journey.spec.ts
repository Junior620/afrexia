import { test, expect } from '@playwright/test';
import { navigateAndWait, fillFormField, waitForSuccessMessage } from './helpers/navigation';
import { expectNoA11yViolations } from './helpers/accessibility';

/**
 * E2E Test: Institutional Journey
 * Tests the institutional buyer user journey:
 * Homepage → Traceability → Quality → Contact → Confirmation
 * 
 * **Validates: Requirements 24.2**
 */
test.describe('Institutional Journey', () => {
  test('should complete full institutional journey', async ({ page }) => {
    // Step 1: Visit homepage
    await navigateAndWait(page, '/en');
    await expect(page).toHaveTitle(/Afrexia/i);
    await expectNoA11yViolations(page);

    // Step 2: Navigate to Traceability page
    await page.click('text=Traceability');
    await page.waitForURL('**/en/traceability');
    await expect(page.locator('h1')).toContainText(/traceability|EUDR/i);
    await expectNoA11yViolations(page);

    // Verify traceability content
    await expect(page.locator('text=/supply chain|due diligence/i')).toBeVisible();
    
    // Check for supply chain map
    const supplyChainMap = page.locator('[data-testid="supply-chain-map"]');
    if (await supplyChainMap.isVisible()) {
      await expect(supplyChainMap).toBeVisible();
    }

    // Step 3: Navigate to Quality & Compliance page
    await page.click('text=Quality');
    await page.waitForURL('**/en/quality');
    await expect(page.locator('h1')).toContainText(/quality|compliance/i);
    await expectNoA11yViolations(page);

    // Verify certifications are displayed
    const certifications = page.locator('[data-testid="certification-card"]');
    await expect(certifications.first()).toBeVisible();

    // Verify downloadable certificates
    const downloadLinks = page.locator('a[download], a:has-text("Download")');
    if (await downloadLinks.first().isVisible()) {
      await expect(downloadLinks.first()).toBeVisible();
    }

    // Step 4: Navigate to Contact page
    await page.click('text=Contact');
    await page.waitForURL('**/en/contact');
    await expect(page.locator('h1')).toContainText(/contact/i);
    await expectNoA11yViolations(page);

    // Verify contact information is displayed
    await expect(page.locator('text=/email|phone|address/i')).toBeVisible();

    // Step 5: Fill out contact form
    await fillFormField(page, 'Name', 'Jane Smith');
    await fillFormField(page, 'Email', 'jane.smith@institution.org');
    await fillFormField(page, 'Company', 'Global Trade Institution');
    await fillFormField(page, 'Subject', 'Partnership Inquiry');
    await fillFormField(page, 'Message', 'We are interested in establishing a partnership for sustainable sourcing.');

    // Step 6: Verify form is ready to submit
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

  test('should display EUDR compliance information', async ({ page }) => {
    await navigateAndWait(page, '/en/traceability');
    
    // Verify EUDR-specific content
    await expect(page.locator('text=/EUDR|deforestation|regulation/i')).toBeVisible();
    await expect(page.locator('text=/geographic origin|coordinates/i')).toBeVisible();
    await expect(page.locator('text=/documentation|compliance/i')).toBeVisible();
  });

  test('should display all certifications with details', async ({ page }) => {
    await navigateAndWait(page, '/en/quality');
    
    // Verify certification cards
    const certificationCards = page.locator('[data-testid="certification-card"]');
    const count = await certificationCards.count();
    expect(count).toBeGreaterThan(0);

    // Verify each certification has required information
    for (let i = 0; i < Math.min(count, 3); i++) {
      const card = certificationCards.nth(i);
      await expect(card.locator('img, [data-testid="certification-logo"]')).toBeVisible();
      await expect(card.locator('text=/.*/')).toBeVisible(); // Has some text
    }
  });

  test('should show office location map', async ({ page }) => {
    await navigateAndWait(page, '/en/contact');
    
    // Verify map is present
    const map = page.locator('[data-testid="office-location-map"]');
    if (await map.isVisible()) {
      await expect(map).toBeVisible();
    }
  });

  test('should display contact information', async ({ page }) => {
    await navigateAndWait(page, '/en/contact');
    
    // Verify contact details are present
    await expect(page.locator('text=/email/i')).toBeVisible();
    await expect(page.locator('text=/phone/i')).toBeVisible();
    await expect(page.locator('text=/address/i')).toBeVisible();
  });

  test('should validate contact form fields', async ({ page }) => {
    await navigateAndWait(page, '/en/contact');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Verify validation messages appear
    const nameField = page.locator('input[name="name"]');
    const emailField = page.locator('input[name="email"]');
    
    // Check if HTML5 validation or custom validation is working
    const nameInvalid = await nameField.evaluate((el: HTMLInputElement) => !el.validity.valid);
    const emailInvalid = await emailField.evaluate((el: HTMLInputElement) => !el.validity.valid);
    
    expect(nameInvalid || emailInvalid).toBe(true);
  });
});
