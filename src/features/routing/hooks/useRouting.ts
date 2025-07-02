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
        toast({ 
          title: "Error de Ubicación", 
          description: "No se pudieron encontrar el origen o el destino. Asegúrate de que las ubicaciones sean correctas.", 
          variant: "destructive" 
        });
        setIsCalculating(false);
        return;
      }
      
      // Validar si los puntos son idénticos
      if (start.lat === end.lat && start.lng === end.lng) {
        toast({ 
          title: "Error en los puntos", 
          description: "El origen y el destino no pueden ser el mismo lugar. Selecciona puntos diferentes.", 
          variant: "destructive" 
        });
        setIsCalculating(false);
        return;
      }

      setOriginPoint(start);
      setDestinationPoint(end);

    } catch (error: any) {
      toast({ 
        title: "Error al Buscar", 
        description: error.message || "Ocurrió un problema de red. Por favor, intenta de nuevo.", 
        variant: "destructive" 
      });
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
            setCurrentRoute(null);
            toast({ 
              title: "Ruta no disponible", 
              description: "No se encontró una ruta para el modo de transporte seleccionado. Intenta con otro modo o verifica los puntos.", 
              variant: "destructive" 
            });
          }
        } catch (error: any) {
          setCurrentRoute(null);
          toast({ 
            title: "Error al Calcular", 
            description: error.message, 
            variant: "destructive" 
          });
        } finally {
          setIsCalculating(false);
        }
      };
      effectFetchRoute();
    }
  }, [originPoint, destinationPoint, profile, toast]);

  const clearOriginPoint = () => {
    setOriginPoint(null);
    setCurrentRoute(null);
    setRouteBounds(null);
  };

  const clearDestinationPoint = () => {
    setDestinationPoint(null);
    setCurrentRoute(null);
    setRouteBounds(null);
  };

  const clearCalculatedRoute = () => {
    setCurrentRoute(null);
    setRouteBounds(null);
  };

  const clearRouteAndPoints = () => {
    clearOriginPoint();
    clearDestinationPoint();
  };

  const setPointFromMapClick = (lat: number, lng: number) => {
    if (!originPoint) {
      setOriginPoint({ lat, lng, name: "Punto de Origen" });
      toast({ title: "Punto de Origen seleccionado", description: "Ahora haz clic para seleccionar el destino." });
    } else if (!destinationPoint) {
      setDestinationPoint({ lat, lng, name: "Punto de Destino" });
      toast({ title: "Punto de Destino seleccionado", description: "Calculando la ruta..." });
    } else {
      toast({ title: "Puntos ya seleccionados", description: "Limpia un punto desde el panel para volver a seleccionarlo." });
    }
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
    setPointFromMapClick,
    clearOriginPoint,
    clearDestinationPoint,
    searchLocation: orsApi.searchLocation,
    reverseGeocode: orsApi.reverseGeocode,
    autocompleteSearch: orsApi.autocompleteSearch,
  };
};