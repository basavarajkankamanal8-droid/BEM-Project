import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { dataStore } from "../../services/dataStore";
import { DataBadge } from "../../components/layout/DataBadge";
import { ImageCompareSlider } from "../../components/imagery/ImageCompareSlider";
import {
  Globe2, AlertTriangle, Waves, Mountain,
  Trees, Wind, ShieldCheck, User, ArrowRight
} from "lucide-react";

export const PublicDashboard = () => {
  const { currentUser } = useAuth();
  const alerts = dataStore.get("alerts").filter(a => a.status === "approved" || a.status === "public_posted");
  const images = dataStore.get("images").filter(img => img.isPublic);

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>

      {/* Welcome Banner */}
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center",
        justifyContent: "space-between", gap: 16,
        background: "rgba(16,16,16,0.9)",
        border: "1px solid rgba(255,107,53,0.15)",
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
              PUBLIC PORTAL LOGGED IN
            </span>
            <DataBadge isSimulation={true} size="xs" />
          </div>
          <h1 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: "white", margin: "0 0 6px" }}>
            WELCOME, {currentUser?.name?.toUpperCase() || "CITIZEN"}
          </h1>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
            Access human-verified Earth monitoring advisories, satellite imagery, and environmental data for Bharat.
          </p>
        </div>

        <Link
          to="/profile"
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 18px", borderRadius: 10,
            background: "rgba(255,107,53,0.12)", border: "1px solid rgba(255,107,53,0.3)",
            fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            color: "#FF6B35", textDecoration: "none", transition: "all 0.2s"
          }}
        >
          <User style={{ width: 14, height: 14 }} />
          <span>VIEW MY PROFILE</span>
        </Link>
      </div>

      {/* Environmental Status Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
        {[
          { icon: <Waves />, iconColor: "#60a5fa", label: "🌊 Water", status: "NORMAL", statusColor: "#10b981", bg: "rgba(16,185,129,0.03)" },
          { icon: <Mountain />, iconColor: "#f59e0b", label: "🏔 Terrain", status: "MONITORING", statusColor: "#ef4444", bg: "rgba(239,68,68,0.03)" },
          { icon: <Trees />, iconColor: "#34d399", label: "🌱 Land", status: "NORMAL", statusColor: "#10b981", bg: "rgba(16,185,129,0.03)" },
          { icon: <Wind />, iconColor: "#FF6B35", label: "🌫 Atmosphere", status: "MODERATE", statusColor: "#f59e0b", bg: "rgba(245,158,11,0.03)" },
        ].map(({ icon, iconColor, label, status, statusColor, bg }) => (
          <div key={label} style={{
            padding: "20px 18px", borderRadius: 12,
            background: "rgba(14,14,14,0.9)", border: "1px solid rgba(38,38,38,0.7)"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#666666" }}>{label}</span>
              {React.cloneElement(icon, { style: { width: 16, height: 16, color: iconColor } })}
            </div>
            <div style={{ fontSize: 16, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: statusColor }}>
              {status}
            </div>
          </div>
        ))}
      </div>

      {/* Verified Advisories */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: "white", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle style={{ width: 16, height: 16, color: "#ef4444" }} />
            APPROVED ENVIRONMENTAL ADVISORIES
          </h2>
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}>
            <ShieldCheck style={{ width: 12, height: 12 }} /> CERTIFIED ACCURATE
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {alerts.map((alert) => (
            <div key={alert.alertId} style={{
              padding: "18px 22px", borderRadius: 12,
              background: "rgba(14,14,14,0.85)", border: "1px solid rgba(38,38,38,0.7)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{
                  padding: "3px 8px", borderRadius: 4, fontSize: 9,
                  fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                  background: "rgba(239,68,68,0.12)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)"
                }}>
                  {alert.severity}
                </span>
                <DataBadge isSimulation={true} size="xs" />
              </div>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: "white", margin: "0 0 6px" }}>
                {alert.type.replace(/_/g, " ")} — {alert.location}
              </h4>
              <p style={{ fontSize: 11, color: "#a3a3a3", margin: "0 0 10px", lineHeight: 1.5 }}>
                {alert.description}
              </p>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#666666" }}>
                Verified by BEM Operations: {alert.reviewedBy}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Satellite Imagery Inspector */}
      {images[0] && (
        <div style={{ marginBottom: 28 }}>
          <h2 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: "white", margin: "0 0 14px" }}>
            APPROVED SATELLITE IMAGERY OBSERVER
          </h2>
          <ImageCompareSlider
            beforeImage={images[0].beforeUrl}
            afterImage={images[0].afterUrl}
            title={images[0].title}
            metricChange="Brahmaputra Basin Water Change Delta"
            beforeLabel="PRE-FLOOD BASELINE"
            afterLabel="LATEST SATELLITE PASS"
            height="340px"
          />
        </div>
      )}

    </div>
  );
};
