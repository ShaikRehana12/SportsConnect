import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Users, Trophy, Search, ChevronRight, Image as ImageIcon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Feed() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState("All");

  // Sport filters matrix matching your "Sports Connect" parameters
  const sportsCategories = ["All", "Cricket", "Football", "Badminton", "Basketball", "Chess", "Volleyball"];

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/matches/all");
        setMatches(res.data || []);
      } catch (err) {
        console.error("Error fetching client match stream:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedData();
  }, []);

  // Filter logic for structural search query and sport categories
  const filteredMatches = matches.filter((match) => {
    const matchesSport = selectedSport === "All" || match.sportType?.toLowerCase() === selectedSport.toLowerCase();
    const matchesSearch = match.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          match.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSport && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
      
      {/* HERO HERO SECTION */}
      <div className="bg-white border-b border-slate-100 px-6 py-12 md:py-16 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
          <div className="absolute top-12 left-10 w-72 h-72 bg-cyan-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-4 right-10 w-96 h-96 bg-cyan-100/40 rounded-full blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-100 px-3 py-1.5 rounded-full text-cyan-600 font-black text-[10px] uppercase tracking-widest mx-auto">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} /> Discover Live Contests
          </div>
          <h1 className="text-4xl md:text-5xl font-[1000] tracking-tighter uppercase italic text-slate-900 leading-none">
            Find Your Next <span className="text-cyan-500">Battleground</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 max-w-xl mx-auto">
            Explore and reserve spots in open tournaments, premium leagues, and local matchups happening across your community network.
          </p>
        </div>
      </div>

      {/* FILTER PANEL AND SEARCH CONTROL RACK */}
      <div className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Input Bar */}
        <div className="relative md:col-span-4 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search matching tournaments or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200/80 rounded-2xl text-xs font-bold shadow-sm outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
          />
        </div>

        {/* Dynamic Sport Filters Badges Container */}
        <div className="md:col-span-8 flex items-center gap-2 overflow-x-auto pb-2 pt-1 custom-scrollbar w-full">
          {sportsCategories.map((sport) => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex-shrink-0 border whitespace-nowrap ${
                selectedSport === sport
                  ? "bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-100"
                  : "bg-white text-slate-500 border-slate-200/60 hover:border-cyan-300 hover:text-cyan-600"
              }`}
            >
              {sport}
            </button>
          ))}
        </div>
      </div>

      {/* MATCH EVENT STREAM CARDS MATRIX */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-3">
            <div className="w-9 h-9 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">Loading Live Stream Records...</p>
          </div>
        ) : filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMatches.map((match) => {
              const currentRosterCount = match.players?.length || 0;
              const maxAllowedPlayers = match.maxPlayers || 10;
              const fillPercentage = Math.min((currentRosterCount / maxAllowedPlayers) * 100, 100);

              return (
                <motion.div
                  key={match._id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden flex flex-col group justify-between"
                >
                  <div>
                    {/* TOURNAMENT BANNER IMAGE HEADER */}
                    <div className="h-48 w-full bg-slate-100 relative overflow-hidden border-b border-slate-50">
                      {match.image && match.image !== "default-sports.jpg" ? (
                        <img
                          src={match.image}
                          alt={match.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 space-y-1 bg-slate-100">
                          <ImageIcon className="w-8 h-8 stroke-[1.5]" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sports Connect Match</span>
                        </div>
                      )}
                      
                      {/* SPORT TYPE FLUID FLOATING LABEL */}
                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-cyan-600 font-black text-[9px] px-3 py-1 uppercase rounded-lg tracking-widest shadow-sm border border-cyan-100/50">
                        {match.sportType || "Match"}
                      </span>
                    </div>

                    {/* DETAILS CARD BODY */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h2 className="text-lg font-black text-slate-900 uppercase italic tracking-tight leading-snug group-hover:text-cyan-600 transition-colors truncate">
                          {match.title || "Open Community Match"}
                        </h2>
                      </div>

                      {/* GEO AND TIMING ATTRIBUTES INFRASTRUCTURE */}
                      <div className="space-y-2 text-slate-500 text-xs font-semibold">
                        <div className="flex items-center gap-2.5">
                          <MapPin className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                          <span className="truncate">{match.location || "Venue Pending"}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Calendar className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                          <span>{match.date} {match.time ? `@ ${match.time}` : ""}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM SLOT FOOTER AREA AND CAPACITY RADIAL PROGRESS STRIP */}
                  <div className="p-6 pt-0 space-y-4">
                    <div className="border-t border-slate-100 pt-4">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 mb-1.5">
                        <span>Roster Availability</span>
                        <span className="text-slate-800">
                          <b className="text-cyan-600 font-black">{currentRosterCount}</b> / {maxAllowedPlayers} Slots
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan-500 rounded-full transition-all duration-500" 
                          style={{ width: `${fillPercentage}%` }} 
                        />
                      </div>
                    </div>

                    {/* SECURE CHECK-IN MATCH PROFILE REDIRECT ROUTER BUTTON */}
                    <Link
                      to={`/match/${match._id}`}
                      className="w-full py-4 bg-slate-900 text-white hover:bg-cyan-600 font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all group/btn shadow-lg shadow-slate-100 hover:shadow-cyan-100"
                    >
                      Inspect & Join Match
                      <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-slate-200 max-w-xl mx-auto p-8 shadow-sm">
            <Trophy className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-black text-slate-800 uppercase italic">No Tournaments Listed</h3>
            <p className="text-xs text-slate-400 font-medium mt-1 max-w-sm mx-auto">
              There are no available active matches filed for this sports discipline category yet. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}