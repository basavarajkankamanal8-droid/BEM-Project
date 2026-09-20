import React from "react";
import { ShieldCheck, Cpu } from "lucide-react";

/**
 * Mandatory PRD §3 & §25 Data Provenance Badge:
 * Every observation must visually state:
 * [SIMULATION DATA]
 * or
 * [REAL DATA — SOURCE: <SOURCE>]
 */
export const DataBadge = ({ isSimulation = true, source = "SYNTHETIC GNSS ENGINE", size = "sm" }) => {
  if (isSimulation) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider rounded-md font-semibold border ${
          size === "xs"
            ? "px-1.5 py-0.5 text-[10px]"
            : size === "lg"
            ? "px-3 py-1 text-xs"
            : "px-2 py-0.5 text-[11px]"
        } bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/30`}
        title="PRD Compliance: This observation is simulated or testbed generated."
      >
        <Cpu className="w-3 h-3 text-[#FF6B35] animate-pulse" />
        SIMULATION DATA
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider rounded-md font-semibold border ${
        size === "xs"
          ? "px-1.5 py-0.5 text-[10px]"
          : size === "lg"
          ? "px-3 py-1 text-xs"
          : "px-2 py-0.5 text-[11px]"
      } bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30`}
      title={`Authenticated Real Telemetry: ${source}`}
    >
      <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
      REAL DATA — SOURCE: {source}
    </span>
  );
};
