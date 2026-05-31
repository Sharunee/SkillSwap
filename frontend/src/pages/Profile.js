import React, { useState, useEffect } from "react";
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

// ── Reusable skill-entry form ──────────────────────────────────────────────
function SkillForm({ onAdd, placeholder }) {
  const [skill, setSkill] = useState("");
  const [mode, setMode] = useState("Online");
  const [location, setLocation] = useState("");

  const handleAdd = () => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    onAdd({
      skill: trimmed,
      mode,
      location: mode === "Online" ? "" : location.trim(),
    });
    setSkill("");
    setMode("Online");
    setLocation("");
  };

  const inputStyle = {
    padding: "11px 14px",
    border: `2px solid ${C.light}`,
    borderRadius: "12px",
    fontSize: "13px",
    outline: "none",
    background: C.bg,
    color: C.dark,
    fontFamily: "Poppins, sans-serif",
    boxSizing: "border-box",
    width: "100%",
  };

  const selectStyle = {
    ...inputStyle,
    cursor: "pointer",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginBottom: "12px",
      }}
    >
      {/* Row 1: skill name + add button */}
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          style={{ ...inputStyle, flex: 1 }}
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder={placeholder}
        />
        <button
          onClick={handleAdd}
          style={{
            padding: "11px 16px",
            background: C.primary,
            color: C.white,
            border: "none",
            borderRadius: "12px",
            fontWeight: "700",
            fontSize: "18px",
            cursor: "pointer",
            fontFamily: "Poppins, sans-serif",
            flexShrink: 0,
          }}
        >
          +
        </button>
      </div>

      {/* Row 2: mode selector */}
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        style={selectStyle}
      >
        <option value="Online">🌐 Online</option>
        <option value="In-Person">📍 In-Person</option>
        <option value="Both">🔄 Both (Online & In-Person)</option>
      </select>

      {/* Row 3: location — only shown for In-Person / Both */}
      {mode !== "Online" && (
        <input
          style={inputStyle}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="📍 City / Area (e.g. Colombo, Kandy...)"
        />
      )}
    </div>
  );
}

// ── Skill tag with mode + location badge ──────────────────────────────────
function SkillTag({ entry, onRemove, bgColor, borderColor }) {
  const modeIcon =
    entry.mode === "Online" ? "🌐" : entry.mode === "In-Person" ? "📍" : "🔄";
  const modeLabel =
    entry.mode === "Online"
      ? "Online"
      : entry.mode === "In-Person"
        ? entry.location || "In-Person"
        : entry.location
          ? `Both · ${entry.location}`
          : "Both";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "5px 10px 5px 12px",
        background: bgColor,
        color: C.dark,
        border: `1px solid ${borderColor}`,
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        margin: "3px",
      }}
    >
      <span>{entry.skill}</span>
      <span
        style={{
          fontSize: "10px",
          color: "#6B7280",
          fontWeight: "400",
          background: "rgba(0,0,0,0.05)",
          borderRadius: "10px",
          padding: "1px 6px",
        }}
      >
        {modeIcon} {modeLabel}
      </span>
      <button
        onClick={onRemove}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: C.dark,
          opacity: 0.5,
          fontSize: "14px",
          padding: "0 0 0 2px",
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </span>
  );
}

// ── Main Profile component ─────────────────────────────────────────────────
function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsWanted, setSkillsWanted] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    loadProfile();
  }, []);

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

  const addOffered = (entry) => {
    // Prevent duplicate skill names
    if (
      !skillsOffered.find(
        (s) => s.skill.toLowerCase() === entry.skill.toLowerCase(),
      )
    ) {
      setSkillsOffered([...skillsOffered, entry]);
    }
  };

  const addWanted = (entry) => {
    if (
      !skillsWanted.find(
        (s) => s.skill.toLowerCase() === entry.skill.toLowerCase(),
      )
    ) {
      setSkillsWanted([...skillsWanted, entry]);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("❌ Not logged in. Please log in again.");
        setSaving(false);
        return;
      }
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
    } catch (err) {
      console.error("Save profile error:", err);
      const serverMsg = err?.response?.data?.message;
      setMessage(`❌ ${serverMsg || "Save failed. Please try again."}`);
    } finally {
      setSaving(false);
    }
  };

  const cardStyle = {
    background: C.white,
    borderRadius: "20px",
    padding: "24px",
    border: `2px solid ${C.light}`,
    boxShadow: "0 4px 20px rgba(128,155,206,0.10)",
    marginBottom: "20px",
  };

  const labelStyle = {
    fontSize: "11px",
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    border: `2px solid ${C.light}`,
    borderRadius: "12px",
    fontSize: "13px",
    outline: "none",
    background: C.bg,
    color: C.dark,
    fontFamily: "Poppins, sans-serif",
    boxSizing: "border-box",
  };

  const btnStyle = {
    padding: "12px 24px",
    background: C.primary,
    color: C.white,
    border: "none",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "Poppins, sans-serif",
  };

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      {/* Profile Header */}
      <div
        style={{
          ...cardStyle,
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: C.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.white,
            fontWeight: "800",
            fontSize: "26px",
            flexShrink: 0,
          }}
        >
          {name?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: C.dark }}>
            {name || "Your Name"}
          </h2>
          <p style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "2px" }}>
            {user?.email}
          </p>
          <span
            style={{
              display: "inline-block",
              background: C.light,
              color: "#2a6b3a",
              border: `1px solid ${C.accent}`,
              borderRadius: "20px",
              padding: "2px 10px",
              fontSize: "11px",
              fontWeight: "600",
              marginTop: "6px",
            }}
          >
            ✓ Active Member
          </span>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* Personal Info */}
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "700",
              color: C.dark,
              marginBottom: "16px",
            }}
          >
            👤 Personal Info
          </h3>
          <label style={labelStyle}>Full Name</label>
          <input
            style={{ ...inputStyle, margin: "5px 0 14px" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
          />
          <label style={labelStyle}>Location</label>
          <input
            style={{ ...inputStyle, margin: "5px 0 14px" }}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, Country"
          />
          <label style={labelStyle}>Bio</label>
          <input
            style={{ ...inputStyle, margin: "5px 0 0" }}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell others about yourself..."
          />
        </div>

        {/* Save */}
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "700",
              color: C.dark,
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
            Make sure all your details are correct before saving. Your profile
            is visible to other SkillSwap members for matching.
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
                color: message.includes("✅") ? "#2a6b3a" : "#b91c1c",
                fontWeight: "600",
              }}
            >
              {message}
            </p>
          )}
        </div>

        {/* Skills I Can Teach */}
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "700",
              color: C.dark,
              marginBottom: "16px",
            }}
          >
            🎯 Skills I Can Teach
          </h3>
          <SkillForm onAdd={addOffered} placeholder="e.g. React, Guitar..." />
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
                style={{ color: "#bbb", fontSize: "12px", fontStyle: "italic" }}
              >
                Add your first skill!
              </span>
            ) : (
              skillsOffered.map((s, i) => (
                <SkillTag
                  key={i}
                  entry={s}
                  bgColor={C.light}
                  borderColor={C.accent}
                  onRemove={() =>
                    setSkillsOffered(
                      skillsOffered.filter((_, idx) => idx !== i),
                    )
                  }
                />
              ))
            )}
          </div>
        </div>

        {/* Skills I Want to Learn */}
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "700",
              color: C.dark,
              marginBottom: "16px",
            }}
          >
            📚 Skills I Want to Learn
          </h3>
          <SkillForm
            onAdd={addWanted}
            placeholder="e.g. Python, Photography..."
          />
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
                style={{ color: "#bbb", fontSize: "12px", fontStyle: "italic" }}
              >
                What do you want to learn?
              </span>
            ) : (
              skillsWanted.map((s, i) => (
                <SkillTag
                  key={i}
                  entry={s}
                  bgColor={C.soft}
                  borderColor={C.secondary}
                  onRemove={() =>
                    setSkillsWanted(skillsWanted.filter((_, idx) => idx !== i))
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
