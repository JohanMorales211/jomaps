import { useState, useEffect, useCallback } from 'react';
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

  const [originQuery, setOriginQuery] = useState<string>('');
  const [destinationQuery, setDestinationQuery] = useState<string>('');

  const [originPoint, setOriginPoint] = useState<RoutePoint | null>(null);
  const [destinationPoint, setDestinationPoint] = useState<RoutePoint | null>(null);

  const searchLocation = async (query: string): Promise<RoutePoint | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`
      );
      if (!response.ok) throw new Error('Error de red al buscar ubicación');
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

  const fetchRoute = useCallback(async (start: RoutePoint, end: RoutePoint) => {
    const baseUrlMap = {
      driving: 'https://routing.openstreetmap.de/routed-car/route/v1/driving/',
      cycling: 'https://routing.openstreetmap.de/routed-bike/route/v1/driving/',
      walking: 'https://routing.openstreetmap.de/routed-foot/route/v1/driving/'
    };

    const baseUrl = baseUrlMap[profile];
    const coordinates = `${start.lng},${start.lat};${end.lng},${end.lat}`;
    const queryParams = `?overview=full&geometries=polyline&steps=true`;

    try {
      const routeResponse = await fetch(`${baseUrl}${coordinates}${queryParams}`);
      if (!routeResponse.ok) throw new Error('No se pudo calcular la ruta');
      const routeData = await routeResponse.json();

      if (routeData.code !== 'Ok' || !routeData.routes || routeData.routes.length === 0 || !routeData.routes[0].geometry) {
        toast({ title: "Error", description: "No se pudo calcular la ruta para este modo de transporte.", variant: "destructive" });
        return null;
      }
      
      const route = routeData.routes[0];
      const routeResult: RouteData = {
        coordinates: polyline.decode(route.geometry),
        distance: route.distance,
        duration: route.duration,
        instructions: route.legs[0].steps.map((step: any) => step.maneuver.instruction),
      };
      
      setCurrentRoute(routeResult);
      toast({ title: "Ruta Actualizada", description: `Modo: ${profile}. Distancia: ${(route.distance / 1000).toFixed(1)} km` });
      return routeResult;

    } catch (error) {
      console.error('Error fetching route:', error);
      toast({ title: "Error de Red", description: "Error al calcular la ruta", variant: "destructive" });
      return null;
    }
  }, [profile, toast]);

  useEffect(() => {
    if (currentRoute && originPoint && destinationPoint) {
      setIsCalculating(true);
      fetchRoute(originPoint, destinationPoint).finally(() => setIsCalculating(false));
    }
  }, [profile, fetchRoute]);

  const calculateRoute = async (origin: string, destination: string): Promise<RouteData | null> => {
    setIsCalculating(true);
    setOriginQuery(origin);
    setDestinationQuery(destination);

    try {
      const [startPoint, endPoint] = await Promise.all([
        searchLocation(origin),
        searchLocation(destination)
      ]);

      if (!startPoint || !endPoint) {
        toast({ title: "Error de Ubicación", description: "No se pudieron encontrar una o ambas ubicaciones. Intenta ser más específico.", variant: "destructive" });
        return null;
      }

      setOriginPoint(startPoint);
      setDestinationPoint(endPoint);

      return await fetchRoute(startPoint, endPoint);
    } catch (error) {
      console.error('Error calculating route:', error);
      toast({ title: "Error General", description: "Ocurrió un error inesperado al calcular la ruta.", variant: "destructive" });
      return null;
    } finally {
      setIsCalculating(false);
    }
  };

  const clearRoute = () => {
    setCurrentRoute(null);
    setOriginQuery('');
    setDestinationQuery('');
    setOriginPoint(null);
    setDestinationPoint(null);
  };
  
  const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      return data?.display_name || null;
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      return null;
    }
  };

  return { calculateRoute, clearRoute, currentRoute, isCalculating, searchLocation, reverseGeocode, profile, setProfile };
};