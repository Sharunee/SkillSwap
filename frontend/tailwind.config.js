/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Pastel palette
        pastel: {
          blue:     "#BDE8FF",
          lavender: "#D8C9FF",
          pink:     "#FFB3CC",
          yellow:   "#FFFAB3",
        },
        // Dark accent tones derived from the pastel palette
        accent: {
          blue:     "#4BA8D4",
          lavender: "#7C5CBF",
          pink:     "#D45580",
          yellow:   "#B8A800",
        },
        // Neutral / text
        brand: {
          text:   "#2D2040",
          muted:  "#8B7DAA",
          border: "#E8DFFF",
          bg:     "#F6F3FF",
          sidebar:"#2D1F4E",
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      animation: {
        float:        "float 3s ease-in-out infinite",
        blob:         "blob 8s ease-in-out infinite",
        "slide-up":   "slideUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "fade-up":    "fadeUp 0.5s ease both",
        "pop-in":     "popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "spin-slow":  "spin 12s linear infinite",
        "bounce-slow":"bounce 1.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":       { transform: "translateY(-12px)" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%":       { transform: "translate(15px,-15px) scale(1.05)" },
        },
        slideUp: {
          from: { transform: "translateY(40px) scale(0.95)", opacity: "0" },
          to:   { transform: "translateY(0) scale(1)",       opacity: "1" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        popIn: {
          from: { transform: "scale(0) rotate(-10deg)", opacity: "0" },
          to:   { transform: "scale(1) rotate(0deg)",   opacity: "1" },
        },
      },
      boxShadow: {
        "pastel":     "0 8px 32px rgba(216,201,255,0.45)",
        "purple-lg":  "0 8px 32px rgba(124,92,191,0.18)",
        "purple-btn": "0 4px 16px rgba(216,201,255,0.6)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #D8C9FF, #FFB3CC)",
        "gradient-cool":    "linear-gradient(135deg, #BDE8FF, #D8C9FF)",
        "gradient-warm":    "linear-gradient(135deg, #FFB3CC, #FFFAB3)",
        "gradient-sidebar": "linear-gradient(180deg, #1C1235, #2D1F4E)",
      },
    },
  },
  plugins: [],
};
