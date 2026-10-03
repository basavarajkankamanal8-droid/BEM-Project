import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { dataStore } from "../../services/dataStore";
import { DataBadge } from "../../components/layout/DataBadge";
import { EarthMap } from "../../components/map/EarthMap";
import { ImageCompareSlider } from "../../components/imagery/ImageCompareSlider";
import {
  Globe2, AlertTriangle, Waves, Mountain,
  Trees, Wind, ShieldCheck, User, ArrowRight,
  FileText, Activity, MapPin, CheckCircle2, Clock
} from "lucide-react";

export const PublicDashboard = () => {
  const { currentUser } = useAuth();
  const [alerts, setAlerts] = useState(() => 
    dataStore.get("alerts").filter(a => a.status === "approved" || a.status === "public_posted" || a.status === "published")
  );
  const [citizenReports, setCitizenReports] = useState(() => 
    dataStore.get("citizen_alert_reports") || []
  );
  const images = dataStore.get("images").filter(img => img.isPublic);

  useEffect(() => {
    const unsubAlerts = dataStore.subscribe("alerts", (all) => {
      setAlerts(all.filter(a => a.status === "approved" || a.status === "public_posted" || a.status === "published"));
    });
    const unsubCitizen = dataStore.subscribe("citizen_alert_reports", (all) => {
      setCitizenReports(all || []);
    });
    return () => {
      unsubAlerts();
      unsubCitizen();
    };
  }, []);

  const reports = [
    {
      id: "PUB-REP-01",
      title: "Assam River Basin Flash Inundation Public Advisory",
      category: "Water / Hydrology",
      date: "19 September 2026",
      summary: "Synthetic Aperture Radar verified +27% surface water expansion in lowlands. District disaster management relief camps operational."
    },
    {
      id: "PUB-REP-02",
      title: "Himalayan Highway 58 Slope Stability Bulletin",
      category: "Terrain / Landslide",
      date: "18 September 2026",
      summary: "InSAR interferometry detected 12mm ground displacement on slopes along Highway 58. Precautionary travel advisory active."
    }
  ];

  const [selectedStation, setSelectedStation] = useState(null);

  // Region coordinates lookup for verified citizen reports
  const stateCoords = {
    "West Bengal": [26.54, 88.71],
    "Uttarakhand": [30.55, 79.56],
    "Assam": [26.20, 92.93],
    "Kerala": [11.68, 76.13],
    "Odisha": [20.29, 85.82],
    "Maharashtra": [19.07, 72.87],
    "Himachal Pradesh": [31.10, 77.17],
    "Tamil Nadu": [13.08, 80.27]
  };

  const verifiedCitizenReports = citizenReports.filter(r => 
    r.status === "VERIFIED" || r.status === "APPROVED" || r.status === "PUBLISHED"
  );

  const citizenAlertMarkers = verifiedCitizenReports.map(c => {
    const coords = stateCoords[c.state] || [22.0, 78.5];
    return {
      id: c.reportId,
      type: c.eventType,
      location: `${c.placeName}, ${c.district}`,
      severity: c.verifiedThreatLevel || c.reportedThreatLevel || "HIGH",
      lat: coords[0],
      lng: coords[1],
      description: c.description,
      isVerified: true,
      status: "VERIFIED"
    };
  });

  // Region markers for the public interactive map (PRD §21 & §39)
  const publicAlertMarkers = [
    ...alerts.map(a => ({
      id: a.alertId,
      type: a.type,
      location: a.location,
      severity: a.severity,
      lat: a.type.includes("FLOOD") ? 26.2006 : 30.0668,
      lng: a.type.includes("FLOOD") ? 92.9376 : 79.0193,
      description: a.description,
      isVerified: false,
      status: a.status
    })),
    ...citizenAlertMarkers
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: "0 auto" }}>

      {/* ── Welcome Banner ── */}
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center",
        justifyContent: "space-between", gap: 16,
        background: "rgba(16,16,16,0.9)",
        border: "1px solid rgba(255,107,53,0.18)",
        borderRadius: 16, padding: "24px 28px",
        marginBottom: 24, backdropFilter: "blur(12px)",
        position: "relative", overflow: "hidden"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{
              padding: "3px 8px", borderRadius: 4, fontSize: 9,
              fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              background: "rgba(255,107,53,0.15)", color: "#FF6B35", border: "1px solid rgba(255,107,53,0.3)"
            }}>
              PEOPLE OF INDIA PORTAL
            </span>
            <DataBadge isSimulation={true} size="xs" />
          </div>
          <h1 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: "white", margin: "0 0 6px" }}>
            WELCOME, {currentUser?.name?.toUpperCase() || "CITIZEN OF BHARAT"}
          </h1>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
            Access human-verified Earth monitoring advisories, satellite imagery, and environmental data for Bharat.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <Link
            to="/dashboard/report-alert"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "12px 22px", borderRadius: 10,
              background: "linear-gradient(135deg, #FF6B35 0%, #ff8c5a 100%)",
              boxShadow: "0 6px 20px rgba(255,107,53,0.35)",
              fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800,
              color: "#0f0f0f", textDecoration: "none", transition: "all 0.2s"
            }}
          >
            <span style={{ fontSize: 16 }}>🚨</span>
            <span>REPORT AN ALERT</span>
          </Link>

          <Link
            to="/dashboard/my-alerts"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "11px 18px", borderRadius: 10,
              background: "rgba(255,107,53,0.12)", border: "1px solid rgba(255,107,53,0.3)",
              fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              color: "#FF6B35", textDecoration: "none", transition: "all 0.2s"
            }}
          >
            <span>MY ALERTS</span>
          </Link>

          <Link
            to="/dashboard/verified-alerts"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "11px 18px", borderRadius: 10,
              background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)",
              fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              color: "#10b981", textDecoration: "none", transition: "all 0.2s"
            }}
          >
            <ShieldCheck style={{ width: 14, height: 14 }} />
            <span>VERIFIED ALERTS</span>
          </Link>

          <Link
            to="/profile"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "11px 16px", borderRadius: 10,
              background: "rgba(38,38,38,0.7)", border: "1px solid rgba(60,60,60,0.8)",
              fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              color: "#e5e7eb", textDecoration: "none", transition: "all 0.2s"
            }}
          >
            <User style={{ width: 14, height: 14 }} />
            <span>PROFILE</span>
          </Link>
        </div>
      </div>

      {/* ── Environmental Status Cards (Water, Terrain, Land, Atmosphere) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
        {[
          { icon: <Waves />, iconColor: "#60a5fa", label: "🌊 Water Status", status: "NORMAL", statusColor: "#10b981", detail: "Rivers & reservoirs nominal" },
          { icon: <Mountain />, iconColor: "#f59e0b", label: "🏔 Terrain Condition", status: "MONITORING", statusColor: "#ef4444", detail: "Himalayan slope advisory active" },
          { icon: <Trees />, iconColor: "#34d399", label: "🌱 Land & Vegetation", status: "HEALTHY", statusColor: "#10b981", detail: "NDVI index within range" },
          { icon: <Wind />, iconColor: "#FF6B35", label: "🌫 Atmosphere & Air", status: "MODERATE", statusColor: "#f59e0b", detail: "Aerosol depth seasonal" },
        ].map(({ icon, iconColor, label, status, statusColor, detail }) => (
          <div key={label} style={{
            padding: "20px 18px", borderRadius: 12,
            background: "rgba(14,14,14,0.9)", border: "1px solid rgba(38,38,38,0.7)"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#888888" }}>{label}</span>
              {React.cloneElement(icon, { style: { width: 16, height: 16, color: iconColor } })}
            </div>
            <div style={{ fontSize: 18, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: statusColor, marginBottom: 4 }}>
              {status}
            </div>
            <div style={{ fontSize: 10, color: "#666666", fontFamily: "'Inter', sans-serif" }}>
              {detail}
            </div>
          </div>
        ))}
      </div>

      {/* ── Interactive India Monitoring Map (PRD §16 & §21) ── */}
      <div style={{
        background: "rgba(14,14,14,0.9)",
        border: "1px solid rgba(38,38,38,0.7)",
        borderRadius: 16,
        padding: "20px 22px",
        marginBottom: 28
      }}>
        <div style={{
          display: "flex", flexWrap: "wrap", alignItems: "center",
          justifyContent: "space-between", gap: 12, marginBottom: 16
        }}>
          <div>
            <h2 className="font-display" style={{
              fontSize: 15, fontWeight: 700, color: "white", margin: "0 0 4px",
              display: "flex", alignItems: "center", gap: 8
            }}>
              <Globe2 style={{ width: 18, height: 18, color: "#FF6B35" }} />
              INDIA MONITORING MAP — PUBLIC OBSERVATION GRID
            </h2>
            <p style={{ fontSize: 11, color: "#737373", margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>
              Regional ground stations, coastal nodes, and verified public advisory markers across Bharat.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              padding: "4px 10px", borderRadius: 6,
              background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
              fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#10b981", fontWeight: 700
            }}>
              ● 16 GROUND STATIONS ONLINE
            </span>
            <DataBadge isSimulation={true} size="xs" />
          </div>
        </div>

        <EarthMap
          height="400px"
          showStations={true}
          showBoundary={true}
          alertMarkers={publicAlertMarkers}
        />
      </div>

      {/* ── Latest Public Alerts (PRD §16, §24, §25, §85) ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: "white", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle style={{ width: 16, height: 16, color: "#ef4444" }} />
            LATEST PUBLIC ALERTS & ADVISORIES
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}>
              <ShieldCheck style={{ width: 12, height: 12 }} /> HUMAN-VERIFIED ONLY
            </span>
            <Link
              to="/dashboard/verified-alerts"
              style={{
                fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                color: "#FF6B35", textDecoration: "none"
              }}
            >
              VIEW ALL VERIFIED ALERTS →
            </Link>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {alerts.length === 0 && verifiedCitizenReports.length === 0 ? (
            <div style={{
              padding: 24, borderRadius: 12, textAlign: "center",
              background: "rgba(14,14,14,0.8)", border: "1px solid rgba(38,38,38,0.6)",
              fontSize: 12, color: "#666666", fontFamily: "'JetBrains Mono', monospace"
            }}>
              No active public advisories at this time. All monitoring indices normal.
            </div>
          ) : (
            <>
              {/* Verified Citizen Advisories */}
              {verifiedCitizenReports.map((report) => (
                <div key={report.reportId} style={{
                  padding: "18px 22px", borderRadius: 12,
                  background: "rgba(14,14,14,0.9)", border: "1px solid rgba(16,185,129,0.35)",
                  boxShadow: "0 4px 16px rgba(16,185,129,0.06)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        padding: "3px 8px", borderRadius: 4, fontSize: 9,
                        fontFamily: "'JetBrains Mono', monospace", fontWeight: 800,
                        background: "rgba(16,185,129,0.15)", color: "#10b981",
                        border: "1px solid rgba(16,185,129,0.4)"
                      }}>
                        🚨 VERIFIED CITIZEN ADVISORY
                      </span>
                      <span style={{
                        padding: "2px 6px", borderRadius: 4, fontSize: 9,
                        fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                        background: report.verifiedThreatLevel === "CRITICAL" ? "rgba(239,68,68,0.15)" : "rgba(255,107,53,0.15)",
                        color: report.verifiedThreatLevel === "CRITICAL" ? "#ef4444" : "#FF6B35",
                        border: `1px solid ${report.verifiedThreatLevel === "CRITICAL" ? "rgba(239,68,68,0.3)" : "rgba(255,107,53,0.3)"}`
                      }}>
                        {report.verifiedThreatLevel || "HIGH"} THREAT
                      </span>
                      <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#888888" }}>
                        ID: {report.reportId}
                      </span>
                    </div>
                    <span style={{
                      fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#10b981",
                      padding: "2px 6px", borderRadius: 3, background: "rgba(16,185,129,0.1)"
                    }}>
                      ADMIN APPROVED
                    </span>
                  </div>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: "white", margin: "0 0 6px" }}>
                    {report.eventType} — {report.placeName}, {report.district} ({report.state})
                  </h4>
                  <p style={{ fontSize: 11, color: "#cccccc", margin: "0 0 10px", lineHeight: 1.5 }}>
                    {report.description}
                  </p>
                  <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#666666", display: "flex", justifyContent: "space-between" }}>
                    <span>Reviewed by: <strong style={{ color: "#10b981" }}>{report.reviewedBy || "Elena Rostova (Administrator)"}</strong></span>
                    <span>{report.incidentDate || "Recent"} {report.incidentTime || ""}</span>
                  </div>
                </div>
              ))}

              {/* System Telemetry Alerts */}
              {alerts.map((alert) => (
                <div key={alert.alertId} style={{
                  padding: "18px 22px", borderRadius: 12,
                  background: "rgba(14,14,14,0.85)", border: "1px solid rgba(38,38,38,0.7)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        padding: "3px 8px", borderRadius: 4, fontSize: 9,
                        fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                        background: alert.severity === "CRITICAL" ? "rgba(239,68,68,0.12)" : "rgba(255,107,53,0.12)",
                        color: alert.severity === "CRITICAL" ? "#ef4444" : "#FF6B35",
                        border: `1px solid ${alert.severity === "CRITICAL" ? "rgba(239,68,68,0.3)" : "rgba(255,107,53,0.3)"}`
                      }}>
                        {alert.severity}
                      </span>
                      <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#888888" }}>
                        ID: {alert.alertId}
                      </span>
                    </div>
                    <DataBadge isSimulation={true} size="xs" />
                  </div>
                  <h4 style={{ fontSize: 13, fontWeight: 600, color: "white", margin: "0 0 6px" }}>
                    {alert.type.replace(/_/g, " ")} — {alert.location}
                  </h4>
                  <p style={{ fontSize: 11, color: "#a3a3a3", margin: "0 0 10px", lineHeight: 1.5 }}>
                    {alert.description}
                  </p>
                  <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#666666", display: "flex", justifyContent: "space-between" }}>
                    <span>Verified by: <strong style={{ color: "#888888" }}>{alert.reviewedBy || "Elena Rostova"}</strong></span>
                    <span>{new Date(alert.createdAt || Date.now()).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* ── Public Satellite & Earth Images (PRD §16 & §22) ── */}
      {images.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: "white", margin: 0 }}>
              EARTH IMAGERY — BEFORE / AFTER OBSERVATION
            </h2>
            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#888888" }}>
              APPROVED DATASET COMPARISON
            </span>
          </div>

          <ImageCompareSlider
            beforeImage={images[0].beforeUrl}
            afterImage={images[0].afterUrl}
            title={images[0].title}
            metricChange="Brahmaputra Basin Water Change Delta"
            beforeLabel="PRE-FLOOD BASELINE"
            afterLabel="LATEST SATELLITE PASS"
            height="360px"
          />
        </div>
      )}

      {/* ── Public Reports & Recent Updates (PRD §16 & §29) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Public Reports */}
        <div style={{
          padding: "20px 22px", borderRadius: 14,
          background: "rgba(14,14,14,0.9)", border: "1px solid rgba(38,38,38,0.7)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <FileText style={{ width: 16, height: 16, color: "#FF6B35" }} />
            <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: "white", margin: 0 }}>
              PUBLISHED PUBLIC REPORTS
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {reports.map((rep) => (
              <div key={rep.id} style={{
                padding: "12px 14px", borderRadius: 8,
                background: "rgba(10,10,10,0.8)", border: "1px solid rgba(38,38,38,0.6)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#FF6B35", marginBottom: 4 }}>
                  <span>{rep.category}</span>
                  <span style={{ color: "#666666" }}>{rep.date}</span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "white", marginBottom: 4 }}>
                  {rep.title}
                </div>
                <p style={{ fontSize: 10, color: "#888888", margin: 0, lineHeight: 1.4 }}>
                  {rep.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Platform Updates */}
        <div style={{
          padding: "20px 22px", borderRadius: 14,
          background: "rgba(14,14,14,0.9)", border: "1px solid rgba(38,38,38,0.7)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Activity style={{ width: 16, height: 16, color: "#10b981" }} />
            <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: "white", margin: 0 }}>
              RECENT PLATFORM UPDATES
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
            <div style={{ padding: "10px 12px", background: "rgba(10,10,10,0.8)", borderRadius: 8, border: "1px solid rgba(38,38,38,0.6)" }}>
              <div style={{ color: "#10b981", fontSize: 10, fontWeight: 700, marginBottom: 2 }}>● GNSS SIMULATOR ACTIVE</div>
              <div style={{ color: "#9ca3af", fontSize: 10 }}>Multi-constellation positioning feeds operational across all 16 state nodes.</div>
            </div>

            <div style={{ padding: "10px 12px", background: "rgba(10,10,10,0.8)", borderRadius: 8, border: "1px solid rgba(38,38,38,0.6)" }}>
              <div style={{ color: "#FF6B35", fontSize: 10, fontWeight: 700, marginBottom: 2 }}>● BEM AI CHAT ASSISTANT LIVE</div>
              <div style={{ color: "#9ca3af", fontSize: 10 }}>Ask questions about satellite passes, alerts, GNSS, and Indian terrain observation.</div>
            </div>

            <div style={{ padding: "10px 12px", background: "rgba(10,10,10,0.8)", borderRadius: 8, border: "1px solid rgba(38,38,38,0.6)" }}>
              <div style={{ color: "#60a5fa", fontSize: 10, fontWeight: 700, marginBottom: 2 }}>● ZERO JAMMING DEFENSIVE PIPELINE</div>
              <div style={{ color: "#9ca3af", fontSize: 10 }}>All telemetry integrity verified via SHA-256 HMAC checksums.</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
