import React from "react";

const statusConfig = {
  // Alert workflow states
  NEW: { bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.3)", color: "#60a5fa" },
  UNDER_REVIEW: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", color: "#f59e0b" },
  "UNDER REVIEW": { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", color: "#f59e0b" },
  VERIFIED: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", color: "#10b981" },
  REJECTED: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", color: "#ef4444" },
  PUBLISHED: { bg: "rgba(255,107,53,0.12)", border: "rgba(255,107,53,0.3)", color: "#FF6B35" },
  RESOLVED: { bg: "rgba(115,115,115,0.1)", border: "rgba(115,115,115,0.3)", color: "#737373" },

  // General statuses
  ACTIVE: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", color: "#10b981" },
  ONLINE: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", color: "#10b981" },
  OFFLINE: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", color: "#ef4444" },
  MAINTENANCE: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", color: "#f59e0b" },
  DEGRADED: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", color: "#f59e0b" },
  CONNECTED: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", color: "#10b981" },

  // Data classifications
  SIMULATION: { bg: "rgba(255,107,53,0.12)", border: "rgba(255,107,53,0.3)", color: "#FF6B35" },
  PUBLIC: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", color: "#10b981" },
  INTERNAL: { bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.3)", color: "#60a5fa" },
  RESTRICTED: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", color: "#ef4444" },

  // Severity levels
  CRITICAL: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.35)", color: "#ef4444" },
  HIGH: { bg: "rgba(255,107,53,0.12)", border: "rgba(255,107,53,0.3)", color: "#FF6B35" },
  MODERATE: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", color: "#f59e0b" },
  LOW: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", color: "#10b981" },

  // Default
  DEFAULT: { bg: "rgba(38,38,38,0.5)", border: "rgba(38,38,38,0.8)", color: "#888888" },
};

export const StatusBadge = ({ status, size = "sm", pulse = false, className = "" }) => {
  const key = status?.toUpperCase().replace(/[\s-]/g, "_") || "DEFAULT";
  const config = statusConfig[key] || statusConfig.DEFAULT;
  
  const sizeStyles = {
    xs: { padding: "1px 6px", fontSize: 8, borderRadius: 3 },
    sm: { padding: "3px 8px", fontSize: 9, borderRadius: 4 },
    md: { padding: "4px 12px", fontSize: 10, borderRadius: 6 },
    lg: { padding: "6px 16px", fontSize: 11, borderRadius: 8 },
  };

  const sizeStyle = sizeStyles[size] || sizeStyles.sm;

  return (
    <span
      className={className}
      style={{
        ...sizeStyle,
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 700,
        letterSpacing: "0.06em",
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        whiteSpace: "nowrap",
      }}
    >
      {pulse && (
        <span style={{
          width: 5, height: 5, borderRadius: "50%",
          background: config.color,
          boxShadow: `0 0 6px ${config.color}`,
          animation: "pulse 1.5s infinite",
        }} />
      )}
      {status?.toUpperCase().replace(/_/g, " ") || "UNKNOWN"}
    </span>
  );
};
