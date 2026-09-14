import JourneySection from '@/components/JourneySection';
import FourDimensionAtmosphere from '@/components/FourDimensionAtmosphere';

export const dynamic = 'force-dynamic';

async function getRiders() {
  try {
    const res = await fetch('http://localhost:5000/api/riders', { cache: 'no-store' });
    return res.json();
  } catch (e) {
    console.error("Failed to fetch riders", e);
    return [];
  }
}

async function getRoutes() {
  try {
    const res = await fetch('http://localhost:5000/api/routes', { cache: 'no-store' });
    return res.json();
  } catch (e) {
    console.error("Failed to fetch routes", e);
    return [];
  }
}

export default async function Home() {
  const riders = await getRiders();
  const routes = await getRoutes();

  return (
    <main className="min-h-screen bg-black overflow-hidden relative font-sans">
      {/* Full-Bleed 100vw x 100vh 4D Atmospheric Environment Background */}
      <FourDimensionAtmosphere />

      {/* Hero Section */}
      <div className="relative h-screen w-full flex flex-col items-center justify-center px-4 overflow-hidden z-10">
        {/* Foreground Content */}
        <div className="relative z-20 text-center flex flex-col items-center max-w-4xl px-4 pointer-events-auto">
          <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 mb-6 drop-shadow-[0_10px_40px_rgba(0,210,255,0.5)]">
            RideXl
          </h1>

          <p className="text-xl md:text-3xl text-gray-100 font-light tracking-wide max-w-3xl drop-shadow-lg mb-8">
            The Ultimate Palampur to Leh Himalayan Expedition.
          </p>

          {/* Action CTA Button */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a 
              href="#route-map"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 hover:from-blue-400 hover:to-emerald-400 text-white font-black text-sm uppercase tracking-wider transition-all transform hover:scale-105 shadow-2xl shadow-cyan-500/40 flex items-center gap-3 border border-white/20"
            >
              <span>Explore 3D Mountain Fleet & Route</span>
              <span className="text-lg">↓</span>
            </a>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center opacity-80 pointer-events-none text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] mb-2 text-cyan-300 font-semibold drop-shadow-md">
            Scroll to Explore
          </span>
          <div className="w-6 h-10 border-2 border-cyan-400/50 rounded-full flex justify-center p-1 backdrop-blur-sm shadow-[0_0_15px_#00d2ff]">
            <div className="w-1.5 h-2.5 bg-cyan-400 rounded-full animate-bounce shadow-[0_0_10px_#00d2ff]" />
          </div>
        </div>
      </div>

      {/* Main Interactive 3D Journey, Expedition Hub & Map Section */}
      <JourneySection routes={routes} riders={riders} />
    </main>
  );
}
