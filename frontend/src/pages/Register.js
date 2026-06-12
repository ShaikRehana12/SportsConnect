import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    city: "Hyderabad", // Default city
  });
  const [interests, setInterests] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const sportsOptions = [
    "Cricket", "Football", "Badminton",
    "Volleyball", "Chess", "Tennis",
  ];

  // Common cities for sports tournaments
  const cityOptions = [
    "Hyderabad", "Bangalore", "Mumbai", 
    "Delhi", "Chennai", "Pune"
  ];

  const toggleInterest = (sport) => {
    setInterests((prev) =>
      prev.includes(sport)
        ? prev.filter((s) => s !== sport)
        : [...prev, sport]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (interests.length === 0) {
      setError("Please select at least one sport of interest.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username: formData.name,
          email: formData.email,
          password: formData.password,
          city: formData.city, // Now sending the city!
          interests,
        }
      );

      if (res.data) {
        localStorage.setItem("userName", formData.name);
        localStorage.setItem("userCity", formData.city);
        localStorage.setItem("userInterests", JSON.stringify(interests));

        setIsSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.response?.data || 
        "Registration failed! Please check your server connection."
      );
    }
  };

  return (
    <div className="min-h-screen bg-cyan-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Success Modal */}
      {isSuccess && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-cyan-900/30 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center border-t-4 border-green-500">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Registration Successful!</h3>
            <p className="text-gray-500">Welcome to the team, {formData.name}.</p>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-cyan-600 my-10">
        <h2 className="text-3xl font-bold text-cyan-900 mb-2 italic uppercase tracking-tighter">
          SportsConnect 🏆
        </h2>
        <p className="text-gray-500 mb-6 text-sm">Create your profile to join nearby tournaments.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Full Name</label>
            <input
              type="text" required placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mt-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Email Address</label>
            <input
              type="email" required placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full mt-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition"
            />
          </div>

          {/* CITY SELECTION - NEW FIELD */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Your City</label>
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg bg-slate-50 font-semibold text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
            >
              {cityOptions.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Sports Interests */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Sports Interests</label>
            <div className="grid grid-cols-3 gap-2">
              {sportsOptions.map((sport) => (
                <button
                  key={sport} type="button"
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
              type={showPassword ? "text" : "password"} required placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full mt-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none pr-12 transition"
            />
            <button
              type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-sm text-cyan-600 font-semibold hover:text-cyan-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

          <button
            type="submit"
            className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold hover:bg-cyan-700 transition shadow-lg mt-4 uppercase text-xs tracking-widest"
          >
            Register & Explore 🚀
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Already a member?{" "}
          <Link to="/login" className="text-cyan-600 font-black hover:underline uppercase">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;