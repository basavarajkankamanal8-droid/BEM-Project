import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  Globe2, User, Phone, Mail, MapPin, Home, Hash, 
  CheckCircle2, AlertCircle, ArrowRight, KeyRound
} from "lucide-react";
import { DataBadge } from "../../components/layout/DataBadge";

export const Register = () => {
  const { registerPublicUser } = useAuth();
  const navigate = useNavigate();

  // Form fields — No Password field
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // OTP Verification state
  const [otpStep, setOtpStep] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusField, setFocusField] = useState(null);

  const handleSendOtp = (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || fullName.trim().length === 0) {
      setError("Full Name is required.");
      return;
    }

    // Validate 10-digit Indian phone number
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!location || location.trim().length === 0) {
      setError("Location / City is required.");
      return;
    }

    if (!address || address.trim().length === 0) {
      setError("Address is required.");
      return;
    }

    if (!pinCode || pinCode.trim().length !== 6 || isNaN(pinCode)) {
      setError("Please enter a valid 6-digit PIN code.");
      return;
    }

    if (!agreeTerms) {
      setError("You must agree to the Terms & Privacy Policy to create an account.");
      return;
    }

    // Generate simulated OTP
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockCode);
    setOtpStep(true);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (otpInput.trim() !== generatedOtp && otpInput.trim() !== "123456") {
      setError(`Invalid OTP code. For demo use OTP: ${generatedOtp}`);
      return;
    }

    setLoading(true);

    try {
      await registerPublicUser({
        name: fullName,
        phone,
        email,
        location,
        address,
        pinCode
      });

      navigate("/public-dashboard");
    } catch (err) {
      setError(err.message || "Registration failed.");
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
    padding: "10px 14px 10px 38px",
    color: "#ededed",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    outline: "none",
    transition: "all 0.2s",
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
      padding: "40px 20px",
      position: "relative",
    }}>
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(255,107,53,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,107,53,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }} />

      <div className="w-full max-w-xl animate-slide-up" style={{ position: "relative", zIndex: 10 }}>
        
        <div style={{
          position: "absolute", inset: -1, borderRadius: 20,
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
          <div style={{
            height: 3,
            background: "linear-gradient(90deg, transparent, #FF6B35 30%, #ff8152 50%, #FF6B35 70%, transparent)",
          }} />

          <div style={{ padding: "32px 36px" }}>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, margin: "0 auto 12px",
                background: "linear-gradient(135deg, #FF6B35 0%, #ff8c5a 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 32px rgba(255,107,53,0.35)",
              }}>
                <Globe2 style={{ width: 26, height: 26, color: "#0f0f0f", strokeWidth: 2.5 }} />
              </div>

              <h1 className="font-display" style={{
                fontSize: 20, fontWeight: 800, color: "white", letterSpacing: "0.1em", marginBottom: 4
              }}>
                REGISTER AS PEOPLE OF INDIA
              </h1>

              <p style={{
                fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#FF6B35",
                fontWeight: 700, letterSpacing: "0.08em", marginBottom: 10
              }}>
                PASSWORDLESS ACCOUNT CREATION
              </p>

              <DataBadge isSimulation={true} size="xs" />
            </div>

            {error && (
              <div style={{
                padding: "10px 14px", borderRadius: 8, marginBottom: 16,
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)",
                display: "flex", alignItems: "center", gap: 8
              }}>
                <AlertCircle style={{ width: 14, height: 14, color: "#ef4444", flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#ef4444" }}>
                  {error}
                </span>
              </div>
            )}

            {/* OTP Step */}
            {otpStep ? (
              <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{
                  padding: "16px", borderRadius: 12,
                  background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.2)",
                  textAlign: "center"
                }}>
                  <KeyRound style={{ width: 24, height: 24, color: "#FF6B35", margin: "0 auto 8px" }} />
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 4 }}>
                    VERIFY MOBILE OTP
                  </h3>
                  <p style={{ fontSize: 11, color: "#a3a3a3", fontFamily: "'Inter', sans-serif" }}>
                    An OTP has been sent to <strong style={{ color: "#FF6B35" }}>+91 {phone}</strong>
                  </p>
                  <div style={{
                    fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                    color: "#10b981", background: "rgba(16,185,129,0.1)",
                    padding: "6px 12px", borderRadius: 6, display: "inline-block", marginTop: 8
                  }}>
                    DEMO OTP CODE: <strong style={{ letterSpacing: "0.15em" }}>{generatedOtp}</strong>
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
                    placeholder="Enter 6-digit OTP"
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
                    width: "100%", padding: "12px 0", borderRadius: 10,
                    fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "0.1em", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                  }}
                >
                  <CheckCircle2 style={{ width: 14, height: 14 }} />
                  <span>VERIFY & CREATE ACCOUNT</span>
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
                  ← Edit Form Details
                </button>
              </form>
            ) : (
              /* Passwordless Registration Form */
              <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{
                  padding: "10px 12px", borderRadius: 8,
                  background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)",
                  fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#10b981"
                }}>
                  ✓ Passwordless Account Creation — No password required
                </div>

                {/* Full Name */}
                <div>
                  <label style={{
                    display: "block", marginBottom: 5,
                    fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700, color: "#888888", letterSpacing: "0.08em"
                  }}>
                    FULL NAME *
                  </label>
                  <div style={{ position: "relative" }}>
                    <User style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#555" }} />
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onFocus={() => setFocusField("fullName")}
                      onBlur={() => setFocusField(null)}
                      style={inputStyle("fullName")}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {/* Phone Number */}
                  <div>
                    <label style={{
                      display: "block", marginBottom: 5,
                      fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700, color: "#888888", letterSpacing: "0.08em"
                    }}>
                      PHONE NUMBER (+91) *
                    </label>
                    <div style={{ position: "relative" }}>
                      <Phone style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#555" }} />
                      <input
                        type="tel"
                        required
                        placeholder="+91 XXXXX XXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onFocus={() => setFocusField("phone")}
                        onBlur={() => setFocusField(null)}
                        style={inputStyle("phone")}
                      />
                    </div>
                  </div>

                  {/* Valid Email ID */}
                  <div>
                    <label style={{
                      display: "block", marginBottom: 5,
                      fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700, color: "#888888", letterSpacing: "0.08em"
                    }}>
                      VALID EMAIL ID *
                    </label>
                    <div style={{ position: "relative" }}>
                      <Mail style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#555" }} />
                      <input
                        type="email"
                        required
                        placeholder="Enter a valid email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusField("email")}
                        onBlur={() => setFocusField(null)}
                        style={inputStyle("email")}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {/* Location / City */}
                  <div>
                    <label style={{
                      display: "block", marginBottom: 5,
                      fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700, color: "#888888", letterSpacing: "0.08em"
                    }}>
                      LOCATION / CITY *
                    </label>
                    <div style={{ position: "relative" }}>
                      <MapPin style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#555" }} />
                      <input
                        type="text"
                        required
                        placeholder="Enter your city"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onFocus={() => setFocusField("location")}
                        onBlur={() => setFocusField(null)}
                        style={inputStyle("location")}
                      />
                    </div>
                  </div>

                  {/* City PIN Code */}
                  <div>
                    <label style={{
                      display: "block", marginBottom: 5,
                      fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700, color: "#888888", letterSpacing: "0.08em"
                    }}>
                      CITY PIN CODE *
                    </label>
                    <div style={{ position: "relative" }}>
                      <Hash style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#555" }} />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="6-digit PIN code"
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        onFocus={() => setFocusField("pinCode")}
                        onBlur={() => setFocusField(null)}
                        style={inputStyle("pinCode")}
                      />
                    </div>
                  </div>
                </div>

                {/* Residential Address */}
                <div>
                  <label style={{
                    display: "block", marginBottom: 5,
                    fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700, color: "#888888", letterSpacing: "0.08em"
                  }}>
                    ADDRESS *
                  </label>
                  <div style={{ position: "relative" }}>
                    <Home style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#555" }} />
                    <input
                      type="text"
                      required
                      placeholder="Enter your address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      onFocus={() => setFocusField("address")}
                      onBlur={() => setFocusField(null)}
                      style={inputStyle("address")}
                    />
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 4 }}>
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    style={{ marginTop: 2, accentColor: "#FF6B35" }}
                  />
                  <label htmlFor="terms" style={{ fontSize: 11, color: "#a3a3a3", fontFamily: "'Inter', sans-serif" }}>
                    I agree to the <span style={{ color: "#FF6B35", fontWeight: 600 }}>Terms of Service</span> & <span style={{ color: "#FF6B35", fontWeight: 600 }}>Privacy Policy</span> for Bharat Earth Monitor.
                  </label>
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
                    marginTop: 6
                  }}
                >
                  <span>CREATE ACCOUNT</span>
                  <ArrowRight style={{ width: 14, height: 14 }} />
                </button>
              </form>
            )}

            {/* Back to Login Link */}
            <div style={{
              marginTop: 20, paddingTop: 16,
              borderTop: "1px solid rgba(255,255,255,0.06)",
              textAlign: "center"
            }}>
              <span style={{ fontSize: 11, color: "#888888", fontFamily: "'Inter', sans-serif" }}>
                Already registered?{" "}
              </span>
              <Link
                to="/login"
                style={{
                  fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                  color: "#FF6B35", fontWeight: 700, textDecoration: "underline"
                }}
              >
                Sign In to Portal
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
