import React from "react";
import { useAuth } from "../../context/AuthContext";
import { DataBadge } from "../../components/layout/DataBadge";
import { 
  UserCheck, ShieldCheck, Phone, Mail, MapPin, 
  Home, Hash, Calendar, CheckCircle2, Lock 
} from "lucide-react";

export const UserProfile = () => {
  const { currentUser } = useAuth();

  const infoItem = (label, val, icon) => (
    <div style={{
      padding: "16px", borderRadius: 12,
      background: "rgba(10,10,10,0.8)", border: "1px solid rgba(38,38,38,0.7)",
      display: "flex", alignItems: "flex-start", gap: 12
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9,
        background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
      }}>
        {React.cloneElement(icon, { style: { width: 16, height: 16, color: "#FF6B35" } })}
      </div>
      <div>
        <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#666666", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {label}
        </div>
        <div style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#ffffff", marginTop: 4 }}>
          {val || "Not Specified"}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>

      {/* Header */}
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center",
        justifyContent: "space-between", gap: 16,
        background: "rgba(16,16,16,0.8)",
        border: "1px solid rgba(255,107,53,0.12)",
        borderRadius: 14, padding: "20px 24px",
        marginBottom: 24, backdropFilter: "blur(12px)"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <h1 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: "white", letterSpacing: "0.08em", margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
              <UserCheck style={{ width: 20, height: 20, color: "#FF6B35" }} />
              MY PROFILE — BEM PUBLIC ACCOUNT
            </h1>
            <DataBadge isSimulation={true} />
          </div>
          <p style={{ fontSize: 12, color: "#666666", margin: 0 }}>
            Registered Citizen Account Details & Access Credentials.
          </p>
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "6px 14px", borderRadius: 8,
          background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)"
        }}>
          <ShieldCheck style={{ width: 14, height: 14, color: "#10b981" }} />
          <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#10b981", fontWeight: 700, letterSpacing: "0.06em" }}>
            ACCOUNT STATUS: ● VERIFIED
          </span>
        </div>
      </div>

      {/* Main Profile Info Grid */}
      <div style={{
        background: "rgba(14,14,14,0.9)",
        border: "1px solid rgba(38,38,38,0.8)",
        borderRadius: 16, padding: "28px",
        marginBottom: 24
      }}>
        {/* User Badge Top Banner */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16,
          paddingBottom: 24, borderBottom: "1px solid rgba(38,38,38,0.6)",
          marginBottom: 24
        }}>
          <div style={{
            width: 54, height: 54, borderRadius: 16,
            background: "linear-gradient(135deg, #FF6B35, #ff8c5a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 800, color: "#0f0f0f", fontFamily: "'Space Grotesk', sans-serif"
          }}>
            {currentUser?.name?.charAt(0) || "P"}
          </div>

          <div>
            <h2 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: "white", margin: "0 0 4px" }}>
              {currentUser?.name || "Public Citizen"}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                padding: "2px 8px", borderRadius: 4, fontSize: 10,
                fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                background: "rgba(255,107,53,0.15)", color: "#FF6B35", border: "1px solid rgba(255,107,53,0.3)"
              }}>
                ACCOUNT TYPE: PEOPLE OF INDIA
              </span>
              <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#888888" }}>
                ID: {currentUser?.uid}
              </span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {infoItem("FULL NAME", currentUser?.name, <UserCheck />)}
          {infoItem("PHONE NUMBER", currentUser?.phone || "+91 9876543210", <Phone />)}
          {infoItem("EMAIL ID", currentUser?.email, <Mail />)}
          {infoItem("LOCATION / DISTRICT", currentUser?.location || "Bengaluru, Karnataka", <MapPin />)}
          {infoItem("RESIDENTIAL ADDRESS", currentUser?.address || "Indiranagar 100ft Road", <Home />)}
          {infoItem("POSTAL PIN CODE", currentUser?.pinCode || "560038", <Hash />)}
        </div>
      </div>

      {/* Security & Credentials Notice */}
      <div style={{
        padding: "18px 22px", borderRadius: 14,
        background: "rgba(10,10,10,0.8)", border: "1px solid rgba(38,38,38,0.7)",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Lock style={{ width: 16, height: 16, color: "#FF6B35" }} />
          <div>
            <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#ffffff", fontWeight: 700 }}>
              AUTHENTICATION CREDENTIALS
            </div>
            <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#666666" }}>
              Managed securely via Firebase Authentication & Role-Based Access Control (RBAC).
            </div>
          </div>
        </div>
        <DataBadge isSimulation={true} size="xs" />
      </div>

    </div>
  );
};
