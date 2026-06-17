// import { Link, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// // THE FIX: Import your logo image file from the assets folder
// import logo from "../assets/logo.jpg"; 

// function Navbar() {
//   const [username, setUsername] = useState("");
//   const [role, setRole] = useState(""); 
//   const navigate = useNavigate();

//   // Fetches current authentication state from memory
//   const checkUser = () => {
//     const savedName = localStorage.getItem("userName");
//     const savedRole = localStorage.getItem("userRole"); 
//     setUsername(savedName || "");
//     setRole(savedRole || "");
//   };

//   useEffect(() => {
//     checkUser(); 

//     // Dynamic, cross-tab state synchronizers
//     window.addEventListener("storage", checkUser);
//     window.addEventListener("authChange", checkUser); 

//     return () => {
//       window.removeEventListener("storage", checkUser);
//       window.removeEventListener("authChange", checkUser);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     window.dispatchEvent(new Event("authChange")); 
//     navigate("/login");
//   };

//   return (
//     <nav className="sticky top-0 w-full z-[100] bg-white/90 backdrop-blur-md border-b border-gray-100 font-sans">
//       <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
        
//         {/* BRANDING IDENTITY WITH LOGO IMAGE RESTORED */}
//         <Link to="/" className="flex items-center gap-3 group">
//           <img 
//             src={logo} 
//             alt="Sports Connect Logo" 
//             className="w-12 h-12 rounded-2xl object-contain transition-transform group-hover:scale-105" 
//           />
//           <h1 className="text-2xl font-[1000] tracking-tighter text-slate-900 uppercase italic">
//             Sports<span className="text-cyan-500">Connect</span>
//           </h1>
//         </Link>

//         {/* NAVIGATION MATRIX */}
//         <div className="flex items-center space-x-1 md:space-x-8">
          
//           {/* NAVIGATION LINKS */}
//           <div className="hidden md:flex items-center gap-10 mr-4">
//             <Link 
//               to="/" 
//               className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-cyan-600 transition-colors"
//             >
//               Home
//             </Link>
//             <Link 
//               to="/tournaments" 
//               className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-cyan-600 transition-colors"
//             >
//               Tournaments
//             </Link>
//             <Link 
//               to="/community" 
//               className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-cyan-600 transition-colors"
//             >
//               Community
//             </Link>
//             <Link 
//               to="/howitworks" 
//               className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-cyan-600 transition-colors"
//             >
//               How It Works
//             </Link>
//           </div>

//           {/* ADMIN HUB LINK */}
//           {role === "admin" && (
//             <Link 
//               to="/admin" 
//               className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-cyan-600 transition-all shadow-md shadow-slate-200"
//             >
//               Admin Hub
//             </Link>
//           )}

//           {/* USER CONTEXT CONDITIONAL CONTROLS */}
//           {username ? (
//             <div className="flex items-center space-x-6">
              
//               {/* CONDITIONALLY RENDERED PROFILE GREETING STYLES BASED ON ACCOUNT ROLE */}
//               {role === "admin" ? (
//                 // ADMIN GREETING LAYOUT
//                 <div className="bg-slate-100 px-4 py-2 rounded-full border border-slate-200 hidden sm:flex items-center">
//                   <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-1">
//                     <span className="bg-slate-900 text-white px-1.5 py-0.5 rounded text-[8px] font-extrabold mr-1">ADMIN</span>
//                     {username} 🛠️
//                   </span>
//                 </div>
//               ) : (
//                 // STANDARD REGISTERED PLAYER GREETING LAYOUT
//                 <div className="bg-cyan-50/70 px-4 py-2 rounded-full border border-cyan-100/60 hidden sm:flex items-center">
//                   <span className="text-[10px] font-black text-cyan-700 uppercase tracking-widest">
//                     Hi, {username} 👋
//                   </span>
//                 </div>
//               )}

//               <button 
//                 onClick={handleLogout} 
//                 className="text-[11px] font-black text-red-500 uppercase tracking-[0.2em] hover:text-red-700 transition-colors"
//               >
//                 Logout
//               </button>
//             </div>
//           ) : (
//             <div className="flex items-center gap-3">
//               <Link 
//                 to="/register" 
//                 className="px-6 py-3 bg-cyan-500 text-white font-black rounded-2xl hover:bg-slate-900 transition-all shadow-lg shadow-cyan-100 text-[10px] uppercase tracking-[0.15em]"
//               >
//                 Register 📩
//               </Link>
//               <Link 
//                 to="/login" 
//                 className="px-6 py-3 border border-gray-200 text-slate-700 font-black rounded-2xl hover:border-cyan-500 hover:text-cyan-600 transition-all bg-white text-[10px] uppercase tracking-[0.15em]"
//               >
//                 Login
//               </Link>
//             </div>
//           )}
//         </div>

//       </div>
//     </nav>
//   );
// }

// export default Navbar;
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// Import logo image file from the assets folder
import logo from "../assets/logo.jpg"; 

function Navbar() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(""); 
  const navigate = useNavigate();

  // Fetches current authentication state from memory instantly
  const checkUser = () => {
    const savedName = localStorage.getItem("userName");
    const savedRole = localStorage.getItem("userRole"); 
    setUsername(savedName || "");
    setRole(savedRole || "");
  };

  useEffect(() => {
    // Force clean lookup on the initial mounting tick
    checkUser(); 

    const handleAuthUpdate = () => checkUser();

    // Cross-tab and immediate component lifecycle event sync hooks
    window.addEventListener("storage", handleAuthUpdate);
    window.addEventListener("authChange", handleAuthUpdate); 

    return () => {
      window.removeEventListener("storage", handleAuthUpdate);
      window.removeEventListener("authChange", handleAuthUpdate);
    };
  }, []); 

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("authChange")); 
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 w-full z-[100] bg-white/90 backdrop-blur-md border-b border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
        
        {/* BRANDING IDENTITY WITH LOGO IMAGE */}
        <Link to="/" className="flex items-center gap-3 group">
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
          
          {/* NAVIGATION LINKS */}
          <div className="hidden md:flex items-center gap-10 mr-4">
            <Link 
              to="/" 
              className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-cyan-600 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/tournaments" 
              className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-cyan-600 transition-colors"
            >
              Tournaments
            </Link>
            <Link 
              to="/community" 
              className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-cyan-600 transition-colors"
            >
              Community
            </Link>
            <Link 
              to="/howitworks" 
              className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-cyan-600 transition-colors"
            >
              How It Works
            </Link>
          </div>

          {/* ADMIN HUB LINK */}
          {role === "admin" && (
            <Link 
              to="/admin" 
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-cyan-600 transition-all shadow-md shadow-slate-200"
            >
              Admin Hub
            </Link>
          )}

          {/* USER CONTEXT CONDITIONAL CONTROLS */}
          {username ? (
            <div className="flex items-center space-x-6">
              
              {role === "admin" ? (
                // ADMIN GREETING STATUS BADGE
                <div className="bg-slate-100 px-4 py-2 rounded-full border border-slate-200 hidden sm:flex items-center">
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-1">
                    <span className="bg-slate-900 text-white px-1.5 py-0.5 rounded text-[8px] font-extrabold mr-1">ADMIN</span>
                    {username} 🛠️
                  </span>
                </div>
              ) : (
                // STANDARD REGISTERED PLAYER GREETING LAYOUT
                <div className="bg-cyan-50/70 px-4 py-2 rounded-full border border-cyan-100/60 hidden sm:flex items-center">
                  <span className="text-[10px] font-black text-cyan-700 uppercase tracking-widest">
                    Hi, {username} 👋
                  </span>
                </div>
              )}

              <button 
                onClick={handleLogout} 
                className="text-[11px] font-black text-red-500 uppercase tracking-[0.2em] hover:text-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            // LOGGED-OUT STRANGER CONTROL ACTIONS
            <div className="flex items-center gap-3">
              <Link 
                to="/register" 
                className="px-6 py-3 bg-cyan-500 text-white font-black rounded-2xl hover:bg-slate-900 transition-all shadow-lg shadow-cyan-100 text-[10px] uppercase tracking-[0.15em]"
              >
                Register 📩
              </Link>
              <Link 
                to="/login" 
                className="px-6 py-3 border border-gray-200 text-slate-700 font-black rounded-2xl hover:border-cyan-500 hover:text-cyan-600 transition-all bg-white text-[10px] uppercase tracking-[0.15em]"
              >
                Login
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;