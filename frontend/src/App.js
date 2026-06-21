import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import MatchDetails from "./pages/MatchDetails"; 
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Corrected paths pointing directly to your pages directory
import TournamentFeed from "./pages/Feed"; 
import UpcomingEvents from "./pages/UpcomingEvents"; 

import SelectInterests from "./pages/SelectInterests"; 
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Community from "./components/Community";
import HowItWorks from "./components/HowItWorks";
import ResendVerification from "./pages/ResendVerification";
import VerifyEmail from "./pages/VerifyEmail";
import AdminUserFeedPreviewPage from "./pages/AdminUserFeedPreview";

// --- GLOBAL PROTECTION GUARD COMPONENT ---
function ProtectedRoute({ children, requireAdmin = false }) {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem("token"),
    isVerified: localStorage.getItem("isVerified"),
    role: localStorage.getItem("userRole")
  });

  useEffect(() => {
    const handleAuthSync = () => {
      setAuthState({
        token: localStorage.getItem("token"),
        isVerified: localStorage.getItem("isVerified"),
        role: localStorage.getItem("userRole")
      });
    };

    // Listen to the auth updates dispatched by Login.js and VerifyEmail.js
    window.addEventListener("authChange", handleAuthSync);
    return () => window.removeEventListener("authChange", handleAuthSync);
  }, []);

  // 1. If the user isn't authenticated at all, send them back to login portal cleanly
  if (!authState.token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Robust validation evaluation check for verification statuses.
  if (authState.isVerified === "false" || authState.isVerified === false) {
    return <Navigate to="/login" replace />;
  }

  // 3. Admin authorization rule validation guard check
  if (requireAdmin && String(authState.role).toLowerCase() !== "admin") {
    console.warn(`[SECURITY] Unauthorized bypass attempt to admin dashboard blocked for role: ${authState.role}`);
    return <Navigate to="/feed" replace />;
  }

  return children;
}

// --- DYNAMIC FOOTER WRAPPER COMPONENT ---
function FooterWrapper() {
  const location = useLocation();

  // Keep admin clean by suppressing standard footer layouts on administrative pages
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return <Footer />;
}

function App() {
  return (
    <Router>
      {/* 🚀 THE FIX: Mount your single unified, dynamic role-recalculating navbar directly */}
      <Navbar /> 
      
      <div className="min-h-screen"> 
        <Routes>
          {/* Public / Guest Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password/:userId" element={<ResetPassword />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/community" element={<Community />} />
          <Route path="/howitworks" element={<HowItWorks />} />

          {/* 🔐 SECURED USER ROUTES (Wrapped with Centralized Security Guards) */}
          <Route path="/feed" element={
            <ProtectedRoute><TournamentFeed /></ProtectedRoute>
          } /> 
          <Route path="/select-interests" element={
            <ProtectedRoute><SelectInterests /></ProtectedRoute>
          } />
          <Route path="/match/:id" element={
            <ProtectedRoute><MatchDetails /></ProtectedRoute>
          } />
          <Route path="/tournament/:id" element={
            <ProtectedRoute><MatchDetails /></ProtectedRoute>
          } />
          <Route path="/upcoming-events" element={
            <ProtectedRoute><UpcomingEvents /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/tournaments" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          
          {/* 🔐 SECURED ADMIN ROUTES */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/feed-preview" element={
            <ProtectedRoute requireAdmin={true}><AdminUserFeedPreviewPage /></ProtectedRoute>
          } />

          {/* 🛠️ FALLBACK WILD-CARD PORTAL CATCH-ALL REDIRECT */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <FooterWrapper /> 
    </Router>
  );
}

export default App;