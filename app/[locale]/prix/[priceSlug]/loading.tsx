/**
 * Loading UI for Price pages
 *
 * Next.js automatically wraps page.tsx in a Suspense boundary when loading.tsx
 * is present, enabling HTML streaming and improving First Contentful Paint (FCP).
 *
 * @see Requirements 1.16.7
 */

import { PricePageSkeleton } from '@/components/seo/PageSkeleton';

export default function Loading() {
  return <PricePageSkeleton />;
}
