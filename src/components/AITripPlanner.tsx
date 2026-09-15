'use client';

import React, { useState } from 'react';
import { Sparkles, Bot, ArrowRight, Zap, CheckCircle2, RefreshCw } from 'lucide-react';

interface AITripPlannerProps {
  onApplyPlan?: (plan: {
    origin: string;
    destination: string;
    travelers: number;
    mode: 'mixed' | 'bikes' | 'suv';
  }) => void;
}

const PRESET_PROMPTS = [
  '🏍️ 4 friends on Himalayan bikes for Leh Ladakh in June',
  '🚙 Family of 6 in 4x4 Thar SUV for Spiti Valley off-road',
  '👤 Solo rider on adventure bike to Khardung La Pass',
  '🚚 10 people big convoy to Pangong Tso Lake'
];

export default function AITripPlanner({ onApplyPlan }: AITripPlannerProps) {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    origin: string;
    destination: string;
    travelers: number;
    mode: 'mixed' | 'bikes' | 'suv';
    summary: string;
    recommendedGear: string[];
  } | null>(null);

  const handleAnalyzePrompt = (queryText: string) => {
    const text = queryText || prompt;
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setPrompt(text);

    setTimeout(() => {
      const lower = text.toLowerCase();
      
      // Smart Rule-Based NLP Logic
      let travelers = 2;
      const numberMatch = lower.match(/\b(\d+)\b/);
      if (numberMatch) {
        travelers = parseInt(numberMatch[1], 10);
      } else if (lower.includes('solo')) {
        travelers = 1;
      } else if (lower.includes('duo') || lower.includes('couple')) {
        travelers = 2;
      } else if (lower.includes('family') || lower.includes('squad')) {
        travelers = 4;
      } else if (lower.includes('convoy') || lower.includes('group')) {
        travelers = 8;
      }

      let mode: 'mixed' | 'bikes' | 'suv' = 'mixed';
      if (lower.includes('suv') || lower.includes('thar') || lower.includes('car') || lower.includes('family')) {
        mode = 'suv';
      } else if (lower.includes('bike') || lower.includes('rider') || lower.includes('motorcycle')) {
        mode = 'bikes';
      }

      let destination = 'Leh Ladakh';
      if (lower.includes('spiti')) {
        destination = 'Spiti Valley (Kaza)';
      } else if (lower.includes('khardung')) {
        destination = 'Khardung La Pass';
      } else if (lower.includes('pangong')) {
        destination = 'Pangong Tso Lake';
      } else if (lower.includes('rohtang') || lower.includes('keylong')) {
        destination = 'Rohtang Pass & Keylong';
      }

      const summary = `Suggested ${travelers} ${travelers === 1 ? 'Traveler' : 'Travelers'} expedition to ${destination} using ${
        mode === 'bikes' ? `${travelers}x Adventure Bikes` : mode === 'suv' ? `${Math.ceil(travelers / 4)}x 4x4 SUVs` : 'Mixed Bikes + SUV Fleet'
      } with full high-altitude oxygen support.`;

      const gear = [
        'Gore-Tex Heated Riding Suit',
        'Portable Oxygen Cylinders (2L)',
        'Thermal Base Layer (-15°C Rated)',
        'Satellite SOS Transponder'
      ];

      setAiSuggestion({
        origin: 'Palampur Basecamp',
        destination,
        travelers,
        mode,
        summary,
        recommendedGear: gear
      });

      setIsAnalyzing(false);
    }, 450);
  };

  const handleApplySuggestion = () => {
    if (aiSuggestion && onApplyPlan) {
      onApplyPlan({
        origin: aiSuggestion.origin,
        destination: aiSuggestion.destination,
        travelers: aiSuggestion.travelers,
        mode: aiSuggestion.mode
      });
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-950 via-neutral-900 to-black border border-cyan-500/30 p-6 md:p-8 rounded-3xl shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_#00d2ff]">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase font-mono text-cyan-400 tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
                AI SMART ASSISTANT
              </span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-wide flex items-center gap-2">
              <span>RideXL Smart Trip Assistant</span>
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            </h3>
          </div>
        </div>

        <span className="text-xs text-gray-400 font-mono">
          Type your dream trip in plain Hindi/English!
        </span>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAnalyzePrompt(prompt);
        }}
        className="relative flex items-center"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. 4 log bike pe June mein Leh Ladakh ke liye..."
          className="w-full h-[54px] bg-black/90 border border-white/20 focus:border-cyan-400 text-white rounded-2xl px-5 pr-36 text-sm font-semibold outline-none transition-all shadow-inner placeholder-gray-500"
        />

        <button
          type="submit"
          disabled={isAnalyzing}
          className="absolute right-2 px-5 h-[42px] bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
        >
          {isAnalyzing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Zap className="w-4 h-4 text-amber-300" />
              <span>AI Plan</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Example Prompts */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs text-gray-400 font-mono">Quick Try:</span>
        {PRESET_PROMPTS.map((preset) => (
          <button
            key={preset}
            onClick={() => handleAnalyzePrompt(preset)}
            className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-medium transition-all"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* AI Suggestion Telemetry Result */}
      {aiSuggestion && (
        <div className="bg-cyan-950/30 border border-cyan-500/40 p-5 rounded-2xl space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-black text-white uppercase tracking-wider font-mono">
                AI Expedition Match Generated
              </span>
            </div>
            
            <button
              onClick={handleApplySuggestion}
              className="px-4 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-300 text-xs font-black transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Apply to Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-sm text-cyan-200 font-medium leading-relaxed">
            {aiSuggestion.summary}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-gray-400 font-mono">AI Gear Pack:</span>
            {aiSuggestion.recommendedGear.map((item) => (
              <span
                key={item}
                className="text-[10px] bg-black/60 border border-white/10 text-cyan-300 px-2.5 py-1 rounded-full font-mono"
              >
                🛡️ {item}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
