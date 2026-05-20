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
          50: "#f2f5f7",
          100: "#e5ebef",
          200: "#ccd7df",
          300: "#a6b9c9",
          400: "#7993ab",
          500: "#58738e",
          600: "#455a73",
          700: "#38495c",
          800: "#2f3d4d",
          900: "#001A33", // Primary Brand Navy
          950: "#000d1a",
        },
        brand: {
          50: "#e6f4ff",
          100: "#cce9ff",
          200: "#99d3ff",
          300: "#66bdff",
          400: "#33a7ff",
          500: "#007FFF", // Primary Brand Electric Blue
          600: "#0066cc",
          700: "#004d99",
          800: "#003366",
          900: "#001a33",
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