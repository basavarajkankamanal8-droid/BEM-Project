import React from "react";
import { AlertTriangle, X } from "lucide-react";

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 540 }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9998,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(8px)"
        }}
      />

      {/* Modal Card */}
      <div style={{
        position: "relative", width: "100%", maxWidth,
        background: "rgba(14,14,14,0.98)",
        border: "1px solid rgba(255,107,53,0.15)",
        borderRadius: 16, overflow: "hidden",
        boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)",
        animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        {/* Top accent */}
        <div style={{
          height: 2,
          background: "linear-gradient(90deg, transparent, #FF6B35 30%, #ff8152 50%, #FF6B35 70%, transparent)",
        }} />

        {/* Header */}
        {title && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "18px 24px", borderBottom: "1px solid rgba(38,38,38,0.5)"
          }}>
            <h3 className="font-display" style={{
              fontSize: 15, fontWeight: 700, color: "white", margin: 0,
              letterSpacing: "0.06em"
            }}>
              {title}
            </h3>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, padding: 6, cursor: "pointer", color: "#888888",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#FF6B35"; e.currentTarget.style.borderColor = "rgba(255,107,53,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#888888"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              <X style={{ width: 14, height: 14 }} />
            </button>
          </div>
        )}

        {/* Body */}
        <div style={{ padding: "20px 24px" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export const ConfirmDialog = ({ 
  isOpen, onClose, onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?",
  confirmLabel = "CONFIRM",
  cancelLabel = "CANCEL",
  variant = "warning" // "warning" | "danger"
}) => {
  if (!isOpen) return null;

  const isDestructive = variant === "danger";
  const accentColor = isDestructive ? "#ef4444" : "#FF6B35";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9998,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(8px)"
        }}
      />

      {/* Dialog */}
      <div style={{
        position: "relative", width: "100%", maxWidth: 420,
        background: "rgba(14,14,14,0.98)",
        border: `1px solid ${accentColor}25`,
        borderRadius: 16, overflow: "hidden",
        boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
        animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <div style={{
          height: 2,
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }} />

        <div style={{ padding: "28px 24px", textAlign: "center" }}>
          {/* Icon */}
          <div style={{
            width: 52, height: 52, borderRadius: 14, margin: "0 auto 16px",
            background: `${accentColor}12`,
            border: `1px solid ${accentColor}25`,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <AlertTriangle style={{ width: 26, height: 26, color: accentColor }} />
          </div>

          <h3 className="font-display" style={{
            fontSize: 16, fontWeight: 700, color: "white", margin: "0 0 8px",
            letterSpacing: "0.06em"
          }}>
            {title}
          </h3>

          <p style={{
            fontSize: 12, color: "#a3a3a3", margin: "0 0 24px",
            lineHeight: 1.6, maxWidth: 320, marginLeft: "auto", marginRight: "auto"
          }}>
            {message}
          </p>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button
              onClick={onClose}
              style={{
                padding: "10px 24px", borderRadius: 10, cursor: "pointer",
                background: "rgba(38,38,38,0.5)", border: "1px solid rgba(60,60,60,0.6)",
                color: "#a3a3a3", fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700, letterSpacing: "0.08em", transition: "all 0.2s"
              }}
            >
              {cancelLabel}
            </button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              style={{
                padding: "10px 24px", borderRadius: 10, cursor: "pointer",
                background: isDestructive
                  ? "rgba(239,68,68,0.15)"
                  : "linear-gradient(135deg, #FF6B35 0%, #ff8c5a 100%)",
                border: isDestructive ? "1px solid rgba(239,68,68,0.3)" : "none",
                color: isDestructive ? "#ef4444" : "#0f0f0f",
                fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 800, letterSpacing: "0.08em", transition: "all 0.2s"
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
