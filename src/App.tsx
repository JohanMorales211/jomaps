import { Index } from './pages/Index';
import { RoutingProvider } from './contexts/RoutingContext';
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <RoutingProvider>
      <Index />
      <Toaster />
    </RoutingProvider>
  );
}

export default App;