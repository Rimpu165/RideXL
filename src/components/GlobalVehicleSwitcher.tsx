'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VehicleType, VEHICLES_DATA } from './Vehicle3DViewer';
import { Zap, ShieldCheck, Gauge, Compass, Sparkles, Navigation, Flame } from 'lucide-react';

interface GlobalVehicleSwitcherProps {
  selectedVehicle: VehicleType;
  onVehicleChange: (vehicle: VehicleType) => void;
}

export default function GlobalVehicleSwitcher({
  selectedVehicle,
  onVehicleChange
}: GlobalVehicleSwitcherProps) {
  const [isCruisingAnimationActive, setIsCruisingAnimationActive] = useState(false);
  const [activeCruisingVehicle, setActiveCruisingVehicle] = useState<VehicleType>(selectedVehicle);

  const handleSelectVehicle = (vType: VehicleType) => {
    if (vType === selectedVehicle && !isCruisingAnimationActive) {
      // Re-trigger animation on click
      setActiveCruisingVehicle(vType);
      setIsCruisingAnimationActive(true);
      return;
    }

    setActiveCruisingVehicle(vType);
    setIsCruisingAnimationActive(true);
    onVehicleChange(vType);
  };

  useEffect(() => {
    if (isCruisingAnimationActive) {
      const timer = setTimeout(() => {
        setIsCruisingAnimationActive(false);
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [isCruisingAnimationActive]);

  const activeVehicleData = VEHICLES_DATA.find(v => v.id === selectedVehicle) || VEHICLES_DATA[0];

  return (
    <div className="w-full space-y-6 my-10 scroll-mt-24" id="global-vehicle-selector">
      
      {/* FULL-SCREEN 3D CRUISING VEHICLE OVERLAY ANIMATION */}
      <AnimatePresence>
        {isCruisingAnimationActive && (
          <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden flex items-center justify-center">
            
            {/* Background Speed Lines & Neon Vignette Pulse */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-r from-blue-950/40 via-cyan-950/60 to-emerald-950/40 backdrop-blur-[2px]"
            >
              {/* Dynamic Speed Lines */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#00d2ff_1px,transparent_1px)] [background-size:24px_24px] animate-pulse" />
            </motion.div>

            {/* Top Announcement Banner */}
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute top-12 z-50 bg-black/90 border-2 border-cyan-400 p-4 px-8 rounded-3xl shadow-[0_0_50px_rgba(0,210,255,0.6)] flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-2xl animate-bounce">
                {activeVehicleData.icon}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400 font-mono block">
                  ⚡ WEBSITE-WIDE VEHICLE MODE ENGAGED
                </span>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-wide flex items-center gap-2">
                  <span>{activeVehicleData.name}</span>
                  <span className="text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-400/40">
                    CRUISING ACTIVE
                  </span>
                </h3>
              </div>
            </motion.div>

            {/* CRUISING VEHICLE RIDING ACROSS THE SCREEN FROM LEFT TO RIGHT */}
            <motion.div
              initial={{ x: '-120vw', y: '10vh', rotate: -3 }}
              animate={{ 
                x: '120vw', 
                y: ['10vh', '-5vh', '15vh', '0vh'],
                rotate: [ -3, 2, -2, 0 ]
              }}
              transition={{ 
                duration: 2.2,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              className="absolute z-50 flex items-center gap-4"
            >
              {/* Particle Smoke & Headlight Glow Effect */}
              <div className="relative flex items-center">
                {/* Tire Smoke / Particle Jet Trail */}
                <div className="w-48 h-16 bg-gradient-to-r from-transparent via-cyan-500/40 to-blue-500/80 rounded-full blur-xl animate-pulse -mr-10" />

                {/* Main 3D Vehicle Icon Avatar Container */}
                <div className="relative w-36 h-36 md:w-48 md:h-48 rounded-3xl bg-black/90 border-2 border-cyan-400 flex items-center justify-center text-6xl md:text-7xl shadow-[0_0_60px_#00d2ff] backdrop-blur-md">
                  <span className="animate-pulse">{activeVehicleData.icon}</span>
                  
                  {/* Wheel Dust Particles */}
                  <div className="absolute -bottom-2 -left-4 w-6 h-6 bg-cyan-300 rounded-full blur-sm animate-ping" />
                  <div className="absolute -bottom-2 -right-4 w-6 h-6 bg-emerald-400 rounded-full blur-sm animate-ping" />
                </div>

                {/* Headlight Beam Effect */}
                <div className="w-80 h-32 bg-gradient-to-r from-cyan-400/50 via-cyan-300/20 to-transparent clip-path-cone blur-lg -ml-4" />
              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* Selector Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6 text-left">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 micro-label shadow-[0_0_15px_rgba(0,210,255,0.2)]">
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Global Expedition Fleet & Bike Mode Switcher</span>
          </div>
          <h2 className="heading-h1 font-black text-slate-50">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">Website Ride & 3D Cruising Effect</span>
          </h2>
          <p className="body-standard text-slate-400 max-w-2xl leading-relaxed">
            Switching your bike or vehicle updates the 3D model canvas, interactive map avatar, and triggers full-screen website cruising animation!
          </p>
        </div>

        <button
          onClick={() => handleSelectVehicle(selectedVehicle)}
          className="btn-secondary-quiet px-4 py-2.5 touch-target flex items-center gap-2 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20"
        >
          <Flame className="w-4 h-4 text-cyan-400 animate-bounce" />
          <span>Trigger 3D Cruising Animation</span>
        </button>
      </div>

      {/* Grid of 4 Vehicles to Choose & Switch */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {VEHICLES_DATA.map((v) => {
          const isSelected = v.id === selectedVehicle;

          return (
            <motion.div
              key={v.id}
              onClick={() => handleSelectVehicle(v.id)}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`cursor-pointer relative rounded-3xl p-6 transition-all duration-300 border flex flex-col justify-between space-y-4 text-left ${
                isSelected
                  ? 'card-tier-primary border-cyan-400 shadow-[0_0_30px_rgba(0,210,255,0.3)] ring-2 ring-cyan-400/50'
                  : 'card-tier-secondary hover:border-cyan-500/40'
              }`}
            >
              {/* Active Glow Badge */}
              {isSelected && (
                <div className="absolute -top-3 right-4 bg-cyan-400 text-black font-black micro-label px-3 py-1 rounded-full shadow-[0_0_10px_#00d2ff] font-mono">
                  ACTIVE RIDE
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-4xl p-3 bg-slate-950/80 rounded-2xl border border-white/10 shadow-inner">
                    {v.icon}
                  </span>
                  <span className="micro-label text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/30">
                    {v.category}
                  </span>
                </div>

                <div>
                  <h3 className="heading-h3 font-black text-slate-50 leading-tight">
                    {v.name}
                  </h3>
                  <p className="body-small text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-cyan-400" /> Max Speed:
                  </span>
                  <span className="font-bold text-slate-50">{v.stats.speed}</span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-emerald-400" /> Altitude Pass:
                  </span>
                  <span className="font-bold text-emerald-300">{v.stats.altitudeRating.split(' ')[0]}</span>
                </div>

                <button
                  className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all mt-2 flex items-center justify-center gap-2 touch-target min-h-[44px] ${
                    isSelected
                      ? 'btn-primary-cta'
                      : 'btn-secondary-quiet'
                  }`}
                >
                  {isSelected ? '🏎️ Currently Selected' : '⚡ Switch to this Ride'}
                </button>
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
