import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg:              "#050711",
        surface:         "#10162A",
        "surface-2":     "#151D35",
        card:            "#111A31",
        "card-hover":    "#1A2440",
        border:          "#303A5E",
        "border-2":      "#46527D",
        purple:          "#7C6FF0",
        "purple-bright": "#9F95FF",
        "purple-muted":  "#5B4FD8",
        "purple-dark":   "#3E2E8F",
        "purple-subtle": "#20284B",
        platinum:        "#D8DEEA",
        "text-1":        "#F6F8FF",
        "text-2":        "#B9C2DA",
        "text-3":        "#8894B8",
        success:         "#22D07A",
        "success-bg":    "#092618",
        warning:         "#F59E0B",
        danger:          "#E05252",
        "danger-bg":     "#1F0D0D",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        purple:       "0 0 60px rgba(124, 111, 240, 0.14)",
        "purple-sm":  "0 0 20px rgba(124, 111, 240, 0.08)",
        card:         "0 4px 32px rgba(0, 0, 0, 0.5)",
        "card-hover": "0 8px 48px rgba(0, 0, 0, 0.6)",
      },
      backgroundImage: {
        "purple-gradient": "linear-gradient(135deg, #5B4FD8 0%, #9F95FF 50%, #5B4FD8 100%)",
        "hero-gradient":   "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(91,79,216,0.14) 0%, transparent 70%)",
        "card-gradient":   "linear-gradient(135deg, rgba(18,23,44,0.85) 0%, rgba(15,19,38,0.9) 100%)",
        "dot-pattern":     "radial-gradient(circle, rgba(45,51,83,0.55) 1px, transparent 1px)",
      },
      backgroundSize: {
        "dot-sm": "24px 24px",
        "dot-md": "32px 32px",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
        shimmer:   "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
