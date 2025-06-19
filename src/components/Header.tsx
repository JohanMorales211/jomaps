
import React, { useState } from 'react';
import { MapPin, Menu, Settings, Search, Navigation } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  onMenuClick?: () => void;
  onSearch?: (query: string) => void;
  onUseCurrentLocation?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onSearch, onUseCurrentLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleSearch = () => {
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCurrentLocation = () => {
    if (onUseCurrentLocation) {
      onUseCurrentLocation();
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-jomaps-pink-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 gap-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onMenuClick}
            className="text-jomaps-navy-700 hover:bg-jomaps-pink-100"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-jomaps-pink-500 to-jomaps-blue-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-jomaps-pink-600 to-jomaps-blue-600 bg-clip-text text-transparent">
              Jomaps
            </h1>
          </div>
        </div>

        {/* Search bar in the center */}
        <div className="flex-1 max-w-md mx-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-jomaps-navy-600 w-4 h-4" />
              <Input
                placeholder="Buscar ubicación..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 border-jomaps-pink-200 focus:border-jomaps-pink-400 focus:ring-jomaps-pink-400"
              />
            </div>
            <Button 
              onClick={handleSearch}
              size="sm"
              className="bg-jomaps-pink-500 hover:bg-jomaps-pink-600 text-white"
            >
              <Search className="w-4 h-4" />
            </Button>
            <Button 
              onClick={handleCurrentLocation}
              size="sm"
              variant="outline"
              className="border-jomaps-pink-200 text-jomaps-pink-600 hover:bg-jomaps-pink-50"
              title="Usar ubicación actual"
            >
              <Navigation className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Button 
          variant="ghost" 
          size="sm"
          className="text-jomaps-navy-700 hover:bg-jomaps-pink-100"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
