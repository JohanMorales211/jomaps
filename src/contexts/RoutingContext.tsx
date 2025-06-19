import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useRouting as useRoutingHook, RouteData, RoutePoint } from '@/hooks/useRouting';
import { useToast } from '@/hooks/use-toast';

interface RoutingContextType {
  currentRoute: RouteData | null;
  isCalculating: boolean;
  showPermissionDeniedDialog: boolean;
  setShowPermissionDeniedDialog: React.Dispatch<React.SetStateAction<boolean>>;
  calculateRoute: (origin: string, destination: string) => Promise<void>;
  clearRoute: () => void;
  getCurrentLocationAsAddress: () => Promise<string | null>;
}

const RoutingContext = createContext<RoutingContextType | undefined>(undefined);

export const RoutingProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [showPermissionDeniedDialog, setShowPermissionDeniedDialog] = useState(false);
  
  const { currentRoute, isCalculating, calculateRoute: calculate, clearRoute: clear } = useRoutingHook();

  const getCurrentLocationAsAddress = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        toast({ title: "Error", description: "Tu navegador no soporta geolocalización.", variant: "destructive" });
        return resolve(null);
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            if (data && data.display_name) {
              toast({ title: "Ubicación encontrada", description: "Se ha establecido tu ubicación actual." });
              resolve(data.display_name);
            } else {
              resolve(null);
            }
          } catch (error) {
            resolve(null);
          }
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setShowPermissionDeniedDialog(true);
          } else {
            toast({ title: "Error de Ubicación", description: "No se pudo obtener tu ubicación.", variant: "destructive" });
          }
          resolve(null);
        }
      );
    });
  };

  const calculateRoute = async (origin: string, destination: string) => {
    await calculate(origin, destination);
  };

  const clearRoute = () => {
    clear();
  };

  const value = {
    currentRoute,
    isCalculating,
    showPermissionDeniedDialog,
    setShowPermissionDeniedDialog,
    calculateRoute,
    clearRoute,
    getCurrentLocationAsAddress,
  };

  return <RoutingContext.Provider value={value}>{children}</RoutingContext.Provider>;
};

export const useRouting = () => {
  const context = useContext(RoutingContext);
  if (context === undefined) {
    throw new Error('useRouting must be used within a RoutingProvider');
  }
  return context;
};