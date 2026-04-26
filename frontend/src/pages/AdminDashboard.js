import { useState } from "react";

function AdminDashboard() {
  const [newTournament, setNewTournament] = useState({
    title: "", sport: "Cricket", date: "", location: "", fee: "", description: ""
  });

  const [tournaments, setTournaments] = useState([
    { id: 1, title: "Hyderabad Smashers Cup", sport: "Badminton", registrations: 12 },
    { id: 2, title: "City Football League", sport: "Football", registrations: 45 },
  ]);

  const handleCreate = (e) => {
    e.preventDefault();
    // In MERN, you would do: axios.post('/api/tournaments', newTournament)
    const id = tournaments.length + 1;
    setTournaments([...tournaments, { ...newTournament, id, registrations: 0 }]);
    alert("Tournament Published Successfully! ✅");
    setNewTournament({ title: "", sport: "Cricket", date: "", location: "", fee: "", description: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: ADD NEW TOURNAMENT */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-xl border-t-4 border-cyan-600">
            <h2 className="text-2xl font-black text-cyan-900 mb-6 uppercase tracking-tighter italic">Post New Event 📢</h2>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Tournament Title</label>
                <input 
                  type="text" required value={newTournament.title}
                  className="w-full mt-1 p-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition"
                  onChange={(e) => setNewTournament({...newTournament, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Sport</label>
                  <select 
                    className="w-full mt-1 p-3 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500"
                    onChange={(e) => setNewTournament({...newTournament, sport: e.target.value})}
                  >
                    <option>Cricket</option>
                    <option>Football</option>
                    <option>Badminton</option>
                    <option>Volleyball</option>
                    <option>Chess</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Entry Fee</label>
                  <input 
                    type="text" placeholder="₹"
                    className="w-full mt-1 p-3 border border-gray-100 rounded-xl outline-none"
                    onChange={(e) => setNewTournament({...newTournament, fee: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Date & Location</label>
                <div className="flex gap-2">
                  <input type="date" className="w-1/2 p-3 border border-gray-100 rounded-xl text-xs" onChange={(e) => setNewTournament({...newTournament, date: e.target.value})} />
                  <input type="text" placeholder="Area" className="w-1/2 p-3 border border-gray-100 rounded-xl text-xs" onChange={(e) => setNewTournament({...newTournament, location: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-cyan-700 shadow-lg shadow-cyan-100 transition-all mt-4">
                Publish Tournament
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: MANAGE TOURNAMENTS */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-800 mb-6 uppercase tracking-tighter">Live Events Overview</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                    <th className="pb-4">Tournament</th>
                    <th className="pb-4">Sport</th>
                    <th className="pb-4">Applicants</th>
                    <th className="pb-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tournaments.map((t) => (
                    <tr key={t.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-bold text-gray-800">{t.title}</td>
                      <td className="py-4"><span className="bg-cyan-50 text-cyan-600 text-[10px] font-bold px-2 py-1 rounded">{t.sport}</span></td>
                      <td className="py-4 font-black text-cyan-600">{t.registrations}</td>
                      <td className="py-4">
                        <button className="text-red-400 hover:text-red-600 font-bold text-xs uppercase">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;