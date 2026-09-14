'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type WeatherType = 'snow' | 'rain' | 'dust';

interface Props {
  weather?: WeatherType;
}

export default function LivingWeatherTransition({ weather = 'rain' }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const weatherRef = useRef(weather);
  weatherRef.current = weather;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 4, 14);
    camera.lookAt(0, -0.5, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Full-Width 3D Flowing Surface Terrain Plane
    const planeGeo = new THREE.PlaneGeometry(45, 12, 120, 32);
    planeGeo.rotateX(-Math.PI / 2.8);

    const pos = planeGeo.attributes.position;
    const initialZ = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      initialZ[i] = pos.getZ(i);
    }

    const surfaceMat = new THREE.MeshStandardMaterial({
      color: 0x00d2ff,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });

    const surfaceMesh = new THREE.Mesh(planeGeo, surfaceMat);
    surfaceMesh.position.set(0, -0.5, 0);
    scene.add(surfaceMesh);

    // Lighting setup
    const sunLight = new THREE.DirectionalLight(0x00ffff, 2.5);
    sunLight.position.set(10, 20, 10);
    scene.add(sunLight);

    const ambLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambLight);

    // 3. Surface Particles System (Rain Water Splashes / Snow Drift / Soil Dust)
    const particleCount = 250;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(particleCount * 3);
    const partVel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      partPos[i * 3] = (Math.random() - 0.5) * 35;
      partPos[i * 3 + 1] = Math.random() * 2.5 - 0.5;
      partPos[i * 3 + 2] = (Math.random() - 0.5) * 8;

      partVel[i * 3] = (Math.random() - 0.5) * 0.06;
      partVel[i * 3 + 1] = Math.random() * 0.04 + 0.01;
      partVel[i * 3 + 2] = (Math.random() - 0.5) * 0.06;
    }

    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0x00d2ff,
      size: 0.35,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const partSystem = new THREE.Points(partGeo, partMat);
    scene.add(partSystem);

    // 4. Animation Physics Loop
    let animationId: number;
    const startTime = performance.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      const active = weatherRef.current;
      const positions = planeGeo.attributes.position;

      // WEATHER SURFACE DISPLACEMENT & MATERIAL TRANSFORMATION
      if (active === 'rain') {
        // 🌧️ RAIN WATER FLOW: Real flowing river wave displacement & glossy liquid reflections
        surfaceMat.color.setHex(0x00d2ff);
        surfaceMat.roughness = 0.05; // Glossy wet water surface
        surfaceMat.metalness = 0.95;
        sunLight.color.setHex(0x00d2ff);
        partMat.color.setHex(0x70a1ff);

        // Fluid water wave movement math
        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i);
          const y = positions.getY(i);
          const wave1 = Math.sin(x * 0.5 + elapsedTime * 4.0) * 0.35;
          const wave2 = Math.cos(y * 0.8 + elapsedTime * 3.0) * 0.25;
          positions.setZ(i, wave1 + wave2);
        }
        positions.needsUpdate = true;
        planeGeo.computeVertexNormals();

        // Water Splash Particles
        const pArr = partGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          pArr[i * 3 + 1] += partVel[i * 3 + 1];
          if (pArr[i * 3 + 1] > 2.0) {
            pArr[i * 3 + 1] = -0.5;
            pArr[i * 3] = (Math.random() - 0.5) * 35;
          }
        }
        partGeo.attributes.position.needsUpdate = true;

      } else if (active === 'snow') {
        // ❄️ SNOW ACCUMULATION BANK: Soft white snow dune ridges & floating ice sparkles
        surfaceMat.color.setHex(0xe8f4f8);
        surfaceMat.roughness = 0.85; // Matte fresh snow
        surfaceMat.metalness = 0.1;
        sunLight.color.setHex(0xa0e6ff);
        partMat.color.setHex(0xffffff);

        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i);
          const y = positions.getY(i);
          const wave = Math.sin(x * 0.3) * Math.cos(y * 0.3) * 0.5;
          positions.setZ(i, wave);
        }
        positions.needsUpdate = true;
        planeGeo.computeVertexNormals();

        // Floating Snow Particles
        const pArr = partGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          pArr[i * 3 + 1] += Math.sin(elapsedTime * 2 + i) * 0.003;
          pArr[i * 3] += Math.cos(elapsedTime + i) * 0.003;
        }
        partGeo.attributes.position.needsUpdate = true;

      } else if (active === 'dust') {
        // 💨 SOIL & DUST WIND DUNES: Golden sand dunes & blowing soil dust particles
        surfaceMat.color.setHex(0xd4a373);
        surfaceMat.roughness = 0.9;
        surfaceMat.metalness = 0.15;
        sunLight.color.setHex(0xffaa44);
        partMat.color.setHex(0xeccc68);

        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i);
          const wave = Math.sin(x * 0.4 + elapsedTime * 1.5) * 0.3;
          positions.setZ(i, wave);
        }
        positions.needsUpdate = true;
        planeGeo.computeVertexNormals();

        // Soil Dust Particles blowing horizontally
        const pArr = partGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          pArr[i * 3] += 0.08;
          if (pArr[i * 3] > 18) pArr[i * 3] = -18;
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
    <div className="relative w-full h-44 -mt-24 z-30 overflow-hidden pointer-events-none">
      
      {/* Top Transition Fade from Hero */}
      <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-black to-transparent z-10" />

      {/* 3D WebGL Living Weather Surface Flow Canvas */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Bottom Transition Fade into Expedition Content */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />

    </div>
  );
}
