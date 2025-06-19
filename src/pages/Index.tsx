import { Header } from "@/components/Header";
import { MapComponent } from "@/components/MapComponent";
import { SidePanel } from "@/components/SidePanel";

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