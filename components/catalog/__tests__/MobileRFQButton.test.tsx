import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileRFQButton } from '../MobileRFQButton';

describe('MobileRFQButton', () => {
  const mockOnClick = vi.fn();
  const mockTranslations = {
    requestQuote: 'Request Quote',
    itemsInCart: 'items in cart',
  };

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders the button with correct text', () => {
    render(
      <MobileRFQButton
        cartCount={0}
        onClick={mockOnClick}
        translations={mockTranslations}
      />
    );

    expect(screen.getByText('Request Quote')).toBeDefined();
  });

  it('calls onClick when button is clicked', () => {
    render(
      <MobileRFQButton
        cartCount={0}
        onClick={mockOnClick}
        translations={mockTranslations}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('displays cart count badge when count is greater than 0', () => {
    render(
      <MobileRFQButton
        cartCount={3}
        onClick={mockOnClick}
        translations={mockTranslations}
      />
    );

    expect(screen.getByText('3')).toBeDefined();
  });

  it('does not display badge when cart count is 0', () => {
    const { container } = render(
      <MobileRFQButton
        cartCount={0}
        onClick={mockOnClick}
        translations={mockTranslations}
      />
    );

    // Badge should not be in the document
    const badge = container.querySelector('[aria-label*="items"]');
    expect(badge).toBeNull();
  });

  it('displays "99+" for counts over 99', () => {
    render(
      <MobileRFQButton
        cartCount={150}
        onClick={mockOnClick}
        translations={mockTranslations}
      />
    );

    expect(screen.getByText('99+')).toBeDefined();
  });

  it('has proper accessibility attributes', () => {
    render(
      <MobileRFQButton
        cartCount={3}
        onClick={mockOnClick}
        translations={mockTranslations}
      />
    );

    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toContain('Request Quote');
    expect(button.getAttribute('aria-label')).toContain('3 items in cart');
  });

  it('has minimum touch target size', () => {
    const { container } = render(
      <MobileRFQButton
        cartCount={0}
        onClick={mockOnClick}
        translations={mockTranslations}
      />
    );

    const button = screen.getByRole('button');
    // Check for min-h-[44px] class
    expect(button.className).toContain('min-h-[44px]');
  });

  it('is hidden on desktop (md:hidden class)', () => {
    const { container } = render(
      <MobileRFQButton
        cartCount={0}
        onClick={mockOnClick}
        translations={mockTranslations}
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('md:hidden');
  });

  it('has sticky positioning', () => {
    const { container } = render(
      <MobileRFQButton
        cartCount={0}
        onClick={mockOnClick}
        translations={mockTranslations}
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('fixed');
    expect(wrapper.className).toContain('bottom-0');
  });

  it('renders cart icon', () => {
    const { container } = render(
      <MobileRFQButton
        cartCount={0}
        onClick={mockOnClick}
        translations={mockTranslations}
      />
    );

    // Check for SVG icon
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('updates badge when cart count changes', () => {
    const { rerender } = render(
      <MobileRFQButton
        cartCount={1}
        onClick={mockOnClick}
        translations={mockTranslations}
      />
    );

    expect(screen.getByText('1')).toBeDefined();

    rerender(
      <MobileRFQButton
        cartCount={5}
        onClick={mockOnClick}
        translations={mockTranslations}
      />
    );

    expect(screen.getByText('5')).toBeDefined();
  });

  it('has proper z-index for overlay', () => {
    const { container } = render(
      <MobileRFQButton
        cartCount={0}
        onClick={mockOnClick}
        translations={mockTranslations}
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('z-50');
  });

  it('includes arrow icon', () => {
    const { container } = render(
      <MobileRFQButton
        cartCount={0}
        onClick={mockOnClick}
        translations={mockTranslations}
      />
    );

    // Should have multiple SVG icons (cart icon + arrow icon)
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThanOrEqual(2);
  });
});
