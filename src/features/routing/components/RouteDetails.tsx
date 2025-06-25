import React, { useMemo } from "react";
import { Profile, RouteData } from "@/features/routing/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, Milestone, X, Car, Bike, PersonStanding, Mountain } from "lucide-react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useRoutingContext } from "../context/RoutingContext";
import { Label } from "@/components/ui/label";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface RouteDetailsProps {
  route: RouteData;
  onReturnToSearch: () => void;
}

export function RouteDetails({ route, onReturnToSearch }: RouteDetailsProps) {
  const { profile, setProfile } = useRoutingContext();

  const distanceInKm = ((route.distance ?? 0) / 1000).toFixed(1);

  const formattedDuration = useMemo(() => {
    const totalSeconds = route.duration ?? 0;
    if (!totalSeconds) return '0 min';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.round((totalSeconds % 3600) / 60);
    if (hours > 0) return `${hours} h ${minutes} min`;
    return `${minutes} min`;
  }, [route.duration]);

  const profileInfo = {
    driving: { icon: Car, label: 'Vehículo' },
    cycling: { icon: Bike, label: 'Bicicleta' },
    walking: { icon: PersonStanding, label: 'A pie' }
  };
  const selectedProfile = profileInfo[profile];
  const ProfileIcon = selectedProfile.icon;

  const chartData = useMemo(() => {
    return route.elevationProfile?.map((alt, index) => ({
      step: index,
      altitude: Math.round(alt)
    })) || [];
  }, [route.elevationProfile]);

  const chartConfig = {
    altitude: { label: "Altitud (m)", color: "hsl(var(--primary))" },
  } satisfies ChartConfig;

  return (
    <>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Detalles de la Ruta</CardTitle>
                <CardDescription>Resumen del viaje calculado.</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onReturnToSearch} className="h-8 w-8 -mt-2 -mr-2">
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
        
        {chartData.length > 0 && (
          <div className="space-y-2 mb-6">
            <Label className="text-base font-semibold flex items-center gap-2">
                <Mountain className="h-5 w-5"/> Perfil de Altitud
            </Label>
            <div className="h-40 w-full">
              <ChartContainer config={chartConfig}>
                <AreaChart accessibilityLayer data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="step" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value, index) => {
                      if (index === 0) return "Inicio";
                      if (index === chartData.length - 1) return "Fin";
                      return "";
                    }}/>
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" labelKey="altitude" />} />
                  <Area dataKey="altitude" type="natural" fill="var(--color-altitude)" fillOpacity={0.4} stroke="var(--color-altitude)" />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Cambiar modo de transporte</Label>
          <ToggleGroup type="single" value={profile} onValueChange={(newProfile) => { if (newProfile) setProfile(newProfile as Profile); }} className="w-full grid grid-cols-3 gap-2">
            <ToggleGroupItem value="driving" aria-label="Vehículo" className="w-full"><Car className="h-5 w-5" /></ToggleGroupItem>
            <ToggleGroupItem value="cycling" aria-label="Bicicleta" className="w-full"><Bike className="h-5 w-5" /></ToggleGroupItem>
            <ToggleGroupItem value="walking" aria-label="A pie" className="w-full"><PersonStanding className="h-5 w-5" /></ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      
      <div className="p-6 pt-0 mt-4">
        <Button onClick={onReturnToSearch} variant="outline" className="w-full">
          Modificar Búsqueda
        </Button>
      </div>
    </>
  );
}