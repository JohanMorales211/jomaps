import React from "react";
import { Profile, RouteData } from "@/hooks/useRouting";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, Milestone, X, Car, Bike, PersonStanding } from "lucide-react";
import { CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { useRoutingContext } from "@/contexts/RoutingContext";
import { Label } from "./ui/label";

interface RouteDetailsProps {
  route: RouteData;
  onClear: () => void;
  profile: Profile;
}

export function RouteDetails({ route, onClear, profile }: RouteDetailsProps) {
  const { setProfile } = useRoutingContext();

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

        <div className="space-y-2">
          <Label>Cambiar modo de transporte</Label>
          <ToggleGroup
            type="single"
            value={profile}
            onValueChange={(newProfile: Profile) => {
              if (newProfile) setProfile(newProfile);
            }}
            className="w-full grid grid-cols-3 gap-2"
          >
            <ToggleGroupItem value="driving" aria-label="Vehículo" className="w-full">
              <Car className="h-5 w-5" />
            </ToggleGroupItem>
            <ToggleGroupItem value="cycling" aria-label="Bicicleta" className="w-full">
              <Bike className="h-5 w-5" />
            </ToggleGroupItem>
            <ToggleGroupItem value="walking" aria-label="A pie" className="w-full">
              <PersonStanding className="h-5 w-5" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="p-6 pt-0 mt-4">
        <Button onClick={onClear} variant="outline" className="w-full">
          Realizar nueva búsqueda
        </Button>
      </div>
    </>
  );
}