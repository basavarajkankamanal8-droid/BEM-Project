import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TelemetryProvider } from "./context/TelemetryContext";

// Layout components
import { Navbar } from "./components/layout/Navbar";
import { Sidebar } from "./components/layout/Sidebar";
import { IntroAnimation } from "./components/layout/IntroAnimation";
import { ChatAssistant } from "./components/ui/ChatAssistant";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";

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
import { ReportAlert } from "./pages/public/ReportAlert";
import { MyAlerts } from "./pages/public/MyAlerts";
import { VerifiedAlerts } from "./pages/public/VerifiedAlerts";

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

// Protected Layout Route wrapper with mobile sidebar & error boundary (PRD §69)
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
    return <Navigate to="/dashboard" replace />;
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
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

// Smart Root Route: Unauthenticated -> /login; Admin -> Dashboard; Public -> PublicDashboard
// PRD §6: Login is the first page after IntroAnimation for all unauthenticated users.
const RootRoute = () => {
  const { currentUser, isAdmin, authLoading } = useAuth();
  if (authLoading) return <AuthLoadingScreen />;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (isAdmin) {
    return (
      <ProtectedLayout requireAdmin={true}>
        <Dashboard />
      </ProtectedLayout>
    );
  }
  return (
    <ProtectedLayout>
      <PublicDashboard />
    </ProtectedLayout>
  );
};

function MainAppContent() {
  const [showIntro, setShowIntro] = useState(() => {
    const visited = sessionStorage.getItem("bem_intro_seen");
    return !visited;
  });

  const handleIntroComplete = () => {
    sessionStorage.setItem("bem_intro_seen", "true");
    setShowIntro(false);
  };

  // While the intro animation is playing, render nothing beneath it.
  // This prevents premature route rendering before auth state has loaded,
  // which previously caused the PublicDashboard crash (PRD §4, §69).
  if (showIntro) {
    return (
      <ErrorBoundary>
        <IntroAnimation onComplete={handleIntroComplete} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>

      <Routes>
        {/* Smart Root & Public Landing Pages (PRD §6, §7 & §67) */}
        <Route path="/" element={<RootRoute />} />
        <Route path="/home" element={<PublicHome />} />
        <Route path="/public" element={<PublicHome />} />
        <Route path="/about" element={<PublicHome />} />
        <Route path="/monitoring" element={<PublicHome />} />
        <Route path="/network" element={<PublicHome />} />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ─── PEOPLE OF INDIA ROUTES (PRD §10 & §67) ─── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedLayout>
              <PublicDashboard />
            </ProtectedLayout>
          }
        />
        <Route
          path="/public-dashboard"
          element={
            <ProtectedLayout>
              <PublicDashboard />
            </ProtectedLayout>
          }
        />
        <Route
          path="/dashboard/monitoring"
          element={
            <ProtectedLayout>
              <EarthMonitoring />
            </ProtectedLayout>
          }
        />
        <Route
          path="/dashboard/report-alert"
          element={
            <ProtectedLayout>
              <ReportAlert />
            </ProtectedLayout>
          }
        />
        <Route
          path="/dashboard/my-alerts"
          element={
            <ProtectedLayout>
              <MyAlerts />
            </ProtectedLayout>
          }
        />
        <Route
          path="/dashboard/verified-alerts"
          element={
            <ProtectedLayout>
              <VerifiedAlerts />
            </ProtectedLayout>
          }
        />
        <Route
          path="/dashboard/images"
          element={
            <ProtectedLayout>
              <ImageManagement />
            </ProtectedLayout>
          }
        />
        <Route
          path="/dashboard/reports"
          element={
            <ProtectedLayout>
              <Reports />
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
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedLayout>
              <UserProfile />
            </ProtectedLayout>
          }
        />

        {/* ─── ADMIN ROUTES & PRD §67 ALIASES ─── */}
        <Route
          path="/admin"
          element={
            <ProtectedLayout requireAdmin={true}>
              <Dashboard />
            </ProtectedLayout>
          }
        />
        <Route
          path="/admin/gnss"
          element={
            <ProtectedLayout requireAdmin={true}>
              <GnssReceiver />
            </ProtectedLayout>
          }
        />
        <Route
          path="/gnss"
          element={
            <ProtectedLayout requireAdmin={true}>
              <GnssReceiver />
            </ProtectedLayout>
          }
        />

        <Route
          path="/admin/network"
          element={
            <ProtectedLayout requireAdmin={true}>
              <SatelliteData />
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
          path="/admin/monitoring"
          element={
            <ProtectedLayout requireAdmin={true}>
              <EarthMonitoring />
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
          path="/admin/images"
          element={
            <ProtectedLayout requireAdmin={true}>
              <ImageManagement />
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
          path="/admin/change-detection"
          element={
            <ProtectedLayout requireAdmin={true}>
              <ChangeDetection />
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
          path="/admin/alerts"
          element={
            <ProtectedLayout requireAdmin={true}>
              <AlertSystem />
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
          path="/admin/reports"
          element={
            <ProtectedLayout requireAdmin={true}>
              <Reports />
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
          path="/admin/security"
          element={
            <ProtectedLayout requireAdmin={true}>
              <SecurityCenter />
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
          path="/admin/public-information"
          element={
            <ProtectedLayout requireAdmin={true}>
              <PublicPosts />
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
          path="/admin/users"
          element={
            <ProtectedLayout requireAdmin={true}>
              <Users />
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
          path="/admin/audit-logs"
          element={
            <ProtectedLayout requireAdmin={true}>
              <AuditLogs />
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
          path="/admin/settings"
          element={
            <ProtectedLayout requireAdmin={true}>
              <Settings />
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

        {/* Fallback — redirects to smart root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global BEM AI Chat Assistant (PRD §49-§55) */}
      <ChatAssistant />
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TelemetryProvider>
          <MainAppContent />
        </TelemetryProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

