import React, { useState } from "react";
import { useTelemetry } from "../../context/TelemetryContext";
import { GnssSimulator } from "../../services/gnssSimulator";
import { DataBadge } from "../../components/layout/DataBadge";
import { 
  Radio, 
  Cpu, 
  CheckCircle2, 
  Compass, 
  AlertTriangle 
} from "lucide-react";

export const GnssReceiver = () => {
  const { activeGnss, submitGnssReading } = useTelemetry();

  // Simulator Form state (PRD §7)
  const [formSatelliteId, setFormSatelliteId] = useState("SAT-001");
  const [formLat, setFormLat] = useState(12.9716);
  const [formLon, setFormLon] = useState(77.5946);
  const [formAlt, setFormAlt] = useState(450);
  const [formSignal, setFormSignal] = useState(94);
  const [formSats, setFormSats] = useState(18);
  const [simulateCorruption, setSimulateCorruption] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleGenerate = (e) => {
    e.preventDefault();
    const res = submitGnssReading({
      satelliteId: formSatelliteId,
      latitude: parseFloat(formLat),
      longitude: parseFloat(formLon),
      altitude: parseFloat(formAlt),
      signalQuality: parseInt(formSignal),
      satelliteCount: parseInt(formSats),
      simulateCorruption
    });

    setNotification(res);
    setTimeout(() => setNotification(null), 5000);
  };

  const applyPreset = (preset) => {
    setFormLat(preset.lat);
    setFormLon(preset.lon);
    setFormAlt(preset.alt);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-5 rounded-xl border border-[#262626]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white flex items-center gap-2 font-display">
              <Radio className="w-5 h-5 text-[#FF6B35]" />
              GNSS RECEIVER MODULE
            </h1>
            <DataBadge isSimulation={true} />
          </div>
          <p className="text-xs text-[#a3a3a3] mt-1">
            L-Band / S-Band Multi-Constellation Receiver Telemetry with Cryptographic Integrity Verification.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></span>
          <span className="text-[#10b981] font-bold">RECEIVER: {activeGnss.gnssStatus}</span>
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-xl text-xs font-mono border flex items-center gap-3 ${
          notification.success 
            ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/40" 
            : "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/40"
        }`}>
          {notification.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Grid: Telemetry Display (PRD §7) vs GNSS Simulator Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Live GNSS Telemetry Panel (PRD §7 Format) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 font-display">
              <Compass className="w-4 h-4 text-[#FF6B35]" />
              ACTIVE GNSS TELEMETRY STREAM
            </h2>
            <span className="text-[11px] font-mono text-[#888888]">EPOCH REFRESH: 4s</span>
          </div>

          <div className="p-5 rounded-xl bg-[#141414] border border-[#262626] font-mono space-y-4 shadow-lg">
            <div className="flex justify-between items-center border-b border-[#262626] pb-3">
              <span className="text-xs text-[#888888]">SATELLITE IDENTIFIER:</span>
              <span className="text-sm text-[#FF6B35] font-bold">{activeGnss.satelliteId}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#737373] block text-[10px]">GNSS STATUS:</span>
                <span className="text-[#10b981] font-bold text-sm">{activeGnss.gnssStatus}</span>
              </div>
              <div>
                <span className="text-[#737373] block text-[10px]">CONNECTED SATELLITES:</span>
                <span className="text-white font-bold text-sm">{activeGnss.satelliteCount} Space Vehicles</span>
              </div>
              <div>
                <span className="text-[#737373] block text-[10px]">GEODETIC LATITUDE:</span>
                <span className="text-white font-bold text-sm">{activeGnss.latitude.toFixed(5)}° N</span>
              </div>
              <div>
                <span className="text-[#737373] block text-[10px]">GEODETIC LONGITUDE:</span>
                <span className="text-white font-bold text-sm">{activeGnss.longitude.toFixed(5)}° E</span>
              </div>
              <div>
                <span className="text-[#737373] block text-[10px]">ELLIPSOIDAL ALTITUDE:</span>
                <span className="text-white font-bold text-sm">{activeGnss.altitude} m (WGS-84)</span>
              </div>
              <div>
                <span className="text-[#737373] block text-[10px]">ESTIMATED ACCURACY:</span>
                <span className="text-[#FF6B35] font-bold text-sm">±{activeGnss.accuracy} m (PDOP 1.2)</span>
              </div>
              <div>
                <span className="text-[#737373] block text-[10px]">CARRIER-TO-NOISE (C/N0):</span>
                <span className="text-white font-bold text-sm">{activeGnss.snr || "42.5"} dB-Hz</span>
              </div>
              <div>
                <span className="text-[#737373] block text-[10px]">SIGNAL QUALITY:</span>
                <span className="text-[#10b981] font-bold text-sm">{activeGnss.signalQuality}%</span>
              </div>
            </div>

            <div className="border-t border-[#262626] pt-3 space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#888888]">TIMESTAMP:</span>
                <span className="text-[#ededed]">{activeGnss.timestamp}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#888888]">DATA PROVENANCE:</span>
                <DataBadge isSimulation={true} size="xs" />
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#888888]">DEVICE SIGNATURE:</span>
                <span className="text-[#888888] truncate max-w-[200px]" title={activeGnss.signature}>
                  {activeGnss.signature || "HMAC_SHA256_VERIFIED"}
                </span>
              </div>
            </div>

            {/* NMEA Sentence View */}
            <div className="bg-[#0f0f0f] p-3 rounded-lg border border-[#262626] text-[10px] text-[#FF6B35] overflow-x-auto">
              <div className="text-[#888888] text-[9px] mb-1 uppercase font-semibold">Decoded NMEA 0183 (GGA Frame):</div>
              <code>{activeGnss.nmeaGga || `$GNGGA,151021.00,${activeGnss.latitude},N,${activeGnss.longitude},E,1,18,1.0,450.0,M,0.0,M,,*47`}</code>
            </div>
          </div>
        </div>

        {/* Right Column: GNSS Simulator Controls (PRD §7) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 font-display">
              <Cpu className="w-4 h-4 text-[#FF6B35]" />
              GNSS SIMULATOR CONTROLS
            </h2>
            <DataBadge isSimulation={true} size="xs" />
          </div>

          <form onSubmit={handleGenerate} className="p-5 rounded-xl bg-[#141414] border border-[#262626] space-y-4">
            
            {/* Quick Location Presets */}
            <div>
              <label className="text-xs text-[#888888] block mb-1.5 font-mono">
                QUICK REGIONAL PRESETS
              </label>
              <div className="flex flex-wrap gap-1.5">
                {GnssSimulator.defaultPresetLocations.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="px-2.5 py-1 text-[11px] rounded bg-[#262626] hover:bg-[#333333] hover:text-[#FF6B35] text-[#d4d4d4] font-mono transition-colors"
                  >
                    {p.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono">
              <div>
                <label className="text-[11px] text-[#888888] block mb-1">Satellite ID</label>
                <select
                  value={formSatelliteId}
                  onChange={(e) => setFormSatelliteId(e.target.value)}
                  className="w-full bg-[#0f0f0f] border border-[#262626] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF6B35]"
                >
                  <option value="SAT-001">SAT-001 (Sentinel SAR)</option>
                  <option value="SAT-002">SAT-002 (Terra-Spectra)</option>
                  <option value="SAT-003">SAT-003 (Hydro-Sentinel)</option>
                  <option value="SAT-004">SAT-004 (Atmosphere-1)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-[#888888] block mb-1">Number of Satellites</label>
                <input
                  type="number"
                  min="4"
                  max="32"
                  value={formSats}
                  onChange={(e) => setFormSats(e.target.value)}
                  className="w-full bg-[#0f0f0f] border border-[#262626] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#888888] block mb-1">Latitude (°N)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={formLat}
                  onChange={(e) => setFormLat(e.target.value)}
                  className="w-full bg-[#0f0f0f] border border-[#262626] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#888888] block mb-1">Longitude (°E)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={formLon}
                  onChange={(e) => setFormLon(e.target.value)}
                  className="w-full bg-[#0f0f0f] border border-[#262626] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#888888] block mb-1">Altitude (meters)</label>
                <input
                  type="number"
                  value={formAlt}
                  onChange={(e) => setFormAlt(e.target.value)}
                  className="w-full bg-[#0f0f0f] border border-[#262626] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#888888] block mb-1">Signal Strength (10-100%)</label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={formSignal}
                  onChange={(e) => setFormSignal(e.target.value)}
                  className="w-full bg-[#0f0f0f] border border-[#262626] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF6B35]"
                />
              </div>
            </div>

            {/* Quarantine Testing Checkbox */}
            <div className="p-3 rounded-lg bg-[#0f0f0f] border border-[#262626] flex items-start gap-2.5">
              <input
                type="checkbox"
                id="corrupt"
                checked={simulateCorruption}
                onChange={(e) => setSimulateCorruption(e.target.checked)}
                className="mt-0.5 rounded border-[#333333] text-[#ef4444] focus:ring-[#ef4444]"
              />
              <label htmlFor="corrupt" className="text-xs text-[#d4d4d4]">
                <span className="font-semibold text-[#ef4444]">Simulate Cryptographic Corruption (PRD §8/§13 Test)</span>
                <p className="text-[11px] text-[#888888] mt-0.5">
                  Injects an invalid signature to trigger the Validation Pipeline quarantine and security log event.
                </p>
              </label>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-[#FF6B35] hover:bg-[#ff8152] text-[#0f0f0f] font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#FF6B35]/25 flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              [ GENERATE SIMULATED GNSS DATA ]
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
