import React, { useState } from "react";
import { DataBadge } from "../../components/layout/DataBadge";
import { 
  FileText, 
  Printer, 
  ShieldCheck
} from "lucide-react";

export const Reports = () => {
  const [reports] = useState([
    {
      id: "REP-2026-0919",
      title: "Assam River Basin Flash Inundation Comprehensive Assessment",
      category: "WATER_HYDROLOGY",
      date: "19 September 2026",
      classification: "OFFICIAL_PUBLIC",
      author: "Dr. Marcus Vance (Hydrology Division)",
      summary: "Synthetic Aperture Radar (SAR) polarimetric coherence delta confirmed +27% flood plain expansion over 72 hours. Lowland evacuation zones flagged.",
      metrics: {
        inundationSqKm: "412 km²",
        populationAffectedEstimated: "38,000",
        radarConfidence: "99.4%"
      }
    },
    {
      id: "REP-2026-0918",
      title: "Himalayan Highway 58 Slope Deformation & Landslide Hazard",
      category: "TERRAIN_GEOMORPHOLOGY",
      date: "18 September 2026",
      classification: "PUBLIC_VERIFIED",
      author: "Commander Elena Rostova",
      summary: "InSAR interferometric fringe measurements indicate active 12mm ground displacement on the 41.8° slope gradient along Sector 2. Advisory issued.",
      metrics: {
        displacementMm: "12 mm",
        gradientDeg: "41.8°",
        hazardRating: "LEVEL 4 (HIGH)"
      }
    },
    {
      id: "REP-2026-0915",
      title: "Bi-Weekly Atmospheric Column & Aerosol Optical Depth Summary",
      category: "ATMOSPHERE_AIR",
      date: "15 September 2026",
      classification: "INTERNAL_ARCHIVE",
      author: "Environmental AI Synthesis Engine",
      summary: "Tropospheric NO2 and CO2 remain consistent with seasonal manufacturing corridors. Thermal anomalies detected in central industrial node (+4.2°C).",
      metrics: {
        meanCo2Ppm: "418.2 ppm",
        meanAqi: "112 (Moderate)",
        thermalDelta: "+4.2°C"
      }
    }
  ]);

  const [selectedReport, setSelectedReport] = useState(reports[0]);

  const panelStyle = {
    background: "rgba(14,14,14,0.9)",
    border: "1px solid rgba(38,38,38,0.8)",
    borderRadius: 12,
  };

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>

      {/* Header */}
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center",
        justifyContent: "space-between", gap: 16,
        background: "rgba(16,16,16,0.8)",
        border: "1px solid rgba(255,107,53,0.12)",
        borderRadius: 14, padding: "18px 24px",
        marginBottom: 24, backdropFilter: "blur(12px)"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <h1 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: "white", letterSpacing: "0.08em", margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
              <FileText style={{ width: 18, height: 18, color: "#FF6B35" }} />
              INTELLIGENCE & MISSION REPORTS
            </h1>
            <DataBadge isSimulation={true} />
          </div>
          <p style={{ fontSize: 12, color: "#666666", margin: 0 }}>
            Analyst-verified mission briefs, environmental change audits, and public risk assessments.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "8px 14px", borderRadius: 8, cursor: "pointer",
            fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
            background: "rgba(38,38,38,0.7)", color: "#a3a3a3",
            border: "1px solid rgba(60,60,60,0.8)"
          }}
        >
          <Printer style={{ width: 13, height: 13 }} />
          Print / Export PDF
        </button>
      </div>

      {/* Reports Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}>

        {/* Left List */}
        <div>
          <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#444444", letterSpacing: "0.12em", marginBottom: 10 }}>
            ARCHIVED DOSSIERS ({reports.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {reports.map((rep) => (
              <div
                key={rep.id}
                onClick={() => setSelectedReport(rep)}
                style={{
                  padding: "14px 16px", borderRadius: 10, cursor: "pointer",
                  background: selectedReport.id === rep.id ? "rgba(255,107,53,0.08)" : "rgba(14,14,14,0.8)",
                  border: `1px solid ${selectedReport.id === rep.id ? "rgba(255,107,53,0.35)" : "rgba(38,38,38,0.7)"}`,
                  boxShadow: selectedReport.id === rep.id ? "0 4px 20px rgba(255,107,53,0.1)" : "none",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#FF6B35" }}>{rep.id}</span>
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#555555" }}>{rep.date}</span>
                </div>
                <h4 style={{ fontSize: 11, fontWeight: 600, color: "white", margin: 0, lineHeight: 1.4 }}>{rep.title}</h4>
                <div style={{ marginTop: 8 }}>
                  <span style={{
                    fontSize: 9, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, letterSpacing: "0.06em",
                    padding: "2px 7px", borderRadius: 4,
                    background: "rgba(255,107,53,0.08)", color: "#888888", border: "1px solid rgba(38,38,38,0.8)"
                  }}>
                    {rep.category.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Report Viewer */}
        <div style={{ ...panelStyle, padding: "24px" }}>
          <div style={{ borderBottom: "1px solid rgba(38,38,38,0.6)", paddingBottom: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#FF6B35" }}>{selectedReport.id}</span>
              <DataBadge isSimulation={true} size="xs" />
            </div>
            <h2 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: "white", margin: "0 0 12px" }}>{selectedReport.title}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              {[
                { label: "AUTHOR", val: selectedReport.author, color: "#a3a3a3" },
                { label: "DATE", val: selectedReport.date, color: "#a3a3a3" },
                { label: "CLEARANCE", val: selectedReport.classification, color: "#10b981" },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#555555" }}>
                  {label}: <span style={{ color, fontWeight: 600 }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#444444", letterSpacing: "0.12em", marginBottom: 10 }}>
              EXECUTIVE INTELLIGENCE ABSTRACT:
            </div>
            <p style={{
              fontSize: 12, color: "#a3a3a3", lineHeight: 1.7, margin: 0,
              padding: "14px 16px", borderRadius: 8,
              background: "rgba(10,10,10,0.8)", border: "1px solid rgba(38,38,38,0.6)"
            }}>
              {selectedReport.summary}
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#444444", letterSpacing: "0.12em", marginBottom: 12 }}>
              EXTRACTED TELEMETRY EVIDENCE METRICS:
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {Object.entries(selectedReport.metrics).map(([key, val]) => (
                <div key={key} style={{
                  padding: "14px 16px", borderRadius: 10,
                  background: "rgba(10,10,10,0.8)", border: "1px solid rgba(38,38,38,0.7)"
                }}>
                  <span style={{ display: "block", fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#555555", letterSpacing: "0.1em", marginBottom: 6 }}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
                  <span style={{ display: "block", fontSize: 18, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: "#FF6B35" }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            borderTop: "1px solid rgba(38,38,38,0.6)", paddingTop: 14,
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#10b981", fontWeight: 700 }}>
              <ShieldCheck style={{ width: 13, height: 13 }} />
              CRYPTOGRAPHIC AUDIT PASSED (HMAC-SHA256)
            </div>
            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#6b7280" }}>BEM MISSION CONTROL</span>
          </div>
        </div>

      </div>
    </div>
  );
};
