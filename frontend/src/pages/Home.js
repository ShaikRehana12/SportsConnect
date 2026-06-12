// import React, { useEffect, useRef } from "react";
// import cricket from "../assets/cricket.jpg";
// import football from "../assets/football.jpg";
// import badminton from "../assets/badminton.jpg";
// import volleyball from "../assets/volleyball.jpg";

// function Home() {
//   const scrollRef = useRef(null);
//   const images = [
//     { src: cricket, name: "Cricket" },
//     { src: football, name: "Football" },
//     { src: badminton, name: "Badminton" },
//     { src: volleyball, name: "Volleyball" },
//   ];
//   const displayImages = [...images, ...images];

//   useEffect(() => {
//     const scrollContainer = scrollRef.current;
//     if (!scrollContainer) return;
//     let frame;
//     const scroll = () => {
//       scrollContainer.scrollLeft += 1;
//       if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) scrollContainer.scrollLeft = 0;
//       frame = requestAnimationFrame(scroll);
//     };
//     frame = requestAnimationFrame(scroll);
//     return () => cancelAnimationFrame(frame);
//   }, []);

//   return (
//     <div className="bg-white min-h-screen text-gray-900 font-sans">
      
//       {/* HERO SECTION - Quote Centered */}
//       <section className="h-[80vh] flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-cyan-50 to-white">
//         <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 uppercase italic leading-none">
//           Connect. Compete.
//           <span className="text-cyan-500">Conquer. 🏆</span>
//         </h1>
//         <p className="text-gray-500 max-w-2xl text-lg md:text-xl font-medium mb-10 tracking-wide">
//           The world's most advanced platform for local sports tournaments. ⚡
//         </p>
//         <div className="flex gap-4">
//           <button className="px-10 py-4 bg-cyan-500 hover:bg-cyan-600 text-white transition-all rounded-full font-black text-lg uppercase tracking-widest shadow-xl shadow-cyan-200">
//             Join a League 📩
//           </button>
//         </div>
//       </section>

//       {/* AUTO-SCROLLING CATEGORIES */}
//       <section className="py-16 bg-white border-y border-gray-100">
//         <h2 className="text-center text-cyan-600 font-bold tracking-[0.4em] uppercase mb-12 text-xs">
//           Explore Disciplines 🏁
//         </h2>
//         <div ref={scrollRef} className="flex gap-8 overflow-x-hidden whitespace-nowrap py-4">
//           {displayImages.map((item, i) => (
//             <div key={i} className="min-w-[300px] group relative rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 transition-all duration-500 hover:-translate-y-2">
//               <img src={item.src} alt={item.name} className="w-full h-64 object-cover" />
//               <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/90 via-transparent to-transparent flex items-end p-8">
//                 <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{item.name}</h3>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* INFO SECTION */}
//       <section className="max-w-7xl mx-auto px-6 py-32">
//         <div className="grid md:grid-cols-3 gap-12">
//           <InfoCard emoji="🎯" title="Smart Matching" desc="Find the perfect tournament for your skill level instantly." />
//           <InfoCard emoji="📩" title="Instant Alerts" desc="Direct notifications for game times and registration openings." />
//           <InfoCard emoji="🥇" title="Easy Registration" desc="Register quickly with a simple, one-click process." />
//         </div>
//       </section>
//     </div>
//   );
// }

// const InfoCard = ({ emoji, title, desc }) => (
//   <div className="p-10 rounded-[2.5rem] bg-cyan-50/50 border border-cyan-100 hover:bg-white hover:shadow-2xl transition-all duration-300 group text-center">
//     <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{emoji}</div>
//     <h4 className="text-2xl font-black text-cyan-700 mb-4 uppercase italic tracking-tighter">{title}</h4>
//     <p className="text-gray-600 leading-relaxed">{desc}</p>
//   </div>
// );

// export default Home;
import React, { useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Bell, Target, Award, Users } from "lucide-react";

// Assets
import cricket from "../assets/cricket.jpg";
import football from "../assets/football.jpg";
import badminton from "../assets/badminton.jpg";
import volleyball from "../assets/volleyball.jpg";

function Home() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const images = [
    { src: cricket, name: "Cricket" },
    { src: football, name: "Football" },
    { src: badminton, name: "Badminton" },
    { src: volleyball, name: "Volleyball" },
  ];
  
  const displayImages = [...images, ...images, ...images];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    let frame;
    const scroll = () => {
      scrollContainer.scrollLeft += 0.8;
      if (scrollContainer.scrollLeft >= (scrollContainer.scrollWidth / 3) * 2) {
        scrollContainer.scrollLeft = scrollContainer.scrollWidth / 3;
      }
      frame = requestAnimationFrame(scroll);
    };
    frame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans selection:bg-cyan-100 selection:text-cyan-900">
      
  <nav className="fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-md border-b border-gray-100">
  <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="bg-cyan-500 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-100">
        <span className="text-white font-black text-2xl italic tracking-tighter">SC</span>
      </div>
      <span className="text-2xl font-[1000] italic uppercase tracking-tighter text-slate-900">
        Sports<span className="text-cyan-500">Connect</span>
      </span>
    </div>
    
    <div className="hidden md:flex gap-10 items-center">
      {['Tournaments', 'Community', 'How it Works'].map((link) => (
        <Link 
          key={link}
          to={`/${link.toLowerCase().replace(/\s+/g, '')}`} 
          className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-cyan-600 transition-colors"
        >
          {link}
        </Link>
      ))}
      <button 
        onClick={() => navigate("/login")}
        className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-cyan-600 transition-all shadow-xl shadow-slate-200"
      >
        Get Started
      </button>
    </div>
  </div>
</nav>
      {/* HERO SECTION - RECLAIMING THE ORIGINAL TITLE */}
      <section className="relative pt-32 pb-20 flex flex-col items-center justify-center text-center px-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-50 via-white to-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-white border border-cyan-100 px-4 py-2 rounded-full mb-8 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600">Join the Local Elite</span>
          </div>
          
          <h1 className="text-6xl md:text-[120px] font-[1000] tracking-[-0.05em] mb-8 uppercase italic leading-[0.85] text-slate-900">
            Connect. <br />
            Compete. <br />
            <span className="text-cyan-500">Conquer. 🏆</span>
          </h1>
          
          <p className="text-gray-500 max-w-xl mx-auto text-lg md:text-xl font-medium mb-12 leading-relaxed">
            The world's most advanced platform for local sports tournaments. Find your team and dominate the court.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate("/dashboard")}
              className="group px-10 py-5 bg-cyan-500 hover:bg-slate-900 text-white transition-all rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-cyan-200 flex items-center justify-center gap-3"
            >
              Join a League <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
           <button 
  onClick={() => navigate("/community")}
  className="px-10 py-5 bg-white border border-gray-100 hover:border-cyan-500 text-gray-900 transition-all rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2 shadow-sm hover:shadow-md"
>
  <Users className="w-4 h-4 text-cyan-500" /> Join Community
</button>
          </div>
        </motion.div>
      </section>

      {/* AUTO-SCROLLING CATEGORIES */}
      <section className="py-24 bg-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <h2 className="text-white font-black tracking-[0.4em] uppercase text-xs">
            Explore Disciplines 🏁
          </h2>
        </div>
        
        <div ref={scrollRef} className="flex gap-6 overflow-x-hidden whitespace-nowrap py-4">
          {displayImages.map((item, i) => (
            <div 
              key={i} 
              onClick={() => navigate("/dashboard")}
              className="min-w-[320px] group relative rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-700 hover:scale-95 cursor-pointer"
            >
              <img src={item.src} alt={item.name} className="w-full h-80 object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex items-end p-10">
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{item.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div className="p-10 rounded-[3rem] bg-cyan-50/50 border border-cyan-100">
            <Target className="w-12 h-12 text-cyan-500 mx-auto mb-6" />
            <h4 className="text-xl font-black text-slate-900 mb-4 uppercase italic tracking-tight">Smart Matching</h4>
            <p className="text-gray-500 text-sm leading-relaxed">Find tournaments that match your skill level instantly.</p>
          </div>
          <div className="p-10 rounded-[3rem] bg-cyan-50/50 border border-cyan-100">
            <Bell className="w-12 h-12 text-cyan-500 mx-auto mb-6" />
            <h4 className="text-xl font-black text-slate-900 mb-4 uppercase italic tracking-tight">Instant Alerts</h4>
            <p className="text-gray-500 text-sm leading-relaxed">Direct notifications for game times and registration updates.</p>
          </div>
          <div className="p-10 rounded-[3rem] bg-cyan-50/50 border border-cyan-100">
            <Award className="w-12 h-12 text-cyan-500 mx-auto mb-6" />
            <h4 className="text-xl font-black text-slate-900 mb-4 uppercase italic tracking-tight">Easy Registration</h4>
            <p className="text-gray-500 text-sm leading-relaxed">Register quickly with a simple, one-click automated process.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;