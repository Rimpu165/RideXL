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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)] shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="micro-label text-emerald-400">Dynamic Group Fleet</span>
            <h2 className="heading-h1 text-slate-50 tracking-wide flex flex-wrap items-center gap-3">
              <span>The Squad</span>
              <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
                {count} {count === 1 ? 'Rider' : 'Riders'} Allocated
              </span>
            </h2>
          </div>
        </div>

        {/* Quick Rider Counter Controls (Min 44px tap targets) */}
        {onRiderCountChange && (
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 p-2 rounded-2xl shrink-0">
            <span className="body-small text-slate-400 font-mono pl-2">Riders Count:</span>
            <button
              onClick={() => onRiderCountChange(Math.max(1, count - 1))}
              className="w-11 h-11 rounded-xl bg-slate-800/80 hover:bg-emerald-500/30 hover:border-emerald-400 text-emerald-300 flex items-center justify-center font-bold transition-all border border-slate-700 active:scale-95 touch-target"
              aria-label="Decrease riders count"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="heading-h3 font-black text-slate-50 font-mono px-3">
              {count}
            </span>
            <button
              onClick={() => onRiderCountChange(count + 1)}
              className="w-11 h-11 rounded-xl bg-slate-800/80 hover:bg-emerald-500/30 hover:border-emerald-400 text-emerald-300 flex items-center justify-center font-bold transition-all border border-slate-700 active:scale-95 touch-target"
              aria-label="Increase riders count"
            >
              <Plus className="w-5 h-5" />
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
              whileHover={{ y: -4, scale: 1.01 }}
              className="group relative rounded-3xl overflow-hidden card-tier-secondary p-6 shadow-xl transition-all"
            >
              {/* Top Card Glow Accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10 flex flex-col items-start text-left space-y-4">
                
                {/* Header Row: Avatar & Rider Name/Role */}
                <div className="flex items-center gap-4 w-full">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-400/60 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                      <img 
                        src={avatarUrl} 
                        alt={`Rider ${riderNumber}`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    <span className="absolute -bottom-1 -right-1 bg-emerald-400 text-slate-950 text-[10px] font-black font-mono px-2 py-0.5 rounded-full border border-slate-900 shadow">
                      #{riderNumber}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="heading-h3 text-slate-50">
                      Rider {riderNumber}
                    </h3>
                    <p className="body-small text-emerald-400 font-medium tracking-wide">
                      {assignedRole}
                    </p>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-800" />

                {/* Assigned Vehicle Display */}
                <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 w-full space-y-1 text-left">
                  <span className="micro-label text-slate-400 flex items-center gap-1.5">
                    {isSuvOrTruck ? <Car className="w-4 h-4 text-emerald-400" /> : <Bike className="w-4 h-4 text-cyan-400" />}
                    Assigned Vehicle
                  </span>
                  <p className="body-standard font-bold text-cyan-300">
                    {assignedVehicle}
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 rounded-xl w-full justify-start">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
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
