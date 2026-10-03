import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dataStore } from "../../services/dataStore";
import { DataBadge } from "../../components/layout/DataBadge";
import { EarthMap } from "../../components/map/EarthMap";
import { 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  Building, 
  Filter, 
  Search, 
  ExternalLink,
  Info
} from "lucide-react";

export const VerifiedAlerts = () => {
  const [citizenReports, setCitizenReports] = useState(() => dataStore.get("citizen_alert_reports"));
  const [systemAlerts, setSystemAlerts] = useState(() => dataStore.get("alerts"));
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Re-sync on storage events
  useEffect(() => {
    const unsub1 = dataStore.subscribe("citizen_alert_reports", setCitizenReports);
    const unsub2 = dataStore.subscribe("alerts", setSystemAlerts);
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  // Filter only VERIFIED / ACCEPTED / PUBLISHED alerts per PRD §37 & §38
  const verifiedCitizenAlerts = citizenReports
    .filter(r => r.status === "VERIFIED" || r.status === "ACCEPTED" || r.status === "PUBLISHED")
    .map(r => ({
      alertId: r.reportId,
      type: r.eventType,
      placeName: r.placeName,
      nearbyLandmark: r.nearbyLandmark,
      district: r.district,
      state: r.state,
      pinCode: r.pinCode,
      threatLevel: r.verifiedThreatLevel || r.reportedThreatLevel || "MEDIUM",
      status: "VERIFIED",
      date: r.incidentDate,
      time: r.incidentTime,
      description: r.description,
      imageUrl: r.imageUrl,
      verifiedBy: r.reviewedBy || "Elena Rostova (Administrator)",
      isCitizenOrigin: true
    }));

  const verifiedSystemAlerts = systemAlerts
    .filter(a => a.status === "approved" || a.status === "published" || a.status === "public_posted")
    .map(a => ({
      alertId: a.alertId,
      type: a.type.replace(/_/g, " "),
      placeName: a.location,
      nearbyLandmark: "Monitoring Corridor Node",
      district: a.location.split(" ")[0] || "Regional",
      state: "India",
      pinCode: "N/A",
      threatLevel: a.severity === "CRITICAL" ? "CRITICAL" : a.severity === "HIGH_PRIORITY" ? "HIGH" : "MEDIUM",
      status: "VERIFIED",
      date: new Date(a.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      time: "Telemetry UTC",
      description: a.description,
      imageUrl: null,
      verifiedBy: a.reviewedBy || "Marcus Vance",
      isCitizenOrigin: false
    }));

  const combinedVerified = [...verifiedCitizenAlerts, ...verifiedSystemAlerts].filter(item => {
    const matchesSev = filterSeverity === "ALL" || item.threatLevel === filterSeverity;
    const matchesSearch = !searchQuery || 
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.placeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesSearch;
  });

  return (
    <div style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>

      {/* Header */}
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center",
        justifyContent: "space-between", gap: 16, marginBottom: 24,
        background: "rgba(16,16,16,0.85)", border: "1px solid rgba(16,185,129,0.2)",
        borderRadius: 14, padding: "20px 24px"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: "white", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <ShieldCheck style={{ width: 20, height: 20, color: "#10b981" }} />
              VERIFIED BEM ALERTS — PEOPLE OF INDIA
            </h1>
            <span style={{
              padding: "3px 8px", borderRadius: 4, fontSize: 9,
              fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)"
            }}>
              OFFICIAL BROADCAST
            </span>
            <DataBadge isSimulation={true} size="xs" />
          </div>
          <p style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#888888", margin: 0 }}>
            Only alerts accepted and human-verified by authorized BEM administrators appear here (PRD §37 & §38).
          </p>
        </div>

        <Link
          to="/dashboard/report-alert"
          style={{
            padding: "9px 16px", borderRadius: 8,
            background: "rgba(255,107,53,0.15)", border: "1px solid rgba(255,107,53,0.4)",
            color: "#FF6B35", fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700, textDecoration: "none"
          }}
        >
          🚨 REPORT AN INCIDENT
        </Link>
      </div>

      {/* Filters & Search */}
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center",
        justifyContent: "space-between", gap: 12, marginBottom: 20,
        background: "rgba(14,14,14,0.9)", border: "1px solid rgba(38,38,38,0.7)",
        borderRadius: 12, padding: "12px 18px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Filter style={{ width: 14, height: 14, color: "#FF6B35" }} />
          <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#888888" }}>
            THREAT LEVEL:
          </span>
          {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              style={{
                padding: "4px 10px", borderRadius: 6, cursor: "pointer",
                fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                background: filterSeverity === sev ? "#FF6B35" : "transparent",
                color: filterSeverity === sev ? "#0f0f0f" : "#888888",
                border: filterSeverity === sev ? "none" : "1px solid rgba(38,38,38,0.8)"
              }}
            >
              {sev}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", minWidth: 260 }}>
          <Search style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, color: "#666" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search verified place or type..."
            style={{
              width: "100%", padding: "7px 12px 7px 30px", borderRadius: 6,
              background: "rgba(8,8,8,0.8)", border: "1px solid rgba(38,38,38,0.8)",
              color: "white", fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
              outline: "none"
            }}
          />
        </div>
      </div>

      {/* Main Grid: Alert Cards (PRD §85 specification) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 18 }}>
        {combinedVerified.length === 0 ? (
          <div style={{
            gridColumn: "1 / -1", padding: 36, textAlign: "center",
            background: "rgba(14,14,14,0.7)", borderRadius: 14, border: "1px solid rgba(38,38,38,0.6)",
            color: "#666666", fontFamily: "'JetBrains Mono', monospace", fontSize: 12
          }}>
            No verified alerts matching current criteria. All monitoring corridors nominal.
          </div>
        ) : (
          combinedVerified.map(alert => (
            <div
              key={alert.alertId}
              style={{
                background: "rgba(14,14,14,0.95)",
                border: "1px solid rgba(38,38,38,0.8)",
                borderRadius: 14, padding: "20px",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                gap: 14, transition: "all 0.2s",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,107,53,0.35)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(38,38,38,0.8)"}
            >
              <div>
                {/* Header label: 🚨 VERIFIED BEM ALERT per PRD §37 & §85 */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{
                      padding: "3px 8px", borderRadius: 4, fontSize: 9,
                      fontFamily: "'JetBrains Mono', monospace", fontWeight: 800,
                      background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)"
                    }}>
                      🚨 VERIFIED BEM ALERT
                    </span>
                    {alert.isCitizenOrigin && (
                      <span style={{ fontSize: 9, color: "#888888", fontFamily: "'JetBrains Mono', monospace" }}>
                        CITIZEN CONFIRMED
                      </span>
                    )}
                  </div>
                  <DataBadge isSimulation={true} size="xs" />
                </div>

                {/* Event Type & Location */}
                <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: "white", margin: "0 0 8px", textTransform: "uppercase" }}>
                  {alert.type}
                </h3>

                <div style={{ display: "flex", alignItems: "flex-start", gap: 6, color: "#e5e7eb", fontSize: 12, marginBottom: 12 }}>
                  <MapPin style={{ width: 14, height: 14, color: "#FF6B35", flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong style={{ color: "#ffffff" }}>{alert.placeName}</strong>
                    <div style={{ fontSize: 10, color: "#9ca3af" }}>Near {alert.nearbyLandmark}</div>
                    <div style={{ fontSize: 10, color: "#666666" }}>{alert.district}, {alert.state}</div>
                  </div>
                </div>

                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
                  padding: "10px", borderRadius: 8, background: "rgba(8,8,8,0.7)",
                  border: "1px solid rgba(38,38,38,0.6)", fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                  marginBottom: 10
                }}>
                  <div>
                    <span style={{ color: "#666", display: "block" }}>THREAT LEVEL:</span>
                    <span style={{
                      color: alert.threatLevel === "CRITICAL" ? "#ef4444" : alert.threatLevel === "HIGH" ? "#FF6B35" : "#10b981",
                      fontWeight: 800, fontSize: 11
                    }}>
                      {alert.threatLevel}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#666", display: "block" }}>STATUS:</span>
                    <span style={{ color: "#10b981", fontWeight: 700 }}>
                      ● {alert.status}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#666", display: "block" }}>ALERT ID:</span>
                    <span style={{ color: "#FF6B35", fontWeight: 700 }}>{alert.alertId}</span>
                  </div>
                  <div>
                    <span style={{ color: "#666", display: "block" }}>DATE:</span>
                    <span style={{ color: "#a3a3a3" }}>{alert.date}</span>
                  </div>
                </div>

                <p style={{ fontSize: 11, color: "#a3a3a3", margin: 0, lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>
                  {alert.description}
                </p>
              </div>

              {/* View Details Button (PRD §85) */}
              <button
                onClick={() => setSelectedAlert(alert)}
                style={{
                  width: "100%", padding: "9px 0", borderRadius: 8,
                  background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.3)",
                  color: "#FF6B35", fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,107,53,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,107,53,0.1)"}
              >
                [ VIEW DETAILS ]
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal: Detailed Alert View (PRD §38) */}
      {selectedAlert && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{
            background: "rgba(14,14,14,0.98)", border: "1px solid rgba(255,107,53,0.35)",
            borderRadius: 16, maxWidth: 600, width: "100%", padding: "26px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.8)", maxHeight: "90vh", overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(38,38,38,0.7)", paddingBottom: 14, marginBottom: 16 }}>
              <div>
                <span style={{
                  padding: "3px 8px", borderRadius: 4, fontSize: 9,
                  fontFamily: "'JetBrains Mono', monospace", fontWeight: 800,
                  background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)"
                }}>
                  VERIFIED BEM ALERT
                </span>
                <h2 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: "white", margin: "6px 0 0" }}>
                  {selectedAlert.type}
                </h2>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                style={{ background: "none", border: "none", color: "#888", fontSize: 16, cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, background: "rgba(8,8,8,0.7)", padding: 14, borderRadius: 8 }}>
                <div><span style={{ color: "#666", fontSize: 10 }}>ALERT ID:</span> <strong style={{ color: "#FF6B35" }}>{selectedAlert.alertId}</strong></div>
                <div><span style={{ color: "#666", fontSize: 10 }}>VERIFIED THREAT:</span> <strong style={{ color: selectedAlert.threatLevel === "CRITICAL" ? "#ef4444" : "#FF6B35" }}>{selectedAlert.threatLevel}</strong></div>
                <div><span style={{ color: "#666", fontSize: 10 }}>PLACE:</span> <span style={{ color: "white" }}>{selectedAlert.placeName}</span></div>
                <div><span style={{ color: "#666", fontSize: 10 }}>NEARBY LANDMARK:</span> <span style={{ color: "white" }}>{selectedAlert.nearbyLandmark}</span></div>
                <div><span style={{ color: "#666", fontSize: 10 }}>DISTRICT / STATE:</span> <span style={{ color: "white" }}>{selectedAlert.district}, {selectedAlert.state}</span></div>
                <div><span style={{ color: "#666", fontSize: 10 }}>VERIFIED BY:</span> <span style={{ color: "#10b981" }}>{selectedAlert.verifiedBy}</span></div>
              </div>

              <div>
                <span style={{ color: "#888", fontSize: 10, display: "block", marginBottom: 4 }}>RELEVANT OFFICIAL DESCRIPTION:</span>
                <p style={{ color: "#ededed", fontFamily: "'Inter', sans-serif", fontSize: 12, margin: 0, lineHeight: 1.6 }}>
                  {selectedAlert.description}
                </p>
              </div>

              {selectedAlert.imageUrl && (
                <div>
                  <span style={{ color: "#888", fontSize: 10, display: "block", marginBottom: 6 }}>APPROVED FIELD PHOTOGRAPH:</span>
                  <img
                    src={selectedAlert.imageUrl}
                    alt="Verified incident"
                    style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(38,38,38,0.8)" }}
                  />
                </div>
              )}
            </div>

            <div style={{ marginTop: 20, textAlign: "right" }}>
              <button
                onClick={() => setSelectedAlert(null)}
                style={{
                  padding: "8px 18px", borderRadius: 8,
                  background: "rgba(38,38,38,0.7)", border: "1px solid rgba(60,60,60,0.8)",
                  color: "white", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", cursor: "pointer"
                }}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
