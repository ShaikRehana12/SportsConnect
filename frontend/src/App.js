import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar"; // Added admin specific navigation header
import MatchDetails from "./pages/MatchDetails"; 
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Feed from "./pages/Feed"; 
import SelectInterests from "./pages/SelectInterests"; 
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Community from "./components/Community";
import HowItWorks from "./components/HowItWorks";
import ResendVerification from "./pages/ResendVerification";

// --- DYNAMIC NAVIGATION WRAPPER COMPONENT ---
function NavigationWrapper() {
  const location = useLocation();

  // If path string starts with '/admin', render the premium admin desk nav bar options
  if (location.pathname.startsWith("/admin")) {
    return <AdminNavbar />;
  }

  // Otherwise, default back to your classic standard user options
  return <Navbar />;
}

// --- DYNAMIC FOOTER WRAPPER COMPONENT ---
function FooterWrapper() {
  const location = useLocation();

  // Hide the global user footer when working within the technical admin hub dashboard layouts
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return <Footer />;
}

function App() {
  return (
    <Router>
      {/* Renders the correct navbar dynamically depending on the route path */}
      <NavigationWrapper /> 
      
      <div className="min-h-screen"> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password/:userId" element={<ResetPassword />} />
          <Route path="/feed" element={<Feed />} /> 
          <Route path="/resend-verification" element={<ResendVerification />} />
          
          {/* DYNAMIC MATCH INFO DISPLAY ROUTES */}
          <Route path="/match/:id" element={<MatchDetails />} />
          
          {/* Connects your Feed.jsx redirect link to your MatchDetails view layout */}
          <Route path="/tournament/:id" element={<MatchDetails />} />
          
          <Route path="/select-interests" element={<SelectInterests />} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          
          {/* BOTH PATHS NOW POINT TO YOUR TOURNAMENTS DASHBOARD */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tournaments" element={<Dashboard />} />
          
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/community" element={<Community />} />
          <Route path="/howitworks" element={<HowItWorks />} />
        </Routes>
      </div>

      {/* Renders the footer conditionally (hidden on Admin layouts) */}
      <FooterWrapper /> 
    </Router>
  );
}

export default App;