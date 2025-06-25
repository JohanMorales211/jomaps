import React from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
}

export function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
  if (!isLoading) {
    return null;
  }

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex flex-col items-center justify-center
        bg-background/70 backdrop-blur-sm
        animate-in fade-in-25
      "
      aria-live="assertive"
      role="alert"
    >
      <img
        src="/animacion_carga.gif"
        alt="Calculando ruta..."
        className="w-48 h-48"
      />

      <p className="mt-4 text-lg font-semibold text-foreground animate-pulse">
        Calculando la mejor ruta...
      </p>
    </div>
  );
}