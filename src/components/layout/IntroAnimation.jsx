import React, { useState, useEffect } from "react";
import { Globe2 } from "lucide-react";

export const IntroAnimation = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [skipped, setSkipped] = useState(false);

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReducedMotion || skipped) {
      onComplete();
      return;
    }

    // Timeline sequence per PRD §4:
    // 0ms:    Step 0 - Hidden (setup)
    // 100ms:  Step 1 - Logo appears center with pop/scale animation + orange glow
    // 1100ms: Step 2 - Logo moves left
    // 1700ms: Step 3 - Brand text fades & slides in alongside logo
    // 3600ms: Step 4 - Entire composition fades out
    const t0 = setTimeout(() => setStep(1), 100);
    const t1 = setTimeout(() => setStep(2), 1100);
    const t2 = setTimeout(() => setStep(3), 1700);
    const t3 = setTimeout(() => {
      setStep(4);
      setTimeout(onComplete, 600);
    }, 3600);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete, prefersReducedMotion, skipped]);

  const handleSkip = () => {
    setSkipped(true);
    onComplete();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0f0f0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity: step === 4 ? 0 : 1,
        transition: "opacity 0.6s ease-out",
      }}
    >
      {/* Subtle grid pattern background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,107,53,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,53,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      {/* Radial orange glow — follows logo position */}
      <div
        style={{
          position: "absolute",
          width: step >= 1 ? 600 : 0,
          height: step >= 1 ? 600 : 0,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,107,53,0.2) 0%, rgba(255,107,53,0.05) 40%, transparent 70%)",
          transform: step >= 2 ? "translateX(-100px)" : "translateX(0)",
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: "none",
          opacity: step >= 1 ? 1 : 0,
        }}
      />

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        style={{
          position: "absolute",
          top: 24,
          right: 28,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,107,53,0.2)",
          borderRadius: 8,
          padding: "6px 14px",
          color: "#888888",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.08em",
          cursor: "pointer",
          transition: "all 0.2s",
          zIndex: 100,
          opacity: step >= 1 ? 1 : 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#FF6B35";
          e.currentTarget.style.borderColor = "#FF6B35";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#888888";
          e.currentTarget.style.borderColor = "rgba(255,107,53,0.2)";
        }}
      >
        SKIP INTRO ▶
      </button>

      {/* Main Composition Box */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          // Step 2: shift entire composition left to make room for text
          transform: step >= 2 ? "translateX(-20px)" : "translateX(0)",
          transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Logo Icon */}
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 20,
            background: "linear-gradient(135deg, #FF6B35 0%, #ff8c5a 50%, #cc5528 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            // Step 0: invisible, Step 1: pop in with scale, Step 2+: glow intensifies
            opacity: step >= 1 ? 1 : 0,
            transform: step === 0
              ? "scale(0.3)"
              : step === 1
              ? "scale(1.08)"
              : "scale(1)",
            boxShadow: step >= 1
              ? `0 0 ${step >= 2 ? 60 : 40}px rgba(255,107,53,${step >= 2 ? 0.6 : 0.4}), inset 0 1px 0 rgba(255,255,255,0.3)`
              : "none",
            transition: step === 1
              ? "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"  // bouncy pop
              : "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",     // smooth settle
          }}
        >
          <Globe2
            style={{
              width: 42,
              height: 42,
              color: "#0f0f0f",
              strokeWidth: 2.5,
            }}
            className="animate-spin-slow"
          />
        </div>

        {/* Brand Text — Fades & Slides In at Step 3 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            opacity: step >= 3 ? 1 : 0,
            transform: step >= 3 ? "translateX(0)" : "translateX(-30px)",
            transition: "opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
            pointerEvents: "none",
          }}
        >
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(24px, 4vw, 38px)",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "0.12em",
              margin: 0,
              lineHeight: 1.1,
              whiteSpace: "nowrap",
            }}
          >
            BHARAT EARTH MONITOR
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 8,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#FF6B35",
                boxShadow: "0 0 8px #FF6B35",
              }}
              className="animate-pulse"
            />
            <span
              style={{
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                color: "#FF6B35",
                fontWeight: 700,
                letterSpacing: "0.12em",
              }}
            >
              MONITOR BHARAT. DETECT CHANGE. INFORM PEOPLE.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
