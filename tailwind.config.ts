import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        poke: {
          red: "#EE1515",
          darkred: "#CC0000",
          blue: "#3B4CCA",
          gold: "#FFDE00",
          golddark: "#B3A125",
          dark: "#1A1A1A",
          cardbg: "#242424",
        },
      },
    },
  },
  plugins: [],
};

export default config;