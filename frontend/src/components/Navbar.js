import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logo.jpg"; 

function Navbar() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const checkUser = () => {
    const savedName = localStorage.getItem("userName");
    setUsername(savedName || "");
  };

  useEffect(() => {
    checkUser();
    // Listen for login/logout events across the app
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("storage")); // Notify navbar to clear name
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-cyan-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <Link to="/" className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg object-contain" />
          <h1 className="text-2xl font-black tracking-tighter text-cyan-600 uppercase italic">
            Sports<span className="text-gray-800">Connect</span>
          </h1>
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/" className="text-gray-600 hover:text-cyan-600 font-semibold px-3 uppercase text-[10px] tracking-widest">Home</Link>

          {username ? (
            <div className="flex items-center space-x-4">
              <div className="bg-cyan-50 px-4 py-2 rounded-full border border-cyan-100 flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-700 uppercase">Hi, {username} 👋</span>
              </div>
              <button onClick={handleLogout} className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-700">Logout</button>
            </div>
          ) : (
            <>
              <Link to="/register" className="px-5 py-2 bg-cyan-500 text-white font-bold rounded-full hover:bg-cyan-600 transition shadow-lg text-[10px] uppercase">Register 📩</Link>
              <Link to="/login" className="px-5 py-2 border-2 border-cyan-500 text-cyan-500 font-bold rounded-full hover:bg-cyan-50 transition text-[10px] uppercase">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;