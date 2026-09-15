'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface GearItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  rating: string;
  essentialLevel: 'Mandatory' | 'Recommended' | 'Pro Tip';
  accentColor: string;
}

const EXPEDITION_GEAR: GearItem[] = [
  {
    id: 'oxygen',
    name: 'Medical Altitude Oxygen Unit',
    category: 'Life Support',
    icon: '🫁',
    description: 'Vital for crossing Tanglang La (5,328m) where atmospheric oxygen drops by 45%. Includes pulse oximeter.',
    rating: 'Critical (5,000m+)',
    essentialLevel: 'Mandatory',
    accentColor: '#00d2ff'
  },
  {
    id: 'satellite',
    name: 'Iridium Satellite SOS Tracker',
    category: 'Navigation & Rescue',
    icon: '📡',
    description: 'Provides 24/7 real-time telemetry and 1-touch emergency SOS beacon active deep inside zero-cell dead zones.',
    rating: 'Global 100% Coverage',
    essentialLevel: 'Mandatory',
    accentColor: '#ff4b2b'
  },
  {
    id: 'thermal',
    name: 'Sub-Zero Electrically Heated Suit',
    category: 'Apparel',
    icon: '🧥',
    description: '12V vehicle-powered heating elements in chest, back, and knees for sub-zero mountain pass night rides.',
    rating: 'Tested to -25°C',
    essentialLevel: 'Mandatory',
    accentColor: '#f7b731'
  },
  {
    id: 'repair',
    name: 'Heavy Duty Trail Repair & Air Pod',
    category: 'Vehicle Maintenance',
    icon: '🛠️',
    description: 'Heavy duty tire plugs, CO2 quick inflators, chain breaker, and high-altitude carb tuning jets.',
    rating: 'Universal Compatibility',
    essentialLevel: 'Recommended',
    accentColor: '#2ed573'
  },
  {
    id: 'light',
    name: '10,000 Lumens Trail Beam Bar',
    category: 'Illumination',
    icon: '🔦',
    description: 'Cuts through thick mountain fog, heavy snowfall, and pitch black unlit high-altitude cliff routes.',
    rating: 'IP69K Waterproof',
    essentialLevel: 'Recommended',
    accentColor: '#a55eea'
  },
  {
    id: 'tent',
    name: '4-Season Alpine Expedition Tent',
    category: 'Shelter',
    icon: '⛺',
    description: 'Geodesic wind-resistant structure capable of standing up against 90 km/h Himalayan winds in Sarchu.',
    rating: 'Extreme Storm Rated',
    essentialLevel: 'Pro Tip',
    accentColor: '#ff7675'
  }
];

export default function ExpeditionGearSection() {
  const [selectedAltitude, setSelectedAltitude] = useState(3500); // 1,470m to 5,328m
  const [activeTab, setActiveTab] = useState<'all' | 'Mandatory' | 'Recommended'>('all');

  // Calculate live telemetry values based on slider altitude
  const temp = Math.round(20 - (selectedAltitude / 1000) * 6.5);
  const oxygenPct = Math.round(100 - (selectedAltitude / 5328) * 45);
  const pressure = Math.round(1013 - (selectedAltitude / 5328) * 500);

  // Dynamic Theme Color Morphing based on Elevation:
  const themeColor = selectedAltitude < 2500 ? '#10b981' : selectedAltitude < 4200 ? '#f59e0b' : '#00d2ff';
  const themeTier = selectedAltitude < 2500 ? 'Warm Valley Tones' : selectedAltitude < 4200 ? 'Challenging Mountain Air' : 'Freezing Sub-Zero Arctic Peak';

  const filteredGear = activeTab === 'all' 
    ? EXPEDITION_GEAR 
    : EXPEDITION_GEAR.filter(g => g.essentialLevel === activeTab);

  return (
    <section id="expedition-hub" className="w-full space-y-16 py-12 scroll-mt-24 transition-colors duration-700">
      
      {/* 1. Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 micro-label shadow-[0_0_20px_rgba(0,210,255,0.2)]">
          <span>🏔️ Himalayan Preparation Hub</span>
        </div>

        <h2 className="heading-display font-black text-slate-50">
          High-Altitude <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">Expedition Readiness</span>
        </h2>

        <p className="body-lead text-slate-400">
          Simulate Himalayan weather extremes and prepare your survival gear before embarking on the Palampur to Leh ride.
        </p>
      </div>

      {/* 2. Interactive High-Altitude Survival Simulator */}
      <div className="card-tier-primary p-6 md:p-10 space-y-8 relative overflow-hidden">
        
        {/* Dynamic Theme Glow Background */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl transition-all duration-700 pointer-events-none opacity-30"
          style={{ backgroundColor: themeColor }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6 text-left">
          <div>
            <span className="micro-label text-cyan-400 flex items-center gap-1.5">
              <span>Interactive Simulator</span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-mono text-slate-300">
                Theme: {themeTier}
              </span>
            </span>
            <h3 className="heading-h2 font-black text-slate-50">Altitude Environmental Conditions</h3>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-white/10">
            <span className="micro-label text-slate-400">Current Peak:</span>
            <span className="text-lg font-black font-mono" style={{ color: themeColor }}>
              {selectedAltitude.toLocaleString()} meters
            </span>
            <span
              className="text-xs px-2.5 py-1 rounded-lg border font-bold font-mono transition-all duration-500"
              style={{
                backgroundColor: `${themeColor}20`,
                borderColor: `${themeColor}60`,
                color: themeColor
              }}
            >
              {selectedAltitude < 2500 ? 'Valley Pass' : selectedAltitude < 4200 ? 'High Pass' : 'Extreme Peak'}
            </span>
          </div>
        </div>

        {/* Altitude Range Slider */}
        <div className="space-y-4">
          <div className="flex justify-between text-xs text-slate-400 font-mono font-bold">
            <span>📍 Palampur (1,470m)</span>
            <span>📍 Manali (2,050m)</span>
            <span>📍 Rohtang Pass (3,978m)</span>
            <span>📍 Baralacha La (4,890m)</span>
            <span className="text-cyan-400">🏁 Tanglang La (5,328m)</span>
          </div>

          <input
            type="range"
            min="1470"
            max="5328"
            step="50"
            value={selectedAltitude}
            onChange={(e) => setSelectedAltitude(Number(e.target.value))}
            className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-white/10 shadow-[0_0_15px_#00d2ff]"
          />
        </div>

        {/* Live Environmental HUD Gauge Cards (Consistently Left Aligned) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          
          {/* Temperature Gauge */}
          <div className="card-tier-secondary p-5 space-y-2 text-left">
            <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>Ambient Temp</span>
              <span>🌡️</span>
            </div>
            <p className={`text-3xl font-black ${temp < 0 ? 'text-cyan-300' : 'text-emerald-400'}`}>
              {temp}°C
            </p>
            <p className="body-small text-slate-300">
              {temp < 0 ? 'Sub-zero freezing frost warning' : 'Moderate valley climate'}
            </p>
          </div>

          {/* Oxygen Gauge */}
          <div className="card-tier-secondary p-5 space-y-2 text-left">
            <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>Oxygen Saturation</span>
              <span>🫁</span>
            </div>
            <p className={`text-3xl font-black ${oxygenPct < 70 ? 'text-amber-400' : 'text-blue-400'}`}>
              {oxygenPct}%
            </p>
            <p className="body-small text-slate-300">
              {oxygenPct < 70 ? 'High risk of AMS altitude sickness' : 'Normal breathing levels'}
            </p>
          </div>

          {/* Barometric Pressure Gauge */}
          <div className="card-tier-secondary p-5 space-y-2 text-left">
            <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>Barometric Pressure</span>
              <span>⏲️</span>
            </div>
            <p className="text-3xl font-black text-purple-300">
              {pressure} hPa
            </p>
            <p className="body-small text-slate-300">
              Low air density; engine power drops by ~20%
            </p>
          </div>

        </div>

      </div>

      {/* 3. Interactive Expedition Gear Checklist */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 text-left">
          <div>
            <h3 className="heading-h1 font-black text-slate-50">Survival Kit & Gear Checklist</h3>
            <p className="body-standard text-slate-400">Interactive equipment inspect cards</p>
          </div>

          {/* Filter Tabs (Touch Targets Min 44px) */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all touch-target min-h-[44px] ${
                activeTab === 'all' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Gear
            </button>
            <button
              onClick={() => setActiveTab('Mandatory')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all touch-target min-h-[44px] ${
                activeTab === 'Mandatory' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mandatory
            </button>
            <button
              onClick={() => setActiveTab('Recommended')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all touch-target min-h-[44px] ${
                activeTab === 'Recommended' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Recommended
            </button>
          </div>
        </div>

        {/* Gear Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGear.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="card-tier-secondary p-6 rounded-3xl transition-all hover:border-cyan-400/50 flex flex-col justify-between text-left space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-center text-3xl shadow-lg">
                    {item.icon}
                  </div>

                  <span className={`micro-label px-3 py-1 rounded-full border ${
                    item.essentialLevel === 'Mandatory'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {item.essentialLevel}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{item.category}</span>
                  <h4 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors">{item.name}</h4>
                </div>

                <p className="text-gray-400 text-xs leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-6 border-t border-white/10 mt-4 flex items-center justify-between text-xs">
                <span className="text-gray-500 font-mono">Rating:</span>
                <span className="font-bold text-cyan-300 font-mono">{item.rating}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
