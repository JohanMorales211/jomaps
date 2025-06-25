import { useState, useCallback, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import * as orsApi from '@/api/orsApi';
import { RouteData, Profile, RouteBounds, RoutePoint } from '../types';

export const useRouting = () => {
  const [currentRoute, setCurrentRoute] = useState<RouteData | null>(null);
  const [routeBounds, setRouteBounds] = useState<RouteBounds | null>(null);

  const [isCalculating, setIsCalculating] = useState(false);
  
  const [originPoint, setOriginPoint] = useState<RoutePoint | null>(null);
  const [destinationPoint, setDestinationPoint] = useState<RoutePoint | null>(null);

  const [profile, setProfile] = useState<Profile>('driving');

  const { toast } = useToast();

  const calculateRoute = useCallback(async (originQuery: string, destinationQuery: string) => {
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
        setIsCalculating(false);
        return;
      }

      setOriginPoint(start);
      setDestinationPoint(end);

    } catch (error: any) {
      toast({ title: "Error al Buscar", description: error.message || "Ocurrió un problema de red.", variant: "destructive" });
      setIsCalculating(false);
    }
  }, [toast]);

  useEffect(() => {
    if (originPoint && destinationPoint) {
      const effectFetchRoute = async () => {
        if (!isCalculating) setIsCalculating(true);
        try {
          const result = await orsApi.fetchRoute(originPoint, destinationPoint, profile);
          if (result) {
            setCurrentRoute(result.routeData);
            setRouteBounds(result.bounds);
          } else {
            toast({ title: "Ruta no disponible", description: "No se encontró una ruta para el modo de transporte seleccionado.", variant: "destructive" });
            setCurrentRoute(null);
          }
        } catch (error: any) {
          toast({ title: "Error al Calcular", description: error.message, variant: "destructive" });
          setCurrentRoute(null);
        } finally {
          setIsCalculating(false);
        }
      };
      
      effectFetchRoute();
    }
  }, [originPoint, destinationPoint, profile]);


  const clearCalculatedRoute = () => {
    setCurrentRoute(null);
    setRouteBounds(null);
  };

  const clearRouteAndPoints = () => {
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
    originPoint,
    destinationPoint,
    calculateRoute,
    clearCalculatedRoute,
    clearRouteAndPoints,
    searchLocation: orsApi.searchLocation,
    reverseGeocode: orsApi.reverseGeocode,
    autocompleteSearch: orsApi.autocompleteSearch,
  };
};