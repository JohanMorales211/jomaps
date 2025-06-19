import { Toaster } from "@/components/ui/toaster"
import { RoutingProvider, useRouting } from "@/contexts/RoutingContext"
import IndexPage from "@/pages/Index"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const LocationPermissionDialog = () => {
  const { showPermissionDeniedDialog, setShowPermissionDeniedDialog } = useRouting();

  return (
    <AlertDialog open={showPermissionDeniedDialog} onOpenChange={setShowPermissionDeniedDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Permiso de Ubicación Denegado</AlertDialogTitle>
          <AlertDialogDescription>
            Para usar tu ubicación actual, necesitas darnos permiso.
            <br /><br />
            Busca el ícono de candado (🔒) en la barra de direcciones de tu navegador, haz clic en él y activa el permiso de "Ubicación". Luego, intenta usar el botón de nuevo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogAction onClick={() => setShowPermissionDeniedDialog(false)}>
          Entendido
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function App() {
  return (
    <RoutingProvider>
      <div className="h-full w-full bg-background">
        <IndexPage />
        <Toaster />
        <LocationPermissionDialog />
      </div>
    </RoutingProvider>
  )
}

export default App