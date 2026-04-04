import React, { useState, useEffect } from "react";
import axios from "axios";
import Profile from "./Profile";
import Matches from "./Matches";
import Chat from "./Chat";
import Sessions from "./Sessions";

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

  const sidebarStyle = {
    width: "220px",
    minHeight: "100vh",
    background: "linear-gradient(180deg, #1E1B4B, #2D2A6E)",
    position: "fixed",
    top: 0,
    left: 0,
    padding: "28px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontFamily: "Poppins, sans-serif",
  };

  const navItemStyle = (isActive) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "11px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    color: isActive ? "#C4B5FD" : "rgba(255,255,255,0.4)",
    background: isActive ? "rgba(124,58,237,0.25)" : "transparent",
    border: isActive
      ? "1px solid rgba(124,58,237,0.3)"
      : "1px solid transparent",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "Poppins, sans-serif",
    width: "100%",
    textAlign: "left",
    transition: "all 0.2s",
  });

  const cardStyle = {
    background: "#fff",
    borderRadius: "20px",
    padding: "24px",
    border: "2px solid #EDE9FE",
    boxShadow: "0 4px 20px rgba(124,58,237,0.08)",
    marginBottom: "20px",
  };

  const tagStyleOffered = {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 12px",
    background: "#F5F3FF",
    color: "#7C3AED",
    border: "1px solid #DDD6FE",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    margin: "3px",
  };

  const tagStyleWanted = {
    ...tagStyleOffered,
    background: "#FFF7ED",
    color: "#EA580C",
    border: "1px solid #FED7AA",
  };

  return (
    <div
      style={{
        display: "flex",
        fontFamily: "Poppins, sans-serif",
        minHeight: "100vh",
        background: "#F5F3FF",
      }}
    >
      {/* SIDEBAR */}
      <aside style={sidebarStyle}>
        <div
          style={{
            fontSize: "18px",
            fontWeight: "800",
            color: "#C4B5FD",
            paddingBottom: "20px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            marginBottom: "12px",
          }}
        >
          🔁 <span style={{ color: "#fff" }}>Skill</span>Swap
        </div>

        <p
          style={{
            fontSize: "10px",
            fontWeight: "700",
            color: "rgba(255,255,255,0.25)",
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
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7C3AED, #EC4899)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "700",
                fontSize: "13px",
                flexShrink: 0,
              }}
            >
              {name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                {name || "User"}
              </p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
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
              color: "rgba(255,100,100,0.6)",
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
            <h1
              style={{ fontSize: "22px", fontWeight: "700", color: "#1E1B4B" }}
            >
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
              background: "linear-gradient(135deg, #7C3AED, #EC4899)",
              color: "#fff",
              fontWeight: "700",
              fontSize: "16px",
              border: "none",
              cursor: "pointer",
            }}
          >
            {name?.charAt(0)?.toUpperCase() || "?"}
          </button>
        </div>

        {/* ── DASHBOARD HOME ── */}
        {active === "Dashboard" && (
          <>
            <div
              style={{
                background: "linear-gradient(135deg, #7C3AED, #EC4899)",
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
                  background: "rgba(255,255,255,0.08)",
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <h2
                  style={{
                    color: "#fff",
                    fontSize: "20px",
                    fontWeight: "700",
                    marginBottom: "6px",
                  }}
                >
                  Ready to swap skills today? 🔁
                </h2>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>
                  You have {skillsOffered.length} skills to offer ·{" "}
                  {skillsWanted.length} to learn
                </p>
              </div>
              <span
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "20px",
                  padding: "8px 18px",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: "600",
                  zIndex: 1,
                }}
              >
                🔥 Active Member
              </span>
            </div>

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
                { icon: "🤝", value: 0, label: "Matches" },
                { icon: "📅", value: 0, label: "Sessions" },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    border: "2px solid #EDE9FE",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "#F5F3FF",
                      border: "2px solid #EDE9FE",
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
                        color: "#1E1B4B",
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

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
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
                      color: "#1E1B4B",
                    }}
                  >
                    🎯 Skills I Teach
                  </h3>
                  <button
                    onClick={() => setActive("Profile")}
                    style={{
                      fontSize: "12px",
                      color: "#7C3AED",
                      fontWeight: "600",
                      background: "#F5F3FF",
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
                    background: "#F5F3FF",
                    borderRadius: "10px",
                    border: "2px dashed #EDE9FE",
                  }}
                >
                  {skillsOffered.length === 0 ? (
                    <span
                      style={{
                        color: "#ccc",
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
                      color: "#1E1B4B",
                    }}
                  >
                    📚 Skills I Want
                  </h3>
                  <button
                    onClick={() => setActive("Profile")}
                    style={{
                      fontSize: "12px",
                      color: "#7C3AED",
                      fontWeight: "600",
                      background: "#F5F3FF",
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
                    background: "#FFF7ED",
                    borderRadius: "10px",
                    border: "2px dashed #FED7AA",
                  }}
                >
                  {skillsWanted.length === 0 ? (
                    <span
                      style={{
                        color: "#ccc",
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

        {/* ── OTHER PAGES ── */}
        {active === "Profile" && <Profile />}
        {active === "Matches" && <Matches onStartChat={handleStartChat} />}
        {active === "Chat" && <Chat initialUser={chatUser} />}
        {active === "Sessions" && <Sessions />}
      </main>
    </div>
  );
}

export default Dashboard;
