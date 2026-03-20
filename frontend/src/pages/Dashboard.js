import React, { useState, useEffect } from "react";
import axios from "axios";

const NAV = [
  { icon: "🏠", label: "Dashboard" },
  { icon: "👤", label: "Profile" },
  { icon: "🤝", label: "Matches" },
  { icon: "💬", label: "Chat" },
  { icon: "📅", label: "Sessions" },
];

function Dashboard() {
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("Dashboard");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsWanted, setSkillsWanted] = useState([]);
  const [newOffered, setNewOffered] = useState("");
  const [newWanted, setNewWanted] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [matches, setMatches] = useState([]);
  const [matchLoading, setMatchLoading] = useState(false);

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

  useEffect(() => {
    if (active === "Matches") loadMatches();
  }, [active]);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setName(res.data.name || "");
      setBio(res.data.bio || "");
      setLocation(res.data.location || "");
      setSkillsOffered(res.data.skillsOffered || []);
      setSkillsWanted(res.data.skillsWanted || []);
    } catch (e) {
      console.log(e);
    }
  };

  const loadMatches = async () => {
    setMatchLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/matches", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMatches(res.data);
    } catch (e) {
      console.log(e);
    }
    setMatchLoading(false);
  };

  const addOffered = () => {
    if (newOffered.trim() && !skillsOffered.includes(newOffered.trim())) {
      setSkillsOffered([...skillsOffered, newOffered.trim()]);
      setNewOffered("");
    }
  };

  const addWanted = () => {
    if (newWanted.trim() && !skillsWanted.includes(newWanted.trim())) {
      setSkillsWanted([...skillsWanted, newWanted.trim()]);
      setNewWanted("");
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/users/profile",
        { name, bio, location, skillsOffered, skillsWanted },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const updated = { ...user, name: res.data.name };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setMessage("✅ Profile saved!");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("❌ Save failed");
    }
    setSaving(false);
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  // Styles
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

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    border: "2px solid #EDE9FE",
    borderRadius: "12px",
    fontSize: "13px",
    outline: "none",
    background: "#F5F3FF",
    color: "#1E1B4B",
    fontFamily: "Poppins, sans-serif",
    boxSizing: "border-box",
  };

  const btnStyle = {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #7C3AED, #EC4899)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "Poppins, sans-serif",
  };

  const tagStyleOffered = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
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

  // Match score color
  const getScoreColor = (score) => {
    if (score >= 80) return "#10B981";
    if (score >= 50) return "#7C3AED";
    return "#F59E0B";
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

        {/* ── DASHBOARD VIEW ── */}
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
              }}
            >
              <div>
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
                { icon: "🤝", value: matches.length, label: "Matches" },
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

        {/* ── MATCHES VIEW ── */}
        {active === "Matches" && (
          <>
            {matchLoading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "80px",
                  color: "#7C3AED",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                🔍 Finding your matches...
              </div>
            ) : matches.length === 0 ? (
              <div
                style={{
                  ...cardStyle,
                  textAlign: "center",
                  padding: "80px 40px",
                }}
              >
                <div style={{ fontSize: "56px", marginBottom: "16px" }}>🤝</div>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#7C3AED",
                    marginBottom: "8px",
                  }}
                >
                  No Matches Yet!
                </h2>
                <p
                  style={{
                    color: "#9CA3AF",
                    fontSize: "14px",
                    marginBottom: "20px",
                  }}
                >
                  Add skills to your profile to find people to swap with!
                </p>
                <button
                  onClick={() => setActive("Profile")}
                  style={{ ...btnStyle, padding: "12px 28px" }}
                >
                  Add Skills →
                </button>
              </div>
            ) : (
              <>
                <p
                  style={{
                    color: "#9CA3AF",
                    fontSize: "14px",
                    marginBottom: "20px",
                  }}
                >
                  Found{" "}
                  <strong style={{ color: "#7C3AED" }}>
                    {matches.length} matches
                  </strong>{" "}
                  based on your skills!
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {matches.map((match, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#fff",
                        borderRadius: "20px",
                        padding: "24px",
                        border: "2px solid #EDE9FE",
                        boxShadow: "0 4px 20px rgba(124,58,237,0.08)",
                        transition: "transform 0.2s",
                      }}
                    >
                      {/* User Header */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          marginBottom: "16px",
                        }}
                      >
                        <div
                          style={{
                            width: "52px",
                            height: "52px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #7C3AED, #EC4899)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontWeight: "800",
                            fontSize: "20px",
                            flexShrink: 0,
                          }}
                        >
                          {match.user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3
                            style={{
                              fontSize: "16px",
                              fontWeight: "700",
                              color: "#1E1B4B",
                              marginBottom: "2px",
                            }}
                          >
                            {match.user.name}
                          </h3>
                          <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
                            {match.user.location || "No location"}
                          </p>
                        </div>
                        {/* Match Score Badge */}
                        <div
                          style={{
                            textAlign: "center",
                            background: "#F5F3FF",
                            borderRadius: "12px",
                            padding: "8px 12px",
                            border: `2px solid ${getScoreColor(match.matchPercent)}22`,
                          }}
                        >
                          <p
                            style={{
                              fontSize: "20px",
                              fontWeight: "800",
                              color: getScoreColor(match.matchPercent),
                              lineHeight: 1,
                            }}
                          >
                            {match.matchPercent}%
                          </p>
                          <p
                            style={{
                              fontSize: "10px",
                              color: "#9CA3AF",
                              marginTop: "2px",
                            }}
                          >
                            Match
                          </p>
                        </div>
                      </div>

                      {/* Bio */}
                      {match.user.bio && (
                        <p
                          style={{
                            fontSize: "13px",
                            color: "#6B7280",
                            marginBottom: "14px",
                            lineHeight: 1.6,
                          }}
                        >
                          {match.user.bio}
                        </p>
                      )}

                      {/* Match Score Bar */}
                      <div style={{ marginBottom: "16px" }}>
                        <div
                          style={{
                            height: "6px",
                            background: "#EDE9FE",
                            borderRadius: "3px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${match.matchPercent}%`,
                              background: `linear-gradient(90deg, #7C3AED, #EC4899)`,
                              borderRadius: "3px",
                              transition: "width 1s ease",
                            }}
                          />
                        </div>
                      </div>

                      {/* Skills I Can Teach Them */}
                      {match.skillsICanTeach.length > 0 && (
                        <div style={{ marginBottom: "12px" }}>
                          <p
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              color: "#7C3AED",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              marginBottom: "6px",
                            }}
                          >
                            ✅ I can teach them
                          </p>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "4px",
                            }}
                          >
                            {match.skillsICanTeach.map((s) => (
                              <span key={s} style={tagStyleOffered}>
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Skills I Can Learn */}
                      {match.skillsICanLearn.length > 0 && (
                        <div style={{ marginBottom: "16px" }}>
                          <p
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              color: "#EA580C",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              marginBottom: "6px",
                            }}
                          >
                            📚 I can learn from them
                          </p>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "4px",
                            }}
                          >
                            {match.skillsICanLearn.map((s) => (
                              <span key={s} style={tagStyleWanted}>
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Connect Button */}
                      <button
                        style={{
                          ...btnStyle,
                          width: "100%",
                          padding: "12px",
                          fontSize: "13px",
                        }}
                      >
                        💬 Connect with {match.user.name?.split(" ")[0]}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* ── PROFILE VIEW ── */}
        {active === "Profile" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div style={cardStyle}>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#1E1B4B",
                  marginBottom: "16px",
                }}
              >
                👤 Personal Info
              </h3>
              <label
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Full Name
              </label>
              <input
                style={{ ...inputStyle, margin: "5px 0 14px" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
              <label
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Location
              </label>
              <input
                style={{ ...inputStyle, margin: "5px 0 14px" }}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
              />
              <label
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Bio
              </label>
              <input
                style={{ ...inputStyle, margin: "5px 0 0" }}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others about yourself..."
              />
            </div>

            <div style={cardStyle}>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#1E1B4B",
                  marginBottom: "16px",
                }}
              >
                🎯 Skills I Can Teach
              </h3>
              <div
                style={{ display: "flex", gap: "8px", marginBottom: "12px" }}
              >
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  value={newOffered}
                  onChange={(e) => setNewOffered(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addOffered()}
                  placeholder="e.g. React, Guitar..."
                />
                <button
                  onClick={addOffered}
                  style={{
                    ...btnStyle,
                    padding: "11px 16px",
                    fontSize: "18px",
                  }}
                >
                  +
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
                    Add your first skill!
                  </span>
                ) : (
                  skillsOffered.map((s) => (
                    <span key={s} style={tagStyleOffered}>
                      {s}
                      <button
                        onClick={() =>
                          setSkillsOffered(skillsOffered.filter((x) => x !== s))
                        }
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#7C3AED",
                          opacity: 0.5,
                          fontSize: "14px",
                          padding: 0,
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            <div style={cardStyle}>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#1E1B4B",
                  marginBottom: "16px",
                }}
              >
                📚 Skills I Want to Learn
              </h3>
              <div
                style={{ display: "flex", gap: "8px", marginBottom: "12px" }}
              >
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  value={newWanted}
                  onChange={(e) => setNewWanted(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addWanted()}
                  placeholder="e.g. Python, Photography..."
                />
                <button
                  onClick={addWanted}
                  style={{
                    ...btnStyle,
                    padding: "11px 16px",
                    fontSize: "18px",
                  }}
                >
                  +
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
                    What do you want to learn?
                  </span>
                ) : (
                  skillsWanted.map((s) => (
                    <span key={s} style={tagStyleWanted}>
                      {s}
                      <button
                        onClick={() =>
                          setSkillsWanted(skillsWanted.filter((x) => x !== s))
                        }
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#EA580C",
                          opacity: 0.5,
                          fontSize: "14px",
                          padding: 0,
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            <div style={cardStyle}>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#1E1B4B",
                  marginBottom: "12px",
                }}
              >
                💾 Save Changes
              </h3>
              <p
                style={{
                  color: "#9CA3AF",
                  fontSize: "13px",
                  lineHeight: 1.7,
                  marginBottom: "16px",
                }}
              >
                Make sure all your details are correct before saving. Your
                profile is visible to other SkillSwap members.
              </p>
              <button
                onClick={saveProfile}
                disabled={saving}
                style={{
                  ...btnStyle,
                  width: "100%",
                  padding: "14px",
                  fontSize: "15px",
                }}
              >
                {saving ? "Saving..." : "💾 Save Profile"}
              </button>
              {message && (
                <p
                  style={{
                    marginTop: "12px",
                    textAlign: "center",
                    fontSize: "13px",
                    color: message.includes("✅") ? "#10B981" : "#EF4444",
                    fontWeight: "600",
                  }}
                >
                  {message}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── COMING SOON ── */}
        {(active === "Chat" || active === "Sessions") && (
          <div
            style={{ ...cardStyle, textAlign: "center", padding: "80px 40px" }}
          >
            <div style={{ fontSize: "56px", marginBottom: "20px" }}>
              {active === "Chat" ? "💬" : "📅"}
            </div>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: "700",
                color: "#7C3AED",
                marginBottom: "8px",
              }}
            >
              {active} Coming Soon!
            </h2>
            <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
              This feature is being built. Stay tuned!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
