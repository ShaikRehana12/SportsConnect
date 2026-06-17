import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { username, role, token, interests, city } = response.data;

      // Save credentials to local memory
      localStorage.setItem("token", token);
      localStorage.setItem("userName", username);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userCity", city || "Hyderabad");
      localStorage.setItem("userInterests", JSON.stringify(interests || []));

      // CRITICAL: Instantly alert the Navbar component to update its state
      window.dispatchEvent(new Event("authChange"));

      // Route based on account access clearance
      if (role === "admin") {
        navigate("/admin");
      } else if (!interests || interests.length === 0) {
        navigate("/select-interests");
      } else {
        navigate("/feed");
      }

    } catch (error) {
      console.error("Login Error:", error);
      setError(
        error.response?.data?.msg || 
        "Login failed. Please verify your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-4">
      <form 
        onSubmit={handleLogin} 
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">
            Sports<span className="text-cyan-600">Connect</span>
          </h2>
          <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em] font-bold mt-2">
            Secure Access Portal
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded flex items-center justify-center">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="player@sportsconnect.com" 
              required
              className="w-full mt-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center ml-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Password</label>
              <button 
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-[11px] font-bold text-cyan-600 hover:text-cyan-700 transition italic"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative mt-1">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-600 transition"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-cyan-600 transition-all duration-300 shadow-lg shadow-slate-200 mt-10 uppercase text-xs tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? "Authenticating..." : "Sign In"}
        </button>

        <div className="mt-10 pt-8 border-t border-slate-50 flex justify-center">
          <p className="text-sm text-slate-500">
            New player? 
            <button 
              type="button"
              onClick={() => navigate("/register")} 
              className="ml-2 text-cyan-600 font-extrabold hover:text-slate-900 transition underline-offset-4 hover:underline"
            >
              Create Account
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;