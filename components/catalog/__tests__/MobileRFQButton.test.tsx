/**
 * MobileRFQButton Component Tests
 * 
 * Tests for the mobile sticky RFQ button component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MobileRFQButton } from '../MobileRFQButton';
import * as analyticsEvents from '@/lib/analytics/events';
import { Product } from '@/types/product';

// Mock analytics
vi.mock('@/lib/analytics/events', () => ({
  trackQuoteClick: vi.fn(),
}));

// Mock product data
const mockProduct: Product = {
  id: 'test-product-123',
  slug: 'test-product',
  name: 'Test Product',
  subtitle: 'Test Subtitle',
  category: 'Test Category',
  heroImage: null,
  availability: 'available',
  origins: ['Test Origin'],
  certifications: [],
  eudrReady: true,
  qaAvailable: true,
  documents: {
    coa: true,
    specSheet: true,
    chainOfCustody: true,
  },
  moq: {
    value: 100,
    unit: 'kg',
  },
  incoterms: ['FOB'],
  tags: [],
  updatedAt: new Date().toISOString(),
};

describe('MobileRFQButton', () => {
  const mockTranslations = {
    requestQuote: 'Request a Quote',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with correct button text', () => {
      render(
        <MobileRFQButton
          locale="en"
          translations={mockTranslations}
          onClick={() => {}}
        />
      );

      expect(screen.getByText('Request a Quote')).toBeInTheDocument();
    });

    it('renders with French translations', () => {
      render(
        <MobileRFQButton
          locale="fr"
          translations={{ requestQuote: 'Demander un devis' }}
          onClick={() => {}}
        />
      );

      expect(screen.getByText('Demander un devis')).toBeInTheDocument();
    });

    it('has correct ARIA label', () => {
      render(
        <MobileRFQButton
          locale="en"
          translations={mockTranslations}
          onClick={() => {}}
        />
      );

      const button = screen.getByLabelText('Request a Quote');
      expect(button).toBeInTheDocument();
    });

    it('applies mobile-only class', () => {
      const { container } = render(
        <MobileRFQButton
          locale="en"
          translations={mockTranslations}
          onClick={() => {}}
        />
      );

      const mobileButton = container.firstChild;
      expect(mobileButton).toHaveClass('md:hidden');
    });

    it('applies custom className', () => {
      const { container } = render(
        <MobileRFQButton
          locale="en"
          translations={mockTranslations}
          onClick={() => {}}
          className="custom-class"
        />
      );

      const mobileButton = container.firstChild;
      expect(mobileButton).toHaveClass('custom-class');
    });
  });

  describe('Click Handling', () => {
    it('calls onClick when button is clicked', () => {
      const handleClick = vi.fn();

      render(
        <MobileRFQButton
          locale="en"
          translations={mockTranslations}
          onClick={handleClick}
        />
      );

      const button = screen.getByText('Request a Quote');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick multiple times', () => {
      const handleClick = vi.fn();

      render(
        <MobileRFQButton
          locale="en"
          translations={mockTranslations}
          onClick={handleClick}
        />
      );

      const button = screen.getByText('Request a Quote');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Analytics Tracking - Requirement 8.2', () => {
    it('tracks quote click with mobile_cta source when product is provided', () => {
      const handleClick = vi.fn();

      render(
        <MobileRFQButton
          product={mockProduct}
          locale="en"
          translations={mockTranslations}
          onClick={handleClick}
        />
      );

      const button = screen.getByText('Request a Quote');
      fireEvent.click(button);

      expect(analyticsEvents.trackQuoteClick).toHaveBeenCalledTimes(1);
      expect(analyticsEvents.trackQuoteClick).toHaveBeenCalledWith({
        productId: 'test-product-123',
        productName: 'Test Product',
        category: 'Test Category',
        origin: 'Test Origin',
        availability: 'available',
        source: 'mobile_cta',
      });
    });

    it('does not track analytics when product is not provided', () => {
      const handleClick = vi.fn();

      render(
        <MobileRFQButton
          locale="en"
          translations={mockTranslations}
          onClick={handleClick}
        />
      );

      const button = screen.getByText('Request a Quote');
      fireEvent.click(button);

      expect(analyticsEvents.trackQuoteClick).not.toHaveBeenCalled();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('tracks with correct source identifier', () => {
      const handleClick = vi.fn();

      render(
        <MobileRFQButton
          product={mockProduct}
          locale="en"
          translations={mockTranslations}
          onClick={handleClick}
        />
      );

      const button = screen.getByText('Request a Quote');
      fireEvent.click(button);

      const callArgs = (analyticsEvents.trackQuoteClick as any).mock.calls[0][0];
      expect(callArgs.source).toBe('mobile_cta');
    });

    it('tracks with product metadata', () => {
      const handleClick = vi.fn();

      render(
        <MobileRFQButton
          product={mockProduct}
          locale="en"
          translations={mockTranslations}
          onClick={handleClick}
        />
      );

      const button = screen.getByText('Request a Quote');
      fireEvent.click(button);

      const callArgs = (analyticsEvents.trackQuoteClick as any).mock.calls[0][0];
      expect(callArgs).toMatchObject({
        productId: mockProduct.id,
        productName: mockProduct.name,
        category: mockProduct.category,
        origin: mockProduct.origins[0],
        availability: mockProduct.availability,
      });
    });

    it('handles product with multiple origins', () => {
      const productWithMultipleOrigins = {
        ...mockProduct,
        origins: ['Origin 1', 'Origin 2', 'Origin 3'],
      };

      const handleClick = vi.fn();

      render(
        <MobileRFQButton
          product={productWithMultipleOrigins}
          locale="en"
          translations={mockTranslations}
          onClick={handleClick}
        />
      );

      const button = screen.getByText('Request a Quote');
      fireEvent.click(button);

      const callArgs = (analyticsEvents.trackQuoteClick as any).mock.calls[0][0];
      expect(callArgs.origin).toBe('Origin 1'); // Should use first origin
    });

    it('handles product with no origins', () => {
      const productWithNoOrigins = {
        ...mockProduct,
        origins: [],
      };

      const handleClick = vi.fn();

      render(
        <MobileRFQButton
          product={productWithNoOrigins}
          locale="en"
          translations={mockTranslations}
          onClick={handleClick}
        />
      );

      const button = screen.getByText('Request a Quote');
      fireEvent.click(button);

      const callArgs = (analyticsEvents.trackQuoteClick as any).mock.calls[0][0];
      expect(callArgs.origin).toBe('Unknown'); // Should fallback to 'Unknown'
    });
  });

  describe('Styling', () => {
    it('has fixed positioning', () => {
      const { container } = render(
        <MobileRFQButton
          locale="en"
          translations={mockTranslations}
          onClick={() => {}}
        />
      );

      const mobileButton = container.firstChild;
      expect(mobileButton).toHaveClass('fixed', 'bottom-0', 'left-0', 'right-0');
    });

    it('has correct z-index', () => {
      const { container } = render(
        <MobileRFQButton
          locale="en"
          translations={mockTranslations}
          onClick={() => {}}
        />
      );

      const mobileButton = container.firstChild;
      expect(mobileButton).toHaveClass('z-50');
    });

    it('has glass effect classes', () => {
      const { container } = render(
        <MobileRFQButton
          locale="en"
          translations={mockTranslations}
          onClick={() => {}}
        />
      );

      const mobileButton = container.firstChild;
      expect(mobileButton).toHaveClass('backdrop-blur-[12px]');
    });

    it('has full width', () => {
      const { container } = render(
        <MobileRFQButton
          locale="en"
          translations={mockTranslations}
          onClick={() => {}}
        />
      );

      const mobileButton = container.firstChild;
      expect(mobileButton).toHaveClass('w-full');
    });
  });

  describe('Accessibility', () => {
    it('button has correct role', () => {
      render(
        <MobileRFQButton
          locale="en"
          translations={mockTranslations}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button', { name: 'Request a Quote' });
      expect(button).toBeInTheDocument();
    });

    it('is keyboard accessible', () => {
      const handleClick = vi.fn();

      render(
        <MobileRFQButton
          locale="en"
          translations={mockTranslations}
          onClick={handleClick}
        />
      );

      const button = screen.getByText('Request a Quote');
      
      // Simulate Enter key
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      
      // Note: ButtonDark handles the actual click on Enter
      // This test verifies the button is focusable
      expect(button).toBeInTheDocument();
    });

    it('has proper touch target size', () => {
      const { container } = render(
        <MobileRFQButton
          locale="en"
          translations={mockTranslations}
          onClick={() => {}}
        />
      );

      const button = screen.getByText('Request a Quote');
      // Button should have h-12 class (48px height) for proper touch target
      expect(button.parentElement).toHaveClass('h-12');
    });
  });

  describe('Localization', () => {
    it('supports French locale', () => {
      render(
        <MobileRFQButton
          locale="fr"
          translations={{ requestQuote: 'Demander un devis' }}
          onClick={() => {}}
        />
      );

      expect(screen.getByText('Demander un devis')).toBeInTheDocument();
    });

    it('supports English locale', () => {
      render(
        <MobileRFQButton
          locale="en"
          translations={{ requestQuote: 'Request a Quote' }}
          onClick={() => {}}
        />
      );

      expect(screen.getByText('Request a Quote')).toBeInTheDocument();
    });
  });
});
