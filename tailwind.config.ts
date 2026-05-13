import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#edf5ff",
          100: "#d6e8ff",
          500: "#2c7df7",
          600: "#1967e6",
          700: "#0f4fb8",
          900: "#0a2540"
        }
      },
      borderRadius: {
        xl2: "1rem"
      },
      boxShadow: {
        soft: "0 8px 24px rgba(10,37,64,0.08)"
      }
    }
  },
  plugins: []
};

export default config;

