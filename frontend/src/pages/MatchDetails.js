import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Calendar, Clock, Users, ArrowLeft, Trophy } from 'lucide-react';

export default function MatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/matches/all`);
        // Find the specific item matching our URL ID parameter
        const found = res.data.find(m => m._id === id);
        setMatch(found);
        setLoading(false);
      } catch (err) {
        console.error("Error retrieving match details:", err);
        setLoading(false);
      }
    };
    fetchMatchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Tournament Specifications...</p>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <p className="text-xs font-black uppercase tracking-widest text-rose-500">Tournament Record Not Found</p>
        <button onClick={() => navigate(-1)} className="text-xs font-bold text-slate-600 underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </button>

        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="relative h-64 bg-slate-900">
            {match.image && match.image !== "default-sports.jpg" ? (
              <img src={match.image} alt="Banner" className="w-full h-full object-cover opacity-80" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-800">
                <Trophy className="w-12 h-12 stroke-[1]" />
              </div>
            )}
            <span className="absolute bottom-6 left-8 bg-cyan-600 text-white font-black text-[10px] px-4 py-1.5 uppercase rounded-xl tracking-widest shadow-md">
              {match.sportType}
            </span>
          </div>

          <div className="p-8 md:p-10 space-y-8">
            <div>
              <h1 className="text-3xl font-black uppercase italic text-slate-900 leading-none">{match.title}</h1>
              {match.entryFee > 0 ? (
                <p className="text-cyan-600 font-black text-sm mt-2">Entry Fee: ₹{match.entryFee}</p>
              ) : (
                <p className="text-emerald-600 font-black text-sm mt-2">Free Entry</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-y border-slate-100 py-6">
              <div className="flex items-center gap-3 text-slate-700 text-sm font-semibold">
                <MapPin className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                <span>{match.location}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 text-sm font-semibold">
                <Calendar className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                <span>{match.date} {match.time ? `at ${match.time}` : ''}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 mb-2">
                <span>Registration Status</span>
                <span className="text-slate-800">{match.players?.length || 0} / {match.maxPlayers} Spots Taken</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-600 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(((match.players?.length || 0) / match.maxPlayers) * 100, 100)}%` }}
                />
              </div>
            </div>

            <button className="w-full py-4 bg-slate-900 hover:bg-cyan-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg transition-all active:scale-[0.98]">
              {match.entryFee > 0 ? `Pay ₹${match.entryFee} & Register` : 'Secure My Spot Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}