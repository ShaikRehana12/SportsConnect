import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure you have installed axios: npm install axios

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 1. Send login request to your Node.js/Express backend
      // Replace the URL with your actual backend endpoint
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // 2. Destructure the data returned from your MongoDB/Backend
      const { name, role, token, interests } = response.data;

      // 3. Save data to localStorage
      localStorage.setItem("token", token); // Useful for protected routes
      localStorage.setItem("userName", name);
      localStorage.setItem("userRole", role); // 'admin' or 'user'
      localStorage.setItem("userInterests", JSON.stringify(interests));

      // 4. Notify Navbar to update the "Hi, Name" display immediately
      window.dispatchEvent(new Event("storage"));

      // 5. SMART REDIRECT based on Role
      if (role === "admin") {
        console.log("Admin Logged In");
        navigate("/admin"); // Redirect to Admin Dashboard
      } else {
        console.log("User Logged In");
        navigate("/dashboard"); // Redirect to User Dashboard
      }

    } catch (error) {
      // Handle errors from the backend (e.g., "Invalid Credentials")
      console.error("Login Error:", error);
      alert(error.response?.data?.msg || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cyan-50 font-sans">
      <form 
        onSubmit={handleLogin} 
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-cyan-600"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-cyan-900 tracking-tighter italic uppercase">
            Sports<span className="text-gray-800">Connect</span>
          </h2>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mt-2">
            Secure Access Portal
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              placeholder="admin@sportsconnect.com" 
              required
              className="w-full mt-1 p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 transition bg-gray-50"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required
              className="w-full mt-1 p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 transition bg-gray-50"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold hover:bg-cyan-700 transition shadow-lg mt-8 uppercase text-xs tracking-[0.2em]"
        >
          Sign In
        </button>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center gap-2">
          <p className="text-xs text-gray-500">
            Don't have an account? 
            <button 
              type="button"
              onClick={() => navigate("/register")} 
              className="ml-2 text-cyan-600 font-bold hover:underline italic"
            >
              Register Now
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;