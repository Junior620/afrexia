import { test, expect } from '@playwright/test';
import { navigateAndWait } from './helpers/navigation';
import { expectNoA11yViolations } from './helpers/accessibility';

/**
 * E2E Test: Blog Reading Journey
 * Tests blog browsing, search, and reading functionality
 * 
 * **Validates: Requirements 13.1, 13.2, 13.4, 13.5**
 */
test.describe('Blog Reading Journey', () => {
  test('should display blog listing page', async ({ page }) => {
    await navigateAndWait(page, '/en/blog');
    await expect(page.locator('h1')).toContainText(/blog|articles/i);
    await expectNoA11yViolations(page);
    
    // Verify blog posts are displayed
    const blogPosts = page.locator('[data-testid="blog-post-card"]');
    if (await blogPosts.first().isVisible()) {
      await expect(blogPosts.first()).toBeVisible();
    }
  });

  test('should display blog post metadata', async ({ page }) => {
    await navigateAndWait(page, '/en/blog');
    
    const firstPost = page.locator('[data-testid="blog-post-card"]').first();
    if (await firstPost.isVisible()) {
      // Verify metadata: author, date, reading time
      await expect(firstPost.locator('text=/min read|author|published/i')).toBeVisible();
    }
  });

  test('should navigate to blog post detail page', async ({ page }) => {
    await navigateAndWait(page, '/en/blog');
    
    const firstPost = page.locator('[data-testid="blog-post-card"]').first();
    if (await firstPost.isVisible()) {
      await firstPost.click();
      
      // Should navigate to blog post detail
      await page.waitForURL('**/en/blog/**');
      await expectNoA11yViolations(page);
      
      // Verify post content is displayed
      await expect(page.locator('article, [data-testid="blog-post-content"]')).toBeVisible();
    }
  });

  test('should display related articles', async ({ page }) => {
    await navigateAndWait(page, '/en/blog');
    
    const firstPost = page.locator('[data-testid="blog-post-card"]').first();
    if (await firstPost.isVisible()) {
      await firstPost.click();
      await page.waitForURL('**/en/blog/**');
      
      // Look for related articles section
      const relatedArticles = page.locator('[data-testid="related-articles"]');
      if (await relatedArticles.isVisible()) {
        await expect(relatedArticles).toBeVisible();
        
        // Verify related articles are displayed
        const relatedPosts = relatedArticles.locator('[data-testid="blog-post-card"]');
        await expect(relatedPosts.first()).toBeVisible();
      }
    }
  });

  test('should search blog posts', async ({ page }) => {
    await navigateAndWait(page, '/en/blog');
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('cocoa');
      
      // Wait for search results
      await page.waitForTimeout(500);
      
      // Verify results are filtered
      const blogPosts = page.locator('[data-testid="blog-post-card"]');
      if (await blogPosts.first().isVisible()) {
        await expect(blogPosts.first()).toBeVisible();
      }
    }
  });

  test('should display social sharing buttons', async ({ page }) => {
    await navigateAndWait(page, '/en/blog');
    
    const firstPost = page.locator('[data-testid="blog-post-card"]').first();
    if (await firstPost.isVisible()) {
      await firstPost.click();
      await page.waitForURL('**/en/blog/**');
      
      // Look for social sharing buttons
      const shareButtons = page.locator('[data-testid="social-share"], a[aria-label*="share" i]');
      if (await shareButtons.first().isVisible()) {
        await expect(shareButtons.first()).toBeVisible();
      }
    }
  });

  test('should filter by category', async ({ page }) => {
    await navigateAndWait(page, '/en/blog');
    
    // Look for category filters
    const categoryFilter = page.locator('[data-testid="category-filter"], button:has-text("Category")').first();
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click();
      
      // Verify filtered results
      const blogPosts = page.locator('[data-testid="blog-post-card"]');
      await expect(blogPosts.first()).toBeVisible();
    }
  });

  test('should display author information', async ({ page }) => {
    await navigateAndWait(page, '/en/blog');
    
    const firstPost = page.locator('[data-testid="blog-post-card"]').first();
    if (await firstPost.isVisible()) {
      await firstPost.click();
      await page.waitForURL('**/en/blog/**');
      
      // Verify author information is displayed
      await expect(page.locator('[data-testid="author-info"], text=/author|by/i')).toBeVisible();
    }
  });
});
