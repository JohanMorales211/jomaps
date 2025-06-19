
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navigation, MapPin, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface MapComponentProps {
  mapboxToken: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ mapboxToken }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-74.006, 40.7128], // NYC por defecto
      zoom: 13,
      pitch: 0,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add geolocate control
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });

    map.current.addControl(geolocate, 'top-right');

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          
          if (map.current) {
            map.current.setCenter([longitude, latitude]);
            
            // Add user location marker
            new mapboxgl.Marker({
              color: '#ec4899',
              scale: 1.2
            })
              .setLngLat([longitude, latitude])
              .addTo(map.current);
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
      map.current?.remove();
    };
  }, [mapboxToken]);

  const searchLocation = async (query: string) => {
    if (!query.trim() || !mapboxToken) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=1`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        const placeName = data.features[0].place_name;
        
        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            duration: 2000
          });

          // Add search result marker
          new mapboxgl.Marker({
            color: '#0369a1',
            scale: 1.1
          })
            .setLngLat([longitude, latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<div class="p-2"><strong>${placeName}</strong></div>`)
            )
            .addTo(map.current);
        }

        toast({
          title: "Ubicación encontrada",
          description: `Navegando a: ${placeName}`,
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
      
      {/* Search overlay */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-jomaps-pink-300">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-jomaps-navy-600 w-4 h-4" />
              <Input
                placeholder="Buscar ubicación..."
                className="pl-10 border-jomaps-pink-200 focus:border-jomaps-pink-400 focus:ring-jomaps-pink-400"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    searchLocation(e.currentTarget.value);
                  }
                }}
              />
            </div>
            <Button 
              onClick={() => {
                const input = document.querySelector('input') as HTMLInputElement;
                if (input) searchLocation(input.value);
              }}
              className="bg-jomaps-pink-500 hover:bg-jomaps-pink-600 text-white"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Current location info */}
      {userLocation && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-jomaps-pink-300 flex items-center gap-3">
            <div className="w-3 h-3 bg-jomaps-pink-500 rounded-full animate-pulse-pink"></div>
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
