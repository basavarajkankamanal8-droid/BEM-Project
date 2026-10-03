import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dataStore } from "../../services/dataStore";
import { DataBadge } from "../../components/layout/DataBadge";
import { ImageCompareSlider } from "../../components/imagery/ImageCompareSlider";
import { EarthMap } from "../../components/map/EarthMap";
import { 
  Globe2, AlertTriangle, Waves, Mountain, 
  Trees, Wind, Lock, ShieldCheck, Activity,
  Satellite, Radio, ArrowRight
} from "lucide-react";

export const PublicHome = () => {
  const alerts = dataStore.get("alerts").filter(a => a.status === "approved" || a.status === "public_posted");
  const images = dataStore.get("images").filter(img => img.isPublic);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "#ededed" }}>

      {/* ══ PUBLIC HEADER ══ */}
      <header style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "rgba(10,10,10,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,107,53,0.1)",
        boxShadow: "0 1px 0 rgba(255,107,53,0.05)"
      }}>
        {/* Top accent */}
        <div style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, #FF6B35 30%, #ff8152 50%, #FF6B35 70%, transparent)",
          opacity: 0.5
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: "linear-gradient(135deg, #FF6B35, #ff8c5a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px rgba(255,107,53,0.3)"
            }}>
              <Globe2 style={{ width: 18, height: 18, color: "#0f0f0f", strokeWidth: 2.5 }} />
            </div>
            <div>
              <span className="font-display" style={{ fontSize: 16, fontWeight: 800, color: "white", letterSpacing: "0.12em" }}>
                🛰 BEM
              </span>
              <span style={{
                fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
                color: "#FF6B35", marginLeft: 8, fontWeight: 700, letterSpacing: "0.08em"
              }}>
                BHARAT EARTH MONITOR
              </span>
            </div>
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: 20 }} className="hidden md:flex">
            {["Home", "Our Network", "Earth Monitoring", "Solutions", "Alerts", "About"].map((item) => (
              <a key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                style={{
                  fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                  color: "#9ca3af", textDecoration: "none", letterSpacing: "0.06em",
                  transition: "color 0.2s"
                }}
                onMouseEnter={e => e.target.style.color = "#FF6B35"}
                onMouseLeave={e => e.target.style.color = "#9ca3af"}
              >
                {item}
              </a>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link to="/login" style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 8,
              background: "rgba(255,107,53,0.12)",
              border: "1px solid rgba(255,107,53,0.35)",
              fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              color: "#FF6B35", textDecoration: "none", letterSpacing: "0.06em",
              transition: "all 0.2s"
            }}>
              <Lock style={{ width: 11, height: 11 }} />
              PORTAL LOGIN
            </Link>
            <a href="#request-access" onClick={(e) => { e.preventDefault(); alert("Access request submitted. BEM operations will review your domain registration."); }} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 8,
              background: "rgba(38,38,38,0.7)",
              border: "1px solid rgba(60,60,60,0.8)",
              fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
              color: "#e5e7eb", textDecoration: "none", letterSpacing: "0.06em"
            }}>
              REQUEST ACCESS
            </a>
          </div>
        </div>
      </header>

      {/* ══ HERO SECTION ══ */}
      <section style={{
        position: "relative", overflow: "hidden",
        padding: "80px 24px 70px",
        textAlign: "center",
        background: `
          radial-gradient(ellipse 100% 60% at 50% 0%, rgba(255,107,53,0.12) 0%, transparent 65%),
          radial-gradient(ellipse 50% 40% at 80% 50%, rgba(255,107,53,0.05) 0%, transparent 60%),
          #0f0f0f
        `
      }}>
        {/* Grid bg */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `
            linear-gradient(rgba(255,107,53,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,53,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px"
        }} />

        <div style={{ position: "relative", maxWidth: 850, margin: "0 auto" }}>
          {/* Live Tagline badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 100,
            background: "rgba(255,107,53,0.08)",
            border: "1px solid rgba(255,107,53,0.25)",
            marginBottom: 24
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#FF6B35", boxShadow: "0 0 8px #FF6B35",
              display: "inline-block"
            }} className="animate-pulse" />
            <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#FF6B35", fontWeight: 700, letterSpacing: "0.1em" }}>
              MONITOR BHARAT. DETECT CHANGE. INFORM PEOPLE.
            </span>
          </div>

          <h1 className="font-display" style={{
            fontSize: "clamp(34px, 5.5vw, 62px)",
            fontWeight: 900, color: "white", margin: "0 0 18px",
            letterSpacing: "-0.02em", lineHeight: 1.05,
          }}>
            MONITOR BHARAT{" "}
            <span style={{
              background: "linear-gradient(90deg, #FF6B35, #ff8c5a, #FF6B35)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              FROM ABOVE.
            </span>
          </h1>

          <p style={{
            fontSize: 16, color: "#e5e7eb", maxWidth: 640, margin: "0 auto 32px",
            lineHeight: 1.7
          }}>
            Bharat Earth Monitor brings Earth observation, GNSS visualization, environmental monitoring, geographical information and public information together in one secure platform.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginBottom: 36 }}>
            <a href="#earth-monitoring" style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "12px 24px", borderRadius: 10,
              background: "linear-gradient(135deg, #FF6B35 0%, #ff8c5a 100%)",
              color: "#0f0f0f", fontWeight: 800, fontSize: 13,
              fontFamily: "'Space Grotesk', sans-serif", textDecoration: "none",
              letterSpacing: "0.04em", boxShadow: "0 4px 20px rgba(255,107,53,0.35)"
            }}>
              Explore Earth Monitoring
            </a>
            <Link to="/login" style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "12px 24px", borderRadius: 10,
              background: "rgba(20,20,20,0.8)",
              border: "1px solid rgba(255,107,53,0.3)",
              color: "white", fontWeight: 700, fontSize: 13,
              fontFamily: "'Space Grotesk', sans-serif", textDecoration: "none",
              letterSpacing: "0.04em"
            }}>
              <Lock style={{ width: 14, height: 14, color: "#FF6B35" }} />
              Access Portal
            </Link>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
            <DataBadge isSimulation={true} />
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 12px", borderRadius: 6,
              background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)"
            }}>
              <Activity style={{ width: 11, height: 11, color: "#10b981" }} className="animate-pulse" />
              <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#10b981", fontWeight: 600, letterSpacing: "0.06em" }}>
                LIVE OBSERVATION SYSTEM · {time.toUTCString().split(" ")[4]} UTC
              </span>
            </div>
          </div>

          {/* SYSTEM STATUS */}
          <div style={{
            background: "rgba(20,20,20,0.9)",
            border: "1px solid rgba(255,107,53,0.2)",
            borderRadius: 14, padding: "20px 28px",
            maxWidth: 720, margin: "0 auto",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            backdropFilter: "blur(12px)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(38,38,38,0.8)", paddingBottom: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: "#ffffff", letterSpacing: "0.12em" }}>
                PUBLIC SYSTEM STATUS
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px #10b981" }} />
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: "#10b981", letterSpacing: "0.08em" }}>
                  ONLINE
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 16, textAlign: "left" }}>
              {[
                { label: "SATELLITE SOURCES", val: "12", color: "#FF6B35" },
                { label: "GNSS SOURCES", val: "04", color: "#FF6B35" },
                { label: "OBSERVATIONS", val: "1,284", color: "#ffffff" },
                { label: "ACTIVE ALERTS", val: "03", color: "#ef4444" },
              ].map(({ label, val, color }) => (
                <div key={label} style={{
                  padding: "10px 14px", borderRadius: 8,
                  background: "rgba(10,10,10,0.8)",
                  border: "1px solid rgba(38,38,38,0.7)"
                }}>
                  <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 20, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ══ INTERACTIVE INDIA MAP & MONITORING GRID (PRD §6 & §21) ══ */}
          <div style={{
            marginTop: 40,
            background: "rgba(18,18,18,0.92)",
            border: "1px solid rgba(255,107,53,0.25)",
            borderRadius: 16,
            padding: "24px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)",
            textAlign: "left"
          }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <Globe2 style={{ width: 18, height: 18, color: "#FF6B35" }} />
                  <span className="font-display" style={{ fontSize: 16, fontWeight: 800, color: "white", letterSpacing: "0.08em" }}>
                    INDIA OBSERVATION & MONITORING GRID
                  </span>
                </div>
                <p style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#888888", margin: 0 }}>
                  Real-time visualization of 16 ground stations, orbital satellite tracking, and public advisory markers.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  padding: "4px 10px", borderRadius: 6,
                  background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
                  fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#10b981", fontWeight: 700
                }}>
                  ● 16 GROUND NODES ACTIVE
                </span>
                <DataBadge isSimulation={true} size="xs" />
              </div>
            </div>

            <EarthMap
              height="380px"
              showStations={true}
              showBoundary={true}
              satellites={dataStore.get("satellites")}
              alertMarkers={alerts.map(a => ({
                id: a.alertId,
                type: a.type,
                location: a.location,
                severity: a.severity,
                lat: a.type.includes("FLOOD") ? 26.2006 : 30.0668,
                lng: a.type.includes("FLOOD") ? 92.9376 : 79.0193
              }))}
            />
          </div>
        </div>
      </section>

      {/* ══ LIVE STATUS MATRIX ══ */}
      <section id="live-status" style={{ padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          background: "rgba(14,14,14,0.9)", borderRadius: 16,
          border: "1px solid rgba(255,107,53,0.1)",
          overflow: "hidden"
        }}>
          <div style={{
            display: "flex", flexWrap: "wrap", alignItems: "center",
            justifyContent: "space-between", gap: 10,
            padding: "18px 24px",
            borderBottom: "1px solid rgba(38,38,38,0.6)"
          }}>
            <h2 className="font-display" style={{
              fontSize: 14, fontWeight: 700, color: "white", margin: 0,
              letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 10
            }}>
              <Globe2 style={{ width: 15, height: 15, color: "#FF6B35" }} />
              PUBLIC EARTH MONITOR — CURRENT STATUS
            </h2>
            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#555555" }}>
              Last human verified: 19 September 2026 UTC
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
            {[
              { icon: <Waves />, iconColor: "#60a5fa", label: "🌊 Water", status: "NORMAL", statusColor: "#10b981", bg: "rgba(16,185,129,0.03)" },
              { icon: <Mountain />, iconColor: "#f59e0b", label: "🏔 Terrain", status: "MONITORING", statusColor: "#ef4444", bg: "rgba(239,68,68,0.03)" },
              { icon: <Trees />, iconColor: "#34d399", label: "🌱 Land", status: "NORMAL", statusColor: "#10b981", bg: "rgba(16,185,129,0.03)" },
              { icon: <Wind />, iconColor: "#FF6B35", label: "🌫 Atmosphere", status: "MODERATE", statusColor: "#f59e0b", bg: "rgba(245,158,11,0.03)" },
            ].map(({ icon, iconColor, label, status, statusColor, bg }, i, arr) => (
              <div key={label} style={{
                padding: "24px 20px", textAlign: "center",
                background: bg,
                borderRight: i < arr.length - 1 ? "1px solid rgba(38,38,38,0.5)" : "none"
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, margin: "0 auto 12px",
                  background: `${iconColor}15`, border: `1px solid ${iconColor}25`,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {React.cloneElement(icon, { style: { width: 20, height: 20, color: iconColor } })}
                </div>
                <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#666666", marginBottom: 6, letterSpacing: "0.06em" }}>{label}</div>
                <div style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: statusColor, letterSpacing: "0.08em" }}>{status}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VERIFIED ALERTS ══ */}
      <section id="verified-alerts" style={{ padding: "10px 24px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 className="font-display" style={{
            fontSize: 16, fontWeight: 700, color: "white", margin: 0,
            letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 10
          }}>
            <AlertTriangle style={{ width: 16, height: 16, color: "#ef4444" }} />
            HUMAN-VERIFIED PUBLIC ADVISORIES
          </h2>
          <span style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#10b981", fontWeight: 700,
            letterSpacing: "0.06em"
          }}>
            <ShieldCheck style={{ width: 13, height: 13 }} />
            CERTIFIED ACCURATE
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {alerts.length === 0 && (
            <div style={{
              padding: "24px", borderRadius: 12, textAlign: "center",
              background: "rgba(14,14,14,0.8)", border: "1px solid rgba(38,38,38,0.7)",
              fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "#555555"
            }}>
              No verified public advisories at this time. All systems nominal.
            </div>
          )}
          {alerts.map((alert) => (
            <div key={alert.alertId} style={{
              padding: "18px 22px", borderRadius: 12,
              background: "rgba(14,14,14,0.85)", border: "1px solid rgba(38,38,38,0.7)",
              transition: "border-color 0.2s"
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,107,53,0.2)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(38,38,38,0.7)"}
            >
              <div style={{
                display: "flex", flexWrap: "wrap", alignItems: "center",
                justifyContent: "space-between", gap: 10, marginBottom: 10,
                paddingBottom: 10, borderBottom: "1px solid rgba(38,38,38,0.5)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    padding: "3px 8px", borderRadius: 4, fontSize: 9,
                    fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                    background: "rgba(239,68,68,0.12)", color: "#ef4444",
                    border: "1px solid rgba(239,68,68,0.25)", letterSpacing: "0.05em"
                  }}>
                    {alert.severity}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "white" }}>
                    {alert.type.replace(/_/g, " ")}: {alert.location}
                  </span>
                </div>
                <DataBadge isSimulation={true} size="xs" />
              </div>
              <p style={{ fontSize: 12, color: "#a3a3a3", margin: "0 0 10px", lineHeight: 1.6 }}>
                {alert.description}
              </p>
              <div style={{
                display: "flex", flexWrap: "wrap", justifyContent: "space-between",
                fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#555555"
              }}>
                <span>Verified by: <span style={{ color: "#888888" }}>{alert.reviewedBy}</span></span>
                <span>{new Date(alert.createdAt).toUTCString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ IMAGERY SECTION ══ */}
      <section id="imagery" style={{ padding: "10px 24px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <h2 className="font-display" style={{
          fontSize: 16, fontWeight: 700, color: "white", margin: "0 0 16px",
          letterSpacing: "0.08em"
        }}>
          PUBLIC SATELLITE IMAGERY OBSERVER
        </h2>
        {images[0] && (
          <ImageCompareSlider
            beforeImage={images[0].beforeUrl}
            afterImage={images[0].afterUrl}
            title={images[0].title}
            metricChange="Brahmaputra Basin Post-Monsoon Surface Delta"
            beforeLabel="PRE-FLOOD BASELINE"
            afterLabel="LATEST OBSERVATION PASS"
            height="380px"
          />
        )}
      </section>

      {/* ══ FOOTER ══ */}
      <footer id="about" style={{
        marginTop: "auto",
        borderTop: "1px solid rgba(38,38,38,0.6)",
        background: "rgba(8,8,8,0.8)",
        padding: "40px 24px"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
            <div>
              <div className="font-display" style={{ fontSize: 14, fontWeight: 700, color: "white", letterSpacing: "0.1em", marginBottom: 4 }}>
                BHARAT EARTH MONITOR (BEM)
              </div>
              <p style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#888888", margin: 0 }}>
                Monitor Bharat. Detect Change. Inform People.
              </p>
            </div>
            <DataBadge isSimulation={true} />
          </div>

          <div style={{
            padding: "14px 18px", borderRadius: 10,
            background: "rgba(14,14,14,0.8)", border: "1px solid rgba(38,38,38,0.6)",
            fontSize: 11, lineHeight: 1.6, color: "#888888", marginBottom: 16
          }}>
            <strong style={{ color: "#ffffff" }}>System Principle Notice:</strong>{" "}
            Bharat Earth Monitor provides simulated satellite and GNSS data for prototype workflow demonstration. 
            All simulated information is clearly labelled <span style={{ color: "#FF6B35", fontWeight: 700 }}>SIMULATION DATA</span>. 
            Unverified automated emergency information is never published publicly without authorized human review.
          </div>

          <div style={{
            textAlign: "center", fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
            color: "#6b7280", paddingTop: 14, borderTop: "1px solid rgba(38,38,38,0.4)"
          }}>
            © 2026 BHARAT EARTH MONITOR (BEM) — ALL RIGHTS RESERVED
          </div>
        </div>
      </footer>
    </div>
  );
};
