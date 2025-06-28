import { useState, useEffect } from 'react';
import { Index } from './pages/Index';
import { RoutingProvider } from './features/routing/context/RoutingContext';
import { Toaster } from "@/components/ui/toaster";
import { WelcomeScreen } from '@/components/layout/WelcomeScreen';

function App() {
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
  }, []); 

  if (showWelcomeScreen) {
    return <WelcomeScreen onFinished={() => setShowWelcomeScreen(false)} />;
  }

  return (
    <RoutingProvider>
      <Index />
      <Toaster />
    </RoutingProvider>
  );
}

export default App;