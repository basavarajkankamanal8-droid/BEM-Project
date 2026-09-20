import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  Globe2, 
  Satellite, 
  LogOut, 
  ExternalLink,
  Activity,
  User,
  Shield,
  Menu
} from "lucide-react";

export const Navbar = ({ onMenuToggle }) => {
  const { currentUser, logout, isAdmin, isPublicUser } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const utcTime = time.toUTCString().split(" ")[4];

  return (
    <header className="sticky top-0 z-40 w-full" style={{
      background: "rgba(10, 10, 10, 0.92)",
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      borderBottom: "1px solid rgba(255,107,53,0.12)",
      boxShadow: "0 1px 0 rgba(255,107,53,0.06), 0 4px 24px rgba(0,0,0,0.4)"
    }}>
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent 0%, #FF6B35 30%, #ff8152 50%, #FF6B35 70%, transparent 100%)",
        opacity: 0.6
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: hamburger + brand */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg text-[#888888] hover:text-[#FF6B35] transition-colors"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to={isPublicUser ? "/public-dashboard" : "/"} className="flex items-center gap-3 group">
            <div style={{
              width: 38, height: 38,
              borderRadius: 10,
              background: "linear-gradient(135deg, #FF6B35 0%, #ff8c5a 50%, #cc5528 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px rgba(255,107,53,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
              transition: "all 0.3s ease",
            }}
              className="group-hover:scale-110 group-hover:shadow-[0_6px_30px_rgba(255,107,53,0.5)]"
            >
              <Globe2 className="w-5 h-5 text-[#0f0f0f] animate-spin-slow stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold tracking-widest text-white" style={{ letterSpacing: "0.12em" }}>
                  BEM
                </span>
                <span style={{
                  fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
                  padding: "2px 7px", borderRadius: 4,
                  background: "rgba(255,107,53,0.12)",
                  border: "1px solid rgba(255,107,53,0.3)",
                  color: "#FF6B35", fontWeight: 700, letterSpacing: "0.06em"
                }}>
                  {isPublicUser ? "PUBLIC PORTAL" : "OPERATIONS v1.0"}
                </span>
              </div>
              <p className="text-[10px] text-[#888888] font-mono hidden sm:block" style={{ letterSpacing: "0.04em" }}>
                BHARAT EARTH MONITOR
              </p>
            </div>
          </Link>
        </div>

        {/* Center Telemetry Strip */}
        <div className="hidden md:flex items-center gap-3" style={{
          background: "rgba(14, 14, 14, 0.8)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 100,
          padding: "6px 16px",
          backdropFilter: "blur(10px)"
        }}>
          <div className="flex items-center gap-2">
            <span className="relative flex">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#10b981] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />
            </span>
            <span className="text-[10px] font-mono font-bold text-[#10b981]" style={{ letterSpacing: "0.08em" }}>
              UPLINK ACTIVE
            </span>
          </div>
          <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.08)" }} />
          <div className="flex items-center gap-1.5 text-[#d4d4d4]">
            <Satellite className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span className="text-[10px] font-mono">SAT-001 · 540km LEO</span>
          </div>
          <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.08)" }} />
          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-[#FF6B35] animate-pulse" />
            <span className="text-[10px] font-mono text-[#FF6B35]" style={{ letterSpacing: "0.06em" }}>
              {utcTime} UTC
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">

          {/* Public Portal Link */}
          <Link 
            to="/public" 
            target="_blank"
            className="hidden lg:flex items-center gap-1.5 text-[10px] text-[#888888] hover:text-[#FF6B35] transition-colors font-mono"
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.03)",
              letterSpacing: "0.05em"
            }}
          >
            <span>PUBLIC LANDING</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          {/* Role indicator */}
          <div className="hidden sm:flex items-center px-2.5 py-1 rounded-md text-[10px] font-mono" style={{
            background: isAdmin ? "rgba(255,107,53,0.12)" : "rgba(16,185,129,0.1)",
            border: `1px solid ${isAdmin ? "rgba(255,107,53,0.3)" : "rgba(16,185,129,0.25)"}`,
            color: isAdmin ? "#FF6B35" : "#10b981",
            fontWeight: 700, letterSpacing: "0.06em"
          }}>
            {isAdmin ? "🔐 ADMIN" : "👤 PUBLIC"}
          </div>

          {/* User info + logout */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link to={isPublicUser ? "/profile" : "#"} className="hidden sm:flex flex-col items-end text-right hover:opacity-80">
                <div className="text-[11px] font-semibold text-white leading-none">
                  {currentUser.name}
                </div>
                <div className="text-[9px] font-mono mt-0.5" style={{
                  color: "#888888", letterSpacing: "0.06em"
                }}>
                  {currentUser.email}
                </div>
              </Link>

              {/* Avatar */}
              <Link to={isPublicUser ? "/profile" : "#"} style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(255,107,53,0.2), rgba(255,107,53,0.05))",
                border: "1px solid rgba(255,107,53,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#FF6B35", fontFamily: "Space Grotesk",
                textDecoration: "none"
              }}>
                {currentUser.name?.charAt(0) || "U"}
              </Link>

              <button
                onClick={() => { logout(); navigate("/login"); }}
                className="p-2 text-[#555555] hover:text-[#ef4444] rounded-lg transition-colors"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.05)"
                }}
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="aeris-btn-primary px-4 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wider"
              style={{ letterSpacing: "0.06em" }}
            >
              LOGIN
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
