import React, { useState } from "react";
import axios from "axios";

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF5F5",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 4px 20px rgba(255,107,107,0.15)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#FF6B6B",
    marginBottom: "8px",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "14px",
    color: "#999",
    textAlign: "center",
    marginBottom: "30px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    marginBottom: "16px",
    border: "1.5px solid #FFD6D6",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    color: "#333",
  },
  button: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#FF6B6B",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "8px",
  },
  message: {
    marginTop: "16px",
    textAlign: "center",
    fontSize: "14px",
    color: "#FF6B6B",
  },
  link: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px",
    color: "#999",
  },
  linkSpan: {
    color: "#FF6B6B",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form,
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>SkillSwap 🔁</h2>
        <p style={styles.subtitle}>
          Create your account and start swapping skills!
        </p>

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button style={styles.button} type="submit">
            Create Account
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}

        <p style={styles.link}>
          Already have an account?{" "}
          <span
            style={styles.linkSpan}
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
