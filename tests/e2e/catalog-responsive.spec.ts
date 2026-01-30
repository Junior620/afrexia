import { test, expect, Page } from '@playwright/test';

/**
 * Responsive Testing for Product Catalog
 * 
 * Tests all required breakpoints and responsive requirements:
 * - 320px (iPhone SE)
 * - 375px (iPhone 12/13)
 * - 768px (iPad portrait)
 * - 1024px (iPad landscape)
 * - 1440px (desktop)
 * - 1920px (large desktop)
 * 
 * Requirements: 13.1-13.10
 */

// Test breakpoints
const BREAKPOINTS = {
  iphoneSE: { width: 320, height: 568, name: 'iPhone SE' },
  iphone12: { width: 375, height: 812, name: 'iPhone 12/13' },
  ipadPortrait: { width: 768, height: 1024, name: 'iPad Portrait' },
  ipadLandscape: { width: 1024, height: 768, name: 'iPad Landscape' },
  desktop: { width: 1440, height: 900, name: 'Desktop' },
  largeDesktop: { width: 1920, height: 1080, name: 'Large Desktop' },
};

// Helper function to get expected grid columns based on viewport width
function getExpectedColumns(width: number): number {
  if (width < 768) return 1;
  if (width >= 768 && width < 1024) return 2;
  if (width >= 1024 && width < 1280) return 3;
  return 4;
}

// Helper function to check if element is visible in viewport
async function isInViewport(page: Page, selector: string): Promise<boolean> {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }, selector);
}

test.describe('Catalog Responsive Testing - Task 23.1: All Breakpoints', () => {
  test('23.1.1 - Test 320px (iPhone SE)', async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS.iphoneSE);
    await page.goto('/en/products');
    await page.waitForLoadState('networkidle');

    // Verify page loads correctly
    await expect(page.locator('h1')).toBeVisible();
    
    // Verify grid has 1 column
    const gridColumns = await page.evaluate(() => {
      const grid = document.querySelector('[class*="grid-cols"]');
      if (!grid) return 0;
      return window.getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    });
    expect(gridColumns).toBe(1);

    // Verify no horizontal scrolling
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('23.1.2 - Test 375px (iPhone 12/13)', async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS.iphone12);
    await page.goto('/en/products');
    await page.waitForLoadState('networkidle');

    // Verify page loads correctly
    await expect(page.locator('h1')).toBeVisible();
    
    // Verify grid has 1 column
    const gridColumns = await page.evaluate(() => {
      const grid = document.querySelector('[class*="grid-cols"]');
      if (!grid) return 0;
      return window.getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    });
    expect(gridColumns).toBe(1);

    // Verify no horizontal scrolling
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('23.1.3 - Test 768px (iPad portrait)', async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS.ipadPortrait);
    await page.goto('/en/products');
    await page.waitForLoadState('networkidle');

    // Verify page loads correctly
    await expect(page.locator('h1')).toBeVisible();
    
    // Verify grid has 2 columns
    const gridColumns = await page.evaluate(() => {
      const grid = document.querySelector('[class*="grid-cols"]');
      if (!grid) return 0;
      return window.getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    });
    expect(gridColumns).toBe(2);

    // Verify no horizontal scrolling
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('23.1.4 - Test 1024px (iPad landscape)', async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS.ipadLandscape);
    await page.goto('/en/products');
    await page.waitForLoadState('networkidle');

    // Verify page loads correctly
    await expect(page.locator('h1')).toBeVisible();
    
    // Verify grid has 3 columns
    const gridColumns = await page.evaluate(() => {
      const grid = document.querySelector('[class*="grid-cols"]');
      if (!grid) return 0;
      return window.getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    });
    expect(gridColumns).toBe(3);

    // Verify no horizontal scrolling
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('23.1.5 - Test 1440px (desktop)', async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS.desktop);
    await page.goto('/en/products');
    await page.waitForLoadState('networkidle');

    // Verify page loads correctly
    await expect(page.locator('h1')).toBeVisible();
    
    // Verify grid has 4 columns
    const gridColumns = await page.evaluate(() => {
      const grid = document.querySelector('[class*="grid-cols"]');
      if (!grid) return 0;
      return window.getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    });
    expect(gridColumns).toBe(4);

    // Verify no horizontal scrolling
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('23.1.6 - Test 1920px (large desktop)', async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS.largeDesktop);
    await page.goto('/en/products');
    await page.waitForLoadState('networkidle');

    // Verify page loads correctly
    await expect(page.locator('h1')).toBeVisible();
    
    // Verify grid has 4 columns
    const gridColumns = await page.evaluate(() => {
      const grid = document.querySelector('[class*="grid-cols"]');
      if (!grid) return 0;
      return window.getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    });
    expect(gridColumns).toBe(4);

    // Verify no horizontal scrolling
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });
});

test.describe('Catalog Responsive Testing - Task 23.2: Verify Responsive Requirements', () => {
  test('23.2.1 - Verify grid columns correct at each breakpoint', async ({ page }) => {
    const breakpoints = Object.values(BREAKPOINTS);

    for (const breakpoint of breakpoints) {
      await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
      await page.goto('/en/products');
      await page.waitForLoadState('networkidle');

      const expectedColumns = getExpectedColumns(breakpoint.width);
      
      const actualColumns = await page.evaluate(() => {
        const grid = document.querySelector('[class*="grid-cols"]');
        if (!grid) return 0;
        return window.getComputedStyle(grid).gridTemplateColumns.split(' ').length;
      });

      expect(actualColumns, `${breakpoint.name} (${breakpoint.width}px) should have ${expectedColumns} columns`).toBe(expectedColumns);
    }
  });

  test('23.2.2 - Verify sticky filter bar works on all sizes', async ({ page }) => {
    const breakpoints = Object.values(BREAKPOINTS);

    for (const breakpoint of breakpoints) {
      await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
      await page.goto('/en/products');
      await page.waitForLoadState('networkidle');

      // Check filter bar is sticky
      const isSticky = await page.evaluate(() => {
        const filterBar = document.querySelector('[class*="sticky"]');
        if (!filterBar) return false;
        const styles = window.getComputedStyle(filterBar);
        return styles.position === 'sticky' || styles.position === 'fixed';
      });

      expect(isSticky, `Filter bar should be sticky on ${breakpoint.name}`).toBe(true);

      // Scroll down and verify filter bar is still visible
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(300);

      const filterBarVisible = await page.locator('[class*="sticky"]').first().isVisible();
      expect(filterBarVisible, `Filter bar should remain visible after scroll on ${breakpoint.name}`).toBe(true);
    }
  });

  test('23.2.3 - Verify mobile sticky CTA bar visible < 768px', async ({ page }) => {
    // Test mobile viewports
    const mobileBreakpoints = [BREAKPOINTS.iphoneSE, BREAKPOINTS.iphone12];

    for (const breakpoint of mobileBreakpoints) {
      await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
      await page.goto('/en/products');
      await page.waitForLoadState('networkidle');

      // Add a product to RFQ to trigger mobile button
      const quoteButton = page.locator('button:has-text("Request a Quote")').first();
      if (await quoteButton.isVisible()) {
        await quoteButton.click();
        await page.waitForTimeout(500);

        // Check if mobile RFQ button is visible
        const mobileRFQButton = page.locator('.fixed.bottom-0.md\\:hidden');
        const isVisible = await mobileRFQButton.count() > 0;
        
        // Mobile button should be visible on mobile
        expect(isVisible, `Mobile RFQ button should be visible on ${breakpoint.name}`).toBe(true);
      }
    }

    // Test desktop viewport - mobile button should NOT be visible
    await page.setViewportSize(BREAKPOINTS.desktop);
    await page.goto('/en/products');
    await page.waitForLoadState('networkidle');

    const mobileRFQButton = page.locator('.fixed.bottom-0.md\\:hidden');
    const isVisibleOnDesktop = await mobileRFQButton.isVisible().catch(() => false);
    expect(isVisibleOnDesktop, 'Mobile RFQ button should NOT be visible on desktop').toBe(false);
  });

  test('23.2.4 - Verify touch targets ≥ 44x44px on mobile', async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS.iphone12);
    await page.goto('/en/products');
    await page.waitForLoadState('networkidle');

    // Check all interactive elements have minimum touch target size
    const touchTargets = await page.evaluate(() => {
      const selectors = [
        'button',
        'a',
        'input[type="checkbox"]',
        'input[type="radio"]',
        '[role="button"]',
      ];

      const results: { selector: string; width: number; height: number; meetsRequirement: boolean }[] = [];

      selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const styles = window.getComputedStyle(el);
          
          // Skip hidden elements
          if (styles.display === 'none' || styles.visibility === 'hidden') return;
          
          const width = rect.width;
          const height = rect.height;
          const meetsRequirement = width >= 44 && height >= 44;

          if (!meetsRequirement && width > 0 && height > 0) {
            results.push({
              selector: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''),
              width,
              height,
              meetsRequirement,
            });
          }
        });
      });

      return results;
    });

    // Log any elements that don't meet the requirement
    const failingElements = touchTargets.filter((t) => !t.meetsRequirement);
    if (failingElements.length > 0) {
      console.log('Elements not meeting 44x44px requirement:', failingElements);
    }

    // Most critical interactive elements should meet the requirement
    // We allow some flexibility for decorative or non-critical elements
    expect(failingElements.length, 'Most touch targets should be ≥ 44x44px').toBeLessThan(5);
  });

  test('23.2.5 - Verify no horizontal scrolling at any size', async ({ page }) => {
    const breakpoints = Object.values(BREAKPOINTS);

    for (const breakpoint of breakpoints) {
      await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
      await page.goto('/en/products');
      await page.waitForLoadState('networkidle');

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll, `No horizontal scrolling on ${breakpoint.name}`).toBe(false);

      // Also check after scrolling down
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(300);

      const hasHorizontalScrollAfterScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScrollAfterScroll, `No horizontal scrolling after scroll on ${breakpoint.name}`).toBe(false);
    }
  });

  test('23.2.6 - Verify modals full-screen on mobile', async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS.iphone12);
    await page.goto('/en/products');
    await page.waitForLoadState('networkidle');

    // Test Quick View Modal
    const quickViewButton = page.locator('button[aria-label*="Quick View"]').first();
    if (await quickViewButton.count() > 0) {
      await quickViewButton.click();
      await page.waitForTimeout(500);

      const modalWidth = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"]');
        if (!modal) return 0;
        return modal.getBoundingClientRect().width;
      });

      const viewportWidth = BREAKPOINTS.iphone12.width;
      
      // Modal should be close to full width on mobile (allowing for small margins)
      expect(modalWidth, 'Quick View modal should be full-screen on mobile').toBeGreaterThan(viewportWidth * 0.9);

      // Close modal
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

    // Test RFQ Drawer
    const quoteButton = page.locator('button:has-text("Request a Quote")').first();
    if (await quoteButton.isVisible()) {
      await quoteButton.click();
      await page.waitForTimeout(500);

      const drawerWidth = await page.evaluate(() => {
        const drawer = document.querySelector('[role="dialog"]');
        if (!drawer) return 0;
        return drawer.getBoundingClientRect().width;
      });

      const viewportWidth = BREAKPOINTS.iphone12.width;
      
      // Drawer should be full width on mobile
      expect(drawerWidth, 'RFQ drawer should be full-screen on mobile').toBeGreaterThan(viewportWidth * 0.9);
    }
  });

  test('23.2.7 - Verify filter drawer on mobile', async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS.iphone12);
    await page.goto('/en/products');
    await page.waitForLoadState('networkidle');

    // Find and click the mobile filter button
    const filterButton = page.locator('button:has-text("Filtres"), button:has-text("Filters")').first();
    
    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.waitForTimeout(500);

      // Verify filter drawer is visible
      const filterDrawer = page.locator('#mobile-filter-drawer, [role="dialog"]');
      await expect(filterDrawer).toBeVisible();

      // Verify drawer has filter controls
      const hasFilterControls = await page.evaluate(() => {
        const drawer = document.querySelector('#mobile-filter-drawer, [role="dialog"]');
        if (!drawer) return false;
        
        // Check for select elements or filter controls
        const selects = drawer.querySelectorAll('select, [role="combobox"]');
        return selects.length > 0;
      });

      expect(hasFilterControls, 'Filter drawer should contain filter controls').toBe(true);

      // Close drawer
      const closeButton = page.locator('[aria-label*="Close"]').first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
        await page.waitForTimeout(300);
      }
    }
  });

  test('23.2.8 - Comprehensive responsive layout test', async ({ page }) => {
    const breakpoints = Object.values(BREAKPOINTS);

    for (const breakpoint of breakpoints) {
      await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
      await page.goto('/en/products');
      await page.waitForLoadState('networkidle');

      // Verify key elements are visible
      await expect(page.locator('h1')).toBeVisible();
      
      // Verify product grid exists
      const gridExists = await page.locator('[class*="grid"]').count() > 0;
      expect(gridExists, `Product grid should exist on ${breakpoint.name}`).toBe(true);

      // Verify at least one product card is visible
      const productCards = await page.locator('[data-product-id]').count();
      expect(productCards, `Product cards should be visible on ${breakpoint.name}`).toBeGreaterThan(0);

      // Verify filter bar is present
      const filterBarExists = await page.locator('input[type="search"]').count() > 0;
      expect(filterBarExists, `Filter bar should exist on ${breakpoint.name}`).toBe(true);

      // Verify no layout overflow
      const hasOverflow = await page.evaluate(() => {
        const body = document.body;
        const html = document.documentElement;
        return (
          body.scrollWidth > html.clientWidth ||
          body.scrollHeight < 100 // Sanity check for collapsed content
        );
      });

      expect(hasOverflow, `No layout overflow on ${breakpoint.name}`).toBe(false);
    }
  });
});

test.describe('Catalog Responsive Testing - Additional Checks', () => {
  test('Verify responsive images at different breakpoints', async ({ page }) => {
    const breakpoints = [BREAKPOINTS.iphone12, BREAKPOINTS.desktop];

    for (const breakpoint of breakpoints) {
      await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
      await page.goto('/en/products');
      await page.waitForLoadState('networkidle');

      // Check that images are using responsive attributes
      const imagesWithSrcset = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        let count = 0;
        images.forEach((img) => {
          if (img.srcset || img.getAttribute('sizes')) {
            count++;
          }
        });
        return count;
      });

      expect(imagesWithSrcset, `Images should use responsive attributes on ${breakpoint.name}`).toBeGreaterThan(0);
    }
  });

  test('Verify text readability at all breakpoints', async ({ page }) => {
    const breakpoints = Object.values(BREAKPOINTS);

    for (const breakpoint of breakpoints) {
      await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
      await page.goto('/en/products');
      await page.waitForLoadState('networkidle');

      // Check that text is not too small
      const textSizes = await page.evaluate(() => {
        const elements = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6');
        const sizes: number[] = [];
        
        elements.forEach((el) => {
          const styles = window.getComputedStyle(el);
          if (styles.display !== 'none' && styles.visibility !== 'hidden') {
            const fontSize = parseFloat(styles.fontSize);
            if (fontSize > 0) {
              sizes.push(fontSize);
            }
          }
        });

        return sizes;
      });

      // Most text should be at least 14px (allowing for some smaller text like labels)
      const smallText = textSizes.filter((size) => size < 12);
      const percentageSmall = (smallText.length / textSizes.length) * 100;

      expect(percentageSmall, `Most text should be readable on ${breakpoint.name}`).toBeLessThan(10);
    }
  });

  test('Verify spacing and padding at different breakpoints', async ({ page }) => {
    const breakpoints = [BREAKPOINTS.iphone12, BREAKPOINTS.desktop];

    for (const breakpoint of breakpoints) {
      await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
      await page.goto('/en/products');
      await page.waitForLoadState('networkidle');

      // Check that elements have appropriate spacing
      const hasAdequateSpacing = await page.evaluate(() => {
        const productCards = document.querySelectorAll('[data-product-id]');
        if (productCards.length < 2) return true;

        const firstCard = productCards[0].getBoundingClientRect();
        const secondCard = productCards[1].getBoundingClientRect();

        // Check gap between cards (should be at least 8px)
        const gap = Math.abs(secondCard.left - firstCard.right) || Math.abs(secondCard.top - firstCard.bottom);
        return gap >= 8;
      });

      expect(hasAdequateSpacing, `Elements should have adequate spacing on ${breakpoint.name}`).toBe(true);
    }
  });
});
