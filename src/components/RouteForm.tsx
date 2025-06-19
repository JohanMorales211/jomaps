import { useState } from "react";
import { useRoutingContext } from "@/contexts/RoutingContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoveRight } from "lucide-react";

export function RouteForm() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const { calculateRoute } = useRoutingContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin && destination) {
      calculateRoute(origin, destination);
    }
  };

  return (
    <Card className="w-full max-w-sm shadow-xl bg-card/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Calcular Ruta</CardTitle>
        <CardDescription>Introduce un punto de origen y destino.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="origin">Origen</Label>
            <Input
              id="origin"
              placeholder="Ej: Madrid, España"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="destination">Destino</Label>
            <Input
              id="destination"
              placeholder="Ej: Barcelona, España"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Calcular
            <MoveRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}