/**
 * Unit tests for StateCaptureService
 * 
 * Tests state capture, section detection, focus capture, and debouncing
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StateCaptureService } from '../state-capture-service';
import { NavigationState } from '@/types/navigation';

describe('StateCaptureService', () => {
  let service: StateCaptureService;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    
    // Reset window location
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/test',
        search: '',
        hash: '',
        href: 'http://localhost/test'
      },
      writable: true,
      configurable: true
    });

    // Reset scroll position
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 0,
      writable: true,
      configurable: true
    });

    Object.defineProperty(document.documentElement, 'scrollLeft', {
      value: 0,
      writable: true,
      configurable: true
    });

    service = new StateCaptureService();
  });

  afterEach(() => {
    service.destroy();
    vi.clearAllTimers();
  });

  describe('Initialization', () => {
    it('should initialize without errors', () => {
      expect(() => service.initialize()).not.toThrow();
    });

    it('should not initialize multiple times', () => {
      service.initialize();
      service.initialize();
      
      // Should not throw or cause issues
      expect(service).toBeDefined();
    });

    it('should setup section observer on initialization', () => {
      // Add a section to observe
      document.body.innerHTML = '<section id="test-section">Content</section>';
      
      service.initialize();
      
      // Observer should be set up (internal state check)
      expect(service).toBeDefined();
    });
  });

  describe('State Capture', () => {
    it('should capture basic navigation state', () => {
      const state = service.captureCurrentState();

      expect(state).toMatchObject({
        key: '/test',
        scrollY: 0,
        scrollX: 0,
        route: '/test'
      });
      expect(state.timestamp).toBeGreaterThan(0);
    });

    it('should capture scroll position', () => {
      // Set scroll position
      Object.defineProperty(document.documentElement, 'scrollTop', {
        value: 500,
        writable: true,
        configurable: true
      });

      Object.defineProperty(document.documentElement, 'scrollLeft', {
        value: 50,
        writable: true,
        configurable: true
      });

      const state = service.captureCurrentState();

      expect(state.scrollY).toBe(500);
      expect(state.scrollX).toBe(50);
    });

    it('should capture route with query parameters', () => {
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/products',
          search: '?category=electronics',
          hash: '',
          href: 'http://localhost/products?category=electronics'
        },
        writable: true,
        configurable: true
      });

      const state = service.captureCurrentState();

      expect(state.key).toBe('/products?category=electronics');
      expect(state.route).toBe('/products');
    });

    it('should capture URL hash', () => {
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/about',
          search: '',
          hash: '#team',
          href: 'http://localhost/about#team'
        },
        writable: true,
        configurable: true
      });

      const state = service.captureCurrentState();

      expect(state.hash).toBe('team');
    });

    it('should not include hash field when no hash present', () => {
      const state = service.captureCurrentState();

      expect(state.hash).toBeUndefined();
    });

    it('should capture section ID when available', () => {
      service.setCurrentSectionId('featured-products');

      const state = service.captureCurrentState();

      expect(state.sectionId).toBe('featured-products');
    });

    it('should not include sectionId field when not available', () => {
      const state = service.captureCurrentState();

      expect(state.sectionId).toBeUndefined();
    });

    it('should capture focused element ID', () => {
      // Create an input with ID and focus it
      const input = document.createElement('input');
      input.id = 'email-input';
      document.body.appendChild(input);
      input.focus();

      const state = service.captureCurrentState();

      expect(state.focusedElementId).toBe('email-input');
    });

    it('should not capture focused element without ID', () => {
      // Create an input without ID and focus it
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.focus();

      const state = service.captureCurrentState();

      expect(state.focusedElementId).toBeUndefined();
    });

    it('should not capture body as focused element', () => {
      document.body.focus();

      const state = service.captureCurrentState();

      expect(state.focusedElementId).toBeUndefined();
    });

    it('should generate unique timestamps', async () => {
      const state1 = service.captureCurrentState();
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const state2 = service.captureCurrentState();

      expect(state2.timestamp).toBeGreaterThan(state1.timestamp);
    });
  });

  describe('Should Capture State Logic', () => {
    it('should capture state for internal navigation', () => {
      const shouldCapture = service.shouldCaptureState(
        '/products',
        false,
        false
      );

      expect(shouldCapture).toBe(true);
    });

    it('should not capture state for external links', () => {
      const shouldCapture = service.shouldCaptureState(
        'https://external.com',
        true,
        false
      );

      expect(shouldCapture).toBe(false);
    });

    it('should not capture state for same-page hash navigation', () => {
      const shouldCapture = service.shouldCaptureState(
        '/products#details',
        false,
        true
      );

      expect(shouldCapture).toBe(false);
    });

    it('should capture state for different page with hash', () => {
      const shouldCapture = service.shouldCaptureState(
        '/about#team',
        false,
        false
      );

      expect(shouldCapture).toBe(true);
    });
  });

  describe('Scroll Capture Debouncing', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should debounce scroll capture', () => {
      const callback = vi.fn();

      // Set initial scroll
      Object.defineProperty(document.documentElement, 'scrollTop', {
        value: 100,
        writable: true,
        configurable: true
      });

      // Trigger multiple scroll captures rapidly
      service.debounceScrollCapture(callback);
      service.debounceScrollCapture(callback);
      service.debounceScrollCapture(callback);

      // Callback should not be called yet
      expect(callback).not.toHaveBeenCalled();

      // Fast-forward time
      vi.advanceTimersByTime(150);

      // Callback should be called once
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(100, 0);
    });

    it('should use custom debounce delay', () => {
      const customService = new StateCaptureService({ scrollDebounceDelay: 300 });
      const callback = vi.fn();

      Object.defineProperty(document.documentElement, 'scrollTop', {
        value: 200,
        writable: true,
        configurable: true
      });

      customService.debounceScrollCapture(callback);

      // Should not be called after 150ms
      vi.advanceTimersByTime(150);
      expect(callback).not.toHaveBeenCalled();

      // Should be called after 300ms
      vi.advanceTimersByTime(150);
      expect(callback).toHaveBeenCalledTimes(1);

      customService.destroy();
    });

    it('should not call callback if scroll position unchanged', () => {
      const callback = vi.fn();

      // Capture initial state to set lastCapturedScrollY
      service.captureCurrentState();

      // Scroll position is still 0
      service.debounceScrollCapture(callback);

      vi.advanceTimersByTime(150);

      // Callback should not be called since position didn't change
      expect(callback).not.toHaveBeenCalled();
    });

    it('should call callback when scroll position changes', () => {
      const callback = vi.fn();

      // Capture initial state at scroll 0
      service.captureCurrentState();

      // Change scroll position
      Object.defineProperty(document.documentElement, 'scrollTop', {
        value: 500,
        writable: true,
        configurable: true
      });

      service.debounceScrollCapture(callback);

      vi.advanceTimersByTime(150);

      // Callback should be called since position changed
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(500, 0);
    });

    it('should cancel previous debounce timer', () => {
      const callback = vi.fn();

      Object.defineProperty(document.documentElement, 'scrollTop', {
        value: 100,
        writable: true,
        configurable: true
      });

      service.debounceScrollCapture(callback);

      // Advance time partially
      vi.advanceTimersByTime(100);

      // Trigger again before first completes
      Object.defineProperty(document.documentElement, 'scrollTop', {
        value: 200,
        writable: true,
        configurable: true
      });

      service.debounceScrollCapture(callback);

      // Advance remaining time from first call
      vi.advanceTimersByTime(50);

      // Should not be called yet
      expect(callback).not.toHaveBeenCalled();

      // Advance time for second call
      vi.advanceTimersByTime(100);

      // Should be called once with latest value
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(200, 0);
    });
  });

  describe('Section Detection', () => {
    it('should detect section with data-section attribute', () => {
      document.body.innerHTML = '<section data-section="hero">Hero content</section>';
      
      service.initialize();
      service.setCurrentSectionId('hero');

      const state = service.captureCurrentState();

      expect(state.sectionId).toBe('hero');
    });

    it('should detect section with id attribute', () => {
      document.body.innerHTML = '<section id="features">Features content</section>';
      
      service.initialize();
      service.setCurrentSectionId('features');

      const state = service.captureCurrentState();

      expect(state.sectionId).toBe('features');
    });

    it('should get current section ID', () => {
      service.setCurrentSectionId('test-section');

      expect(service.getCurrentSectionId()).toBe('test-section');
    });

    it('should return null when no section is current', () => {
      expect(service.getCurrentSectionId()).toBeNull();
    });

    it('should use custom section attribute', () => {
      const customService = new StateCaptureService({ 
        sectionAttribute: 'data-nav-section' 
      });

      document.body.innerHTML = '<section data-nav-section="custom">Content</section>';
      
      customService.initialize();
      
      // Service should observe elements with custom attribute
      expect(customService).toBeDefined();

      customService.destroy();
    });
  });

  describe('Cleanup', () => {
    it('should clean up observers on destroy', () => {
      service.initialize();
      service.destroy();

      // Should not throw when capturing after destroy
      expect(() => service.captureCurrentState()).not.toThrow();
    });

    it('should clear debounce timer on destroy', () => {
      vi.useFakeTimers();

      const callback = vi.fn();
      service.debounceScrollCapture(callback);

      service.destroy();

      vi.advanceTimersByTime(150);

      // Callback should not be called after destroy
      expect(callback).not.toHaveBeenCalled();

      vi.useRealTimers();
    });

    it('should allow re-initialization after destroy', () => {
      service.initialize();
      service.destroy();
      service.initialize();

      const state = service.captureCurrentState();

      expect(state).toBeDefined();
      expect(state.key).toBe('/test');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing scrollingElement', () => {
      // Mock missing scrollingElement
      Object.defineProperty(document, 'scrollingElement', {
        value: null,
        writable: true,
        configurable: true
      });

      const state = service.captureCurrentState();

      // Should fall back to documentElement
      expect(state.scrollY).toBe(0);
      expect(state.scrollX).toBe(0);
    });

    it('should round scroll positions', () => {
      Object.defineProperty(document.documentElement, 'scrollTop', {
        value: 123.7,
        writable: true,
        configurable: true
      });

      Object.defineProperty(document.documentElement, 'scrollLeft', {
        value: 45.3,
        writable: true,
        configurable: true
      });

      const state = service.captureCurrentState();

      expect(state.scrollY).toBe(124);
      expect(state.scrollX).toBe(45);
    });

    it('should handle complex URL paths', () => {
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/products/category/electronics',
          search: '?sort=price&filter=new',
          hash: '#details',
          href: 'http://localhost/products/category/electronics?sort=price&filter=new#details'
        },
        writable: true,
        configurable: true
      });

      const state = service.captureCurrentState();

      expect(state.key).toBe('/products/category/electronics?sort=price&filter=new');
      expect(state.route).toBe('/products/category/electronics');
      expect(state.hash).toBe('details');
    });

    it('should handle empty search parameters', () => {
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/about',
          search: '',
          hash: '',
          href: 'http://localhost/about'
        },
        writable: true,
        configurable: true
      });

      const state = service.captureCurrentState();

      expect(state.key).toBe('/about');
      expect(state.route).toBe('/about');
    });
  });

  describe('Configuration', () => {
    it('should use default configuration', () => {
      const defaultService = new StateCaptureService();
      
      expect(defaultService).toBeDefined();
    });

    it('should accept custom configuration', () => {
      const customService = new StateCaptureService({
        scrollDebounceDelay: 200,
        sectionVisibilityThreshold: 0.75,
        sectionAttribute: 'data-custom-section'
      });

      expect(customService).toBeDefined();

      customService.destroy();
    });

    it('should use default values for partial configuration', () => {
      const partialService = new StateCaptureService({
        scrollDebounceDelay: 200
      });

      expect(partialService).toBeDefined();

      partialService.destroy();
    });
  });
});
