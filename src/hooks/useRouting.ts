import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import polyline from '@mapbox/polyline';

export interface RoutePoint {
  lat: number;
  lng: number;
  name: string;
}

export interface RouteData {
  coordinates: [number, number][];
  distance: number;
  duration: number;
  instructions: string[];
}

export type Profile = 'driving' | 'cycling' | 'walking';

export const useRouting = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<RouteData | null>(null);
  const [profile, setProfile] = useState<Profile>('driving');
  const { toast } = useToast();

  const searchLocation = async (query: string): Promise<RoutePoint | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        return {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          name: result.display_name
        };
      }
      return null;
    } catch (error) {
      console.error('Error searching location:', error);
      return null;
    }
  };

  const calculateRoute = async (origin: string, destination: string): Promise<RouteData | null> => {
    setIsCalculating(true);
    try {
      const [originPoint, destinationPoint] = await Promise.all([
        searchLocation(origin),
        searchLocation(destination)
      ]);

      if (!originPoint || !destinationPoint) {
        toast({ title: "Error", description: "No se pudieron encontrar una o ambas ubicaciones", variant: "destructive" });
        return null;
      }

      const baseUrlMap = {
        driving: 'https://routing.openstreetmap.de/routed-car/route/v1/driving/',
        cycling: 'https://routing.openstreetmap.de/routed-bike/route/v1/driving/',
        walking: 'https://routing.openstreetmap.de/routed-foot/route/v1/driving/'
      };

      const baseUrl = baseUrlMap[profile];
      const coordinates = `${originPoint.lng},${originPoint.lat};${destinationPoint.lng},${destinationPoint.lat}`;
      
      const queryParams = `?overview=full&geometries=polyline&steps=true`;

      const routeResponse = await fetch(`${baseUrl}${coordinates}${queryParams}`);
      const routeData = await routeResponse.json();

      if (routeData.code !== 'Ok' || !routeData.routes || routeData.routes.length === 0) {
        toast({ title: "Error", description: "No se pudo calcular la ruta para este modo de transporte.", variant: "destructive" });
        return null;
      }

      const route = routeData.routes[0];

      if (!route.geometry) {
        toast({ title: "Error", description: "La API no devolvió una geometría de ruta válida.", variant: "destructive" });
        return null;
      }

      const routeResult: RouteData = {
        coordinates: polyline.decode(route.geometry),
        distance: route.distance,
        duration: route.duration,
        instructions: route.legs[0].steps.map((step: any) => step.maneuver.instruction),
      };

      setCurrentRoute(routeResult);
      toast({ title: "Ruta Calculada", description: `Distancia: ${(route.distance / 1000).toFixed(1)} km, Tiempo: ${Math.round(route.duration / 60)} min` });
      return routeResult;
    } catch (error) {
      console.error('Error calculating route:', error);
      toast({ title: "Error de Red", description: "Error al calcular la ruta", variant: "destructive" });
      return null;
    } finally {
      setIsCalculating(false);
    }
  };

  const clearRoute = () => {
    setCurrentRoute(null);
  };
  
  const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      if (data && data.display_name) {
        return data.display_name;
      }
      return null;
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      return null;
    }
  };

  return { calculateRoute, clearRoute, currentRoute, isCalculating, searchLocation, reverseGeocode, profile, setProfile };
};