import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); 
  const [message, setMessage] = useState('');
  const hasFired = useRef(false);

  const token = searchParams.get('token');

  useEffect(() => {
    const triggerVerification = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token was found in this link.');
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/auth/verify-email?token=${token}`);
        
        setStatus('success');
        setMessage(res.data.message || "Email address verified successfully!");
        
        // Update browser storage status immediately upon verification success
        localStorage.setItem("isVerified", "true");
        
        // 🔥 NEW FIX: Force a global auth status reload across layout headers
        window.dispatchEvent(new Event("authChange"));
        
        setTimeout(() => {
          const userToken = localStorage.getItem("token");
          if (userToken) {
            navigate('/feed');
          } else {
            navigate('/login');
          }
        }, 3000);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || "This activation link has expired or is invalid.");
      }
    };

    if (token && !hasFired.current) {
      hasFired.current = true;
      triggerVerification();
    } else if (!token) {
      setStatus('error');
      setMessage('No verification token was provided.');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="bg-white rounded-[35px] p-10 max-w-sm w-full text-center shadow-xl border border-slate-100"
      >
        {status === 'verifying' && (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mx-auto" />
            <h3 className="text-xl font-black uppercase tracking-wider text-slate-800">Verifying Account</h3>
            <p className="text-xs text-slate-400 font-semibold uppercase">Securing credentials on Sports Connect servers...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 border border-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black uppercase italic text-slate-900">Account Activated!</h3>
            <p className="text-xs text-slate-500 font-medium px-2">{message}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-cyan-600 animate-pulse pt-2">Redirecting to Arena Pipelines...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 border border-rose-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black uppercase italic text-slate-900">Verification Failed</h3>
            <p className="text-xs text-slate-500 font-medium px-2">{message}</p>
            <button 
              onClick={() => navigate('/login')}
              className="w-full mt-4 bg-slate-900 text-white py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-cyan-600 transition-colors"
            >
              Back To Login Portal
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}