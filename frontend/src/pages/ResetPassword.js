import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle for visibility
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // 'success' or 'error'
  const { userId } = useParams();
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus("error");
      return setMessage("Passwords do not match!");
    }

    try {
      await axios.post(`http://localhost:5000/api/auth/update-password`, {
        userId,
        newPassword
      });
      
      setStatus("success");
      setMessage("Password updated successfully! Redirecting to login...");
      
      // Navigate to Login after 3 seconds
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setStatus("error");
      setMessage("Error updating password. Link may be expired.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
        
        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase mb-2">
          New <span className="text-cyan-600">Password</span>
        </h2>
        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-8">
          Update your secure credentials
        </p>
        
        <form onSubmit={handleUpdate} className="space-y-5">
          {/* New Password Field */}
          <div className="relative">
            <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">New Password</label>
            <div className="relative mt-1">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                onChange={(e) => setNewPassword(e.target.value)}
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

          {/* Confirm Password Field */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Confirm Password</label>
            <input 
              type={showPassword ? "text" : "password"} // Syncs with the same eye toggle
              placeholder="••••••••" 
              required
              className="w-full mt-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-cyan-600 transition-all shadow-lg mt-4 uppercase text-xs tracking-widest"
          >
            Update Password
          </button>
        </form>
        
        {message && (
          <div className={`mt-6 p-4 rounded-xl text-xs font-bold text-center ${
            status === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;