import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { dataStore } from "../../services/dataStore";
import { DataBadge } from "../../components/layout/DataBadge";
import { 
  AlertTriangle, 
  MapPin, 
  Compass, 
  Camera, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  ArrowRight, 
  ArrowLeft,
  Info,
  Building,
  Upload,
  User,
  Hash
} from "lucide-react";

const EVENT_TYPES = [
  "Earthquake",
  "Landslide",
  "Flood",
  "Heavy Rainfall",
  "Cyclone",
  "Fire",
  "Land Movement",
  "Water-Level Change",
  "Environmental Event",
  "Other"
];

const THREAT_LEVELS = [
  { level: "LOW", label: "LOW", color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)", desc: "Minor observation with low immediate risk" },
  { level: "MEDIUM", label: "MEDIUM", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", desc: "Moderate change, potential inconvenience or local disruption" },
  { level: "HIGH", label: "HIGH", color: "#FF6B35", bg: "rgba(255,107,53,0.12)", border: "rgba(255,107,53,0.3)", desc: "Significant environmental threat, potential property or road hazard" },
  { level: "CRITICAL", label: "CRITICAL", color: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", desc: "Severe emergency danger, urgent human safety risk" },
];

export const ReportAlert = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Wizard state: 1 = Form, 2 = Preview, 3 = Submitted Success
  const [step, setStep] = useState(1);

  // Form Fields per PRD §15 - §24
  const [reporterName, setReporterName] = useState(currentUser?.name || "Citizen of Bharat");
  const [placeName, setPlaceName] = useState("");
  const [nearbyLandmark, setNearbyLandmark] = useState("");
  const [district, setDistrict] = useState(currentUser?.city || "");
  const [state, setState] = useState("Karnataka");
  const [pinCode, setPinCode] = useState(currentUser?.pinCode || "");
  const [eventType, setEventType] = useState("Heavy Rainfall");
  const [otherEventType, setOtherEventType] = useState("");
  const [reportedThreatLevel, setReportedThreatLevel] = useState("MEDIUM");
  const [description, setDescription] = useState("");
  const [incidentDate, setIncidentDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [incidentTime, setIncidentTime] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const [formError, setFormError] = useState("");
  const [submittedReport, setSubmittedReport] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError("Photo exceeds maximum limit of 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProceedToPreview = (e) => {
    e.preventDefault();
    setFormError("");

    if (!placeName.trim()) {
      setFormError("Please enter the Place / Incident Place Name.");
      return;
    }
    if (!nearbyLandmark.trim()) {
      setFormError("Please enter a Nearby Popular Location / Landmark (e.g. Bus Stand, Railway Station, Temple).");
      return;
    }
    if (!district.trim()) {
      setFormError("Please enter the District.");
      return;
    }
    if (!state.trim()) {
      setFormError("Please enter the State.");
      return;
    }
    if (!pinCode || pinCode.trim().length !== 6 || isNaN(pinCode)) {
      setFormError("Please enter a valid 6-digit PIN code.");
      return;
    }
    if (eventType === "Other" && !otherEventType.trim()) {
      setFormError("Please specify the event type.");
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setFormError("Please describe what you observed (at least 10 characters).");
      return;
    }

    setStep(2); // Review screen
  };

  const handleSubmitFinalAlert = () => {
    setIsSubmitting(true);
    setFormError("");

    try {
      // Generate ID like BEM-ALERT-000004 per PRD §26
      const existing = dataStore.get("citizen_alert_reports");
      const nextNum = String(existing.length + 1).padStart(6, "0");
      const newReportId = `BEM-ALERT-${nextNum}`;

      const newRecord = {
        reportId: newReportId,
        userId: currentUser?.uid || "usr_public_guest",
        reporterName: reporterName.trim() || "Citizen of Bharat",
        eventType: eventType === "Other" ? otherEventType.trim() : eventType,
        placeName: placeName.trim(),
        nearbyLandmark: nearbyLandmark.trim(),
        district: district.trim(),
        state: state.trim(),
        pinCode: pinCode.trim(),
        reportedThreatLevel,
        description: description.trim(),
        incidentDate,
        incidentTime,
        imageUrl: imageUrl || null,
        status: "PENDING REVIEW",
        verifiedThreatLevel: null,
        adminReason: "",
        adminNotes: "",
        reviewedBy: null,
        submittedAt: new Date().toISOString(),
        reviewedAt: null,
        publishedAt: null,
        source: "CITIZEN REPORT"
      };

      dataStore.add("citizen_alert_reports", newRecord);

      // Audit log
      dataStore.add("audit_logs", {
        id: "aud_" + Date.now(),
        actor: reporterName.trim() || "Citizen",
        action: "CITIZEN_ALERT_SUBMITTED",
        target: newReportId,
        timestamp: new Date().toISOString(),
        ipAddress: "127.0.0.1 (Citizen Client)"
      });

      setSubmittedReport(newRecord);
      setStep(3); // Success confirmation
    } catch (err) {
      setFormError(err.message || "Failed to submit alert. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: 900, margin: "0 auto" }}>

      {/* Breadcrumb / Nav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Link
          to="/public-dashboard"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
            color: "#888888", textDecoration: "none"
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#FF6B35"}
          onMouseLeave={e => e.currentTarget.style.color = "#888888"}
        >
          <ArrowLeft style={{ width: 14, height: 14 }} />
          <span>BACK TO DASHBOARD</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
            color: "#FF6B35", padding: "4px 8px", borderRadius: 4,
            background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.25)"
          }}>
            CITIZEN REPORTING MODULE
          </span>
          <DataBadge isSimulation={true} size="xs" />
        </div>
      </div>

      {/* ── STEP 1: CITIZEN ALERT FORM ── */}
      {step === 1 && (
        <div style={{
          background: "rgba(14,14,14,0.96)",
          border: "1px solid rgba(255,107,53,0.25)",
          borderRadius: 16,
          padding: "28px 32px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.7)"
        }}>
          {/* Header */}
          <div style={{ marginBottom: 24, borderBottom: "1px solid rgba(38,38,38,0.8)", paddingBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: "linear-gradient(135deg, #FF6B35 0%, #ff8c5a 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#0f0f0f", boxShadow: "0 4px 16px rgba(255,107,53,0.4)"
              }}>
                <AlertTriangle style={{ width: 20, height: 20 }} />
              </div>
              <div>
                <h1 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: "white", margin: 0 }}>
                  🚨 REPORT AN OBSERVED INCIDENT
                </h1>
                <p style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#FF6B35", margin: 0, marginTop: 2 }}>
                  CITIZEN INCIDENT INTAKE · INITIAL STATUS: PENDING REVIEW
                </p>
              </div>
            </div>

            <div style={{
              marginTop: 12, padding: "10px 14px", borderRadius: 8,
              background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)",
              display: "flex", alignItems: "flex-start", gap: 10
            }}>
              <Info style={{ width: 16, height: 16, color: "#f59e0b", flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: 11, color: "#e5e7eb", lineHeight: 1.5 }}>
                <strong style={{ color: "#f59e0b" }}>Safety Directive:</strong> Never enter dangerous zones to report incidents. All citizen reports undergo administrative verification before publishing as verified public alerts.
              </div>
            </div>
          </div>

          {formError && (
            <div style={{
              padding: "12px 16px", borderRadius: 8, marginBottom: 20,
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.35)",
              display: "flex", alignItems: "center", gap: 10, color: "#ef4444", fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace"
            }}>
              <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleProceedToPreview} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            
            {/* 1. Person Giving the Alert (PRD §15) */}
            <div>
              <label style={{ display: "block", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#888888", marginBottom: 6 }}>
                PERSON GIVING THE ALERT (YOUR FULL NAME) *
              </label>
              <div style={{ position: "relative" }}>
                <User style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#666" }} />
                <input
                  type="text"
                  required
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px 10px 38px", borderRadius: 8,
                    background: "rgba(8,8,8,0.85)", border: "1px solid rgba(38,38,38,0.8)",
                    color: "white", fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                    outline: "none"
                  }}
                  placeholder="Your Name"
                />
              </div>
              <span style={{ fontSize: 10, color: "#666666", marginTop: 4, display: "block" }}>
                Auto-filled from your registered People of India account. You may confirm or edit before submitting.
              </span>
            </div>

            {/* 2. Incident Place & Nearby Landmark (PRD §16 & §17) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#888888", marginBottom: 6 }}>
                  INCIDENT PLACE NAME *
                </label>
                <div style={{ position: "relative" }}>
                  <MapPin style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#FF6B35" }} />
                  <input
                    type="text"
                    required
                    value={placeName}
                    onChange={(e) => setPlaceName(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 14px 10px 38px", borderRadius: 8,
                      background: "rgba(8,8,8,0.85)", border: "1px solid rgba(38,38,38,0.8)",
                      color: "white", fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                      outline: "none"
                    }}
                    placeholder="e.g. Madikeri / Rampur Village"
                  />
                </div>
                <span style={{ fontSize: 10, color: "#666666", marginTop: 4, display: "block" }}>
                  Village, town, area, locality, or street
                </span>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#888888", marginBottom: 6 }}>
                  NEARBY POPULAR LOCATION / LANDMARK *
                </label>
                <div style={{ position: "relative" }}>
                  <Building style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#FF6B35" }} />
                  <input
                    type="text"
                    required
                    value={nearbyLandmark}
                    onChange={(e) => setNearbyLandmark(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 14px 10px 38px", borderRadius: 8,
                      background: "rgba(8,8,8,0.85)", border: "1px solid rgba(38,38,38,0.8)",
                      color: "white", fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                      outline: "none"
                    }}
                    placeholder="e.g. Main Bus Stand / Railway Station / Govt Hospital"
                  />
                </div>
                <span style={{ fontSize: 10, color: "#666666", marginTop: 4, display: "block" }}>
                  Helps BEM administrators identify the location
                </span>
              </div>
            </div>

            {/* 3. District, State, PIN Code (PRD §18) */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr 1fr", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#888888", marginBottom: 6 }}>
                  DISTRICT *
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 8,
                    background: "rgba(8,8,8,0.85)", border: "1px solid rgba(38,38,38,0.8)",
                    color: "white", fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                    outline: "none"
                  }}
                  placeholder="e.g. Kodagu / Sonitpur"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#888888", marginBottom: 6 }}>
                  STATE *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 8,
                    background: "rgba(8,8,8,0.85)", border: "1px solid rgba(38,38,38,0.8)",
                    color: "white", fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                    outline: "none"
                  }}
                  placeholder="e.g. Karnataka / Assam"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#888888", marginBottom: 6 }}>
                  PIN CODE *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 8,
                    background: "rgba(8,8,8,0.85)", border: "1px solid rgba(38,38,38,0.8)",
                    color: "white", fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                    outline: "none"
                  }}
                  placeholder="6-digit PIN"
                />
              </div>
            </div>

            {/* 4. Event Type (PRD §19) */}
            <div>
              <label style={{ display: "block", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#888888", marginBottom: 6 }}>
                WHAT TYPE OF EVENT ARE YOU REPORTING? *
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 8,
                  background: "rgba(8,8,8,0.85)", border: "1px solid rgba(255,107,53,0.3)",
                  color: "#FF6B35", fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700, outline: "none"
                }}
              >
                {EVENT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              {eventType === "Other" && (
                <div style={{ marginTop: 10 }}>
                  <label style={{ display: "block", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#888888", marginBottom: 4 }}>
                    SPECIFY EVENT TYPE *
                  </label>
                  <input
                    type="text"
                    required
                    value={otherEventType}
                    onChange={(e) => setOtherEventType(e.target.value)}
                    placeholder="Enter specific event classification"
                    style={{
                      width: "100%", padding: "9px 12px", borderRadius: 8,
                      background: "rgba(8,8,8,0.85)", border: "1px solid rgba(38,38,38,0.8)",
                      color: "white", fontSize: 12, fontFamily: "'JetBrains Mono', monospace"
                    }}
                  />
                </div>
              )}
            </div>

            {/* 5. Reported Threat Level (PRD §20) */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#888888" }}>
                  WHAT IS THE REPORTED THREAT LEVEL? *
                </label>
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#FF6B35", fontWeight: 700 }}>
                  CITIZEN REPORTED (ADMIN VERIFIES LATER)
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {THREAT_LEVELS.map(({ level, color, bg, border, desc }) => (
                  <div
                    key={level}
                    onClick={() => setReportedThreatLevel(level)}
                    style={{
                      padding: "12px 10px", borderRadius: 10, cursor: "pointer",
                      textAlign: "center",
                      background: reportedThreatLevel === level ? bg : "rgba(8,8,8,0.6)",
                      border: `1px solid ${reportedThreatLevel === level ? color : "rgba(38,38,38,0.7)"}`,
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color }}>
                      {level}
                    </div>
                    <div style={{ fontSize: 9, color: "#737373", marginTop: 4, lineHeight: 1.3 }}>
                      {desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Description (PRD §21) */}
            <div>
              <label style={{ display: "block", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#888888", marginBottom: 6 }}>
                WHAT DID YOU OBSERVE? (DESCRIPTION) *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you observed, where you observed it, and any useful information about the incident. (e.g. Water level has increased near the bridge and is flowing onto the nearby road.)"
                style={{
                  width: "100%", padding: "12px", borderRadius: 8,
                  background: "rgba(8,8,8,0.85)", border: "1px solid rgba(38,38,38,0.8)",
                  color: "white", fontSize: 12, fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.5, outline: "none"
                }}
              />
            </div>

            {/* 7. Date & Time of Incident (PRD §22 & §23) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#888888", marginBottom: 6 }}>
                  DATE OF INCIDENT *
                </label>
                <div style={{ position: "relative" }}>
                  <Calendar style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#888" }} />
                  <input
                    type="date"
                    required
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 14px 10px 38px", borderRadius: 8,
                      background: "rgba(8,8,8,0.85)", border: "1px solid rgba(38,38,38,0.8)",
                      color: "white", fontSize: 12, fontFamily: "'JetBrains Mono', monospace"
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#888888", marginBottom: 6 }}>
                  APPROXIMATE TIME *
                </label>
                <div style={{ position: "relative" }}>
                  <Clock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#888" }} />
                  <input
                    type="text"
                    required
                    value={incidentTime}
                    onChange={(e) => setIncidentTime(e.target.value)}
                    placeholder="e.g. 09:30 PM / 14:15"
                    style={{
                      width: "100%", padding: "10px 14px 10px 38px", borderRadius: 8,
                      background: "rgba(8,8,8,0.85)", border: "1px solid rgba(38,38,38,0.8)",
                      color: "white", fontSize: 12, fontFamily: "'JetBrains Mono', monospace"
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 8. Optional Photo Upload (PRD §24) */}
            <div>
              <label style={{ display: "block", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#888888", marginBottom: 6 }}>
                UPLOAD PHOTO — OPTIONAL (MAX 5MB)
              </label>
              
              <div style={{
                border: "2px dashed rgba(255,107,53,0.3)",
                borderRadius: 12, padding: "20px", textAlign: "center",
                background: "rgba(8,8,8,0.6)"
              }}>
                {imagePreview ? (
                  <div>
                    <img
                      src={imagePreview}
                      alt="Incident preview"
                      style={{ maxHeight: 180, borderRadius: 8, margin: "0 auto 12px", border: "1px solid rgba(255,107,53,0.3)" }}
                    />
                    <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => { setImagePreview(null); setImageUrl(""); }}
                        style={{
                          background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
                          color: "#ef4444", borderRadius: 6, padding: "5px 12px", fontSize: 11,
                          fontFamily: "'JetBrains Mono', monospace", cursor: "pointer"
                        }}
                      >
                        Remove Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Camera style={{ width: 28, height: 28, color: "#FF6B35", margin: "0 auto 8px" }} />
                    <div style={{ fontSize: 12, color: "#ededed", marginBottom: 4 }}>
                      Select photo from your camera or local files
                    </div>
                    <div style={{ fontSize: 10, color: "#666666", marginBottom: 12 }}>
                      JPG, PNG, WebP supported · Photos do not become public until admin approval
                    </div>
                    <label style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "8px 16px", borderRadius: 8,
                      background: "rgba(255,107,53,0.15)", border: "1px solid rgba(255,107,53,0.35)",
                      color: "#FF6B35", fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700, cursor: "pointer"
                    }}>
                      <Upload style={{ width: 14, height: 14 }} />
                      <span>CHOOSE PHOTO FILE</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Review Button */}
            <button
              type="submit"
              className="aeris-btn-primary"
              style={{
                width: "100%", padding: "14px 0", borderRadius: 10,
                fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800,
                letterSpacing: "0.08em", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                marginTop: 10
              }}
            >
              <span>CONTINUE TO REVIEW YOUR ALERT</span>
              <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
          </form>
        </div>
      )}

      {/* ── STEP 2: ALERT PREVIEW (PRD §25) ── */}
      {step === 2 && (
        <div style={{
          background: "rgba(14,14,14,0.96)",
          border: "1px solid rgba(255,107,53,0.3)",
          borderRadius: 16,
          padding: "28px 32px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.7)"
        }}>
          <div style={{ textAlign: "center", marginBottom: 24, borderBottom: "1px solid rgba(38,38,38,0.8)", paddingBottom: 16 }}>
            <span style={{
              fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              padding: "4px 10px", borderRadius: 6,
              background: "rgba(255,107,53,0.15)", color: "#FF6B35", border: "1px solid rgba(255,107,53,0.3)"
            }}>
              CONFIRMATION STAGE
            </span>
            <h2 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: "white", marginTop: 8, marginBottom: 4 }}>
              REVIEW YOUR ALERT
            </h2>
            <p style={{ fontSize: 11, color: "#888888", fontFamily: "'Inter', sans-serif", margin: 0 }}>
              Please verify your report details. Upon submission, your alert will enter <strong>PENDING REVIEW</strong> status.
            </p>
          </div>

          {formError && (
            <div style={{
              padding: "12px 16px", borderRadius: 8, marginBottom: 20,
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.35)",
              color: "#ef4444", fontSize: 12, fontFamily: "'JetBrains Mono', monospace"
            }}>
              {formError}
            </div>
          )}

          {/* Key Value Summary Table */}
          <div style={{
            background: "rgba(8,8,8,0.8)", border: "1px solid rgba(38,38,38,0.8)",
            borderRadius: 12, padding: "20px", marginBottom: 24,
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14,
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12
          }}>
            <div>
              <span style={{ color: "#666666", fontSize: 10, display: "block" }}>PERSON REPORTING:</span>
              <strong style={{ color: "#ffffff" }}>{reporterName}</strong>
            </div>

            <div>
              <span style={{ color: "#666666", fontSize: 10, display: "block" }}>EVENT TYPE:</span>
              <strong style={{ color: "#FF6B35" }}>{eventType === "Other" ? otherEventType : eventType}</strong>
            </div>

            <div>
              <span style={{ color: "#666666", fontSize: 10, display: "block" }}>INCIDENT PLACE:</span>
              <strong style={{ color: "#ffffff" }}>{placeName}</strong>
            </div>

            <div>
              <span style={{ color: "#666666", fontSize: 10, display: "block" }}>NEARBY LANDMARK:</span>
              <strong style={{ color: "#ffffff" }}>{nearbyLandmark}</strong>
            </div>

            <div>
              <span style={{ color: "#666666", fontSize: 10, display: "block" }}>DISTRICT / STATE:</span>
              <strong style={{ color: "#ffffff" }}>{district}, {state} (PIN: {pinCode})</strong>
            </div>

            <div>
              <span style={{ color: "#666666", fontSize: 10, display: "block" }}>REPORTED THREAT LEVEL:</span>
              <span style={{
                color: reportedThreatLevel === "CRITICAL" ? "#ef4444" : reportedThreatLevel === "HIGH" ? "#FF6B35" : "#f59e0b",
                fontWeight: 800
              }}>
                {reportedThreatLevel}
              </span>
            </div>

            <div>
              <span style={{ color: "#666666", fontSize: 10, display: "block" }}>INCIDENT DATE & TIME:</span>
              <strong style={{ color: "#ffffff" }}>{incidentDate} · {incidentTime}</strong>
            </div>

            <div>
              <span style={{ color: "#666666", fontSize: 10, display: "block" }}>ATTACHED PHOTO:</span>
              <strong style={{ color: imagePreview ? "#10b981" : "#666666" }}>
                {imagePreview ? "1 Photo Attached" : "None"}
              </strong>
            </div>

            <div style={{ gridColumn: "1 / -1", borderTop: "1px solid rgba(38,38,38,0.7)", paddingTop: 12 }}>
              <span style={{ color: "#666666", fontSize: 10, display: "block", marginBottom: 4 }}>DESCRIPTION OF INCIDENT:</span>
              <p style={{ color: "#ededed", fontFamily: "'Inter', sans-serif", fontSize: 12, margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {description}
              </p>
            </div>
          </div>

          {/* Action Buttons: EDIT vs SUBMIT ALERT */}
          <div style={{ display: "flex", gap: 14 }}>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{
                flex: 1, padding: "13px 0", borderRadius: 10,
                background: "rgba(38,38,38,0.7)", border: "1px solid rgba(60,60,60,0.8)",
                color: "#e5e7eb", fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
              }}
            >
              <ArrowLeft style={{ width: 14, height: 14 }} />
              <span>EDIT DETAILS</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitFinalAlert}
              className="aeris-btn-primary"
              style={{
                flex: 2, padding: "13px 0", borderRadius: 10,
                fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 800, cursor: isSubmitting ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8
              }}
            >
              {isSubmitting ? (
                <span>SUBMITTING ALERT...</span>
              ) : (
                <>
                  <CheckCircle2 style={{ width: 16, height: 16 }} />
                  <span>SUBMIT ALERT</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: SUBMISSION SUCCESS (PRD §26) ── */}
      {step === 3 && submittedReport && (
        <div style={{
          background: "rgba(14,14,14,0.96)",
          border: "1px solid rgba(16,185,129,0.3)",
          borderRadius: 16,
          padding: "36px 32px",
          textAlign: "center",
          boxShadow: "0 24px 60px rgba(0,0,0,0.7)"
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", color: "#10b981"
          }}>
            <CheckCircle2 style={{ width: 32, height: 32 }} />
          </div>

          <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: "white", margin: "0 0 6px" }}>
            ✓ ALERT SUBMITTED
          </h2>

          <div style={{
            display: "inline-block",
            padding: "8px 18px", borderRadius: 8, margin: "14px 0",
            background: "rgba(8,8,8,0.9)", border: "1px solid rgba(255,107,53,0.35)",
            fontFamily: "'JetBrains Mono', monospace"
          }}>
            <span style={{ fontSize: 10, color: "#888888", display: "block" }}>REPORT ID:</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#FF6B35", letterSpacing: "0.1em" }}>
              {submittedReport.reportId}
            </span>
          </div>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 12px", borderRadius: 100, marginBottom: 20,
            background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)",
            fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#f59e0b", fontWeight: 700
          }}>
            <Clock style={{ width: 13, height: 13 }} />
            <span>STATUS: PENDING REVIEW</span>
          </div>

          <p style={{
            fontSize: 13, color: "#9ca3af", maxWidth: 520, margin: "0 auto 28px",
            lineHeight: 1.6, fontFamily: "'Inter', sans-serif"
          }}>
            Your report has been sent to the BEM administration team for review. 
            Once verified and approved, it will be published to the People of India dashboard and marked on the India observation map.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
            <Link
              to="/dashboard/my-alerts"
              style={{
                padding: "12px 22px", borderRadius: 10,
                background: "rgba(255,107,53,0.15)", border: "1px solid rgba(255,107,53,0.4)",
                color: "#FF6B35", fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700, textDecoration: "none"
              }}
            >
              TRACK IN "MY ALERTS"
            </Link>

            <Link
              to="/public-dashboard"
              style={{
                padding: "12px 22px", borderRadius: 10,
                background: "rgba(38,38,38,0.7)", border: "1px solid rgba(60,60,60,0.8)",
                color: "white", fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700, textDecoration: "none"
              }}
            >
              RETURN TO DASHBOARD
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};
