# 🏔️ RideXL Frontend — 3D Himalayan Expedition & Custom Fleet Planner

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**RideXL Frontend** is a state-of-the-art, photorealistic 3D Himalayan Expedition & Route Planning Web Application built with **Next.js 14**, **Three.js WebGL Particle Physics**, and **Leaflet 3D Map Tracking**. 

Designed for adventure motorcyclists and off-road 4x4 convoys traveling from **Palampur / Manali to Leh Ladakh, Khardung La (5,359m), Pangong Tso, and Spiti Valley**.

---

## 🌟 Key Features

### 1. 🧭 Custom Himalayan Route & Traveler Fleet Planner ("Kitne Log Ja Rahe Hain?")
- **Pickup & Destination Engine**: Select starting location (with 📍 GPS auto-detect) and destination pass.
- **Dynamic Traveler Counter**: Select exact passenger/rider count (1 Solo, 2 Duo, 4 Squad, 6 Group, 10+ Big Convoy).
- **Automated Fleet & Budget Telemetry**: Calculates exact vehicle distribution (Royal Enfield Himalayan 450 Bikes, Mahindra Thar 4x4 SUVs, 6x6 Support Logistics Truck), oxygen cylinder requirements, total group cost, and per-person pricing with bulk group discounts.

### 2. 💨 Website-Wide 3D Cruising Vehicle Switcher
- Choose between **4 Vehicle Classes**:
  - 🏍️ **Himalayan Adventure 450** (Dual-Sport Tourer)
  - 🚀 **KTM / BMW 1000cc Superbike** (High Speed Sport Off-Road)
  - 🚙 **Mahindra Thar 4x4 Expedition** (Extreme Terrain 4WD)
  - 🚚 **6x6 Overland Support Rig** (Mobile Rescue Basecamp)
- **Full-Screen 3D Cruising Overlay**: Switching vehicles triggers a full-screen dynamic 3D vehicle avatar with neon speed trails, headlamp beams, and particle smoke driving across the entire screen!

### 3. ❄️ 4D WebGL Particle Weather & Atmosphere Engine
- **Three.js Particle Physics**: Interactive 100vw x 100vh particle background rendering real-time **Snowfall**, **Monsoon Rain Storms**, and **Windy Desert Dust Storms**.
- **Interactive Cursor Particle Trails**: Glowing WebGL mouse cursor particle trails that react dynamically to user movement.

### 4. 👥 Dynamic Squad Generator ("The Squad")
- Dynamically synchronized with the top traveler counter (`Rider 1`, `Rider 2`, `Rider 3`...).
- Displays assigned vehicle, expedition role (Lead Captain, Navigator, Safety Officer), and high-altitude O2 readiness badge.

### 5. 🫁 High-Altitude Survival Simulator & Readiness Hub
- **Interactive Altitude Slider**: Simulates elevation from 1,470m (Palampur) to 5,328m (Tanglang La Pass).
- **Live Biometric Telemetry**: Real-time blood oxygen saturation ($SpO_2$), barometric pressure ($hPa$), temperature ($^\circ C$), and medical gear checklist.

### 6. 🗺️ Interactive Expedition Map
- **Leaflet Dark Matte Map**: Synchronized 3D vehicle avatar markers, waypoint camera tracking, and altitude profiles.

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Rimpu165/RideXL.git
   cd RideXL
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Open `http://localhost:3000` to view the interactive application.

---

## 🛠️ Tech Stack & Dependencies

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS, Vanilla CSS Glassmorphism |
| **3D & WebGL** | Three.js (`@types/three`) |
| **Animations** | Framer Motion, Lucide React Icons |
| **Maps** | Leaflet, React-Leaflet |

---

## 📁 Project Structure

```
ridexl-frontend/
├── src/
│   ├── app/
│   │   ├── globals.css                # Core design system & WebGL canvas styling
│   │   ├── layout.tsx                 # Root layout metadata
│   │   ├── page.tsx                   # Full-bleed 3D Landing Page
│   │   ├── login/page.tsx             # User Authentication Login
│   │   └── signup/page.tsx            # User Registration Signup
│   └── components/
│       ├── CustomRoutePlanner.tsx     # Route search & traveler counter selector
│       ├── GlobalVehicleSwitcher.tsx  # Vehicle switcher & full-screen 3D cruising effect
│       ├── FourDimensionAtmosphere.tsx# Three.js 4D particle weather physics
│       ├── Vehicle3DViewer.tsx        # WebGL 3D Vehicle Viewer & Livery Picker
│       ├── ExpeditionGearSection.tsx  # Survival simulator & oxygen gauge
│       ├── Interactive3DExpedition.tsx# 3D timeline expedition journey
│       ├── RiderCards.tsx             # Dynamic squad card generator
│       ├── MapWrapper.tsx             # Leaflet map container wrapper
│       └── Map.tsx                    # Interactive dark map & 3D vehicle markers
├── package.json
└── tsconfig.json
```

---

## 📄 License

This project is open source and available under the **MIT License**.
