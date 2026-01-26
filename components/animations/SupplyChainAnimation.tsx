'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { shouldReduceMotion } from '@/lib/animations/gsap-config';
import dynamic from 'next/dynamic';
import { MapPin, ArrowRight } from 'lucide-react';
import { Locale } from '@/types';

// Dynamically import Mapbox to reduce initial bundle size
const Map = dynamic(() => import('react-map-gl').then((mod) => mod.Map), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-light flex items-center justify-center">
      <p className="text-support">Loading map...</p>
    </div>
  ),
});

const Marker = dynamic(() => import('react-map-gl').then((mod) => mod.Marker), {
  ssr: false,
});

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface SupplyChainStep {
  title: string;
  description: string;
  location: string;
  coordinates: [number, number]; // [longitude, latitude]
}

interface SupplyChainAnimationProps {
  steps: SupplyChainStep[];
  locale: Locale;
  className?: string;
}

/**
 * SupplyChainAnimation component - Animated visualization of product journey
 * Uses GSAP timeline with ScrollTrigger and Mapbox for visualization
 * Respects prefers-reduced-motion preference
 */
export function SupplyChainAnimation({
  steps,
  locale: _locale,
  className = '',
}: SupplyChainAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Calculate center point for map
  const centerCoordinates = steps.length > 0
    ? [
        steps.reduce((sum, step) => sum + step.coordinates[0], 0) / steps.length,
        steps.reduce((sum, step) => sum + step.coordinates[1], 0) / steps.length,
      ]
    : [0, 0];

  useEffect(() => {
    const container = containerRef.current;
    if (!container || steps.length === 0) return;

    // If reduced motion is preferred, show all steps immediately
    if (shouldReduceMotion()) {
      setActiveStep(steps.length - 1);
      return;
    }

    // Create GSAP timeline for step animations
    const timeline = gsap.timeline({
      paused: true,
      onUpdate: function () {
        const progress = this.progress();
        const currentStepIndex = Math.min(
          Math.floor(progress * steps.length),
          steps.length - 1
        );
        setActiveStep(currentStepIndex);
      },
    });

    // Add animations for each step
    steps.forEach((step, index) => {
      const stepElement = container.querySelector(`[data-step="${index}"]`);
      if (stepElement) {
        timeline.from(
          stepElement,
          {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: 'power2.out',
          },
          index * 0.8 // Stagger timing
        );
      }
    });

    timelineRef.current = timeline;

    // Create ScrollTrigger to control timeline
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: 1,
      animation: timeline,
      onEnter: () => timeline.play(),
      onLeave: () => timeline.pause(),
      onEnterBack: () => timeline.play(),
      onLeaveBack: () => timeline.pause(),
    });

    // Cleanup
    return () => {
      trigger.kill();
      timeline.kill();
    };
  }, [steps]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Map Visualization */}
        <div className="relative h-[500px] rounded-xl overflow-hidden border border-neutral">
          {typeof window !== 'undefined' && (
            <Map
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
              initialViewState={{
                longitude: centerCoordinates[0],
                latitude: centerCoordinates[1],
                zoom: 4,
              }}
              style={{ width: '100%', height: '100%' }}
              mapStyle="mapbox://styles/mapbox/light-v11"
              onLoad={() => setMapLoaded(true)}
            >
              {mapLoaded &&
                steps.map((step, index) => (
                  <Marker
                    key={index}
                    longitude={step.coordinates[0]}
                    latitude={step.coordinates[1]}
                    anchor="bottom"
                  >
                    <div
                      className={`transition-all duration-500 ${
                        index <= activeStep
                          ? 'opacity-100 scale-100'
                          : 'opacity-30 scale-75'
                      }`}
                    >
                      <div className="relative">
                        <MapPin
                          className={`w-8 h-8 ${
                            index === activeStep
                              ? 'text-accent'
                              : index < activeStep
                              ? 'text-primary'
                              : 'text-neutral'
                          }`}
                          fill="currentColor"
                        />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-2 py-1 rounded shadow-md text-xs font-semibold">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                  </Marker>
                ))}
            </Map>
          )}
        </div>

        {/* Steps List */}
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div
              key={index}
              data-step={index}
              className={`relative p-6 rounded-xl border transition-all duration-500 ${
                index === activeStep
                  ? 'bg-primary text-white border-primary shadow-xl scale-105'
                  : index < activeStep
                  ? 'bg-light border-neutral'
                  : 'bg-white border-neutral opacity-50'
              }`}
            >
              {/* Step Number */}
              <div
                className={`absolute -left-4 top-6 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === activeStep
                    ? 'bg-accent text-white'
                    : index < activeStep
                    ? 'bg-primary text-white'
                    : 'bg-neutral text-foreground'
                }`}
              >
                {index + 1}
              </div>

              {/* Step Content */}
              <div className="ml-6">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-semibold opacity-80">
                    {step.location}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p
                  className={`text-sm leading-relaxed ${
                    index === activeStep ? 'text-white/90' : 'text-foreground'
                  }`}
                >
                  {step.description}
                </p>
              </div>

              {/* Arrow to next step */}
              {index < steps.length - 1 && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                  <ArrowRight
                    className={`w-6 h-6 rotate-90 ${
                      index < activeStep ? 'text-primary' : 'text-neutral'
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
