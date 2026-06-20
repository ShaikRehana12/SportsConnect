import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Calendar, Trophy, History, Zap, ShieldAlert, X, Sparkles, Award } from "lucide-react";

function Feed() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("live"); // Options: "live" or "past"
  
  // Retro Archive Modal State for Closed Outdated Events
  const [selectedPastMatch, setSelectedPastMatch] = useState(null);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  const navigate = useNavigate();
  const username = localStorage.getItem("userName") || "";

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/matches/all");
      setMatches(res.data || []);
    } catch (err) {
      console.error("Error fetching matches", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper date parsing validation engines
  const today = new Date().setHours(0, 0, 0, 0);

  const liveMatches = matches.filter((match) => {
    if (!match.date) return true; // Fallback for TBD games
    const matchDate = new Date(match.date).setHours(0, 0, 0, 0);
    return matchDate >= today;
  });

  const pastMatches = matches.filter((match) => {
    if (!match.date) return false;
    const matchDate = new Date(match.date).setHours(0, 0, 0, 0);
    return matchDate < today;
  });

  const displayMatches = activeTab === "live" ? liveMatches : pastMatches;

  const openArchiveSheet = (match) => {
    setSelectedPastMatch(match);
    setIsArchiveModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pt-24 pb-16 px-6 md:px-12 relative overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Block */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-[1000] text-slate-900 tracking-tighter italic uppercase leading-none">
              Tournament <span className="text-cyan-500">Feed</span> 🚀
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              Welcome back, {username || "Player"}! Find live brackets or explore past match histories.
            </p>
          </div>

          {/* Action Navigation Tabs */}
          <div className="bg-slate-200/60 p-1.5 rounded-2xl flex items-center gap-1 w-full md:w-auto shadow-inner">
            <button
              onClick={() => setActiveTab("live")}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer border-none outline-none flex items-center justify-center gap-2 ${
                activeTab === "live"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800 bg-transparent"
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> Live Tournaments ({liveMatches.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer border-none outline-none flex items-center justify-center gap-2 ${
                activeTab === "past"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800 bg-transparent"
              }`}
            >
              <History className="w-3.5 h-3.5" /> Archived Brackets ({pastMatches.length})
            </button>
          </div>
        </header>

        {/* Dynamic Match Cards Interface Output */}
        {isLoading ? (
          <div className="py-32 text-center uppercase font-[1000] text-slate-300 italic text-4xl animate-pulse tracking-tight">
            Syncing Arena Brackets...
          </div>
        ) : displayMatches.length > 0 ? (
          <div className="grid gap-6">
            {displayMatches.map((match) => {
              const currentJoined = match.players?.length || 0;
              const maxSlots = match.maxPlayers || 10;
              const isFull = currentJoined >= maxSlots;
              const percentFilled = Math.min((currentJoined / maxSlots) * 100, 100);

              return (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={match._id}
                  className={`bg-white border border-slate-200/60 rounded-[32px] p-8 flex flex-col md:flex-row justify-between items-center hover:shadow-xl transition-all group relative overflow-hidden ${
                    activeTab === "past" ? "opacity-85 hover:opacity-100" : ""
                  }`}
                >
                  {/* Visual Left Accent Status Indicator Tag */}
                  <div className={`absolute top-0 bottom-0 left-0 w-2 ${activeTab === "past" ? "bg-slate-400" : isFull ? "bg-red-500" : "bg-cyan-500"}`} />

                  <div className="flex-1 w-full md:w-auto pl-2">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span className={`font-black text-[9px] px-2 py-0.5 uppercase rounded tracking-widest ${
                        activeTab === "past" ? "bg-slate-100 text-slate-500 border border-slate-200" : "bg-cyan-500/10 text-cyan-600"
                      }`}>
                        {match.sportType || "Match"}
                      </span>
                      {activeTab === "past" && (
                        <span className="bg-amber-50 text-amber-600 border border-amber-100 font-black text-[9px] px-2 py-0.5 uppercase rounded tracking-widest flex items-center gap-1">
                          <Award className="w-3 h-3" /> Match Concluded
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-black text-slate-800 uppercase italic mb-3 group-hover:text-cyan-600 transition-colors line-clamp-1">
                      {match.title || "Untitled Tournament"}
                    </h3>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-500 font-bold text-xs uppercase tracking-tight">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition-colors" /> {match.location}
                      </span>
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition-colors" /> {match.date || "TBD"}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition-colors" /> {match.time || "TBD"}
                      </span>
                    </div>
                  </div>

                  {/* Right Alignment Context Column */}
                  <div className="mt-6 md:mt-0 flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-none border-slate-100 pt-4 md:pt-0">
                    <div className="text-right hidden sm:block">
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                        activeTab === "past" ? "text-slate-400" : isFull ? "text-red-500" : "text-cyan-600"
                      }`}>
                        {activeTab === "past" ? `Final Roster Count: ${currentJoined}` : isFull ? "MATCH FULL" : `${currentJoined} / ${maxSlots} Slots Secured`}
                      </p>
                      <div className="w-32 h-1.5 bg-slate-100 border border-slate-200/40 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${activeTab === "past" ? "bg-slate-400" : isFull ? "bg-red-500" : "bg-cyan-500"}`}
                          style={{ width: `${percentFilled}%` }}
                        ></div>
                      </div>
                    </div>

                    {activeTab === "live" ? (
                      <button
                        onClick={() => navigate(`/tournament/${match._id}`)}
                        className="w-full sm:w-auto text-center px-10 py-4 bg-slate-900 text-white hover:bg-cyan-600 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-md cursor-pointer border-none"
                      >
                        Join Game
                      </button>
                    ) : (
                      <button
                        onClick={() => openArchiveSheet(match)}
                        className="w-full sm:w-auto text-center px-8 py-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.15em] transition-all shadow-sm cursor-pointer"
                      >
                        View Results
                      </button>
                    )}
                  </div>

                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="border-4 border-dashed border-slate-200/60 bg-white rounded-[40px] py-24 text-center max-w-md mx-auto p-8">
            <Trophy className="w-10 h-10 mx-auto text-slate-300 mb-3 stroke-[1.25]" />
            <h2 className="text-base font-black text-slate-800 uppercase italic">
              No {activeTab === "live" ? "Live" : "Outdated"} Events Found
            </h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1 leading-normal max-w-xs mx-auto">
              {activeTab === "live" 
                ? "All competitive matches have concluded. Check back shortly for incoming game bookings!"
                : "The historical archive vault is currently clear of ancient match records."}
            </p>
          </div>
        )}
      </div>

      {/* Cinematic Outdated Event Archive Summary Sheet Overlay */}
      <AnimatePresence>
        {isArchiveModalOpen && selectedPastMatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsArchiveModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="relative bg-white w-full max-w-md rounded-[36px] shadow-2xl overflow-hidden flex flex-col border border-slate-100 text-slate-800"
            >
              {/* Card Header Shield Banner */}
              <div className="bg-slate-900 p-8 text-center text-white relative">
                <button
                  onClick={() => setIsArchiveModalOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/50 p-2 rounded-full transition-colors cursor-pointer border-none flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full mb-3 border border-amber-500/20">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Historical Vault Summary
                </div>
                
                <h3 className="text-2xl font-[1000] uppercase italic tracking-tight line-clamp-2 px-2">
                  {selectedPastMatch.title}
                </h3>
              </div>

              {/* Core Content Body Area */}
              <div className="p-8 space-y-6 text-center bg-white flex-1">
                
                <div className="border border-slate-100 p-5 rounded-2xl bg-slate-50 text-left space-y-3.5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Sport Type</span>
                      <span className="text-xs font-bold text-slate-800 uppercase">{selectedPastMatch.sportType || "Match Group"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Roster Final Status</span>
                      <span className="text-xs font-bold text-slate-500 uppercase">Closed / Locked</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200/60 pt-3">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Concluded Venue Arena</span>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" /> {selectedPastMatch.location}
                    </p>
                  </div>

                  <div className="border-t border-slate-200/60 pt-3">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Schedule Timeline History</span>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" /> {selectedPastMatch.date} @ {selectedPastMatch.time || "TBD"}
                    </p>
                  </div>
                </div>

                {/* Info Notice Badge */}
                <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 text-center">
                  <p className="text-[11px] text-amber-800 font-semibold leading-relaxed">
                    🚫 This arena event timeline has expired. Registration pathways are automatically unmounted once bracket matches enter history.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-50">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-500" /> Powered by SportsConnect Data Ledger
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Feed;