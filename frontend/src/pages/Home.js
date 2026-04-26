import React, { useEffect, useRef } from "react";
import cricket from "../assets/cricket.jpg";
import football from "../assets/football.jpg";
import badminton from "../assets/badminton.jpg";
import volleyball from "../assets/volleyball.jpg";

function Home() {
  const scrollRef = useRef(null);
  const images = [
    { src: cricket, name: "Cricket" },
    { src: football, name: "Football" },
    { src: badminton, name: "Badminton" },
    { src: volleyball, name: "Volleyball" },
  ];
  const displayImages = [...images, ...images];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    let frame;
    const scroll = () => {
      scrollContainer.scrollLeft += 1;
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) scrollContainer.scrollLeft = 0;
      frame = requestAnimationFrame(scroll);
    };
    frame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans">
      
      {/* HERO SECTION - Quote Centered */}
      <section className="h-[80vh] flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-cyan-50 to-white">
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 uppercase italic leading-none">
          Connect. Compete.
          <span className="text-cyan-500">Conquer. 🏆</span>
        </h1>
        <p className="text-gray-500 max-w-2xl text-lg md:text-xl font-medium mb-10 tracking-wide">
          The world's most advanced platform for local sports tournaments. ⚡
        </p>
        <div className="flex gap-4">
          <button className="px-10 py-4 bg-cyan-500 hover:bg-cyan-600 text-white transition-all rounded-full font-black text-lg uppercase tracking-widest shadow-xl shadow-cyan-200">
            Join a League 📩
          </button>
        </div>
      </section>

      {/* AUTO-SCROLLING CATEGORIES */}
      <section className="py-16 bg-white border-y border-gray-100">
        <h2 className="text-center text-cyan-600 font-bold tracking-[0.4em] uppercase mb-12 text-xs">
          Explore Disciplines 🏁
        </h2>
        <div ref={scrollRef} className="flex gap-8 overflow-x-hidden whitespace-nowrap py-4">
          {displayImages.map((item, i) => (
            <div key={i} className="min-w-[300px] group relative rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 transition-all duration-500 hover:-translate-y-2">
              <img src={item.src} alt={item.name} className="w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/90 via-transparent to-transparent flex items-end p-8">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{item.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INFO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid md:grid-cols-3 gap-12">
          <InfoCard emoji="🎯" title="Smart Matching" desc="Find the perfect tournament for your skill level instantly." />
          <InfoCard emoji="📩" title="Instant Alerts" desc="Direct notifications for game times and registration openings." />
          <InfoCard emoji="🥇" title="Easy Registration" desc="Register quickly with a simple, one-click process." />
        </div>
      </section>
    </div>
  );
}

const InfoCard = ({ emoji, title, desc }) => (
  <div className="p-10 rounded-[2.5rem] bg-cyan-50/50 border border-cyan-100 hover:bg-white hover:shadow-2xl transition-all duration-300 group text-center">
    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{emoji}</div>
    <h4 className="text-2xl font-black text-cyan-700 mb-4 uppercase italic tracking-tighter">{title}</h4>
    <p className="text-gray-600 leading-relaxed">{desc}</p>
  </div>
);

export default Home;