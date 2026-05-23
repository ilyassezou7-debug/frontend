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
          deep: "#082E25",
        },
        saffron: {
          DEFAULT: "#B8862F",
          dark: "#8C6420",
          light: "#D4A24A",
        },
        ivory: "#F7F5EF",
        "ivory-2": "#FBFAF5",
        sand: "#EAE3D2",
        mist: "#EAF2EE",
        charcoal: "#102622",
        muted: "#5B6B65",
        "border-soft": "#E5DED1",
      },
      backgroundImage: {
        "gradient-gold": "linear-gradient(135deg, #D4A24A 0%, #B8862F 55%, #8C6420 100%)",
        "gradient-teal": "linear-gradient(135deg, #0E5C4A 0%, #0A3F33 100%)",
        "gradient-ivory": "linear-gradient(180deg, #FBFAF5 0%, #F7F5EF 100%)",
      },
      boxShadow: {
        soft: "0 4px 20px -8px rgba(16, 38, 34, 0.10)",
        card: "0 10px 30px -12px rgba(16, 38, 34, 0.14)",
        lift: "0 24px 50px -18px rgba(16, 38, 34, 0.22)",
        cta: "0 16px 32px -12px rgba(14, 92, 74, 0.45), 0 2px 6px -1px rgba(14, 92, 74, 0.20)",
        gold: "0 14px 30px -10px rgba(184, 134, 47, 0.40)",
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
        "fade-up": "ap-fade-up 0.5s ease-out both",
        "float": "ap-float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
