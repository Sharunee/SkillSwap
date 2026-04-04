import React, { useState, useEffect } from "react";
import axios from "axios";

function Matches({ onStartChat }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/matches", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMatches(res.data);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchMatches();
  }, []);

  const cardStyle = {
    background: "#fff",
    borderRadius: "20px",
    padding: "24px",
    border: "2px solid #EDE9FE",
    boxShadow: "0 4px 20px rgba(124,58,237,0.08)",
  };

  if (loading)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px",
          color: "#9CA3AF",
          fontSize: "16px",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
        Finding your matches...
      </div>
    );

  if (matches.length === 0)
    return (
      <div
        style={{
          ...cardStyle,
          textAlign: "center",
          padding: "80px 40px",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <div style={{ fontSize: "56px", marginBottom: "20px" }}>🤝</div>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "#7C3AED",
            marginBottom: "8px",
          }}
        >
          No Matches Yet!
        </h2>
        <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
          Add more skills to your profile to find matches!
        </p>
      </div>
    );

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <p style={{ color: "#9CA3AF", fontSize: "14px", marginBottom: "20px" }}>
        Found{" "}
        <strong style={{ color: "#7C3AED" }}>
          {matches.length} match{matches.length > 1 ? "es" : ""}
        </strong>{" "}
        based on your skills!
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
        }}
      >
        {matches.map((match, i) => (
          <div key={i} style={cardStyle}>
            {/* Header */}
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
                  background: "linear-gradient(135deg, #7C3AED, #EC4899)",
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
                  📍 {match.user.location || "Location not set"}
                </p>
              </div>
              <div
                style={{
                  background: match.matchPercent >= 75 ? "#F0FDF4" : "#F5F3FF",
                  border: `2px solid ${match.matchPercent >= 75 ? "#86EFAC" : "#DDD6FE"}`,
                  borderRadius: "12px",
                  padding: "6px 12px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: "800",
                    color: match.matchPercent >= 75 ? "#16A34A" : "#7C3AED",
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

            {/* Match bar */}
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
                    background: "linear-gradient(135deg, #7C3AED, #EC4899)",
                    borderRadius: "3px",
                  }}
                />
              </div>
            </div>

            {/* Bio */}
            {match.user.bio && (
              <p
                style={{
                  fontSize: "13px",
                  color: "#6B7280",
                  marginBottom: "16px",
                  lineHeight: 1.6,
                }}
              >
                {match.user.bio}
              </p>
            )}

            {/* They can teach me */}
            {match.skillsICanLearn.length > 0 && (
              <div style={{ marginBottom: "12px" }}>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "6px",
                  }}
                >
                  🎯 They can teach you
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {match.skillsICanLearn.map((s) => (
                    <span
                      key={s}
                      style={{
                        padding: "3px 10px",
                        background: "#F0FDF4",
                        color: "#16A34A",
                        border: "1px solid #86EFAC",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* I can teach them */}
            {match.skillsICanTeach.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "6px",
                  }}
                >
                  📚 You can teach them
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {match.skillsICanTeach.map((s) => (
                    <span
                      key={s}
                      style={{
                        padding: "3px 10px",
                        background: "#F5F3FF",
                        color: "#7C3AED",
                        border: "1px solid #DDD6FE",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Button */}
            <button
              onClick={() => onStartChat && onStartChat(match.user)}
              style={{
                width: "100%",
                padding: "12px",
                background: "linear-gradient(135deg, #7C3AED, #EC4899)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              💬 Start Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Matches;
