import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useRouting } from '@/contexts/RoutingContext'; 
import { RouteForm } from './RouteForm';
import { RouteDetails } from './RouteDetails';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function MapUpdater({ route }) {
  const map = useMap();
  useEffect(() => {
    if (route && route.coordinates.length > 0) {
      const bounds = L.latLngBounds(route.coordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [route, map]);
  return null;
}

export function MapComponent() {
  const { currentRoute, clearRoute } = useRouting();
  const defaultPosition: L.LatLngExpression = [40.416775, -3.703790];

  return (
    <div className="relative h-full w-full">
      
      <div className="absolute top-4 left-4 z-[1000] w-full max-w-sm">
        <RouteForm />
      </div>

      {currentRoute && (
        <div className="absolute bottom-4 left-4 z-[1000] w-full max-w-sm">
          <RouteDetails route={currentRoute} onClear={clearRoute} />
        </div>
      )}
      
      <MapContainer center={defaultPosition} zoom={6} className="h-full w-full z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {currentRoute && (
          <>
            <Polyline positions={currentRoute.coordinates as L.LatLngExpression[]} color="hsl(var(--primary))" weight={5} />
            <Marker position={currentRoute.coordinates[0] as L.LatLngExpression} />
            <Marker position={currentRoute.coordinates[currentRoute.coordinates.length - 1] as L.LatLngExpression} />
            <MapUpdater route={currentRoute} />
          </>
        )}
      </MapContainer>
    </div>
  );
}