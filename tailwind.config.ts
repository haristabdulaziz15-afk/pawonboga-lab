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
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#fdf8f3",
          100: "#f5e6d8",
          200: "#e8cdb0",
          300: "#d4a574",
          400: "#c08a5a",
          500: "#9a6b45",
          600: "#7a5234",
          700: "#5c3d28",
          800: "#3e2a1d",
          900: "#2a1c14",
          950: "#1a110d",
        },
      },
      boxShadow: {
        soft: "0 8px 30px rgba(26, 17, 13, 0.35)",
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
