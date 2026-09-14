'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type WeatherType = 'snow' | 'rain' | 'dust';

// Authentic 4K HD Real Mountain Footage per Weather Condition
const WEATHER_BACKGROUNDS: Record<WeatherType, { videoUrl: string; poster: string; label: string }> = {
  snow: {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-snow-capped-mountains-41543-large.mp4',
    poster: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80&w=2000',
    label: 'Real Snowy Himalayan Pass'
  },
  rain: {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-over-mountains-41544-large.mp4',
    poster: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=2000',
    label: 'Real Monsoon Mountain Storm'
  },
  dust: {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-mountains-covered-in-snow-under-a-clear-blue-sky-41542-large.mp4',
    poster: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000',
    label: 'Real Windy Himalayan Sandstorm'
  }
};

export default function PhotorealisticInteractiveWeatherHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [currentWeather, setCurrentWeather] = useState<WeatherType>('snow');
  const weatherRef = useRef(currentWeather);
  weatherRef.current = currentWeather;

  // 3D WebGL Engine for Particle Weather Physics & Mouse Cursor Trails
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

    // 1. PARTICLES FOR SNOW, RAIN, DUST

    // A) SNOW PARTICLES
    const snowCount = 500;
    const snowGeo = new THREE.BufferGeometry();
    const snowPos = new Float32Array(snowCount * 3);
    const snowVel = new Float32Array(snowCount * 3);

    for (let i = 0; i < snowCount; i++) {
      snowPos[i * 3] = (Math.random() - 0.5) * 80;
      snowPos[i * 3 + 1] = Math.random() * 50 - 15;
      snowPos[i * 3 + 2] = (Math.random() - 0.5) * 40;

      snowVel[i * 3] = (Math.random() - 0.5) * 0.03;
      snowVel[i * 3 + 1] = -0.06 - Math.random() * 0.08;
      snowVel[i * 3 + 2] = (Math.random() - 0.5) * 0.03;
    }
    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));
    const snowMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.42,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const snowSystem = new THREE.Points(snowGeo, snowMat);
    scene.add(snowSystem);

    // B) WATER RAIN PARTICLES
    const rainCount = 800;
    const rainGeo = new THREE.BufferGeometry();
    const rainPos = new Float32Array(rainCount * 3);

    for (let i = 0; i < rainCount; i++) {
      rainPos[i * 3] = (Math.random() - 0.5) * 80;
      rainPos[i * 3 + 1] = Math.random() * 50 - 15;
      rainPos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
    const rainMat = new THREE.PointsMaterial({
      color: 0x70a1ff,
      size: 0.28,
      transparent: true,
      opacity: 0.8
    });
    const rainSystem = new THREE.Points(rainGeo, rainMat);
    scene.add(rainSystem);

    // C) SOIL & DUST PARTICLES
    const dustCount = 600;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 90;
      dustPos[i * 3 + 1] = Math.random() * 40 - 10;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xeccc68,
      size: 0.55,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const dustSystem = new THREE.Points(dustGeo, dustMat);
    scene.add(dustSystem);

    // 2. INTERACTIVE MOUSE CURSOR TRAIL
    const mouseTrailCount = 120;
    const trailGeo = new THREE.BufferGeometry();
    const trailPos = new Float32Array(mouseTrailCount * 3);
    const trailVel = new Float32Array(mouseTrailCount * 3);
    const trailLife = new Float32Array(mouseTrailCount);

    for (let i = 0; i < mouseTrailCount; i++) {
      trailPos[i * 3] = 999;
      trailPos[i * 3 + 1] = 999;
      trailPos[i * 3 + 2] = 0;
      trailLife[i] = 0;
    }

    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
    const trailMat = new THREE.PointsMaterial({
      color: 0x00d2ff,
      size: 0.65,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const trailSystem = new THREE.Points(trailGeo, trailMat);
    scene.add(trailSystem);

    // Mouse Tracking Physics
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseWorldPos = new THREE.Vector3();
    let trailPointer = 0;

    const onMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      targetMouseX = normX;
      targetMouseY = normY;

      // Map 2D mouse to 3D world space
      const vector = new THREE.Vector3(normX, -normY, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      mouseWorldPos = camera.position.clone().add(dir.multiplyScalar(distance));

      // Emit trail particles from cursor
      for (let k = 0; k < 3; k++) {
        const idx = (trailPointer + k) % mouseTrailCount;
        trailPos[idx * 3] = mouseWorldPos.x + (Math.random() - 0.5) * 0.5;
        trailPos[idx * 3 + 1] = mouseWorldPos.y + (Math.random() - 0.5) * 0.5;
        trailPos[idx * 3 + 2] = mouseWorldPos.z + (Math.random() - 0.5) * 0.5;

        trailVel[idx * 3] = (Math.random() - 0.5) * 0.12;
        trailVel[idx * 3 + 1] = (Math.random() - 0.5) * 0.12;
        trailVel[idx * 3 + 2] = (Math.random() - 0.5) * 0.12;

        trailLife[idx] = 1.0;
      }
      trailPointer = (trailPointer + 3) % mouseTrailCount;

      // Automatically morph real background video & weather state based on mouse cursor position:
      if (normX < -0.3) {
        setCurrentWeather('snow');
      } else if (normX > 0.3) {
        setCurrentWeather('dust');
      } else if (normY > 0.15) {
        setCurrentWeather('rain');
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    let animationId: number;
    const startTime = performance.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      camera.position.x = mouseX * 4;
      camera.position.y = -mouseY * 2;
      camera.lookAt(0, 0, 0);

      if (containerRef.current) {
        containerRef.current.style.transform = `scale(1.08) translate(${mouseX * -16}px, ${mouseY * -10}px)`;
      }

      const activeWeather = weatherRef.current;

      // SNOW PARTICLES & ICE TRAIL
      if (activeWeather === 'snow') {
        snowSystem.visible = true;
        rainSystem.visible = false;
        dustSystem.visible = false;
        trailMat.color.setHex(0xa0e6ff);

        const posArr = snowGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < snowCount; i++) {
          posArr[i * 3 + 1] += snowVel[i * 3 + 1];
          posArr[i * 3] += Math.sin(elapsedTime + i) * 0.02;
          if (posArr[i * 3 + 1] < -20) {
            posArr[i * 3 + 1] = 25;
            posArr[i * 3] = (Math.random() - 0.5) * 80;
          }
        }
        snowGeo.attributes.position.needsUpdate = true;
      }

      // WATER RAIN PARTICLES & SPLASH TRAIL
      if (activeWeather === 'rain') {
        snowSystem.visible = false;
        rainSystem.visible = true;
        dustSystem.visible = false;
        trailMat.color.setHex(0x38ef7d);

        const posArr = rainGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < rainCount; i++) {
          posArr[i * 3 + 1] -= 0.85;
          posArr[i * 3] -= 0.05;
          if (posArr[i * 3 + 1] < -20) {
            posArr[i * 3 + 1] = 25;
            posArr[i * 3] = (Math.random() - 0.5) * 80;
          }
        }
        rainGeo.attributes.position.needsUpdate = true;
      }

      // SOIL / DUST PARTICLES & SAND SWIRL TRAIL
      if (activeWeather === 'dust') {
        snowSystem.visible = false;
        rainSystem.visible = false;
        dustSystem.visible = true;
        trailMat.color.setHex(0xffb86c);

        const posArr = dustGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < dustCount; i++) {
          posArr[i * 3] += 0.38;
          posArr[i * 3 + 1] += Math.sin(elapsedTime * 3 + i) * 0.04;
          if (posArr[i * 3] > 45) {
            posArr[i * 3] = -45;
            posArr[i * 3 + 1] = Math.random() * 40 - 10;
          }
        }
        dustGeo.attributes.position.needsUpdate = true;
      }

      // TRAIL PHYSICS UPDATE
      const trailPosArr = trailGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < mouseTrailCount; i++) {
        if (trailLife[i] > 0) {
          trailPosArr[i * 3] += trailVel[i * 3];
          trailPosArr[i * 3 + 1] += trailVel[i * 3 + 1];
          trailPosArr[i * 3 + 2] += trailVel[i * 3 + 2];
          trailLife[i] -= 0.025;
        } else {
          trailPosArr[i * 3] = 999;
        }
      }
      trailGeo.attributes.position.needsUpdate = true;

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

  const activeBg = WEATHER_BACKGROUNDS[currentWeather];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      
      {/* Dynamic Real Mountain HD Video Layer - Morphing Synchronously with Weather */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out pointer-events-none"
      >
        <video
          ref={videoRef}
          key={currentWeather}
          autoPlay
          loop
          muted
          playsInline
          poster={activeBg.poster}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            currentWeather === 'rain' ? 'opacity-85 filter contrast-125 brightness-75' : currentWeather === 'dust' ? 'opacity-80 filter sepia-[0.3] brightness-90' : 'opacity-80 filter contrast-105 brightness-95'
          }`}
        >
          <source src={activeBg.videoUrl} type="video/mp4" />
        </video>
      </div>

      {/* Weather Tint Vignettes */}
      <div className={`absolute inset-0 transition-colors duration-1000 z-10 pointer-events-none ${
        currentWeather === 'rain' 
          ? 'bg-gradient-to-b from-slate-950/80 via-blue-950/40 to-black' 
          : currentWeather === 'dust'
          ? 'bg-gradient-to-b from-amber-950/70 via-amber-900/30 to-black'
          : 'bg-gradient-to-b from-black/60 via-black/20 to-black'
      }`} />
      
      <div className="absolute inset-0 bg-radial-vignette opacity-70 z-10 pointer-events-none" />

      {/* 3D WebGL Weather Particle & Interactive Cursor Trail Layer */}
      <div ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none" />

      {/* Subtle Weather Label Badge at bottom right */}
      <div className="absolute bottom-8 right-8 z-30 flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-xs font-semibold text-gray-300 pointer-events-none">
        <span className="text-base">
          {currentWeather === 'snow' ? '❄️' : currentWeather === 'rain' ? '🌧️' : '💨'}
        </span>
        <span className="uppercase tracking-wider font-bold text-cyan-300 font-mono">
          {activeBg.label}
        </span>
      </div>

    </div>
  );
}
