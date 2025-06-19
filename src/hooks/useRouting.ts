
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

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

export const useRouting = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<RouteData | null>(null);
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
      // Buscar las coordenadas de origen y destino
      const [originPoint, destinationPoint] = await Promise.all([
        searchLocation(origin),
        searchLocation(destination)
      ]);

      if (!originPoint || !destinationPoint) {
        toast({
          title: "Error",
          description: "No se pudieron encontrar una o ambas ubicaciones",
          variant: "destructive",
        });
        return null;
      }

      // Calcular la ruta usando OSRM
      const routeResponse = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${originPoint.lng},${originPoint.lat};${destinationPoint.lng},${destinationPoint.lat}?overview=full&geometries=geojson&steps=true`
      );

      const routeData = await routeResponse.json();

      if (routeData.code !== 'Ok' || !routeData.routes || routeData.routes.length === 0) {
        toast({
          title: "Error",
          description: "No se pudo calcular la ruta",
          variant: "destructive",
        });
        return null;
      }

      const route = routeData.routes[0];
      const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
      
      // Extraer instrucciones de navegación
      const instructions = route.legs[0].steps.map((step: any) => step.maneuver.instruction);

      const routeResult: RouteData = {
        coordinates,
        distance: route.distance,
        duration: route.duration,
        instructions
      };

      setCurrentRoute(routeResult);

      toast({
        title: "Ruta calculada",
        description: `Distancia: ${(route.distance / 1000).toFixed(1)} km, Tiempo: ${Math.round(route.duration / 60)} min`,
      });

      return routeResult;
    } catch (error) {
      console.error('Error calculating route:', error);
      toast({
        title: "Error",
        description: "Error al calcular la ruta",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsCalculating(false);
    }
  };

  const clearRoute = () => {
    setCurrentRoute(null);
  };

  return {
    calculateRoute,
    clearRoute,
    currentRoute,
    isCalculating,
    searchLocation
  };
};
