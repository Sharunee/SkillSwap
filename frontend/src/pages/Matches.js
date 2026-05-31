import React, { useState, useEffect, useCallback } from "react";
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

// Renders a single matched skill pill with mode, location, and a match-type badge
function MatchedSkillPill({ entry, type }) {
  const bg = type === "learn" ? C.light : C.accent;
  const border = type === "learn" ? C.accent : C.secondary;

  const modeIcon =
    entry.mode === "Online" ? "🌐" : entry.mode === "In-Person" ? "📍" : "🔄";
  const locationLabel =
    entry.mode === "Online"
      ? "Online"
      : entry.location
        ? entry.location
        : entry.mode;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "4px 10px",
        background: bg,
        color: C.dark,
        border: `1px solid ${border}`,
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        margin: "2px",
      }}
    >
      <span>{entry.skill}</span>
      <span
        style={{
          fontSize: "10px",
          color: "#6B7280",
          fontWeight: "400",
          background: "rgba(0,0,0,0.06)",
          borderRadius: "10px",
          padding: "1px 5px",
        }}
      >
        {modeIcon} {locationLabel}
      </span>
    </span>
  );
}

function Matches({ onStartChat }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");

      // No token → send user to login
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const res = await axios.get("http://localhost:5000/api/matches", {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000, // 10-second timeout so we don't hang forever
      });

      setMatches(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Failed to fetch matches:", e);

      if (!e.response) {
        // Network error — backend is probably not running
        setError(
          "Cannot reach the server. Make sure the backend is running on port 5000.",
        );
      } else if (e.response.status === 401) {
        // Token expired or invalid → go back to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      } else if (e.response.status === 404) {
        setError("Your account was not found. Please log in again.");
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }, 2000);
        return;
      } else {
        setError(
          e.response?.data?.message ||
            "Could not load matches. Please try again.",
        );
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const hasLocationMatch = (match) =>
    [...match.skillsICanLearn, ...match.skillsICanTeach].some(
      (s) => s.locationMatch,
    );

  const cardStyle = {
    background: C.white,
    borderRadius: "20px",
    padding: "24px",
    border: `2px solid ${C.light}`,
    boxShadow: "0 4px 20px rgba(128,155,206,0.10)",
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

  if (error)
    return (
      <div
        style={{
          ...cardStyle,
          textAlign: "center",
          padding: "60px 40px",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚠️</div>
        <p
          style={{ color: "#b91c1c", fontWeight: "600", marginBottom: "16px" }}
        >
          {error}
        </p>
        <button
          onClick={fetchMatches}
          style={{
            padding: "10px 20px",
            background: C.primary,
            color: C.white,
            border: "none",
            borderRadius: "10px",
            fontWeight: "700",
            cursor: "pointer",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          🔄 Retry
        </button>
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
            color: C.primary,
            marginBottom: "8px",
          }}
        >
          No Matches Yet!
        </h2>
        <p style={{ color: "#9CA3AF", fontSize: "14px", marginBottom: "20px" }}>
          Add more skills to your profile to find matches!
        </p>
        <button
          onClick={fetchMatches}
          style={{
            padding: "8px 18px",
            background: C.light,
            color: C.dark,
            border: `1px solid ${C.accent}`,
            borderRadius: "10px",
            fontWeight: "600",
            fontSize: "13px",
            cursor: "pointer",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          🔄 Refresh
        </button>
      </div>
    );

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
          Found{" "}
          <strong style={{ color: C.primary }}>
            {matches.length} match{matches.length > 1 ? "es" : ""}
          </strong>{" "}
          based on your skills!
        </p>
        <button
          onClick={fetchMatches}
          style={{
            padding: "6px 14px",
            background: C.light,
            color: C.dark,
            border: `1px solid ${C.accent}`,
            borderRadius: "10px",
            fontWeight: "600",
            fontSize: "12px",
            cursor: "pointer",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          🔄 Refresh
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
        }}
      >
        {matches.map((match, i) => {
          const locMatch = hasLocationMatch(match);
          return (
            <div
              key={match.user._id || i}
              style={{
                ...cardStyle,
                border: locMatch
                  ? `2px solid ${C.accent}`
                  : `2px solid ${C.light}`,
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    background: C.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: C.white,
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
                      color: C.dark,
                      marginBottom: "2px",
                    }}
                  >
                    {match.user.name}
                  </h3>
                  <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
                    📍 {match.user.location || "Location not set"}
                  </p>
                </div>

                {/* Match % badge */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      background: match.matchPercent >= 75 ? C.light : C.accent,
                      border: `2px solid ${match.matchPercent >= 75 ? C.accent : C.secondary}`,
                      borderRadius: "12px",
                      padding: "6px 12px",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "18px",
                        fontWeight: "800",
                        color: C.dark,
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
                  {locMatch ? (
                    <span
                      style={{
                        fontSize: "10px",
                        background: "#d1fae5",
                        color: "#065f46",
                        border: "1px solid #6ee7b7",
                        borderRadius: "10px",
                        padding: "2px 7px",
                        fontWeight: "700",
                      }}
                    >
                      📍 Skill & Location
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: "10px",
                        background: "#fef9c3",
                        color: "#854d0e",
                        border: "1px solid #fde047",
                        borderRadius: "10px",
                        padding: "2px 7px",
                        fontWeight: "700",
                      }}
                    >
                      🎯 Skill Only
                    </span>
                  )}
                </div>
              </div>

              {/* Match progress bar */}
              <div style={{ marginBottom: "14px" }}>
                <div
                  style={{
                    height: "6px",
                    background: C.light,
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${match.matchPercent}%`,
                      background: C.primary,
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
                    marginBottom: "14px",
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
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}
                  >
                    {match.skillsICanLearn.map((s, idx) => (
                      <MatchedSkillPill key={idx} entry={s} type="learn" />
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
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}
                  >
                    {match.skillsICanTeach.map((s, idx) => (
                      <MatchedSkillPill key={idx} entry={s} type="teach" />
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
                  background: C.primary,
                  color: C.white,
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
          );
        })}
      </div>
    </div>
  );
}

export default Matches;
