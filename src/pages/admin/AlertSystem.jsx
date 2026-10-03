import React, { useState, useEffect } from "react";
import { dataStore } from "../../services/dataStore";
import { useAuth } from "../../context/AuthContext";
import { DataBadge } from "../../components/layout/DataBadge";
import { Modal } from "../../components/ui/Modal";
import { 
  AlertTriangle, CheckCircle2, Share2, 
  Filter, ArrowRight, XCircle, Eye, Clock,
  ShieldCheck, RefreshCw, UserCheck, MapPin, 
  Building, Calendar, Camera, Info, PauseCircle,
  Layers, Search, FileText
} from "lucide-react";

export const AlertSystem = () => {
  const { currentUser, isSuperAdmin } = useAuth();

  // Tabs: 'citizen' (Citizen Reports Intake) or 'system' (Telemetry Ingestion Alerts)
  const [activeTab, setActiveTab] = useState("citizen");

  // Citizen Reports State (PRD §28 - §36)
  const [citizenReports, setCitizenReports] = useState(() => dataStore.get("citizen_alert_reports"));
  const [citizenFilterStatus, setCitizenFilterStatus] = useState("ALL"); // ALL, PENDING, APPROVED, HOLD, REJECTED
  const [citizenFilterEventType, setCitizenFilterEventType] = useState("ALL");
  const [selectedCitizenReport, setSelectedCitizenReport] = useState(null);

  // Accept Modal State (PRD §32)
  const [acceptModal, setAcceptModal] = useState(null);
  const [verifiedThreatLevel, setVerifiedThreatLevel] = useState("MEDIUM");
  const [adminNotes, setAdminNotes] = useState("");

  // Hold / Reject Modal State (PRD §34 & §35)
  const [holdModal, setHoldModal] = useState(null);
  const [holdReason, setHoldReason] = useState("");
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // System Telemetry Alerts State (PRD §49)
  const [systemAlerts, setSystemAlerts] = useState(() => dataStore.get("alerts"));
  const [systemFilterSeverity, setSystemFilterSeverity] = useState("ALL");

  // Subscribe to real-time events for instant updates (PRD §28 & §71)
  useEffect(() => {
    const unsub1 = dataStore.subscribe("citizen_alert_reports", setCitizenReports);
    const unsub2 = dataStore.subscribe("alerts", setSystemAlerts);
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  // Citizen count metrics
  const pendingCitizenCount = citizenReports.filter(r => r.status === "PENDING REVIEW" || r.status === "PENDING").length;
  const approvedCitizenCount = citizenReports.filter(r => r.status === "VERIFIED" || r.status === "ACCEPTED" || r.status === "PUBLISHED").length;
  const holdCitizenCount = citizenReports.filter(r => r.status === "ON HOLD" || r.status === "HOLD").length;
  const rejectedCitizenCount = citizenReports.filter(r => r.status === "REJECTED").length;

  // Filter citizen reports per PRD §29
  const filteredCitizenReports = citizenReports.filter(r => {
    let matchesStatus = true;
    if (citizenFilterStatus === "PENDING") matchesStatus = r.status === "PENDING REVIEW" || r.status === "PENDING";
    else if (citizenFilterStatus === "APPROVED") matchesStatus = r.status === "VERIFIED" || r.status === "ACCEPTED" || r.status === "PUBLISHED";
    else if (citizenFilterStatus === "HOLD") matchesStatus = r.status === "ON HOLD" || r.status === "HOLD";
    else if (citizenFilterStatus === "REJECTED") matchesStatus = r.status === "REJECTED";

    const matchesType = citizenFilterEventType === "ALL" || r.eventType === citizenFilterEventType;
    return matchesStatus && matchesType;
  });

  // Action: Accept & Publish Alert (PRD §32 & §33)
  const handleConfirmAccept = () => {
    if (!acceptModal) return;
    const reportId = acceptModal.reportId;
    const reviewer = currentUser?.name || "Elena Rostova (Administrator)";

    // 1. Update citizen_alert_reports
    dataStore.update("citizen_alert_reports", r => r.reportId === reportId, {
      status: "VERIFIED",
      verifiedThreatLevel: verifiedThreatLevel,
      adminNotes: adminNotes,
      reviewedBy: reviewer,
      reviewedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    });

    // 2. Also publish to system alerts collection for cross-system availability (PRD §67)
    const newSystemAlert = {
      alertId: `ALT-PUB-${Date.now().toString().slice(-4)}`,
      type: acceptModal.eventType.toUpperCase().replace(/\s+/g, "_"),
      location: `${acceptModal.placeName}, ${acceptModal.district}`,
      severity: verifiedThreatLevel === "CRITICAL" ? "CRITICAL" : verifiedThreatLevel === "HIGH" ? "HIGH_PRIORITY" : "OBSERVATION",
      description: acceptModal.description,
      evidence: `CITIZEN REPORT ${reportId} (Reviewed & Verified by ${reviewer})`,
      status: "approved",
      reviewedBy: reviewer,
      dataSource: "VERIFIED DATA",
      createdAt: new Date().toISOString()
    };
    dataStore.add("alerts", newSystemAlert);

    // 3. Log audit event (PRD §70)
    dataStore.add("audit_logs", {
      id: "aud_" + Date.now(),
      actor: reviewer,
      action: "CITIZEN_ALERT_ACCEPTED_AND_PUBLISHED",
      target: reportId,
      timestamp: new Date().toISOString(),
      metadata: { verifiedThreatLevel, notes: adminNotes }
    });

    setAcceptModal(null);
    setAdminNotes("");
    if (selectedCitizenReport?.reportId === reportId) {
      setSelectedCitizenReport(prev => ({ ...prev, status: "VERIFIED", verifiedThreatLevel }));
    }
  };

  // Action: Hold Alert (PRD §34)
  const handleConfirmHold = () => {
    if (!holdModal) return;
    const reportId = holdModal.reportId;
    const reviewer = currentUser?.name || "Elena Rostova (Administrator)";

    dataStore.update("citizen_alert_reports", r => r.reportId === reportId, {
      status: "ON HOLD",
      adminReason: holdReason || "Additional verification required by operations team.",
      reviewedBy: reviewer,
      reviewedAt: new Date().toISOString()
    });

    dataStore.add("audit_logs", {
      id: "aud_" + Date.now(),
      actor: reviewer,
      action: "CITIZEN_ALERT_PLACED_ON_HOLD",
      target: reportId,
      timestamp: new Date().toISOString(),
      metadata: { reason: holdReason }
    });

    setHoldModal(null);
    setHoldReason("");
  };

  // Action: Reject Alert (PRD §35)
  const handleConfirmReject = () => {
    if (!rejectModal) return;
    const reportId = rejectModal.reportId;
    const reviewer = currentUser?.name || "Elena Rostova (Administrator)";

    dataStore.update("citizen_alert_reports", r => r.reportId === reportId, {
      status: "REJECTED",
      adminReason: rejectReason || "Inconclusive report or unverified duplicate observation.",
      reviewedBy: reviewer,
      reviewedAt: new Date().toISOString()
    });

    dataStore.add("audit_logs", {
      id: "aud_" + Date.now(),
      actor: reviewer,
      action: "CITIZEN_ALERT_REJECTED",
      target: reportId,
      timestamp: new Date().toISOString(),
      metadata: { reason: rejectReason }
    });

    setRejectModal(null);
    setRejectReason("");
  };

  return (
    <div style={{ padding: "24px", maxWidth: 1440, margin: "0 auto" }}>

      {/* ── HEADER ── */}
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center",
        justifyContent: "space-between", gap: 16,
        background: "rgba(16,16,16,0.85)", border: "1px solid rgba(255,107,53,0.15)",
        borderRadius: 14, padding: "20px 24px", marginBottom: 20
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <h1 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: "white", margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
              <AlertTriangle style={{ width: 20, height: 20, color: "#FF6B35" }} />
              BEM ALERT VERIFICATION & REVIEW CENTER
            </h1>
            <DataBadge isSimulation={true} size="xs" />
          </div>
          <p style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#888888", margin: 0 }}>
            Real-time citizen alert intake, administrative verification, and public alert publishing pipeline (PRD §28 - §36).
          </p>
        </div>

        {/* Real-time Indicator (PRD §28 & §71) */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 8,
            background: pendingCitizenCount > 0 ? "rgba(255,107,53,0.15)" : "rgba(16,185,129,0.1)",
            border: `1px solid ${pendingCitizenCount > 0 ? "rgba(255,107,53,0.4)" : "rgba(16,185,129,0.3)"}`,
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 800,
            color: pendingCitizenCount > 0 ? "#FF6B35" : "#10b981"
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: pendingCitizenCount > 0 ? "#FF6B35" : "#10b981" }} className="animate-pulse" />
            <span>ALERTS: {pendingCitizenCount} NEW PENDING REVIEW</span>
          </div>
        </div>
      </div>

      {/* ── MAIN TABS: CITIZEN INTAKE vs TELEMETRY ALERTS ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, borderBottom: "1px solid rgba(38,38,38,0.7)", paddingBottom: 14 }}>
        <button
          onClick={() => setActiveTab("citizen")}
          style={{
            padding: "9px 18px", borderRadius: 8, cursor: "pointer",
            fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            background: activeTab === "citizen" ? "#FF6B35" : "transparent",
            color: activeTab === "citizen" ? "#0f0f0f" : "#888888",
            border: activeTab === "citizen" ? "none" : "1px solid rgba(38,38,38,0.8)",
            display: "flex", alignItems: "center", gap: 8
          }}
        >
          <UserCheck style={{ width: 14, height: 14 }} />
          <span>CITIZEN ALERT REPORTS ({citizenReports.length})</span>
          {pendingCitizenCount > 0 && (
            <span style={{
              background: activeTab === "citizen" ? "#0f0f0f" : "#FF6B35",
              color: activeTab === "citizen" ? "#FF6B35" : "#0f0f0f",
              padding: "1px 6px", borderRadius: 10, fontSize: 10
            }}>
              {pendingCitizenCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("system")}
          style={{
            padding: "9px 18px", borderRadius: 8, cursor: "pointer",
            fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            background: activeTab === "system" ? "#FF6B35" : "transparent",
            color: activeTab === "system" ? "#0f0f0f" : "#888888",
            border: activeTab === "system" ? "none" : "1px solid rgba(38,38,38,0.8)",
            display: "flex", alignItems: "center", gap: 8
          }}
        >
          <Layers style={{ width: 14, height: 14 }} />
          <span>TELEMETRY & RADAR INGEST ({systemAlerts.length})</span>
        </button>
      </div>

      {/* ════ TAB 1: CITIZEN ALERT REPORTS (PRD §28 - §36) ════ */}
      {activeTab === "citizen" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* Subtabs per PRD §29: ALL, PENDING, APPROVED, HOLD, REJECTED */}
          <div style={{
            display: "flex", flexWrap: "wrap", alignItems: "center",
            justifyContent: "space-between", gap: 12,
            background: "rgba(14,14,14,0.9)", border: "1px solid rgba(38,38,38,0.7)",
            borderRadius: 12, padding: "12px 18px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#666", marginRight: 4 }}>
                FILTER STATUS:
              </span>
              {[
                { key: "ALL", label: `ALL (${citizenReports.length})` },
                { key: "PENDING", label: `PENDING (${pendingCitizenCount})`, color: "#FF6B35" },
                { key: "APPROVED", label: `APPROVED (${approvedCitizenCount})`, color: "#10b981" },
                { key: "HOLD", label: `ON HOLD (${holdCitizenCount})`, color: "#f59e0b" },
                { key: "REJECTED", label: `REJECTED (${rejectedCitizenCount})`, color: "#ef4444" }
              ].map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => setCitizenFilterStatus(key)}
                  style={{
                    padding: "5px 12px", borderRadius: 6, cursor: "pointer",
                    fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                    background: citizenFilterStatus === key ? (color || "#FF6B35") : "transparent",
                    color: citizenFilterStatus === key ? "#0f0f0f" : (color || "#888888"),
                    border: citizenFilterStatus === key ? "none" : "1px solid rgba(38,38,38,0.8)",
                    transition: "all 0.15s"
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Event Type Filter */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Filter style={{ width: 13, height: 13, color: "#888" }} />
              <select
                value={citizenFilterEventType}
                onChange={e => setCitizenFilterEventType(e.target.value)}
                style={{
                  background: "rgba(10,10,10,0.9)", border: "1px solid rgba(38,38,38,0.8)",
                  borderRadius: 6, padding: "5px 10px", color: "white", fontSize: 10,
                  fontFamily: "'JetBrains Mono', monospace", outline: "none"
                }}
              >
                <option value="ALL">All Event Types</option>
                <option value="Heavy Rainfall">Heavy Rainfall</option>
                <option value="Flood">Flood</option>
                <option value="Landslide">Landslide</option>
                <option value="Earthquake">Earthquake</option>
                <option value="Fire">Fire</option>
                <option value="Cyclone">Cyclone</option>
              </select>
            </div>
          </div>

          {/* Cards Grid & Detail Panel */}
          <div style={{ display: "grid", gridTemplateColumns: selectedCitizenReport ? "1.1fr 1fr" : "1fr", gap: 20 }}>
            
            {/* Cards List per PRD §30 */}
            <div style={{ display: "grid", gridTemplateColumns: selectedCitizenReport ? "1fr" : "repeat(auto-fill, minmax(380px, 1fr))", gap: 16 }}>
              {filteredCitizenReports.length === 0 ? (
                <div style={{
                  gridColumn: "1 / -1", padding: 40, textAlign: "center",
                  background: "rgba(14,14,14,0.7)", borderRadius: 12, border: "1px solid rgba(38,38,38,0.6)",
                  color: "#666", fontFamily: "'JetBrains Mono', monospace", fontSize: 12
                }}>
                  No citizen reports in this category.
                </div>
              ) : (
                filteredCitizenReports.map((report) => (
                  <div
                    key={report.reportId}
                    style={{
                      background: "rgba(14,14,14,0.95)",
                      border: `1px solid ${selectedCitizenReport?.reportId === report.reportId ? "#FF6B35" : "rgba(38,38,38,0.8)"}`,
                      borderRadius: 14, padding: "18px 20px",
                      display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 14,
                      boxShadow: selectedCitizenReport?.reportId === report.reportId ? "0 4px 20px rgba(255,107,53,0.15)" : "none",
                      transition: "all 0.2s"
                    }}
                  >
                    <div>
                      {/* Top Bar: Report ID + Status Badge */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: "#FF6B35" }}>
                            {report.reportId}
                          </span>
                          <span style={{
                            fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
                            padding: "2px 6px", borderRadius: 4, background: "rgba(255,255,255,0.06)", color: "#888"
                          }}>
                            {report.source || "CITIZEN REPORT"}
                          </span>
                        </div>

                        <span style={{
                          fontSize: 9, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800,
                          padding: "3px 8px", borderRadius: 4,
                          background: report.status === "VERIFIED" ? "rgba(16,185,129,0.15)" : report.status === "ON HOLD" ? "rgba(245,158,11,0.15)" : report.status === "REJECTED" ? "rgba(239,68,68,0.15)" : "rgba(255,107,53,0.15)",
                          color: report.status === "VERIFIED" ? "#10b981" : report.status === "ON HOLD" ? "#f59e0b" : report.status === "REJECTED" ? "#ef4444" : "#FF6B35",
                          border: `1px solid ${report.status === "VERIFIED" ? "rgba(16,185,129,0.3)" : report.status === "ON HOLD" ? "rgba(245,158,11,0.3)" : report.status === "REJECTED" ? "rgba(239,68,68,0.3)" : "rgba(255,107,53,0.3)"}`
                        }}>
                          {report.status}
                        </span>
                      </div>

                      {/* Event Type & Reporter Name */}
                      <div style={{ marginBottom: 10 }}>
                        <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, color: "white", margin: 0 }}>
                          {report.eventType}
                        </h3>
                        <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#888888", marginTop: 2 }}>
                          Reporter: <strong style={{ color: "#ededed" }}>{report.reporterName}</strong>
                        </div>
                      </div>

                      {/* Location info (PRD §30) */}
                      <div style={{
                        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6,
                        background: "rgba(8,8,8,0.7)", padding: "10px 12px", borderRadius: 8,
                        fontSize: 10, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12
                      }}>
                        <div><span style={{ color: "#666" }}>PLACE:</span> <span style={{ color: "white" }}>{report.placeName}</span></div>
                        <div><span style={{ color: "#666" }}>LANDMARK:</span> <span style={{ color: "white" }}>{report.nearbyLandmark}</span></div>
                        <div><span style={{ color: "#666" }}>DISTRICT:</span> <span style={{ color: "white" }}>{report.district}</span></div>
                        <div><span style={{ color: "#666" }}>STATE:</span> <span style={{ color: "white" }}>{report.state} ({report.pinCode})</span></div>
                      </div>

                      {/* Threat & Timestamp */}
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#888" }}>
                        <span>
                          REPORTED THREAT: <strong style={{
                            color: report.reportedThreatLevel === "CRITICAL" ? "#ef4444" : report.reportedThreatLevel === "HIGH" ? "#FF6B35" : "#f59e0b"
                          }}>{report.reportedThreatLevel}</strong>
                        </span>
                        <span>{report.incidentDate}</span>
                      </div>
                    </div>

                    {/* PRD §30 Action Buttons: VIEW, ACCEPT, HOLD, REJECT */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 6,
                      borderTop: "1px solid rgba(38,38,38,0.7)", paddingTop: 12
                    }}>
                      <button
                        onClick={() => setSelectedCitizenReport(report)}
                        style={{
                          flex: 1, padding: "7px 0", borderRadius: 6, cursor: "pointer",
                          background: "rgba(38,38,38,0.7)", border: "1px solid rgba(60,60,60,0.8)",
                          color: "white", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 4
                        }}
                      >
                        <Eye style={{ width: 12, height: 12 }} />
                        <span>VIEW</span>
                      </button>

                      {report.status !== "VERIFIED" && report.status !== "PUBLISHED" && (
                        <button
                          onClick={() => {
                            setAcceptModal(report);
                            setVerifiedThreatLevel(report.reportedThreatLevel || "MEDIUM");
                          }}
                          style={{
                            flex: 1.2, padding: "7px 0", borderRadius: 6, cursor: "pointer",
                            background: "#10b981", border: "none", color: "#0f0f0f",
                            fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 4
                          }}
                        >
                          <CheckCircle2 style={{ width: 12, height: 12 }} />
                          <span>ACCEPT</span>
                        </button>
                      )}

                      {report.status !== "ON HOLD" && (
                        <button
                          onClick={() => setHoldModal(report)}
                          style={{
                            flex: 1, padding: "7px 0", borderRadius: 6, cursor: "pointer",
                            background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)",
                            color: "#f59e0b", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700
                          }}
                        >
                          HOLD
                        </button>
                      )}

                      {report.status !== "REJECTED" && (
                        <button
                          onClick={() => setRejectModal(report)}
                          style={{
                            flex: 1, padding: "7px 0", borderRadius: 6, cursor: "pointer",
                            background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
                            color: "#ef4444", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700
                          }}
                        >
                          REJECT
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Detailed Inspection Panel (PRD §31) */}
            {selectedCitizenReport && (
              <div style={{
                background: "rgba(14,14,14,0.98)", border: "1px solid rgba(255,107,53,0.3)",
                borderRadius: 14, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14,
                boxShadow: "0 10px 30px rgba(0,0,0,0.6)", height: "fit-content"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(38,38,38,0.7)", paddingBottom: 12 }}>
                  <div>
                    <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#FF6B35" }}>
                      CITIZEN ALERT INTAKE DOSSIER
                    </span>
                    <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: "white", margin: 0 }}>
                      {selectedCitizenReport.reportId}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedCitizenReport(null)}
                    style={{ background: "none", border: "none", color: "#888", fontSize: 14, cursor: "pointer" }}
                  >
                    ✕
                  </button>
                </div>

                {/* Key Metadata Table */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10,
                  fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#a3a3a3",
                  background: "rgba(8,8,8,0.7)", padding: 14, borderRadius: 8
                }}>
                  <div><span style={{ color: "#666", fontSize: 9 }}>REPORTER NAME:</span> <strong style={{ color: "white", display: "block" }}>{selectedCitizenReport.reporterName}</strong></div>
                  <div><span style={{ color: "#666", fontSize: 9 }}>EVENT TYPE:</span> <strong style={{ color: "#FF6B35", display: "block" }}>{selectedCitizenReport.eventType}</strong></div>
                  <div><span style={{ color: "#666", fontSize: 9 }}>PLACE NAME:</span> <span style={{ color: "white", display: "block" }}>{selectedCitizenReport.placeName}</span></div>
                  <div><span style={{ color: "#666", fontSize: 9 }}>NEARBY LANDMARK:</span> <span style={{ color: "white", display: "block" }}>{selectedCitizenReport.nearbyLandmark}</span></div>
                  <div><span style={{ color: "#666", fontSize: 9 }}>DISTRICT & STATE:</span> <span style={{ color: "white", display: "block" }}>{selectedCitizenReport.district}, {selectedCitizenReport.state}</span></div>
                  <div><span style={{ color: "#666", fontSize: 9 }}>CITY PIN CODE:</span> <span style={{ color: "white", display: "block" }}>{selectedCitizenReport.pinCode}</span></div>
                  <div><span style={{ color: "#666", fontSize: 9 }}>REPORTED THREAT:</span> <span style={{ color: selectedCitizenReport.reportedThreatLevel === "CRITICAL" ? "#ef4444" : "#f59e0b", fontWeight: 800, display: "block" }}>{selectedCitizenReport.reportedThreatLevel}</span></div>
                  <div><span style={{ color: "#666", fontSize: 9 }}>CURRENT STATUS:</span> <span style={{ color: "#10b981", fontWeight: 800, display: "block" }}>{selectedCitizenReport.status}</span></div>
                  <div><span style={{ color: "#666", fontSize: 9 }}>DATE & TIME:</span> <span style={{ color: "white", display: "block" }}>{selectedCitizenReport.incidentDate} · {selectedCitizenReport.incidentTime}</span></div>
                  <div><span style={{ color: "#666", fontSize: 9 }}>SUBMITTED AT:</span> <span style={{ color: "white", display: "block" }}>{new Date(selectedCitizenReport.submittedAt).toLocaleTimeString()}</span></div>
                </div>

                {/* Description */}
                <div>
                  <span style={{ color: "#888", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", display: "block", marginBottom: 4 }}>
                    CITIZEN OBSERVATION DETAILS:
                  </span>
                  <p style={{
                    fontSize: 11, color: "#ededed", margin: 0, padding: 12,
                    background: "rgba(8,8,8,0.7)", borderRadius: 8, border: "1px solid rgba(38,38,38,0.6)",
                    lineHeight: 1.6, fontFamily: "'Inter', sans-serif"
                  }}>
                    {selectedCitizenReport.description}
                  </p>
                </div>

                {/* Photo Preview if attached */}
                {selectedCitizenReport.imageUrl && (
                  <div>
                    <span style={{ color: "#888", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", display: "block", marginBottom: 6 }}>
                      SUBMITTED PHOTOGRAPHIC EVIDENCE:
                    </span>
                    <img
                      src={selectedCitizenReport.imageUrl}
                      alt="Citizen evidence"
                      style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(255,107,53,0.3)" }}
                    />
                  </div>
                )}

                {/* Admin notes if reviewed */}
                {selectedCitizenReport.adminNotes && (
                  <div style={{ padding: 10, borderRadius: 8, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>
                    <span style={{ color: "#10b981", fontWeight: 700 }}>ADMIN VERIFICATION NOTES:</span>
                    <p style={{ color: "#d4d4d4", margin: "4px 0 0" }}>{selectedCitizenReport.adminNotes}</p>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      )}

      {/* ════ TAB 2: TELEMETRY INGESTION ALERTS (PRD §49) ════ */}
      {activeTab === "system" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "rgba(14,14,14,0.9)", padding: "12px 18px", borderRadius: 12, border: "1px solid rgba(38,38,38,0.7)"
          }}>
            <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#888" }}>
              FILTER TELEMETRY SEVERITY:
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              {["ALL", "CRITICAL", "HIGH_PRIORITY", "OBSERVATION"].map(sev => (
                <button
                  key={sev}
                  onClick={() => setSystemFilterSeverity(sev)}
                  style={{
                    padding: "4px 10px", borderRadius: 6, cursor: "pointer",
                    fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                    background: systemFilterSeverity === sev ? "#FF6B35" : "transparent",
                    color: systemFilterSeverity === sev ? "#0f0f0f" : "#888",
                    border: systemFilterSeverity === sev ? "none" : "1px solid rgba(38,38,38,0.8)"
                  }}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {systemAlerts
              .filter(a => systemFilterSeverity === "ALL" || a.severity === systemFilterSeverity)
              .map(alert => (
                <div
                  key={alert.alertId}
                  style={{
                    background: "rgba(14,14,14,0.95)", border: "1px solid rgba(38,38,38,0.8)",
                    borderRadius: 12, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
                    gap: 16
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: "#FF6B35" }}>
                        {alert.alertId}
                      </span>
                      <span style={{
                        padding: "2px 6px", borderRadius: 4, fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
                        background: alert.severity === "CRITICAL" ? "rgba(239,68,68,0.15)" : "rgba(255,107,53,0.15)",
                        color: alert.severity === "CRITICAL" ? "#ef4444" : "#FF6B35"
                      }}>
                        {alert.severity}
                      </span>
                      <span style={{ fontSize: 11, color: "#666", fontFamily: "'JetBrains Mono', monospace" }}>
                        Status: <strong style={{ color: "#10b981" }}>{alert.status.toUpperCase()}</strong>
                      </span>
                    </div>

                    <h4 style={{ fontSize: 13, fontWeight: 700, color: "white", margin: "0 0 4px" }}>
                      {alert.type} — {alert.location}
                    </h4>
                    <p style={{ fontSize: 11, color: "#a3a3a3", margin: 0 }}>
                      {alert.description}
                    </p>
                  </div>

                  <div style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#666" }}>
                    <div>Reviewed by: <strong style={{ color: "#aaa" }}>{alert.reviewedBy}</strong></div>
                    <div style={{ marginTop: 2 }}>{alert.dataSource}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── MODAL 1: ACCEPT ALERT CONFIRMATION (PRD §32) ── */}
      {acceptModal && (
        <Modal
          isOpen={true}
          onClose={() => setAcceptModal(null)}
          title="ACCEPT & VERIFY CITIZEN ALERT"
        >
          <div style={{ padding: "8px 0", fontFamily: "'JetBrains Mono', monospace" }}>
            <p style={{ fontSize: 12, color: "#d4d4d4", lineHeight: 1.6, margin: "0 0 16px" }}>
              You are approving citizen report <strong style={{ color: "#FF6B35" }}>{acceptModal.reportId}</strong> ({acceptModal.eventType} at {acceptModal.placeName}).
              This will assign an official verified threat level and broadcast the alert to the <strong>Verified Alerts</strong> section and India Map.
            </p>

            {/* Verified Threat Level Selection (PRD §32) */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 6, fontWeight: 700 }}>
                SELECT VERIFIED THREAT LEVEL *
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setVerifiedThreatLevel(lvl)}
                    style={{
                      padding: "8px 0", borderRadius: 6, cursor: "pointer",
                      fontSize: 11, fontWeight: 800,
                      background: verifiedThreatLevel === lvl ? (lvl === "CRITICAL" ? "#ef4444" : lvl === "HIGH" ? "#FF6B35" : "#10b981") : "rgba(8,8,8,0.7)",
                      color: verifiedThreatLevel === lvl ? "#0f0f0f" : "white",
                      border: `1px solid ${verifiedThreatLevel === lvl ? "transparent" : "rgba(38,38,38,0.8)"}`
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Admin Notes (PRD §32) */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 6, fontWeight: 700 }}>
                ADMIN OPERATIONAL NOTES (OPTIONAL)
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                placeholder="e.g. Cross-verified with InSAR/SAR ground pass and regional weather radar."
                style={{
                  width: "100%", padding: "10px", borderRadius: 6,
                  background: "rgba(8,8,8,0.85)", border: "1px solid rgba(38,38,38,0.8)",
                  color: "white", fontSize: 11, fontFamily: "'Inter', sans-serif", outline: "none"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setAcceptModal(null)}
                style={{
                  padding: "9px 18px", borderRadius: 8, cursor: "pointer",
                  background: "rgba(38,38,38,0.7)", color: "#a3a3a3",
                  border: "1px solid rgba(60,60,60,0.8)", fontSize: 11
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAccept}
                style={{
                  padding: "9px 20px", borderRadius: 8, cursor: "pointer",
                  background: "#10b981", color: "#0f0f0f", fontWeight: 800,
                  border: "none", fontSize: 11, display: "flex", alignItems: "center", gap: 6
                }}
              >
                <CheckCircle2 style={{ width: 14, height: 14 }} />
                <span>ACCEPT & PUBLISH</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── MODAL 2: HOLD ALERT MODAL (PRD §34) ── */}
      {holdModal && (
        <Modal
          isOpen={true}
          onClose={() => setHoldModal(null)}
          title="PLACE CITIZEN ALERT ON HOLD"
        >
          <div style={{ padding: "8px 0", fontFamily: "'JetBrains Mono', monospace" }}>
            <p style={{ fontSize: 12, color: "#d4d4d4", lineHeight: 1.6, margin: "0 0 16px" }}>
              Place <strong style={{ color: "#FF6B35" }}>{holdModal.reportId}</strong> on hold for additional verification.
              Held reports do NOT appear as public verified alerts until reviewed again.
            </p>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 6, fontWeight: 700 }}>
                HOLD REASON / NOTES
              </label>
              <textarea
                rows={3}
                value={holdReason}
                onChange={e => setHoldReason(e.target.value)}
                placeholder="e.g. Awaiting ground verification from district node or subsequent satellite pass."
                style={{
                  width: "100%", padding: "10px", borderRadius: 6,
                  background: "rgba(8,8,8,0.85)", border: "1px solid rgba(38,38,38,0.8)",
                  color: "white", fontSize: 11, fontFamily: "'Inter', sans-serif", outline: "none"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setHoldModal(null)}
                style={{
                  padding: "9px 18px", borderRadius: 8, cursor: "pointer",
                  background: "rgba(38,38,38,0.7)", color: "#a3a3a3",
                  border: "1px solid rgba(60,60,60,0.8)", fontSize: 11
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmHold}
                style={{
                  padding: "9px 20px", borderRadius: 8, cursor: "pointer",
                  background: "#f59e0b", color: "#0f0f0f", fontWeight: 800,
                  border: "none", fontSize: 11
                }}
              >
                CONFIRM HOLD
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── MODAL 3: REJECT ALERT MODAL (PRD §35) ── */}
      {rejectModal && (
        <Modal
          isOpen={true}
          onClose={() => setRejectModal(null)}
          title="REJECT CITIZEN ALERT"
        >
          <div style={{ padding: "8px 0", fontFamily: "'JetBrains Mono', monospace" }}>
            <p style={{ fontSize: 12, color: "#d4d4d4", lineHeight: 1.6, margin: "0 0 16px" }}>
              Reject <strong style={{ color: "#ef4444" }}>{rejectModal.reportId}</strong>.
              Rejected reports will reflect in the user's My Alerts log with reason, but will not be published publicly.
            </p>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 6, fontWeight: 700 }}>
                REJECTION REASON
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="e.g. Duplicate report, false observation, or insufficient photographic evidence."
                style={{
                  width: "100%", padding: "10px", borderRadius: 6,
                  background: "rgba(8,8,8,0.85)", border: "1px solid rgba(38,38,38,0.8)",
                  color: "white", fontSize: 11, fontFamily: "'Inter', sans-serif", outline: "none"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setRejectModal(null)}
                style={{
                  padding: "9px 18px", borderRadius: 8, cursor: "pointer",
                  background: "rgba(38,38,38,0.7)", color: "#a3a3a3",
                  border: "1px solid rgba(60,60,60,0.8)", fontSize: 11
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                style={{
                  padding: "9px 20px", borderRadius: 8, cursor: "pointer",
                  background: "#ef4444", color: "#0f0f0f", fontWeight: 800,
                  border: "none", fontSize: 11
                }}
              >
                CONFIRM REJECT
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
