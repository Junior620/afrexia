/**
 * PageSkeleton Components
 *
 * Loading skeleton components for programmatic SEO pages.
 * Used as Suspense fallbacks to enable HTML streaming and improve FCP.
 *
 * All components are Server Components (no "use client").
 *
 * @see Requirements 1.16.7
 */

// ============================================================================
// Shared primitives
// ============================================================================

function SkeletonLine({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 ${className}`}
      aria-hidden="true"
    />
  );
}

function SkeletonBlock({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Breadcrumb skeleton
// ============================================================================

export function BreadcrumbSkeleton() {
  return (
    <nav aria-label="breadcrumb" className="mb-6">
      <div className="flex gap-2" aria-hidden="true">
        <SkeletonLine className="h-4 w-16" />
        <SkeletonLine className="h-4 w-4" />
        <SkeletonLine className="h-4 w-24" />
        <SkeletonLine className="h-4 w-4" />
        <SkeletonLine className="h-4 w-32" />
      </div>
    </nav>
  );
}

// ============================================================================
// Product × Country page skeleton
// ============================================================================

export function ProductCountryPageSkeleton() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl" aria-busy="true">
      <BreadcrumbSkeleton />

      {/* Title */}
      <SkeletonLine className="mb-4 h-9 w-2/3" />

      {/* Intro */}
      <SkeletonBlock lines={4} className="mb-8" />

      {/* Country description */}
      <div className="mb-8 rounded-lg bg-gray-50 p-6" aria-hidden="true">
        <SkeletonBlock lines={3} />
      </div>

      {/* Certifications */}
      <section className="mb-8">
        <SkeletonLine className="mb-4 h-7 w-48" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <SkeletonLine key={i} className="h-7 w-24 rounded-full" />
          ))}
        </div>
      </section>

      {/* Transit time */}
      <div className="mb-8 rounded-lg border border-blue-100 bg-blue-50 p-4" aria-hidden="true">
        <SkeletonLine className="h-5 w-48" />
      </div>

      {/* FAQs */}
      <section className="mb-8">
        <SkeletonLine className="mb-4 h-7 w-48" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-4">
              <SkeletonLine className="mb-2 h-5 w-3/4" />
              <SkeletonBlock lines={2} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

// ============================================================================
// Price page skeleton
// ============================================================================

export function PricePageSkeleton() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl" aria-busy="true">
      <BreadcrumbSkeleton />

      {/* Title */}
      <SkeletonLine className="mb-2 h-9 w-2/3" />
      <SkeletonLine className="mb-8 h-4 w-48" />

      {/* Current price card */}
      <section className="mb-8">
        <SkeletonLine className="mb-4 h-7 w-36" />
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm" aria-hidden="true">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <SkeletonLine className="h-10 w-48" />
              <SkeletonLine className="h-3 w-64" />
            </div>
            <SkeletonLine className="h-16 w-28 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Chart */}
      <section className="mb-8">
        <SkeletonLine className="mb-4 h-7 w-56" />
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm" aria-hidden="true">
          <SkeletonLine className="h-48 w-full" />
        </div>
      </section>

      {/* History table */}
      <section className="mb-8">
        <SkeletonLine className="mb-4 h-7 w-56" />
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm" aria-hidden="true">
          <div className="divide-y divide-gray-100 bg-white">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between px-4 py-2">
                <SkeletonLine className="h-4 w-32" />
                <SkeletonLine className="h-4 w-24" />
                <SkeletonLine className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

// ============================================================================
// Comparison page skeleton
// ============================================================================

export function ComparisonPageSkeleton() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl" aria-busy="true">
      <BreadcrumbSkeleton />

      {/* Title */}
      <SkeletonLine className="mb-4 h-9 w-2/3" />

      {/* Intro */}
      <SkeletonBlock lines={3} className="mb-8" />

      {/* Comparison table */}
      <section className="mb-8">
        <SkeletonLine className="mb-4 h-7 w-48" />
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm" aria-hidden="true">
          <div className="divide-y divide-gray-100 bg-white">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 px-4 py-3">
                <SkeletonLine className="h-4 w-1/3" />
                <SkeletonLine className="h-4 w-1/3" />
                <SkeletonLine className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content sections */}
      {[1, 2, 3].map((i) => (
        <section key={i} className="mb-8">
          <SkeletonLine className="mb-3 h-7 w-64" />
          <div className="rounded-lg bg-gray-50 border border-gray-100 p-5" aria-hidden="true">
            <SkeletonBlock lines={3} />
          </div>
        </section>
      ))}
    </main>
  );
}
