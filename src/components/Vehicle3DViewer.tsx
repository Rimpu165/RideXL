'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type VehicleType = 'bike' | 'suv' | 'truck' | 'superbike';

interface Vehicle3DViewerProps {
  vehicleType: VehicleType;
  primaryColor?: string;
  isDriving?: boolean;
  driveProgress?: number; // 0 to 1
  onProgressUpdate?: (progress: number) => void;
}

export const VEHICLES_DATA = [
  {
    id: 'bike' as VehicleType,
    name: 'Himalayan Adventure 450',
    category: 'Dual-Sport Motorcycle',
    icon: '🏍️',
    color: '#00d2ff',
    stats: {
      speed: '145 km/h',
      clearance: '230 mm',
      engine: '452cc Liquid-Cooled',
      range: '420 km',
      altitudeRating: '5,600m (Khardung La Ready)',
      terrain: '9.8 / 10'
    },
    description: 'Purpose-built for high-altitude mountain passes, rocky terrain, and river crossings.'
  },
  {
    id: 'suv' as VehicleType,
    name: 'Mahindra Thar 4x4 Expedition',
    category: 'Off-Road SUV',
    icon: '🚙',
    color: '#ff4b2b',
    stats: {
      speed: '160 km/h',
      clearance: '226 mm',
      engine: '2.0L mStallion Turbo',
      range: '580 km',
      altitudeRating: '5,600m (Heavy Payload)',
      terrain: '9.5 / 10'
    },
    description: 'Heavy-duty 4WD vehicle with custom roof gear, high air intake, and winch for rugged rescue.'
  },
  {
    id: 'truck' as VehicleType,
    name: 'Overland 6x6 Expedition Rig',
    category: 'Support Vehicle',
    icon: '🚚',
    color: '#f7b731',
    stats: {
      speed: '110 km/h',
      clearance: '310 mm',
      engine: '6.7L Turbo Diesel',
      range: '950 km',
      altitudeRating: '5,600m (Mobile Basecamp)',
      terrain: '9.9 / 10'
    },
    description: 'Carries emergency oxygen, spare tires, medical kit, camping pod, and repair station.'
  },
  {
    id: 'superbike' as VehicleType,
    name: 'Ducati Multistrada V4 Rally',
    category: 'Hyper Tourer',
    icon: '⚡',
    color: '#a55eea',
    stats: {
      speed: '230 km/h',
      clearance: '200 mm',
      engine: '1158cc V4 Granturismo',
      range: '490 km',
      altitudeRating: '5,300m (High Performance)',
      terrain: '8.9 / 10'
    },
    description: 'High-speed long-distance cruiser with radar adaptive cruise control and active electronic suspension.'
  }
];

export const COLOR_OPTIONS = [
  { name: 'Cyan Blue', hex: '#00d2ff' },
  { name: 'Crimson Red', hex: '#ff4b2b' },
  { name: 'Matte Stealth Black', hex: '#1e272e' },
  { name: 'Alpine White', hex: '#f5f6fa' },
  { name: 'Solar Yellow', hex: '#f7b731' },
  { name: 'Neon Emerald', hex: '#2ed573' }
];

export default function Vehicle3DViewer({
  vehicleType = 'bike',
  primaryColor,
  isDriving = false,
  driveProgress = 0,
  onProgressUpdate
}: Vehicle3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeColor, setActiveColor] = useState(primaryColor || VEHICLES_DATA.find(v => v.id === vehicleType)?.color || '#00d2ff');
  const [headlightsOn, setHeadlightsOn] = useState(true);
  const [viewMode, setViewMode] = useState<'garage' | 'mountain'>('garage');

  // Update internal color if prop changes
  useEffect(() => {
    if (primaryColor) setActiveColor(primaryColor);
  }, [primaryColor]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c10);
    scene.fog = new THREE.FogExp2(0x0a0c10, 0.025);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(4, 2.5, 5);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(10, 20, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0001;
    scene.add(dirLight);

    // Blue/Cyan Rim Light for metallic aesthetic
    const rimLight = new THREE.DirectionalLight(0x00d2ff, 1.2);
    rimLight.position.set(-10, 8, -10);
    scene.add(rimLight);

    // Under-vehicle ambient glow light
    const pointLight = new THREE.PointLight(THREE.Color.NAMES[activeColor as keyof typeof THREE.Color.NAMES] || activeColor, 2, 8);
    pointLight.position.set(0, 0.5, 0);
    scene.add(pointLight);

    // 5. Environment & Floor Grid / Mountain Road
    const floorGroup = new THREE.Group();
    scene.add(floorGroup);

    // Reflective Circular Platform (Garage Mode)
    const platformGeo = new THREE.CylinderGeometry(4.5, 5, 0.2, 64);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x111622,
      roughness: 0.2,
      metalness: 0.8,
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -0.1;
    platform.receiveShadow = true;
    floorGroup.add(platform);

    // Glowing Platform Ring
    const ringGeo = new THREE.RingGeometry(4.4, 4.5, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(activeColor),
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.01;
    floorGroup.add(ring);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(30, 30, 0x00d2ff, 0x1f293d);
    gridHelper.position.y = -0.11;
    floorGroup.add(gridHelper);

    // Mountain Peaks Background
    const mountainGroup = new THREE.Group();
    for (let i = 0; i < 12; i++) {
      const coneGeo = new THREE.ConeGeometry(3 + Math.random() * 4, 8 + Math.random() * 8, 5);
      const coneMat = new THREE.MeshStandardMaterial({
        color: 0x161e2e,
        flatShading: true,
        roughness: 0.9
      });
      const mtn = new THREE.Mesh(coneGeo, coneMat);
      const angle = (i / 12) * Math.PI * 2;
      const radius = 18 + Math.random() * 5;
      mtn.position.set(Math.cos(angle) * radius, (mtn.geometry.parameters.height / 2) - 2, Math.sin(angle) * radius);
      mountainGroup.add(mtn);
    }
    scene.add(mountainGroup);

    // 6. Dynamic Vehicle Builder
    const vehicleGroup = new THREE.Group();
    scene.add(vehicleGroup);

    const wheels: THREE.Mesh[] = [];
    const headlights: THREE.SpotLight[] = [];
    const headlightMeshes: THREE.Mesh[] = [];

    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeColor),
      metalness: 0.7,
      roughness: 0.2
    });
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x22252a, metalness: 0.9, roughness: 0.3 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.95, roughness: 0.1 });
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x88ccee, transmission: 0.9, opacity: 1, transparent: true, roughness: 0 });
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const brakeLightMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    // Function to create realistic wheel
    const createWheel = (radius: number, width: number) => {
      const group = new THREE.Group();
      // Tire
      const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 24);
      const tire = new THREE.Mesh(tireGeo, rubberMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      group.add(tire);
      // Rim
      const rimGeo = new THREE.CylinderGeometry(radius * 0.65, radius * 0.65, width + 0.02, 12);
      const rim = new THREE.Mesh(rimGeo, chromeMat);
      rim.rotation.z = Math.PI / 2;
      group.add(rim);

      // Spokes / Rim pattern
      for (let i = 0; i < 4; i++) {
        const spokeGeo = new THREE.BoxGeometry(width * 0.8, radius * 1.2, 0.04);
        const spoke = new THREE.Mesh(spokeGeo, darkMetalMat);
        spoke.rotation.x = (i * Math.PI) / 4;
        group.add(spoke);
      }

      wheels.push(tire);
      return group;
    };

    // BUILD VEHICLE MODELS BASED ON TYPE
    if (vehicleType === 'bike' || vehicleType === 'superbike') {
      const isSuper = vehicleType === 'superbike';

      // Chassis/Engine block
      const engineGeo = new THREE.BoxGeometry(0.5, 0.5, 0.7);
      const engine = new THREE.Mesh(engineGeo, darkMetalMat);
      engine.position.set(0, 0.55, 0);
      engine.castShadow = true;
      vehicleGroup.add(engine);

      // Fuel Tank
      const tankGeo = isSuper ? new THREE.ConeGeometry(0.45, 1, 16) : new THREE.BoxGeometry(0.5, 0.45, 0.9);
      const tank = new THREE.Mesh(tankGeo, bodyMat);
      tank.position.set(0, 0.95, 0.1);
      tank.rotation.x = isSuper ? Math.PI / 3 : 0.1;
      tank.castShadow = true;
      vehicleGroup.add(tank);

      // Seat
      const seatGeo = new THREE.BoxGeometry(0.42, 0.15, 0.8);
      const seat = new THREE.Mesh(seatGeo, darkMetalMat);
      seat.position.set(0, 0.9, -0.6);
      seat.castShadow = true;
      vehicleGroup.add(seat);

      // Front Windshield / Fairing
      const fairingGeo = new THREE.BoxGeometry(0.48, 0.6, 0.4);
      const fairing = new THREE.Mesh(fairingGeo, isSuper ? bodyMat : glassMat);
      fairing.position.set(0, 1.15, 0.65);
      fairing.rotation.x = -0.3;
      vehicleGroup.add(fairing);

      // Handlebars
      const barGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.1);
      const bar = new THREE.Mesh(barGeo, chromeMat);
      bar.rotation.z = Math.PI / 2;
      bar.position.set(0, 1.1, 0.55);
      vehicleGroup.add(bar);

      // Front Forks
      const forkL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2), chromeMat);
      forkL.position.set(0.18, 0.6, 0.85);
      forkL.rotation.x = -0.25;
      vehicleGroup.add(forkL);

      const forkR = forkL.clone();
      forkR.position.x = -0.18;
      vehicleGroup.add(forkR);

      // Front & Rear Wheels
      const wheelRadius = isSuper ? 0.38 : 0.45;
      const frontWheel = createWheel(wheelRadius, 0.18);
      frontWheel.position.set(0, wheelRadius, 1.05);
      vehicleGroup.add(frontWheel);

      const rearWheel = createWheel(wheelRadius, 0.22);
      rearWheel.position.set(0, wheelRadius, -0.85);
      vehicleGroup.add(rearWheel);

      // Side Panniers / Luggage Box for Adventure Bike
      if (!isSuper) {
        const boxGeo = new THREE.BoxGeometry(0.35, 0.45, 0.6);
        const boxL = new THREE.Mesh(boxGeo, chromeMat);
        boxL.position.set(0.38, 0.85, -0.7);
        vehicleGroup.add(boxL);
        const boxR = boxL.clone();
        boxR.position.x = -0.38;
        vehicleGroup.add(boxR);
      }

      // Exhaust Pipe
      const pipeGeo = new THREE.CylinderGeometry(0.06, 0.09, 0.9);
      const pipe = new THREE.Mesh(pipeGeo, chromeMat);
      pipe.rotation.x = Math.PI / 2.3;
      pipe.position.set(0.28, 0.45, -0.5);
      vehicleGroup.add(pipe);

      // Headlight Spotlight
      const headSpot = new THREE.SpotLight(0xffffff, 5, 20, Math.PI / 6, 0.5);
      headSpot.position.set(0, 1.05, 0.85);
      headSpot.target.position.set(0, 0.5, 10);
      vehicleGroup.add(headSpot);
      vehicleGroup.add(headSpot.target);
      headlights.push(headSpot);

      // Headlight Lens Mesh
      const lensGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const lens = new THREE.Mesh(lensGeo, headlightMat);
      lens.position.set(0, 1.05, 0.82);
      vehicleGroup.add(lens);
      headlightMeshes.push(lens);

      // Tail Light
      const tailGeo = new THREE.BoxGeometry(0.2, 0.08, 0.05);
      const tail = new THREE.Mesh(tailGeo, brakeLightMat);
      tail.position.set(0, 0.92, -1.05);
      vehicleGroup.add(tail);

    } else if (vehicleType === 'suv') {
      // SUV Body
      const bodyGeo = new THREE.BoxGeometry(1.6, 0.9, 3.2);
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.set(0, 0.9, 0);
      body.castShadow = true;
      vehicleGroup.add(body);

      // Cabin / Roof
      const cabinGeo = new THREE.BoxGeometry(1.5, 0.75, 1.9);
      const cabin = new THREE.Mesh(cabinGeo, bodyMat);
      cabin.position.set(0, 1.6, -0.2);
      cabin.castShadow = true;
      vehicleGroup.add(cabin);

      // Windshield & Windows
      const winFront = new THREE.Mesh(new THREE.PlaneGeometry(1.35, 0.65), glassMat);
      winFront.position.set(0, 1.62, 0.76);
      winFront.rotation.x = -0.2;
      vehicleGroup.add(winFront);

      // Roof Rack & Spare Tire
      const rackGeo = new THREE.BoxGeometry(1.4, 0.1, 1.6);
      const rack = new THREE.Mesh(rackGeo, darkMetalMat);
      rack.position.set(0, 2.02, -0.2);
      vehicleGroup.add(rack);

      const spareTire = createWheel(0.4, 0.22);
      spareTire.rotation.x = Math.PI / 2;
      spareTire.position.set(0, 2.2, -0.3);
      vehicleGroup.add(spareTire);

      // Bullbar / Front Bumper
      const bumperGeo = new THREE.BoxGeometry(1.7, 0.35, 0.3);
      const bumper = new THREE.Mesh(bumperGeo, darkMetalMat);
      bumper.position.set(0, 0.55, 1.65);
      vehicleGroup.add(bumper);

      // 4 SUV Wheels
      const wFL = createWheel(0.42, 0.26);
      wFL.position.set(0.9, 0.42, 1.0);
      vehicleGroup.add(wFL);

      const wFR = createWheel(0.42, 0.26);
      wFR.position.set(-0.9, 0.42, 1.0);
      vehicleGroup.add(wFR);

      const wRL = createWheel(0.42, 0.26);
      wRL.position.set(0.9, 0.42, -1.0);
      vehicleGroup.add(wRL);

      const wRR = createWheel(0.42, 0.26);
      wRR.position.set(-0.9, 0.42, -1.0);
      vehicleGroup.add(wRR);

      // Headlights Spotlight
      const headSpotL = new THREE.SpotLight(0xffffff, 4, 25, Math.PI / 5, 0.4);
      headSpotL.position.set(0.55, 0.95, 1.62);
      headSpotL.target.position.set(0.55, 0.5, 12);
      vehicleGroup.add(headSpotL);
      vehicleGroup.add(headSpotL.target);

      const headSpotR = new THREE.SpotLight(0xffffff, 4, 25, Math.PI / 5, 0.4);
      headSpotR.position.set(-0.55, 0.95, 1.62);
      headSpotR.target.position.set(-0.55, 0.5, 12);
      vehicleGroup.add(headSpotR);
      vehicleGroup.add(headSpotR.target);

      headlights.push(headSpotL, headSpotR);

      // Lens
      const lensL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.05), headlightMat);
      lensL.position.set(0.55, 0.95, 1.61);
      const lensR = lensL.clone();
      lensR.position.x = -0.55;
      vehicleGroup.add(lensL, lensR);
      headlightMeshes.push(lensL, lensR);

    } else if (vehicleType === 'truck') {
      // 6x6 Heavy Expedition Truck Cab
      const cabGeo = new THREE.BoxGeometry(1.8, 1.2, 1.4);
      const cab = new THREE.Mesh(cabGeo, bodyMat);
      cab.position.set(0, 1.3, 1.2);
      cab.castShadow = true;
      vehicleGroup.add(cab);

      // Rear Camper/Expedition Container Pod
      const podGeo = new THREE.BoxGeometry(1.85, 1.5, 2.8);
      const pod = new THREE.Mesh(podGeo, chromeMat);
      pod.position.set(0, 1.5, -0.9);
      pod.castShadow = true;
      vehicleGroup.add(pod);

      // 6 Wheels (3 axles)
      const positionsZ = [1.2, -0.4, -1.5];
      positionsZ.forEach(posZ => {
        const wL = createWheel(0.48, 0.3);
        wL.position.set(1.0, 0.48, posZ);
        vehicleGroup.add(wL);

        const wR = createWheel(0.48, 0.3);
        wR.position.set(-1.0, 0.48, posZ);
        vehicleGroup.add(wR);
      });

      // Front Light Bar
      const lightBarSpot = new THREE.SpotLight(0xffffff, 6, 30, Math.PI / 4, 0.5);
      lightBarSpot.position.set(0, 2.0, 1.9);
      lightBarSpot.target.position.set(0, 0.5, 15);
      vehicleGroup.add(lightBarSpot);
      vehicleGroup.add(lightBarSpot.target);
      headlights.push(lightBarSpot);

      const lensBar = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.15, 0.1), headlightMat);
      lensBar.position.set(0, 1.95, 1.91);
      vehicleGroup.add(lensBar);
      headlightMeshes.push(lensBar);
    }

    // 7. Exhaust Particle System
    const particleCount = 40;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleOpacities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 0.2;
      particlePositions[i * 3 + 1] = 0.3 + Math.random() * 0.2;
      particlePositions[i * 3 + 2] = -1.2 - Math.random() * 0.5;
      particleOpacities[i] = Math.random();
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x888888,
      size: 0.18,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    vehicleGroup.add(particles);

    // 8. Mouse Interactive Orbit Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationY = 0;
    let targetRotationX = 0.2;
    let currentRotationY = 0;
    let currentRotationX = 0.2;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.005;
      targetRotationX = Math.max(-0.2, Math.min(0.8, targetRotationX)); // Limit pitch angle

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(3, Math.min(10, camera.position.z + e.deltaY * 0.005));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // Touch events support for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.006;
      targetRotationX = Math.max(-0.2, Math.min(0.8, targetRotationX));

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => { isDragging = false; };

    domElement.addEventListener('touchstart', onTouchStart);
    domElement.addEventListener('touchmove', onTouchMove);
    domElement.addEventListener('touchend', onTouchEnd);

    // 9. Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth camera interpolation
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;
      currentRotationX += (targetRotationX - currentRotationX) * 0.08;

      if (!isDragging) {
        // Slow auto rotation in garage mode when idle
        targetRotationY += 0.003;
      }

      // Position camera based on spherical coordinates around vehicle
      const dist = camera.position.distanceTo(new THREE.Vector3(0, 0.5, 0));
      camera.position.x = Math.sin(currentRotationY) * Math.cos(currentRotationX) * dist;
      camera.position.z = Math.cos(currentRotationY) * Math.cos(currentRotationX) * dist;
      camera.position.y = Math.sin(currentRotationX) * dist + 0.8;
      camera.lookAt(0, 0.6, 0);

      // Toggle Headlights intensity
      headlights.forEach(hl => { hl.intensity = headlightsOn ? 5 : 0; });
      headlightMeshes.forEach(m => {
        (m.material as THREE.MeshBasicMaterial).color.setHex(headlightsOn ? 0xffffff : 0x333333);
      });

      // Animate wheels if driving
      if (isDriving) {
        wheels.forEach(w => { w.rotation.x += 0.25; });

        // Vehicle subtle suspension vibration
        vehicleGroup.position.y = Math.sin(elapsedTime * 15) * 0.02;
        vehicleGroup.rotation.z = Math.sin(elapsedTime * 8) * 0.015;

        // Animate exhaust smoke particles
        const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < particleCount; i++) {
          let z = posAttr.getZ(i) - 0.08;
          let y = posAttr.getY(i) + 0.01;
          if (z < -3.5) {
            z = -1.0;
            y = 0.3;
          }
          posAttr.setZ(i, z);
          posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;
      } else {
        // Idle gentle breathing animation
        vehicleGroup.position.y = Math.sin(elapsedTime * 2) * 0.008;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('wheel', onWheel);
      domElement.removeEventListener('touchstart', onTouchStart);
      domElement.removeEventListener('touchmove', onTouchMove);
      domElement.removeEventListener('touchend', onTouchEnd);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [vehicleType, activeColor, headlightsOn, isDriving]);

  const activeVehicle = VEHICLES_DATA.find(v => v.id === vehicleType) || VEHICLES_DATA[0];

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gradient-to-b from-neutral-950 via-slate-900 to-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-between">
      
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing" />

      {/* Top Header Overlay */}
      <div className="relative z-10 p-6 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
        <div className="pointer-events-auto bg-black/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{activeVehicle.icon}</span>
            <div>
              <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold">{activeVehicle.category}</span>
              <h3 className="text-2xl font-black text-white">{activeVehicle.name}</h3>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pointer-events-auto flex items-center gap-3 bg-black/60 backdrop-blur-md p-2 rounded-2xl border border-white/10">
          <button
            onClick={() => setHeadlightsOn(!headlightsOn)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              headlightsOn ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            💡 {headlightsOn ? 'Headlights ON' : 'Headlights OFF'}
          </button>
          <div className="text-xs text-gray-400 px-3 hidden sm:block">
            🖱️ Drag to rotate 360° • Scroll to Zoom
          </div>
        </div>
      </div>

      {/* Bottom Specs & Color Selector Overlay */}
      <div className="relative z-10 p-6 flex flex-col md:flex-row items-end justify-between gap-6 pointer-events-none bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-12">
        
        {/* Color Palette Switcher */}
        <div className="pointer-events-auto bg-black/70 backdrop-blur-md p-4 rounded-2xl border border-white/10 w-full md:w-auto">
          <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Custom Livery Paint</p>
          <div className="flex items-center gap-3">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.name}
                onClick={() => setActiveColor(c.hex)}
                style={{ backgroundColor: c.hex }}
                title={c.name}
                className={`w-8 h-8 rounded-full border-2 transition-all transform hover:scale-110 ${
                  activeColor === c.hex ? 'border-white scale-110 ring-4 ring-blue-500/40 shadow-[0_0_15px_#00d2ff]' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Live Vehicle Performance Specs HUD */}
        <div className="pointer-events-auto bg-black/70 backdrop-blur-md p-5 rounded-2xl border border-white/10 w-full md:max-w-xl grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400">Top Speed</span>
            <p className="text-base font-bold text-white flex items-center gap-1">⚡ {activeVehicle.stats.speed}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400">Ground Clearance</span>
            <p className="text-base font-bold text-emerald-400 flex items-center gap-1">🏔️ {activeVehicle.stats.clearance}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400">Altitude Ceiling</span>
            <p className="text-base font-bold text-cyan-400 flex items-center gap-1">📍 {activeVehicle.stats.altitudeRating}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400">Engine / Powertrain</span>
            <p className="text-xs font-semibold text-gray-200">{activeVehicle.stats.engine}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400">Fuel Tank Range</span>
            <p className="text-xs font-semibold text-gray-200">⛽ {activeVehicle.stats.range}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400">Off-Road Index</span>
            <p className="text-xs font-bold text-amber-400">⭐ {activeVehicle.stats.terrain}</p>
          </div>
        </div>

      </div>

    </div>
  );
}
