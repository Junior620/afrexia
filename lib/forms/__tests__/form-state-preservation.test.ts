/**
 * Tests for Form State Preservation Service
 * 
 * Requirements: 14.1, 14.2, 14.3, 14.4, 14.5
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  hasFormConsent,
  grantFormConsent,
  revokeFormConsent,
  saveFormDraft,
  loadFormDraft,
  clearFormDraft,
  hasFormDraft,
  getDraftAge,
  getDraftTimeRemaining,
  formatTimeRemaining,
} from '../form-state-preservation';

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

describe('Form State Preservation', () => {
  beforeEach(() => {
    sessionStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('Consent Management', () => {
    it('should return false when no consent is granted', () => {
      expect(hasFormConsent('test-form')).toBe(false);
    });

    it('should grant consent for a form', () => {
      grantFormConsent('test-form');
      expect(hasFormConsent('test-form')).toBe(true);
    });

    it('should revoke consent and clear drafts', () => {
      grantFormConsent('test-form');
      saveFormDraft('test-form', { field1: 'value1' });
      
      revokeFormConsent('test-form');
      
      expect(hasFormConsent('test-form')).toBe(false);
      expect(hasFormDraft('test-form')).toBe(false);
    });

    it('should maintain separate consent for different forms', () => {
      grantFormConsent('form-1');
      
      expect(hasFormConsent('form-1')).toBe(true);
      expect(hasFormConsent('form-2')).toBe(false);
    });
  });

  describe('PII Filtering', () => {
    beforeEach(() => {
      grantFormConsent('test-form');
    });

    it('should filter out name fields', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        subject: 'Test Subject',
      };

      saveFormDraft('test-form', data);
      const loaded = loadFormDraft('test-form');

      expect(loaded).not.toHaveProperty('firstName');
      expect(loaded).not.toHaveProperty('lastName');
      expect(loaded).not.toHaveProperty('fullName');
      expect(loaded).toHaveProperty('subject');
    });

    it('should filter out email fields', () => {
      const data = {
        email: 'test@example.com',
        contactEmail: 'contact@example.com',
        subject: 'Test Subject',
      };

      saveFormDraft('test-form', data);
      const loaded = loadFormDraft('test-form');

      expect(loaded).not.toHaveProperty('email');
      expect(loaded).not.toHaveProperty('contactEmail');
      expect(loaded).toHaveProperty('subject');
    });

    it('should filter out phone fields', () => {
      const data = {
        phone: '+1234567890',
        phoneNumber: '+1234567890',
        tel: '+1234567890',
        subject: 'Test Subject',
      };

      saveFormDraft('test-form', data);
      const loaded = loadFormDraft('test-form');

      expect(loaded).not.toHaveProperty('phone');
      expect(loaded).not.toHaveProperty('phoneNumber');
      expect(loaded).not.toHaveProperty('tel');
      expect(loaded).toHaveProperty('subject');
    });

    it('should filter out password fields', () => {
      const data = {
        password: 'secret123',
        confirmPassword: 'secret123',
        subject: 'Test Subject',
      };

      saveFormDraft('test-form', data);
      const loaded = loadFormDraft('test-form');

      expect(loaded).not.toHaveProperty('password');
      expect(loaded).not.toHaveProperty('confirmPassword');
      expect(loaded).toHaveProperty('subject');
    });

    it('should filter out credit card fields', () => {
      const data = {
        creditCard: '1234567890123456',
        cardNumber: '1234567890123456',
        cvv: '123',
        subject: 'Test Subject',
      };

      saveFormDraft('test-form', data);
      const loaded = loadFormDraft('test-form');

      expect(loaded).not.toHaveProperty('creditCard');
      expect(loaded).not.toHaveProperty('cardNumber');
      expect(loaded).not.toHaveProperty('cvv');
      expect(loaded).toHaveProperty('subject');
    });

    it('should filter out identification fields', () => {
      const data = {
        ssn: '123-45-6789',
        passport: 'AB1234567',
        license: 'DL123456',
        nationalId: 'ID123456',
        subject: 'Test Subject',
      };

      saveFormDraft('test-form', data);
      const loaded = loadFormDraft('test-form');

      expect(loaded).not.toHaveProperty('ssn');
      expect(loaded).not.toHaveProperty('passport');
      expect(loaded).not.toHaveProperty('license');
      expect(loaded).not.toHaveProperty('nationalId');
      expect(loaded).toHaveProperty('subject');
    });

    it('should preserve non-PII fields', () => {
      const data = {
        subject: 'Test Subject',
        message: 'Test Message',
        product: 'Cocoa',
        volume: '20 tons',
        destination: 'Europe',
        incoterm: 'FOB',
      };

      saveFormDraft('test-form', data);
      const loaded = loadFormDraft('test-form');

      expect(loaded).toEqual(data);
    });
  });

  describe('Draft Saving and Loading', () => {
    beforeEach(() => {
      grantFormConsent('test-form');
    });

    it('should save and load draft data', () => {
      const data = {
        subject: 'Test Subject',
        message: 'Test Message',
      };

      const saved = saveFormDraft('test-form', data);
      expect(saved).toBe(true);

      const loaded = loadFormDraft('test-form');
      expect(loaded).toEqual(data);
    });

    it('should not save draft without consent', () => {
      revokeFormConsent('test-form');

      const data = { subject: 'Test' };
      const saved = saveFormDraft('test-form', data);

      expect(saved).toBe(false);
      expect(hasFormDraft('test-form')).toBe(false);
    });

    it('should not load draft without consent', () => {
      const data = { subject: 'Test' };
      saveFormDraft('test-form', data);

      revokeFormConsent('test-form');
      grantFormConsent('test-form'); // Grant again but draft should not load

      const loaded = loadFormDraft('test-form');
      expect(loaded).toBeNull();
    });

    it('should clear draft data', () => {
      const data = { subject: 'Test' };
      saveFormDraft('test-form', data);

      clearFormDraft('test-form');

      expect(hasFormDraft('test-form')).toBe(false);
      expect(loadFormDraft('test-form')).toBeNull();
    });

    it('should maintain separate drafts for different forms', () => {
      grantFormConsent('form-1');
      grantFormConsent('form-2');

      saveFormDraft('form-1', { subject: 'Form 1' });
      saveFormDraft('form-2', { subject: 'Form 2' });

      expect(loadFormDraft('form-1')).toEqual({ subject: 'Form 1' });
      expect(loadFormDraft('form-2')).toEqual({ subject: 'Form 2' });
    });
  });

  describe('Draft Expiration', () => {
    beforeEach(() => {
      grantFormConsent('test-form');
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should expire draft after 30 minutes', () => {
      const data = { subject: 'Test' };
      saveFormDraft('test-form', data);

      // Advance time by 31 minutes
      vi.advanceTimersByTime(31 * 60 * 1000);

      const loaded = loadFormDraft('test-form');
      expect(loaded).toBeNull();
      expect(hasFormDraft('test-form')).toBe(false);
    });

    it('should not expire draft before 30 minutes', () => {
      const data = { subject: 'Test' };
      saveFormDraft('test-form', data);

      // Advance time by 29 minutes
      vi.advanceTimersByTime(29 * 60 * 1000);

      const loaded = loadFormDraft('test-form');
      expect(loaded).toEqual(data);
    });

    it('should return correct draft age', () => {
      saveFormDraft('test-form', { subject: 'Test' });

      // Advance time by 10 minutes
      vi.advanceTimersByTime(10 * 60 * 1000);

      const age = getDraftAge('test-form');
      expect(age).toBe(10 * 60 * 1000);
    });

    it('should return correct time remaining', () => {
      saveFormDraft('test-form', { subject: 'Test' });

      // Advance time by 10 minutes
      vi.advanceTimersByTime(10 * 60 * 1000);

      const remaining = getDraftTimeRemaining('test-form');
      expect(remaining).toBe(20 * 60 * 1000); // 20 minutes remaining
    });

    it('should return null time remaining for expired draft', () => {
      saveFormDraft('test-form', { subject: 'Test' });

      // Advance time by 31 minutes
      vi.advanceTimersByTime(31 * 60 * 1000);

      const remaining = getDraftTimeRemaining('test-form');
      expect(remaining).toBeNull();
    });
  });

  describe('Time Formatting', () => {
    it('should format time remaining in English', () => {
      expect(formatTimeRemaining(60000, 'en')).toBe('1 minute');
      expect(formatTimeRemaining(120000, 'en')).toBe('2 minutes');
      expect(formatTimeRemaining(600000, 'en')).toBe('10 minutes');
    });

    it('should format time remaining in French', () => {
      expect(formatTimeRemaining(60000, 'fr')).toBe('1 minute');
      expect(formatTimeRemaining(120000, 'fr')).toBe('2 minutes');
      expect(formatTimeRemaining(600000, 'fr')).toBe('10 minutes');
    });

    it('should round up partial minutes', () => {
      expect(formatTimeRemaining(90000, 'en')).toBe('2 minutes'); // 1.5 minutes -> 2
      expect(formatTimeRemaining(150000, 'en')).toBe('3 minutes'); // 2.5 minutes -> 3
    });
  });

  describe('Error Handling', () => {
    it('should handle sessionStorage errors gracefully', () => {
      const originalSetItem = sessionStorageMock.setItem;
      sessionStorageMock.setItem = () => {
        throw new Error('Storage full');
      };

      grantFormConsent('test-form');
      const saved = saveFormDraft('test-form', { subject: 'Test' });

      expect(saved).toBe(false);

      sessionStorageMock.setItem = originalSetItem;
    });

    it('should handle corrupted data gracefully', () => {
      grantFormConsent('test-form');
      sessionStorageMock.setItem('form_draft_test-form', 'invalid json');

      const loaded = loadFormDraft('test-form');
      expect(loaded).toBeNull();
    });
  });
});
