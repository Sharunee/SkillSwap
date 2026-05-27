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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMessage("✅ Login successful! Redirecting...");
      setMsgType("success");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err) {
      const data = err.response?.data;
      // Unverified — redirect to OTP page
      if (data?.notVerified) {
        localStorage.setItem("otpEmail", data.email || email);
        setMessage("⚠️ Email not verified. Redirecting to verify...");
        setMsgType("warn");
        setTimeout(() => {
          window.location.href = "/verify-otp";
        }, 1500);
      } else {
        setMessage(data?.message || "Something went wrong. Try again.");
        setMsgType("error");
      }
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

  const msgColors = {
    success: { bg: C.light, border: C.accent, text: "#2a6b3a" },
    warn: { bg: "#fff8e1", border: "#ffd54f", text: "#7a5c00" },
    error: { bg: "#fde8e8", border: "#fca5a5", text: "#b91c1c" },
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
          Welcome Back 👋
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#9CA3AF",
            fontSize: "13px",
            marginBottom: "28px",
          }}
        >
          Login to continue swapping skills
        </p>

        <form onSubmit={handleSubmit}>
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

          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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
            {loading ? "Logging in..." : "Login →"}
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: "16px",
              padding: "12px 16px",
              background: msgColors[msgType]?.bg || C.light,
              border: `1px solid ${msgColors[msgType]?.border || C.accent}`,
              borderRadius: "10px",
              textAlign: "center",
              fontSize: "13px",
              fontWeight: "500",
              color: msgColors[msgType]?.text || C.dark,
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
          Don't have an account?{" "}
          <span
            onClick={() => (window.location.href = "/register")}
            style={{ color: C.primary, fontWeight: "600", cursor: "pointer" }}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
