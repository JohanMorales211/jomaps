import { useState, useCallback, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import * as orsApi from '@/api/orsApi';
import { RouteData, Profile, RouteBounds, RoutePoint } from '../types';

export const useRouting = () => {
  const [currentRoute, setCurrentRoute] = useState<RouteData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [profile, setProfile] = useState<Profile>('driving');
  const [routeBounds, setRouteBounds] = useState<RouteBounds | null>(null);
  
  const [originPoint, setOriginPoint] = useState<RoutePoint | null>(null);
  const [destinationPoint, setDestinationPoint] = useState<RoutePoint | null>(null);

  const { toast } = useToast();

  const calculateRoute = async (originQuery: string, destinationQuery: string) => {
    setIsCalculating(true);
    setCurrentRoute(null);
    setRouteBounds(null);

    try {
      const [start, end] = await Promise.all([
        orsApi.searchLocation(originQuery),
        orsApi.searchLocation(destinationQuery)
      ]);

      if (!start || !end) {
        toast({ title: "Error de Ubicación", description: "No se pudieron encontrar el origen o el destino.", variant: "destructive" });
        return;
      }

      setOriginPoint(start);
      setDestinationPoint(end);

      const result = await orsApi.fetchRoute(start, end, profile);
      if (result) {
        setCurrentRoute(result.routeData);
        setRouteBounds(result.bounds);
        toast({ title: "Ruta Calculada", description: `Distancia: ${(result.routeData.distance / 1000).toFixed(1)} km` });
      }
    } catch (error: any) {
      toast({ title: "Error al Calcular", description: error.message || "Ocurrió un problema de red.", variant: "destructive" });
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    if (originPoint && destinationPoint) {
      const recalculate = async () => {
        setIsCalculating(true);
        try {
          const result = await orsApi.fetchRoute(originPoint, destinationPoint, profile);
          if (result) {
            setCurrentRoute(result.routeData);
            setRouteBounds(result.bounds);
          }
        } catch (error: any) {
          toast({ title: "Error al Recalcular", description: error.message, variant: "destructive" });
        } finally {
          setIsCalculating(false);
        }
      };
      recalculate();
    }
  }, [profile, originPoint, destinationPoint, toast]);


  const clearRoute = () => {
    setCurrentRoute(null);
    setRouteBounds(null);
    setOriginPoint(null);
    setDestinationPoint(null);
  };

  return {
    currentRoute,
    isCalculating,
    routeBounds,
    profile,
    setProfile,
    calculateRoute,
    clearRoute,
    searchLocation: orsApi.searchLocation,
    reverseGeocode: orsApi.reverseGeocode,
    autocompleteSearch: orsApi.autocompleteSearch,
  };
};