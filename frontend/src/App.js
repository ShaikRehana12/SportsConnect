// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import AdminDashboard from "./pages/AdminDashboard";

// function App() {
//   return (
//     <Router>
//       <Navbar /> {/* Rendered once globally */}
//       <div className="min-h-screen"> 
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/admin" element={<AdminDashboard />} />
//         </Routes>
//       </div>
//       <Footer /> {/* Rendered once globally */}
//     </Router>
//   );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MatchDetails from "./pages/MatchDetails"; // FIXED: Added missing slash
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
function App() {
  return (
    <Router>
      <Navbar /> 
      <div className="min-h-screen"> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password/:userId" element={<ResetPassword />} />
          <Route path="/feed" element={<Feed />} /> 
          <Route path="/resend-verification" element={<ResendVerification />} />
          {/* DYNAMIC MATCH ROUTE - FIXED: Cleaned up duplicate nested Routes wrapper */}
          <Route path="/match/:id" element={<MatchDetails />} />
          
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
      <Footer /> 
    </Router>
  );
}

export default App;