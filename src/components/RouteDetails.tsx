
import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { RouteData } from '@/hooks/useRouting';

interface RouteDetailsProps {
  route: RouteData;
}

const RouteDetails: React.FC<RouteDetailsProps> = ({ route }) => {
  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-jomaps-pink-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2 text-jomaps-navy-700">
          <MapPin className="w-4 h-4" />
          <span className="font-medium">{formatDistance(route.distance)}</span>
        </div>
        <div className="flex items-center gap-2 text-jomaps-navy-700">
          <Clock className="w-4 h-4" />
          <span className="font-medium">{formatDuration(route.duration)}</span>
        </div>
      </div>
      
      <div className="max-h-32 overflow-y-auto">
        <h4 className="text-sm font-semibold text-jomaps-navy-700 mb-2">Instrucciones:</h4>
        <div className="space-y-1">
          {route.instructions.slice(0, 5).map((instruction, index) => (
            <p key={index} className="text-xs text-jomaps-navy-600">
              {index + 1}. {instruction}
            </p>
          ))}
          {route.instructions.length > 5 && (
            <p className="text-xs text-jomaps-navy-500 italic">
              y {route.instructions.length - 5} instrucciones más...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteDetails;
