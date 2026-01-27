import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Theme Initialization Script', () => {
  let originalLocalStorage: Storage;
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    // Save original implementations
    originalLocalStorage = window.localStorage;
    originalMatchMedia = window.matchMedia;

    // Clear any existing theme classes
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    // Restore original implementations
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
    });
    Object.defineProperty(window, 'matchMedia', {
      value: originalMatchMedia,
      writable: true,
    });

    // Clean up
    document.documentElement.classList.remove('dark');
    vi.restoreAllMocks();
  });

  const executeThemeScript = () => {
    // This is the same script from app/layout.tsx
    try {
      const storageKey = 'afrexia-theme';
      let theme: string | null = null;

      // Check localStorage for saved preference
      try {
        theme = localStorage.getItem(storageKey);
      } catch (e) {
        // localStorage unavailable (private browsing, etc.)
      }

      // Fall back to system preference if no stored preference
      if (!theme || (theme !== 'light' && theme !== 'dark')) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          theme = 'dark';
        } else {
          theme = 'light';
        }
      }

      // Apply dark class to html element before first paint
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      // Fail silently to prevent blocking page load
    }
  };

  describe('localStorage preference priority', () => {
    it('should apply dark theme when localStorage has dark preference', () => {
      // Mock localStorage with dark preference
      const mockLocalStorage = {
        getItem: vi.fn().mockReturnValue('dark'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      });

      // Mock system preference as light (should be ignored)
      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn().mockReturnValue({
          matches: false,
          media: '(prefers-color-scheme: dark)',
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }),
        writable: true,
      });

      executeThemeScript();

      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('afrexia-theme');
    });

    it('should apply light theme when localStorage has light preference', () => {
      // Mock localStorage with light preference
      const mockLocalStorage = {
        getItem: vi.fn().mockReturnValue('light'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      });

      // Mock system preference as dark (should be ignored)
      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn().mockReturnValue({
          matches: true,
          media: '(prefers-color-scheme: dark)',
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }),
        writable: true,
      });

      executeThemeScript();

      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('afrexia-theme');
    });
  });

  describe('system preference fallback', () => {
    it('should apply dark theme when system preference is dark and no localStorage preference', () => {
      // Mock localStorage with no preference
      const mockLocalStorage = {
        getItem: vi.fn().mockReturnValue(null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      });

      // Mock system preference as dark
      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn().mockReturnValue({
          matches: true,
          media: '(prefers-color-scheme: dark)',
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }),
        writable: true,
      });

      executeThemeScript();

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should apply light theme when system preference is light and no localStorage preference', () => {
      // Mock localStorage with no preference
      const mockLocalStorage = {
        getItem: vi.fn().mockReturnValue(null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      });

      // Mock system preference as light
      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn().mockReturnValue({
          matches: false,
          media: '(prefers-color-scheme: dark)',
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }),
        writable: true,
      });

      executeThemeScript();

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle localStorage errors gracefully and fall back to system preference', () => {
      // Mock localStorage to throw error
      const mockLocalStorage = {
        getItem: vi.fn().mockImplementation(() => {
          throw new Error('localStorage unavailable');
        }),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      });

      // Mock system preference as dark
      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn().mockReturnValue({
          matches: true,
          media: '(prefers-color-scheme: dark)',
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }),
        writable: true,
      });

      executeThemeScript();

      // Should fall back to system preference
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should handle matchMedia unavailable gracefully', () => {
      // Mock localStorage with no preference
      const mockLocalStorage = {
        getItem: vi.fn().mockReturnValue(null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      });

      // Remove matchMedia
      Object.defineProperty(window, 'matchMedia', {
        value: undefined,
        writable: true,
      });

      executeThemeScript();

      // Should default to light theme
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should handle invalid localStorage values by falling back to system preference', () => {
      // Mock localStorage with invalid value
      const mockLocalStorage = {
        getItem: vi.fn().mockReturnValue('invalid-theme'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      });

      // Mock system preference as dark
      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn().mockReturnValue({
          matches: true,
          media: '(prefers-color-scheme: dark)',
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }),
        writable: true,
      });

      executeThemeScript();

      // Should fall back to system preference
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should not throw errors even if entire script fails', () => {
      // Mock localStorage to throw error
      const mockLocalStorage = {
        getItem: vi.fn().mockImplementation(() => {
          throw new Error('Critical error');
        }),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      });

      // Mock matchMedia to throw error
      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn().mockImplementation(() => {
          throw new Error('matchMedia error');
        }),
        writable: true,
      });

      // Should not throw
      expect(() => executeThemeScript()).not.toThrow();
    });
  });

  describe('correct theme application', () => {
    it('should only add dark class when theme is dark', () => {
      // Mock localStorage with dark preference
      const mockLocalStorage = {
        getItem: vi.fn().mockReturnValue('dark'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      });

      executeThemeScript();

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should not add dark class when theme is light', () => {
      // Mock localStorage with light preference
      const mockLocalStorage = {
        getItem: vi.fn().mockReturnValue('light'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      });

      executeThemeScript();

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });
});
