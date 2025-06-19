import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RouteData } from "@/hooks/useRouting";

interface RouteDetailsProps {
  route: RouteData;
  onClear: () => void;
}

export function RouteDetails({ route, onClear }: RouteDetailsProps) {
  const distanceInKm = (route.distance / 1000).toFixed(1);
  const durationInMinutes = Math.round(route.duration / 60);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Detalles de la Ruta</CardTitle>
        <div className="text-sm text-muted-foreground">
          📍 → 🏁
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{distanceInKm} km</div>
        <p className="text-xs text-muted-foreground">
          Aproximadamente {durationInMinutes} minutos
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={onClear} variant="outline" className="w-full">
          Limpiar Ruta
        </Button>
      </CardFooter>
    </Card>
  );
}