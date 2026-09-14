'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type WeatherMode = 'snow' | 'rain' | 'dust' | 'clear';

export default function Interactive3DMountainWeather() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentWeather, setCurrentWeather] = useState<WeatherMode>('snow');
  const [interactiveMouse, setInteractiveMouse] = useState(true);

  const weatherRef = useRef(currentWeather);
  weatherRef.current = currentWeather;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Environment
    const scene = new THREE.Scene();
    const fog = new THREE.FogExp2(0x0a101d, 0.018);
    scene.fog = fog;
    scene.background = new THREE.Color(0x0a101d);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 10, 42);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 4. Dynamic Lighting System
    const ambientLight = new THREE.AmbientLight(0x405070, 1.0);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x00d2ff, 2.2);
    mainLight.position.set(20, 35, 20);
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    rimLight.position.set(-20, 15, -20);
    scene.add(rimLight);

    // Lightning Flash Light (for rain mode)
    const lightningLight = new THREE.PointLight(0xffffff, 0, 100);
    lightningLight.position.set(0, 30, 0);
    scene.add(lightningLight);

    // 5. Procedural Detailed 3D Himalayan Mountain Mesh
    const terrainWidth = 160;
    const terrainDepth = 160;
    const segments = 120;

    const terrainGeo = new THREE.PlaneGeometry(terrainWidth, terrainDepth, segments, segments);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < posAttr.count; i++) {
      vertex.fromBufferAttribute(posAttr, i);
      const distFromCenter = Math.abs(vertex.x);
      const valleyFactor = Math.pow(distFromCenter / (terrainWidth * 0.45), 1.6);

      // Organic Himalayan peak displacement formulas
      let h = Math.sin(vertex.x * 0.07) * Math.cos(vertex.z * 0.07) * 9.0;
      h += Math.sin(vertex.x * 0.18 + vertex.z * 0.14) * 4.0;
      h += Math.cos(vertex.x * 0.35 - vertex.z * 0.25) * 2.0;

      const finalY = (h + 5.0) * (0.25 + valleyFactor * 1.5);
      if (distFromCenter < 14) {
        posAttr.setY(i, Math.max(-0.6, finalY * 0.18)); // Central river valley pass
      } else {
        posAttr.setY(i, finalY);
      }
    }
    terrainGeo.computeVertexNormals();

    const mountainMat = new THREE.MeshStandardMaterial({
      color: 0x1b263b,
      roughness: 0.7,
      metalness: 0.3,
      flatShading: true
    });

    const mountainMesh = new THREE.Mesh(terrainGeo, mountainMat);
    mountainMesh.position.set(0, -4, -20);
    scene.add(mountainMesh);

    // Dynamic Central River in Mountain Valley
    const riverGeo = new THREE.PlaneGeometry(24, 160);
    riverGeo.rotateX(-Math.PI / 2);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x00a8ff,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.8
    });
    const riverMesh = new THREE.Mesh(riverGeo, riverMat);
    riverMesh.position.set(0, -4.5, -20);
    scene.add(riverMesh);

    // 6. Dynamic Weather Particle Systems (Snow, Rain, Dust)

    // A) SNOW PARTICLES (Snowfall / Ice Storm)
    const snowCount = 800;
    const snowGeo = new THREE.BufferGeometry();
    const snowPos = new Float32Array(snowCount * 3);
    const snowVel = new Float32Array(snowCount * 3);

    for (let i = 0; i < snowCount; i++) {
      snowPos[i * 3] = (Math.random() - 0.5) * 120;
      snowPos[i * 3 + 1] = Math.random() * 60 - 10;
      snowPos[i * 3 + 2] = (Math.random() - 0.5) * 120;

      snowVel[i * 3] = (Math.random() - 0.5) * 0.05;
      snowVel[i * 3 + 1] = -0.1 - Math.random() * 0.1;
      snowVel[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
    }

    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));
    const snowMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.45,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const snowSystem = new THREE.Points(snowGeo, snowMat);
    scene.add(snowSystem);

    // B) RAIN PARTICLES (Pani Gire / Heavy Downpour)
    const rainCount = 1000;
    const rainGeo = new THREE.BufferGeometry();
    const rainPos = new Float32Array(rainCount * 3);

    for (let i = 0; i < rainCount; i++) {
      rainPos[i * 3] = (Math.random() - 0.5) * 120;
      rainPos[i * 3 + 1] = Math.random() * 60 - 10;
      rainPos[i * 3 + 2] = (Math.random() - 0.5) * 120;
    }

    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
    const rainMat = new THREE.PointsMaterial({
      color: 0x70a1ff,
      size: 0.25,
      transparent: true,
      opacity: 0.8
    });
    const rainSystem = new THREE.Points(rainGeo, rainMat);
    scene.add(rainSystem);

    // C) DUST / WIND PARTICLES (Dhul Ude / Dust Storm)
    const dustCount = 700;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 140;
      dustPos[i * 3 + 1] = Math.random() * 40 - 5;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 140;
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

    // 7. Interactive Mouse Controls & Weather Shift Handler
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      targetMouseX = normX;
      targetMouseY = normY;

      // If interactive cursor mode is enabled, automatically shift weather based on screen region!
      if (interactiveMouse) {
        if (normX < -0.35) {
          setCurrentWeather('snow');
        } else if (normX > 0.35) {
          setCurrentWeather('dust');
        } else if (normY > 0.2) {
          setCurrentWeather('rain');
        } else if (normY < -0.4) {
          setCurrentWeather('clear');
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    // Touch support for mobile
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const normX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
        const normY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
        targetMouseX = normX;
        targetMouseY = normY;
      }
    };
    window.addEventListener('touchmove', onTouchMove);

    // 8. Animation & Physics Loop
    let animationId: number;
    const startTime = performance.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth camera interpolation following mouse movement
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      camera.position.x = mouseX * 12;
      camera.position.y = 10 - mouseY * 4;
      camera.lookAt(0, 2, -20);

      // Subtle mountain rotation
      mountainMesh.rotation.y = Math.sin(elapsedTime * 0.08) * 0.04;
      riverMesh.rotation.y = mountainMesh.rotation.y;

      const activeMode = weatherRef.current;

      // UPDATE SNOW PARTICLES (❄️ Snowfall)
      if (activeMode === 'snow') {
        snowSystem.visible = true;
        const posArr = snowGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < snowCount; i++) {
          posArr[i * 3 + 1] += snowVel[i * 3 + 1];
          posArr[i * 3] += Math.sin(elapsedTime + i) * 0.03;
          if (posArr[i * 3 + 1] < -10) {
            posArr[i * 3 + 1] = 50;
            posArr[i * 3] = (Math.random() - 0.5) * 120;
          }
        }
        snowGeo.attributes.position.needsUpdate = true;
      } else {
        snowSystem.visible = false;
      }

      // UPDATE RAIN PARTICLES (🌧️ Pani Gire / Downpour)
      if (activeMode === 'rain') {
        rainSystem.visible = true;
        const posArr = rainGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < rainCount; i++) {
          posArr[i * 3 + 1] -= 0.85; // Fast rain fall speed
          posArr[i * 3] -= 0.08;
          if (posArr[i * 3 + 1] < -10) {
            posArr[i * 3 + 1] = 50;
            posArr[i * 3] = (Math.random() - 0.5) * 120;
          }
        }
        rainGeo.attributes.position.needsUpdate = true;

        // Occasional Lightning Flash
        if (Math.random() > 0.985) {
          lightningLight.intensity = 15;
        } else {
          lightningLight.intensity *= 0.8;
        }
      } else {
        rainSystem.visible = false;
        lightningLight.intensity = 0;
      }

      // UPDATE DUST PARTICLES (💨 Dhul Ude / Dust Storm)
      if (activeMode === 'dust') {
        dustSystem.visible = true;
        const posArr = dustGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < dustCount; i++) {
          posArr[i * 3] += 0.45; // Horizontal wind blow speed
          posArr[i * 3 + 1] += Math.sin(elapsedTime * 3 + i) * 0.05;
          if (posArr[i * 3] > 60) {
            posArr[i * 3] = -60;
            posArr[i * 3 + 1] = Math.random() * 40 - 5;
          }
        }
        dustGeo.attributes.position.needsUpdate = true;
      } else {
        dustSystem.visible = false;
      }

      // DYNAMIC ATMOSPHERIC COLOR & LIGHTING SHIFTS BASED ON WEATHER
      if (activeMode === 'snow') {
        scene.fog.color.setHex(0x0a1526);
        scene.background = new THREE.Color(0x0a1526);
        mountainMat.color.setHex(0x233554);
        mainLight.color.setHex(0x80d8ff);
        mainLight.intensity = 2.0;
      } else if (activeMode === 'rain') {
        scene.fog.color.setHex(0x070c14);
        scene.background = new THREE.Color(0x070c14);
        mountainMat.color.setHex(0x131c2b);
        mainLight.color.setHex(0x35495e);
        mainLight.intensity = 1.2;
      } else if (activeMode === 'dust') {
        scene.fog.color.setHex(0x26190a);
        scene.background = new THREE.Color(0x26190a);
        mountainMat.color.setHex(0x422a14);
        mainLight.color.setHex(0xffaa44);
        mainLight.intensity = 2.4;
      } else if (activeMode === 'clear') {
        scene.fog.color.setHex(0x0b1d3a);
        scene.background = new THREE.Color(0x0b1d3a);
        mountainMat.color.setHex(0x1c3144);
        mainLight.color.setHex(0xffffff);
        mainLight.intensity = 2.8;
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
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
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
      {/* 3D WebGL Mountain Weather Canvas */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Gradient Fog Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black pointer-events-none" />
    </div>
  );
}
