/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Same values as the CSS variables in src/index.css (hex here so opacity modifiers like bg-brand/10 work).
      colors: {
        chalk: "#eef0ec",
        surface: "#ffffff",
        iron: { DEFAULT: "#1c2127", soft: "#2a313a" },
        steel: "#5f6872",
        line: "#d6dad3",
        ink: "#1c2127",
        brand: { DEFAULT: "#1d4e9e", soft: "#e3eaf6" },
        protein: "#c8323c",
        carbs: "#e2a20b",
        fat: "#2f8559",
        danger: "#a3202a",
        ok: "#2f8559",
      },
      fontFamily: {
        display: ['"Barlow Condensed"', "system-ui", "sans-serif"],
        sans: ['"Barlow"', "system-ui", "sans-serif"],
      },
      borderRadius: { panel: "6px" },
    },
  },
  plugins: [],
};
