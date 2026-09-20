/**
 * Realistic GNSS Simulator & Generator (PRD §7)
 * Generates synthetic NMEA sentences, constellation counts, DOP accuracy, and coordinates.
 * All generated observations are visibly labeled as SIMULATION DATA.
 */

export class GnssSimulator {
  static defaultPresetLocations = [
    { name: "Bengaluru Space Center (ISRO/URSC)", lat: 12.9716, lon: 77.5946, alt: 920 },
    { name: "New Delhi Meteorological Post", lat: 28.6139, lon: 77.2090, alt: 216 },
    { name: "Assam Flood Gauge Sentinel Point", lat: 26.2006, lon: 92.9376, alt: 114 },
    { name: "Western Himalayas Monitoring Station", lat: 30.0668, lon: 79.0193, alt: 2140 },
    { name: "Mumbai Coastal Radar Node", lat: 19.0760, lon: 72.8777, alt: 14 }
  ];

  static generateReading({
    satelliteId = "SAT-001",
    latitude = 12.9716,
    longitude = 77.5946,
    altitude = 450,
    signalQuality = 94,
    satelliteCount = 18,
    simulateCorruption = false
  }) {
    // Add realistic micro-drift (jitter)
    const driftLat = latitude + (Math.random() - 0.5) * 0.0005;
    const driftLon = longitude + (Math.random() - 0.5) * 0.0005;
    const driftAlt = Math.round(altitude + (Math.random() - 0.5) * 2);

    const now = new Date();
    const signature = simulateCorruption 
      ? "corrupted_sig_000" 
      : "hmac_sha256_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    return {
      id: "gnss_" + Date.now(),
      satelliteId,
      sourceId: `DEV-GNSS-${satelliteId}`,
      latitude: parseFloat(driftLat.toFixed(5)),
      longitude: parseFloat(driftLon.toFixed(5)),
      altitude: driftAlt,
      accuracy: parseFloat((2.1 + (100 - signalQuality) * 0.05).toFixed(1)),
      signalQuality: Math.min(100, Math.max(10, signalQuality)),
      satelliteCount: Math.min(32, Math.max(4, satelliteCount)),
      snr: parseFloat((35 + (signalQuality / 100) * 15).toFixed(1)),
      gnssStatus: signalQuality > 40 ? "CONNECTED" : "DEGRADED",
      dataSource: "SIMULATED",
      isSimulation: true,
      timestamp: now.toISOString(),
      signature: signature,
      checksumCorrupted: simulateCorruption,
      nmeaGga: `$GNGGA,${now.toTimeString().split(" ")[0].replace(/:/g, "")}.00,${Math.abs(driftLat).toFixed(4)},N,${Math.abs(driftLon).toFixed(4)},E,1,${satelliteCount},1.0,${driftAlt}.0,M,0.0,M,,*47`
    };
  }
}
