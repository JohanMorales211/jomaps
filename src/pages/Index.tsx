import { Header } from "@/components/layout/Header";
import { MapComponent } from "@/components/map/MapComponent";
import { SidePanel } from "@/features/routing/components/SidePanel";

export function Index() {
  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      <Header /> 
      
      <main className="flex-grow relative">
        <MapComponent />
        <SidePanel />
      </main>
    </div>
  );
}