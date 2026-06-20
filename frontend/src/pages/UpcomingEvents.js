import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, MapPin, ArrowLeft, Image as ImageIcon, Trash2, Trophy, X, ShieldCheck, QrCode, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UpcomingEvents() {
  const [registeredMatches, setRegisteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState({ text: "", type: "" });
  
  // Ticket Modal Preview States
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const navigate = useNavigate();

  const username = localStorage.getItem("userName") || "Player Athlete";
  const userId = localStorage.getItem("userId") || localStorage.getItem("_id") || "";

  const fetchMyEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/matches/all");
      const allMatches = res.data || [];
      
      // Filter matches where this user is active in the players list
      const myMatches = allMatches.filter((match) =>
        match.players?.some((p) => {
          if (!p) return false;
          const playerIdentity = typeof p === "object" ? (p._id || p.id) : p;
          return String(playerIdentity) === String(userId) || String(p.username) === String(username);
        })
      );
      setRegisteredMatches(myMatches);
    } catch (err) {
      console.error("Error retrieving registered events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchMyEvents();
  }, [userId]);

  // Flash operational message feedback banner instead of generic browser window alerts
  const flashFeedback = (text, type = "success") => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage({ text: "", type: "" }), 4000);
  };

  const handleLeaveAction = async (matchId, matchDate) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const eventDate = new Date(matchDate).setHours(0, 0, 0, 0);
    
    if (today > eventDate) {
      flashFeedback("Cancellation expired! Ongoing or finished event passes cannot be released.", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      // 🛠️ FIXED FIX: Updated endpoint path to target your backend's explicit /:id/unregister route pattern
      await axios.post(
        `http://localhost:5000/api/matches/${matchId}/unregister`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Instantly optimize client-side view state array without manual refresh loops
      setRegisteredMatches((prev) => prev.filter((match) => match._id !== matchId));
      flashFeedback("Roster slot released and spot updated successfully.");
    } catch (err) {
      console.error("Error resigning from event bracket:", err);
      flashFeedback(err.response?.data?.message || "Failed to finalize roster leave cancellation.", "error");
    }
  };

  const openDigitalTicket = (match) => {
    setSelectedTicket(match);
    setIsTicketModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-cyan-500 border-t-transparent"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Personal Itinerary Sheet...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pt-24 pb-16 px-6 md:px-12 relative overflow-x-hidden">
      
      {/* Toast Notice Banner Panel (Stops browser window alerts) */}
      <AnimatePresence>
        {actionMessage.text && (
          <motion.div 
            initial={{ opacity: 0, y: -40, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-2xl shadow-xl font-bold uppercase text-[10px] tracking-wider border flex items-center justify-center text-center max-w-sm w-full ${
              actionMessage.type === "error" 
                ? "bg-red-50 text-red-600 border-red-100" 
                : "bg-slate-900 text-white border-slate-800"
            }`}
          >
            {actionMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2">
            <button 
              onClick={() => navigate("/feed")} 
              className="flex items-center gap-2 text-slate-400 hover:text-cyan-500 font-black text-xs uppercase tracking-wider transition-colors bg-transparent border-none outline-none cursor-pointer mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back To Live Feed
            </button>
            <h1 className="text-4xl font-[1000] uppercase italic tracking-tight text-slate-900 leading-none">
              My Locked <span className="text-cyan-500">Passes</span> 🎟️
            </h1>
            <p className="text-slate-400 text-xs font-semibold">Your secured entry tickets and upcoming game day schedule itineraries.</p>
          </div>
          
          <div className="bg-white border border-slate-200/60 px-5 py-3 rounded-2xl shadow-sm text-left md:text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Roster Placements</p>
            <p className="text-xs font-black text-cyan-600 uppercase tracking-tight">{registeredMatches.length} Active Slots Secured</p>
          </div>
        </div>

        {/* Dynamic Schedule Grid Layout */}
        {registeredMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {registeredMatches.map((item) => {
              const enrolledCount = item.players?.length || 0;
              const maxLimit = item.maxPlayers || 10;

              return (
                <motion.div
                  key={item._id}
                  whileHover={{ y: -3 }}
                  className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-44 w-full bg-slate-900 relative overflow-hidden border-b border-slate-50">
                      {item.image && item.image !== "default-sports.jpg" ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover opacity-95 group-hover:scale-102 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-300 space-y-1">
                          <ImageIcon className="w-7 h-7 stroke-[1.5]" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Roster Locked</span>
                        </div>
                      )}

                      <span className="absolute top-4 left-4 bg-cyan-600 text-white font-black text-[9px] px-2.5 py-1 uppercase rounded-lg tracking-widest shadow-sm">
                        {item.sportType || "Match"}
                      </span>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider">
                        <span className="text-cyan-600">Verified Pass Entry</span>
                        <span className="text-slate-400">{enrolledCount}/{maxLimit} Attendees</span>
                      </div>

                      <h2 className="text-base font-black text-slate-900 uppercase italic tracking-tight leading-snug group-hover:text-cyan-600 transition-colors line-clamp-1">
                        {item.title}
                      </h2>

                      <div className="space-y-2 border-t border-slate-50 pt-3 text-slate-500 text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                          <span>{item.date || "Upcoming Date"} {item.time ? `@ ${item.time}` : ""}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex gap-2">
                    <button
                      onClick={() => openDigitalTicket(item)}
                      className="flex-1 py-3.5 bg-slate-900 text-white hover:bg-cyan-600 font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-1 transition-all border-none outline-none cursor-pointer"
                    >
                      View Ticket Details <Sparkles className="w-3.5 h-3.5 ml-1" />
                    </button>
                    
                    <button
                      onClick={() => handleLeaveAction(item._id, item.date)}
                      className="p-3.5 rounded-2xl bg-white border border-rose-100 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center shadow-sm cursor-pointer"
                      title="Resign Spot / Drop Ticket"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200 max-w-md mx-auto p-8">
            <Trophy className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.25]" />
            <h3 className="text-sm font-black text-slate-800 uppercase italic">No Active Roster Placements</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-1 max-w-xs mx-auto leading-normal">
              You haven't locked your spot inside any local active brackets yet. Head over to the match feed to secure your slot passport.
            </p>
            <button
              onClick={() => navigate("/feed")}
              className="mt-6 px-6 py-3 bg-slate-900 hover:bg-cyan-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-md shadow-slate-100 cursor-pointer border-none outline-none"
            >
              Explore Tournaments Feed
            </button>
          </div>
        )}
      </div>

      {/* Cinematic Digital Pass Overlay Portal */}
      <AnimatePresence>
        {isTicketModalOpen && selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark Blur Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTicketModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Digital Ticket Layout Artifact */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-[36px] shadow-2xl overflow-hidden flex flex-col border border-slate-100 text-slate-800"
            >
              {/* Top Card Header Banner */}
              <div className="bg-slate-900 p-6 pt-8 pb-14 relative text-center text-white">
                <button 
                  onClick={() => setIsTicketModalOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/50 p-2 rounded-full transition-colors cursor-pointer border-none"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="inline-flex items-center gap-1.5 bg-cyan-500/20 text-cyan-400 font-black text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-3 border border-cyan-500/30">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" /> Authorized Entry Pass
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tight line-clamp-1">
                  {selectedTicket.title}
                </h3>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">
                  {selectedTicket.sportType || "Match Day"} Tournament
                </p>

                {/* Left/Right Aesthetic Ticket Punches */}
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-slate-950/80 rounded-full z-10"></div>
                <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-slate-950/80 rounded-full z-10"></div>
              </div>

              {/* Dashed Separator Center Line */}
              <div className="relative bg-white px-6">
                <div className="border-t-2 border-dashed border-slate-200 w-full h-0"></div>
              </div>

              {/* Ticket Core Content Area */}
              <div className="bg-white p-6 space-y-6 flex-1 text-center">
                
                {/* QR Code Placeholder Box Asset */}
                <div className="w-36 h-36 mx-auto bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col items-center justify-center relative group">
                  <QrCode className="w-full h-full text-slate-900 stroke-[1.25]" />
                  <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                    <p className="text-[8px] font-black uppercase text-cyan-600 tracking-wider">Pass Valid for Check-in</p>
                  </div>
                </div>

                {/* Ticket Details Fields */}
                <div className="grid grid-cols-2 gap-4 text-left border border-slate-100 p-4 rounded-2xl bg-slate-50/50">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Competitor</span>
                    <span className="text-xs font-black text-slate-800 uppercase italic truncate block">{username}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pass ID</span>
                    <span className="text-xs font-mono font-bold text-slate-600 uppercase block">
                      #{selectedTicket._id?.slice(-7).toUpperCase() || "TKT-LIVE"}
                    </span>
                  </div>
                  <div className="col-span-2 border-t border-slate-100 pt-2 mt-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Venue Arena Location</span>
                    <div className="flex items-center gap-1 mt-0.5 text-slate-600 text-xs font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                      <span className="truncate">{selectedTicket.location}</span>
                    </div>
                  </div>
                  <div className="col-span-2 border-t border-slate-100 pt-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Event Schedule</span>
                    <div className="flex items-center gap-1 mt-0.5 text-slate-600 text-xs font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                      <span>{selectedTicket.date || "Upcoming"} {selectedTicket.time ? `@ ${selectedTicket.time}` : ""}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Signatures */}
                <div className="pt-2">
                  <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Powered By SportsConnect Gateway</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}