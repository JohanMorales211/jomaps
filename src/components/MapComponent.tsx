import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useRouting } from '@/hooks/useRouting';
import RouteForm from './RouteForm';
import RouteDetails from './RouteDetails';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  onSearchFromHeader?: (query: string) => void;
  onUseCurrentLocationFromHeader?: () => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  onSearchFromHeader, 
  onUseCurrentLocationFromHeader 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const routeLayer = useRef<L.Polyline | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const { toast } = useToast();
  
  const { calculateRoute, clearRoute, currentRoute, isCalculating } = useRouting();

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([latitude, longitude]);
          
          if (map.current) {
            map.current.setView([latitude, longitude], 15);
            
            // Clear previous user location markers
            markersRef.current.forEach(marker => {
              const popupContent = marker.getPopup()?.getContent();
              if (popupContent === 'Tu ubicación actual') {
                map.current?.removeLayer(marker);
              }
            });
            markersRef.current = markersRef.current.filter(marker => {
              const popupContent = marker.getPopup()?.getContent();
              return popupContent !== 'Tu ubicación actual';
            });
            
            // Add user location marker with custom icon
            const userIcon = L.divIcon({
              html: '<div style="background-color: #ec4899; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
              className: 'custom-user-marker',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });
            
            const userMarker = L.marker([latitude, longitude], { icon: userIcon })
              .addTo(map.current)
              .bindPopup('Tu ubicación actual')
              .openPopup();
            
            markersRef.current.push(userMarker);
          }

          toast({
            title: "Ubicación encontrada",
            description: "Tu ubicación actual ha sido detectada",
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Error de ubicación",
            description: "No se pudo obtener tu ubicación actual. Verifica que tengas GPS activado y permisos de ubicación.",
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      toast({
        title: "Geolocalización no disponible",
        description: "Tu navegador no soporta geolocalización",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with OpenStreetMap - Start with a general view of Colombia
    map.current = L.map(mapContainer.current).setView([4.5709, -74.2973], 6);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Get initial user location
    getCurrentLocation();

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Register the header search and location functions
  useEffect(() => {
    if (onSearchFromHeader) {
      onSearchFromHeader = searchLocation;
    }
    if (onUseCurrentLocationFromHeader) {
      onUseCurrentLocationFromHeader = getCurrentLocation;
    }
  }, [onSearchFromHeader, onUseCurrentLocationFromHeader]);

  // Effect para dibujar la ruta en el mapa
  useEffect(() => {
    if (!map.current) return;

    // Limpiar ruta anterior
    if (routeLayer.current) {
      map.current.removeLayer(routeLayer.current);
      routeLayer.current = null;
    }

    // Limpiar marcadores de ruta anteriores (mantener ubicación del usuario)
    markersRef.current.forEach(marker => {
      const popupContent = marker.getPopup()?.getContent();
      if (popupContent !== 'Tu ubicación actual' && typeof popupContent === 'string' && !popupContent.includes('búsqueda')) {
        map.current?.removeLayer(marker);
      }
    });
    markersRef.current = markersRef.current.filter(marker => {
      const popupContent = marker.getPopup()?.getContent();
      return popupContent === 'Tu ubicación actual' || (typeof popupContent === 'string' && popupContent.includes('búsqueda'));
    });

    // Dibujar nueva ruta
    if (currentRoute) {
      routeLayer.current = L.polyline(currentRoute.coordinates, {
        color: '#ec4899',
        weight: 5,
        opacity: 0.8
      }).addTo(map.current);

      // Ajustar vista del mapa para mostrar toda la ruta
      const bounds = L.latLngBounds(currentRoute.coordinates);
      map.current.fitBounds(bounds, { padding: [20, 20] });

      // Agregar marcadores de inicio y fin
      const startCoord = currentRoute.coordinates[0];
      const endCoord = currentRoute.coordinates[currentRoute.coordinates.length - 1];

      const startIcon = L.divIcon({
        html: '<div style="background-color: #22c55e; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        className: 'custom-start-marker',
        iconSize: [15, 15],
        iconAnchor: [7, 7]
      });

      const endIcon = L.divIcon({
        html: '<div style="background-color: #ef4444; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        className: 'custom-end-marker',
        iconSize: [15, 15],
        iconAnchor: [7, 7]
      });

      const startMarker = L.marker(startCoord, { icon: startIcon })
        .addTo(map.current)
        .bindPopup('Origen');

      const endMarker = L.marker(endCoord, { icon: endIcon })
        .addTo(map.current)
        .bindPopup('Destino');

      markersRef.current.push(startMarker, endMarker);
    }
  }, [currentRoute]);

  const handleCalculateRoute = async (origin: string, destination: string) => {
    console.log('Calculando ruta desde:', origin, 'hacia:', destination);
    await calculateRoute(origin, destination);
  };

  const handleClearRoute = () => {
    clearRoute();
    
    // Limpiar ruta del mapa
    if (routeLayer.current && map.current) {
      map.current.removeLayer(routeLayer.current);
      routeLayer.current = null;
    }

    // Limpiar marcadores de ruta (mantener ubicación del usuario y búsquedas)
    markersRef.current.forEach(marker => {
      const popupContent = marker.getPopup()?.getContent();
      if (popupContent !== 'Tu ubicación actual' && typeof popupContent === 'string' && !popupContent.includes('búsqueda')) {
        map.current?.removeLayer(marker);
      }
    });
    markersRef.current = markersRef.current.filter(marker => {
      const popupContent = marker.getPopup()?.getContent();
      return popupContent === 'Tu ubicación actual' || (typeof popupContent === 'string' && popupContent.includes('búsqueda'));
    });
  };

  const searchLocation = async (query: string) => {
    if (!query.trim()) return;

    try {
      // Use Nominatim API (OpenStreetMap's geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const latitude = parseFloat(result.lat);
        const longitude = parseFloat(result.lon);
        const placeName = result.display_name;
        
        if (map.current) {
          map.current.setView([latitude, longitude], 15);

          // Clear previous search markers (keep user location marker)
          markersRef.current.forEach(marker => {
            const popupContent = marker.getPopup()?.getContent();
            if (typeof popupContent === 'string' && popupContent.includes('búsqueda')) {
              map.current?.removeLayer(marker);
            }
          });
          markersRef.current = markersRef.current.filter(marker => {
            const popupContent = marker.getPopup()?.getContent();
            return !(typeof popupContent === 'string' && popupContent.includes('búsqueda'));
          });

          // Add search result marker
          const searchIcon = L.divIcon({
            html: '<div style="background-color: #0369a1; width: 25px; height: 25px; border-radius: 50% 50% 50% 0; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); transform: rotate(-45deg);"></div>',
            className: 'custom-search-marker',
            iconSize: [25, 25],
            iconAnchor: [12, 24]
          });
          
          const searchMarker = L.marker([latitude, longitude], { icon: searchIcon })
            .addTo(map.current)
            .bindPopup(`<div style="max-width: 200px;"><strong>Resultado de búsqueda:</strong><br/>${placeName}</div>`)
            .openPopup();
          
          markersRef.current.push(searchMarker);
        }

        toast({
          title: "Ubicación encontrada",
          description: `Navegando a: ${result.name || placeName.split(',')[0]}`,
        });
      } else {
        toast({
          title: "No encontrado",
          description: "No se pudo encontrar esa ubicación",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error searching location:', error);
      toast({
        title: "Error de búsqueda",
        description: "Error al buscar la ubicación",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />

      {/* Route form */}
      <div className="absolute top-4 left-4 w-80 z-[1000]">
        <RouteForm
          onCalculateRoute={handleCalculateRoute}
          onClearRoute={handleClearRoute}
          isCalculating={isCalculating}
          hasRoute={!!currentRoute}
        />
      </div>

      {/* Route details */}
      {currentRoute && (
        <div className="absolute top-4 right-4 w-80 z-[1000]">
          <RouteDetails route={currentRoute} />
        </div>
      )}

      {/* Current location info */}
      {userLocation && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000]">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-jomaps-pink-300 flex items-center gap-3">
            <div className="w-3 h-3 bg-jomaps-pink-500 rounded-full animate-pulse"></div>
            <div className="flex items-center gap-2 text-jomaps-navy-700">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Tu ubicación actual detectada</span>
            </div>
            <div className="ml-auto">
              <Navigation className="w-4 h-4 text-jomaps-blue-600" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
