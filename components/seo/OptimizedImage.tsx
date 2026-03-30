/**
 * OptimizedImage Component
 *
 * Reusable SEO-optimized image component for programmatic SEO pages.
 * Uses next/image with lazy loading (default), WebP/AVIF format optimization,
 * and proper accessibility attributes.
 *
 * - Lazy loading is the default behavior of next/image (loading="lazy")
 * - Priority loading available for above-the-fold images via `priority` prop
 * - Formats (WebP, AVIF) are configured globally in next.config.ts
 *
 * This is a Server Component — no "use client" directive.
 *
 * @see Requirements 1.16
 */

import Image from 'next/image';
import type { ImageProps } from 'next/image';

// ============================================================================
// Types
// ============================================================================

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Set to true for above-the-fold images to disable lazy loading */
  priority?: boolean;
  className?: string;
  /** Optional sizes attribute for responsive images */
  sizes?: string;
  /** Optional quality override (default: 80) */
  quality?: number;
  /** Optional fill mode — when true, width/height are ignored and parent must be position:relative */
  fill?: boolean;
  style?: React.CSSProperties;
}

// ============================================================================
// Component
// ============================================================================

/**
 * SEO-optimized image component wrapping next/image.
 *
 * Features:
 * - Lazy loading by default (loading="lazy" is next/image default)
 * - Priority loading for LCP images via `priority` prop
 * - WebP/AVIF format negotiation (configured in next.config.ts)
 * - Responsive srcset via `sizes` prop
 * - Accessible alt text enforcement
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  sizes,
  quality = 80,
  fill = false,
  style,
}: OptimizedImageProps) {
  const imageProps: Partial<ImageProps> = {
    src,
    alt,
    priority,
    quality,
    className,
    sizes,
    style,
  };

  if (fill) {
    return (
      <Image
        {...(imageProps as ImageProps)}
        fill
        // loading is controlled by priority: priority=true disables lazy loading
      />
    );
  }

  return (
    <Image
      {...(imageProps as ImageProps)}
      width={width}
      height={height}
    />
  );
}

// ============================================================================
// Sanity CDN variant
// ============================================================================

interface SanityOptimizedImageProps {
  /** Full Sanity CDN URL (from urlFor().url()) */
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
}

/**
 * Variant for Sanity CDN images.
 * Sanity CDN (cdn.sanity.io) is already whitelisted in next.config.ts remotePatterns.
 */
export function SanityOptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 80,
}: SanityOptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      quality={quality}
      className={className}
      sizes={sizes}
    />
  );
}
