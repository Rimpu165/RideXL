'use client';
import React, { useState, useEffect } from 'react';
import Vehicle3DViewer, { VEHICLES_DATA, VehicleType } from './Vehicle3DViewer';

interface Waypoint {
  day: number;
  locationName: string;
  altitude: string;
  altitudeMeters?: number;
  coordinates: { lat: number; lng: number };
  description: string;
}

const DEFAULT_WAYPOINTS: Waypoint[] = [
  { day: 1, locationName: 'Palampur Basecamp', altitude: '1,470m', altitudeMeters: 1470, coordinates: { lat: 32.1109, lng: 76.5363 }, description: 'Expedition briefing & departure through tea gardens.' },
  { day: 2, locationName: 'Bir Billing & Mandi', altitude: '2,400m', altitudeMeters: 2400, coordinates: { lat: 32.0469, lng: 76.7262 }, description: 'Paragliding takeoff zone and lush valley mountain roads.' },
  { day: 3, locationName: 'Manali & Solang Valley', altitude: '2,050m', altitudeMeters: 2050, coordinates: { lat: 32.2432, lng: 77.1892 }, description: 'Acclimatization, equipment final checks, river rafting.' },
  { day: 4, locationName: 'Rohtang Pass Tunnel & Keylong', altitude: '3,978m', altitudeMeters: 3978, coordinates: { lat: 32.3716, lng: 77.0605 }, description: 'Crossing Atal Tunnel into Lahaul alpine valley.' },
  { day: 5, locationName: 'Jispa & Baralacha La', altitude: '4,890m', altitudeMeters: 4890, coordinates: { lat: 32.7483, lng: 77.4116 }, description: 'Deep mountain river crossings and Suraj Tal glacial lake.' },
  { day: 6, locationName: 'Sarchu High Altitude Camp', altitude: '4,290m', altitudeMeters: 4290, coordinates: { lat: 32.9081, lng: 77.5817 }, description: 'Border of Himachal & Ladakh, overnight tent stay under starry skies.' },
  { day: 7, locationName: 'Gata Loops & Nakee La', altitude: '4,739m', altitudeMeters: 4739, coordinates: { lat: 33.1558, lng: 77.7289 }, description: '21 hairpin mountain hairpin turns climbing steeply.' },
  { day: 8, locationName: 'Tanglang La Pass', altitude: '5,328m', altitudeMeters: 5328, coordinates: { lat: 33.5074, lng: 77.7719 }, description: '2nd Highest motorable pass in the world!' },
  { day: 9, locationName: 'Leh Ladakh Plateau', altitude: '3,500m', altitudeMeters: 3500, coordinates: { lat: 34.1526, lng: 77.5771 }, description: 'Final destination victory parade & Shanti Stupa.' }
];

interface Props {
  routes?: Waypoint[];
  onSelectedVehicleChange?: (v: VehicleType) => void;
  onActiveWaypointChange?: (waypoint: Waypoint | null) => void;
}

export default function Interactive3DExpedition({ routes, onSelectedVehicleChange, onActiveWaypointChange }: Props) {
  const waypoints = (routes && routes.length > 0) ? routes : DEFAULT_WAYPOINTS;
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('bike');
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100%
  const [simSpeed, setSimSpeed] = useState(1); // 1x, 2x, 5x

  const activeVehicle = VEHICLES_DATA.find(v => v.id === selectedVehicle) || VEHICLES_DATA[0];

  // Calculate current waypoint based on progress
  const currentWaypointIndex = Math.min(
    Math.floor((progress / 100) * waypoints.length),
    waypoints.length - 1
  );
  const currentWaypoint = waypoints[currentWaypointIndex];

  // Notify parent components (e.g. Map) when vehicle or waypoint changes
  useEffect(() => {
    if (onSelectedVehicleChange) onSelectedVehicleChange(selectedVehicle);
  }, [selectedVehicle, onSelectedVehicleChange]);

  useEffect(() => {
    if (onActiveWaypointChange) onActiveWaypointChange(currentWaypoint);
  }, [currentWaypointIndex, onActiveWaypointChange]);

  // Simulation timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsSimulating(false);
            return 100;
          }
          return prev + 0.8 * simSpeed;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isSimulating, simSpeed]);

  const handleVehicleSelect = (type: VehicleType) => {
    setSelectedVehicle(type);
  };

  return (
    <div className="w-full space-y-8 my-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 micro-label mb-3 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            ✨ Interactive 3D Fleet & Route Engine
          </div>
          <h2 className="heading-h1 text-slate-50 tracking-tight">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">3D Ride</span>
          </h2>
          <p className="body-lead text-slate-400 mt-2 max-w-2xl">
            Select your expedition vehicle, customize paint livery, inspect 3D engineering specs, and simulate the high-altitude journey from Palampur to Leh.
          </p>
        </div>

        {/* Quick Vehicle Type Buttons (Min 44px tap target) */}
        <div className="flex items-center gap-2 bg-slate-950/90 p-2 rounded-2xl border border-slate-800 overflow-x-auto shrink-0">
          {VEHICLES_DATA.map((v) => (
            <button
              key={v.id}
              onClick={() => handleVehicleSelect(v.id)}
              className={`px-4 py-2.5 rounded-xl font-bold body-small transition-all flex items-center gap-2.5 whitespace-nowrap touch-target ${
                selectedVehicle === v.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-50 shadow-lg shadow-blue-500/30 scale-105'
                  : 'text-slate-400 hover:text-slate-50 hover:bg-slate-800/80'
              }`}
            >
              <span className="text-lg">{v.icon}</span>
              <span>{v.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3D WebGL Vehicle Canvas Box */}
      <div className="relative h-[550px] w-full">
        <Vehicle3DViewer
          vehicleType={selectedVehicle}
          isDriving={isSimulating}
          driveProgress={progress / 100}
        />
      </div>

      {/* 3D Expedition Travel Simulation Bar */}
      <div className="card-tier-primary p-6 md:p-8 space-y-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Current Waypoint HUD (Left Aligned) */}
          <div className="flex items-center gap-4 w-full md:w-auto text-left">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-2xl text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] shrink-0">
              {activeVehicle.icon}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="micro-label text-emerald-400">Day {currentWaypoint?.day || 1} Waypoint</span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono border border-slate-700">{currentWaypoint?.altitude}</span>
              </div>
              <h3 className="heading-h3 text-slate-50">{currentWaypoint?.locationName}</h3>
              <p className="body-small text-slate-400 line-clamp-1">{currentWaypoint?.description}</p>
            </div>
          </div>

          {/* Simulation Play / Pause / Reset Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={() => {
                if (progress >= 100) setProgress(0);
                setIsSimulating(!isSimulating);
              }}
              className={`px-6 py-3.5 rounded-2xl font-bold body-standard transition-all flex items-center gap-3 shadow-xl touch-target ${
                isSimulating
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'btn-primary-cta'
              }`}
            >
              <span>{isSimulating ? '⏸️ Pause 3D Travel' : progress >= 100 ? '🔄 Restart Expedition' : '🚀 Simulate 3D Route Journey'}</span>
            </button>

            {/* Speed Multiplier (Min 44px tap target) */}
            <button
              onClick={() => setSimSpeed(s => s === 1 ? 2 : s === 2 ? 5 : 1)}
              className="px-4 py-3 rounded-2xl bg-slate-800/80 border border-slate-700 body-small font-mono text-cyan-300 hover:bg-slate-700 transition-all touch-target"
            >
              Speed: {simSpeed}x
            </button>
          </div>
        </div>

        {/* Expedition Progress Slider & Elevation Graph Bar */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between body-small text-slate-400 font-mono">
            <span>📍 Palampur (Start)</span>
            <span className="text-cyan-300 font-bold">{Math.round(progress)}% Journey Completed</span>
            <span>🚩 Leh Ladakh (Finish)</span>
          </div>

          <div className="relative w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_15px_#00d2ff]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Waypoint Dots on Timeline */}
          <div className="grid grid-cols-9 gap-1 pt-2">
            {waypoints.map((wp, idx) => {
              const isPassed = (idx / (waypoints.length - 1)) * 100 <= progress;
              const isCurrent = idx === currentWaypointIndex;
              return (
                <button
                  key={wp.day}
                  onClick={() => {
                    setProgress((idx / (waypoints.length - 1)) * 100);
                  }}
                  className="flex flex-col items-center gap-1.5 group focus:outline-none p-1 touch-target justify-center"
                  aria-label={`Jump to ${wp.locationName}`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full transition-all border ${
                      isCurrent
                        ? 'bg-cyan-400 border-slate-50 scale-125 shadow-[0_0_12px_#00d2ff]'
                        : isPassed
                        ? 'bg-blue-500 border-blue-400'
                        : 'bg-slate-800 border-slate-700 group-hover:bg-slate-700'
                    }`}
                  />
                  <span className={`micro-label hidden sm:block truncate max-w-[70px] ${isCurrent ? 'text-cyan-300 font-bold' : 'text-slate-400'}`}>
                    {wp.locationName.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
