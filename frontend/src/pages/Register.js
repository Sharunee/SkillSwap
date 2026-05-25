import React, { useState } from "react";
import axios from "axios";

const C = {
  blue:         "#BDE8FF",
  lavender:     "#D8C9FF",
  pink:         "#FFB3CC",
  yellow:       "#FFFAB3",
  lavenderDark: "#7C5CBF",
  pinkDark:     "#D45580",
  blueDark:     "#4BA8D4",
  text:         "#2D2040",
  muted:        "#8B7DAA",
  border:       "#E8DFFF",
  bg:           "#F6F3FF",
  white:        "#FFFFFF",
};

function Register() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage]   = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
      setMessage(res.data.message || "Account created! Redirecting...");
      setTimeout(() => { window.location.href = "/login"; }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong. Try again.");
    }
    setLoading(false);
  };

  const inputStyle = {
    display: "block", width: "100%", padding: "12px 14px",
    margin: "6px 0 16px",
    border: `2px solid ${C.border}`, borderRadius: "12px",
    fontSize: "14px", outline: "none", boxSizing: "border-box",
    background: `${C.blue}33`, color: C.text,
    fontFamily: "Poppins, sans-serif",
  };

  const labelStyle = {
    fontSize: "12px", fontWeight: "600", color: C.muted,
    textTransform: "uppercase", letterSpacing: "0.5px",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${C.lavender}55 0%, ${C.blue}55 40%, ${C.yellow}44 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Poppins, sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      {/* Blobs */}
      <div style={{
        position: "fixed", top: "-60px", left: "-60px",
        width: "300px", height: "300px", borderRadius: "50%",
        background: C.lavender, opacity: 0.35, filter: "blur(60px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: "-60px", right: "-60px",
        width: "260px", height: "260px", borderRadius: "50%",
        background: C.yellow, opacity: 0.3, filter: "blur(50px)", pointerEvents: "none",
      }} />

      <div style={{
        background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)",
        borderRadius: "24px", padding: "40px",
        width: "100%", maxWidth: "400px",
        boxShadow: `0 8px 40px ${C.blue}88`,
        border: `1.5px solid ${C.border}`,
        position: "relative", zIndex: 1,
      }}>
        <h2 style={{
          textAlign: "center", color: C.lavenderDark,
          fontSize: "22px", fontWeight: "800", marginBottom: "6px",
        }}>SkillSwap 🔁</h2>
        <h3 style={{
          textAlign: "center", color: C.text,
          fontSize: "18px", fontWeight: "700", marginBottom: "4px",
        }}>Create Account ✨</h3>
        <p style={{
          textAlign: "center", color: C.muted,
          fontSize: "13px", marginBottom: "28px",
        }}>Join thousands of skill swappers today!</p>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Full Name</label>
          <input
            type="text" value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name" required style={inputStyle}
          />

          <label style={labelStyle}>Email</label>
          <input
            type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" required style={inputStyle}
          />

          <label style={labelStyle}>Password</label>
          <input
            type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password" required
            style={{ ...inputStyle, marginBottom: "20px" }}
          />

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "14px",
            background: `linear-gradient(135deg, ${C.blue}, ${C.lavender})`,
            color: C.lavenderDark, border: "none", borderRadius: "12px",
            fontSize: "15px", fontWeight: "700", cursor: "pointer",
            fontFamily: "Poppins, sans-serif",
            boxShadow: `0 4px 16px ${C.lavender}88`,
            opacity: loading ? 0.7 : 1, transition: "opacity 0.2s",
          }}>{loading ? "Creating account..." : "Create Account 🚀"}</button>
        </form>

        {message && (
          <p style={{
            marginTop: "14px", textAlign: "center", fontSize: "13px",
            color: (message.includes("created") || message.includes("success")) ? "#2D8A5A" : "#C0365A",
            fontWeight: "500",
          }}>{message}</p>
        )}

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: C.muted }}>
          Already have an account?{" "}
          <span
            onClick={() => (window.location.href = "/login")}
            style={{ color: C.lavenderDark, fontWeight: "600", cursor: "pointer" }}
          >Login here</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
