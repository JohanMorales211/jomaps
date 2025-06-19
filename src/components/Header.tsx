import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import { useRouting } from "@/contexts/RoutingContext";

export function Header() {
  const { calculateRoute, getCurrentLocationAsAddress } = useRouting();

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const destination = formData.get("destination") as string;
    
    if (destination) {
      const origin = await getCurrentLocationAsAddress();
      if (origin) {
        calculateRoute(origin, destination);
      }
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-card border rounded-lg shadow-sm">
      <h1 className="text-xl font-bold text-primary">Jomaps</h1>
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <Input 
          type="search" 
          name="destination"
          placeholder="¿A dónde quieres ir?" 
          className="w-64"
        />
        <Button type="submit" size="icon" aria-label="Buscar">
          <Search className="h-4 w-4" />
        </Button>
      </form>
    </header>
  );
}