import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext();

const toastIcons = {
  success: { Icon: CheckCircle2, color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.25)" },
  error: { Icon: AlertCircle, color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)" },
  warning: { Icon: AlertTriangle, color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)" },
  info: { Icon: Info, color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.25)" },
};

const ToastItem = ({ toast, onDismiss }) => {
  const [progress, setProgress] = useState(100);
  const [exiting, setExiting] = useState(false);
  const config = toastIcons[toast.type] || toastIcons.info;
  const { Icon } = config;

  useEffect(() => {
    if (!toast.duration) return;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / toast.duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        handleDismiss();
      }
    }, 50);
    return () => clearInterval(interval);
  }, [toast.duration]);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: "14px 16px", borderRadius: 12, minWidth: 320, maxWidth: 420,
      background: "rgba(14,14,14,0.95)", backdropFilter: "blur(20px)",
      border: `1px solid ${config.border}`,
      boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)",
      transform: exiting ? "translateX(110%)" : "translateX(0)",
      opacity: exiting ? 0 : 1,
      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      position: "relative", overflow: "hidden",
      animation: "slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    }}>
      {/* Icon */}
      <div style={{
        width: 28, height: 28, borderRadius: 7, flexShrink: 0,
        background: config.bg, border: `1px solid ${config.border}`,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <Icon style={{ width: 14, height: 14, color: config.color }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && (
          <div style={{
            fontSize: 12, fontWeight: 700, color: "#ffffff",
            marginBottom: 2, fontFamily: "'Inter', sans-serif"
          }}>
            {toast.title}
          </div>
        )}
        <div style={{
          fontSize: 11, color: "#a3a3a3", lineHeight: 1.5,
          fontFamily: "'Inter', sans-serif"
        }}>
          {toast.message}
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={handleDismiss}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#555555", padding: 2, flexShrink: 0,
          transition: "color 0.2s"
        }}
        onMouseEnter={e => e.currentTarget.style.color = "#FF6B35"}
        onMouseLeave={e => e.currentTarget.style.color = "#555555"}
      >
        <X style={{ width: 14, height: 14 }} />
      </button>

      {/* Progress bar */}
      {toast.duration && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
          background: "rgba(38,38,38,0.3)"
        }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: config.color, transition: "width 0.1s linear",
            borderRadius: "0 2px 2px 0"
          }} />
        </div>
      )}
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = "info", title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (message, title) => addToast({ type: "success", title, message }),
    error: (message, title) => addToast({ type: "error", title, message }),
    warning: (message, title) => addToast({ type: "warning", title, message }),
    info: (message, title) => addToast({ type: "info", title, message }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container */}
      <div style={{
        position: "fixed", top: 80, right: 20, zIndex: 9999,
        display: "flex", flexDirection: "column", gap: 10,
        pointerEvents: "none"
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: "auto" }}>
            <ToastItem toast={t} onDismiss={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
