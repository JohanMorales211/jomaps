
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ExternalLink } from 'lucide-react';

interface MapboxTokenInputProps {
  onTokenSubmit: (token: string) => void;
}

const MapboxTokenInput: React.FC<MapboxTokenInputProps> = ({ onTokenSubmit }) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onTokenSubmit(token.trim());
    }
  };

  return (
    <div className="min-h-screen jomaps-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-jomaps-pink-200 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-jomaps-pink-500 to-jomaps-blue-600 rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-jomaps-navy-800">
            Bienvenido a Jomaps
          </CardTitle>
          <CardDescription className="text-jomaps-navy-600">
            Para comenzar, necesitas un token público de Mapbox
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Ingresa tu token público de Mapbox"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="border-jomaps-pink-200 focus:border-jomaps-pink-400 focus:ring-jomaps-pink-400"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-jomaps-pink-500 to-jomaps-blue-600 hover:from-jomaps-pink-600 hover:to-jomaps-blue-700 text-white font-semibold py-2"
              disabled={!token.trim()}
            >
              Iniciar Jomaps
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-jomaps-pink-50 rounded-lg border border-jomaps-pink-200">
            <h3 className="font-semibold text-jomaps-navy-800 mb-2">¿Cómo obtener tu token?</h3>
            <ol className="text-sm text-jomaps-navy-600 space-y-1">
              <li>1. Ve a <span className="font-medium">mapbox.com</span></li>
              <li>2. Crea una cuenta gratuita</li>
              <li>3. Ve a la sección "Tokens"</li>
              <li>4. Copia tu token público</li>
            </ol>
            <a 
              href="https://mapbox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-jomaps-blue-600 hover:text-jomaps-blue-700 font-medium text-sm"
            >
              Ir a Mapbox <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapboxTokenInput;
