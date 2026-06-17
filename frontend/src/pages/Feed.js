import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";

function Feed() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const username = localStorage.getItem("userName") || "";

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/matches/all");
      setMatches(res.data);
    } catch (err) {
      console.error("Error fetching matches", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 🛠️ CHANGED: Tightened pt-28 down to pt-20 to pull the title layout upward closer to the Navbar
    <div className="min-h-screen bg-white font-sans pt-20">
      {/* 🛠️ CHANGED: Changed py-12 to py-4 to remove excessive vertical margin spacing */}
      <div className="max-w-5xl mx-auto px-6 py-4">
        <header className="mb-8">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">
            Your <span className="text-cyan-500">Feed</span>
          </h1>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-2">
            Welcome back, {username || "Player"}! Ready for a game?
          </p>
        </header>

        {isLoading ? (
          <div className="py-20 text-center uppercase font-black text-slate-200 text-4xl animate-pulse">
            Loading Games...
          </div>
        ) : matches.length > 0 ? (
          <div className="grid gap-6">
            {matches.map((match) => {
              const currentJoined = match.players?.length || 0;
              const maxSlots = match.maxPlayers || 10; 
              const isFull = currentJoined >= maxSlots;
              const percentFilled = Math.min((currentJoined / maxSlots) * 100, 100);

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  key={match._id} 
                  className="bg-slate-50 border border-slate-100 rounded-[32px] p-8 flex flex-col md:flex-row justify-between items-center hover:shadow-xl transition-all group"
                >
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-slate-800 uppercase italic mb-2 group-hover:text-cyan-600 transition-colors">
                      {match.title || `${match.sportType || 'Sports'} Match`}
                    </h3>
                    <div className="flex gap-6 text-slate-500 font-bold text-xs uppercase tracking-tight">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-cyan-500"/> {match.location}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cyan-500"/> {match.time || "TBD"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 md:mt-0 flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right hidden sm:block">
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isFull ? 'text-red-500' : 'text-cyan-600'}`}>
                        {isFull ? "MATCH FULL" : `${currentJoined} / ${maxSlots} Players Joined`}
                      </p>
                      <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-cyan-500'}`} 
                          style={{ width: `${percentFilled}%` }}
                        ></div>
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate(`/tournament/${match._id}`)}
                      disabled={isFull}
                      className={`px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all ${
                        isFull
                          ? "bg-red-100 text-red-500 cursor-not-allowed border border-red-200"
                          : "bg-slate-900 text-white hover:bg-cyan-600 shadow-lg shadow-slate-200 hover:-translate-y-1"
                      }`}
                    >
                      {isFull ? "Sold Out 🚫" : "Join Game"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="border-4 border-dashed border-slate-100 rounded-[50px] py-32 text-center">
            <h2 className="text-3xl font-black text-slate-800 uppercase italic mb-2">No Matches Scheduled</h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">
              Check back later or contact the admin!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;