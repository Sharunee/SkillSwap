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

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage]   = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      if (res && res.data) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setMessage("Login successful! Redirecting...");
        setTimeout(() => { window.location.href = "/dashboard"; }, 1000);
      }
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
    background: `${C.lavender}33`, color: C.text,
    fontFamily: "Poppins, sans-serif",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    fontSize: "12px", fontWeight: "600", color: C.muted,
    textTransform: "uppercase", letterSpacing: "0.5px",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${C.blue}66 0%, ${C.lavender}66 40%, ${C.pink}44 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Poppins, sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: "fixed", top: "-80px", right: "-80px",
        width: "320px", height: "320px", borderRadius: "50%",
        background: C.pink, opacity: 0.3, filter: "blur(60px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: "-80px", left: "-80px",
        width: "280px", height: "280px", borderRadius: "50%",
        background: C.blue, opacity: 0.35, filter: "blur(60px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", top: "40%", left: "10%",
        width: "160px", height: "160px", borderRadius: "50%",
        background: C.yellow, opacity: 0.25, filter: "blur(40px)", pointerEvents: "none",
      }} />

      <div style={{
        background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)",
        borderRadius: "24px", padding: "40px",
        width: "100%", maxWidth: "400px",
        boxShadow: `0 8px 40px ${C.lavender}88`,
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
        }}>Welcome Back 👋</h3>
        <p style={{
          textAlign: "center", color: C.muted,
          fontSize: "13px", marginBottom: "28px",
        }}>Login to continue swapping skills</p>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Email</label>
          <input
            type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" required
            style={inputStyle}
          />

          <label style={labelStyle}>Password</label>
          <input
            type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password" required
            style={{ ...inputStyle, marginBottom: "20px" }}
          />

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "14px",
            background: `linear-gradient(135deg, ${C.lavender}, ${C.pink})`,
            color: C.lavenderDark, border: "none", borderRadius: "12px",
            fontSize: "15px", fontWeight: "700", cursor: "pointer",
            fontFamily: "Poppins, sans-serif",
            boxShadow: `0 4px 16px ${C.pink}66`,
            transition: "opacity 0.2s",
            opacity: loading ? 0.7 : 1,
          }}>{loading ? "Logging in..." : "Login →"}</button>
        </form>

        {message && (
          <p style={{
            marginTop: "14px", textAlign: "center", fontSize: "13px",
            color: message.includes("successful") ? "#2D8A5A" : "#C0365A",
            fontWeight: "500",
          }}>{message}</p>
        )}

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: C.muted }}>
          Don't have an account?{" "}
          <span
            onClick={() => (window.location.href = "/register")}
            style={{ color: C.lavenderDark, fontWeight: "600", cursor: "pointer" }}
          >Register here</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
