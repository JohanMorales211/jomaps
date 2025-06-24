import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useRoutingContext } from '@/contexts/RoutingContext';
import { useEffect, useState } from 'react';
import L, { LatLngExpression, Icon } from 'leaflet';
import { Button } from './ui/button';
import { LocateFixed, Car, Bike, PersonStanding } from 'lucide-react';
import { toast } from './ui/use-toast';

const RouteTooltip = () => {
  const { currentRoute, profile } = useRoutingContext();

  if (!currentRoute) {
    return null;
  }

  const middlePoint = useMemo(() => {
    const coords = currentRoute.coordinates;
    if (!coords || coords.length === 0) return null;
    const midIndex = Math.floor(coords.length / 2);
    return coords[midIndex] as LatLngExpression;
  }, [currentRoute.coordinates]);

  const formattedDuration = useMemo(() => {
    const totalSeconds = currentRoute.duration;
    if (!totalSeconds) return '0 min';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.round((totalSeconds % 3600) / 60);
    if (hours > 0) return `${hours} h ${minutes} min`;
    return `${minutes} min`;
  }, [currentRoute.duration]);

  const distanceInKm = useMemo(() => (currentRoute.distance / 1000).toFixed(1), [currentRoute.distance]);
  
  const profileInfo = {
    driving: { icon: Car },
    cycling: { icon: Bike },
    walking: { icon: PersonStanding }
  };
  const ProfileIcon = profileInfo[profile].icon;
  
  const invisibleIcon = L.divIcon({
    className: 'custom-hidden-marker-icon',
    html: '',
    iconSize: [0, 0] 
  });

  if (!middlePoint) return null;

  return (
    <Marker position={middlePoint} icon={invisibleIcon}>
      <Tooltip
        permanent
        direction="top"
        offset={[0, -10]}
        className="route-summary-tooltip"
      >
        <div className="flex items-center gap-3">
          <ProfileIcon className="h-7 w-7 flex-shrink-0" />
          <div className="flex flex-col text-left">
            <span className="text-lg font-bold text-orange-500">{formattedDuration}</span>
            <span className="text-sm text-muted-foreground">{distanceInKm} km</span>
          </div>
        </div>
      </Tooltip>
    </Marker>
  );
};

const MyLocationButton = () => {
  const map = useMap();
  const [position, setPosition] = useState<LatLngExpression | null>(null);

  const handleLocate = () => {
    map.locate().on('locationfound', function (e) {
      map.flyTo(e.latlng, 14);
      setPosition(e.latlng);
    }).on('locationerror', function() {
      toast({
        title: "Error de ubicación",
        description: "No se pudo obtener tu ubicación. Por favor, comprueba los permisos.",
        variant: "destructive"
      });
    });
  };

  const userIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3179/3179068.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <>
      <div className="absolute bottom-24 md:bottom-6 right-4 z-[400]">
        <Button
          onClick={handleLocate}
          aria-label="Ubicar mi posición actual"
          className="w-14 h-14 rounded-full shadow-lg bg-card/90 backdrop-blur-sm hover:bg-muted/90"
        >
          <LocateFixed className="h-7 w-7 text-primary" />
        </Button>
      </div>
      
      {position && (
        <Marker position={position} icon={userIcon}>
          <Popup>Estás aquí</Popup>
        </Marker>
      )}
    </>
  );
};


const MapEvents = () => {
    const map = useMap();
    const { panTarget, routeBounds } = useRoutingContext();

    useEffect(() => {
        if (panTarget) {
            map.flyTo(panTarget, 13);
        }
    }, [panTarget, map]);

    useEffect(() => {
        if (routeBounds) {
            map.fitBounds(routeBounds, { padding: [50, 50] });
        }
    }, [routeBounds, map]);

    return null;
}

export function MapComponent() {
  const { currentRoute } = useRoutingContext();
  const defaultPosition: LatLngExpression = [4.5709, -74.2973];
  const defaultZoom = 6; 

  return (
    <MapContainer center={defaultPosition} zoom={defaultZoom} style={{ height: '100%', width: '100%', zIndex: 0 }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {currentRoute && (
        <Polyline
          positions={currentRoute.coordinates as LatLngExpression[]}
          color="#ec4899"
          weight={5}
        />
      )}
      
      {currentRoute && <RouteTooltip />}
      
      <MapEvents />
      <MyLocationButton />
    </MapContainer>
  );
}