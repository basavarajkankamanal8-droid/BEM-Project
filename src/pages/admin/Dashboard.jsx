import React, { useState, useEffect } from "react";
import { useTelemetry } from "../../context/TelemetryContext";
import { DataBadge } from "../../components/layout/DataBadge";
import { EarthMap } from "../../components/map/EarthMap";
import { ImageCompareSlider } from "../../components/imagery/ImageCompareSlider";
import { 
  Satellite, Radio, Waves, Mountain, Trees, Wind, 
  AlertTriangle, ShieldCheck, Activity, ArrowUpRight, TrendingUp,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

// Mini KPI Card component
const KpiCard = ({ icon, _iconColor, title, mainValue, subItems, accentColor, badge }) => (
  <div className="aeris-card aeris-metric-card scanline-effect" style={{ padding: 18 }}>
    {/* Card top glow bar */}
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 1,
      background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)`,
    }} />

    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: `${accentColor}15`,
          border: `1px solid ${accentColor}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {React.cloneElement(icon, { style: { width: 13, height: 13, color: accentColor } })}
        </div>
        <span style={{
          fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700, color: "#666666", letterSpacing: "0.08em"
        }}>
          {title}
        </span>
      </div>
      {badge && (
        <span style={{
          width: 8, height: 8, borderRadius: "50%",
          background: badge === "ping" ? "#10b981" : badge,
          boxShadow: `0 0 8px ${badge === "ping" ? "#10b981" : badge}`,
          display: "inline-block"
        }} className={badge === "ping" ? "animate-pulse" : ""} />
      )}
    </div>

    <div style={{
      fontSize: 20, fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 800, color: "#ffffff", marginBottom: 12, lineHeight: 1
    }}>
      {mainValue}
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {subItems.map(({ label, value, color }) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#444444" }}>
            {label}
          </span>
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color }}>
            {value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

import { dataStore } from "../../services/dataStore";

export const Dashboard = () => {
  const { satellites, activeGnss, alerts, sensorReadings } = useTelemetry();
  const [citizenReports, setCitizenReports] = useState(() => dataStore.get("citizen_alert_reports"));
  const [_tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000);
    const unsub = dataStore.subscribe("citizen_alert_reports", setCitizenReports);
    return () => {
      clearInterval(t);
      unsub();
    };
  }, []);

  const pendingCitizenCount = citizenReports.filter(r => r.status === "PENDING REVIEW" || r.status === "PENDING").length;
  const activeAlertsCount = alerts.filter(a => a.status !== "resolved").length;
  const criticalAlertsCount = alerts.filter(a => a.severity === "CRITICAL" && a.status !== "resolved").length;

  return (
    <div style={{ padding: "24px", maxWidth: 1400, margin: "0 auto" }}>

      {/* ── Command Status Header ── */}
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center",
        justifyContent: "space-between", gap: 16,
        background: "rgba(16,16,16,0.8)",
        border: "1px solid rgba(255,107,53,0.12)",
        borderRadius: 14, padding: "18px 24px",
        marginBottom: 24,
        backdropFilter: "blur(12px)",
        position: "relative", overflow: "hidden"
      }}>
        {/* Background accent */}
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: 300, height: "100%",
          background: "radial-gradient(ellipse at right, rgba(255,107,53,0.06) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <h1 className="font-display" style={{
              fontSize: 20, fontWeight: 800, color: "white", letterSpacing: "0.08em", margin: 0
            }}>
              BEM OPERATIONS — SYSTEM ONLINE
            </h1>
            <DataBadge isSimulation={true} />
          </div>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, fontFamily: "'Inter', sans-serif" }}>
            Bharat Earth Monitor · Orbital tracking, spectral change detection & GNSS telemetry
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Live epoch */}
          <div style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "7px 14px", borderRadius: 8,
            background: "rgba(10,10,10,0.8)", border: "1px solid rgba(38,38,38,0.8)"
          }}>
            <Clock style={{ width: 12, height: 12, color: "#FF6B35" }} />
            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#d4d4d4", letterSpacing: "0.06em" }}>
              EPOCH: 2026-09-19 UTC
            </span>
          </div>
          {/* Core online */}
          <div style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "7px 14px", borderRadius: 8,
            background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)"
          }}>
            <Activity style={{ width: 12, height: 12, color: "#10b981" }} className="animate-pulse" />
            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#10b981", letterSpacing: "0.06em", fontWeight: 700 }}>
              CORE ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 16, marginBottom: 24
      }}>
        <KpiCard
          icon={<Satellite />}
          iconColor="#FF6B35"
          title="SATELLITE STATUS"
          mainValue={satellites[0]?.satelliteId || "SAT-001"}
          accentColor="#FF6B35"
          badge="ping"
          subItems={[
            { label: "Status:", value: "● ONLINE", color: "#10b981" },
            { label: "Data Source:", value: "SIMULATED", color: "#FF6B35" },
            { label: "Last Update:", value: "15:09:32", color: "#d4d4d4" },
          ]}
        />
        <KpiCard
          icon={<Radio />}
          iconColor="#22d3ee"
          title="GNSS RECEIVER"
          mainValue={`${activeGnss.satelliteCount} SVs`}
          accentColor="#22d3ee"
          badge="ping"
          subItems={[
            { label: "Signal Quality:", value: `${activeGnss.signalQuality}% L1/L2`, color: "#10b981" },
            { label: "Accuracy:", value: `±${activeGnss.accuracy}m`, color: "#FF6B35" },
            { label: "Altitude:", value: `${activeGnss.altitude}m`, color: "#d4d4d4" },
          ]}
        />
        <KpiCard
          icon={<Activity />}
          iconColor="#10b981"
          title="EARTH MONITORING"
          mainValue="31.4°C"
          accentColor="#10b981"
          badge="#ef4444"
          subItems={[
            { label: "🌊 Water:", value: "NORMAL", color: "#10b981" },
            { label: "🏔 Terrain:", value: "CHANGE DETECTED", color: "#ef4444" },
            { label: "🌫 Air:", value: "MODERATE", color: "#f59e0b" },
          ]}
        />
        <KpiCard
          icon={<AlertTriangle />}
          iconColor="#ef4444"
          title="ACTIVE ALERTS"
          mainValue={`${criticalAlertsCount} CRIT`}
          accentColor="#ef4444"
          badge="#ef4444"
          subItems={[
            { label: "Total Active:", value: `${activeAlertsCount} alerts`, color: "#f59e0b" },
            { label: "Environmental:", value: "2 Active", color: "#f59e0b" },
            { label: "Data Integrity:", value: "1 Quarantined", color: "#FF6B35" },
          ]}
        />
        <KpiCard
          icon={<AlertTriangle />}
          iconColor="#FF6B35"
          title="CITIZEN REPORTS"
          mainValue={`${pendingCitizenCount} NEW`}
          accentColor="#FF6B35"
          badge={pendingCitizenCount > 0 ? "ping" : "#10b981"}
          subItems={[
            { label: "Pending Review:", value: `${pendingCitizenCount} Reports`, color: pendingCitizenCount > 0 ? "#FF6B35" : "#10b981" },
            { label: "Total Received:", value: `${citizenReports.length} Reports`, color: "#d4d4d4" },
            { label: "Intake Pipeline:", value: "Real-time Sync", color: "#10b981" },
          ]}
        />
      </div>

      {/* ── Map + Telemetry Matrix ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, marginBottom: 24 }}>
        
        {/* Map Panel */}
        <div style={{
          background: "rgba(14,14,14,0.8)",
          border: "1px solid rgba(255,107,53,0.1)",
          borderRadius: 14, overflow: "hidden"
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 18px",
            borderBottom: "1px solid rgba(38,38,38,0.6)"
          }}>
            <h2 className="font-display" style={{ fontSize: 12, fontWeight: 700, color: "white", margin: 0, letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 8 }}>
              <Satellite style={{ width: 14, height: 14, color: "#FF6B35" }} />
              CONSTELLATION GROUND TRACK & ALERT HOTSPOTS
            </h2>
            <Link to="/gnss" style={{
              display: "flex", alignItems: "center", gap: 5,
              fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
              color: "#FF6B35", textDecoration: "none", letterSpacing: "0.05em"
            }}>
              GNSS SIMULATOR <ArrowUpRight style={{ width: 11, height: 11 }} />
            </Link>
          </div>
          <EarthMap satellites={satellites} markers={alerts} height="420px" />
        </div>

        {/* Telemetry Matrix */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 className="font-display" style={{ fontSize: 12, fontWeight: 700, color: "white", margin: 0, letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 8 }}>
              <Activity style={{ width: 13, height: 13, color: "#10b981" }} />
              LIVE TELEMETRY MATRIX
            </h2>
            <DataBadge isSimulation={true} size="xs" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sensorReadings.map((sensor) => (
              <div
                key={sensor.id}
                style={{
                  padding: "12px 14px",
                  background: "rgba(16,16,16,0.8)",
                  border: `1px solid rgba(38,38,38,0.8)`,
                  borderRadius: 10,
                  transition: "all 0.2s",
                  cursor: "default"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(255,107,53,0.25)";
                  e.currentTarget.style.background = "rgba(255,107,53,0.03)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(38,38,38,0.8)";
                  e.currentTarget.style.background = "rgba(16,16,16,0.8)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#e5e5e5", display: "flex", alignItems: "center", gap: 6 }}>
                    {sensor.category === "water"      && <Waves     style={{ width: 12, height: 12, color: "#60a5fa" }} />}
                    {sensor.category === "terrain"    && <Mountain  style={{ width: 12, height: 12, color: "#f59e0b" }} />}
                    {sensor.category === "land"       && <Trees     style={{ width: 12, height: 12, color: "#34d399" }} />}
                    {sensor.category === "atmosphere" && <Wind      style={{ width: 12, height: 12, color: "#FF6B35" }} />}
                    {sensor.metricName}
                  </span>
                  <span style={{
                    padding: "2px 7px", borderRadius: 4, fontSize: 9,
                    fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: "0.05em",
                    ...(sensor.status === "CHANGE DETECTED"
                      ? { background: "rgba(239,68,68,0.12)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)" }
                      : { background: "rgba(16,185,129,0.12)", color: "#10b981", border: "1px solid rgba(16,185,129,0.25)" }
                    )
                  }}>
                    {sensor.status}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#444444" }}>
                    {sensor.location}
                  </span>
                  <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#FF6B35" }}>
                    {sensor.value}
                  </span>
                </div>
                {/* Mini progress bar */}
                <div className="aeris-progress" style={{ marginTop: 8 }}>
                  <div className="aeris-progress-fill" style={{
                    width: sensor.status === "CHANGE DETECTED" ? "72%" : "45%"
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Integrity Verification Box */}
          <div style={{
            padding: "14px 16px", borderRadius: 10,
            background: "linear-gradient(135deg, rgba(255,107,53,0.08), rgba(20,20,20,0.8))",
            border: "1px solid rgba(255,107,53,0.2)",
            marginTop: 4
          }}>
            <h4 style={{
              fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              color: "white", letterSpacing: "0.08em", margin: "0 0 8px",
              display: "flex", alignItems: "center", gap: 6
            }}>
              <ShieldCheck style={{ width: 12, height: 12, color: "#FF6B35" }} />
              INTEGRITY PIPELINE
            </h4>
            <p style={{ fontSize: 10, color: "#666666", margin: "0 0 8px", lineHeight: 1.5 }}>
              All telemetry packets pass cryptographic HMAC checks before ingestion.
            </p>
            <Link to="/security" style={{
              fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
              color: "#FF6B35", textDecoration: "none", display: "flex", alignItems: "center", gap: 4
            }}>
              Inspect Security Logs <ArrowUpRight style={{ width: 10, height: 10 }} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Change Detection Visualizer ── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <h2 className="font-display" style={{
              fontSize: 13, fontWeight: 700, color: "white", margin: "0 0 3px",
              letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 8
            }}>
              <TrendingUp style={{ width: 14, height: 14, color: "#ef4444" }} />
              DUAL-PASS CHANGE DETECTION — BRAHMAPUTRA FLOOD PLAIN
            </h2>
            <p style={{ fontSize: 11, color: "#555555", margin: 0, fontFamily: "'Inter', sans-serif" }}>
              Assam Valley Zone 3 — Synthetic Aperture Radar (SAR) Water Inundation Delta
            </p>
          </div>
          <Link to="/images" style={{
            display: "flex", alignItems: "center", gap: 5,
            fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
            color: "#FF6B35", textDecoration: "none", letterSpacing: "0.05em"
          }}>
            ALL OBSERVATIONS <ArrowUpRight style={{ width: 11, height: 11 }} />
          </Link>
        </div>
        <ImageCompareSlider
          beforeImage="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
          afterImage="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
          beforeLabel="BASELINE PRE-MONSOON"
          afterLabel="SATELLITE PASS OBS-000142"
          title="Assam Valley River Corridor Water Surface Analysis"
          metricChange="+27% Water Surface Area (Alert In Progress)"
          height="340px"
        />
      </div>

    </div>
  );
};
