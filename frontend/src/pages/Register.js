import React, { useState } from "react";
import axios from "axios";

const C = {
  primary: "#809bce",
  secondary: "#95b8d1",
  accent: "#b8e0d2",
  light: "#d6eadf",
  soft: "#eac4d5",
  dark: "#2e3a5c",
  bg: "#f0f6f9",
  white: "#ffffff",
};

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });
      // Store temp token + email for OTP page
      localStorage.setItem("otpTempToken", res.data.tempToken);
      localStorage.setItem("otpEmail", res.data.email);
      setMessage("✅ OTP sent! Redirecting...");
      setTimeout(() => {
        window.location.href = "/verify-otp";
      }, 1000);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Something went wrong. Try again.",
      );
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    border: `2px solid ${C.light}`,
    borderRadius: "12px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    background: C.bg,
    color: C.dark,
    fontFamily: "Poppins, sans-serif",
  };

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "6px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Soft blobs */}
      <div
        style={{
          position: "fixed",
          top: "-80px",
          right: "-80px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: C.primary,
          opacity: 0.12,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-60px",
          left: "-60px",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background: C.soft,
          opacity: 0.18,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          background: C.white,
          borderRadius: "24px",
          padding: "40px",
          width: "100%",
          maxWidth: "420px",
          position: "relative",
          zIndex: 1,
          boxShadow: "0 8px 32px rgba(128,155,206,0.18)",
          border: `1px solid ${C.light}`,
        }}
      >
        {/* Logo */}
        <p
          style={{
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "800",
            color: C.primary,
            marginBottom: "4px",
          }}
        >
          SkillSwap 🔁
        </p>
        <h2
          style={{
            textAlign: "center",
            color: C.dark,
            fontSize: "20px",
            fontWeight: "700",
            marginBottom: "4px",
          }}
        >
          Create Account ✨
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#9CA3AF",
            fontSize: "13px",
            marginBottom: "28px",
          }}
        >
          Join thousands of skill swappers today!
        </p>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              style={inputStyle}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                style={{ ...inputStyle, paddingRight: "44px" }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "#9CA3AF",
                }}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
            <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "5px" }}>
              A 6-digit OTP will be sent to your email to verify your account.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? C.secondary : C.primary,
              color: C.white,
              border: "none",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "Poppins, sans-serif",
              boxShadow: "0 4px 14px rgba(128,155,206,0.35)",
            }}
          >
            {loading ? "Sending OTP..." : "Create Account & Send OTP 📧"}
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: "16px",
              padding: "12px 16px",
              background: message.includes("✅") ? C.light : "#fde8e8",
              border: `1px solid ${message.includes("✅") ? C.accent : "#fca5a5"}`,
              borderRadius: "10px",
              textAlign: "center",
              fontSize: "13px",
              fontWeight: "500",
              color: message.includes("✅") ? "#2a6b3a" : "#b91c1c",
            }}
          >
            {message}
          </div>
        )}

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "13px",
            color: "#9CA3AF",
          }}
        >
          Already have an account?{" "}
          <span
            onClick={() => (window.location.href = "/login")}
            style={{ color: C.primary, fontWeight: "600", cursor: "pointer" }}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
