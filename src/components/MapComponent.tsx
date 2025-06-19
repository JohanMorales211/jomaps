import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navigation, MapPin, Search } from 'lucide-react';
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

const MapComponent: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const routeLayer = useRef<L.Polyline | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  const { calculateRoute, clearRoute, currentRoute, isCalculating } = useRouting();

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with OpenStreetMap
    map.current = L.map(mapContainer.current).setView([40.7128, -74.006], 13);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          
          if (map.current) {
            map.current.setView([latitude, longitude], 15);
            
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
            description: "No se pudo obtener tu ubicación actual",
            variant: "destructive",
          });
        }
      );
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Effect para dibujar la ruta en el mapa
  useEffect(() => {
    if (!map.current) return;

    // Limpiar ruta anterior
    if (routeLayer.current) {
      map.current.removeLayer(routeLayer.current);
      routeLayer.current = null;
    }

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
    // Limpiar marcadores anteriores de búsqueda
    markersRef.current.forEach(marker => {
      if (marker.getPopup()?.getContent() !== 'Tu ubicación actual') {
        map.current?.removeLayer(marker);
      }
    });
    markersRef.current = markersRef.current.filter(marker => 
      marker.getPopup()?.getContent() === 'Tu ubicación actual'
    );

    await calculateRoute(origin, destination);
  };

  const handleClearRoute = () => {
    clearRoute();
    
    // Limpiar ruta del mapa
    if (routeLayer.current && map.current) {
      map.current.removeLayer(routeLayer.current);
      routeLayer.current = null;
    }

    // Limpiar marcadores de ruta
    markersRef.current.forEach(marker => {
      if (marker.getPopup()?.getContent() !== 'Tu ubicación actual') {
        map.current?.removeLayer(marker);
      }
    });
    markersRef.current = markersRef.current.filter(marker => 
      marker.getPopup()?.getContent() === 'Tu ubicación actual'
    );
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
            if (marker.getPopup()?.getContent() !== 'Tu ubicación actual') {
              map.current?.removeLayer(marker);
            }
          });
          markersRef.current = markersRef.current.filter(marker => 
            marker.getPopup()?.getContent() === 'Tu ubicación actual'
          );

          // Add search result marker
          const searchIcon = L.divIcon({
            html: '<div style="background-color: #0369a1; width: 25px; height: 25px; border-radius: 50% 50% 50% 0; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); transform: rotate(-45deg);"></div>',
            className: 'custom-search-marker',
            iconSize: [25, 25],
            iconAnchor: [12, 24]
          });
          
          const searchMarker = L.marker([latitude, longitude], { icon: searchIcon })
            .addTo(map.current)
            .bindPopup(`<div style="max-width: 200px;"><strong>${placeName}</strong></div>`)
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

  const handleSearch = () => {
    searchLocation(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchLocation(searchQuery);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      
      {/* Search overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-jomaps-pink-300">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-jomaps-navy-600 w-4 h-4" />
              <Input
                placeholder="Buscar ubicación..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 border-jomaps-pink-200 focus:border-jomaps-pink-400 focus:ring-jomaps-pink-400"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="bg-jomaps-pink-500 hover:bg-jomaps-pink-600 text-white"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Route form */}
      <div className="absolute top-24 left-4 w-80 z-[1000]">
        <RouteForm
          onCalculateRoute={handleCalculateRoute}
          onClearRoute={handleClearRoute}
          isCalculating={isCalculating}
          hasRoute={!!currentRoute}
        />
      </div>

      {/* Route details */}
      {currentRoute && (
        <div className="absolute top-24 right-4 w-80 z-[1000]">
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
              <span className="text-sm font-medium">Tu ubicación actual</span>
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
