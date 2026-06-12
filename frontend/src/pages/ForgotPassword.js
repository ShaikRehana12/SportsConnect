import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      // This calls the backend to send the reset email
    //   await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      // ✅ CORRECT: Using .post
await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage("Check your inbox! A reset link has been sent.");
    } catch (err) {
      setMessage("Error: User not found or server issue.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-t-4 border-cyan-600">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Reset Password</h2>
        <p className="text-gray-500 text-sm mb-6">Enter your registered email to receive a reset link.</p>
        
        <form onSubmit={handleReset} className="space-y-4">
          <input 
            type="email" 
            placeholder="your-email@gmail.com" 
            required
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="w-full bg-cyan-600 text-white py-3 rounded-xl font-bold">
            Send Reset Link
          </button>
        </form>
        
        {message && <p className="mt-4 text-cyan-600 font-bold text-center">{message}</p>}
        
        <button onClick={() => navigate("/login")} className="mt-6 text-sm text-gray-400 w-full text-center hover:underline">
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;