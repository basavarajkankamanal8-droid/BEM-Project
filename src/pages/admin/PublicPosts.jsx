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
  Sparkles,
  Plus,
  Globe,
  Radio,
  FileText,
  Filter
} from "lucide-react";

const CATEGORIES = [
  "Earth Monitoring",
  "Environment",
  "Water",
  "Land",
  "Atmosphere",
  "Public Alert",
  "Satellite Update",
  "Research Update"
];

export const PublicPosts = () => {
  const [publicPosts, setPublicPosts] = useState(() => dataStore.get("public_posts"));
  const [approvedAlerts, setApprovedAlerts] = useState(() => 
    dataStore.get("alerts").filter(a => a.status === "approved" || a.status === "published")
  );

  const [activeTab, setActiveTab] = useState("all"); // 'all' or 'create' or 'social'
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Form State for publishing direct public information (PRD §27)
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formCategory, setFormCategory] = useState("Earth Monitoring");
  const [formSource, setFormSource] = useState("ISRO / BEM Telemetry Unit");
  const [formImageUrl, setFormImageUrl] = useState("https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80");

  // Form State for staging an approved alert to social media (PRD §28)
  const [selectedAlertToStage, setSelectedAlertToStage] = useState(approvedAlerts[0] || null);
  const [customCaption, setCustomCaption] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleCreatePublicPost = (e) => {
    e.preventDefault();
    if (!formTitle || !formDescription || !formLocation) return;

    const newPost = {
      postId: "PUB-" + Math.floor(1000 + Math.random() * 9000),
      title: formTitle,
      headline: formTitle,
      description: formDescription,
      location: formLocation,
      category: formCategory,
      source: formSource,
      imageUrl: formImageUrl,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      status: "PUBLISHED",
      channel: "PUBLIC_PORTAL",
      approvedBy: "Elena Rostova (Administrator)",
      postedAt: new Date().toISOString()
    };

    dataStore.add("public_posts", newPost);
    setPublicPosts(dataStore.get("public_posts"));
    setSuccessMsg(`Information published successfully to People of India under category: ${formCategory}`);
    setFormTitle("");
    setFormDescription("");
    setFormLocation("");
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  const handlePublishInstagram = (e) => {
    e.preventDefault();
    if (!selectedAlertToStage) return;

    const newPost = InstagramService.stagePublicPost({
      alert: selectedAlertToStage,
      approvedBy: "Elena Rostova (Administrator)",
      customCaption: customCaption || undefined
    });

    setPublicPosts(dataStore.get("public_posts"));
    setApprovedAlerts(dataStore.get("alerts").filter(a => a.status === "approved" || a.status === "published"));
    setSelectedAlertToStage(null);
    setCustomCaption("");
    setSuccessMsg(`Public alert broadcasted to official channels (Container ID: ${newPost.metaGraphApiStatus?.containerId || "BEM-IG-094"})`);
    setTimeout(() => setSuccessMsg(""), 6000);
  };

  const filteredPosts = publicPosts.filter(p => {
    if (selectedCategory === "ALL") return true;
    return p.category === selectedCategory || (selectedCategory === "Public Alert" && p.alertId);
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-5 rounded-xl border border-[#262626]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white flex items-center gap-2 font-display">
              <Share2 className="w-5 h-5 text-[#FF6B35]" />
              PUBLIC INFORMATION & SOCIAL BROADCAST CENTER
            </h1>
            <DataBadge isSimulation={true} />
          </div>
          <p className="text-xs text-[#a3a3a3] mt-1">
            Admin-controlled publishing: Review, approve, and broadcast Earth observations to the People of India and official social media (PRD §27 & §28).
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#10b981]">
          <ShieldCheck className="w-4 h-4" />
          <span>ADMIN REVIEW & APPROVAL REQUIRED</span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-[#10b981]/10 border border-[#10b981]/40 text-[#10b981] text-xs font-mono flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#262626] pb-3">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
            activeTab === "all" ? "bg-[#FF6B35] text-[#0f0f0f]" : "text-[#888888] hover:text-white"
          }`}
        >
          ALL PUBLISHED INFORMATION ({publicPosts.length})
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "create" ? "bg-[#FF6B35] text-[#0f0f0f]" : "text-[#888888] hover:text-white"
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          PUBLISH NEW INFORMATION
        </button>
        <button
          onClick={() => setActiveTab("social")}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "social" ? "bg-[#FF6B35] text-[#0f0f0f]" : "text-[#888888] hover:text-white"
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          SOCIAL MEDIA STAGING
        </button>
      </div>

      {/* ── TAB 1: ALL PUBLISHED INFORMATION (PRD §27 Categories) ── */}
      {activeTab === "all" && (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-[#141414] p-3 rounded-xl border border-[#262626]">
            <Filter className="w-3.5 h-3.5 text-[#FF6B35] mr-1" />
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                selectedCategory === "ALL" ? "bg-[#FF6B35] text-[#0f0f0f]" : "bg-[#0f0f0f] text-[#888888]"
              }`}
            >
              ALL
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                  selectedCategory === cat ? "bg-[#FF6B35] text-[#0f0f0f]" : "bg-[#0f0f0f] text-[#888888] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPosts.map(post => (
              <div
                key={post.postId}
                className="p-5 rounded-xl bg-[#141414] border border-[#262626] hover:border-[#FF6B35]/40 transition-all space-y-3 font-mono"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF6B35]/15 text-[#FF6B35] border border-[#FF6B35]/30">
                      {post.category || "Earth Monitoring"}
                    </span>
                    <span className="text-[10px] text-[#666666] ml-2">ID: {post.postId}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10b981]/15 text-[#10b981]">
                    ● {post.status || "PUBLISHED"}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white font-sans">
                  {post.title || post.headline}
                </h3>

                <p className="text-xs text-[#a3a3a3] font-sans leading-relaxed">
                  {post.description || post.caption}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-[#737373] border-t border-[#262626] pt-2">
                  <div>Location: <span className="text-[#ededed]">{post.location}</span></div>
                  <div>Source: <span className="text-[#ededed]">{post.source || "BEM System"}</span></div>
                  <div>Approved by: <span className="text-[#ededed]">{post.approvedBy}</span></div>
                  <div>Date: <span className="text-[#ededed]">{post.date || new Date(post.postedAt).toLocaleDateString("en-IN")}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: PUBLISH NEW APPROVED INFORMATION (PRD §27) ── */}
      {activeTab === "create" && (
        <div className="max-w-2xl bg-[#141414] p-6 rounded-xl border border-[#262626] space-y-4">
          <h2 className="text-sm font-bold text-white font-display flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#FF6B35]" />
            PUBLISH VERIFIED INFORMATION TO PUBLIC PORTAL
          </h2>
          <p className="text-xs text-[#888888] font-mono">
            Fields required by PRD §27: Title, Description, Location, Date, Image, Source, Category, Status.
          </p>

          <form onSubmit={handleCreatePublicPost} className="space-y-4 font-mono text-xs">
            <div>
              <label className="text-[#888888] block mb-1">TITLE *</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                placeholder="e.g. Kaveri Basin Seasonal Water Volume Baseline Report"
                className="w-full bg-[#0f0f0f] border border-[#262626] rounded-lg p-2.5 text-white outline-none focus:border-[#FF6B35]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#888888] block mb-1">CATEGORY *</label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                  className="w-full bg-[#0f0f0f] border border-[#262626] rounded-lg p-2.5 text-white outline-none focus:border-[#FF6B35]"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#888888] block mb-1">LOCATION *</label>
                <input
                  type="text"
                  required
                  value={formLocation}
                  onChange={e => setFormLocation(e.target.value)}
                  placeholder="e.g. Karnataka / Tamil Nadu Border"
                  className="w-full bg-[#0f0f0f] border border-[#262626] rounded-lg p-2.5 text-white outline-none focus:border-[#FF6B35]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#888888] block mb-1">DATA SOURCE *</label>
                <input
                  type="text"
                  required
                  value={formSource}
                  onChange={e => setFormSource(e.target.value)}
                  placeholder="e.g. ISRO EOS-04 SAR Ground Gateway"
                  className="w-full bg-[#0f0f0f] border border-[#262626] rounded-lg p-2.5 text-white outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div>
                <label className="text-[#888888] block mb-1">IMAGE URL</label>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={e => setFormImageUrl(e.target.value)}
                  className="w-full bg-[#0f0f0f] border border-[#262626] rounded-lg p-2.5 text-white outline-none focus:border-[#FF6B35]"
                />
              </div>
            </div>

            <div>
              <label className="text-[#888888] block mb-1">DESCRIPTION *</label>
              <textarea
                rows={4}
                required
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                placeholder="Comprehensive human-verified summary explaining the Earth observation findings..."
                className="w-full bg-[#0f0f0f] border border-[#262626] rounded-lg p-2.5 text-white outline-none focus:border-[#FF6B35] font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#ff8c5a] text-[#0f0f0f] font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#FF6B35]/20"
            >
              <Send className="w-4 h-4" />
              <span>PUBLISH TO PEOPLE OF INDIA</span>
            </button>
          </form>
        </div>
      )}

      {/* ── TAB 3: SOCIAL MEDIA WORKFLOW (PRD §28) ── */}
      {activeTab === "social" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Staging Form */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#FF6B35]" />
                STAGE APPROVED ALERT FOR OFFICIAL SOCIAL CHANNELS
              </h2>
              <DataBadge isSimulation={true} size="xs" />
            </div>

            <form onSubmit={handlePublishInstagram} className="p-5 rounded-xl bg-[#141414] border border-[#262626] space-y-4 text-xs font-mono">
              <div>
                <label className="text-[#888888] block mb-1">Select Human-Verified Alert</label>
                {approvedAlerts.length > 0 ? (
                  <select
                    value={selectedAlertToStage?.alertId || ""}
                    onChange={(e) => setSelectedAlertToStage(approvedAlerts.find(a => a.alertId === e.target.value))}
                    className="w-full bg-[#0f0f0f] border border-[#262626] rounded p-2 text-white"
                  >
                    {approvedAlerts.map(a => (
                      <option key={a.alertId} value={a.alertId}>
                        {a.alertId} — {a.type} ({a.location})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 bg-[#0f0f0f] border border-[#262626] rounded text-[#888888]">
                    No verified alerts currently waiting for publication. Verify an alert in Alert System first.
                  </div>
                )}
              </div>

              <div>
                <label className="text-[#888888] block mb-1">Official Caption (Auto-Generated Compliance Standard)</label>
                <textarea
                  rows={5}
                  value={customCaption}
                  onChange={(e) => setCustomCaption(e.target.value)}
                  placeholder="Leave blank to use the standardized BEM official advisory format with verified provenance stamps..."
                  className="w-full bg-[#0f0f0f] border border-[#262626] rounded p-2 text-white font-mono text-[11px]"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#0f0f0f] border border-[#262626] text-[11px] text-[#888888] space-y-1">
                <div className="text-white font-bold">Social Media Workflow Directive (PRD §28):</div>
                <p>Observation → Analysis → Review → Admin Approval → Public Post → Social Media Content</p>
                <p className="text-[#FF6B35]">Unverified information is never automatically published.</p>
              </div>

              <button
                type="submit"
                disabled={!selectedAlertToStage}
                className={`w-full py-2.5 px-4 rounded-lg font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                  selectedAlertToStage
                    ? "bg-gradient-to-r from-[#FF6B35] to-[#ff8c5a] text-[#0f0f0f] shadow-lg shadow-[#FF6B35]/20 cursor-pointer"
                    : "bg-[#262626] text-[#666666] cursor-not-allowed"
                }`}
              >
                <Send className="w-4 h-4" />
                <span>BROADCAST OFFICIAL VERIFIED POST</span>
              </button>
            </form>
          </div>

          {/* Social Post Preview */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF6B35]" />
              OFFICIAL SOCIAL MEDIA PREVIEW
            </h2>

            <div className="max-w-md mx-auto rounded-xl border border-[#262626] bg-[#0f0f0f] overflow-hidden shadow-2xl font-sans text-xs">
              <div className="p-3 flex items-center justify-between border-b border-[#262626] bg-[#141414]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FF6B35] to-amber-500 p-0.5">
                    <div className="w-full h-full bg-[#0f0f0f] rounded-full flex items-center justify-center font-bold text-[10px] text-white">
                      BEM
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-1">
                      <span>bharat_earth_monitor</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B35] inline" />
                    </div>
                    <div className="text-[10px] text-[#888888]">Bharat Earth Monitor Official</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#FF6B35]">VERIFIED</span>
              </div>

              <div className="relative h-52 bg-[#141414]">
                <img
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"
                  alt="Environmental alert imagery"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <DataBadge isSimulation={true} size="xs" />
                </div>
              </div>

              <div className="p-4 space-y-2">
                <p className="text-[#ededed] text-[11px] whitespace-pre-line font-mono leading-relaxed">
                  {publicPosts[0]?.caption || "Official BEM Verified Alert post preview will display here..."}
                </p>
                <div className="text-[10px] text-[#666666] font-mono pt-1">
                  OFFICIAL PUBLIC BROADCAST SERVICE
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
