import React from "react";
import { Link } from "react-router-dom";
import { WifiOff, ShieldOff, Clock, AlertTriangle, RefreshCw } from "lucide-react";

// Network failure display
export const NetworkError = ({ onRetry }) => (
  <div style={{
    minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center",
    flexDirection: "column", gap: 16, textAlign: "center", padding: 24
  }}>
    <div style={{
      width: 56, height: 56, borderRadius: 16,
      background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <WifiOff style={{ width: 28, height: 28, color: "#ef4444" }} />
    </div>
    <h2 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: "white", margin: 0 }}>
      CONNECTION LOST
    </h2>
    <p style={{ fontSize: 12, color: "#888888", maxWidth: 400, lineHeight: 1.6 }}>
      Unable to reach Bharat Earth Monitor services. Please check your network connection and try again.
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        style={{
          padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer",
          background: "rgba(255,107,53,0.12)", color: "#FF6B35",
          fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 8,
          transition: "all 0.2s"
        }}
      >
        <RefreshCw style={{ width: 14, height: 14 }} />
        RETRY CONNECTION
      </button>
    )}
  </div>
);

// Unauthorized access display
export const UnauthorizedError = () => (
  <div style={{
    minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center",
    flexDirection: "column", gap: 16, textAlign: "center", padding: 24
  }}>
    <div style={{
      width: 56, height: 56, borderRadius: 16,
      background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <ShieldOff style={{ width: 28, height: 28, color: "#ef4444" }} />
    </div>
    <h2 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: "white", margin: 0 }}>
      UNAUTHORIZED ACCESS
    </h2>
    <p style={{ fontSize: 12, color: "#888888", maxWidth: 400, lineHeight: 1.6 }}>
      You do not have permission to access this resource. This area is restricted to authorized personnel only.
    </p>
    <Link
      to="/login"
      style={{
        padding: "10px 20px", borderRadius: 10, textDecoration: "none",
        background: "rgba(255,107,53,0.12)", color: "#FF6B35",
        fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
        letterSpacing: "0.08em", transition: "all 0.2s"
      }}
    >
      RETURN TO LOGIN
    </Link>
  </div>
);

// Session expired display
export const SessionExpired = () => (
  <div style={{
    minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center",
    flexDirection: "column", gap: 16, textAlign: "center", padding: 24
  }}>
    <div style={{
      width: 56, height: 56, borderRadius: 16,
      background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <Clock style={{ width: 28, height: 28, color: "#f59e0b" }} />
    </div>
    <h2 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: "white", margin: 0 }}>
      SESSION EXPIRED
    </h2>
    <p style={{ fontSize: 12, color: "#888888", maxWidth: 400, lineHeight: 1.6 }}>
      Your session has expired. Please log in again to continue accessing Bharat Earth Monitor.
    </p>
    <Link
      to="/login"
      style={{
        padding: "10px 20px", borderRadius: 10, textDecoration: "none",
        background: "linear-gradient(135deg, #FF6B35 0%, #ff8c5a 100%)",
        color: "#0f0f0f", fontWeight: 800, fontSize: 12,
        fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.04em",
        boxShadow: "0 4px 16px rgba(255,107,53,0.3)"
      }}
    >
      Log In Again
    </Link>
  </div>
);

// Generic error state
export const GenericError = ({ title = "Something went wrong", message, onRetry }) => (
  <div style={{
    minHeight: "40vh", display: "flex", alignItems: "center", justifyContent: "center",
    flexDirection: "column", gap: 16, textAlign: "center", padding: 24
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: 14,
      background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.2)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <AlertTriangle style={{ width: 24, height: 24, color: "#FF6B35" }} />
    </div>
    <h2 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: "white", margin: 0 }}>
      {title}
    </h2>
    {message && (
      <p style={{ fontSize: 12, color: "#888888", maxWidth: 400, lineHeight: 1.6 }}>
        {message}
      </p>
    )}
    {onRetry && (
      <button
        onClick={onRetry}
        style={{
          padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer",
          background: "rgba(255,107,53,0.12)", color: "#FF6B35",
          fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6
        }}
      >
        <RefreshCw style={{ width: 12, height: 12 }} />
        TRY AGAIN
      </button>
    )}
  </div>
);
