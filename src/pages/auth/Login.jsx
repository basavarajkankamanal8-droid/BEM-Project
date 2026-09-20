import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  Globe2, Lock, Mail, ShieldAlert, ArrowRight, CheckCircle2, 
  AlertCircle, UserCheck, Shield, Phone, KeyRound
} from "lucide-react";
import { DataBadge } from "../../components/layout/DataBadge";

// Animated grid background
const GridBackground = () => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: `
        linear-gradient(rgba(255,107,53,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,107,53,0.04) 1px, transparent 1px)
      `,
      backgroundSize: "40px 40px",
    }} />
    <div style={{
      position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
      width: 700, height: 400,
      background: "radial-gradient(ellipse, rgba(255,107,53,0.14) 0%, transparent 70%)",
    }} />
  </div>
);

export const Login = () => {
  const [accountType, setAccountType] = useState("ADMIN"); // 'ADMIN' or 'PUBLIC'
  
  // Admin fields — empty by default (no pre-filled credentials)
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // People of India fields — empty by default
  const [publicPhone, setPublicPhone] = useState("");
  const [publicEmail, setPublicEmail] = useState("");

  // OTP Verification state
  const [otpStep, setOtpStep] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusField, setFocusField] = useState(null);

  const { loginAdmin, loginPublicUser, isLocked } = useAuth();
  const navigate = useNavigate();

  const handleAccountTypeSwitch = (type) => {
    setAccountType(type);
    setError("");
    setOtpStep(false);
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginAdmin(adminEmail, adminPassword);
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid admin credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublicInitiate = (e) => {
    e.preventDefault();
    setError("");

    const cleanPhone = publicPhone.replace(/\D/g, "").slice(-10);
    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(publicEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Generate simulated OTP
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockCode);
    setOtpStep(true);
  };

  const handlePublicVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (otpInput.trim() !== generatedOtp && otpInput.trim() !== "123456") {
      setError(`Invalid OTP code. For demo use OTP: ${generatedOtp}`);
      return;
    }

    setLoading(true);
    try {
      await loginPublicUser(publicPhone, publicEmail);
      navigate("/public-dashboard");
    } catch (err) {
      setError(err.message || "Login failed.");
      setOtpStep(false);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: "100%",
    background: "rgba(8, 8, 8, 0.85)",
    border: `1px solid ${focusField === field ? "rgba(255,107,53,0.6)" : "rgba(38,38,38,0.8)"}`,
    borderRadius: 8,
    padding: "11px 14px 11px 40px",
    color: "#ededed",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow: focusField === field 
      ? "0 0 0 3px rgba(255,107,53,0.1), 0 0 20px rgba(255,107,53,0.06)"
      : "none",
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f0f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      position: "relative",
    }}>
      <GridBackground />

      <div className="w-full max-w-md animate-slide-up" style={{ position: "relative", zIndex: 10 }}>
        
        {/* Card outer glow */}
        <div style={{
          position: "absolute", inset: -1,
          borderRadius: 20,
          background: "linear-gradient(135deg, rgba(255,107,53,0.18), transparent 50%, rgba(255,107,53,0.08))",
          filter: "blur(1px)"
        }} />

        <div style={{
          position: "relative",
          background: "rgba(14, 14, 14, 0.95)",
          border: "1px solid rgba(255,107,53,0.15)",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)"
        }}>
          {/* Top accent stripe */}
          <div style={{
            height: 3,
            background: "linear-gradient(90deg, transparent, #FF6B35 30%, #ff8152 50%, #FF6B35 70%, transparent)",
          }} />

          <div style={{ padding: "32px 32px 28px", position: "relative", zIndex: 2 }}>

            {/* Brand Header */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, margin: "0 auto 14px",
                background: "linear-gradient(135deg, #FF6B35 0%, #ff8c5a 60%, #cc5528 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 32px rgba(255,107,53,0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
              }}
                className="animate-float"
              >
                <Globe2 style={{ width: 28, height: 28, color: "#0f0f0f", strokeWidth: 2.5 }}
                  className="animate-spin-slow"
                />
              </div>

              <h1 className="font-display" style={{
                fontSize: 20, fontWeight: 800, color: "white",
                letterSpacing: "0.12em", marginBottom: 4,
              }}>
                BHARAT EARTH MONITOR
              </h1>

              <p style={{
                fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                color: "#FF6B35", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12
              }}>
                SECURE ACCESS PORTAL
              </p>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <DataBadge isSimulation={true} size="xs" />
              </div>
            </div>

            {/* Account Type Selector */}
            <div style={{
              display: "flex", gap: 8, padding: 4,
              background: "rgba(8, 8, 8, 0.9)",
              border: "1px solid rgba(38,38,38,0.8)",
              borderRadius: 12, marginBottom: 20
            }}>
              <button
                type="button"
                onClick={() => handleAccountTypeSwitch("ADMIN")}
                style={{
                  flex: 1, padding: "9px 0", borderRadius: 8,
                  fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                  letterSpacing: "0.08em", cursor: "pointer",
                  background: accountType === "ADMIN" ? "#FF6B35" : "transparent",
                  color: accountType === "ADMIN" ? "#0f0f0f" : "#888888",
                  border: "none", transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                }}
              >
                <Shield style={{ width: 13, height: 13 }} />
                <span>ADMIN</span>
              </button>

              <button
                type="button"
                onClick={() => handleAccountTypeSwitch("PUBLIC")}
                style={{
                  flex: 1, padding: "9px 0", borderRadius: 8,
                  fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                  letterSpacing: "0.08em", cursor: "pointer",
                  background: accountType === "PUBLIC" ? "#FF6B35" : "transparent",
                  color: accountType === "PUBLIC" ? "#0f0f0f" : "#888888",
                  border: "none", transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                }}
              >
                <UserCheck style={{ width: 13, height: 13 }} />
                <span>PEOPLE OF INDIA</span>
              </button>
            </div>

            {/* Security Rate Limit Alert */}
            {isLocked && accountType === "ADMIN" && (
              <div style={{
                padding: "10px 14px", borderRadius: 8, marginBottom: 14,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.3)",
                display: "flex", alignItems: "center", gap: 8
              }}>
                <ShieldAlert style={{ width: 14, height: 14, color: "#ef4444", flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#ef4444" }}>
                  TERMINAL LOCKED · Rate limit enforced
                </span>
              </div>
            )}

            {error && (
              <div style={{
                padding: "10px 14px", borderRadius: 8, marginBottom: 14,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.3)",
                display: "flex", alignItems: "center", gap: 8
              }}>
                <AlertCircle style={{ width: 14, height: 14, color: "#ef4444", flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#ef4444" }}>
                  {error}
                </span>
              </div>
            )}

            {/* ══ ADMIN LOGIN FORM ══ */}
            {accountType === "ADMIN" && (
              <form onSubmit={handleAdminSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{
                  padding: "10px 12px", borderRadius: 8,
                  background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.2)",
                  fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#FF6B35"
                }}>
                  🔐 Admin Authorization Required · Secure Environment Config
                </div>

                <div>
                  <label style={{
                    display: "block", marginBottom: 6,
                    fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700, color: "#888888", letterSpacing: "0.08em"
                  }}>
                    EMAIL ADDRESS
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail style={{
                      position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)",
                      width: 14, height: 14, color: focusField === "adminEmail" ? "#FF6B35" : "#555555"
                    }} />
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      onFocus={() => setFocusField("adminEmail")}
                      onBlur={() => setFocusField(null)}
                      placeholder="Enter admin email address"
                      style={inputStyle("adminEmail")}
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: "block", marginBottom: 6,
                    fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700, color: "#888888", letterSpacing: "0.08em"
                  }}>
                    PASSWORD
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock style={{
                      position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)",
                      width: 14, height: 14, color: focusField === "adminPassword" ? "#FF6B35" : "#555555"
                    }} />
                    <input
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      onFocus={() => setFocusField("adminPassword")}
                      onBlur={() => setFocusField(null)}
                      placeholder="Enter admin password"
                      style={inputStyle("adminPassword")}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || isLocked}
                  className="aeris-btn-primary"
                  style={{
                    width: "100%", padding: "13px 0", borderRadius: 10,
                    fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "0.1em", cursor: loading || isLocked ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    marginTop: 4
                  }}
                >
                  {loading ? <span>AUTHENTICATING...</span> : (
                    <>
                      <span>SECURE ADMIN LOGIN</span>
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ══ PEOPLE OF INDIA LOGIN FORM (Phone + Email - NO PASSWORD) ══ */}
            {accountType === "PUBLIC" && (
              <>
                {otpStep ? (
                  /* OTP Step for Public User */
                  <form onSubmit={handlePublicVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{
                      padding: "14px", borderRadius: 10,
                      background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)",
                      textAlign: "center"
                    }}>
                      <KeyRound style={{ width: 20, height: 20, color: "#10b981", margin: "0 auto 6px" }} />
                      <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#10b981", fontWeight: 700 }}>
                        VERIFY OTP FOR +91 {publicPhone}
                      </div>
                      <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#d4d4d4", marginTop: 4 }}>
                        DEMO OTP CODE: <strong style={{ color: "#FF6B35", letterSpacing: "0.1em" }}>{generatedOtp}</strong>
                      </div>
                    </div>

                    <div>
                      <label style={{
                        display: "block", marginBottom: 6,
                        fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 700, color: "#888888", letterSpacing: "0.08em"
                      }}>
                        ENTER 6-DIGIT OTP
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder="Enter OTP"
                        style={{
                          width: "100%", padding: "12px", textAlign: "center",
                          background: "rgba(8,8,8,0.9)", border: "1px solid rgba(255,107,53,0.4)",
                          borderRadius: 8, color: "#FF6B35", fontSize: 18,
                          fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.3em",
                          outline: "none"
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="aeris-btn-primary"
                      style={{
                        width: "100%", padding: "13px 0", borderRadius: 10,
                        fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: "0.1em", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                      }}
                    >
                      {loading ? <span>VERIFYING...</span> : (
                        <>
                          <span>VERIFY & CONTINUE</span>
                          <CheckCircle2 style={{ width: 14, height: 14 }} />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setOtpStep(false)}
                      style={{
                        background: "none", border: "none", color: "#666666",
                        fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                        cursor: "pointer", textDecoration: "underline", textAlign: "center"
                      }}
                    >
                      ← Change Phone / Email
                    </button>
                  </form>
                ) : (
                  /* Passwordless Phone + Email Step */
                  <form onSubmit={handlePublicInitiate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{
                      padding: "10px 12px", borderRadius: 8,
                      background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)",
                      fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#10b981"
                    }}>
                      ✓ Passwordless Access for People of India
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label style={{
                        display: "block", marginBottom: 6,
                        fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 700, color: "#888888", letterSpacing: "0.08em"
                      }}>
                        PHONE NUMBER (+91)
                      </label>
                      <div style={{ position: "relative" }}>
                        <Phone style={{
                          position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)",
                          width: 14, height: 14, color: focusField === "publicPhone" ? "#FF6B35" : "#555555"
                        }} />
                        <input
                          type="tel"
                          required
                          placeholder="+91 XXXXX XXXXX"
                          value={publicPhone}
                          onChange={(e) => setPublicPhone(e.target.value)}
                          onFocus={() => setFocusField("publicPhone")}
                          onBlur={() => setFocusField(null)}
                          style={inputStyle("publicPhone")}
                        />
                      </div>
                    </div>

                    {/* Valid Email ID */}
                    <div>
                      <label style={{
                        display: "block", marginBottom: 6,
                        fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 700, color: "#888888", letterSpacing: "0.08em"
                      }}>
                        VALID EMAIL ID
                      </label>
                      <div style={{ position: "relative" }}>
                        <Mail style={{
                          position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)",
                          width: 14, height: 14, color: focusField === "publicEmail" ? "#FF6B35" : "#555555"
                        }} />
                        <input
                          type="email"
                          required
                          placeholder="example@email.com"
                          value={publicEmail}
                          onChange={(e) => setPublicEmail(e.target.value)}
                          onFocus={() => setFocusField("publicEmail")}
                          onBlur={() => setFocusField(null)}
                          style={inputStyle("publicEmail")}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="aeris-btn-primary"
                      style={{
                        width: "100%", padding: "13px 0", borderRadius: 10,
                        fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: "0.1em", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        marginTop: 4
                      }}
                    >
                      <span>CONTINUE SECURELY</span>
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </button>
                  </form>
                )}

                {/* Create Account Link */}
                <div style={{
                  marginTop: 20, paddingTop: 16,
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  textAlign: "center"
                }}>
                  <span style={{ fontSize: 11, color: "#888888", fontFamily: "'Inter', sans-serif" }}>
                    New user?{" "}
                  </span>
                  <Link
                    to="/register"
                    style={{
                      fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                      color: "#FF6B35", fontWeight: 700, textDecoration: "underline"
                    }}
                  >
                    REGISTER AS PEOPLE OF INDIA
                  </Link>
                </div>
              </>
            )}

            {/* Admin Policy Notice */}
            {accountType === "ADMIN" && (
              <div style={{
                marginTop: 18, paddingTop: 14,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                textAlign: "center",
                fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                color: "#666666", lineHeight: 1.5
              }}>
                🔒 Admin access requires credentials configured via secure environment variables.
              </div>
            )}
          </div>
        </div>

        {/* Link back to landing page */}
        <div style={{ textAlign: "center", marginTop: 18 }}>
          <Link
            to="/public"
            style={{
              fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
              color: "#666666", textDecoration: "none", letterSpacing: "0.04em",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.target.style.color = "#FF6B35"}
            onMouseLeave={e => e.target.style.color = "#666666"}
          >
            ← Return to Bharat Earth Monitor
          </Link>
        </div>

      </div>
    </div>
  );
};
