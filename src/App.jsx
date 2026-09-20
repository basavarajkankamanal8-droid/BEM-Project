import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TelemetryProvider } from "./context/TelemetryContext";

// Layout components
import { Navbar } from "./components/layout/Navbar";
import { Sidebar } from "./components/layout/Sidebar";
import { IntroAnimation } from "./components/layout/IntroAnimation";

// Admin & Operations Pages
import { Dashboard } from "./pages/admin/Dashboard";
import { GnssReceiver } from "./pages/admin/GnssReceiver";
import { SatelliteData } from "./pages/admin/SatelliteData";
import { EarthMonitoring } from "./pages/admin/EarthMonitoring";
import { ImageManagement } from "./pages/admin/ImageManagement";
import { ChangeDetection } from "./pages/admin/ChangeDetection";
import { AlertSystem } from "./pages/admin/AlertSystem";
import { SecurityCenter } from "./pages/admin/SecurityCenter";
import { Reports } from "./pages/admin/Reports";
import { PublicPosts } from "./pages/admin/PublicPosts";
import { Users } from "./pages/admin/Users";
import { AuditLogs } from "./pages/admin/AuditLogs";
import { Settings } from "./pages/admin/Settings";

// Auth & Public Pages
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { PublicHome } from "./pages/public/PublicHome";
import { PublicDashboard } from "./pages/public/PublicDashboard";
import { UserProfile } from "./pages/public/UserProfile";

// Loading spinner for auth state
const AuthLoadingScreen = () => (
  <div style={{
    minHeight: "100vh", background: "#0f0f0f",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexDirection: "column", gap: 16
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: 14,
      background: "linear-gradient(135deg, #FF6B35 0%, #ff8c5a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 8px 32px rgba(255,107,53,0.4)",
      animation: "pulse 1.5s infinite"
    }}>
      <span style={{ fontSize: 24 }}>🛰</span>
    </div>
    <span style={{
      fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
      color: "#FF6B35", letterSpacing: "0.12em", fontWeight: 700
    }}>
      INITIALIZING BEM...
    </span>
  </div>
);

// Protected Layout Route wrapper with mobile sidebar
const ProtectedLayout = ({ children, requireAdmin = false }) => {
  const { currentUser, isAdmin, authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (authLoading) {
    return <AuthLoadingScreen />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/public-dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#ededed] flex flex-col selection:bg-[#FF6B35]/30 selection:text-[#FF6B35]">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            style={{
              position: "fixed", inset: 0, zIndex: 30,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)"
            }}
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
          style={{ top: 0 }}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
        <main className="flex-1 overflow-y-auto bg-[#0f0f0f] pb-12">
          {children}
        </main>
      </div>
    </div>
  );
};

function MainAppContent() {
  const { authLoading } = useAuth();
  const [showIntro, setShowIntro] = useState(() => {
    const visited = sessionStorage.getItem("bem_intro_seen");
    return !visited;
  });

  const handleIntroComplete = () => {
    sessionStorage.setItem("bem_intro_seen", "true");
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}

      <Routes>
        {/* Public Website */}
        <Route path="/public" element={<PublicHome />} />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public Logged-in User Dashboard & Profile */}
        <Route
          path="/public-dashboard"
          element={
            <ProtectedLayout>
              <PublicDashboard />
            </ProtectedLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedLayout>
              <UserProfile />
            </ProtectedLayout>
          }
        />

        {/* Admin Dashboard — Admin Only */}
        <Route
          path="/"
          element={
            <ProtectedLayout requireAdmin={true}>
              <Dashboard />
            </ProtectedLayout>
          }
        />

        {/* Admin-only operational routes */}
        <Route
          path="/gnss"
          element={
            <ProtectedLayout requireAdmin={true}>
              <GnssReceiver />
            </ProtectedLayout>
          }
        />

        <Route
          path="/satellites"
          element={
            <ProtectedLayout requireAdmin={true}>
              <SatelliteData />
            </ProtectedLayout>
          }
        />

        <Route
          path="/earth-monitoring"
          element={
            <ProtectedLayout requireAdmin={true}>
              <EarthMonitoring />
            </ProtectedLayout>
          }
        />

        <Route
          path="/images"
          element={
            <ProtectedLayout requireAdmin={true}>
              <ImageManagement />
            </ProtectedLayout>
          }
        />

        <Route
          path="/change-detection"
          element={
            <ProtectedLayout requireAdmin={true}>
              <ChangeDetection />
            </ProtectedLayout>
          }
        />

        <Route
          path="/alerts"
          element={
            <ProtectedLayout requireAdmin={true}>
              <AlertSystem />
            </ProtectedLayout>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedLayout requireAdmin={true}>
              <Reports />
            </ProtectedLayout>
          }
        />

        <Route
          path="/security"
          element={
            <ProtectedLayout requireAdmin={true}>
              <SecurityCenter />
            </ProtectedLayout>
          }
        />

        <Route
          path="/public-posts"
          element={
            <ProtectedLayout requireAdmin={true}>
              <PublicPosts />
            </ProtectedLayout>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedLayout requireAdmin={true}>
              <Users />
            </ProtectedLayout>
          }
        />

        <Route
          path="/audit-logs"
          element={
            <ProtectedLayout requireAdmin={true}>
              <AuditLogs />
            </ProtectedLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedLayout requireAdmin={true}>
              <Settings />
            </ProtectedLayout>
          }
        />

        {/* Fallback — unauthenticated goes to public landing */}
        <Route path="*" element={<Navigate to="/public" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TelemetryProvider>
        <MainAppContent />
      </TelemetryProvider>
    </AuthProvider>
  );
}
