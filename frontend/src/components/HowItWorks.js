import React from 'react';
import { motion } from 'framer-motion';
import { Search, MousePointerClick, Trophy, ShieldCheck, Zap, Globe } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      id: "01",
      title: "Discover Events",
      desc: "Explore a live grid of local tournaments. Filter by your favorite sport—whether it's Cricket, Badminton, or Chess—and find the perfect match for your skill level.",
      icon: <Search className="w-8 h-8 text-cyan-500" />,
      color: "from-cyan-500/20 to-transparent"
    },
    {
      id: "02",
      title: "Instant Registration",
      desc: "No more messy forms. Our one-click automated process secures your slot instantly. All your tournament data is synced directly to your athlete profile.",
      icon: <MousePointerClick className="w-8 h-8 text-cyan-500" />,
      color: "from-blue-500/20 to-transparent"
    },
    {
      id: "03",
      title: "Compete & Conquer",
      desc: "Show up at the venue, scan your digital entry, and dominate. Track your progress on the live leaderboards and earn your spot among the local elite.",
      icon: <Trophy className="w-8 h-8 text-cyan-500" />,
      color: "from-slate-900/20 to-transparent"
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-32 pb-20 font-sans selection:bg-cyan-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER SECTION */}
        <div className="mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-[2px] w-12 bg-cyan-500"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-600">The Blueprint</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-[1000] italic uppercase tracking-tighter text-slate-900 leading-[0.9]">
            How It <span className="text-cyan-500 text-stroke-thin">Works.</span>
          </h1>
        </div>

        {/* STEPS GRID */}
        <div className="grid md:grid-cols-3 gap-12 relative mb-32">
          {steps.map((step, index) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute -top-10 -left-4 text-9xl font-[1000] text-slate-50 opacity-10 group-hover:opacity-20 transition-opacity italic">
                {step.id}
              </div>
              <div className={`p-10 rounded-[3rem] border border-slate-100 bg-gradient-to-br ${step.color} bg-white shadow-sm hover:shadow-2xl transition-all duration-500`}>
                <div className="mb-8 p-4 bg-white rounded-2xl shadow-sm inline-block group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-black italic uppercase text-slate-900 mb-4 tracking-tighter">
                  {step.title}
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed text-sm">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FEATURES STRIP */}
        <div className="grid md:grid-cols-3 gap-8 py-16 border-y border-slate-100">
          <Feature icon={<Zap className="w-5 h-5"/>} text="Real-time Match Updates" />
          <Feature icon={<ShieldCheck className="w-5 h-5"/>} text="Verified Organizers Only" />
          <Feature icon={<Globe className="w-5 h-5"/>} text="Across Hyderabad & Beyond" />
        </div>

        {/* FINAL CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 bg-slate-900 rounded-[4rem] p-16 text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <h2 className="text-4xl md:text-6xl font-[1000] italic uppercase mb-8 leading-none">
            Ready to start your <br /><span className="text-cyan-500">First Match?</span>
          </h2>
          <button className="bg-cyan-500 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-slate-900 transition-all shadow-2xl">
            Register Now
          </button>
        </motion.div>
      </div>
    </div>
  );
};

const Feature = ({ icon, text }) => (
  <div className="flex items-center gap-4 px-6">
    <div className="text-cyan-500">{icon}</div>
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{text}</span>
  </div>
);

export default HowItWorks;