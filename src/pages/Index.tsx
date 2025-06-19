import { Header } from '@/components/Header';
import { MapComponent } from '@/components/MapComponent';

export default function IndexPage() {
  return (
    <div className="flex flex-col h-full w-full">
      <Header />
      <div className="flex-grow">
        <MapComponent />
      </div>
    </div>
  );
}