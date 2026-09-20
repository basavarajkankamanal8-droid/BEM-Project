import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { DataBadge } from "../layout/DataBadge";

export const ImageCompareSlider = ({
  beforeImage,
  afterImage,
  beforeLabel = "T0: BASELINE OBSERVATION",
  afterLabel = "T1: CURRENT SATELLITE PASS",
  title = "Assam River Basin SAR InSAR Analysis",
  metricChange = "+27% Water Surface Area",
  height = "380px"
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [_isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleTouchMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  return (
    <div className="rounded-xl border border-[#262626] bg-[#141414] p-4 space-y-3">
      {/* Top Header info */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 font-display">
            <span>{title}</span>
            <DataBadge isSimulation={true} size="xs" />
          </h3>
          <p className="text-xs text-[#FF6B35] font-mono mt-0.5 font-medium">
            AI Change Metric: <span className="font-bold">{metricChange}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#888888]">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF6B35]" />
          <span>Drag slider to compare spectral deltas</span>
        </div>
      </div>

      {/* Interactive Compare Slider Frame */}
      <div 
        className="relative overflow-hidden rounded-lg select-none cursor-ew-resize border border-[#262626]"
        style={{ height }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* After Image (Background full) */}
        <img
          src={afterImage}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 z-10 bg-[#0f0f0f]/90 border border-[#ef4444]/40 text-[#ef4444] text-[11px] font-mono px-2 py-1 rounded">
          {afterLabel}
        </div>

        {/* Before Image (Clipped overlay) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: "100%", minWidth: "600px" }} // prevents squishing
          />
          <div className="absolute top-3 left-3 z-10 bg-[#0f0f0f]/90 border border-[#FF6B35]/40 text-[#FF6B35] text-[11px] font-mono px-2 py-1 rounded">
            {beforeLabel}
          </div>
        </div>

        {/* Vertical divider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[#FF6B35] shadow-[0_0_12px_#FF6B35] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#FF6B35] text-[#0f0f0f] flex items-center justify-center font-bold text-xs shadow-lg border-2 border-white">
            ↔
          </div>
        </div>
      </div>

      {/* Footer explanation */}
      <div className="flex justify-between items-center text-[11px] font-mono text-[#888888] pt-1">
        <span>Dual-Pass Polarimetric Coherence Analysis</span>
        <span className="text-[#FF6B35] font-semibold">Position: {Math.round(sliderPosition)}%</span>
      </div>
    </div>
  );
};
