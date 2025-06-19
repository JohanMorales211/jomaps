
import React, { useState } from 'react';
import MapComponent from '@/components/MapComponent';
import MapboxTokenInput from '@/components/MapboxTokenInput';
import Header from '@/components/Header';

const Index = () => {
  const [mapboxToken, setMapboxToken] = useState<string>('');

  if (!mapboxToken) {
    return <MapboxTokenInput onTokenSubmit={setMapboxToken} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-[calc(100vh-73px)]">
        <MapComponent mapboxToken={mapboxToken} />
      </div>
    </div>
  );
};

export default Index;
