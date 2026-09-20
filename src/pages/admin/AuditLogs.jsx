import React, { useState } from "react";
import { dataStore } from "../../services/dataStore";
import { DataBadge } from "../../components/layout/DataBadge";
import { 
  ScrollText, Search, Filter, Clock, User, 
  Shield, Activity, AlertTriangle, LogIn, LogOut, 
  CheckCircle2, XCircle
} from "lucide-react";

const actionIcons = {
  ADMIN_LOGIN_SUCCESS: { icon: LogIn, color: "#10b981" },
  PEOPLE_OF_INDIA_LOGIN_SUCCESS: { icon: LogIn, color: "#10b981" },
  PEOPLE_OF_INDIA_REGISTERED: { icon: CheckCircle2, color: "#FF6B35" },
  USER_LOGOUT: { icon: LogOut, color: "#888888" },
  ALERT_STATUS_UPDATE_APPROVED: { icon: CheckCircle2, color: "#10b981" },
  ALERT_STATUS_UPDATE_UNDER_REVIEW: { icon: Activity, color: "#f59e0b" },
  ALERT_STATUS_UPDATE_PUBLIC_POSTED: { icon: AlertTriangle, color: "#ef4444" },
  CHANGE_DETECTION_VERIFIED: { icon: CheckCircle2, color: "#10b981" },
  CHANGE_DETECTION_UNDER_REVIEW: { icon: Activity, color: "#f59e0b" },
  CHANGE_DETECTION_REJECTED: { icon: XCircle, color: "#ef4444" },
};

export const AuditLogs = () => {
  const [logs] = useState(() => {
    const auditLogs = dataStore.get("audit_logs") || [];
    return [...auditLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState("ALL");

  const uniqueActions = [...new Set(logs.map(l => l.action))];

  const filtered = logs.filter(log => {
    const matchesSearch = !searchQuery ||
      log.actor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = filterAction === "ALL" || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  const getActionInfo = (action) => {
    const info = actionIcons[action];
    if (info) return info;
    if (action?.includes("LOGIN")) return { icon: LogIn, color: "#10b981" };
    if (action?.includes("LOGOUT")) return { icon: LogOut, color: "#888888" };
    if (action?.includes("ALERT")) return { icon: AlertTriangle, color: "#f59e0b" };
    return { icon: Activity, color: "#FF6B35" };
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center",
        justifyContent: "space-between", gap: 16, marginBottom: 24
      }}>
        <div>
          <h1 className="font-display" style={{
            fontSize: 22, fontWeight: 800, color: "white",
            letterSpacing: "0.08em", margin: "0 0 6px",
            display: "flex", alignItems: "center", gap: 10
          }}>
            <ScrollText style={{ width: 22, height: 22, color: "#FF6B35" }} />
            AUDIT LOGS
          </h1>
          <p style={{ fontSize: 12, color: "#888888", margin: 0 }}>
            Chronological record of all system actions, authentication events, and admin operations.
          </p>
        </div>
        <DataBadge isSimulation={true} />
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "TOTAL EVENTS", value: logs.length, color: "#FF6B35" },
          { label: "AUTH EVENTS", value: logs.filter(l => l.action?.includes("LOGIN") || l.action?.includes("LOGOUT")).length, color: "#10b981" },
          { label: "ALERT ACTIONS", value: logs.filter(l => l.action?.includes("ALERT")).length, color: "#f59e0b" },
          { label: "REGISTRATIONS", value: logs.filter(l => l.action?.includes("REGISTERED")).length, color: "#60a5fa" },
        ].map(stat => (
          <div key={stat.label} style={{
            padding: "16px 18px", borderRadius: 12,
            background: "rgba(14,14,14,0.9)", border: "1px solid rgba(38,38,38,0.7)"
          }}>
            <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#666666", letterSpacing: "0.08em", marginBottom: 6 }}>{stat.label}</div>
            <div style={{ fontSize: 24, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20,
        padding: "12px 16px", background: "rgba(14,14,14,0.8)",
        border: "1px solid rgba(38,38,38,0.6)", borderRadius: 12
      }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search style={{
            position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
            width: 14, height: 14, color: "#555555"
          }} />
          <input
            type="text"
            placeholder="Search by actor, action, or target..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%", padding: "9px 14px 9px 36px",
              background: "rgba(8,8,8,0.8)", border: "1px solid rgba(38,38,38,0.8)",
              borderRadius: 8, color: "#ededed", fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace", outline: "none"
            }}
          />
        </div>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          style={{
            padding: "8px 14px", borderRadius: 8,
            background: "rgba(8,8,8,0.8)", border: "1px solid rgba(38,38,38,0.8)",
            color: "#ededed", fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
            outline: "none", cursor: "pointer", minWidth: 200
          }}
        >
          <option value="ALL">ALL ACTIONS</option>
          {uniqueActions.map(action => (
            <option key={action} value={action}>{action}</option>
          ))}
        </select>
      </div>

      {/* Audit Log Table */}
      <div style={{
        background: "rgba(14,14,14,0.9)",
        border: "1px solid rgba(38,38,38,0.7)",
        borderRadius: 14, overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{
          display: "grid", gridTemplateColumns: "auto 1.5fr 2fr 1.5fr 1fr",
          padding: "12px 20px", borderBottom: "1px solid rgba(38,38,38,0.6)",
          background: "rgba(8,8,8,0.5)", gap: 12
        }}>
          {["", "TIMESTAMP", "ACTION", "ACTOR", "TARGET"].map(h => (
            <div key={h || "icon"} style={{
              fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700, color: "#555555", letterSpacing: "0.1em"
            }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 && (
          <div style={{
            padding: "32px 20px", textAlign: "center",
            fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "#555555"
          }}>
            No audit logs found.
          </div>
        )}
        {filtered.slice(0, 50).map((log, i) => {
          const actionInfo = getActionInfo(log.action);
          const Icon = actionInfo.icon;
          return (
            <div key={log.id || i} style={{
              display: "grid", gridTemplateColumns: "auto 1.5fr 2fr 1.5fr 1fr",
              padding: "12px 20px", alignItems: "center", gap: 12,
              borderBottom: "1px solid rgba(38,38,38,0.25)",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,107,53,0.03)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              {/* Icon */}
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: `${actionInfo.color}15`,
                border: `1px solid ${actionInfo.color}25`,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Icon style={{ width: 13, height: 13, color: actionInfo.color }} />
              </div>

              {/* Timestamp */}
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#888888" }}>
                {log.timestamp ? new Date(log.timestamp).toLocaleString() : "—"}
              </div>

              {/* Action */}
              <div style={{
                fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                color: actionInfo.color, fontWeight: 600, letterSpacing: "0.04em"
              }}>
                {log.action?.replace(/_/g, " ") || "—"}
              </div>

              {/* Actor */}
              <div style={{ fontSize: 11, color: "#a3a3a3" }}>
                {log.actor || "System"}
              </div>

              {/* Target */}
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#666666" }}>
                {log.target || "—"}
              </div>
            </div>
          );
        })}

        {filtered.length > 50 && (
          <div style={{
            padding: "12px 20px", textAlign: "center",
            fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#666666",
            borderTop: "1px solid rgba(38,38,38,0.4)"
          }}>
            Showing first 50 of {filtered.length} entries
          </div>
        )}
      </div>
    </div>
  );
};
