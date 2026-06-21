import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";

function Footer() {
  const currentYear = new Date().getFullYear();

  // Helper component for social icons to avoid repetitive SVG code
  const SocialIcon = ({ children }) => (
    <button 
      type="button"
      className="p-2 bg-cyan-800 rounded-lg hover:bg-cyan-400 hover:text-cyan-900 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-300"
    >
      {children}
    </button>
  );

  return (
    <footer className="bg-cyan-900 text-white mt-16 font-sans">
      
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Logo + About */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="SportsConnect Logo" className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover" />
            <h2 className="text-2xl font-bold tracking-tight text-cyan-50">SportsConnect</h2>
          </div>
          <p className="text-sm text-cyan-100 leading-relaxed">
            Discover and register for nearby sports tournaments based on your interests. 
            Stay connected and never miss an opportunity to compete!
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-6 border-b-2 border-cyan-500 w-fit pb-1">Quick Links</h3>
          <ul className="space-y-3 text-cyan-100">
            <li><Link to="/" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><span>→</span> Home</Link></li>
            <li><Link to="/register" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><span>→</span> Register</Link></li>
            <li><Link to="/login" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><span>→</span> Login</Link></li>
            <li><Link to="/dashboard" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><span>→</span> Dashboard</Link></li>
          </ul>
        </div>

        {/* Featured Sports */}
        <div>
          <h3 className="text-lg font-semibold mb-6 border-b-2 border-cyan-500 w-fit pb-1">Popular Sports</h3>
          <ul className="space-y-3 text-cyan-100">
            <li className="flex items-center gap-2">🏆 Cricket</li>
            <li className="flex items-center gap-2">🏆 Football</li>
            <li className="flex items-center gap-2">🏆 Badminton</li>
            <li className="flex items-center gap-2">🏆 Volleyball</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-6 border-b-2 border-cyan-500 w-fit pb-1">Get In Touch</h3>
          <div className="space-y-4 text-sm text-cyan-100">
            <div className="flex items-start space-x-3">
              <span className="text-cyan-400">📍</span>
              <span>Gachibowli, Hyderabad,<br/>Telangana 500032</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-cyan-400">📧</span>
              <a href="mailto:sportsconnectteamindia@gmail.com" className="hover:text-white transition underline decoration-cyan-500 underline-offset-4">
                sportsconnectteamindia@gmail.com
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-cyan-400">📞</span>
              <span>+91 98765 43210</span>
            </div>
          </div>

          {/* Social Icons (using SVGs directly) */}
          <div className="flex space-x-4 mt-6">
            <SocialIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </SocialIcon>
            <SocialIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </SocialIcon>
            <SocialIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </SocialIcon>
          </div>
        </div>

      </div>

      {/* Bottom Copyright Section */}
      <div className="border-t border-cyan-800 bg-cyan-950/80">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-cyan-300">
          <p>© {currentYear} SportsConnect. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}

export default Footer;