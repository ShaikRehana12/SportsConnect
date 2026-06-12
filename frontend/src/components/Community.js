import React from 'react';
import { MessageSquare, Users, Award, TrendingUp } from 'lucide-react';

export default function Community() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <h1 className="text-6xl font-[1000] italic uppercase tracking-tighter text-slate-900 mb-4">
            The <span className="text-cyan-500">Huddle.</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Where athletes connect and teams are born.</p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <CommunityCard 
            icon={<MessageSquare className="text-cyan-500" />}
            title="Team Finder"
            desc="Need a striker or a point guard? Post a request and build your dream team."
            count="124 Active Requests"
          />
          <CommunityCard 
            icon={<Users className="text-cyan-500" />}
            title="Local Squads"
            desc="Join verified local clubs and compete in exclusive member-only circuits."
            count="45 Registered Clubs"
          />
          <CommunityCard 
            icon={<Award className="text-cyan-500" />}
            title="Leaderboards"
            desc="Track the highest rated players in your city across all disciplines."
            count="Top 100 Live"
          />
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-12 text-center text-white">
          <TrendingUp className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
          <h2 className="text-4xl font-black italic uppercase mb-6">Ready to join the conversation?</h2>
          <button className="bg-cyan-500 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all">
            Open Global Chat
          </button>
        </div>
      </div>
    </div>
  );
}

const CommunityCard = ({ icon, title, desc, count }) => (
  <div className="p-10 rounded-[2.5rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl transition-all group">
    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8 group-hover:bg-cyan-500 group-hover:text-white transition-all">
      {icon}
    </div>
    <h3 className="text-2xl font-black italic uppercase text-slate-900 mb-4 tracking-tighter">{title}</h3>
    <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">{desc}</p>
    <div className="text-[10px] font-black text-cyan-600 uppercase tracking-widest bg-cyan-50 px-4 py-2 rounded-full inline-block">
      {count}
    </div>
  </div>
);