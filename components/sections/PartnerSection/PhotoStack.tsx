/**
 * PhotoStack Component
 * 
 * Displays overlapping images with premium styling and subtle interactions.
 * Features a large primary image with a smaller overlay image positioned absolutely.
 * 
 * Requirements:
 * - 2.2: Photo_Stack with large primary image and overlaid smaller image
 * - 2.3: Primary image with 28px border radius and soft shadow
 * - 2.4: Overlay image with 24px border radius, border, and rotation
 * - 2.5: Discrete caption at bottom
 * - 7.1: Hover state with scale transform and accent border
 * - 7.2: Smooth transitions
 * - 8.1: next/image component usage
 * - 8.2: Lazy loading implementation
 * - 8.3: Blur placeholder
 * - 8.4: Responsive sizes
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { ImageConfig } from '@/types/partner-section';

interface PhotoStackProps {
  images: ImageConfig[];
  caption: string;
  className?: string;
}

/**
 * PhotoStack component with overlapping images and caption
 * 
 * Displays a primary image with an overlay image positioned absolutely.
 * Includes hover interactions and optimized image loading.
 * 
 * @param images - Array of image configurations (expects 2 images: primary and overlay)
 * @param caption - Caption text displayed at bottom of stack
 * @param className - Additional Tailwind CSS classes
 */
export function PhotoStack({ images, caption, className = '' }: PhotoStackProps) {
  const [primaryImageError, setPrimaryImageError] = React.useState(false);
  const [overlayImageError, setOverlayImageError] = React.useState(false);

  // Extract primary and overlay images
  const primaryImage = images[0];
  const overlayImage = images[1];

  if (!primaryImage) {
    return null;
  }

  /**
   * Handle image loading errors
   * Requirement 13.1: Log errors in development mode and display fallback
   */
  const handlePrimaryImageError = () => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Primary image failed to load:', primaryImage.src);
    }
    setPrimaryImageError(true);
  };

  const handleOverlayImageError = () => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Overlay image failed to load:', overlayImage?.src);
    }
    setOverlayImageError(true);
  };

  return (
    <div
      className={`
        relative
        w-full
        group
        animate-float
        ${className}
      `.trim()}
      data-testid="photo-stack"
      role="figure"
      aria-label={caption}
      tabIndex={0}
    >
      {/* Primary Image Container */}
      <div
        className="
          relative
          w-full
          aspect-[4/5]
          overflow-hidden
          rounded-[28px]
          shadow-2xl
          transition-all
          duration-500
          group-hover:scale-[1.02]
          group-hover:shadow-accent/20
          group-hover:ring-2
          group-hover:ring-accent
          group-focus-visible:ring-2
          group-focus-visible:ring-accent
          group-focus-visible:ring-offset-2
          group-focus-visible:ring-offset-[#1a1a1a]
        "
      >
        {/* Primary Image or Fallback */}
        {primaryImageError ? (
          // Fallback placeholder with brand colors
          // Requirement 13.1: Display fallback placeholder on error, maintain layout integrity
          <div
            className="
              absolute
              inset-0
              flex
              flex-col
              items-center
              justify-center
              bg-gradient-to-br
              from-[#1a1a1a]
              via-[#2a2a2a]
              to-[#1a1a1a]
              border
              border-white/[0.06]
            "
            role="img"
            aria-label={primaryImage.alt}
          >
            <svg
              className="w-16 h-16 text-accent/40 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-white/40 text-center px-4">
              {primaryImage.alt}
            </p>
          </div>
        ) : (
          <Image
            src={primaryImage.src}
            alt={primaryImage.alt}
            fill
            priority={primaryImage.priority}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQAAA//9k="
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover"
            onError={handlePrimaryImageError}
          />
        )}

        {/* Very light gradient overlay for text readability */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/10
            via-transparent
            pointer-events-none
          "
          aria-hidden="true"
        />
      </div>

      {/* Overlay Image (if provided) */}
      {overlayImage && (
        <div
          className="
            absolute
            bottom-8
            right-8
            w-[45%]
            aspect-[4/3]
            overflow-hidden
            rounded-[24px]
            border
            border-white/[0.08]
            shadow-xl
            rotate-2
            transition-all
            duration-500
            group-hover:scale-[1.02]
            group-hover:rotate-3
          "
        >
          {/* Overlay Image or Fallback */}
          {overlayImageError ? (
            // Fallback placeholder with brand colors
            // Requirement 13.1: Display fallback placeholder on error, maintain layout integrity
            <div
              className="
                absolute
                inset-0
                flex
                flex-col
                items-center
                justify-center
                bg-gradient-to-br
                from-[#1a1a1a]
                via-[#2a2a2a]
                to-[#1a1a1a]
              "
              role="img"
              aria-label={overlayImage.alt}
            >
              <svg
                className="w-8 h-8 text-accent/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          ) : (
            <Image
              src={overlayImage.src}
              alt={overlayImage.alt}
              fill
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQAAA//9k="
              sizes="(max-width: 768px) 50vw, 30vw"
              className="object-cover"
              onError={handleOverlayImageError}
            />
          )}
        </div>
      )}

      {/* Caption */}
      <figcaption
        className="
          absolute
          bottom-0
          left-0
          right-0
          px-6
          py-4
          bg-black/40
          backdrop-blur-sm
          rounded-b-[28px]
        "
      >
        <p className="text-sm text-white/90 font-medium">
          {caption}
        </p>
      </figcaption>
    </div>
  );
}
