'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Locale } from '@/types';

// Lazy load Mapbox to reduce initial bundle size
const Map = dynamic(() => import('react-map-gl').then((mod) => mod.Map), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-light">
      <p className="text-support">Loading map...</p>
    </div>
  ),
});

const Marker = dynamic(() => import('react-map-gl').then((mod) => mod.Marker), {
  ssr: false,
});

const NavigationControl = dynamic(
  () => import('react-map-gl').then((mod) => mod.NavigationControl),
  {
    ssr: false,
  }
);

interface OfficeLocationMapProps {
  locale: Locale;
}

/**
 * Office Location Map Component
 * Displays Afrexia office location on an interactive map
 * Requirements: 14.6
 */
export function OfficeLocationMap({ locale }: OfficeLocationMapProps) {
  // Afrexia office coordinates (Douala, Cameroon - placeholder coordinates)
  const officeLocation = {
    latitude: 4.0511,
    longitude: 9.7679,
    name: locale === 'fr' ? 'Bureau Afrexia' : 'Afrexia Office',
    address:
      locale === 'fr'
        ? 'Douala, Cameroun'
        : 'Douala, Cameroon',
  };

  const [viewState, setViewState] = useState({
    latitude: officeLocation.latitude,
    longitude: officeLocation.longitude,
    zoom: 13,
  });

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!mapboxToken) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-lg bg-light">
        <p className="text-support">
          {locale === 'fr'
            ? 'Carte non disponible'
            : 'Map not available'}
        </p>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full overflow-hidden rounded-lg">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={mapboxToken}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: '100%', height: '100%' }}
        attributionControl={true}
      >
        {/* Office Marker */}
        <Marker
          latitude={officeLocation.latitude}
          longitude={officeLocation.longitude}
          anchor="bottom"
        >
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-primary p-2 shadow-lg">
              <svg
                className="h-6 w-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="mt-2 rounded bg-white px-2 py-1 text-xs font-semibold shadow">
              {officeLocation.name}
            </div>
          </div>
        </Marker>

        {/* Navigation Controls */}
        <NavigationControl position="top-right" />
      </Map>
    </div>
  );
}
