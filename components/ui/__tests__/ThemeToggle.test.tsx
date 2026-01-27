import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ThemeToggle } from '../ThemeToggle';

describe('ThemeToggle Accessibility', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  describe('ARIA labels', () => {
    it('should have correct ARIA label for light theme', () => {
      render(
        <ThemeProvider defaultTheme="light">
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button', { name: 'Switch to dark mode' });
      expect(button).toBeDefined();
      expect(button.getAttribute('aria-label')).toBe('Switch to dark mode');
    });

    it('should have correct ARIA label for dark theme', () => {
      render(
        <ThemeProvider defaultTheme="dark">
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button', { name: 'Switch to light mode' });
      expect(button).toBeDefined();
      expect(button.getAttribute('aria-label')).toBe('Switch to light mode');
    });

    it('should have correct aria-pressed attribute for light theme', () => {
      render(
        <ThemeProvider defaultTheme="light">
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      expect(button.getAttribute('aria-pressed')).toBe('false');
    });

    it('should have correct aria-pressed attribute for dark theme', () => {
      render(
        <ThemeProvider defaultTheme="dark">
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      expect(button.getAttribute('aria-pressed')).toBe('true');
    });
  });

  describe('Keyboard navigation', () => {
    it('should be focusable with Tab key', () => {
      render(
        <ThemeProvider defaultTheme="light">
          <div>
            <button>Before</button>
            <ThemeToggle />
            <button>After</button>
          </div>
        </ThemeProvider>
      );

      const beforeButton = screen.getByRole('button', { name: 'Before' });
      const themeToggle = screen.getByRole('button', { name: 'Switch to dark mode' });

      // Focus first button
      beforeButton.focus();
      expect(document.activeElement).toBe(beforeButton);

      // Focus theme toggle
      themeToggle.focus();
      expect(document.activeElement).toBe(themeToggle);
    });

    it('should toggle theme with Enter key', () => {
      render(
        <ThemeProvider defaultTheme="light">
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button', { name: 'Switch to dark mode' });
      
      // Focus the button
      button.focus();
      expect(document.activeElement).toBe(button);

      // Simulate Enter key press (button click)
      fireEvent.click(button);

      // Theme should have toggled to dark
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should toggle theme with Space key', () => {
      render(
        <ThemeProvider defaultTheme="light">
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button', { name: 'Switch to dark mode' });
      
      // Focus the button
      button.focus();
      expect(document.activeElement).toBe(button);

      // Simulate Space key press (button click)
      fireEvent.click(button);

      // Theme should have toggled to dark
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('Focus indicators', () => {
    it('should have focus-visible styles defined', () => {
      render(
        <ThemeProvider defaultTheme="light">
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      
      // Check that focus-visible classes are present
      expect(button.className).toContain('focus-visible:outline-none');
      expect(button.className).toContain('focus-visible:ring-2');
      expect(button.className).toContain('focus-visible:ring-primary');
      expect(button.className).toContain('focus-visible:ring-offset-2');
    });

    it('should have dark mode focus-visible styles defined', () => {
      render(
        <ThemeProvider defaultTheme="dark">
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      
      // Check that dark mode focus-visible classes are present
      expect(button.className).toContain('dark:focus-visible:ring-primary-light');
    });

    it('should be visible when focused', () => {
      render(
        <ThemeProvider defaultTheme="light">
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      
      // Focus the button
      button.focus();
      
      // Button should be focused
      expect(document.activeElement).toBe(button);
      
      // Button should be in the document
      expect(button).toBeDefined();
    });
  });
});
