/**
 * Unit tests for FocusManager
 * 
 * Tests focus capture, restoration, visibility management, and focusability checks
 * 
 * Validates: Requirements 19.1, 19.2, 19.3, 19.4, 19.5
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FocusManager } from '../focus-manager';

describe('FocusManager', () => {
  let focusManager: FocusManager;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    
    // Clear any existing focus
    if (document.activeElement && document.activeElement !== document.body) {
      (document.activeElement as HTMLElement).blur();
    }

    focusManager = new FocusManager();
  });

  afterEach(() => {
    // Clean up DOM
    document.body.innerHTML = '';
  });

  describe('Focus Capture', () => {
    it('should capture focus from focused element with ID', () => {
      // Create and focus an input element
      const input = document.createElement('input');
      input.id = 'test-input';
      document.body.appendChild(input);
      input.focus();

      const focusId = focusManager.captureFocus();

      expect(focusId).toBe('test-input');
    });

    it('should return null when no element is focused', () => {
      // Ensure body is focused (default state)
      document.body.focus();

      const focusId = focusManager.captureFocus();

      expect(focusId).toBeNull();
    });

    it('should return null when focused element has no ID', () => {
      // Create and focus an element without ID
      const button = document.createElement('button');
      document.body.appendChild(button);
      button.focus();

      const focusId = focusManager.captureFocus();

      expect(focusId).toBeNull();
    });

    it('should capture focus from button with ID', () => {
      const button = document.createElement('button');
      button.id = 'submit-button';
      document.body.appendChild(button);
      button.focus();

      const focusId = focusManager.captureFocus();

      expect(focusId).toBe('submit-button');
    });

    it('should capture focus from textarea with ID', () => {
      const textarea = document.createElement('textarea');
      textarea.id = 'comment-field';
      document.body.appendChild(textarea);
      textarea.focus();

      const focusId = focusManager.captureFocus();

      expect(focusId).toBe('comment-field');
    });
  });

  describe('Focus Restoration', () => {
    it('should restore focus to existing element', () => {
      const input = document.createElement('input');
      input.id = 'email-input';
      document.body.appendChild(input);

      const success = focusManager.restoreFocus('email-input');

      expect(success).toBe(true);
      expect(document.activeElement).toBe(input);
    });

    it('should return false when element does not exist', () => {
      const success = focusManager.restoreFocus('non-existent-element');

      expect(success).toBe(false);
    });

    it('should return false for disabled elements', () => {
      const input = document.createElement('input');
      input.id = 'disabled-input';
      input.disabled = true;
      document.body.appendChild(input);

      const success = focusManager.restoreFocus('disabled-input');

      expect(success).toBe(false);
    });

    it('should return false for hidden elements (display: none)', () => {
      const button = document.createElement('button');
      button.id = 'hidden-button';
      button.style.display = 'none';
      document.body.appendChild(button);

      const success = focusManager.restoreFocus('hidden-button');

      expect(success).toBe(false);
    });

    it('should return false for hidden elements (visibility: hidden)', () => {
      const button = document.createElement('button');
      button.id = 'invisible-button';
      button.style.visibility = 'hidden';
      document.body.appendChild(button);

      const success = focusManager.restoreFocus('invisible-button');

      expect(success).toBe(false);
    });

    it('should return false for elements with opacity 0', () => {
      const button = document.createElement('button');
      button.id = 'transparent-button';
      button.style.opacity = '0';
      document.body.appendChild(button);

      const success = focusManager.restoreFocus('transparent-button');

      expect(success).toBe(false);
    });

    it('should restore focus to button', () => {
      const button = document.createElement('button');
      button.id = 'action-button';
      document.body.appendChild(button);

      const success = focusManager.restoreFocus('action-button');

      expect(success).toBe(true);
      expect(document.activeElement).toBe(button);
    });

    it('should restore focus to link with href', () => {
      const link = document.createElement('a');
      link.id = 'nav-link';
      link.href = '#section';
      document.body.appendChild(link);

      const success = focusManager.restoreFocus('nav-link');

      expect(success).toBe(true);
      expect(document.activeElement).toBe(link);
    });

    it('should restore focus to select element', () => {
      const select = document.createElement('select');
      select.id = 'country-select';
      document.body.appendChild(select);

      const success = focusManager.restoreFocus('country-select');

      expect(success).toBe(true);
      expect(document.activeElement).toBe(select);
    });

    it('should restore focus to element with tabindex', () => {
      const div = document.createElement('div');
      div.id = 'focusable-div';
      div.setAttribute('tabindex', '0');
      document.body.appendChild(div);

      const success = focusManager.restoreFocus('focusable-div');

      expect(success).toBe(true);
      expect(document.activeElement).toBe(div);
    });

    it('should return false for invalid element ID', () => {
      const success = focusManager.restoreFocus('');

      expect(success).toBe(false);
    });

    it('should return false for null element ID', () => {
      const success = focusManager.restoreFocus(null as any);

      expect(success).toBe(false);
    });
  });

  describe('Focusability Checks', () => {
    it('should identify button as focusable', () => {
      const button = document.createElement('button');
      button.id = 'test-button';
      document.body.appendChild(button);

      const canFocus = focusManager.canRestoreFocus('test-button');

      expect(canFocus).toBe(true);
    });

    it('should identify input as focusable', () => {
      const input = document.createElement('input');
      input.id = 'test-input';
      document.body.appendChild(input);

      const canFocus = focusManager.canRestoreFocus('test-input');

      expect(canFocus).toBe(true);
    });

    it('should identify disabled button as not focusable', () => {
      const button = document.createElement('button');
      button.id = 'disabled-button';
      button.disabled = true;
      document.body.appendChild(button);

      const canFocus = focusManager.canRestoreFocus('disabled-button');

      expect(canFocus).toBe(false);
    });

    it('should identify hidden element as not focusable', () => {
      const input = document.createElement('input');
      input.id = 'hidden-input';
      input.style.display = 'none';
      document.body.appendChild(input);

      const canFocus = focusManager.canRestoreFocus('hidden-input');

      expect(canFocus).toBe(false);
    });

    it('should identify element with tabindex as focusable', () => {
      const div = document.createElement('div');
      div.id = 'custom-focusable';
      div.setAttribute('tabindex', '0');
      document.body.appendChild(div);

      const canFocus = focusManager.canRestoreFocus('custom-focusable');

      expect(canFocus).toBe(true);
    });

    it('should identify link without href as not focusable', () => {
      const link = document.createElement('a');
      link.id = 'no-href-link';
      document.body.appendChild(link);

      const canFocus = focusManager.canRestoreFocus('no-href-link');

      expect(canFocus).toBe(false);
    });

    it('should identify link with href as focusable', () => {
      const link = document.createElement('a');
      link.id = 'valid-link';
      link.href = '#target';
      document.body.appendChild(link);

      const canFocus = focusManager.canRestoreFocus('valid-link');

      expect(canFocus).toBe(true);
    });

    it('should return false for non-existent element', () => {
      const canFocus = focusManager.canRestoreFocus('does-not-exist');

      expect(canFocus).toBe(false);
    });
  });

  describe('Visibility Management', () => {
    it('should call scrollIntoView when restoring focus to off-screen element', () => {
      const button = document.createElement('button');
      button.id = 'offscreen-button';
      document.body.appendChild(button);

      // Mock scrollIntoView (not available in JSDOM)
      button.scrollIntoView = vi.fn();

      // Mock getBoundingClientRect to simulate off-screen element
      vi.spyOn(button, 'getBoundingClientRect').mockReturnValue({
        top: 2000,
        bottom: 2050,
        left: 0,
        right: 100,
        width: 100,
        height: 50,
        x: 0,
        y: 2000,
        toJSON: () => ({})
      } as DOMRect);

      const success = focusManager.restoreFocus('offscreen-button');

      expect(success).toBe(true);
      expect(button.scrollIntoView).toHaveBeenCalled();
    });

    it('should not scroll if element is already visible', () => {
      const button = document.createElement('button');
      button.id = 'visible-button';
      document.body.appendChild(button);

      // Mock scrollIntoView (not available in JSDOM)
      button.scrollIntoView = vi.fn();

      // Mock getBoundingClientRect to simulate visible element
      vi.spyOn(button, 'getBoundingClientRect').mockReturnValue({
        top: 100,
        bottom: 150,
        left: 0,
        right: 100,
        width: 100,
        height: 50,
        x: 0,
        y: 100,
        toJSON: () => ({})
      } as DOMRect);

      const success = focusManager.restoreFocus('visible-button');

      expect(success).toBe(true);
      expect(button.scrollIntoView).not.toHaveBeenCalled();
    });

    it('should respect prefers-reduced-motion when scrolling', () => {
      const button = document.createElement('button');
      button.id = 'motion-button';
      document.body.appendChild(button);

      // Mock scrollIntoView (not available in JSDOM)
      button.scrollIntoView = vi.fn();

      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      // Mock getBoundingClientRect to simulate off-screen element
      vi.spyOn(button, 'getBoundingClientRect').mockReturnValue({
        top: 2000,
        bottom: 2050,
        left: 0,
        right: 100,
        width: 100,
        height: 50,
        x: 0,
        y: 2000,
        toJSON: () => ({})
      } as DOMRect);

      focusManager.restoreFocus('motion-button');

      expect(button.scrollIntoView).toHaveBeenCalledWith(
        expect.objectContaining({
          behavior: 'auto' // Should use 'auto' when prefers-reduced-motion
        })
      );
    });
  });

  describe('Custom Configuration', () => {
    it('should respect custom scrollIntoView setting', () => {
      const customManager = new FocusManager({
        scrollIntoView: false
      });

      const button = document.createElement('button');
      button.id = 'no-scroll-button';
      document.body.appendChild(button);

      // Mock scrollIntoView (not available in JSDOM)
      button.scrollIntoView = vi.fn();

      // Mock getBoundingClientRect to simulate off-screen element
      vi.spyOn(button, 'getBoundingClientRect').mockReturnValue({
        top: 2000,
        bottom: 2050,
        left: 0,
        right: 100,
        width: 100,
        height: 50,
        x: 0,
        y: 2000,
        toJSON: () => ({})
      } as DOMRect);

      const success = customManager.restoreFocus('no-scroll-button');

      expect(success).toBe(true);
      expect(button.scrollIntoView).not.toHaveBeenCalled();
    });

    it('should use custom scroll behavior', () => {
      const customManager = new FocusManager({
        scrollBehavior: 'auto'
      });

      const button = document.createElement('button');
      button.id = 'auto-scroll-button';
      document.body.appendChild(button);

      // Mock scrollIntoView (not available in JSDOM)
      button.scrollIntoView = vi.fn();

      // Mock getBoundingClientRect to simulate off-screen element
      vi.spyOn(button, 'getBoundingClientRect').mockReturnValue({
        top: 2000,
        bottom: 2050,
        left: 0,
        right: 100,
        width: 100,
        height: 50,
        x: 0,
        y: 2000,
        toJSON: () => ({})
      } as DOMRect);

      customManager.restoreFocus('auto-scroll-button');

      expect(button.scrollIntoView).toHaveBeenCalledWith(
        expect.objectContaining({
          behavior: 'auto'
        })
      );
    });
  });

  describe('Utility Methods', () => {
    it('should get current focus ID', () => {
      const input = document.createElement('input');
      input.id = 'current-input';
      document.body.appendChild(input);
      input.focus();

      const currentId = focusManager.getCurrentFocusId();

      expect(currentId).toBe('current-input');
    });

    it('should return null for getCurrentFocusId when nothing focused', () => {
      document.body.focus();

      const currentId = focusManager.getCurrentFocusId();

      expect(currentId).toBeNull();
    });

    it('should clear focus from current element', () => {
      const button = document.createElement('button');
      button.id = 'clear-button';
      document.body.appendChild(button);
      button.focus();

      expect(document.activeElement).toBe(button);

      focusManager.clearFocus();

      expect(document.activeElement).not.toBe(button);
    });
  });

  describe('Edge Cases', () => {
    it('should handle elements with aria-hidden parent', () => {
      const container = document.createElement('div');
      container.setAttribute('aria-hidden', 'true');
      
      const button = document.createElement('button');
      button.id = 'hidden-parent-button';
      container.appendChild(button);
      document.body.appendChild(container);

      const canFocus = focusManager.canRestoreFocus('hidden-parent-button');

      expect(canFocus).toBe(false);
    });

    it('should handle contenteditable elements', () => {
      const div = document.createElement('div');
      div.id = 'editable-div';
      div.setAttribute('contenteditable', 'true');
      document.body.appendChild(div);

      const canFocus = focusManager.canRestoreFocus('editable-div');

      expect(canFocus).toBe(true);
    });

    it('should handle input type=hidden as not focusable', () => {
      const input = document.createElement('input');
      input.id = 'hidden-type-input';
      input.type = 'hidden';
      document.body.appendChild(input);

      const canFocus = focusManager.canRestoreFocus('hidden-type-input');

      expect(canFocus).toBe(false);
    });

    it('should handle textarea as focusable', () => {
      const textarea = document.createElement('textarea');
      textarea.id = 'text-area';
      document.body.appendChild(textarea);

      const canFocus = focusManager.canRestoreFocus('text-area');

      expect(canFocus).toBe(true);
    });

    it('should handle select as focusable', () => {
      const select = document.createElement('select');
      select.id = 'select-element';
      document.body.appendChild(select);

      const canFocus = focusManager.canRestoreFocus('select-element');

      expect(canFocus).toBe(true);
    });

    it('should handle element with negative tabindex', () => {
      const div = document.createElement('div');
      div.id = 'negative-tabindex';
      div.setAttribute('tabindex', '-1');
      document.body.appendChild(div);

      const canFocus = focusManager.canRestoreFocus('negative-tabindex');

      expect(canFocus).toBe(true);
    });

    it('should handle element with invalid tabindex', () => {
      const div = document.createElement('div');
      div.id = 'invalid-tabindex';
      div.setAttribute('tabindex', 'invalid');
      document.body.appendChild(div);

      const canFocus = focusManager.canRestoreFocus('invalid-tabindex');

      expect(canFocus).toBe(false);
    });
  });

  describe('Integration Scenarios', () => {
    it('should capture and restore focus in sequence', () => {
      // Create form with multiple inputs
      const input1 = document.createElement('input');
      input1.id = 'field-1';
      const input2 = document.createElement('input');
      input2.id = 'field-2';
      
      document.body.appendChild(input1);
      document.body.appendChild(input2);

      // Focus first input
      input1.focus();
      const captured1 = focusManager.captureFocus();
      expect(captured1).toBe('field-1');

      // Focus second input
      input2.focus();
      const captured2 = focusManager.captureFocus();
      expect(captured2).toBe('field-2');

      // Restore to first input
      const restored = focusManager.restoreFocus(captured1);
      expect(restored).toBe(true);
      expect(document.activeElement).toBe(input1);
    });

    it('should handle form navigation scenario', () => {
      // Simulate user filling out a form
      const emailInput = document.createElement('input');
      emailInput.id = 'email';
      emailInput.type = 'email';
      
      const submitButton = document.createElement('button');
      submitButton.id = 'submit';
      submitButton.textContent = 'Submit';

      document.body.appendChild(emailInput);
      document.body.appendChild(submitButton);

      // User focuses email input
      emailInput.focus();
      const focusId = focusManager.captureFocus();

      // Simulate navigation away and back
      emailInput.blur();
      
      // Restore focus
      const restored = focusManager.restoreFocus(focusId!);
      expect(restored).toBe(true);
      expect(document.activeElement).toBe(emailInput);
    });
  });
});
