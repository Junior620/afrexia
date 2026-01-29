/**
 * Sanity Image URL Builder
 * 
 * Utility functions for building optimized image URLs from Sanity image references.
 * Integrates with Sanity's image CDN for automatic optimization.
 */

import { SanityImage } from '@/types/product';

/**
 * Build optimized image URL from Sanity image reference
 * 
 * @param image - Sanity image object with asset reference
 * @param options - Optional image transformation parameters
 * @returns Optimized image URL
 * 
 * @example
 * const url = buildSanityImageUrl(product.heroImage, { width: 800, quality: 85 });
 */
export function buildSanityImageUrl(
  image: SanityImage | null | undefined,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpg' | 'png' | 'webp' | 'auto';
    fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
    auto?: 'format';
  }
): string {
  // Fallback to placeholder if no image
  if (!image?.asset?._ref) {
    return '/assets/placeholder.svg';
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!projectId || !dataset) {
    console.error('Sanity project ID or dataset not configured');
    return '/assets/placeholder.svg';
  }

  // Extract image ID from reference
  // Format: image-{id}-{dimensions}-{format}
  const ref = image.asset._ref;
  const parts = ref.split('-');
  
  if (parts.length < 4) {
    console.error('Invalid Sanity image reference format:', ref);
    return '/assets/placeholder.svg';
  }

  const [, id, dimensions, format] = parts;

  // Build base URL
  let url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;

  // Add query parameters for optimization
  const params: string[] = [];

  if (options?.width) {
    params.push(`w=${options.width}`);
  }

  if (options?.height) {
    params.push(`h=${options.height}`);
  }

  if (options?.quality) {
    params.push(`q=${options.quality}`);
  }

  if (options?.format) {
    params.push(`fm=${options.format}`);
  }

  if (options?.fit) {
    params.push(`fit=${options.fit}`);
  }

  if (options?.auto) {
    params.push(`auto=${options.auto}`);
  }

  // Apply hotspot/crop if available
  if (image.hotspot) {
    params.push(`rect=${image.hotspot.x},${image.hotspot.y},${image.hotspot.width},${image.hotspot.height}`);
  }

  if (image.crop) {
    const { top, bottom, left, right } = image.crop;
    params.push(`crop=top:${top},bottom:${bottom},left:${left},right:${right}`);
  }

  // Append query parameters
  if (params.length > 0) {
    url += '?' + params.join('&');
  }

  return url;
}

/**
 * Build responsive srcset for Sanity image
 * 
 * @param image - Sanity image object
 * @param widths - Array of widths for srcset
 * @returns srcset string
 */
export function buildSanitySrcSet(
  image: SanityImage | null | undefined,
  widths: number[] = [320, 640, 768, 1024, 1280, 1536]
): string {
  if (!image?.asset?._ref) {
    return '';
  }

  return widths
    .map((width) => {
      const url = buildSanityImageUrl(image, { width, auto: 'format' });
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Get optimized image URL for product cards
 * Applies default optimizations for catalog display
 */
export function getProductCardImageUrl(image: SanityImage | null | undefined): string {
  return buildSanityImageUrl(image, {
    width: 800,
    quality: 85,
    format: 'auto',
    fit: 'crop',
  });
}

/**
 * Get optimized image URL for product detail pages
 * Higher quality for detail view
 */
export function getProductDetailImageUrl(image: SanityImage | null | undefined): string {
  return buildSanityImageUrl(image, {
    width: 1200,
    quality: 90,
    format: 'auto',
    fit: 'crop',
  });
}

/**
 * Get optimized thumbnail URL
 * Smaller size for thumbnails in RFQ drawer, etc.
 */
export function getThumbnailImageUrl(image: SanityImage | null | undefined): string {
  return buildSanityImageUrl(image, {
    width: 200,
    quality: 80,
    format: 'auto',
    fit: 'crop',
  });
}
