import { FormEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// Usamos el hook del contexto para acceder a la nueva funcionalidad
import { useRouting } from "@/contexts/RoutingContext"; 

export function Header() {
  const { searchLocation, setMapCenter } = useRouting();
  const { toast } = useToast();

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get("search-query") as string;

    if (!query) return;

    toast({ title: "Buscando...", description: `Buscando "${query}"` });
    const point = await searchLocation(query);

    if (point) {
      // Si encontramos el punto, actualizamos el estado mapCenter en el contexto
      setMapCenter([point.lat, point.lng]);
      toast({ title: "Ubicación encontrada", description: "Centrando mapa en la ubicación." });
    } else {
      toast({ title: "No se encontró la ubicación", description: "Intenta con otra búsqueda.", variant: "destructive" });
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-card border-b shadow-sm z-10">
      <h1 className="text-xl font-bold text-primary whitespace-nowrap">Jomaps</h1>
      <form onSubmit={handleSearch} className="flex items-center gap-2 w-full max-w-xs sm:max-w-sm md:max-w-md">
        <Input 
          type="search" 
          name="search-query"
          placeholder="Buscar un lugar..." 
          className="w-full"
        />
        <Button type="submit" size="icon" aria-label="Buscar">
          <Search className="h-4 w-4" />
        </Button>
      </form>
    </header>
  );
}