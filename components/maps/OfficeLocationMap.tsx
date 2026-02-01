'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Locale } from '@/types';

interface OfficeLocationMapProps {
  locale: Locale;
}

/**
 * Office Location Map Component
 * Displays Afrexia office location using Mapbox with Google Maps fallback
 * Requirements: 14.6
 */
export function OfficeLocationMap({ locale }: OfficeLocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Afrexia office coordinates (Douala, Cameroon)
  // From Google Maps: https://maps.app.goo.gl/H7wHU2L6S2WRjepm8
  const officeLocation = {
    latitude: 4.0511,
    longitude: 9.7679,
    name: locale === 'fr' ? 'Bureau Afrexia' : 'Afrexia Office',
    address: locale === 'fr' ? 'Douala, Cameroun' : 'Douala, Cameroon',
  };

  useEffect(() => {
    // Check if Mapbox token is available
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    
    if (!token) {
      console.warn('Mapbox token not found, falling back to Google Maps');
      setMapError(true);
      setIsLoading(false);
      return;
    }

    // Check for WebGL support
    if (!mapboxgl.supported()) {
      console.warn('Mapbox GL not supported by this browser, falling back to Google Maps');
      setMapError(true);
      setIsLoading(false);
      return;
    }

    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = token;

      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11', // Dark theme to match design
        center: [officeLocation.longitude, officeLocation.latitude],
        zoom: 14,
        attributionControl: false,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add custom marker with green color
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='%234A9A62'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E")`;
      el.style.backgroundSize = 'contain';
      el.style.cursor = 'pointer';

      // Add marker to map
      new mapboxgl.Marker(el)
        .setLngLat([officeLocation.longitude, officeLocation.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="padding: 8px; color: #0A1410;">
              <h3 style="font-weight: 600; margin-bottom: 4px;">${officeLocation.name}</h3>
              <p style="font-size: 14px; color: #666;">${officeLocation.address}</p>
            </div>`
          )
        )
        .addTo(map.current);

      // Handle load event
      map.current.on('load', () => {
        setIsLoading(false);
      });

      // Handle error event
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError(true);
        setIsLoading(false);
      });

    } catch (error) {
      console.error('Error initializing Mapbox:', error);
      setMapError(true);
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [locale, officeLocation.latitude, officeLocation.longitude, officeLocation.name, officeLocation.address]);

  // Fallback to Google Maps if Mapbox fails
  if (mapError) {
    return (
      <div className="h-[400px] w-full overflow-hidden rounded-lg border border-[rgba(255,255,255,0.08)]">
        <iframe
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.8976845678!2d${officeLocation.longitude}!3d${officeLocation.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMDMnMDQuMCJOIDnCsDQ2JzA0LjQiRQ!5e0!3m2!1s${locale}!2scm!4v1234567890`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={officeLocation.name}
          className="grayscale-[20%] contrast-[1.1]"
        />
      </div>
    );
  }

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-lg border border-[rgba(255,255,255,0.08)]">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0A1410]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4A9A62] border-t-transparent" />
        </div>
      )}
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
}
