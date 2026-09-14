'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Login() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Cinematic 3D Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/70 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=2000" 
          alt="Motorcycle in mountains" 
          className="w-full h-full object-cover opacity-60 scale-105"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ perspective: 1000 }}
        className="w-full max-w-md relative z-20"
      >
        <div className="bg-neutral-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl shadow-blue-500/10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-sm">Log in to track your next cinematic journey.</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Email</label>
              <input 
                type="email" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50 transition-all"
                placeholder="rider@squad.com"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Password</label>
              <input 
                type="password" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] transition-all"
            >
              Start Engine
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-400">
            Don't have an account? {' '}
            <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Join the Squad
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
