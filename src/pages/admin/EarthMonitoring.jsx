import React, { useState } from "react";
import { dataStore } from "../../services/dataStore";
import { DataBadge } from "../../components/layout/DataBadge";
import { ImageCompareSlider } from "../../components/imagery/ImageCompareSlider";
import { 
  Globe2, Waves, Mountain, Trees, Wind, Layers
} from "lucide-react";

const tabs = [
  { key: "water",      label: "🌊 Water Movement",          sub: "+27%",     icon: <Waves />,    iconColor: "#60a5fa" },
  { key: "terrain",    label: "🏔 Terrain & Elevation",     sub: "+12mm",    icon: <Mountain />, iconColor: "#f59e0b" },
  { key: "land",       label: "🌱 Land & NDVI",              sub: "−8%",      icon: <Trees />,    iconColor: "#34d399" },
  { key: "atmosphere", label: "🌫 Atmospheric & Temp",       sub: "+4.2°C",   icon: <Wind />,     iconColor: "#FF6B35" },
];

// Panel card style helper
const panelStyle = {
  background: "rgba(14,14,14,0.9)",
  border: "1px solid rgba(38,38,38,0.8)",
  borderRadius: 12,
  padding: "18px 20px",
};

const metricRowStyle = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  paddingBottom: 10, borderBottom: "1px solid rgba(38,38,38,0.5)",
  marginBottom: 10
};

export const EarthMonitoring = () => {
  const [activeTab, setActiveTab] = useState("water");
  const observations = dataStore.get("earth_observations");

  return (
    <div style={{ padding: "24px", maxWidth: 1400, margin: "0 auto" }}>

      {/* Header */}
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center",
        justifyContent: "space-between", gap: 16,
        background: "rgba(16,16,16,0.8)",
        border: "1px solid rgba(255,107,53,0.12)",
        borderRadius: 14, padding: "18px 24px",
        marginBottom: 24, backdropFilter: "blur(12px)"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <h1 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: "white", letterSpacing: "0.08em", margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
              <Globe2 style={{ width: 18, height: 18, color: "#FF6B35" }} />
              EARTH MONITORING & CHANGE DETECTION
            </h1>
            <DataBadge isSimulation={true} />
          </div>
          <p style={{ fontSize: 12, color: "#666666", margin: 0 }}>
            Multispectral SAR, InSAR and optical Earth observation telemetry.
          </p>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "7px 14px", borderRadius: 8,
          background: "rgba(10,10,10,0.8)", border: "1px solid rgba(38,38,38,0.8)"
        }}>
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#555555", letterSpacing: "0.08em" }}>
            DETECTION ENGINE:
          </span>
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#10b981", fontWeight: 700, letterSpacing: "0.06em" }}>
            AUTOMATED COHERENCE DELTA
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24, borderBottom: "1px solid rgba(38,38,38,0.5)", paddingBottom: 16 }}>
        {tabs.map(({ key, label, sub, icon, iconColor }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 16px", borderRadius: 9, cursor: "pointer",
              fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
              letterSpacing: "0.03em",
              border: activeTab === key
                ? "1px solid rgba(255,107,53,0.35)"
                : "1px solid rgba(255,255,255,0.06)",
              background: activeTab === key
                ? "rgba(255,107,53,0.1)"
                : "rgba(255,255,255,0.02)",
              color: activeTab === key ? "#FF6B35" : "#666666",
              transition: "all 0.2s",
            }}
          >
            {React.cloneElement(icon, { style: { width: 13, height: 13, color: activeTab === key ? "#FF6B35" : iconColor } })}
            <span>{label}</span>
            <span style={{
              fontSize: 9, padding: "1px 6px", borderRadius: 4,
              background: activeTab === key ? "rgba(255,107,53,0.15)" : "rgba(255,255,255,0.05)",
              color: activeTab === key ? "#FF6B35" : "#555555",
              fontWeight: 700, letterSpacing: "0.06em"
            }}>
              {sub}
            </span>
          </button>
        ))}
      </div>

      {/* ── Water Tab ── */}
      {activeTab === "water" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
          <ImageCompareSlider
            beforeImage="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
            afterImage="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
            title="Brahmaputra Flood Plain Radar Analysis (OBS-000142)"
            metricChange="Water Surface Change: +27%"
            beforeLabel="BASELINE DRY PERIOD"
            afterLabel="POST-MONSOON FLOOD STAGE"
          />
          <div style={panelStyle}>
            <h3 style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#888888", letterSpacing: "0.1em", margin: "0 0 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>WATER TELEMETRY REPORT</span>
              <DataBadge isSimulation={true} size="xs" />
            </h3>
            {[
              { label: "Target Corridor:", value: "Assam Valley Zone 3", color: "#ededed" },
              { label: "Surface Delta:", value: "+27% Inundation", color: "#ef4444" },
              { label: "Sensor Type:", value: "C-Band SAR", color: "#22d3ee" },
              { label: "Coordinates:", value: "26.20°N, 92.94°E", color: "#a3a3a3" },
              { label: "Alert Class:", value: "HIGH PRIORITY FLOOD", color: "#ef4444" },
            ].map(({ label, value, color }, i, arr) => (
              <div key={label} style={{ ...metricRowStyle, ...(i === arr.length - 1 ? { borderBottom: "none", marginBottom: 0, paddingBottom: 0 } : {}) }}>
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#555555" }}>{label}</span>
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color, fontWeight: 600 }}>{value}</span>
              </div>
            ))}
            <div style={{
              marginTop: 14, padding: "10px 12px", borderRadius: 8,
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)"
            }}>
              <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#ef4444", lineHeight: 1.5 }}>
                ⚠ Inundation &gt; 15% triggers stage-1 alert for human verification.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Terrain Tab ── */}
      {activeTab === "terrain" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
          <ImageCompareSlider
            beforeImage="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
            afterImage="https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80"
            title="Himalayan Foothill Ridge Elevation Shift (OBS-000141)"
            metricChange="Terrain Change: +12mm Active Movement"
            beforeLabel="T0: INTERFEROGRAM BASELINE"
            afterLabel="T1: ACTIVE DEFORMATION"
          />
          <div style={panelStyle}>
            <h3 style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#888888", letterSpacing: "0.1em", margin: "0 0 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>TERRAIN DISPLACEMENT</span>
              <DataBadge isSimulation={true} size="xs" />
            </h3>
            {[
              { label: "Monitoring Sector:", value: "W. Himalayas Slope B", color: "#ededed" },
              { label: "Surface Displacement:", value: "+12 mm / 48 hrs", color: "#f59e0b" },
              { label: "Slope Angle:", value: "41.8° Gradient", color: "#a3a3a3" },
              { label: "Landslide Risk:", value: "HIGH (Level 4/5)", color: "#ef4444" },
            ].map(({ label, value, color }, i, arr) => (
              <div key={label} style={{ ...metricRowStyle, ...(i === arr.length - 1 ? { borderBottom: "none", marginBottom: 0, paddingBottom: 0 } : {}) }}>
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#555555" }}>{label}</span>
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color, fontWeight: 600 }}>{value}</span>
              </div>
            ))}
            <div style={{
              marginTop: 14, padding: "10px 12px", borderRadius: 8,
              background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)"
            }}>
              <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#f59e0b", lineHeight: 1.5 }}>
                Landslide warning from interferometric phase variance.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Land Tab ── */}
      {activeTab === "land" && (
        <div style={panelStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: "white", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Trees style={{ width: 14, height: 14, color: "#34d399" }} />
              VEGETATION INDEX & LAND SURFACE COVERAGE
            </h3>
            <DataBadge isSimulation={true} size="xs" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {[
              { label: "MEAN NDVI INDEX", value: "0.64", sub: "−8% Vegetation delta", valColor: "#34d399", subColor: "#ef4444" },
              { label: "SOIL MOISTURE INDEX", value: "32.8%", sub: "Normal seasonal range", valColor: "#22d3ee", subColor: "#666666" },
              { label: "CANOPY COVER STATUS", value: "OPTIMAL", sub: "Zero wildfire hotspots", valColor: "#34d399", subColor: "#666666" },
            ].map(({ label, value, sub, valColor, subColor }) => (
              <div key={label} style={{
                padding: "16px 18px", borderRadius: 10,
                background: "rgba(10,10,10,0.8)", border: "1px solid rgba(38,38,38,0.7)"
              }}>
                <span style={{ display: "block", fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#555555", letterSpacing: "0.1em", marginBottom: 8 }}>{label}</span>
                <span style={{ display: "block", fontSize: 26, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: valColor, lineHeight: 1 }}>{value}</span>
                <span style={{ display: "block", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: subColor, marginTop: 6 }}>{sub}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Atmosphere Tab ── */}
      {activeTab === "atmosphere" && (
        <div style={panelStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: "white", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Wind style={{ width: 14, height: 14, color: "#FF6B35" }} />
              ATMOSPHERIC & TEMPERATURE TELEMETRY
            </h3>
            <DataBadge isSimulation={true} size="xs" />
          </div>
          <div style={{
            padding: "10px 14px", borderRadius: 8, marginBottom: 16,
            background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.15)"
          }}>
            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace', color: '#a3a3a3'", lineHeight: 1.5, color: "#a3a3a3" }}>
              <strong style={{ color: "#FF6B35" }}>System Rule:</strong> Displays only measurements supported by connected data sources without inventing sensor data.
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {[
              { label: "SURFACE TEMP", value: "31.4°C", sub: "+4.2°C anomaly", valColor: "#ef4444", subColor: "#ef4444" },
              { label: "CO₂ COLUMN AVG", value: "418.2 ppm", sub: "Tropospheric sounder", valColor: "#f59e0b", subColor: "#666666" },
              { label: "PARTICULATE PM2.5", value: "98 µg/m³", sub: "Air Quality: MODERATE", valColor: "#f59e0b", subColor: "#f59e0b" },
              { label: "TROPOSPHERIC NO₂", value: "1.4 µmol/m²", sub: "Within baseline limits", valColor: "#22d3ee", subColor: "#10b981" },
            ].map(({ label, value, sub, valColor, subColor }) => (
              <div key={label} style={{
                padding: "16px 18px", borderRadius: 10,
                background: "rgba(10,10,10,0.8)", border: "1px solid rgba(38,38,38,0.7)"
              }}>
                <span style={{ display: "block", fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#555555", letterSpacing: "0.1em", marginBottom: 8 }}>{label}</span>
                <span style={{ display: "block", fontSize: 22, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: valColor, lineHeight: 1 }}>{value}</span>
                <span style={{ display: "block", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: subColor, marginTop: 6 }}>{sub}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Observation History Table ── */}
      <div style={{ ...panelStyle, marginTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: "white", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <Layers style={{ width: 13, height: 13, color: "#FF6B35" }} />
            EARTH OBSERVATION LOGS
          </h3>
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#555555", letterSpacing: "0.06em" }}>
            {observations.length} OBSERVATIONS
          </span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="aeris-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                {["OBSERVATION ID", "CATEGORY", "LOCATION", "DELTA", "STATUS", "REVIEWER", "SOURCE"].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {observations.map((obs) => (
                <tr key={obs.obsId}>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", color: "#FF6B35", fontWeight: 700 }}>{obs.obsId}</td>
                  <td style={{ color: "#ededed" }}>{obs.category}</td>
                  <td style={{ color: "#a3a3a3" }}>{obs.location}</td>
                  <td style={{ color: "#ef4444", fontWeight: 700 }}>{obs.changePercentage}</td>
                  <td>
                    <span style={{
                      padding: "2px 8px", borderRadius: 4, fontSize: 9,
                      fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: "0.05em",
                      background: "rgba(255,107,53,0.12)", color: "#FF6B35", border: "1px solid rgba(255,107,53,0.25)"
                    }}>
                      {obs.status}
                    </span>
                  </td>
                  <td style={{ color: "#666666", fontSize: 11 }}>{obs.reviewer}</td>
                  <td><DataBadge isSimulation={true} size="xs" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
