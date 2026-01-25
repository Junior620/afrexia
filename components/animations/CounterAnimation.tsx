'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { shouldReduceMotion } from '@/lib/animations/gsap-config';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface CounterAnimationProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  decimals?: number;
}

/**
 * CounterAnimation component - Animates a number counter when it enters the viewport
 * Respects prefers-reduced-motion preference
 */
export function CounterAnimation({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
  className = '',
  decimals = 0,
}: CounterAnimationProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasAnimated.current) return;

    // If reduced motion is preferred, show final value immediately
    if (shouldReduceMotion()) {
      setDisplayValue(value);
      hasAnimated.current = true;
      return;
    }

    // Create counter animation
    const obj = { value: 0 };
    const tween = gsap.to(obj, {
      value: value,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        setDisplayValue(obj.value);
      },
    });

    // Create ScrollTrigger to start animation when element enters viewport
    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 80%',
      once: true, // Only animate once
      onEnter: () => {
        tween.play();
        hasAnimated.current = true;
      },
    });

    // Cleanup
    return () => {
      trigger.kill();
      tween.kill();
    };
  }, [value, duration]);

  // Format the display value
  const formattedValue = decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.round(displayValue).toLocaleString();

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}
