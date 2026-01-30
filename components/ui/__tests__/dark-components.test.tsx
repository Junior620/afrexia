import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  ButtonDark,
  InputDark,
  SelectDark,
  BadgeDark,
  AvailabilityBadgeDark,
  EUDRBadgeDark,
  CertificationBadgeDark,
} from '../index';

describe('Dark Components', () => {
  describe('ButtonDark', () => {
    it('renders with primary variant', () => {
      render(<ButtonDark variant="primary">Click me</ButtonDark>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
    });

    it('renders with secondary variant', () => {
      render(<ButtonDark variant="secondary">Click me</ButtonDark>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
    });

    it('renders with ghost variant', () => {
      render(<ButtonDark variant="ghost">Click me</ButtonDark>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
    });

    it('renders with different sizes', () => {
      const { rerender } = render(<ButtonDark size="sm">Small</ButtonDark>);
      expect(screen.getByRole('button')).toBeInTheDocument();

      rerender(<ButtonDark size="md">Medium</ButtonDark>);
      expect(screen.getByRole('button')).toBeInTheDocument();

      rerender(<ButtonDark size="lg">Large</ButtonDark>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('shows loading state', () => {
      render(<ButtonDark loading>Loading</ButtonDark>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('handles disabled state', () => {
      render(<ButtonDark disabled>Disabled</ButtonDark>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('renders with icon on left', () => {
      render(
        <ButtonDark icon={<span data-testid="icon">Icon</span>} iconPosition="left">
          With Icon
        </ButtonDark>
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('renders with icon on right', () => {
      render(
        <ButtonDark icon={<span data-testid="icon">Icon</span>} iconPosition="right">
          With Icon
        </ButtonDark>
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });

  describe('InputDark', () => {
    it('renders with label', () => {
      render(<InputDark label="Email" />);
      expect(screen.getByText(/email/i)).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      render(<InputDark placeholder="Enter email" />);
      expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
    });

    it('renders with error message', () => {
      render(<InputDark error="This field is required" />);
      expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
    });

    it('renders with helper text', () => {
      render(<InputDark helperText="Enter your email address" />);
      expect(screen.getByText(/enter your email address/i)).toBeInTheDocument();
    });

    it('handles disabled state', () => {
      render(<InputDark disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('shows required indicator', () => {
      render(<InputDark label="Email" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('SelectDark', () => {
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      { value: '3', label: 'Option 3' },
    ];

    it('renders with label', () => {
      render(<SelectDark label="Category" options={options} onChange={vi.fn()} />);
      expect(screen.getByText(/category/i)).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      render(
        <SelectDark placeholder="Select option" options={options} onChange={vi.fn()} />
      );
      expect(screen.getByText(/select option/i)).toBeInTheDocument();
    });

    it('opens dropdown on click', () => {
      render(<SelectDark options={options} onChange={vi.fn()} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('handles single selection', () => {
      const onChange = vi.fn();
      render(<SelectDark options={options} onChange={onChange} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const option = screen.getByRole('option', { name: /option 1/i });
      fireEvent.click(option);
      
      expect(onChange).toHaveBeenCalledWith('1');
    });

    it('handles multiple selection', () => {
      const onChange = vi.fn();
      render(<SelectDark options={options} onChange={onChange} multiple />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const option1 = screen.getByRole('option', { name: /option 1/i });
      fireEvent.click(option1);
      
      expect(onChange).toHaveBeenCalledWith(['1']);
    });

    it('renders with error message', () => {
      render(
        <SelectDark options={options} onChange={vi.fn()} error="This field is required" />
      );
      expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
    });

    it('handles disabled state', () => {
      render(<SelectDark options={options} onChange={vi.fn()} disabled />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('BadgeDark', () => {
    it('renders with availability variant', () => {
      render(<BadgeDark variant="availability">Available</BadgeDark>);
      expect(screen.getByText(/available/i)).toBeInTheDocument();
    });

    it('renders with eudr variant', () => {
      render(<BadgeDark variant="eudr">EUDR-ready</BadgeDark>);
      expect(screen.getByText(/eudr-ready/i)).toBeInTheDocument();
    });

    it('renders with certification variant', () => {
      render(<BadgeDark variant="certification">Certified</BadgeDark>);
      expect(screen.getByText(/certified/i)).toBeInTheDocument();
    });

    it('renders with small size', () => {
      render(
        <BadgeDark variant="availability" size="sm">
          Small
        </BadgeDark>
      );
      expect(screen.getByText(/small/i)).toBeInTheDocument();
    });

    it('renders with medium size', () => {
      render(
        <BadgeDark variant="availability" size="md">
          Medium
        </BadgeDark>
      );
      expect(screen.getByText(/medium/i)).toBeInTheDocument();
    });

    it('renders with icon', () => {
      render(
        <BadgeDark variant="availability" icon={<span data-testid="icon">Icon</span>}>
          With Icon
        </BadgeDark>
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });

  describe('AvailabilityBadgeDark', () => {
    it('renders available status', () => {
      render(<AvailabilityBadgeDark status="available" label="Available" />);
      expect(screen.getByText(/available/i)).toBeInTheDocument();
    });

    it('renders on-request status', () => {
      render(<AvailabilityBadgeDark status="on-request" label="On Request" />);
      expect(screen.getByText(/on request/i)).toBeInTheDocument();
    });

    it('renders out-of-stock status', () => {
      render(<AvailabilityBadgeDark status="out-of-stock" label="Out of Stock" />);
      expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
    });
  });

  describe('EUDRBadgeDark', () => {
    it('renders EUDR badge', () => {
      render(<EUDRBadgeDark label="EUDR-ready" />);
      expect(screen.getByText(/eudr-ready/i)).toBeInTheDocument();
    });
  });

  describe('CertificationBadgeDark', () => {
    it('renders certification badge', () => {
      render(<CertificationBadgeDark label="Organic" />);
      expect(screen.getByText(/organic/i)).toBeInTheDocument();
    });

    it('renders with custom icon', () => {
      render(
        <CertificationBadgeDark
          label="Certified"
          icon={<span data-testid="custom-icon">Icon</span>}
        />
      );
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });
});
