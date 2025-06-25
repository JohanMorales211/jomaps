import { useRoutingContext } from "@/features/routing/context/RoutingContext";
import { Header } from "@/components/layout/Header";
import { MapComponent } from "@/components/map/MapComponent";
import { SidePanel } from "@/features/routing/components/SidePanel";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

export function Index() {
  const { isCalculating } = useRoutingContext();

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden relative">
      
      <LoadingOverlay isLoading={isCalculating} />

      <Header /> 
      
      <main className="flex-grow relative">
        <MapComponent />
        <SidePanel />
      </main>

    </div>
  );
}