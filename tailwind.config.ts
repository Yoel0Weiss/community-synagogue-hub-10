
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
          DEFAULT: "#008080", // טורקיז כהה
          dark: "#006666",    // טורקיז כהה יותר
        },
        secondary: {
          DEFAULT: "#ea384c", // אדום של האוניברסיטה העברית
          light: "#ff4d4d",   // אדום בהיר יותר
        },
        accent: {
          DEFAULT: "#FFFFFF", // לבן
          light: "#F5F5F5",   // לבן-אפור בהיר
        },
        text: {
          DEFAULT: "#333333", // אפור כהה
          light: "#666666",   // אפור בהיר
        },
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
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
        "fade-up": "fade-up 0.5s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
