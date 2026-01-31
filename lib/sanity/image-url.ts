/**
 * Sanity Image URL Builder
 * 
 * Utility functions for building optimized image URLs from Sanity image references.
 * Uses official @sanity/image-url library for reliable URL generation.
 */

import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { SanityImage } from '@/types/product';

// Initialize the builder with your Sanity project details
const builder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || '',
});

/**
 * Build optimized image URL from Sanity image reference
 * 
 * @param image - Sanity image object with asset reference
 * @param options - Optional image transformation parameters
 * @returns Optimized image URL
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
  if (!image?.asset) {
    return '/assets/placeholder.svg';
  }

  try {
    let urlBuilder = builder.image(image as SanityImageSource);

    // Apply transformations
    if (options?.width) {
      urlBuilder = urlBuilder.width(options.width);
    }

    if (options?.height) {
      urlBuilder = urlBuilder.height(options.height);
    }

    if (options?.quality) {
      urlBuilder = urlBuilder.quality(options.quality);
    }

    if (options?.format && options.format !== 'auto') {
      urlBuilder = urlBuilder.format(options.format);
    }

    if (options?.auto === 'format') {
      urlBuilder = urlBuilder.auto('format');
    }

    if (options?.fit) {
      urlBuilder = urlBuilder.fit(options.fit);
    }

    return urlBuilder.url() || '/assets/placeholder.svg';
  } catch (error) {
    console.error('Error building Sanity image URL:', error);
    return '/assets/placeholder.svg';
  }
}

/**
 * Build responsive srcset for Sanity image
 */
export function buildSanitySrcSet(
  image: SanityImage | null | undefined,
  widths: number[] = [320, 640, 768, 1024, 1280, 1536]
): string {
  if (!image?.asset) {
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
 */
export function getProductCardImageUrl(image: SanityImage | null | undefined): string {
  return buildSanityImageUrl(image, {
    width: 800,
    quality: 80,
    auto: 'format',
    fit: 'crop',
  });
}

/**
 * Get optimized image URL for product detail pages
 */
export function getProductDetailImageUrl(image: SanityImage | null | undefined): string {
  return buildSanityImageUrl(image, {
    width: 1200,
    quality: 90,
    auto: 'format',
    fit: 'crop',
  });
}

/**
 * Get optimized thumbnail URL
 */
export function getThumbnailImageUrl(image: SanityImage | null | undefined): string {
  return buildSanityImageUrl(image, {
    width: 200,
    quality: 80,
    auto: 'format',
    fit: 'crop',
  });
}
