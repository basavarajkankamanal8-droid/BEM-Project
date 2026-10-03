import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon paths in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// India boundary coordinates (simplified outline polygon)
const INDIA_BOUNDARY = [
  [35.5, 74.0], [36.9, 74.8], [37.0, 76.0], [36.5, 77.8], [35.2, 78.0],
  [34.5, 77.0], [33.5, 76.5], [32.5, 76.0], [31.5, 77.0], [30.5, 78.0],
  [30.0, 79.0], [29.5, 80.0], [29.0, 81.0], [28.5, 82.5], [27.5, 83.5],
  [27.0, 84.5], [26.5, 85.5], [26.0, 87.0], [26.5, 88.5], [27.5, 89.0],
  [28.0, 88.5], [27.0, 88.0], [26.0, 89.0], [25.5, 89.5], [24.5, 89.5],
  [24.0, 89.0], [23.5, 88.5], [22.5, 88.8], [21.5, 89.0], [22.0, 88.5],
  [21.5, 87.5], [21.0, 86.5], [20.5, 85.0], [19.5, 84.5], [18.5, 83.5],
  [17.5, 82.5], [16.5, 81.5], [15.5, 80.5], [14.5, 80.0], [13.5, 80.2],
  [12.5, 80.0], [11.5, 79.8], [10.5, 79.5], [9.5, 79.0], [8.0, 77.5],
  [8.5, 77.0], [9.5, 76.0], [10.0, 76.5], [11.0, 75.5], [12.0, 75.0],
  [13.5, 74.5], [14.5, 74.0], [15.5, 73.8], [17.0, 73.0], [18.5, 72.8],
  [20.0, 72.7], [21.5, 72.5], [22.5, 69.5], [23.5, 68.5], [24.0, 68.5],
  [24.5, 69.0], [24.5, 70.5], [25.0, 71.0], [26.0, 70.5], [27.0, 70.0],
  [28.0, 70.5], [29.0, 71.0], [30.0, 71.5], [31.0, 72.0], [32.0, 73.0],
  [33.5, 74.0], [34.5, 74.0], [35.5, 74.0],
];

// Major Indian monitoring stations
const MONITORING_STATIONS = [
  { name: "BEM-BLR", city: "Bengaluru", lat: 12.9716, lng: 77.5946, type: "PRIMARY HQ", status: "ACTIVE" },
  { name: "BEM-DEL", city: "New Delhi", lat: 28.6139, lng: 77.2090, type: "GNSS NODE", status: "ACTIVE" },
  { name: "BEM-MUM", city: "Mumbai", lat: 19.0760, lng: 72.8777, type: "COASTAL", status: "ACTIVE" },
  { name: "BEM-CHE", city: "Chennai", lat: 13.0827, lng: 80.2707, type: "SAR RELAY", status: "ACTIVE" },
  { name: "BEM-KOL", city: "Kolkata", lat: 22.5726, lng: 88.3639, type: "FLOOD MONITOR", status: "ACTIVE" },
  { name: "BEM-HYD", city: "Hyderabad", lat: 17.3850, lng: 78.4867, type: "EARTH OBS", status: "ACTIVE" },
  { name: "BEM-AHM", city: "Ahmedabad", lat: 23.0225, lng: 72.5714, type: "ISRO RELAY", status: "ACTIVE" },
  { name: "BEM-PUN", city: "Pune", lat: 18.5204, lng: 73.8567, type: "WEATHER", status: "ACTIVE" },
  { name: "BEM-JAI", city: "Jaipur", lat: 26.9124, lng: 75.7873, type: "TERRAIN", status: "STANDBY" },
  { name: "BEM-LUC", city: "Lucknow", lat: 26.8467, lng: 80.9462, type: "REGIONAL", status: "ACTIVE" },
  { name: "BEM-GUW", city: "Guwahati", lat: 26.1445, lng: 91.7362, type: "NE REGION", status: "ACTIVE" },
  { name: "BEM-SRI", city: "Srinagar", lat: 34.0837, lng: 74.7973, type: "TERRAIN", status: "STANDBY" },
  { name: "BEM-GOA", city: "Goa", lat: 15.2993, lng: 74.1240, type: "COASTAL", status: "ACTIVE" },
  { name: "BEM-VIS", city: "Visakhapatnam", lat: 17.6868, lng: 83.2185, type: "NAVAL OBS", status: "ACTIVE" },
  { name: "BEM-LEH", city: "Leh", lat: 34.1526, lng: 77.5771, type: "HIGH ALT", status: "STANDBY" },
  { name: "BEM-ANP", city: "Port Blair", lat: 11.6234, lng: 92.7265, type: "ISLAND OBS", status: "ACTIVE" },
];

export const EarthMap = ({
  center = [22.0, 78.5],
  zoom = 5,
  satellites = [],
  markers = [],
  alertMarkers = [],
  height = "420px",
  showStations = true,
  showBoundary = true,
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet map with dark ESRI or CartoDB tile layer
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: true,
        attributionControl: false,
        maxBounds: [[0, 55], [42, 100]],
        minZoom: 4,
      });

      // Dark theme CartoDB Dark Matter tile layer
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        subdomains: "abcd",
      }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      // cleanup handled on component unmount
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers, satellite tracks, boundaries and stations
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();

    // India boundary outline
    if (showBoundary) {
      L.polygon(INDIA_BOUNDARY, {
        color: "#FF6B35",
        weight: 1.5,
        opacity: 0.5,
        fillColor: "#FF6B35",
        fillOpacity: 0.03,
        dashArray: "6, 4",
      }).addTo(layerGroupRef.current);
    }

    // Custom satellite marker icon (Glowing #FF6B35 Orange Beacon)
    const satelliteIcon = L.divIcon({
      className: "bem-satellite-pin",
      html: `<div style="
        width: 16px; 
        height: 16px; 
        background: #FF6B35; 
        border: 2px solid #ffffff; 
        border-radius: 50%; 
        box-shadow: 0 0 16px #FF6B35, 0 0 32px rgba(255, 107, 53, 0.4);
      "></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    const alertIcon = L.divIcon({
      className: "bem-alert-pin",
      html: `<div style="
        width: 16px; 
        height: 16px; 
        background: #ef4444; 
        border: 2px solid #ffffff; 
        border-radius: 50%; 
        box-shadow: 0 0 16px #ef4444;
        animation: pulse 1.5s infinite;
      "></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    // Monitoring station icons
    const stationIcon = (status) => L.divIcon({
      className: "bem-station-pin",
      html: `<div style="
        width: 10px; height: 10px;
        background: ${status === "ACTIVE" ? "#10b981" : "#f59e0b"};
        border: 1.5px solid rgba(255,255,255,0.8);
        border-radius: 50%;
        box-shadow: 0 0 8px ${status === "ACTIVE" ? "rgba(16,185,129,0.6)" : "rgba(245,158,11,0.6)"};
      "></div>`,
      iconSize: [10, 10],
      iconAnchor: [5, 5]
    });

    // Render monitoring stations
    if (showStations) {
      MONITORING_STATIONS.forEach(station => {
        const marker = L.marker([station.lat, station.lng], { icon: stationIcon(station.status) })
          .addTo(layerGroupRef.current);
        marker.bindPopup(`
          <div style="background: #141414; color: #fff; padding: 10px 14px; font-family: 'JetBrains Mono', monospace; border-radius: 8px; border: 1px solid #262626; min-width: 180px;">
            <div style="font-size: 12px; font-weight: 700; color: #FF6B35; margin-bottom: 6px;">⬡ ${station.name}</div>
            <div style="font-size: 11px; color: #d4d4d4; margin-bottom: 2px;">${station.city}</div>
            <div style="font-size: 10px; color: #888;">Type: ${station.type}</div>
            <div style="display: flex; align-items: center; gap: 4px; margin-top: 6px;">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: ${station.status === "ACTIVE" ? "#10b981" : "#f59e0b"};"></span>
              <span style="font-size: 10px; color: ${station.status === "ACTIVE" ? "#10b981" : "#f59e0b"}; font-weight: 700;">${station.status}</span>
            </div>
            <div style="font-size: 9px; color: #FF6B35; margin-top: 6px;">[SIMULATION DATA]</div>
          </div>
        `);
      });
    }

    // Render satellites
    satellites.forEach(sat => {
      const lat = sat.latitude || 12.9716;
      const lon = sat.longitude || 77.5946;
      
      const marker = L.marker([lat, lon], { icon: satelliteIcon }).addTo(layerGroupRef.current);
      marker.bindPopup(`
        <div style="background: #141414; color: #fff; padding: 10px 14px; font-family: 'JetBrains Mono', monospace; border-radius: 8px; border: 1px solid #262626;">
          <b style="color: #FF6B35;">🛰 ${sat.name || sat.satelliteId}</b><br/>
          <span style="color: #a3a3a3;">Status: ${sat.status}</span><br/>
          <span style="color: #a3a3a3;">Alt: ${sat.altitudeKm || 540} km</span><br/>
          <span style="color: #FF6B35; font-size: 10px;">[SIMULATION DATA]</span>
        </div>
      `);
    });

    // Render environmental markers / alerts (from props)
    markers.forEach(item => {
      const lat = item.latitude || 25.3176;
      const lon = item.longitude || 82.9739;
      
      const marker = L.marker([lat, lon], { icon: alertIcon }).addTo(layerGroupRef.current);
      marker.bindPopup(`
        <div style="background: #141414; color: #fff; padding: 10px 14px; font-family: sans-serif; border-radius: 8px; border: 1px solid #262626;">
          <b style="color: #ef4444;">🚨 ${item.title || item.type || "Alert Event"}</b><br/>
          <p style="font-size: 11px; margin: 4px 0; color: #d4d4d4;">${item.location || ""}</p>
          <span style="color: #FF6B35; font-size: 10px; font-family: monospace;">[SIMULATION DATA]</span>
        </div>
      `);
    });

    // Render alert markers with severity-based colors
    const severityColors = {
      CRITICAL: "#ef4444",
      HIGH: "#FF6B35",
      HIGH_PRIORITY: "#FF6B35",
      MEDIUM: "#f59e0b",
      MODERATE: "#f59e0b",
      LOW: "#10b981",
      OBSERVATION: "#888888",
    };
    
    (alertMarkers || []).forEach(alert => {
      const lat = alert.latitude ?? alert.lat;
      const lng = alert.longitude ?? alert.lng;
      if (!lat || !lng) return;
      const color = severityColors[alert.severity] || severityColors[alert.threatLevel] || "#FF6B35";
      const icon = L.divIcon({
        className: "bem-severity-pin",
        html: `<div style="
          width: 14px; height: 14px;
          background: ${color};
          border: 2px solid rgba(255,255,255,0.8);
          border-radius: 50%;
          box-shadow: 0 0 12px ${color};
          animation: pulse 2s infinite;
        "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });
      const marker = L.marker([lat, lng], { icon }).addTo(layerGroupRef.current);
      marker.bindPopup(`
        <div style="background: #141414; color: #fff; padding: 10px 14px; font-family: 'JetBrains Mono', monospace; border-radius: 8px; border: 1px solid ${color}40; min-width: 210px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; color: ${color}; letter-spacing: 0.08em;">${alert.severity || alert.threatLevel || "ALERT"}</span>
            <span style="font-size: 8px; color: ${alert.isVerified ? "#10b981" : "#FF6B35"}; font-weight: 700; padding: 1px 5px; border-radius: 3px; background: ${alert.isVerified ? "rgba(16,185,129,0.15)" : "rgba(255,107,53,0.15)"};">${alert.isVerified ? "VERIFIED ADVISORY" : "SIMULATION DATA"}</span>
          </div>
          <div style="font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 6px;">${alert.type?.replace(/_/g, " ") || "Alert"}</div>
          <div style="font-size: 11px; color: #a3a3a3; margin-bottom: 4px;">📍 ${alert.location || alert.placeName || "Unknown"}</div>
          <div style="font-size: 10px; color: #666;">Status: ${(alert.status || "VERIFIED").replace(/_/g, " ").toUpperCase()}</div>
          ${alert.description ? `<p style="font-size: 10px; color: #888; margin: 6px 0 0; line-height: 1.3;">${alert.description.slice(0, 110)}...</p>` : ""}
        </div>
      `);
    });

  }, [satellites, markers, alertMarkers, showStations, showBoundary]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-[#262626] bg-[#0f0f0f] shadow-xl">
      <div 
        ref={mapContainerRef} 
        style={{ height: height, width: "100%" }} 
        className="z-0"
      />
      
      {/* Overlay map header */}
      <div className="absolute top-3 left-3 z-10 bg-[#141414]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#262626] text-xs font-mono flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse"></span>
        <span className="text-[#ededed] font-semibold">INDIA GEOSPATIAL ORBITAL TRACKER</span>
      </div>

      {/* Legend */}
      {showStations && (
        <div className="absolute bottom-3 left-3 z-10 bg-[#141414]/90 backdrop-blur-md px-3 py-2 rounded-lg border border-[#262626]">
          <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#666", letterSpacing: "0.08em", marginBottom: 6, fontWeight: 700 }}>
            MONITORING NETWORK
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { color: "#10b981", label: "Active Station" },
              { color: "#f59e0b", label: "Standby Station" },
              { color: "#FF6B35", label: "Satellite Track" },
              { color: "#ef4444", label: "Alert Marker" },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, boxShadow: `0 0 4px ${color}`, flexShrink: 0 }} />
                <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#aaa" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="absolute bottom-3 right-3 z-10 bg-[#141414]/90 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-[#888888] border border-[#262626]">
        WGS84 PROJECTION | CARTODB DARK
      </div>
    </div>
  );
};
