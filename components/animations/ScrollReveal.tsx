'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { shouldReduceMotion } from '@/lib/animations/gsap-config';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export type AnimationType = 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
}

/**
 * ScrollReveal component - Animates children when they enter the viewport
 * Respects prefers-reduced-motion preference
 */
export function ScrollReveal({
  children,
  animation = 'fade',
  delay = 0,
  duration = 0.8,
  threshold = 0.2,
  className = '',
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // If reduced motion is preferred, show content immediately
    if (shouldReduceMotion()) {
      gsap.set(element, { opacity: 1, y: 0, x: 0, scale: 1 });
      return;
    }

    // Define animation properties based on type
    const animationProps = getAnimationProps(animation);

    // Create the animation
    const tween = gsap.from(element, {
      ...animationProps,
      duration,
      delay,
      ease: 'power3.out',
    });

    // Create ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: element,
      start: `top ${100 - threshold * 100}%`,
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
      animation: tween,
    });

    // Cleanup
    return () => {
      trigger.kill();
      tween.kill();
    };
  }, [animation, delay, duration, threshold]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

/**
 * Get animation properties based on animation type
 */
function getAnimationProps(animation: AnimationType): gsap.TweenVars {
  switch (animation) {
    case 'fade':
      return {
        opacity: 0,
        y: 30,
      };
    case 'slide-up':
      return {
        opacity: 0,
        y: 50,
      };
    case 'slide-left':
      return {
        opacity: 0,
        x: -50,
      };
    case 'slide-right':
      return {
        opacity: 0,
        x: 50,
      };
    case 'scale':
      return {
        opacity: 0,
        scale: 0.8,
      };
    default:
      return {
        opacity: 0,
        y: 30,
      };
  }
}
