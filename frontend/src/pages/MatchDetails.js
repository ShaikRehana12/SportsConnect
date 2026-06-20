import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, Users, ArrowLeft, Trophy, CheckCircle, AlertTriangle } from 'lucide-react';

export default function MatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  
  // SUCCESS POPUP RECEIPT TICKET STATE
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Checks if the user arrived from the admin preview canvas pool
  const isFromAdmin = location.state?.fromAdmin;

  // AUTH STATE EXTRACTIONS
  const username = localStorage.getItem("userName") || "";
  const userId = localStorage.getItem("userId") || localStorage.getItem("userName") || "";
  const isLoggedIn = username && username !== "Player";

  useEffect(() => {
    fetchMatchDetails();
  }, [id]);

  const fetchMatchDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/matches/all`);
      const found = res.data.find(m => m._id === id);
      setMatch(found);
    } catch (err) {
      console.error("Error retrieving match details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterAction = async () => {
    if (!isLoggedIn || !userId) {
      navigate("/login");
      return;
    }
  
    setRegistering(true);
    try {
      await axios.post(`http://localhost:5000/api/matches/${id}/register`, { userId });
      setShowSuccessModal(true);
      fetchMatchDetails(); 
    } catch (err) {
      console.error("Registration failed silently:", err.response?.data?.error || err.message);
    } finally {
      setRegistering(false);
    }
  };

  useEffect(() => {
    // CRITICAL: Prevent regular user itinerary redirect if inspecting as an admin
    if (match && !isFromAdmin) {
      const hasJoined = match.players?.some(player => {
        const pId = typeof player === 'object' ? player._id : player;
        return String(pId) === String(userId) || String(player) === String(username);
      });

      if (hasJoined) {
        navigate("/upcoming-events"); 
      }
    }
  }, [match, userId, username, navigate, isFromAdmin]);

  const handleLeaveAction = async () => {
    if (!window.confirm("Are you sure you want to give up your spot for this match?")) return;

    setRegistering(true);
    try {
      await axios.post(`http://localhost:5000/api/matches/${id}/leave`, { userId });
      fetchMatchDetails();
    } catch (err) {
      console.error("Cancellation failed silently:", err.response?.data?.error || err.message);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">Loading Tournament Specifications...</p>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <p className="text-xs font-black uppercase tracking-widest text-rose-500">Tournament Record Not Found</p>
        <button onClick={() => navigate(-1)} className="text-xs font-bold text-slate-600 underline">Go Back</button>
      </div>
    );
  }

  const currentJoined = match.players?.length || 0;
  const maxSlots = match.maxPlayers || 10;
  const isFull = currentJoined >= maxSlots;
  
  const hasJoinedAlready = match.players?.some(player => {
    const pId = typeof player === 'object' ? player._id : player;
    return (
      (userId && String(pId) === String(userId)) || 
      (username && String(pId) === String(username)) ||
      (player && String(player) === String(username))
    );
  });

  const isEventPast = new Date() > new Date(match.date);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pt-24 pb-12 p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* 👑 ACCESSIBLE DYNAMIC BACK NAVIGATION BAR */}
        {isFromAdmin ? (
          <button 
            onClick={() => navigate(-1)} // 👑 Using history back-track to completely avoid route mismatches
            className="flex items-center gap-2 text-xs font-black uppercase text-cyan-600 hover:text-slate-900 transition-colors bg-transparent border-none outline-none cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Admin Preview
          </button>
        ) : (
          <button 
            onClick={() => navigate("/feed")} 
            className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 hover:text-cyan-500 transition-colors bg-transparent border-none outline-none cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Feed
          </button>
        )}

        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="relative h-64 bg-slate-900">
            {match.image && match.image !== "default-sports.jpg" ? (
              <img src={match.image} alt="Banner" className="w-full h-full object-cover opacity-80" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-800">
                <Trophy className="w-12 h-12 stroke-[1]" />
              </div>
            )}
            <span className="absolute bottom-6 left-8 bg-cyan-600 text-white font-black text-[10px] px-4 py-1.5 uppercase rounded-xl tracking-widest shadow-md">
              {match.sportType}
            </span>
          </div>

          <div className="p-8 md:p-10 space-y-8">
            <div>
              <h1 className="text-3xl font-black uppercase italic text-slate-900 leading-none">{match.title}</h1>
              {match.entryFee > 0 ? (
                <p className="text-cyan-600 font-black text-sm mt-2">Entry Fee: ₹{match.entryFee}</p>
              ) : (
                <p className="text-emerald-600 font-black text-sm mt-2">Free Entry</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-y border-slate-100 py-6">
              <div className="flex items-center gap-3 text-slate-700 text-sm font-semibold">
                <MapPin className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                <span>{match.location}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 text-sm font-semibold">
                <Calendar className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                <span>{match.date} {match.time ? `at ${match.time}` : ''}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 mb-2">
                <span>Registration Status</span>
                <span className="text-slate-800">{currentJoined} / {maxSlots} Spots Taken</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${isFull && !hasJoinedAlready ? 'bg-red-500' : 'bg-cyan-600'}`} 
                  style={{ width: `${Math.min((currentJoined / maxSlots) * 100, 100)}%` }}
                />
              </div>
            </div>

            {hasJoinedAlready ? (
              <button 
                onClick={handleLeaveAction}
                disabled={registering || isEventPast}
                className={`w-full py-4 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg transition-all active:scale-[0.98] ${
                  isEventPast ? "bg-slate-300 cursor-not-allowed shadow-none" : "bg-red-500 hover:bg-red-600 shadow-red-100"
                }`}
              >
                {registering ? 'Processing Cancellation...' : isEventPast ? 'Match Completed (Locked)' : 'Cancel My Slot / Leave Match 🏃'}
              </button>
            ) : (
              <button 
                onClick={handleRegisterAction}
                disabled={registering || isFull}
                className={`w-full py-4 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg transition-all active:scale-[0.98] ${
                  registering ? "bg-slate-400 cursor-wait" : isFull ? "bg-red-100 border border-red-200 text-red-500 cursor-not-allowed shadow-none" : "bg-slate-900 hover:bg-cyan-600"
                }`}
              >
                {registering ? 'Securing Slot...' : isFull ? 'Bracket Fully Booked 🚫' : match.entryFee > 0 ? `Pay ₹${match.entryFee} & Register` : 'Secure My Spot Now'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SUCCESS POPUP TICKET MODAL */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-[45px] p-10 max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
              <div className="w-20 h-20 bg-green-50 text-green-500 border border-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black uppercase italic mb-2 text-slate-900">Slot Locked <span className="text-cyan-500">In!</span></h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-tight mb-8">Your pass ticket has been securely locked down into the backend tournament roster!</p>

              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 mb-8 text-left relative">
                <p className="text-[8px] font-black text-cyan-600 uppercase mb-4 tracking-widest">Official Entry Pass</p>
                <h4 className="text-lg font-black text-slate-800 uppercase italic leading-tight mb-1">{match.title}</h4>
                <p className="text-[10px] text-slate-500 font-bold mb-4 uppercase">{match.location} @ {match.time || "TBD"}</p>
                <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                  <p className="text-xs font-black uppercase text-slate-800">{username}</p>
                  <div className="w-8 h-8 bg-slate-200 rounded-md"></div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setShowSuccessModal(false);
                  if (isFromAdmin) {
                    navigate(-1);
                  } else {
                    navigate("/feed");
                  }
                }} 
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-cyan-600 transition-colors"
              >
                {isFromAdmin ? "Return To Admin Preview" : "Return To Match Feed"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}