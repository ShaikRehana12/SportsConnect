import React, { useState } from "react";
import axios from "axios";

function ResendVerification() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/resend-verification", { email });
      setMessage(response.data.message);
      setEmail(""); // Clear field on success
    } catch (err) {
      setError(err.response?.data?.error || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#ffffff" }}>
      <div style={{ width: "100%", maxWidth: "420px", padding: "40px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(6, 182, 212, 0.15)", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", textAlign: "center" }}>
        
        {/* Visual Title Header */}
        <h2 style={{ color: "#06b6d4", fontSize: "28px", fontWeight: "bold", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>
          Resend Link
        </h2>
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "25px" }}>
          Didn't receive your registration email? Enter your address below to get a new activation link.
        </p>

        {/* Dynamic Status Notification Banners */}
        {message && (
          <div style={{ backgroundColor: "#ecfeff", color: "#0891b2", padding: "12px", borderRadius: "6px", fontSize: "14px", fontWeight: "500", marginBottom: "20px", border: "1px solid #cffafe" }}>
            {message}
          </div>
        )}
        {error && (
          <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", padding: "12px", borderRadius: "6px", fontSize: "14px", fontWeight: "500", marginBottom: "20px", border: "1px solid #fee2e2" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <label style={{ display: "block", color: "#334155", fontSize: "14px", fontWeight: "6px", marginBottom: "8px" }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "2px solid #e2e8f0", fontSize: "15px", outline: "none", transition: "all 0.3s ease", boxSizing: "border-box" }}
              onFocus={(e) => (e.target.style.borderColor = "#06b6d4")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "12px", backgroundColor: loading ? "#94a3b8" : "#06b6d4", color: "#ffffff", fontSize: "16px", fontWeight: "bold", border: "none", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 12px rgba(6, 182, 212, 0.25)", transition: "background-color 0.2s ease" }}
          >
            {loading ? "Sending link..." : "Send Verification Email"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResendVerification;