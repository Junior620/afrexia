'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

interface ProductGalleryProps {
  images: Array<{
    asset: any;
    alt?: string;
    caption?: {
      fr?: string;
      en?: string;
    };
    hotspot?: any;
  }>;
  productName: string;
  locale: 'fr' | 'en';
}

export function ProductGallery({ images, productName, locale }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showAllThumbnails, setShowAllThumbnails] = useState(false);

  // Limit thumbnails display to 8 initially
  const maxVisibleThumbnails = 8;
  const hasMoreThumbnails = images.length > maxVisibleThumbnails;
  const visibleThumbnails = showAllThumbnails ? images : images.slice(0, maxVisibleThumbnails);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const selectedImage = images[selectedIndex];
  const mainImageUrl = selectedImage ? urlFor(selectedImage)?.width(1200).height(900).url() : '';
  const mainImageAlt = selectedImage?.alt || productName;

  // Keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          setIsLightboxOpen(false);
          setIsZoomed(false);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case 'Home':
          e.preventDefault();
          setSelectedIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setSelectedIndex(images.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, selectedIndex, images.length]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  }, [images.length]);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setIsZoomed(false);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  // Touch handlers for swipe gestures
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted dark:bg-dark-bg-tertiary group">
        <Image
          src={mainImageUrl || '/assets/placeholder.svg'}
          alt={mainImageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover cursor-pointer dark:border dark:border-dark-border/20"
          onClick={() => openLightbox(selectedIndex)}
          priority={selectedIndex === 0}
        />
        
        {/* Editorial Overlay - Luxury Premium */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Premium gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          
          {/* Subtle vignette for depth */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_60%,rgba(0,0,0,0.15)_100%)]" />
          
          {/* Film grain texture */}
          <div 
            className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Quality control label - Bottom left */}
          <div className="absolute bottom-4 left-4 pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(10,20,16,0.85)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)]">
              <svg className="w-3.5 h-3.5 text-[#4A9A62]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-medium text-[#E8F5E9]">
                {locale === 'fr' ? 'Contrôle qualité sur site' : 'On-site quality control'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Zoom icon overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <button
            onClick={() => openLightbox(selectedIndex)}
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3 hover:bg-white"
            aria-label={locale === 'fr' ? 'Agrandir l\'image' : 'Enlarge image'}
          >
            <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </button>
        </div>

        {/* Navigation arrows for main image */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={locale === 'fr' ? 'Image précédente' : 'Previous image'}
            >
              <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={locale === 'fr' ? 'Image suivante' : 'Next image'}
            >
              <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="space-y-3">
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {visibleThumbnails.map((image, index) => {
              const thumbUrl = urlFor(image)?.width(200).height(150).url();
              const thumbAlt = image.alt || `${productName} - Image ${index + 1}`;
              
              return (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`relative aspect-[4/3] overflow-hidden rounded-lg border-2 transition-all ${
                    index === selectedIndex
                      ? 'border-primary ring-2 ring-primary ring-offset-2 dark:ring-offset-dark-bg-primary'
                      : 'border-border dark:border-dark-border hover:border-border dark:hover:border-dark-border'
                  }`}
                  aria-label={`${locale === 'fr' ? 'Voir l\'image' : 'View image'} ${index + 1}`}
                >
                  <Image
                    src={thumbUrl || '/assets/placeholder.svg'}
                    alt={thumbAlt}
                    fill
                    sizes="(max-width: 768px) 25vw, 150px"
                    className="object-cover dark:opacity-90"
                  />
                </button>
              );
            })}
          </div>
          
          {/* Show More/Less button */}
          {hasMoreThumbnails && (
            <button
              onClick={() => setShowAllThumbnails(!showAllThumbnails)}
              className="w-full py-2 px-4 rounded-lg border border-border dark:border-dark-border hover:bg-light dark:hover:bg-dark-bg-tertiary transition-colors text-sm font-medium text-foreground dark:text-dark-text-primary"
            >
              {showAllThumbnails 
                ? (locale === 'fr' ? `Voir moins` : `Show less`)
                : (locale === 'fr' ? `Voir ${images.length - maxVisibleThumbnails} images de plus` : `Show ${images.length - maxVisibleThumbnails} more images`)
              }
            </button>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeLightbox}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 z-10"
            aria-label={locale === 'fr' ? 'Fermer' : 'Close'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Zoom button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleZoom();
            }}
            className="absolute top-4 right-20 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 z-10"
            aria-label={isZoomed ? (locale === 'fr' ? 'Dézoomer' : 'Zoom out') : (locale === 'fr' ? 'Zoomer' : 'Zoom in')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isZoomed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              )}
            </svg>
          </button>

          {/* Main lightbox image */}
          <div
            className={`relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4 ${
              isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toggleZoom();
            }}
          >
            <Image
              src={mainImageUrl || '/assets/placeholder.svg'}
              alt={mainImageAlt}
              width={1200}
              height={900}
              className={`object-contain max-w-full max-h-full transition-transform duration-300 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
            />
          </div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3"
                aria-label={locale === 'fr' ? 'Image précédente' : 'Previous image'}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3"
                aria-label={locale === 'fr' ? 'Image suivante' : 'Next image'}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image counter and caption */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
            <div className="bg-black/70 text-white px-4 py-2 rounded-full text-sm mb-2">
              {selectedIndex + 1} / {images.length}
            </div>
            {selectedImage?.caption?.[locale] && (
              <p className="text-white text-sm max-w-2xl">
                {selectedImage.caption[locale]}
              </p>
            )}
          </div>

          {/* Keyboard hints */}
          <div className="absolute bottom-4 right-4 text-white/60 text-xs hidden md:block">
            <p>← → {locale === 'fr' ? 'Navigation' : 'Navigate'}</p>
            <p>ESC {locale === 'fr' ? 'Fermer' : 'Close'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
