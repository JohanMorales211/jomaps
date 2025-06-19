import { RouteData } from "@/hooks/useRouting";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Clock, Route, Milestone, X } from "lucide-react";
import { CardDescription, CardHeader, CardTitle } from "./ui/card";

interface RouteDetailsProps {
  route: RouteData;
  onClear: () => void;
}

export function RouteDetails({ route, onClear }: RouteDetailsProps) {
  const distanceInKm = (route.distance / 1000).toFixed(1);
  const durationInMinutes = Math.round(route.duration / 60);

  return (
    <>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Detalles de la Ruta</CardTitle>
                <CardDescription>Resumen del viaje calculado.</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClear} className="h-8 w-8 -mt-2 -mr-2">
                <X className="h-5 w-5" />
            </Button>
        </div>
      </CardHeader>

      <div className="p-6 pt-0">
        <div className="flex justify-around text-center mb-4">
          <div className="flex flex-col items-center">
            <Milestone className="h-6 w-6 text-primary mb-1" />
            <span className="font-bold">{distanceInKm} km</span>
            <span className="text-xs text-muted-foreground">Distancia</span>
          </div>
          <div className="flex flex-col items-center">
            <Clock className="h-6 w-6 text-primary mb-1" />
            <span className="font-bold">{durationInMinutes} min</span>
            <span className="text-xs text-muted-foreground">Duración</span>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex items-center mb-2">
            <Route className="h-5 w-5 mr-2 text-primary" />
            <h4 className="font-semibold">Instrucciones</h4>
        </div>
        <ScrollArea className="h-40 w-full rounded-md border p-2">
            <ol className="list-decimal list-inside text-sm space-y-2">
                {route.instructions.map((instruction, index) => <li key={index}>{instruction}</li>)}
            </ol>
        </ScrollArea>
      </div>

      <div className="p-6 pt-0">
        <Button onClick={onClear} variant="outline" className="w-full">
          Realizar nueva búsqueda
        </Button>
      </div>
    </>
  );
}