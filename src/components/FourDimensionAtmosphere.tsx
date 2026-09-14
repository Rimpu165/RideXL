'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type WeatherState = 'snow' | 'rain' | 'dust';

const REAL_WEATHER_VIDEOS: Record<WeatherState, { videoUrl: string; poster: string }> = {
  snow: {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-snow-capped-mountains-41543-large.mp4',
    poster: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80&w=2000'
  },
  rain: {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-over-mountains-41544-large.mp4',
    poster: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=2000'
  },
  dust: {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-mountains-covered-in-snow-under-a-clear-blue-sky-41542-large.mp4',
    poster: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000'
  }
};

export default function FourDimensionAtmosphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [currentWeather, setCurrentWeather] = useState<WeatherState>('snow');
  const weatherRef = useRef(currentWeather);
  weatherRef.current = currentWeather;

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. 4D Perspective Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 0, 35);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. 4D PARTICLES SYSTEM (Full Screen Edge-to-Edge Field)
    const particleCount = 800;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Full screen 100vw x 100vh coverage
      positions[i * 3] = (Math.random() - 0.5) * 140;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60; // 3D/4D Z-depth field

      velocities[i * 3] = (Math.random() - 0.5) * 0.04;
      velocities[i * 3 + 1] = -0.08 - Math.random() * 0.12;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.04;

      sizes[i] = Math.random() * 0.5 + 0.2;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.55,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 3. INTERACTIVE 4D MOUSE CURSOR TRAIL
    const trailCount = 150;
    const trailGeo = new THREE.BufferGeometry();
    const trailPos = new Float32Array(trailCount * 3);
    const trailVel = new Float32Array(trailCount * 3);
    const trailLife = new Float32Array(trailCount);

    for (let i = 0; i < trailCount; i++) {
      trailPos[i * 3] = 9999;
      trailPos[i * 3 + 1] = 9999;
      trailPos[i * 3 + 2] = 0;
      trailLife[i] = 0;
    }

    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
    const trailMat = new THREE.PointsMaterial({
      color: 0x00d2ff,
      size: 0.75,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });

    const trailSystem = new THREE.Points(trailGeo, trailMat);
    scene.add(trailSystem);

    // 4D Cursor Position Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let trailPointer = 0;

    const onMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      targetMouseX = normX;
      targetMouseY = normY;

      // Project 2D screen coordinates into 4D space
      const vector = new THREE.Vector3(normX, -normY, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      const worldPos = camera.position.clone().add(dir.multiplyScalar(dist));

      // Emit 4D cursor particles
      for (let k = 0; k < 4; k++) {
        const idx = (trailPointer + k) % trailCount;
        trailPos[idx * 3] = worldPos.x + (Math.random() - 0.5) * 0.8;
        trailPos[idx * 3 + 1] = worldPos.y + (Math.random() - 0.5) * 0.8;
        trailPos[idx * 3 + 2] = worldPos.z + (Math.random() - 0.5) * 1.5;

        trailVel[idx * 3] = (Math.random() - 0.5) * 0.15;
        trailVel[idx * 3 + 1] = (Math.random() - 0.5) * 0.15;
        trailVel[idx * 3 + 2] = (Math.random() - 0.5) * 0.15;

        trailLife[idx] = 1.0;
      }
      trailPointer = (trailPointer + 4) % trailCount;

      // Weather state auto-switch based on cursor position
      if (normX < -0.35) {
        setCurrentWeather('snow');
      } else if (normX > 0.35) {
        setCurrentWeather('dust');
      } else if (normY > 0.2) {
        setCurrentWeather('rain');
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    // 4D Animation Loop
    let animationId: number;
    const startTime = performance.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // 4D Camera Sway & Tilt Parallax
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      camera.position.x = mouseX * 6;
      camera.position.y = -mouseY * 4;
      camera.lookAt(0, 0, 0);

      // Scale full screen HD background video container seamlessly
      if (containerRef.current) {
        containerRef.current.style.transform = `scale(1.1) translate(${mouseX * -20}px, ${mouseY * -15}px)`;
      }

      const activeWeather = weatherRef.current;
      const pArr = particleGeo.attributes.position.array as Float32Array;

      // 4D Weather Physics Update
      for (let i = 0; i < particleCount; i++) {
        if (activeWeather === 'snow') {
          pArr[i * 3 + 1] += velocities[i * 3 + 1];
          pArr[i * 3] += Math.sin(elapsedTime + i) * 0.03;
          particleMat.color.setHex(0xffffff);
          trailMat.color.setHex(0xa0e6ff);
        } else if (activeWeather === 'rain') {
          pArr[i * 3 + 1] -= 0.95; // Fast downpour streak
          pArr[i * 3] -= 0.08;
          particleMat.color.setHex(0x70a1ff);
          trailMat.color.setHex(0x38ef7d);
        } else if (activeWeather === 'dust') {
          pArr[i * 3] += 0.45; // Sandstorm wind blow
          pArr[i * 3 + 1] += Math.sin(elapsedTime * 2 + i) * 0.05;
          particleMat.color.setHex(0xeccc68);
          trailMat.color.setHex(0xffb86c);
        }

        // Loop particles in 4D space
        if (pArr[i * 3 + 1] < -50) {
          pArr[i * 3 + 1] = 50;
          pArr[i * 3] = (Math.random() - 0.5) * 140;
        }
        if (pArr[i * 3] > 70) pArr[i * 3] = -70;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Update Cursor Trail Physics
      const tArr = trailGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < trailCount; i++) {
        if (trailLife[i] > 0) {
          tArr[i * 3] += trailVel[i * 3];
          tArr[i * 3 + 1] += trailVel[i * 3 + 1];
          tArr[i * 3 + 2] += trailVel[i * 3 + 2];
          trailLife[i] -= 0.02;
        } else {
          tArr[i * 3] = 9999;
        }
      }
      trailGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
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

  const activeBg = REAL_WEATHER_VIDEOS[currentWeather];

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black pointer-events-none z-0">
      
      {/* Full-Bleed 100vw x 100vh Real Himalayan Mountain HD Video Layer */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
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
            currentWeather === 'rain'
              ? 'opacity-85 filter contrast-125 brightness-75'
              : currentWeather === 'dust'
              ? 'opacity-80 filter sepia-[0.35] brightness-90'
              : 'opacity-80 filter contrast-105 brightness-95'
          }`}
        >
          <source src={activeBg.videoUrl} type="video/mp4" />
        </video>
      </div>

      {/* Weather Vignettes & Lighting */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${
        currentWeather === 'rain'
          ? 'bg-gradient-to-b from-slate-950/60 via-blue-950/30 to-black/70'
          : currentWeather === 'dust'
          ? 'bg-gradient-to-b from-amber-950/50 via-amber-900/20 to-black/70'
          : 'bg-gradient-to-b from-black/40 via-black/20 to-black/70'
      }`} />

      {/* 4D WebGL Particle & Cursor Physics Layer (100vw x 100vh) */}
      <div ref={canvasRef} className="absolute inset-0 w-full h-full" />

    </div>
  );
}
