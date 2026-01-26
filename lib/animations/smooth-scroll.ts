'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Hook to enable smooth scrolling with Lenis
 * Only enabled on desktop (>= 1024px) and when reduced motion is not preferred
 * Optimized for performance by disabling on mobile devices
 */
export function useSmoothScroll() {
  useEffect(() => {
    // Skip on server
    if (typeof window === 'undefined') return;

    // Skip on mobile devices (< 1024px)
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      return;
    }

    // Skip if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis to GSAP ticker for smooth integration
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable lag smoothing for better performance
    gsap.ticker.lagSmoothing(0);

    // Handle window resize to disable on mobile
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        lenis.destroy();
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);
}

/**
 * Hook to enable smooth scrolling with Lenis and provide scroll control
 * Returns Lenis instance for programmatic control
 * Only enabled on desktop (>= 1024px) and when reduced motion is not preferred
 */
export function useSmoothScrollWithControl() {
  useEffect(() => {
    // Skip on server
    if (typeof window === 'undefined') return;

    // Skip on mobile devices (< 1024px)
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      return;
    }

    // Skip if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis to GSAP ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Store lenis instance globally for access
    (window as any).__lenis = lenis;

    // Handle window resize to disable on mobile
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        lenis.destroy();
        delete (window as any).__lenis;
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      delete (window as any).__lenis;
    };
  }, []);
}

/**
 * Scroll to a specific element smoothly
 * @param target CSS selector or element
 * @param options Scroll options
 */
export function scrollTo(
  target: string | HTMLElement,
  options?: {
    offset?: number;
    duration?: number;
    easing?: (t: number) => number;
  }
) {
  const lenis = (window as any).__lenis as Lenis | undefined;
  
  if (lenis) {
    lenis.scrollTo(target, options);
  } else {
    // Fallback to native scroll
    const element = typeof target === 'string' 
      ? document.querySelector(target) 
      : target;
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

/**
 * Stop smooth scrolling
 */
export function stopScroll() {
  const lenis = (window as any).__lenis as Lenis | undefined;
  if (lenis) {
    lenis.stop();
  }
}

/**
 * Start smooth scrolling
 */
export function startScroll() {
  const lenis = (window as any).__lenis as Lenis | undefined;
  if (lenis) {
    lenis.start();
  }
}
