'use client';

import React, { useState } from 'react';
import MapWrapper from './MapWrapper';
import RiderCards from './RiderCards';
import Interactive3DExpedition from './Interactive3DExpedition';
import ExpeditionGearSection from './ExpeditionGearSection';
import CustomRoutePlanner from './CustomRoutePlanner';
import GlobalVehicleSwitcher from './GlobalVehicleSwitcher';
import LiveWeatherWarningBanner from './LiveWeatherWarningBanner';
import AITripPlanner from './AITripPlanner';
import { VehicleType } from './Vehicle3DViewer';

interface RoutePoint {
  day: number;
  locationName: string;
  coordinates: { lat: number; lng: number };
  altitude: string;
  description: string;
}

interface Rider {
  _id: string;
  name: string;
  bike: string;
  avatar: string;
  description: string;
  role: string;
}

interface JourneySectionProps {
  routes: RoutePoint[];
  riders: Rider[];
}

export default function JourneySection({ routes, riders }: JourneySectionProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('bike');
  const [activeWaypoint, setActiveWaypoint] = useState<RoutePoint | null>(null);
  const [riderCount, setRiderCount] = useState<number>(1); // Default 1 Rider

  return (
    <div className="relative z-30 bg-gradient-to-b from-transparent via-slate-950/70 to-black/95 w-full min-h-screen py-20 px-4 sm:px-8 md:px-12 lg:px-20 space-y-24">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* 0. Live Weather Telemetry & Mountain Pass Hazard Warnings */}
        <LiveWeatherWarningBanner />

        {/* 1. Smart AI Trip Planner Assistant */}
        <AITripPlanner
          onApplyPlan={(plan) => {
            setRiderCount(plan.travelers);
            const routeSearchElem = document.getElementById('custom-route-search');
            if (routeSearchElem) routeSearchElem.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 2. Interactive Custom Route Search Engine (Your Location -> Destination & Rider Count) */}
        <CustomRoutePlanner
          riderCount={riderCount}
          onRiderCountChange={(count) => setRiderCount(count)}
        />

        {/* 2. Global Expedition Fleet & Bike Mode Switcher (With Full-Screen 3D Cruising Animation) */}
        <GlobalVehicleSwitcher
          selectedVehicle={selectedVehicle}
          onVehicleChange={(vehicle) => setSelectedVehicle(vehicle)}
        />

        {/* 3. Interactive High-Altitude Preparation & Survival Simulator Hub */}
        <ExpeditionGearSection />

        {/* 4. Interactive 3D Fleet & Route Journey Engine */}
        <Interactive3DExpedition
          routes={routes}
          onSelectedVehicleChange={(vehicle) => setSelectedVehicle(vehicle)}
          onActiveWaypointChange={(wp) => setActiveWaypoint(wp as RoutePoint)}
        />

        {/* 4. Interactive Route Map Section */}
        <div id="route-map" className="space-y-8 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <div className="w-4 h-4 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] animate-pulse" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-wide">Interactive Expedition Map</h2>
                <p className="text-sm text-gray-400">Live 3D vehicle avatar track & mountain pass coordinates</p>
              </div>
            </div>

            {activeWaypoint && (
              <div className="bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-2xl flex items-center gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Active Marker Focus</span>
                  <p className="text-sm font-bold text-white">{activeWaypoint.locationName} ({activeWaypoint.altitude})</p>
                </div>
              </div>
            )}
          </div>
          
          <MapWrapper
            routes={routes}
            selectedVehicle={selectedVehicle}
            activeWaypoint={activeWaypoint}
          />
        </div>

        {/* 5. Dynamic Riders & Crew Cards (Synchronized with Rider Count) */}
        <div id="riders" className="scroll-mt-24">
          <RiderCards
            riderCount={riderCount}
            onRiderCountChange={(count) => setRiderCount(count)}
          />
        </div>

      </div>
    </div>
  );
}
