/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          900: "#1E1B4B",
        },
        pink: {
          500: "#EC4899",
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        blob: "blob 8s ease-in-out infinite",
        "slide-up": "slideUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "fade-up": "fadeUp 0.5s ease both",
        "pop-in": "popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "spin-slow": "spin 12s linear infinite",
        "bounce-slow": "bounce 1.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(15px,-15px) scale(1.05)" },
        },
        slideUp: {
          from: { transform: "translateY(40px) scale(0.95)", opacity: "0" },
          to: { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        popIn: {
          from: { transform: "scale(0) rotate(-10deg)", opacity: "0" },
          to: { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
