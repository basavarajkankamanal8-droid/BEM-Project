import React, { useState } from "react";
import { dataStore } from "../../services/dataStore";
import { useAuth } from "../../context/AuthContext";
import { DataBadge } from "../../components/layout/DataBadge";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Modal } from "../../components/ui/Modal";
import { InstagramService } from "../../services/instagramService";
import { 
  AlertTriangle, CheckCircle2, Share2, 
  Filter, ArrowRight, XCircle, Eye, Clock,
  ShieldCheck, RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const severityConfig = {
  CRITICAL:     { bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.35)",  tagBg: "#ef4444", text: "#0f0f0f",  label: "CRITICAL" },
  HIGH_PRIORITY:{ bg: "rgba(255,107,53,0.06)", border: "rgba(255,107,53,0.2)", tagBg: "#FF6B35", text: "#0f0f0f",  label: "HIGH PRIORITY" },
  OBSERVATION:  { bg: "rgba(14,14,14,0.8)",    border: "rgba(38,38,38,0.8)",   tagBg: "#262626", text: "#a3a3a3", label: "OBSERVATION" },
};

// Full workflow states per PRD §26
const WORKFLOW_STATES = {
  new:           { label: "NEW",          color: "#60a5fa", bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.3)", icon: Clock },
  under_review:  { label: "UNDER REVIEW", color: "#FF6B35", bg: "rgba(255,107,53,0.1)",  border: "rgba(255,107,53,0.3)", icon: Eye },
  verified:      { label: "VERIFIED",     color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.3)", icon: CheckCircle2 },
  rejected:      { label: "REJECTED",     color: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)",  icon: XCircle },
  approved:      { label: "APPROVED",     color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.3)", icon: ShieldCheck },
  published:     { label: "PUBLISHED",    color: "#a855f7", bg: "rgba(168,85,247,0.1)",  border: "rgba(168,85,247,0.3)", icon: Share2 },
  public_posted: { label: "PUBLIC POSTED", color: "#a855f7", bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.3)", icon: Share2 },
  resolved:      { label: "RESOLVED",     color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.3)",icon: RefreshCw },
};

// Valid state transitions
const TRANSITIONS = {
  new:          ["under_review", "rejected"],
  under_review: ["verified", "rejected"],
  verified:     ["approved", "rejected"],
  approved:     ["published", "resolved"],
  published:    ["resolved"],
  public_posted:["resolved"],
  rejected:     ["new"],
  resolved:     [],
};

const transitionLabels = {
  under_review: { label: "Begin Review", icon: Eye, style: "orange" },
  verified:     { label: "Verify Alert", icon: CheckCircle2, style: "green" },
  approved:     { label: "Approve for Publishing", icon: ShieldCheck, style: "green" },
  published:    { label: "Publish to Public", icon: Share2, style: "purple" },
  rejected:     { label: "Reject (False Positive)", icon: XCircle, style: "red" },
  resolved:     { label: "Mark Resolved", icon: RefreshCw, style: "neutral" },
  new:          { label: "Reopen", icon: Clock, style: "blue" },
};

const buttonStyles = {
  green:   { bg: "#10b981", hoverBg: "#059669", color: "#0f0f0f" },
  red:     { bg: "rgba(239,68,68,0.15)", hoverBg: "rgba(239,68,68,0.25)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" },
  orange:  { bg: "rgba(255,107,53,0.15)", hoverBg: "rgba(255,107,53,0.25)", color: "#FF6B35", border: "1px solid rgba(255,107,53,0.3)" },
  purple:  { bg: "#a855f7", hoverBg: "#9333ea", color: "#0f0f0f" },
  blue:    { bg: "rgba(96,165,250,0.15)", hoverBg: "rgba(96,165,250,0.25)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.3)" },
  neutral: { bg: "rgba(38,38,38,0.7)", hoverBg: "rgba(60,60,60,0.8)", color: "#a3a3a3", border: "1px solid rgba(60,60,60,0.8)" },
};

export const AlertSystem = () => {
  const [alerts, setAlerts] = useState(() => dataStore.get("alerts"));
  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [confirmModal, setConfirmModal] = useState(null);
  const { currentUser, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const handleStatusTransition = (alertId, nextStatus) => {
    dataStore.update("alerts", a => a.alertId === alertId, {
      status: nextStatus,
      reviewedBy: currentUser ? currentUser.name : "System Admin",
      lastUpdated: new Date().toISOString(),
    });
    dataStore.add("audit_logs", {
      id: "aud_" + Date.now(),
      actor: currentUser ? currentUser.name : "System Admin",
      action: `ALERT_STATUS_${nextStatus.toUpperCase()}`,
      target: alertId,
      timestamp: new Date().toISOString(),
      ipAddress: "10.0.4.1"
    });
    setAlerts(dataStore.get("alerts"));
    setConfirmModal(null);
  };

  const handlePromoteToInstagram = (alert) => {
    InstagramService.stagePublicPost({
      alert,
      approvedBy: currentUser ? currentUser.name : "System Admin"
    });
    handleStatusTransition(alert.alertId, "public_posted");
    navigate("/public-posts");
  };

  const filteredAlerts = alerts.filter(a => {
    const sevMatch = filterSeverity === "ALL" || a.severity === filterSeverity;
    const statMatch = filterStatus === "ALL" || a.status === filterStatus;
    return sevMatch && statMatch;
  });

  // Count alerts by status for pipeline display
  const statusCounts = {};
  alerts.forEach(a => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });

  const panelStyle = {
    background: "rgba(14,14,14,0.9)",
    border: "1px solid rgba(38,38,38,0.7)",
    borderRadius: 14,
    padding: "18px 22px",
  };

  return (
    <div style={{ padding: "24px", maxWidth: 1400, margin: "0 auto" }}>

      {/* Header */}
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center",
        justifyContent: "space-between", gap: 16,
        background: "rgba(16,16,16,0.8)",
        border: "1px solid rgba(255,107,53,0.12)",
        borderRadius: 14, padding: "18px 24px",
        marginBottom: 20, backdropFilter: "blur(12px)"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <h1 className="font-display" style={{
              fontSize: 18, fontWeight: 800, color: "white", letterSpacing: "0.08em", margin: 0,
              display: "flex", alignItems: "center", gap: 10
            }}>
              <AlertTriangle style={{ width: 18, height: 18, color: "#ef4444" }} />
              ENVIRONMENTAL & INTEGRITY ALERT SYSTEM
            </h1>
            <DataBadge isSimulation={true} />
          </div>
          <p style={{ fontSize: 11, color: "#666666", margin: 0 }}>
            Human-in-the-loop workflow: DATA → ANALYSIS → POSSIBLE ALERT → HUMAN REVIEW → VERIFIED → PUBLIC
          </p>
        </div>
        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <Filter style={{ width: 13, height: 13, color: "#555555" }} />
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            style={{
              background: "rgba(10,10,10,0.9)", border: "1px solid rgba(38,38,38,0.8)",
              borderRadius: 8, padding: "6px 12px",
              fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#d4d4d4",
              outline: "none", cursor: "pointer"
            }}
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH_PRIORITY">High Priority Only</option>
            <option value="OBSERVATION">Observation Only</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              background: "rgba(10,10,10,0.9)", border: "1px solid rgba(38,38,38,0.8)",
              borderRadius: 8, padding: "6px 12px",
              fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#d4d4d4",
              outline: "none", cursor: "pointer"
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="new">New</option>
            <option value="under_review">Under Review</option>
            <option value="verified">Verified</option>
            <option value="approved">Approved</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Workflow Pipeline Bar */}
      <div style={{ ...panelStyle, marginBottom: 20 }}>
        <div style={{
          fontSize: 9, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          color: "#444444", letterSpacing: "0.12em", textTransform: "uppercase",
          marginBottom: 12
        }}>
          ALERT VERIFICATION WORKFLOW PIPELINE:
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
          {[
            { key: "new",          label: "1. New Alert" },
            { key: "under_review", label: "2. Under Review" },
            { key: "verified",     label: "3. Verified" },
            { key: "approved",     label: "4. Approved" },
            { key: "published",    label: "5. Published" },
            { key: "resolved",     label: "6. Resolved" },
          ].map(({ key, label }, i, arr) => {
            const ws = WORKFLOW_STATES[key];
            const count = statusCounts[key] || 0;
            return (
              <React.Fragment key={key}>
                <button
                  onClick={() => setFilterStatus(filterStatus === key ? "ALL" : key)}
                  style={{
                    padding: "5px 10px", borderRadius: 6,
                    fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
                    background: filterStatus === key ? ws.bg : "rgba(10,10,10,0.8)",
                    border: `1px solid ${filterStatus === key ? ws.border.replace(")", ",0.8)").replace("rgba", "rgba") : "rgba(38,38,38,0.8)"}`,
                    color: filterStatus === key ? ws.color : "#a3a3a3",
                    letterSpacing: "0.04em",
                    cursor: "pointer", transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  {label}
                  {count > 0 && (
                    <span style={{
                      padding: "0 5px", borderRadius: 4,
                      fontSize: 9, fontWeight: 800,
                      background: ws.bg, color: ws.color,
                      minWidth: 16, textAlign: "center",
                    }}>
                      {count}
                    </span>
                  )}
                </button>
                {i < arr.length - 1 && (
                  <ArrowRight style={{ width: 11, height: 11, color: "#2a2a2a" }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Alert Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filteredAlerts.length === 0 && (
          <div style={{
            padding: 32, borderRadius: 14, textAlign: "center",
            background: "rgba(14,14,14,0.8)", border: "1px solid rgba(38,38,38,0.7)",
          }}>
            <AlertTriangle style={{ width: 24, height: 24, color: "#555", margin: "0 auto 12px" }} />
            <div style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: "#666" }}>
              No alerts match the current filter criteria.
            </div>
          </div>
        )}
        {filteredAlerts.map((alert) => {
          const sev = severityConfig[alert.severity] || severityConfig.OBSERVATION;
          const ws = WORKFLOW_STATES[alert.status] || WORKFLOW_STATES.new;
          const allowedTransitions = TRANSITIONS[alert.status] || [];

          return (
            <div
              key={alert.alertId}
              style={{
                background: sev.bg,
                border: `1px solid ${sev.border}`,
                borderRadius: 14, overflow: "hidden",
                transition: "all 0.2s"
              }}
            >
              {/* Alert top stripe */}
              <div style={{
                height: 2,
                background: alert.severity === "CRITICAL"
                  ? "linear-gradient(90deg, transparent, #ef4444, transparent)"
                  : alert.severity === "HIGH_PRIORITY"
                  ? "linear-gradient(90deg, transparent, #FF6B35, transparent)"
                  : "transparent"
              }} />

              <div style={{ padding: "18px 22px" }}>
                {/* Alert header */}
                <div style={{
                  display: "flex", flexWrap: "wrap", alignItems: "center",
                  justifyContent: "space-between", gap: 12,
                  paddingBottom: 14, borderBottom: "1px solid rgba(38,38,38,0.5)",
                  marginBottom: 14
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    {/* Severity badge */}
                    <span style={{
                      padding: "3px 10px", borderRadius: 5,
                      fontSize: 9, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800,
                      background: sev.tagBg, color: sev.text, letterSpacing: "0.08em",
                      boxShadow: alert.severity === "CRITICAL" ? "0 0 12px rgba(239,68,68,0.3)" : "none"
                    }}>
                      {sev.label}
                    </span>
                    <span style={{
                      fontSize: 13, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "white"
                    }}>
                      {alert.alertId}
                    </span>
                    <span style={{
                      fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#555555"
                    }}>
                      ({alert.type})
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <DataBadge isSimulation={true} size="xs" />
                    <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#555555" }}>
                      {new Date(alert.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Description & Evidence */}
                <div style={{ marginBottom: 14 }}>
                  <p style={{ fontSize: 13, color: "#d4d4d4", margin: "0 0 10px", lineHeight: 1.6 }}>
                    {alert.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
                    {[
                      { emoji: "📍", key: "Location", val: alert.location, valColor: "#ededed" },
                      { emoji: "🔬", key: "Evidence", val: alert.evidence, valColor: "#FF6B35" },
                      { emoji: "👤", key: "Reviewer", val: alert.reviewedBy || "Pending", valColor: "#ededed" },
                    ].map(({ emoji, key, val, valColor }) => (
                      <div key={key} style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#555555" }}>
                        {emoji} {key}: <span style={{ color: valColor, fontWeight: 600 }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status & Actions */}
                <div style={{
                  display: "flex", flexWrap: "wrap", alignItems: "center",
                  justifyContent: "space-between", gap: 12,
                  paddingTop: 14, borderTop: "1px solid rgba(38,38,38,0.5)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#444444" }}>
                      Status:
                    </span>
                    <span style={{
                      padding: "4px 10px", borderRadius: 6, fontSize: 10,
                      fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: "0.06em",
                      background: ws.bg, border: `1px solid ${ws.border}`, color: ws.color,
                      display: "flex", alignItems: "center", gap: 5,
                    }}>
                      {React.createElement(ws.icon, { style: { width: 11, height: 11 } })}
                      {ws.label}
                    </span>
                  </div>

                  {/* Transition action buttons */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    {allowedTransitions.map(nextStatus => {
                      const tl = transitionLabels[nextStatus];
                      if (!tl) return null;
                      const bs = buttonStyles[tl.style];
                      const Icon = tl.icon;

                      // For destructive actions (publish, reject), show confirmation
                      const needsConfirm = ["published", "rejected"].includes(nextStatus);

                      return (
                        <button
                          key={nextStatus}
                          onClick={() => {
                            if (needsConfirm) {
                              setConfirmModal({ alertId: alert.alertId, nextStatus, label: tl.label });
                            } else {
                              handleStatusTransition(alert.alertId, nextStatus);
                            }
                          }}
                          style={{
                            display: "flex", alignItems: "center", gap: 6,
                            padding: "8px 14px", borderRadius: 8, cursor: "pointer",
                            fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                            background: bs.bg, color: bs.color,
                            border: bs.border || "none",
                            transition: "all 0.2s", letterSpacing: "0.04em"
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = bs.hoverBg}
                          onMouseLeave={e => e.currentTarget.style.background = bs.bg}
                        >
                          <Icon style={{ width: 13, height: 13 }} />
                          {tl.label}
                        </button>
                      );
                    })}

                    {/* Special: Promote to Instagram when approved */}
                    {alert.status === "approved" && isSuperAdmin && (
                      <button
                        onClick={() => handlePromoteToInstagram(alert)}
                        className="aeris-btn-primary"
                        style={{
                          display: "flex", alignItems: "center", gap: 7,
                          padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                          fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                          letterSpacing: "0.05em", border: "none"
                        }}
                      >
                        <Share2 style={{ width: 13, height: 13 }} />
                        Publish Official Alert
                      </button>
                    )}

                    {(alert.status === "public_posted" || alert.status === "published") && (
                      <span style={{
                        display: "flex", alignItems: "center", gap: 6,
                        fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                        color: "#10b981"
                      }}>
                        <CheckCircle2 style={{ width: 14, height: 14 }} />
                        Broadcasted to Public Channels
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <Modal
          isOpen={true}
          onClose={() => setConfirmModal(null)}
          title="Confirm Action"
        >
          <div style={{ padding: "8px 0" }}>
            <p style={{ fontSize: 13, color: "#d4d4d4", lineHeight: 1.6, margin: "0 0 20px" }}>
              Are you sure you want to <strong style={{ color: "#FF6B35" }}>{confirmModal.label}</strong> for alert{" "}
              <strong style={{ color: "white" }}>{confirmModal.alertId}</strong>?
              <br /><br />
              <span style={{ fontSize: 11, color: "#888" }}>
                This action will be logged in the audit trail.
              </span>
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => setConfirmModal(null)}
                style={{
                  padding: "10px 20px", borderRadius: 8, cursor: "pointer",
                  fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                  background: "rgba(38,38,38,0.7)", color: "#a3a3a3",
                  border: "1px solid rgba(60,60,60,0.8)", transition: "all 0.2s"
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusTransition(confirmModal.alertId, confirmModal.nextStatus)}
                style={{
                  padding: "10px 20px", borderRadius: 8, cursor: "pointer",
                  fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                  background: "#FF6B35", color: "#0f0f0f",
                  border: "none", transition: "all 0.2s"
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
