import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [interests, setInterests] = useState([]); // New state for sports
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  // List of sports based on your project requirements
  const sportsOptions = ["Cricket", "Football", "Badminton", "Volleyball", "Chess", "Tennis"];

  const toggleInterest = (sport) => {
    setInterests((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (interests.length === 0) {
      alert("Please select at least one sport of interest!");
      return;
    }

    // Save everything to localStorage for the Dashboard/Navbar to use
    localStorage.setItem("userName", formData.name);
    localStorage.setItem("userInterests", JSON.stringify(interests));
    
    console.log("Registering User:", { ...formData, interests });

    setIsSuccess(true);

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-cyan-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* SUCCESS OVERLAY */}
      {isSuccess && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-cyan-900/30 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center border-t-4 border-green-500 transform scale-110 transition-all">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Registration Successful!</h3>
            <p className="text-gray-500">Welcome to the team, {formData.name}.</p>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-cyan-600 my-10">
        <h2 className="text-3xl font-bold text-cyan-900 mb-2 italic uppercase tracking-tighter">SportsConnect 🏆</h2>
        <p className="text-gray-500 mb-6 text-sm">Create your profile to join nearby tournaments.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Full Name</label>
            <input 
              type="text" required
              placeholder="Enter your name"
              className="w-full mt-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" required
              placeholder="email@example.com"
              className="w-full mt-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {/* Interests Selection Grid */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Sports Interests</label>
            <div className="grid grid-cols-3 gap-2">
              {sportsOptions.map((sport) => (
                <button
                  key={sport}
                  type="button"
                  onClick={() => toggleInterest(sport)}
                  className={`py-2 px-1 rounded-md text-[10px] font-bold border transition-all ${
                    interests.includes(sport)
                      ? "bg-cyan-600 border-cyan-600 text-white shadow-md"
                      : "bg-white border-gray-200 text-gray-500 hover:border-cyan-300"
                  }`}
                >
                  {sport} {interests.includes(sport) && "✓"}
                </button>
              ))}
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              required
              placeholder="••••••••"
              className="w-full mt-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none pr-12 transition"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-cyan-600"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              )}
            </button>
          </div>

          <button type="submit" className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold hover:bg-cyan-700 transition shadow-lg mt-4 uppercase text-xs tracking-widest">
            Register & Explore 🚀
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Already a member? <Link to="/login" className="text-cyan-600 font-black hover:underline uppercase">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;