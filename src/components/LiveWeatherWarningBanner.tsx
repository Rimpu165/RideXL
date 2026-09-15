'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, CloudSnow, Wind, ThermometerSnowflake, ShieldAlert, Radio } from 'lucide-react';

interface WeatherAlert {
  id: string;
  passName: string;
  altitude: string;
  temperature: string;
  condition: string;
  severity: 'high' | 'medium' | 'info';
  warningText: string;
  roadStatus: 'Clear' | 'Challenging' | 'Restricted / Convoy Only';
}

const LIVE_PASS_ALERTS: WeatherAlert[] = [
  {
    id: 'tanglangla',
    passName: 'Tanglang La Pass',
    altitude: '5,328m',
    temperature: '-8°C',
    condition: 'Fresh Snowfall & Black Ice',
    severity: 'high',
    warningText: 'Black ice detected on northern descent. Tire chains or 4WD required beyond Sarchu Basecamp.',
    roadStatus: 'Restricted / Convoy Only'
  },
  {
    id: 'khardungla',
    passName: 'Khardung La Pass',
    altitude: '5,359m',
    temperature: '-12°C',
    condition: 'Sub-Zero Freeze & High Altitude Wind',
    severity: 'high',
    warningText: 'High Altitude Sickness (AMS) advisory active. Maximum recommended stay at summit is 15-20 minutes. Keep O2 canisters ready.',
    roadStatus: 'Challenging'
  },
  {
    id: 'rohtang',
    passName: 'Rohtang Pass & Atal Tunnel',
    altitude: '3,978m',
    temperature: '2°C',
    condition: 'Monsoon Mist & Mud Slips',
    severity: 'medium',
    warningText: 'Dense fog and slippery mud tracks near Keylong junction. Maintain 30 km/h speed limit.',
    roadStatus: 'Clear'
  }
];

export default function LiveWeatherWarningBanner() {
  const [activeAlertIndex, setActiveAlertIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAlertIndex((prev) => (prev + 1) % LIVE_PASS_ALERTS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentAlert = LIVE_PASS_ALERTS[activeAlertIndex];

  return (
    <div className="w-full relative overflow-hidden bg-gradient-to-r from-rose-950/70 via-black to-slate-950 border border-rose-500/40 p-4 md:p-5 rounded-3xl shadow-2xl space-y-3">
      
      {/* Dynamic Background Red Glow Effect */}
      <div className="absolute top-0 right-0 w-64 h-full bg-rose-500/10 blur-3xl pointer-events-none" />

      {/* Top Banner Control Line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-500/20 pb-3">
        
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.4)]">
            <Radio className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-rose-400 font-mono bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/30">
              LIVE HIMALAYAN TELEMETRY & WEATHER SAFETY
            </span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          </div>
        </div>

        {/* Pass Switcher Chips */}
        <div className="flex items-center gap-1.5">
          {LIVE_PASS_ALERTS.map((alert, idx) => (
            <button
              key={alert.id}
              onClick={() => setActiveAlertIndex(idx)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                activeAlertIndex === idx
                  ? 'bg-rose-500/30 text-rose-300 border border-rose-500/60 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {alert.passName.split(' ')[0]}
            </button>
          ))}
        </div>

      </div>

      {/* Main Alert Info Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Pass Name & Temperature */}
        <div className="md:col-span-4 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-black text-white">{currentAlert.passName}</h4>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
              {currentAlert.altitude}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-300 font-mono">
            <span className="flex items-center gap-1 text-cyan-300">
              <ThermometerSnowflake className="w-3.5 h-3.5" /> Temp: {currentAlert.temperature}
            </span>
            <span className="flex items-center gap-1 text-amber-300">
              <CloudSnow className="w-3.5 h-3.5" /> {currentAlert.condition}
            </span>
          </div>
        </div>

        {/* Warning Body Text */}
        <div className="md:col-span-5 flex items-start gap-2.5 bg-black/60 p-3 rounded-2xl border border-rose-500/20">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-200 leading-snug">
            {currentAlert.warningText}
          </p>
        </div>

        {/* Status Badge */}
        <div className="md:col-span-3 flex md:justify-end">
          <div className="bg-rose-500/10 border border-rose-500/40 px-3.5 py-2 rounded-2xl flex items-center gap-2 w-full md:w-auto justify-center">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <div>
              <span className="text-[9px] text-gray-400 uppercase font-mono block -mb-0.5">Pass Status</span>
              <span className="text-xs font-black text-rose-300 font-mono">
                {currentAlert.roadStatus}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
