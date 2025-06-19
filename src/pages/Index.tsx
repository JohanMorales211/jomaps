import { Header } from "@/components/Header";
import { MapComponent } from "@/components/MapComponent";
import { RouteForm } from "@/components/RouteForm";
import { RouteDetails } from "@/components/RouteDetails";
import { useRoutingContext } from "@/contexts/RoutingContext";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function Index() {
  const { currentRoute, clearRoute, isCalculating } = useRoutingContext();

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      <Header />
      <main className="flex-grow relative">
        <MapComponent />

        <div className="absolute top-4 left-4 z-10 w-[350px]">
          {isCalculating && (
            <Card className="shadow-lg animate-pulse">
              <CardContent className="p-4 flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <p className="font-semibold">Calculando la mejor ruta...</p>
              </CardContent>
            </Card>
          )}

          {!isCalculating && (
            <>
              {!currentRoute ? (
                <RouteForm />
              ) : (
                <RouteDetails route={currentRoute} onClear={clearRoute} />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}