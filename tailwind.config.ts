import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sijenggung Village Official Colors - Pastel Theme
        "powder-blush": "#ffadad",
        "apricot-cream": "#ffd6a5",
        "cream": "#fdffb6",
        "tea-green": "#caffbf",
        "electric-aqua": "#9bf6ff",
        "baby-blue-ice": "#a0c4ff",
        "periwinkle": "#bdb2ff",
        "mauve": "#ffc6ff",
        "porcelain": "#fffffc",
        
        primary: {
          DEFAULT: "#A0C4FF", // Baby Blue Ice
          50: "#F5F9FF",
          100: "#E6F0FF",
          200: "#CCE0FF",
          300: "#B3D1FF",
          400: "#A0C4FF", // Base Color
          500: "#80ABFF",
          600: "#6092FF",
          700: "#4079FF",
          800: "#205FFF",
          900: "#0046E6",
          950: "#0030B3",
        },
        secondary: {
          DEFAULT: "#CAFFBF", // Tea Green
          50: "#F9FFF7",
          100: "#F0FFEB",
          200: "#E0FFD6",
          300: "#D6FFC9",
          400: "#CAFFBF", // Base Color
          500: "#A8F598",
          600: "#86EB71",
          700: "#64E04A",
          800: "#42D623",
          900: "#2B9E15",
          950: "#1A660D",
        },
        tertiary: {
          DEFAULT: "#BDB2FF", // Periwinkle
          50: "#F7F5FF",
          100: "#EBE6FF",
          200: "#DCD4FF",
          300: "#CDC2FF",
          400: "#BDB2FF", // Base Color
          500: "#9F8FFF",
          600: "#816BFF",
          700: "#6347FF",
          800: "#4524FF",
          900: "#2700FF",
          950: "#1A00AB",
        },
        accent: {
          DEFAULT: "#FFADAD", // Powder Blush
          50: "#FFF5F5",
          100: "#FFE6E6",
          200: "#FFD1D1",
          300: "#FFBCBC",
          400: "#FFADAD", // Base Color
          500: "#FF8585",
          600: "#FF5C5C",
          700: "#FF3333",
          800: "#D60000",
          900: "#AD0000",
          950: "#850000",
        },
        background: "#FFFFFC", // Porcelain
        surface: "#FFFFFF", // White
        "text-dark": "#1F2933", // Charcoal (Keep for readability)
        "text-light": "#1F2933", // Dark text on light pastel backgrounds!
        "text-light-hover": "#000000",
        success: "#CAFFBF", // Tea Green (Mapped)
        warning: "#FFD6A5", // Apricot Cream (Mapped)
        danger: "#FFADAD", // Powder Blush (Mapped)
        info: "#9BF6FF", // Electric Aqua (Mapped)
        // Additional village theme colors
        "village-green": {
          DEFAULT: "#CAFFBF", // Tea Green
          dark: "#006064",
          darker: "#00363A",
        },
        "village-blue": "#A0C4FF", // Baby Blue Ice
        // Override default colors for consistency
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        foreground: "var(--foreground)",
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        progress: {
          "0%": { transform: " translateX(0) scaleX(0)" },
          "40%": { transform: "translateX(0) scaleX(0.4)" },
          "100%": { transform: "translateX(100%) scaleX(0.5)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        wiggle: "wiggle 1s ease-in-out infinite",
        progress: "progress 2s infinite linear",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
