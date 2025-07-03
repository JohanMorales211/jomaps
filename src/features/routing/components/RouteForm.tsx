import { useRoutingContext } from "../context/RoutingContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "@/hooks/use-toast";
import { MoveRight, Car, Bike, PersonStanding, ArrowRightLeft } from "lucide-react";
import { Profile } from "../types";
import { AutocompleteInput } from './AutocompleteInput'; 

interface RouteFormProps {
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  onCalculationStart?: () => void;
}

export function RouteForm({ origin, setOrigin, destination, setDestination, onCalculationStart }: RouteFormProps) {
  const { 
    calculateRoute, 
    autocompleteSearch, 
    profile, 
    setProfile,
    clearOriginPoint,
    clearDestinationPoint,
  } = useRoutingContext();


  const handleInvert = () => {
    const tempOrigin = origin;
    setOrigin(destination);
    setDestination(tempOrigin);
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
          <Label htmlFor="origin">Origen</Label>
          <AutocompleteInput
            id="origin"
            placeholder="Escribe o haz doble clic en el mapa"
            value={origin}
            onValueChange={setOrigin}
            onSuggestionSelect={(suggestion) => setOrigin(suggestion.name)}
            fetchSuggestions={autocompleteSearch}
            onClear={clearOriginPoint}
            required
          />
        </div>

        <div className="flex justify-center items-center -my-2">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleInvert}
                className="rounded-full border bg-card hover:bg-accent"
                aria-label="Invertir origen y destino"
            >
                <ArrowRightLeft className="h-4 w-4 text-primary" />
            </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination">Destino</Label>
          <AutocompleteInput
            id="destination"
            placeholder="Escribe o haz doble clic en el mapa"
            value={destination}
            onValueChange={setDestination}
            onSuggestionSelect={(suggestion) => setDestination(suggestion.name)}
            fetchSuggestions={autocompleteSearch}
            onClear={clearDestinationPoint}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label>Modo de transporte</Label>
          <ToggleGroup type="single" value={profile} onValueChange={(value: Profile) => { if (value) setProfile(value); }} className="w-full grid grid-cols-3 gap-2">
            <ToggleGroupItem value="driving" aria-label="Vehículo" className="w-full"><Car className="h-5 w-5" /></ToggleGroupItem>
            <ToggleGroupItem value="cycling" aria-label="Bicicleta" className="w-full"><Bike className="h-5 w-5" /></ToggleGroupItem>
            <ToggleGroupItem value="walking" aria-label="A pie" className="w-full"><PersonStanding className="h-5 w-5" /></ToggleGroupItem>
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