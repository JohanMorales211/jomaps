import { useEffect } from 'react';
import { Index } from './pages/Index';
import { RoutingProvider } from './contexts/RoutingContext';
import { Toaster } from "@/components/ui/toaster";

function App() {
  
  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('dark');
    
  }, []); 

  return (
    <RoutingProvider>
      <Index />
      <Toaster />
    </RoutingProvider>
  );
}

export default App;