
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F5F5F5",
          dark: "#E5E5E5",
        },
        secondary: {
          DEFAULT: "#002E5F", // כחול כהה של האוניברסיטה העברית
          light: "#0047B3",
        },
        accent: {
          DEFAULT: "#9B0000", // אדום של האוניברסיטה העברית
          light: "#CC0000",
        },
        text: {
          DEFAULT: "#1A1A1A",
          light: "#4A4A4A",
        },
        background: {
          DEFAULT: "#FFFFFF",
          dark: "#F8F8F8",
        }
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
