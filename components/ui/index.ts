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

export { LoadingSpinner, ButtonLoading } from './LoadingSpinner';

export { EmptyState, NoProductsFound, EmptyRFQCart, NoSearchResults } from './EmptyState';

export { Toast, ToastContainer, useToast } from './Toast';
export type { ToastType } from './Toast';

// Re-export existing components
export { CTAButton } from './CTAButton';
export { DownloadButton } from './DownloadButton';
export { OptimizedImage } from './OptimizedImage';
export { ThemeToggle } from './ThemeToggle';
