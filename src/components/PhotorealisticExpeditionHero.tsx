'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const REAL_MOUNTAIN_VIDEOS = [
  {
    id: 'himalayan-snow-pass',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-over-mountains-41544-large.mp4',
    poster: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000',
    title: 'Himalayan Ridge'
  },
  {
    id: 'rohtang-pass-real',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-snow-capped-mountains-41534-large.mp4',
    poster: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80&w=2000',
    title: 'Rohtang Snow Pass'
  },
  {
    id: 'ladakh-valley-real',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-mountains-covered-in-snow-under-a-clear-blue-sky-41542-large.mp4',
    poster: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000',
    title: 'Ladakh High Plateau'
  }
];

export default function PhotorealisticExpeditionHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [weatherType, setWeatherType] = useState<'snow' | 'rain' | 'mist'>('snow');

  const activeVideo = REAL_MOUNTAIN_VIDEOS[activeVideoIdx];

  // 1. 3D WebGL Particle Weather Simulation over Real Video Footage
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Realistic Snow & Atmosphere Particle System
    const particleCount = 350;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = Math.random() * 40 - 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = -0.05 - Math.random() * 0.08;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Soft realistic snow texture simulation
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.38,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Mouse Interactive 3D Parallax Calculation
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      // Automatically adapt weather type based on cursor position
      if (targetMouseX < -0.3) {
        setWeatherType('snow');
      } else if (targetMouseX > 0.3) {
        setWeatherType('mist');
      } else if (targetMouseY > 0.2) {
        setWeatherType('rain');
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      // Camera 3D movement
      camera.position.x = mouseX * 3;
      camera.position.y = -mouseY * 1.5;
      camera.lookAt(0, 0, 0);

      // Parallax transform on Video Background Container
      if (containerRef.current) {
        containerRef.current.style.transform = `scale(1.08) translate(${mouseX * -15}px, ${mouseY * -10}px)`;
      }

      // Animate Snow / Rain / Mist particles
      const posArr = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 1] += velocities[i * 3 + 1];
        posArr[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.015;

        if (posArr[i * 3 + 1] < -20) {
          posArr[i * 3 + 1] = 20;
          posArr[i * 3] = (Math.random() - 0.5) * 60;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

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
      
      {/* Real High-Definition Cinematic Mountain Video Layer with 3D Parallax */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out pointer-events-none"
      >
        <video
          ref={videoRef}
          key={activeVideo.id}
          autoPlay
          loop
          muted
          playsInline
          poster={activeVideo.poster}
          className="w-full h-full object-cover opacity-75 filter contrast-105 brightness-95"
        >
          <source src={activeVideo.videoUrl} type="video/mp4" />
        </video>
      </div>

      {/* Atmospheric Fog Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette opacity-70 z-10 pointer-events-none" />

      {/* 3D WebGL Real Snowfall & Mist Layer */}
      <div ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none" />

    </div>
  );
}
