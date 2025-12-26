import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(210 30% 8%)",
        surface: "hsl(218 28% 18%)",
        accent: "hsl(43 90% 55%)",
        accentMuted: "hsl(43 50% 30%)"
      },
      animation: {
        "pulse-slow": "pulse 6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
