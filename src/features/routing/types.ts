export interface AutocompleteSuggestion {
  name: string;
  lat: number;
  lng: number;
}
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
  elevationProfile?: number[];
}
export type Profile = 'driving' | 'cycling' | 'walking';
export type RouteBounds = [[number, number], [number, number]];