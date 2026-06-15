import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        neo: {
          black: "#000000",
          white: "#ffffff",
          yellow: "#ffe500",
          blue: "#0066ff",
          pink: "#ff3366",
          green: "#00cc66",
          orange: "#ff6600",
          purple: "#9933ff",
          cyan: "#00cccc",
        },
      },
      borderRadius: {
        lg: "0px",
        md: "0px",
        sm: "0px",
        none: "0px",
      },
      borderWidth: {
        3: "3px",
        4: "4px",
        5: "5px",
        6: "6px",
      },
      boxShadow: {
        neo: "4px 4px 0px 0px #000000",
        "neo-sm": "2px 2px 0px 0px #000000",
        "neo-lg": "6px 6px 0px 0px #000000",
        "neo-xl": "8px 8px 0px 0px #000000",
        "neo-hover": "6px 6px 0px 0px #000000",
        "neo-active": "2px 2px 0px 0px #000000",
        "neo-yellow": "4px 4px 0px 0px #ffe500",
        "neo-blue": "4px 4px 0px 0px #0066ff",
        "neo-pink": "4px 4px 0px 0px #ff3366",
        "neo-green": "4px 4px 0px 0px #00cc66",
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
        "neo-pulse": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(2px, 2px)" },
        },
        "neo-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "neo-pulse": "neo-pulse 0.3s ease-in-out",
        "neo-bounce": "neo-bounce 0.4s ease-in-out",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        body: ["Space Grotesk", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
