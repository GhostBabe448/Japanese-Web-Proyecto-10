import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f6f5f4",
          100: "#e8e6e3",
          200: "#d1cdc7",
          300: "#b0a99f",
          400: "#8f8578",
          500: "#756a5c",
          600: "#5c5348",
          700: "#4a433b",
          800: "#3d3832",
          900: "#35312c",
          950: "#1c1917",
        },
        crimson: {
          DEFAULT: "#c41e3a",
          light: "#e8364f",
          dark: "#9a1830",
        },
        gold: {
          DEFAULT: "#c9a227",
          light: "#dbb84a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-noto)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
