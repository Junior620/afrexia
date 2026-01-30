/**
 * Shared UI components for the product catalog
 * Export all reusable components from a single entry point
 */

export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Input } from './Input';
export type { InputProps } from './Input';

export { Select } from './Select';
export type { SelectProps, SelectOption } from './Select';

export {
  Badge,
  AvailabilityBadge,
  EUDRBadge,
  CertificationBadge,
} from './Badge';
export type { BadgeProps, BadgeVariant } from './Badge';

// Dark theme components
export { ButtonDark } from './ButtonDark';
export type { ButtonDarkProps } from './ButtonDark';

export { InputDark } from './InputDark';
export type { InputDarkProps } from './InputDark';

export { SelectDark } from './SelectDark';
export type { SelectDarkProps, SelectDarkOption } from './SelectDark';

export {
  BadgeDark,
  AvailabilityBadgeDark,
  EUDRBadgeDark,
  CertificationBadgeDark,
} from './BadgeDark';
export type { BadgeDarkProps, BadgeDarkVariant, BadgeDarkSize } from './BadgeDark';

export { LoadingSpinner, ButtonLoading } from './LoadingSpinner';

export { EmptyState, NoProductsFound, EmptyRFQCart, NoSearchResults } from './EmptyState';

export { Toast, ToastContainer, useToast } from './Toast';
export type { ToastType } from './Toast';

// Re-export existing components
export { CTAButton } from './CTAButton';
export { DownloadButton } from './DownloadButton';
export { OptimizedImage } from './OptimizedImage';
export { ThemeToggle } from './ThemeToggle';
