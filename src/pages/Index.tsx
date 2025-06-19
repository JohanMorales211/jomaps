
import React from 'react';
import MapComponent from '@/components/MapComponent';
import Header from '@/components/Header';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-[calc(100vh-73px)]">
        <MapComponent />
      </div>
    </div>
  );
};

export default Index;
