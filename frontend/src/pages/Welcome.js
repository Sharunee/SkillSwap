import React, { useState, useEffect } from "react";

const C = {
  blue:         "#BDE8FF",
  lavender:     "#D8C9FF",
  pink:         "#FFB3CC",
  yellow:       "#FFFAB3",
  lavenderDark: "#7C5CBF",
  pinkDark:     "#D45580",
  blueDark:     "#4BA8D4",
  text:         "#2D2040",
  muted:        "#8B7DAA",
  border:       "#E8DFFF",
};

const slides = [
  {
    icon: "🔁", badge: "Welcome to SkillSwap",
    title: "Swap Skills,", highlight: "Grow Together",
    desc: "SkillSwap connects you with people who want to learn what you know — and teach what you want to learn.",
    accent: C.lavender, dark: C.lavenderDark,
  },
  {
    icon: "🎯", badge: "Step 1 of 3",
    title: "Share What", highlight: "You Can Teach",
    desc: "Add the skills you are good at — whether it's coding, cooking, music, or anything else!",
    accent: C.blue, dark: C.blueDark,
  },
  {
    icon: "🤝", badge: "Step 2 of 3",
    title: "Find Your", highlight: "Perfect Match",
    desc: "Our smart algorithm matches you with people whose skills align with your learning goals.",
    accent: C.pink, dark: C.pinkDark,
  },
  {
    icon: "🚀", badge: "Step 3 of 3",
    title: "Book Sessions &", highlight: "Start Learning",
    desc: "Book real-time sessions, chat with your matches, and start swapping skills today!",
    accent: C.yellow, dark: "#9A8800",
  },
];

export default function Welcome() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) window.location.href = "/dashboard";
  }, []);

  const slide = slides[current];

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${C.blue}55 0%, ${C.lavender}55 40%, ${C.pink}44 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", position: "relative", overflow: "hidden",
      fontFamily: "Poppins, sans-serif",
    }}>
      {/* Animated blobs */}
      <div style={{
        position: "fixed", top: "-80px", right: "-80px",
        width: "320px", height: "320px", borderRadius: "50%",
        background: C.pink, opacity: 0.35, filter: "blur(60px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: "-80px", left: "-80px",
        width: "280px", height: "280px", borderRadius: "50%",
        background: C.blue, opacity: 0.4, filter: "blur(60px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", top: "35%", right: "5%",
        width: "180px", height: "180px", borderRadius: "50%",
        background: C.yellow, opacity: 0.3, filter: "blur(50px)", pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 1 }}>

        {/* Logo */}
        <p style={{
          textAlign: "center", fontSize: "20px", fontWeight: "800",
          color: C.lavenderDark, marginBottom: "28px", letterSpacing: "-0.5px",
        }}>
          Skill<span style={{ color: C.text }}>Swap</span> 🔁
        </p>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.88)", backdropFilter: "blur(18px)",
          borderRadius: "28px", padding: "40px",
          boxShadow: `0 12px 48px ${slide.accent}88`,
          border: `2px solid ${slide.accent}`,
          textAlign: "center",
          transition: "box-shadow 0.4s, border-color 0.4s",
        }}>
          {/* Icon */}
          <div style={{ position: "relative", width: "140px", height: "140px", margin: "0 auto 24px" }}>
            <div style={{
              width: "100%", height: "100%", borderRadius: "50%",
              background: `${slide.accent}55`,
              border: `2px solid ${slide.accent}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "56px",
            }}>{slide.icon}</div>
            <div style={{
              position: "absolute", inset: "-8px", borderRadius: "50%",
              border: `2px dashed ${slide.accent}`,
              opacity: 0.5,
              animation: "spin 12s linear infinite",
            }} />
          </div>

          {/* Badge */}
          <span style={{
            display: "inline-block",
            background: `${slide.accent}55`, color: slide.dark,
            fontSize: "12px", fontWeight: "700",
            padding: "5px 16px", borderRadius: "20px",
            border: `1px solid ${slide.accent}`,
            marginBottom: "16px",
          }}>{slide.badge}</span>

          {/* Title */}
          <h1 style={{
            fontSize: "28px", fontWeight: "800", color: C.text,
            marginBottom: "12px", lineHeight: 1.2,
          }}>
            {slide.title}<br />
            <span style={{ color: slide.dark }}>{slide.highlight}</span>
          </h1>

          {/* Desc */}
          <p style={{ color: C.muted, fontSize: "14px", lineHeight: 1.7, marginBottom: "28px" }}>
            {slide.desc}
          </p>

          {/* Dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "24px" }}>
            {slides.map((s, i) => (
              <button key={i} onClick={() => setCurrent(i)} style={{
                height: "8px",
                width: i === current ? "24px" : "8px",
                borderRadius: "4px",
                background: i === current ? slide.dark : slide.accent,
                border: "none", cursor: "pointer",
                transition: "all 0.3s", padding: 0,
              }} />
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => current === slides.length - 1
              ? (window.location.href = "/register")
              : setCurrent((c) => c + 1)
            }
            style={{
              width: "100%", padding: "16px",
              background: `linear-gradient(135deg, ${slide.accent}, ${slides[(current + 1) % slides.length].accent})`,
              color: slide.dark, border: "none", borderRadius: "16px",
              fontSize: "15px", fontWeight: "700", cursor: "pointer",
              fontFamily: "Poppins, sans-serif",
              marginBottom: "12px",
              boxShadow: `0 6px 20px ${slide.accent}88`,
              transition: "box-shadow 0.2s",
            }}
          >{current === slides.length - 1 ? "Get Started 🚀" : "Next →"}</button>

          <button
            onClick={() => (window.location.href = "/login")}
            style={{
              background: "none", border: "none", color: C.muted,
              fontSize: "13px", fontWeight: "500", cursor: "pointer",
              fontFamily: "Poppins, sans-serif", padding: "8px",
              transition: "color 0.2s",
            }}
          >{current === slides.length - 1 ? "Already have an account? Login" : "Skip for now"}</button>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
