import React, { useState, useEffect } from "react";
import axios from "axios";
import Profile from "./Profile";
import Matches from "./Matches";
import Chat from "./Chat";
import Sessions from "./Sessions";

// ── Palette ────────────────────────────────────────────
const C = {
  primary: "#809bce", // blue-periwinkle
  secondary: "#95b8d1", // steel-blue
  accent: "#b8e0d2", // mint-teal
  light: "#d6eadf", // pale-green
  soft: "#eac4d5", // blush-pink
  dark: "#2e3a5c", // deep navy for text
  bg: "#f0f6f9", // very light tint
  white: "#ffffff",
};

const NAV = [
  { icon: "🏠", label: "Dashboard" },
  { icon: "👤", label: "Profile" },
  { icon: "🤝", label: "Matches" },
  { icon: "💬", label: "Chat" },
  { icon: "📅", label: "Sessions" },
];

function Dashboard() {
  const [active, setActive] = useState("Dashboard");
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsWanted, setSkillsWanted] = useState([]);
  const [matchesCount, setMatchesCount] = useState(0);
  const [sessionsCount, setSessionsCount] = useState(0);
  const [chatUser, setChatUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      window.location.href = "/login";
      return;
    }
    const u = JSON.parse(stored);
    setUser(u);
    setName(u.name || "");
    loadProfile();
    loadCounts();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setName(res.data.name || "");
      setSkillsOffered(res.data.skillsOffered || []);
      setSkillsWanted(res.data.skillsWanted || []);
    } catch (e) {
      console.log(e);
    }
  };

  const loadCounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const [matchRes, sessionRes] = await Promise.all([
        axios.get("http://localhost:5000/api/matches", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/sessions", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setMatchesCount(Array.isArray(matchRes.data) ? matchRes.data.length : 0);
      setSessionsCount(
        Array.isArray(sessionRes.data) ? sessionRes.data.length : 0,
      );
    } catch (e) {
      console.log(e);
    }
  };

  const handleStartChat = (user) => {
    setChatUser(user);
    setActive("Chat");
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  // ── Styles ──────────────────────────────────────────
  const sidebarStyle = {
    width: "220px",
    minHeight: "100vh",
    background: C.dark,
    position: "fixed",
    top: 0,
    left: 0,
    padding: "28px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontFamily: "Poppins, sans-serif",
    zIndex: 100,
  };

  const navItemStyle = (isActive) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "11px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    color: isActive ? C.dark : "rgba(255,255,255,0.65)",
    background: isActive ? C.accent : "transparent",
    border: isActive ? `1px solid ${C.accent}` : "1px solid transparent",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "Poppins, sans-serif",
    width: "100%",
    textAlign: "left",
    transition: "all 0.2s",
  });

  const cardStyle = {
    background: C.white,
    borderRadius: "20px",
    padding: "24px",
    border: `2px solid ${C.light}`,
    boxShadow: "0 4px 20px rgba(128,155,206,0.10)",
    marginBottom: "20px",
  };

  const tagStyleOffered = {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 12px",
    background: C.light,
    color: C.dark,
    border: `1px solid ${C.accent}`,
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    margin: "3px",
  };

  const tagStyleWanted = {
    ...tagStyleOffered,
    background: C.soft,
    color: C.dark,
    border: `1px solid ${C.secondary}`,
  };

  const statColors = [
    { bg: C.light, border: C.accent },
    { bg: C.soft, border: C.secondary },
    { bg: "#dce9f7", border: C.primary },
    { bg: "#e8f4f0", border: C.accent },
  ];

  return (
    <div
      style={{
        display: "flex",
        fontFamily: "Poppins, sans-serif",
        minHeight: "100vh",
        background: C.bg,
      }}
    >
      {/* SIDEBAR */}
      <aside style={sidebarStyle}>
        <div
          style={{
            fontSize: "18px",
            fontWeight: "800",
            color: C.white,
            paddingBottom: "20px",
            borderBottom: "1px solid rgba(255,255,255,0.25)",
            marginBottom: "12px",
          }}
        >
          🔁 <span style={{ color: C.white }}>Skill</span>
          <span style={{ color: C.soft }}>Swap</span>
        </div>

        <p
          style={{
            fontSize: "10px",
            fontWeight: "700",
            color: "rgba(255,255,255,0.55)",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            padding: "8px 14px",
          }}
        >
          Menu
        </p>

        {NAV.map((n) => (
          <button
            key={n.label}
            style={navItemStyle(active === n.label)}
            onClick={() => setActive(n.label)}
          >
            <span>{n.icon}</span>
            <span>{n.label}</span>
          </button>
        ))}

        <div
          style={{
            marginTop: "auto",
            paddingTop: "16px",
            borderTop: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "12px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: C.soft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.dark,
                fontWeight: "700",
                fontSize: "13px",
                flexShrink: 0,
              }}
            >
              {name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <p
                style={{ fontSize: "13px", fontWeight: "600", color: C.white }}
              >
                {name || "User"}
              </p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                Active Member
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            style={{
              width: "100%",
              padding: "10px 14px",
              background: "none",
              border: "none",
              color: "rgba(255,200,200,0.85)",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              textAlign: "left",
              borderRadius: "12px",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: "220px", flex: 1, padding: "32px" }}>
        {/* Topbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "28px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "700", color: C.dark }}>
              {active === "Dashboard"
                ? `${greeting()}, ${name?.split(" ")[0] || "there"} 👋`
                : active}
            </h1>
            <p style={{ color: "#9CA3AF", fontSize: "13px", marginTop: "2px" }}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={() => setActive("Profile")}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: C.soft,
              color: C.dark,
              fontWeight: "700",
              fontSize: "16px",
              border: `2px solid ${C.secondary}`,
              cursor: "pointer",
            }}
          >
            {name?.charAt(0)?.toUpperCase() || "?"}
          </button>
        </div>

        {/* ── DASHBOARD HOME ── */}
        {active === "Dashboard" && (
          <>
            {/* Hero Banner */}
            <div
              style={{
                background: C.primary,
                borderRadius: "20px",
                padding: "28px 32px",
                marginBottom: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-40px",
                  right: "-40px",
                  width: "160px",
                  height: "160px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.10)",
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <h2
                  style={{
                    color: C.white,
                    fontSize: "20px",
                    fontWeight: "700",
                    marginBottom: "6px",
                  }}
                >
                  Ready to swap skills today? 🔁
                </h2>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>
                  You have {skillsOffered.length} skills to offer ·{" "}
                  {skillsWanted.length} to learn
                </p>
              </div>
              <span
                style={{
                  background: "rgba(255,255,255,0.22)",
                  border: "1px solid rgba(255,255,255,0.35)",
                  borderRadius: "20px",
                  padding: "8px 18px",
                  color: C.white,
                  fontSize: "13px",
                  fontWeight: "600",
                  zIndex: 1,
                }}
              >
                🔥 Active Member
              </span>
            </div>

            {/* Stat Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              {[
                {
                  icon: "🎯",
                  value: skillsOffered.length,
                  label: "Skills Offered",
                },
                {
                  icon: "📚",
                  value: skillsWanted.length,
                  label: "Skills Wanted",
                },
                { icon: "🤝", value: matchesCount, label: "Matches" },
                { icon: "📅", value: sessionsCount, label: "Sessions" },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    background: C.white,
                    borderRadius: "16px",
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    border: `2px solid ${statColors[i].border}`,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: statColors[i].bg,
                      border: `2px solid ${statColors[i].border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                    }}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "24px",
                        fontWeight: "800",
                        color: C.dark,
                        lineHeight: 1,
                      }}
                    >
                      {s.value}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#9CA3AF",
                        marginTop: "2px",
                      }}
                    >
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Skills Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              {/* Skills I Teach */}
              <div style={cardStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "14px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: C.dark,
                    }}
                  >
                    🎯 Skills I Teach
                  </h3>
                  <button
                    onClick={() => setActive("Profile")}
                    style={{
                      fontSize: "12px",
                      color: C.dark,
                      fontWeight: "600",
                      background: C.light,
                      border: "none",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Edit →
                  </button>
                </div>
                <div
                  style={{
                    minHeight: "44px",
                    padding: "10px",
                    background: C.light,
                    borderRadius: "10px",
                    border: `2px dashed ${C.accent}`,
                  }}
                >
                  {skillsOffered.length === 0 ? (
                    <span
                      style={{
                        color: "#bbb",
                        fontSize: "12px",
                        fontStyle: "italic",
                      }}
                    >
                      No skills added yet
                    </span>
                  ) : (
                    skillsOffered.map((s) => (
                      <span key={s} style={tagStyleOffered}>
                        {s}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Skills I Want */}
              <div style={cardStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "14px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: C.dark,
                    }}
                  >
                    📚 Skills I Want
                  </h3>
                  <button
                    onClick={() => setActive("Profile")}
                    style={{
                      fontSize: "12px",
                      color: C.dark,
                      fontWeight: "600",
                      background: C.soft,
                      border: "none",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Edit →
                  </button>
                </div>
                <div
                  style={{
                    minHeight: "44px",
                    padding: "10px",
                    background: C.soft,
                    borderRadius: "10px",
                    border: `2px dashed ${C.secondary}`,
                  }}
                >
                  {skillsWanted.length === 0 ? (
                    <span
                      style={{
                        color: "#bbb",
                        fontSize: "12px",
                        fontStyle: "italic",
                      }}
                    >
                      No skills added yet
                    </span>
                  ) : (
                    skillsWanted.map((s) => (
                      <span key={s} style={tagStyleWanted}>
                        {s}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {active === "Profile" && <Profile />}
        {active === "Matches" && <Matches onStartChat={handleStartChat} />}
        {active === "Chat" && <Chat initialUser={chatUser} />}
        {active === "Sessions" && <Sessions />}
      </main>
    </div>
  );
}

export default Dashboard;
