import React, { useState, useEffect } from "react";
import axios from "axios";
import Profile from "./Profile";
import Matches from "./Matches";
import Chat from "./Chat";
import Sessions from "./Sessions";

// ── Pastel palette ──────────────────────────────────────────────
const C = {
  blue:     "#BDE8FF",
  lavender: "#D8C9FF",
  pink:     "#FFB3CC",
  yellow:   "#FFFAB3",
  // derived tones
  blueDark:     "#4BA8D4",
  lavenderDark: "#7C5CBF",
  pinkDark:     "#D45580",
  yellowDark:   "#B8A800",
  // neutral
  white:   "#FFFFFF",
  bg:      "#F6F3FF",
  text:    "#2D2040",
  muted:   "#8B7DAA",
  border:  "#E8DFFF",
  sidebarBg: "#2D1F4E",
  sidebarTop: "#1C1235",
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
  const [matchCount, setMatchCount] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [chatUser, setChatUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { window.location.href = "/login"; return; }
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
    } catch (e) { console.log(e); }
  };

  const loadCounts = async () => {
    const token = localStorage.getItem("token");
    try {
      const [mRes, sRes] = await Promise.all([
        axios.get("http://localhost:5000/api/matches",  { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5000/api/sessions", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setMatchCount(mRes.data.length);
      setSessionCount(sRes.data.length);
    } catch (e) { console.log(e); }
  };

  const handleStartChat = (u) => { setChatUser(u); setActive("Chat"); };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  // ── styles ──────────────────────────────────────────────────────
  const sidebarStyle = {
    width: "220px",
    minHeight: "100vh",
    background: `linear-gradient(180deg, ${C.sidebarTop}, ${C.sidebarBg})`,
    position: "fixed",
    top: 0, left: 0,
    padding: "28px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontFamily: "Poppins, sans-serif",
  };

  const navItemStyle = (isActive) => ({
    display: "flex", alignItems: "center", gap: "10px",
    padding: "11px 14px", borderRadius: "12px", cursor: "pointer",
    color: isActive ? C.lavender : "rgba(255,255,255,0.45)",
    background: isActive ? "rgba(216,201,255,0.18)" : "transparent",
    border: isActive ? `1px solid rgba(216,201,255,0.35)` : "1px solid transparent",
    fontSize: "14px", fontWeight: "500",
    fontFamily: "Poppins, sans-serif",
    width: "100%", textAlign: "left", transition: "all 0.2s",
  });

  const cardStyle = {
    background: C.white,
    borderRadius: "20px",
    padding: "24px",
    border: `2px solid ${C.border}`,
    boxShadow: `0 4px 20px rgba(124,92,191,0.08)`,
    marginBottom: "20px",
  };

  const tagStyleOffered = {
    display: "inline-flex", alignItems: "center",
    padding: "4px 12px",
    background: C.lavender,
    color: C.lavenderDark,
    border: `1px solid ${C.lavenderDark}22`,
    borderRadius: "20px",
    fontSize: "12px", fontWeight: "600", margin: "3px",
  };

  const tagStyleWanted = {
    ...tagStyleOffered,
    background: C.pink,
    color: C.pinkDark,
    border: `1px solid ${C.pinkDark}22`,
  };

  // stat cards config – value pulled from state
  const stats = [
    { icon: "🎯", value: skillsOffered.length, label: "Skills Offered", accent: C.blue,     dark: C.blueDark },
    { icon: "📚", value: skillsWanted.length,  label: "Skills Wanted",  accent: C.lavender, dark: C.lavenderDark },
    { icon: "🤝", value: matchCount,            label: "Matches",        accent: C.pink,     dark: C.pinkDark },
    { icon: "📅", value: sessionCount,          label: "Sessions",       accent: C.yellow,   dark: C.yellowDark },
  ];

  return (
    <div style={{ display: "flex", fontFamily: "Poppins, sans-serif", minHeight: "100vh", background: C.bg }}>

      {/* SIDEBAR */}
      <aside style={sidebarStyle}>
        <div style={{
          fontSize: "18px", fontWeight: "800", color: C.lavender,
          paddingBottom: "20px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          marginBottom: "12px",
        }}>
          🔁 <span style={{ color: "#fff" }}>Skill</span>Swap
        </div>

        <p style={{
          fontSize: "10px", fontWeight: "700",
          color: "rgba(255,255,255,0.25)",
          textTransform: "uppercase", letterSpacing: "1.5px",
          padding: "8px 14px",
        }}>Menu</p>

        {NAV.map((n) => (
          <button key={n.label} style={navItemStyle(active === n.label)} onClick={() => setActive(n.label)}>
            <span>{n.icon}</span><span>{n.label}</span>
          </button>
        ))}

        <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 14px",
            background: "rgba(255,255,255,0.05)", borderRadius: "12px", marginBottom: "8px",
          }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.lavender}, ${C.pink})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.lavenderDark, fontWeight: "700", fontSize: "13px", flexShrink: 0,
            }}>
              {name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.8)" }}>
                {name || "User"}
              </p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>Active Member</p>
            </div>
          </div>
          <button
            onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
            style={{
              width: "100%", padding: "10px 14px", background: "none", border: "none",
              color: "rgba(255,140,140,0.7)", fontSize: "13px", fontWeight: "500",
              cursor: "pointer", textAlign: "left", borderRadius: "12px",
              fontFamily: "Poppins, sans-serif",
            }}
          >🚪 Logout</button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: "220px", flex: 1, padding: "32px" }}>

        {/* Topbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "700", color: C.text }}>
              {active === "Dashboard" ? `${greeting()}, ${name?.split(" ")[0] || "there"} 👋` : active}
            </h1>
            <p style={{ color: C.muted, fontSize: "13px", marginTop: "2px" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <button
            onClick={() => setActive("Profile")}
            style={{
              width: "42px", height: "42px", borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.lavender}, ${C.pink})`,
              color: C.lavenderDark, fontWeight: "700", fontSize: "16px",
              border: "none", cursor: "pointer",
            }}
          >{name?.charAt(0)?.toUpperCase() || "?"}</button>
        </div>

        {/* ── DASHBOARD HOME ── */}
        {active === "Dashboard" && (
          <>
            {/* Hero banner */}
            <div style={{
              background: `linear-gradient(135deg, ${C.lavender}, ${C.pink})`,
              borderRadius: "20px", padding: "28px 32px", marginBottom: "24px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: "-40px", right: "-40px",
                width: "160px", height: "160px", borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
              }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <h2 style={{ color: C.lavenderDark, fontSize: "20px", fontWeight: "700", marginBottom: "6px" }}>
                  Ready to swap skills today? 🔁
                </h2>
                <p style={{ color: C.lavenderDark, opacity: 0.75, fontSize: "14px" }}>
                  You have {skillsOffered.length} skills to offer · {skillsWanted.length} to learn
                </p>
              </div>
              <span style={{
                background: "rgba(255,255,255,0.45)",
                border: "1px solid rgba(255,255,255,0.6)",
                borderRadius: "20px", padding: "8px 18px",
                color: C.lavenderDark, fontSize: "13px", fontWeight: "700", zIndex: 1,
              }}>🔥 Active Member</span>
            </div>

            {/* Stat cards */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px",
            }}>
              {stats.map((s, i) => (
                <div key={i} style={{
                  background: C.white, borderRadius: "16px", padding: "20px",
                  display: "flex", alignItems: "center", gap: "12px",
                  border: `2px solid ${s.accent}`,
                  boxShadow: `0 4px 16px ${s.accent}55`,
                  cursor: "pointer",
                }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "12px",
                    background: s.accent,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
                  }}>{s.icon}</div>
                  <div>
                    <p style={{ fontSize: "24px", fontWeight: "800", color: C.text, lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontSize: "12px", color: C.muted, marginTop: "2px" }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Skills panels */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "700", color: C.text }}>🎯 Skills I Teach</h3>
                  <button onClick={() => setActive("Profile")} style={{
                    fontSize: "12px", color: C.lavenderDark, fontWeight: "600",
                    background: C.lavender, border: "none",
                    padding: "4px 10px", borderRadius: "8px", cursor: "pointer",
                  }}>Edit →</button>
                </div>
                <div style={{
                  minHeight: "44px", padding: "10px",
                  background: `${C.lavender}55`, borderRadius: "10px",
                  border: `2px dashed ${C.lavender}`,
                }}>
                  {skillsOffered.length === 0
                    ? <span style={{ color: "#ccc", fontSize: "12px", fontStyle: "italic" }}>No skills added yet</span>
                    : skillsOffered.map((s) => <span key={s} style={tagStyleOffered}>{s}</span>)
                  }
                </div>
              </div>

              <div style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "700", color: C.text }}>📚 Skills I Want</h3>
                  <button onClick={() => setActive("Profile")} style={{
                    fontSize: "12px", color: C.pinkDark, fontWeight: "600",
                    background: C.pink, border: "none",
                    padding: "4px 10px", borderRadius: "8px", cursor: "pointer",
                  }}>Edit →</button>
                </div>
                <div style={{
                  minHeight: "44px", padding: "10px",
                  background: `${C.pink}55`, borderRadius: "10px",
                  border: `2px dashed ${C.pink}`,
                }}>
                  {skillsWanted.length === 0
                    ? <span style={{ color: "#ccc", fontSize: "12px", fontStyle: "italic" }}>No skills added yet</span>
                    : skillsWanted.map((s) => <span key={s} style={tagStyleWanted}>{s}</span>)
                  }
                </div>
              </div>
            </div>
          </>
        )}

        {active === "Profile"  && <Profile />}
        {active === "Matches"  && <Matches onStartChat={handleStartChat} />}
        {active === "Chat"     && <Chat initialUser={chatUser} />}
        {active === "Sessions" && <Sessions />}
      </main>
    </div>
  );
}

export default Dashboard;
