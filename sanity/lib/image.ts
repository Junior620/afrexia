import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'
import type { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder'

import { dataset, projectId } from '../env'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

/**
 * Helper function to generate Sanity image URLs with automatic format optimization
 * @param source - Sanity image object
 * @returns ImageUrlBuilder instance or undefined if source is invalid
 */
export const urlForImage = (source: Image | undefined): ImageUrlBuilder | undefined => {
  if (!source?.asset?._ref) {
    return undefined
  }

  return imageBuilder?.image(source).auto('format').fit('max')
}

/**
 * Simplified urlFor helper that returns the builder directly
 * @param source - Sanity image object
 * @returns ImageUrlBuilder instance or undefined
 */
export const urlFor = (source: Image | undefined): ImageUrlBuilder | undefined => {
  if (!source?.asset?._ref) {
    return undefined
  }

  return imageBuilder?.image(source)
}

/**
 * Get optimized image properties for responsive images
 * @param source - Sanity image object
 * @param options - Image optimization options
 * @returns Object with src and srcSet for responsive images
 */
export interface ImagePropsOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpg' | 'png'
  fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'
}

export const getImageProps = (
  source: Image | undefined,
  options: ImagePropsOptions = {}
) => {
  const builder = urlFor(source)
  
  if (!builder) {
    return null
  }

  const {
    width,
    height,
    quality = 80,
    format,
    fit = 'max',
  } = options

  let imageBuilder = builder.fit(fit).quality(quality)

  if (format) {
    imageBuilder = imageBuilder.format(format)
  } else {
    imageBuilder = imageBuilder.auto('format')
  }

  if (width) {
    imageBuilder = imageBuilder.width(width)
  }

  if (height) {
    imageBuilder = imageBuilder.height(height)
  }

  const src = imageBuilder.url()

  // Generate srcSet for responsive images
  const widths = [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
  const srcSet = widths
    .filter(w => !width || w <= width * 2) // Only include sizes up to 2x the requested width
    .map(w => {
      const url = urlFor(source)
        ?.fit(fit)
        .quality(quality)
        .width(w)
        .url()
      return `${url} ${w}w`
    })
    .join(', ')

  return {
    src,
    srcSet,
    width,
    height,
  }
}

/**
 * Get image URL with specific format
 * @param source - Sanity image object
 * @param format - Desired image format
 * @param quality - Image quality (1-100)
 * @returns Image URL string or undefined
 */
export const getImageUrl = (
  source: Image | undefined,
  format?: 'webp' | 'jpg' | 'png',
  quality: number = 80
): string | undefined => {
  const builder = urlFor(source)
  
  if (!builder) {
    return undefined
  }

  let imageBuilder = builder.quality(quality)

  if (format) {
    imageBuilder = imageBuilder.format(format)
  } else {
    imageBuilder = imageBuilder.auto('format')
  }

  return imageBuilder.url()
}

/**
 * Get optimized thumbnail URL
 * @param source - Sanity image object
 * @param size - Thumbnail size in pixels
 * @param quality - Image quality (1-100)
 * @returns Thumbnail URL string or undefined
 */
export const getThumbnailUrl = (
  source: Image | undefined,
  size: number = 256,
  quality: number = 75
): string | undefined => {
  return urlFor(source)
    ?.width(size)
    .height(size)
    .fit('crop')
    .quality(quality)
    .auto('format')
    .url()
}
