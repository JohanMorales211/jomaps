import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface WelcomeScreenProps {
  onFinished: () => void;
}

export function WelcomeScreen({ onFinished }: WelcomeScreenProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 3000);

    const finishTimer = setTimeout(() => {
      onFinished();
    }, 3800);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinished]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] flex flex-col items-center justify-center jomaps-gradient transition-opacity duration-800 ease-in-out",
        isFadingOut ? 'opacity-0' : 'opacity-100'
      )}
    >
      <div className="flex flex-col items-center justify-center">
        <img 
          src="/solo_logo.png" 
          alt="Logo de Jomaps"
          className="h-32 w-32 md:h-48 md:w-48 mb-8 animate-logo-bounce-in"
        />
        
        <h1 
          className="text-5xl md:text-7xl font-bold text-foreground animate-text-fade-in"
          style={{ animationDelay: '500ms' }}
        >
          ¡Hola!
        </h1>
        
        <p 
          className="text-xl md:text-3xl text-muted-foreground mt-4 animate-text-fade-in"
          style={{ animationDelay: '800ms' }}
        >
          Bienvenido a Jomaps
        </p>
      </div>

      <div className="absolute bottom-10 left-0 right-0">
        <p 
          className="text-center text-base md:text-lg text-muted-foreground animate-text-fade-in"
          style={{ animationDelay: '1200ms' }}
        >
          by <strong className="font-semibold text-foreground/80">Johan Morales</strong>
        </p>
      </div>

    </div>
  );
}