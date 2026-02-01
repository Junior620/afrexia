/**
 * Tests for Mobile Browser Compatibility Utilities
 * 
 * Validates: Requirements 13.1, 13.4, 13.5, 13.6
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  isIOSSafari,
  isMobileBrowser,
  getScrollingElement,
  getScrollPosition,
  setScrollPosition,
  getSafeAreaInsets,
  MobileAddressBarHandler,
  getHeaderHeightWithSafeArea,
  supportsSmoothScroll,
  getViewportDimensions
} from '../mobile-browser-compat';

describe('Mobile Browser Compatibility', () => {
  describe('Browser Detection', () => {
    it('should detect iOS Safari correctly', () => {
      // Mock iOS Safari user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        configurable: true
      });

      expect(isIOSSafari()).toBe(true);
    });

    it('should detect mobile browsers correctly', () => {
      // Mock mobile user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
        configurable: true
      });

      expect(isMobileBrowser()).toBe(true);
    });

    it('should return false for desktop browsers', () => {
      // Mock desktop user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        configurable: true
      });

      expect(isMobileBrowser()).toBe(false);
    });
  });

  describe('Scroll Position Utilities', () => {
    beforeEach(() => {
      // Mock scrollingElement
      Object.defineProperty(document, 'scrollingElement', {
        value: {
          scrollTop: 100,
          scrollLeft: 0
        },
        configurable: true,
        writable: true
      });
    });

    it('should get scrolling element', () => {
      const element = getScrollingElement();
      expect(element).toBeDefined();
    });

    it('should get scroll position using document.scrollingElement', () => {
      const position = getScrollPosition();
      expect(position.scrollY).toBe(100);
      expect(position.scrollX).toBe(0);
    });

    it('should set scroll position', () => {
      const scrollToSpy = vi.spyOn(window, 'scrollTo');
      
      setScrollPosition(200, 0, false);
      
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 200,
        left: 0,
        behavior: 'auto'
      });
    });

    it('should use smooth scroll when requested', () => {
      const scrollToSpy = vi.spyOn(window, 'scrollTo');
      
      setScrollPosition(200, 0, true);
      
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 200,
        left: 0,
        behavior: 'smooth'
      });
    });
  });

  describe('Safe Area Insets', () => {
    beforeEach(() => {
      // Mock CSS custom properties
      const mockStyle = {
        getPropertyValue: (prop: string) => {
          const values: Record<string, string> = {
            '--safe-area-inset-top': '44px',
            '--safe-area-inset-right': '0px',
            '--safe-area-inset-bottom': '34px',
            '--safe-area-inset-left': '0px'
          };
          return values[prop] || '0px';
        }
      };

      vi.spyOn(window, 'getComputedStyle').mockReturnValue(mockStyle as CSSStyleDeclaration);
    });

    it('should get safe area insets', () => {
      const insets = getSafeAreaInsets();
      
      expect(insets.top).toBe(44);
      expect(insets.right).toBe(0);
      expect(insets.bottom).toBe(34);
      expect(insets.left).toBe(0);
    });

    it('should return zero insets when not available', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: () => '0px'
      } as CSSStyleDeclaration);

      const insets = getSafeAreaInsets();
      
      expect(insets.top).toBe(0);
      expect(insets.right).toBe(0);
      expect(insets.bottom).toBe(0);
      expect(insets.left).toBe(0);
    });
  });

  describe('Header Height with Safe Area', () => {
    it('should calculate header height with safe area for fixed header', () => {
      const mockHeader = document.createElement('header');
      mockHeader.getBoundingClientRect = () => ({
        height: 60,
        width: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        x: 0,
        y: 0,
        toJSON: () => ({})
      });

      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        position: 'fixed',
        getPropertyValue: (prop: string) => {
          if (prop === '--safe-area-inset-top') return '44px';
          return '0px';
        }
      } as CSSStyleDeclaration);

      const height = getHeaderHeightWithSafeArea(mockHeader);
      expect(height).toBe(104); // 60 + 44
    });

    it('should return just header height for non-fixed header', () => {
      const mockHeader = document.createElement('header');
      mockHeader.getBoundingClientRect = () => ({
        height: 60,
        width: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        x: 0,
        y: 0,
        toJSON: () => ({})
      });

      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        position: 'relative',
        getPropertyValue: () => '0px'
      } as CSSStyleDeclaration);

      const height = getHeaderHeightWithSafeArea(mockHeader);
      expect(height).toBe(60);
    });

    it('should return 0 for null header', () => {
      const height = getHeaderHeightWithSafeArea(null);
      expect(height).toBe(0);
    });
  });

  describe('Smooth Scroll Support', () => {
    it('should detect smooth scroll support', () => {
      Object.defineProperty(document.documentElement.style, 'scrollBehavior', {
        value: '',
        configurable: true
      });

      expect(supportsSmoothScroll()).toBe(true);
    });
  });

  describe('Viewport Dimensions', () => {
    it('should get viewport dimensions from visualViewport if available', () => {
      Object.defineProperty(window, 'visualViewport', {
        value: {
          width: 375,
          height: 667
        },
        configurable: true
      });

      const dimensions = getViewportDimensions();
      expect(dimensions.width).toBe(375);
      expect(dimensions.height).toBe(667);
    });

    it('should fallback to window.innerWidth/innerHeight', () => {
      Object.defineProperty(window, 'visualViewport', {
        value: undefined,
        configurable: true
      });

      Object.defineProperty(window, 'innerWidth', {
        value: 1024,
        configurable: true
      });

      Object.defineProperty(window, 'innerHeight', {
        value: 768,
        configurable: true
      });

      const dimensions = getViewportDimensions();
      expect(dimensions.width).toBe(1024);
      expect(dimensions.height).toBe(768);
    });
  });

  describe('MobileAddressBarHandler', () => {
    let handler: MobileAddressBarHandler;

    beforeEach(() => {
      handler = new MobileAddressBarHandler();
      
      // Mock mobile browser
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });

      Object.defineProperty(window, 'innerHeight', {
        value: 667,
        configurable: true,
        writable: true
      });
    });

    afterEach(() => {
      handler.destroy();
    });

    it('should initialize on mobile browsers', () => {
      expect(() => handler.initialize()).not.toThrow();
    });

    it('should get viewport height', () => {
      const height = handler.getViewportHeight();
      expect(height).toBe(667);
    });

    it('should get stable viewport height', () => {
      handler.initialize();
      const stableHeight = handler.getStableViewportHeight();
      expect(stableHeight).toBeGreaterThan(0);
    });

    it('should handle resize events', async () => {
      handler.initialize();

      // Simulate address bar hide (viewport height increases)
      Object.defineProperty(window, 'innerHeight', {
        value: 717, // +50px
        configurable: true,
        writable: true
      });

      // Trigger resize event
      window.dispatchEvent(new Event('resize'));

      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 150));

      expect(handler.getViewportHeight()).toBe(717);
    });

    it('should clean up on destroy', () => {
      handler.initialize();
      expect(() => handler.destroy()).not.toThrow();
    });
  });
});
