import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Users, Trophy, Calendar, BarChart3, Shield, Plus, Search, Trash2, X, Image as ImageIcon, CheckCircle, AlertTriangle, MapPin, Clock, Edit2, Save, Layers, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CUSTOM UI COMPONENTS ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`px-8 py-6 border-b border-slate-50 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h2 className={`text-xl font-black italic uppercase text-slate-800 ${className}`}>{children}</h2>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, className = "", variant = "primary", type = "button", disabled = false }) => {
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-cyan-600 shadow-lg shadow-slate-200",
    outline: "border border-slate-200 text-slate-600 hover:bg-slate-50",
    ghost: "text-slate-400 hover:text-red-600 hover:bg-red-50",
    cyan: "bg-cyan-600 text-white hover:bg-slate-900 shadow-lg shadow-cyan-100",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 font-semibold text-sm transition-all ${className}`}
  />
);

// --- MAIN DASHBOARD COMPONENT ---

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Track URL query parameters for dynamic filter tracking
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const currentFilter = queryParams.get("filter"); // "upcoming" | "live" | null
  
  const [selectedMatchDetails, setSelectedMatchDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', location: '', date: '', time: '', maxPlayers: 10 });
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [newMatch, setNewMatch] = useState({ 
    title: '', 
    sport: 'Cricket', 
    venueLocation: '', 
    time: '', 
    date: '', 
    maxPlayers: 10 
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Sync edit form fields when a new event row is clicked
  useEffect(() => {
    if (selectedMatchDetails) {
      setEditForm({
        title: selectedMatchDetails.title || '',
        location: selectedMatchDetails.location || '',
        date: selectedMatchDetails.date || '',
        time: selectedMatchDetails.time || '',
        maxPlayers: selectedMatchDetails.maxPlayers || 10
      });
      setIsEditing(false);
    }
  }, [selectedMatchDetails]);

  const showNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/matches/all");
      setMatches(res.data || []);
      
      if (selectedMatchDetails) {
        const currentTarget = res.data.find(m => m._id === selectedMatchDetails._id);
        if (currentTarget) setSelectedMatchDetails(currentTarget);
      }
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    const userId = localStorage.getItem("userId") || "mock_admin_id_123";
    const token = localStorage.getItem("token") || "mock_token_abc";

    const formData = new FormData();
    formData.append("title", newMatch.title);
    formData.append("sportType", newMatch.sport); 
    formData.append("location", newMatch.venueLocation);
    formData.append("date", newMatch.date);
    formData.append("time", newMatch.time);
    formData.append("maxPlayers", Number(newMatch.maxPlayers));
    formData.append("organizer", userId);
    
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      await axios.post("http://localhost:5000/api/matches/create", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });

      setIsModalOpen(false);
      setSelectedFile(null);
      setNewMatch({ 
        title: '', 
        sport: 'Cricket', 
        venueLocation: '', 
        time: '', 
        date: '', 
        maxPlayers: 10 
      });
      
      fetchData(); 
      showNotification("Tournament feed launched successfully!", "success");
    } catch (err) {
      showNotification("Failed to publish event.", "error");
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(`http://localhost:5000/api/matches/${selectedMatchDetails._id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      showNotification("Event parameters synchronized successfully.", "success");
      fetchData();
    } catch (err) {
      showNotification("Failed to save changes down to backend.", "error");
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); 
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/matches/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (selectedMatchDetails?._id === id) setSelectedMatchDetails(null);
      fetchData();
      showNotification("Tournament record dropped permanently.", "success");
    } catch (err) {
      showNotification("Could not complete removal transaction.", "error");
    }
  };

  const todayStart = new Date().setHours(0, 0, 0, 0);

  const upcomingMatches = matches.filter(m => m.date && new Date(m.date).setHours(0, 0, 0, 0) > todayStart);
  const liveMatches = matches.filter(m => m.date && new Date(m.date).setHours(0, 0, 0, 0) === todayStart);

  const baseFilteredList = currentFilter === 'upcoming' 
    ? upcomingMatches 
    : currentFilter === 'live' 
    ? liveMatches 
    : matches;

  const filteredMatches = baseFilteredList.filter(m => 
    m.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.sportType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 relative">
      
      {/* GLOBAL TOAST */}
      <div className="fixed bottom-6 right-6 z-[200] max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toast.show && (
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className={`p-4 rounded-2xl shadow-xl flex items-center gap-3 border pointer-events-auto backdrop-blur-md bg-white/90 ${toast.type === 'success' ? 'border-emerald-100' : 'border-rose-100'}`}
            >
              {toast.type === 'success' ? (
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle className="w-5 h-5" /></div>
              ) : (
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><AlertTriangle className="w-5 h-5" /></div>
              )}
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">System Status</p>
                <p className="text-xs font-bold mt-0.5 leading-tight">{toast.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* HEADER SECTION */}
      <header className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-600 p-2 rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 italic uppercase leading-none">Admin <span className="text-cyan-600">Hub</span></h1>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">SportsConnect Management</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search tournaments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold w-64 outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />
              </div>
              <Button variant="cyan" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> New Event
              </Button>
            </div>
          </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <StatCard title="Total Matches" value={matches.length} icon={Trophy} interactive={false} />
           <StatCard title="Total Players" value={matches.reduce((a, b) => a + (b.players?.length || 0), 0)} icon={Users} interactive={false} />
           <StatCard title="Upcoming" value={upcomingMatches.length} icon={Calendar} active={currentFilter === 'upcoming'} interactive={false} />
           <StatCard title="Live Today" value={liveMatches.length} icon={Radio} active={currentFilter === 'live'} interactive={false} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* TOURNAMENT LIVE LIST VIEW */}
          <div className={selectedMatchDetails ? "lg:col-span-2 space-y-4" : "lg:col-span-3 space-y-4"}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between bg-white">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {currentFilter === "upcoming" && <Calendar className="w-5 h-5 text-cyan-600" />}
                    {currentFilter === "live" && <Radio className="w-5 h-5 text-emerald-500 animate-pulse" />}
                    {!currentFilter && <Layers className="w-5 h-5 text-cyan-600" />}
                    {currentFilter === 'upcoming' ? "Upcoming Schedule" : currentFilter === 'live' ? "Live Dashboard" : "Live Tournament Control"}
                  </CardTitle>
                  <p className="text-[9px] font-bold text-cyan-600 uppercase tracking-wider mt-1">
                    Viewing: {currentFilter === 'upcoming' ? "Upcoming Schedule" : currentFilter === 'live' ? "Live Matches" : "All Records"}
                  </p>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase">{filteredMatches.length} Displayed</p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                      <tr>
                        <th className="px-8 py-5">Tournament & Sport</th>
                        <th className="px-8 py-5">Players Joined</th>
                        <th className="px-8 py-5">Venue & Date</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredMatches.length > 0 ? (
                        filteredMatches.map((m) => {
                          const matchTimeInt = new Date(m.date).setHours(0,0,0,0);
                          const isFuture = matchTimeInt > todayStart;
                          const isLiveToday = matchTimeInt === todayStart;

                          return (
                            <tr key={m._id} 
                              onClick={(e) => {
                                e.preventDefault(); 
                                setSelectedMatchDetails(m);
                              }}
                              className={`hover:bg-slate-50/80 transition-all cursor-pointer group ${selectedMatchDetails?._id === m._id ? 'bg-cyan-50/40 border-l-4 border-l-cyan-600' : ''}`}
                            >
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                  {m.image && m.image !== "default-sports.jpg" ? (
                                    <img src={m.image} alt="icon" className="w-10 h-10 rounded-lg object-cover bg-slate-100 shadow-sm" />
                                  ) : (
                                    <div className="w-10 h-10 bg-slate-100 text-slate-400 flex items-center justify-center rounded-lg">
                                      <ImageIcon className="w-4 h-4" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-black text-slate-800 text-sm uppercase italic group-hover:text-cyan-600 transition-colors">{m.title || "Untitled Match"}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[10px] text-slate-400 font-bold uppercase">{m.sportType}</span>
                                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                        isFuture ? "bg-cyan-50 text-cyan-600 border border-cyan-100" : isLiveToday ? "bg-emerald-50 text-emerald-600 border border-emerald-100 animate-pulse" : "bg-slate-100 text-slate-500"
                                      }`}>
                                        {isFuture ? "Upcoming" : isLiveToday ? "Live" : "Concluded"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                  <div className="flex items-center gap-2">
                                   <span className="text-lg font-black text-slate-900">{m.players?.length || 0}</span>
                                   <span className="text-slate-300 text-xs font-bold">/ {m.maxPlayers || 10}</span>
                                  </div>
                              </td>
                              <td className="px-8 py-6">
                                <p className="text-xs font-bold text-slate-600 uppercase">{m.location}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{m.date} {m.time ? `| ${m.time}` : ''}</p>
                              </td>
                              <td className="px-8 py-6 text-right">
                                <button onClick={(e) => handleDelete(e, m._id)} className="p-2 text-slate-300 hover:text-red-600 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold uppercase text-xs">No matching tournaments found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT DETAILS PANEL: DYNAMIC VIEW OR INLINE EDITING MANAGEMENT */}
          <AnimatePresence>
            {selectedMatchDetails && (
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="lg:col-span-1">
                <Card className="border-cyan-600/20 shadow-md sticky top-28">
                  <div className="relative h-40 bg-slate-900">
                    {selectedMatchDetails.image && selectedMatchDetails.image !== "default-sports.jpg" ? (
                      <img src={selectedMatchDetails.image} alt="Banner" className="w-full h-full object-cover opacity-70" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-900">
                        <ImageIcon className="w-10 h-10 stroke-[1]" />
                      </div>
                    )}
                    <button onClick={() => { setSelectedMatchDetails(null); setIsEditing(false); }} className="absolute top-4 right-4 p-2 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full transition-all">
                      <X className="w-4 h-4" />
                    </button>
                    <span className="absolute bottom-4 left-6 bg-cyan-600 text-white font-black text-[9px] px-3 py-1 uppercase rounded-md tracking-wider shadow-md">
                      {selectedMatchDetails.sportType}
                    </span>
                  </div>

                  <CardContent className="p-8 space-y-6">
                    {isEditing ? (
                      // INLINE ADMINISTRATIVE EDIT FORM
                      <form onSubmit={handleUpdateEvent} className="space-y-4">
                        <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Edit Event Title</label>
                          <Input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} required />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Venue Location</label>
                          <Input value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} required />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Date</label>
                            <Input type="date" value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})} required />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Time</label>
                            <Input type="time" value={editForm.time} onChange={e => setEditForm({...editForm, time: e.target.value})} required />
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Maximum Capacity</label>
                          <Input type="number" value={editForm.maxPlayers} onChange={e => setEditForm({...editForm, maxPlayers: Number(e.target.value)})} required />
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <Button type="button" variant="outline" className="w-full text-center justify-center py-3.5" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" variant="cyan" className="w-full flex items-center justify-center gap-2 py-3.5">
                            <Save className="w-3.5 h-3.5" /> Save
                          </Button>
                        </div>
                      </form>
                    ) : (
                      // READ-ONLY DISPLAY METADATA
                      <>
                        <div>
                          <h3 className="text-xl font-black uppercase italic text-slate-900 tracking-tight leading-tight">{selectedMatchDetails.title}</h3>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">ID: #{selectedMatchDetails._id}</p>
                        </div>

                        <div className="space-y-3 border-y border-slate-50 py-4">
                          <div className="flex items-center gap-3 text-slate-600 text-xs font-semibold">
                            <MapPin className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                            <span>{selectedMatchDetails.location}</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-600 text-xs font-semibold">
                            <Clock className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                            <span>{selectedMatchDetails.date} {selectedMatchDetails.time ? `at ${selectedMatchDetails.time}` : ''}</span>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 mb-2">
                            <span>Squad Registry Fill</span>
                            <span className="text-slate-700 font-black">{selectedMatchDetails.players?.length || 0} / {selectedMatchDetails.maxPlayers} Filled</span>
                          </div>
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-cyan-600 rounded-full transition-all duration-500" 
                              style={{ width: `${Math.min(( (selectedMatchDetails.players?.length || 0) / selectedMatchDetails.maxPlayers) * 100, 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <Button 
                            variant="cyan" 
                            className="w-full flex items-center justify-center gap-2 py-4" 
                            onClick={() => setIsEditing(true)}
                          >
                            <Edit2 className="w-4 h-4" /> Edit Event Parameters
                          </Button>
                        </div>

                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">Enrolled Users Stack</h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                            {selectedMatchDetails.players && selectedMatchDetails.players.length > 0 ? (
                              selectedMatchDetails.players.map((p, index) => (
                                <div key={index} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                                  <span className="text-xs font-bold text-slate-700">{p.name || `Competitor ${index + 1}`}</span>
                                  <span className="text-[8px] font-black uppercase bg-slate-200/60 px-2 py-0.5 rounded text-slate-500">Confirmed</span>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-6 border border-dashed rounded-xl border-slate-200 text-[10px] uppercase font-bold text-slate-400">
                                Waiting for player check-ins.
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* CREATE EVENT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[40px] p-10 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-3xl font-black italic uppercase mb-2 text-slate-900">Launch <span className="text-cyan-600">Event</span></h2>
              
              <form onSubmit={handleCreate} className="space-y-4 mt-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Event Title</label>
                  <Input placeholder="Sunday Super League" required value={newMatch.title} onChange={e => setNewMatch({...newMatch, title: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Sport</label>
                    <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm" value={newMatch.sport} onChange={e => setNewMatch({...newMatch, sport: e.target.value})}>
                       <option value="Cricket">Cricket</option>
                       <option value="Football">Football</option>
                       <option value="Badminton">Badminton</option>
                       <option value="Basketball">Basketball</option>
                       <option value="Chess">Chess</option>
                       <option value="Tennis">Tennis</option>
                       <option value="Volleyball">Volleyball</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Max Players</label>
                    <Input type="number" value={newMatch.maxPlayers} onChange={e => setNewMatch({...newMatch, maxPlayers: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Date</label>
                    <Input type="date" required value={newMatch.date} onChange={e => setNewMatch({...newMatch, date: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Time</label>
                    <Input type="time" required value={newMatch.time} onChange={e => setNewMatch({...newMatch, time: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Venue Location</label>
                  <Input placeholder="City or Ground Name" required value={newMatch.venueLocation} onChange={e => setNewMatch({...newMatch, venueLocation: e.target.value})} />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Upload Tournament Poster / Banner</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-2xl bg-slate-50 hover:bg-slate-100/50 transition-all relative cursor-pointer">
                    <div className="space-y-1 text-center">
                      <ImageIcon className="mx-auto h-10 w-10 text-slate-400" />
                      <div className="flex text-sm text-slate-600 font-bold">
                        <span className="text-cyan-600 hover:underline">Select a banner file</span>
                        <input type="file" name="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                      <p className="text-xs text-slate-400">{selectedFile ? `Selected: ${selectedFile.name}` : "PNG, JPG, JPEG up to 5MB"}</p>
                    </div>
                  </div>
                </div>

                <Button type="submit" variant="cyan" className="w-full py-5 mt-4">Publish to Feed</Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, onClick, active = false, interactive = true, description = "" }) {
  return (
    <div 
      onClick={interactive ? onClick : undefined}
      className={`bg-white p-6 rounded-[28px] border shadow-sm flex items-center justify-between group transition-all ${
        interactive ? 'cursor-pointer select-none' : ''
      } ${
        active 
          ? 'border-cyan-500 ring-2 ring-cyan-500/10 bg-cyan-50/10' 
          : 'border-slate-100 hover:border-cyan-200'
      }`}
    >
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className={`text-3xl font-black italic tracking-tighter transition-colors ${
          active ? 'text-cyan-600' : 'text-slate-900 group-hover:text-cyan-600'
        }`}>{value}</p>
        {description && (
          <p className="text-[8px] font-bold text-slate-400 uppercase mt-1 tracking-wider">{description}</p>
        )}
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
        active 
          ? 'bg-cyan-600 text-white' 
          : 'bg-slate-50 text-slate-400 group-hover:bg-cyan-50 group-hover:text-cyan-600'
      }`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}