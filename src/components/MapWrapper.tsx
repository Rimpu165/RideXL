'use client';

import dynamic from 'next/dynamic';
import { VehicleType } from './Vehicle3DViewer';

const MapWithNoSSR = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="h-[550px] w-full bg-neutral-900 rounded-3xl animate-pulse flex items-center justify-center text-white/50 font-mono text-sm">
      ⚡ Initializing 3D Satellite & Route Telemetry...
    </div>
  )
});

interface RoutePoint {
  day: number;
  locationName: string;
  coordinates: { lat: number; lng: number };
  altitude: string;
  description: string;
}

interface MapWrapperProps {
  routes: RoutePoint[];
  selectedVehicle?: VehicleType;
  activeWaypoint?: RoutePoint | null;
}

export default function MapWrapper({ routes, selectedVehicle, activeWaypoint }: MapWrapperProps) {
  return <MapWithNoSSR routes={routes} selectedVehicle={selectedVehicle} activeWaypoint={activeWaypoint} />;
}
