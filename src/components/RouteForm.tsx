import { useState } from "react";
import { useRoutingContext } from "@/contexts/RoutingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoveRight, Locate, Loader2 } from "lucide-react";
import { toast } from "./ui/use-toast";

export function RouteForm() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const { calculateRoute, reverseGeocode } = useRoutingContext();

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await reverseGeocode(latitude, longitude);
        if (address) {
          setOrigin(address);
          toast({ title: "Ubicación encontrada", description: "Origen actualizado a tu ubicación actual." });
        } else {
          setOrigin(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
          toast({ title: "Ubicación encontrada", description: "Coordenadas capturadas.", variant: "default" });
        }
        setIsLocating(false);
      },
      (error) => {
        toast({
          title: "Error de ubicación",
          description: error.message === "User denied Geolocation" ? "Has denegado el permiso de ubicación." : "No se pudo obtener tu ubicación.",
          variant: "destructive",
        });
        setIsLocating(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin && destination) {
      calculateRoute(origin, destination);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 pt-0 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="origin">Origen</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="text-primary hover:text-primary h-8"
            >
              {isLocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Locate className="mr-2 h-4 w-4" />}
              Ubicación actual
            </Button>
          </div>
          <Input id="origin" placeholder="Ej: Bogotá, Colombia" value={origin} onChange={(e) => setOrigin(e.target.value)} required disabled={isLocating} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="destination">Destino</Label>
          <Input id="destination" placeholder="Ej: Medellín, Colombia" value={destination} onChange={(e) => setDestination(e.target.value)} required />
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