import React, { useState } from "react";
import { dataStore } from "../../services/dataStore";
import { DataBadge } from "../../components/layout/DataBadge";
import { EarthMap } from "../../components/map/EarthMap";
import { 
  Satellite, 
  Activity, 
  Orbit, 
  Layers,
  Radio,
  ShieldCheck,
  Wifi,
  WifiOff,
  Server,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export const SatelliteData = () => {
  const [satellites] = useState(() => dataStore.get("satellites"));
  const [dataSources] = useState(() => [
    {
      sourceId: "SRC-ISRO-NAV",
      name: "NavIC Ground Ingest Gateway",
      sourceType: "REAL_APPROVED",
      category: "GNSS / PNT",
      status: "ACTIVE",
      connectionStatus: "ONLINE",
      authStatus: "AUTHENTICATED",
      lastUpdate: "3 seconds ago",
      frequency: "L5 / S-Band",
      dataIntegrity: "100% SHA-256",
      isSimulated: false
    },
    {
      sourceId: "SRC-ISRO-EOS4",
      name: "EOS-04 Radar Ingest Relay",
      sourceType: "REAL_APPROVED",
      category: "Earth Observation SAR",
      status: "ACTIVE",
      connectionStatus: "ONLINE",
      authStatus: "AUTHENTICATED",
      lastUpdate: "18 seconds ago",
      frequency: "C-Band SAR",
      dataIntegrity: "99.8% SHA-256",
      isSimulated: false
    },
    {
      sourceId: "SRC-SIM-ORBIT-01",
      name: "BEM Synthetic Constellation Streamer",
      sourceType: "SIMULATED",
      category: "Multi-Source Simulation",
      status: "ACTIVE",
      connectionStatus: "ONLINE",
      authStatus: "VERIFIED_TEST_BED",
      lastUpdate: "Just now",
      frequency: "Loopback Telemetry",
      dataIntegrity: "Mock CRC32",
      isSimulated: true
    },
    {
      sourceId: "SRC-INSAT-3DR",
      name: "INSAT-3DR Meteorological Imager",
      sourceType: "REAL_APPROVED",
      category: "Atmospheric & Weather",
      status: "ACTIVE",
      connectionStatus: "ONLINE",
      authStatus: "AUTHENTICATED",
      lastUpdate: "1 minute ago",
      frequency: "Sounder/Imager",
      dataIntegrity: "100% Verified",
      isSimulated: false
    },
    {
      sourceId: "SRC-COPERNICUS-SAR",
      name: "Copernicus Open Access Hub Relay",
      sourceType: "OFFLINE",
      category: "Global Radar Archive",
      status: "STANDBY",
      connectionStatus: "OFFLINE",
      authStatus: "TOKEN_EXPIRED",
      lastUpdate: "2 hours ago",
      frequency: "REST API HTTPS",
      dataIntegrity: "Awaiting Refresh",
      isSimulated: false
    }
  ]);

  const [activeTab, setActiveTab] = useState("satellites"); // 'satellites' or 'sources'
  const [selectedSat, setSelectedSat] = useState(satellites[0]);
  const [sourceFilter, setSourceFilter] = useState("ALL");

  const filteredSources = dataSources.filter(src => {
    if (sourceFilter === "REAL") return src.sourceType === "REAL_APPROVED";
    if (sourceFilter === "SIMULATED") return src.sourceType === "SIMULATED";
    if (sourceFilter === "OFFLINE") return src.sourceType === "OFFLINE";
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-5 rounded-xl border border-[#262626]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white flex items-center gap-2 font-display">
              <Satellite className="w-5 h-5 text-[#FF6B35]" />
              SATELLITE & DATA SOURCE NETWORK
            </h1>
            <DataBadge isSimulation={true} />
          </div>
          <p className="text-xs text-[#a3a3a3] mt-1">
            Real-time orbital tracking, multi-source telemetry validation, and source authentication status (PRD §19).
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-[#0f0f0f] p-1 rounded-lg border border-[#262626]">
          <button
            onClick={() => setActiveTab("satellites")}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
              activeTab === "satellites"
                ? "bg-[#FF6B35] text-[#0f0f0f]"
                : "text-[#888888] hover:text-white"
            }`}
          >
            SATELLITE PLATFORMS ({satellites.length})
          </button>
          <button
            onClick={() => setActiveTab("sources")}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
              activeTab === "sources"
                ? "bg-[#FF6B35] text-[#0f0f0f]"
                : "text-[#888888] hover:text-white"
            }`}
          >
            DATA SOURCES ({dataSources.length})
          </button>
        </div>
      </div>

      {activeTab === "satellites" && (
        <>
          {/* Orbit Visualization Map */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-white font-display flex items-center gap-2">
              <Orbit className="w-4 h-4 text-[#FF6B35]" />
              ACTIVE ORBITAL GROUND TRACK
            </h2>
            <EarthMap satellites={satellites} height="360px" />
          </div>

          {/* Constellation Catalog & Payload Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Satellites List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#888888] font-mono uppercase">
                CONSTELLATION PLATFORMS
              </h3>

              <div className="space-y-2">
                {satellites.map((sat) => (
                  <div
                    key={sat.satelliteId}
                    onClick={() => setSelectedSat(sat)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedSat.satelliteId === sat.satelliteId
                        ? "bg-[#1f1f1f] border-[#FF6B35] shadow-lg shadow-[#FF6B35]/15"
                        : "bg-[#141414] border-[#262626] hover:border-[#333333]"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-mono mb-1">
                      <span className="font-bold text-white">{sat.satelliteId}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sat.status === "ONLINE"
                          ? "bg-[#10b981]/20 text-[#10b981]"
                          : "bg-[#f59e0b]/20 text-[#f59e0b]"
                      }`}>
                        ● {sat.status}
                      </span>
                    </div>
                    <div className="text-xs text-[#d4d4d4] font-semibold">{sat.name}</div>
                    <div className="flex justify-between text-[11px] font-mono text-[#888888] mt-2">
                      <span>Alt: {sat.altitudeKm} km</span>
                      <span>Health: {sat.healthScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 2 cols: Subsystem Diagnostics */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-5 rounded-xl bg-[#141414] border border-[#262626] space-y-4">
                <div className="flex justify-between items-center border-b border-[#262626] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white font-display">{selectedSat.name}</h3>
                    <span className="text-xs font-mono text-[#FF6B35]">{selectedSat.satelliteId}</span>
                  </div>
                  <DataBadge isSimulation={true} size="xs" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="p-3 bg-[#0f0f0f] rounded-lg border border-[#262626]">
                    <span className="text-[#888888] block text-[10px]">ORBITAL ALTITUDE</span>
                    <span className="text-lg font-bold text-white">{selectedSat.altitudeKm} km</span>
                    <span className="text-[#737373] text-[10px]">Sun-synchronous LEO</span>
                  </div>
                  <div className="p-3 bg-[#0f0f0f] rounded-lg border border-[#262626]">
                    <span className="text-[#888888] block text-[10px]">ORBITAL VELOCITY</span>
                    <span className="text-lg font-bold text-[#FF6B35]">{selectedSat.velocityKmh.toLocaleString()} km/h</span>
                    <span className="text-[#737373] text-[10px]">7.6 km/s orbital</span>
                  </div>
                  <div className="p-3 bg-[#0f0f0f] rounded-lg border border-[#262626]">
                    <span className="text-[#888888] block text-[10px]">INCLINATION</span>
                    <span className="text-lg font-bold text-[#f59e0b]">{selectedSat.inclinationDeg}°</span>
                    <span className="text-[#737373] text-[10px]">Polar Coverage</span>
                  </div>
                  <div className="p-3 bg-[#0f0f0f] rounded-lg border border-[#262626]">
                    <span className="text-[#888888] block text-[10px]">HEALTH SCORE</span>
                    <span className="text-lg font-bold text-[#10b981]">{selectedSat.healthScore}%</span>
                    <span className="text-[#737373] text-[10px]">Nominal status</span>
                  </div>
                </div>

                {/* Instrument Payload details */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-mono text-[#888888] uppercase font-bold">
                    Connected Sensor Instrumentation Subsystems:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSat.sensors.map((sensor, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg bg-[#0f0f0f] border border-[#262626] text-xs font-mono text-[#ededed] flex items-center gap-1.5"
                      >
                        <Layers className="w-3 h-3 text-[#FF6B35]" />
                        <span>{sensor}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </>
      )}

      {/* ── DATA SOURCES TAB (PRD §19) ── */}
      {activeTab === "sources" && (
        <div className="space-y-4">
          {/* Classification Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#141414] p-4 rounded-xl border border-[#262626]">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[#FF6B35]" />
              <span className="text-xs font-mono font-bold text-white">DATA SOURCE NETWORK REGISTRY</span>
            </div>

            <div className="flex items-center gap-2">
              {["ALL", "REAL", "SIMULATED", "OFFLINE"].map(f => (
                <button
                  key={f}
                  onClick={() => setSourceFilter(f)}
                  className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                    sourceFilter === f
                      ? "bg-[#FF6B35] text-[#0f0f0f]"
                      : "bg-[#0f0f0f] text-[#888888] hover:text-white border border-[#262626]"
                  }`}
                >
                  {f === "ALL" ? "ALL SOURCES" : f === "REAL" ? "APPROVED REAL SOURCES" : f === "SIMULATED" ? "SIMULATED SOURCES" : "OFFLINE SOURCES"}
                </button>
              ))}
            </div>
          </div>

          {/* Sources Grid / Table (PRD §19 Fields) */}
          <div className="grid grid-cols-1 gap-3">
            {filteredSources.map((source) => (
              <div
                key={source.sourceId}
                className="p-5 rounded-xl bg-[#141414] border border-[#262626] hover:border-[#FF6B35]/40 transition-all font-mono"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#262626] pb-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#FF6B35]">{source.sourceId}</span>
                    <span className="text-sm font-bold text-white">{source.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      source.sourceType === "REAL_APPROVED" 
                        ? "bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30"
                        : source.sourceType === "SIMULATED"
                        ? "bg-[#FF6B35]/15 text-[#FF6B35] border border-[#FF6B35]/30"
                        : "bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30"
                    }`}>
                      {source.sourceType === "REAL_APPROVED" ? "APPROVED REAL SOURCE" : source.sourceType === "SIMULATED" ? "SIMULATED SOURCE" : "OFFLINE SOURCE"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {source.isSimulated && <DataBadge isSimulation={true} size="xs" />}
                    <span className={`flex items-center gap-1.5 text-xs font-bold ${
                      source.connectionStatus === "ONLINE" ? "text-[#10b981]" : "text-[#ef4444]"
                    }`}>
                      {source.connectionStatus === "ONLINE" ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                      <span>{source.connectionStatus}</span>
                    </span>
                  </div>
                </div>

                {/* Metadata Fields required by PRD §19:
                    Source ID, Source type, Status, Last update, Data category, Authentication status, Connection status */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[#666666] block text-[10px]">DATA CATEGORY:</span>
                    <span className="text-white font-semibold">{source.category}</span>
                  </div>

                  <div>
                    <span className="text-[#666666] block text-[10px]">AUTHENTICATION STATUS:</span>
                    <span className="text-[#10b981] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                      <span>{source.authStatus}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[#666666] block text-[10px]">FREQUENCY / PROTOCOL:</span>
                    <span className="text-[#ededed]">{source.frequency}</span>
                  </div>

                  <div>
                    <span className="text-[#666666] block text-[10px]">LAST UPDATE:</span>
                    <span className="text-[#9ca3af] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#666666]" />
                      <span>{source.lastUpdate}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
