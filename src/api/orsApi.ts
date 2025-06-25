import { AutocompleteSuggestion, Profile, RouteData, RoutePoint, RouteBounds } from '@/features/routing/types';

const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY;
const ORS_API_BASE_URL = 'https://api.openrouteservice.org';

const profileMap: Record<Profile, string> = {
  driving: 'driving-car',
  cycling: 'cycling-regular',
  walking: 'foot-walking',
};

if (!ORS_API_KEY) {
  console.error("VITE_ORS_API_KEY no está definida en el archivo .env. La aplicación no funcionará correctamente.");
}

export async function autocompleteSearch(query: string): Promise<AutocompleteSuggestion[]> {
  if (!query || query.length < 3) return [];
  try {
    const response = await fetch(`${ORS_API_BASE_URL}/geocode/autocomplete?api_key=${ORS_API_KEY}&text=${encodeURIComponent(query)}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.features?.map((feature: any) => ({
      name: feature.properties.label,
      lat: feature.geometry.coordinates[1],
      lng: feature.geometry.coordinates[0],
    })) || [];
  } catch (error) {
    console.error('Error in autocomplete search:', error);
    return [];
  }
}

export async function searchLocation(query: string): Promise<RoutePoint | null> {
  try {
    const response = await fetch(`${ORS_API_BASE_URL}/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(query)}&size=1`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    if (data?.features?.length > 0) {
      const { geometry, properties } = data.features[0];
      return { lat: geometry.coordinates[1], lng: geometry.coordinates[0], name: properties.label };
    }
    return null;
  } catch (error) {
    console.error('Error searching location:', error);
    return null;
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await fetch(`${ORS_API_BASE_URL}/geocode/reverse?api_key=${ORS_API_KEY}&point.lon=${lng}&point.lat=${lat}`);
    const data = await response.json();
    return data?.features?.[0]?.properties?.label || null;
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return null;
  }
}

export async function fetchRoute(start: RoutePoint, end: RoutePoint, profile: Profile): Promise<{ routeData: RouteData, bounds: RouteBounds } | null> {
  const orsProfile = profileMap[profile];
  const url = `${ORS_API_BASE_URL}/v2/directions/${orsProfile}/geojson`;

  const requestBody = {
    coordinates: [[start.lng, start.lat], [end.lng, end.lat]],
    elevation: true,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': ORS_API_KEY },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from ORS API:", errorData);
      throw new Error(errorData.error?.message || 'No se pudo calcular la ruta.');
    }
    
    const data = await response.json();
    if (!data.features || data.features.length === 0) return null;

    const route = data.features[0];
    const [minLng, minLat, , maxLng, maxLat] = route.bbox;
    const bounds: RouteBounds = [[minLat, minLng], [maxLat, maxLng]];
    
    const coordinates: [number, number][] = [];
    const elevationProfile: number[] = [];
    route.geometry.coordinates.forEach((coord: number[]) => {
      coordinates.push([coord[1], coord[0]]); 
      elevationProfile.push(coord[2] ?? 0);
    });

    const routeData: RouteData = {
      coordinates,
      elevationProfile,
      distance: route.properties.summary.distance,
      duration: route.properties.summary.duration,
      instructions: route.properties.segments[0].steps.map((s: any) => s.instruction),
    };

    return { routeData, bounds };
  } catch (error) {
    console.error('Error fetching route:', error);
    throw error;
  }
}