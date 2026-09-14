'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type WeatherType = 'snow' | 'rain' | 'dust';

interface Props {
  weather: WeatherType;
}

export default function WeatherSurfaceAccumulation({ weather }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const weatherRef = useRef(weather);
  weatherRef.current = weather;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Surface Mesh (Ground accumulation bank)
    const geo = new THREE.PlaneGeometry(30, 8, 64, 16);
    geo.rotateX(-Math.PI / 3);

    // Displacement for natural snow bank / sand dune / water puddle surface
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = Math.sin(x * 0.4) * Math.cos(y * 0.4) * 0.4;
      pos.setZ(i, z);
    }
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
      metalness: 0.2,
      transparent: true,
      opacity: 0.95
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, -1, 0);
    scene.add(mesh);

    // Lighting
    const light = new THREE.DirectionalLight(0x00d2ff, 2);
    light.position.set(0, 10, 10);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    // 2. Accumulation Particle Splashes & Ripples
    const particleCount = 150;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(particleCount * 3);
    const partVel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      partPos[i * 3] = (Math.random() - 0.5) * 20;
      partPos[i * 3 + 1] = Math.random() * 2 - 1;
      partPos[i * 3 + 2] = (Math.random() - 0.5) * 6;

      partVel[i * 3] = (Math.random() - 0.5) * 0.04;
      partVel[i * 3 + 1] = Math.random() * 0.03 + 0.01;
      partVel[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
    }

    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.3,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const partSystem = new THREE.Points(partGeo, partMat);
    scene.add(partSystem);

    // 3. Animation Loop
    let animationId: number;
    const startTime = performance.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      const activeWeather = weatherRef.current;

      // Weather-Specific Surface Accumulation Shader / Material Properties
      if (activeWeather === 'snow') {
        // SNOW BANK ACCUMULATION: Frosty white snow cover with sparkling ice particles
        mat.color.setHex(0xeaf6ff);
        mat.roughness = 0.8;
        mat.metalness = 0.1;
        partMat.color.setHex(0xffffff);
        light.color.setHex(0x00d2ff);

        const pArr = partGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          pArr[i * 3 + 1] += Math.sin(elapsedTime * 2 + i) * 0.005;
          pArr[i * 3] += Math.cos(elapsedTime + i) * 0.005;
        }
        partGeo.attributes.position.needsUpdate = true;
      } else if (activeWeather === 'rain') {
        // RAIN WATER PUDDLE SURFACE: Highly glossy wet water surface with rain ripple splashes
        mat.color.setHex(0x132238);
        mat.roughness = 0.05; // Glossy wet water reflection
        mat.metalness = 0.95;
        partMat.color.setHex(0x70a1ff);
        light.color.setHex(0x38ef7d);

        // Water Ripple Splash Animation
        const pArr = partGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          pArr[i * 3 + 1] += partVel[i * 3 + 1];
          if (pArr[i * 3 + 1] > 1.5) {
            pArr[i * 3 + 1] = -1.0;
            pArr[i * 3] = (Math.random() - 0.5) * 20;
          }
        }
        partGeo.attributes.position.needsUpdate = true;
      } else if (activeWeather === 'dust') {
        // DUST SAND DUNE ACCUMULATION: Golden sand dune waves with blowing dust smoke
        mat.color.setHex(0x3d2714);
        mat.roughness = 0.9;
        mat.metalness = 0.2;
        partMat.color.setHex(0xffb86c);
        light.color.setHex(0xffaa44);

        const pArr = partGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          pArr[i * 3] += 0.06; // Wind blowing sand across dunes
          if (pArr[i * 3] > 10) pArr[i * 3] = -10;
        }
        partGeo.attributes.position.needsUpdate = true;
      }

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
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-32 overflow-hidden -mt-16 z-20 pointer-events-none">
      
      {/* 3D WebGL Surface Accumulation Canvas */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Surface Gradient Blend Fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      {/* Dynamic Weather Accumulation Label */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[11px] font-mono text-cyan-300 font-bold shadow-lg">
        {weather === 'snow' && '❄️ Accumulating Fresh Himalayan Snow Bank'}
        {weather === 'rain' && '🌧️ Rainwater Puddle Ripples & Wet Reflections'}
        {weather === 'dust' && '💨 Sand Dune Dust Accumulation'}
      </div>

    </div>
  );
}
