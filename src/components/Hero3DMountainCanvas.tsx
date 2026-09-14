'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Hero3DMountainCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [themeMode, setThemeMode] = useState<'himalayan' | 'sunset' | 'cyber'>('himalayan');

  const wireframeRef = useRef(wireframeMode);
  wireframeRef.current = wireframeMode;

  const themeRef = useRef(themeMode);
  themeRef.current = themeMode;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Fog Setup
    const scene = new THREE.Scene();
    const fogColor = new THREE.Color(0x060913);
    scene.background = fogColor;
    scene.fog = new THREE.FogExp2(fogColor, 0.015);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 8, 38);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0x405070, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0x00d2ff, 2.5);
    sunLight.position.set(20, 40, 20);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0xa55eea, 1.8);
    rimLight.position.set(-25, 20, -30);
    scene.add(rimLight);

    const valleyLight = new THREE.PointLight(0x2ed573, 2, 50);
    valleyLight.position.set(0, 2, 10);
    scene.add(valleyLight);

    // 5. Procedural 3D Mountain Terrain Construction
    const terrainWidth = 140;
    const terrainDepth = 140;
    const segments = 120;

    const terrainGeo = new THREE.PlaneGeometry(terrainWidth, terrainDepth, segments, segments);
    terrainGeo.rotateX(-Math.PI / 2);

    // Heightmap function using simplex-like multi-octave math
    const posAttr = terrainGeo.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < posAttr.count; i++) {
      vertex.fromBufferAttribute(posAttr, i);

      // Distance from center valley (create a valley pass for the road down the middle)
      const distFromCenter = Math.abs(vertex.x);
      
      // Calculate mountain peaks on sides, lower in middle pass
      const mountainValleyFactor = Math.pow(distFromCenter / (terrainWidth * 0.45), 1.8);
      
      // Layered sine wave frequency displacement for organic mountain ridges & crags
      let heightVal = Math.sin(vertex.x * 0.08) * Math.cos(vertex.z * 0.08) * 8.0;
      heightVal += Math.sin(vertex.x * 0.2 + vertex.z * 0.15) * 3.5;
      heightVal += Math.cos(vertex.x * 0.4 - vertex.z * 0.3) * 1.5;
      heightVal += Math.sin((vertex.x * vertex.z) * 0.01) * 2.0;

      // Scale height up near borders to form dramatic Himalayan peaks
      const finalY = (heightVal + 4.0) * (0.3 + mountainValleyFactor * 1.6);
      
      // Flatten out slightly in the central road valley
      if (distFromCenter < 12) {
        posAttr.setY(i, Math.max(-0.5, finalY * 0.15));
      } else {
        posAttr.setY(i, finalY);
      }
    }

    terrainGeo.computeVertexNormals();

    // High detail terrain material with vertex colors (snow peaks vs dark rock valley)
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x1a233a,
      roughness: 0.8,
      metalness: 0.3,
      flatShading: true,
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.position.set(0, -3, -20);
    scene.add(terrainMesh);

    // Wireframe Overlay for Cyber/Ridge Aesthetic
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const wireframeMesh = new THREE.Mesh(terrainGeo, wireframeMat);
    wireframeMesh.position.copy(terrainMesh.position);
    scene.add(wireframeMesh);

    // 6. Winding Mountain Highway Road & Glowing Telemetry Line
    const roadPoints: THREE.Vector3[] = [];
    for (let z = 40; z >= -60; z -= 2) {
      const x = Math.sin(z * 0.08) * 6.5;
      roadPoints.push(new THREE.Vector3(x, -2.85, z - 20));
    }

    const roadCurve = new THREE.CatmullRomCurve3(roadPoints);
    const roadGeo = new THREE.TubeGeometry(roadCurve, 100, 1.2, 8, false);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x111622,
      roughness: 0.3,
      metalness: 0.8
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    scene.add(roadMesh);

    // Glowing Neon Telemetry Line down the center of road
    const lineGeo = new THREE.TubeGeometry(roadCurve, 100, 0.12, 6, false);
    const lineMat = new THREE.MeshBasicMaterial({ color: 0x00d2ff });
    const lineMesh = new THREE.Mesh(lineGeo, lineMat);
    scene.add(lineMesh);

    // 7. Travelling Vehicle Light Beams on Road
    const vehicleLightGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const vehicleLightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const vehicleLightMesh = new THREE.Mesh(vehicleLightGeo, vehicleLightMat);
    scene.add(vehicleLightMesh);

    const vehicleSpot = new THREE.SpotLight(0x00ffff, 8, 25, Math.PI / 4, 0.5);
    scene.add(vehicleSpot);
    scene.add(vehicleSpot.target);

    // 8. Dynamic Starfield Sky & Snow Particles
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starScales = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 200;
      starPositions[i * 3 + 1] = Math.random() * 80 + 10;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 200;
      starScales[i] = Math.random();
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.4,
      transparent: true,
      opacity: 0.8
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Floating Snow / Dust Particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 80;
      particlePositions[i * 3 + 1] = Math.random() * 30 - 5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x88ccff,
      size: 0.25,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 9. Interactive Mouse Parallax Handler
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', onMouseMove);

    // 10. Animation Loop
    let animationId: number;
    let progress = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Parallax Camera Sway
      camera.position.x = mouseX * 8;
      camera.position.y = 8 - mouseY * 3;
      camera.lookAt(0, 2, -20);

      // Rotate mountain range slowly for cinematic depth
      terrainMesh.rotation.y = Math.sin(Date.now() * 0.0002) * 0.05;
      wireframeMesh.rotation.y = terrainMesh.rotation.y;

      // Animate vehicle light travelling along the winding mountain highway
      progress = (progress + 0.002) % 1;
      const vehiclePos = roadCurve.getPointAt(progress);
      const vehicleTangent = roadCurve.getTangentAt(progress);

      vehicleLightMesh.position.copy(vehiclePos);
      vehicleLightMesh.position.y += 0.3;

      vehicleSpot.position.copy(vehicleLightMesh.position);
      vehicleSpot.target.position.copy(vehiclePos.clone().add(vehicleTangent.multiplyScalar(5)));

      // Animate Snow / Dust Particles falling gently
      const particlePosAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        let y = particlePosAttr.getY(i) - 0.05;
        let x = particlePosAttr.getX(i) + Math.sin(Date.now() * 0.001 + i) * 0.02;
        if (y < -10) y = 30;
        particlePosAttr.setY(i, y);
        particlePosAttr.setX(i, x);
      }
      particlePosAttr.needsUpdate = true;

      // Update wireframe visibility
      wireframeMat.visible = wireframeRef.current;

      // Apply Theme Colors
      const currentTheme = themeRef.current;
      if (currentTheme === 'himalayan') {
        scene.fog?.color.setHex(0x060913);
        scene.background = new THREE.Color(0x060913);
        terrainMat.color.setHex(0x1a233a);
        sunLight.color.setHex(0x00d2ff);
        lineMat.color.setHex(0x00d2ff);
      } else if (currentTheme === 'sunset') {
        scene.fog?.color.setHex(0x1a0913);
        scene.background = new THREE.Color(0x1a0913);
        terrainMat.color.setHex(0x3a1a23);
        sunLight.color.setHex(0xff7675);
        lineMat.color.setHex(0xfdcb6e);
      } else if (currentTheme === 'cyber') {
        scene.fog?.color.setHex(0x0a0518);
        scene.background = new THREE.Color(0x0a0518);
        terrainMat.color.setHex(0x150c2a);
        sunLight.color.setHex(0xa55eea);
        lineMat.color.setHex(0x2ed573);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 11. Resize Handler
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
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Subtle Fog Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black pointer-events-none" />

      {/* Floating 3D Mountain Controls Overlay */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-2xl">
        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider hidden sm:inline">3D Mountain View:</span>
        
        {/* Theme Toggles */}
        <button
          onClick={() => setThemeMode('himalayan')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            themeMode === 'himalayan' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_#00d2ff]' : 'text-gray-400 hover:text-white'
          }`}
        >
          ❄️ Himalayan Icy
        </button>
        <button
          onClick={() => setThemeMode('sunset')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            themeMode === 'sunset' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_#f59e0b]' : 'text-gray-400 hover:text-white'
          }`}
        >
          🌅 Golden Sunset
        </button>
        <button
          onClick={() => setThemeMode('cyber')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            themeMode === 'cyber' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_10px_#a855f7]' : 'text-gray-400 hover:text-white'
          }`}
        >
          🌆 Cyber Neon
        </button>

        {/* Wireframe Mesh Toggle */}
        <button
          onClick={() => setWireframeMode(!wireframeMode)}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
            wireframeMode ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          {wireframeMode ? '📐 Wireframe ON' : '📐 Ridge Mesh'}
        </button>
      </div>
    </div>
  );
}
