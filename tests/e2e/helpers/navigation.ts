import { Page, expect } from '@playwright/test';

/**
 * Navigate to a page and wait for it to load
 * @param page - Playwright page object
 * @param path - Path to navigate to (e.g., '/en/products')
 */
export async function navigateAndWait(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
}

/**
 * Switch language and verify the page updates
 * @param page - Playwright page object
 * @param targetLocale - Target locale ('fr', 'en', 'es', 'de', or 'ru')
 */
export async function switchLanguage(page: Page, targetLocale: 'fr' | 'en' | 'es' | 'de' | 'ru') {
  // Click the language switcher button to open dropdown
  const languageSwitcherButton = page.locator('button[aria-label="Select language"]');
  await languageSwitcherButton.click();
  
  // Wait for dropdown to be visible
  await page.locator('[role="menu"]').waitFor({ state: 'visible' });
  
  // Click the target locale in the dropdown
  const localeNames: Record<string, string> = {
    fr: 'Français',
    en: 'English',
    es: 'Español',
    de: 'Deutsch',
    ru: 'Русский',
  };
  
  await page.locator(`[role="menuitem"]:has-text("${localeNames[targetLocale]}")`).click();
  
  // Wait for navigation
  await page.waitForURL(`**/${targetLocale}/**`);
  await page.waitForLoadState('networkidle');
}

/**
 * Fill out a form field
 * @param page - Playwright page object
 * @param label - Label text or aria-label
 * @param value - Value to fill
 */
export async function fillFormField(page: Page, label: string, value: string) {
  const field = page.locator(`input[aria-label="${label}"]`).or(
    page.locator(`label:has-text("${label}") + input`)
  ).or(
    page.locator(`textarea[aria-label="${label}"]`)
  ).or(
    page.locator(`label:has-text("${label}") + textarea`)
  );

  await field.fill(value);
}

/**
 * Wait for a success message to appear
 * @param page - Playwright page object
 * @param timeout - Optional timeout in milliseconds
 */
export async function waitForSuccessMessage(page: Page, timeout = 10000) {
  await expect(
    page.locator('[role="alert"]').or(
      page.locator('.success-message').or(
        page.locator('text=/success|submitted|sent/i')
      )
    )
  ).toBeVisible({ timeout });
}
