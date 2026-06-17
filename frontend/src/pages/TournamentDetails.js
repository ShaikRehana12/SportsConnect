import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Trophy, Users, CheckCircle, ArrowLeft, X } from "lucide-react";

function TournamentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const username = localStorage.getItem("userName") || "Player";
  const userId = localStorage.getItem("userId") || username;

  // Function to pull match details from backend (isolated so we can re-invoke it on changes)
  const fetchMatchDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/matches/all`);
      const foundMatch = res.data.find((m) => m._id === id);
      setMatch(foundMatch);
    } catch (err) {
      console.error("Error catching match details data object", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchDetails();
  }, [id]);

  const handleFinalRegister = async () => {
    setRegistering(true);
    try {
      await axios.post(`http://localhost:5000/api/matches/${id}/register`, { userId });
      setShowSuccessModal(true);
      fetchMatchDetails(); // Synchronize layout instantly
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  // --- NEW HANDLE CANCELLATION ENGINE ---
  const handleCancelTicket = async () => {
    // 1. Enforce local deadline validation guard before network request
    const today = new Date().setHours(0, 0, 0, 0);
    const eventDate = new Date(match.date).setHours(0, 0, 0, 0);
    if (today > eventDate) {
      alert("Cancellation expired! You cannot drop out on or after the event date.");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel your slot passport and drop out?")) return;

    setRegistering(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/matches/leave/${id}`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Slot cancelled successfully.");
      fetchMatchDetails(); // Re-trigger reactive state pull to clear and synchronize layouts instantly
    } catch (err) {
      console.error("Cancellation error", err);
      alert(err.response?.data?.message || "Failed to process slot removal.");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="pt-40 text-center uppercase font-black text-slate-300 animate-pulse text-2xl">Loading Event Data Sheet...</div>;
  if (!match) return <div className="pt-40 text-center font-bold text-red-500">Tournament profile matching this identification parameters not found.</div>;

  const currentJoined = match.players?.length || 0;
  const maxSlots = match.maxPlayers || 10;
  const isFull = currentJoined >= maxSlots;

  // Look up if user is already saved down inside the backend player stack array
  const isAlreadyRegistered = match.players?.some(
    (p) => p === userId || p._id === userId
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* BACK ACTION TO FEED LINK ROW */}
        <button onClick={() => navigate("/feed")} className="flex items-center gap-2 text-slate-400 hover:text-cyan-500 font-bold text-xs uppercase tracking-wider mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back To Live Match Feed
        </button>

        <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden grid md:grid-cols-5">
          
          {/* TOURNAMENT META DATA LEFT HERO CARD PANEL */}
          <div className="md:col-span-3 p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100">
            <div>
              <span className="bg-cyan-50 border border-cyan-100 text-cyan-500 font-black text-[9px] uppercase tracking-[0.25em] px-4 py-1.5 rounded-full inline-block mb-4">
                {match.sportType || "Tournament Match"}
              </span>
              <h1 className="text-4xl font-black uppercase italic tracking-tight text-slate-900 leading-none mb-6">
                {match.title}
              </h1>

              <div className="space-y-4 my-8">
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-cyan-500"><MapPin className="w-5 h-5"/></div>
                  <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Venue Location</p><p className="font-bold text-sm text-slate-800">{match.location}</p></div>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-cyan-500"><Clock className="w-5 h-5"/></div>
                  <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Timing & Bracket Slots</p><p className="font-bold text-sm text-slate-800">{match.date} @ {match.time || "TBD"}</p></div>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-cyan-500"><Users className="w-5 h-5"/></div>
                  <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Attendance Bracket Capacity</p><p className="font-bold text-sm text-slate-800">{currentJoined} / {maxSlots} Players Saved ({maxSlots - currentJoined} Left)</p></div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2">Tournament Directives & Codes</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Players must report to the local arena venue coordinator 15 minutes before slot timing brackets open. Bring standard personal protective sports gear arrays.</p>
            </div>
          </div>

          {/* APPLICATION FORM SECTOR PANEL */}
          <div className="md:col-span-2 bg-slate-50/50 p-10 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-black uppercase italic text-slate-800 mb-6">Confirm <span className="text-cyan-500">Registration</span></h3>
              
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm mb-6">
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Active Profile</p>
                <p className="font-black text-slate-800 uppercase text-sm">{username}</p>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm mb-8 flex justify-between items-center">
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Pass Entry Cost</p>
                  <p className="text-xl font-black text-slate-900">{match.entryFee > 0 ? `₹${match.entryFee}` : "FREE ENTRY"}</p>
                </div>
                <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center border border-emerald-100"><Trophy className="w-5 h-5"/></div>
              </div>
            </div>

            {/* DYNAMIC REGISTRATION/CANCELLATION MUTATION ACTION TRIGGER */}
            {isAlreadyRegistered ? (
              <button
                onClick={handleCancelTicket}
                disabled={registering}
                className="w-full py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 shadow-md flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" /> {registering ? "Dropping Ticket..." : "Cancel My Ticket"}
              </button>
            ) : (
              <button
                onClick={handleFinalRegister}
                disabled={isFull || registering}
                className={`w-full py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all shadow-lg ${
                  isFull 
                    ? "bg-red-100 text-red-500 cursor-not-allowed border border-red-200" 
                    : "bg-slate-900 text-white hover:bg-cyan-600 hover:-translate-y-0.5 shadow-slate-200"
                }`}
              >
                {registering ? "Processing Ticket..." : isFull ? "Bracket Filled Out" : "Confirm & Lock Slot"}
              </button>
            )}
          </div>

        </div>
      </div>

      {/* REGISTRATION COMPLETED POPUP */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[45px] p-10 max-w-sm w-full text-center shadow-2xl">
              <div className="w-20 h-20 bg-green-50 text-green-500 border border-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-10 h-10" /></div>
              <h2 className="text-2xl font-black uppercase italic mb-2">Slot Locked <span className="text-cyan-500">In!</span></h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-tight mb-6">Your pass code has been verified and registered inside the bracket matching database sheet.</p>
              <button onClick={() => { setShowSuccessModal(false); navigate("/feed"); }} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-cyan-600 transition-colors">Return To Feed</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TournamentDetails;