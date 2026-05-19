import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#E8EDF5",
          100: "#C5D3E8",
          200: "#93AACA",
          300: "#6181AC",
          400: "#3F5F8F",
          500: "#1E3A6E",
          600: "#1A325E",
          700: "#162A4E",
          800: "#12223E",
          900: "#0E1A2E",
          950: "#07111D",
        },
        brand: {
          50: "#EBF5FF",
          100: "#E1F0FF",
          200: "#B3DFFF",
          300: "#80CEFF",
          400: "#4DBDFF",
          500: "#1AACFF",
          600: "#0085CC",
          700: "#006399",
          800: "#004166",
          900: "#002033",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        glow: "0 0 20px rgba(26, 172, 255, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;