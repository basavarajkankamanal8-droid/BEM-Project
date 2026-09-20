import React, { useState } from "react";
import { dataStore } from "../../services/dataStore";
import { DataBadge } from "../../components/layout/DataBadge";
import { InstagramService } from "../../services/instagramService";
import { 
  Share2, 
  Camera, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Send,
  Sparkles
} from "lucide-react";

export const PublicPosts = () => {
  const [publicPosts, setPublicPosts] = useState(() => dataStore.get("public_posts"));
  const [approvedAlerts, setApprovedAlerts] = useState(() => 
    dataStore.get("alerts").filter(a => a.status === "approved")
  );

  const [selectedAlertToStage, setSelectedAlertToStage] = useState(approvedAlerts[0] || null);
  const [customCaption, setCustomCaption] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handlePublishInstagram = (e) => {
    e.preventDefault();
    if (!selectedAlertToStage) return;

    const newPost = InstagramService.stagePublicPost({
      alert: selectedAlertToStage,
      approvedBy: "Commander Elena Rostova",
      customCaption: customCaption || undefined
    });

    setPublicPosts(dataStore.get("public_posts"));
    setApprovedAlerts(dataStore.get("alerts").filter(a => a.status === "approved"));
    setSelectedAlertToStage(null);
    setCustomCaption("");
    setSuccessMsg(`Public alert broadcasted to Instagram container ID: ${newPost.metaGraphApiStatus.containerId}`);
    setTimeout(() => setSuccessMsg(""), 6000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
              <Share2 className="w-5 h-5 text-pink-400" />
              OFFICIAL SOCIAL BROADCASTS & INSTAGRAM INTEGRATION
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
              PRD §15 COMPLIANT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Meta Graph API staging workflow: Satellite Data → Analysis → Alert → Human Verification → Admin Approval → Public Post.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>ZERO AUTOMATED UNVERIFIED POSTING</span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Meta API Staging Composer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Compose / Approve Post */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
              <Camera className="w-4 h-4 text-pink-400" />
              STAGE APPROVED ALERT FOR INSTAGRAM
            </h2>
            <DataBadge isSimulation={true} size="xs" />
          </div>

          <form onSubmit={handlePublishInstagram} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">Select Human-Verified Alert</label>
              {approvedAlerts.length > 0 ? (
                <select
                  value={selectedAlertToStage?.alertId || ""}
                  onChange={(e) => setSelectedAlertToStage(approvedAlerts.find(a => a.alertId === e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                >
                  {approvedAlerts.map(a => (
                    <option key={a.alertId} value={a.alertId}>
                      {a.alertId} — {a.type} ({a.location})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded text-slate-400">
                  No verified alerts currently waiting for publication. Verify an alert in Alert System first.
                </div>
              )}
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Official Caption (Auto-Generated Compliance Standard)</label>
              <textarea
                rows={6}
                value={customCaption}
                onChange={(e) => setCustomCaption(e.target.value)}
                placeholder="Leave blank to use the standardized BEM official advisory format with verified provenance stamps..."
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono text-[11px]"
              />
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="text-slate-200 font-bold">API Security Safeguard (PRD §23 & §28):</div>
              <p>Meta Access Tokens are managed strictly on secure backend endpoints. Zero long-lived client tokens exposed.</p>
            </div>

            <button
              type="submit"
              disabled={!selectedAlertToStage}
              className={`w-full py-2.5 px-4 rounded-lg font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                selectedAlertToStage
                  ? "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-lg shadow-orange-600/20 cursor-pointer"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Official Verified Post</span>
            </button>
          </form>
        </div>

        {/* Right: Live Instagram Post Mockup Preview */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF6B35]" />
            LIVE PUBLIC FEED SIMULATION
          </h2>

          <div className="max-w-md mx-auto rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl font-sans text-xs">
            {/* Insta Header */}
            <div className="p-3 flex items-center justify-between border-b border-slate-800 bg-slate-900/60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FF6B35] to-amber-500 p-0.5">
                  <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-bold text-[10px] text-white">
                    BEM
                  </div>
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-1">
                    <span>bem_earth_monitoring</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B35] inline" />
                  </div>
                  <div className="text-[10px] text-slate-400">Bharat Earth Monitor</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#FF6B35]">VERIFIED</span>
            </div>

            {/* Media Image */}
            <div className="relative h-56 bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"
                alt="Environmental alert imagery"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <DataBadge isSimulation={true} size="xs" />
              </div>
            </div>

            {/* Caption & Metadata */}
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-3 text-white">
                <span className="font-bold">❤️ 2,410</span>
                <span className="font-bold">💬 182</span>
                <span className="font-bold">↗️ 640 shares</span>
              </div>
              <p className="text-slate-300 text-[11px] whitespace-pre-line font-mono leading-relaxed">
                {publicPosts[0]?.caption || "Official BEM Verified Alert post preview will display here..."}
              </p>
              <div className="text-[10px] text-slate-400 font-mono pt-1">
                PUBLISHED VIA OFFICIAL META GRAPH API v19.0
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Published History */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-white font-mono">
          PUBLIC BROADCAST LOG (AUDIT CERTIFIED)
        </h3>

        <div className="space-y-3">
          {publicPosts.map(post => (
            <div
              key={post.postId}
              className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">{post.postId}</span>
                  <span className="text-white font-semibold">{post.headline}</span>
                  <span className="px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 text-[10px]">
                    {post.channel}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Approved by: <span className="text-slate-200">{post.approvedBy}</span> | Posted at: {new Date(post.postedAt).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DataBadge isSimulation={true} size="xs" />
                <a
                  href={post.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 flex items-center gap-1 transition-colors"
                >
                  <span>Inspect Post</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
