'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Selection of ultra-HD authentic Himalayan mountain passes
const MOUNTAIN_PRESETS = [
  {
    id: 'leh-pass',
    name: 'Ladakh High Pass',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-over-mountains-41544-large.mp4',
    poster: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000',
    location: 'Taglang La (5,328m)'
  },
  {
    id: 'rohtang-valley',
    name: 'Rohtang Alpine Valley',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-snow-capped-mountains-41543-large.mp4',
    poster: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80&w=2000',
    location: 'Rohtang Pass (3,978m)'
  },
  {
    id: 'spiti-ridge',
    name: 'High Himalayan Ridge',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-mountains-covered-in-snow-under-a-clear-blue-sky-41542-large.mp4',
    poster: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000',
    location: 'Keylong Lahaul (3,080m)'
  }
];

export default function RealMountainHero() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const activePreset = MOUNTAIN_PRESETS[activePresetIndex];

  // Three.js interactive 3D particle mist & atmospheric depth layer over real video
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Floating 3D Mountain Mist & Snow Particles
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const opacities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      opacities[i] = Math.random() * 0.7 + 0.3;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xe0f7fc,
      size: 0.35,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Mouse Parallax Effect on 3D Layer
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', onMouseMove);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;

      camera.position.x = mouseX * 4;
      camera.position.y = -mouseY * 2;
      camera.lookAt(0, 0, 0);

      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        let y = posAttr.getY(i) - 0.03;
        let x = posAttr.getX(i) + Math.sin(Date.now() * 0.001 + i) * 0.01;
        if (y < -25) y = 25;
        posAttr.setY(i, y);
        posAttr.setX(i, x);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      
      {/* 1. Real Cinematic Mountain Video Background */}
      <video
        ref={videoRef}
        key={activePreset.id}
        autoPlay
        loop
        muted
        playsInline
        poster={activePreset.poster}
        className="absolute inset-0 w-full h-full object-cover opacity-65 scale-105 transition-all duration-1000"
      >
        <source src={activePreset.videoUrl} type="video/mp4" />
      </video>

      {/* 2. Atmospheric Gradient Vignette & Fog Tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black z-10" />
      <div className="absolute inset-0 bg-radial-vignette opacity-80 z-10 pointer-events-none" />

      {/* 3. Three.js Interactive 3D Mist & Snow Layer over Real Mountain */}
      <div ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none" />

      {/* 4. Real Mountain Location Switcher HUD */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-2xl">
        <span className="text-xs text-gray-300 font-semibold uppercase tracking-wider hidden sm:inline">📍 Himalayan Location:</span>
        {MOUNTAIN_PRESETS.map((preset, idx) => (
          <button
            key={preset.id}
            onClick={() => setActivePresetIndex(idx)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activePresetIndex === idx
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-[0_0_15px_#00d2ff]'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🏔️</span>
            <span>{preset.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Live Altitude Callout Badge */}
      <div className="absolute bottom-10 right-8 z-30 hidden md:flex items-center gap-3 bg-black/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
        <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
        <span className="text-xs text-gray-300 font-mono">Live Vista: <strong className="text-cyan-300 font-bold">{activePreset.location}</strong></span>
      </div>

    </div>
  );
}
