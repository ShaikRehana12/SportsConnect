import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Users, CheckCircle } from "lucide-react";

function Feed() {
  const [matches, setMatches] = useState([]);
  const [applyingId, setApplyingId] = useState(null);
  const [appliedMatches, setAppliedMatches] = useState([]);
  const [showPass, setShowPass] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const username = localStorage.getItem("userName") || "Player";

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

  const handleJoin = async (match) => {
    setApplyingId(match._id); // Start loading state for this specific button
    try {
      const userId = localStorage.getItem("userId");
      // Connect to your backend join endpoint
      await axios.post(`http://localhost:5000/api/matches/join/${match._id}`, { userId });
      
      // Success sequence
      setAppliedMatches([...appliedMatches, match._id]);
      setSelectedMatch(match);
      setTimeout(() => {
        setShowPass(true);
        setApplyingId(null);
      }, 800);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to join match");
      setApplyingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans pt-28">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">
            Your <span className="text-cyan-500">Feed</span>
          </h1>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-2">
            Welcome back, {username}! Ready for a game?
          </p>
        </header>

        {isLoading ? (
          <div className="py-20 text-center uppercase font-black text-slate-200 text-4xl animate-pulse">Loading Games...</div>
        ) : matches.length > 0 ? (
          <div className="grid gap-6">
            {matches.map((match) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                key={match._id} 
                className="bg-slate-50 border border-slate-100 rounded-[32px] p-8 flex flex-col md:flex-row justify-between items-center hover:shadow-xl transition-all group"
              >
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-slate-800 uppercase italic mb-2 group-hover:text-cyan-600 transition-colors">
                    {match.title || `${match.sport} Match`}
                  </h3>
                  <div className="flex gap-6 text-slate-500 font-bold text-xs uppercase tracking-tight">
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-500"/> {match.location}</span>
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-cyan-500"/> {match.time}</span>
                  </div>
                </div>

                <div className="mt-6 md:mt-0 flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest mb-1">
                      {match.players?.length || 0} Players Joined
                    </p>
                    <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="bg-cyan-500 h-full transition-all" style={{ width: `${(match.players?.length / 10) * 100}%` }}></div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleJoin(match)}
                    disabled={appliedMatches.includes(match._id) || applyingId === match._id}
                    className={`px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all ${
                      appliedMatches.includes(match._id) 
                        ? "bg-green-500 text-white" 
                        : applyingId === match._id 
                        ? "bg-slate-300 text-white cursor-wait" 
                        : "bg-slate-900 text-white hover:bg-cyan-600 shadow-lg shadow-slate-200 hover:-translate-y-1"
                    }`}
                  >
                    {applyingId === match._id ? "Joining..." : appliedMatches.includes(match._id) ? "Joined ✓" : "Join Game"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* THIS IS WHAT YOU SEE IN YOUR IMAGE_9480BF.PNG */
          <div className="border-4 border-dashed border-slate-100 rounded-[50px] py-32 text-center">
             <h2 className="text-3xl font-black text-slate-800 uppercase italic mb-2">No Matches Scheduled</h2>
             <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">Check back later or contact the admin!</p>
          </div>
        )}
      </div>

      {/* SUCCESS MODAL / ENTRY PASS */}
      <AnimatePresence>
        {showPass && selectedMatch && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[45px] p-10 max-w-sm w-full text-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black uppercase italic italic mb-8">You're in the <span className="text-cyan-600">Game!</span></h2>
              
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 mb-8 text-left relative">
                 <p className="text-[8px] font-black text-cyan-600 uppercase mb-4 tracking-widest">Official Entry Pass</p>
                 <h4 className="text-lg font-black text-slate-800 uppercase italic">{selectedMatch.title}</h4>
                 <p className="text-[10px] text-slate-500 font-bold mb-4 uppercase">{selectedMatch.location} @ {selectedMatch.time}</p>
                 <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                    <p className="text-xs font-black uppercase">{username}</p>
                    <div className="w-8 h-8 bg-slate-200 rounded-md"></div>
                 </div>
              </div>

              <button onClick={() => setShowPass(false)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest">
                Got it, Let's Play
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Feed;