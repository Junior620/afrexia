// Export all animation components with dynamic imports for code splitting
import dynamic from 'next/dynamic';

// Lazy load animation components to reduce initial bundle size
// These components use GSAP which is a heavy library
export const ScrollReveal = dynamic(
  () => import('./ScrollReveal').then((mod) => ({ default: mod.ScrollReveal })),
  {
    ssr: true,
  }
);

export const CounterAnimation = dynamic(
  () => import('./CounterAnimation').then((mod) => ({ default: mod.CounterAnimation })),
  {
    ssr: true,
  }
);

export const SupplyChainAnimation = dynamic(
  () => import('./SupplyChainAnimation').then((mod) => ({ default: mod.SupplyChainAnimation })),
  {
    ssr: false,
  }
);

export type { AnimationType } from './ScrollReveal';
