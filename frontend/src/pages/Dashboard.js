import React, { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      window.location.href = "/login";
    } else {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <span style={styles.logo}>SkillSwap 🔁</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.welcomeCard}>
          <h2 style={styles.welcome}>Welcome back, {user?.name}! 👋</h2>
          <p style={styles.subtitle}>
            Start swapping skills with people around you
          </p>
        </div>

        <div style={styles.cardRow}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>My Skills</h3>
            <p style={styles.cardText}>Add skills you can teach others</p>
            <button style={styles.cardBtn}>+ Add Skills</button>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Find Matches</h3>
            <p style={styles.cardText}>Find people to swap skills with</p>
            <button style={styles.cardBtn}>Browse Matches</button>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>My Sessions</h3>
            <p style={styles.cardText}>View your booked sessions</p>
            <button style={styles.cardBtn}>View Sessions</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#FFF5F5",
    fontFamily: "'Segoe UI', sans-serif",
  },
  navbar: {
    backgroundColor: "#fff",
    padding: "16px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(255,107,107,0.1)",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#FF6B6B",
  },
  logoutBtn: {
    padding: "8px 20px",
    backgroundColor: "#fff",
    color: "#FF6B6B",
    border: "2px solid #FF6B6B",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
  },
  content: {
    padding: "40px 32px",
  },
  welcomeCard: {
    backgroundColor: "#FF6B6B",
    borderRadius: "20px",
    padding: "40px",
    marginBottom: "30px",
  },
  welcome: {
    color: "#fff",
    fontSize: "28px",
    margin: "0 0 8px 0",
  },
  subtitle: {
    color: "#FFE5E5",
    fontSize: "16px",
    margin: 0,
  },
  cardRow: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "28px",
    flex: "1",
    minWidth: "200px",
    boxShadow: "0 4px 15px rgba(255,107,107,0.08)",
  },
  cardTitle: {
    color: "#2D2D2D",
    fontSize: "18px",
    margin: "0 0 8px 0",
  },
  cardText: {
    color: "#999",
    fontSize: "14px",
    margin: "0 0 20px 0",
  },
  cardBtn: {
    padding: "10px 20px",
    backgroundColor: "#FF6B6B",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default Dashboard;
