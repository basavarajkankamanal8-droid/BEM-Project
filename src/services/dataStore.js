/**
 * Bharat Earth Monitor (BEM) Local Reactive Data Store (Mock Firestore engine)
 * Supports all 12 collections specified in PRD §25:
 * 1. users
 * 2. satellites
 * 3. gnss_readings
 * 4. sensor_readings
 * 5. earth_observations
 * 6. images
 * 7. alerts
 * 8. security_events
 * 9. public_posts
 * 10. data_sources
 * 11. audit_logs
 * 12. system_settings
 */

const STORAGE_PREFIX = "bem_db_";

// Seed Initial Data if empty
const initialSeed = {
  users: [
    {
      uid: "usr_admin_01",
      name: "Commander Elena Rostova",
      email: "admin@bem.gov.in",
      role: "super_admin",
      status: "active",
      createdAt: "2026-08-15T09:00:00Z",
      mfaEnabled: true,
      lastLogin: "2026-09-19T14:45:10Z"
    },
    {
      uid: "usr_analyst_01",
      name: "Dr. Marcus Vance",
      email: "analyst@bem.gov.in",
      role: "analyst",
      status: "active",
      createdAt: "2026-08-20T11:20:00Z",
      mfaEnabled: false,
      lastLogin: "2026-09-19T13:10:00Z"
    }
  ],
  satellites: [
    {
      satelliteId: "SAT-001",
      name: "BEM-Sat-01 (Sentinel SAR)",
      status: "ONLINE",
      dataSource: "SIMULATED",
      altitudeKm: 540,
      velocityKmh: 27500,
      inclinationDeg: 98.2,
      lastSeen: new Date().toISOString(),
      healthScore: 98.4,
      sensors: ["Synthetic Aperture Radar", "Thermal IR", "L-Band GNSS"]
    },
    {
      satelliteId: "SAT-002",
      name: "BEM-Sat-02 (CartoSat-3)",
      status: "ONLINE",
      dataSource: "SIMULATED",
      altitudeKm: 705,
      velocityKmh: 26800,
      inclinationDeg: 97.8,
      lastSeen: new Date().toISOString(),
      healthScore: 96.1,
      sensors: ["Multispectral Optical", "Atmospheric Sounder"]
    },
    {
      satelliteId: "SAT-003",
      name: "BEM-Sat-03 (EOS-04 Hydro)",
      status: "MAINTENANCE",
      dataSource: "SIMULATED",
      altitudeKm: 815,
      velocityKmh: 25400,
      inclinationDeg: 66.0,
      lastSeen: new Date().toISOString(),
      healthScore: 82.0,
      sensors: ["Altimeter", "Radiometer"]
    }
  ],
  gnss_readings: [
    {
      id: "gnss_001",
      satelliteId: "SAT-001",
      latitude: 12.9716,
      longitude: 77.5946,
      altitude: 450,
      accuracy: 2.8,
      signalQuality: 94,
      satelliteCount: 18,
      dataSource: "SIMULATED",
      timestamp: new Date().toISOString(),
      gnssStatus: "CONNECTED",
      snr: 43.5
    },
    {
      id: "gnss_002",
      satelliteId: "SAT-002",
      latitude: 28.6139,
      longitude: 77.2090,
      altitude: 216,
      accuracy: 3.1,
      signalQuality: 89,
      satelliteCount: 16,
      dataSource: "SIMULATED",
      timestamp: new Date(Date.now() - 60000).toISOString(),
      gnssStatus: "CONNECTED",
      snr: 41.2
    }
  ],
  sensor_readings: [
    {
      id: "sens_01",
      category: "water",
      location: "Ganges Basin Sector 4",
      latitude: 25.3176,
      longitude: 82.9739,
      metricName: "Water Surface Delta",
      value: "+27%",
      status: "CHANGE DETECTED",
      isAnomaly: true,
      dataSource: "SIMULATED",
      timestamp: new Date().toISOString()
    },
    {
      id: "sens_02",
      category: "terrain",
      location: "Western Ghats Slopes B",
      latitude: 15.3173,
      longitude: 75.7139,
      metricName: "Surface Elevation Displacement",
      value: "+12 mm",
      status: "CHANGE DETECTED",
      isAnomaly: true,
      dataSource: "SIMULATED",
      timestamp: new Date().toISOString()
    },
    {
      id: "sens_03",
      category: "land",
      location: "Deccan Plateau Farmlands",
      latitude: 18.5204,
      longitude: 73.8567,
      metricName: "NDVI Vegetation Index",
      value: "0.64 (-8%)",
      status: "NORMAL",
      isAnomaly: false,
      dataSource: "SIMULATED",
      timestamp: new Date().toISOString()
    },
    {
      id: "sens_04",
      category: "atmosphere",
      location: "Metropolitan Air Corridor",
      latitude: 19.0760,
      longitude: 72.8777,
      metricName: "CO2 Column & PM2.5",
      value: "418 ppm / 98 µg/m³",
      temperature: "31.4°C",
      tempDelta: "+4.2°C",
      status: "MODERATE",
      isAnomaly: false,
      dataSource: "SIMULATED",
      timestamp: new Date().toISOString()
    }
  ],
  earth_observations: [
    {
      obsId: "OBS-000142",
      title: "Sudden Water Accumulation in River Basin",
      category: "WATER CHANGE",
      location: "Assam Valley Zone 3",
      latitude: 26.2006,
      longitude: 92.9376,
      timestamp: new Date().toISOString(),
      source: "SIMULATED SATELLITE",
      status: "UNDER REVIEW",
      isPublic: false,
      reviewer: "Dr. Marcus Vance",
      changePercentage: "+27%",
      description: "Severe post-monsoon water level surge detected through SAR polarization delta."
    },
    {
      obsId: "OBS-000141",
      title: "Terrain Slope Movement Risk",
      category: "TERRAIN CHANGE",
      location: "Himalayan Foothill Corridor",
      latitude: 30.0668,
      longitude: 79.0193,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      source: "SIMULATED SATELLITE",
      status: "VERIFIED",
      isPublic: true,
      reviewer: "Commander Elena Rostova",
      changePercentage: "+12%",
      description: "InSAR interferometric fringe shows active ground displacement above threshold."
    }
  ],
  images: [
    {
      id: "img_001",
      obsId: "OBS-000142",
      title: "Brahmaputra Flood Plain Radar Analysis",
      beforeUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      afterUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      source: "SIMULATED SATELLITE",
      category: "WATER_CHANGE",
      latitude: 26.2006,
      longitude: 92.9376,
      timestamp: "19 September 2026",
      isPublic: true,
      status: "APPROVED",
      reviewer: "Elena Rostova"
    },
    {
      id: "img_002",
      obsId: "OBS-000141",
      title: "Uttarakhand Ridge Elevation Shift",
      beforeUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      afterUrl: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80",
      source: "SIMULATED SATELLITE",
      category: "TERRAIN_CHANGE",
      latitude: 30.0668,
      longitude: 79.0193,
      timestamp: "18 September 2026",
      isPublic: true,
      status: "APPROVED",
      reviewer: "Marcus Vance"
    }
  ],
  alerts: [
    {
      alertId: "ALT-2026-089",
      type: "FLOOD_WATER",
      location: "Assam Valley Zone 3",
      severity: "CRITICAL",
      description: "Water surface increase of +27% exceeds seasonal safety margins. Risk of flash overflow in lowlands.",
      evidence: "OBS-000142 (Synthetic Aperture Radar)",
      status: "under_review",
      reviewedBy: "Dr. Marcus Vance",
      dataSource: "SIMULATION DATA",
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      alertId: "ALT-2026-088",
      type: "TERRAIN_LANDSLIDE",
      location: "Himalayan Foothill Corridor",
      severity: "HIGH_PRIORITY",
      description: "Surface deformation of +12mm over 48h indicates high landslide risk along Highway 58.",
      evidence: "OBS-000141 (InSAR Phase Shift)",
      status: "approved",
      reviewedBy: "Commander Elena Rostova",
      dataSource: "SIMULATION DATA",
      createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
      alertId: "ALT-2026-087",
      type: "DATA_INTEGRITY",
      location: "Ground Telemetry Node 4 (Bengaluru)",
      severity: "OBSERVATION",
      description: "Checksum mismatch on simulated feed channel #3. Frame quarantined for cryptographic review.",
      evidence: "SIG-ERR-902",
      status: "resolved",
      reviewedBy: "Commander Elena Rostova",
      dataSource: "SIMULATION DATA",
      createdAt: new Date(Date.now() - 14400000).toISOString()
    }
  ],
  security_events: [
    {
      eventId: "SEC-9041",
      source: "UNKNOWN_TERMINAL (IP 198.51.100.42)",
      event: "Invalid Data Signature Checksum",
      severity: "CRITICAL",
      action: "DATA QUARANTINED",
      status: "UNDER REVIEW",
      timestamp: new Date().toISOString(),
      rawPayloadPreview: "0x7F4A09C... [Corrupted or Spoofed Header]",
      details: "Attempted injection to GNSS feed without valid HMAC key."
    },
    {
      eventId: "SEC-9040",
      source: "AUTH_GATEWAY",
      event: "Multiple Failed Login Attempts (Rate Limit Triggered)",
      severity: "HIGH",
      action: "IP TEMPORARILY BLOCKED",
      status: "RESOLVED",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      rawPayloadPreview: "Failed attempts: 5 in 60 seconds",
      details: "Automatic lockout threshold enforced."
    }
  ],
  public_posts: [
    {
      postId: "POST-2026-014",
      alertId: "ALT-2026-088",
      headline: "🚨 ENVIRONMENTAL UPDATE — Himalayan Foothill Slope Movement Verified",
      location: "Himalayan Foothill Corridor, Sector 2",
      detectionTime: "18 Sep 2026 14:30 UTC",
      status: "PUBLISHED",
      channel: "OFFICIAL_INSTAGRAM",
      externalUrl: "https://instagram.com/p/bem_earth_2026014",
      caption: `🚨 OFFICIAL BHARAT EARTH MONITOR (BEM) ALERT
Location: Himalayan Foothill Corridor
Event: Surface terrain displacement detected (+12mm)
Status: Human Verified by Commander Elena Rostova
Data Source: Bharat Earth Monitor System (Simulation Mode)

All district administration notices have been flagged. Local travel advisories recommended.
#BharatEarthMonitor #BEM #EarthMonitoring #SatelliteIntelligence #SafetyAlert`,
      postedAt: "2026-09-18T16:00:00Z",
      approvedBy: "Elena Rostova"
    }
  ],
  data_sources: [
    {
      id: "src_01",
      name: "BEM Simulated Constellation Gateway",
      type: "SIMULATION",
      status: "ACTIVE",
      protocol: "NMEA 0183 / JSON Telemetry",
      latencyMs: 14,
      lastHandshake: new Date().toISOString()
    },
    {
      id: "src_02",
      name: "ISRO / Copernicus Open Data Gateway (Standby)",
      type: "REAL_DATA_PENDING",
      status: "CONFIGURED_STANDBY",
      protocol: "OData / REST API",
      latencyMs: 0,
      lastHandshake: "Standby for API token"
    }
  ],
  audit_logs: [
    {
      id: "aud_01",
      actor: "Commander Elena Rostova",
      action: "APPROVE_PUBLIC_ALERT",
      target: "ALT-2026-088",
      timestamp: "2026-09-18T15:58:10Z",
      ipAddress: "10.0.4.1"
    },
    {
      id: "aud_02",
      actor: "Dr. Marcus Vance",
      action: "FLAG_WATER_ANOMALY",
      target: "OBS-000142",
      timestamp: "2026-09-19T14:30:00Z",
      ipAddress: "10.0.4.9"
    }
  ],
  system_settings: {
    systemName: "Bharat Earth Monitor (BEM) Operations Center",
    operationalMode: "SIMULATION_TESTBED",
    allowSimulatedInjection: true,
    requireTwoFactorForAlertApproval: true,
    quarantineOnSignatureFailure: true,
    telemetryBroadcastRateSeconds: 5,
    instagramAutoPublishEnabled: false // PRD Rule: Never auto-publish unverified alerts
  },
  citizen_alert_reports: [
    {
      reportId: "BEM-ALERT-000001",
      userId: "usr_citizen_01",
      reporterName: "Basavaraj Kankamanal",
      eventType: "Heavy Rainfall",
      placeName: "Madikeri",
      nearbyLandmark: "Madikeri Bus Stand",
      district: "Kodagu",
      state: "Karnataka",
      pinCode: "571201",
      reportedThreatLevel: "MEDIUM",
      description: "Continuous heavy rainfall for past 6 hours. Water level rising fast near the drainage channel adjacent to the bus terminal.",
      incidentDate: "2026-09-26",
      incidentTime: "09:30 PM",
      imageUrl: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=800&q=80",
      status: "PENDING REVIEW",
      verifiedThreatLevel: null,
      adminReason: "",
      adminNotes: "",
      reviewedBy: null,
      submittedAt: "2026-09-26T21:30:00Z",
      reviewedAt: null,
      publishedAt: null,
      source: "CITIZEN REPORT"
    },
    {
      reportId: "BEM-ALERT-000002",
      userId: "usr_citizen_02",
      reporterName: "Aarav Sharma",
      eventType: "Flood",
      placeName: "Tezpur Riverside",
      nearbyLandmark: "Old Brahmaputra Bridge Checkpost",
      district: "Sonitpur",
      state: "Assam",
      pinCode: "784001",
      reportedThreatLevel: "HIGH",
      description: "Brahmaputra overflowed banks into adjacent lower agrarian fields. Road partially submerged.",
      incidentDate: "2026-09-26",
      incidentTime: "06:15 PM",
      imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      status: "VERIFIED",
      verifiedThreatLevel: "HIGH",
      adminReason: "Cross-verified with SAR satellite pass OBS-000142 showing +27% inundation.",
      adminNotes: "Public warning broadcasted and marked on India Map.",
      reviewedBy: "Dr. Marcus Vance",
      submittedAt: "2026-09-26T18:15:00Z",
      reviewedAt: "2026-09-26T19:00:00Z",
      publishedAt: "2026-09-26T19:05:00Z",
      source: "CITIZEN REPORT"
    },
    {
      reportId: "BEM-ALERT-000003",
      userId: "usr_citizen_03",
      reporterName: "Pooja Patel",
      eventType: "Landslide",
      placeName: "Joshimath Sector 4",
      nearbyLandmark: "Near Government High School",
      district: "Chamoli",
      state: "Uttarakhand",
      pinCode: "246443",
      reportedThreatLevel: "CRITICAL",
      description: "Minor rockfall and crack expansion observed on roadside retaining wall.",
      incidentDate: "2026-09-25",
      incidentTime: "02:40 PM",
      imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      status: "ON HOLD",
      verifiedThreatLevel: null,
      adminReason: "Pending local field team ground check before public alert issuance.",
      adminNotes: "Dispatched InSAR analysis task to verify ground displacement rate.",
      reviewedBy: "Commander Elena Rostova",
      submittedAt: "2026-09-25T14:40:00Z",
      reviewedAt: "2026-09-25T15:20:00Z",
      publishedAt: null,
      source: "CITIZEN REPORT"
    }
  ]
};

class BemDataStore {
  constructor() {
    this.init();
  }

  init() {
    for (const [key, value] of Object.entries(initialSeed)) {
      if (!localStorage.getItem(STORAGE_PREFIX + key)) {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      }
    }
  }

  get(collection) {
    const raw = localStorage.getItem(STORAGE_PREFIX + collection);
    if (!raw && initialSeed[collection]) {
      localStorage.setItem(STORAGE_PREFIX + collection, JSON.stringify(initialSeed[collection]));
      return initialSeed[collection];
    }
    return raw ? JSON.parse(raw) : [];
  }

  save(collection, data) {
    localStorage.setItem(STORAGE_PREFIX + collection, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(`bem_${collection}_update`, { detail: data }));
  }

  subscribe(collection, callback) {
    const handler = (e) => callback(e.detail);
    window.addEventListener(`bem_${collection}_update`, handler);
    return () => window.removeEventListener(`bem_${collection}_update`, handler);
  }

  add(collection, item) {
    const list = this.get(collection);
    const updated = [item, ...list];
    this.save(collection, updated);
    return item;
  }

  update(collection, predicate, updater) {
    const list = this.get(collection);
    const updated = list.map(item => predicate(item) ? { ...item, ...updater } : item);
    this.save(collection, updated);
    return updated;
  }

  resetToDefault() {
    for (const [key, value] of Object.entries(initialSeed)) {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    }
    window.location.reload();
  }
}

export const dataStore = new BemDataStore();
