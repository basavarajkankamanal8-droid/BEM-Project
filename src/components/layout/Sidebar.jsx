import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Radio, 
  Satellite, 
  Globe2, 
  Image as ImageIcon, 
  Layers,
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  Share2, 
  Settings,
  UserCheck,
  Users,
  ScrollText,
  LogOut,
  X,
  Clock
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const Sidebar = ({ onClose }) => {
  const { isAdmin, isPublicUser, logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
    navigate("/login");
  };

  // Navigation Items with Role-Based Access:
  // ADMIN: Full operational and telemetry navigation (PRD §3.1 & §15)
  // PUBLIC_USER: Public dashboard, Report Alert, My Alerts, Verified Alerts, Monitoring, Images, Reports, Profile (PRD §3.2 & §13)
  const navItems = isPublicUser ? [
    { to: "/public-dashboard",           label: "India Monitoring",    icon: LayoutDashboard, exact: true },
    { to: "/dashboard/report-alert",     label: "Report an Alert",     icon: AlertTriangle, badge: "NEW" },
    { to: "/dashboard/my-alerts",        label: "My Alerts",           icon: Clock },
    { to: "/dashboard/verified-alerts",  label: "Verified Alerts",     icon: ShieldCheck },
    { to: "/profile",                    label: "My Profile",          icon: UserCheck },
    { to: "/public",                     label: "Public Portal",       icon: Globe2 },
  ] : [
    { to: "/",                 label: "Overview",            icon: LayoutDashboard, exact: true },
    { to: "/gnss",             label: "GNSS Receiver",       icon: Radio },
    { to: "/satellites",       label: "Satellite Network",   icon: Satellite },
    { to: "/earth-monitoring", label: "Earth Monitoring",    icon: Globe2 },
    { to: "/images",           label: "Image Center",        icon: ImageIcon },
    { to: "/change-detection", label: "Change Detection",    icon: Layers },
    { to: "/alerts",           label: "Alerts",              icon: AlertTriangle, badge: "3" },
    { to: "/security",         label: "Security Center",     icon: ShieldCheck,  adminOnly: true, badge: "SEC" },
    { to: "/reports",          label: "Reports",             icon: FileText },
    { to: "/public-posts",     label: "Public Information",  icon: Share2,       adminOnly: true },
    { to: "/users",            label: "Users",               icon: Users,        adminOnly: true },
    { to: "/audit-logs",       label: "Audit Logs",          icon: ScrollText,   adminOnly: true },
    { to: "/settings",         label: "Settings",            icon: Settings,     adminOnly: true },
  ];

  return (
    <aside style={{
      width: 240,
      background: "rgba(12, 12, 12, 0.95)",
      borderRight: "1px solid rgba(255,107,53,0.08)",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      minHeight: "100vh",
      backdropFilter: "blur(20px)",
    }}>
      {/* Mobile close button */}
      {onClose && (
        <div className="lg:hidden" style={{ padding: "12px 16px", display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.2)",
              borderRadius: 8, padding: "6px", cursor: "pointer", color: "#FF6B35"
            }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>
      )}

      {/* Nav section header */}
      <div style={{ padding: "16px 16px 8px" }}>
        <div style={{
          padding: "6px 10px",
          fontSize: 9,
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: "rgba(115, 115, 115, 0.7)",
          textTransform: "uppercase",
          borderBottom: "1px solid rgba(255,107,53,0.06)",
          paddingBottom: 10,
          marginBottom: 4
        }}>
          ⬡ {isPublicUser ? "Public Navigation" : "Telemetry Navigation"}
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) => `aeris-nav-item ${isActive ? "active" : ""}`}
                style={{ textDecoration: "none" }}
                onClick={onClose}
              >
                {({ isActive }) => (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 7,
                        background: isActive 
                          ? "rgba(255,107,53,0.12)" 
                          : "rgba(255,255,255,0.03)",
                        border: isActive 
                          ? "1px solid rgba(255,107,53,0.2)" 
                          : "1px solid rgba(255,255,255,0.05)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 0.2s"
                      }}>
                        <Icon 
                          style={{ 
                            width: 13, height: 13,
                            color: isActive ? "#FF6B35" : "#555555",
                            transition: "color 0.2s"
                          }} 
                        />
                      </div>
                      <span style={{
                        fontSize: 12,
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? "#FF6B35" : "#888888",
                        transition: "color 0.2s",
                        letterSpacing: "0.01em"
                      }}>
                        {item.label}
                      </span>
                    </div>

                    {item.badge && (
                      <span style={{
                        padding: "1px 6px",
                        borderRadius: 4,
                        fontSize: 9,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        ...(item.badge === "SEC"
                          ? { background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }
                          : { background: "rgba(255,107,53,0.15)", color: "#FF6B35", border: "1px solid rgba(255,107,53,0.3)" }
                        )
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom section with logout */}
      <div style={{
        marginTop: "auto",
        padding: "14px 16px",
        borderTop: "1px solid rgba(255,107,53,0.08)",
        background: "rgba(8,8,8,0.6)",
      }}>
        {/* Signal indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 10 }}>
          {[1, 0.8, 0.6, 0.9, 0.7, 1, 0.85].map((h, i) => (
            <div key={i} style={{
              width: 3, borderRadius: 2,
              height: Math.round(h * 18),
              background: i < 5 ? "#FF6B35" : "rgba(255,107,53,0.2)",
              opacity: i < 5 ? 0.7 + (i * 0.06) : 0.3
            }} />
          ))}
          <span style={{
            fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
            color: "#10b981", fontWeight: 700, letterSpacing: "0.06em", marginLeft: 6
          }}>
            94% SIGNAL
          </span>
        </div>

        {/* Station info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
          {[
            { label: "STATION ID", value: "NODE-BLR-09", color: "#FF6B35" },
            { label: "SECURITY", value: isPublicUser ? "PUBLIC VERIFIED" : "ADMIN RBAC", color: "#10b981" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#404040", letterSpacing: "0.08em" }}>
                {label}
              </span>
              <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color, fontWeight: 600, letterSpacing: "0.04em" }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%", padding: "10px 0", borderRadius: 8,
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
            color: "#ef4444", fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "all 0.2s"
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
        >
          <LogOut style={{ width: 13, height: 13 }} />
          LOGOUT
        </button>
      </div>
    </aside>
  );
};
