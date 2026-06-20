import { Link, useLocation } from "react-router-dom";
// THE EXACT SAME LOGO IMPORT FROM YOUR NAVBAR FILE
import logo from "../assets/logo.jpg"; 

function AdminNavbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 w-full z-[100] bg-white/90 backdrop-blur-md border-b border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
        
        {/* BRANDING IDENTITY WITH LOGO IMAGE (IDENTICAL TO YOUR USER NAVBAR) */}
        <Link to="/admin" className="flex items-center gap-3 group">
          <img 
            src={logo} 
            alt="Sports Connect Logo" 
            className="w-12 h-12 rounded-2xl object-contain transition-transform group-hover:scale-105" 
          />
          <h1 className="text-2xl font-[1000] tracking-tighter text-slate-900 uppercase italic">
            Sports<span className="text-cyan-500">Connect</span>
          </h1>
        </Link>

        {/* NAVIGATION MATRIX */}
        <div className="flex items-center space-x-1 md:space-x-8">
          
          {/* REALISTIC ADMIN OPTIONS (EXACT SAME TYPE SIZE & CASE AS IMAGE_53D27D.PNG) */}
          <div className="hidden md:flex items-center gap-10 mr-4">
            <Link 
              to="/admin" 
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${
                location.search === "" && location.pathname === "/admin"
                  ? "text-cyan-500" 
                  : "text-slate-500 hover:text-cyan-600"
              }`}
            >
              Tournaments
            </Link>
            <Link 
              to="/admin?filter=upcoming" 
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${
                location.search.includes("upcoming") 
                  ? "text-cyan-500" 
                  : "text-slate-500 hover:text-cyan-600"
              }`}
            >
              Upcoming
            </Link>
            <Link 
              to="/admin?filter=live" 
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${
                location.search.includes("live") 
                  ? "text-cyan-500" 
                  : "text-slate-500 hover:text-cyan-600"
              }`}
            >
              Live
            </Link>
          </div>

          {/* USER FEED PREVIEW INTERACTIVE OUTLINE REDIRECT */}
          <div className="flex items-center gap-3">
            {/* 👑 FIXED: Pointed directly to the admin preview path and dynamically toggled border/text colors if active */}
            <Link 
              to="/admin/feed-preview" 
              className={`px-6 py-3 border font-black rounded-2xl transition-all text-[10px] uppercase tracking-[0.15em] ${
                location.pathname === "/admin/feed-preview"
                  ? "border-cyan-500 text-cyan-600 bg-cyan-50/10"
                  : "border-gray-200 text-slate-700 bg-white hover:border-cyan-500 hover:text-cyan-600"
              }`}
            >
              User Feed
            </Link>
          </div>
        </div>

      </div>
    </nav>
  );
}

export default AdminNavbar;