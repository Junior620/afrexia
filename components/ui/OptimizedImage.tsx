'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Image as SanityImage } from 'sanity'
import { getImageUrl } from '@/sanity/lib/image'

export interface OptimizedImageProps {
  image: SanityImage | undefined
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  fill?: boolean
  sizes?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  fallbackSrc?: string
  onLoad?: () => void
  onError?: () => void
}

/**
 * OptimizedImage component that wraps Next.js Image with Sanity URL builder
 * Implements lazy loading for below-the-fold images and error handling with fallback
 */
export function OptimizedImage({
  image,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 80,
  fill = false,
  sizes,
  objectFit = 'cover',
  fallbackSrc = '/assets/placeholder.svg',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Get optimized image URL from Sanity
  const imageUrl = getImageUrl(image, undefined, quality)

  // Use fallback if no image URL or error occurred
  const src = error || !imageUrl ? fallbackSrc : imageUrl

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setError(true)
    setIsLoading(false)
    onError?.()
  }

  // Common image props with dark mode border support
  const imageProps = {
    alt,
    className: `${className} ${isLoading ? 'blur-sm' : 'blur-0'} transition-all duration-300 dark:border dark:border-dark-border/20`,
    quality,
    onLoad: handleLoad,
    onError: handleError,
    style: objectFit && !fill ? { objectFit } : undefined,
  }

  if (fill) {
    return (
      <Image
        {...imageProps}
        src={src}
        fill
        sizes={sizes || '100vw'}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
      />
    )
  }

  if (!width || !height) {
    console.warn('OptimizedImage: width and height are required when fill is false')
    return null
  }

  return (
    <Image
      {...imageProps}
      src={src}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
    />
  )
}
