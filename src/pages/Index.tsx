
import React from 'react';
import MapComponent from '@/components/MapComponent';
import Header from '@/components/Header';

const Index = () => {
  const mapRef = React.useRef<any>(null);

  const handleSearch = (query: string) => {
    // Esta función será conectada con el MapComponent
    console.log('Searching for:', query);
  };

  const handleUseCurrentLocation = () => {
    // Esta función será conectada con el MapComponent
    console.log('Using current location');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearch={handleSearch}
        onUseCurrentLocation={handleUseCurrentLocation}
      />
      <div className="h-[calc(100vh-73px)]">
        <MapComponent 
          ref={mapRef}
          onSearchFromHeader={handleSearch}
          onUseCurrentLocationFromHeader={handleUseCurrentLocation}
        />
      </div>
    </div>
  );
};

export default Index;
