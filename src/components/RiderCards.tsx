'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Bike, ShieldCheck, Plus, Minus, UserCheck, Car, Truck } from 'lucide-react';

interface RiderCardsProps {
  riderCount: number;
  onRiderCountChange?: (count: number) => void;
}

const VEHICLE_TYPES = [
  'Royal Enfield Himalayan 450',
  'KTM 390 Adventure Rally',
  'BMW G310 GS Adventure',
  'Hero Xpulse 200 4V Rally',
  'Mahindra Thar 4x4 SUV',
  '6x6 Expedition Support Truck'
];

const RIDER_ROLES = [
  'Expedition Leader & Lead Captain',
  'Co-Navigator & Route Scout',
  'Safety & Medical Officer',
  'Mechanical Emergency Specialist',
  'Pillion / Passenger Companion',
  'Support Crew Logistics Member'
];

const RIDER_AVATARS = [
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400'
];

export default function RiderCards({ riderCount, onRiderCountChange }: RiderCardsProps) {
  const count = Math.max(1, riderCount || 1);

  return (
    <div className="w-full space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Dynamic Group Fleet</span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-wide flex items-center gap-3">
              <span>The Squad</span>
              <span className="text-sm font-mono font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
                {count} {count === 1 ? 'Rider' : 'Riders'} Allocated
              </span>
            </h2>
          </div>
        </div>

        {/* Quick Rider Counter Controls */}
        {onRiderCountChange && (
          <div className="flex items-center gap-3 bg-black/60 border border-white/15 p-2 rounded-2xl">
            <span className="text-xs text-gray-400 font-mono pl-2">Riders Count:</span>
            <button
              onClick={() => onRiderCountChange(Math.max(1, count - 1))}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-emerald-500/30 hover:border-emerald-400 text-emerald-300 flex items-center justify-center font-bold transition-all border border-white/10 active:scale-95"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-black text-white font-mono px-2">
              {count}
            </span>
            <button
              onClick={() => onRiderCountChange(count + 1)}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-emerald-500/30 hover:border-emerald-400 text-emerald-300 flex items-center justify-center font-bold transition-all border border-white/10 active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Grid of Dynamic Rider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => {
          const riderNumber = index + 1;
          const assignedVehicle = VEHICLE_TYPES[index % VEHICLE_TYPES.length];
          const assignedRole = RIDER_ROLES[index % RIDER_ROLES.length];
          const avatarUrl = RIDER_AVATARS[index % RIDER_AVATARS.length];
          const isSuvOrTruck = assignedVehicle.includes('SUV') || assignedVehicle.includes('Truck');

          return (
            <motion.div
              key={`rider-${riderNumber}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative rounded-3xl overflow-hidden bg-neutral-900/70 border border-white/10 backdrop-blur-md p-6 shadow-xl transition-all"
            >
              {/* Top Card Glow Accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                
                {/* Avatar Badge */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-400/60 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                    <img 
                      src={avatarUrl} 
                      alt={`Rider ${riderNumber}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-black text-[10px] font-black font-mono px-2 py-0.5 rounded-full border border-black shadow">
                    #{riderNumber}
                  </span>
                </div>

                {/* Rider Name & Role */}
                <div>
                  <h3 className="text-2xl font-black text-white tracking-wide">
                    Rider {riderNumber}
                  </h3>
                  <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mt-0.5">
                    {assignedRole}
                  </p>
                </div>

                <div className="w-full h-px bg-white/10" />

                {/* Assigned Vehicle Display */}
                <div className="bg-black/60 rounded-2xl py-3 px-4 border border-white/10 w-full space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono flex items-center justify-center gap-1">
                    {isSuvOrTruck ? <Car className="w-3.5 h-3.5 text-emerald-400" /> : <Bike className="w-3.5 h-3.5 text-cyan-400" />}
                    Assigned Vehicle
                  </span>
                  <p className="text-sm font-black text-cyan-300">
                    {assignedVehicle}
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl w-full justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Geared & High-Altitude O2 Ready</span>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
