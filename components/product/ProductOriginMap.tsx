'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { MapRef } from 'react-map-gl';
import { BRAND_COLORS } from '@/lib/brand/colors';

// Lazy load Mapbox to reduce initial bundle size
const Map = dynamic(() => import('react-map-gl').then((mod) => mod.Map), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
});

const Marker = dynamic(() => import('react-map-gl').then((mod) => mod.Marker), {
  ssr: false,
});

const NavigationControl = dynamic(() => import('react-map-gl').then((mod) => mod.NavigationControl), {
  ssr: false,
});

const Popup = dynamic(() => import('react-map-gl').then((mod) => mod.Popup), {
  ssr: false,
});

interface OriginRegion {
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description?: {
    fr?: string;
    en?: string;
  };
}

interface ProductOriginMapProps {
  origins: OriginRegion[];
  productName: string;
  locale: 'fr' | 'en';
}

export function ProductOriginMap({ origins, locale }: ProductOriginMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 2,
  });

  // Calculate center and zoom to fit all markers
  useEffect(() => {
    if (origins && origins.length > 0) {
      if (origins.length === 1) {
        // Single origin: center on it
        setViewState({
          longitude: origins[0].coordinates.lng,
          latitude: origins[0].coordinates.lat,
          zoom: 8,
        });
      } else {
        // Multiple origins: calculate bounds
        const lngs = origins.map((o) => o.coordinates.lng);
        const lats = origins.map((o) => o.coordinates.lat);

        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);

        const centerLng = (minLng + maxLng) / 2;
        const centerLat = (minLat + maxLat) / 2;

        setViewState({
          longitude: centerLng,
          latitude: centerLat,
          zoom: 5,
        });
      }
    }
  }, [origins]);

  // Fit bounds when map loads
  useEffect(() => {
    if (mapRef.current && origins && origins.length > 1) {
      const bounds: [[number, number], [number, number]] = [
        [
          Math.min(...origins.map((o) => o.coordinates.lng)),
          Math.min(...origins.map((o) => o.coordinates.lat)),
        ],
        [
          Math.max(...origins.map((o) => o.coordinates.lng)),
          Math.max(...origins.map((o) => o.coordinates.lat)),
        ],
      ];

      // Check if fitBounds method exists before calling
      if (typeof mapRef.current.fitBounds === 'function') {
        mapRef.current.fitBounds(bounds, {
          padding: 50,
          duration: 1000,
        });
      }
    }
  }, [origins]);

  if (!origins || origins.length === 0) {
    return (
      <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">
          {locale === 'fr' ? 'Aucune information de localisation disponible' : 'No location information available'}
        </p>
      </div>
    );
  }

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!mapboxToken) {
    return (
      <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">
          {locale === 'fr' ? 'Configuration de la carte manquante' : 'Map configuration missing'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-lg">
        <Map
          ref={mapRef}
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapboxAccessToken={mapboxToken}
          mapStyle="mapbox://styles/mapbox/outdoors-v12"
          style={{ width: '100%', height: '100%' }}
          attributionControl={true}
          cooperativeGestures={true}
        >
          {/* Navigation Controls */}
          <NavigationControl position="top-right" showCompass={true} showZoom={true} />

          {/* Markers */}
          {origins.map((origin, index) => (
            <Marker
              key={index}
              longitude={origin.coordinates.lng}
              latitude={origin.coordinates.lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedMarker(index);
              }}
            >
              <button
                className="relative group cursor-pointer"
                aria-label={`${locale === 'fr' ? 'Voir les détails de' : 'View details for'} ${origin.region}`}
              >
                {/* Custom marker icon */}
                <div className="relative">
                  <svg
                    width="40"
                    height="50"
                    viewBox="0 0 40 50"
                    className="drop-shadow-lg transition-transform group-hover:scale-110"
                  >
                    <path
                      d="M20 0C8.954 0 0 8.954 0 20c0 11.046 20 30 20 30s20-18.954 20-30C40 8.954 31.046 0 20 0z"
                      fill={BRAND_COLORS.primary.DEFAULT}
                      className="group-hover:fill-secondary transition-colors"
                    />
                    <circle cx="20" cy="20" r="8" fill="white" />
                    <text
                      x="20"
                      y="25"
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="bold"
                      fill={BRAND_COLORS.primary.DEFAULT}
                    >
                      {index + 1}
                    </text>
                  </svg>
                </div>
              </button>
            </Marker>
          ))}

          {/* Popup */}
          {selectedMarker !== null && (
            <Popup
              longitude={origins[selectedMarker].coordinates.lng}
              latitude={origins[selectedMarker].coordinates.lat}
              anchor="top"
              onClose={() => setSelectedMarker(null)}
              closeButton={true}
              closeOnClick={false}
              className="origin-popup"
            >
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-foreground mb-2">
                  {origins[selectedMarker].region}
                </h3>
                {origins[selectedMarker].description?.[locale] && (
                  <p className="text-sm text-muted-foreground">
                    {origins[selectedMarker].description[locale]}
                  </p>
                )}
                <div className="mt-2 text-xs text-muted-foreground">
                  <p>
                    {locale === 'fr' ? 'Coordonnées' : 'Coordinates'}:{' '}
                    {origins[selectedMarker].coordinates.lat.toFixed(4)},{' '}
                    {origins[selectedMarker].coordinates.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </Popup>
          )}
        </Map>
      </div>

      {/* Legend */}
      <div className="bg-light rounded-lg p-4">
        <h4 className="font-semibold text-foreground mb-3">
          {locale === 'fr' ? 'Régions d\'origine' : 'Origin Regions'}
        </h4>
        <div className="space-y-2">
          {origins.map((origin, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedMarker(index);
                if (mapRef.current && typeof mapRef.current.flyTo === 'function') {
                  mapRef.current.flyTo({
                    center: [origin.coordinates.lng, origin.coordinates.lat],
                    zoom: 10,
                    duration: 1500,
                  });
                }
              }}
              className="flex items-start gap-3 w-full text-left p-2 rounded hover:bg-white transition-colors group"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold group-hover:bg-secondary transition-colors">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {origin.region}
                </p>
                {origin.description?.[locale] && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {origin.description[locale]}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Map Instructions */}
      <div className="text-sm text-muted-foreground text-center">
        <p>
          {locale === 'fr'
            ? 'Cliquez sur les marqueurs pour plus d\'informations. Utilisez les contrôles pour zoomer et naviguer.'
            : 'Click on markers for more information. Use controls to zoom and navigate.'}
        </p>
      </div>
    </div>
  );
}
