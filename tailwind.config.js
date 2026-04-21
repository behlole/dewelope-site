/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        // Brand: deep midnight + electric accents
        primary: "#06070d",
        surface: "#0c0e1a",
        "surface-2": "#11142a",
        "surface-3": "#171a36",
        border: "#1f2347",
        secondary: "#9aa3c7",
        muted: "#6b7299",
        accent: "#7c5cff",        // electric violet
        "accent-2": "#22d3ee",    // cyan
        "accent-3": "#a3e635",    // lime
        "accent-4": "#fb7185",    // rose
        // legacy aliases (kept so existing imports compile)
        tertiary: "#11142a",
        "black-100": "#0c0e1a",
        "black-200": "#06070d",
        "white-100": "#f3f3f3",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Space Grotesk'", "Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 30px 80px -20px rgba(124, 92, 255, 0.35)",
        glow: "0 0 60px rgba(124, 92, 255, 0.45)",
        "glow-cyan": "0 0 60px rgba(34, 211, 238, 0.35)",
        inset: "inset 0 1px 0 0 rgba(255,255,255,0.06)",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(124,92,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,255,0.07) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(circle at 50% 0%, rgba(124,92,255,0.18), transparent 60%)",
        "hero-pattern":
          "radial-gradient(ellipse at top, rgba(124,92,255,0.18), transparent 55%), radial-gradient(ellipse at bottom right, rgba(34,211,238,0.10), transparent 60%)",
      },
      backgroundSize: {
        grid: "44px 44px",
      },
      animation: {
        "spin-slow": "spin 18s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "marquee": "marquee 40s linear infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: 0.7 },
          "50%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
