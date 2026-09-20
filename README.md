# BHARAT EARTH MONITOR (BEM)

> **Monitor Bharat. Detect Change. Inform People.**

Bharat Earth Monitor (BEM) is a secure web-based Earth observation and environmental monitoring platform designed to visualize and manage satellite, GNSS, imagery, and environmental data across India.

## Features & System Modules

1. **🛰 Satellite Network**: Real-time track monitoring, orbital parameters (LEO/SSO), and telemetry health status.
2. **📡 GNSS Receiver**: Satellite ID position tracking, accuracy, satellite count, signal quality (SNR), and live NMEA simulation stream.
3. **🌊 Earth Monitoring**: Comprehensive India map with 4 telemetry channels: Water Movement (+27%), Terrain & Slope Displacement (+12mm), Land & NDVI Vegetation Index (-8%), Atmospheric & Temp (+4.2°C).
4. **🖼 Image Center & Change Detection**: High-res Earth observation archive with before/after comparison slider and spectral delta analysis.
5. **🚨 Environmental Alert Center**: Multi-stage approval workflow (`detection` → `under_review` → `verified` → `approved` → `public_posted`) preventing automated unverified emergency notices.
6. **🔐 Security Operations**: Failed login attempt auditing, data signature HMAC verification, and telemetry quarantine logs.
7. **📊 Intelligence Reports**: Archived dossiers, PDF export, and cryptographic checksum audit stamps.
8. **📢 Public Information & Instagram Workflow**: Automated Meta Graph API caption formatter and live public alert feed.

## Technology Stack

- **Frontend**: React 19, Tailwind CSS v4, Lucide React, Leaflet Maps, React Router 7, Vite 8
- **Backend & Data**: Firebase Authentication, Firestore Data Architecture, Local Reactive Seed Store (BEM Engine)
- **Security & Quality**: Oxlint (0 linter errors), Strict HMAC-SHA256 data provenance stamps, `SIMULATION DATA` visual labeling.

## Getting Started

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Run production build
npm run build
```

## Security & Provenance Policy
All simulated data records are explicitly tagged with `SIMULATION DATA` in accordance with PRD §29.
