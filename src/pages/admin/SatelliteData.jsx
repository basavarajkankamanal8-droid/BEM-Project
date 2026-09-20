import React, { useState } from "react";
import { dataStore } from "../../services/dataStore";
import { DataBadge } from "../../components/layout/DataBadge";
import { EarthMap } from "../../components/map/EarthMap";
import { 
  Satellite, 
  Activity, 
  Orbit, 
  Layers
} from "lucide-react";

export const SatelliteData = () => {
  const [satellites] = useState(() => dataStore.get("satellites"));
  const [selectedSat, setSelectedSat] = useState(satellites[0]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-5 rounded-xl border border-[#262626]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white flex items-center gap-2 font-display">
              <Satellite className="w-5 h-5 text-[#FF6B35]" />
              SATELLITE CONSTELLATION TELEMETRY
            </h1>
            <DataBadge isSimulation={true} />
          </div>
          <p className="text-xs text-[#a3a3a3] mt-1">
            Real-time orbital tracking, state vector analysis, and payload telemetry subsystem.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#10b981]">
          <Activity className="w-4 h-4" />
          <span>CONSTELLATION HEALTH: 98.2%</span>
        </div>
      </div>

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

    </div>
  );
};
