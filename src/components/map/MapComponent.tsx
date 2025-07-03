import React, { useMemo, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap, Popup, Tooltip, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression, Icon } from 'leaflet';
import { useRoutingContext } from '@/features/routing/context/RoutingContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { LocateFixed, Car, Bike, PersonStanding } from 'lucide-react';
import type { RoutePoint } from '@/features/routing/types';

const customStartIcon = new L.Icon({
    iconUrl: `${import.meta.env.BASE_URL}icono_origen.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [35, 45],
    iconAnchor: [17, 45],
    popupAnchor: [1, -48],
    shadowSize: [41, 41]
});

const customEndIcon = new L.Icon({
    iconUrl: `${import.meta.env.BASE_URL}icono_destino.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [35, 45],
    iconAnchor: [17, 45],
    popupAnchor: [1, -48],
    shadowSize: [41, 41]
});

const defaultStartIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const defaultEndIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const RouteTooltip = () => {
  const { currentRoute, profile } = useRoutingContext();
  if (!currentRoute) return null;
  const middlePoint = useMemo(() => {
    const coords = currentRoute.coordinates;
    if (!coords || coords.length === 0) return null;
    return coords[Math.floor(coords.length / 2)] as LatLngExpression;
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
  const profileInfo = { driving: { icon: Car }, cycling: { icon: Bike }, walking: { icon: PersonStanding } };
  const ProfileIcon = profileInfo[profile].icon;
  const invisibleIcon = L.divIcon({ className: 'custom-hidden-marker-icon', html: '', iconSize: [0, 0] });
  if (!middlePoint) return null;

  return (
    <Marker position={middlePoint} icon={invisibleIcon}>
      <Tooltip permanent direction="top" offset={[0, -10]} className="route-summary-tooltip">
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
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const markerRef = React.useRef<L.Marker | null>(null);

  const handleLocate = () => {
    setIsLocating(true);
    map.locate().on('locationfound', (e) => {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom() < 15 ? 15 : map.getZoom());
      setIsLocating(false);
      toast({
        title: "Ubicación encontrada",
        description: "Se ha centrado el mapa en tu posición actual.",
      });
    }).on('locationerror', () => {
      toast({
        title: "Error de ubicación",
        description: "No se pudo obtener tu ubicación. Comprueba los permisos del navegador.",
        variant: "destructive"
      });
      setIsLocating(false);
    });
  };

  useEffect(() => {
    if (position && markerRef.current) {
        markerRef.current.openPopup();
    }
  }, [position]);

  const userIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <>
      <div className="absolute bottom-24 md:bottom-6 right-4 z-[400]">
        <Button 
          onClick={handleLocate} 
          disabled={isLocating} 
          aria-label="Ubicar mi posición actual" 
          className="w-14 h-14 rounded-full shadow-lg bg-card/90 backdrop-blur-sm hover:bg-muted/90"
        >
          <LocateFixed className="h-7 w-7 text-primary" />
        </Button>
      </div>
      {position && (
        <Marker 
          position={position} 
          icon={userIcon}
          ref={markerRef}
        >
          <Popup>Estás aquí.</Popup>
        </Marker>
      )}
    </>
  );
};


const MapEvents = () => {
    const map = useMap();
    const { panTarget, routeBounds, setPointFromMapClick } = useRoutingContext();

    useEffect(() => {
        if (panTarget) map.flyTo(panTarget, 13);
    }, [panTarget, map]);

    useEffect(() => {
        if (routeBounds) map.fitBounds(routeBounds, { padding: [50, 50] });
    }, [routeBounds, map]);
    
    useMapEvents({
      dblclick(e) {
        setPointFromMapClick(e.latlng.lat, e.latlng.lng);
      },
    });

    return null;
}

export function MapComponent() {
  const { currentRoute, originPoint, destinationPoint } = useRoutingContext();
  const defaultPosition: LatLngExpression = [4.5709, -74.2973];
  const defaultZoom = 6; 

  const getIconForPoint = (point: RoutePoint | null, type: 'start' | 'end') => {
    const isCustom = (point?.name || '').startsWith('Punto de');
    if (type === 'start') {
        return isCustom ? customStartIcon : defaultStartIcon;
    }
    return isCustom ? customEndIcon : defaultEndIcon;
  };

  return (
    <MapContainer center={defaultPosition} zoom={defaultZoom} style={{ height: '100%', width: '100%', zIndex: 0 }} doubleClickZoom={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {originPoint && (
          <Marker position={[originPoint.lat, originPoint.lng]} icon={getIconForPoint(originPoint, 'start')}>
              <Popup><b>Origen:</b> {originPoint.name}</Popup>
          </Marker>
      )}

      {destinationPoint && (
          <Marker position={[destinationPoint.lat, destinationPoint.lng]} icon={getIconForPoint(destinationPoint, 'end')}>
              <Popup><b>Destino:</b> {destinationPoint.name}</Popup>
          </Marker>
      )}
      
      {currentRoute && <Polyline positions={currentRoute.coordinates as LatLngExpression[]} color="#ec4899" weight={5} />}
      
      {currentRoute && <RouteTooltip />}
      
      <MapEvents />
      <MyLocationButton />
    </MapContainer>
  );
}