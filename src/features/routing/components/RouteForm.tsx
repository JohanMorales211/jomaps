import { useState } from "react";
import { useRoutingContext } from "../context/RoutingContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "@/hooks/use-toast";
import { MoveRight, Locate, Loader2, Car, Bike, PersonStanding } from "lucide-react";
import { Profile } from "../types";
import { AutocompleteInput } from './AutocompleteInput'; 

interface RouteFormProps {
  onCalculationStart?: () => void;
}

export function RouteForm({ onCalculationStart }: RouteFormProps) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  
  const { calculateRoute, reverseGeocode, autocompleteSearch, profile, setProfile } = useRoutingContext();

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const address = await reverseGeocode(latitude, longitude);
          if (address) {
            setOrigin(address);
            toast({ title: "Ubicación encontrada", description: "Origen actualizado." });
          } else {
            setOrigin(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
            toast({ title: "Ubicación encontrada", description: "Coordenadas capturadas." });
          }
        } catch (error) {
          toast({ title: "Error", description: "No se pudo obtener el nombre de la ubicación.", variant: "destructive" });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        const errorMessage = error.code === error.PERMISSION_DENIED 
          ? "Permiso de ubicación denegado." 
          : "No se pudo obtener tu ubicación.";
        toast({ title: "Error de ubicación", description: errorMessage, variant: "destructive" });
        setIsLocating(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin && destination) {
      onCalculationStart?.(); 
      calculateRoute(origin, destination);
    } else {
      toast({ title: "Campos incompletos", description: "Por favor, introduce un origen y un destino.", variant: "destructive"})
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 pt-0 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="origin">Origen</Label>
            <Button type="button" variant="ghost" size="sm" onClick={handleUseCurrentLocation} disabled={isLocating} className="text-primary hover:text-primary h-8">
              {isLocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Locate className="mr-2 h-4 w-4" />}
              Ubicación actual
            </Button>
          </div>
          <AutocompleteInput
            id="origin"
            placeholder="Ej: Bogotá, Colombia"
            value={origin}
            onValueChange={setOrigin}
            onSuggestionSelect={(suggestion) => setOrigin(suggestion.name)}
            fetchSuggestions={autocompleteSearch}
            required
            disabled={isLocating}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="destination">Destino</Label>
          <AutocompleteInput
            id="destination"
            placeholder="Ej: Medellín, Colombia"
            value={destination}
            onValueChange={setDestination}
            onSuggestionSelect={(suggestion) => setDestination(suggestion.name)}
            fetchSuggestions={autocompleteSearch}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Modo de transporte</Label>
          <ToggleGroup type="single" value={profile} onValueChange={(value: Profile) => { if (value) setProfile(value); }} className="w-full grid grid-cols-3 gap-2">
            <ToggleGroupItem value="driving" aria-label="Vehículo" className="w-full flex items-center gap-2">
              <Car className="h-5 w-5" />
            </ToggleGroupItem>
            <ToggleGroupItem value="cycling" aria-label="Bicicleta" className="w-full flex items-center gap-2">
              <Bike className="h-5 w-5" />
            </ToggleGroupItem>
            <ToggleGroupItem value="walking" aria-label="A pie" className="w-full flex items-center gap-2">
              <PersonStanding className="h-5 w-5" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <div className="p-6 pt-0">
        <Button type="submit" className="w-full">
          Calcular
          <MoveRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}