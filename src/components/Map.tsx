'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { VehicleType } from './Vehicle3DViewer';

// Default waypoint marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

// Create custom animated 3D Vehicle Leaflet Icon
const createVehicleDivIcon = (vehicleType: VehicleType) => {
  const iconEmojis: Record<VehicleType, string> = {
    bike: '🏍️',
    suv: '🚙',
    truck: '🚚',
    superbike: '⚡'
  };
  const emoji = iconEmojis[vehicleType] || '🏍️';

  return L.divIcon({
    className: 'custom-vehicle-marker',
    html: `
      <div style="
        position: relative;
        width: 44px;
        height: 44px;
        background: rgba(15, 23, 42, 0.9);
        border: 2px solid #00d2ff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        box-shadow: 0 0 20px #00d2ff, inset 0 0 10px rgba(0, 210, 255, 0.5);
        animation: pulseMarker 2s infinite ease-in-out;
      ">
        ${emoji}
        <div style="
          position: absolute;
          bottom: -6px;
          width: 8px;
          height: 8px;
          background: #00d2ff;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44]
  });
};

interface RoutePoint {
  day: number;
  locationName: string;
  coordinates: { lat: number; lng: number };
  altitude: string;
  description: string;
}

interface MapProps {
  routes: RoutePoint[];
  selectedVehicle?: VehicleType;
  activeWaypoint?: RoutePoint | null;
}

// Controller component to pan map smoothly when active waypoint changes
function MapFlyTo({ activeWaypoint }: { activeWaypoint?: RoutePoint | null }) {
  const map = useMap();
  useEffect(() => {
    if (activeWaypoint && activeWaypoint.coordinates) {
      map.flyTo([activeWaypoint.coordinates.lat, activeWaypoint.coordinates.lng], 9, {
        duration: 1.5
      });
    }
  }, [activeWaypoint, map]);
  return null;
}

export default function Map({ routes, selectedVehicle = 'bike', activeWaypoint }: MapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[550px] w-full bg-neutral-900 rounded-3xl animate-pulse"></div>;

  if (!routes || routes.length === 0) return null;

  const positions = routes.map(r => [r.coordinates.lat, r.coordinates.lng] as [number, number]);
  const center = activeWaypoint 
    ? [activeWaypoint.coordinates.lat, activeWaypoint.coordinates.lng] as [number, number]
    : positions[0];

  const vehicleIcon = createVehicleDivIcon(selectedVehicle);

  return (
    <div className="relative w-full h-[550px] rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20 border border-white/10">
      
      {/* Map Control Info Overlay */}
      <div className="absolute top-4 left-4 z-[1000] bg-black/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 flex items-center gap-3">
        <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
        <span className="text-xs font-bold text-white uppercase tracking-wider">3D Route Telemetry Active</span>
      </div>

      <MapContainer 
        center={center} 
        zoom={7} 
        style={{ height: '100%', width: '100%', background: '#000' }}
        scrollWheelZoom={false}
      >
        <MapFlyTo activeWaypoint={activeWaypoint} />

        {/* CartoDB Dark Matter tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {/* Route Waypoint Markers */}
        {routes.map((route) => {
          const isActive = activeWaypoint?.day === route.day;
          return (
            <Marker 
              key={route.day} 
              position={[route.coordinates.lat, route.coordinates.lng]}
              icon={isActive ? vehicleIcon : customIcon}
            >
              <Popup className="custom-popup">
                <div className="text-black p-1">
                  <h3 className="font-bold text-lg">{route.locationName}</h3>
                  <p className="text-sm font-semibold text-blue-600">Day {route.day} • {route.altitude}</p>
                  <p className="text-sm mt-1">{route.description}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Dynamic Route Polyline */}
        <Polyline 
          positions={positions} 
          pathOptions={{ color: '#00d2ff', weight: 5, opacity: 0.8, className: 'glow-line' }} 
        />
      </MapContainer>
    </div>
  );
}
