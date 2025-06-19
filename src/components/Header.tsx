
import React from 'react';
import { MapPin, Menu, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-jomaps-pink-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
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
