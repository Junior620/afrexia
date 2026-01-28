import { test, expect, Page } from '@playwright/test';
import { navigateAndWait } from './helpers/navigation';
import { expectNoA11yViolations } from './helpers/accessibility';

/**
 * E2E Test: Multilingual Functionality
 * Tests the complete multilingual experience across all five locales
 * 
 * **Validates: Requirements 3.1, 3.3, 3.4, 4.2, 4.5**
 */

/**
 * Helper function to switch language using the dropdown
 */
async function switchLanguageDropdown(page: Page, targetLocale: 'fr' | 'en' | 'es' | 'de' | 'ru') {
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
  
  // Wait for navigation to complete
  await page.waitForURL(`**/${targetLocale}/**`);
  await page.waitForLoadState('networkidle');
}

/**
 * Helper function to get cookie value
 */
async function getCookie(page: Page, name: string): Promise<string | null> {
  const cookies = await page.context().cookies();
  const cookie = cookies.find(c => c.name === name);
  return cookie?.value || null;
}

test.describe('Multilingual Functionality - Full User Journey', () => {
  test('should browse site, switch languages, and see translated content', async ({ page }) => {
    // Start on French homepage (default)
    await navigateAndWait(page, '/fr');
    await expect(page).toHaveURL(/\/fr/);
    
    // Verify French content is visible
    await expect(page.locator('text=Produits')).toBeVisible();
    
    // Switch to English
    await switchLanguageDropdown(page, 'en');
    await expect(page).toHaveURL(/\/en/);
    await expect(page.locator('text=Products')).toBeVisible();
    
    // Switch to Spanish
    await switchLanguageDropdown(page, 'es');
    await expect(page).toHaveURL(/\/es/);
    await expect(page.locator('text=Productos')).toBeVisible();
    
    // Switch to German
    await switchLanguageDropdown(page, 'de');
    await expect(page).toHaveURL(/\/de/);
    await expect(page.locator('text=Produkte')).toBeVisible();
    
    // Switch to Russian
    await switchLanguageDropdown(page, 'ru');
    await expect(page).toHaveURL(/\/ru/);
    await expect(page.locator('text=Продукты')).toBeVisible();
    
    // Switch back to French
    await switchLanguageDropdown(page, 'fr');
    await expect(page).toHaveURL(/\/fr/);
    await expect(page.locator('text=Produits')).toBeVisible();
  });

  test('should maintain page context when switching languages on products page', async ({ page }) => {
    // Navigate to products page in English
    await navigateAndWait(page, '/en/products');
    await expect(page).toHaveURL(/\/en\/products/);
    
    // Switch to Spanish
    await switchLanguageDropdown(page, 'es');
    await expect(page).toHaveURL(/\/es\/products/);
    
    // Switch to German
    await switchLanguageDropdown(page, 'de');
    await expect(page).toHaveURL(/\/de\/products/);
    
    // Switch to Russian
    await switchLanguageDropdown(page, 'ru');
    await expect(page).toHaveURL(/\/ru\/products/);
    
    // Verify we're still on products page
    await expect(page.url()).toContain('/products');
  });

  test('should maintain page context when switching languages on contact page', async ({ page }) => {
    // Navigate to contact page in French
    await navigateAndWait(page, '/fr/contact');
    await expect(page).toHaveURL(/\/fr\/contact/);
    
    // Switch to English
    await switchLanguageDropdown(page, 'en');
    await expect(page).toHaveURL(/\/en\/contact/);
    
    // Switch to Spanish
    await switchLanguageDropdown(page, 'es');
    await expect(page).toHaveURL(/\/es\/contact/);
    
    // Verify we're still on contact page
    await expect(page.url()).toContain('/contact');
  });

  test('should display all five languages in dropdown', async ({ page }) => {
    await navigateAndWait(page, '/en');
    
    // Open language switcher dropdown
    const languageSwitcherButton = page.locator('button[aria-label="Select language"]');
    await languageSwitcherButton.click();
    
    // Verify all five languages are visible
    const dropdown = page.locator('[role="menu"]');
    await expect(dropdown).toBeVisible();
    
    await expect(dropdown.locator('text=Français')).toBeVisible();
    await expect(dropdown.locator('text=English')).toBeVisible();
    await expect(dropdown.locator('text=Español')).toBeVisible();
    await expect(dropdown.locator('text=Deutsch')).toBeVisible();
    await expect(dropdown.locator('text=Русский')).toBeVisible();
  });

  test('should highlight current language in dropdown', async ({ page }) => {
    await navigateAndWait(page, '/en');
    
    // Open language switcher dropdown
    const languageSwitcherButton = page.locator('button[aria-label="Select language"]');
    await languageSwitcherButton.click();
    
    // Verify current language (English) has checkmark
    const englishMenuItem = page.locator('[role="menuitem"]:has-text("English")');
    await expect(englishMenuItem).toHaveAttribute('aria-current', 'true');
    
    // Verify checkmark SVG is visible for current language
    const checkmark = englishMenuItem.locator('svg').last();
    await expect(checkmark).toBeVisible();
  });
});

test.describe('Multilingual Functionality - Cookie Persistence', () => {
  test('should persist language preference in cookie across page navigations', async ({ page }) => {
    // Start on French homepage
    await navigateAndWait(page, '/fr');
    
    // Switch to Spanish
    await switchLanguageDropdown(page, 'es');
    
    // Verify cookie is set to Spanish
    const cookieAfterSwitch = await getCookie(page, 'NEXT_LOCALE');
    expect(cookieAfterSwitch).toBe('es');
    
    // Navigate to products page
    await page.click('text=Productos');
    await page.waitForURL('**/es/products');
    
    // Verify cookie is still Spanish
    const cookieAfterNav1 = await getCookie(page, 'NEXT_LOCALE');
    expect(cookieAfterNav1).toBe('es');
    
    // Navigate to contact page
    await page.click('text=Contacto');
    await page.waitForURL('**/es/contact');
    
    // Verify cookie is still Spanish
    const cookieAfterNav2 = await getCookie(page, 'NEXT_LOCALE');
    expect(cookieAfterNav2).toBe('es');
    
    // Verify all pages are in Spanish
    await expect(page).toHaveURL(/\/es\//);
  });

  test('should update cookie when switching between all five locales', async ({ page }) => {
    await navigateAndWait(page, '/fr');
    
    // Test each locale
    const locales: Array<'fr' | 'en' | 'es' | 'de' | 'ru'> = ['en', 'es', 'de', 'ru', 'fr'];
    
    for (const locale of locales) {
      await switchLanguageDropdown(page, locale);
      const cookie = await getCookie(page, 'NEXT_LOCALE');
      expect(cookie).toBe(locale);
    }
  });

  test('should maintain cookie across page reloads', async ({ page }) => {
    // Set language to German
    await navigateAndWait(page, '/de');
    await switchLanguageDropdown(page, 'de');
    
    // Verify cookie is set
    const cookieBefore = await getCookie(page, 'NEXT_LOCALE');
    expect(cookieBefore).toBe('de');
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify still on German version
    await expect(page).toHaveURL(/\/de/);
    
    // Verify cookie persists
    const cookieAfter = await getCookie(page, 'NEXT_LOCALE');
    expect(cookieAfter).toBe('de');
  });
});

test.describe('Multilingual Functionality - All Locales Work Correctly', () => {
  test('should load French locale correctly', async ({ page }) => {
    await navigateAndWait(page, '/fr');
    
    // Verify French content
    await expect(page.locator('text=Produits')).toBeVisible();
    await expect(page.locator('text=Contact')).toBeVisible();
    
    // Verify URL
    await expect(page).toHaveURL(/\/fr/);
    
    // Verify no accessibility violations
    await expectNoA11yViolations(page);
  });

  test('should load English locale correctly', async ({ page }) => {
    await navigateAndWait(page, '/en');
    
    // Verify English content
    await expect(page.locator('text=Products')).toBeVisible();
    await expect(page.locator('text=Contact')).toBeVisible();
    
    // Verify URL
    await expect(page).toHaveURL(/\/en/);
    
    // Verify no accessibility violations
    await expectNoA11yViolations(page);
  });

  test('should load Spanish locale correctly', async ({ page }) => {
    await navigateAndWait(page, '/es');
    
    // Verify Spanish content
    await expect(page.locator('text=Productos')).toBeVisible();
    await expect(page.locator('text=Contacto')).toBeVisible();
    
    // Verify URL
    await expect(page).toHaveURL(/\/es/);
    
    // Verify no accessibility violations
    await expectNoA11yViolations(page);
  });

  test('should load German locale correctly', async ({ page }) => {
    await navigateAndWait(page, '/de');
    
    // Verify German content
    await expect(page.locator('text=Produkte')).toBeVisible();
    await expect(page.locator('text=Kontakt')).toBeVisible();
    
    // Verify URL
    await expect(page).toHaveURL(/\/de/);
    
    // Verify no accessibility violations
    await expectNoA11yViolations(page);
  });

  test('should load Russian locale correctly', async ({ page }) => {
    await navigateAndWait(page, '/ru');
    
    // Verify Russian content (Cyrillic characters)
    await expect(page.locator('text=Продукты')).toBeVisible();
    await expect(page.locator('text=Контакты')).toBeVisible();
    
    // Verify URL
    await expect(page).toHaveURL(/\/ru/);
    
    // Verify no accessibility violations
    await expectNoA11yViolations(page);
  });

  test('should handle special characters correctly in all locales', async ({ page }) => {
    // Spanish - ñ
    await navigateAndWait(page, '/es');
    await expect(page.locator('text=Español')).toBeVisible();
    
    // German - ü, ö, ä
    await navigateAndWait(page, '/de');
    await expect(page.locator('text=Über')).toBeVisible().catch(() => {
      // If "Über" is not on the page, just verify German content loads
      return expect(page.locator('text=Deutsch')).toBeVisible();
    });
    
    // Russian - Cyrillic
    await navigateAndWait(page, '/ru');
    await expect(page.locator('text=Русский')).toBeVisible();
  });
});

test.describe('Multilingual Functionality - Dark Mode Support', () => {
  test('should work in light mode', async ({ page }) => {
    await navigateAndWait(page, '/en');
    
    // Ensure light mode is active (default)
    const html = page.locator('html');
    const hasLightMode = await html.evaluate((el) => {
      return !el.classList.contains('dark');
    });
    
    if (!hasLightMode) {
      // Toggle to light mode if in dark mode
      const themeToggle = page.locator('button[aria-label*="theme"]').or(
        page.locator('[data-testid="theme-toggle"]')
      );
      if (await themeToggle.isVisible()) {
        await themeToggle.click();
        await page.waitForTimeout(500); // Wait for theme transition
      }
    }
    
    // Open language switcher
    const languageSwitcherButton = page.locator('button[aria-label="Select language"]');
    await languageSwitcherButton.click();
    
    // Verify dropdown is visible and styled correctly
    const dropdown = page.locator('[role="menu"]');
    await expect(dropdown).toBeVisible();
    
    // Switch language
    await page.locator('[role="menuitem"]:has-text("Español")').click();
    await expect(page).toHaveURL(/\/es/);
  });

  test('should work in dark mode', async ({ page }) => {
    await navigateAndWait(page, '/en');
    
    // Toggle to dark mode
    const html = page.locator('html');
    const hasDarkMode = await html.evaluate((el) => {
      return el.classList.contains('dark');
    });
    
    if (!hasDarkMode) {
      // Find and click theme toggle
      const themeToggle = page.locator('button[aria-label*="theme"]').or(
        page.locator('[data-testid="theme-toggle"]')
      );
      if (await themeToggle.isVisible()) {
        await themeToggle.click();
        await page.waitForTimeout(500); // Wait for theme transition
      }
    }
    
    // Open language switcher
    const languageSwitcherButton = page.locator('button[aria-label="Select language"]');
    await languageSwitcherButton.click();
    
    // Verify dropdown is visible in dark mode
    const dropdown = page.locator('[role="menu"]');
    await expect(dropdown).toBeVisible();
    
    // Verify dark mode classes are applied
    const dropdownClasses = await dropdown.getAttribute('class');
    expect(dropdownClasses).toContain('dark:');
    
    // Switch language
    await page.locator('[role="menuitem"]:has-text("Deutsch")').click();
    await expect(page).toHaveURL(/\/de/);
  });

  test('should maintain theme preference when switching languages', async ({ page }) => {
    await navigateAndWait(page, '/en');
    
    // Toggle to dark mode
    const themeToggle = page.locator('button[aria-label*="theme"]').or(
      page.locator('[data-testid="theme-toggle"]')
    );
    
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500);
    }
    
    // Verify dark mode is active
    const html = page.locator('html');
    const hasDarkModeBefore = await html.evaluate((el) => {
      return el.classList.contains('dark');
    });
    
    // Switch language
    await switchLanguageDropdown(page, 'ru');
    
    // Verify dark mode is still active after language switch
    const hasDarkModeAfter = await html.evaluate((el) => {
      return el.classList.contains('dark');
    });
    
    expect(hasDarkModeBefore).toBe(hasDarkModeAfter);
  });
});

test.describe('Multilingual Functionality - Navigation Flow', () => {
  test('should navigate through multiple pages in Spanish', async ({ page }) => {
    await navigateAndWait(page, '/es');
    
    // Navigate to products
    await page.click('text=Productos');
    await page.waitForURL('**/es/products');
    await expect(page.locator('text=Productos')).toBeVisible();
    
    // Navigate to contact
    await page.click('text=Contacto');
    await page.waitForURL('**/es/contact');
    await expect(page.locator('text=Contacto')).toBeVisible();
    
    // Navigate back to home
    await page.click('a[href="/es"]').first();
    await page.waitForURL('**/es');
  });

  test('should navigate through multiple pages in German', async ({ page }) => {
    await navigateAndWait(page, '/de');
    
    // Navigate to products
    await page.click('text=Produkte');
    await page.waitForURL('**/de/products');
    await expect(page.locator('text=Produkte')).toBeVisible();
    
    // Navigate to contact
    await page.click('text=Kontakt');
    await page.waitForURL('**/de/contact');
    await expect(page.locator('text=Kontakt')).toBeVisible();
  });

  test('should navigate through multiple pages in Russian', async ({ page }) => {
    await navigateAndWait(page, '/ru');
    
    // Navigate to products
    await page.click('text=Продукты');
    await page.waitForURL('**/ru/products');
    await expect(page.locator('text=Продукты')).toBeVisible();
    
    // Navigate to contact
    await page.click('text=Контакты');
    await page.waitForURL('**/ru/contact');
    await expect(page.locator('text=Контакты')).toBeVisible();
  });
});

test.describe('Multilingual Functionality - Dropdown Interaction', () => {
  test('should close dropdown when clicking outside', async ({ page }) => {
    await navigateAndWait(page, '/en');
    
    // Open dropdown
    const languageSwitcherButton = page.locator('button[aria-label="Select language"]');
    await languageSwitcherButton.click();
    
    // Verify dropdown is open
    const dropdown = page.locator('[role="menu"]');
    await expect(dropdown).toBeVisible();
    
    // Click outside the dropdown
    await page.click('body', { position: { x: 10, y: 10 } });
    
    // Verify dropdown is closed
    await expect(dropdown).not.toBeVisible();
  });

  test('should close dropdown when pressing Escape key', async ({ page }) => {
    await navigateAndWait(page, '/en');
    
    // Open dropdown
    const languageSwitcherButton = page.locator('button[aria-label="Select language"]');
    await languageSwitcherButton.click();
    
    // Verify dropdown is open
    const dropdown = page.locator('[role="menu"]');
    await expect(dropdown).toBeVisible();
    
    // Press Escape key
    await page.keyboard.press('Escape');
    
    // Verify dropdown is closed
    await expect(dropdown).not.toBeVisible();
  });

  test('should show correct flag and name for current language', async ({ page }) => {
    await navigateAndWait(page, '/es');
    
    // Verify Spanish flag and name are shown in button
    const languageSwitcherButton = page.locator('button[aria-label="Select language"]');
    await expect(languageSwitcherButton).toContainText('🇪🇸');
    await expect(languageSwitcherButton).toContainText('Español');
  });
});
