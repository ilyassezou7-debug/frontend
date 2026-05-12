import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: "#0E5C4A",
          dark: "#0A3F33",
          hover: "#0C4F3F",
        },
        saffron: {
          DEFAULT: "#B8862F",
          dark: "#8C6420",
        },
        ivory: "#F7F5EF",
        sand: "#EAE3D2",
        mist: "#EAF2EE",
        charcoal: "#102622",
        muted: "#5B6B65",
        "border-soft": "#E5DED1",
      },
      fontFamily: {
        arabic: ["var(--font-noto-arabic)", "sans-serif"],
        display: ["var(--font-ibm-arabic)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
