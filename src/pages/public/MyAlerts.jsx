import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { dataStore } from "../../services/dataStore";
import { DataBadge } from "../../components/layout/DataBadge";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  PauseCircle, 
  Eye, 
  ArrowLeft, 
  Plus, 
  MapPin, 
  Calendar, 
  Building,
  Info
} from "lucide-react";

export const MyAlerts = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState(() => dataStore.get("citizen_alert_reports"));
  const [selectedReport, setSelectedReport] = useState(null);

  // Subscribe to real-time changes
  useEffect(() => {
    const unsub = dataStore.subscribe("citizen_alert_reports", (updated) => {
      setReports(updated);
      if (selectedReport) {
        const found = updated.find(r => r.reportId === selectedReport.reportId);
        if (found) setSelectedReport(found);
      }
    });
    return unsub;
  }, [selectedReport]);

  const statusBadge = (status) => {
    switch (status) {
      case "VERIFIED":
      case "ACCEPTED":
      case "PUBLISHED":
        return { label: "VERIFIED", color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)", icon: CheckCircle2 };
      case "ON HOLD":
      case "HOLD":
        return { label: "ON HOLD", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", icon: PauseCircle };
      case "REJECTED":
        return { label: "REJECTED", color: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", icon: XCircle };
      case "PENDING REVIEW":
      default:
        return { label: "PENDING", color: "#FF6B35", bg: "rgba(255,107,53,0.12)", border: "rgba(255,107,53,0.3)", icon: Clock };
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: 1100, margin: "0 auto" }}>
      
      {/* Header */}
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center",
        justifyContent: "space-between", gap: 16, marginBottom: 24,
        background: "rgba(16,16,16,0.85)", border: "1px solid rgba(255,107,53,0.15)",
        borderRadius: 14, padding: "20px 24px"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: "white", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <AlertTriangle style={{ width: 18, height: 18, color: "#FF6B35" }} />
              MY SUBMITTED ALERTS (CITIZEN REPORTS)
            </h1>
            <DataBadge isSimulation={true} size="xs" />
          </div>
          <p style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#888888", margin: 0 }}>
            Track real-time administrative review status, hold notifications, and verified publications (PRD §40 & §41).
          </p>
        </div>

        <Link
          to="/dashboard/report-alert"
          className="aeris-btn-primary"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "9px 16px", borderRadius: 8, fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            textDecoration: "none"
          }}
        >
          <Plus style={{ width: 14, height: 14 }} />
          <span>REPORT NEW INCIDENT</span>
        </Link>
      </div>

      {/* Table & Details Grid */}
      <div style={{ display: "grid", gridTemplateColumns: selectedReport ? "1.2fr 1fr" : "1fr", gap: 20 }}>
        
        {/* Reports Table (PRD §40 format) */}
        <div style={{
          background: "rgba(14,14,14,0.9)", border: "1px solid rgba(38,38,38,0.7)",
          borderRadius: 14, overflow: "hidden"
        }}>
          <div style={{
            padding: "14px 18px", borderBottom: "1px solid rgba(38,38,38,0.7)",
            fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            color: "#FF6B35", display: "flex", justifyContent: "space-between"
          }}>
            <span>SUBMITTED INCIDENT LOG ({reports.length})</span>
            <span style={{ color: "#666" }}>REAL-TIME STATUS SYNC</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "rgba(10,10,10,0.6)", color: "#737373", borderBottom: "1px solid rgba(38,38,38,0.6)" }}>
                  <th style={{ padding: "12px 16px" }}>ALERT ID</th>
                  <th style={{ padding: "12px 16px" }}>TYPE</th>
                  <th style={{ padding: "12px 16px" }}>PLACE</th>
                  <th style={{ padding: "12px 16px" }}>REPORTED THREAT</th>
                  <th style={{ padding: "12px 16px" }}>STATUS</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => {
                  const badge = statusBadge(r.status);
                  const isSelected = selectedReport?.reportId === r.reportId;
                  return (
                    <tr
                      key={r.reportId}
                      onClick={() => setSelectedReport(r)}
                      style={{
                        borderBottom: "1px solid rgba(38,38,38,0.4)",
                        cursor: "pointer",
                        background: isSelected ? "rgba(255,107,53,0.08)" : "transparent",
                        transition: "background 0.15s"
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                    >
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: "#FF6B35" }}>
                        {r.reportId}
                      </td>
                      <td style={{ padding: "12px 16px", color: "#ededed" }}>
                        {r.eventType}
                      </td>
                      <td style={{ padding: "12px 16px", color: "#a3a3a3" }}>
                        {r.placeName}, {r.district}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          color: r.reportedThreatLevel === "CRITICAL" ? "#ef4444" : r.reportedThreatLevel === "HIGH" ? "#FF6B35" : "#f59e0b",
                          fontWeight: 700
                        }}>
                          {r.reportedThreatLevel}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "3px 8px", borderRadius: 4,
                          fontSize: 10, fontWeight: 700,
                          background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`
                        }}>
                          <badge.icon style={{ width: 11, height: 11 }} />
                          <span>{badge.label}</span>
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <button
                          style={{
                            background: "transparent", border: "1px solid rgba(255,107,53,0.3)",
                            borderRadius: 6, padding: "4px 8px", color: "#FF6B35",
                            fontSize: 10, cursor: "pointer"
                          }}
                        >
                          VIEW
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Report Inspection Panel (PRD §40 & §41 notifications) */}
        {selectedReport && (
          <div style={{
            background: "rgba(14,14,14,0.95)", border: "1px solid rgba(255,107,53,0.25)",
            borderRadius: 14, padding: "20px", display: "flex", flexDirection: "column", gap: 14,
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(38,38,38,0.7)", paddingBottom: 12 }}>
              <div>
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#888888" }}>
                  REPORT INSPECTION
                </span>
                <h3 className="font-display" style={{ fontSize: 15, fontWeight: 800, color: "white", margin: 0 }}>
                  {selectedReport.reportId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                style={{ background: "none", border: "none", color: "#888888", fontSize: 12, cursor: "pointer" }}
              >
                ✕ Close
              </button>
            </div>

            {/* Notification message per PRD §41 */}
            <div style={{
              padding: "12px 14px", borderRadius: 8,
              background: selectedReport.status === "VERIFIED" || selectedReport.status === "PUBLISHED"
                ? "rgba(16,185,129,0.1)"
                : selectedReport.status === "REJECTED"
                ? "rgba(239,68,68,0.1)"
                : selectedReport.status === "ON HOLD"
                ? "rgba(245,158,11,0.1)"
                : "rgba(255,107,53,0.1)",
              border: `1px solid ${
                selectedReport.status === "VERIFIED" || selectedReport.status === "PUBLISHED"
                  ? "rgba(16,185,129,0.3)"
                  : selectedReport.status === "REJECTED"
                  ? "rgba(239,68,68,0.3)"
                  : selectedReport.status === "ON HOLD"
                  ? "rgba(245,158,11,0.3)"
                  : "rgba(255,107,53,0.3)"
              }`,
              fontSize: 11, fontFamily: "'Inter', sans-serif", lineHeight: 1.5,
              color: "#e5e7eb"
            }}>
              <strong style={{ display: "block", marginBottom: 2, fontFamily: "'JetBrains Mono', monospace", color: "#FF6B35" }}>
                OFFICIAL BEM STATUS UPDATE:
              </strong>
              {selectedReport.status === "PENDING REVIEW" && "Your alert has been submitted and is currently under review by the BEM administration team."}
              {selectedReport.status === "ON HOLD" && `Your alert has been placed on hold for additional review. Note: ${selectedReport.adminReason || "Additional verification required."}`}
              {(selectedReport.status === "VERIFIED" || selectedReport.status === "PUBLISHED") && `Your alert has been accepted by the BEM administration team with Verified Threat Level: ${selectedReport.verifiedThreatLevel || selectedReport.reportedThreatLevel}. It is now available in the Verified Alerts section and India map.`}
              {selectedReport.status === "REJECTED" && `Your alert report was not approved for public broadcast. Reason: ${selectedReport.adminReason || "Inconclusive or duplicate submission."}`}
            </div>

            {/* Key-Value Details */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10,
              fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#a3a3a3"
            }}>
              <div>
                <span style={{ color: "#666", fontSize: 9, display: "block" }}>EVENT TYPE:</span>
                <span style={{ color: "#FF6B35", fontWeight: 700 }}>{selectedReport.eventType}</span>
              </div>
              <div>
                <span style={{ color: "#666", fontSize: 9, display: "block" }}>REPORTED THREAT:</span>
                <span style={{ color: "white", fontWeight: 700 }}>{selectedReport.reportedThreatLevel}</span>
              </div>
              <div>
                <span style={{ color: "#666", fontSize: 9, display: "block" }}>PLACE:</span>
                <span style={{ color: "white" }}>{selectedReport.placeName}</span>
              </div>
              <div>
                <span style={{ color: "#666", fontSize: 9, display: "block" }}>NEARBY LANDMARK:</span>
                <span style={{ color: "white" }}>{selectedReport.nearbyLandmark}</span>
              </div>
              <div>
                <span style={{ color: "#666", fontSize: 9, display: "block" }}>DISTRICT / STATE:</span>
                <span style={{ color: "white" }}>{selectedReport.district}, {selectedReport.state}</span>
              </div>
              <div>
                <span style={{ color: "#666", fontSize: 9, display: "block" }}>DATE & TIME:</span>
                <span style={{ color: "white" }}>{selectedReport.incidentDate} {selectedReport.incidentTime}</span>
              </div>
            </div>

            {/* Description */}
            <div style={{ borderTop: "1px solid rgba(38,38,38,0.7)", paddingTop: 10 }}>
              <span style={{ color: "#666", fontSize: 9, fontFamily: "'JetBrains Mono', monospace", display: "block", marginBottom: 4 }}>
                OBSERVED DETAILS:
              </span>
              <p style={{ fontSize: 11, color: "#d4d4d4", margin: 0, lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>
                {selectedReport.description}
              </p>
            </div>

            {/* Photo preview if present */}
            {selectedReport.imageUrl && (
              <div style={{ borderTop: "1px solid rgba(38,38,38,0.7)", paddingTop: 10 }}>
                <span style={{ color: "#666", fontSize: 9, fontFamily: "'JetBrains Mono', monospace", display: "block", marginBottom: 6 }}>
                  ATTACHED PHOTOGRAPHIC EVIDENCE:
                </span>
                <img
                  src={selectedReport.imageUrl}
                  alt="Citizen report"
                  style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(38,38,38,0.8)" }}
                />
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
