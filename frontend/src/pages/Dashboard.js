import { useState, useEffect } from "react";

function Dashboard() {
  const [filter, setFilter] = useState("All");
  const [userInterests, setUserInterests] = useState([]);

  useEffect(() => {
    // Load the interests we saved in Register.js
    const savedInterests = JSON.parse(localStorage.getItem("userInterests") || "[]");
    setUserInterests(savedInterests);
  }, []);

  const tournaments = [
    { id: 1, title: "Hyderabad Smashers Cup", sport: "Badminton", date: "Oct 12", location: "Gachibowli", fee: "₹400" },
    { id: 2, title: "City Football League", sport: "Football", date: "Oct 15", location: "Madhapur", fee: "₹1000" },
    { id: 3, title: "Weekend Cricket Bash", sport: "Cricket", date: "Oct 20", location: "Uppal", fee: "₹1500" },
    { id: 4, title: "Telangana Chess Open", sport: "Chess", date: "Oct 22", location: "Secunderabad", fee: "₹200" },
    { id: 5, title: "Premier Volleyball League", sport: "Volleyball", date: "Oct 25", location: "Kukatpally", fee: "₹500" },
    { id: 6, title: "Clay Court Tennis Meet", sport: "Tennis", date: "Oct 28", location: "Jubilee Hills", fee: "₹800" },
    { id: 7, title: "Gully Cricket Championship", sport: "Cricket", date: "Nov 02", location: "Banjara Hills", fee: "₹300" },
    { id: 8, title: "Corporate Football Trophy", sport: "Football", date: "Nov 05", location: "Financial District", fee: "₹2500" },
    { id: 9, title: "Elite Badminton Singles", sport: "Badminton", date: "Nov 08", location: "Lingampally", fee: "₹600" },
    { id: 10, title: "Sunday Rapid Chess", sport: "Chess", date: "Nov 10", location: "Ameerpet", fee: "₹150" },
    { id: 11, title: "Masters Tennis Cup", sport: "Tennis", date: "Nov 12", location: "Hitech City", fee: "₹1200" },
    { id: 12, title: "Pro Beach Volleyball", sport: "Volleyball", date: "Nov 15", location: "DLF Cyber City", fee: "₹450" },
  ];

  const filtered = filter === "All" ? tournaments : tournaments.filter(t => t.sport === filter);

  return (
    <div className="bg-gray-50 min-h-screen p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-cyan-900 mb-2 italic tracking-tighter uppercase">
            Active Tournaments 📍
          </h1>
          <p className="text-gray-500 font-medium">Discover and join local sports events happening in your area.</p>
        </header>

        {/* Filters Section */}
        <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
          {["All", "Cricket", "Football", "Badminton", "Volleyball", "Chess", "Tennis"].map(sport => (
            <button 
              key={sport} onClick={() => setFilter(sport)}
              className={`px-8 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-sm ${
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
            
            return (
              <div key={t.id} className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group">
                {/* Visual Accent */}
                <div className={`h-2 w-full ${isRecommended ? 'bg-cyan-500' : 'bg-gray-200'}`}></div>
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                      isRecommended ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {t.sport} {isRecommended && "✨"}
                    </span>
                    <span className="text-lg font-black text-gray-800">{t.fee}</span>
                  </div>

                  {isRecommended && (
                    <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-tighter mb-1 animate-pulse">
                      Based on your interests
                    </p>
                  )}
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-cyan-600 transition-colors">
                    {t.title}
                  </h3>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center text-sm text-gray-500 gap-3">
                      <span className="text-lg">📅</span>
                      <span className="font-medium uppercase tracking-tight">{t.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 gap-3">
                      <span className="text-lg">📍</span>
                      <span className="font-medium uppercase tracking-tight">{t.location}</span>
                    </div>
                  </div>

                  <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-cyan-600 transition-all shadow-lg active:scale-95">
                    Apply Online
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-bold uppercase tracking-widest">No {filter} Tournaments found right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;