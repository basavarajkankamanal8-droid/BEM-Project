import React from "react";

// Full-page loading spinner
export const LoadingScreen = ({ message = "Loading..." }) => (
  <div style={{
    minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center",
    flexDirection: "column", gap: 16
  }}>
    <div style={{
      width: 44, height: 44, borderRadius: 12,
      background: "linear-gradient(135deg, rgba(255,107,53,0.15), rgba(255,107,53,0.05))",
      border: "1px solid rgba(255,107,53,0.2)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "pulse 1.5s infinite"
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%",
        border: "2px solid rgba(255,107,53,0.2)",
        borderTop: "2px solid #FF6B35",
        animation: "spin 0.8s linear infinite"
      }} />
    </div>
    <span style={{
      fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
      color: "#888888", letterSpacing: "0.08em"
    }}>
      {message}
    </span>
  </div>
);

// Inline loading spinner (for buttons, cards)
export const LoadingSpinner = ({ size = 16, color = "#FF6B35" }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    border: `2px solid ${color}30`,
    borderTop: `2px solid ${color}`,
    animation: "spin 0.8s linear infinite",
    display: "inline-block"
  }} />
);

// Skeleton loader for cards
export const SkeletonCard = ({ height = 120 }) => (
  <div style={{
    height, borderRadius: 12,
    background: "rgba(14,14,14,0.9)", border: "1px solid rgba(38,38,38,0.5)",
    position: "relative", overflow: "hidden"
  }}>
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(90deg, transparent, rgba(255,107,53,0.03), transparent)",
      animation: "shimmer 2s infinite",
    }} />
  </div>
);

// Skeleton loader for table rows
export const SkeletonRow = () => (
  <div style={{
    padding: "14px 20px", borderBottom: "1px solid rgba(38,38,38,0.3)",
    display: "flex", alignItems: "center", gap: 16
  }}>
    <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(38,38,38,0.4)" }} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ width: "60%", height: 10, borderRadius: 4, background: "rgba(38,38,38,0.4)" }} />
      <div style={{ width: "35%", height: 8, borderRadius: 4, background: "rgba(38,38,38,0.3)" }} />
    </div>
    <div style={{ width: 60, height: 20, borderRadius: 4, background: "rgba(38,38,38,0.3)" }} />
  </div>
);
