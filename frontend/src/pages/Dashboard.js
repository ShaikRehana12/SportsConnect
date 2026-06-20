import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPin, Calendar, Trophy, Sparkles, Image as ImageIcon, ChevronRight, AlertTriangle } from "lucide-react";

function Dashboard() {
  const [filter, setFilter] = useState("All");
  const [userInterests, setUserInterests] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(true); 
  const navigate = useNavigate();

  // Unified state synchronization function
  const syncAuthState = () => {
    const savedInterests = JSON.parse(localStorage.getItem("userInterests") || "[]");
    setUserInterests(savedInterests);

    const verifiedStatus = localStorage.getItem("isVerified");
    if (verifiedStatus === "false") {
      setIsVerified(false);
    } else {
      setIsVerified(true);
    }
  };

  useEffect(() => {
    // 1. Initial State Sync
    syncAuthState();

    // 2. Cross-Component and Cross-Tab Listeners
    window.addEventListener("storage", syncAuthState);
    window.addEventListener("authChange", syncAuthState);

    // 3. Fetch live matches from backend
    const fetchMatches = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/matches/all");
        setMatches(res.data || []);
      } catch (err) {
        console.error("Error fetching matches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("authChange", syncAuthState);
    };
  }, []);

  const filtered = filter === "All" 
    ? matches 
    : matches.filter(t => t.sportType?.toLowerCase() === filter.toLowerCase());

  const handleApply = (matchId) => {
    navigate(`/match/${matchId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-cyan-500 border-t-transparent"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Arena Roster...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {!isVerified && (
        <div className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white pt-24 pb-4 px-6 border-b border-orange-600/20 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <AlertTriangle className="w-5 h-5 text-white animate-bounce flex-shrink-0" />
              <div>
                <p className="text-xs font-black uppercase tracking-wider">Account Access Restricted</p>
                <p className="text-[11px] text-amber-50/90 font-medium mt-0.5">Please verify your email address via the registration link to unlock bracket placements and secure match tickets.</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/resend-verification")}
              className="bg-white text-orange-600 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-sm flex-shrink-0 whitespace-nowrap"
            >
              Resend Code 🚀
            </button>
          </div>
        </div>
      )}

      <div className={`p-6 md:p-12 ${isVerified ? "pt-24" : "pt-8"}`}>
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-4xl font-[1000] text-slate-900 mb-2 italic tracking-tighter uppercase leading-none">
                Active <span className="text-cyan-500">Tournaments</span> 🗺️
              </h1>
              <p className="text-slate-400 text-xs font-semibold">Discover and lock your pass slots for premium events happening in your local region.</p>
            </div>
            <div className="text-left md:text-right bg-white px-5 py-3 border border-slate-200/60 rounded-2xl shadow-sm">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Live Pipeline Stream</p>
              <p className="text-xs font-black text-cyan-600 uppercase tracking-tight">{matches.length} Brackets Available</p>
            </div>
          </header>

          <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-4 custom-scrollbar">
            {["All", "Cricket", "Football", "Badminton", "Volleyball", "Chess", "Basketball"].map(sport => (
              <button 
                key={sport} 
                onClick={() => setFilter(sport)}
                className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border ${
                  filter === sport 
                    ? 'bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-100 scale-102' 
                    : 'bg-white text-slate-500 border-slate-200/60 hover:border-cyan-400 hover:text-cyan-600'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(t => {
              const isRecommended = userInterests.some(interest => interest.toLowerCase() === t.sportType?.toLowerCase());
              const currentJoined = t.players?.length || 0;
              const maxLimit = t.maxPlayers || 10;
              const openSlots = maxLimit - currentJoined;

              return (
                <div key={t._id} className="bg-white rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-200/60 overflow-hidden group flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 bg-slate-900 overflow-hidden border-b border-slate-100">
                      {t.image && t.image !== "default-sports.jpg" ? (
                        <img 
                          src={t.image} 
                          alt={t.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-300 space-y-1">
                          <ImageIcon className="w-8 h-8 stroke-[1.25]" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Sports Connect Bracket</span>
                        </div>
                      )}
                      
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl shadow-sm border border-slate-100">
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">
                          {openSlots <= 0 ? "Roster Filled" : `${openSlots} Slots Remaining`}
                        </span>
                      </div>

                      {isRecommended && (
                        <div className="absolute top-4 left-4 bg-cyan-600 border border-cyan-500/30 text-white px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md">
                          <Sparkles className="w-3 h-3" /> Recommended
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase px-2.5 py-1 bg-slate-50 border border-slate-200/60 text-slate-500 rounded-lg tracking-wider">
                          {t.sportType || "Tournament"}
                        </span>
                        <span className={`text-xs font-black uppercase ${t.entryFee > 0 ? "text-cyan-600" : "text-emerald-600"}`}>
                          {t.entryFee > 0 ? `₹${t.entryFee}` : "Free Entry"}
                        </span> 
                      </div>

                      <h3 className="text-lg font-black text-slate-900 group-hover:text-cyan-600 transition-colors uppercase italic tracking-tight line-clamp-2 min-h-[3.5rem] leading-tight">
                        {t.title || `${t.sportType} Match`}
                      </h3>

                      <div className="space-y-2 border-t border-slate-50 pt-3">
                        <div className="flex items-center text-xs text-slate-500 gap-2.5 font-semibold">
                          <Calendar className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                          <span className="uppercase tracking-tight">{t.date} {t.time ? `@ ${t.time}` : ""}</span>
                        </div>
                        <div className="flex items-center text-xs text-slate-500 gap-2.5 font-semibold">
                          <MapPin className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                          <span className="uppercase tracking-tight truncate">{t.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button 
                      onClick={() => handleApply(t._id)}
                      className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-600 transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-slate-100 group-hover:shadow-cyan-100"
                    >
                      Inspect Pass Bracket
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-slate-200 max-w-md mx-auto p-6 mt-12">
              <Trophy className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
              <p className="text-slate-800 font-black uppercase italic text-sm">
                No {filter} Tournaments Available
              </p>
              <p className="text-[11px] text-slate-400 font-semibold mt-1">There are no open competitive brackets matching this category right now.</p>
              <button 
                onClick={() => setFilter("All")}
                className="mt-5 text-cyan-600 font-black text-[10px] uppercase tracking-wider underline hover:text-slate-900 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;