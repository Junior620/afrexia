import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Default animation settings
export const defaultAnimationConfig = {
  duration: 0.8,
  ease: 'power3.out',
  stagger: 0.1,
};

// Respect reduced motion preference
export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Create scroll trigger with reduced motion support
export function createScrollTrigger(
  trigger: string | Element,
  animation: gsap.core.Timeline | gsap.core.Tween,
  options: ScrollTrigger.Vars = {}
) {
  if (shouldReduceMotion()) {
    // Skip animation, just show content
    gsap.set(animation.targets(), { opacity: 1, y: 0, x: 0, scale: 1 });
    return null;
  }

  return ScrollTrigger.create({
    trigger,
    start: 'top 80%',
    end: 'bottom 20%',
    toggleActions: 'play none none reverse',
    ...options,
    animation,
  });
}
