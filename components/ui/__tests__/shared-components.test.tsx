import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Select } from '../Select';
import { Badge, AvailabilityBadge, EUDRBadge, CertificationBadge } from '../Badge';

describe('Shared UI Components', () => {
  describe('Button', () => {
    it('renders with primary variant', () => {
      render(<Button variant="primary">Click me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeDefined();
      expect(button.className).toContain('bg-primary');
    });

    it('renders with secondary variant', () => {
      render(<Button variant="secondary">Click me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button.className).toContain('bg-white');
      expect(button.className).toContain('border-primary');
    });

    it('renders with ghost variant', () => {
      render(<Button variant="ghost">Click me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button.className).toContain('bg-transparent');
    });

    it('shows loading state', () => {
      render(<Button loading>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button.disabled).toBe(true);
      expect(button.querySelector('svg')).toBeDefined();
    });

    it('handles disabled state', () => {
      render(<Button disabled>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button.disabled).toBe(true);
    });

    it('renders with icon on left', () => {
      const icon = <span data-testid="icon">🔍</span>;
      render(
        <Button icon={icon} iconPosition="left">
          Search
        </Button>
      );
      expect(screen.getByTestId('icon')).toBeDefined();
    });

    it('renders with icon on right', () => {
      const icon = <span data-testid="icon">→</span>;
      render(
        <Button icon={icon} iconPosition="right">
          Next
        </Button>
      );
      expect(screen.getByTestId('icon')).toBeDefined();
    });

    it('has minimum 44px height for touch targets', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('min-h-[44px]');
    });
  });

  describe('Input', () => {
    it('renders with label', () => {
      render(<Input label="Email" />);
      expect(screen.getByLabelText(/email/i)).toBeDefined();
    });

    it('renders with placeholder', () => {
      render(<Input placeholder="Enter email" />);
      expect(screen.getByPlaceholderText(/enter email/i)).toBeDefined();
    });

    it('shows error message', () => {
      render(<Input label="Email" error="Invalid email" />);
      const alert = screen.getByRole('alert');
      expect(alert.textContent).toContain('Invalid email');
    });

    it('shows helper text', () => {
      render(<Input label="Email" helperText="We'll never share your email" />);
      expect(screen.getByText(/we'll never share/i)).toBeDefined();
    });

    it('marks required fields with asterisk', () => {
      render(<Input label="Email" required />);
      expect(screen.getByLabelText(/required/i)).toBeDefined();
    });

    it('has proper ARIA attributes for errors', () => {
      render(<Input label="Email" error="Invalid email" />);
      const input = screen.getByLabelText(/email/i);
      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(input.getAttribute('aria-describedby')).toBeDefined();
    });

    it('has minimum 44px height for touch targets', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('min-h-[44px]');
    });
  });

  describe('Select', () => {
    const options = [
      { value: 'cocoa', label: 'Cocoa' },
      { value: 'coffee', label: 'Coffee' },
      { value: 'spices', label: 'Spices' },
    ];

    it('renders with label', () => {
      render(
        <Select
          label="Category"
          options={options}
          onChange={() => {}}
        />
      );
      expect(screen.getByText(/category/i)).toBeDefined();
    });

    it('shows placeholder when no value selected', () => {
      render(
        <Select
          placeholder="Select category"
          options={options}
          onChange={() => {}}
        />
      );
      expect(screen.getByText(/select category/i)).toBeDefined();
    });

    it('opens dropdown on click', () => {
      render(
        <Select
          options={options}
          onChange={() => {}}
        />
      );
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(screen.getByRole('listbox')).toBeDefined();
    });

    it('displays options in dropdown', () => {
      render(
        <Select
          options={options}
          onChange={() => {}}
        />
      );
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(screen.getByText('Cocoa')).toBeDefined();
      expect(screen.getByText('Coffee')).toBeDefined();
      expect(screen.getByText('Spices')).toBeDefined();
    });

    it('calls onChange when option selected', () => {
      const handleChange = vi.fn();
      render(
        <Select
          options={options}
          onChange={handleChange}
        />
      );
      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(screen.getByText('Cocoa'));
      expect(handleChange).toHaveBeenCalledWith('cocoa');
    });

    it('supports multiple selection', () => {
      const handleChange = vi.fn();
      render(
        <Select
          options={options}
          onChange={handleChange}
          multiple
        />
      );
      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(screen.getByText('Cocoa'));
      expect(handleChange).toHaveBeenCalledWith(['cocoa']);
    });

    it('has minimum 44px height for touch targets', () => {
      render(
        <Select
          options={options}
          onChange={() => {}}
        />
      );
      const button = screen.getByRole('button');
      expect(button.className).toContain('min-h-[44px]');
    });

    it('supports keyboard navigation', () => {
      render(
        <Select
          options={options}
          onChange={() => {}}
        />
      );
      const button = screen.getByRole('button');
      
      // Open with Enter
      fireEvent.keyDown(button, { key: 'Enter' });
      expect(screen.getByRole('listbox')).toBeDefined();
      
      // Close with Escape
      fireEvent.keyDown(button, { key: 'Escape' });
      expect(screen.queryByRole('listbox')).toBeNull();
    });
  });

  describe('Badge', () => {
    it('renders with default variant', () => {
      render(<Badge>Default</Badge>);
      expect(screen.getByText('Default')).toBeDefined();
    });

    it('renders with availability variant', () => {
      const { container } = render(<Badge variant="availability">In Stock</Badge>);
      const badge = container.querySelector('span');
      expect(badge?.className).toContain('bg-success/90');
    });

    it('renders with certification variant', () => {
      const { container } = render(<Badge variant="certification">Organic</Badge>);
      const badge = container.querySelector('span');
      expect(badge?.className).toContain('bg-primary/90');
    });

    it('renders with eudr variant', () => {
      const { container } = render(<Badge variant="eudr">EUDR Ready</Badge>);
      const badge = container.querySelector('span');
      expect(badge?.className).toContain('bg-success/90');
    });

    it('renders with icon', () => {
      const icon = <span data-testid="badge-icon">✓</span>;
      render(<Badge icon={icon}>Verified</Badge>);
      expect(screen.getByTestId('badge-icon')).toBeDefined();
    });
  });

  describe('AvailabilityBadge', () => {
    it('renders in-stock badge', () => {
      render(<AvailabilityBadge status="in-stock" label="In Stock" />);
      expect(screen.getByText('In Stock')).toBeDefined();
    });

    it('renders limited badge', () => {
      render(<AvailabilityBadge status="limited" label="Limited Stock" />);
      expect(screen.getByText('Limited Stock')).toBeDefined();
    });

    it('renders pre-order badge', () => {
      render(<AvailabilityBadge status="pre-order" label="Pre-order" />);
      expect(screen.getByText('Pre-order')).toBeDefined();
    });
  });

  describe('EUDRBadge', () => {
    it('renders EUDR badge', () => {
      render(<EUDRBadge label="EUDR Ready" />);
      expect(screen.getByText('EUDR Ready')).toBeDefined();
    });
  });

  describe('CertificationBadge', () => {
    it('renders certification badge', () => {
      render(<CertificationBadge label="Organic" />);
      expect(screen.getByText('Organic')).toBeDefined();
    });

    it('renders with custom icon', () => {
      const icon = <span data-testid="cert-icon">🌿</span>;
      render(<CertificationBadge label="Organic" icon={icon} />);
      expect(screen.getByTestId('cert-icon')).toBeDefined();
    });
  });
});
