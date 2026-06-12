import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SelectInterests() {
  const [selectedSports, setSelectedSports] = useState([]);
  const navigate = useNavigate();

  const sports = ["Cricket", "Football", "Badminton", "Basketball", "Chess", "Tennis"];

  const toggleSport = (sport) => {
    if (selectedSports.includes(sport)) {
      setSelectedSports(selectedSports.filter((s) => s !== sport));
    } else {
      setSelectedSports([...selectedSports, sport]);
    }
  };

  const handleSave = () => {
    if (selectedSports.length === 0) {
      alert("Please select at least one sport!");
      return;
    }
    // Save to localStorage so the app knows interests are set
    localStorage.setItem("userInterests", JSON.stringify(selectedSports));
    navigate("/feed"); // Send them to the feed after picking
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase italic">
          Pick Your <span className="text-cyan-600">Sports</span>
        </h2>
        <p className="text-slate-500 text-sm mb-8 font-bold uppercase tracking-widest">
          Select the games you want to play
        </p>

        <div className="grid grid-cols-2 gap-3 mb-10">
          {sports.map((sport) => (
            <button
              key={sport}
              onClick={() => toggleSport(sport)}
              className={`p-4 rounded-2xl font-bold transition-all border-2 ${
                selectedSports.includes(sport)
                  ? "border-cyan-500 bg-cyan-50 text-cyan-700 shadow-md"
                  : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
              }`}
            >
              {sport} {selectedSports.includes(sport) && "✓"}
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-cyan-600 transition shadow-lg uppercase text-xs tracking-widest"
        >
          Continue to Feed
        </button>
      </div>
    </div>
  );
}

export default SelectInterests;