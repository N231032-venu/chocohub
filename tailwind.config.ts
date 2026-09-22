import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFFEFA",
          100: "#FFFBF5",
          200: "#FDF0E6",
          300: "#F7DECC",
          400: "#E8C1A8",
        },
        cocoa: {
          DEFAULT: "#3D2218",
          dark: "#2B1A12",
          deep: "#1E120D",
          light: "#5A382A",
          muted: "#7A5C50",
        },
        truffle: {
          DEFAULT: "#8B6A5C",
          light: "#A88879",
          dark: "#6F5245",
          sand: "#EBDCCE",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F3E5AB",
          dark: "#AA8C2C",
        },
        card: {
          DEFAULT: "#FDF0E6",
          soft: "#FFF7EE",
          dark: "#2A1810",
        },
        cta: {
          DEFAULT: "#2B1A12",
          hover: "#43281C",
          accent: "#D97736",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        '24': '24px',
        '28': '28px',
        '32': '32px',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(61, 34, 24, 0.06)',
        'soft-lg': '0 14px 40px rgba(61, 34, 24, 0.10)',
        'soft-xl': '0 20px 50px rgba(61, 34, 24, 0.14)',
        'glow': '0 0 25px rgba(212, 175, 55, 0.25)',
      },
      backgroundImage: {
        'grain': "radial-gradient(rgba(61, 34, 24, 0.03) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
export default config;
