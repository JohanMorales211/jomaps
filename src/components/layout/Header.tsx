import { useState, useEffect } from 'react';
import { useMobile } from '@/hooks/use-mobile';
import { Search, X, Github, Linkedin, Globe, MoreVertical, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRoutingContext } from '@/features/routing/context/RoutingContext';
import { toast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AutocompleteInput } from '@/features/routing/components/AutocompleteInput';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function Header() {
  const isMobile = useMobile();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [query, setQuery] = useState('');
  const { searchLocation, panTo, autocompleteSearch } = useRoutingContext();

  const [isNoticeOpen, setIsNoticeOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => { setIsNoticeOpen(true); }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery) return;
    const location = await searchLocation(searchQuery);
    if (location) {
      panTo([location.lat, location.lng]);
      toast({ title: 'Ubicación encontrada', description: `Moviendo el mapa a ${location.name}` });
      if (isMobile) setIsSearchActive(false);
    } else {
      toast({ title: 'Error', description: `No se pudo encontrar la ubicación "${searchQuery}"`, variant: 'destructive' });
    }
  };
  
  const NoticeButton = (
    <Popover open={isNoticeOpen} onOpenChange={setIsNoticeOpen}>
      <TooltipProvider delayDuration={100}><Tooltip>
        <TooltipTrigger asChild><PopoverTrigger asChild><Button variant="ghost" size="icon"><Megaphone className="h-5 w-5 text-amber-500" /></Button></PopoverTrigger></TooltipTrigger>
        <TooltipContent><p>Aviso Importante</p></TooltipContent>
      </Tooltip></TooltipProvider>
      <PopoverContent className="w-80">
        <Card className="border-none shadow-none">
          <CardHeader><CardTitle className="flex items-center gap-2"><Megaphone className="h-5 w-5 text-amber-500" />Aviso Importante</CardTitle><CardDescription>¡Gracias por probar mi proyecto!</CardDescription></CardHeader>
          <CardContent className="text-sm">Esta aplicación usa una API gratuita con un límite de uso diario. Por favor, realiza búsquedas y cálculos de manera responsable para que otras personas también puedan disfrutarla.</CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );

  const handleAutocompleteSelect = (suggestion: { name: string; lat: number; lng: number; }) => {
    setQuery(suggestion.name); 
    panTo([suggestion.lat, suggestion.lng]);
  };

  if (!isMobile) {
    return (
      <header className="bg-card border-b shadow-sm w-full h-16 flex items-center justify-between px-6 z-30">
        <div className="flex items-center gap-3">
          <img src="/solo_logo.png" alt="Logo de Jomaps" className="h-12 w-12 object-contain" />
          <h1 className="text-xl font-bold text-foreground">Jomaps</h1>
        </div>
        <div className="flex-grow flex justify-center">
          <div className="w-full max-w-lg flex items-center gap-2">
            {NoticeButton}
            <AutocompleteInput 
              value={query} 
              onValueChange={setQuery} 
              onSuggestionSelect={handleAutocompleteSelect}
              fetchSuggestions={autocompleteSearch}
              placeholder="Buscar ciudad o país..." 
              className="bg-background"
            />
            <Button onClick={() => handleSearch(query)}><Search className="h-4 w-4 mr-2" />Buscar</Button>
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
    <>
      <header className="bg-card border-b shadow-sm w-full h-16 flex items-center px-4 z-30">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/solo_logo.png" alt="Logo de Jomaps" className="h-12 w-12 object-contain" />
            <h1 className="text-xl font-bold text-foreground">Jomaps</h1>
          </div>
          <div className="flex items-center">
            {NoticeButton}
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
      </header>

      {isSearchActive && (
        <div className="fixed top-0 left-0 w-full bg-card z-40 p-2 border-b animate-in fade-in-25">
          <div className="flex items-center gap-2">
            <AutocompleteInput 
              autoFocus
              placeholder="Buscar ciudad o país..."
              className="flex-grow bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base" 
              value={query} 
              onValueChange={setQuery}
              onSuggestionSelect={(suggestion) => {
                setQuery(suggestion.name);
                handleSearch(suggestion.name);
              }}
              fetchSuggestions={autocompleteSearch}
            />
            <Button variant="ghost" size="sm" onClick={() => setIsSearchActive(false)}><X className="h-5 w-5" /></Button>
          </div>
        </div>
      )}
    </>
  );
}