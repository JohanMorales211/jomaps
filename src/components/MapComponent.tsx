import { MapContainer, TileLayer, Polyline, Marker, useMap, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useRoutingContext } from '@/contexts/RoutingContext';
import { useEffect, useState } from 'react';
import { LatLngExpression, Icon } from 'leaflet';
import { Button } from './ui/button';
import { LocateFixed } from 'lucide-react';
import { toast } from './ui/use-toast';

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
      <div className="leaflet-bottom leaflet-right mb-12">
        <div className="leaflet-control leaflet-bar">
          <Button
            onClick={handleLocate}
            size="icon"
            className="w-10 h-10 bg-card hover:bg-muted"
          >
            <LocateFixed className="h-5 w-5 text-primary" />
          </Button>
        </div>
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
    const { panTarget } = useRoutingContext();

    useEffect(() => {
        if (panTarget) {
            map.flyTo(panTarget, 13);
        }
    }, [panTarget, map]);

    return null;
}

export function MapComponent() {
  const { currentRoute } = useRoutingContext();
  const defaultPosition: LatLngExpression = [40.416775, -3.703790];

  return (
    <MapContainer center={defaultPosition} zoom={6} style={{ height: '100%', width: '100%', zIndex: 0 }}>
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
      
      <MapEvents />
      <MyLocationButton />
    </MapContainer>
  );
}