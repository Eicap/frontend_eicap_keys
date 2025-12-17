/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#254181",
          50: "#e8edf7",
          100: "#d1daf0",
          200: "#a3b5e0",
          300: "#7590d1",
          400: "#476bc1",
          500: "#254181",
          600: "#1e3467",
          700: "#16274d",
          800: "#0f1a34",
          900: "#070d1a",
        },
        accent: {
          DEFAULT: "#db1d25",
          50: "#fef2f2",
          100: "#fde6e7",
          200: "#fbcdcf",
          300: "#f89a9e",
          400: "#f4676d",
          500: "#db1d25",
          600: "#b0171e",
          700: "#85111a",
          800: "#5a0c11",
          900: "#2f0609",
        },
      },
      animation: {
        "slide-in": "slideIn 0.3s ease-out",
        "slide-out": "slideOut 0.3s ease-out",
        "fade-in": "fadeIn 0.2s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideOut: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
