import { useState } from 'react';
import { useMobile } from '@/hooks/use-mobile';
import { Search, X, Github, Linkedin, Globe, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRoutingContext } from '@/contexts/RoutingContext';
import { toast } from '@/components/ui/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AutocompleteInput } from './ui/AutocompleteInput'; 
import { Input } from './ui/input'; 

export function Header() {
  const isMobile = useMobile();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [query, setQuery] = useState('');
  const { searchLocation, panTo } = useRoutingContext();

  const handleSearch = async () => {
    if (!query) return;
    const location = await searchLocation(query);
    if (location) {
      panTo([location.lat, location.lng]);
      toast({ title: 'Ubicación encontrada', description: `Moviendo el mapa a ${location.name}` });
      if (isMobile) {
        setIsSearchActive(false);
        setQuery('');
      }
    } else {
      toast({ title: 'Error', description: `No se pudo encontrar la ubicación "${query}"`, variant: 'destructive' });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  if (!isMobile) {
    return (
      <header className="bg-card border-b shadow-sm w-full h-16 flex items-center justify-between px-6 z-30">
        <div className="flex items-center gap-3">
          <img src="/logo_jomaps_sinfondo.png" alt="Logo de Jomaps" className="h-12 w-12 object-contain" />
          <h1 className="text-xl font-bold text-foreground">Jomaps</h1>
        </div>
        
        <div className="flex-grow flex justify-center">
          <div className="w-full max-w-md flex items-center gap-2">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AutocompleteInput
                    value={query}
                    onValueChange={setQuery}
                    onSuggestionSelect={(suggestion) => {
                      setQuery(suggestion.name);
                      panTo([suggestion.lat, suggestion.lng]);
                    }}
                    placeholder="Buscar ciudad o país para ir..."
                    className="bg-background"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Encuentra un lugar y el mapa se moverá hacia él.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <TooltipProvider delayDuration={100}>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" asChild><a href="https://github.com/JohanMorales211" target="_blank" rel="noopener noreferrer"><Github className="h-5 w-5" /></a></Button></TooltipTrigger><TooltipContent><p>GitHub</p></TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" asChild><a href="https://www.linkedin.com/in/johan-morales-b3809b206/" target="_blank" rel="noopener noreferrer"><Linkedin className="h-5 w-5" /></a></Button></TooltipTrigger><TooltipContent><p>LinkedIn</p></TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" asChild><a href="https://johanmorales211.github.io/portafolio-personal/" target="_blank" rel="noopener noreferrer"><Globe className="h-5 w-5" /></a></Button></TooltipTrigger><TooltipContent><p>Portafolio</p></TooltipContent></Tooltip>
          </TooltipProvider>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-card border-b shadow-sm w-full h-16 flex items-center px-4 z-30">
      {isSearchActive ? (
        <div className="w-full flex items-center gap-2 animate-in fade-in-50 duration-300">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input autoFocus type="text" placeholder="Buscar ciudad o país..." className="flex-grow bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0" value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={handleKeyPress} />
          <Button variant="ghost" size="sm" onClick={() => setIsSearchActive(false)}><X className="h-5 w-5" /></Button>
        </div>
      ) : (
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo_jomaps_sinfondo.png" alt="Logo de Jomaps" className="h-12 w-12 object-contain" />
            <h1 className="text-xl font-bold text-foreground">Jomaps</h1>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchActive(true)}><Search className="h-5 w-5" /></Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild><a href="https://github.com/JohanMorales211" target="_blank" rel="noopener noreferrer" className="flex items-center"><Github className="mr-2 h-4 w-4" /><span>GitHub</span></a></DropdownMenuItem>
                <DropdownMenuItem asChild><a href="https://www.linkedin.com/in/johan-morales-b3809b206/" target="_blank" rel="noopener noreferrer" className="flex items-center"><Linkedin className="mr-2 h-4 w-4" /><span>LinkedIn</span></a></DropdownMenuItem>
                <DropdownMenuItem asChild><a href="https://johanmorales211.github.io/portafolio-personal/" target="_blank" rel="noopener noreferrer" className="flex items-center"><Globe className="mr-2 h-4 w-4" /><span>Portafolio</span></a></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </header>
  );
}