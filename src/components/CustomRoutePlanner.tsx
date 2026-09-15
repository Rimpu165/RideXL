'use client';

import React, { useState } from 'react';
import { Search, MapPin, Navigation, Compass, ArrowRight, ShieldCheck, Users, Plus, Minus, Truck, Car, Bike, HeartPulse, Sparkles, CircleDollarSign, Flame } from 'lucide-react';

interface RoutePlanResult {
  originName: string;
  destinationName: string;
  distanceKm: number;
  estimatedDays: string;
  maxAltitudeMeters: number;
  maxAltitudePass: string;
  terrainDifficulty: 'Moderate' | 'Challenging' | 'Extreme Off-Road';
  recommendedVehicle: string;
  oxygenAdvisory: boolean;
  waypoints: string[];
  riderCount: number;
  bikeCount: number;
  suvCount: number;
  supportTruckRequired: boolean;
  oxygenCylinders: number;
  fleetBreakdown: string;
  totalGroupCost: number;
  estimatedBudgetPerPerson: string;
}

const POPULAR_DESTINATIONS = [
  { name: 'Leh Ladakh', maxAlt: 3500, dist: 474, pass: 'Tanglang La (5,328m)' },
  { name: 'Khardung La Pass', maxAlt: 5359, dist: 512, pass: 'Khardung La Top (5,359m)' },
  { name: 'Pangong Tso Lake', maxAlt: 4225, dist: 630, pass: 'Chang La (5,360m)' },
  { name: 'Spiti Valley (Kaza)', maxAlt: 3800, dist: 410, pass: 'Kunzum Pass (4,590m)' },
  { name: 'Rohtang Pass & Keylong', maxAlt: 3978, dist: 240, pass: 'Atal Tunnel / Rohtang' },
  { name: 'Nubra Valley & Hunder', maxAlt: 3048, dist: 590, pass: 'Khardung Pass' }
];

interface CustomRoutePlannerProps {
  riderCount?: number;
  onRiderCountChange?: (count: number) => void;
  onRouteSearched?: (origin: string, destination: string, result: RoutePlanResult) => void;
}

export default function CustomRoutePlanner({ riderCount: propRiderCount, onRiderCountChange, onRouteSearched }: CustomRoutePlannerProps) {
  const [origin, setOrigin] = useState('Palampur, Himachal Pradesh');
  const [destination, setDestination] = useState('Leh Ladakh');
  const [internalRiderCount, setInternalRiderCount] = useState(1); // Default 1 person
  
  const riderCount = propRiderCount !== undefined ? propRiderCount : internalRiderCount;
  const setRiderCount = (count: number | ((prev: number) => number)) => {
    const nextCount = typeof count === 'function' ? count(riderCount) : count;
    setInternalRiderCount(nextCount);
    if (onRiderCountChange) {
      onRiderCountChange(nextCount);
    }
  };

  const [travelMode, setTravelMode] = useState<'mixed' | 'bikes' | 'suv'>('mixed');
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateTelemetry = (orig: string, dest: string, count: number, mode: 'mixed' | 'bikes' | 'suv') => {
    const matched = POPULAR_DESTINATIONS.find(d => 
      dest.toLowerCase().includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(dest.toLowerCase())
    );

    const maxAlt = matched ? matched.maxAlt : 3800 + Math.floor(Math.random() * 1200);
    const dist = matched ? matched.dist : 320 + Math.floor(Math.random() * 300);
    const passName = matched ? matched.pass : 'High Mountain Pass';

    let bikes = 0;
    let suvs = 0;
    let supportTruck = false;

    if (mode === 'bikes') {
      bikes = count;
      suvs = 0;
      supportTruck = count >= 4;
    } else if (mode === 'suv') {
      bikes = 0;
      suvs = Math.ceil(count / 4);
      supportTruck = count >= 8;
    } else {
      if (count === 1) {
        bikes = 1;
        suvs = 0;
      } else if (count <= 3) {
        bikes = count;
        suvs = 0;
      } else if (count <= 6) {
        bikes = Math.ceil(count / 2);
        suvs = 1;
        supportTruck = true;
      } else {
        bikes = Math.ceil(count * 0.6);
        suvs = Math.ceil(count * 0.4 / 4);
        supportTruck = true;
      }
    }

    const oxygenCount = Math.max(2, Math.ceil(count * 1.5));
    const baseRatePerPerson = Math.round(18000 + dist * 9);
    const discountMultiplier = count > 5 ? 0.88 : count > 2 ? 0.94 : 1.0;
    const perPersonPrice = Math.round(baseRatePerPerson * discountMultiplier);
    const totalGroupPrice = perPersonPrice * count;

    let fleetDesc = '';
    if (bikes > 0 && suvs > 0) {
      fleetDesc = `${bikes}x Himalayan Bikes + ${suvs}x Thar 4x4 SUV`;
    } else if (bikes > 0) {
      fleetDesc = `${bikes}x Royal Enfield Himalayan 450 Bikes`;
    } else {
      fleetDesc = `${suvs}x Mahindra Thar 4x4 Off-Road SUVs`;
    }

    if (supportTruck) {
      fleetDesc += ' + 1x 6x6 Support Truck';
    }

    return {
      originName: orig,
      destinationName: dest,
      distanceKm: dist,
      estimatedDays: `${Math.ceil(dist / 65)} - ${Math.ceil(dist / 50)} Days Expedition`,
      maxAltitudeMeters: maxAlt,
      maxAltitudePass: passName,
      terrainDifficulty: maxAlt > 4000 ? ('Extreme Off-Road' as const) : ('Challenging' as const),
      recommendedVehicle: maxAlt > 4500 ? '4x4 Off-Road SUV / Overland Truck' : 'Himalayan Adventure 450',
      oxygenAdvisory: maxAlt > 3500,
      waypoints: [orig, 'Midway Basecamp', passName, dest],
      riderCount: count,
      bikeCount: bikes,
      suvCount: suvs,
      supportTruckRequired: supportTruck,
      oxygenCylinders: oxygenCount,
      fleetBreakdown: fleetDesc,
      totalGroupCost: totalGroupPrice,
      estimatedBudgetPerPerson: `₹${perPersonPrice.toLocaleString('en-IN')} / person (Incl. Fuel, Gear & Permits)`
    };
  };

  const [planResult, setPlanResult] = useState<RoutePlanResult>(() => 
    calculateTelemetry('Palampur, Himachal Pradesh', 'Leh Ladakh', 1, 'mixed')
  );

  const handleSearchRoute = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!origin || !destination) return;

    setIsCalculating(true);

    setTimeout(() => {
      const result = calculateTelemetry(origin, destination, riderCount, travelMode);
      setPlanResult(result);
      setIsCalculating(false);

      if (onRouteSearched) {
        onRouteSearched(origin, destination, result);
      }
    }, 350);
  };

  const handleDetectGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setOrigin(`Detected GPS (${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°)`);
        },
        () => {
          setOrigin('Palampur Basecamp');
        }
      );
    }
  };

  return (
    <div className="w-full space-y-8 my-12 scroll-mt-24" id="custom-route-search">
      
      {/* Search Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 micro-label shadow-[0_0_15px_rgba(0,210,255,0.2)]">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Custom Himalayan Route & Traveler Fleet Calculator</span>
          </div>
          <h2 className="heading-h1 font-black text-white">
            Search Route & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">Kitne Log Ja Rahe Hain?</span>
          </h2>
          <p className="body-standard text-slate-400 max-w-3xl leading-relaxed">
            Select your starting location, destination, and exact traveler count to dynamically calculate 3D fleet requirements, fuel budget, and emergency oxygen support.
          </p>
        </div>

        {/* Dynamic Vehicle Scarcity Indicator */}
        <div className="bg-rose-500/10 border border-rose-500/30 px-4 py-2.5 rounded-2xl flex items-center gap-3 shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.2)] animate-pulse">
          <Flame className="w-5 h-5 text-rose-400 shrink-0" />
          <div className="text-left">
            <span className="micro-label text-rose-400 block -mb-0.5">High Demand Expedition</span>
            <span className="text-xs font-bold text-slate-100 font-mono">
              🔥 Only 2 Thar SUVs & 3 Bikes Left for Batch!
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Search Box Container */}
      <div className="card-tier-primary p-6 md:p-8 space-y-6">
        
        <form onSubmit={handleSearchRoute} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-end">
          
          {/* 1. Pickup / Origin Input */}
          <div className="lg:col-span-3 space-y-2">
            <label className="micro-label text-cyan-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Starting Location (Pickup)
              </span>
              <button
                type="button"
                onClick={handleDetectGPS}
                className="text-[11px] text-cyan-300 hover:text-cyan-200 font-semibold underline flex items-center gap-1 touch-target min-h-[32px]"
              >
                📍 GPS
              </button>
            </label>
            <div className="relative">
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g. Palampur, Delhi, Manali"
                className="w-full h-[52px] bg-slate-950/90 border border-white/20 focus:border-cyan-400 text-slate-50 rounded-2xl px-4 pl-11 text-sm font-semibold outline-none transition-all shadow-inner placeholder-slate-500"
              />
              <MapPin className="w-5 h-5 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* 2. Destination Input */}
          <div className="lg:col-span-3 space-y-2">
            <label className="micro-label text-emerald-400 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-emerald-400" />
              Where Do You Want To Go?
            </label>
            <div className="relative">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Leh Ladakh, Spiti Valley"
                className="w-full h-[52px] bg-slate-950/90 border border-white/20 focus:border-emerald-400 text-slate-50 rounded-2xl px-4 pl-11 text-sm font-semibold outline-none transition-all shadow-inner placeholder-slate-500"
              />
              <Navigation className="w-5 h-5 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* 3. Number of People / Kitne Log Counter */}
          <div className="lg:col-span-3 space-y-2">
            <label className="micro-label text-amber-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                Kitne Log Ja Rahe Hain?
              </span>
              <span className="text-[11px] text-amber-300 font-mono font-bold bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40">
                {riderCount} {riderCount === 1 ? 'PERSON' : 'PEOPLE'}
              </span>
            </label>
            
            <div className="h-[52px] flex items-center justify-between bg-slate-950/90 border border-amber-500/40 rounded-2xl p-1.5 px-3 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <button
                type="button"
                onClick={() => setRiderCount(Math.max(1, riderCount - 1))}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-amber-500/30 hover:border-amber-400 text-amber-300 flex items-center justify-center font-black transition-all border border-white/10 active:scale-95 touch-target"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="text-center px-3">
                <span className="text-base font-black text-slate-50 font-mono block leading-tight">
                  {riderCount}
                </span>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-tight block -mt-0.5 whitespace-nowrap">
                  {riderCount === 1 ? 'SOLO TRAVELER' : riderCount <= 3 ? 'SMALL SQUAD' : riderCount <= 7 ? 'CONVOY SQUAD' : 'BIG FLEET GROUP'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setRiderCount(riderCount + 1)}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-amber-500/30 hover:border-amber-400 text-amber-300 flex items-center justify-center font-black transition-all border border-white/10 active:scale-95 touch-target"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 4. Search CTA Button (Primary CTA Token) */}
          <div className="lg:col-span-3">
            <button
              type="submit"
              disabled={isCalculating}
              className="w-full btn-primary-cta flex items-center justify-center gap-2 touch-target"
            >
              {isCalculating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Calculate Expedition</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* Popular Himalayan Route Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1 mr-1">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            Popular Routes:
          </span>
          {POPULAR_DESTINATIONS.map((dest) => (
            <button
              key={dest.name}
              onClick={() => {
                setDestination(dest.name);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all touch-target min-h-[36px] ${
                destination.toLowerCase().includes(dest.name.toLowerCase())
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.3)] font-bold'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              📍 {dest.name}
            </button>
          ))}
        </div>

        {/* Preset Group Controls & Vehicle Modes Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-3 border-t border-white/10">
          
          {/* Row A: Quick Group Presets */}
          <div className="flex flex-wrap items-center gap-2.5 bg-slate-950/60 border border-white/10 p-3 rounded-2xl">
            <span className="text-xs font-bold text-amber-300 font-mono flex items-center gap-1.5 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Group Size Presets:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: '👤 1 Solo', count: 1 },
                { label: '👥 2 Duo', count: 2 },
                { label: '🏍️ 4 Squad', count: 4 },
                { label: '🚘 6 Group', count: 6 },
                { label: '🚚 10+ Big Convoy', count: 10 }
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setRiderCount(preset.count)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all touch-target min-h-[36px] ${
                    riderCount === preset.count
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.35)] scale-105'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row B: Vehicle Combination Preference */}
          <div className="flex flex-wrap items-center gap-2.5 bg-slate-950/60 border border-white/10 p-3 rounded-2xl">
            <span className="text-xs font-bold text-cyan-300 font-mono shrink-0">
              🚘 Vehicle Mode:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setTravelMode('mixed')}
                className={`px-3 py-1.5 rounded-xl border text-xs transition-all touch-target min-h-[36px] ${
                  travelMode === 'mixed'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-bold shadow-[0_0_10px_rgba(0,210,255,0.3)]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                🔄 Mixed (Bikes + SUV)
              </button>
              <button
                onClick={() => setTravelMode('bikes')}
                className={`px-3 py-1.5 rounded-xl border text-xs transition-all touch-target min-h-[36px] ${
                  travelMode === 'bikes'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-bold shadow-[0_0_10px_rgba(0,210,255,0.3)]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                🏍️ All Bikes
              </button>
              <button
                onClick={() => setTravelMode('suv')}
                className={`px-3 py-1.5 rounded-xl border text-xs transition-all touch-target min-h-[36px] ${
                  travelMode === 'suv'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-bold shadow-[0_0_10px_rgba(0,210,255,0.3)]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                🚘 All 4x4 SUVs
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Search Route Calculation Result Telemetry Display */}
      {planResult && (
        <div className="card-tier-primary p-6 md:p-8 space-y-6 animate-fadeIn">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_#00d2ff] shrink-0">
                <Compass className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="micro-label text-cyan-400">Calculated Expedition Telemetry</span>
                <h3 className="heading-h2 font-black text-slate-50 flex items-center gap-2 flex-wrap">
                  <span>{planResult.originName}</span>
                  <ArrowRight className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span className="text-emerald-400">{planResult.destinationName}</span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                <Users className="w-4 h-4 text-amber-400" />
                <div className="text-left">
                  <span className="text-[10px] uppercase font-mono text-amber-400 block -mb-1">Active Group</span>
                  <span className="text-sm font-black text-amber-300 font-mono">
                    {planResult.riderCount} {planResult.riderCount === 1 ? 'Traveler' : 'Travelers'}
                  </span>
                </div>
              </div>
              <a
                href="#route-map"
                className="px-4 py-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold hover:bg-cyan-500/30 transition-all text-center touch-target min-h-[44px]"
              >
                📍 Track on Map ↓
              </a>
            </div>
          </div>

          {/* Key Stats Telemetry Grid (Consistently Left Aligned) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="card-tier-secondary p-4 space-y-1 text-left">
              <span className="micro-label text-slate-400">Total Distance</span>
              <p className="text-2xl font-black text-slate-50 flex items-center gap-1.5">
                🛣️ {planResult.distanceKm} <span className="text-xs font-normal text-slate-400">km</span>
              </p>
            </div>

            <div className="card-tier-secondary p-4 space-y-1 text-left">
              <span className="micro-label text-slate-400">Expedition Duration</span>
              <p className="text-2xl font-black text-cyan-300 flex items-center gap-1.5">
                ⏱️ {planResult.estimatedDays}
              </p>
            </div>

            <div className="card-tier-secondary p-4 space-y-1 text-left">
              <span className="micro-label text-slate-400">Highest Mountain Pass</span>
              <p className="text-2xl font-black text-emerald-400 flex items-center gap-1.5">
                🏔️ {planResult.maxAltitudeMeters}m
              </p>
              <p className="text-[11px] text-slate-300 truncate">{planResult.maxAltitudePass}</p>
            </div>

            <div className="card-tier-secondary p-4 space-y-1 text-left border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <span className="micro-label text-amber-400 flex items-center gap-1">
                <CircleDollarSign className="w-3.5 h-3.5 text-amber-400" /> Per Person Estimated Cost
              </span>
              <p className="text-lg font-black text-amber-300">
                {planResult.estimatedBudgetPerPerson}
              </p>
              <span className="text-[10px] text-slate-400 block font-mono">
                Total Group: ₹{planResult.totalGroupCost.toLocaleString('en-IN')}
              </span>
            </div>

          </div>

          {/* Interactive Fleet & Support Breakdown Cards Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            
            {/* Card 1: Vehicles Allocated */}
            <div className="card-tier-secondary p-4 space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="micro-label text-cyan-400 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-cyan-400" /> Allocated Group Fleet
                </span>
                <span className="text-[11px] bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-full font-mono font-bold">
                  {planResult.riderCount} {planResult.riderCount === 1 ? 'Traveler' : 'Travelers'}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-50 leading-snug">{planResult.fleetBreakdown}</p>
              
              <div className="flex items-center gap-3 pt-1 text-xs text-slate-300 font-mono">
                {planResult.bikeCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Bike className="w-3.5 h-3.5 text-cyan-400" /> {planResult.bikeCount} Bikes
                  </span>
                )}
                {planResult.suvCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-emerald-400" /> {planResult.suvCount} Thar SUVs
                  </span>
                )}
                {planResult.supportTruckRequired && (
                  <span className="flex items-center gap-1 text-amber-400">
                    🚚 1x 6x6 Support
                  </span>
                )}
              </div>
            </div>

            {/* Card 2: Emergency Oxygen Tanks */}
            <div className="card-tier-secondary p-4 space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="micro-label text-emerald-400 flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-emerald-400" /> Medical & Altitude Safety
                </span>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-mono font-bold">
                  {planResult.oxygenCylinders} Cylinders
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {planResult.oxygenAdvisory 
                  ? `High Altitude Advisory active for ${planResult.maxAltitudePass}. Includes ${planResult.oxygenCylinders}x O2 canisters & pulse oximeters.` 
                  : 'Standard medical kit and basic oxygen backup included.'}
              </p>
            </div>

            {/* Card 3: Logistics & Crew */}
            <div className="card-tier-secondary p-4 space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="micro-label text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Crew & Logistics Support
                </span>
                <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-mono font-bold">
                  Certified Crew
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {planResult.supportTruckRequired 
                  ? 'Includes Lead Road Captain, Mechanic Crew, Spare Parts Truck, and Satellite SOS Transponder.' 
                  : 'Includes Lead Expedition Guide & Mechanical Emergency Support.'}
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}


