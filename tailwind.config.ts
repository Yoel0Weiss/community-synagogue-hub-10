
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
      fontFamily: {
        sans: ['Heebo', 'sans-serif'],
        heading: ['Heebo', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: "#008080", // טורקיז כהה
          dark: "#006666",    // טורקיז כהה יותר
          light: "#33a3a3",   // טורקיז בהיר יותר
        },
        secondary: {
          DEFAULT: "#ea384c", // אדום של האוניברסיטה העברית
          light: "#ff4d4d",   // אדום בהיר יותר
          dark: "#d32b3d",    // אדום כהה יותר
        },
        accent: {
          DEFAULT: "#FFFFFF", // לבן
          light: "#F5F5F5",   // לבן-אפור בהיר
          dark: "#EBEBEB",    // אפור בהיר יותר
        },
        text: {
          DEFAULT: "#333333", // אפור כהה
          light: "#666666",   // אפור בהיר
          muted: "#888888",   // אפור מעומעם
        },
        success: "#2ecc71",   // ירוק
        warning: "#f39c12",   // כתום
        error: "#e74c3c",     // אדום
      },
      boxShadow: {
        'soft': '0 4px 14px 0 rgba(0, 0, 0, 0.05)',
        'raised': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
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
        "slide-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
