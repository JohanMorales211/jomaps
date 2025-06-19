
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Route, X, Navigation } from 'lucide-react';

interface RouteFormProps {
  onCalculateRoute: (origin: string, destination: string) => void;
  onClearRoute: () => void;
  isCalculating: boolean;
  hasRoute: boolean;
}

const RouteForm: React.FC<RouteFormProps> = ({ 
  onCalculateRoute, 
  onClearRoute, 
  isCalculating, 
  hasRoute 
}) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const handleCalculate = () => {
    if (origin.trim() && destination.trim()) {
      onCalculateRoute(origin, destination);
    }
  };

  const handleClear = () => {
    setOrigin('');
    setDestination('');
    onClearRoute();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCalculate();
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-jomaps-pink-300">
      <div className="flex items-center gap-2 mb-3">
        <Route className="w-5 h-5 text-jomaps-pink-600" />
        <span className="font-semibold text-jomaps-navy-700">Calcular Ruta</span>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-jomaps-navy-600 mb-1">
            Origen
          </label>
          <Input
            placeholder="Ej: Calarca"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border-jomaps-pink-200 focus:border-jomaps-pink-400 focus:ring-jomaps-pink-400"
            disabled={isCalculating}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-jomaps-navy-600 mb-1">
            Destino
          </label>
          <Input
            placeholder="Ej: Armenia"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border-jomaps-pink-200 focus:border-jomaps-pink-400 focus:ring-jomaps-pink-400"
            disabled={isCalculating}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleCalculate}
            disabled={!origin.trim() || !destination.trim() || isCalculating}
            className="flex-1 bg-jomaps-pink-500 hover:bg-jomaps-pink-600 text-white"
          >
            <Navigation className="w-4 h-4 mr-2" />
            {isCalculating ? 'Calculando...' : 'Calcular'}
          </Button>
          
          {hasRoute && (
            <Button 
              onClick={handleClear}
              variant="outline"
              className="border-jomaps-pink-300 text-jomaps-pink-600 hover:bg-jomaps-pink-50"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteForm;
