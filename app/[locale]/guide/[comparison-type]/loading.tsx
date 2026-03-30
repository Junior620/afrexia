/**
 * Loading UI for Comparison/Guide pages
 *
 * Next.js automatically wraps page.tsx in a Suspense boundary when loading.tsx
 * is present, enabling HTML streaming and improving First Contentful Paint (FCP).
 *
 * @see Requirements 1.16.7
 */

import { ComparisonPageSkeleton } from '@/components/seo/PageSkeleton';

export default function Loading() {
  return <ComparisonPageSkeleton />;
}
