import React, { useState } from "react";
import { dataStore } from "../../services/dataStore";
import { 
  ShieldAlert, 
  FileWarning, 
  CheckCircle2, 
  AlertOctagon, 
  Terminal
} from "lucide-react";

export const SecurityCenter = () => {
  const [securityEvents, setSecurityEvents] = useState(() => dataStore.get("security_events"));
  const [auditLogs] = useState(() => dataStore.get("audit_logs"));

  const handleResolve = (eventId) => {
    dataStore.update("security_events", e => e.eventId === eventId, { status: "RESOLVED" });
    setSecurityEvents(dataStore.get("security_events"));
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-5 rounded-xl border border-[#262626]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white flex items-center gap-2 font-display">
              <ShieldAlert className="w-5 h-5 text-[#ef4444]" />
              DATA SECURITY & THREAT MONITORING CENTER
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30">
              SUPER ADMIN CONSOLE
            </span>
          </div>
          <p className="text-xs text-[#a3a3a3] mt-1">
            Real-time detection, cryptographic signature quarantine, authentication tracking, and zero-jamming compliance (PRD §13 & §18).
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#10b981]">
          <CheckCircle2 className="w-4 h-4" />
          <span>FIREWALL & AUDIT LOGGING ACTIVE</span>
        </div>
      </div>

      {/* Critical Security Rules Alert (PRD §13) */}
      <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#ef4444]/40 text-xs text-[#d4d4d4] space-y-1 font-mono">
        <div className="flex items-center gap-2 text-[#ef4444] font-bold">
          <AlertOctagon className="w-4 h-4" />
          <span>COMPLIANCE DIRECTIVE: ZERO RF JAMMING & RECEPTOR SAFETY</span>
        </div>
        <p className="text-[#a3a3a3] text-[11px]">
          Under PRD §13 rules, the system does not jam or interfere with radio frequencies. Suspicious or spoofed packets are strictly: 
          <span className="text-[#ef4444] font-bold"> DETECTED → ISOLATED → QUARANTINED → LOGGED → REVIEWED</span>.
        </p>
      </div>

      {/* Threat Summary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl bg-[#141414] border border-[#262626]">
          <span className="text-[#888888] block text-[10px]">TOTAL SECURITY EVENTS</span>
          <span className="text-2xl font-bold text-white mt-1 block">{securityEvents.length}</span>
          <span className="text-[#ef4444] text-[11px]">All packets quarantined</span>
        </div>
        <div className="p-4 rounded-xl bg-[#141414] border border-[#262626]">
          <span className="text-[#888888] block text-[10px]">AUTH RATE LIMITS TRIGGERED</span>
          <span className="text-2xl font-bold text-[#FF6B35] mt-1 block">1 ACTIVE</span>
          <span className="text-[#888888] text-[11px]">Credential brute-force protection</span>
        </div>
        <div className="p-4 rounded-xl bg-[#141414] border border-[#262626]">
          <span className="text-[#888888] block text-[10px]">HMAC SIGNATURE VALIDATION</span>
          <span className="text-2xl font-bold text-[#10b981] mt-1 block">100% ENFORCED</span>
          <span className="text-[#888888] text-[11px]">Non-repudiation audit active</span>
        </div>
      </div>

      {/* Quarantined Threat Events Table (PRD §13) */}
      <div className="p-5 rounded-xl bg-[#141414] border border-[#262626] space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-white font-display flex items-center gap-2">
            <FileWarning className="w-4 h-4 text-[#ef4444]" />
            QUARANTINED INCIDENTS & THREAT LOGS
          </h3>
          <span className="text-xs font-mono text-[#888888]">PRD §13 ISOLATION LOG</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead className="bg-[#0f0f0f] text-[#888888] border-b border-[#262626]">
              <tr>
                <th className="p-3">EVENT ID</th>
                <th className="p-3">SOURCE</th>
                <th className="p-3">INCIDENT EVENT</th>
                <th className="p-3">ACTION TAKEN</th>
                <th className="p-3">STATUS</th>
                <th className="p-3">TIMESTAMP</th>
                <th className="p-3">CONTROL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {securityEvents.map((ev) => (
                <tr key={ev.eventId} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-3 text-[#ef4444] font-bold">{ev.eventId}</td>
                  <td className="p-3 text-[#d4d4d4]">{ev.source}</td>
                  <td className="p-3 text-white font-semibold">{ev.event}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30">
                      {ev.action}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ev.status === "RESOLVED"
                        ? "bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30"
                        : "bg-[#FF6B35]/20 text-[#FF6B35] border border-[#FF6B35]/30"
                    }`}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="p-3 text-[#888888]">{new Date(ev.timestamp).toLocaleTimeString()}</td>
                  <td className="p-3">
                    {ev.status !== "RESOLVED" ? (
                      <button
                        onClick={() => handleResolve(ev.eventId)}
                        className="px-2.5 py-1 rounded bg-[#262626] hover:bg-[#333333] text-[#ededed] hover:text-[#FF6B35] text-[11px] cursor-pointer transition-colors"
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <span className="text-[#10b981] text-[11px]">Closed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Audit Trail */}
      <div className="p-5 rounded-xl bg-[#141414] border border-[#262626] space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-white font-display flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#FF6B35]" />
            SYSTEM AUDIT LOG TRAIL (PRD §18)
          </h3>
          <span className="text-xs font-mono text-[#888888]">{auditLogs.length} AUDIT RECORDS</span>
        </div>

        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-lg bg-[#0f0f0f] border border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#888888]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className="text-[#FF6B35] font-bold">{log.actor}</span>
                <span className="text-white">→ {log.action}</span>
                <span className="text-[#888888]">[{log.target}]</span>
              </div>
              <span className="text-[10px] text-[#737373]">SRC: {log.ipAddress}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
