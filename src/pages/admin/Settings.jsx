import React, { useState } from "react";
import { dataStore } from "../../services/dataStore";
import { 
  Settings as SettingsIcon, 
  Users, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  Radio
} from "lucide-react";

export const Settings = () => {
  const [settings, setSettings] = useState(() => dataStore.get("system_settings"));
  const [users] = useState(() => dataStore.get("users"));
  const [dataSources] = useState(() => dataStore.get("data_sources"));
  const [savedNote, setSavedNote] = useState("");

  const handleToggle = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    dataStore.save("system_settings", updated);
    setSavedNote("Configuration saved successfully.");
    setTimeout(() => setSavedNote(""), 3000);
  };

  const handleResetData = () => {
    if (confirm("Reset local reactive store back to initial seed data?")) {
      dataStore.resetToDefault();
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
              <SettingsIcon className="w-5 h-5 text-cyan-400" />
              SYSTEM CONFIGURATION & SECURITY POLICIES
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              SUPER ADMIN LEVEL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Data ingestion pipelines, operational policies, user credentials, and external gateways.
          </p>
        </div>

        {savedNote && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>{savedNote}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Security & Pipeline Policies (PRD §13 & §18) */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 font-mono text-xs">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            OPERATIONAL SECURITY DIRECTIVES
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div>
                <span className="text-white font-bold block">Quarantine on Signature Failure</span>
                <span className="text-slate-400 text-[11px]">Strict PRD §8/§13 policy for unverified packets</span>
              </div>
              <input
                type="checkbox"
                checked={settings.quarantineOnSignatureFailure}
                onChange={() => handleToggle("quarantineOnSignatureFailure")}
                className="rounded text-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div>
                <span className="text-white font-bold block">Require MFA / 2FA for Alert Approvals</span>
                <span className="text-slate-400 text-[11px]">Enforce dual authentication for public advisory releases</span>
              </div>
              <input
                type="checkbox"
                checked={settings.requireTwoFactorForAlertApproval}
                onChange={() => handleToggle("requireTwoFactorForAlertApproval")}
                className="rounded text-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div>
                <span className="text-white font-bold block">Automated Instagram Publishing</span>
                <span className="text-rose-400 text-[11px]">LOCKED FALSE (PRD §15 prohibits auto-publishing unverified alerts)</span>
              </div>
              <input
                type="checkbox"
                disabled
                checked={false}
                className="rounded text-slate-600 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Data Sources / Integrations */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 font-mono text-xs">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            DATA SOURCE CONNECTORS
          </h2>

          <div className="space-y-3">
            {dataSources.map((ds) => (
              <div key={ds.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">{ds.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    ds.status === "ACTIVE" 
                      ? "bg-emerald-500/20 text-emerald-300" 
                      : "bg-amber-500/20 text-amber-300"
                  }`}>
                    {ds.status}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Protocol: {ds.protocol}</span>
                  <span>Type: {ds.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* User Management List */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 font-mono text-xs">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" />
          AUTHORIZED TERMINAL OPERATORS (ROLE-BASED ACCESS)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">UID</th>
                <th className="p-3">NAME</th>
                <th className="p-3">EMAIL</th>
                <th className="p-3">ROLE</th>
                <th className="p-3">MFA STATUS</th>
                <th className="p-3">LAST LOGIN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((u) => (
                <tr key={u.uid} className="hover:bg-slate-800/30">
                  <td className="p-3 text-cyan-400 font-bold">{u.uid}</td>
                  <td className="p-3 text-white font-semibold">{u.name}</td>
                  <td className="p-3 text-slate-300">{u.email}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                      {u.role.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold ${u.mfaEnabled ? "text-emerald-400" : "text-slate-400"}`}>
                      {u.mfaEnabled ? "✓ HARDWARE TOKEN" : "DISABLED"}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{new Date(u.lastLogin).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reset Reactive Storage Button */}
      <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
        <div>
          <span className="text-rose-400 font-bold block">Reset Local Reactive Store</span>
          <span className="text-slate-400 text-[11px]">
            Restores all 12 collections, mock feeds, and threat events back to fresh initial seed state.
          </span>
        </div>
        <button
          onClick={handleResetData}
          className="px-3 py-2 rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-600/40 flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Testbed Database</span>
        </button>
      </div>

    </div>
  );
};
