import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: "#0F766E",
          dark: "#164E4A",
          hover: "#115E59",
        },
        saffron: "#D99A2B",
        ivory: "#FAF7F0",
        sand: "#EFE6D6",
        charcoal: "#1F2933",
        muted: "#647067",
        "border-soft": "#E5DED1",
      },
      fontFamily: {
        arabic: ["Noto Sans Arabic", "sans-serif"],
        display: ["IBM Plex Sans Arabic", "sans-serif"],
        sans: ["Inter", "sans-serif"],
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
