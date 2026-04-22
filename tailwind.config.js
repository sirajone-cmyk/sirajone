/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rahla: {
          bg: "#020617",
          panel: "#0b1220",
          panelAlt: "#111a2b",
          glow: "#34d399",
          glowSoft: "#6ee7b7",
          textSoft: "#cbd5e1",
        },
      },
      backgroundImage: {
        "hero-overlay":
          "linear-gradient(110deg, rgba(2,6,23,0.9) 18%, rgba(2,6,23,0.72) 48%, rgba(2,6,23,0.85) 100%)",
      },
    },
  },
  plugins: [],
};
