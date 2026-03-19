import React, { useState, useEffect } from "react";

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
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-5 relative overflow-hidden">
      {/* Blobs */}
      <div className="fixed w-96 h-96 rounded-full bg-purple-600 opacity-20 blur-3xl -top-32 -right-32 pointer-events-none animate-blob" />
      <div
        className="fixed w-80 h-80 rounded-full bg-pink-500 opacity-20 blur-3xl -bottom-24 -left-24 pointer-events-none animate-blob"
        style={{ animationDelay: "2s" }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <p className="text-center text-xl font-extrabold text-purple-600 mb-7 tracking-tight">
          Skill<span className="text-gray-800">Swap</span> 🔁
        </p>

        {/* Card */}
        <div
          key={current}
          className="bg-white rounded-3xl p-10 shadow-purple-lg border border-purple-100 text-center animate-slide-up"
        >
          {/* Icon */}
          <div className="relative w-40 h-40 mx-auto mb-8">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-100 flex items-center justify-center text-6xl animate-float">
              {slide.icon}
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-300 opacity-40 animate-spin-slow" />
          </div>

          {/* Badge */}
          <span className="inline-block bg-purple-50 text-purple-600 text-xs font-semibold px-4 py-1.5 rounded-full border border-purple-100 mb-4">
            {slide.badge}
          </span>

          {/* Title */}
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
            {slide.title}
            <br />
            <span className="text-gradient">{slide.highlight}</span>
          </h1>

          {/* Desc */}
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            {slide.desc}
          </p>

          {/* Dots */}
          <div className="flex justify-center gap-2 mb-7">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-6 gradient-primary" : "w-2 bg-purple-100"}`}
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
            className="w-full py-4 gradient-primary text-white font-bold text-base rounded-2xl shadow-purple-btn hover:-translate-y-0.5 transition-all duration-300 mb-3"
          >
            {current === slides.length - 1 ? "Get Started 🚀" : "Next →"}
          </button>

          <button
            onClick={() => (window.location.href = "/login")}
            className="text-gray-400 text-sm font-medium hover:text-purple-600 transition-colors py-2"
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
