import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const [filter, setFilter] = useState("All");
  const [userInterests, setUserInterests] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Load user interests for the recommendation engine
    const savedInterests = JSON.parse(localStorage.getItem("userInterests") || "[]");
    setUserInterests(savedInterests);

    // 2. Fetch live matches from your backend
    const fetchMatches = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/matches/all");
        setMatches(res.data);
      } catch (err) {
        console.error("Error fetching matches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // Filter logic based on the selected sport
  const filtered = filter === "All" 
    ? matches 
    : matches.filter(t => t.sport?.toLowerCase() === filter.toLowerCase());

  const handleApply = (matchId) => {
    // Navigate to a detailed view of the match to join/apply
    navigate(`/match/${matchId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-cyan-900 mb-2 italic tracking-tighter uppercase">
              Active Tournaments 📍
            </h1>
            <p className="text-gray-500 font-medium">Discover and join local sports events happening in your area.</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Updates</p>
            <p className="text-sm font-bold text-cyan-600">{matches.length} Events Available</p>
          </div>
        </header>

        {/* Filters Section */}
        <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
          {["All", "Cricket", "Football", "Badminton", "Volleyball", "Chess", "Tennis"].map(sport => (
            <button 
              key={sport} onClick={() => setFilter(sport)}
              className={`px-8 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-sm whitespace-nowrap ${
                filter === sport 
                ? 'bg-cyan-600 text-white shadow-cyan-200 shadow-lg scale-105' 
                : 'bg-white text-gray-500 border border-gray-100 hover:border-cyan-400 hover:text-cyan-600'
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        {/* Tournament Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(t => {
            const isRecommended = userInterests.includes(t.sport);
            // Dynamic image fallback logic
            const displayImage = t.imageUrl || `https://source.unsplash.com/featured/?${t.sport},sports`;
            
            return (
              <div key={t._id} className="bg-white rounded-[32px] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden group">
                {/* Event Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={displayImage} 
                    alt={t.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-lg">
                    <span className="text-xs font-black text-gray-900 italic uppercase">
                      {t.maxPlayers - (t.players?.length || 0)} Slots Left
                    </span>
                  </div>
                  {isRecommended && (
                    <div className="absolute top-4 left-4 bg-cyan-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                      Recommended ✨
                    </div>
                  )}
                </div>
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                      isRecommended ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {t.sport}
                    </span>
                    <span className="text-lg font-black text-slate-900">FREE</span> 
                  </div>

                  <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-cyan-600 transition-colors uppercase italic tracking-tight">
                    {t.title || `${t.sport} Match`}
                  </h3>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center text-xs text-gray-500 gap-3">
                      <span className="bg-slate-100 p-2 rounded-lg">📅</span>
                      <span className="font-bold uppercase tracking-tight">{t.date} at {t.time}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 gap-3">
                      <span className="bg-slate-100 p-2 rounded-lg">📍</span>
                      <span className="font-bold uppercase tracking-tight">{t.location}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleApply(t._id)}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-cyan-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    View Details & Join
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
            <div className="text-4xl mb-4">🏟️</div>
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
              No {filter} Tournaments found in your region.
            </p>
            <button 
              onClick={() => setFilter("All")}
              className="mt-6 text-cyan-600 font-bold text-xs uppercase underline"
            >
              Show all sports
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;