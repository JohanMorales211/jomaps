import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY;

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

export type RouteBounds = [[number, number], [number, number]];

const profileMap: Record<Profile, string> = {
  driving: 'driving-car',
  cycling: 'cycling-regular',
  walking: 'foot-walking',
};

export const useRouting = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<RouteData | null>(null);
  const [profile, setProfile] = useState<Profile>('driving');
  const { toast } = useToast();

  const [originPoint, setOriginPoint] = useState<RoutePoint | null>(null);
  const [destinationPoint, setDestinationPoint] = useState<RoutePoint | null>(null);

  const [routeBounds, setRouteBounds] = useState<RouteBounds | null>(null);

  const searchLocation = async (query: string): Promise<RoutePoint | null> => {
    if (!ORS_API_KEY) {
      console.error("API Key de OpenRouteService no encontrada. Asegúrate de configurar VITE_ORS_API_KEY en tu .env.local");
      toast({ title: "Error de Configuración", description: "Falta la API Key del servicio de mapas.", variant: "destructive" });
      return null;
    }
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(query)}&size=1`
      );
      if (!response.ok) throw new Error('Error de red al buscar ubicación');
      const data = await response.json();
      
      if (data && data.features && data.features.length > 0) {
        const result = data.features[0];
        const [lng, lat] = result.geometry.coordinates;
        return {
          lat: lat,
          lng: lng,
          name: result.properties.label
        };
      }
      return null;
    } catch (error) {
      console.error('Error searching location:', error);
      return null;
    }
  };

  const fetchRoute = useCallback(async (start: RoutePoint, end: RoutePoint) => {
    const orsProfile = profileMap[profile];
    const url = `https://api.openrouteservice.org/v2/directions/${orsProfile}?api_key=${ORS_API_KEY}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;

    try {
      const routeResponse = await fetch(url);
      if (!routeResponse.ok) throw new Error('No se pudo calcular la ruta');
      const routeData = await routeResponse.json();

      if (!routeData.features || routeData.features.length === 0) {
        toast({ title: "Error", description: "No se pudo calcular la ruta para este modo de transporte.", variant: "destructive" });
        return null;
      }
      
      const route = routeData.features[0];
      const coordinates: [number, number][] = route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);

      const [minLng, minLat, maxLng, maxLat] = route.bbox;
      setRouteBounds([[minLat, minLng], [maxLat, maxLng]]);

      const routeResult: RouteData = {
        coordinates: coordinates,
        distance: route.properties.summary.distance,
        duration: route.properties.summary.duration,
        instructions: route.properties.segments[0].steps.map((step: any) => step.instruction),
      };
      
      setCurrentRoute(routeResult);
      toast({ title: "Ruta Actualizada", description: `Modo: ${profile}. Distancia: ${(routeResult.distance / 1000).toFixed(1)} km` });
      return routeResult;

    } catch (error) {
      console.error('Error fetching route:', error);
      toast({ title: "Error de Red", description: "Error al calcular la ruta con OpenRouteService", variant: "destructive" });
      return null;
    }
  }, [profile, toast]);

  useEffect(() => {
    if (currentRoute && originPoint && destinationPoint) {
      setIsCalculating(true);
      fetchRoute(originPoint, destinationPoint).finally(() => setIsCalculating(false));
    }
  }, [profile]);

  const calculateRoute = async (origin: string, destination: string): Promise<RouteData | null> => {
    setIsCalculating(true);
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
    setOriginPoint(null);
    setDestinationPoint(null);
    setRouteBounds(null);
  };
  
  const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
    try {
      const response = await fetch(`https://api.openrouteservice.org/geocode/reverse?api_key=${ORS_API_KEY}&point.lon=${lng}&point.lat=${lat}`);
      const data = await response.json();
      if (data && data.features && data.features.length > 0) {
        return data.features[0].properties.label;
      }
      return null;
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      return null;
    }
  };

  return { calculateRoute, clearRoute, currentRoute, isCalculating, searchLocation, reverseGeocode, profile, setProfile, routeBounds };
};