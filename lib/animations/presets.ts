import { gsap } from 'gsap';
import { defaultAnimationConfig, shouldReduceMotion, createScrollTrigger } from './gsap-config';

/**
 * Animation presets for common animation patterns
 */
export const animationPresets = {
  /**
   * Fade in animation
   */
  fadeIn: (element: gsap.TweenTarget) => {
    if (shouldReduceMotion()) {
      gsap.set(element, { opacity: 1, y: 0 });
      return gsap.timeline();
    }
    
    return gsap.from(element, {
      ...defaultAnimationConfig,
      opacity: 0,
      y: 30,
    });
  },

  /**
   * Slide in from left animation
   */
  slideInLeft: (element: gsap.TweenTarget) => {
    if (shouldReduceMotion()) {
      gsap.set(element, { opacity: 1, x: 0 });
      return gsap.timeline();
    }
    
    return gsap.from(element, {
      ...defaultAnimationConfig,
      opacity: 0,
      x: -50,
    });
  },

  /**
   * Slide in from right animation
   */
  slideInRight: (element: gsap.TweenTarget) => {
    if (shouldReduceMotion()) {
      gsap.set(element, { opacity: 1, x: 0 });
      return gsap.timeline();
    }
    
    return gsap.from(element, {
      ...defaultAnimationConfig,
      opacity: 0,
      x: 50,
    });
  },

  /**
   * Scale in animation
   */
  scaleIn: (element: gsap.TweenTarget) => {
    if (shouldReduceMotion()) {
      gsap.set(element, { opacity: 1, scale: 1 });
      return gsap.timeline();
    }
    
    return gsap.from(element, {
      ...defaultAnimationConfig,
      opacity: 0,
      scale: 0.8,
    });
  },

  /**
   * Stagger fade in animation for multiple elements
   */
  staggerFadeIn: (elements: gsap.TweenTarget) => {
    if (shouldReduceMotion()) {
      gsap.set(elements, { opacity: 1, y: 0 });
      return gsap.timeline();
    }
    
    return gsap.from(elements, {
      ...defaultAnimationConfig,
      opacity: 0,
      y: 30,
      stagger: 0.1,
    });
  },

  /**
   * Counter animation for statistics
   * @param element HTML element to animate
   * @param endValue Target number value
   * @param duration Animation duration in seconds
   * @param suffix Optional suffix to append (e.g., '+', '%')
   */
  counterAnimation: (
    element: HTMLElement,
    endValue: number,
    duration = 2,
    suffix = ''
  ) => {
    if (shouldReduceMotion()) {
      element.textContent = `${Math.round(endValue).toLocaleString()}${suffix}`;
      return gsap.timeline();
    }
    
    const obj = { value: 0 };
    return gsap.to(obj, {
      value: endValue,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        element.textContent = `${Math.round(obj.value).toLocaleString()}${suffix}`;
      },
    });
  },
};

/**
 * Helper function to create scroll-triggered animation with preset
 */
export function createScrollAnimation(
  trigger: string | Element,
  preset: Exclude<keyof typeof animationPresets, 'counterAnimation'>,
  target: gsap.TweenTarget,
  options: ScrollTrigger.Vars = {}
) {
  const animation = animationPresets[preset](target);
  return createScrollTrigger(trigger, animation, options);
}
