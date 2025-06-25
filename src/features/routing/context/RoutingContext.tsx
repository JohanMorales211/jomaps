import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouting, RouteData, RoutePoint, Profile, RouteBounds, AutocompleteSuggestion } from '@/features/routing/hooks/useRouting';

interface RoutingContextProps {
  calculateRoute: (origin: string, destination: string) => Promise<RouteData | null>;
  clearRoute: () => void;
  currentRoute: RouteData | null;
  isCalculating: boolean;
  searchLocation: (query: string) => Promise<RoutePoint | null>;
  panTo: (coords: [number, number]) => void;
  panTarget: [number, number] | null;
  reverseGeocode: (lat: number, lng: number) => Promise<string | null>;
  profile: Profile;
  setProfile: (profile: Profile) => void;
  routeBounds: RouteBounds | null;
  autocompleteSearch: (query: string) => Promise<AutocompleteSuggestion[]>;
}

const RoutingContext = createContext<RoutingContextProps | undefined>(undefined);

export const RoutingProvider = ({ children }: { children: ReactNode }) => {
  const routing = useRouting();
  const [panTarget, setPanTarget] = useState<[number, number] | null>(null);

  const panTo = (coords: [number, number]) => {
    setPanTarget(coords);
    setTimeout(() => setPanTarget(null), 50);
  };

  const value = { ...routing, panTo, panTarget };

  return (
    <RoutingContext.Provider value={value}>
      {children}
    </RoutingContext.Provider>
  );
};

export const useRoutingContext = () => {
  const context = useContext(RoutingContext);
  if (context === undefined) {
    throw new Error('useRoutingContext must be used within a RoutingProvider');
  }
  return context;
};