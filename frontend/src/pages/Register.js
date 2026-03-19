import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });
      setMessage(res.data.message || "Account created! Redirecting...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Something went wrong. Try again.",
      );
    }
    setLoading(false);
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "12px 14px",
    margin: "6px 0 16px",
    border: "2px solid #EDE9FE",
    borderRadius: "12px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    background: "#F5F3FF",
    color: "#1E1B4B",
    fontFamily: "Poppins, sans-serif",
  };

  const labelStyle = {
    fontSize: "12px",
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F3FF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "40px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 8px 32px rgba(124,58,237,0.15)",
          border: "1px solid #EDE9FE",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#7C3AED",
            fontSize: "22px",
            fontWeight: "800",
            marginBottom: "6px",
          }}
        >
          SkillSwap 🔁
        </h2>
        <h3
          style={{
            textAlign: "center",
            color: "#1E1B4B",
            fontSize: "18px",
            fontWeight: "700",
            marginBottom: "4px",
          }}
        >
          Create Account ✨
        </h3>
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
          <label style={labelStyle}>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
            style={inputStyle}
          />

          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            style={inputStyle}
          />

          <label style={labelStyle}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            required
            style={{ ...inputStyle, marginBottom: "20px" }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(135deg, #7C3AED, #EC4899)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {loading ? "Creating account..." : "Create Account 🚀"}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "14px",
              textAlign: "center",
              fontSize: "13px",
              color:
                message.includes("created") || message.includes("success")
                  ? "#10B981"
                  : "#EF4444",
              fontWeight: "500",
            }}
          >
            {message}
          </p>
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
            style={{ color: "#7C3AED", fontWeight: "600", cursor: "pointer" }}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
