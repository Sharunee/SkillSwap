import React, { useState, useEffect } from "react";

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

const slides = [
  {
    icon: "🔁",
    badge: "Welcome to SkillSwap",
    title: "Swap Skills,",
    highlight: "Grow Together",
    desc: "SkillSwap connects you with people who want to learn what you know — and teach what you want to learn.",
  },
  {
    icon: "🎯",
    badge: "Step 1 of 3",
    title: "Share What",
    highlight: "You Can Teach",
    desc: "Add the skills you are good at — whether it's coding, cooking, music, or anything else!",
  },
  {
    icon: "🤝",
    badge: "Step 2 of 3",
    title: "Find Your",
    highlight: "Perfect Match",
    desc: "Our smart algorithm matches you with people whose skills align with your learning goals.",
  },
  {
    icon: "🚀",
    badge: "Step 3 of 3",
    title: "Book Sessions &",
    highlight: "Start Learning",
    desc: "Book real-time sessions, chat with your matches, and start swapping skills today!",
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
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "Poppins, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Soft blobs */}
      <div
        style={{
          position: "fixed",
          top: "-80px",
          right: "-80px",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: C.primary,
          opacity: 0.15,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-60px",
          left: "-60px",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: C.soft,
          opacity: 0.2,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <p
          style={{
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "800",
            color: C.primary,
            marginBottom: "28px",
          }}
        >
          Skill<span style={{ color: C.dark }}>Swap</span> 🔁
        </p>

        {/* Card */}
        <div
          key={current}
          style={{
            background: C.white,
            borderRadius: "28px",
            padding: "40px",
            boxShadow: "0 8px 32px rgba(128,155,206,0.18)",
            border: `1px solid ${C.light}`,
            textAlign: "center",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: "140px",
              height: "140px",
              margin: "0 auto 28px",
              borderRadius: "50%",
              background: C.bg,
              border: `2px solid ${C.light}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "58px",
            }}
          >
            {slide.icon}
          </div>

          {/* Badge */}
          <span
            style={{
              display: "inline-block",
              background: C.accent,
              color: C.dark,
              fontSize: "12px",
              fontWeight: "600",
              padding: "5px 14px",
              borderRadius: "20px",
              border: `1px solid ${C.secondary}`,
              marginBottom: "16px",
            }}
          >
            {slide.badge}
          </span>

          {/* Title */}
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "800",
              color: C.dark,
              marginBottom: "10px",
              lineHeight: 1.3,
            }}
          >
            {slide.title}
            <br />
            <span style={{ color: C.primary }}>{slide.highlight}</span>
          </h1>

          {/* Desc */}
          <p
            style={{
              color: "#9CA3AF",
              fontSize: "14px",
              lineHeight: 1.7,
              marginBottom: "28px",
            }}
          >
            {slide.desc}
          </p>

          {/* Dots */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "24px",
            }}
          >
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  height: "8px",
                  width: i === current ? "24px" : "8px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  background: i === current ? C.primary : C.light,
                  transition: "all 0.3s",
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() =>
              current === slides.length - 1
                ? (window.location.href = "/register")
                : setCurrent((c) => c + 1)
            }
            style={{
              width: "100%",
              padding: "14px",
              background: C.primary,
              color: C.white,
              border: "none",
              borderRadius: "14px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "Poppins, sans-serif",
              marginBottom: "12px",
              boxShadow: "0 4px 14px rgba(128,155,206,0.4)",
            }}
          >
            {current === slides.length - 1 ? "Get Started 🚀" : "Next →"}
          </button>

          <button
            onClick={() => (window.location.href = "/login")}
            style={{
              background: "none",
              border: "none",
              color: "#9CA3AF",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              fontFamily: "Poppins, sans-serif",
              padding: "8px",
            }}
          >
            {current === slides.length - 1
              ? "Already have an account? Login"
              : "Skip for now"}
          </button>
        </div>
      </div>
    </div>
  );
}
