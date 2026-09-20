import React, { useState } from "react";
import { dataStore } from "../../services/dataStore";
import { DataBadge } from "../../components/layout/DataBadge";
import { 
  Users as UsersIcon, Shield, UserCheck, Search, 
  Mail, Phone, MapPin, Calendar, CheckCircle2
} from "lucide-react";

export const Users = () => {
  const [users] = useState(() => dataStore.get("users"));
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");

  const filtered = users.filter(u => {
    const matchesSearch = !searchQuery || 
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone?.includes(searchQuery);
    const matchesRole = filterRole === "ALL" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const roleStats = {
    total: users.length,
    admins: users.filter(u => u.role === "admin" || u.role === "super_admin").length,
    analysts: users.filter(u => u.role === "analyst").length,
    public: users.filter(u => u.role === "public_user").length,
  };

  const roleLabel = (role) => {
    switch (role) {
      case "super_admin": return { text: "ADMIN", color: "#ef4444", bg: "rgba(239,68,68,0.12)" };
      case "admin": return { text: "ADMIN", color: "#ef4444", bg: "rgba(239,68,68,0.12)" };
      case "analyst": return { text: "ANALYST", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" };
      case "public_user": return { text: "PUBLIC USER", color: "#10b981", bg: "rgba(16,185,129,0.1)" };
      default: return { text: role?.toUpperCase() || "UNKNOWN", color: "#888888", bg: "rgba(38,38,38,0.5)" };
    }
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
            <UsersIcon style={{ width: 22, height: 22, color: "#FF6B35" }} />
            USER MANAGEMENT
          </h1>
          <p style={{ fontSize: 12, color: "#888888", margin: 0 }}>
            View registered BEM users. Admin accounts cannot be created publicly.
          </p>
        </div>
        <DataBadge isSimulation={true} />
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "TOTAL USERS", value: roleStats.total, color: "#FF6B35" },
          { label: "ADMIN ACCOUNTS", value: roleStats.admins, color: "#ef4444" },
          { label: "ANALYSTS", value: roleStats.analysts, color: "#f59e0b" },
          { label: "PEOPLE OF INDIA", value: roleStats.public, color: "#10b981" },
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

      {/* Search & Filter */}
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
            placeholder="Search users by name, email, or phone..."
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
        <div style={{ display: "flex", gap: 4, padding: 3, background: "rgba(8,8,8,0.8)", borderRadius: 8, border: "1px solid rgba(38,38,38,0.6)" }}>
          {["ALL", "admin", "analyst", "public_user"].map(role => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              style={{
                padding: "6px 12px", borderRadius: 6, border: "none", cursor: "pointer",
                fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                letterSpacing: "0.06em", transition: "all 0.2s",
                background: filterRole === role ? "#FF6B35" : "transparent",
                color: filterRole === role ? "#0f0f0f" : "#888888",
              }}
            >
              {role === "ALL" ? "ALL" : role === "admin" ? "ADMIN" : role === "analyst" ? "ANALYST" : "PUBLIC"}
            </button>
          ))}
        </div>
      </div>

      {/* Admin notice */}
      <div style={{
        padding: "10px 14px", borderRadius: 8, marginBottom: 20,
        background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.2)",
        fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#FF6B35",
        display: "flex", alignItems: "center", gap: 8
      }}>
        <Shield style={{ width: 13, height: 13, flexShrink: 0 }} />
        Admin accounts are managed via secure backend configuration. Public registration creates People of India accounts only.
      </div>

      {/* Users Table */}
      <div style={{
        background: "rgba(14,14,14,0.9)",
        border: "1px solid rgba(38,38,38,0.7)",
        borderRadius: 14, overflow: "hidden"
      }}>
        {/* Table Header */}
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1fr",
          padding: "12px 20px", borderBottom: "1px solid rgba(38,38,38,0.6)",
          background: "rgba(8,8,8,0.5)"
        }}>
          {["USER", "EMAIL", "PHONE", "ROLE", "STATUS"].map(h => (
            <div key={h} style={{
              fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700, color: "#555555", letterSpacing: "0.1em"
            }}>{h}</div>
          ))}
        </div>

        {/* Table Rows */}
        {filtered.length === 0 && (
          <div style={{
            padding: "32px 20px", textAlign: "center",
            fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "#555555"
          }}>
            No users found matching your criteria.
          </div>
        )}
        {filtered.map((user, i) => {
          const role = roleLabel(user.role);
          return (
            <div key={user.uid || i} style={{
              display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1fr",
              padding: "14px 20px", alignItems: "center",
              borderBottom: "1px solid rgba(38,38,38,0.3)",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,107,53,0.03)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              {/* Name */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "linear-gradient(135deg, rgba(255,107,53,0.2), rgba(255,107,53,0.05))",
                  border: "1px solid rgba(255,107,53,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, color: "#FF6B35", fontFamily: "'Space Grotesk', sans-serif",
                  flexShrink: 0
                }}>
                  {user.name?.charAt(0) || "U"}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#ffffff" }}>{user.name}</div>
                  <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#555555" }}>
                    {user.uid}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#a3a3a3" }}>
                {user.email}
              </div>

              {/* Phone */}
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#888888" }}>
                {user.phone || "—"}
              </div>

              {/* Role */}
              <span style={{
                padding: "3px 8px", borderRadius: 4, fontSize: 9,
                fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                background: role.bg, color: role.color,
                border: `1px solid ${role.color}30`,
                letterSpacing: "0.06em", display: "inline-block", textAlign: "center"
              }}>
                {role.text}
              </span>

              {/* Status */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: user.status === "active" ? "#10b981" : "#ef4444",
                  boxShadow: `0 0 6px ${user.status === "active" ? "#10b981" : "#ef4444"}`,
                }} />
                <span style={{
                  fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                  color: user.status === "active" ? "#10b981" : "#ef4444",
                  fontWeight: 600, letterSpacing: "0.06em"
                }}>
                  {(user.status || "active").toUpperCase()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
