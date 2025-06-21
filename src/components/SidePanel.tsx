import { useState } from 'react';
import { useMobile } from '@/hooks/use-mobile';
import { useRoutingContext } from '@/contexts/RoutingContext';
import { RouteForm } from './RouteForm';
import { RouteDetails } from './RouteDetails';
import { Button } from './ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Loader2, PanelLeftClose, PanelLeftOpen, Route } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from './ui/tooltip';

export function SidePanel() {
  const isMobile = useMobile();
  const [isPanelOpen, setPanelOpen] = useState(true);
  const [isMobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const { currentRoute, clearRoute, isCalculating, profile } = useRoutingContext();

  const handleClearRoute = () => {
    clearRoute();
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  if (isMobile) {
    return (
      <Drawer open={isMobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
        <DrawerTrigger asChild>
          <Button className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 shadow-lg" size="lg">
            <Route className="mr-2 h-5 w-5" />
            {currentRoute ? 'Ver Ruta' : 'Calcular Ruta'}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="z-[60]"> 
          <div className="mx-auto w-full max-w-sm">
            {isCalculating ? (
              <div className="flex flex-col items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 font-semibold">Calculando ruta...</p>
              </div>
            ) : currentRoute ? (
              <RouteDetails route={currentRoute} onClear={handleClearRoute} profile={profile} />
            ) : (
              <>
                <CardHeader>
                  <CardTitle>Calcular Ruta</CardTitle>
                  <CardDescription>Introduce un punto de origen y destino.</CardDescription>
                </CardHeader>
                <RouteForm />
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div className="absolute top-20 left-4 z-20">
      {isPanelOpen ? (
        <Card className="w-[380px] shadow-xl bg-card/95 backdrop-blur-sm animate-in fade-in-5 slide-in-from-left-5 duration-300">
          {isCalculating ? (
            <div className="flex flex-col items-center justify-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 font-semibold">Calculando ruta...</p>
            </div>
          ) : currentRoute ? (
            <RouteDetails route={currentRoute} onClear={handleClearRoute} profile={profile} />
          ) : (
            <>
              <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Planificador de Viaje</CardTitle>
                        <CardDescription>Encuentra la mejor ruta.</CardDescription>
                    </div>
                    <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setPanelOpen(false)} className="h-8 w-8">
                            <PanelLeftClose className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger><TooltipContent><p>Ocultar panel</p></TooltipContent></Tooltip></TooltipProvider>
                </div>
              </CardHeader>
              <RouteForm />
            </>
          )}
        </Card>
      ) : (
        <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={() => setPanelOpen(true)} className="bg-card/95 backdrop-blur-sm shadow-lg animate-in fade-in-5 duration-300">
                <PanelLeftOpen className="h-5 w-5" />
            </Button>
        </TooltipTrigger><TooltipContent><p>Mostrar panel</p></TooltipContent></Tooltip></TooltipProvider>
      )}
    </div>
  );
}