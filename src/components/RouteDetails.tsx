import React from "react";
import { Profile, RouteData } from "@/hooks/useRouting";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, Milestone, X, Car, Bike, PersonStanding } from "lucide-react";
import { CardDescription, CardHeader, CardTitle } from "./ui/card";

interface RouteDetailsProps {
  route: RouteData;
  onClear: () => void;
  profile: Profile;
}

export function RouteDetails({ route, onClear, profile }: RouteDetailsProps) {
  const distanceInKm = (route.distance / 1000).toFixed(1);

  const formattedDuration = React.useMemo(() => {
    const totalSeconds = route.duration;
    if (!totalSeconds) return '0 min';

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.round((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} h ${minutes} min`;
    }
    return `${minutes} min`;
  }, [route.duration]);

  const profileInfo = {
    driving: { icon: Car, label: 'Vehículo' },
    cycling: { icon: Bike, label: 'Bicicleta' },
    walking: { icon: PersonStanding, label: 'A pie' }
  };

  const selectedProfile = profileInfo[profile];
  const ProfileIcon = selectedProfile.icon;

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
            <span className="font-bold">{formattedDuration}</span>
            <span className="text-xs text-muted-foreground">Duración</span>
          </div>
          <div className="flex flex-col items-center">
            <ProfileIcon className="h-6 w-6 text-primary mb-1" />
            <span className="font-bold">{selectedProfile.label}</span>
            <span className="text-xs text-muted-foreground">Modo</span>
          </div>
        </div>
        <Separator className="my-4" />
      </div>

      <div className="p-6 pt-0">
        <Button onClick={onClear} variant="outline" className="w-full">
          Realizar nueva búsqueda
        </Button>
      </div>
    </>
  );
}