import { useState, useEffect } from 'react';
import { useMobile } from '@/hooks/use-mobile';
import { useRoutingContext } from '../context/RoutingContext';
import { RouteForm } from './RouteForm';
import { RouteDetails } from './RouteDetails';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle } from '@/components/ui/drawer';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, PanelLeftClose, PanelLeftOpen, Route, X } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function SidePanel() {
  const isMobile = useMobile();
  const [isPanelOpen, setPanelOpen] = useState(true);
  const [isMobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const {
    currentRoute,
    clearCalculatedRoute,
    clearRouteAndPoints,
    isCalculating,
    originPoint,
    destinationPoint
  } = useRoutingContext();

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  useEffect(() => {
    if (originPoint?.name) setOrigin(originPoint.name);
    if (destinationPoint?.name) setDestination(destinationPoint.name);
  }, [originPoint, destinationPoint]);

  const handleReturnToSearch = () => {
    clearCalculatedRoute();
    if (isMobile) {
      setMobileDrawerOpen(true);
    }
  };

  const handleClearEverything = () => {
    clearRouteAndPoints();
    setOrigin("");
    setDestination("");
    if (isMobile) {
      setMobileDrawerOpen(true);
    }
  };

  const formProps = {
    origin,
    setOrigin,
    destination,
    setDestination,
    onCalculationStart: () => {
      if (isMobile) setMobileDrawerOpen(false);
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
          <DrawerTitle className="sr-only">Panel de Planificación de Ruta</DrawerTitle>
          <div className="mx-auto w-full max-w-sm">
            {isCalculating ? (
              <div className="flex flex-col items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 font-semibold">Calculando ruta...</p>
              </div>
            ) : currentRoute ? (
              <RouteDetails route={currentRoute} onReturnToSearch={handleReturnToSearch} />
            ) : (
              <>
                <CardHeader>
                  <CardTitle>Calcular Ruta</CardTitle>
                  <CardDescription>Introduce un punto de origen y destino.</CardDescription>
                </CardHeader>
                <RouteForm {...formProps} />
                {(origin || destination) && (
                  <div className="px-6 pb-6 -mt-2">
                    <Button variant="outline" size="sm" className="w-full" onClick={handleClearEverything}>
                        <X className="mr-2 h-4 w-4" />
                        Limpiar búsqueda
                    </Button>
                  </div>
                )}
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
            <RouteDetails route={currentRoute} onReturnToSearch={handleReturnToSearch} />
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
              <RouteForm {...formProps} />
              {(origin || destination) && !currentRoute && (
                 <div className="p-6 pt-0 -mt-2">
                    <Button variant="outline" size="sm" className="w-full" onClick={handleClearEverything}>
                        <X className="mr-2 h-4 w-4" />
                        Limpiar búsqueda
                    </Button>
                 </div>
              )}
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