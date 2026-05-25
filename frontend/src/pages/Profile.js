import React, { useState, useEffect } from "react";
import axios from "axios";

const C = {
  blue:         "#BDE8FF",
  lavender:     "#D8C9FF",
  pink:         "#FFB3CC",
  yellow:       "#FFFAB3",
  lavenderDark: "#7C5CBF",
  pinkDark:     "#D45580",
  blueDark:     "#4BA8D4",
  yellowDark:   "#B8A800",
  text:         "#2D2040",
  muted:        "#8B7DAA",
  border:       "#E8DFFF",
  bg:           "#F6F3FF",
  white:        "#FFFFFF",
};

function Profile() {
  const [user, setUser]                   = useState(null);
  const [name, setName]                   = useState("");
  const [bio, setBio]                     = useState("");
  const [location, setLocation]           = useState("");
  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsWanted, setSkillsWanted]   = useState([]);
  const [newOffered, setNewOffered]       = useState("");
  const [newWanted, setNewWanted]         = useState("");
  const [saving, setSaving]               = useState(false);
  const [message, setMessage]             = useState("");

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
    } catch (e) { console.log(e); }
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
    } catch { setMessage("❌ Save failed"); }
    setSaving(false);
  };

  const cardStyle = {
    background: C.white,
    borderRadius: "20px", padding: "24px",
    border: `2px solid ${C.border}`,
    boxShadow: `0 4px 20px rgba(124,92,191,0.08)`,
    marginBottom: "20px",
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    border: `2px solid ${C.border}`, borderRadius: "12px",
    fontSize: "13px", outline: "none",
    background: `${C.lavender}22`, color: C.text,
    fontFamily: "Poppins, sans-serif", boxSizing: "border-box",
  };

  const btnStyle = {
    padding: "12px 24px",
    background: `linear-gradient(135deg, ${C.lavender}, ${C.pink})`,
    color: C.lavenderDark, border: "none", borderRadius: "12px",
    fontWeight: "700", fontSize: "14px", cursor: "pointer",
    fontFamily: "Poppins, sans-serif",
  };

  const tagStyleOffered = {
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "4px 12px",
    background: C.lavender, color: C.lavenderDark,
    border: `1px solid ${C.lavenderDark}33`,
    borderRadius: "20px", fontSize: "12px", fontWeight: "600", margin: "3px",
  };

  const tagStyleWanted = {
    ...tagStyleOffered,
    background: C.pink, color: C.pinkDark,
    border: `1px solid ${C.pinkDark}33`,
  };

  const labelStyle = {
    fontSize: "11px", fontWeight: "600", color: C.muted,
    textTransform: "uppercase", letterSpacing: "0.5px",
  };

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* Profile Header */}
      <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{
          width: "64px", height: "64px", borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.lavender}, ${C.pink})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: C.lavenderDark, fontWeight: "800", fontSize: "26px", flexShrink: 0,
        }}>
          {name?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: C.text }}>{name || "Your Name"}</h2>
          <p style={{ fontSize: "13px", color: C.muted, marginTop: "2px" }}>{user?.email}</p>
          <span style={{
            display: "inline-block",
            background: `${C.yellow}99`, color: C.yellowDark,
            border: `1px solid ${C.yellowDark}44`,
            borderRadius: "20px", padding: "2px 10px",
            fontSize: "11px", fontWeight: "600", marginTop: "6px",
          }}>✓ Active Member</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

        {/* Personal Info */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: C.text, marginBottom: "16px" }}>
            👤 Personal Info
          </h3>
          <label style={labelStyle}>Full Name</label>
          <input style={{ ...inputStyle, margin: "5px 0 14px" }} value={name}
            onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
          <label style={labelStyle}>Location</label>
          <input style={{ ...inputStyle, margin: "5px 0 14px" }} value={location}
            onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" />
          <label style={labelStyle}>Bio</label>
          <input style={{ ...inputStyle, margin: "5px 0 0" }} value={bio}
            onChange={(e) => setBio(e.target.value)} placeholder="Tell others about yourself..." />
        </div>

        {/* Save */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: C.text, marginBottom: "12px" }}>
            💾 Save Changes
          </h3>
          <p style={{ color: C.muted, fontSize: "13px", lineHeight: 1.7, marginBottom: "16px" }}>
            Make sure all your details are correct before saving. Your profile is visible to other SkillSwap members for matching.
          </p>
          <button onClick={saveProfile} disabled={saving}
            style={{ ...btnStyle, width: "100%", padding: "14px", fontSize: "15px" }}>
            {saving ? "Saving..." : "💾 Save Profile"}
          </button>
          {message && (
            <p style={{
              marginTop: "12px", textAlign: "center", fontSize: "13px",
              color: message.includes("✅") ? "#2D8A5A" : "#C0365A", fontWeight: "600",
            }}>{message}</p>
          )}
        </div>

        {/* Skills Offered */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: C.text, marginBottom: "16px" }}>
            🎯 Skills I Can Teach
          </h3>
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <input
              style={{ ...inputStyle, flex: 1 }} value={newOffered}
              onChange={(e) => setNewOffered(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addOffered()}
              placeholder="e.g. React, Guitar..."
            />
            <button onClick={addOffered} style={{ ...btnStyle, padding: "11px 16px", fontSize: "18px" }}>+</button>
          </div>
          <div style={{
            minHeight: "44px", padding: "10px",
            background: `${C.lavender}44`, borderRadius: "10px",
            border: `2px dashed ${C.lavender}`,
          }}>
            {skillsOffered.length === 0
              ? <span style={{ color: "#ccc", fontSize: "12px", fontStyle: "italic" }}>Add your first skill!</span>
              : skillsOffered.map((s) => (
                <span key={s} style={tagStyleOffered}>
                  {s}
                  <button onClick={() => setSkillsOffered(skillsOffered.filter((x) => x !== s))}
                    style={{ background: "none", border: "none", cursor: "pointer", color: C.lavenderDark, opacity: 0.5, fontSize: "14px", padding: 0 }}>×</button>
                </span>
              ))
            }
          </div>
        </div>

        {/* Skills Wanted */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: C.text, marginBottom: "16px" }}>
            📚 Skills I Want to Learn
          </h3>
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <input
              style={{ ...inputStyle, flex: 1 }} value={newWanted}
              onChange={(e) => setNewWanted(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addWanted()}
              placeholder="e.g. Python, Photography..."
            />
            <button onClick={addWanted} style={{
              ...btnStyle, padding: "11px 16px", fontSize: "18px",
              background: `linear-gradient(135deg, ${C.pink}, ${C.yellow})`,
            }}>+</button>
          </div>
          <div style={{
            minHeight: "44px", padding: "10px",
            background: `${C.pink}44`, borderRadius: "10px",
            border: `2px dashed ${C.pink}`,
          }}>
            {skillsWanted.length === 0
              ? <span style={{ color: "#ccc", fontSize: "12px", fontStyle: "italic" }}>What do you want to learn?</span>
              : skillsWanted.map((s) => (
                <span key={s} style={tagStyleWanted}>
                  {s}
                  <button onClick={() => setSkillsWanted(skillsWanted.filter((x) => x !== s))}
                    style={{ background: "none", border: "none", cursor: "pointer", color: C.pinkDark, opacity: 0.5, fontSize: "14px", padding: 0 }}>×</button>
                </span>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
