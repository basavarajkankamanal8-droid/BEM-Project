import React, { useState } from "react";
import { dataStore } from "../../services/dataStore";
import { DataBadge } from "../../components/layout/DataBadge";
import { ImageCompareSlider } from "../../components/imagery/ImageCompareSlider";
import { 
  Layers, ArrowRight, AlertTriangle, CheckCircle2, 
  Eye, TrendingUp, Droplets, Mountain, Trees, Wind
} from "lucide-react";

const changeCategories = [
  { id: "water", label: "Water Area Change", icon: Droplets, color: "#60a5fa", description: "River width, lake area, reservoir levels" },
  { id: "land", label: "Land Use Change", icon: Mountain, color: "#f59e0b", description: "Urban expansion, deforestation, mining" },
  { id: "vegetation", label: "Vegetation Change", icon: Trees, color: "#34d399", description: "NDVI analysis, crop health, forest cover" },
  { id: "terrain", label: "Terrain Change", icon: Mountain, color: "#a78bfa", description: "Elevation shifts, erosion, landslide scars" },
  { id: "environment", label: "Environmental Change", icon: Wind, color: "#FF6B35", description: "Air quality shifts, thermal anomalies" },
];

const simulatedDetections = [
  {
    id: "CD-2026-001",
    category: "water",
    region: "Brahmaputra Basin, Assam",
    detectedAt: "2026-09-18T14:32:00Z",
    confidence: 87.4,
    severity: "HIGH",
    status: "POSSIBLE_CHANGE",
    description: "Significant increase in water surface area detected in post-monsoon satellite pass. Estimated 23% expansion from baseline.",
    beforeLabel: "Pre-Monsoon Baseline (March 2026)",
    afterLabel: "Post-Monsoon Pass (Sep 2026)",
    reviewedBy: null,
  },
  {
    id: "CD-2026-002",
    category: "vegetation",
    region: "Western Ghats, Kerala",
    detectedAt: "2026-09-17T09:15:00Z",
    confidence: 72.1,
    severity: "MODERATE",
    status: "UNDER_REVIEW",
    description: "NDVI reduction detected in forest canopy coverage. Possible deforestation or seasonal change. Human review required.",
    beforeLabel: "Q1 2026 Baseline",
    afterLabel: "Latest Observation",
    reviewedBy: "Dr. Marcus Vance",
  },
  {
    id: "CD-2026-003",
    category: "land",
    region: "NCR Delhi-Noida Corridor",
    detectedAt: "2026-09-15T11:00:00Z",
    confidence: 94.2,
    severity: "LOW",
    status: "VERIFIED",
    description: "Urban expansion detected in satellite imagery. New construction activity confirmed in Greater Noida sector.",
    beforeLabel: "Jan 2026",
    afterLabel: "Sep 2026",
    reviewedBy: "Commander Elena Rostova",
  },
  {
    id: "CD-2026-004",
    category: "terrain",
    region: "Uttarakhand Himalayas, Chamoli",
    detectedAt: "2026-09-14T16:45:00Z",
    confidence: 68.3,
    severity: "HIGH",
    status: "POSSIBLE_CHANGE",
    description: "Terrain displacement signatures detected in InSAR analysis. Possible glacial movement or early landslide indicator.",
    beforeLabel: "Pre-Monsoon 2026",
    afterLabel: "Current Pass",
    reviewedBy: null,
  },
];

const statusStyles = {
  POSSIBLE_CHANGE: { bg: "rgba(255,107,53,0.12)", border: "rgba(255,107,53,0.3)", color: "#FF6B35", label: "POSSIBLE CHANGE DETECTED" },
  UNDER_REVIEW: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", color: "#f59e0b", label: "UNDER REVIEW" },
  VERIFIED: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", color: "#10b981", label: "VERIFIED" },
  REJECTED: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", color: "#ef4444", label: "REJECTED" },
};

const severityColors = {
  HIGH: "#ef4444",
  MODERATE: "#f59e0b",
  LOW: "#10b981",
};

export const ChangeDetection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [detections, setDetections] = useState(simulatedDetections);

  const filtered = selectedCategory === "all"
    ? detections
    : detections.filter(d => d.category === selectedCategory);

  const handleStatusUpdate = (id, newStatus, reviewer) => {
    setDetections(prev => prev.map(d =>
      d.id === id ? { ...d, status: newStatus, reviewedBy: reviewer } : d
    ));
    dataStore.add("audit_logs", {
      id: "aud_" + Date.now(),
      actor: reviewer || "System",
      action: `CHANGE_DETECTION_${newStatus}`,
      target: id,
      timestamp: new Date().toISOString(),
      ipAddress: "10.0.4.1"
    });
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
            <Layers style={{ width: 22, height: 22, color: "#FF6B35" }} />
            CHANGE DETECTION
          </h1>
          <p style={{ fontSize: 12, color: "#888888", margin: 0 }}>
            Compare Earth-observation data to identify possible changes. All detections require human review.
          </p>
        </div>
        <DataBadge isSimulation={true} />
      </div>

      {/* Category Filter */}
      <div style={{
        display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24,
        padding: 4, background: "rgba(14,14,14,0.8)", borderRadius: 12,
        border: "1px solid rgba(38,38,38,0.6)"
      }}>
        <button
          onClick={() => setSelectedCategory("all")}
          style={{
            padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
            fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            letterSpacing: "0.06em", transition: "all 0.2s",
            background: selectedCategory === "all" ? "#FF6B35" : "transparent",
            color: selectedCategory === "all" ? "#0f0f0f" : "#888888",
          }}
        >
          ALL CHANGES
        </button>
        {changeCategories.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
                letterSpacing: "0.04em", transition: "all 0.2s",
                background: selectedCategory === cat.id ? `${cat.color}20` : "transparent",
                color: selectedCategory === cat.id ? cat.color : "#666666",
                display: "flex", alignItems: "center", gap: 6
              }}
            >
              <Icon style={{ width: 12, height: 12 }} />
              {cat.label.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "TOTAL DETECTIONS", value: detections.length, color: "#FF6B35" },
          { label: "PENDING REVIEW", value: detections.filter(d => d.status === "POSSIBLE_CHANGE").length, color: "#f59e0b" },
          { label: "UNDER REVIEW", value: detections.filter(d => d.status === "UNDER_REVIEW").length, color: "#60a5fa" },
          { label: "VERIFIED", value: detections.filter(d => d.status === "VERIFIED").length, color: "#10b981" },
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

      {/* Detection Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filtered.map(detection => {
          const catInfo = changeCategories.find(c => c.id === detection.category);
          const statusInfo = statusStyles[detection.status] || statusStyles.POSSIBLE_CHANGE;
          const CatIcon = catInfo?.icon || Layers;

          return (
            <div key={detection.id} style={{
              background: "rgba(14,14,14,0.9)",
              border: `1px solid ${statusInfo.border}`,
              borderRadius: 16, overflow: "hidden",
              transition: "border-color 0.2s"
            }}>
              {/* Top status bar */}
              <div style={{
                height: 2,
                background: `linear-gradient(90deg, transparent, ${statusInfo.color}, transparent)`,
              }} />

              <div style={{ padding: "20px 24px" }}>
                {/* Header row */}
                <div style={{
                  display: "flex", flexWrap: "wrap", alignItems: "center",
                  justifyContent: "space-between", gap: 12, marginBottom: 16
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: `${catInfo?.color || "#FF6B35"}15`,
                      border: `1px solid ${catInfo?.color || "#FF6B35"}30`,
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <CatIcon style={{ width: 18, height: 18, color: catInfo?.color || "#FF6B35" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "white" }}>{detection.region}</div>
                      <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#666666" }}>
                        {detection.id} · {new Date(detection.detectedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {/* Severity Badge */}
                    <span style={{
                      padding: "3px 8px", borderRadius: 4, fontSize: 9,
                      fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                      background: `${severityColors[detection.severity]}15`,
                      color: severityColors[detection.severity],
                      border: `1px solid ${severityColors[detection.severity]}30`,
                      letterSpacing: "0.06em"
                    }}>
                      {detection.severity}
                    </span>

                    {/* Status Badge */}
                    <span style={{
                      padding: "3px 10px", borderRadius: 4, fontSize: 9,
                      fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                      background: statusInfo.bg, color: statusInfo.color,
                      border: `1px solid ${statusInfo.border}`,
                      letterSpacing: "0.06em"
                    }}>
                      {statusInfo.label}
                    </span>

                    <DataBadge isSimulation={true} size="xs" />
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: 12, color: "#a3a3a3", margin: "0 0 16px", lineHeight: 1.7 }}>
                  {detection.description}
                </p>

                {/* Confidence & Reviewer */}
                <div style={{
                  display: "flex", flexWrap: "wrap", gap: 20, paddingTop: 14,
                  borderTop: "1px solid rgba(38,38,38,0.5)",
                  fontSize: 10, fontFamily: "'JetBrains Mono', monospace"
                }}>
                  <div>
                    <span style={{ color: "#555555" }}>CONFIDENCE: </span>
                    <span style={{ color: detection.confidence > 80 ? "#10b981" : "#f59e0b", fontWeight: 700 }}>
                      {detection.confidence}%
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#555555" }}>REVIEWER: </span>
                    <span style={{ color: detection.reviewedBy ? "#FF6B35" : "#666666", fontWeight: 600 }}>
                      {detection.reviewedBy || "Awaiting Assignment"}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#555555" }}>CATEGORY: </span>
                    <span style={{ color: catInfo?.color || "#888888", fontWeight: 600 }}>
                      {catInfo?.label || "Unknown"}
                    </span>
                  </div>
                </div>

                {/* Action buttons for admin */}
                {detection.status === "POSSIBLE_CHANGE" && (
                  <div style={{
                    display: "flex", gap: 8, marginTop: 16, paddingTop: 14,
                    borderTop: "1px solid rgba(38,38,38,0.4)"
                  }}>
                    <button
                      onClick={() => handleStatusUpdate(detection.id, "UNDER_REVIEW", "Commander Elena Rostova")}
                      style={{
                        padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                        background: "rgba(245,158,11,0.12)", color: "#f59e0b",
                        fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                        letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6
                      }}
                    >
                      <Eye style={{ width: 12, height: 12 }} /> BEGIN REVIEW
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(detection.id, "REJECTED", "Commander Elena Rostova")}
                      style={{
                        padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                        background: "rgba(239,68,68,0.08)", color: "#ef4444",
                        fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                        letterSpacing: "0.06em"
                      }}
                    >
                      REJECT
                    </button>
                  </div>
                )}
                {detection.status === "UNDER_REVIEW" && (
                  <div style={{
                    display: "flex", gap: 8, marginTop: 16, paddingTop: 14,
                    borderTop: "1px solid rgba(38,38,38,0.4)"
                  }}>
                    <button
                      onClick={() => handleStatusUpdate(detection.id, "VERIFIED", detection.reviewedBy)}
                      style={{
                        padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                        background: "rgba(16,185,129,0.12)", color: "#10b981",
                        fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                        letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6
                      }}
                    >
                      <CheckCircle2 style={{ width: 12, height: 12 }} /> VERIFY CHANGE
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(detection.id, "REJECTED", detection.reviewedBy)}
                      style={{
                        padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                        background: "rgba(239,68,68,0.08)", color: "#ef4444",
                        fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                        letterSpacing: "0.06em"
                      }}
                    >
                      REJECT
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
