import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin } from "lucide-react";
import { useRouting } from "@/contexts/RoutingContext";

export function RouteForm() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const { calculateRoute, isCalculating, getCurrentLocationAsAddress } = useRouting();

  const handleGetCurrentLocation = async () => {
    setIsLocating(true);
    const address = await getCurrentLocationAsAddress();
    if (address) {
      setOrigin(address);
    }
    setIsLocating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination) return;
    await calculateRoute(origin, destination);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calcular Ruta</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="origin">Origen</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="origin"
                placeholder="Ej: Madrid, España"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
              />
              <Button type="button" variant="outline" size="icon" onClick={handleGetCurrentLocation} disabled={isLocating} aria-label="Usar mi ubicación actual">
                {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="destination">Destino</Label>
            <Input id="destination" placeholder="Ej: Barcelona, España" value={destination} onChange={(e) => setDestination(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={isCalculating}>
            {isCalculating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Calculando...</> : "Calcular Ruta"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}