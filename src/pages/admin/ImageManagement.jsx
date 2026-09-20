import React, { useState } from "react";
import { dataStore } from "../../services/dataStore";
import { DataBadge } from "../../components/layout/DataBadge";
import { ImageCompareSlider } from "../../components/imagery/ImageCompareSlider";
import { 
  Image as ImageIcon, 
  UploadCloud, 
  SlidersHorizontal, 
  Eye, 
  EyeOff
} from "lucide-react";

export const ImageManagement = () => {
  const [images, setImages] = useState(() => dataStore.get("images"));
  const [selectedImage, setSelectedImage] = useState(() => images[0]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New Image Form state (PRD §10)
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("WATER_CHANGE");
  const [formLat, setFormLat] = useState("25.3176");
  const [formLon, setFormLon] = useState("82.9739");
  const [formIsPublic, setFormIsPublic] = useState(true);

  const handleUpload = (e) => {
    e.preventDefault();
    const newRecord = {
      id: "img_" + Date.now(),
      obsId: "OBS-" + Math.floor(100000 + Math.random() * 900000),
      title: formTitle || "Orbital Multi-Spectral Ingest",
      beforeUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      afterUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      source: "SIMULATED SATELLITE",
      category: formCategory,
      latitude: parseFloat(formLat),
      longitude: parseFloat(formLon),
      timestamp: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      isPublic: formIsPublic,
      status: "APPROVED",
      reviewer: "Elena Rostova"
    };

    dataStore.add("images", newRecord);
    setImages(dataStore.get("images"));
    setSelectedImage(newRecord);
    setShowUploadModal(false);
    setFormTitle("");
  };

  const togglePublic = (id) => {
    dataStore.update("images", img => img.id === id, {
      isPublic: !images.find(img => img.id === id)?.isPublic
    });
    setImages(dataStore.get("images"));
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-5 rounded-xl border border-[#262626]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white flex items-center gap-2 font-display">
              <ImageIcon className="w-5 h-5 text-[#FF6B35]" />
              SATELLITE IMAGE MANAGEMENT
            </h1>
            <DataBadge isSimulation={true} />
          </div>
          <p className="text-xs text-[#a3a3a3] mt-1">
            Multispectral imagery catalog, metadata verification, and dual-pass comparison (PRD §10).
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-3.5 py-2 rounded-lg bg-[#FF6B35] hover:bg-[#ff8152] text-[#0f0f0f] font-mono text-xs font-bold flex items-center gap-2 transition-colors shadow-lg shadow-[#FF6B35]/20 cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Satellite Observation</span>
        </button>
      </div>

      {/* Main Dual-Pass Inspection View */}
      {selectedImage && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white font-display flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#FF6B35]" />
              BEFORE / AFTER COMPARISON ANALYZER
            </h2>
            <span className="text-xs font-mono text-[#FF6B35]">{selectedImage.obsId}</span>
          </div>

          <ImageCompareSlider
            beforeImage={selectedImage.beforeUrl}
            afterImage={selectedImage.afterUrl}
            title={selectedImage.title}
            beforeLabel="BASELINE ARCHIVE (T0)"
            afterLabel="LATEST SATELLITE PASS (T1)"
            metricChange={`Category: ${selectedImage.category.replace(/_/g, " ")}`}
            height="420px"
          />
        </div>
      )}

      {/* Catalog Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white font-display">
            OBSERVATION ARCHIVE & METADATA (PRD §10)
          </h2>
          <span className="text-xs font-mono text-[#888888]">{images.length} TOTAL IMAGES</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              onClick={() => setSelectedImage(img)}
              className={`rounded-xl border overflow-hidden transition-all cursor-pointer ${
                selectedImage?.id === img.id
                  ? "border-[#FF6B35] bg-[#1f1f1f] shadow-lg shadow-[#FF6B35]/15"
                  : "border-[#262626] bg-[#141414] hover:border-[#333333]"
              }`}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={img.afterUrl}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 left-2 z-10">
                  <DataBadge isSimulation={true} size="xs" />
                </div>
                <div className="absolute top-2 right-2 z-10">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0f0f0f]/90 text-[#FF6B35] border border-[#262626]">
                    {img.obsId}
                  </span>
                </div>
              </div>

              {/* Metadata Card Body (PRD §10 format) */}
              <div className="p-4 space-y-2 text-xs font-mono">
                <h4 className="font-bold text-white text-sm line-clamp-1">{img.title}</h4>

                <div className="space-y-1 text-slate-400 text-[11px]">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="text-slate-200">{img.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coordinates:</span>
                    <span className="text-slate-200">{img.latitude}°, {img.longitude}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Captured:</span>
                    <span className="text-slate-200">{img.timestamp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reviewer:</span>
                    <span className="text-cyan-300">{img.reviewer}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                    <span>Visibility:</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePublic(img.id);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 font-bold ${
                        img.isPublic 
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {img.isPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{img.isPublic ? "PUBLIC APPROVED" : "RESTRICTED (INTERNAL)"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Observation Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-cyan-400" />
                INGEST SATELLITE OBSERVATION
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Observation Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Coastal Mangrove Recession Pass"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="WATER_CHANGE">Water Change</option>
                    <option value="TERRAIN_CHANGE">Terrain Change</option>
                    <option value="LAND_CHANGE">Land Change</option>
                    <option value="ATMOSPHERE">Atmosphere</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Status</label>
                  <input
                    type="text"
                    disabled
                    value="UNDER REVIEW"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-amber-400"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Latitude</label>
                  <input
                    type="text"
                    value={formLat}
                    onChange={(e) => setFormLat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Longitude</label>
                  <input
                    type="text"
                    value={formLon}
                    onChange={(e) => setFormLon(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Allow Public View:</span>
                <input
                  type="checkbox"
                  checked={formIsPublic}
                  onChange={(e) => setFormIsPublic(e.target.checked)}
                  className="rounded text-cyan-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="w-1/2 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded bg-cyan-600 text-white font-bold hover:bg-cyan-500"
                >
                  Save Ingest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
